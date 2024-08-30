import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import "./LoanApplicationForm.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useSelector } from "react-redux";
import API_BASE_URL from "../apiConfig";
import CustomerNavbar from "./CustomerNavbar";

function LoanApplicationForm() {
  const navigate = useNavigate();
  const userId = useSelector((state) => state.user.userId);
  const loanId = localStorage.getItem("LoanId");
  const [successPopup, setSuccessPopup] = useState(false);
  const [filePreview, setFilePreview] = useState(null);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    let requestObject = {
      userId: userId,
      loanId: loanId, // Set the loan ID from localStorage
      applicationDate: new Date(),
      loanAmount: data.loanAmount,
      tenureMonths: data.tenureMonths,
      applicationStatus: "Pending", // Initial status of the loan
      employmentStatus: data.employmentStatus,
      annualIncome: data.annualIncome,
      remarks: data.remarks || "",
      proof: filePreview, // Include the base64 encoded file
      accountHolder: null, // Account details are initially null
      accountNumber: null,
      ifscCode: null,
    };

    try {
      const response = await axios.post(
        `${API_BASE_URL}/api/loanapplications`,
        requestObject,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (response.status === 200) {
        setSuccessPopup(true);
      }
    } catch (error) {
      console.error("Error submitting loan application:", error);
      navigate("/error");
    }
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];

    if (file) {
      try {
        const base64String = await convertFileToBase64(file);
        setFilePreview(base64String);
      } catch (error) {
        console.error("Error converting file to base64:", error);
        navigate("/error");
      }
    }
  };

  const convertFileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = () => {
        resolve(reader.result); // Include the data URL prefix
      };

      reader.onerror = (error) => {
        reject(error);
      };

      reader.readAsDataURL(file);
    });
  };

  function handleSuccessMessage() {
    setSuccessPopup(false);
    navigate("/availableloan");
  }

  return (
    <div>
      <CustomerNavbar />
      <div className={`container ${successPopup ? "blur" : ""}`}>
        <div className="button-container">
          <button className="back-button" onClick={() => navigate(-1)}>
            Back
          </button>
          <h2 className="form-title">Loan Application Form</h2>
        </div>
        <form className="loan-form" onSubmit={handleSubmit(onSubmit)}>
          <div className="form-group">
            <label htmlFor="loanAmount" className="form-label">
              Loan Amount:<span className="required-asterisk">*</span>
            </label>
            <Controller
              name="loanAmount"
              control={control}
              rules={{ required: "Loan amount is required" }}
              render={({ field }) => (
                <div>
                  <input
                    id="loanAmount"
                    type="number"
                    className="form-input"
                    {...field}
                  />
                  {errors.loanAmount && (
                    <div className="error">{errors.loanAmount.message}</div>
                  )}
                </div>
              )}
            />
          </div>

          <div className="form-group">
            <label htmlFor="tenureMonths" className="form-label">
              Tenure (Months):<span className="required-asterisk">*</span>
            </label>
            <Controller
              name="tenureMonths"
              control={control}
              rules={{ required: "Tenure is required" }}
              render={({ field }) => (
                <div>
                  <input
                    id="tenureMonths"
                    type="number"
                    className="form-input"
                    {...field}
                  />
                  {errors.tenureMonths && (
                    <div className="error">{errors.tenureMonths.message}</div>
                  )}
                </div>
              )}
            />
          </div>

          <div className="form-group">
            <label htmlFor="employmentStatus" className="form-label">
              Employment Status:<span className="required-asterisk">*</span>
            </label>
            <Controller
              name="employmentStatus"
              control={control}
              rules={{ required: "Employment status is required" }}
              render={({ field }) => (
                <div>
                  <select
                    id="employmentStatus"
                    className="form-input"
                    {...field}
                  >
                    <option value="">Select Employment Status</option>
                    <option value="Employed">Employed</option>
                    <option value="Self-Employed">Self-Employed</option>
                    <option value="Unemployed">Unemployed</option>
                  </select>
                  {errors.employmentStatus && (
                    <div className="error">
                      {errors.employmentStatus.message}
                    </div>
                  )}
                </div>
              )}
            />
          </div>

          <div className="form-group">
            <label htmlFor="annualIncome" className="form-label">
              Annual Income:<span className="required-asterisk">*</span>
            </label>
            <Controller
              name="annualIncome"
              control={control}
              rules={{ required: "Annual income is required" }}
              render={({ field }) => (
                <div>
                  <input
                    id="annualIncome"
                    type="number"
                    className="form-input"
                    {...field}
                  />
                  {errors.annualIncome && (
                    <div className="error">{errors.annualIncome.message}</div>
                  )}
                </div>
              )}
            />
          </div>

          <div className="form-group">
            <label htmlFor="remarks" className="form-label">
              Remarks:<span className="required-asterisk">*</span>
            </label>
            <Controller
              name="remarks"
              control={control}
              rules={{ required: "Remarks are required" }}
              render={({ field }) => (
                <div>
                  <input
                    id="remarks"
                    type="text"
                    className="form-input"
                    {...field}
                  />
                  {errors.remarks && (
                    <div className="error">{errors.remarks.message}</div>
                  )}
                </div>
              )}
            />
          </div>

          <div className="form-group">
            <label htmlFor="file" className="form-label">
              Proof:<span className="required-asterisk">*</span>
            </label>
            <Controller
              name="file"
              control={control}
              rules={{
                required: "Proof is required",
                validate: (value) => !!value,
              }}
              render={({ field }) => (
                <div>
                  <input
                    id="file"
                    type="file"
                    className="form-input"
                    onChange={(e) => {
                      field.onChange(e);
                      handleFileChange(e);
                    }}
                    accept=".jpg, .jpeg, .png, .pdf"
                  />
                  {errors.file && (
                    <div className="error">{errors.file.message}</div>
                  )}
                </div>
              )}
            />
          </div>

          <div className="form-group">
            <button type="submit" className="submit-button">
              Submit
            </button>
          </div>
        </form>
      </div>
      {successPopup && (
        <>
          <div className="overlay"></div>
          <div className="modalpopup">
            <p className="successmessage">Successfully Added!</p>
            <button className="ok-button" onClick={handleSuccessMessage}>
              Ok
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default LoanApplicationForm;
