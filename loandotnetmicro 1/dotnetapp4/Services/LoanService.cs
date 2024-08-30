using dotnetapp.Data;
using CommonLibrary.Models;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace dotnetapp4.Services
{
    public class LoanService
    {
        private readonly ApplicationDbContext _context;

        public LoanService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Loan>> GetAllLoans()
        {
            return await _context.Loans.ToListAsync();
        }

        public async Task<Loan> GetLoanById(int loanId)
        {
            return await _context.Loans.FirstOrDefaultAsync(l => l.LoanId == loanId);
        }

        public async Task<bool> AddLoan(Loan loan)
        {
            _context.Loans.Add(loan);
            await _context.SaveChangesAsync();
            return true;
        }

            public async Task<bool> UpdateLoan(Loan loan)
            {
                var existingLoan = await _context.Loans.FirstOrDefaultAsync(l => l.LoanId == loan.LoanId);
                if (existingLoan == null)
                    return false;

                // Update the existing loan with the new values, except for the LoanId
                _context.Entry(existingLoan).CurrentValues.SetValues(loan);

                await _context.SaveChangesAsync();
                return true;
            }



        public async Task<bool> DeleteLoan(int loanId)
        {
            var loan = await _context.Loans.FirstOrDefaultAsync(l => l.LoanId == loanId);
            if (loan == null)
                return false;

            _context.Loans.Remove(loan);
            await _context.SaveChangesAsync();
            return true;
        }
    }
}
