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
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly AppDbContext _db;
        private readonly ITokenService _tokenService;
        private readonly IEmailService _emailService;

        public AuthController(AppDbContext db, ITokenService tokenService, IEmailService emailService)
        {
            _db = db;
            _tokenService = tokenService;
            _emailService = emailService;
        }

        [HttpPost("register")]
        public async Task<ActionResult<AuthResponse>> Register(RegisterRequest request)
        {
            var emailNormalized = request.Email.Trim().ToLowerInvariant();

            var exists = await _db.Users.AnyAsync(u => u.Email == emailNormalized);
            if (exists)
                return Conflict(new { message = "Веќе постои корисник со овој email." });

            var user = new User
            {
                Email = emailNormalized,
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.Password),
                FullName = request.FullName,
                Role = UserRole.User,
                CreatedAt = DateTime.UtcNow
            };

            _db.Users.Add(user);
            await _db.SaveChangesAsync();

            var subject = "Welcome to ProTipsBet! 🏆";
            var body = $@"
                <div style='font-family: Arial, sans-serif; padding: 20px;'>
                    <h2>Welcome, {user.FullName}!</h2>
                    <p>Your account on <b>ProTipsBet</b> has been created successfully.</p>
                    <p>To log in, use your email address: <strong>{user.Email}</strong></p>
                    <p><i>For your security, your password is encrypted. If you forget it, please contact us to reset it.</i></p>
                    <p>Get started and start winning!</p>
                </div>";

            await _emailService.SendEmailAsync(user.Email, subject, body);

            var (token, expiresAt) = _tokenService.GenerateToken(user);

            return Ok(new AuthResponse
            {
                Token = token,
                ExpiresAt = expiresAt,
                User = MapToDto(user)
            });
        }

        [HttpPost("login")]
        public async Task<ActionResult<AuthResponse>> Login(LoginRequest request)
        {
            var emailNormalized = request.Email.Trim().ToLowerInvariant();
            var user = await _db.Users.FirstOrDefaultAsync(u => u.Email == emailNormalized);

            if (user == null || !BCrypt.Net.BCrypt.Verify(request.Password, user.PasswordHash))
                return Unauthorized(new { message = "Погрешен email или лозинка." });

            if (!user.IsActive)
                return Unauthorized(new { message = "Оваа сметка е деактивирана." });

            var (token, expiresAt) = _tokenService.GenerateToken(user);

            return Ok(new AuthResponse
            {
                Token = token,
                ExpiresAt = expiresAt,
                User = MapToDto(user)
            });
        }

        [Authorize]
        [HttpGet("me")]
        public async Task<ActionResult<UserDto>> Me()
        {
            var userIdClaim = User.FindFirst(System.IdentityModel.Tokens.Jwt.JwtRegisteredClaimNames.Sub)?.Value
                               ?? User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;

            if (userIdClaim == null || !int.TryParse(userIdClaim, out var userId))
                return Unauthorized();

            var user = await _db.Users.FindAsync(userId);
            if (user == null)
                return NotFound();

            return Ok(MapToDto(user));
        }

        private static UserDto MapToDto(User user) => new()
        {
            Id = user.Id,
            Email = user.Email,
            FullName = user.FullName,
            Role = user.Role.ToString(),
            IsVip = user.IsVip,
            VipExpiresAt = user.VipExpiresAt
        };
    }
}
