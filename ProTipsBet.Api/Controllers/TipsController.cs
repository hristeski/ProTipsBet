using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ProTipsBet.Api.Data;
using System.Security.Claims;

namespace ProTipsBet.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TipsController : ControllerBase
    {
        private readonly AppDbContext _db;

        public TipsController(AppDbContext db) => _db = db;

        [HttpGet]
        public async Task<IActionResult> GetPublicTips()
        {
            bool isVipUser = false;
            var userIdClaim = User.FindFirst(System.IdentityModel.Tokens.Jwt.JwtRegisteredClaimNames.Sub)?.Value
                              ?? User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            if (userIdClaim != null && int.TryParse(userIdClaim, out var userId))
            {
                var user = await _db.Users.FindAsync(userId);
                if (user != null && user.IsVip && (user.VipExpiresAt == null || user.VipExpiresAt > DateTime.UtcNow))
                {
                    isVipUser = true;
                }
            }

            var tips = await _db.Tips
                .Where(t => t.IsPublished)
                .OrderByDescending(t => t.MatchDate)
                .Take(50)
                .Select(t => new
                {
                    t.Id,
                    t.MatchDate,
                    t.Odds,
                    Result = t.Result.ToString(),
                    t.IsVip,
                    t.Analysis,
                    HomeTeam = (t.IsVip && !isVipUser) ? "Locked VIP Match" : t.HomeTeam,
                    AwayTeam = (t.IsVip && !isVipUser) ? "Locked" : t.AwayTeam,
                    PredictionType = (t.IsVip && !isVipUser) ? "***" : t.PredictionType,
                    League = (t.IsVip && !isVipUser) ? "VIP Only" : t.League
                })
                .ToListAsync();

            return Ok(tips);
        }

        [HttpGet("tickets")]
        public async Task<IActionResult> GetPublicTickets()
        {
            var tickets = await _db.TicketRecords
                .Include(t => t.Legs)
                .OrderByDescending(t => t.MatchDate)
                .Select(t => new
                {
                    t.Id,
                    t.ImageUrl,
                    t.Description,
                    t.TotalOdds,
                    t.MatchDate,
                    t.IsVip,
                    Legs = t.Legs.OrderBy(l => l.SortOrder).Select(l => new
                    {
                        l.Id,
                        l.League,
                        l.MatchDate,
                        l.HomeTeam,
                        l.AwayTeam,
                        l.Prediction,
                        l.Odds
                    })
                })
                .ToListAsync();

            return Ok(tickets);
        }
    }
}
