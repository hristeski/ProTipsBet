using Microsoft.AspNetCore.Mvc;
using ProTipsBet.Api.Services;
using System.Threading.Tasks;
using System;

namespace ProTipsBet.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TestController : ControllerBase
    {
        private readonly IEmailService _emailService;

        public TestController(IEmailService emailService)
        {
            _emailService = emailService;
        }

        [HttpPost("send-test-email")]
        public async Task<IActionResult> SendTestEmail(string targetEmail)
        {
            try
            {
                string subject = "Тест од ProTipsBet!";
                string body = "<h1>Успешно!</h1><p>Ако го читаш ова, мејл сервисот работи перфектно. 🚀</p>";
                
                await _emailService.SendEmailAsync(targetEmail, subject, body);
                
                return Ok($"Мејлот е успешно испратен до {targetEmail}");
            }
            catch (Exception ex)
            {
                // Ова е клучно: ако има грешка со лозинката или портите, ќе ти ја испише точната причина!
                return BadRequest($"Настана грешка при праќање: {ex.Message}");
            }
        }
    }
}