using dotnetapp.Data;
using CommonLibrary.Models;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace dotnetapp.Services
{
    public class LoanDisbursementService
    {
        private readonly ApplicationDbContext _context;

        public LoanDisbursementService(ApplicationDbContext context)
        {
            _context = context;
        }

        // public async Task<IEnumerable<LoanDisbursement>> GetAllLoanDisbursements()
        // {
        //     return await _context.LoanDisbursements.ToListAsync();
        // }

            public async Task<IEnumerable<LoanDisbursement>> GetAllLoanDisbursements()
        {
            return await _context.LoanDisbursements
                                 .Include(ld => ld.LoanApplication)
                                 .ThenInclude(la => la.User)   // Include User details
                                 .Include(ld => ld.LoanApplication)
                                 .ThenInclude(la => la.Loan)  // Include Loan details
                                 .ToListAsync();
        }

        public async Task<LoanDisbursement> GetLoanDisbursementById(int loanDisbursementId)
        {
            return await _context.LoanDisbursements.FirstOrDefaultAsync(l => l.LoanDisbursementId == loanDisbursementId);
        }

        public async Task<bool> AddLoanDisbursement(LoanDisbursement loanDisbursement)
        {
            _context.LoanDisbursements.Add(loanDisbursement);
            await _context.SaveChangesAsync();
            return true;
        }

        // public async Task<bool> UpdateLoanDisbursement(int loanDisbursementId, LoanDisbursement loanDisbursement)
        // {
        //     var existingLoanDisbursement = await _context.LoanDisbursements.FirstOrDefaultAsync(l => l.LoanDisbursementId == loanDisbursementId);
        //     if (existingLoanDisbursement == null)
        //         return false;

        //     _context.Entry(existingLoanDisbursement).CurrentValues.SetValues(loanDisbursement);
        //     await _context.SaveChangesAsync();
        //     return true;
        // }

        public async Task<bool> UpdateLoanDisbursement(LoanDisbursement loanDisbursement)
            {
                var existingLoanDisbursement = await _context.LoanDisbursements
                    .FirstOrDefaultAsync(l => l.LoanDisbursementId == loanDisbursement.LoanDisbursementId);

                if (existingLoanDisbursement == null)
                    return false;

                // Update the existing loan disbursement with the new values, except for the LoanDisbursementId
                _context.Entry(existingLoanDisbursement).CurrentValues.SetValues(loanDisbursement);

                await _context.SaveChangesAsync();
                return true;
            }


        public async Task<bool> DeleteLoanDisbursement(int loanDisbursementId)
        {
            var loanDisbursement = await _context.LoanDisbursements.FirstOrDefaultAsync(l => l.LoanDisbursementId == loanDisbursementId);
            if (loanDisbursement == null)
                return false;

            _context.LoanDisbursements.Remove(loanDisbursement);
            await _context.SaveChangesAsync();
            return true;
        }
    }
}
