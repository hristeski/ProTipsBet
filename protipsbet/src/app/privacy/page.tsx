import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Learn how ProTipsBet collects, uses, and protects your personal information. We value your privacy and security.",
  keywords: ["Privacy Policy", "data protection", "ProTipsBet privacy", "GDPR compliance", "user data security"],
  alternates: {
    canonical: "https://protipsbet.com/privacy",
  },
};

export default function PrivacyPage() {
  return (
    <div className="pb-24 px-6 pt-32 max-w-4xl mx-auto min-h-screen">
      <div className="mb-12">
        <h1 className="text-4xl md:text-5xl font-black text-white mb-4">Privacy Policy</h1>
        <p className="text-zinc-400">Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</p>
      </div>

      <div className="space-y-8 text-zinc-300 leading-relaxed">
        <section>
          <h2 className="text-2xl font-bold text-white mb-3">1. Information We Collect</h2>
          <p>
            We collect minimal personal data necessary to provide our Service. This includes:
          </p>
          <ul className="list-disc pl-6 mt-2 space-y-1 text-zinc-400">
            <li><strong>Account Information:</strong> Email address and encrypted password when you register.</li>
            <li><strong>Payment Data:</strong> Transaction references or crypto wallet addresses to verify VIP subscriptions (we do not store raw credit card numbers).</li>
            <li><strong>Usage Data:</strong> Basic analytics (e.g., IP address, browser type) to improve user experience and maintain security.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-white mb-3">2. How We Use Your Data</h2>
          <p>
            The collected data is used exclusively to:
          </p>
          <ul className="list-disc pl-6 mt-2 space-y-1 text-zinc-400">
            <li>Provide, operate, and maintain your access to VIP Analytics.</li>
            <li>Send you important administrative emails (e.g., subscription expirations, password resets).</li>
            <li>Detect and prevent fraud or unauthorized sharing of premium accounts.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-white mb-3">3. Data Sharing & Third Parties</h2>
          <p>
            We respect your privacy. <strong>We do not sell, rent, or trade your personal information</strong> to third parties. Data may be shared with trusted third-party service providers (such as payment gateways or hosting providers) strictly for the purpose of operating the Service.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-white mb-3">4. Cookies and Tracking</h2>
          <p>
            We use essential cookies to keep you logged into the platform and manage your session securely. We may also use standard analytics cookies to understand how visitors interact with our website.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-white mb-3">5. Data Security</h2>
          <p>
            We implement industry-standard security measures, including HTTPS encryption and secure database practices, to protect your personal information from unauthorized access, alteration, or destruction.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-white mb-3">6. Your Rights</h2>
          <p>
            Depending on your location (e.g., GDPR in Europe), you have the right to request access to, correction of, or deletion of your personal data. To exercise these rights, please contact our support team.
          </p>
        </section>
      </div>
    </div>
  );
}