// app/privacy/page.tsx
'use client';

import { useState } from 'react';
import { 
  ChevronDown, 
  Shield, 
  Eye, 
  Database, 
  Share2, 
  Clock, 
  UserCheck, 
  Lock, 
  Cookie,
  Mail,
  FileText,
  Sparkles
} from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

/* ---------- Types ---------- */
interface PolicySection {
  id: string;
  title: string;
  icon?: React.ReactNode;
  content: string | string[];
}

/* ---------- Data ---------- */
const policySections: PolicySection[] = [
  {
    id: 'introduction',
    title: '1. Introduction',
    icon: <FileText className="w-5 h-5" />,
    content:
      'This Privacy Policy explains how Referd collects, uses, shares, and protects your personal data when you use referd.in and related services. By using Referd, you consent to the practices described here.',
  },
  {
    id: 'information-collect',
    title: '2. Information We Collect',
    icon: <Database className="w-5 h-5" />,
    content: [
      '• Profile information — name, contact details, college/university, work history, role, and other details you add to your profile.',
      '• Verification information — documents or details used to verify your college or work identity.',
      '• Resume/CV and application content — information you submit when requesting or offering a referral.',
      '• Referd Expert Interview data — interview notes, ratings, and written reviews generated as part of the referral vetting process.',
      '• Usage data — how you interact with the platform (pages visited, actions taken, device/browser information).',
    ],
  },
  {
    id: 'how-we-use',
    title: '3. How We Use Your Information',
    icon: <Eye className="w-5 h-5" />,
    content: [
      '• To verify your identity as an alumni (college or workplace) and maintain a trusted network.',
      '• To match you with relevant alumni, referral jobs, or candidates.',
      '• To conduct the Referd Expert Interview and generate your Verified Candidature.',
      '• To share your verified profile, interview rating, and review with a referrer when you request a referral.',
      '• To communicate with you about your account, requests, and platform updates.',
      '• To maintain platform security and prevent misuse, fraud, or misrepresentation.',
    ],
  },
  {
    id: 'sharing',
    title: '4. Sharing of Information',
    icon: <Share2 className="w-5 h-5" />,
    content: [
      'We share your information only as needed to operate Referd:',
      '• With referrers — your verified profile, Expert Interview rating, and review are shared with the specific referrer when you request a referral for their job.',
      '• With service providers — third parties that help us operate the platform (e.g. hosting, verification tools), under confidentiality obligations.',
      '• For legal reasons — if required by law, regulation, or a valid legal process.',
      '',
      'We do not sell your personal data to third parties.',
    ],
  },
  {
    id: 'retention',
    title: '5. Data Retention',
    icon: <Clock className="w-5 h-5" />,
    content:
      'We retain your personal data for as long as your account is active, or as needed to provide the platform\'s services, comply with legal obligations, and resolve disputes. You may request deletion of your account and associated data, subject to any legal retention requirements.',
  },
  {
    id: 'your-rights',
    title: '6. Your Rights',
    icon: <UserCheck className="w-5 h-5" />,
    content: [
      'Subject to applicable law, you have the right to:',
      '• Access the personal data we hold about you.',
      '• Correct inaccurate or outdated information.',
      '• Withdraw consent and request erasure of your data.',
      '• Raise a grievance regarding how your data is processed.',
      '',
      'To exercise any of these rights, contact us at support@referd.in.',
    ],
  },
  {
    id: 'security',
    title: '7. Data Security',
    icon: <Lock className="w-5 h-5" />,
    content:
      'We use reasonable technical and organizational measures to protect your data against unauthorized access, alteration, disclosure, or destruction. No system is completely secure, and we encourage you to also protect your own account credentials.',
  },
  {
    id: 'cookies',
    title: '8. Cookies & Tracking',
    icon: <Cookie className="w-5 h-5" />,
    content:
      'Referd may use cookies or similar technologies to keep you signed in, remember preferences, and understand how the platform is used. You can control cookies through your browser settings.',
  },
  {
    id: 'grievance',
    title: '9. Grievance Officer',
    icon: <Shield className="w-5 h-5" />,
    content:
      'In accordance with the Information Technology Act, 2000 and rules made thereunder, the Grievance Officer for Referd is: support@referd.in',
  },
  {
    id: 'changes',
    title: '10. Changes to This Policy',
    icon: <FileText className="w-5 h-5" />,
    content:
      'We may update this Privacy Policy from time to time. We\'ll notify you of material changes and update the effective date above.',
  },
  {
    id: 'contact',
    title: '11. Contact Us',
    icon: <Mail className="w-5 h-5" />,
    content:
      'For any privacy-related questions, reach us at support@referd.in.',
  },
];

/* ---------- Component ---------- */
export default function PrivacyPage() {
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
        if (trimmed.startsWith('•')) {
          return (
            <div key={idx} className="flex items-start gap-2 py-0.5">
              <span className="text-green-400 font-bold select-none">•</span>
              <span className="text-slate-300 text-sm">{trimmed.replace(/^•\s*/, '')}</span>
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
            
              Your Privacy Matters
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight">
              Privacy Policy
            </h1>
            <p className="text-slate-400 mt-2 text-sm">
              Effective date: {new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
            </p>
            <p className="text-slate-500 text-sm mt-1">
              Your privacy matters. This policy explains how we handle your data.
            </p>
          </div>

          {/* Policy sections */}
          <div className="space-y-2.5">
            {policySections.map((section) => {
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
            <span className="text-slate-600">🔒 your data is protected</span>
          </div>
        </div>
      </main>
      {/* <Footer /> */}
    </>
  );
}