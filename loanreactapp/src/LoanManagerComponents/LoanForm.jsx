import React, { useState, useEffect } from 'react';
import './LoanForm.css'; // Import the CSS file for styling
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import API_BASE_URL from '../apiConfig';
import LoanManagerNavbar from './LoanManagerNavbar';

const LoanForm = () => {
  const navigate = useNavigate();
  const { loanId } = useParams();

  const [formData, setFormData] = useState({
    loanType: '',
    description: '',
    interestRate: '',
    maxAmount: '', 
    minAmount: '',
    minTenureMonths: '',
    maxTenureMonths: '',
    processingFee: '',
    prepaymentPenalty: '',
    gracePeriodMonths: '',
    latePaymentFee: '',
    status: 'Pending',
  });

  const [errors, setErrors] = useState({});

  const [successPopup, setSuccessPopup] = useState(false);

  useEffect(() => {
    if (loanId) {
      fetchLoan(loanId);
    }
  }, [loanId]);

  const fetchLoan = async (loanId) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/loans/${loanId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      console.log("fetchloan :" ,response);

      if (response.status === 200) {
        setFormData({
          loanType: response.data.LoanType,
          description: response.data.Description,
          interestRate: response.data.InterestRate,
          maxAmount: response.data.MaxAmount,
          minAmount: response.data.MinAmount,
          minTenureMonths: response.data.MinTenureMonths,
          maxTenureMonths: response.data.MaxTenureMonths,
          processingFee: response.data.ProcessingFee,
          prepaymentPenalty: response.data.PrepaymentPenalty,
          gracePeriodMonths: response.data.GracePeriodMonths,
          latePaymentFee: response.data.LatePaymentFee,
          status: response.data.Status,
        });
      }
    } catch (error) {
      // navigate('/error');
      console.log("Error :", error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleAddLoan = async () => {
    const fieldErrors = {};

    if (!formData.loanType) {
      fieldErrors.loanType = 'Loan Type is required';
    }

    if (!formData.description) {
      fieldErrors.description = 'Description is required';
    }

    if (!formData.interestRate) {
      fieldErrors.interestRate = 'Interest Rate is required';
    }

    if (!formData.maxAmount) {
      fieldErrors.maxAmount = 'Maximum Amount is required';
    }

    if (!formData.minAmount) {
      fieldErrors.minAmount = 'Minimum Amount is required';
    }

    if (!formData.minTenureMonths) {
      fieldErrors.minTenureMonths = 'Minimum Tenure is required';
    }

    if (!formData.maxTenureMonths) {
      fieldErrors.maxTenureMonths = 'Maximum Tenure is required';
    }

    if (!formData.processingFee) {
      fieldErrors.processingFee = 'Processing Fee is required';
    }

    if (!formData.prepaymentPenalty) {
      fieldErrors.prepaymentPenalty = 'Prepayment Penalty is required';
    }

    if (!formData.gracePeriodMonths) {
      fieldErrors.gracePeriodMonths = 'Grace Period is required';
    }

    if (!formData.latePaymentFee) {
      fieldErrors.latePaymentFee = 'Late Payment Fee is required';
    }

    if (Object.values(fieldErrors).some((error) => error)) {
      setErrors(fieldErrors);
      return;
    }

    try {
      const requestObject = {
        loanType: formData.loanType,
        description: formData.description,
        interestRate: formData.interestRate,
        maxAmount: formData.maxAmount,
        minAmount: formData.minAmount,
        minTenureMonths: formData.minTenureMonths,
        maxTenureMonths: formData.maxTenureMonths,
        processingFee: formData.processingFee,
        prepaymentPenalty: formData.prepaymentPenalty,
        gracePeriodMonths: formData.gracePeriodMonths,
        latePaymentFee: formData.latePaymentFee,
        status: formData.status || 'Pending',
      };

      console.log("requestObject" , requestObject);

      const response = loanId
        ? await axios.put(`${API_BASE_URL}/api/loans/${loanId}`, requestObject, {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
          })
        : await axios.post(`${API_BASE_URL}/api/loans`, requestObject, {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
          });

      if (response.status === 200) {
        setSuccessPopup(true);
      }
    } catch (error) {
      // navigate('/error');
      console.log("Error :", error);
    }
  };

  const handleSuccessMessage = () => {
    setSuccessPopup(false);
    navigate(-1);
  };

  return (
    <div>
      <LoanManagerNavbar />
      <div className={`loan-form-container ${successPopup ? 'blur' : ''}`}>
        {loanId ? (
          <>
            <button 
              type="button" 
              className="back-button"
              onClick={() => navigate(-1)}
            >
              Back
            </button>
            <h2 className='Editheading'>Edit Loan</h2>
          </>
        ) : (
          <h2>Create New Loan</h2>
        )}
        <div>
          <div className="form-group">
            <label htmlFor="loanType">
              Loan Type <span className="required-asterisk">*</span>
            </label>
            <input
              type="text"
              name="loanType"
              value={formData.loanType}
              placeholder="Loan Type"
              onChange={handleChange}
            />
            {errors.loanType && <div className="error">{errors.loanType}</div>}
          </div>
          <div className="form-group">
            <label htmlFor="description">
              Description <span className="required-asterisk">*</span>
            </label>
            <input
              type="text"
              name="description"
              value={formData.description}
              placeholder="Loan Description"
              onChange={handleChange}
            />
            {errors.description && <div className="error">{errors.description}</div>}
          </div>
          <div className="form-group">
            <label htmlFor="interestRate">
              Interest Rate <span className="required-asterisk">*</span>
            </label>
            <input
              type="number"
              name="interestRate"
              value={formData.interestRate}
              placeholder="Interest Rate"
              onChange={handleChange}
            />
            {errors.interestRate && <div className="error">{errors.interestRate}</div>}
          </div>
          <div className="form-group">
            <label htmlFor="maxAmount">
              Maximum Amount <span className="required-asterisk">*</span>
            </label>
            <input
              type="number"
              name="maxAmount"
              value={formData.maxAmount}
              placeholder="Maximum Amount"
              onChange={handleChange}
            />
            {errors.maxAmount && <div className="error">{errors.maxAmount}</div>}
          </div>
          <div className="form-group">
            <label htmlFor="minAmount">
              Minimum Amount <span className="required-asterisk">*</span>
            </label>
            <input
              type="number"
              name="minAmount"
              value={formData.minAmount}
              placeholder="Minimum Amount"
              onChange={handleChange}
            />
            {errors.minAmount && <div className="error">{errors.minAmount}</div>}
          </div>
          <div className="form-group">
            <label htmlFor="minTenureMonths">
              Minimum Tenure (Months) <span className="required-asterisk">*</span>
            </label>
            <input
              type="number"
              name="minTenureMonths"
              value={formData.minTenureMonths}
              placeholder="Minimum Tenure"
              onChange={handleChange}
            />
            {errors.minTenureMonths && <div className="error">{errors.minTenureMonths}</div>}
          </div>
          <div className="form-group">
            <label htmlFor="maxTenureMonths">
              Maximum Tenure (Months) <span className="required-asterisk">*</span>
            </label>
            <input
              type="number"
              name="maxTenureMonths"
              value={formData.maxTenureMonths}
              placeholder="Maximum Tenure"
              onChange={handleChange}
            />
            {errors.maxTenureMonths && <div className="error">{errors.maxTenureMonths}</div>}
          </div>
          <div className="form-group">
            <label htmlFor="processingFee">
              Processing Fee <span className="required-asterisk">*</span>
            </label>
            <input
              type="number"
              name="processingFee"
              value={formData.processingFee}
              placeholder="Processing Fee"
              onChange={handleChange}
            />
            {errors.processingFee && <div className="error">{errors.processingFee}</div>}
          </div>
          <div className="form-group">
            <label htmlFor="prepaymentPenalty">
              Prepayment Penalty (%) <span className="required-asterisk">*</span>
            </label>
            <input
              type="number"
              name="prepaymentPenalty"
              value={formData.prepaymentPenalty}
              placeholder="Prepayment Penalty"
              onChange={handleChange}
            />
            {errors.prepaymentPenalty && <div className="error">{errors.prepaymentPenalty}</div>}
          </div>
          <div className="form-group">
            <label htmlFor="gracePeriodMonths">
              Grace Period (Months) <span className="required-asterisk">*</span>
            </label>
            <input
              type="number"
              name="gracePeriodMonths"
              value={formData.gracePeriodMonths}
              placeholder="Grace Period"
              onChange={handleChange}
            />
            {errors.gracePeriodMonths && <div className="error">{errors.gracePeriodMonths}</div>}
          </div>
          <div className="form-group">
            <label htmlFor="latePaymentFee">
              Late Payment Fee <span className="required-asterisk">*</span>
            </label>
            <input
              type="number"
              name="latePaymentFee"
              value={formData.latePaymentFee}
              placeholder="Late Payment Fee"
              onChange={handleChange}
            />
            {errors.latePaymentFee && <div className="error">{errors.latePaymentFee}</div>}
          </div>
          <button className='loanbutton' type="button" onClick={handleAddLoan}>
            {loanId ? 'Update Loan' : 'Add Loan'}
          </button>
        </div>
      </div>
      {successPopup && (
        <>
          <div className="overlay"></div>
          <div className="modalpopup">
            <p>{loanId ? 'Updated Successfully!' : 'Successfully Added!'}</p>
            <button onClick={handleSuccessMessage}>Ok</button>
          </div>
        </>
      )}
    </div>
  );
};

export default LoanForm;
