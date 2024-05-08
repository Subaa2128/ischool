import React from "react";
import "./PaymentDetails.scss";
import Button from "../Button";
import { useNavigate } from "react-router-dom";

interface IPaymentDetails {
  setOpenRecipt: React.Dispatch<React.SetStateAction<boolean>>;
  setOpenHistory: React.Dispatch<React.SetStateAction<boolean>>;
}
const PaymentDetails: React.FC<IPaymentDetails> = ({
  setOpenRecipt,
  setOpenHistory,
}) => {
  const navigate = useNavigate();
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
                <td className="row">JUNE16,2024</td>
                <td className="row">500INR</td>

                <td
                  className="row"
                  style={{ textDecoration: "underline", cursor: "pointer" }}
                >
                  <input type="checkbox" name="" id="" />
                </td>
              </tr>
              <tr className="admission-fee">
                <td className="row">School fee</td>
                <td className="row">JUNE16,2024</td>
                <td className="row">500INR</td>

                <td
                  className="row"
                  style={{ textDecoration: "underline", cursor: "pointer" }}
                >
                  <input type="checkbox" name="" id="" />
                </td>
              </tr>

              <tr className="admission-fee">
                <td className="row">Custom Fee</td>
                <td className="row">
                  <input type="text" placeholder="Enter fee name" />
                </td>
                <td className="row">
                  <input type="text" placeholder="Enter Amount" />
                </td>
                <td className="row">
                  <input type="checkbox" name="" id="" />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="footer">
          <div className="total">
            <p>TotalAmount:</p>
            <h3>5000 INR</h3>
          </div>
          <div className="button">
            <Button variant="secondary" onClick={() => navigate(-1)}>
              cancel
            </Button>
            <Button variant="primary" onClick={() => setOpenRecipt(true)}>
              Submit
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentDetails;
