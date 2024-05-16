import React, { useCallback, useEffect, useRef, useState } from "react";
import "./RecentTransaction.scss";
import { ReactComponent as LefTArrow } from "../../assets/Icons/arrow-left-circle.svg";
import Search from "../../Components/Search";
import Button from "../../Components/Button";
import DownloadIcon from "../../assets/Icons/download.svg";
import { collection, getDocs, query } from "firebase/firestore";
import { db } from "../../utils/firebase";
import { INewAdmission } from "../../utils/types";
import { useNavigate } from "react-router-dom";
import moment from "moment";
import { toHaveAttribute } from "@testing-library/jest-dom/matchers";
import { array } from "yup";

const EntriesPerPage = 10;

type FeeDetails = [FeeDetail];

type FeeDetail = {
  reciptNo: string;
  name: string;
  updatedDate: number;
  amount: string;
  state: boolean;
};
const RecentTransaction = () => {
  const navigate = useNavigate();
  const [data, setData] = useState<INewAdmission[]>([]);
  const [filterData, setFilterData] = useState<INewAdmission[]>([]);

  const [selectGrade, setSelectGrade] = useState("");
  const [openGrade, setOpenGrade] = useState(false);
  const [searchDateOfAdmission, setSearchDateOfSubmision] = useState("");
  const [searchDateToAdmission, setSearchDateToSubmision] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [searchData, setSearchData] = useState("");
  const [selectFee, setSelectFee] = useState("");
  const [openFee, setOpenFee] = useState(false);

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

  useEffect(() => {
    if (searchDateOfAdmission && searchDateToAdmission) {
      setFilterData([]);
      return;
    }
    console.log(
      moment(
        `${searchDateOfAdmission} 00:00:00`,
        "YYYY-MM-DD HH:mm:ss"
      ).valueOf()
    );
    console.log(
      moment(
        `${searchDateToAdmission} 00:00:00`,
        "YYYY-MM-DD HH:mm:ss"
      ).valueOf()
    );

    let tempData = data;
    if (searchDateOfAdmission !== "") {
      tempData.map((item, i) => {
        let temp = item.feeDetails.filter((item) => {
          console.log(
            item.updatedDate,
            moment(
              `${searchDateOfAdmission} 00:00:00`,
              "YYYY-MM-DD HH:mm:ss"
            ).valueOf()
          );
          return (
            item.updatedDate >
            moment(
              `${searchDateOfAdmission} 00:00:00`,
              "YYYY-MM-DD HH:mm:ss"
            ).valueOf()
          );
        });
        console.log(temp);
        //tempData[i].feeDetails = temp;
      });
      console.log(tempData);
    }
    if (searchDateToAdmission !== "") {
      tempData.map((item, i) => {
        let temp = item.feeDetails.filter((item) => {
          console.log(
            item.updatedDate,
            moment(
              `${searchDateToAdmission} 23:59:59`,
              "YYYY-MM-DD HH:mm:ss"
            ).valueOf()
          );
          return (
            item.updatedDate <
            moment(
              `${searchDateToAdmission} 23:59:59`,
              "YYYY-MM-DD HH:mm:ss"
            ).valueOf()
          );
        });
        console.log(temp);
        //tempData[i].feeDetails = temp;
      });
      console.log(tempData);
    }
    setFilterData(tempData);
  }, [searchDateOfAdmission, searchDateToAdmission, selectGrade, selectFee]);

  // const startIndex = (currentPage - 1) * EntriesPerPage;
  // const endIndex = startIndex + EntriesPerPage;
  // const currentData =
  //   filterData.length !== 0
  //     ? filterData.slice(startIndex, endIndex)
  //     : data.slice(startIndex, endIndex);

  const getData = useCallback(async () => {
    const q = query(collection(db, "NewAdmission"));
    const querySnapshot = await getDocs(q);
    const fetchedData = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...(doc.data() as Omit<INewAdmission, "id">),
    }));
    // const filterredData = fetchedData.filter(
    //   (s) => s.feeDetails.admisionFee.state === true
    // );
    // const sortData = filterredData.sort((a, b) => {
    //   const timeA: any = new Date(a.feeDetails.admisionFee.updatedDate);
    //   const timeB: any = new Date(b.feeDetails.admisionFee.updatedDate);
    //   return timeB - timeA;
    // });
    console.log(fetchedData);
    setData(fetchedData);
  }, []);
  useEffect(() => {
    getData();
  }, [getData]);

  // const filterSearch = data.filter((item) =>
  //   item.admission.admissionNo.toLowerCase().includes(searchData.toLowerCase())
  // );
  // const filtersearchDateOfAdmission = data.filter(
  //   (d) => d.admission.DateOfAdmission === searchDateOfAdmission
  // );

  // const filterGrade = data.filter(
  //   (f) => f.admission.grade.toLowerCase() === selectGrade.toLowerCase()
  // );
  const handleSearchFilter = async () => {
    // console.log("Handle Search");
    // let tempData: INewAdmission[] = new Array<INewAdmission>();

    // console.log(data);
    // try {
    //   if (selectFee) {
    //     data.forEach((t) => {
    //       t.feeDetails.forEach((fee) => {
    //         if (fee.name.toLowerCase() === selectFee.toLowerCase()) {
    //           tempData.push(t);
    //         }
    //       });
    //     });
    //   }

    //   if (selectGrade !== "") {
    //     console.log("Applying Grade filter", selectGrade);
    //     data.forEach((item) => {
    //       if (
    //         item.admission.grade.toLowerCase() === selectGrade.toLowerCase()
    //       ) {
    //         if (!tempData.includes(item)) {
    //           tempData.push(item);
    //         }
    //       }
    //     });
    //     console.log("Grade filter", tempData);
    //   }

    //   if (searchDateOfAdmission !== "") {
    //     console.log("Applying from date filter", searchDateOfAdmission);

    //     const timeStamp = moment(
    //       `${searchDateOfAdmission} 00:00:00`,
    //       "YYYY-MM-DD HH:mm:ss"
    //     ).valueOf();

    //     data.forEach((item) =>
    //       item.feeDetails.forEach((item1) => {
    //         if (item1?.updatedDate > timeStamp) {
    //           if (!tempData.includes(item)) {
    //             tempData.push(item);
    //           }
    //         }
    //       })
    //     );
    //   }

    //   if (searchDateToAdmission !== "") {
    //     console.log("Applying from date filter", searchDateToAdmission);

    //     const timeStamp = moment(
    //       `${searchDateToAdmission} 00:00:00`,
    //       "YYYY-MM-DD HH:mm:ss"
    //     ).valueOf();

    //     data.forEach((item) =>
    //       item.feeDetails.forEach((item1) => {
    //         console.log(item1?.updatedDate, timeStamp);
    //         if (item1?.updatedDate < timeStamp) {
    //           if (!tempData.includes(item)) {
    //             tempData.push(item);
    //           }
    //         }
    //       })
    //     );
    //   }
    //   // If no filter criteria is met, reset the filtered data to the original data
    //   setFilterData(tempData);
    //   console.log(tempData);
    // } catch (error) {
    //   console.error(error);
    // }
    setFilterData([]);
    setSelectGrade("");
    setSearchDateOfSubmision("");
    setSearchDateToSubmision("");
    setSelectFee("");
  };

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
              openFee={openFee}
              setOpenFee={setOpenFee}
              setSelectFee={setSelectFee}
              selectFee={selectFee}
              handleSearchFilter={handleSearchFilter}
              setSearchDateToSubmision={setSearchDateToSubmision}
              searchDateToAdmission={searchDateToAdmission}
              searchDateOfAdmission={searchDateOfAdmission}
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
              {/* <tbody>
                {filterSearch.length === 0 &&
                filtersearchDateOfAdmission.length === 0 &&
                filterGrade.length === 0
                  ? currentData.map((f, i) => (
                      <tr key={i}>
                        <td>{f.admission.admissionNo}</td>
                        <td>
                          {moment(f.feeDetails.admisionFee.updatedDate).format(
                            "dd-mm-yy"
                          )}
                        </td>
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
                        <td>
                          {" "}
                          {moment(f.feeDetails.admisionFee.updatedDate).format(
                            "dd-mm-yy"
                          )}
                        </td>
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
                        <td>
                          {moment(f.feeDetails.admisionFee.updatedDate).format(
                            "dd-mm-yy"
                          )}
                        </td>
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
                        <td>
                          {" "}
                          {moment(f.feeDetails.admisionFee.updatedDate).format(
                            "dd-mm-yy"
                          )}
                        </td>
                        <td>{f.student.nameInEnglish}</td>
                        <td>{f.admission.admissionNo}</td>
                        <td>Admission fee</td>
                        <td>{f.feeDetails.admisionFee.amount}</td>
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
              </tbody> */}
              <tbody>
                {filterData.length > 0
                  ? filterData.map((f, i) =>
                      f.feeDetails
                        .filter(
                          (d) =>
                            d.state === true &&
                            d.name.toLowerCase() === selectFee.toLowerCase() &&
                            f.admission.grade.toLowerCase() ===
                              selectGrade.toLowerCase()
                        )
                        .map((s) => (
                          <tr key={i}>
                            <td>{s.reciptNo}</td>
                            <td>
                              {moment(s.updatedDate).format("MMM DD, YYYY")}
                            </td>
                            <td>{f.student.nameInEnglish}</td>
                            <td>{f.admission.admissionNo}</td>
                            <td>{s.name}</td>
                            <td>{s.amount} INR</td>
                            <td
                              style={{
                                textDecoration: "underline",
                                cursor: "pointer",
                                color: "#455A64",
                              }}
                              onClick={() =>
                                navigate(`/paymenthistory/${f.id}`)
                              }
                            >
                              View
                            </td>
                          </tr>
                        ))
                    )
                  : data.map((f, i) =>
                      f.feeDetails
                        .filter((d) => d.state === true)
                        .map((s) => (
                          <tr key={i}>
                            <td>{s.reciptNo}</td>
                            <td>
                              {moment(s.updatedDate).format("MMM DD, YYYY")}
                            </td>
                            <td>{f.student.nameInEnglish}</td>
                            <td>{f.admission.admissionNo}</td>
                            <td>{s.name}</td>
                            <td>{s.amount} INR</td>
                            <td
                              style={{
                                textDecoration: "underline",
                                cursor: "pointer",
                                color: "#455A64",
                              }}
                              onClick={() =>
                                navigate(`/paymenthistory/${f.id}`)
                              }
                            >
                              View
                            </td>
                          </tr>
                        ))
                    )}
              </tbody>
            </table>
          </div>
          <div className="footer">
            <div className="pagination">
              <p
                style={{
                  color: "#455a64",
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
