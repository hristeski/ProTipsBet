using System.ComponentModel.DataAnnotations;

namespace ProTipsBet.Api.DTOs
{
    public class PlanDto
    {
        public string PlanType { get; set; } = string.Empty; // "daily" | "weekly" | "monthly" - matches frontend PRICING_PLANS ids
        public string Name { get; set; } = string.Empty;
        public decimal Price { get; set; }
        public string Currency { get; set; } = "EUR";
        public int DurationDays { get; set; }
    }

    public class CreateSubscriptionRequest
    {
        [Required]
        public string PlanType { get; set; } = string.Empty; // matches PlanCatalog.FindByFrontendId input
    }

    public class SubscriptionResponse
    {
        public int Id { get; set; }
        public string PlanType { get; set; } = string.Empty;
        public decimal Price { get; set; }
        public string Currency { get; set; } = string.Empty;
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public string Status { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; }
    }
}