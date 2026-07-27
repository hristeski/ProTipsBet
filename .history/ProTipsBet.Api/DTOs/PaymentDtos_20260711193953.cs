// using Microsoft.AspNetCore.Mvc;

// namespace ProTipsBet.Api.DTOs
// {
//     public class SubmitPaymentRequest
//     {
//         public string Email { get; set; } = string.Empty;
//         public string Password { get; set; } = string.Empty;
//         public string PlanId { get; set; } = string.Empty;
//         public string PaymentMethod { get; set; } = string.Empty;
//         public IFormFile? Proof { get; set; }

//         // Optional — matches a DiscountCode.Code (case-insensitive)
//         public string? DiscountCode { get; set; }
//     }
// }

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

        public string FirstName { get; set; } = string.Empty;
        public string LastName { get; set; } = string.Empty;
        public string WhatsApp { get; set; } = string.Empty;

        // Optional — matches a DiscountCode.Code (case-insensitive)
        public string? DiscountCode { get; set; }
    }
}
