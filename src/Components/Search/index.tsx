import React, { useState } from "react";
import "./Search.scss";
import Button from "../Button";

import { ReactComponent as SearchIcon } from "../../assets/Icons/search.svg";
import { ReactComponent as FilterIcon } from "../../assets/Icons/Frame 84.svg";
import { ReactComponent as Dropdown } from "../../assets/Icons/chevron-down.svg";

import { gradeOptions } from "../../Pages/NewAdmission/data";

interface ISearch {
  setSearchData: React.Dispatch<React.SetStateAction<string>>;
  setSearchDateOfSubmision: React.Dispatch<React.SetStateAction<string>>;
  setSelectGrade: React.Dispatch<React.SetStateAction<string>>;
  setOpenGrade: React.Dispatch<React.SetStateAction<boolean>>;
  setSelectFee: React.Dispatch<React.SetStateAction<string>>;
  setOpenFee: React.Dispatch<React.SetStateAction<boolean>>;
  handleSearchFilter: () => Promise<void>;
  openFee: boolean;
  searchData: string;
  openGrade: boolean;
  selectGrade: string;
  selectFee: string;
}
const FeeDetails = [
  { value: "admissionFee", label: "Admission fee" },
  { value: "schoolFee", label: "School fee" },
  { value: "customFee", label: "Custom fee" },
  { value: "term1", label: "Term-1" },
  { value: "term2", label: "Term-2" },
  { value: "term3", label: "Term-3" },
];

const Search: React.FC<ISearch> = ({
  setSearchData,
  searchData,
  setSearchDateOfSubmision,
  openGrade,
  selectGrade,
  setOpenGrade,
  setSelectGrade,
  openFee,
  setSelectFee,
  setOpenFee,
  selectFee,
  handleSearchFilter,
}) => {
  const [openFilter, setOpenFilter] = useState(false);

  return (
    <div className={`search-container ${openFilter ? "open-filter" : ""}`}>
      <div className={`search-box ${openFilter ? "search-box-minimized" : ""}`}>
        <SearchIcon />
        <input
          value={searchData}
          type="text"
          placeholder="Search by receipt no, admission no, name"
          onChange={(e) => setSearchData(e.target.value)}
        />
      </div>
      {openFilter && (
        <div className="filter-options">
          <input
            type="date"
            placeholder="From"
            onChange={(e) => setSearchDateOfSubmision(e.target.value)}
          />

          <input type="date" placeholder="To" />
          <div className="drop-down">
            <div className="value" onClick={() => setOpenGrade((m) => !m)}>
              <p>{selectGrade ? selectGrade : "select grade"}</p> <Dropdown />
            </div>
            {openGrade && (
              <div className="option">
                {gradeOptions.map((f, i) => (
                  <p
                    onClick={() => [
                      setSelectGrade(f.value),
                      setOpenGrade(false),
                    ]}
                    key={i}
                  >
                    {f.label}
                  </p>
                ))}
              </div>
            )}
          </div>
          <div className="drop-down">
            <div className="value" onClick={() => setOpenFee((m) => !m)}>
              <p>{selectFee ? selectFee : "select fee"}</p> <Dropdown />
            </div>
            {openFee && (
              <div className="option">
                {FeeDetails.map((f, i) => (
                  <p
                    onClick={() => [setSelectFee(f.value), setOpenFee(false)]}
                    key={i}
                  >
                    {f.label}
                  </p>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
      {!openFilter && (
        <FilterIcon
          width={openFilter ? 100 : 40}
          height={openFilter ? 60 : 40}
          onClick={() => setOpenFilter((m) => !m)}
          style={{ cursor: "pointer" }}
        />
      )}
      {openFilter && (
        <Button variant="primary" onClick={() => [handleSearchFilter()]}>
          Apply
        </Button>
      )}
    </div>
  );
};

export default Search;
