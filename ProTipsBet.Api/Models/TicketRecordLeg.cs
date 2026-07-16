using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace ProTipsBet.Api.Models
{
    // A single match/selection inside a winning ticket screenshot.
    // A ticket can have one leg (single bet) or many (accumulator).
    public class TicketRecordLeg
    {
        public int Id { get; set; }

        public int TicketRecordId { get; set; }
        [JsonIgnore]
        public TicketRecord TicketRecord { get; set; } = null!;

        [MaxLength(100)]
        public string? League { get; set; }

        public DateTime MatchDate { get; set; }

        [Required, MaxLength(100)]
        public string HomeTeam { get; set; } = string.Empty;

        [Required, MaxLength(100)]
        public string AwayTeam { get; set; } = string.Empty;

        [Required, MaxLength(100)]
        public string Prediction { get; set; } = string.Empty; // e.g. "Over 2.5", "1", "BTTS - Yes"

        [Column(TypeName = "decimal(6,2)")]
        public decimal Odds { get; set; }

        public int SortOrder { get; set; } = 0;
    }
}
