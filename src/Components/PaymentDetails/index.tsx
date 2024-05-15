import React, { useCallback, useEffect, useRef, useState } from "react";
import "./PaymentDetails.scss";
import Button from "../Button";
import { useNavigate } from "react-router-dom";
import { INewAdmission } from "../../utils/types";
import { collection, doc, getDocs, query, updateDoc } from "firebase/firestore";
import { db } from "../../utils/firebase";
import moment from "moment";

interface IPaymentDetails {
  setOpenRecipt: React.Dispatch<React.SetStateAction<boolean>>;
  setOpenHistory: React.Dispatch<React.SetStateAction<boolean>>;
  id?: string;
}
const PaymentDetails: React.FC<IPaymentDetails> = ({
  id,
  setOpenRecipt,
  setOpenHistory,
}) => {
  const navigate = useNavigate();
  const [data, setData] = useState<INewAdmission>();
  const [totalFee, setTotalFee] = useState<number>();
  const [admissionfeeState, setAdmissionFeeState] = useState<any[]>([]);

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
      data?.feeDetails.map((it, i) => {
        if (admissionfeeState.includes(i)) {
          feeDetails.push({
            ...data?.feeDetails[i],
            state: true,
            updatedDate: Date.now(),
            reciptNo: Math.floor(Math.random() * (max - min + 1)) + min,
          });
        } else {
          feeDetails.push({
            ...data?.feeDetails[i],
          });
        }
      });
      console.log(feeDetails);

      await updateDoc(userDocRef, {
        feeDetails: feeDetails,
      });
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
                  <td className="row">{f.name}</td>
                  <td className="row">{moment().format("MMM DD, YYYY")}</td>
                  <td className="row">{f.amount}INR</td>

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
            </tbody>
          </table>
        </div>
        <div className="footer">
          <div className="total">
            <p>TotalAmount:</p>
            <h3>{totalFee ? totalFee : 0} INR</h3>
          </div>
          <div className="button">
            <Button variant="secondary" onClick={() => navigate(-1)}>
              cancel
            </Button>
            <Button
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
