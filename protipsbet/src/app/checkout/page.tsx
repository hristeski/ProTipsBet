"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Upload, CheckCircle2, Bitcoin, Wallet } from "lucide-react";

export default function CheckoutPage() {
  const [method, setMethod] = useState<"crypto" | "manual">("crypto");
  const [txId, setTxId] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Симулација на испраќање кон бекендот
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Овде подоцна ќе оди fetch кон твојот бекенд
    setIsSubmitted(true);
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen pt-24 px-4 text-center">
        <CheckCircle2 size={64} className="text-emerald-400 mx-auto mb-6" />
        <h1 className="text-3xl font-black text-white mb-4">Payment Received!</h1>
        <p className="text-neutral-400 mb-8 max-w-sm mx-auto">
          Your transaction is being verified by our system. Your VIP access will be unlocked shortly.
        </p>
        <Link href="/" className="px-6 py-3 bg-neutral-900 border border-neutral-800 text-white font-bold rounded-xl hover:bg-neutral-800 transition-colors">
          Return to Home
        </Link>
      </div>
    );
  }

  return (
    <div className="pb-24 px-4 pt-8">
      <Link href="/vip-tips" className="inline-flex items-center gap-2 text-neutral-400 hover:text-white mb-8 transition-colors text-sm font-bold">
        <ArrowLeft size={16} /> Back to Plans
      </Link>

      <div className="mb-8">
        <h1 className="text-2xl font-black text-white mb-2">Checkout</h1>
        <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-4 flex justify-between items-center">
          <div>
            <p className="text-sm text-neutral-400">Selected Plan</p>
            <p className="font-bold text-lg text-white">Monthly Pro</p>
          </div>
          <div className="text-2xl font-black text-emerald-400">€60</div>
        </div>
      </div>

      <div className="mb-6">
        <h2 className="text-sm font-bold text-neutral-400 uppercase tracking-wider mb-3">
          Select Payment Method
        </h2>
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => setMethod("crypto")}
            className={`flex flex-col items-center justify-center gap-2 p-4 rounded-xl border-2 transition-all ${
              method === "crypto"
                ? "border-emerald-500 bg-emerald-500/10 text-emerald-400"
                : "border-neutral-800 bg-neutral-900 text-neutral-500 hover:border-neutral-700"
            }`}
          >
            <Bitcoin size={28} />
            <span className="font-bold text-sm">Crypto</span>
          </button>
          <button
            onClick={() => setMethod("manual")}
            className={`flex flex-col items-center justify-center gap-2 p-4 rounded-xl border-2 transition-all ${
              method === "manual"
                ? "border-emerald-500 bg-emerald-500/10 text-emerald-400"
                : "border-neutral-800 bg-neutral-900 text-neutral-500 hover:border-neutral-700"
            }`}
          >
            <Wallet size={28} />
            <span className="font-bold text-sm">E-Wallets</span>
          </button>
        </div>
      </div>

      {method === "crypto" ? (
        <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 animate-in fade-in slide-in-from-bottom-4">
          <h3 className="font-bold text-white mb-4 flex items-center gap-2">
            <span className="bg-emerald-500/20 text-emerald-400 p-1.5 rounded-lg"><Bitcoin size={18} /></span>
            Automated Crypto Payment
          </h3>
          <p className="text-sm text-neutral-400 mb-6">
            Pay securely with any major cryptocurrency. VIP access is unlocked instantly upon network confirmation.
          </p>
          <button className="w-full py-4 bg-emerald-500 text-neutral-950 font-black rounded-xl hover:scale-[1.02] transition-transform shadow-lg shadow-emerald-500/20">
            Pay with Crypto (Binance)
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 animate-in fade-in slide-in-from-bottom-4">
          <h3 className="font-bold text-white mb-4">Manual Transfer</h3>
          <p className="text-sm text-neutral-400 mb-6">
            Send exactly <strong>€60</strong> to our verified Skrill or MPesa account, then paste the Transaction ID below.
          </p>
          
          <div className="bg-neutral-950 p-4 rounded-xl mb-6">
            <p className="text-xs text-neutral-500 mb-1">Skrill Email:</p>
            <p className="font-mono text-sm text-white mb-4 select-all">payments@edgepredict.com</p>
            <p className="text-xs text-neutral-500 mb-1">MPesa Number:</p>
            <p className="font-mono text-sm text-white select-all">+1234567890</p>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-bold text-neutral-400 mb-2">
              Transaction ID
            </label>
            <input
              type="text"
              required
              value={txId}
              onChange={(e) => setTxId(e.target.value)}
              placeholder="e.g. SKR-987654321"
              className="w-full px-4 py-3 bg-neutral-950 border border-neutral-800 rounded-xl focus:outline-none focus:border-emerald-500 text-white transition-colors"
            />
          </div>

          <button type="submit" className="w-full py-4 bg-white text-neutral-950 font-black rounded-xl hover:bg-neutral-200 transition-colors">
            Submit for Verification
          </button>
        </form>
      )}
    </div>
  );
}