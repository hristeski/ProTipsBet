export type PaymentMethodId =
  | "crypto"
  | "binance_pay"
  | "western_union"
  | "ria"
  | "skrill"
  | "neteller"
  | "paypal"
  | "mpesa_global";

export type InstructionRow = { label: string; value: string; showQr?: boolean };

export interface PaymentMethod {
  id: PaymentMethodId;
  name: string;
  instant: boolean; // true = automated/instant, false = manual review
  // Details shown to the client once they pick this method (manual methods only)
  instructions?: InstructionRow[];
}

export const PAYMENT_METHODS: PaymentMethod[] = [
  {
    id: "crypto",
    name: "Crypto (USDT/BTC)",
    instant: false,
    instructions: [
      { label: "USDT (TRC20)", value: "TECiSP7aaactgEXcqyrwFAcc85vfG6k81S", showQr: true },
      { label: "USDT (BEP20)", value: "0x0fa04bccde3b11e8d0e3eb7ea7332f712c2e6dc2", showQr: true },
      { label: "BTC", value: "1FFYFfafG6roADdomQeeBeT7KDCGkD8288", showQr: true },
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