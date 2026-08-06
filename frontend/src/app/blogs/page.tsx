import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import {
  Calendar,
  User,
  ArrowRight,
  Clock,
  Hash,
  BookOpen,
  TrendingUp,
  Award,
} from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import axiosInstance from "@/lib/axiosInstance";

export const metadata: Metadata = {
  title: "Blogs | Referd",
  description:
    "Read career advice, employee referral guides, interview preparation tips, hiring insights and job search strategies on Referd.",

  keywords: [
    "career blogs",
    "employee referral",
    "job referrals",
    "interview preparation",
    "career growth",
    "resume tips",
    "hiring",
    "Referd",
  ],

  alternates: {
    canonical: "https://referd.in/blogs",
  },

  openGraph: {
    title: "Referd Blogs",
    description:
      "Career advice, employee referral guides and interview preparation and hiring insights.",
    url: "https://referd.in/blogs",
    siteName: "Referd",
    type: "website",
    images: [
      {
        url: "https://referd.in/og-image.png",
        width: 1200,
        height: 630,
        alt: "Referd Blogs",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "Referd Blogs",
    description: "Career advice, employee referral guides and hiring insights.",
    images: ["https://referd.in/og-image.png"],
  },

  robots: {
    index: true,
    follow: true,
  },
};

interface Blog {
  _id: string;
  title: string;
  content: string;
  coverImage: string;
  author: string;
  tags: string[];
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
}

async function getBlogs(): Promise<Blog[]> {
  try {
    const { data } = await axiosInstance.get("/api/blogs");

    return data.data || [];
  } catch (error) {
    console.error("Error fetching blogs:", error);
    return [];
  }
}

// Helper function to get tag color based on tag name
function getTagColor(tag: string): string {
  const colors: Record<string, string> = {
    "Employee Referral": "tag-employee-referral",
    "Job Referral": "tag-job-referral",
    Career: "tag-career",
    "Interview Tips": "tag-interview-tips",
    "Job Search": "tag-job-search",
    Freshers: "tag-freshers",
    "Alumni Network": "tag-alumni-network",
    Hiring: "tag-hiring",
    Referd: "tag-referd",
  };

  const matchingKey = Object.keys(colors).find((key) =>
    tag.toLowerCase().includes(key.toLowerCase()),
  );

  return matchingKey ? colors[matchingKey] : "tag-default";
}

export default async function BlogsPage() {
  const blogs = await getBlogs();

  if (!blogs.length) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[var(--background)] px-4">
        <Navbar />
        <div className="text-center mt-8">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-[var(--primary-soft)]">
            <BookOpen className="h-10 w-10 text-[var(--primary)]" />
          </div>
          <h1 className="text-3xl font-bold text-[var(--text-primary)]">
            No Blogs Available
          </h1>
          <p className="mt-3 text-[var(--text-muted)]">
            Please check back later for insightful content.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[var(--background)]">
      {/* JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Blog",
            name: "Referd Blog",
            url: "https://referd.in/blogs",
            description:
              "Career advice, employee referral guides and hiring insights.",
            publisher: {
              "@type": "Organization",
              name: "Referd",
              logo: {
                "@type": "ImageObject",
                url: "https://referd.in/logo.png",
              },
            },
          }),
        }}
      />
      <Navbar />

      <div className="mx-auto max-w-7xl mt-8 px-4 py-8 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="relative mb-16 overflow-hidden rounded-3xl bg-gradient-to-br from-[var(--primary)] via-[var(--primary-dark)] to-[var(--primary-deep)] px-6 py-16 text-center shadow-2xl sm:px-12 lg:px-16">
          <div className="absolute inset-0 bg-[url('/pattern.svg')] opacity-10"></div>
          <div className="relative z-10">
            <div className="mb-4 inline-flex items-center gap-3 rounded-full bg-white/20 px-5 py-2 backdrop-blur-sm">
              <span className="relative flex h-2.5 w-2.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white opacity-75"></span>
                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-white"></span>
              </span>
              <span className="text-sm font-medium text-white">
                Latest Insights & Stories
              </span>
            </div>

            <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
              <span className="block">Explore Our</span>
              <span className="block bg-gradient-to-r from-yellow-200 via-amber-200 to-orange-200 bg-clip-text text-transparent">
                Knowledge Hub
              </span>
            </h1>

            <p className="mx-auto mt-4 max-w-2xl text-sm text-white/90 md:text-base">
              Discover expert career advice, interview strategies, resume tips,
              and employee referral insights to accelerate your professional
              growth.
            </p>

            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
              <span className="inline-flex items-center gap-2 rounded-full bg-white/20 px-4 py-1.5 text-sm text-white backdrop-blur-sm">
                <TrendingUp className="h-4 w-4" />
                Trending Topics
              </span>
              <span className="inline-flex items-center gap-2 rounded-full bg-white/20 px-4 py-1.5 text-sm text-white backdrop-blur-sm">
                <Award className="h-4 w-4" />
                Expert Advice
              </span>
            </div>
          </div>
        </div>

        {/* Blog Grid */}
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {blogs.map((blog) => (
            <Link
              key={blog._id}
              href={`/blogs/${blog._id}`}
              className="group relative overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--card)] shadow-lg transition-all duration-500 hover:-translate-y-2 hover:border-[var(--primary-border)] hover:shadow-2xl"
            >
              {/* Image Container */}
              <div className="relative h-56 w-full overflow-hidden bg-[var(--background-soft)]">
                <Image
                  src={blog.coverImage || "/blog-placeholder.jpg"}
                  alt={blog.title}
                  fill
                  className="object-cover transition duration-700 group-hover:scale-110"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
              </div>

              <div className="p-6">
                {/* Tags with # format - Individual boxes */}
                <div className="mb-4 flex flex-wrap items-center gap-1.5">
                  {blog.tags.slice(0, 4).map((tag) => (
                    <span
                      key={tag}
                      className={`inline-flex items-center gap-1 rounded-full border px-3 py-1 text-xs font-medium transition-all duration-300 hover:scale-105 ${getTagColor(tag)}`}
                    >
                      <Hash className="h-5 w5" />
                      {tag}
                    </span>
                  ))}
                  {blog.tags.length > 4 && (
                    <span className="inline-flex items-center rounded-full border border-[var(--border)] bg-[var(--background-soft)] px-3 py-1 text-xs font-medium text-[var(--text-muted)]">
                      +{blog.tags.length - 4}
                    </span>
                  )}
                </div>

                <h2 className="line-clamp-2 text-xl font-semibold text-[var(--text-primary)] transition-colors duration-300 group-hover:text-[var(--primary)]">
                  {blog.title}
                </h2>

                <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-[var(--text-secondary)]">
                  {blog.content.replace(/<[^>]*>/g, "").substring(0, 140)}...
                </p>

                {/* Author, Date, Read Time - All in one line */}
                <div className="mt-4 flex items-center justify-between border-t border-[var(--border)] pt-3 text-xs text-[var(--text-muted)]">
                  <div className="flex items-center gap-3">
                    <span className="inline-flex items-center gap-1">
                      <User className="h-3 w-3" />
                      {blog.author}
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {new Date(blog.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                  <span className="inline-flex items-center gap-1 text-[var(--text-muted)]">
                    <Clock className="h-3 w-3" />
                    {Math.ceil(blog.content.split(" ").length / 200)} min
                  </span>
                </div>

                {/* Read More Link */}
                <div className="mt-3 flex items-center justify-end">
                  <span className="inline-flex items-center gap-1.5 text-sm font-medium text-[var(--primary)] transition-all duration-300 group-hover:gap-2.5">
                    Read Article
                    <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                  </span>
                </div>
              </div>

              {/* Decorative gradient border on hover */}
              <div className="absolute inset-0 rounded-2xl border-2 border-transparent transition-all duration-500 group-hover:border-[var(--primary-border)]/50"></div>
            </Link>
          ))}
        </div>

        {/* Footer CTA Section */}
        <div className="mt-20">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[var(--primary-dark)] via-[var(--primary)] to-[var(--primary-deep)] px-6 py-12 text-center shadow-2xl sm:px-12">
            <div className="absolute inset-0 bg-[url('/pattern.svg')] opacity-5"></div>
            <div className="relative z-10">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm">
                <BookOpen className="h-7 w-7 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white sm:text-3xl">
                Stay Updated with Our Latest Content
              </h3>
              <p className="mx-auto mt-3 max-w-2xl text-sm text-white/90">
                Join thousands of professionals who benefit from our career
                insights, interview guides, and referral strategies.
              </p>
              <div className="mt-6 flex flex-wrap items-center justify-center gap-4">
                <span className="inline-flex items-center gap-2 rounded-full bg-white/20 px-5 py-2 text-sm text-white backdrop-blur-sm">
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75"></span>
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-green-400"></span>
                  </span>
                  New posts weekly
                </span>
                <span className="inline-flex items-center gap-2 rounded-full bg-white/20 px-5 py-2 text-sm text-white backdrop-blur-sm">
                  <Award className="h-4 w-4" />
                  {blogs.length}+ articles published
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </main>
  );
}
