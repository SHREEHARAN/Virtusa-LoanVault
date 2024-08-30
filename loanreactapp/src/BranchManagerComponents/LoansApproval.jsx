
import React, { useState } from "react";
import "./LoansApproval.css";
import { useNavigate } from "react-router-dom";
import { useQuery } from "react-query";
import axios from "axios";
import API_BASE_URL from "../apiConfig";
import BranchManagerNavbar from "./BranchManagerNavbar";

const LoansApproval = () => {
  const navigate = useNavigate();
  const [searchValue, setSearchValue] = useState("");
  const [sortValue, setSortValue] = useState(0);
  const [statusFilter, setStatusFilter] = useState("All"); // Added state for status filter
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

  const fetchLoanById = async (loanId) => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/loans/${loanId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (res.status === 200) {
        return res.data;
      } else {
        console.error("Error fetching loan data:", res);
        return null;
      }
    } catch (error) {
      console.error("Error fetching loan data:", error);
      return null;
    }
  };

  const updateLoanStatus = async (loanId, status) => {
    const loanData = await fetchLoanById(loanId);
    if (loanData) {
      loanData.Status = status; // Update the status in the loan data

      try {
        const response = await axios.put(
          `${API_BASE_URL}/api/loans/${loanId}`,
          loanData,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        if (response.status === 200) {
          refetch(); // Refresh data after status update
        } else {
          console.error("Error updating loan status:", response);
        }
      } catch (error) {
        console.error("Error updating loan status:", error);
      }
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
    return loans.filter(
      (loan) =>
        (statusFilter === "All" || loan.Status === statusFilter) &&
        (loan.LoanType.toLowerCase().includes(searchLower) ||
        loan.Description.toLowerCase().includes(searchLower))
    );
  };

  const handleSearchChange = (e) => {
    setSearchValue(e.target.value);
  };

  const handleStatusFilterChange = (e) => {
    setStatusFilter(e.target.value); // Update the status filter
  };

  return (
    <div id="parent">
      <BranchManagerNavbar />
      <div id="loanHomeBody">
        <h1>Loans</h1>

        <div>
          <input
            id="searchBox"
            type="text"
            placeholder="Search..."
            value={searchValue}
            onChange={handleSearchChange}
          />
          <label id='filter'>
          Filter by Status:
          <select value={statusFilter} onChange={handleStatusFilterChange}>
            <option value="All">All</option>
            <option value="Pending">Pending</option>
            <option value="Approved">Approved</option>
            <option value="Rejected">Rejected</option>
          </select>
          </label>
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
                      {loan.Status === "Approved" ? (
                        <button
                          className="redButton"
                          onClick={() => updateLoanStatus(loan.LoanId, "Rejected")}
                        >
                          Reject
                        </button>
                      ) : loan.Status === "Rejected" ? (
                        <button
                          className="greenButton"
                          onClick={() => updateLoanStatus(loan.LoanId, "Approved")}
                        >
                          Approve
                        </button>
                      ) : (
                        <>
                          <button
                            className="greenButton"
                            onClick={() => updateLoanStatus(loan.LoanId, "Approved")}
                          >
                            Approve
                          </button>
                          <button
                            className="redButton"
                            onClick={() => updateLoanStatus(loan.LoanId, "Rejected")}
                          >
                            Reject
                          </button>
                        </>
                      )}
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
    </div>
  );
};

export default LoansApproval;

