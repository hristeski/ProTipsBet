using System.Net;
using System.Net.Mail;
using System.Threading.Tasks;
using Microsoft.Extensions.Configuration; // ОВА Е ДОДАДЕНО

namespace ProTipsBet.Api.Services
{
    // 1. Интерфејсот
    public interface IEmailService
    {
        Task SendEmailAsync(string toEmail, string subject, string body);
    }

    // 2. Имплементацијата
    public class EmailService : IEmailService
    {
        private readonly IConfiguration _config;

        // Конструктор преку кој пристапуваме до appsettings.json
        public EmailService(IConfiguration config)
        {
            _config = config;
        }

        public async Task SendEmailAsync(string toEmail, string subject, string body)
        {
            var smtpServer = "smtp.hostinger.com"; 
            var smtpPort = 587; 
            var smtpUser = "support@protipsbet.com";
            
            // ЛОЗИНКАТА СЕ ВЛЕЧЕ БЕЗБЕДНО ОД ФАЈЛОТ
            var smtpPass = _config["EmailSettings:SmtpPassword"]; 

            using var client = new SmtpClient(smtpServer, smtpPort)
            {
                Credentials = new NetworkCredential(smtpUser, smtpPass),
                EnableSsl = true
            };

            var mailMessage = new MailMessage
            {
                From = new MailAddress(smtpUser, "ProTipsBet VIP"),
                Subject = subject,
                Body = body,
                IsBodyHtml = true,
            };
            
            mailMessage.To.Add(toEmail);

            await client.SendMailAsync(mailMessage);
        }
    }
}