import React, { useState } from "react";
import * as Yup from "yup";
import { Formik, Form, Field } from "formik";

import "./Payment.scss";
import Button from "../../Components/Button";
import { ReactComponent as DropDown } from "../../assets/Icons/chevron-down.svg";
import { useNavigate } from "react-router-dom";
import { collection, getDocs, query } from "firebase/firestore";
import { db } from "../../utils/firebase";
import { INewAdmission } from "../../utils/types";
import { gradeOptions } from "../NewAdmission/data";

const initialValues = { admissionNumber: "", name: "" };

const validationSchema = Yup.object({
  admissionNumber: Yup.string(),
  name: Yup.string(),
});

const Payment = () => {
  const [openSelectClass, setOpenSelectClass] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [selectedClass, setSelectedClass] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (values: typeof initialValues) => {
    try {
      if (!values.admissionNumber && !values.name) {
        return setErrorMessage("Enter either Admission number or Name");
      }
      const q = query(collection(db, "NewAdmission"));
      const querySnapshot = await getDocs(q);
      const fetchedData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as Omit<INewAdmission, "id">),
      }));
      console.log(fetchedData);
      if (values.admissionNumber) {
        const filteredData = fetchedData.find(
          (f) =>
            f.admission.admissionNo.toLowerCase() ===
            values.admissionNumber.toLowerCase()
        );
        if (filteredData?.id) {
          navigate(`/paymenthistory/${filteredData?.id}`);
        }
        setErrorMessage("Admission Number wasn't found");
      }
      if (values.name && selectedClass) {
        const filteredData = fetchedData.find(
          (f) =>
            f.student.nameInEnglish.toLowerCase() === values.name.toLowerCase()
        );
        if (filteredData?.id) {
          navigate(`/paymenthistory/${filteredData?.id}`);
        }
        setErrorMessage("Name wasn't found");
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="payment-container">
      <div className="mx">
        <div className="payment-wrapper">
          <Formik
            initialValues={initialValues}
            onSubmit={handleSubmit}
            validationSchema={validationSchema}
          >
            {({ errors, touched }) => (
              <Form>
                <div className="payment-form">
                  <div className="input-wrapper">
                    <div className="input-field">
                      <Field
                        type="text"
                        placeholder="Enter Admission No."
                        name="admissionNumber"
                      />
                    </div>
                    {touched.admissionNumber && errors.admissionNumber ? (
                      <p>{errors.admissionNumber}</p>
                    ) : null}
                  </div>
                  <h3>or</h3>

                  <div className="input-wrapper">
                    <div className="input-field">
                      <Field type="text" placeholder="Enter name" name="name" />
                    </div>
                    {touched.name && errors.name ? <p>{errors.name}</p> : null}
                  </div>

                  <div className="input-wrapper">
                    <div
                      className="input-field"
                      style={{ cursor: "pointer" }}
                      onClick={() => setOpenSelectClass((m) => !m)}
                    >
                      <p>{selectedClass ? selectedClass : "Select Class"}</p>
                      <DropDown />
                    </div>
                    {openSelectClass && (
                      <div className="options">
                        {gradeOptions.map((f, i) => (
                          <p key={i} onClick={() => setSelectedClass(f.value)}>
                            {f.label}
                          </p>
                        ))}
                      </div>
                    )}
                  </div>
                  <p style={{ color: "#c22828" }}>{errorMessage}</p>
                  <div className="button">
                    <Button variant="primary" type="submit">
                      Submit
                    </Button>
                    <h2 onClick={() => navigate("/recenttransaction")}>
                      Recent Transactions
                    </h2>
                  </div>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  );
};

export default Payment;
