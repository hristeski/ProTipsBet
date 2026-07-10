using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ProTipsBet.Api.Data;
using ProTipsBet.Api.DTOs;
using ProTipsBet.Api.Models;
using ProTipsBet.Api.Services;

namespace ProTipsBet.Api.Controllers
{
    // ---------- Public: validate a code at checkout ----------
    [ApiController]
    [Route("api/discounts")]
    public class DiscountsController : ControllerBase
    {
        private readonly AppDbContext _db;
        public DiscountsController(AppDbContext db) => _db = db;

        [HttpPost("validate")]
        public async Task<ActionResult<ValidateDiscountResponse>> Validate(ValidateDiscountRequest request)
        {
            var plan = PlanCatalog.FindByFrontendId(request.PlanId);
            if (plan == null)
                return BadRequest(new { message = $"Invalid plan: '{request.PlanId}'." });

            var result = await DiscountCalculator.CheckAsync(_db, request.Code, plan.Price);

            return Ok(new ValidateDiscountResponse
            {
                Valid = result.Valid,
                Message = result.Message,
                OriginalPrice = plan.Price,
                FinalPrice = result.Valid ? result.FinalPrice : plan.Price
            });
        }
    }

    // ---------- Admin: manage codes ----------
    [ApiController]
    [Route("api/admin/discounts")]
    [Authorize(Roles = "Admin")]
    public class AdminDiscountsController : ControllerBase
    {
        private readonly AppDbContext _db;
        public AdminDiscountsController(AppDbContext db) => _db = db;

        [HttpGet]
        public async Task<ActionResult<IEnumerable<DiscountResponse>>> GetAll()
        {
            var codes = await _db.DiscountCodes.OrderByDescending(c => c.CreatedAt).ToListAsync();
            return Ok(codes.Select(MapToDto));
        }

        [HttpPost]
        public async Task<ActionResult<DiscountResponse>> Create(CreateDiscountRequest request)
        {
            var normalized = request.Code.Trim().ToUpperInvariant();

            if (await _db.DiscountCodes.AnyAsync(c => c.Code == normalized))
                return Conflict(new { message = "A discount code with this name already exists." });

            if (request.PercentOff == null && request.AmountOff == null)
                return BadRequest(new { message = "Set either PercentOff or AmountOff." });

            if (request.PercentOff is < 1 or > 100)
                return BadRequest(new { message = "PercentOff must be between 1 and 100." });

            var code = new DiscountCode
            {
                Code = normalized,
                PercentOff = request.PercentOff,
                AmountOff = request.AmountOff,
                MaxUses = request.MaxUses,
                ExpiresAt = request.ExpiresAt,
                IsActive = true,
                CreatedAt = DateTime.UtcNow
            };

            _db.DiscountCodes.Add(code);
            await _db.SaveChangesAsync();

            return Ok(MapToDto(code));
        }

        [HttpPut("{id}/toggle")]
        public async Task<IActionResult> Toggle(int id)
        {
            var code = await _db.DiscountCodes.FindAsync(id);
            if (code == null) return NotFound();

            code.IsActive = !code.IsActive;
            await _db.SaveChangesAsync();
            return Ok(MapToDto(code));
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var code = await _db.DiscountCodes.FindAsync(id);
            if (code == null) return NotFound();

            _db.DiscountCodes.Remove(code);
            await _db.SaveChangesAsync();
            return Ok(new { message = "Discount code deleted." });
        }

        private static DiscountResponse MapToDto(DiscountCode c) => new()
        {
            Id = c.Id,
            Code = c.Code,
            PercentOff = c.PercentOff,
            AmountOff = c.AmountOff,
            MaxUses = c.MaxUses,
            UsedCount = c.UsedCount,
            ExpiresAt = c.ExpiresAt,
            IsActive = c.IsActive,
            CreatedAt = c.CreatedAt
        };
    }
}
