using System;
using System.ComponentModel.DataAnnotations;

namespace CommonLibrary.Models
{
    public class LoanApplication
    {
        public int LoanApplicationId { get; set; }

        [Required(ErrorMessage = "User ID is required")]
        public int UserId { get; set; }  // ID of the user applying for the loan

        [Required(ErrorMessage = "Loan ID is required")]
        public int LoanId { get; set; }  // ID of the loan type being applied for

        [Required(ErrorMessage = "Application date is required")]
        public DateTime ApplicationDate { get; set; }  // Date when the loan application was submitted

        [Required(ErrorMessage = "Loan amount is required")]
        [Range(1000, 100000000, ErrorMessage = "Loan amount must be between 1,000 and 100,000,000")]
        public decimal LoanAmount { get; set; }  // Amount requested by the borrower

        [Required(ErrorMessage = "Tenure is required")]
        [Range(1, 360, ErrorMessage = "Tenure must be between 1 and 360 months")]
        public int TenureMonths { get; set; }  // Number of months for loan repayment
        [Required]
        public string ApplicationStatus { get; set; }  // Pending, Approved, Rejected, Under Review
      
        [Required]
        public string EmploymentStatus { get; set; }  // Employment status of the borrower (e.g., Employed, Self-Employed, Unemployed)
       
        [Required]
        public decimal AnnualIncome { get; set; }  // Annual income of the borrower
       
        [Required]
        public string Remarks { get; set; }  // Any additional remarks or notes related to the application
        
        [Required]
        public string Proof { get; set; }  // Any additional remarks or notes related to the application
       
        public string? AccountHolder { get; set; }  // Name of the account holder

        public string? AccountNumber { get; set; }  // Bank account number for loan disbursement

        public string? IFSCCode { get; set; }  // Bank IFSC code for loan disbursement
        public User? User { get; set; }  // Reference to the user who applied
        public Loan? Loan { get; set; }  // Reference to the loan type being applied for
    }
}
