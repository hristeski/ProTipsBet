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
        public string PredictionType { get; set; } = string.Empty;

        [Column(TypeName = "decimal(6,2)")]
        public decimal Odds { get; set; }

        public TipResult Result { get; set; } = TipResult.Pending;

        public bool IsVip { get; set; } = false;

        [MaxLength(4000)]
        public string? Analysis { get; set; }

        // НОВО: comma-separated tags за internal linking / категоризација
        // пр. "Derby,High Odds,Weekend" - се прикажуваат како clickable chips
        [MaxLength(300)]
        public string? Tags { get; set; }

        public bool IsPublished { get; set; } = false;

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public ICollection<TicketTip> TicketTips { get; set; } = new List<TicketTip>();
    }
}