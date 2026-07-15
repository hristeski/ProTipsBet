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
            if (request.Image == null || request.Image.Length == 0)
                return BadRequest(new { message = "Image is required." });

            var uploadsFolder = Path.Combine(_env.WebRootPath ?? Path.Combine(Directory.GetCurrentDirectory(), "wwwroot"), "uploads", "tickets");
            if (!Directory.Exists(uploadsFolder)) Directory.CreateDirectory(uploadsFolder);

            var uniqueFileName = Guid.NewGuid().ToString() + "_" + request.Image.FileName;
            var filePath = Path.Combine(uploadsFolder, uniqueFileName);

            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await request.Image.CopyToAsync(stream);
            }

            var ticket = new TicketRecord
            {
                ImageUrl = $"/uploads/tickets/{uniqueFileName}",
                Description = string.IsNullOrWhiteSpace(request.Description) ? "Winning Ticket" : request.Description,
                TotalOdds = request.TotalOdds,
                MatchDate = request.MatchDate,
                IsVip = request.IsVip,
                CreatedAt = DateTime.UtcNow,
                Legs = new List<TicketRecordLeg>() // Иницијализирај ја листата
            };

            // КЛУЧНИОТ ДЕЛ: Ги земаме натпреварите од JSON и ги ставаме во тикетот
            // КЛУЧНИОТ ДЕЛ СО ДЕБАГИРАЊЕ
            if (!string.IsNullOrWhiteSpace(request.LegsJson))
            {
                try
                {
                    var parsedLegs = JsonSerializer.Deserialize<List<TicketRecordLeg>>(
                        request.LegsJson, 
                        new JsonSerializerOptions { PropertyNameCaseInsensitive = true }
                    );
                    
                    if (parsedLegs != null)
                    {
                        foreach (var leg in parsedLegs)
                        {
                            ticket.Legs.Add(leg);
                        }
                    }
                }
                catch (Exception ex)
                {
                    // ВАЖНО: Ова ќе ја испише точната грешка во терминалот каде што работи бекендот
                    Console.WriteLine("--- ГРЕШКА ПРИ ПАРСИРАЊЕ LEGS ---");
                    Console.WriteLine(ex.Message);
                    Console.WriteLine("--- КРАЈ НА ГРЕШКАТА ---");
                }
            }

            try 
            {
                _db.TicketRecords.Add(ticket);
                await _db.SaveChangesAsync();
            }
            catch (Exception dbEx)
            {
                // Ова ќе ја испише грешката од Базата (ако фали некој податок или релација)
                Console.WriteLine("--- ГРЕШКА ВО БАЗАТА ---");
                Console.WriteLine(dbEx.InnerException?.Message ?? dbEx.Message);
                return StatusCode(500, new { message = "Database error: " + dbEx.Message });
            }

            return Ok(ticket);
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