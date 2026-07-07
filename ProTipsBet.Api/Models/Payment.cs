using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ProTipsBet.Api.Models
{
    public enum PaymentMethod
    {
        Crypto = 0,
        Skrill = 1,
        Neteller = 2,
        PayPal = 3,
        WesternUnion = 4,
        Mpesa = 5,
        Other = 6
    }

    public enum PaymentStatus
    {
        Pending = 0,
        Confirmed = 1,
        Rejected = 2
    }

    public class Payment
    {
        public int Id { get; set; }

        public int UserId { get; set; }
        public User User { get; set; } = null!;

        public int? SubscriptionId { get; set; }
        public Subscription? Subscription { get; set; }

        public PaymentMethod Method { get; set; }

        [Column(TypeName = "decimal(10,2)")]
        public decimal Amount { get; set; }

        [MaxLength(10)]
        public string Currency { get; set; } = "EUR";

        public PaymentStatus Status { get; set; } = PaymentStatus.Pending;

        // For manual confirmation flow (Skrill/Neteller/Western Union/Mpesa receipts)
        [MaxLength(500)]
        public string? ReceiptUrl { get; set; }

        [MaxLength(255)]
        public string? TransactionReference { get; set; } // e.g. crypto tx hash, WU MTCN, etc.

        [MaxLength(500)]
        public string? AdminNote { get; set; }

        public int? ReviewedByAdminId { get; set; }

        public DateTime? ReviewedAt { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}
