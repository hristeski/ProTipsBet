using ProTipsBet.Api.Models;

namespace ProTipsBet.Api.Services
{
    public static class PaymentMethodMapper
    {
        // Keys must match PaymentMethodId values exactly as defined in src/lib/payment-methods.ts
        private static readonly Dictionary<string, PaymentMethod> Map = new(StringComparer.OrdinalIgnoreCase)
        {
            ["crypto"] = PaymentMethod.Crypto,
            ["binance_pay"] = PaymentMethod.Crypto,
            ["western_union"] = PaymentMethod.WesternUnion,
            ["ria"] = PaymentMethod.Ria,
            ["skrill"] = PaymentMethod.Skrill,
            ["neteller"] = PaymentMethod.Neteller,
            ["paypal"] = PaymentMethod.PayPal,
            ["mpesa_global"] = PaymentMethod.Mpesa,
        };

        public static bool TryParse(string? frontendId, out PaymentMethod method)
        {
            method = PaymentMethod.Other;
            if (string.IsNullOrWhiteSpace(frontendId)) return false;
            return Map.TryGetValue(frontendId, out method);
        }
    }
}
