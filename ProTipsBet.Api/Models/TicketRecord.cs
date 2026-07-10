namespace ProTipsBet.Api.Models
{
    public class TicketRecord
    {
        public int Id { get; set; }
        public string ImageUrl { get; set; } = string.Empty;

        // Optional overall title for the ticket, e.g. "Weekend Accumulator #12".
        // Individual match details now live in Legs below.
        public string Description { get; set; } = string.Empty;

        public decimal TotalOdds { get; set; }
        public DateTime MatchDate { get; set; }
        public bool IsVip { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        // Navigation — the individual matches that make up this ticket
        public ICollection<TicketRecordLeg> Legs { get; set; } = new List<TicketRecordLeg>();





        
    }
}
