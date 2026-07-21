using Microsoft.AspNetCore.Mvc;
using ProTipsBet.Api.Services;

namespace ProTipsBet.Api.Controllers
{
    public class ContactRequest
    {
        public string Name { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Subject { get; set; } = string.Empty;
        public string Message { get; set; } = string.Empty;
    }

    [ApiController]
    [Route("api/[controller]")]
    public class ContactController : ControllerBase
    {
        private readonly IEmailService _emailService;

        public ContactController(IEmailService emailService)
        {
            _emailService = emailService;
        }

        [HttpPost]
        public async Task<IActionResult> SubmitContact([FromBody] ContactRequest request)
        {
            if (string.IsNullOrWhiteSpace(request.Name) ||
                string.IsNullOrWhiteSpace(request.Email) ||
                string.IsNullOrWhiteSpace(request.Message))
            {
                return BadRequest(new { message = "Сите полиња се задолжителни." });
            }

            var body = $@"
                <h3>Нова порака од контакт формата</h3>
                <p><strong>Име:</strong> {request.Name}</p>
                <p><strong>Емаил:</strong> {request.Email}</p>
                <p><strong>Тема:</strong> {request.Subject}</p>
                <p><strong>Порака:</strong><br/>{request.Message}</p>
            ";

            try
            {
                await _emailService.SendEmailAsync("support@protipsbet.com", $"Contact Form: {request.Subject}", body);
                return Ok(new { message = "Пораката е испратена." });
            }
            catch (Exception)
            {
                return StatusCode(500, new { message = "Испраќањето не успеа. Обиди се повторно подоцна." });
            }
        }
    }
}
