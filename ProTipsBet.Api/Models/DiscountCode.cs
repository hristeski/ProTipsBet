using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ProTipsBet.Api.Models
{
    public class DiscountCode
    {
        public int Id { get; set; }

        [Required, MaxLength(30)]
        public string Code { get; set; } = string.Empty; // e.g. "WELCOME10" — stored uppercase

        // Exactly one of these should be set (percent OR fixed amount off)
        public int? PercentOff { get; set; } // 1-100

        [Column(TypeName = "decimal(8,2)")]
        public decimal? AmountOff { get; set; } // e.g. 5.00 EUR off

        public int? MaxUses { get; set; } // null = unlimited
        public int UsedCount { get; set; } = 0;

        public DateTime? ExpiresAt { get; set; } // null = never expires

        public bool IsActive { get; set; } = true;

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}
