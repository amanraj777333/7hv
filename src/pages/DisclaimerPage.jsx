import React from 'react';
import SEO from '../components/SEO';
import { ShieldAlert, AlertCircle } from 'lucide-react';

export default function DisclaimerPage() {
  return (
    <div className="bg-[#F7F5F0] text-[#101010] min-h-screen py-16 lg:py-24">
      <SEO
        title="Event Participation Disclaimer (Draft) — 7 Horse Ventures"
        description="Comprehensive Event Participation and Investment Disclaimer for 7 Horse Ventures, clarifying independent investor decisions and non-guarantee of commercial outcomes."
        canonicalUrl="/disclaimer"
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Draft Notice */}
        <div className="p-4 mb-8 bg-[#FAF7F2] border border-[#C5A46D] rounded-xl flex items-start gap-3 text-xs text-stone-700">
          <AlertCircle className="w-5 h-5 text-[#A9874D] shrink-0 mt-0.5" />
          <div>
            <span className="font-semibold text-[#101010] block mb-0.5">
              Legal notice & draft status
            </span>
            This Event Participation Disclaimer is an official draft prepared for 7 Horse Ventures. It must be finalized in consultation with legal counsel admitted to practice in India prior to commercial operations.
          </div>
        </div>

        {/* Document Header */}
        <div className="border-b border-[#E8E5DF] pb-8 mb-10 space-y-3">
          <span className="text-xs font-mono text-[#A9874D]">
            Regulatory & transparency statement
          </span>
          <h1 className="text-3xl sm:text-4xl font-semibold text-[#101010] font-heading">
            Event Participation & Investment Disclaimer
          </h1>
          <p className="text-xs text-stone-500">
            Last Updated: March 2026 • Document Version: 1.0 (Draft)
          </p>
        </div>

        {/* Core Disclaimer Box */}
        <div className="p-6 bg-[#101010] text-white rounded-2xl border border-[#242424] mb-10 space-y-3">
          <div className="flex items-center gap-2 text-xs font-medium text-[#C5A46D]">
            <ShieldAlert className="w-4 h-4" />
            <span>Essential notice to all participants</span>
          </div>
          <p className="text-xs sm:text-sm text-stone-300 leading-relaxed font-medium">
            Participation in 7 Horse Ventures events, cohorts, networking mixers, or pitch showcases does not guarantee funding, investment commitments, commercial partnerships, customer contracts, or business revenues. 7 Horse Ventures does not solicit funds, manage investment capital, or guarantee commercial success.
          </p>
        </div>

        {/* Detailed Sections */}
        <div className="prose prose-stone max-w-none space-y-8 text-xs sm:text-sm text-stone-700 leading-relaxed">
          
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-[#101010] font-heading">
              1. Non-Advisory & Non-Brokerage Status
            </h2>
            <p>
              7 Horse Ventures operates purely as an ecosystem convener and business community platform. We are not registered as an investment adviser, portfolio manager, stockbroker, or research analyst with the Securities and Exchange Board of India (SEBI).
            </p>
            <p>
              No communication, representation, presentation, or material provided by 7 Horse Ventures or its speakers shall be construed as investment, financial, tax, or legal advice.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-[#101010] font-heading">
              2. Independent Investor Due Diligence
            </h2>
            <p>
              Startups presenting at 7H Pitch & Capital Connect or participating in 7H Founder Connect roundtables are selected for ecosystem relevance and stage fit. Such selection does NOT imply:
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Endorsement or validation of financial statements, cap tables, or forecasts.</li>
              <li>Verification of technical architectures, intellectual property patents, or market size claims.</li>
              <li>Investment recommendation, deal underwriting, or guarantee of commercial viability.</li>
            </ul>
            <p>
              All prospective investors, syndicates, and mentors are solely responsible for conducting independent diligence, legal structuring, and background checks before entering into any financial arrangement.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-[#101010] font-heading">
              3. Startup Capital Risk Acknowledgement
            </h2>
            <p>
              Early-stage startup investing involves substantial commercial and financial risk, including the potential total loss of invested capital. Startups and investors interact at their own volition and peril. 7 Horse Ventures assumes zero liability for disputes, non-performance, or losses arising from direct negotiations between founders and investors.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-[#101010] font-heading">
              4. Sponsorship & Corporate Partnership Disclaimers
            </h2>
            <p>
              Corporate sponsorship packages (including Supporting, Community, Powered By, and Quarterly tiers) represent indicative options for event participation and co-branded visibility. Sponsorship does not guarantee sales leads, business conversions, customer contracts, or commercial profitability.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-[#101010] font-heading">
              5. Third-Party Offers & Integrations
            </h2>
            <p>
              Perks, credits, or software tools made available by third-party technology and banking partners are subject to the independent qualification criteria and terms of the respective providers. 7 Horse Ventures has no authority to bind external providers.
            </p>
          </section>

        </div>
      </div>
    </div>
  );
}
