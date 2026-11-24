import React from 'react';
import SEO from '../components/SEO';
import { AlertCircle } from 'lucide-react';

export default function TermsPage() {
  return (
    <div className="bg-[#F7F5F0] text-[#101010] min-h-screen py-16 lg:py-24">
      <SEO
        title="Terms & Conditions (Draft) — 7 Horse Ventures"
        description="Draft Terms & Conditions for 7 Horse Ventures website usage, event participation, platform rules, and intellectual property."
        canonicalUrl="/terms"
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Draft Notice */}
        <div className="p-4 mb-8 bg-[#FAF7F2] border border-[#C5A46D] rounded-xl flex items-start gap-3 text-xs text-stone-700">
          <AlertCircle className="w-5 h-5 text-[#A9874D] shrink-0 mt-0.5" />
          <div>
            <span className="font-semibold text-[#101010] block mb-0.5">
              Legal notice & draft status
            </span>
            These Terms & Conditions constitute a preliminary operational draft prepared for 7 Horse Ventures. Before public release and commercial ticketing, this document must be reviewed and customized by an Indian corporate legal counsel.
          </div>
        </div>

        {/* Document Header */}
        <div className="border-b border-[#E8E5DF] pb-8 mb-10 space-y-3">
          <span className="text-xs font-mono text-[#A9874D]">
            Governance document
          </span>
          <h1 className="text-3xl sm:text-4xl font-semibold text-[#101010] font-heading">
            Terms & Conditions
          </h1>
          <p className="text-xs text-stone-500">
            Last Updated: March 2026 • Document Version: 1.0 (Pre-Launch Draft)
          </p>
        </div>

        {/* Body Content */}
        <div className="prose prose-stone max-w-none space-y-8 text-xs sm:text-sm text-stone-700 leading-relaxed">
          
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-[#101010] font-heading">
              1. Acceptance of Terms
            </h2>
            <p>
              By accessing the website of 7 Horse Ventures ("the Platform") or registering for any cohort, roundtable, pitch forum, or community initiative, you agree to comply with and be bound by these Terms and Conditions.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-[#101010] font-heading">
              2. Nature of Platform & Ecosystem Role
            </h2>
            <p>
              7 Horse Ventures operates as a venture networking and business ecosystem convener. The Platform is NOT:
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li>A registered investment fund, venture capital fund, or Alternative Investment Fund (AIF).</li>
              <li>A licensed broker-dealer, merchant banker, or financial advisor under SEBI regulations.</li>
              <li>An investment guarantor, placement agent, or crowdfunding portal.</li>
            </ul>
            <p>
              No content published on this website constitutes financial, legal, tax, or investment advice.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-[#101010] font-heading">
              3. Event Attendance, Screening & Admission
            </h2>
            <p>
              To maintain high signal and productive gatherings, all registrations for 7H Founder Connect and 7H Pitch & Capital Connect are subject to profile screening and cohort curation. 7 Horse Ventures reserves the right to accept or decline attendance applications at its sole professional discretion.
            </p>
            <p>
              Registration submission does not constitute a guaranteed ticket or right of entry until formal confirmation has been issued in writing.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-[#101010] font-heading">
              4. Code of Conduct & Participant Responsibility
            </h2>
            <p>
              Attendees, members, and partners are expected to maintain professional conduct. The Platform strictly prohibits:
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Unsolicited aggressive marketing, spamming, or mass-pitching to community members.</li>
              <li>Harassment, discriminatory remarks, or unprofessional behavior during events.</li>
              <li>Misrepresentation of company traction, fundraising status, or organizational credentials.</li>
            </ul>
            <p>
              7 Horse Ventures reserves the right to immediately revoke event access or membership without refund in cases of conduct violation.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-[#101010] font-heading">
              5. Intellectual Property
            </h2>
            <p>
              The names, logos, trademarks, visual marks, website content, editorial copy, and event format architectures associated with "7 Horse Ventures" are proprietary intellectual property. Unauthorized reproduction or commercial imitation is strictly prohibited.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-[#101010] font-heading">
              6. Limitation of Liability & Governing Law
            </h2>
            <p>
              In no event shall 7 Horse Ventures, its coordinators, or affiliates be liable for any direct, indirect, incidental, or consequential damages resulting from platform interactions, event participation, independent investment discussions, or third-party arrangements.
            </p>
            <p>
              These Terms shall be governed by and construed in accordance with the laws of India. Any disputes arising shall be subject to the exclusive jurisdiction of the competent courts in Delhi NCR (New Delhi / Gurugram), India.
            </p>
          </section>

        </div>
      </div>
    </div>
  );
}
