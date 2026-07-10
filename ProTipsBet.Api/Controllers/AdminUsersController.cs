using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ProTipsBet.Api.Data;

namespace ProTipsBet.Api.Controllers
{
    [ApiController]
    [Route("api/admin/users")]
    [Authorize(Roles = "Admin")]
    public class AdminUsersController : ControllerBase
    {
        private readonly AppDbContext _db;
        public AdminUsersController(AppDbContext db) => _db = db;

        // GET /api/admin/users — list every user with VIP status + payment summary
        [HttpGet]
        public async Task<IActionResult> GetAllUsers()
        {
            var users = await _db.Users
                .OrderByDescending(u => u.CreatedAt)
                .Select(u => new
                {
                    u.Id,
                    u.Email,
                    u.FullName,
                    Role = u.Role.ToString(),
                    u.IsVip,
                    u.VipExpiresAt,
                    u.IsActive,
                    u.CreatedAt,
                    TotalPaid = u.Payments
                        .Where(p => p.Status == Models.PaymentStatus.Confirmed)
                        .Sum(p => (decimal?)p.Amount) ?? 0,
                    ConfirmedPaymentsCount = u.Payments.Count(p => p.Status == Models.PaymentStatus.Confirmed),
                    PendingPaymentsCount = u.Payments.Count(p => p.Status == Models.PaymentStatus.Pending),
                    LastPaymentDate = u.Payments
                        .OrderByDescending(p => p.CreatedAt)
                        .Select(p => (DateTime?)p.CreatedAt)
                        .FirstOrDefault()
                })
                .ToListAsync();

            return Ok(users);
        }

        // GET /api/admin/users/5 — one user's full payment + subscription history
        [HttpGet("{id}")]
        public async Task<IActionResult> GetUserDetail(int id)
        {
            var user = await _db.Users.FindAsync(id);
            if (user == null) return NotFound();

            var payments = await _db.Payments
                .Where(p => p.UserId == id)
                .OrderByDescending(p => p.CreatedAt)
                .Select(p => new
                {
                    p.Id,
                    Method = p.Method.ToString(),
                    p.Amount,
                    p.Currency,
                    Status = p.Status.ToString(),
                    p.ReceiptUrl,
                    p.CreatedAt,
                    p.ReviewedAt
                })
                .ToListAsync();

            var subscriptions = await _db.Subscriptions
                .Where(s => s.UserId == id)
                .OrderByDescending(s => s.CreatedAt)
                .Select(s => new
                {
                    s.Id,
                    PlanType = s.PlanType.ToString(),
                    s.Price,
                    s.Currency,
                    s.StartDate,
                    s.EndDate,
                    Status = s.Status.ToString()
                })
                .ToListAsync();

            return Ok(new
            {
                user.Id,
                user.Email,
                user.FullName,
                Role = user.Role.ToString(),
                user.IsVip,
                user.VipExpiresAt,
                user.IsActive,
                user.CreatedAt,
                Payments = payments,
                Subscriptions = subscriptions
            });
        }

        // PUT /api/admin/users/5/toggle-active — suspend/reactivate an account
        [HttpPut("{id}/toggle-active")]
        public async Task<IActionResult> ToggleActive(int id)
        {
            var user = await _db.Users.FindAsync(id);
            if (user == null) return NotFound();

            user.IsActive = !user.IsActive;
            await _db.SaveChangesAsync();

            return Ok(new { user.Id, user.IsActive });
        }
    }
}
