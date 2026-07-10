using Microsoft.AspNetCore.Mvc;

namespace ProTipsBet.Api.DTOs
{
    public class SubmitPaymentRequest
    {
        public string Email { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
        public string PlanId { get; set; } = string.Empty;
        public string PaymentMethod { get; set; } = string.Empty;
        public IFormFile? Proof { get; set; }

        // Optional — matches a DiscountCode.Code (case-insensitive)
        public string? DiscountCode { get; set; }
    }
}
