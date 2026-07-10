using Microsoft.EntityFrameworkCore;
using ProTipsBet.Api.Data;
using ProTipsBet.Api.Models;

namespace ProTipsBet.Api.Services
{
    public class DiscountCheckResult
    {
        public bool Valid { get; set; }
        public string? Message { get; set; }
        public decimal FinalPrice { get; set; }
        public DiscountCode? Code { get; set; }
    }

    public static class DiscountCalculator
    {
        public static async Task<DiscountCheckResult> CheckAsync(AppDbContext db, string? rawCode, decimal originalPrice)
        {
            if (string.IsNullOrWhiteSpace(rawCode))
                return new DiscountCheckResult { Valid = true, FinalPrice = originalPrice, Code = null };

            var normalized = rawCode.Trim().ToUpperInvariant();
            var code = await db.DiscountCodes.FirstOrDefaultAsync(d => d.Code == normalized);

            if (code == null)
                return new DiscountCheckResult { Valid = false, Message = "Invalid discount code.", FinalPrice = originalPrice };

            if (!code.IsActive)
                return new DiscountCheckResult { Valid = false, Message = "This discount code is no longer active.", FinalPrice = originalPrice };

            if (code.ExpiresAt.HasValue && code.ExpiresAt.Value < DateTime.UtcNow)
                return new DiscountCheckResult { Valid = false, Message = "This discount code has expired.", FinalPrice = originalPrice };

            if (code.MaxUses.HasValue && code.UsedCount >= code.MaxUses.Value)
                return new DiscountCheckResult { Valid = false, Message = "This discount code has reached its usage limit.", FinalPrice = originalPrice };

            var finalPrice = originalPrice;
            if (code.PercentOff.HasValue)
                finalPrice = originalPrice - (originalPrice * code.PercentOff.Value / 100m);
            else if (code.AmountOff.HasValue)
                finalPrice = originalPrice - code.AmountOff.Value;

            if (finalPrice < 0) finalPrice = 0;

            return new DiscountCheckResult { Valid = true, FinalPrice = Math.Round(finalPrice, 2), Code = code };
        }
    }
}
