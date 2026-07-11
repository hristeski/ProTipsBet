// "use client";

// import { useState, Suspense } from "react";
// import { useSearchParams } from "next/navigation";
// import Link from "next/link";
// import { ArrowLeft, CheckCircle2, Bitcoin, Upload, Clock, Mail, Loader2 } from "lucide-react";
// import { PRICING_PLANS, CRYPTO_MIN_NOTE } from "@/lib/pricing";
// import { PAYMENT_METHODS, type PaymentMethodId } from "@/lib/payment-methods";

// type Step = "method" | "crypto" | "manual-details" | "manual-account" | "pending";

// function CheckoutContent() {
//   const searchParams = useSearchParams();
//   const planId = searchParams.get("plan") ?? "monthly";
//   const plan = PRICING_PLANS.find((p) => p.id === planId) ?? PRICING_PLANS[2];

//   const [step, setStep] = useState<Step>("method");
//   const [selectedMethod, setSelectedMethod] = useState<PaymentMethodId | null>(null);
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [proofFile, setProofFile] = useState<File | null>(null);
//   const [proofPreview, setProofPreview] = useState<string | null>(null);
//   const [submitting, setSubmitting] = useState(false);

//   const method = PAYMENT_METHODS.find((m) => m.id === selectedMethod);

//   const handleSelectMethod = (id: PaymentMethodId) => {
//     setSelectedMethod(id);
//     const m = PAYMENT_METHODS.find((x) => x.id === id);
//     setStep(m?.instant ? "crypto" : "manual-details");
//   };

//   const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0] ?? null;
//     setProofFile(file);
//     setProofPreview(file ? URL.createObjectURL(file) : null);
//   };

//   const handleFinalSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setSubmitting(true);
    
//     try {
//         const form = new FormData();
//         form.append("email", email);
//         form.append("password", password);
//         form.append("planId", plan.id);
//         form.append("paymentMethod", selectedMethod!);
//         form.append("proof", proofFile!);

//         // ВАЖНО: Смени го портот 5000 со тој што ти го даде 'dotnet run'
//         const response = await fetch("http://localhost:5103/api/payments/submit", { 
//             method: "POST", 
//             body: form 
//         });

//         if (!response.ok) {
//             throw new Error("Payment submission failed");
//         }

//         setStep("pending");
//     } catch (error) {
//         console.error("Грешка при испраќање:", error);
//         alert("Имаше проблем со серверот. Провери дали бекендот е вклучен.");
//     } finally {
//         setSubmitting(false);
//     }
// };

//   return (
//     <div className="pb-24 px-4 pt-8 max-w-lg mx-auto">
//       {step !== "pending" && (
//         <button
//           onClick={() => {
//             if (step === "method") return;
//             if (step === "crypto" || step === "manual-details") setStep("method");
//             if (step === "manual-account") setStep("manual-details");
//           }}
//           className="inline-flex items-center gap-2 text-neutral-400 hover:text-white mb-8 transition-colors text-sm font-bold"
//         >
//           <ArrowLeft size={16} /> Back
//         </button>
//       )}

//       {/* PLAN SUMMARY - shown on every step except pending */}
//       {step !== "pending" && (
//         <div className="mb-8">
//           <h1 className="text-2xl font-black text-white mb-2">Checkout</h1>
//           <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-4 flex justify-between items-center">
//             <div>
//               <p className="text-sm text-neutral-400">Selected Plan</p>
//               <p className="font-bold text-lg text-white">{plan.name}</p>
//             </div>
//             <div className="text-2xl font-black text-emerald-400">
//               €{plan.price}<span className="text-sm font-medium text-neutral-500">{plan.period}</span>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* STEP 1: PICK PAYMENT METHOD */}
//       {step === "method" && (
//         <div>
//           <h2 className="text-sm font-bold text-neutral-400 uppercase tracking-wider mb-3">
//             Select Payment Method
//           </h2>
//           <button
//             onClick={() => handleSelectMethod("crypto")}
//             className="w-full flex items-center justify-between gap-3 p-4 mb-3 rounded-xl border-2 border-emerald-500 bg-emerald-500/10 hover:bg-emerald-500/15 transition-colors text-left"
//           >
//             <div className="flex items-center gap-3">
//               <Bitcoin size={24} className="text-emerald-400" />
//               <div>
//                 <p className="font-bold text-white text-sm">Crypto (Binance Pay)</p>
//                 <p className="text-emerald-400 text-xs font-semibold">Instant access</p>
//               </div>
//             </div>
//           </button>

//           <p className="text-xs text-neutral-500 uppercase font-bold tracking-wider mb-2 mt-6">Other options (manual review)</p>
//           <div className="grid grid-cols-2 gap-3">
//             {PAYMENT_METHODS.filter((m) => !m.instant).map((m) => (
//               <button
//                 key={m.id}
//                 onClick={() => handleSelectMethod(m.id)}
//                 className="p-4 rounded-xl border-2 border-neutral-800 bg-neutral-900 text-neutral-300 hover:border-neutral-700 hover:bg-neutral-800 transition-colors text-sm font-bold text-left"
//               >
//                 {m.name}
//               </button>
//             ))}
//           </div>
//           <p className="text-zinc-500 text-xs mt-4 text-center">{CRYPTO_MIN_NOTE}</p>
//         </div>
//       )}

//       {/* CRYPTO - instant flow */}
//       {step === "crypto" && (
//         <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6">
//           <h3 className="font-bold text-white mb-4 flex items-center gap-2">
//             <span className="bg-emerald-500/20 text-emerald-400 p-1.5 rounded-lg"><Bitcoin size={18} /></span>
//             Automated Crypto Payment
//           </h3>
//           <p className="text-sm text-neutral-400 mb-2">
//             Pay securely with any major cryptocurrency. VIP access is unlocked instantly upon network confirmation.
//           </p>
//           <p className="text-amber-400/80 text-xs font-semibold mb-6">{CRYPTO_MIN_NOTE}</p>
//           <button className="w-full py-4 bg-emerald-500 text-neutral-950 font-black rounded-xl hover:scale-[1.02] transition-transform shadow-lg shadow-emerald-500/20">
//             Pay with Crypto (Binance)
//           </button>
//         </div>
//       )}

//       {/* MANUAL STEP 1: payment details for chosen method */}
//       {step === "manual-details" && method && (
//         <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6">
//           <h3 className="font-bold text-white mb-1">{method.name}</h3>
//           <p className="text-sm text-neutral-400 mb-5">
//             Send exactly <strong className="text-white">€{plan.price}</strong> using the details below.
//           </p>
//           <div className="bg-neutral-950 p-4 rounded-xl mb-6 space-y-3">
//             {method.instructions?.map((row) => (
//               <div key={row.label}>
//                 <p className="text-xs text-neutral-500 mb-1">{row.label}:</p>
//                 <p className="font-mono text-sm text-white select-all">{row.value}</p>
//               </div>
//             ))}
//           </div>
//           <button
//             onClick={() => setStep("manual-account")}
//             className="w-full py-4 bg-white text-neutral-950 font-black rounded-xl hover:bg-neutral-200 transition-colors"
//           >
//             I've Sent the Payment
//           </button>
//         </div>
//       )}

//       {/* MANUAL STEP 2: account creation + proof upload */}
//       {step === "manual-account" && method && (
//         <form onSubmit={handleFinalSubmit} className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6">
//           <h3 className="font-bold text-white mb-1">Create Your Account</h3>
//           <p className="text-sm text-neutral-400 mb-5">
//             We'll use this to notify you once your {method.name} payment is confirmed.
//           </p>

//           <div className="mb-4">
//             <label className="block text-xs font-bold text-neutral-400 mb-2 uppercase tracking-wider">Email</label>
//             <input
//               type="email"
//               required
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//               placeholder="you@example.com"
//               className="w-full px-4 py-3 bg-neutral-950 border border-neutral-800 rounded-xl focus:outline-none focus:border-emerald-500 text-white transition-colors"
//             />
//           </div>

//           <div className="mb-6">
//             <label className="block text-xs font-bold text-neutral-400 mb-2 uppercase tracking-wider">Password</label>
//             <input
//               type="password"
//               required
//               minLength={8}
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//               placeholder="At least 8 characters"
//               className="w-full px-4 py-3 bg-neutral-950 border border-neutral-800 rounded-xl focus:outline-none focus:border-emerald-500 text-white transition-colors"
//             />
//           </div>

//           <div className="mb-6">
//             <label className="block text-xs font-bold text-neutral-400 mb-2 uppercase tracking-wider">
//               Proof of Payment (screenshot)
//             </label>
//             <label className="flex flex-col items-center justify-center gap-2 border-2 border-dashed border-neutral-700 rounded-xl py-8 cursor-pointer hover:border-emerald-500 transition-colors">
//               {proofPreview ? (
//                 // eslint-disable-next-line @next/next/no-img-element
//                 <img src={proofPreview} alt="Proof preview" className="max-h-40 rounded-lg" />
//               ) : (
//                 <>
//                   <Upload size={22} className="text-neutral-500" />
//                   <span className="text-xs text-neutral-500 font-semibold">Click to upload a screenshot</span>
//                 </>
//               )}
//               <input type="file" accept="image/*" required onChange={handleFileChange} className="hidden" />
//             </label>
//           </div>

//           <button
//             type="submit"
//             disabled={submitting}
//             className="w-full py-4 bg-emerald-500 text-neutral-950 font-black rounded-xl hover:scale-[1.02] transition-transform shadow-lg shadow-emerald-500/20 disabled:opacity-60 disabled:hover:scale-100 flex items-center justify-center gap-2"
//           >
//             {submitting ? <Loader2 size={18} className="animate-spin" /> : null}
//             {submitting ? "Submitting..." : "Submit for Verification"}
//           </button>
//         </form>
//       )}

//       {/* PENDING - final state after manual submission */}
//       {step === "pending" && (
//         <div className="min-h-[60vh] flex flex-col items-center justify-center text-center pt-12">
//           <div className="bg-amber-500/10 p-4 rounded-full mb-6">
//             <Clock size={40} className="text-amber-400" />
//           </div>
//           <h1 className="text-2xl md:text-3xl font-black text-white mb-4">Payment Submitted!</h1>
//           <p className="text-neutral-400 mb-2 max-w-sm mx-auto text-sm">
//             Your account has been created and your payment proof is now with our team for review.
//           </p>
//           <div className="flex items-center gap-2 text-emerald-400 text-sm font-semibold mb-8">
//             <Mail size={16} /> Confirmation sent to {email}
//           </div>
//           <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-4 max-w-sm mx-auto text-left text-xs text-neutral-400 mb-8">
//             <p className="text-white font-bold text-sm mb-2">What happens next?</p>
//             <ol className="space-y-1.5 list-decimal list-inside">
//               <li>Our team verifies your payment (usually within a few hours)</li>
//               <li>You'll get an email once it's confirmed</li>
//               <li>Your VIP picks unlock automatically on your account</li>
//             </ol>
//           </div>
//           <Link href="/" className="px-6 py-3 bg-neutral-900 border border-neutral-800 text-white font-bold rounded-xl hover:bg-neutral-800 transition-colors">
//             Return to Home
//           </Link>
//         </div>
//       )}
//     </div>
//   );
// }

// export default function CheckoutPage() {
//   return (
//     <Suspense fallback={null}>
//       <CheckoutContent />
//     </Suspense>
//   );
// }

"use client";

import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, CheckCircle2, Bitcoin, Upload, Clock, Mail, Loader2, User, Phone } from "lucide-react";
import { PRICING_PLANS, CRYPTO_MIN_NOTE } from "@/lib/pricing";
import { PAYMENT_METHODS, type PaymentMethodId } from "@/lib/payment-methods";
import { API_BASE } from "@/lib/api";

type Step = "method" | "crypto" | "manual-details" | "manual-account" | "pending";

function CheckoutContent() {
  const searchParams = useSearchParams();
  const planId = searchParams.get("plan") ?? "monthly";
  const plan = PRICING_PLANS.find((p) => p.id === planId) ?? PRICING_PLANS[2];

  const [step, setStep] = useState<Step>("method");
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethodId | null>(null);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [proofFile, setProofFile] = useState<File | null>(null);
  const [proofPreview, setProofPreview] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const method = PAYMENT_METHODS.find((m) => m.id === selectedMethod);

  const handleSelectMethod = (id: PaymentMethodId) => {
    setSelectedMethod(id);
    const m = PAYMENT_METHODS.find((x) => x.id === id);
    setStep(m?.instant ? "crypto" : "manual-details");
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    setProofFile(file);
    setProofPreview(file ? URL.createObjectURL(file) : null);
  };

  const handleFinalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setSubmitError(null);

    try {
      const form = new FormData();
      form.append("email", email);
      form.append("password", password);
      form.append("firstName", firstName);
      form.append("lastName", lastName);
      form.append("whatsapp", whatsapp);
      form.append("planId", plan.id);
      form.append("paymentMethod", selectedMethod!);
      form.append("proof", proofFile!);

      const response = await fetch(`${API_BASE}/api/payments/submit`, {
        method: "POST",
        body: form,
      });

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(data?.message || "Payment submission failed.");
      }

      if (data?.token) {
        window.localStorage.setItem("protipsbet_token", data.token);
      }

      setStep("pending");
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="pb-24 px-4 pt-8 max-w-lg mx-auto">
      {step !== "pending" && (
        <button
          onClick={() => {
            if (step === "method") return;
            if (step === "crypto" || step === "manual-details") setStep("method");
            if (step === "manual-account") setStep("manual-details");
          }}
          className="inline-flex items-center gap-2 text-neutral-400 hover:text-white mb-8 transition-colors text-sm font-bold"
        >
          <ArrowLeft size={16} /> Back
        </button>
      )}

      {step !== "pending" && (
        <div className="mb-8">
          <h1 className="text-2xl font-black text-white mb-2">Checkout</h1>
          <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-4 flex justify-between items-center">
            <div>
              <p className="text-sm text-neutral-400">Selected Plan</p>
              <p className="font-bold text-lg text-white">{plan.name}</p>
            </div>
            <div className="text-2xl font-black text-emerald-400">
              €{plan.price}<span className="text-sm font-medium text-neutral-500">{plan.period}</span>
            </div>
          </div>
        </div>
      )}

      {/* STEP 1: PICK PAYMENT METHOD */}
      {step === "method" && (
        <div>
          <h2 className="text-sm font-bold text-neutral-400 uppercase tracking-wider mb-3">
            Select Payment Method
          </h2>
          <button
            onClick={() => handleSelectMethod("crypto")}
            className="w-full flex items-center justify-between gap-3 p-4 mb-3 rounded-xl border-2 border-emerald-500 bg-emerald-500/10 hover:bg-emerald-500/15 transition-colors text-left"
          >
            <div className="flex items-center gap-3">
              <Bitcoin size={24} className="text-emerald-400" />
              <div>
                <p className="font-bold text-white text-sm">Crypto (Binance Pay)</p>
                <p className="text-emerald-400 text-xs font-semibold">Instant access</p>
              </div>
            </div>
          </button>

          <p className="text-xs text-neutral-500 uppercase font-bold tracking-wider mb-2 mt-6">Other options (manual review)</p>
          <div className="grid grid-cols-2 gap-3">
            {PAYMENT_METHODS.filter((m) => !m.instant).map((m) => (
              <button
                key={m.id}
                onClick={() => handleSelectMethod(m.id)}
                className="p-4 rounded-xl border-2 border-neutral-800 bg-neutral-900 text-neutral-300 hover:border-neutral-700 hover:bg-neutral-800 transition-colors text-sm font-bold text-left"
              >
                {m.name}
              </button>
            ))}
          </div>
          <p className="text-zinc-500 text-xs mt-4 text-center">{CRYPTO_MIN_NOTE}</p>
        </div>
      )}

      {/* CRYPTO - instant flow */}
      {step === "crypto" && (
        <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6">
          <h3 className="font-bold text-white mb-4 flex items-center gap-2">
            <span className="bg-emerald-500/20 text-emerald-400 p-1.5 rounded-lg"><Bitcoin size={18} /></span>
            Automated Crypto Payment
          </h3>
          <p className="text-sm text-neutral-400 mb-2">
            Pay securely with any major cryptocurrency. VIP access is unlocked instantly upon network confirmation.
          </p>
          <p className="text-amber-400/80 text-xs font-semibold mb-6">{CRYPTO_MIN_NOTE}</p>
          <button className="w-full py-4 bg-emerald-500 text-neutral-950 font-black rounded-xl hover:scale-[1.02] transition-transform shadow-lg shadow-emerald-500/20">
            Pay with Crypto (Binance)
          </button>
        </div>
      )}

      {/* MANUAL STEP 1: payment details for chosen method */}
      {step === "manual-details" && method && (
        <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6">
          <h3 className="font-bold text-white mb-1">{method.name}</h3>
          <p className="text-sm text-neutral-400 mb-5">
            Send exactly <strong className="text-white">€{plan.price}</strong> using the details below.
          </p>
          <div className="bg-neutral-950 p-4 rounded-xl mb-6 space-y-3">
            {method.instructions?.map((row) => (
              <div key={row.label}>
                <p className="text-xs text-neutral-500 mb-1">{row.label}:</p>
                <p className="font-mono text-sm text-white select-all">{row.value}</p>
              </div>
            ))}
          </div>
          <button
            onClick={() => setStep("manual-account")}
            className="w-full py-4 bg-white text-neutral-950 font-black rounded-xl hover:bg-neutral-200 transition-colors"
          >
            I've Sent the Payment
          </button>
        </div>
      )}

      {/* MANUAL STEP 2: contact info + account creation + proof upload */}
      {step === "manual-account" && method && (
        <form onSubmit={handleFinalSubmit} className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6">
          <h3 className="font-bold text-white mb-1">Your Details</h3>
          <p className="text-sm text-neutral-400 mb-5">
            So we can reach you fast if we need anything to confirm your {method.name} payment.
          </p>

          <div className="grid grid-cols-2 gap-3 mb-4">
            <div>
              <label className="block text-xs font-bold text-neutral-400 mb-2 uppercase tracking-wider">First Name</label>
              <input
                type="text"
                required
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="John"
                className="w-full px-4 py-3 bg-neutral-950 border border-neutral-800 rounded-xl focus:outline-none focus:border-emerald-500 text-white transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-neutral-400 mb-2 uppercase tracking-wider">Last Name</label>
              <input
                type="text"
                required
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Doe"
                className="w-full px-4 py-3 bg-neutral-950 border border-neutral-800 rounded-xl focus:outline-none focus:border-emerald-500 text-white transition-colors"
              />
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-xs font-bold text-neutral-400 mb-2 uppercase tracking-wider flex items-center gap-1.5">
              <Phone size={12} /> WhatsApp Number
            </label>
            <input
              type="tel"
              required
              value={whatsapp}
              onChange={(e) => setWhatsapp(e.target.value)}
              placeholder="+389 70 000 000"
              className="w-full px-4 py-3 bg-neutral-950 border border-neutral-800 rounded-xl focus:outline-none focus:border-emerald-500 text-white transition-colors"
            />
          </div>

          <div className="mb-4">
            <label className="block text-xs font-bold text-neutral-400 mb-2 uppercase tracking-wider flex items-center gap-1.5">
              <User size={12} /> Email
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full px-4 py-3 bg-neutral-950 border border-neutral-800 rounded-xl focus:outline-none focus:border-emerald-500 text-white transition-colors"
            />
          </div>

          <div className="mb-6">
            <label className="block text-xs font-bold text-neutral-400 mb-2 uppercase tracking-wider">Password</label>
            <input
              type="password"
              required
              minLength={8}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="At least 8 characters"
              className="w-full px-4 py-3 bg-neutral-950 border border-neutral-800 rounded-xl focus:outline-none focus:border-emerald-500 text-white transition-colors"
            />
          </div>

          <div className="mb-6">
            <label className="block text-xs font-bold text-neutral-400 mb-2 uppercase tracking-wider">
              Proof of Payment (screenshot)
            </label>
            <label className="flex flex-col items-center justify-center gap-2 border-2 border-dashed border-neutral-700 rounded-xl py-8 cursor-pointer hover:border-emerald-500 transition-colors">
              {proofPreview ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={proofPreview} alt="Proof preview" className="max-h-40 rounded-lg" />
              ) : (
                <>
                  <Upload size={22} className="text-neutral-500" />
                  <span className="text-xs text-neutral-500 font-semibold">Click to upload a screenshot</span>
                </>
              )}
              <input type="file" accept="image/*" required onChange={handleFileChange} className="hidden" />
            </label>
          </div>

          {submitError && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-300 rounded-xl p-3 mb-4 text-xs">
              {submitError}
            </div>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-4 bg-emerald-500 text-neutral-950 font-black rounded-xl hover:scale-[1.02] transition-transform shadow-lg shadow-emerald-500/20 disabled:opacity-60 disabled:hover:scale-100 flex items-center justify-center gap-2"
          >
            {submitting ? <Loader2 size={18} className="animate-spin" /> : null}
            {submitting ? "Submitting..." : "Submit for Verification"}
          </button>
        </form>
      )}

      {/* PENDING */}
      {step === "pending" && (
        <div className="min-h-[60vh] flex flex-col items-center justify-center text-center pt-12">
          <div className="bg-amber-500/10 p-4 rounded-full mb-6">
            <Clock size={40} className="text-amber-400" />
          </div>
          <h1 className="text-2xl md:text-3xl font-black text-white mb-4">Payment Submitted!</h1>
          <p className="text-neutral-400 mb-2 max-w-sm mx-auto text-sm">
            Your account has been created and your payment proof is now with our team for review.
          </p>
          <div className="flex items-center gap-2 text-emerald-400 text-sm font-semibold mb-8">
            <Mail size={16} /> Confirmation sent to {email}
          </div>
          <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-4 max-w-sm mx-auto text-left text-xs text-neutral-400 mb-8">
            <p className="text-white font-bold text-sm mb-2">What happens next?</p>
            <ol className="space-y-1.5 list-decimal list-inside">
              <li>Our team verifies your payment (usually within a few hours)</li>
              <li>You'll get an email once it's confirmed</li>
              <li>Your VIP picks unlock automatically on your account</li>
            </ol>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <Link href="/account" className="px-6 py-3 bg-emerald-500 text-neutral-950 font-bold rounded-xl hover:bg-emerald-400 transition-colors">
              Go to My Account
            </Link>
            <Link href="/" className="px-6 py-3 bg-neutral-900 border border-neutral-800 text-white font-bold rounded-xl hover:bg-neutral-800 transition-colors">
              Return to Home
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={null}>
      <CheckoutContent />
    </Suspense>
  );
}
