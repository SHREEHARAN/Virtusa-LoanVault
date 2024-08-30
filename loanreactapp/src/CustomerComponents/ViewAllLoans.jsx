import React, { useState, useEffect } from "react";
import "./ViewAllLoans.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { setLoanInfo } from "../loanSlice";
import API_BASE_URL from "../apiConfig";
import CustomerNavbar from "./CustomerNavbar";

const ViewAllLoans = () => {
  const navigate = useNavigate();
  const [availableLoans, setAvailableLoans] = useState([]);
  const [filteredLoans, setFilteredLoans] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const [sortValue, setSortValue] = useState(0);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(5);
  const [appliedLoans, setAppliedLoans] = useState([]);
  const userId = useSelector((state) => state.user.userId);
  const dispatch = useDispatch();

  useEffect(() => {
    fetchAppliedLoans();
    fetchData();
  }, []);

  async function fetchAppliedLoans() {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/api/loanapplications/user/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      console.log("Response" , response);

      if (response.status === 200) {
        setAppliedLoans(response.data);
      }
    } catch (error) {
      console.log("Error fetching applied loans:", error);
      // navigate("/error");
    }
  }

  async function fetchData() {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/loans`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (response.status === 200) {
        // Filter out loans that are not "Approved"
        const approvedLoans = response.data.filter(
          (loan) => loan.Status === "Approved"
        );
        setAvailableLoans(approvedLoans);
        setFilteredLoans(approvedLoans);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      navigate("/error");
    }
  }

  const totalPages = Math.ceil(filteredLoans.length / limit);

  const filterLoans = (search) => {
    const searchLower = search.toLowerCase();
    if (searchLower === "") return availableLoans;
    return availableLoans.filter((loan) =>
      loan.LoanType.toLowerCase().includes(searchLower)
    );
  };

  const handleSearchChange = (e) => {
    const inputValue = e.target.value;
    setSearchValue(inputValue);
    const filteredLoans = filterLoans(inputValue);
    setFilteredLoans(filteredLoans);
  };

  const toggleSort = (order) => {
    setSortValue(order);

    const sortedLoans = [...filteredLoans].sort((a, b) => {
      if (order === 1) {
        return a.InterestRate - b.InterestRate;
      } else if (order === -1) {
        return b.InterestRate - a.InterestRate;
      } else {
        return 0;
      }
    });

    setFilteredLoans(sortedLoans);
  };

  const handlePagination = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
    }
  };

  const handleApplyClick = (loan) => {
    const isLoanApplied = appliedLoans.some(
      (appliedLoan) => appliedLoan.LoanId === loan.LoanId
    );

    if (isLoanApplied) {
      alert("Loan is already applied.");
    } else {
      localStorage.setItem("LoanId", loan.LoanId);
      dispatch(
        setLoanInfo({
          LoanId: loan.LoanId,
          LoanType: loan.LoanType,
        })
      );
      navigate("/loanApplicationForm");
    }
  };

  return (
    <div>
      <CustomerNavbar />
      <div id="loanHomeBody">
        <h1>Available Loans</h1>

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
              <th>Description</th>
              <th>
                <div id="interestrate">Interest Rate</div>
                <div>
                  <button
                    className="sortButtons"
                    role="ascending-button"
                    onClick={() => toggleSort(1)}
                  >
                    ⬆️
                  </button>
                  <button
                    className="sortButtons"
                    role="descending-button"
                    onClick={() => toggleSort(-1)}
                  >
                    ⬇️
                  </button>
                </div>
              </th>
              <th>Maximum Amount</th>
              <th>Minimum Amount</th>
              <th>Minimum Tenure (Months)</th>
              <th>Maximum Tenure (Months)</th>
              <th>Processing Fee</th>
              <th>Prepayment Penalty (%)</th>
              <th>Grace Period (Months)</th>
              <th>Late Payment Fee</th>
              <th>Action</th>
            </tr>
          </thead>
          {filteredLoans.length ? (
            <tbody>
              {filteredLoans
                .slice((page - 1) * limit, page * limit)
                .map((loan) => (
                  <tr key={loan.LoanId}>
                    <td>{loan.LoanType}</td>
                    <td>{loan.Description}</td>
                    <td>{loan.InterestRate}%</td>
                    <td>${loan.MaxAmount}</td>
                    <td>${loan.MinAmount}</td>
                    <td>{loan.MinTenureMonths}</td>
                    <td>{loan.MaxTenureMonths}</td>
                    <td>${loan.ProcessingFee}</td>
                    <td>{loan.PrepaymentPenalty}%</td>
                    <td>{loan.GracePeriodMonths}</td>
                    <td>${loan.LatePaymentFee}</td>
                    <td>
                      {appliedLoans.some(
                        (appliedLoan) =>
                          appliedLoan.LoanId === loan.LoanId
                      ) ? (
                        "Applied Successfully"
                      ) : (
                        <button
                          className="viewallloansbutton"
                          id="greenButton"
                          onClick={() => handleApplyClick(loan)}
                        >
                          Apply
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
            </tbody>
          ) : (
            <tbody>
              <tr>
                <td colSpan={12} className="no-records-cell">
                  Oops! No records Found
                </td>
              </tr>
            </tbody>
          )}
        </table>
        {filteredLoans.length > 0 && (
          <div>
            <button
              className="viewallloansbutton"
              onClick={() => handlePagination(page - 1)}
              disabled={page === 1}
            >
              Prev
            </button>
            <span>
              Page {page} of {totalPages}
            </span>
            <button
              className="viewallloansbutton"
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

export default ViewAllLoans;
