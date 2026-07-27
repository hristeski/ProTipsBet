using Microsoft.EntityFrameworkCore;
using ProTipsBet.Api.Models;

namespace ProTipsBet.Api.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        public DbSet<User> Users => Set<User>();
        public DbSet<Tip> Tips => Set<Tip>();
        public DbSet<Ticket> Tickets => Set<Ticket>();
        public DbSet<TicketTip> TicketTips => Set<TicketTip>();
        public DbSet<Subscription> Subscriptions => Set<Subscription>();
        public DbSet<Payment> Payments => Set<Payment>();
        public DbSet<Banner> Banners => Set<Banner>();
        public DbSet<ContactMessage> ContactMessages => Set<ContactMessage>();
        public DbSet<TicketRecord> TicketRecords { get; set; }
        public DbSet<NewsletterSubscriber> NewsletterSubscribers { get; set; }
        // public DbSet<TicketRecordLeg> TicketRecordLegs => Set<TicketRecordLeg>();
public DbSet<TicketRecordLeg> TicketRecordLegs { get; set; }        

public DbSet<DiscountCode> DiscountCodes => Set<DiscountCode>();

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Unique email
            modelBuilder.Entity<User>()
                .HasIndex(u => u.Email)
                .IsUnique();

            // Composite key for join table Ticket <-> Tip
            modelBuilder.Entity<TicketTip>()
                .HasKey(tt => new { tt.TicketId, tt.TipId });

            modelBuilder.Entity<TicketTip>()
                .HasOne(tt => tt.Ticket)
                .WithMany(t => t.TicketTips)
                .HasForeignKey(tt => tt.TicketId);

            modelBuilder.Entity<TicketTip>()
                .HasOne(tt => tt.Tip)
                .WithMany(t => t.TicketTips)
                .HasForeignKey(tt => tt.TipId);

            // Subscription -> User (restrict delete to avoid orphaned payment history)
            modelBuilder.Entity<Subscription>()
                .HasOne(s => s.User)
                .WithMany(u => u.Subscriptions)
                .HasForeignKey(s => s.UserId)
                .OnDelete(DeleteBehavior.Restrict);

            // Payment -> User
            modelBuilder.Entity<Payment>()
                .HasOne(p => p.User)
                .WithMany(u => u.Payments)
                .HasForeignKey(p => p.UserId)
                .OnDelete(DeleteBehavior.Restrict);

            // Payment -> Subscription (optional)
            modelBuilder.Entity<Payment>()
                .HasOne(p => p.Subscription)
                .WithMany(s => s.Payments)
                .HasForeignKey(p => p.SubscriptionId)
                .OnDelete(DeleteBehavior.SetNull);

                  modelBuilder.Entity<TicketRecordLeg>()
        .HasOne(l => l.TicketRecord)
        .WithMany(t => t.Legs)
        .HasForeignKey(l => l.TicketRecordId)
        .OnDelete(DeleteBehavior.Cascade);

            // Store enums as strings for readability in DB (optional but recommended)
            modelBuilder.Entity<User>().Property(u => u.Role).HasConversion<string>();
            modelBuilder.Entity<Tip>().Property(t => t.Result).HasConversion<string>();
            modelBuilder.Entity<Ticket>().Property(t => t.Result).HasConversion<string>();
            modelBuilder.Entity<Subscription>().Property(s => s.PlanType).HasConversion<string>();
            modelBuilder.Entity<Subscription>().Property(s => s.Status).HasConversion<string>();
            modelBuilder.Entity<Payment>().Property(p => p.Method).HasConversion<string>();
            modelBuilder.Entity<Payment>().Property(p => p.Status).HasConversion<string>();
        }
    }
}
