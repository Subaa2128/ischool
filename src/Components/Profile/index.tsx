import React, { useCallback, useEffect, useState } from "react";
import "./Profile.scss";
import { collection, deleteDoc, doc, getDocs, query } from "firebase/firestore";
import { db } from "../../utils/firebase";
import { INewAdmission } from "../../utils/types";
import Button from "../Button";
import { Modal } from "../Modal";
import { ReactComponent as AlertTriangle } from "../../assets/Icons/alert-triangle.svg";
import { ReactComponent as SuccessCircle } from "../../assets/Icons/check-circle.svg";
import { ReactComponent as Delete } from "../../assets/Icons/trash-2.svg";
import { ReactComponent as Edit } from "../../assets/Icons/edit.svg";

import { useNavigate } from "react-router-dom";

interface IStudentProfile {
  id?: string;
}

const StudentProfile: React.FC<IStudentProfile> = ({ id }) => {
  const navigate = useNavigate();
  const [data, setData] = useState<INewAdmission>();
  const [openModal, setOpenModal] = useState(false);
  const [deletedProfile, setDeletedProfile] = useState(false);
  const [loading, setLoading] = useState(false);

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

  const handleDelete = async () => {
    try {
      setLoading(true);
      if (!id) return;
      await deleteDoc(doc(db, "NewAdmission", id));
      setDeletedProfile(true);
      setLoading(false);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="profile-container">
      <h3>Student Profile</h3>
      <div className="image">
        <img src={data?.upload.studentPhoto} alt="" />
      </div>
      <div className="profile-details">
        <div className="title">
          <p>Admission No</p>
          <h2>{data?.admission.admissionNo}</h2>
        </div>
        <div className="title">
          <p>Name</p>
          <h2 style={{ textTransform: "uppercase" }}>
            {data?.student.nameInEnglish}
          </h2>
        </div>
        <div className="title">
          <p>Standard</p>
          <h2>{data?.previousStudy.class}</h2>
        </div>

        <div className="title">
          <p>Acadamic Year</p>
          <h2>{data?.admission.academicYear}</h2>
        </div>

        <div className="title">
          <p>DOB</p>
          <h2>{data?.student.dateOfBirth}</h2>
        </div>
        <div className="title">
          <p>Father's Name</p>
          <h2>{data?.parent.fatherDetails.name}</h2>
        </div>

        <div className="title">
          <p>Blood Group</p>
          <h2>{data?.student.bloodGroup}</h2>
        </div>

        <div className="title">
          <p>Mobile No</p>
          <h2>{data?.parent.fatherDetails.mobileNo}</h2>
        </div>
        <div className="title">
          <Button
            variant="secondary"
            leftIcon={<Delete />}
            onClick={() => setOpenModal(true)}
          >
            Delete
          </Button>
          <Button
            style={{ width: "100%" }}
            variant="primary"
            leftIcon={<Edit />}
            onClick={() => navigate(`/editadmission/${id}`)}
          >
            Edit
          </Button>
        </div>
      </div>

      {openModal && (
        <Modal isOpen={openModal} onClose={() => setOpenModal(false)}>
          <div className="modal-content">
            {deletedProfile ? <SuccessCircle /> : <AlertTriangle />}

            <div className="detail">
              <h3>
                {deletedProfile
                  ? `Profile deleted successfully!`
                  : `Do you want to delete this profile?`}
              </h3>
            </div>
            <div className="button">
              {deletedProfile ? (
                <Button
                  variant="primary"
                  onClick={() => [
                    setOpenModal(false),
                    setDeletedProfile(false),
                    navigate("/newadmission"),
                  ]}
                >
                  Done
                </Button>
              ) : (
                <>
                  <Button
                    disabled={loading}
                    variant="primary"
                    onClick={() => setOpenModal(false)}
                  >
                    No
                  </Button>
                  <Button
                    disabled={loading}
                    variant="primary"
                    onClick={() => handleDelete()}
                  >
                    Yes
                  </Button>
                </>
              )}
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default StudentProfile;
