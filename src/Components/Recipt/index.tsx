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

interface IRecipt {
  id?: string;
}
const Recipt: React.FC<IRecipt> = ({ id }) => {
  const divToPrintRef = useRef(null);

  const [data, setData] = useState<INewAdmission>();

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
                <h3>21456</h3>
              </div>
              <div className="recipt-detail">
                <p>Admission No</p>
                <h3>{data?.admission.admissionNo}</h3>
              </div>
              <div className="recipt-detail">
                <p>Date</p>
                <h3>{data?.admission.DateOfAdmission}</h3>
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
              <div className="detail">
                <p>Admission fee</p>
                <h3>5000.00</h3>
              </div>
              <div className="detail">
                <p>School fee</p>
                <h3>0.00</h3>
              </div>
              <div className="detail">
                <p>Term1 fee</p>
                <h3>6800.00</h3>
              </div>
              <div className="border"></div>
              <div className="detail">
                <p>Total</p>
                <h3>11800.00</h3>
              </div>
              <div className="border"></div>
            </div>

            <p>
              In words <span>Eleven Thousand and Eight Hundred </span> only.
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
