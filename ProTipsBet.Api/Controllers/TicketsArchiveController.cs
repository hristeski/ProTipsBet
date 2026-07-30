using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ProTipsBet.Api.Data;
using ProTipsBet.Api.DTOs;
using ProTipsBet.Api.Models;
using System.Text.Json; // Задолжително за парсирање на JSON

namespace ProTipsBet.Api.Controllers
{
    [ApiController]
    [Route("api/admin/archive")]
    [Authorize(Roles = "Admin")]
    public class TicketsArchiveController : ControllerBase
    {
        private readonly AppDbContext _db;
        private readonly IWebHostEnvironment _env;

        public TicketsArchiveController(AppDbContext db, IWebHostEnvironment env)
        {
            _db = db;
            _env = env;
        }

        [HttpGet]
        [AllowAnonymous] // <--- ОВА ЈА ПУШТА ЈАВНАТА СТРАНА ДА ГИ ВИДИ ТИКЕТИТЕ!
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
            // 1. Сними ја сликата прво
            var uploadsFolder = Path.Combine(_env.WebRootPath, "uploads", "tickets");
            if (!Directory.Exists(uploadsFolder)) Directory.CreateDirectory(uploadsFolder);
            var uniqueFileName = Guid.NewGuid().ToString() + "_" + request.Image.FileName;
            var filePath = Path.Combine(uploadsFolder, uniqueFileName);
            using (var stream = new FileStream(filePath, FileMode.Create)) { await request.Image.CopyToAsync(stream); }

            // 2. Креирај го тикетот
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

            // 3. ПАРСИРАЊЕ - тука често паѓаше
            if (!string.IsNullOrEmpty(request.LegsJson))
            {
                var options = new JsonSerializerOptions { PropertyNameCaseInsensitive = true };
                var parsedLegs = JsonSerializer.Deserialize<List<TicketRecordLeg>>(request.LegsJson, options);
                if (parsedLegs != null) ticket.Legs = parsedLegs;
            }

            _db.TicketRecords.Add(ticket);
            await _db.SaveChangesAsync();
            return Ok(new { message = "Успешно!" });
        }

        // НОВО: Edit постоечки тикет — ова недостасуваше, затоа Edit копчето
        // од admin/archive страницата фрлаше грешка (немаше route за PUT).
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateTicket(int id, [FromForm] UploadTicketRequest request)
        {
            var ticket = await _db.TicketRecords
                .Include(t => t.Legs)
                .FirstOrDefaultAsync(t => t.Id == id);

            if (ticket == null) return NotFound(new { message = "Тикетот не е пронајден." });

            // Слика: замени само ако е прикачена нова (при edit сликата не е задолжителна)
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

                // избриши ја старата слика од дискот
                var oldPath = Path.Combine(_env.WebRootPath, ticket.ImageUrl.TrimStart('/'));
                if (System.IO.File.Exists(oldPath)) System.IO.File.Delete(oldPath);

                ticket.ImageUrl = $"/uploads/tickets/{uniqueFileName}";
            }

            ticket.Description = request.Description ?? ticket.Description;
            ticket.TotalOdds = request.TotalOdds;
            ticket.MatchDate = request.MatchDate;
            ticket.IsVip = request.IsVip;

            // Замени ги старите legs со новите испратени од формата
            if (!string.IsNullOrEmpty(request.LegsJson))
            {
                var options = new JsonSerializerOptions { PropertyNameCaseInsensitive = true };
                var parsedLegs = JsonSerializer.Deserialize<List<TicketRecordLeg>>(request.LegsJson, options);

                if (parsedLegs != null)
                {
                    _db.RemoveRange(ticket.Legs); // избриши ги старите редови
                    ticket.Legs = parsedLegs;
                }
            }

            await _db.SaveChangesAsync();
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

            return Ok(new { message = "Тикетот е избришан." });
        }
    }
}