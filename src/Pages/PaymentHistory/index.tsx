import { useState } from "react";
import "./PaymentHistory.scss";
import { ReactComponent as LeftArrow } from "../../assets/Icons/arrow-left-circle.svg";
import { ReactComponent as CloseIcon } from "../../assets/Icons/x.svg";
import StudentProfile from "../../Components/Profile";
import PaymentDetails from "../../Components/PaymentDetails";
// import { collection, getDocs, query } from "firebase/firestore";
import { useNavigate, useParams } from "react-router-dom";
// import { db } from "../../utils/firebase";
// import { INewAdmission } from "../../utils/types";
import Recipt from "../../Components/Recipt";

const PaymentHistory = () => {
  const navigate = useNavigate();
  const [openHistory, setOpenHistory] = useState(true);
  // const [data, setData] = useState<INewAdmission>();
  const [openRecipt, setOpenRecipt] = useState(false);
  const { id } = useParams();

  // const getData = useCallback(async () => {
  //   const q = query(collection(db, "NewAdmission"));
  //   const querySnapshot = await getDocs(q);
  //   const fetchedData = querySnapshot.docs.map((doc) => ({
  //     id: doc.id,
  //     ...(doc.data() as Omit<INewAdmission, "id">),
  //   }));
  //   const filteredData = fetchedData.find((f) => f.id === id);
  //   setData(filteredData);
  // }, []);

  // useEffect(() => {
  //   getData();
  // }, [getData]);

  return (
    <div className="payment-history-container">
      <div className="mx">
        <div className="payment-history-wrapper">
          <LeftArrow
            onClick={() => navigate(-1)}
            style={{ cursor: "pointer" }}
          />
          {openRecipt ? (
            <Recipt id={id} />
          ) : (
            <div className="details">
              <StudentProfile id={id} />
              {openHistory ? (
                <PaymentDetails
                  setOpenRecipt={setOpenRecipt}
                  setOpenHistory={setOpenHistory}
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
                      <tr>
                        <td>2333</td>
                        <td>JUNE16,2024</td>
                        <td>2892</td>

                        <td
                          style={{
                            textDecoration: "underline",
                            cursor: "pointer",
                          }}
                        >
                          DOWNLOAD
                        </td>
                      </tr>
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
