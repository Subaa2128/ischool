import React, { Fragment, useEffect, useState } from "react";
import Header from "./Components/Header";
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./Pages/Login";
import Payment from "./Pages/Payment";
import RecentTransaction from "./Pages/RecentTransaction";
import PaymentHistory from "./Pages/PaymentHistory";
import NewAdmission from "./Pages/NewAdmission";

const App: React.FC = () => {
  const [login, setLogin] = useState(false);
  useEffect(() => {
    const loginDetails = sessionStorage.getItem("login");
    if (loginDetails) {
      setLogin(true);
    }
  }, [login]);
  return (
    <Fragment>
      <Header />
      <Routes>
        {!login ? (
          <>
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="/login" element={<Login />} />
            <Route path="*" element={<Login />} />
          </>
        ) : (
          <>
            <Route path="/login" element={<Login />} />
            <Route path="/payment" element={<Payment />} />
            <Route path="/recenttransaction" element={<RecentTransaction />} />
            <Route path="/paymenthistory/:id" element={<PaymentHistory />} />
            <Route path="/newadmission" element={<NewAdmission />} />
            <Route path="/editadmission/:id" element={<NewAdmission />} />
          </>
        )}
      </Routes>
    </Fragment>
  );
};

export default App;
