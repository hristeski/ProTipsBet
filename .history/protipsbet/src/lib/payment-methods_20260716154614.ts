export type PaymentMethodId =
  | "crypto"
  | "binance_pay"
  | "western_union"
  | "ria"
  | "skrill"
  | "neteller"
  | "paypal"
  | "mpesa_global";

export interface PaymentMethod {
  id: PaymentMethodId;
  name: string;
  instant: boolean; // true = automated/instant, false = manual review
  // Details shown to the client once they pick this method (manual methods only)
  instructions?: { label: string; value: string }[];
}

export const PAYMENT_METHODS: PaymentMethod[] = [
  {
    id: "crypto",
    name: "Crypto (USDT/BTC)",
    instant: false,
    instructions: [
      { label: "USDT (TRC20)", value: "TECiSP7aaactgEXcqyrwFAcc85vfG6k81S" },
      { label: "USDT (BEP20)", value: "0xXXXXXXXXXXXXXXXXXXXXXXXXXXXX" },
      { label: "BTC", value: "bc1qXXXXXXXXXXXXXXXXXXXXXXXXXXXX" },
    ],
  },
  {
    id: "western_union",
    name: "Western Union",
    instant: false,
    instructions: [
      { label: "Receiver Name", value: "PROTIPSBET LTD" },
      { label: "Country", value: "United Kingdom" },
      { label: "Reference / Note", value: "Include your email in the transfer note" },
    ],
  },
  {
    id: "ria",
    name: "Ria Money Transfer",
    instant: false,
    instructions: [
      { label: "Receiver Name", value: "PROTIPSBET LTD" },
      { label: "Country", value: "United Kingdom" },
      { label: "Reference / Note", value: "Include your email in the transfer note" },
    ],
  },
  {
    id: "skrill",
    name: "Skrill",
    instant: false,
    instructions: [{ label: "Skrill Email", value: "payments@protipsbet.com" }],
  },
  {
    id: "neteller",
    name: "Neteller",
    instant: false,
    instructions: [{ label: "Neteller Email", value: "payments@protipsbet.com" }],
  },
  {
    id: "paypal",
    name: "PayPal",
    instant: false,
    instructions: [
      { label: "PayPal Email", value: "payments@protipsbet.com" },
      { label: "Payment Type", value: "Friends & Family" },
    ],
  },
  {
    id: "mpesa_global",
    name: "MPesa Global",
    instant: false,
    instructions: [{ label: "MPesa Number", value: "+1234567890" }],
  },
];