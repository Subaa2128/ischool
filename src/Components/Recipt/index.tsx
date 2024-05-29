import React, { useCallback, useEffect, useRef, useState } from "react";
import "./Receipt.scss";
import Button from "../Button";
import { ReactComponent as Download } from "../../assets/Icons/download.svg";
import { ReactComponent as Print } from "../../assets/Icons/printer.svg";
import { INewAdmission } from "../../utils/types";
import { collection, getDocs, query } from "firebase/firestore";
import { db } from "../../utils/firebase";
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

interface IRecipt {
  id?: string;
  selectedFees: number[];
  receiptNumber: string | undefined;
  totalFees: number | undefined;
  feeName?: string;
  feeAmount?: string;
  feeValue?: boolean;
}
const Recipt: React.FC<IRecipt> = ({
  id,
  selectedFees,
  receiptNumber,
  totalFees,
  feeAmount,
  feeName,
  feeValue,
}) => {
  const divToPrintRef = useRef(null);
  const [data, setData] = useState<INewAdmission>();
  const [words, setWords] = useState<string>();

  const getData = useCallback(async () => {
    const q = query(collection(db, "NewAdmission"));
    const querySnapshot = await getDocs(q);
    const fetchedData = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...(doc.data() as Omit<INewAdmission, "id">),
    }));
    const filteredData = fetchedData.find((f) => f.id === id);
    setData(filteredData);

    setWords(
      numberToWords.toWords(Number(selectedFees ? totalFees : feeAmount))
    );
  }, [id, selectedFees, feeAmount, totalFees]);

  useEffect(() => {
    getData();
  }, [getData]);

  // const downloadDocument = () => {
  //   const input = divToPrintRef.current;

  //   if (!input) return;

  //   html2canvas(input).then((canvas) => {
  //     const imgData = canvas.toDataURL("image/png");
  //     const pdf = new jsPDF();
  //     pdf.addImage(imgData, "JPEG", 10, 10, 190, 270);
  //     pdf.save("download.pdf");
  //   });

  // };
  // const printDocument = () => {
  //   try {
  //     window.print();
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };
  const downloadDocument = async () => {
    const pdfBlob = await pdf(
      <Document>
        <Page style={styles.page} size="A4">
          <View style={styles.reciptContent}>
            <View style={styles.heading}>
              <Text>Indian Matriculation Hr. Sec. School</Text>
            </View>

            <View style={styles.heading}>
              <Text style={styles.text}>
                No. 58, 18th Cross Street Kaikalan Chavadi, Tambaram Sanatorium,
              </Text>
            </View>
            <View style={styles.heading}>
              <Text style={styles.text}> Chennai - 600 047.</Text>
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
                    <Text style={styles.heading}>{receiptNumber}</Text>
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
              {selectedFees &&
                data?.feeDetails.map(
                  (f, i) =>
                    selectedFees.includes(i) && (
                      <View style={styles.detail}>
                        <Text style={styles.text}>{f?.name} :</Text>
                        <Text style={styles.heading}>{f?.amount}.00</Text>
                      </View>
                    )
                )}

              {feeValue && (
                <View style={styles.detail}>
                  <Text style={styles.text}>{feeName} :</Text>
                  <Text style={styles.heading}>{feeAmount}.00</Text>
                </View>
              )}
              {/* <View style={styles.border}></View> */}
              <View style={{ paddingTop: "30px" }}>
                <View style={styles.detail}>
                  <Text style={styles.text}>Total :</Text>
                  <Text style={styles.heading}>
                    {selectedFees && feeAmount
                      ? Number(totalFees) + Number(feeAmount)
                      : null}
                    {selectedFees && !feeAmount ? totalFees : null}
                    {feeAmount && !selectedFees ? feeAmount : null}
                    .00
                  </Text>
                </View>
              </View>
              {/* <View style={styles.border}></View> */}
            </View>
            <View style={[styles.heading, { paddingTop: "20px" }]}>
              <Text style={styles.text}>In words {words} only.</Text>
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
  console.log(selectedFees);

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
            <div
              className=""
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                gap: "50px",
                marginTop: "50px",
              }}
            >
              <div className="recipt-details">
                <div className="recipt-detail">
                  <p>Receipt No :</p>
                  <h3>{receiptNumber}</h3>
                </div>
                <div className="recipt-detail">
                  <p>Admission No :</p>
                  <h3>{data?.admission.admissionNo}</h3>
                </div>

                <div className="recipt-detail">
                  <p>Name :</p>
                  <h3 style={{ textTransform: "capitalize" }}>
                    {data?.student.nameInEnglish}
                  </h3>
                </div>
                <div className="recipt-detail">
                  <p>Grade :</p>
                  <h3>{data?.admission.grade}</h3>
                </div>
                <div className="recipt-detail">
                  <p>Academic year :</p>
                  <h3>{data?.admission.academicYear}</h3>
                </div>
              </div>
              <div className="fee-recipt">
                <h2>Fees Receipt</h2>
                <h2> {moment().format("MM-DD-YYYY")}</h2>
              </div>
            </div>
            {/* <div className="border"></div> */}
            <div className="admision-details">
              {selectedFees &&
                data?.feeDetails.map(
                  (f, i) =>
                    selectedFees.includes(i) && (
                      <div className="detail" key={i}>
                        <p style={{ textTransform: "capitalize" }}>
                          {f.name} :
                        </p>
                        <h3>{Number(f.amount).toLocaleString()}.00</h3>
                      </div>
                    )
                )}
              {feeValue && (
                <div className="detail">
                  <p style={{ textTransform: "capitalize" }}>{feeName} :</p>
                  <h3>{Number(feeAmount).toLocaleString()}.00</h3>
                </div>
              )}
              {/* <div className="border" style={{ marginTop: "24px" }}></div> */}
              <div className="admission-details">
                <div className="detail" style={{ paddingTop: "30px" }}>
                  <p>Total :</p>
                  <h3>
                    {selectedFees && feeAmount
                      ? Number(totalFees) + Number(feeAmount)
                      : null}
                    {selectedFees && !feeAmount ? totalFees : null}
                    {feeAmount && !selectedFees ? feeAmount : null}
                    .00
                  </h3>
                </div>
              </div>
              <div className="border"></div>
            </div>

            <p>
              In words <span style={{ fontWeight: 900 }}>{words} </span> only.
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
              style={{
                background: "none",
                color: "#455a64",
                border: "1px solid  #455a64",
              }}
            >
              Download Recipt
            </Button>

            <Button
              variant="primary"
              leftIcon={<Print />}
              onClick={() => downloadDocument()}
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

const styles = StyleSheet.create({
  page: {
    padding: "10px 50px",
    display: "flex",
    alignItems: "stretch",
    justifyContent: "center",
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
    border: "1px solid #c7dce6",
    padding: "40px",
    textAlign: "center",
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
    marginTop: "150px",
    display: "flex",
    alignItems: "flex-end",
    justifyContent: "center",
  },
});
