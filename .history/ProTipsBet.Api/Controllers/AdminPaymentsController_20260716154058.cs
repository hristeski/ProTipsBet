using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ProTipsBet.Api.Data;
using ProTipsBet.Api.Models;
using ProTipsBet.Api.Services;

namespace ProTipsBet.Api.Controllers
{
    [ApiController]
    [Route("api/admin/payments")]
    [Authorize(Roles = "Admin")]
    public class AdminPaymentsController : ControllerBase
    {
        private readonly AppDbContext _db;
        private readonly IEmailService _emailService;

        public AdminPaymentsController(AppDbContext db, IEmailService emailService)
        {
            _db = db;
            _emailService = emailService;
        }

        [HttpGet]
        public async Task<IActionResult> GetPendingPayments()
        {
            var payments = await _db.Payments
                .Include(p => p.User)
                .Include(p => p.Subscription)
                .Where(p => p.Status == PaymentStatus.Pending)
                .OrderBy(p => p.CreatedAt)
                .ToListAsync();

            return Ok(payments.Select(p => new
            {
                p.Id,
                p.UserId,
                UserEmail = p.User.Email,
                UserFullName = p.User.FullName,
                UserWhatsApp = p.User.WhatsApp,
                p.SubscriptionId,
                PlanType = p.Subscription?.PlanType.ToString(),
                Method = p.Method.ToString(),
                p.Amount,
                p.Currency,
                p.ReceiptUrl,
                p.CreatedAt
            }));
        }

        [HttpPost("{id}/approve")]
        public async Task<IActionResult> ApprovePayment(int id)
        {
            var payment = await _db.Payments
                .Include(p => p.User)
                .Include(p => p.Subscription)
                .FirstOrDefaultAsync(p => p.Id == id);

            if (payment == null) return NotFound(new { message = "Payment not found." });
            if (payment.Status != PaymentStatus.Pending) return BadRequest(new { message = "Payment is not pending." });

            payment.Status = PaymentStatus.Confirmed;
            payment.ReviewedAt = DateTime.UtcNow;

            if (payment.Subscription != null)
            {
                var planDef = PlanCatalog.FindByPlanType(payment.Subscription.PlanType);
                var durationDays = planDef?.DurationDays ?? 30; // fallback safety net

                payment.Subscription.Status = SubscriptionStatus.Active;
                payment.Subscription.StartDate = DateTime.UtcNow;
                payment.Subscription.EndDate = DateTime.UtcNow.AddDays(durationDays);
            }

            payment.User.IsVip = true;
            payment.User.VipExpiresAt = payment.Subscription?.EndDate;

            await _db.SaveChangesAsync();

            try
            {
                var emailBody = $@"
                    <h3>VIP Access Activated!</h3>
                    <p>Congratulations!</p>
                    <p>Your payment has been successfully verified. Your VIP account is now active until {payment.User.VipExpiresAt:dd MMM yyyy}.</p>
                    <p>Log in now to view today's premium tips.</p>";

                await _emailService.SendEmailAsync(payment.User.Email, "VIP Activated - ProTipsBet", emailBody);
            }
            catch
            {
                // Don't fail the approval if the email fails to send.
            }

            return Ok(new { message = "Payment approved and VIP activated." });
        }

        [HttpPost("{id}/reject")]
        public async Task<IActionResult> RejectPayment(int id, [FromBody] RejectPaymentRequest? request)
        {
            var payment = await _db.Payments
                .Include(p => p.User)
                .Include(p => p.Subscription)
                .FirstOrDefaultAsync(p => p.Id == id);

            if (payment == null) return NotFound(new { message = "Payment not found." });
            if (payment.Status != PaymentStatus.Pending) return BadRequest(new { message = "Payment is not pending." });

            payment.Status = PaymentStatus.Rejected;
            payment.ReviewedAt = DateTime.UtcNow;
            payment.AdminNote = request?.Reason;

            if (payment.Subscription != null)
                payment.Subscription.Status = SubscriptionStatus.Cancelled;

            await _db.SaveChangesAsync();

            try
            {
                var emailBody = $@"
                    <h3>Payment Could Not Be Verified</h3>
                    <p>Hello,</p>
                    <p>We were unable to verify your recent payment{(string.IsNullOrWhiteSpace(request?.Reason) ? "." : $": {request!.Reason}")}</p>
                    <p>Please contact our support team or try submitting your payment proof again.</p>";

                await _emailService.SendEmailAsync(payment.User.Email, "Payment Verification Issue - ProTipsBet", emailBody);
            }
            catch
            {
                // Don't fail the rejection if the email fails to send.
            }

            return Ok(new { message = "Payment rejected." });
        }
    }

    public class RejectPaymentRequest
    {
        public string? Reason { get; set; }
    }
}