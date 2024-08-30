import React, { useState } from "react";
import "./ViewLoans.css";
import { useNavigate } from "react-router-dom";
import { useQuery } from "react-query";
import axios from "axios";
import API_BASE_URL from "../apiConfig";
import LoanManagerNavbar from "./LoanManagerNavbar";

const ViewLoans = () => {
  const navigate = useNavigate();
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [loanToDelete, setLoanToDelete] = useState(null);
  const [searchValue, setSearchValue] = useState("");
  const [sortValue, setSortValue] = useState(0);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(5);
  const [maxRecords, setMaxRecords] = useState(1);

  const totalPages = Math.ceil(maxRecords / limit);

  const [availableLoans, setAvailableLoans] = useState([]);
  const updateAvailableLoans = (newLoans) => {
    setAvailableLoans(newLoans);
    setMaxRecords(newLoans.length);
  };

  const toggleSort = (order) => {
    setSortValue(order);

    const sortedLoans = [...availableLoans];
    sortedLoans.sort((a, b) => {
      if (order === 1) {
        return a.InterestRate - b.InterestRate;
      } else if (order === -1) {
        return b.InterestRate - a.InterestRate;
      }
      return 0;
    });

    updateAvailableLoans(sortedLoans);
  };

  const handlePagination = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
    }
  };

  const handleDeleteClick = (loanId) => {
    setLoanToDelete(loanId);
    setShowDeletePopup(true);
  };

  const handleConfirmDelete = async () => {
    try {
      if (loanToDelete) {
        const response = await axios.delete(
          `${API_BASE_URL}/api/loans/${loanToDelete}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        if (response.status === 200) {
          refetch();
        } else {
          console.log("Error");
        }
        closeDeletePopup();
      }
    } catch (error) {
      console.log("Error :", error);
    }
  };

  const closeDeletePopup = () => {
    setLoanToDelete(null);
    setShowDeletePopup(false);
  };

  const fetchAvailableLoans = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/loans`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (res.status === 200) {
        return res.data;
      } else {
        navigate("/error");
      }
    } catch (error) {
      navigate("/error");
    }
  };

  const { data, status, refetch } = useQuery("availableLoans", fetchAvailableLoans);

  React.useEffect(() => {
    if (data) {
      updateAvailableLoans(data);
    }
  }, [data]);

  const filterLoans = (loans, search) => {
    const searchLower = search.toLowerCase();
    if (searchLower === "") return loans;
    return loans.filter(
      (loan) =>
        loan.LoanType.toLowerCase().includes(searchLower) ||
        loan.Description.toLowerCase().includes(searchLower)
    );
  };

  const handleSearchChange = (e) => {
    setSearchValue(e.target.value);
  };

  return (
    <div id="parent">
      <LoanManagerNavbar />
      <div id="loanHomeBody" className={showDeletePopup ? "blur" : ""}>
        <h1>Loans</h1>

        <div>
          <input
            id="searchBox"
            type="text"
            placeholder="Search..."
            value={searchValue}
            onChange={handleSearchChange}
          />
        </div>

        <table className="loan-table">
          <thead>
            <tr>
              <th>Loan Type</th>
              <th>Maximum Amount</th>
              <th>Minimum Amount</th>
              <th>
                <div id="interestrate">Interest Rate</div>
                <div>
                  <button className="sortButtons" onClick={() => toggleSort(1)}>
                    ⬆️
                  </button>
                  <button
                    className="sortButtons"
                    onClick={() => toggleSort(-1)}
                  >
                    ⬇️
                  </button>
                </div>
              </th>
              <th>Minimum Tenure (Months)</th>
              <th>Maximum Tenure (Months)</th>
              <th>Description</th>
              <th>Status</th>
              <th>Processing Fee</th>
              <th>Prepayment Penalty (%)</th>
              <th>Grace Period (Months)</th>
              <th>Late Payment Fee</th>
              <th>Action</th>
            </tr>
          </thead>
          {status === "loading" && (
            <tbody>
              <tr>
                <td colSpan={13}>Loading...</td>
              </tr>
            </tbody>
          )}
          {status === "error" && (
            <tbody>
              <tr>
                <td colSpan={13}>Error loading data</td>
              </tr>
            </tbody>
          )}
          {status === "success" && filterLoans(availableLoans, searchValue).length ? (
            <tbody>
              {filterLoans(availableLoans, searchValue)
                .slice((page - 1) * limit, page * limit)
                .map((loan) => (
                  <tr key={loan.LoanId}>
                    <td>{loan.LoanType}</td>
                    <td>${loan.MaxAmount}</td>
                    <td>${loan.MinAmount}</td>
                    <td>{loan.InterestRate}%</td>
                    <td>{loan.MinTenureMonths}</td>
                    <td>{loan.MaxTenureMonths}</td>
                    <td>{loan.Description}</td>
                    <td>{loan.Status}</td>
                    <td>${loan.ProcessingFee}</td>
                    <td>{loan.PrepaymentPenalty}%</td>
                    <td>{loan.GracePeriodMonths}</td>
                    <td>${loan.LatePaymentFee}</td>
                    <td>
                      <button
                        className="viewloanbutton"
                        id="greenButton"
                        onClick={() => navigate("/newloan/" + loan.LoanId)}
                        disabled={loan.Status !== "Pending"}
                        style={{
                          backgroundColor: loan.Status !== "Pending" ? "grey" : "initial",
                          cursor: loan.Status !== "Pending" ? "not-allowed" : "pointer",
                        }}
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteClick(loan.LoanId)}
                        id="deleteButton"
                        disabled={loan.Status !== "Pending"}
                        style={{
                          backgroundColor: loan.Status !== "Pending" ? "grey" : "initial",
                          cursor: loan.Status !== "Pending" ? "not-allowed" : "pointer",
                        }}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          ) : (
            status === "success" && (
              <tbody>
                <tr>
                  <td colSpan={13} className="no-records-cell">
                    Oops! No records Found
                  </td>
                </tr>
              </tbody>
            )
          )}
        </table>
        {filterLoans(availableLoans, searchValue).length > 0 && (
          <div>
            <button
              className="viewloanbutton"
              onClick={() => handlePagination(page - 1)}
              disabled={page === 1}
            >
              Prev
            </button>
            <span>
              Page {page} of {totalPages}
            </span>
            <button
              className="viewloanbutton"
              onClick={() => handlePagination(page + 1)}
              disabled={page === totalPages}
            >
              Next
            </button>
          </div>
        )}
      </div>

      {showDeletePopup && (
        <div className="delete-popup">
          <p>Are you sure you want to delete?</p>
          <button onClick={handleConfirmDelete}>Yes, Delete</button>
          <button onClick={closeDeletePopup}>Cancel</button>
        </div>
      )}
    </div>
  );
};

export default ViewLoans;
