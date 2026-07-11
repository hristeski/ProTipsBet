using System.ComponentModel.DataAnnotations;

namespace ProTipsBet.Api.Models
{
    public enum UserRole
    {
        User = 0,
        Admin = 1
    }

    public class User
    {
        public int Id { get; set; }

        [Required, MaxLength(255)]
        public string Email { get; set; } = string.Empty;

        [Required]
        public string PasswordHash { get; set; } = string.Empty;

        [MaxLength(100)]
        public string? FullName { get; set; }

        public UserRole Role { get; set; } = UserRole.User;

        public bool IsVip { get; set; } = false;

        public DateTime? VipExpiresAt { get; set; }

        public bool IsActive { get; set; } = true;

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        // Navigation properties
        public ICollection<Subscription> Subscriptions { get; set; } = new List<Subscription>();
        public ICollection<Payment> Payments { get; set; } = new List<Payment>();
    }
}
