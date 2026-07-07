using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ProTipsBet.Api.Data;
using ProTipsBet.Api.DTOs;
using ProTipsBet.Api.Models;

namespace ProTipsBet.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TipsController : ControllerBase
    {
        private readonly AppDbContext _db;

        public TipsController(AppDbContext db)
        {
            _db = db;
        }

        // GET /api/tips?date=2026-07-08&vipOnly=false
        // Public endpoint. VIP tips are returned but with prediction details masked
        // unless the caller is an authenticated, active VIP user (or Admin).
        [HttpGet]
        public async Task<ActionResult<IEnumerable<TipResponse>>> GetTips([FromQuery] DateTime? date, [FromQuery] bool? vipOnly)
        {
            var query = _db.Tips.Where(t => t.IsPublished).AsQueryable();

            if (date.HasValue)
            {
                var day = date.Value.Date;
                query = query.Where(t => t.MatchDate.Date == day);
            }

            if (vipOnly.HasValue)
                query = query.Where(t => t.IsVip == vipOnly.Value);

            var tips = await query.OrderBy(t => t.MatchDate).ToListAsync();

            var userCanSeeVip = UserCanSeeVipContent();

            var result = tips.Select(t => MapToDto(t, userCanSeeVip));
            return Ok(result);
        }

        // GET /api/tips/5
        [HttpGet("{id}")]
        public async Task<ActionResult<TipResponse>> GetTip(int id)
        {
            var tip = await _db.Tips.FindAsync(id);
            if (tip == null || !tip.IsPublished)
                return NotFound();

            var userCanSeeVip = UserCanSeeVipContent();
            return Ok(MapToDto(tip, userCanSeeVip));
        }

        // GET /api/tips/history?days=30
        // Past tips (match date before now) with their final result — for the "History" page.
        [HttpGet("history")]
        public async Task<ActionResult<IEnumerable<TipResponse>>> GetHistory([FromQuery] int days = 30)
        {
            var since = DateTime.UtcNow.AddDays(-days);
            var tips = await _db.Tips
                .Where(t => t.IsPublished && t.MatchDate < DateTime.UtcNow && t.MatchDate >= since)
                .OrderByDescending(t => t.MatchDate)
                .ToListAsync();

            var userCanSeeVip = UserCanSeeVipContent();
            return Ok(tips.Select(t => MapToDto(t, userCanSeeVip)));
        }

        // ---------- Admin-only endpoints ----------

        [Authorize(Roles = "Admin")]
        [HttpPost]
        public async Task<ActionResult<TipResponse>> CreateTip(CreateTipRequest request)
        {
            var tip = new Tip
            {
                HomeTeam = request.HomeTeam,
                AwayTeam = request.AwayTeam,
                League = request.League,
                MatchDate = request.MatchDate,
                PredictionType = request.PredictionType,
                Odds = request.Odds,
                IsVip = request.IsVip,
                Analysis = request.Analysis,
                IsPublished = request.IsPublished,
                Result = TipResult.Pending,
                CreatedAt = DateTime.UtcNow
            };

            _db.Tips.Add(tip);
            await _db.SaveChangesAsync();

            return CreatedAtAction(nameof(GetTip), new { id = tip.Id }, MapToDto(tip, true));
        }

        [Authorize(Roles = "Admin")]
        [HttpPut("{id}")]
        public async Task<ActionResult<TipResponse>> UpdateTip(int id, UpdateTipRequest request)
        {
            var tip = await _db.Tips.FindAsync(id);
            if (tip == null)
                return NotFound();

            tip.HomeTeam = request.HomeTeam;
            tip.AwayTeam = request.AwayTeam;
            tip.League = request.League;
            tip.MatchDate = request.MatchDate;
            tip.PredictionType = request.PredictionType;
            tip.Odds = request.Odds;
            tip.IsVip = request.IsVip;
            tip.Analysis = request.Analysis;
            tip.IsPublished = request.IsPublished;

            if (Enum.TryParse<TipResult>(request.Result, out var parsedResult))
                tip.Result = parsedResult;

            await _db.SaveChangesAsync();
            return Ok(MapToDto(tip, true));
        }

        [Authorize(Roles = "Admin")]
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteTip(int id)
        {
            var tip = await _db.Tips.FindAsync(id);
            if (tip == null)
                return NotFound();

            _db.Tips.Remove(tip);
            await _db.SaveChangesAsync();
            return NoContent();
        }

        // ---------- Helpers ----------

        private bool UserCanSeeVipContent()
        {
            if (!User.Identity?.IsAuthenticated ?? true)
                return false;

            if (User.IsInRole("Admin"))
                return true;

            var isVipClaim = User.FindFirst("isVip")?.Value;
            return isVipClaim == "true";
        }

        private static TipResponse MapToDto(Tip tip, bool userCanSeeVip)
        {
            var locked = tip.IsVip && !userCanSeeVip;

            return new TipResponse
            {
                Id = tip.Id,
                HomeTeam = tip.HomeTeam,
                AwayTeam = tip.AwayTeam,
                League = tip.League,
                MatchDate = tip.MatchDate,
                PredictionType = locked ? "🔒 VIP" : tip.PredictionType,
                Odds = locked ? 0 : tip.Odds,
                Result = tip.Result.ToString(),
                IsVip = tip.IsVip,
                Analysis = locked ? null : tip.Analysis,
                IsPublished = tip.IsPublished,
                CreatedAt = tip.CreatedAt
            };
        }
    }
}
