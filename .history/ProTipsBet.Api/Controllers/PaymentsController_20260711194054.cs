// using Microsoft.AspNetCore.Mvc;
// using Microsoft.EntityFrameworkCore;
// using ProTipsBet.Api.Data;
// using ProTipsBet.Api.DTOs;
// using ProTipsBet.Api.Models;
// using ProTipsBet.Api.Services;

// namespace ProTipsBet.Api.Controllers
// {
//     [ApiController]
//     [Route("api/[controller]")]
//     public class PaymentsController : ControllerBase
//     {
//         private readonly AppDbContext _db;
//         private readonly IWebHostEnvironment _env;
//         private readonly IEmailService _emailService;
//         private readonly ITokenService _tokenService;

//         public PaymentsController(AppDbContext db, IWebHostEnvironment env, IEmailService emailService, ITokenService tokenService)
//         {
//             _db = db;
//             _env = env;
//             _emailService = emailService;
//             _tokenService = tokenService;
//         }

//         [HttpPost("submit")]
//         public async Task<IActionResult> SubmitPayment([FromForm] SubmitPaymentRequest request)
//         {
//             var plan = PlanCatalog.FindByFrontendId(request.PlanId);
//             if (plan == null)
//                 return BadRequest(new { message = $"Invalid plan: '{request.PlanId}'. Valid options: daily, weekly, monthly." });

//             if (!PaymentMethodMapper.TryParse(request.PaymentMethod, out var paymentMethod))
//                 return BadRequest(new { message = $"Invalid payment method: '{request.PaymentMethod}'." });

//             if (request.Proof == null || request.Proof.Length == 0)
//                 return BadRequest(new { message = "Proof of payment is required." });

//             var emailNormalized = request.Email.Trim().ToLowerInvariant();
//             if (string.IsNullOrWhiteSpace(emailNormalized) || string.IsNullOrWhiteSpace(request.Password))
//                 return BadRequest(new { message = "Email and password are required." });

//             // ---------- Apply discount code (if any) ----------
//             var discountResult = await DiscountCalculator.CheckAsync(_db, request.DiscountCode, plan.Price);
//             if (!string.IsNullOrWhiteSpace(request.DiscountCode) && !discountResult.Valid)
//                 return BadRequest(new { message = discountResult.Message ?? "Invalid discount code." });

//             var finalPrice = discountResult.FinalPrice;

//             var user = await _db.Users.FirstOrDefaultAsync(u => u.Email == emailNormalized);

//             if (user == null)
//             {
//                 user = new User
//                 {
//                     Email = emailNormalized,
//                     PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.Password),
//                     Role = UserRole.User,
//                     IsVip = false,
//                     IsActive = true,
//                     CreatedAt = DateTime.UtcNow
//                 };
//                 _db.Users.Add(user);
//                 await _db.SaveChangesAsync();
//             }
//             else
//             {
//                 if (!BCrypt.Net.BCrypt.Verify(request.Password, user.PasswordHash))
//                     return Unauthorized(new { message = "An account with this email already exists. Incorrect password." });

//                 if (!user.IsActive)
//                     return Unauthorized(new { message = "This account has been deactivated." });
//             }

//             var uploadsFolder = Path.Combine(_env.WebRootPath ?? Path.Combine(Directory.GetCurrentDirectory(), "wwwroot"), "uploads", "receipts");
//             if (!Directory.Exists(uploadsFolder))
//                 Directory.CreateDirectory(uploadsFolder);

//             var uniqueFileName = $"{Guid.NewGuid()}_{Path.GetFileName(request.Proof.FileName)}";
//             var filePath = Path.Combine(uploadsFolder, uniqueFileName);

//             using (var fileStream = new FileStream(filePath, FileMode.Create))
//             {
//                 await request.Proof.CopyToAsync(fileStream);
//             }

//             var receiptUrl = $"/uploads/receipts/{uniqueFileName}";

//             var now = DateTime.UtcNow;
//             var subscription = new Subscription
//             {
//                 UserId = user.Id,
//                 PlanType = plan.PlanType,
//                 Price = finalPrice, // discounted price, not the sticker price
//                 Currency = plan.Currency,
//                 StartDate = now,
//                 EndDate = now.AddDays(plan.DurationDays),
//                 Status = SubscriptionStatus.PendingPayment,
//                 CreatedAt = now
//             };
//             _db.Subscriptions.Add(subscription);
//             await _db.SaveChangesAsync();

//             var payment = new Payment
//             {
//                 UserId = user.Id,
//                 SubscriptionId = subscription.Id,
//                 Method = paymentMethod,
//                 Amount = finalPrice,
//                 Currency = plan.Currency,
//                 Status = PaymentStatus.Pending,
//                 ReceiptUrl = receiptUrl,
//                 CreatedAt = now
//             };
//             _db.Payments.Add(payment);

//             // Mark the discount code as used (locked in at submission time)
//             if (discountResult.Code != null)
//                 discountResult.Code.UsedCount += 1;

//             await _db.SaveChangesAsync();

//             try
//             {
//                 var emailBody = $@"
//                     <h3>Payment Received</h3>
//                     <p>Hello,</p>
//                     <p>We have received your payment proof for the {plan.Name} plan via {request.PaymentMethod}
//                     {(discountResult.Code != null ? $" (discount code <strong>{discountResult.Code.Code}</strong> applied — total: {finalPrice} {plan.Currency})" : "")}.</p>
//                     <p>Our team is currently reviewing it. You will receive another email once your VIP access is activated.</p>
//                     <p>Thank you,<br/>ProTipsBet Team</p>";

//                 await _emailService.SendEmailAsync(user.Email, "Payment Received - ProTipsBet", emailBody);
//             }
//             catch
//             {
//                 // Email failures should not block the payment submission itself.
//             }

//             var (token, expiresAt) = _tokenService.GenerateToken(user);

//             return Ok(new
//             {
//                 message = "Payment submitted successfully.",
//                 token,
//                 expiresAt,
//                 subscriptionId = subscription.Id,
//                 paymentId = payment.Id,
//                 finalPrice
//             });
//         }
//     }
// }
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
            var plan = PlanCatalog.FindByFrontendId(request.PlanId);
            if (plan == null)
                return BadRequest(new { message = $"Invalid plan: '{request.PlanId}'. Valid options: daily, weekly, monthly." });

            if (!PaymentMethodMapper.TryParse(request.PaymentMethod, out var paymentMethod))
                return BadRequest(new { message = $"Invalid payment method: '{request.PaymentMethod}'." });

            if (request.Proof == null || request.Proof.Length == 0)
                return BadRequest(new { message = "Proof of payment is required." });

            var emailNormalized = request.Email.Trim().ToLowerInvariant();
            if (string.IsNullOrWhiteSpace(emailNormalized) || string.IsNullOrWhiteSpace(request.Password))
                return BadRequest(new { message = "Email and password are required." });

            if (string.IsNullOrWhiteSpace(request.FirstName) || string.IsNullOrWhiteSpace(request.LastName) || string.IsNullOrWhiteSpace(request.WhatsApp))
                return BadRequest(new { message = "First name, last name, and WhatsApp number are required." });

            var fullName = $"{request.FirstName.Trim()} {request.LastName.Trim()}".Trim();

            // ---------- Apply discount code (if any) ----------
            var discountResult = await DiscountCalculator.CheckAsync(_db, request.DiscountCode, plan.Price);
            if (!string.IsNullOrWhiteSpace(request.DiscountCode) && !discountResult.Valid)
                return BadRequest(new { message = discountResult.Message ?? "Invalid discount code." });

            var finalPrice = discountResult.FinalPrice;

            var user = await _db.Users.FirstOrDefaultAsync(u => u.Email == emailNormalized);

            if (user == null)
            {
                user = new User
                {
                    Email = emailNormalized,
                    PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.Password),
                    FullName = fullName,
                    WhatsApp = request.WhatsApp.Trim(),
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
                if (!BCrypt.Net.BCrypt.Verify(request.Password, user.PasswordHash))
                    return Unauthorized(new { message = "An account with this email already exists. Incorrect password." });

                if (!user.IsActive)
                    return Unauthorized(new { message = "This account has been deactivated." });

                // Keep contact info fresh - a returning customer renewing their
                // plan may have a new phone number or spelled their name differently.
                user.FullName = fullName;
                user.WhatsApp = request.WhatsApp.Trim();
                await _db.SaveChangesAsync();
            }

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

            var now = DateTime.UtcNow;
            var subscription = new Subscription
            {
                UserId = user.Id,
                PlanType = plan.PlanType,
                Price = finalPrice,
                Currency = plan.Currency,
                StartDate = now,
                EndDate = now.AddDays(plan.DurationDays),
                Status = SubscriptionStatus.PendingPayment,
                CreatedAt = now
            };
            _db.Subscriptions.Add(subscription);
            await _db.SaveChangesAsync();

            var payment = new Payment
            {
                UserId = user.Id,
                SubscriptionId = subscription.Id,
                Method = paymentMethod,
                Amount = finalPrice,
                Currency = plan.Currency,
                Status = PaymentStatus.Pending,
                ReceiptUrl = receiptUrl,
                CreatedAt = now
            };
            _db.Payments.Add(payment);

            if (discountResult.Code != null)
                discountResult.Code.UsedCount += 1;

            await _db.SaveChangesAsync();

            try
            {
                var emailBody = $@"
                    <h3>Payment Received</h3>
                    <p>Hello {request.FirstName},</p>
                    <p>We have received your payment proof for the {plan.Name} plan via {request.PaymentMethod}
                    {(discountResult.Code != null ? $" (discount code <strong>{discountResult.Code.Code}</strong> applied — total: {finalPrice} {plan.Currency})" : "")}.</p>
                    <p>Our team is currently reviewing it. You will receive another email once your VIP access is activated.</p>
                    <p>Thank you,<br/>ProTipsBet Team</p>";

                await _emailService.SendEmailAsync(user.Email, "Payment Received - ProTipsBet", emailBody);
            }
            catch
            {
                // Email failures should not block the payment submission itself.
            }

            var (token, expiresAt) = _tokenService.GenerateToken(user);

            return Ok(new
            {
                message = "Payment submitted successfully.",
                token,
                expiresAt,
                subscriptionId = subscription.Id,
                paymentId = payment.Id,
                finalPrice
            });
        }
    }
}
