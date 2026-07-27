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
    public class TicketsArchiveController : ControllerBase // Сменето името на класата!
    {
        private readonly AppDbContext _db;
        private readonly IWebHostEnvironment _env;

        public TicketsArchiveController(AppDbContext db, IWebHostEnvironment env)
        {
            _db = db;
            _env = env;
        }

        [HttpGet]
        public async Task<IActionResult> GetAllTickets()
        {
            // Додадено Include за да ги влече и натпреварите
            var tickets = await _db.TicketRecords.Include(t => t.Legs).OrderByDescending(t => t.MatchDate).ToListAsync();
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
    var ticket = new TicketRecord {
        ImageUrl = $"/uploads/tickets/{uniqueFileName}",
        Description = request.Description ?? "Winning Ticket",
        TotalOdds = request.TotalOdds,
        MatchDate = request.MatchDate,
        IsVip = request.IsVip,
        CreatedAt = DateTime.UtcNow,
        Legs = new List<TicketRecordLeg>()
    };

    // 3. ПАРСИРАЊЕ - тука често паѓаше
    if (!string.IsNullOrEmpty(request.LegsJson)) {
        var options = new JsonSerializerOptions { PropertyNameCaseInsensitive = true };
        var parsedLegs = JsonSerializer.Deserialize<List<TicketRecordLeg>>(request.LegsJson, options);
        if (parsedLegs != null) ticket.Legs = parsedLegs;
    }

    _db.TicketRecords.Add(ticket);
    await _db.SaveChangesAsync();
    return Ok(new { message = "Успешно!" });
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