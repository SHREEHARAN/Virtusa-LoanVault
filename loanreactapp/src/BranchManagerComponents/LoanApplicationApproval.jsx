
import React, { useState, useEffect } from "react";
import "./LoanApplicationApproval.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import API_BASE_URL from "../apiConfig";
import BranchManagerNavbar from "./BranchManagerNavbar";

const LoanApplicationApproval = () => {
  const navigate = useNavigate();
  const [loanApplications, setLoanApplications] = useState([]);
  const [loanDisbursements, setLoanDisbursements] = useState([]);
  const [selectedDisbursement, setSelectedDisbursement] = useState(null);
  const [showDisbursementModal, setShowDisbursementModal] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  useEffect(() => {
    fetchLoanApplications();
    fetchLoanDisbursements();
  }, []);

  const fetchLoanApplications = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/loanapplications`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (res.status === 200) {
        setLoanApplications(res.data.filter(application =>
          ["LoanManager Approved", "BranchManager Approved", "BranchManager Rejected"].includes(application.ApplicationStatus)
        ));
      } else {
        navigate("/error");
      }
    } catch (error) {
      navigate("/error");
    }
  };

  const fetchLoanDisbursements = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/loandisbursements`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (res.status === 200) {
        setLoanDisbursements(res.data);
      } else {
        navigate("/error");
      }
    } catch (error) {
      navigate("/error");
    }
  };

  const getDisbursementByApplicationId = (applicationId) => {
    return loanDisbursements.find(
      (disbursement) => disbursement.LoanApplicationId === applicationId
    );
  };

  const handleSearchChange = (e) => {
    setSearchValue(e.target.value);
  };

  const handleStatusFilterChange = (e) => {
    setStatusFilter(e.target.value);
  };

  const filterLoanApplications = (applications, search, status) => {
    const searchLower = search.toLowerCase();
    const filteredBySearch = searchLower === "" ? applications : applications.filter(
      (application) =>
        application.Loan.LoanType.toLowerCase().includes(searchLower) ||
        application.User.Username.toLowerCase().includes(searchLower)
    );

    if (status === "All") {
      return filteredBySearch;
    }

    return filteredBySearch.filter(application => application.ApplicationStatus === status);
  };

  const handleViewDisbursement = (applicationId) => {
    const disbursement = getDisbursementByApplicationId(applicationId);
    if (disbursement) {
      setSelectedDisbursement(disbursement);
      setShowDisbursementModal(true);
    }
  };

  const closeDisbursementModal = () => {
    setShowDisbursementModal(false);
    setSelectedDisbursement(null);
  };

  const updateDisbursementStatus = async (disbursementId, applicationId, status , obj) => {
    try {
      const disbursementResponse = await axios.get(
        `${API_BASE_URL}/api/loandisbursements/${disbursementId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      const applicationResponse = await axios.get(
        `${API_BASE_URL}/api/loanapplications/${applicationId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (disbursementResponse.status === 200 && applicationResponse.status === 200) {
        const updatedDisbursement = {
          ...disbursementResponse.data,
          Status: status,
        };

        const updatedApplication = {
          ...applicationResponse.data,
          ApplicationStatus: status === "Approved" ? "BranchManager Approved" : "BranchManager Rejected",
        };

        const disbursementUpdateResponse = await axios.put(
          `${API_BASE_URL}/api/loandisbursements/${disbursementId}`,
          updatedDisbursement,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        const applicationUpdateResponse = await axios.put(
          `${API_BASE_URL}/api/loanapplications/${applicationId}`,
          updatedApplication,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        if (disbursementUpdateResponse.status === 200 && applicationUpdateResponse.status === 200) {
          fetchLoanApplications(); // Refresh data after status update
          fetchLoanDisbursements(); // Refresh disbursements data
          closeDisbursementModal(); // Close the modal


        } else {
          console.error("Error updating status:", disbursementUpdateResponse, applicationUpdateResponse);
        }

       console.log("obj", obj);

      //  let now = new Date();

      //  let formattedDate = now.toISOString(); // ISO 8601 format, which is universally accepted
      
      // // Prepare the notification object
      // let nobject = {
      //   userId: obj.LoanApplication.User.UserId,
      //   loanId: obj.LoanApplication.Loan.LoanId,
      //   loanApplicationId: obj.LoanApplication.LoanApplicationId,
      //   loanDisbursementId: obj.LoanDisbursementId,
      //   message: status === "Approved" 
      //     ? `Your loan application | ${obj.LoanApplication.Loan.LoanType} | Approved` 
      //     : `Your loan application | ${obj.LoanApplication.Loan.LoanType} | Rejected`,
      //   isRead: false,
      //   createdAt: formattedDate // Date in Indian format
      // };

   let now = new Date();
      let utcOffset = now.getTimezoneOffset() * 60000; // Timezone offset in milliseconds
      let istTime = new Date(now.getTime() + utcOffset + (5.5 * 60 * 60 * 1000)); // Adding 5.5 hours to UTC
      let formattedDate = istTime.toISOString(); // This will give you the correct IST time in ISO format

      let nobject = {
          userId: obj.LoanApplication.User.UserId,
          loanId: obj.LoanApplication.Loan.LoanId,
          loanApplicationId: obj.LoanApplication.LoanApplicationId,
          loanDisbursementId: obj.LoanDisbursementId,
          message: status === "Approved" 
              ? `Your loan application | ${obj.LoanApplication.Loan.LoanType} | Approved` 
              : `Your loan application | ${obj.LoanApplication.Loan.LoanType} | Rejected`,
          isRead: false,
          createdAt: formattedDate // IST time in ISO format
      };

          const res =   await axios.post(
            `${API_BASE_URL}/api/notifications`,
            nobject,
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            }
          );

          console.log("notification", res , nobject);
        
      } else {
        console.error("Error fetching data for update:", disbursementResponse, applicationResponse);
      }

    } catch (error) {
      console.error("Error updating disbursement status:", error);
    }
  };

  return (
    <div id="parent">
      <BranchManagerNavbar />
      <div id="loanApplicationBody">
        <h1>Loan Applications</h1>

        <div>
          <input
            id="searchBox"
            type="text"
            placeholder="Search by Loan Type or Username..."
            value={searchValue}
            onChange={handleSearchChange}
          />
          
          <label id='filter'>
            Filter by Status:
            <select
              value={statusFilter}
              onChange={handleStatusFilterChange}
            >
              <option value="All">All</option>
              <option value="LoanManager Approved">LoanManager Approved</option>
              <option value="BranchManager Approved">BranchManager Approved</option>
              <option value="BranchManager Rejected">BranchManager Rejected</option>
            </select>
          </label>
        </div>

        <table className="loan-application-table">
          <thead>
            <tr>
              <th>Username</th>
              <th>Loan Type</th>
              <th>Application Date</th>
              <th>Loan Amount</th>
              <th>Tenure (Months)</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filterLoanApplications(loanApplications, searchValue, statusFilter).length === 0 ? (
              <tr>
                <td colSpan="7" className="no-records">Oops! No records found</td>
              </tr>
            ) : (
              filterLoanApplications(loanApplications, searchValue, statusFilter).map((application) => (
                <tr key={application.LoanApplicationId}>
                  <td>{application.User.Username}</td>
                  <td>{application.Loan.LoanType}</td>
                  <td>{new Date(application.ApplicationDate).toLocaleDateString()}</td>
                  <td>${application.LoanAmount}</td>
                  <td>{application.TenureMonths}</td>
                  <td>{application.ApplicationStatus}</td>
                  <td>
                    <button
                      className="viewdisbursementbutton"
                      onClick={() => handleViewDisbursement(application.LoanApplicationId)}
                    >
                      View Disbursement
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {showDisbursementModal && selectedDisbursement && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Loan Disbursement Details</h2>
            <p><strong>Disbursement Date:</strong> {new Date(selectedDisbursement.DisbursementDate).toLocaleDateString()}</p>
            <p><strong>Disbursement Amount:</strong> ${selectedDisbursement.DisbursementAmount}</p>
            <p><strong>Disbursement Method:</strong> {selectedDisbursement.DisbursementMethod}</p>
            <p><strong>Status:</strong> {selectedDisbursement.Status}</p>
            <p><strong>Remarks:</strong> {selectedDisbursement.Remarks}</p>
            {selectedDisbursement.Status === "Pending" ? (
              <>
                <button
                  className="greenButton"
                  id="greenButton"
                  onClick={() =>
                    updateDisbursementStatus(
                      selectedDisbursement.LoanDisbursementId,
                      selectedDisbursement.LoanApplicationId,
                      "Approved",
                      selectedDisbursement
                    )
                  }
                >
                  Approve
                </button>
                <button
                  className="redButton"
                  id="redButton"
                  onClick={() =>
                    updateDisbursementStatus(
                      selectedDisbursement.LoanDisbursementId,
                      selectedDisbursement.LoanApplicationId,
                      "Rejected",
                      selectedDisbursement
                    )
                  }
                >
                  Reject
                </button>
              </>
            ) : selectedDisbursement.Status === "Approved" ? (
              <button
                className="redButton"
                id="redButton"
                onClick={() =>
                  updateDisbursementStatus(
                    selectedDisbursement.LoanDisbursementId,
                    selectedDisbursement.LoanApplicationId,
                    "Rejected",
                    selectedDisbursement
                  )
                }
              >
                Reject
              </button>
            ) : (
              <button
                className="greenButton"
                id="greenButton"
                onClick={() =>
                  updateDisbursementStatus(
                    selectedDisbursement.LoanDisbursementId,
                    selectedDisbursement.LoanApplicationId,
                    "Approved",
                    selectedDisbursement
                  )
                }
              >
                Approve
              </button>
            )}
            <button className="close-modal" onClick={closeDisbursementModal}>
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default LoanApplicationApproval;