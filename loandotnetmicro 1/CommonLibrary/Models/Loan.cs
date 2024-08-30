using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace CommonLibrary.Models
{
    public class Loan
    {
        public int LoanId { get; set; }

        [Required(ErrorMessage = "Loan type is required")]
        public string LoanType { get; set; }  // Home Loan, Auto Loan, Personal Loan, etc.

        [Required(ErrorMessage = "Interest rate is required")]
        [Range(0.01, 100.00, ErrorMessage = "Interest rate must be between 0.01 and 100.00")]
        public decimal InterestRate { get; set; }  // Percentage

        [Required(ErrorMessage = "Maximum amount is required")]
        [Range(1000, 100000000, ErrorMessage = "Amount must be between 1,000 and 100,000,000")]
        public decimal MaxAmount { get; set; }

        [Required(ErrorMessage = "Minimum amount is required")]
        [Range(1000, 100000000, ErrorMessage = "Amount must be between 1,000 and 100,000,000")]
        public decimal MinAmount { get; set; }

        [Required(ErrorMessage = "Minimum tenure is required")]
        [Range(1, 360, ErrorMessage = "Tenure must be between 1 and 360 months")]
        public int MinTenureMonths { get; set; }  // Minimum tenure in months

        [Required(ErrorMessage = "Maximum tenure is required")]
        [Range(1, 360, ErrorMessage = "Tenure must be between 1 and 360 months")]
        public int MaxTenureMonths { get; set; }  // Maximum tenure in months

        [Required(ErrorMessage = "Description is required")]
        public string Description { get; set; }

        [Required(ErrorMessage = "Loan status is required")]
        public string Status { get; set; }  // Active, Inactive

        [Required(ErrorMessage = "Processing fee is required")]
        [Range(0, 1000000, ErrorMessage = "Processing fee must be between 0 and 1,000,000")]
        public decimal ProcessingFee { get; set; }  // Processing fee for the loan application

        [Required(ErrorMessage = "Prepayment penalty is required")]
        [Range(0, 100, ErrorMessage = "Prepayment penalty must be between 0 and 100 percent")]
        public decimal PrepaymentPenalty { get; set; }  // Penalty for early repayment as a percentage of the outstanding balance

        [Required(ErrorMessage = "Grace period is required")]
        [Range(0, 12, ErrorMessage = "Grace period must be between 0 and 12 months")]
        public int GracePeriodMonths { get; set; }  // Number of months after disbursement before repayments start

        [Required(ErrorMessage = "Late payment fee is required")]
        [Range(0, 10000, ErrorMessage = "Late payment fee must be between 0 and 10,000")]
        public decimal LatePaymentFee { get; set; }  // Fixed fee charged for late payments
    
    }
}
