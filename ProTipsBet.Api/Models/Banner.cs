using System.ComponentModel.DataAnnotations;

namespace ProTipsBet.Api.Models
{
    public class Banner
    {
        public int Id { get; set; }

        [Required, MaxLength(500)]
        public string ImageUrl { get; set; } = string.Empty;

        [MaxLength(500)]
        public string? LinkUrl { get; set; }

        [MaxLength(100)]
        public string? AdvertiserName { get; set; }

        // Where on the site it should appear: Home, Sidebar, Footer, VipPage, etc.
        [MaxLength(50)]
        public string Position { get; set; } = "Home";

        public int SortOrder { get; set; } = 0;

        public bool IsActive { get; set; } = true;

        public DateTime? ExpiresAt { get; set; }

        public int ClickCount { get; set; } = 0;

        public int ImpressionCount { get; set; } = 0;

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}
