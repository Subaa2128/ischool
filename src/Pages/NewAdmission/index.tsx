import React, { useCallback, useEffect, useState } from "react";
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
      console.log(values);
      const data = await addDoc(collection(db, "NewAdmission"), { ...values });
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
      if (!id) return;
      const userDocRef = doc(db, "NewAdmission", id);
      await updateDoc(userDocRef, { ...values });
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
              duration: data ? data.previousStudy.duration : "",
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
          {({ isSubmitting, values, setFieldValue }) => (
            <FormikForm>
              <div className="new-admission-wrapper">
                <div className="navgation">
                  <LeftArrow
                    onClick={() => navigate(-1)}
                    style={{ cursor: "pointer" }}
                  />
                  <Button
                    variant="primary"
                    type="submit"
                    onClick={() =>
                      data ? handleUpdate(values) : handleSubmit(values)
                    }
                  >
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
                        placeholder="staffName"
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
                          background: selectedHeader === f ? "#777" : "none",
                          color: selectedHeader === f ? "#fff" : "#777",
                          transition: "background 0.3s ease-in-out",
                          cursor: "pointer",
                          textTransform: "capitalize",
                        }}
                        onClick={() => setSelectedHeader(f)}
                      >
                        {f}
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
                              placeholder="applicationNo"
                            />
                            <TextField
                              id="admission.admissionNo"
                              name="admission.admissionNo"
                              placeholder="admissionNo"
                            />
                            <TextField
                              name="admission.emisNo"
                              placeholder="emisNo"
                            />
                            <TextField
                              name="admission.applicationReceivedBy"
                              placeholder="applicationReceivedBy"
                            />
                            <TextField
                              leftIcon={<Calender />}
                              type="date"
                              name="admission.DateOfAdmission"
                              placeholder="DateOfAdmission"
                            />
                            <TextField
                              name="admission.AdmissionRequiredFor"
                              placeholder="AdmissionRequiredFor"
                            />
                            <div className="">
                              <TextField
                                style={{ cursor: "pointer" }}
                                name="admission.academicYear"
                                placeholder="academicYear"
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
                                          option.value
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
                                placeholder="grade"
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
                                          option.value
                                        ); // Set the selected value in formik field
                                        setOpenGrade(false); // Close the dropdown after selection
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
                              placeholder="nameInEnglish"
                            />
                            <TextField
                              name="student.nameInTamil"
                              placeholder="nameInTamil"
                            />
                            <div className="">
                              <TextField
                                style={{ cursor: "pointer" }}
                                value={values.student.gender}
                                name="student.gender"
                                placeholder="gender"
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
                                          option.value
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
                              leftIcon={<Calender />}
                              type="date"
                              name="student.dateOfBirth"
                              placeholder="dateOfBirth"
                            />
                            <TextField
                              name="student.dataOfBirthInWords"
                              placeholder="dataOfBirthInWords"
                            />
                            <TextField
                              name="student.aadharCardNo"
                              placeholder="aadharCardNo"
                            />
                          </div>
                          <div className="grid-two">
                            <div className="">
                              <TextField
                                rightIcon={<DropDown />}
                                style={{ cursor: "pointer" }}
                                value={values.student.motherTongue}
                                name="student.motherTongue"
                                placeholder="motherTongue"
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
                                          option.value
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
                              name="student.nationality"
                              placeholder="nationality"
                            />
                            <TextField
                              name="student.caste"
                              placeholder="caste"
                            />
                            <TextField
                              name="student.bloodGroup"
                              placeholder="bloodGroup"
                            />
                            <TextField
                              name="student.religion"
                              placeholder="religion"
                            />
                            <div className="">
                              <TextField
                                style={{ cursor: "pointer" }}
                                value={values.student.community}
                                name="student.community"
                                placeholder="community"
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
                                          option.value
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
                          </div>
                        </div>
                      )}
                      {selectedHeader === "parent" && (
                        <div className="grid">
                          <div className="">
                            <h3>Father Details</h3>
                            <div className="grid-one">
                              <TextField
                                name="parent.fatherDetails.name"
                                placeholder="name"
                              />
                              <TextField
                                leftIcon={<Calender />}
                                type="date"
                                name="parent.fatherDetails.dateOfBirth"
                                placeholder="dateOfBirth"
                              />
                              <TextField
                                name="parent.fatherDetails.mobileNo"
                                placeholder="mobileNo"
                              />
                              <TextField
                                name="parent.fatherDetails.emailAddress"
                                placeholder="emailAddress"
                              />

                              <TextField
                                name="parent.fatherDetails.aadarNo"
                                placeholder="aadarNo"
                              />
                              <TextField
                                name="parent.fatherDetails.educationQalification"
                                placeholder="educationQalification"
                              />
                              <TextField
                                name="parent.fatherDetails.occupation"
                                placeholder="occupation"
                              />
                              <TextField
                                name="parent.fatherDetails.annualIncome"
                                placeholder="annualIncome"
                              />
                            </div>
                          </div>
                          <div className="">
                            <h3>Mother Details</h3>
                            <div className="grid-two">
                              <TextField
                                name="parent.motherDetails.name"
                                placeholder="name"
                              />
                              <TextField
                                leftIcon={<Calender />}
                                type="date"
                                name="parent.motherDetails.dateOfBirth"
                                placeholder="dateOfBirth"
                              />
                              <TextField
                                name="parent.motherDetails.mobileNo"
                                placeholder="mobileNo"
                              />
                              <TextField
                                name="parent.motherDetails.emailAddress"
                                placeholder="emailAddress"
                              />

                              <TextField
                                name="parent.motherDetails.aadarNo"
                                placeholder="aadarNo"
                              />
                              <TextField
                                name="parent.motherDetails.educationQalification"
                                placeholder="educationQalification"
                              />
                              <TextField
                                name="parent.motherDetails.occupation"
                                placeholder="occupation"
                              />
                              <TextField
                                name="parent.motherDetails.annualIncome"
                                placeholder="annualIncome"
                              />
                            </div>
                          </div>
                        </div>
                      )}
                      {selectedHeader === "siblings" && (
                        <FieldArray name="siblings">
                          {({ push, remove }) => (
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
                                          placeholder="sibling"
                                        />
                                        {openBrotherSister && (
                                          <div className="options">
                                            {brotherSister.map(
                                              (option, index) => (
                                                <p
                                                  key={index}
                                                  onClick={() => {
                                                    setFieldValue(
                                                      `siblings[${index}].sibling`,
                                                      option.value
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
                                        leftIcon={<Calender />}
                                        type="date"
                                        name={`siblings[${index}].dateOfBirth`}
                                        placeholder="dateOfBirth"
                                      />
                                      <TextField
                                        name={`siblings[${index}].class`}
                                        placeholder="class"
                                      />
                                      <TextField
                                        name={`siblings[${index}].name`}
                                        placeholder="name"
                                      />
                                      <TextField
                                        name={`siblings[${index}].academicYear`}
                                        placeholder="academicYear"
                                      />
                                      <TextField
                                        name={`siblings[${index}].instituteName`}
                                        placeholder="instituteName"
                                      />
                                      <Button
                                        variant="secondary"
                                        type="button"
                                        onClick={() => remove(index)}
                                        disabled={values.siblings.length === 1}
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
                                      >
                                        Add Sibling
                                      </Button>
                                    </div>
                                    {/* <div className="grid-two">
              
            </div> */}
                                  </div>
                                );
                              })}
                            </div>
                          )}
                        </FieldArray>
                        // <div className="grid">
                        //   <div className="grid-one">
                        //     <TextField
                        //       name="siblings.name"
                        //       placeholder="name"
                        //     />
                        //     <TextField
                        //       name="siblings.class"
                        //       placeholder="class"
                        //     />
                        //   </div>
                        //   <div className="grid-two">
                        //     <TextField
                        //       name="siblings.dateOfBirth"
                        //       placeholder="dateOfBirth"
                        //     />
                        //     <TextField
                        //       name="siblings.instituteName"
                        //       placeholder="instituteName"
                        //     />
                        //   </div>
                        // </div>
                      )}
                      {selectedHeader === "previousStudy" && (
                        <div className="grid">
                          <div className="grid-one">
                            <TextField
                              name="previousStudy.instituteName"
                              placeholder="instituteName"
                            />
                            <TextField
                              name="previousStudy.duration"
                              placeholder="duration"
                            />
                            <div className="">
                              <TextField
                                style={{ cursor: "pointer" }}
                                value={values.previousStudy.matric}
                                rightIcon={<DropDown />}
                                onClick={() => setOpenMatric((m) => !m)}
                                name="previousStudy.matric"
                                placeholder="matric"
                              />
                              {openMatric && (
                                <div className="options">
                                  {matric.map((option, index) => (
                                    <p
                                      key={index}
                                      onClick={() => {
                                        setFieldValue(
                                          "previousStudy.matric",
                                          option.value
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
                              placeholder="class"
                            />
                            <TextField
                              name="previousStudy.medium"
                              placeholder="medium"
                            />

                            <TextField
                              name="previousStudy.marks"
                              placeholder="marks"
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
                                placeholder="transferCertificate"
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
                                placeholder="studentPhoto"
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
                                placeholder="birthCertificate"
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
                                placeholder="tenthMarksheet"
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
