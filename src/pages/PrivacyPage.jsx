import React from 'react';
import SEO from '../components/SEO';
import { AlertCircle } from 'lucide-react';

export default function PrivacyPage() {
  return (
    <div className="bg-[#F7F5F0] text-[#101010] min-h-screen py-16 lg:py-24">
      <SEO
        title="Privacy Policy (Draft) — 7 Horse Ventures"
        description="Draft Privacy Policy for 7 Horse Ventures governing personal data, enquiry submissions, event photography notices, and confidentiality under Indian privacy regulations."
        canonicalUrl="/privacy-policy"
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Draft Legal Advisory Alert (Mandated by Prompt) */}
        <div className="p-4 mb-8 bg-[#FAF7F2] border border-[#C5A46D] rounded-xl flex items-start gap-3 text-xs text-stone-700">
          <AlertCircle className="w-5 h-5 text-[#A9874D] shrink-0 mt-0.5" />
          <div>
            <span className="font-semibold text-[#101010] block mb-0.5">
              Legal notice & draft status
            </span>
            This Privacy Policy is an initial operational draft prepared for 7 Horse Ventures. It is subject to formal review, modification, and ratification by a qualified Indian legal practitioner before official commercial launch to ensure full alignment with the Digital Personal Data Protection (DPDP) Act, 2023 and applicable Indian data laws.
          </div>
        </div>

        {/* Document Header */}
        <div className="border-b border-[#E8E5DF] pb-8 mb-10 space-y-3">
          <span className="text-xs font-mono text-[#A9874D]">
            Governance document
          </span>
          <h1 className="text-3xl sm:text-4xl font-semibold text-[#101010] font-heading">
            Privacy Policy
          </h1>
          <p className="text-xs text-stone-500">
            Last Updated: March 2026 • Document Version: 1.0 (Pre-Launch Draft)
          </p>
        </div>

        {/* Body Content */}
        <div className="prose prose-stone max-w-none space-y-8 text-xs sm:text-sm text-stone-700 leading-relaxed">
          
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-[#101010] font-heading">
              1. Overview & Data Principal Rights
            </h2>
            <p>
              7 Horse Ventures ("we", "our", or "the Platform") is committed to protecting the privacy of individuals who interact with our website, apply for community cohorts, attend networking roundtables, or engage as corporate partners.
            </p>
            <p>
              In accordance with Indian data protection principles under the Digital Personal Data Protection Act, 2023 ("DPDP Act"), we process personal data lawfully, transparently, and only for specified purposes for which explicit consent has been provided.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-[#101010] font-heading">
              2. Personal Information We Collect
            </h2>
            <p>We may collect and process the following categories of information:</p>
            <ul className="list-disc pl-5 space-y-1.5">
              <li><strong>Contact & Identity Data:</strong> Full name, official work email address, telephone number, city, and professional designation.</li>
              <li><strong>Venture & Organizational Data:</strong> Startup name, business registration stage, website URL, industry sector, problem statement, and general operational objectives.</li>
              <li><strong>Investor & Mandate Information:</strong> Professional affiliation, syndicate status, typical check size range, and LinkedIn profile.</li>
              <li><strong>Communications Data:</strong> Specific inquiries, feedback forms, and session attendance records.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-[#101010] font-heading">
              3. Purpose of Processing & Usage
            </h2>
            <p>Your data is used strictly for the following legitimate purposes:</p>
            <ul className="list-disc pl-5 space-y-1.5">
              <li>Reviewing eligibility and curating attendance cohorts for 7H Founder Connect and 7H Pitch & Capital Connect.</li>
              <li>Communicating event schedules, venue passes, and calendar invitations.</li>
              <li>Facilitating agreed-upon opt-in introductions between founders, investors, and domain experts.</li>
              <li>Responding to corporate partnership inquiries and customized sponsorship requests.</li>
              <li>Complying with statutory reporting and legal obligations under Indian law.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-[#101010] font-heading">
              4. Pitch Deck & Financial Information Confidentiality
            </h2>
            <p>
              We recognize the sensitive nature of early-stage venture documentation. Pitch decks, capitalization tables, traction metrics, and proprietary business models submitted via our platform are treated with strict confidentiality.
            </p>
            <p>
              Uploaded decks are accessed solely by authorized members of our screening committee and accredited investor attendees participating in closed presentation sessions. We do not publish, sell, or publicly showcase non-public pitch materials without explicit founder authorization.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-[#101010] font-heading">
              5. Event Photography & Audiovisual Notice
            </h2>
            <p>
              7 Horse Ventures may capture documentary photographs, audio recordings, and short video clips during offline events and roundtables for community recaps, archival records, and editorial storytelling.
            </p>
            <p>
              Attendees who prefer not to appear in published media may notify the event coordination desk upon arrival or write to our support desk in advance.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-[#101010] font-heading">
              6. Data Retention, Security & User Rights
            </h2>
            <p>
              We maintain reasonable technical and organizational safeguards to protect personal data against unauthorized access, loss, or misuse. Data principals have the right to request access to, correction of, or deletion of their submitted personal information by writing to our designated privacy desk.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-[#101010] font-heading">
              7. Privacy Contact & Grievance Desk
            </h2>
            <p>
              For questions concerning this draft policy, data access requests, or grievance redressal, please contact:
            </p>
            <div className="p-4 bg-white rounded-lg border border-[#E8E5DF] text-xs">
              <strong>Ecosystem Governance Desk:</strong> 7 Horse Ventures<br />
              <strong>Official Email:</strong> connect@7horseventures.com<br />
              <strong>Presence & Jurisdiction:</strong> India & Global Ecosystem Operations
            </div>
          </section>

        </div>
      </div>
    </div>
  );
}
