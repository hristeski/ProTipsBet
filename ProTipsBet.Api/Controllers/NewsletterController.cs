using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ProTipsBet.Api.Data;
using ProTipsBet.Api.DTOs;
using ProTipsBet.Api.Models;
using ProTipsBet.Api.Services;

namespace ProTipsBet.Api.Controllers
{
    [ApiController]
    [Route("api/newsletter")]
    public class NewsletterController : ControllerBase
    {
        private readonly AppDbContext _db;
        private readonly IEmailService _emailService;

        public NewsletterController(AppDbContext db, IEmailService emailService)
        {
            _db = db;
            _emailService = emailService;
        }

        [HttpPost("subscribe")]
        public async Task<IActionResult> Subscribe([FromBody] SubscribeDto dto)
        {
            if (string.IsNullOrWhiteSpace(dto.Email) || !dto.Email.Contains("@"))
                return BadRequest(new { message = "Invalid email address" });

            var email = dto.Email.Trim().ToLower();

            var exists = await _db.NewsletterSubscribers.AnyAsync(s => s.Email == email);
            if (exists)
                return Ok(new { message = "Already subscribed" });

            _db.NewsletterSubscribers.Add(new NewsletterSubscriber { Email = email });
            await _db.SaveChangesAsync();

            await _emailService.SendEmailAsync(
                email,
                "Welcome to ProTipsBet!",
                "<p>Thanks for subscribing! You'll now get notified as soon as new VIP and Free tips are published.</p>"
            );

            return Ok(new { message = "Subscribed" });
        }
    }
}