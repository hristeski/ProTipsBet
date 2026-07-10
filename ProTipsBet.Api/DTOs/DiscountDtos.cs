using System.ComponentModel.DataAnnotations;

namespace ProTipsBet.Api.DTOs
{
    public class CreateDiscountRequest
    {
        [Required, MaxLength(30)]
        public string Code { get; set; } = string.Empty;

        public int? PercentOff { get; set; }
        public decimal? AmountOff { get; set; }
        public int? MaxUses { get; set; }
        public DateTime? ExpiresAt { get; set; }
    }

    public class DiscountResponse
    {
        public int Id { get; set; }
        public string Code { get; set; } = string.Empty;
        public int? PercentOff { get; set; }
        public decimal? AmountOff { get; set; }
        public int? MaxUses { get; set; }
        public int UsedCount { get; set; }
        public DateTime? ExpiresAt { get; set; }
        public bool IsActive { get; set; }
        public DateTime CreatedAt { get; set; }
    }

    public class ValidateDiscountRequest
    {
        [Required]
        public string Code { get; set; } = string.Empty;

        [Required]
        public string PlanId { get; set; } = string.Empty; // daily / weekly / monthly
    }

    public class ValidateDiscountResponse
    {
        public bool Valid { get; set; }
        public string? Message { get; set; }
        public decimal OriginalPrice { get; set; }
        public decimal FinalPrice { get; set; }
    }
}
