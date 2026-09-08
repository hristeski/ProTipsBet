using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ProTipsBet.Api.Data;
using ProTipsBet.Api.DTOs;
using ProTipsBet.Api.Models;
using System.Text.Json;

namespace ProTipsBet.Api.Controllers
{
    [ApiController]
    [Route("api/admin/archive")]
    [Authorize(Roles = "Admin")]
    public class TicketsArchiveController : ControllerBase
    {
        private readonly AppDbContext _db;
        private readonly IWebHostEnvironment _env;
        private readonly IHttpClientFactory _httpClientFactory;
        private readonly IConfiguration _configuration;

        public TicketsArchiveController(
            AppDbContext db,
            IWebHostEnvironment env,
            IHttpClientFactory httpClientFactory,
            IConfiguration configuration)
        {
            _db = db;
            _env = env;
            _httpClientFactory = httpClientFactory;
            _configuration = configuration;
        }

        private async Task TriggerRevalidateAsync()
        {
            try
            {
                var secret = _configuration["Revalidate:Secret"];
                if (string.IsNullOrEmpty(secret)) return;

                var client = _httpClientFactory.CreateClient();
                await client.PostAsync($"https://protipsbet.com/api/revalidate?secret={secret}", null);
            }
            catch
            {
            }
        }

        [HttpGet]
        [AllowAnonymous]
        public async Task<IActionResult> GetAllTickets()
        {
            var tickets = await _db.TicketRecords
                .Include(t => t.Legs)
                .OrderByDescending(t => t.MatchDate)
                .ToListAsync();
            return Ok(tickets);
        }

        [HttpPost]
        public async Task<IActionResult> UploadTicket([FromForm] UploadTicketRequest request)
        {
            var uploadsFolder = Path.Combine(_env.WebRootPath, "uploads", "tickets");
            if (!Directory.Exists(uploadsFolder)) Directory.CreateDirectory(uploadsFolder);
            var uniqueFileName = Guid.NewGuid().ToString() + "_" + request.Image.FileName;
            var filePath = Path.Combine(uploadsFolder, uniqueFileName);
            using (var stream = new FileStream(filePath, FileMode.Create)) { await request.Image.CopyToAsync(stream); }

            var ticket = new TicketRecord
            {
                ImageUrl = $"/uploads/tickets/{uniqueFileName}",
                Description = request.Description ?? "Winning Ticket",
                TotalOdds = request.TotalOdds,
                MatchDate = request.MatchDate,
                IsVip = request.IsVip,
                CreatedAt = DateTime.UtcNow,
                Legs = new List<TicketRecordLeg>()
            };

            if (!string.IsNullOrEmpty(request.LegsJson))
            {
                var options = new JsonSerializerOptions { PropertyNameCaseInsensitive = true };
                var parsedLegs = JsonSerializer.Deserialize<List<TicketRecordLeg>>(request.LegsJson, options);
                if (parsedLegs != null) ticket.Legs = parsedLegs;
            }

            _db.TicketRecords.Add(ticket);
            await _db.SaveChangesAsync();
            await TriggerRevalidateAsync();

            return Ok(new { message = "Успешно!" });
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateTicket(int id, [FromForm] UploadTicketRequest request)
        {
            var ticket = await _db.TicketRecords
                .Include(t => t.Legs)
                .FirstOrDefaultAsync(t => t.Id == id);

            if (ticket == null) return NotFound(new { message = "Тикетот не е пронајден." });

            if (request.Image != null && request.Image.Length > 0)
            {
                var uploadsFolder = Path.Combine(_env.WebRootPath, "uploads", "tickets");
                if (!Directory.Exists(uploadsFolder)) Directory.CreateDirectory(uploadsFolder);

                var uniqueFileName = Guid.NewGuid().ToString() + "_" + request.Image.FileName;
                var filePath = Path.Combine(uploadsFolder, uniqueFileName);
                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    await request.Image.CopyToAsync(stream);
                }

                var oldPath = Path.Combine(_env.WebRootPath, ticket.ImageUrl.TrimStart('/'));
                if (System.IO.File.Exists(oldPath)) System.IO.File.Delete(oldPath);

                ticket.ImageUrl = $"/uploads/tickets/{uniqueFileName}";
            }

            ticket.Description = request.Description ?? ticket.Description;
            ticket.TotalOdds = request.TotalOdds;
            ticket.MatchDate = request.MatchDate;
            ticket.IsVip = request.IsVip;

            if (!string.IsNullOrEmpty(request.LegsJson))
            {
                var options = new JsonSerializerOptions { PropertyNameCaseInsensitive = true };
                var parsedLegs = JsonSerializer.Deserialize<List<TicketRecordLeg>>(request.LegsJson, options);

                if (parsedLegs != null)
                {
                    _db.RemoveRange(ticket.Legs);
                    ticket.Legs = parsedLegs;
                }
            }

            await _db.SaveChangesAsync();
            await TriggerRevalidateAsync();

            return Ok(new { message = "Тикетот е ажуриран." });
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteTicket(int id)
        {
            var ticket = await _db.TicketRecords.Include(t => t.Legs).FirstOrDefaultAsync(t => t.Id == id);
            if (ticket == null) return NotFound();

            var fullPath = Path.Combine(_env.WebRootPath ?? Path.Combine(Directory.GetCurrentDirectory(), "wwwroot"), ticket.ImageUrl.TrimStart('/'));
            if (System.IO.File.Exists(fullPath)) System.IO.File.Delete(fullPath);

            _db.TicketRecords.Remove(ticket);
            await _db.SaveChangesAsync();
            await TriggerRevalidateAsync();

            return Ok(new { message = "Тикетот е избришан." });
        }
    }
}