using dotnetapp.Data;
using CommonLibrary.Models;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace dotnetapp.Services
{
    public class LoanApplicationService
    {
        private readonly ApplicationDbContext _context;

        public LoanApplicationService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<LoanApplication>> GetAllLoanApplications()
        {
            return await _context.LoanApplications
                                 .Include(l => l.Loan) // Include related Loan data if needed
                                 .Include(l => l.User)
                                 .ToListAsync();
        }

        public async Task<LoanApplication> GetLoanApplicationById(int loanApplicationId)
        {
            return await _context.LoanApplications.FirstOrDefaultAsync(l => l.LoanApplicationId == loanApplicationId);
        }

        public async Task<bool> AddLoanApplication(LoanApplication loanApplication)
        {
            _context.LoanApplications.Add(loanApplication);
            await _context.SaveChangesAsync();
            return true;
        }

            public async Task<IEnumerable<LoanApplication>> GetLoanApplicationsByUserId(int userId)
        {
            return await _context.LoanApplications
                                 .Include(l => l.Loan) // Include related Loan data if needed
                                 .Include(l => l.User) // Include related User data if needed
                                 .Where(l => l.UserId == userId)
                                 .ToListAsync();
        }

        public async Task<bool> UpdateLoanApplication(int loanApplicationId, LoanApplication loanApplication)
        {
            var existingLoanApplication = await _context.LoanApplications.FirstOrDefaultAsync(l => l.LoanApplicationId == loanApplicationId);
            if (existingLoanApplication == null)
                return false;

            _context.Entry(existingLoanApplication).CurrentValues.SetValues(loanApplication);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> DeleteLoanApplication(int loanApplicationId)
        {
            var loanApplication = await _context.LoanApplications.FirstOrDefaultAsync(l => l.LoanApplicationId == loanApplicationId);
            if (loanApplication == null)
                return false;

            _context.LoanApplications.Remove(loanApplication);
            await _context.SaveChangesAsync();
            return true;
        }
    }
}
