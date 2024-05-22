import { useCallback, useEffect, useState } from "react";
import { v4 } from "uuid";
import "./NewAdmission.scss";
import { ReactComponent as LeftArrow } from "../../assets/Icons/arrow-left-circle.svg";
import Button from "../../Components/Button";
import { FieldArray, Formik, FormikErrors, Form as FormikForm } from "formik";
import TextField from "../../Components/TextField";
import {
  addDoc,
  collection,
  doc,
  getDocs,
  query,
  updateDoc,
} from "firebase/firestore";
import { db, storage } from "../../utils/firebase";
import { useNavigate, useParams } from "react-router-dom";
import { ReactComponent as DropDown } from "../../assets/Icons/chevron-down.svg";
import { ReactComponent as Calender } from "../../assets/Icons/calendar.svg";
import { ReactComponent as Upload } from "../../assets/Icons/upload.svg";
import { ReactComponent as Minus } from "../../assets/Icons/minus.svg";
import { ReactComponent as Plus } from "../../assets/Icons/plus.svg";

import { validationSchema, initialState } from "./SchemaAndValidation";
import {
  Headers,
  academicYearOptions,
  gradeOptions,
  brotherSister,
  community,
  gender,
  matric,
  motherTongue,
} from "./data";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { INewAdmission } from "../../utils/types";

const NewAdmission = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [data, setData] = useState<INewAdmission>();
  const [feeAdmission, setFeeAdmission] = useState("");
  const [schoolFee, setSchoolFee] = useState("");
  const [term1Fee, setTerm1Fee] = useState("");
  const [term2Fee, setTerm2Fee] = useState("");
  const [term3Fee, setTerm3Fee] = useState("");
  const [fatherDetails, setFatherDetails] = useState(false);
  const [motherDetails, setMotherDetails] = useState(false);

  const [clickDateOfAdmission, setClickDateOfAdmission] = useState(false);
  const [clickDateOfBirth, setClickDateOfBirth] = useState(false);
  const [clickMotherDateOfBirth, setClickMotherDateOfBirth] = useState(false);
  const [clickFatherDateOfBirth, setClickFatherDateOfBirth] = useState(false);
  const [clickSiblingDateOfBirth, setClickSiblingDateOfBirth] = useState(false);

  const [openAcademic, setOpenAcademic] = useState(false);
  const [openGrade, setOpenGrade] = useState(false);
  const [openGender, setOpenGender] = useState(false);
  const [openMatric, setOpenMatric] = useState(false);
  const [openMotherTounge, setOpenMotherTounge] = useState(false);
  const [opencommunity, setOpenCommunity] = useState(false);
  const [openBrotherSister, setOpenBrootherSister] = useState(false);
  const [selectedHeader, setSelectedHeader] = useState("admission");

  const handleSubmit = async (values: typeof initialState) => {
    try {
      console.log("new");
      console.log(values);
      const data = await addDoc(collection(db, "NewAdmission"), {
        ...values,
        feeDetails: [
          {
            name: "admissionFee",
            updatedDate: Date.now(),
            amount: feeAdmission,
            state: false,
            reciptNo: "",
          },
          {
            name: "schoolFee",
            updatedDate: Date.now(),
            amount: schoolFee,
            state: false,
            reciptNo: "",
          },
          {
            name: "term1",
            updatedDate: Date.now(),
            amount: term1Fee,
            state: false,
            reciptNo: "",
          },
          {
            name: "term2",
            updatedDate: Date.now(),
            amount: term2Fee,
            state: false,
            reciptNo: "",
          },
          {
            name: "term3",
            updatedDate: Date.now(),
            amount: term3Fee,
            state: false,
            reciptNo: "",
          },
        ],
      });
      navigate(`/paymenthistory/${data.id}`);
      console.log(data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleIcon = async (
    e: any,
    name: string,
    setFieldValue: {
      (
        field: string,
        value: any,
        shouldValidate?: boolean | undefined
      ): Promise<void | FormikErrors<{
        staff: { checkbox: boolean; staffName: string };
        admission: {
          applicationNo: string;
          admissionNo: string;
          emisNo: string;
          applicationReceivedBy: string;
          DateOfAdmission: string;
          AdmissionRequiredFor: string;
          academicYear: string;
          grade: string;
        };
        student: {
          nameInEnglish: string;
          nameInTamil: string;
          gender: string;
          dateOfBirth: string;
          dataOfBirthInWords: string;
          aadharCardNo: string;
          motherTongue: string;
          nationality: string;
          caste: string;
          bloodGroup: string;
          religion: string;
          community: string;
        };
        parent: {
          fatherDetails: {
            name: string;
            dateOfBirth: string;
            mobileNo: string;
            emailAddress: string;
            aadarNo: string;
            educationQalification: string;
            occupation: string;
            annualIncome: string;
          };
          motherDetails: {
            name: string;
            dateOfBirth: string;
            mobileNo: string;
            emailAddress: string;
            aadarNo: string;
            educationQalification: string;
            occupation: string;
            annualIncome: string;
          };
        };
        siblings: {
          sibling: string;
          name: string;
          class: string;
          dateOfBirth: string;
          instituteName: string;
          academicYear: string;
        }[];
        previousStudy: {
          instituteName: string;
          duration: string;
          class: string;
          medium: string;
          matric: string;
          marks: string;
        };
        upload: {
          transferCertificate: string;
          studentPhoto: string;
          birthCertificate: string;
          tenthMarksheet: string;
        };
      }>>;
      (arg0: string, arg1: unknown): void;
    }
  ) => {
    try {
      const file = e.target.files[0];
      console.log(file);
      //check the size of image
      if (file?.size / 1024 / 1024 < 2) {
        // const base64 = await convertToBase64(file);
        // console.log(base64);
        const imageref = ref(storage, `imagefile/${v4()}`);
        const uploadTask = uploadBytesResumable(imageref, file);

        await uploadTask;

        const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
        console.log("Download URL:", downloadURL);
        setFieldValue(name, downloadURL as string);
        console.log(name);
      } else {
        alert("Image size must be of 2MB or less");
      }
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
  }, [id]);

  useEffect(() => {
    getData();
  }, [getData]);

  const handleUpdate = async (values: typeof initialState) => {
    try {
      console.log("update");
      if (!id) return;
      const userDocRef = doc(db, "NewAdmission", id);
      await updateDoc(userDocRef, {
        ...values,

        feeDetails: [
          {
            name: "admissionFee",
            updatedDate: Date.now(),
            amount: feeAdmission,
            state: false,
            reciptNo: "",
          },
          {
            name: "schoolFee",
            updatedDate: Date.now(),
            amount: schoolFee,
            state: false,
            reciptNo: "",
          },
          {
            name: "term1",
            updatedDate: Date.now(),
            amount: term1Fee,
            state: false,
            reciptNo: "",
          },
          {
            name: "term2",
            updatedDate: Date.now(),
            amount: term2Fee,
            state: false,
            reciptNo: "",
          },
          {
            name: "term3",
            updatedDate: Date.now(),
            amount: term3Fee,
            state: false,
            reciptNo: "",
          },
        ],
      });
      navigate(-1);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="new-admission-container">
      <div className="mx">
        <Formik
          initialValues={{
            staff: {
              checkbox: data ? data.staff.checkbox : false,
              staffName: data ? data.staff.staffName : "",
            },
            admission: {
              applicationNo: data ? data.admission.applicationNo : "",
              admissionNo: data ? data.admission.admissionNo : "",
              emisNo: data ? data.admission.emisNo : "",
              applicationReceivedBy: data
                ? data.admission.applicationReceivedBy
                : "",
              DateOfAdmission: data ? data.admission.DateOfAdmission : "",
              AdmissionRequiredFor: data
                ? data.admission.AdmissionRequiredFor
                : "",
              academicYear: data ? data.admission.academicYear : "",
              grade: data ? data.admission.grade : "",
            },
            student: {
              nameInEnglish: data ? data.student.nameInEnglish : "",
              nameInTamil: data ? data.student.nameInTamil : "",
              gender: data ? data.student.gender : "",
              dateOfBirth: data ? data.student.dateOfBirth : "",
              dataOfBirthInWords: data ? data.student.dataOfBirthInWords : "",
              aadharCardNo: data ? data.student.aadharCardNo : "",
              motherTongue: data ? data.student.motherTongue : "",
              nationality: data ? data.student.nationality : "",
              caste: data ? data.student.caste : "",
              bloodGroup: data ? data.student.bloodGroup : "",
              religion: data ? data.student.religion : "",
              community: data ? data.student.community : "",
            },
            parent: {
              fatherDetails: {
                name: data ? data.parent.fatherDetails.name : "",
                dateOfBirth: data ? data.parent.fatherDetails.dateOfBirth : "",
                mobileNo: data ? data.parent.fatherDetails.mobileNo : "",
                emailAddress: data
                  ? data.parent.fatherDetails.emailAddress
                  : "",
                aadarNo: data ? data.parent.fatherDetails.aadarNo : "",
                educationQalification: data
                  ? data.parent.fatherDetails.educationQalification
                  : "",
                occupation: data ? data.parent.fatherDetails.occupation : "",
                annualIncome: data
                  ? data.parent.fatherDetails.annualIncome
                  : "",
              },
              motherDetails: {
                name: data ? data.parent.motherDetails.name : "",
                dateOfBirth: data ? data.parent.motherDetails.dateOfBirth : "",
                mobileNo: data ? data.parent.motherDetails.mobileNo : "",
                emailAddress: data
                  ? data.parent.motherDetails.emailAddress
                  : "",
                aadarNo: data ? data.parent.motherDetails.aadarNo : "",
                educationQalification: data
                  ? data.parent.motherDetails.educationQalification
                  : "",
                occupation: data ? data.parent.motherDetails.occupation : "",
                annualIncome: data
                  ? data.parent.motherDetails.annualIncome
                  : "",
              },
            },
            siblings: data
              ? data.siblings.map((f) => ({
                  sibling: f.sibling || "", // Set to empty string if undefined
                  name: f.name || "",
                  class: f.class || "",
                  dateOfBirth: f.dateOfBirth || "",
                  instituteName: f.instituteName || "",
                  academicYear: f.academicYear || "",
                }))
              : [
                  {
                    sibling: "",
                    name: "",
                    class: "",
                    dateOfBirth: "",
                    instituteName: "",
                    academicYear: "",
                  },
                ],
            previousStudy: {
              instituteName: data ? data.previousStudy.instituteName : "",
              academicYear: data ? data.previousStudy.academicYear : "",
              class: data ? data.previousStudy.class : "",
              medium: data ? data.previousStudy.medium : "",
              matric: data ? data.previousStudy.matric : "",
              marks: data ? data.previousStudy.marks : "",
            },
            upload: {
              transferCertificate: data ? data.upload.transferCertificate : "",
              studentPhoto: data ? data.upload.studentPhoto : "",
              birthCertificate: data ? data.upload.birthCertificate : "",
              tenthMarksheet: data ? data.upload.tenthMarksheet : "",
            },
          }}
          validationSchema={validationSchema}
          onSubmit={data ? handleUpdate : handleSubmit}
          enableReinitialize={true}
        >
          {({ values, setFieldValue }) => (
            <FormikForm>
              <div className="new-admission-wrapper">
                <div className="navgation">
                  <LeftArrow
                    onClick={() => navigate(-1)}
                    style={{ cursor: "pointer" }}
                  />
                  <Button variant="primary" type="submit">
                    Submit
                  </Button>
                </div>

                <div className="staff-ward">
                  <div className="checkbox">
                    <TextField name="staff.checkbox" type="checkbox" />
                    <p>Incase of staff ward</p>
                  </div>
                  {values.staff.checkbox && (
                    <div
                      className="input-field"
                      style={{
                        transition:
                          "height 0.3s ease-in-out, opacity 0.3s ease-in-out",
                        height: values.staff.checkbox ? "auto" : "0",
                        opacity: values.staff.checkbox ? 1 : 0,
                        overflow: "hidden",
                      }}
                    >
                      <TextField
                        name="staff.staffName"
                        placeholder="Name of the parent"
                      />
                    </div>
                  )}
                </div>
                <div className="new-admission-form">
                  <div className="header-tab">
                    {Headers.map((f, i) => (
                      <p
                        key={i}
                        style={{
                          background: selectedHeader === f ? "#455a64" : "none",
                          color: selectedHeader === f ? "#fff" : "#455a64",
                          transition: "background 0.3s ease-in-out",
                          cursor: "pointer",
                          textTransform: "capitalize",
                        }}
                        onClick={() => setSelectedHeader(f)}
                      >
                        {f === "previousStudy" ? "Previous study" : f}
                      </p>
                    ))}
                  </div>
                  <div className="border"></div>
                  <div className="form">
                    <div className="form-fields">
                      {selectedHeader === "admission" && (
                        <div className="grid">
                          <div className="grid-one">
                            <TextField
                              id="admission.applicationNo"
                              name="admission.applicationNo"
                              placeholder="Application no."
                            />
                            <TextField
                              name="admission.applicationReceivedBy"
                              placeholder="Application received by"
                            />
                            <TextField
                              type="number"
                              id="admission.admissionNo"
                              name="admission.admissionNo"
                              placeholder="Admission no."
                            />

                            <TextField
                              leftIcon={<Calender />}
                              type={clickDateOfAdmission ? "date" : "text"}
                              name="admission.DateOfAdmission"
                              placeholder="Date Of Admission"
                              onClick={() => setClickDateOfAdmission(true)}
                            />

                            <TextField
                              type="number"
                              name="admission.emisNo"
                              placeholder="EMIS no."
                            />
                            <TextField
                              name="admission.AdmissionRequiredFor"
                              placeholder="Admission required for"
                            />
                            <div className="">
                              <TextField
                                style={{ cursor: "pointer" }}
                                name="admission.academicYear"
                                placeholder="Academic Year"
                                value={values.admission.academicYear}
                                rightIcon={<DropDown />}
                                onClick={() => setOpenAcademic((m) => !m)}
                              />
                              {openAcademic && (
                                <div className="options">
                                  {academicYearOptions.map((option, index) => (
                                    <p
                                      key={index}
                                      onClick={() => {
                                        setFieldValue(
                                          "admission.academicYear",
                                          option.label
                                        );
                                        setOpenAcademic(false);
                                      }}
                                    >
                                      {option.label}
                                    </p>
                                  ))}
                                </div>
                              )}
                            </div>
                            <div className="">
                              <TextField
                                style={{ cursor: "pointer" }}
                                value={values.admission.grade}
                                placeholder="Grade"
                                name="admission.grade"
                                rightIcon={<DropDown />}
                                onClick={() => setOpenGrade((m) => !m)}
                              />
                              {openGrade && (
                                <div className="options">
                                  {gradeOptions.map((option, index) => (
                                    <p
                                      key={index}
                                      onClick={() => {
                                        setFieldValue(
                                          "admission.grade",
                                          option.label
                                        ); // Set the selected value in formik field
                                        setOpenGrade(false); // Close the dropdown after selection
                                        setFeeAdmission(option.admissionFee);
                                        setSchoolFee(option.schoolFees);
                                        setTerm1Fee(option.term1);
                                        setTerm2Fee(option.term2);
                                        setTerm3Fee(option.term3);
                                      }}
                                    >
                                      {option.label}
                                    </p>
                                  ))}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      )}
                      {selectedHeader === "student" && (
                        <div className="grid">
                          <div className="grid-one">
                            <TextField
                              name="student.nameInEnglish"
                              placeholder="Name in English"
                            />
                            <div className="">
                              <TextField
                                rightIcon={<DropDown />}
                                style={{ cursor: "pointer" }}
                                value={values.student.motherTongue}
                                name="student.motherTongue"
                                placeholder="Mother tongue"
                                onClick={() => setOpenMotherTounge((m) => !m)}
                              />
                              {openMotherTounge && (
                                <div className="options">
                                  {motherTongue.map((option, index) => (
                                    <p
                                      key={index}
                                      onClick={() => {
                                        setFieldValue(
                                          "student.motherTongue",
                                          option.label
                                        ); // Set the selected value in formik field
                                        setOpenMotherTounge(false); // Close the dropdown after selection
                                      }}
                                    >
                                      {option.label}
                                    </p>
                                  ))}
                                </div>
                              )}
                            </div>
                            <TextField
                              name="student.nameInTamil"
                              placeholder="Name in Tamil"
                            />
                            <TextField
                              name="student.nationality"
                              placeholder="Nationality"
                            />
                            <div className="">
                              <TextField
                                style={{ cursor: "pointer" }}
                                value={values.student.gender}
                                name="student.gender"
                                placeholder="Gender"
                                rightIcon={<DropDown />}
                                onClick={() => setOpenGender((m) => !m)}
                              />
                              {openGender && (
                                <div className="options">
                                  {gender.map((option, index) => (
                                    <p
                                      key={index}
                                      onClick={() => {
                                        setFieldValue(
                                          "student.gender",
                                          option.label
                                        );
                                        setOpenGender(false);
                                      }}
                                    >
                                      {option.label}
                                    </p>
                                  ))}
                                </div>
                              )}
                            </div>
                            <TextField
                              name="student.bloodGroup"
                              placeholder="Blood group"
                            />

                            <TextField
                              leftIcon={<Calender />}
                              type={clickDateOfBirth ? "date" : "text"}
                              name="student.dateOfBirth"
                              placeholder="Date of birth"
                              onClick={() => setClickDateOfBirth(true)}
                            />

                            <TextField
                              name="student.religion"
                              placeholder="Religion"
                            />
                            <TextField
                              name="student.dataOfBirthInWords"
                              placeholder="Data of birth in words"
                            />

                            <div className="">
                              <TextField
                                style={{ cursor: "pointer" }}
                                value={values.student.community}
                                name="student.community"
                                placeholder="Community"
                                rightIcon={<DropDown />}
                                onClick={() => setOpenCommunity((m) => !m)}
                              />
                              {opencommunity && (
                                <div className="options">
                                  {community.map((option, index) => (
                                    <p
                                      key={index}
                                      onClick={() => {
                                        setFieldValue(
                                          "student.community",
                                          option.label
                                        ); // Set the selected value in formik field
                                        setOpenCommunity(false); // Close the dropdown after selection
                                      }}
                                    >
                                      {option.label}
                                    </p>
                                  ))}
                                </div>
                              )}
                            </div>

                            <TextField
                              type="number"
                              name="student.aadharCardNo"
                              placeholder="Aadhar card no."
                            />

                            <TextField
                              name="student.caste"
                              placeholder="Caste"
                            />
                          </div>
                        </div>
                      )}
                      {selectedHeader === "parent" && (
                        <div className="grid">
                          <div
                            className=""
                            style={{
                              display: "flex",
                              justifyContent: "end",
                              gap: "20px",
                            }}
                          >
                            <Button
                              onClick={() => setFatherDetails((m) => !m)}
                              variant="primary"
                            >
                              Father Details
                            </Button>
                            <Button
                              onClick={() => setMotherDetails((m) => !m)}
                              variant="primary"
                            >
                              Mother Details
                            </Button>
                          </div>

                          {fatherDetails && (
                            <div className="">
                              <h3>Father Details</h3>
                              <div className="grid-one">
                                <TextField
                                  name="parent.fatherDetails.name"
                                  placeholder="Name"
                                />

                                <TextField
                                  type="number"
                                  name="parent.fatherDetails.aadarNo"
                                  placeholder="Aadhar card no."
                                />
                                <TextField
                                  leftIcon={<Calender />}
                                  type={
                                    clickFatherDateOfBirth ? "date" : "text"
                                  }
                                  name="parent.fatherDetails.dateOfBirth"
                                  placeholder="Date of birth"
                                  onClick={() =>
                                    setClickFatherDateOfBirth(true)
                                  }
                                />

                                <TextField
                                  name="parent.fatherDetails.educationQalification"
                                  placeholder="Educational qualification"
                                />
                                <TextField
                                  type="number"
                                  name="parent.fatherDetails.mobileNo"
                                  placeholder="Mobile no."
                                />

                                <TextField
                                  name="parent.fatherDetails.occupation"
                                  placeholder="Occupation"
                                />
                                <TextField
                                  name="parent.fatherDetails.emailAddress"
                                  placeholder="E-mail Address"
                                />
                                <TextField
                                  type="number"
                                  name="parent.fatherDetails.annualIncome"
                                  placeholder="Annual income"
                                />
                              </div>
                            </div>
                          )}
                          {motherDetails && (
                            <div className="">
                              <h3>Mother Details</h3>
                              <div className="grid-two">
                                <TextField
                                  name="parent.motherDetails.name"
                                  placeholder="Name"
                                />
                                <TextField
                                  type="number"
                                  name="parent.motherDetails.aadarNo"
                                  placeholder="Aadhar card no."
                                />
                                <TextField
                                  leftIcon={<Calender />}
                                  type={
                                    clickMotherDateOfBirth ? "date" : "text"
                                  }
                                  name="parent.motherDetails.dateOfBirth"
                                  placeholder="Date of birth"
                                  onClick={() =>
                                    setClickMotherDateOfBirth(true)
                                  }
                                />
                                <TextField
                                  name="parent.motherDetails.educationQalification"
                                  placeholder="Educational qualification"
                                />
                                <TextField
                                  type="number"
                                  name="parent.motherDetails.mobileNo"
                                  placeholder="Mobile no."
                                />

                                <TextField
                                  name="parent.motherDetails.occupation"
                                  placeholder="Occupation"
                                />
                                <TextField
                                  name="parent.motherDetails.emailAddress"
                                  placeholder="E-mail Address"
                                />

                                <TextField
                                  type="number"
                                  name="parent.motherDetails.annualIncome"
                                  placeholder="Annual income"
                                />
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                      {selectedHeader === "siblings" && (
                        <FieldArray name="siblings">
                          {({ push, remove }) =>
                            values.siblings.length > 0 ? (
                              <div>
                                {values.siblings.map((sibling, index) => {
                                  return (
                                    <div className="grid" key={index}>
                                      <h3>Sibling {index + 1}</h3>

                                      <div className="grid-one">
                                        <div className="">
                                          <TextField
                                            style={{ cursor: "pointer" }}
                                            rightIcon={<DropDown />}
                                            onClick={() =>
                                              setOpenBrootherSister((m) => !m)
                                            }
                                            name={`siblings[${index}].sibling`}
                                            placeholder="Sibling"
                                          />
                                          {openBrotherSister && (
                                            <div className="options">
                                              {brotherSister.map(
                                                (option, i) => (
                                                  <p
                                                    key={i}
                                                    onClick={() => {
                                                      setFieldValue(
                                                        `siblings[${index}].sibling`,
                                                        option.label
                                                      );
                                                      setOpenBrootherSister(
                                                        false
                                                      );
                                                    }}
                                                  >
                                                    {option.label}
                                                  </p>
                                                )
                                              )}
                                            </div>
                                          )}
                                        </div>
                                        <TextField
                                          name={`siblings[${index}].name`}
                                          placeholder="Name"
                                        />
                                        <TextField
                                          leftIcon={<Calender />}
                                          type={
                                            clickSiblingDateOfBirth
                                              ? "date"
                                              : "text"
                                          }
                                          name={`siblings[${index}].dateOfBirth`}
                                          placeholder="Date of birth"
                                          onClick={() =>
                                            setClickSiblingDateOfBirth(true)
                                          }
                                        />
                                        <TextField
                                          name={`siblings[${index}].class`}
                                          placeholder="Class"
                                        />

                                        <TextField
                                          name={`siblings[${index}].academicYear`}
                                          placeholder="Academic year"
                                        />
                                        <TextField
                                          name={`siblings[${index}].instituteName`}
                                          placeholder="Institute name"
                                        />
                                        <Button
                                          variant="secondary"
                                          type="button"
                                          leftIcon={<Minus />}
                                          onClick={() => remove(index)}
                                        >
                                          Remove
                                        </Button>
                                        <Button
                                          variant="primary"
                                          type="button"
                                          onClick={() =>
                                            push({
                                              name: "",
                                              class: "",
                                              dateOfBirth: "",
                                              instituteName: "",
                                            })
                                          }
                                          leftIcon={<Plus />}
                                        >
                                          Add Sibling
                                        </Button>
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            ) : (
                              <div
                                className=""
                                style={{
                                  display: "flex",
                                  justifyContent: "end",
                                  paddingBottom: "24px",
                                }}
                              >
                                <Button
                                  variant="primary"
                                  type="button"
                                  onClick={() =>
                                    push({
                                      name: "",
                                      class: "",
                                      dateOfBirth: "",
                                      instituteName: "",
                                    })
                                  }
                                  leftIcon={<Plus />}
                                >
                                  Add Sibling
                                </Button>
                              </div>
                            )
                          }
                        </FieldArray>
                      )}
                      {selectedHeader === "previousStudy" && (
                        <div className="grid">
                          <div className="grid-one">
                            <TextField
                              name="previousStudy.instituteName"
                              placeholder="Institute name"
                            />
                            <TextField
                              name="previousStudy.academicYear"
                              placeholder="Academic year"
                            />
                            <div className="">
                              <TextField
                                style={{ cursor: "pointer" }}
                                value={values.previousStudy.matric}
                                rightIcon={<DropDown />}
                                onClick={() => setOpenMatric((m) => !m)}
                                name="previousStudy.matric"
                                placeholder="Matric"
                              />
                              {openMatric && (
                                <div className="options">
                                  {matric.map((option, index) => (
                                    <p
                                      key={index}
                                      onClick={() => {
                                        setFieldValue(
                                          "previousStudy.matric",
                                          option.label
                                        );
                                        setOpenMatric(false);
                                      }}
                                    >
                                      {option.label}
                                    </p>
                                  ))}
                                </div>
                              )}
                            </div>
                            <TextField
                              name="previousStudy.class"
                              placeholder="Class"
                            />
                            <TextField
                              name="previousStudy.medium"
                              placeholder="Medium"
                            />

                            <TextField
                              name="previousStudy.marks"
                              placeholder="Marks"
                            />
                          </div>
                        </div>
                      )}
                      {selectedHeader === "upload" && (
                        <div className="grid">
                          <div className="grid-one">
                            <div className="upload-file">
                              <h4>Transfer certificate</h4>
                              <TextField
                                type="file"
                                accept=".pdf"
                                rightIcon={<Upload />}
                                value={undefined}
                                name="upload.transferCertificate"
                                placeholder="Transfer Certificate"
                                onChange={(e) =>
                                  handleIcon(
                                    e,
                                    "upload.transferCertificate",
                                    setFieldValue
                                  )
                                }
                              />
                              <p>(PDF, JPEG, PNG, Max size 2MB)</p>
                            </div>
                            <div className="upload-file">
                              <h4>Student photo</h4>
                              <TextField
                                type="file"
                                accept=".jpeg,.png"
                                rightIcon={<Upload />}
                                value={undefined}
                                name="upload.studentPhoto"
                                placeholder="Student Photo"
                                onChange={(e) =>
                                  handleIcon(
                                    e,
                                    "upload.studentPhoto",
                                    setFieldValue
                                  )
                                }
                              />
                              <p>(150x150px, JPEG, PNG, Max size 2MB)</p>
                            </div>
                          </div>
                          <div className="grid-two">
                            <div className="upload-file">
                              <h4>Birth certificate</h4>
                              <TextField
                                type="file"
                                accept=".pdf"
                                value={undefined}
                                rightIcon={<Upload />}
                                name="upload.birthCertificate"
                                placeholder="Birth Certificate"
                                onChange={(e) =>
                                  handleIcon(
                                    e,
                                    "upload.birthCertificate",
                                    setFieldValue
                                  )
                                }
                              />
                              <p>(PDF, JPEG, PNG, Max size 2MB)</p>
                            </div>
                            <div className="upload-file">
                              <h4>10th marksheet</h4>
                              <TextField
                                rightIcon={<Upload />}
                                type="file"
                                accept=".pdf"
                                value={undefined}
                                name="upload.tenthMarksheet"
                                placeholder="Tenth Marksheet"
                                onChange={(e) =>
                                  handleIcon(
                                    e,
                                    "upload.tenthMarksheet",
                                    setFieldValue
                                  )
                                }
                              />
                              <p>(PDF, JPEG, PNG, Max size 2MB)</p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </FormikForm>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default NewAdmission;
