// app/faq/page.tsx
'use client';

import { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';


/* ---------- Types ---------- */
interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

/* ---------- Data ---------- */
const faqData: FaqItem[] = [
  {
    id: 'what-is-referd',
    question: 'What is Referd?',
    answer:
      'Referd is India\'s alumni-powered referral hiring network. It connects you with alumni — people from your college or people you\'ve worked with before — who are already working inside the companies you want to join, so your application reaches someone who actually knows you.',
  },
  {
    id: 'who-counts-as-alumni',
    question: 'Who counts as "alumni" on Referd?',
    answer:
      'On Referd, alumni isn\'t limited to your college. It covers both your college batchmates and your ex-colleagues — anyone you share a real, verifiable connection with.',
  },
  {
    id: 'is-referd-free',
    question: 'Is Referd free to use?',
    answer:
      'Yes — Referd is completely free to use, for both Students/Freshers and Professionals. There are no fees to create a profile, request a referral, or post a referral job.',
  },
  {
    id: 'who-can-use',
    question: 'Who can use Referd?',
    answer:
      'Referd has two user types. Students/Freshers can find internships, off-campus jobs, and referral jobs. Professionals play a dual role — they can post referral jobs from their own company and also request referrals for themselves.',
  },
  {
    id: 'student-to-professional',
    question: 'How do I move from a Student/Fresher profile to a Professional profile?',
    answer:
      'Your profile upgrades automatically once you join a company — there\'s no separate application for this.',
  },
  {
    id: 'smart-job-discovery',
    question: 'What is Smart Job Discovery?',
    answer:
      'Paste the link of a job you\'re interested in, and Referd finds alumni working at that company so you can request a referral directly from them.',
  },
  {
    id: 'referral-jobs-feed',
    question: 'What is the Referral Jobs Feed?',
    answer:
      'Professionals post exclusive referral opportunities from their own company on this feed. Any user can browse it and request a referral for roles that fit them.',
  },
  {
    id: 'after-request',
    question: 'What happens after I request a referral?',
    answer:
      'Every referral request passes through two checks before it ever reaches the referrer: \n• Referd Expert Interview — a human subject-matter expert interviews you for that specific job, rates your candidature, and writes a review. \n• Verified Candidature — your profile and credentials are verified. \nOnly requests that clear both are passed on to the referrer.',
  },
  {
    id: 'expert-interview',
    question: 'What is the Referd Expert Interview?',
    answer:
      'A real interview conducted by a human subject-matter expert, specific to the job you\'re requesting a referral for. The expert rates your candidature and writes a review, so the referrer sees a vetted profile instead of a cold resume.',
  },
  {
    id: 'verified-candidature',
    question: 'What is Verified Candidature?',
    answer:
      'Confirmation that your profile and credentials are genuine and verified before your request is shared with a referrer.',
  },
  {
    id: 'alumni-bond',
    question: 'What is Alumni Bond?',
    answer:
      'An additional, optional layer that can strengthen a referral request when you and the referrer share a closer connection — for example, the same college batch or the same past team. It adds to a request; it isn\'t required for every referral.',
  },
  {
    id: 'guarantee',
    question: 'Does Referd guarantee me a job or an interview at the company?',
    answer:
      'No. Referd facilitates a vetted, trusted introduction to a referrer. The hiring decision always remains with the company.',
  },
  {
    id: 'verify-alumni-identity',
    question: 'Why does Referd verify alumni identity?',
    answer:
      'So that every conversation on the platform happens between real, verifiable people. Combined with the Referd Expert Interview, this protects referrers from unverified or misrepresented candidates — a growing concern as AI makes it easier to fake credentials and interview performance.',
  },
  {
    id: 'data-safety',
    question: 'Is my data safe with Referd?',
    answer:
      'Yes — see our Privacy Policy for full details on what we collect, how it\'s used, and how it\'s protected.',
  },
  {
    id: 'why-refer-through-referd',
    question: 'Why should I refer someone through Referd instead of directly?',
    answer:
      'Every candidate is screened by a Referd Expert Interview before they ever reach you, so you\'re referring with confidence — not guesswork — and your own reputation with your employer stays protected.',
  },
  {
    id: 'referrer-rewards',
    question: 'Do I get anything for referring someone?',
    answer:
      'Referrers can earn referral rewards from their organization, as per that organization\'s own referral policy.',
  },
  {
    id: 'post-referral-job',
    question: 'How do I post a referral job?',
    answer:
      'From your Professional profile, use "Become a Referrer" to post an open role from your company to the Referral Jobs Feed.',
  },
  {
    id: 'support',
    question: 'I have an issue with my account or a referral request. Who do I contact?',
    answer:
      'Reach out to us at support@referd.in and we\'ll help you sort it out.',
  },
];

/* ---------- Component ---------- */
export default function FAQPage() {
  const [openId, setOpenId] = useState<string | null>(null);

  const toggle = (id: string) => {
    setOpenId((prev) => (prev === id ? null : id));
  };

  return (
    <>
      <Navbar/>
      <main className="min-h-screen mt-12 bg-[#0f172a] px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          {/* Header */}
          <div className="mb-8 text-center">
            <div className="flex items-center justify-center gap-3 mb-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-green-500/10 border border-green-500/20">
                <HelpCircle className="h-6 w-6 text-green-400" />
              </div>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight">
              Frequently Asked Questions
            </h1>
            <p className="text-slate-400 mt-2 text-sm">
              Everything you need to know about India's alumni-powered referral network.
            </p>
          </div>

          {/* FAQ list */}
          <div className="space-y-2.5">
            {faqData.map((item) => {
              const isOpen = openId === item.id;
              return (
                <div
                  key={item.id}
                  className="rounded-xl border border-[#2a3a52] bg-[#111827] overflow-hidden transition-all duration-200 hover:border-[#3a4a62]"
                >
                  <button
                    onClick={() => toggle(item.id)}
                    className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left bg-transparent hover:bg-[#1a2332] transition-colors"
                    aria-expanded={isOpen}
                  >
                    <span className="text-white font-medium text-sm md:text-base pr-2">
                      {item.question}
                    </span>
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
                    <div className="text-slate-300 text-sm leading-relaxed whitespace-pre-line border-t border-[#2a3a52] pt-4">
                      {item.answer}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Footer / support */}
          <div className="mt-8 pt-6 border-t border-[#2a3a52] text-xs text-slate-500 flex flex-col sm:flex-row justify-between items-center gap-2">
            <span>© Referd — alumni-powered referral hiring</span>
            <span className="text-slate-600">⚡ vetted · trusted · free</span>
          </div>
        </div>
      </main>
      {/* <Footer/> */}
    </>
  );
}