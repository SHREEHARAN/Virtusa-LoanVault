import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useSelector } from 'react-redux';
import "./AppliedLoans.css";
import API_BASE_URL from '../apiConfig';
import CustomerNavbar from './CustomerNavbar';

const AppliedLoans = () => {
    const navigate = useNavigate();
    const [showDeletePopup, setShowDeletePopup] = useState(false);
    const [loanToDelete, setLoanToDelete] = useState(null);
    const [appliedLoans, setAppliedLoans] = useState([]);
    const [filteredLoans, setFilteredLoans] = useState([]);
    const [searchValue, setSearchValue] = useState("");
    const [sortValue, setSortValue] = useState(0);
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(5);
    const [maxRecords, setMaxRecords] = useState(1);
    const [selectedLoan, setSelectedLoan] = useState(null);
    const [isAccountModal, setIsAccountModal] = useState(false);
    const [accountDetails, setAccountDetails] = useState({
        accountHolder: "",
        accountNumber: "",
        ifscCode: ""
    });
    const [errors, setErrors] = useState({}); // State to track validation errors
    const [showSuccessModal, setShowSuccessModal] = useState(false); // New state to track success modal visibility

    const userId = useSelector((state) => state.user.userId);

    useEffect(() => {
        fetchData();
    }, []);

    async function fetchData() {
        try {
            const response = await axios.get(
                `${API_BASE_URL}/api/loanapplications/user/${userId}`,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                }
            );
            if (response.status === 200) {
                setAppliedLoans(response.data);
                setFilteredLoans(response.data);
                setMaxRecords(response.data.length);
            }
        } catch (error) {
            console.error("Error fetching applied loans:", error);
            navigate("/error");
        }
    }

    const totalPages = Math.ceil(maxRecords / limit);

    const filterLoans = (search) => {
        const searchLower = search.toLowerCase();
        if (searchLower === "") return appliedLoans;
        return appliedLoans.filter((loan) =>
            loan.Loan.LoanType.toLowerCase().includes(searchLower)
        );
    };

    const handleSearchChange = (e) => {
        const inputValue = e.target.value;
        setSearchValue(inputValue);
        const filteredLoans = filterLoans(inputValue);
        setMaxRecords(filteredLoans.length);
        setFilteredLoans(filteredLoans);
    };

    const toggleSort = (order) => {
        setSortValue(order);

        const sortedLoans = [...filteredLoans].sort((a, b) => {
            return order === 1
                ? new Date(a.ApplicationDate) - new Date(b.ApplicationDate)
                : order === -1
                ? new Date(b.ApplicationDate) - new Date(a.ApplicationDate)
                : 0;
        });

        setFilteredLoans(sortedLoans);
    };

    const handlePagination = (newPage) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setPage(newPage);
        }
    };

    const handleDeleteClick = (loanApplicationId) => {
        setLoanToDelete(loanApplicationId);
        setShowDeletePopup(true);
    };

    async function handleConfirmDelete() {
        try {
            const response = await axios.delete(
                `${API_BASE_URL}/api/loanapplications/${loanToDelete}`,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                }
            );
            if (response.status === 200) {
                fetchData();
            }
            closeDeletePopup();
        } catch (error) {
            console.error("Error deleting loan application:", error);
            navigate("/error");
        }
    }

    const closeDeletePopup = () => {
        setLoanToDelete(null);
        setShowDeletePopup(false);
    };

    const validateAccountDetails = () => {
        let validationErrors = {};

        if (!accountDetails.accountHolder) {
            validationErrors.accountHolder = "Account holder name is required.";
        }

        if (!accountDetails.accountNumber) {
            validationErrors.accountNumber = "Account number is required.";
        } else if (!/^\d{9,18}$/.test(accountDetails.accountNumber)) {
            validationErrors.accountNumber = "Account number must be between 9 and 18 digits.";
        }

        if (!accountDetails.ifscCode) {
            validationErrors.ifscCode = "IFSC code is required.";
        } else if (!/^[A-Z]{4}0[A-Z0-9]{6}$/.test(accountDetails.ifscCode)) {
            validationErrors.ifscCode = "Invalid IFSC code.";
        }

        return validationErrors;
    };

    const handleAccountDetailsSubmit = async () => {
        const validationErrors = validateAccountDetails();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        try {
            const updatedLoan = {
                ...selectedLoan,
                AccountHolder: accountDetails.accountHolder,
                AccountNumber: accountDetails.accountNumber,
                IFSCCode: accountDetails.ifscCode,
            };
            const response = await axios.put(
                `${API_BASE_URL}/api/loanapplications/${selectedLoan.LoanApplicationId}`,
                updatedLoan,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                }
            );
            if (response.status === 200) {
                setSelectedLoan(null);
                setIsAccountModal(false); // Reset modal type
                setShowSuccessModal(true); // Show success modal
                fetchData();
            }
        } catch (error) {
            console.error("Error updating loan application:", error);
            navigate("/error");
        }
    };

    const openAccountModal = (loan) => {
        setSelectedLoan(loan);
        setIsAccountModal(true); // Set modal type to account form
        setAccountDetails({
            accountHolder: loan.AccountHolder || "",
            accountNumber: loan.AccountNumber || "",
            ifscCode: loan.IFSCCode || ""
        });
        setErrors({}); // Reset errors
    };

    const openLoanDetailsModal = (loan) => {
        setSelectedLoan(loan);
        setIsAccountModal(false); // Set modal type to loan details
    };

    const closeModal = () => {
        setSelectedLoan(null);
        setShowSuccessModal(false); // Close success modal if open
    };

    const renderActionButtons = (loan) => {
        // Disable "Add Account Details" and "Delete" buttons if BranchManager has approved or rejected
        const isFinalStage = loan.ApplicationStatus.includes("BranchManager");

        return (
            <>
                <button
                    className="viewLoanDetailsButton"
                    onClick={() => openLoanDetailsModal(loan)}
                >
                    View Loan Details
                </button>
                <button
                    className="accountDetailsButton"
                    onClick={() => openAccountModal(loan)}
                    disabled={loan.ApplicationStatus !== "LoanManager Approved" || isFinalStage}
                    style={{
                        backgroundColor: loan.ApplicationStatus !== "LoanManager Approved" || isFinalStage ? "grey" : "initial",
                        cursor: loan.ApplicationStatus !== "LoanManager Approved" || isFinalStage ? "not-allowed" : "pointer"
                    }}
                >
                    Add Account Details
                </button>
                <button
                    id='redButton'
                    onClick={() => handleDeleteClick(loan.LoanApplicationId)}
                    disabled={loan.ApplicationStatus !== "Pending" || isFinalStage}
                    style={{
                        backgroundColor: loan.ApplicationStatus !== "Pending" || isFinalStage ? "grey" : "initial",
                        color: "black",
                        cursor: loan.ApplicationStatus !== "Pending" || isFinalStage ? "not-allowed" : "pointer",
                        // pointerEvents: loan.ApplicationStatus !== "Pending" || isFinalStage ? "none" : "auto"
                    }}
                >
                    Delete
                </button>
            </>
        );
    };

    return (
        <div>
            <CustomerNavbar />
            <div id="loanHomeBody" className={showDeletePopup || selectedLoan || showSuccessModal ? "page-content blur" : "page-content"}>
                <h1>Applied Loans</h1>
                <input
                    id='searchBox1'
                    type="text"
                    placeholder="Search..."
                    value={searchValue}
                    onChange={handleSearchChange}
                />

                <table>
                    <thead>
                        <tr>
                            <th>Loan Name</th>
                            <th>Description</th>
                            <th>
                                <div id="submissionDate">Submission Date</div>
                                <div>
                                    <button
                                        className="sortButtons"
                                        onClick={() => toggleSort(1)}
                                    >
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
                            <th>Status</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    {filteredLoans.length ? (
                        <tbody>
                            {filteredLoans
                                .slice((page - 1) * limit, page * limit)
                                .map((loan) => (
                                    <tr key={loan.LoanApplicationId}>
                                        <td>{loan.Loan.LoanType}</td>
                                        <td>{loan.Loan.Description}</td>
                                        <td>
                                            {new Date(loan.ApplicationDate)
                                                .toISOString()
                                                .split('T')[0]}
                                        </td>
                                        <td>{loan.ApplicationStatus}</td>
                                        <td>
                                            {renderActionButtons(loan)}
                                        </td>
                                    </tr>
                                ))}
                        </tbody>
                    ) : (
                        <tbody>
                            <tr>
                                <td colSpan="5" className='no-records-cell'>Oops! No Records Found</td>
                            </tr>
                        </tbody>
                    )}
                </table>

                {filteredLoans.length > 0 && (
                    <div>
                        <button
                            onClick={() => handlePagination(page - 1)}
                            disabled={page === 1}
                        >
                            Prev
                        </button>
                        <span>
                            Page {page} of {totalPages}
                        </span>
                        <button
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

            {selectedLoan && (
                <div className="modal">
                    <div className="modal-content">
                        {isAccountModal ? (
                            <>
                                <h3>Add Account Details</h3>
                                <div className="form-group">
                                    <label>Account Holder:</label>
                                    <input
                                        type="text"
                                        value={accountDetails.accountHolder}
                                        onChange={(e) =>
                                            setAccountDetails({ ...accountDetails, accountHolder: e.target.value })
                                        }
                                    />
                                    {errors.accountHolder && <div className="error">{errors.accountHolder}</div>}
                                </div>
                                <div className="form-group">
                                    <label>Account Number:</label>
                                    <input
                                        type="text"
                                        value={accountDetails.accountNumber}
                                        onChange={(e) =>
                                            setAccountDetails({ ...accountDetails, accountNumber: e.target.value })
                                        }
                                    />
                                    {errors.accountNumber && <div className="error">{errors.accountNumber}</div>}
                                </div>
                                <div className="form-group">
                                    <label>IFSC Code:</label>
                                    <input
                                        type="text"
                                        value={accountDetails.ifscCode}
                                        onChange={(e) =>
                                            setAccountDetails({ ...accountDetails, ifscCode: e.target.value })
                                        }
                                    />
                                    {errors.ifscCode && <div className="error">{errors.ifscCode}</div>}
                                </div>
                                <button onClick={handleAccountDetailsSubmit}>Submit</button>
                                <button onClick={closeModal}>Cancel</button>
                            </>
                        ) : (
                            <>
                                <h3>Loan Details</h3>
                                <p><strong>Loan Type:</strong> {selectedLoan.Loan.LoanType}</p>
                                <p><strong>Interest Rate:</strong> {selectedLoan.Loan.InterestRate}%</p>
                                <p><strong>Max Amount:</strong> ${selectedLoan.Loan.MaxAmount}</p>
                                <p><strong>Description:</strong> {selectedLoan.Loan.Description}</p>
                                <p><strong>Processing Fee:</strong> ${selectedLoan.Loan.ProcessingFee}</p>
                                <p><strong>Grace Period:</strong> {selectedLoan.Loan.GracePeriodMonths} months</p>
                                <p><strong>Late Payment Fee:</strong> ${selectedLoan.Loan.LatePaymentFee}</p>
                                <button onClick={closeModal}>Close</button>
                            </>
                        )}
                    </div>
                </div>
            )}

            {showSuccessModal && (
                <div className="modal">
                    <div className="modal-content">
                        <h3>Success</h3>
                        <p>Account details have been successfully added!</p>
                        <button onClick={closeModal}>Close</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AppliedLoans;
