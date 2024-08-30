// import React, { useState, useEffect } from 'react';
// import './LoanRequest.css';
// import { useNavigate } from 'react-router-dom';
// import axios from 'axios';
// import API_BASE_URL from '../apiConfig';
// import LoanManagerNavbar from './LoanManagerNavbar';

// const LoanRequest = () => {
//     const [loanRequests, setLoanRequests] = useState([]);
//     const [searchValue, setSearchValue] = useState("");
//     const [sortValue, setSortValue] = useState(0);
//     const [statusFilter, setStatusFilter] = useState("-1");
//     const [page, setPage] = useState(1);
//     const [pagesize, setPagesize] = useState(2);
//     const [expandedRow, setExpandedRow] = useState(null);
//     const [showModal, setShowModal] = useState(false);
//     const [selectedLoan, setSelectedLoan] = useState(null);
//     const navigate = useNavigate();

//     useEffect(() => {
//         fetchData();
//     }, []);

//     async function fetchData() {
//         try {
//             const response = await axios.get(`${API_BASE_URL}/api/loanapplications`, {
//                 headers: {
//                     Authorization: `Bearer ${localStorage.getItem("token")}`,
//                 },
//             });
//             console.log("fetchdata loanapplications", response);
//             if (response.status === 200) {
//                 setLoanRequests(response.data);
//             }
//         } catch (error) {
//             console.error("Error fetching loan requests:", error);
//             navigate("/error");
//         }
//     }

//     const filteredLoanRequests = loanRequests
//         .filter((request) =>
//             statusFilter === "-1" || request.ApplicationStatus.toLowerCase() === statusFilter.toLowerCase()
//         )
//         .filter((request) =>
//             request.Loan?.LoanType.toLowerCase().includes(searchValue.toLowerCase())
//         );

//     const sortedLoanRequests = filteredLoanRequests.sort((a, b) => {
//         if (sortValue === 1) {
//             return new Date(a.ApplicationDate) - new Date(b.ApplicationDate);
//         } else if (sortValue === -1) {
//             return new Date(b.ApplicationDate) - new Date(a.ApplicationDate);
//         }
//         return 0;
//     });

//     const paginatedLoanRequests = sortedLoanRequests.slice(
//         (page - 1) * pagesize,
//         page * pagesize
//     );

//     const handleSearchChange = (e) => {
//         setSearchValue(e.target.value);
//     };

//     const toggleSort = (order) => {
//         setSortValue(order);
//     };

//     const handleFilterChange = (e) => {
//         setStatusFilter(e.target.value);
//     };

//     const handleApprove = async (request) => {
//         if (!request) {
//             console.error("No loan selected for approval.");
//             return;
//         }

//         const requestObject = {
//             ...request,
//             ApplicationStatus: "LoanManager Approved", // Approving the loan
//         };

//         try {
//             const response = await axios.put(
//                 `${API_BASE_URL}/api/loanapplications/${request.LoanApplicationId}`,
//                 requestObject,
//                 {
//                     headers: {
//                         Authorization: `Bearer ${localStorage.getItem("token")}`,
//                     },
//                 }
//             );
//             if (response.status === 200) {
//                 fetchData(); // Refresh data after approval
//             }
//         } catch (error) {
//             console.error("Error approving loan application:", error);
//         }
//     };

//     const handleReject = async (request) => {
//         if (!request) {
//             console.error("No loan selected for rejection.");
//             return;
//         }

//         const requestObject = {
//             ...request,
//             ApplicationStatus: "LoanManager Rejected", // Rejecting the loan
//         };

//         try {
//             const response = await axios.put(
//                 `${API_BASE_URL}/api/loanapplications/${request.LoanApplicationId}`,
//                 requestObject,
//                 {
//                     headers: {
//                         Authorization: `Bearer ${localStorage.getItem("token")}`,
//                     },
//                 }
//             );
//             if (response.status === 200) {
//                 fetchData(); // Refresh data after rejection
//             }
//         } catch (error) {
//             console.error("Error rejecting loan application:", error);
//         }
//     };

//     const handleRowExpand = (index) => {
//         if (expandedRow === index) {
//             setShowModal(false);
//             setExpandedRow(null);
//         } else {
//             setSelectedLoan(paginatedLoanRequests[index]);
//             setShowModal(true);
//             setExpandedRow(index);
//         }
//     };

//     const LoanDetailsModal = ({ loan, onClose }) => (
//         <div className="modal-overlay">
//             <div className="modal-content">
//                 <button id='redButtons' onClick={onClose}>
//                     Close
//                 </button>
//                 <div className="address-details">
//                     <h3>More Details</h3>
//                     <div><b>Remarks:</b> {loan.Remarks}</div>
//                     <div><b>Employment Status:</b> {loan.EmploymentStatus}</div>
//                     <div><b>Annual Income:</b> ${loan.AnnualIncome}</div>
//                     <div>
//                         <img src={loan.Proof} alt="Loan Proof" style={{ height: '300px', width: '300px' }} />
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );

//     const totalPages = Math.ceil(filteredLoanRequests.length / pagesize);

//     return (
//         <div id="home">
//             <LoanManagerNavbar />
//             <div className='loanrequest'>
//                 <h1>Loan Requests for Approval</h1>
//                 <div>
//                     <input
//                         id='searchBox'
//                         type="text"
//                         placeholder="Search..."
//                         value={searchValue}
//                         onChange={handleSearchChange}
//                     />
//                     <label id='filter'>
//                         Filter by Status:
//                         <select
//                             value={statusFilter}
//                             onChange={handleFilterChange}
//                         >
//                             <option value="-1">All</option>
//                             <option value="Pending">Pending</option>
//                             <option value="LoanManager Approved">LoanManager Approved</option>
//                             <option value="LoanManager Rejected">LoanManager Rejected</option>
//                             <option value="BranchManager Approved">BranchManager Approved</option>
//                             <option value="BranchManager Rejected">BranchManager Rejected</option>
//                         </select>
//                     </label>
//                 </div>
//                 <table>
//                     <thead>
//                         <tr>
//                             <th>Username</th>
//                             <th>Loan Type</th>
//                             <th>Application Date</th>
//                             <th>Tenure (Months)</th>
//                             <th>Loan Amount</th>
//                             <th>Annual Income</th>
//                             <th>Status</th>
//                             <th>Action</th>
//                         </tr>
//                     </thead>
//                     {paginatedLoanRequests.length ? (
//                         <tbody>
//                             {paginatedLoanRequests.map((request, index) => (
//                                 <React.Fragment key={request.LoanApplicationId}>
//                                     <tr>
//                                         <td>{request.User?.Username}</td>
//                                         <td>{request.Loan?.LoanType}</td>
//                                         <td>{new Date(request.ApplicationDate).toLocaleDateString()}</td>
//                                         <td>{request.TenureMonths}</td>
//                                         <td>${request.LoanAmount}</td>
//                                         <td>${request.AnnualIncome}</td>
//                                         <td>
//                                             {request.ApplicationStatus === "Pending"
//                                                 ? "Pending"
//                                                 : request.ApplicationStatus === "LoanManager Approved"
//                                                     ? "LoanManager Approved"
//                                                     : request.ApplicationStatus === "LoanManager Rejected"
//                                                         ? "LoanManager Rejected"
//                                                         : request.ApplicationStatus}
//                                         </td>
//                                         <td>
//                                             {request.ApplicationStatus === "Pending" && (
//                                                 <>
//                                                     <button id='greenButton' onClick={() => handleApprove(request)}>
//                                                         Approve
//                                                     </button>
//                                                     <button id='redButton' onClick={() => handleReject(request)}>
//                                                         Reject
//                                                     </button>
//                                                 </>
//                                             )}
//                                             {request.ApplicationStatus === "LoanManager Rejected" && (
//                                                 <button id='greenButton' onClick={() => handleApprove(request)}>
//                                                     Approve
//                                                 </button>
//                                             )}
//                                             {request.ApplicationStatus === "LoanManager Approved" && (
//                                                 <button id='redButton' onClick={() => handleReject(request)}>
//                                                     Reject
//                                                 </button>
//                                             )}
//                                             <button onClick={() => handleRowExpand(index)}>
//                                                 Show More
//                                             </button>
//                                         </td>
//                                     </tr>
//                                     {showModal && expandedRow === index && (
//                                         <LoanDetailsModal loan={selectedLoan} onClose={() => setShowModal(false)} />
//                                     )}
//                                 </React.Fragment>
//                             ))}
//                         </tbody>
//                     ) : (
//                         <tbody>
//                             <tr>
//                                 <td colSpan={8} className="no-records-cell">
//                                     Oops! No records Found
//                                 </td>
//                             </tr>
//                         </tbody>
//                     )}
//                 </table>
//                 {filteredLoanRequests.length > 0 && (
//                     <div>
//                         <button onClick={() => setPage(page - 1)} disabled={page === 1}>
//                             Prev
//                         </button>
//                         <span>
//                             Page {page} of {totalPages === 0 ? 1 : totalPages}
//                         </span>
//                         <button onClick={() => setPage(page + 1)} disabled={page === totalPages}>
//                             Next
//                         </button>
//                     </div>
//                 )}
//             </div>
//         </div>
//     );
// };

// export default LoanRequest;


import React, { useState, useEffect } from 'react';
import './LoanRequest.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import API_BASE_URL from '../apiConfig';
import LoanManagerNavbar from './LoanManagerNavbar';

const LoanRequest = () => {
    const [loanRequests, setLoanRequests] = useState([]);
    const [searchValue, setSearchValue] = useState("");
    const [sortValue, setSortValue] = useState(0);
    const [statusFilter, setStatusFilter] = useState("-1");
    const [page, setPage] = useState(1);
    const [pagesize, setPagesize] = useState(2);
    const [expandedRow, setExpandedRow] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [selectedLoan, setSelectedLoan] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        fetchData();
    }, []);

    async function fetchData() {
        try {
            const response = await axios.get(`${API_BASE_URL}/api/loanapplications`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            });
            if (response.status === 200) {
                setLoanRequests(response.data);
            }
        } catch (error) {
            console.error("Error fetching loan requests:", error);
            navigate("/error");
        }
    }

    const filteredLoanRequests = loanRequests
        .filter((request) =>
            statusFilter === "-1" || request.ApplicationStatus.toLowerCase() === statusFilter.toLowerCase()
        )
        .filter((request) =>
            request.Loan?.LoanType.toLowerCase().includes(searchValue.toLowerCase())
        );

    const sortedLoanRequests = filteredLoanRequests.sort((a, b) => {
        if (sortValue === 1) {
            return new Date(a.ApplicationDate) - new Date(b.ApplicationDate);
        } else if (sortValue === -1) {
            return new Date(b.ApplicationDate) - new Date(a.ApplicationDate);
        }
        return 0;
    });

    const paginatedLoanRequests = sortedLoanRequests.slice(
        (page - 1) * pagesize,
        page * pagesize
    );

    const handleSearchChange = (e) => {
        setSearchValue(e.target.value);
    };

    const toggleSort = (order) => {
        setSortValue(order);
    };

    const handleFilterChange = (e) => {
        setStatusFilter(e.target.value);
    };

    const handleApprove = async (request) => {
        if (!request) {
            console.error("No loan selected for approval.");
            return;
        }

        const requestObject = {
            ...request,
            ApplicationStatus: "LoanManager Approved", // Approving the loan
        };

        try {
            const response = await axios.put(
                `${API_BASE_URL}/api/loanapplications/${request.LoanApplicationId}`,
                requestObject,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                }
            );
            if (response.status === 200) {
                fetchData(); // Refresh data after approval
            }
        } catch (error) {
            console.error("Error approving loan application:", error);
        }
    };

    const handleReject = async (request) => {
        if (!request) {
            console.error("No loan selected for rejection.");
            return;
        }

        const requestObject = {
            ...request,
            ApplicationStatus: "LoanManager Rejected", // Rejecting the loan
        };

        try {
            const response = await axios.put(
                `${API_BASE_URL}/api/loanapplications/${request.LoanApplicationId}`,
                requestObject,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                }
            );
            if (response.status === 200) {
                fetchData(); // Refresh data after rejection
            }
        } catch (error) {
            console.error("Error rejecting loan application:", error);
        }
    };

    const handleRowExpand = (index) => {
        if (expandedRow === index) {
            setShowModal(false);
            setExpandedRow(null);
        } else {
            setSelectedLoan(paginatedLoanRequests[index]);
            setShowModal(true);
            setExpandedRow(index);
        }
    };

    const handleLoanDisbursement = (loanApplicationId) => {
        navigate(`/loanDisbursementForm/${loanApplicationId}`);
    };

    const LoanDetailsModal = ({ loan, onClose }) => (
        <div className="modal-overlay">
            <div className="modal-content">
                <button id='redButtons' onClick={onClose}>
                    Close
                </button>
                <div className="address-details">
                    <h3>More Details</h3>
                    <div><b>Remarks:</b> {loan.Remarks}</div>
                    <div><b>Employment Status:</b> {loan.EmploymentStatus}</div>
                    <div><b>Annual Income:</b> ${loan.AnnualIncome}</div>
                    <div>
                        <img src={loan.Proof} alt="Loan Proof" style={{ height: '300px', width: '300px' }} />
                    </div>
                </div>
            </div>
        </div>
    );

    const totalPages = Math.ceil(filteredLoanRequests.length / pagesize);

    return (
        <div id="home">
            <LoanManagerNavbar />
            <div className='loanrequest'>
                <h1>Loan Requests for Approval</h1>
                <div>
                    <input
                        id='searchBox'
                        type="text"
                        placeholder="Search..."
                        value={searchValue}
                        onChange={handleSearchChange}
                    />
                    <label id='filter'>
                        Filter by Status:
                        <select
                            value={statusFilter}
                            onChange={handleFilterChange}
                        >
                            <option value="-1">All</option>
                            <option value="Pending">Pending</option>
                            <option value="LoanManager Approved">LoanManager Approved</option>
                            <option value="LoanManager Rejected">LoanManager Rejected</option>
                            <option value="BranchManager Approved">BranchManager Approved</option>
                            <option value="BranchManager Rejected">BranchManager Rejected</option>
                        </select>
                    </label>
                </div>
                <table>
                    <thead>
                        <tr>
                            <th>Username</th>
                            <th>Loan Type</th>
                            <th>Application Date</th>
                            <th>Tenure (Months)</th>
                            <th>Loan Amount</th>
                            <th>Annual Income</th>
                            <th>Status</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    {paginatedLoanRequests.length ? (
                        <tbody>
                            {paginatedLoanRequests.map((request, index) => (
                                <React.Fragment key={request.LoanApplicationId}>
                                    <tr>
                                        <td>{request.User?.Username}</td>
                                        <td>{request.Loan?.LoanType}</td>
                                        <td>{new Date(request.ApplicationDate).toLocaleDateString()}</td>
                                        <td>{request.TenureMonths}</td>
                                        <td>${request.LoanAmount}</td>
                                        <td>${request.AnnualIncome}</td>
                                        <td>{request.ApplicationStatus}</td>
                                        <td>
                                            {request.ApplicationStatus === "Pending" && (
                                                <>
                                                    <button id='greenButton' onClick={() => handleApprove(request)}>
                                                        Approve
                                                    </button>
                                                    <button id='redButton' onClick={() => handleReject(request)}>
                                                        Reject
                                                    </button>
                                                </>
                                            )}
                                            {request.ApplicationStatus === "LoanManager Rejected" && (
                                                <button id='greenButton' onClick={() => handleApprove(request)}>
                                                    Approve
                                                </button>
                                            )}
                                            {request.ApplicationStatus === "LoanManager Approved" && (
                                                <button id='redButton' onClick={() => handleReject(request)}>
                                                    Reject
                                                </button>
                                            )}
                                             {request.AccountHolder && request.AccountNumber && (
                                                <button
                                                    id="disbursementButton"
                                                    onClick={() => handleLoanDisbursement(request.LoanApplicationId)}
                                                    disabled={request.ApplicationStatus === "BranchManager Approved" || request.ApplicationStatus === "BranchManager Rejected"}
                                                    style={{ 
                                                        cursor: request.ApplicationStatus === "BranchManager Approved" || request.ApplicationStatus === "BranchManager Rejected" ? 'not-allowed' : 'pointer',
                                                        opacity: request.ApplicationStatus === "BranchManager Approved" || request.ApplicationStatus === "BranchManager Rejected" ? 0.6 : 1
                                                    }}
                                                >
                                                   Add Loan Disbursement
                                                </button>
                                            )}
                                            <button onClick={() => handleRowExpand(index)}>
                                                Show More
                                            </button>
                                        </td>
                                    </tr>
                                    {showModal && expandedRow === index && (
                                        <LoanDetailsModal loan={selectedLoan} onClose={() => setShowModal(false)} />
                                    )}
                                </React.Fragment>
                            ))}
                        </tbody>
                    ) : (
                        <tbody>
                            <tr>
                                <td colSpan={8} className="no-records-cell">
                                    Oops! No records Found
                                </td>
                            </tr>
                        </tbody>
                    )}
                </table>
                {filteredLoanRequests.length > 0 && (
                    <div>
                        <button onClick={() => setPage(page - 1)} disabled={page === 1}>
                            Prev
                        </button>
                        <span>
                            Page {page} of {totalPages === 0 ? 1 : totalPages}
                        </span>
                        <button onClick={() => setPage(page + 1)} disabled={page === totalPages}>
                            Next
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default LoanRequest;

