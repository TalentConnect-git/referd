// app/about/page.tsx
'use client';

import { 
  Users, 
  Award, 
  Shield, 
  Sparkles, 
  ArrowRight, 
  GraduationCap, 
  Briefcase, 
  CheckCircle,
  Star,
  Zap,
  Building2,
  UserCheck,
  Heart,
  Info,
  TrendingUp,
  Globe,
} from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

// LinkedIn SVG Icon
const LinkedInIcon = ({ className = "w-5 h-5" }) => (
  <svg 
    className={className} 
    viewBox="0 0 24 24" 
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
  </svg>
);

// GitHub SVG Icon
const GitHubIcon = ({ className = "w-5 h-5" }) => (
  <svg 
    className={className} 
    viewBox="0 0 24 24" 
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.468-2.38 1.235-3.22-.123-.3-.535-1.52.117-3.16 0 0 1.008-.322 3.3 1.23.96-.267 1.98-.399 3-.399s2.04.132 3 .399c2.292-1.552 3.3-1.23 3.3-1.23.653 1.64.24 2.86.118 3.16.768.84 1.233 1.91 1.233 3.22 0 4.61-2.804 5.62-5.476 5.92.43.37.824 1.102.824 2.22 0 1.602-.015 2.894-.015 3.287 0 .322.216.694.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>
  </svg>
);

/* ---------- Types ---------- */
interface ValueItem {
  icon: React.ReactNode;
  title: string;
  description: string;
}

interface AudienceItem {
  icon: React.ReactNode;
  title: string;
  description: string;
}

/* ---------- Data ---------- */
const values: ValueItem[] = [
  {
    icon: <Shield className="w-5 h-5" />,
    title: 'Verified alumni only',
    description: 'Every identity on Referd is verified, whether that\'s a college or a company. No bots, no fake profiles.',
  },
  {
    icon: <Star className="w-5 h-5" />,
    title: 'Expert-vetted, not just self-reported',
    description: 'A real interview and review stand behind every referral request. Candidates get judged on substance, not just a resume.',
  },
  {
    icon: <Heart className="w-5 h-5" />,
    title: 'Free for students and professionals',
    description: 'No fees to create a profile, request a referral, or post a referral job. Building trust shouldn\'t cost a thing.',
  },
];

const audience: AudienceItem[] = [
  {
    icon: <GraduationCap className="w-5 h-5" />,
    title: 'Students & Freshers',
    description: 'Looking for internships, off-campus opportunities, and referral-backed jobs. Get your foot in the door with a warm introduction.',
  },
  {
    icon: <Briefcase className="w-5 h-5" />,
    title: 'Professionals',
    description: 'Refer candidates from your network and post exclusive roles from your own company. Build your team with trusted talent.',
  },
];

const stats = [
  { label: 'Alumni-connected', value: '10K+' },
  { label: 'Referral requests', value: '5K+' },
  { label: 'Verified professionals', value: '3K+' },
  { label: 'Companies represented', value: '500+' },
];

/* ---------- Component ---------- */
export default function AboutPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen mt-12 bg-[#0f172a] px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          {/* Hero Section */}
          <div className="text-center border-b border-[#2a3a52] pb-8 mb-10">
            <div className="inline-flex items-center gap-2 bg-green-500/10 text-green-400 text-xs font-semibold px-4 py-1.5 rounded-full border border-green-500/20 mb-4">
             
              India's first alumni-powered referral hiring network
            </div>
            <h1 className="text-3xl md:text-5xl font-bold text-white tracking-tight leading-tight">
              About Referd
            </h1>
            <p className="text-lg text-slate-400 mt-4 max-w-2xl mx-auto">
              The hiring system was built around applications. Careers are built around relationships.
            </p>
          </div>

          {/* The Problem */}
          <div className="mb-10">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="rounded-2xl border border-[#2a3a52] bg-[#111827] p-5">
                <div className="flex items-center gap-2 text-red-400 mb-3">
                  <span className="text-xl">😔</span>
                  <span className="font-semibold text-white text-sm">The reality</span>
                </div>
                <p className="text-slate-300 text-sm leading-relaxed">
                  Every day, thousands of candidates apply to jobs they're genuinely qualified for — and most of those 
                  applications never reach a real person. They sit in a queue behind hundreds of others, filtered by keywords, 
                  and never get read the way a warm introduction would be.
                </p>
              </div>
              <div className="rounded-2xl border border-[#2a3a52] bg-[#111827] p-5">
                <div className="flex items-center gap-2 text-orange-400 mb-3">
                  <span className="text-xl">🤖</span>
                  <span className="font-semibold text-white text-sm">The challenge</span>
                </div>
                <p className="text-slate-300 text-sm leading-relaxed">
                  Hiring has never been harder to trust. AI makes it easier than ever to fake a resume, rehearse answers, 
                  or misrepresent experience — which makes referrers more cautious, and honest candidates harder to tell 
                  apart from the rest.
                </p>
              </div>
            </div>
            <div className="mt-4 text-center">
              <p className="text-sm font-medium text-green-400">
                Referd exists to fix both problems at once.
              </p>
            </div>
          </div>

          {/* What we do */}
          <div className="mb-10 rounded-2xl border border-green-500/20 bg-green-500/5 p-6 md:p-8">
            <h2 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
              <Zap className="w-5 h-5 text-green-400" />
              What we do
            </h2>
            <p className="text-slate-300 text-sm leading-relaxed mb-3">
              Referd turns your alumni network — your college and the companies you've worked at — into your fastest, 
              most trusted path to a job. Instead of a cold application, you get a warm introduction from someone who 
              actually knows your school or your work.
            </p>
            <p className="text-slate-300 text-sm leading-relaxed">
              But a warm introduction alone isn't enough to earn trust on both sides. So every referral request on Referd 
              goes through a <span className="font-semibold text-green-400">Referd Expert Interview</span> and{' '}
              <span className="font-semibold text-green-400">Verified Candidature</span> check before it ever reaches a 
              referrer — a real interview, a rating, and a written review from a human subject-matter expert. Referrers 
              refer with confidence. Candidates get judged on substance, not just a resume.
            </p>
          </div>

          {/* Who it's for */}
          <div className="mb-10">
            <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <Users className="w-5 h-5 text-green-400" />
              Who it's for
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              {audience.map((item, index) => (
                <div 
                  key={index}
                  className="rounded-2xl border border-[#2a3a52] bg-[#111827] p-5 hover:border-green-500/30 transition-all hover:bg-[#1a2332]"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-green-400 bg-green-500/10 p-2 rounded-xl border border-green-500/20">
                      {item.icon}
                    </span>
                    <h3 className="font-semibold text-white text-sm">{item.title}</h3>
                  </div>
                  <p className="text-slate-400 text-sm leading-relaxed">{item.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Our approach */}
          <div className="mb-10">
            <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <Award className="w-5 h-5 text-green-400" />
              Our approach
            </h2>
            <div className="grid md:grid-cols-3 gap-4">
              {values.map((item, index) => (
                <div 
                  key={index}
                  className="rounded-2xl border border-[#2a3a52] bg-[#111827] p-5 hover:border-green-500/30 transition-all hover:bg-[#1a2332]"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-green-400 bg-green-500/10 p-2 rounded-xl border border-green-500/20">
                      {item.icon}
                    </span>
                    <h3 className="font-semibold text-white text-sm">{item.title}</h3>
                  </div>
                  <p className="text-slate-400 text-sm leading-relaxed">{item.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Stats */}
          <div className="mb-8 rounded-2xl bg-gradient-to-r from-green-600 to-emerald-600 p-6 md:p-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              {stats.map((stat, index) => (
                <div key={index} className="space-y-0.5">
                  <p className="text-2xl md:text-3xl font-bold text-white">{stat.value}</p>
                  <p className="text-emerald-100 text-xs">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Social Links */}
          <div className="flex items-center justify-center gap-4 py-4 border-t border-[#2a3a52]">
            <p className="text-slate-500 text-xs">Connect with us:</p>
            <a
              href="https://linkedin.com/company/referd"
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-400 hover:text-blue-400 transition-colors"
              aria-label="LinkedIn"
            >
              <LinkedInIcon className="w-5 h-5" />
            </a>
            <a
              href="https://github.com/referd"
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-400 hover:text-white transition-colors"
              aria-label="GitHub"
            >
              <GitHubIcon className="w-5 h-5" />
            </a>
          </div>

          {/* Footer CTA */}
          <div className="text-center pt-4 border-t border-[#2a3a52]">
            <p className="text-slate-500 text-xs">
              Built with ❤️ for students, professionals, and the relationships that connect them.
            </p>
          </div>
        </div>
      </main>
      {/* <Footer /> */}
    </>
  );
}