using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ProTipsBet.Api.Data;
using ProTipsBet.Api.DTOs;
using ProTipsBet.Api.Models;
using ProTipsBet.Api.Services;

namespace ProTipsBet.Api.Controllers
{
    [ApiController]
    [Route("api/admin/tips")]
    [Authorize(Roles = "Admin")]
    public class AdminTipsController : ControllerBase
    {
        private readonly AppDbContext _db;
        private readonly IEmailService _emailService;
        private readonly IHttpClientFactory _httpClientFactory;
        private readonly IConfiguration _configuration;

        public AdminTipsController(
            AppDbContext db,
            IEmailService emailService,
            IHttpClientFactory httpClientFactory,
            IConfiguration configuration)
        {
            _db = db;
            _emailService = emailService;
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
                    Tags = t.Tags,
                    IsPublished = t.IsPublished,
                    CreatedAt = t.CreatedAt
                }).ToListAsync();

            return Ok(tips);
        }

        [HttpPost]
        public async Task<ActionResult<Tip>> CreateTip([FromBody] CreateTipRequest request)
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
                Tags = request.Tags,
                IsPublished = request.IsPublished,
                Result = TipResult.Pending,
                CreatedAt = DateTime.UtcNow
            };

            _db.Tips.Add(tip);
            await _db.SaveChangesAsync();
            await TriggerRevalidateAsync();

            try
            {
                string subject;
                string body;
                List<string> targetEmails;

                if (tip.IsVip)
                {
                    subject = "💎 New VIP Tip Published!";
                    body = $@"
                        <div style='font-family: Arial, sans-serif; padding: 20px;'>
                            <h2 style='color: #d97706;'>A new VIP prediction is waiting for you!</h2>
                            <p>We just published a new VIP tip for <strong>{tip.MatchDate:dd MMM yyyy}</strong>.</p>
                            <p>Log in to your ProTipsBet account now to see the latest premium prediction and secure your profit.</p>
                            <br/>
                            <a href='https://protipsbet.com/login' style='background-color: #d97706; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; font-weight: bold;'>View VIP Tip</a>
                        </div>";

                    targetEmails = await _db.Users
                        .Where(u => u.IsVip && u.IsActive)
                        .Select(u => u.Email)
                        .ToListAsync();
                }
                else
                {
                    subject = "🔥 New FREE Tip Available!";
                    body = $@"
                        <div style='font-family: Arial, sans-serif; padding: 20px;'>
                            <h2 style='color: #2563eb;'>We just posted a new FREE tip!</h2>
                            <p>A new free prediction for <strong>{tip.MatchDate:dd MMM yyyy}</strong> is now live on our platform.</p>
                            <p>Head over to ProTipsBet to check it out before the match starts.</p>
                            <br/>
                            <a href='https://protipsbet.com/free-tips' style='background-color: #2563eb; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; font-weight: bold;'>View Free Tip</a>
                        </div>";

                    targetEmails = await _db.Users
                        .Where(u => u.IsActive)
                        .Select(u => u.Email)
                        .ToListAsync();
                }

                var newsletterEmails = await _db.NewsletterSubscribers
                    .Where(s => s.IsActive)
                    .Select(s => s.Email)
                    .ToListAsync();

                targetEmails = targetEmails
                    .Union(newsletterEmails, StringComparer.OrdinalIgnoreCase)
                    .ToList();

                if (targetEmails.Any())
                {
                    var emailTasks = targetEmails.Select(email => _emailService.SendEmailAsync(email, subject, body));
                    await Task.WhenAll(emailTasks);
                }
            }
            catch
            {
            }

            return Ok(tip);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateTip(int id, [FromBody] UpdateTipRequest request)
        {
            var tip = await _db.Tips.FindAsync(id);
            if (tip == null) return NotFound(new { message = "Типот не е пронајден." });

            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            tip.HomeTeam = request.HomeTeam ?? tip.HomeTeam;
            tip.AwayTeam = request.AwayTeam ?? tip.AwayTeam;
            tip.League = request.League ?? tip.League;
            tip.MatchDate = request.MatchDate;
            tip.PredictionType = request.PredictionType ?? tip.PredictionType;
            tip.Odds = request.Odds;
            tip.IsVip = request.IsVip;
            tip.Analysis = request.Analysis ?? tip.Analysis;
            tip.Tags = request.Tags ?? tip.Tags;
            tip.IsPublished = request.IsPublished;

            if (!string.IsNullOrEmpty(request.Result) &&
                Enum.TryParse<TipResult>(request.Result, true, out var parsedResult))
            {
                tip.Result = parsedResult;
            }

            await _db.SaveChangesAsync();
            await TriggerRevalidateAsync();

            return Ok(new TipResponse
            {
                Id = tip.Id,
                HomeTeam = tip.HomeTeam,
                AwayTeam = tip.AwayTeam,
                League = tip.League,
                MatchDate = tip.MatchDate,
                PredictionType = tip.PredictionType,
                Odds = tip.Odds,
                Result = tip.Result.ToString(),
                IsVip = tip.IsVip,
                Analysis = tip.Analysis,
                Tags = tip.Tags,
                IsPublished = tip.IsPublished,
                CreatedAt = tip.CreatedAt
            });
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
                await TriggerRevalidateAsync();
                return Ok();
            }
            return BadRequest("Invalid result value.");
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteTip(int id)
        {
            var tip = await _db.Tips.FindAsync(id);
            if (tip == null) return NotFound();

            tip.IsPublished = false;
            await _db.SaveChangesAsync();
            await TriggerRevalidateAsync();

            return Ok(new { message = "Tip unpublished successfully." });
        }
    }

    public class UpdateResultDto
    {
        public string Result { get; set; } = string.Empty;
    }
}