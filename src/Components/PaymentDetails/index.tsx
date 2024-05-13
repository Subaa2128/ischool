import React, { useCallback, useEffect, useState } from "react";
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
  const [schoolfeeState, setSchoolFeeState] = useState<any>(
    data ? data?.feeDetails.schoolFee.state : false
  );
  const [admissionfeeState, setAdmissionFeeState] = useState<any>(
    data ? data?.feeDetails.admisionFee.state : false
  );
  const [customFee, setCustomFee] = useState(
    data
      ? data.feeDetails.customFee
      : {
          name: "",
          amount: "",
          state: false,
          date: Date.now(),
        }
  );

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
      await updateDoc(userDocRef, {
        feeDetails: {
          reciptNo: Math.floor(Math.random() * (max - min + 1)) + min,
          admisionFee: {
            ...data?.feeDetails.admisionFee,
            updatedDate: Date.now(),
            state: admissionfeeState,
          },
          schoolFee: {
            ...data?.feeDetails.schoolFee,
            updatedDate: Date.now(),
            state: schoolfeeState,
          },
          customFee: {
            ...customFee,
          },
        },
      });
    } catch (error) {
      console.log(error);
    }
  };
  console.log(admissionfeeState);
  console.log(data?.feeDetails.admisionFee.state);

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
              <tr className="admission-fee">
                <td className="row">Admission fee</td>
                <td className="row">{moment().format("MMM DD, YYYY")}</td>
                <td className="row">
                  {data?.feeDetails.admisionFee.amount}INR
                </td>

                <td
                  className="row"
                  style={{ textDecoration: "underline", cursor: "pointer" }}
                >
                  <input
                    type="checkbox"
                    name=""
                    id=""
                    checked={admissionfeeState}
                    onChange={(e) => setAdmissionFeeState(e.target.checked)}
                  />
                </td>
              </tr>
              <tr className="admission-fee">
                <td className="row">School fee</td>
                <td className="row">{moment().format("MMM DD, YYYY")}</td>
                <td className="row">{data?.feeDetails.schoolFee.amount}INR</td>

                <td
                  className="row"
                  style={{ textDecoration: "underline", cursor: "pointer" }}
                >
                  <input
                    type="checkbox"
                    name=""
                    id=""
                    checked={schoolfeeState}
                    onChange={(e) => setSchoolFeeState(e.target.checked)}
                  />
                </td>
              </tr>

              <tr className="admission-fee">
                <td className="row">Custom Fee</td>
                <td className="row">
                  <input
                    type="text"
                    placeholder="Enter fee name"
                    value={customFee.name}
                    onChange={(e) =>
                      setCustomFee({ ...customFee, name: e.target.value })
                    }
                  />
                </td>
                <td className="row">
                  <input
                    type="text"
                    placeholder="Enter Amount"
                    value={customFee.amount}
                    onChange={(e) =>
                      setCustomFee({ ...customFee, amount: e.target.value })
                    }
                  />
                </td>
                <td className="row">
                  <input
                    type="checkbox"
                    name=""
                    id=""
                    checked={customFee.state as any}
                    onChange={(e) =>
                      setCustomFee({ ...customFee, state: e.target.checked })
                    }
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
              {Number(data?.feeDetails.admisionFee.amount) +
                Number(data?.feeDetails.schoolFee.amount) +
                Number(customFee.amount)}
              INR
            </h3>
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
