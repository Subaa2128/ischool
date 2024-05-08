import React, { useCallback, useEffect, useState } from "react";
import "./RecentTransaction.scss";
import { ReactComponent as LefTArrow } from "../../assets/Icons/arrow-left-circle.svg";
import Search from "../../Components/Search";
import Button from "../../Components/Button";
import DownloadIcon from "../../assets/Icons/download.svg";
import { collection, getDocs, query } from "firebase/firestore";
import { db } from "../../utils/firebase";
import { INewAdmission } from "../../utils/types";
import { useNavigate } from "react-router-dom";

const EntriesPerPage = 10;

const RecentTransaction = () => {
  const navigate = useNavigate();
  const [data, setData] = useState<INewAdmission[]>([]);
  const [selectGrade, setSelectGrade] = useState("");
  const [openGrade, setOpenGrade] = useState(false);
  const [searchDateOfAdmission, setSearchDateOfSubmision] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [searchData, setSearchData] = useState("");

  const onPageChange = (pageNumber: React.SetStateAction<number>) => {
    setCurrentPage(pageNumber);
  };

  const renderPageNumbers = () => {
    const totalPages = Math.ceil(data.length / EntriesPerPage);
    const pages = [];
    for (let i = 1; i <= totalPages; i++) {
      pages.push(
        <li
          key={i}
          onClick={() => onPageChange(i)}
          className={currentPage === i ? "active" : ""}
        >
          {i}
        </li>
      );
    }
    return pages;
  };

  const startIndex = (currentPage - 1) * EntriesPerPage;
  const endIndex = startIndex + EntriesPerPage;
  const currentData = data.slice(startIndex, endIndex);
  const getData = useCallback(async () => {
    const q = query(collection(db, "NewAdmission"));
    const querySnapshot = await getDocs(q);
    const fetchedData = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...(doc.data() as Omit<INewAdmission, "id">),
    }));
    setData(fetchedData);
  }, []);

  useEffect(() => {
    getData();
  }, [getData]);

  const filterSearch = data.filter((item) =>
    item.admission.admissionNo.toLowerCase().includes(searchData.toLowerCase())
  );
  const filtersearchDateOfAdmission = data.filter(
    (d) => d.admission.DateOfAdmission === searchDateOfAdmission
  );

  const filterGrade = data.filter(
    (f) => f.admission.grade.toLowerCase() === selectGrade.toLowerCase()
  );
  return (
    <div className="recent-transaction-container">
      <div className="mx">
        <div className="recent-transaction-wrapper">
          <LefTArrow
            onClick={() => navigate(-1)}
            style={{ cursor: "pointer" }}
          />

          <h3>Recent Transactions</h3>
          <div className="search">
            <Search
              setSearchData={setSearchData}
              searchData={searchData}
              setSearchDateOfSubmision={setSearchDateOfSubmision}
              openGrade={openGrade}
              selectGrade={selectGrade}
              setOpenGrade={setOpenGrade}
              setSelectGrade={setSelectGrade}
            />
          </div>

          <div className="recent-transaction-details">
            <table>
              <thead>
                <tr>
                  <th>RECEIPT NO.</th>
                  <th>PAID DATE</th>
                  <th>NAME</th>
                  <th>ADMISSION NO.</th>
                  <th>SESSION</th>
                  <th>AMOUNT</th>
                  <th>DETAILS</th>
                </tr>
              </thead>
              <tbody>
                {filterSearch.length === 0 &&
                filtersearchDateOfAdmission.length === 0 &&
                filterGrade.length === 0
                  ? currentData.map((f, i) => (
                      <tr key={i}>
                        <td>{f.admission.admissionNo}</td>
                        <td>JUNE16,2024</td>
                        <td>{f.student.nameInEnglish}</td>
                        <td>{f.admission.admissionNo}</td>
                        <td>Admission fee</td>
                        <td>233 INR</td>
                        <td
                          style={{
                            textDecoration: "underline",
                            cursor: "pointer",
                            color: "#455A64",
                          }}
                          onClick={() => navigate(`/paymenthistory/${f.id}`)}
                        >
                          View
                        </td>
                      </tr>
                    ))
                  : filterSearch.length === 0
                  ? filtersearchDateOfAdmission.map((f, i) => (
                      <tr key={i}>
                        <td>{f.admission.admissionNo}</td>
                        <td>JUNE16,2024</td>
                        <td>{f.student.nameInEnglish}</td>
                        <td>{f.admission.admissionNo}</td>
                        <td>Admission fee</td>
                        <td>5000 INR</td>
                        <td
                          style={{
                            textDecoration: "underline",
                            cursor: "pointer",
                            color: "#455A64",
                          }}
                          onClick={() => navigate(`/paymenthistory/${f.id}`)}
                        >
                          View
                        </td>
                      </tr>
                    ))
                  : filterGrade.length === 0
                  ? filterSearch.map((f, i) => (
                      <tr key={i}>
                        <td>{f.admission.admissionNo}</td>
                        <td>JUNE16,2024</td>
                        <td>{f.student.nameInEnglish}</td>
                        <td>{f.admission.admissionNo}</td>
                        <td>Admission fee</td>
                        <td>5000 INR</td>
                        <td
                          style={{
                            textDecoration: "underline",
                            cursor: "pointer",
                            color: "#455A64",
                          }}
                          onClick={() => navigate(`/paymenthistory/${f.id}`)}
                        >
                          View
                        </td>
                      </tr>
                    ))
                  : filterGrade.map((f, i) => (
                      <tr key={i}>
                        <td>{f.admission.admissionNo}</td>
                        <td>JUNE16,2024</td>
                        <td>{f.student.nameInEnglish}</td>
                        <td>{f.admission.admissionNo}</td>
                        <td>Admission fee</td>
                        <td>5000 INR</td>
                        <td
                          style={{
                            textDecoration: "underline",
                            cursor: "pointer",
                            color: "#455A64",
                          }}
                          onClick={() => navigate(`/paymenthistory/${f.id}`)}
                        >
                          View
                        </td>
                      </tr>
                    ))}
              </tbody>
            </table>
          </div>
          <div className="footer">
            <div className="pagination">
              <p
                style={{
                  color: "#777",
                  fontFamily: "Gilroy",
                  fontSize: "14px",
                }}
              >
                page
              </p>
              <ul className="pagination">
                <li
                  onClick={() => onPageChange(currentPage - 1)}
                  className={currentPage === 1 ? "disabled" : ""}
                >
                  Prev
                </li>
                {renderPageNumbers()}
                <li
                  onClick={() => onPageChange(currentPage + 1)}
                  className={currentPage === 10 ? "disabled" : ""}
                >
                  Next
                </li>
              </ul>
            </div>
            <div className="download">
              <Button
                variant="primary"
                leftIcon={<img src={DownloadIcon} alt="" />}
              >
                Download statement
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecentTransaction;
