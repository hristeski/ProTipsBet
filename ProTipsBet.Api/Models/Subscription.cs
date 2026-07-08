using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ProTipsBet.Api.Models
{
    public enum PlanType
    {
        Daily = 0,
        Weekly = 1,
        Monthly = 2,
        Quarterly = 3,
        Yearly = 4
    }

    public enum SubscriptionStatus
    {
        PendingPayment = 0,
        Active = 1,
        Expired = 2,
        Cancelled = 3
    }

    public class Subscription
    {
        public int Id { get; set; }

        public int UserId { get; set; }
        public User User { get; set; } = null!;

        public PlanType PlanType { get; set; }

        [Column(TypeName = "decimal(8,2)")]
        public decimal Price { get; set; }

        [MaxLength(10)]
        public string Currency { get; set; } = "EUR";

        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }

        public SubscriptionStatus Status { get; set; } = SubscriptionStatus.PendingPayment;

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        // Navigation
        public ICollection<Payment> Payments { get; set; } = new List<Payment>();
    }
}
