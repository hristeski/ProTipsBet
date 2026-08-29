"use client";

import { useState } from "react";
import { Mail, MessageSquare, Send, CheckCircle2, ShieldQuestion, Phone, Loader2 } from "lucide-react";
import { API_BASE } from "@/lib/api";

export default function ContactClient() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("vip");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      const res = await fetch(`${API_BASE}/api/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, subject, message }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.message || "Failed to send message.");
      }

      setIsSubmitted(true);
      setName("");
      setEmail("");
      setSubject("vip");
      setMessage("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred while sending the message.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="pb-24 px-6 pt-10 max-w-5xl mx-auto">
      
      {/* HEADER */}
      <div className="text-center mb-12">
        <h1 className="text-3xl md:text-5xl font-black text-white mb-4">Get in Touch</h1>
        <p className="text-zinc-400 text-sm md:text-base max-w-xl mx-auto">
          Need help with your VIP subscription or have questions about our analytics? Our support team is here to assist you 24/7.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* CONTACT INFO CARDS */}
        <div className="md:col-span-1 space-y-4">
            {/* WhatsApp Card */}
          <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6 flex flex-col items-center text-center">
            <div className="bg-[#25D366]/10 p-3 rounded-full text-[#25D366] mb-4">
              <Phone size={24} />
            </div>
            <h3 className="text-white font-bold mb-1">WhatsApp</h3>
            <p className="text-zinc-400 text-sm mb-4">Chat with us directly.</p>
            <a 
              href="https://wa.me/5493815694938" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-[#25D366] text-sm font-bold hover:underline"
            >
              +54 9 3815 69-4938
            </a>
          </div>
          {/* Email Card */}
          <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6 flex flex-col items-center text-center">
            <div className="bg-emerald-500/10 p-3 rounded-full text-emerald-400 mb-4">
              <Mail size={24} />
            </div>
            <h3 className="text-white font-bold mb-1">Email Us</h3>
            <p className="text-zinc-400 text-sm mb-4">For business & partnerships.</p>
            <a 
              href="mailto:support@protipsbet.com" 
              className="text-emerald-400 text-sm font-bold hover:underline"
            >
              support@protipsbet.com
            </a>
          </div>
          {/* Telegram Card */}
          <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6 flex flex-col items-center text-center">
            <div className="bg-[#0088cc]/10 p-3 rounded-full text-[#0088cc] mb-4">
              <MessageSquare size={24} />
            </div>
            <h3 className="text-white font-bold mb-1">Telegram Support</h3>
            <p className="text-zinc-400 text-sm mb-4">Fastest response time.</p>
            <a 
              href="https://t.me/protipsbet11" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-[#0088cc] text-sm font-bold hover:underline"
            >
              @protipsbet_admin
            </a>
          </div>
        </div>
          

        

          

        {/* CONTACT FORM */}
        <div className="md:col-span-2">
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 md:p-8 h-full">
            {isSubmitted ? (
              <div className="h-full min-h-[300px] flex flex-col items-center justify-center text-center animate-in fade-in zoom-in duration-300">
                <CheckCircle2 size={64} className="text-emerald-400 mb-4" />
                <h3 className="text-2xl font-black text-white mb-2">Message Sent!</h3>
                <p className="text-zinc-400 text-sm max-w-sm">
                  We have received your message and will get back to you as soon as possible.
                </p>
                <button 
                  onClick={() => setIsSubmitted(false)}
                  className="mt-6 text-sm font-bold text-emerald-400 hover:text-emerald-300"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5 animate-in fade-in duration-300">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Your Name</label>
                    <input 
                      type="text" 
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="John Doe"
                      className="w-full px-4 py-3 bg-zinc-950 border border-zinc-800 rounded-xl focus:outline-none focus:border-emerald-500 text-white transition-colors"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Email Address</label>
                    <input 
                      type="email" 
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="john@example.com"
                      className="w-full px-4 py-3 bg-zinc-950 border border-zinc-800 rounded-xl focus:outline-none focus:border-emerald-500 text-white transition-colors"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Subject</label>
                  <select
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="w-full px-4 py-3 bg-zinc-950 border border-zinc-800 rounded-xl focus:outline-none focus:border-emerald-500 text-white transition-colors appearance-none"
                  >
                    <option value="vip">VIP Subscription Issue</option>
                    <option value="payment">Payment & Crypto</option>
                    <option value="general">General Inquiry</option>
                    <option value="business">Business / Partnership</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Message</label>
                  <textarea 
                    required
                    rows={5}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="How can we help you?"
                    className="w-full px-4 py-3 bg-zinc-950 border border-zinc-800 rounded-xl focus:outline-none focus:border-emerald-500 text-white transition-colors resize-none"
                  ></textarea>
                </div>

                {error && (
                  <div className="bg-red-500/10 border border-red-500/30 text-red-300 rounded-xl p-3 text-xs">
                    {error}
                  </div>
                )}

                <button 
                  type="submit" 
                  disabled={submitting}
                  className="w-full py-4 bg-white text-zinc-950 font-black rounded-xl hover:bg-zinc-200 transition-colors flex items-center justify-center gap-2 disabled:opacity-60"
                >
                  {submitting ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
                  {submitting ? "Sending..." : "Send Message"}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>

      {/* FAQ SECTION BANNER */}
      <div className="mt-8 bg-zinc-900/40 border border-zinc-800 rounded-3xl p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
        <div className="flex flex-col md:flex-row items-center gap-6">
          <div className="bg-amber-500/10 p-4 rounded-full text-amber-400">
            <ShieldQuestion size={32} />
          </div>
          <div>
            <h3 className="text-xl text-white font-bold mb-2">Have a quick question?</h3>
            <p className="text-zinc-400 text-sm max-w-lg">
              Check our frequently asked questions section for quick answers before sending a message. We might have already answered your question!
            </p>
          </div>
        </div>
        <a
          href="/#faq"
          className="px-6 py-3 bg-zinc-800 hover:bg-zinc-700 text-white font-bold rounded-xl transition-colors whitespace-nowrap"
        >
          View FAQ
        </a>
      </div>

    </div>
  );
}