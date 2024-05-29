import { useCallback, useEffect, useState } from "react";
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
import numberToWords from "number-to-words";

import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  pdf,
} from "@react-pdf/renderer";

const PaymentHistory = () => {
  const navigate = useNavigate();
  const [openHistory, setOpenHistory] = useState(true);
  const [data, setData] = useState<INewAdmission>();
  const [openRecipt, setOpenRecipt] = useState(false);
  const [selectedFees, setSelectedFees] = useState<number[]>();
  const [totalFees, setTotalFees] = useState<number>();
  const [receiptNumber, setReceiptNumber] = useState<string>();
  const [feeName, setFeeName] = useState("");
  const [feeAmount, setFeeAmount] = useState("");
  const [feeValue, setFeeValue] = useState(false);
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
  }, [id]);

  useEffect(() => {
    getData();
  }, [getData]);

  const generatePdf = async (name: string) => {
    console.log(name);
    const feeDetail = data?.feeDetails.find(
      (item) => item.name.toLowerCase() === name.toLowerCase()
    );
    console.log(feeDetail);

    const number = numberToWords.toWords(Number(feeDetail?.amount));
    console.log(number);

    const pdfBlob = await pdf(
      <Document>
        <Page style={styles.page} size="A4">
          <View style={styles.reciptContent}>
            <View style={styles.heading}>
              <Text>Indian Matriculation Hr. Sec. School</Text>
            </View>

            <View style={styles.heading}>
              <Text style={styles.text}>
                No. 58, 18th Cross Street Kaikalan Chavadi,
              </Text>
            </View>
            <View style={styles.heading}>
              <Text style={styles.text}>
                Tambaram Sanatorium, Chennai - 600 047.
              </Text>
            </View>

            <View
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "flex-start",
                paddingTop: "30px",
              }}
            >
              <View>
                <View style={styles.reciptDetails}>
                  <View style={styles.reciptDetail}>
                    <Text style={styles.text}>Receipt No :</Text>
                    <Text style={styles.heading}>{feeDetail?.reciptNo}</Text>
                  </View>
                  <View style={styles.reciptDetail}>
                    <Text style={styles.text}>Admission No :</Text>
                    <Text style={styles.heading}>
                      {data?.admission.admissionNo}
                    </Text>
                  </View>
                </View>
                <View style={styles.reciptDetails}>
                  <View style={styles.reciptDetail}>
                    <Text style={styles.text}>Name :</Text>
                    <Text style={[styles.heading, { textAlign: "left" }]}>
                      {data?.student.nameInEnglish}
                    </Text>
                  </View>
                  <View style={styles.reciptDetail}>
                    <Text style={styles.text}>Grade :</Text>
                    <Text style={styles.heading}>{data?.admission.grade}</Text>
                  </View>
                  <View style={styles.reciptDetail}>
                    <Text style={styles.text}>Academic year :</Text>
                    <Text style={styles.heading}>
                      {data?.admission.academicYear}
                    </Text>
                  </View>
                </View>
              </View>
              <View style={styles.feeRecipt}>
                <Text style={styles.heading2}>Fee Receipt</Text>
                <Text style={styles.heading2}>
                  {moment().format("MM-DD-YYYY")}
                </Text>
              </View>
            </View>

            {/* <View style={styles.border}></View> */}
            <View>
              <View style={styles.detail}>
                <Text style={styles.text}>{feeDetail?.name} :</Text>
                <Text style={styles.heading}>{feeDetail?.amount}.00</Text>
              </View>
              {/* <View style={styles.border}></View> */}
              <View style={{ paddingTop: "10px" }}>
                <View style={styles.detail}>
                  <Text style={styles.text}>Total :</Text>
                  <Text style={styles.heading}>{feeDetail?.amount}.00</Text>
                </View>
              </View>
              {/* <View style={styles.border}></View> */}
            </View>
            <View style={[styles.heading, { paddingTop: "20px" }]}>
              <Text style={styles.text}>In words {number} only.</Text>
            </View>
            <View style={styles.signature}>
              <Text style={styles.text}>Signature of cashier</Text>
            </View>
          </View>
        </Page>
      </Document>
    ).toBlob();
    window.open(URL.createObjectURL(pdfBlob));
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
              feeName={feeName}
              feeAmount={feeAmount}
              feeValue={feeValue}
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
                  setFeeAmount={setFeeAmount}
                  setFeeName={setFeeName}
                  setFeeValue={setFeeValue}
                  feeName={feeName}
                  feeAmount={feeAmount}
                  feeValue={feeValue}
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
                                {moment(f.updatedDate).format("MMM DD, YYYY")}
                              </td>
                              <td>{Number(f.amount).toLocaleString()}</td>

                              <td
                                style={{
                                  cursor: "pointer",
                                }}
                                onClick={() => [generatePdf(f.name)]}
                              >
                                DOWNLOAD
                              </td>
                            </tr>
                          )
                      )}
                    </tbody>
                  </table>
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

const styles = StyleSheet.create({
  page: {
    padding: "10px 50px",
    display: "flex",
    alignItems: "stretch",
    justifyContent: "flex-start",
    flexDirection: "column",
    gap: "32px",

    // marginTop: "-70px",
  },
  heading: {
    color: "#252525",
    fontSize: "13px",
    textAlign: "center",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    color: "#252525",
    textAlign: "center",
    fontSize: "14px",
    textTransform: "capitalize",
    paddingBottom: "3px",
  },
  border: {
    margin: "24px 0",
    borderTop: "1px solid #c7dce6",
  },
  reciptDetail: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    marginTop: "10px",
    gap: "10px",
  },
  reciptDetails: {
    display: "flex",
    flexDirection: "column",
  },

  reciptContent: {
    border: "5px solid black",
    padding: "40px",
    textAlign: "center",
    height: "60vh",
    // width: "6in",
    // height: "6in",
  },

  feeRecipt: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  heading2: {
    fontSize: "14px",
    // border: "1px solid #c7dce6",
    // padding: "8px 24px",
    // marginTop: "24px",
  },
  detail: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    gap: "10px",
    paddingTop: "10px",
  },
  signature: {
    marginTop: "50px",
    display: "flex",
    alignItems: "flex-end",
    justifyContent: "center",
  },
});
