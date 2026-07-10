import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service | ProTipsBet",
  description: "Read the Terms of Service for ProTipsBet. Understand our guidelines, 18+ age restrictions, and disclaimer regarding sports analytics and betting predictions.",
  keywords: ["Terms of Service", "ProTipsBet terms", "betting rules", "sports analytics disclaimer", "user agreement"],
};

export default function TermsPage() {
  return (
    <div className="pb-24 px-6 pt-32 max-w-4xl mx-auto min-h-screen">
      <div className="mb-12">
        <h1 className="text-4xl md:text-5xl font-black text-white mb-4">Terms of Service</h1>
        <p className="text-zinc-400">Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</p>
      </div>

      <div className="space-y-8 text-zinc-300 leading-relaxed">
        <section>
          <h2 className="text-2xl font-bold text-white mb-3">1. Acceptance of Terms</h2>
          <p>
            By accessing and using ProTipsBet ("the Service"), you agree to be bound by these Terms of Service. If you disagree with any part of these terms, you may not access the Service. The Service is strictly for users who are at least 18 years of age.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-white mb-3">2. Nature of the Service</h2>
          <p>
            ProTipsBet provides sports analytics, statistics, and predictions. <strong>We are not a gambling or betting platform.</strong> We do not accept bets, and we do not hold real money balances for gambling purposes. Our Service is strictly for informational and entertainment purposes.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-white mb-3">3. No Guarantees & Risk Disclaimer</h2>
          <p>
            Sports betting involves substantial risk of financial loss. ProTipsBet makes no guarantees regarding the accuracy or profitability of our predictions. Past performance is not indicative of future results. You acknowledge that any bets placed based on our information are done entirely at your own risk.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-white mb-3">4. VIP Subscriptions & Payments</h2>
          <p>
            Access to certain premium features ("VIP Analytics") requires a paid subscription. All payments are final. Because the Service delivers immediate digital content, we do not offer refunds once a subscription has been activated, unless required by applicable law.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-white mb-3">5. Intellectual Property</h2>
          <p>
            All content, predictions, UI design, and logos provided on ProTipsBet are the intellectual property of ProTipsBet. You may not scrape, resell, redistribute, or use our premium picks for commercial purposes without explicit written consent.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-white mb-3">6. Account Termination</h2>
          <p>
            We reserve the right to suspend or terminate your account immediately, without prior notice or liability, for any reason, including without limitation if you breach the Terms (e.g., sharing VIP picks publicly).
          </p>
        </section>
      </div>
    </div>
  );
}