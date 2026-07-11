using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
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
    public class SubscriptionsController : ControllerBase
    {
        private readonly AppDbContext _db;

        public SubscriptionsController(AppDbContext db)
        {
            _db = db;
        }

        [HttpGet("plans")]
        public ActionResult<IEnumerable<PlanDto>> GetPlans()
        {
            var plans = PlanCatalog.Plans.Select(p => new PlanDto
            {
                PlanType = p.FrontendId, // frontend expects e.g. "daily", "weekly", "monthly"
                Name = p.Name,
                Price = p.Price,
                Currency = p.Currency,
                DurationDays = p.DurationDays
            });

            return Ok(plans);
        }

        [Authorize]
        [HttpPost]
        public async Task<ActionResult<SubscriptionResponse>> CreateSubscription(CreateSubscriptionRequest request)
        {
            var plan = PlanCatalog.FindByFrontendId(request.PlanType);
            if (plan == null)
                return BadRequest(new { message = $"Invalid plan type: '{request.PlanType}'." });

            var userId = GetUserId();
            if (userId == null) return Unauthorized();

            var now = DateTime.UtcNow;
            var subscription = new Subscription
            {
                UserId = userId.Value,
                PlanType = plan.PlanType,
                Price = plan.Price,
                Currency = plan.Currency,
                StartDate = now,
                EndDate = now.AddDays(plan.DurationDays),
                Status = SubscriptionStatus.PendingPayment,
                CreatedAt = now
            };

            _db.Subscriptions.Add(subscription);
            await _db.SaveChangesAsync();

            return Ok(MapToDto(subscription));
        }

        [Authorize]
        [HttpGet("my")]
        public async Task<ActionResult<IEnumerable<SubscriptionResponse>>> GetMySubscriptions()
        {
            var userId = GetUserId();
            if (userId == null) return Unauthorized();

            var subs = await _db.Subscriptions
                .Where(s => s.UserId == userId.Value)
                .OrderByDescending(s => s.CreatedAt)
                .ToListAsync();

            return Ok(subs.Select(MapToDto));
        }

        [Authorize(Roles = "Admin")]
        [HttpGet]
        public async Task<ActionResult<IEnumerable<SubscriptionResponse>>> GetAllSubscriptions()
        {
            var subs = await _db.Subscriptions.OrderByDescending(s => s.CreatedAt).ToListAsync();
            return Ok(subs.Select(MapToDto));
        }

        private int? GetUserId()
        {
            var claim = User.FindFirst(System.IdentityModel.Tokens.Jwt.JwtRegisteredClaimNames.Sub)?.Value
                        ?? User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            return int.TryParse(claim, out var id) ? id : null;
        }

        private static SubscriptionResponse MapToDto(Subscription s) => new()
        {
            Id = s.Id,
            PlanType = s.PlanType.ToString(),
            Price = s.Price,
            Currency = s.Currency,
            StartDate = s.StartDate,
            EndDate = s.EndDate,
            Status = s.Status.ToString(),
            CreatedAt = s.CreatedAt
        };
    }
}
