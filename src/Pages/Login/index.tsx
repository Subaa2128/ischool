import React, { useState } from "react";
import * as Yup from "yup";
import { Formik, Form, Field } from "formik";
import Button from "../../Components/Button";
import "./Login.scss";

import { ReactComponent as UserIcon } from "../../assets/Icons/user.svg";
import { ReactComponent as EyeOff } from "../../assets/Icons/eye-off.svg";
import { ReactComponent as Eye } from "../../assets/Icons/eye.svg";

import { ReactComponent as Lock } from "../../assets/Icons/lock.svg";
import { ReactComponent as Image } from "../../assets/Logos/Learning-cuate.svg";
import { useNavigate } from "react-router-dom";

const initialValues = { id: "", password: "" };

const validationSchema = Yup.object({
  id: Yup.string().required("ID is required"),
  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
});

const Login = () => {
  const navigate = useNavigate();
  const [openPassword, setOpenPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const handleSubmit = (values: typeof initialValues) => {
    if (values.id !== process.env.REACT_APP_ID) {
      setErrorMessage("Invalid ID");
    }
    if (values.password !== process.env.REACT_APP_PASSWORD) {
      setErrorMessage("Invalid PASSWORD");
    }
    if (
      values.id === process.env.REACT_APP_ID &&
      values.password === process.env.REACT_APP_PASSWORD
    ) {
      sessionStorage.setItem("login", "true");
      navigate("/payment");
      window.location.reload();
    }

    try {
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="login-container">
      <div className="mx">
        <div className="login-wrapper">
          <div className="first-grid">
            <Image />
          </div>
          <div className="second-grid">
            <Formik
              initialValues={initialValues}
              onSubmit={handleSubmit}
              validationSchema={validationSchema}
            >
              {({ errors, touched }) => (
                <Form>
                  <div className="login-form">
                    <div className="input-wrapper">
                      <div
                        className="input-field"
                        style={{
                          border:
                            touched.id &&
                            !errors.id &&
                            errorMessage !== "Invalid ID"
                              ? "1px solid #AAAAAA"
                              : "1px solid #C22828",
                        }}
                      >
                        <UserIcon />
                        <div className="border"></div>
                        <Field
                          type="text"
                          placeholder="Enter ID number"
                          name="id"
                        />
                      </div>
                      {touched.id && errors.id ? (
                        <p
                          style={{
                            color: "#C22828",
                            textAlign: "left",
                            paddingTop: "4px",
                          }}
                        >
                          {errors.id}
                        </p>
                      ) : null}
                      {errorMessage === "Invalid ID" && (
                        <p
                          style={{
                            color: "#C22828",
                            textAlign: "left",
                            paddingTop: "4px",
                          }}
                        >
                          {errorMessage}
                        </p>
                      )}
                    </div>
                    <div className="input-wrapper">
                      <div
                        className="input-field"
                        style={{
                          border:
                            touched.id &&
                            !errors.password &&
                            errorMessage !== "Invalid PASSWORD"
                              ? "1px solid #AAAAAA"
                              : "1px solid #C22828",
                        }}
                      >
                        <Lock />
                        <div className="border"></div>
                        <Field
                          type={openPassword ? "text" : "password"}
                          placeholder="Enter password"
                          name="password"
                        />
                        <div
                          style={{ cursor: "pointer" }}
                          onClick={() => setOpenPassword((m) => !m)}
                          className="eye"
                        >
                          {openPassword ? <Eye /> : <EyeOff />}
                        </div>
                      </div>
                      {touched.password && errors.password ? (
                        <p
                          style={{
                            color: "#C22828",
                            textAlign: "left",
                            paddingTop: "4px",
                          }}
                        >
                          {errors.password}
                        </p>
                      ) : null}
                      {errorMessage === "Invalid PASSWORD" && (
                        <p
                          style={{
                            color: "#C22828",
                            textAlign: "left",
                            paddingTop: "4px",
                          }}
                        >
                          {errorMessage}
                        </p>
                      )}
                    </div>

                    <Button
                      style={{ width: "100%", marginTop: "32px" }}
                      variant="primary"
                      type="submit"
                    >
                      Login
                    </Button>
                  </div>
                </Form>
              )}
            </Formik>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
