using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ProTipsBet.Api.Models
{
    public enum TipResult
    {
        Pending = 0,
        Win = 1,
        Loss = 2,
        Void = 3
    }

    public class Tip
    {
        public int Id { get; set; }

        [Required, MaxLength(100)]
        public string HomeTeam { get; set; } = string.Empty;

        [Required, MaxLength(100)]
        public string AwayTeam { get; set; } = string.Empty;

        [MaxLength(100)]
        public string? League { get; set; }

        public DateTime MatchDate { get; set; }

        [Required, MaxLength(100)]
        public string PredictionType { get; set; } = string.Empty; // e.g. "Over 2.5", "1X2 - Home", "BTTS"

        [Column(TypeName = "decimal(6,2)")]
        public decimal Odds { get; set; }

        public TipResult Result { get; set; } = TipResult.Pending;

        public bool IsVip { get; set; } = false;

        [MaxLength(500)]
        public string? Analysis { get; set; }

        public bool IsPublished { get; set; } = false;

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        // Navigation
        public ICollection<TicketTip> TicketTips { get; set; } = new List<TicketTip>();
    }
}
