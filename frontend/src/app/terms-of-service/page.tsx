// app/terms/page.tsx
'use client';

import { useState } from 'react';
import { 
  ChevronDown, 
  Shield, 
  Scale, 
  Users, 
  FileText,
  Sparkles,
  AlertTriangle,
  Mail
} from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

/* ---------- Types ---------- */
interface TermSection {
  id: string;
  title: string;
  content: string | string[];
  icon?: React.ReactNode;
}

/* ---------- Data ---------- */
const termSections: TermSection[] = [
  {
    id: 'acceptance',
    title: '1. Acceptance of Terms',
    icon: <FileText className="w-5 h-5" />,
    content:
      'By creating an account or using Referd ("Referd", "we", "us", "our"), operated by Referd Technologies, Inc., you agree to these Terms of Service ("Terms") and our Privacy Policy. If you do not agree, please do not use the platform.',
  },
  {
    id: 'eligibility',
    title: '2. Eligibility',
    icon: <Users className="w-5 h-5" />,
    content:
      'You must be at least 18 years old and capable of entering into a binding agreement under Indian law to use Referd. By registering, you confirm that the information you provide is accurate and that you meet this requirement.',
  },
  {
    id: 'account-registration',
    title: '3. Account Registration & Verification',
    icon: <Shield className="w-5 h-5" />,
    content: [
      'Referd is a verified-identity platform. To use core features, you must verify your college identity, your work identity, or both. You agree to:',
      '• Provide accurate, current information about your education and/or employment.',
      '• Not create an account using false, borrowed, or misleading identity or credentials.',
      '• Keep your login credentials confidential and notify us promptly of any unauthorized use of your account.',
    ],
  },
  {
    id: 'expert-interview',
    title: '4. Referd Expert Interview & Verified Candidature',
    icon: <Scale className="w-5 h-5" />,
    content: [
      'When you request a referral, you consent to:',
      '• Being interviewed by a Referd Expert about the specific role you\'re requesting a referral for.',
      '• That expert rating your candidature and writing a review based on the interview.',
      '• Your verified profile, interview rating, and review being shared with the relevant referrer as part of your referral request.',
      '',
      'Referd does not guarantee that any interview, review, or verification will result in a referral, interview, or job offer.',
    ],
  },
  {
    id: 'user-roles',
    title: '5. User Roles',
    icon: <Users className="w-5 h-5" />,
    content:
      'Referd supports two user types — Students/Freshers and Professionals. Your profile automatically upgrades from Student/Fresher to Professional when you update your account to reflect that you\'ve joined a company. Professionals may post referral jobs from their company and request referrals for themselves; each is subject to these Terms.',
  },
  {
    id: 'referral-facilitation',
    title: '6. Referral Facilitation — Not a Guarantee',
    icon: <Scale className="w-5 h-5" />,
    content:
      'Referd facilitates introductions between candidates and alumni referrers. We are not an employer, recruiter, or party to any employment relationship formed as a result of using the platform. We do not guarantee that any referral request will be accepted, that any introduction will result in an interview, or that any interview will result in a job offer.',
  },
  {
    id: 'acceptable-use',
    title: '7. Acceptable Use',
    icon: <Shield className="w-5 h-5" />,
    content: [
      'You agree not to:',
      '• Misrepresent your identity, education, employment history, or qualifications.',
      '• Falsely claim an alumni or ex-colleague connection you do not have.',
      '• Use Referd to harass, spam, or solicit users outside the platform\'s intended purpose.',
      '• Attempt to bypass, manipulate, or interfere with the Referd Expert Interview or verification process.',
      '• Scrape, copy, or misuse other users\' data or content.',
    ],
  },
  {
    id: 'content-ip',
    title: '8. Content & Intellectual Property',
    icon: <FileText className="w-5 h-5" />,
    content:
      'You retain ownership of the profile information, resumes, and other content you submit, and you grant Referd a limited license to use it to operate the platform (e.g. matching you with alumni, sharing your verified profile with a referrer you request). The Referd name, logo, and platform design are the property of Referd Technologies, Inc. and may not be used without permission.',
  },
  {
    id: 'fees',
    title: '9. Fees',
    icon: <AlertTriangle className="w-5 h-5" />,
    content:
      'Referd is currently free to use for all users — Students, Freshers, and Professionals. There are no fees for creating a profile, requesting a referral, or posting a referral job.\n\n⚠ If paid features are introduced in the future, update this section accordingly before launch.',
  },
  {
    id: 'disclaimers',
    title: '10. Disclaimers',
    icon: <AlertTriangle className="w-5 h-5" />,
    content:
      'Referd is provided "as is." We do not warrant that the platform will be uninterrupted, error-free, or that any candidate rating, review, or referral outcome will meet your expectations.',
  },
  {
    id: 'limitation',
    title: '11. Limitation of Liability',
    icon: <Scale className="w-5 h-5" />,
    content:
      'To the maximum extent permitted by law, Referd Technologies, Inc. will not be liable for indirect, incidental, or consequential damages arising from your use of Referd, including hiring decisions made by third parties.',
  },
  {
    id: 'termination',
    title: '12. Termination',
    icon: <Shield className="w-5 h-5" />,
    content:
      'We may suspend or terminate accounts that violate these Terms, including misrepresentation of identity or credentials, or attempts to circumvent the verification or interview process. You may deactivate your account at any time.',
  },
  {
    id: 'governing-law',
    title: '13. Governing Law & Disputes',
    icon: <Scale className="w-5 h-5" />,
    content:
      'These Terms shall be governed by the laws of India, and disputes shall be subject to the jurisdiction of Indian courts.',
  },
  {
    id: 'changes',
    title: '14. Changes to These Terms',
    icon: <FileText className="w-5 h-5" />,
    content:
      'We may update these Terms from time to time. Continued use of Referd after changes take effect constitutes acceptance of the updated Terms.',
  },
  {
    id: 'contact',
    title: '15. Contact',
    icon: <Mail className="w-5 h-5" />,
    content:
      'Questions about these Terms? Reach us at support@referd.in.',
  },
];

/* ---------- Component ---------- */
export default function TermsPage() {
  const [openId, setOpenId] = useState<string | null>(null);

  const toggle = (id: string) => {
    setOpenId((prev) => (prev === id ? null : id));
  };

  const renderContent = (content: string | string[]) => {
    if (Array.isArray(content)) {
      return content.map((line, idx) => {
        const trimmed = line.trim();
        if (trimmed === '') {
          return <div key={idx} className="h-2" />;
        }
        if (trimmed.startsWith('•') || trimmed.startsWith('-')) {
          return (
            <div key={idx} className="flex items-start gap-2 py-0.5">
              <span className="text-green-400 font-bold select-none">•</span>
              <span className="text-slate-300 text-sm">{trimmed.replace(/^[•\-]\s*/, '')}</span>
            </div>
          );
        }
        return (
          <p key={idx} className="text-slate-300 text-sm py-0.5">
            {trimmed}
          </p>
        );
      });
    }

    const lines = content.split('\n');
    return lines.map((line, idx) => {
      const trimmed = line.trim();
      if (trimmed === '') return <div key={idx} className="h-2" />;
      if (trimmed.includes('⚠')) {
        return (
          <div key={idx} className="bg-yellow-500/10 border border-yellow-500/30 p-3 rounded-lg my-2">
            <span className="text-yellow-400 text-sm font-medium">{trimmed}</span>
          </div>
        );
      }
      return (
        <p key={idx} className="text-slate-300 text-sm py-0.5">
          {trimmed}
        </p>
      );
    });
  };

  return (
    <>
      <Navbar />
      <main className="min-h-screen mt-12 bg-[#0f172a] px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          {/* Header */}
          <div className="text-center border-b border-[#2a3a52] pb-8 mb-10">
            <div className="inline-flex items-center gap-2 bg-green-500/10 text-green-400 text-xs font-semibold px-4 py-1.5 rounded-full border border-green-500/20 mb-4">
              
              Terms of Service
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight">
              Terms of Service
            </h1>
            <p className="text-slate-400 mt-2 text-sm">
              Last updated: {new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
            </p>
            <p className="text-slate-500 text-sm mt-1">
              By using Referd, you agree to these terms. Please read them carefully.
            </p>
          </div>

          {/* Terms list */}
          <div className="space-y-2.5">
            {termSections.map((section) => {
              const isOpen = openId === section.id;
              return (
                <div
                  key={section.id}
                  className="rounded-xl border border-[#2a3a52] bg-[#111827] overflow-hidden transition-all duration-200 hover:border-[#3a4a62]"
                >
                  <button
                    onClick={() => toggle(section.id)}
                    className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left bg-transparent hover:bg-[#1a2332] transition-colors"
                    aria-expanded={isOpen}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      {section.icon && (
                        <span className="text-green-400 flex-shrink-0">
                          {section.icon}
                        </span>
                      )}
                      <span className="text-white font-semibold text-sm md:text-base pr-2">
                        {section.title}
                      </span>
                    </div>
                    <ChevronDown
                      className={`w-5 h-5 text-slate-400 flex-shrink-0 transition-transform duration-200 ${
                        isOpen ? 'rotate-180' : ''
                      }`}
                      strokeWidth={2}
                    />
                  </button>
                  <div
                    className={`px-5 overflow-hidden transition-all duration-200 ease-in-out ${
                      isOpen ? 'max-h-[800px] pb-5' : 'max-h-0'
                    }`}
                  >
                    <div className="text-slate-300 text-sm leading-relaxed border-t border-[#2a3a52] pt-4">
                      {renderContent(section.content)}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Footer */}
          <div className="mt-8 pt-6 border-t border-[#2a3a52] text-xs text-slate-500 flex flex-col sm:flex-row justify-between items-center gap-2">
            <span>© {new Date().getFullYear()} Referd — operated by Referd Technologies, Inc.</span>
            <span className="text-slate-600">⚖️ governed by laws of India</span>
          </div>
        </div>
      </main>
      {/* <Footer /> */}
    </>
  );
}