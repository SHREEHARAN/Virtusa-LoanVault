import React, { useState, useEffect } from 'react';
import './LoanDisbursementForm.css'; // Import the CSS file for styling
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import API_BASE_URL from '../apiConfig';
import LoanManagerNavbar from './LoanManagerNavbar';

const LoanDisbursementForm = () => {
  const navigate = useNavigate();
  const { loanApplicationId, loanDisbursementId } = useParams(); // Get loanApplicationId and loanDisbursementId from URL params

  const [formData, setFormData] = useState({
    loanApplicationId: loanApplicationId || '',
    disbursementDate: '',
    disbursementAmount: '',
    disbursementMethod: '',
    status: 'Pending',
    remarks: '',
  });

  const [errors, setErrors] = useState({});
  const [successPopup, setSuccessPopup] = useState(false);

  useEffect(() => {
    if (loanDisbursementId) {
      fetchLoanDisbursement(loanDisbursementId);
    }
  }, [loanDisbursementId]);

  const fetchLoanDisbursement = async (loanDisbursementId) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/loandisbursements/${loanDisbursementId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (response.status === 200) {
        setFormData({
          loanApplicationId: response.data.LoanApplicationId,
          disbursementDate: response.data.DisbursementDate.split('T')[0], // Format date for input
          disbursementAmount: response.data.DisbursementAmount,
          disbursementMethod: response.data.DisbursementMethod,
          status: response.data.Status,
          remarks: response.data.Remarks || '',
        });
      }
    } catch (error) {
      console.error('Error fetching loan disbursement:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleDisbursement = async () => {
    const fieldErrors = {};

    if (!formData.disbursementDate) {
      fieldErrors.disbursementDate = 'Disbursement Date is required';
    }

    if (!formData.disbursementAmount) {
      fieldErrors.disbursementAmount = 'Disbursement Amount is required';
    } else if (formData.disbursementAmount <= 0 || formData.disbursementAmount > 100000000) {
      fieldErrors.disbursementAmount = 'Amount must be between 1 and 100,000,000';
    }

    if (!formData.disbursementMethod) {
      fieldErrors.disbursementMethod = 'Disbursement Method is required';
    }

    if (!formData.remarks) {
        fieldErrors.remarks = 'Remarks is required';
      }

    if (Object.values(fieldErrors).some((error) => error)) {
      setErrors(fieldErrors);
      return;
    }

    try {
      const requestObject = {
        loanApplicationId: formData.loanApplicationId,
        disbursementDate: formData.disbursementDate,
        disbursementAmount: formData.disbursementAmount,
        disbursementMethod: formData.disbursementMethod,
        status: formData.status,
        remarks: formData.remarks,
      };

      console.log("LoanDisbursement", requestObject);
      console.log("LoanDisbursementId", loanDisbursementId);

      const response = loanDisbursementId
        ? await axios.put(`${API_BASE_URL}/api/loandisbursements/${loanDisbursementId}`, requestObject, {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
          })
        : await axios.post(`${API_BASE_URL}/api/loandisbursements`, requestObject, {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
          });

      if (response.status === 200) {
        setSuccessPopup(true);
      }
    } catch (error) {
      console.error('Error during loan disbursement:', error);
    }
  };

  const handleSuccessMessage = () => {
    setSuccessPopup(false);
    navigate(-1); // Navigate back to the previous page
  };

  // Get today's date in YYYY-MM-DD format for restricting past dates
  const todayDate = new Date().toISOString().split('T')[0];

  return (
    <div>
      <LoanManagerNavbar />
      <div className={`loan-disbursement-form-container ${successPopup ? 'blur' : ''}`}>
        <button 
          type="button" 
          className="back-button"
          onClick={() => navigate(-1)}
        >
          Back
        </button>
        {loanDisbursementId ? (
          <h2 className='Editheading'>Edit Loan Disbursement</h2>
        ) : (
          <h2 className='heading'>Create New Loan Disbursement</h2>
        )}
        <div>
          <div className="form-group">
            <label htmlFor="disbursementDate">
              Disbursement Date <span className="required-asterisk">*</span>
            </label>
            <input
              type="date"
              name="disbursementDate"
              value={formData.disbursementDate}
              onChange={handleChange}
              min={todayDate} // Restrict to today or future dates
            />
            {errors.disbursementDate && <div className="error">{errors.disbursementDate}</div>}
          </div>
          <div className="form-group">
            <label htmlFor="disbursementAmount">
              Disbursement Amount <span className="required-asterisk">*</span>
            </label>
            <input
              type="number"
              name="disbursementAmount"
              value={formData.disbursementAmount}
              placeholder="Disbursement Amount"
              onChange={handleChange}
            />
            {errors.disbursementAmount && <div className="error">{errors.disbursementAmount}</div>}
          </div>
          <div className="form-group">
            <label htmlFor="disbursementMethod">
              Disbursement Method <span className="required-asterisk">*</span>
            </label>
            <select
              name="disbursementMethod"
              value={formData.disbursementMethod}
              onChange={handleChange}
            >
              <option value="">Select Method</option>
              <option value="Bank Transfer">Bank Transfer</option>
              <option value="Check">Check</option>
              <option value="Cash">Cash</option>
              <option value="Other">Other</option>
            </select>
            {errors.disbursementMethod && <div className="error">{errors.disbursementMethod}</div>}
          </div>
          <div className="form-group">
            <label htmlFor="remarks">Remarks</label>
            <input
              type="text"
              name="remarks"
              value={formData.remarks}
              placeholder="Remarks"
              onChange={handleChange}
            />
             {errors.remarks && <div className="error">{errors.remarks}</div>}
          </div>
          <button className="loanbutton" type="button" onClick={handleDisbursement}>
            {loanDisbursementId ? 'Update Disbursement' : 'Disburse Loan'}
          </button>
        </div>
      </div>
      {successPopup && (
        <>
          <div className="overlay"></div>
          <div className="modalpopup">
            <p>{loanDisbursementId ? 'Disbursement Updated Successfully!' : 'Loan Disbursement Successful!'}</p>
            <button onClick={handleSuccessMessage}>Ok</button>
          </div>
        </>
      )}
    </div>
  );
};

export default LoanDisbursementForm;
