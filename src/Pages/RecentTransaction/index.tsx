import React, { useCallback, useEffect, useState } from "react";
import "./RecentTransaction.scss";
import { ReactComponent as LefTArrow } from "../../assets/Icons/arrow-left-circle.svg";
import Search from "../../Components/Search";

import { collection, getDocs, query } from "firebase/firestore";
import { db } from "../../utils/firebase";
import { INewAdmission } from "../../utils/types";
import { useNavigate } from "react-router-dom";
import moment from "moment";

const EntriesPerPage = 10;

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

  function determineInputType(input: string): string {
    // Check if input is empty or just whitespace
    if (input.trim().length === 0) {
      return "";
    }

    // Check if input is a number
    if (!isNaN(input as any) && !isNaN(parseFloat(input))) {
      return "number";
    }

    // Otherwise, it's a string
    return "string";
  }

  useEffect(() => {
    console.log("Filter");
    if (
      searchDateOfAdmission === "" &&
      searchDateToAdmission === "" &&
      selectFee === "" &&
      selectGrade === "" &&
      searchData === ""
    ) {
      setFilterData([]);
      return;
    }

    let tempData = data;

    if (searchData !== "") {
      tempData = data
        .filter((item) => {
          console.log(searchData.toLowerCase());
          if (determineInputType(searchData) !== "number") {
            return item.student.nameInEnglish
              .toLowerCase()
              .startsWith(searchData.toLowerCase());
          } else return item;
        })
        .filter((item) => {
          if (determineInputType(searchData) === "number") {
            return String(item.admission.admissionNo).startsWith(searchData);
          } else return item;
        })
        .map((item: any) => {
          console.log(item);
          // Filter feeDetails based on the condition
          let filteredFeeDetails = item.feeDetails.filter(
            (feeDetail: FeeDetail) => {
              if (
                searchData.length > 3 &&
                determineInputType(searchData) === "number"
              ) {
                return String(feeDetail.reciptNo).startsWith(searchData);
              } else return feeDetail;
            }
          );

          // Replace the feeDetails array with the filtered array
          return {
            ...item,
            feeDetails: filteredFeeDetails,
          };
        });
    }
    if (searchDateOfAdmission !== "") {
      // Parse the searchDateOfAdmission once to avoid repeated parsing in the loop
      const searchDateTimestamp = moment(
        `${searchDateOfAdmission} 00:00:00`,
        "YYYY-MM-DD HH:mm:ss"
      ).valueOf();

      // Iterate over each item in tempData
      tempData = tempData.map((item: any) => {
        // Filter feeDetails based on the condition
        const filteredFeeDetails = item.feeDetails.filter((feeDetail: any) => {
          return feeDetail.updatedDate > searchDateTimestamp;
        });

        // Replace the feeDetails array with the filtered array
        return {
          ...item,
          feeDetails: filteredFeeDetails,
        };
      });

      // Log the updated tempData for debugging purposes
      // tempData.forEach((element: any) => {
      //   console.log(element.feeDetails);
      // });
    }
    if (searchDateToAdmission !== "") {
      // Parse the searchDateOfAdmission once to avoid repeated parsing in the loop
      const searchDateTimestamp = moment(
        `${searchDateToAdmission} 23:59:59`,
        "YYYY-MM-DD HH:mm:ss"
      ).valueOf();

      // Iterate over each item in tempData
      tempData = tempData.map((item: any) => {
        // Filter feeDetails based on the condition
        const filteredFeeDetails = item.feeDetails.filter((feeDetail: any) => {
          return feeDetail.updatedDate < searchDateTimestamp;
        });

        // Replace the feeDetails array with the filtered array
        return {
          ...item,
          feeDetails: filteredFeeDetails,
        };
      });
    }

    if (selectFee !== "") {
      console.log("Fee Filtering...");
      // Iterate over each item in tempData
      tempData = tempData.map((item: any) => {
        // Filter feeDetails based on the condition

        const filteredFeeDetails = item.feeDetails.filter(
          (feeDetail: FeeDetail) => {
            return feeDetail.name.toLowerCase() === selectFee.toLowerCase();
          }
        );

        // Replace the feeDetails array with the filtered array
        return {
          ...item,
          feeDetails: filteredFeeDetails,
        };
      });
    }
    if (selectGrade !== "") {
      tempData = tempData.filter(
        (item: any) =>
          item.admission.grade.toLowerCase() === selectGrade.toLowerCase()
      );
    }
    console.log(tempData);

    setFilterData(tempData);
    // Log the updated tempData for debugging purposes
  }, [
    searchDateOfAdmission,
    searchDateToAdmission,
    selectGrade,
    selectFee,
    searchData,
  ]);

  const startIndex = (currentPage - 1) * EntriesPerPage;
  const endIndex = currentPage * EntriesPerPage;

  console.log(filterData);
  const getData = useCallback(async () => {
    const q = query(collection(db, "NewAdmission"));
    const querySnapshot = await getDocs(q);
    const fetchedData = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...(doc.data() as Omit<INewAdmission, "id">),
    }));

    const sortData = fetchedData.sort((a, b) => {
      const timeA: any = new Date(a.feeDetails[0].updatedDate);
      const timeB: any = new Date(b.feeDetails[0].updatedDate);
      return timeB - timeA;
    });

    setData(sortData);
  }, []);
  useEffect(() => {
    getData();
  }, [getData]);

  const handleSearchFilter = async () => {
    setFilterData([]);
    setSelectGrade("");
    setSearchDateOfSubmision("");
    setSearchDateToSubmision("");
    setSelectFee("");
    setSearchData("");
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

              <tbody>
                {filterData.length !== 0
                  ? filterData.slice(startIndex, endIndex).map((f, i) =>
                      f.feeDetails
                        .filter((d) => d.state === true)
                        .map((s, index) => (
                          <tr key={i && index + 1}>
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
                  : data.slice(startIndex, endIndex).map((f, i) =>
                      f.feeDetails
                        .filter((d) => d.state === true)
                        .map((s, index) => (
                          <tr key={i && index + 1}>
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
            {/* <div className="download">
              <Button
                variant="primary"
                leftIcon={<img src={DownloadIcon} alt="" />}
              >
                Download statement
              </Button>
            </div> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecentTransaction;
