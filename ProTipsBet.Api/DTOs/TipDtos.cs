using System.ComponentModel.DataAnnotations;

namespace ProTipsBet.Api.DTOs
{
    public class CreateTipRequest
    {
        [Required, MaxLength(100)]
        public string HomeTeam { get; set; } = string.Empty;

        [Required, MaxLength(100)]
        public string AwayTeam { get; set; } = string.Empty;

        [MaxLength(100)]
        public string? League { get; set; }

        [Required]
        public DateTime MatchDate { get; set; }

        [Required, MaxLength(100)]
        public string PredictionType { get; set; } = string.Empty;

        [Required]
        public decimal Odds { get; set; }

        public bool IsVip { get; set; } = false;

        [MaxLength(500)]
        public string? Analysis { get; set; }

        public bool IsPublished { get; set; } = false;
    }

    public class UpdateTipRequest : CreateTipRequest
    {
        public string Result { get; set; } = "Pending"; // Pending / Win / Loss / Void
    }

    public class TipResponse
    {
        public int Id { get; set; }
        public string HomeTeam { get; set; } = string.Empty;
        public string AwayTeam { get; set; } = string.Empty;
        public string? League { get; set; }
        public DateTime MatchDate { get; set; }
        public string PredictionType { get; set; } = string.Empty;
        public decimal Odds { get; set; }
        public string Result { get; set; } = string.Empty;
        public bool IsVip { get; set; }
        public string? Analysis { get; set; }
        public bool IsPublished { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}
