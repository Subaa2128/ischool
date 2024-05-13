import React, { useCallback, useEffect, useRef, useState } from "react";
import "./Receipt.scss";
import Button from "../Button";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { ReactComponent as Download } from "../../assets/Icons/download.svg";
import { ReactComponent as Print } from "../../assets/Icons/printer.svg";
import { INewAdmission } from "../../utils/types";
import { collection, getDocs, query } from "firebase/firestore";
import { db } from "../../utils/firebase";
import moment from "moment";
import numberToWords from "number-to-words";

interface IRecipt {
  id?: string;
}
const Recipt: React.FC<IRecipt> = ({ id }) => {
  const divToPrintRef = useRef(null);

  const [data, setData] = useState<INewAdmission>();
  const number =
    Number(
      data?.feeDetails.admisionFee.state
        ? data?.feeDetails.admisionFee.amount
        : 0
    ) +
    Number(
      data?.feeDetails.schoolFee.state ? data?.feeDetails.schoolFee.amount : 0
    ) +
    Number(
      data?.feeDetails.customFee.state ? data?.feeDetails.customFee.amount : 0
    );
  const words = numberToWords.toWords(number);

  const getData = useCallback(async () => {
    const q = query(collection(db, "NewAdmission"));
    const querySnapshot = await getDocs(q);
    const fetchedData = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...(doc.data() as Omit<INewAdmission, "id">),
    }));
    const filteredData = fetchedData.find((f) => f.id === id);
    setData(filteredData);
  }, [id]);

  useEffect(() => {
    getData();
  }, [getData]);

  const downloadDocument = () => {
    const input = divToPrintRef.current;

    if (!input) return;

    html2canvas(input).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF();
      pdf.addImage(imgData, "JPEG", 10, 10, 190, 270);
      pdf.save("download.pdf");
    });
  };
  const printDocument = () => {
    try {
      window.print();
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="recipt-container">
      <div className="mx">
        <div className="recipt-wrapper" id="print">
          <div className="recipt-content" ref={divToPrintRef}>
            <h3>Indian Matriculation Hr. Sec. School</h3>
            <p>
              No. 58, 18th Cross Street Kaikalan Chavadi, Tambaram Sanatorium,
            </p>
            <p> Chennai - 600 047.</p>
            <div className="fee-recipt">
              <h2>Fee Receipt</h2>
            </div>
            <div className="border"></div>
            <div className="recipt-details">
              <div className="recipt-detail">
                <p>Receipt No</p>
                <h3>{data?.feeDetails.reciptNo}</h3>
              </div>
              <div className="recipt-detail">
                <p>Admission No</p>
                <h3>{data?.admission.admissionNo}</h3>
              </div>

              <div className="recipt-detail">
                <p>Date</p>
                <h3>{moment().format("MM-DD-YYYY")}</h3>
              </div>
              <div className="recipt-detail">
                <p>Name</p>
                <h3>{data?.student.nameInEnglish}</h3>
              </div>
              <div className="recipt-detail">
                <p>Grade</p>
                <h3>{data?.admission.grade}</h3>
              </div>
              <div className="recipt-detail">
                <p>Academic year</p>
                <h3>{data?.admission.academicYear}</h3>
              </div>
            </div>
            <div className="border"></div>
            <div className="admision-details">
              {data?.feeDetails.schoolFee.state && (
                <div className="detail">
                  <p>Admission fee</p>
                  <h3>{data?.feeDetails.admisionFee.amount}.00</h3>
                </div>
              )}

              {data?.feeDetails.schoolFee.state && (
                <div className="detail">
                  <p>School fee</p>
                  <h3>{data?.feeDetails.schoolFee.amount}.00</h3>
                </div>
              )}

              <div className="border"></div>
            </div>

            <p>
              In words <span>{words} </span> only.
            </p>
            <div className="signature">
              <p>Signature of cashier</p>
            </div>
          </div>
          <div className="button">
            <Button
              variant="primary"
              onClick={() => downloadDocument()}
              leftIcon={<Download />}
            >
              Download Recipt
            </Button>
            <Button
              variant="primary"
              leftIcon={<Print />}
              onClick={() => printDocument()}
            >
              Print Recipt
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Recipt;
