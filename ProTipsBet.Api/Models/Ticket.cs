using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ProTipsBet.Api.Models
{
    public class Ticket
    {
        public int Id { get; set; }

        [Required, MaxLength(150)]
        public string Title { get; set; } = string.Empty; // e.g. "Weekend Accumulator #12"

        [Column(TypeName = "decimal(8,2)")]
        public decimal TotalOdds { get; set; }

        public TipResult Result { get; set; } = TipResult.Pending;

        public bool IsVip { get; set; } = false;

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        // Navigation
        public ICollection<TicketTip> TicketTips { get; set; } = new List<TicketTip>();
    }

    // Join table: a Ticket can contain multiple Tips (accumulator)
    public class TicketTip
    {
        public int TicketId { get; set; }
        public Ticket Ticket { get; set; } = null!;

        public int TipId { get; set; }
        public Tip Tip { get; set; } = null!;
    }
}
