using System.Net;
using System.Net.Mail;
using System.Threading.Tasks;

namespace ProTipsBet.Api.Services
{
    // 1. Интерфејсот (Ова е тоа што му фалеше на C#)
    public interface IEmailService
    {
        Task SendEmailAsync(string toEmail, string subject, string body);
    }

    // 2. Имплементацијата
    public class EmailService : IEmailService
    {
        public async Task SendEmailAsync(string toEmail, string subject, string body)
        {
            var smtpServer = "smtp.hostinger.com"; 
            var smtpPort = 587; 
            var smtpUser = "support@protipsbet.com";
            var smtpPass = "ТВОЈАТА_МЕЈЛ_ЛОЗИНКА_ТУКА"; // Смени го ова со вистинската лозинка

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