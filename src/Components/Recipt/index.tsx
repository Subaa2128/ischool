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
import { PDFDownloadLink } from "@react-pdf/renderer";
import Pdf from "../../Pages/Pdf";

interface IRecipt {
  id?: string;
}
const Recipt: React.FC<IRecipt> = ({ id }) => {
  const divToPrintRef = useRef(null);
  const [totalFee, setTotalFee] = useState<number>();
  const [data, setData] = useState<INewAdmission>();
  const [words, setWords] = useState<string>();

  const calculateFee = (data: any) => {
    // if (data?.feeDetails?.length) {
    //   setTotalFee(0);
    //   return;
    // }

    console.log(data);
    let tempFee = 0;
    console.log(data?.feeDetails);
    const number = data?.feeDetails.forEach((f: { amount: any }) => {
      console.log("sjkjs", f);
      tempFee += Number(f.amount);
    });
    console.log(tempFee);
    return tempFee;
  };

  const getData = useCallback(async () => {
    const q = query(collection(db, "NewAdmission"));
    const querySnapshot = await getDocs(q);
    const fetchedData = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...(doc.data() as Omit<INewAdmission, "id">),
    }));
    const filteredData = fetchedData.find((f) => f.id === id);
    setData(filteredData);

    const tFee = calculateFee(filteredData);
    setTotalFee(tFee);
    setWords(numberToWords.toWords(Number(tFee)));
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
                <h3>{data?.feeDetails[0].reciptNo}</h3>
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
              {data?.feeDetails.map(
                (f) =>
                  f.state &&
                  f.updatedDate >= Date.now() - 10 && (
                    <div className="detail">
                      <p>{f.name}</p>
                      <h3>{f.amount}.00</h3>
                    </div>
                  )
              )}

              <div className="border"></div>
              <div className="admission-setails">
                <div className="detail">
                  <p>Total</p>
                  <h3>{totalFee}.00</h3>
                </div>
              </div>
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
            {/* {data && (
              <PDFDownloadLink
                document={
                  <Pdf
                    admissionNo={data?.admission.admissionNo as string}
                    nameInEnglish={data?.student.nameInEnglish as string}
                    grade={data?.admission.grade as string}
                    academicYear={data?.admission.academicYear as string}
                    feeDetails={data?.feeDetails as any}
                    totalFee={totalFee?.toString() as string}
                    words={words as string}
                  />
                }
                fileName="recipt"
              >
                {({ blob, url, loading, error }) =>
                  loading ? (
                    <Button
                      variant="primary"
                      // onClick={() => downloadDocument()}
                      leftIcon={<Download />}
                    >
                      ....Download Recipt
                    </Button>
                  ) : (
                    <Button
                      variant="primary"
                      // onClick={() => downloadDocument()}
                      leftIcon={<Download />}
                    >
                      Download Recipt
                    </Button>
                  )
                }
              </PDFDownloadLink>
            )} */}

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
