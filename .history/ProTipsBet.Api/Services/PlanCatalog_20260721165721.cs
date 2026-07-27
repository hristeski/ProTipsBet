using ProTipsBet.Api.Models;

namespace ProTipsBet.Api.Services
{
    public class PlanDefinition
    {
        public PlanType PlanType { get; set; }
        public string FrontendId { get; set; } = string.Empty; // matches PRICING_PLANS[].id on the frontend
        public string Name { get; set; } = string.Empty;
        public decimal Price { get; set; }
        public string Currency { get; set; } = "EUR";
        public int DurationDays { get; set; }
    }

    // Single source of truth for plan pricing/duration. Keep this in sync with
    // src/lib/pricing.ts (PRICING_PLANS) on the frontend — ids must match exactly.
    public static class PlanCatalog
    {
        public static readonly List<PlanDefinition> Plans = new()
        {
            new PlanDefinition { PlanType = PlanType.Daily,   FrontendId = "daily",   Name = "Daily Pass",   Price = 20, Currency = "EUR", DurationDays = 1 },
            new PlanDefinition { PlanType = PlanType.Weekly,  FrontendId = "weekly",  Name = "Weekly Pass",  Price = 25, Currency = "EUR", DurationDays = 7 },
            new PlanDefinition { PlanType = PlanType.Monthly, FrontendId = "monthly", Name = "Monthly Pro",  Price = 60, Currency = "EUR", DurationDays = 30 },
        };

        public static PlanDefinition? FindByFrontendId(string? frontendId)
        {
            if (string.IsNullOrWhiteSpace(frontendId)) return null;
            return Plans.FirstOrDefault(p => p.FrontendId.Equals(frontendId, StringComparison.OrdinalIgnoreCase));
        }

        public static PlanDefinition? FindByPlanType(PlanType planType)
        {
            return Plans.FirstOrDefault(p => p.PlanType == planType);
        }
    }
}
