import React, { useState } from "react";
import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  PDFViewer,
  Font,
  PDFDownloadLink,
} from "@react-pdf/renderer";
import moment from "moment";

interface IPdf {
  admissionNo: string;
  nameInEnglish: string;
  grade: string;
  academicYear: string;
  feeDetails: [
    {
      reciptNo: string;
      name: string;
      updatedDate: Date;
      amount: string;
      state: boolean;
    }
  ];
  totalFee: string;
  words: string;
}

const Pdf: React.FC<IPdf> = ({
  academicYear,
  admissionNo,
  feeDetails,
  grade,
  nameInEnglish,
  totalFee,
  words,
}) => {
  console.log(
    academicYear,
    admissionNo,
    feeDetails,
    grade,
    nameInEnglish,
    totalFee,
    words
  );
  return (
    <div>
      <PDFViewer style={styles.pdfViewer}>
        <Document>
          <Page style={styles.page}>
            <View style={styles.reciptContent}>
              <Text style={styles.heading}>
                Indian Matriculation Hr. Sec. School
              </Text>
              <Text style={styles.text}>
                No. 58, 18th Cross Street Kaikalan Chavadi, Tambaram Sanatorium,
              </Text>
              <Text> Chennai - 600 047.</Text>
              <View style={styles.feeRecipt}>
                <Text style={styles.heading2}>Fee Receipt</Text>
              </View>
              <View style={styles.border}></View>
              <View style={styles.reciptDetails}>
                <View style={styles.reciptDetail}>
                  <Text style={styles.text}>Receipt No</Text>
                  {/* <Text style={styles.heading}>{feeDetails[0].reciptNo}</Text> */}
                </View>
                <View style={styles.reciptDetail}>
                  <Text style={styles.text}>Admission No</Text>
                  <Text style={styles.heading}>{admissionNo}</Text>
                </View>

                <View style={styles.reciptDetail}>
                  <Text style={styles.text}>Date</Text>
                  <Text style={styles.heading}>
                    {moment().format("MM-DD-YYYY")}
                  </Text>
                </View>
                <View style={styles.reciptDetail}>
                  <Text style={styles.text}>Name</Text>
                  <Text style={styles.heading}>{nameInEnglish}</Text>
                </View>
                <View style={styles.reciptDetail}>
                  <Text style={styles.text}>Grade</Text>
                  <Text style={styles.heading}>{grade}</Text>
                </View>
                <View style={styles.reciptDetail}>
                  <Text style={styles.text}>Academic year</Text>
                  <Text style={styles.heading}>{academicYear}</Text>
                </View>
              </View>
              <View style={styles.border}></View>
              <View>
                {feeDetails.map(
                  (f, i) =>
                    f.state && (
                      <View key={i} style={styles.detail}>
                        <Text style={styles.text}>{f.name}</Text>
                        <Text style={styles.heading}>{f.amount}.00</Text>
                      </View>
                    )
                )}

                <View style={styles.border}></View>
                <View>
                  <View style={styles.detail}>
                    <Text style={styles.text}>Total</Text>
                    <Text style={styles.heading}>{totalFee}.00</Text>
                  </View>
                </View>
                <View style={styles.border}></View>
              </View>

              <Text style={styles.text}>
                In words <span>{words} </span> only.
              </Text>
              <View>
                <Text style={styles.text}>Signature of cashier</Text>
              </View>
            </View>
          </Page>
        </Document>
      </PDFViewer>
    </div>
  );
};

export default Pdf;

const styles = StyleSheet.create({
  pdfViewer: {
    width: 500,
    height: 500,
    border: "none",
  },
  page: {
    padding: "10px 50px",
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
    flexDirection: "column",
    gap: " 32px",
  },
  heading: {
    color: "#252525",
    fontSize: " 20px",
  },
  text: {
    color: "#252525",
    textAlign: "center",
    fontSize: " 14px",
  },
  border: {
    margin: " 24px 0",
    borderTop: " 1px solid #c7dce6",
  },
  reciptDetail: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
  },
  reciptDetails: {
    display: "flex",
    gridTemplateColumns: "1fr 1fr 1fr",
    columnGap: " 20px",
    rowGap: "16px",
  },

  reciptContent: {
    border: " 1px solid #c7dce6",
    padding: "40px",
    textAlign: "center",
  },

  feeRecipt: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  heading2: {
    border: " 1px solid #c7dce6",
    padding: "8px 24px",
    marginTop: "24px",
    width: " fit-content",
  },
  detail: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "8px",
  },
});
