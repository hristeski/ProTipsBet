using Microsoft.AspNetCore.Mvc;

namespace ProTipsBet.Api.DTOs
{
    public class SubmitPaymentRequest
    {
        public string Email { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;

        // Matches PRICING_PLANS[].id on the frontend: "daily" | "weekly" | "monthly"
        public string PlanId { get; set; } = string.Empty;

        // Matches PaymentMethodId on the frontend: "crypto" | "western_union" | "ria" | "skrill" | "neteller" | "paypal" | "mpesa_global"
        public string PaymentMethod { get; set; } = string.Empty;

        public IFormFile? Proof { get; set; }
    }
}
