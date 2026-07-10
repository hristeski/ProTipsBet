using Microsoft.AspNetCore.Mvc;

namespace ProTipsBet.Api.DTOs
{
    public class TicketLegInput
    {
        public string? League { get; set; }
        public DateTime MatchDate { get; set; }
        public string HomeTeam { get; set; } = string.Empty;
        public string AwayTeam { get; set; } = string.Empty;
        public string Prediction { get; set; } = string.Empty;
        public decimal Odds { get; set; }
    }

    public class UploadTicketRequest
    {
        public IFormFile Image { get; set; } = null!;
        public string Description { get; set; } = string.Empty;
        public decimal TotalOdds { get; set; }
        public DateTime MatchDate { get; set; }
        public bool IsVip { get; set; }

        // Sent as a JSON string from the frontend (multipart forms can't carry
        // nested arrays directly), e.g. legsJson = '[{"league":"Serie A",...}]'
        public string? LegsJson { get; set; }
    }

    public class TicketLegResponse
    {
        public int Id { get; set; }
        public string? League { get; set; }
        public DateTime MatchDate { get; set; }
        public string HomeTeam { get; set; } = string.Empty;
        public string AwayTeam { get; set; } = string.Empty;
        public string Prediction { get; set; } = string.Empty;
        public decimal Odds { get; set; }
    }

    public class TicketRecordResponse
    {
        public int Id { get; set; }
        public string ImageUrl { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public decimal TotalOdds { get; set; }
        public DateTime MatchDate { get; set; }
        public bool IsVip { get; set; }
        public DateTime CreatedAt { get; set; }
        public List<TicketLegResponse> Legs { get; set; } = new();
    }
}
