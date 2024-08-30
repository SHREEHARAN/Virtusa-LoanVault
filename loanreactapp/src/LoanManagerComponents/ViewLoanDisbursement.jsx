import React, { useState } from "react";
import "./ViewLoanDisbursement.css";
import { useNavigate } from "react-router-dom";
import { useQuery } from "react-query";
import axios from "axios";
import API_BASE_URL from "../apiConfig";
import LoanManagerNavbar from "./LoanManagerNavbar";

const ViewLoanDisbursement = () => {
  const navigate = useNavigate();
  const [showUserDetailsModal, setShowUserDetailsModal] = useState(false);
  const [showLoanDetailsModal, setShowLoanDetailsModal] = useState(false);
  const [selectedDisbursement, setSelectedDisbursement] = useState(null);
  const [searchValue, setSearchValue] = useState("");
  const [sortValue, setSortValue] = useState(0);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(5);
  const [maxRecords, setMaxRecords] = useState(1);

  const totalPages = Math.ceil(maxRecords / limit);

  const [availableDisbursements, setAvailableDisbursements] = useState([]);
  const updateAvailableDisbursements = (newDisbursements) => {
    setAvailableDisbursements(newDisbursements);
    setMaxRecords(newDisbursements.length);
  };

  const toggleSort = (order) => {
    setSortValue(order);

    const sortedDisbursements = [...availableDisbursements];
    sortedDisbursements.sort((a, b) => {
      if (order === 1) {
        return new Date(a.DisbursementDate) - new Date(b.DisbursementDate);
      } else if (order === -1) {
        return new Date(b.DisbursementDate) - new Date(a.DisbursementDate);
      }
      return 0;
    });

    updateAvailableDisbursements(sortedDisbursements);
  };

  const handlePagination = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
    }
  };

  const fetchAvailableDisbursements = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/loandisbursements`, {
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

  const { data, status, refetch } = useQuery(
    "availableDisbursements",
    fetchAvailableDisbursements
  );

  React.useEffect(() => {
    if (data) {
      updateAvailableDisbursements(data);
    }
  }, [data]);

  const filterDisbursements = (disbursements, search) => {
    const searchLower = search.toLowerCase();
    if (searchLower === "") return disbursements;
    return disbursements.filter(
      (disbursement) =>
        disbursement.DisbursementMethod.toLowerCase().includes(searchLower) ||
        disbursement.Remarks.toLowerCase().includes(searchLower)
    );
  };

  const handleSearchChange = (e) => {
    setSearchValue(e.target.value);
  };

  const openUserDetailsModal = (disbursement) => {
    setSelectedDisbursement(disbursement);
    setShowUserDetailsModal(true);
  };

  const openLoanDetailsModal = (disbursement) => {
    setSelectedDisbursement(disbursement);
    setShowLoanDetailsModal(true);
  };

  const closeUserDetailsModal = () => {
    setShowUserDetailsModal(false);
  };

  const closeLoanDetailsModal = () => {
    setShowLoanDetailsModal(false);
  };

  const handleEditClick = (loanDisbursementId, loanApplicationId) => {
    navigate(`/loanDisbursementForm/${loanApplicationId}/${loanDisbursementId}`);
  };

  return (
    <div id="parent">
      <LoanManagerNavbar />
      <div id="loanDisbursementBody">
        <h1>Loan Disbursements</h1>

        <div>
          <input
            id="searchBox"
            type="text"
            placeholder="Search..."
            value={searchValue}
            onChange={handleSearchChange}
          />
        </div>

        <table className="loan-disbursement-table">
          <thead>
            <tr>
              <th>Username</th>
              <th>Loan Type</th>
              <th>Disbursement Date</th>
              <th>Disbursement Amount</th>
              <th>Disbursement Method</th>
              <th>Status</th>
              <th>Remarks</th>
              <th>Action</th>
            </tr>
          </thead>
          {status === "loading" && (
            <tbody>
              <tr>
                <td colSpan={8}>Loading...</td>
              </tr>
            </tbody>
          )}
          {status === "error" && (
            <tbody>
              <tr>
                <td colSpan={8}>Error loading data</td>
              </tr>
            </tbody>
          )}
          {status === "success" &&
            filterDisbursements(availableDisbursements, searchValue).length ? (
            <tbody>
              {filterDisbursements(availableDisbursements, searchValue)
                .slice((page - 1) * limit, page * limit)
                .map((disbursement) => (
                  <tr key={disbursement.LoanDisbursementId}>
                    <td>{disbursement.LoanApplication.User.Username}</td>
                    <td>{disbursement.LoanApplication.Loan.LoanType}</td>
                    <td>{new Date(disbursement.DisbursementDate).toLocaleDateString()}</td>
                    <td>${disbursement.DisbursementAmount}</td>
                    <td>{disbursement.DisbursementMethod}</td>
                    <td>{disbursement.Status}</td>
                    <td>{disbursement.Remarks}</td>
                    <td>
                      <button
                        className="greenButton"
                        onClick={() => handleEditClick(disbursement.LoanDisbursementId, disbursement.LoanApplicationId)}
                        disabled={disbursement.Status !== "Pending"}
                        style={{
                        //   backgroundColor: disbursement.Status !== "Pending" ? "grey" : "initial",
                          cursor: disbursement.Status !== "Pending" ? "not-allowed" : "pointer",
                        }}
                      >
                        Edit
                      </button>
                      <button
                        className="viewuserdetailsbutton"
                        onClick={() => openUserDetailsModal(disbursement)}
                      >
                        Show User Details
                      </button>
                      <button
                        className="viewloandetailsbutton"
                        onClick={() => openLoanDetailsModal(disbursement)}
                      >
                        Show Loan Details
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          ) : (
            status === "success" && (
              <tbody>
                <tr>
                  <td colSpan={8} className="no-records-cell">
                    Oops! No records Found
                  </td>
                </tr>
              </tbody>
            )
          )}
        </table>
        {filterDisbursements(availableDisbursements, searchValue).length > 0 && (
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

      {showUserDetailsModal && selectedDisbursement && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>User Details</h2>
            <p><strong>Name:</strong> {selectedDisbursement.LoanApplication.User.Username}</p>
            <p><strong>Email:</strong> {selectedDisbursement.LoanApplication.User.Email}</p>
            <p><strong>Mobile Number:</strong> {selectedDisbursement.LoanApplication.User.MobileNumber}</p>
            <button className="close-modal" onClick={closeUserDetailsModal}>
              Close
            </button>
          </div>
        </div>
      )}

      {showLoanDetailsModal && selectedDisbursement && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Loan Details</h2>
            <p><strong>Loan Type:</strong> {selectedDisbursement.LoanApplication.Loan.LoanType}</p>
            <p><strong>Interest Rate:</strong> {selectedDisbursement.LoanApplication.Loan.InterestRate}%</p>
            <p><strong>Max Amount:</strong> ${selectedDisbursement.LoanApplication.Loan.MaxAmount}</p>
            <p><strong>Min Amount:</strong> ${selectedDisbursement.LoanApplication.Loan.MinAmount}</p>
            <p><strong>Description:</strong> {selectedDisbursement.LoanApplication.Loan.Description}</p>
            <p><strong>Processing Fee:</strong> ${selectedDisbursement.LoanApplication.Loan.ProcessingFee}</p>
            <p><strong>Grace Period:</strong> {selectedDisbursement.LoanApplication.Loan.GracePeriodMonths} months</p>
            <p><strong>Late Payment Fee:</strong> ${selectedDisbursement.LoanApplication.Loan.LatePaymentFee}</p>
            <button className="close-modal" onClick={closeLoanDetailsModal}>
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewLoanDisbursement;
