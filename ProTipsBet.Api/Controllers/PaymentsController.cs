using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ProTipsBet.Api.Data;
using ProTipsBet.Api.DTOs;
using ProTipsBet.Api.Models;
using ProTipsBet.Api.Services;

namespace ProTipsBet.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PaymentsController : ControllerBase
    {
        private readonly AppDbContext _db;
        private readonly IWebHostEnvironment _env;
        private readonly IEmailService _emailService;
        private readonly ITokenService _tokenService;

        public PaymentsController(AppDbContext db, IWebHostEnvironment env, IEmailService emailService, ITokenService tokenService)
        {
            _db = db;
            _env = env;
            _emailService = emailService;
            _tokenService = tokenService;
        }

        [HttpPost("submit")]
        public async Task<IActionResult> SubmitPayment([FromForm] SubmitPaymentRequest request)
        {
            // ---------- Validate plan ----------
            var plan = PlanCatalog.FindByFrontendId(request.PlanId);
            if (plan == null)
                return BadRequest(new { message = $"Invalid plan: '{request.PlanId}'. Valid options: daily, weekly, monthly." });

            // ---------- Validate payment method ----------
            if (!PaymentMethodMapper.TryParse(request.PaymentMethod, out var paymentMethod))
                return BadRequest(new { message = $"Invalid payment method: '{request.PaymentMethod}'." });

            // ---------- Validate proof (required for manual methods, crypto may not need it yet) ----------
            if (request.Proof == null || request.Proof.Length == 0)
                return BadRequest(new { message = "Proof of payment is required." });

            var emailNormalized = request.Email.Trim().ToLowerInvariant();
            if (string.IsNullOrWhiteSpace(emailNormalized) || string.IsNullOrWhiteSpace(request.Password))
                return BadRequest(new { message = "Email and password are required." });

            var user = await _db.Users.FirstOrDefaultAsync(u => u.Email == emailNormalized);

            if (user == null)
            {
                // New user — create account
                user = new User
                {
                    Email = emailNormalized,
                    PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.Password),
                    Role = UserRole.User,
                    IsVip = false,
                    IsActive = true,
                    CreatedAt = DateTime.UtcNow
                };
                _db.Users.Add(user);
                await _db.SaveChangesAsync();
            }
            else
            {
                // Existing user — MUST verify password before attaching a payment to their account.
                // Without this check, anyone who knows a user's email could submit fake payments
                // under that account.
                if (!BCrypt.Net.BCrypt.Verify(request.Password, user.PasswordHash))
                    return Unauthorized(new { message = "An account with this email already exists. Incorrect password." });

                if (!user.IsActive)
                    return Unauthorized(new { message = "This account has been deactivated." });
            }

            // ---------- Save proof file ----------
            var uploadsFolder = Path.Combine(_env.WebRootPath ?? Path.Combine(Directory.GetCurrentDirectory(), "wwwroot"), "uploads", "receipts");
            if (!Directory.Exists(uploadsFolder))
                Directory.CreateDirectory(uploadsFolder);

            var uniqueFileName = $"{Guid.NewGuid()}_{Path.GetFileName(request.Proof.FileName)}";
            var filePath = Path.Combine(uploadsFolder, uniqueFileName);

            using (var fileStream = new FileStream(filePath, FileMode.Create))
            {
                await request.Proof.CopyToAsync(fileStream);
            }

            var receiptUrl = $"/uploads/receipts/{uniqueFileName}";

            // ---------- Create pending subscription ----------
            var now = DateTime.UtcNow;
            var subscription = new Subscription
            {
                UserId = user.Id,
                PlanType = plan.PlanType,
                Price = plan.Price,
                Currency = plan.Currency,
                StartDate = now,
                EndDate = now.AddDays(plan.DurationDays), // will be recalculated from approval date when admin confirms
                Status = SubscriptionStatus.PendingPayment,
                CreatedAt = now
            };
            _db.Subscriptions.Add(subscription);
            await _db.SaveChangesAsync();

            // ---------- Create pending payment ----------
            var payment = new Payment
            {
                UserId = user.Id,
                SubscriptionId = subscription.Id,
                Method = paymentMethod,
                Amount = plan.Price,
                Currency = plan.Currency,
                Status = PaymentStatus.Pending,
                ReceiptUrl = receiptUrl,
                CreatedAt = now
            };
            _db.Payments.Add(payment);
            await _db.SaveChangesAsync();

            // ---------- Notify user by email (best-effort, don't fail the request if email fails) ----------
            try
            {
                var emailBody = $@"
                    <h3>Payment Received</h3>
                    <p>Hello,</p>
                    <p>We have received your payment proof for the {plan.Name} plan via {request.PaymentMethod}.</p>
                    <p>Our team is currently reviewing it. You will receive another email once your VIP access is activated.</p>
                    <p>Thank you,<br/>ProTipsBet Team</p>";

                await _emailService.SendEmailAsync(user.Email, "Payment Received - ProTipsBet", emailBody);
            }
            catch
            {
                // Email failures should not block the payment submission itself.
            }

            // ---------- Log the user in immediately so the frontend can redirect to a logged-in state ----------
            var (token, expiresAt) = _tokenService.GenerateToken(user);

            return Ok(new
            {
                message = "Payment submitted successfully.",
                token,
                expiresAt,
                subscriptionId = subscription.Id,
                paymentId = payment.Id
            });
        }
    }
}
