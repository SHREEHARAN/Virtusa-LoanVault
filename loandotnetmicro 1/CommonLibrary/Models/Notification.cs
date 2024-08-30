using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace CommonLibrary.Models
{

public class Notification
{        
    [Key]
    public int NotificationId { get; set; }
    public int? UserId { get; set; } 
    public int? LoanId { get; set; } 
    public int?  LoanApplicationId{ get; set; } 
    public int? LoanDisbursementId { get; set; } 
    public string Message { get; set; } 
    public bool IsRead { get; set; } 
    public DateTime CreatedAt { get; set; } 
    public User? User { get; set; } 
    public Loan? Loan { get; set; } 
    public LoanApplication? LoanApplication { get; set; } 
    public LoanDisbursement? LoanDisbursement { get; set; } 
}
}