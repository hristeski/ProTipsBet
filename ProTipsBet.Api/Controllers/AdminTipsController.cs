using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ProTipsBet.Api.Data;
using ProTipsBet.Api.DTOs;
using ProTipsBet.Api.Models;

namespace ProTipsBet.Api.Controllers
{
    [ApiController]
    [Route("api/admin/tips")]
    [Authorize(Roles = "Admin")] // FIX: was [Authorize] only — any logged-in user (incl. paying customers) could hit this
    public class AdminTipsController : ControllerBase
    {
        private readonly AppDbContext _db;

        public AdminTipsController(AppDbContext db) => _db = db;

        [HttpGet]
        public async Task<ActionResult<IEnumerable<TipResponse>>> GetAllTips()
        {
            var tips = await _db.Tips
                .OrderByDescending(t => t.MatchDate)
                .Select(t => new TipResponse
                {
                    Id = t.Id,
                    HomeTeam = t.HomeTeam,
                    AwayTeam = t.AwayTeam,
                    League = t.League,
                    MatchDate = t.MatchDate,
                    PredictionType = t.PredictionType,
                    Odds = t.Odds,
                    Result = t.Result.ToString(),
                    IsVip = t.IsVip,
                    Analysis = t.Analysis,
                    IsPublished = t.IsPublished
                }).ToListAsync();

            return Ok(tips);
        }

        [HttpPost]
        public async Task<ActionResult<Tip>> CreateTip([FromBody] CreateTipDto request)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var tip = new Tip
            {
                HomeTeam = request.HomeTeam ?? "Unknown",
                AwayTeam = request.AwayTeam ?? "Unknown",
                League = request.League ?? "Unknown",
                MatchDate = request.MatchDate,
                PredictionType = request.PredictionType ?? "",
                Odds = request.Odds,
                IsVip = request.IsVip,
                Analysis = request.Analysis ?? "",
                IsPublished = request.IsPublished,
                Result = TipResult.Pending,
                CreatedAt = DateTime.UtcNow
            };

            _db.Tips.Add(tip);
            await _db.SaveChangesAsync();
            return Ok(tip);
        }

        [HttpPut("{id}/result")]
        public async Task<IActionResult> UpdateResult(int id, [FromBody] UpdateResultDto request)
        {
            var tip = await _db.Tips.FindAsync(id);
            if (tip == null) return NotFound();

            if (Enum.TryParse<TipResult>(request.Result, true, out var parsedResult))
            {
                tip.Result = parsedResult;
                await _db.SaveChangesAsync();
                return Ok();
            }
            return BadRequest("Invalid result value.");
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteTip(int id)
        {
            var tip = await _db.Tips.FindAsync(id);
            if (tip == null) return NotFound();

            _db.Tips.Remove(tip);
            await _db.SaveChangesAsync();

            return Ok(new { message = "Tip deleted successfully." });
        }
    }

    public class CreateTipDto
    {
        public string HomeTeam { get; set; } = string.Empty;
        public string AwayTeam { get; set; } = string.Empty;
        public string? League { get; set; }
        public DateTime MatchDate { get; set; }
        public string PredictionType { get; set; } = string.Empty;
        public decimal Odds { get; set; }
        public bool IsVip { get; set; }
        public bool IsPublished { get; set; }
        public string? Analysis { get; set; }
    }

    public class UpdateResultDto
    {
        public string Result { get; set; } = string.Empty;
    }
}
