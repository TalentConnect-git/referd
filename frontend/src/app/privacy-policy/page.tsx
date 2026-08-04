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
    icon: <FileText className="h-5 w-5" />,
    content:
      'This Privacy Policy explains how Referd collects, uses, shares, and protects your personal data when you use referd.in and related services. By using Referd, you consent to the practices described here.',
  },
  {
    id: 'information-collect',
    title: '2. Information We Collect',
    icon: <Database className="h-5 w-5" />,
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
    icon: <Eye className="h-5 w-5" />,
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
    icon: <Share2 className="h-5 w-5" />,
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
    icon: <Clock className="h-5 w-5" />,
    content:
      'We retain your personal data for as long as your account is active, or as needed to provide the platform\'s services, comply with legal obligations, and resolve disputes. You may request deletion of your account and associated data, subject to any legal retention requirements.',
  },
  {
    id: 'your-rights',
    title: '6. Your Rights',
    icon: <UserCheck className="h-5 w-5" />,
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
    icon: <Lock className="h-5 w-5" />,
    content:
      'We use reasonable technical and organizational measures to protect your data against unauthorized access, alteration, disclosure, or destruction. No system is completely secure, and we encourage you to also protect your own account credentials.',
  },
  {
    id: 'cookies',
    title: '8. Cookies & Tracking',
    icon: <Cookie className="h-5 w-5" />,
    content:
      'Referd may use cookies or similar technologies to keep you signed in, remember preferences, and understand how the platform is used. You can control cookies through your browser settings.',
  },
  {
    id: 'grievance',
    title: '9. Grievance Officer',
    icon: <Shield className="h-5 w-5" />,
    content:
      'In accordance with the Information Technology Act, 2000 and rules made thereunder, the Grievance Officer for Referd is: support@referd.in',
  },
  {
    id: 'changes',
    title: '10. Changes to This Policy',
    icon: <FileText className="h-5 w-5" />,
    content:
      'We may update this Privacy Policy from time to time. We\'ll notify you of material changes and update the effective date above.',
  },
  {
    id: 'contact',
    title: '11. Contact Us',
    icon: <Mail className="h-5 w-5" />,
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
              <span className="select-none font-bold text-[var(--primary)]">•</span>
              <span className="text-sm text-[var(--text-secondary)]">{trimmed.replace(/^•\s*/, '')}</span>
            </div>
          );
        }
        return (
          <p key={idx} className="py-0.5 text-sm text-[var(--text-secondary)]">
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
        <p key={idx} className="py-0.5 text-sm text-[var(--text-secondary)]">
          {trimmed}
        </p>
      );
    });
  };

  return (
    <>
      <Navbar />
      <main className="mt-12 min-h-screen bg-[var(--background)] px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          {/* Header */}
          <div className="border-b border-[var(--border)] pb-8 text-center md:pb-10">
            <div className="badge badge-success mb-3 inline-flex items-center gap-2 rounded-full border border-[var(--success-border)] bg-[var(--success-soft)] px-4 py-1.5 text-xs font-semibold text-[var(--success)] sm:mb-4">
              <Shield className="h-3.5 w-3.5" />
              Your Privacy Matters
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-[var(--text-primary)] md:text-4xl">
              Privacy Policy
            </h1>
            <p className="mt-2 text-sm text-[var(--text-muted)]">
              Effective date: {new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
            </p>
            <p className="mt-1 text-sm text-[var(--text-muted)]">
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
                  className="surface-card overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--card)] transition-all duration-200 hover:border-[var(--border-strong)]"
                >
                  <button
                    onClick={() => toggle(section.id)}
                    className="flex w-full items-center justify-between gap-4 bg-transparent px-4 py-4 text-left transition-colors hover:bg-[var(--card-hover)] sm:px-5"
                    aria-expanded={isOpen}
                  >
                    <div className="flex min-w-0 items-center gap-3">
                      {section.icon && (
                        <span className="flex-shrink-0 text-[var(--primary)]">
                          {section.icon}
                        </span>
                      )}
                      <span className="pr-2 text-sm font-semibold text-[var(--text-primary)] md:text-base">
                        {section.title}
                      </span>
                    </div>
                    <ChevronDown
                      className={`h-5 w-5 flex-shrink-0 text-[var(--text-muted)] transition-transform duration-200 ${
                        isOpen ? 'rotate-180' : ''
                      }`}
                      strokeWidth={2}
                    />
                  </button>
                  <div
                    className={`overflow-hidden px-4 transition-all duration-200 ease-in-out sm:px-5 ${
                      isOpen ? 'max-h-[800px] pb-4 sm:pb-5' : 'max-h-0'
                    }`}
                  >
                    <div className="border-t border-[var(--border)] pt-4 text-sm leading-relaxed text-[var(--text-secondary)]">
                      {renderContent(section.content)}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Footer */}
          <div className="mt-8 flex flex-col items-center justify-between gap-2 border-t border-[var(--border)] pt-6 text-xs text-[var(--text-muted)] sm:flex-row">
            <span>© {new Date().getFullYear()} Referd — operated by Referd Technologies, Inc.</span>
            <span className="text-[var(--text-muted)]">🔒 your data is protected</span>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}