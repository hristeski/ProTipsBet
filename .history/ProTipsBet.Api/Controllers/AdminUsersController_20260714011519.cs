using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ProTipsBet.Api.Data;
using ProTipsBet.Api.Models;

namespace ProTipsBet.Api.Controllers
{
    [ApiController]
    [Route("api/admin/users")]
    [Authorize(Roles = "Admin")]
    public class AdminUsersController : ControllerBase
    {
        private readonly AppDbContext _db;
        public AdminUsersController(AppDbContext db) => _db = db;

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
                    u.PhoneNumber,
                    Role = u.Role.ToString(),
                    u.IsVip,
                    u.VipExpiresAt,
                    u.IsActive,
                    u.CreatedAt,
                    TotalPaid = u.Payments
                        .Where(p => p.Status == PaymentStatus.Confirmed)
                        .Sum(p => (decimal?)p.Amount) ?? 0,
                    ConfirmedPaymentsCount = u.Payments.Count(p => p.Status == PaymentStatus.Confirmed),
                    PendingPaymentsCount = u.Payments.Count(p => p.Status == PaymentStatus.Pending),
                    LastPaymentDate = u.Payments
                        .OrderByDescending(p => p.CreatedAt)
                        .Select(p => (DateTime?)p.CreatedAt)
                        .FirstOrDefault()
                })
                .ToListAsync();

            return Ok(users);
        }

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
                user.PhoneNumber,
                Role = user.Role.ToString(),
                user.IsVip,
                user.VipExpiresAt,
                user.IsActive,
                user.CreatedAt,
                Payments = payments,
                Subscriptions = subscriptions
            });
        }

        [HttpPut("{id}/toggle-active")]
        public async Task<IActionResult> ToggleActive(int id)
        {
            var user = await _db.Users.FindAsync(id);
            if (user == null) return NotFound();

            user.IsActive = !user.IsActive;
            await _db.SaveChangesAsync();

            return Ok(new { user.Id, user.IsActive });
        }

        // Manually grant or revoke VIP access — useful for comps, corrections, or manual crypto payments
        [HttpPut("{id}/vip")]
        public async Task<IActionResult> SetVip(int id, [FromBody] SetVipRequest request)
        {
            var user = await _db.Users.FindAsync(id);
            if (user == null) return NotFound();

            if (request.Grant)
            {
                user.IsVip = true;
                user.VipExpiresAt = DateTime.UtcNow.AddDays(request.Days ?? 30);
            }
            else
            {
                user.IsVip = false;
                user.VipExpiresAt = null;
            }

            await _db.SaveChangesAsync();
            return Ok(new { user.Id, user.IsVip, user.VipExpiresAt });
        }

        // Promote to Admin or demote back to regular User
        [HttpPut("{id}/role")]
        public async Task<IActionResult> ChangeRole(int id, [FromBody] ChangeRoleRequest request)
        {
            var user = await _db.Users.FindAsync(id);
            if (user == null) return NotFound();

            if (!Enum.TryParse<UserRole>(request.Role, true, out var newRole))
                return BadRequest(new { message = "Role must be 'User' or 'Admin'." });

            // Guard: don't let the last admin demote themselves into a locked-out state
            var callerIdClaim = User.FindFirst(System.IdentityModel.Tokens.Jwt.JwtRegisteredClaimNames.Sub)?.Value;
            if (int.TryParse(callerIdClaim, out var callerId) && callerId == id && newRole != UserRole.Admin)
            {
                var otherAdmins = await _db.Users.CountAsync(u => u.Role == UserRole.Admin && u.Id != id);
                if (otherAdmins == 0)
                    return BadRequest(new { message = "You can't remove your own admin access — you're the only admin left." });
            }

            user.Role = newRole;
            await _db.SaveChangesAsync();
            return Ok(new { user.Id, Role = user.Role.ToString() });
        }

        // Admin sets a new password directly (e.g. customer lost access and can't reset themselves yet)
        [HttpPut("{id}/reset-password")]
        public async Task<IActionResult> ResetPassword(int id, [FromBody] ResetPasswordRequest request)
        {
            if (string.IsNullOrWhiteSpace(request.NewPassword) || request.NewPassword.Length < 8)
                return BadRequest(new { message = "New password must be at least 8 characters." });

            var user = await _db.Users.FindAsync(id);
            if (user == null) return NotFound();

            user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.NewPassword);
            await _db.SaveChangesAsync();

            return Ok(new { message = "Password updated." });
        }

        // Hard delete — only allowed for accounts with no payment/subscription history,
        // to protect financial audit trail. Everyone else should be deactivated instead.
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteUser(int id)
        {
            var user = await _db.Users.FindAsync(id);
            if (user == null) return NotFound();

            var hasHistory = await _db.Payments.AnyAsync(p => p.UserId == id)
                           || await _db.Subscriptions.AnyAsync(s => s.UserId == id);

            if (hasHistory)
            {
                return BadRequest(new
                {
                    message = "This user has payment or subscription history and can't be permanently deleted. Deactivate the account instead to preserve records."
                });
            }

            _db.Users.Remove(user);
            await _db.SaveChangesAsync();

            return Ok(new { message = "User deleted." });
        }
    }

    public class SetVipRequest
    {
        public bool Grant { get; set; }
        public int? Days { get; set; } // used only when Grant = true; defaults to 30
    }

    public class ChangeRoleRequest
    {
        public string Role { get; set; } = "User";
    }

    public class ResetPasswordRequest
    {
        public string NewPassword { get; set; } = string.Empty;
    }
}
