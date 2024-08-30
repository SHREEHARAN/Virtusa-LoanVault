using CommonLibrary.Models;
using dotnetapp.Data;

using dotnetapp.Services;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;

namespace dotnetapp.Controllers
{
    [Route("api/ms/loandisbursements")]
    [ApiController]
    public class LoanDisbursementController : ControllerBase
    {
        private readonly LoanDisbursementService _loanDisbursementService;

        public LoanDisbursementController(LoanDisbursementService loanDisbursementService)
        {
            _loanDisbursementService = loanDisbursementService;
        }

        [Authorize(Roles = "LoanManager, BranchManager")]
        [HttpGet]
        public async Task<ActionResult<IEnumerable<LoanDisbursement>>> GetAllLoanDisbursements()
        {
            var loanDisbursements = await _loanDisbursementService.GetAllLoanDisbursements();
            return Ok(loanDisbursements);
        }

       
        [Authorize(Roles = "LoanManager, BranchManager")]
        [HttpGet("{loanDisbursementId}")]
        public async Task<ActionResult<LoanDisbursement>> GetLoanDisbursementById(int loanDisbursementId)
        {
            var loanDisbursement = await _loanDisbursementService.GetLoanDisbursementById(loanDisbursementId);
            if (loanDisbursement == null)
                return NotFound(new { message = "Cannot find any loan disbursement" });

            return Ok(loanDisbursement);
        }

        [Authorize(Roles = "LoanManager")]
        [HttpPost]
        public async Task<ActionResult> AddLoanDisbursement([FromBody] LoanDisbursement loanDisbursement)
        {
            try
            {
                var success = await _loanDisbursementService.AddLoanDisbursement(loanDisbursement);
                if (success)
                    return Ok(new { message = "Loan disbursement added successfully" });
                else
                    return StatusCode(500, new { message = "Failed to add loan disbursement" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = ex.Message });
            }
        }

        // [Authorize(Roles = "LoanManager, BranchManager")]
        // [HttpPut("{loanDisbursementId}")]
        // public async Task<ActionResult> UpdateLoanDisbursement(int loanDisbursementId, [FromBody] LoanDisbursement loanDisbursement)
        // {
        //     try
        //     {
        //         var success = await _loanDisbursementService.UpdateLoanDisbursement(loanDisbursementId, loanDisbursement);
        //         if (success)
        //             return Ok(new { message = "Loan disbursement updated successfully" });
        //         else
        //             return NotFound(new { message = "Cannot find any loan disbursement" });
        //     }
        //     catch (Exception ex)
        //     {
        //         return StatusCode(500, new { message = ex.Message });
        //     }
        // }

        [Authorize(Roles = "LoanManager, BranchManager")]
            [HttpPut("{loanDisbursementId}")]
            public async Task<ActionResult> UpdateLoanDisbursement(int loanDisbursementId, [FromBody] LoanDisbursement loanDisbursement)
            {
                try
                {
                    // Ensure the LoanDisbursementId is set from the URL and not modified in the JSON body
                    loanDisbursement.LoanDisbursementId = loanDisbursementId;

                    var success = await _loanDisbursementService.UpdateLoanDisbursement(loanDisbursement);
                    if (success)
                        return Ok(new { message = "Loan disbursement updated successfully" });
                    else
                        return NotFound(new { message = "Cannot find any loan disbursement" });
                }
                catch (Exception ex)
                {
                    return StatusCode(500, new { message = ex.Message });
                }
            }


        [Authorize(Roles = "LoanManager")]
        [HttpDelete("{loanDisbursementId}")]
        public async Task<ActionResult> DeleteLoanDisbursement(int loanDisbursementId)
        {
            try
            {
                var success = await _loanDisbursementService.DeleteLoanDisbursement(loanDisbursementId);
                if (success)
                    return Ok(new { message = "Loan disbursement deleted successfully" });
                else
                    return NotFound(new { message = "Cannot find any loan disbursement" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = ex.Message });
            }
        }
    }
}
