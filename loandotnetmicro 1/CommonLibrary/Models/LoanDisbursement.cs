using System;
using System.ComponentModel.DataAnnotations;

namespace CommonLibrary.Models
{
    public class LoanDisbursement
    {
        public int LoanDisbursementId { get; set; }

        [Required(ErrorMessage = "Loan application ID is required")]
        public int LoanApplicationId { get; set; }  // ID of the associated loan application

        [Required(ErrorMessage = "Disbursement date is required")]
        public DateTime DisbursementDate { get; set; }  // Date on which the loan amount is disbursed

        [Required(ErrorMessage = "Disbursement amount is required")]
        [Range(1, 100000000, ErrorMessage = "Amount must be between 1 and 100,000,000")]
        public decimal DisbursementAmount { get; set; }  // Amount that is disbursed to the borrower

        [Required(ErrorMessage = "Disbursement method is required")]
        public string DisbursementMethod { get; set; }  // Bank Transfer, Check, Cash, etc.

        [Required(ErrorMessage = "Disbursement status is required")]
        public string Status { get; set; }  // Disbursed, Pending, Failed

        public string Remarks { get; set; }  // Any additional comments or notes related to the disbursement

        // Navigation property
        public LoanApplication? LoanApplication { get; set; }  // Reference to the associated loan application
    }
}