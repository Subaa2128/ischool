import { useCallback, useEffect, useRef, useState } from "react";
import "./PaymentHistory.scss";
import { ReactComponent as LeftArrow } from "../../assets/Icons/arrow-left-circle.svg";
import { ReactComponent as CloseIcon } from "../../assets/Icons/x.svg";
import StudentProfile from "../../Components/Profile";
import PaymentDetails from "../../Components/PaymentDetails";
import { collection, getDocs, query } from "firebase/firestore";
import { useNavigate, useParams } from "react-router-dom";
import { db } from "../../utils/firebase";
import { INewAdmission } from "../../utils/types";
import Recipt from "../../Components/Recipt";
import moment from "moment";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import numberToWords from "number-to-words";
import { usePDF } from "react-to-pdf";

const PaymentHistory = () => {
  const navigate = useNavigate();
  const [openHistory, setOpenHistory] = useState(true);
  const [data, setData] = useState<INewAdmission>();
  const [openRecipt, setOpenRecipt] = useState(false);
  const [selectedFees, setSelectedFees] = useState<number[]>();
  const [totalFees, setTotalFees] = useState<number>();
  const [receiptNumber, setReceiptNumber] = useState<number>();
  const [selectedName, setSelectedName] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const divToPrintRef = useRef(null);
  const { toPDF, targetRef } = usePDF({ filename: "page.pdf" });
  const { id } = useParams();

  const getData = useCallback(async () => {
    const q = query(collection(db, "NewAdmission"));
    const querySnapshot = await getDocs(q);
    const fetchedData = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...(doc.data() as Omit<INewAdmission, "id">),
    }));
    const filteredData = fetchedData.find((f) => f.id === id);
    console.log(filteredData);
    setData(filteredData);
  }, []);

  useEffect(() => {
    getData();
  }, [getData]);

  const downloadDocument = async () => {
    const input = divToPrintRef.current;

    if (!input) return;

    await html2canvas(input).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF();
      pdf.addImage(imgData, "JPEG", 10, 10, 190, 270);
      pdf.save("download.pdf");
    });
    setLoading(false);
  };

  const handleDownload = async () => {
    setTimeout(() => {
      toPDF();
    }, 3000);
  };

  return (
    <div className="payment-history-container">
      <div className="mx">
        <div className="payment-history-wrapper">
          <LeftArrow
            onClick={() => navigate(-1)}
            style={{ cursor: "pointer" }}
          />
          {openRecipt ? (
            <Recipt
              id={id}
              selectedFees={selectedFees as number[]}
              totalFees={totalFees}
              receiptNumber={receiptNumber}
            />
          ) : (
            <div className="details">
              <StudentProfile id={id} />
              {openHistory ? (
                <PaymentDetails
                  setOpenRecipt={setOpenRecipt}
                  setOpenHistory={setOpenHistory}
                  setSelectedFees={setSelectedFees}
                  setTotalFees={setTotalFees}
                  setReceiptNumber={setReceiptNumber}
                  id={id}
                />
              ) : (
                <div className="history">
                  <div className="title">
                    <h3>Payment History</h3>
                    <CloseIcon
                      style={{ cursor: "pointer" }}
                      onClick={() => setOpenHistory(true)}
                    />
                  </div>
                  <table>
                    <thead>
                      <tr>
                        <th>SESSION</th>
                        <th>PAID DATE</th>
                        <th>AMOUNT</th>
                        <th>RECIEPT</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data?.feeDetails.map(
                        (f, i) =>
                          f.state && (
                            <tr key={i}>
                              <td style={{ textTransform: "capitalize" }}>
                                {f.name}
                              </td>
                              <td>
                                {moment(f.updatedDate).format("MMM DD,S YYYY")}
                              </td>
                              <td>{Number(f.amount).toLocaleString()}</td>
                              <LoadingState
                                handleDownload={handleDownload}
                                loading={loading}
                                name={f.name}
                                setLoading={setLoading}
                                setSelectedName={setSelectedName}
                              />
                            </tr>
                          )
                      )}
                    </tbody>
                  </table>
                  {/* <div
                    className=""
                    style={{
                      background: "red",
                      position: "relative",
                      zIndex: 10,
                    }}
                  >
                    <div
                      className="recipt-content"
                      style={{ position: "absolute" }}
                      ref={targetRef}
                    >
                      <h3>Indian Matriculation Hr. Sec. School</h3>
                      <p>
                        No. 58, 18th Cross Street Kaikalan Chavadi, Tambaram
                        Sanatorium,
                      </p>
                      <p> Chennai - 600 047.</p>
                      <div className="fee-recipt">
                        <h2>Fee Receipt</h2>
                      </div>
                      <div className="border"></div>
                      <div className="recipt-details">
                        <div className="recipt-detail">
                          <p>Receipt No</p>
                          <h3>{receiptNumber}</h3>
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
                      {data?.feeDetails
                        .filter(
                          (s) =>
                            s.name.toLowerCase() === selectedName.toLowerCase()
                        )
                        .map((f, i) => (
                          <>
                            <div className="admision-details" key={i}>
                              <div className="detail">
                                <p>{f.name}</p>
                                <h3>{Number(f.amount)}.00</h3>
                              </div>

                              <div className="border"></div>
                              <div className="admission-setails">
                                <div className="detail">
                                  <p>Total</p>
                                  <h3>{f.amount?.toLocaleString()}.00</h3>
                                </div>
                              </div>
                              <div className="border"></div>
                            </div>
                            <p>
                              In words{" "}
                              <span>
                                {numberToWords.toWords(Number(f.amount))}
                              </span>{" "}
                              only.
                            </p>
                          </>
                        ))}

                      <div className="signature">
                        <p>Signature of cashier</p>
                      </div>
                    </div>
                  </div> */}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PaymentHistory;

interface ILoading {
  loading: boolean;
  name: string;
  handleDownload: () => Promise<void>;
  setSelectedName: React.Dispatch<React.SetStateAction<string>>;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

const LoadingState: React.FC<ILoading> = ({
  name,
  loading,
  handleDownload,
  setSelectedName,
  setLoading,
}) => {
  return loading ? (
    <td
      style={{
        textDecoration: "underline",
        cursor: "pointer",
        color: "#ddd",
      }}
    >
      ...DOWNLOAD
    </td>
  ) : (
    <td
      style={{
        textDecoration: "underline",
        cursor: "pointer",
      }}
      onClick={() => [
        setLoading(true),
        setSelectedName(name),
        handleDownload(),
      ]}
    >
      DOWNLOAD
    </td>
  );
};
