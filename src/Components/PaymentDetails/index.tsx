import React, { useCallback, useEffect, useState } from "react";
import "./PaymentDetails.scss";
import Button from "../Button";
import { useNavigate } from "react-router-dom";
import { INewAdmission } from "../../utils/types";
import {
  addDoc,
  collection,
  doc,
  getDocs,
  query,
  updateDoc,
} from "firebase/firestore";
import { db } from "../../utils/firebase";
import moment from "moment";

interface IPaymentDetails {
  setOpenRecipt: React.Dispatch<React.SetStateAction<boolean>>;
  setOpenHistory: React.Dispatch<React.SetStateAction<boolean>>;
  setSelectedFees: React.Dispatch<React.SetStateAction<number[] | undefined>>;
  setTotalFees: React.Dispatch<React.SetStateAction<number | undefined>>;
  setReceiptNumber: React.Dispatch<React.SetStateAction<string | undefined>>;
  setFeeName: React.Dispatch<React.SetStateAction<string>>;
  setFeeAmount: React.Dispatch<React.SetStateAction<string>>;
  setFeeValue: React.Dispatch<React.SetStateAction<boolean>>;
  feeName?: string;
  feeAmount?: string;
  feeValue?: boolean;
  id?: string;
}
const PaymentDetails: React.FC<IPaymentDetails> = ({
  id,
  feeAmount,
  feeName,
  feeValue,
  setFeeAmount,
  setFeeName,
  setFeeValue,
  setOpenRecipt,
  setOpenHistory,
  setSelectedFees,
  setTotalFees,
  setReceiptNumber,
}) => {
  const navigate = useNavigate();
  const [data, setData] = useState<INewAdmission>();
  const [totalFee, setTotalFee] = useState<number>();
  const [admissionfeeState, setAdmissionFeeState] = useState<any[]>([]);
  const [rteStudent, setRteStudent] = useState(false);
  const calculateFee = (array: number[]) => {
    if (array.length === 0) {
      setTotalFee(0);
      return;
    }
    let tempFee = 0;
    console.log(array);

    const number = array.forEach((f) => {
      console.log("Loop", f);
      tempFee += Number(data?.feeDetails[f].amount);
    });

    setTotalFee(tempFee);
    setSelectedFees(array);
    setTotalFees(tempFee);
  };

  const updateRte = async (status: boolean) => {
    try {
      if (!id) return;
      console.log(status);
      const userDocRef = doc(db, "NewAdmission", id);
      await updateDoc(userDocRef, {
        rteStudent: status,
      });
    } catch (error) {
      console.log(error);
    }
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
  }, []);

  useEffect(() => {
    getData();
  }, [getData]);

  const handleSubmit = async () => {
    try {
      if (!id) return;
      const userDocRef = doc(db, "NewAdmission", id);
      const min = 10000;
      const max = 99999;
      let feeDetails: any[] = [];

      const q = query(collection(db, "School"));
      const querySnapshot = await getDocs(q);
      const fetchedData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as Omit<{ totalReceipts: number }, "id">),
      }));
      console.log(fetchedData);
      const rn = fetchedData[0].totalReceipts;
      console.log(rn);
      const receiptNumber = `IS${rn.toString().padStart(5, "0")}`;
      console.log(receiptNumber);
      const receiptDocRef = doc(db, "School", "VpSnwEY57ynwkVPEuQaA");
      await updateDoc(receiptDocRef, {
        totalReceipts: rn + 1,
      });
      data?.feeDetails.map((it, i) => {
        if (admissionfeeState.includes(i)) {
          feeDetails.push({
            ...data?.feeDetails[i],
            state: true,
            updatedDate: Date.now(),
            reciptNo: receiptNumber,
          });
        } else {
          feeDetails.push({
            ...data?.feeDetails[i],
          });
        }
      });
      if (feeName && feeAmount) {
        feeDetails.push({
          name: `customfee_${feeName}`,
          amount: feeAmount,
          state: feeValue,
          updatedDate: Date.now(),
          reciptNo: receiptNumber,
        });
      }
      console.log(feeDetails);

      await updateDoc(userDocRef, {
        feeDetails: feeDetails,
      });
      setReceiptNumber(receiptNumber);
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="payment-details-container">
      <div className="history">
        <div className="">
          <div className="title">
            <h3>Fee Details</h3>
            <h2
              style={{ textDecoration: "underline", cursor: "pointer" }}
              onClick={() => setOpenHistory(false)}
            >
              View Payment History
            </h2>
          </div>
          <div className="rte">
            <h5>RTE Student</h5>
            <label className="switch">
              <input
                type="checkbox"
                checked={data?.rteStudent ? data.rteStudent : rteStudent}
                onChange={(e) => [
                  setRteStudent(e.target.checked),
                  updateRte(e.target.checked),
                ]}
              />
              <span className="slider round"></span>
            </label>
          </div>
          <table>
            <thead>
              <tr>
                <th>SESSION</th>
                <th>DUE DATE</th>
                <th>AMOUNT</th>
                <th>SELECT</th>
              </tr>
            </thead>
            <tbody className="table-body">
              {data?.feeDetails.map((f, i) => (
                <tr className="admission-fee" key={i}>
                  <td
                    className="row"
                    style={{ textTransform: "capitalize", fontWeight: 900 }}
                  >
                    {f.name}
                  </td>
                  <td
                    className="row"
                    style={{ textTransform: "capitalize", fontWeight: 900 }}
                  >
                    {moment().format("MMM DD, YYYY")}
                  </td>
                  <td
                    className="row"
                    style={{ textTransform: "capitalize", fontWeight: 900 }}
                  >
                    {Number(f.amount).toLocaleString()}INR
                  </td>

                  <td
                    className="row"
                    style={{ textDecoration: "underline", cursor: "pointer" }}
                  >
                    {f.state ? (
                      <h5>paid</h5>
                    ) : (
                      <input
                        type="checkbox"
                        name=""
                        id=""
                        onChange={(e) => {
                          if (e.target.checked === true) {
                            if (!admissionfeeState.includes(i)) {
                              const d = admissionfeeState;
                              d.push(i);
                              console.log(d);
                              setAdmissionFeeState(d);
                              calculateFee(d);
                            }
                          } else {
                            if (admissionfeeState.includes(i)) {
                              const d = admissionfeeState.filter(
                                (it) => it !== i
                              );
                              console.log(d);
                              setAdmissionFeeState(d);
                              calculateFee(d);
                            }
                          }
                        }}
                      />
                    )}
                  </td>
                </tr>
              ))}
              <tr className="admission-fee">
                <td className="row" style={{ fontWeight: 900 }}>
                  CustomFee
                </td>
                <td className="row">
                  <input
                    type="text"
                    placeholder="Enter fee name"
                    name=""
                    id=""
                    onChange={(e) => setFeeName(e.target.value)}
                  />
                </td>
                <td className="row">
                  <input
                    type="number"
                    placeholder="Enter amount"
                    name=""
                    id=""
                    onChange={(e) => setFeeAmount(e.target.value)}
                  />
                </td>
                <td className="row">
                  <input
                    type="checkbox"
                    name=""
                    id=""
                    onChange={(e) => setFeeValue(e.target.checked)}
                  />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="footer">
          <div className="total">
            <p>TotalAmount:</p>
            <h3>
              {feeValue && feeAmount && totalFee
                ? Number(totalFee) + Number(feeAmount)
                : feeValue && feeAmount && !totalFee
                ? feeAmount
                : totalFee
                ? totalFee
                : 0}{" "}
              INR
            </h3>
          </div>
          <div className="button">
            <Button variant="secondary" onClick={() => navigate(-1)}>
              cancel
            </Button>
            <Button
              disabled={
                admissionfeeState.length === 0 &&
                feeAmount === "" &&
                feeName === ""
              }
              variant="primary"
              onClick={() => [setOpenRecipt(true), handleSubmit()]}
            >
              Submit
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentDetails;
