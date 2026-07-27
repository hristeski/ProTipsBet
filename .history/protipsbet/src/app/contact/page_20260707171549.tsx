"use client";

import { useState } from "react";
import { Mail, MessageSquare, Send, CheckCircle2, ShieldQuestion } from "lucide-react";

export default function ContactPage() {
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Овде подоцна ќе се поврзе со C# бекендот (ContactController)
    setIsSubmitted(true);
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
          <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6 flex flex-col items-center text-center">
            <div className="bg-[#0088cc]/10 p-3 rounded-full text-[#0088cc] mb-4">
              <MessageSquare size={24} />
            </div>
            <h3 className="text-white font-bold mb-1">Telegram Support</h3>
            <p className="text-zinc-400 text-sm mb-4">Fastest response time.</p>
            <a 
              href="https://t.me/protipsbet" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-[#0088cc] text-sm font-bold hover:underline"
            >
              @protipsbet_admin
            </a>
          </div>

          <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6 flex flex-col items-center text-center">
            <div className="bg-emerald-500/10 p-3 rounded-full text-emerald-400 mb-4">
              <Mail size={24} />
            </div>
            <h3 className="text-white font-bold mb-1">Email Us</h3>
            <p className="text-zinc-400 text-sm mb-4">For business & partnerships.</p>
            <a 
              href="mailto:support@edgepredict.com" 
              className="text-emerald-400 text-sm font-bold hover:underline"
            >
              support@protipsbet.com
            </a>
          </div>

          <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6 flex flex-col items-center text-center">
            <div className="bg-amber-500/10 p-3 rounded-full text-amber-400 mb-4">
              <ShieldQuestion size={24} />
            </div>
            <h3 className="text-white font-bold mb-1">FAQ</h3>
            <p className="text-zinc-400 text-sm">Check our frequently asked questions for quick answers.</p>
          </div>
        </div>

        {/* CONTACT FORM */}
        <div className="md:col-span-2">
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 md:p-8">
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
                      placeholder="John Doe"
                      className="w-full px-4 py-3 bg-zinc-950 border border-zinc-800 rounded-xl focus:outline-none focus:border-emerald-500 text-white transition-colors"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Email Address</label>
                    <input 
                      type="email" 
                      required
                      placeholder="john@example.com"
                      className="w-full px-4 py-3 bg-zinc-950 border border-zinc-800 rounded-xl focus:outline-none focus:border-emerald-500 text-white transition-colors"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Subject</label>
                  <select className="w-full px-4 py-3 bg-zinc-950 border border-zinc-800 rounded-xl focus:outline-none focus:border-emerald-500 text-white transition-colors appearance-none">
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
                    placeholder="How can we help you?"
                    className="w-full px-4 py-3 bg-zinc-950 border border-zinc-800 rounded-xl focus:outline-none focus:border-emerald-500 text-white transition-colors resize-none"
                  ></textarea>
                </div>

                <button 
                  type="submit" 
                  className="w-full py-4 bg-white text-zinc-950 font-black rounded-xl hover:bg-zinc-200 transition-colors flex items-center justify-center gap-2"
                >
                  <Send size={18} /> Send Message
                </button>
              </form>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}