using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ProTipsBet.Api.Data;
using ProTipsBet.Api.DTOs;
using ProTipsBet.Api.Models;

namespace ProTipsBet.Api.Controllers
{
    [ApiController]
    [Route("api/admin/tips")] // Фиксна рута
    [Authorize] 
    public class AdminTipsController : ControllerBase // Сменето име за да нема конфликт!
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
        public async Task<ActionResult<Tip>> CreateTip(CreateTipRequest request)
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
                IsPublished = request.IsPublished
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
    }

    // Мал модел за да спречиме JSON парсирање грешки
    public class UpdateResultDto
    {
        public string Result { get; set; } = string.Empty;
    }
}