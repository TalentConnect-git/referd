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
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/blogs`);

    if (!res.ok) return [];

    const json = await res.json();
    console.log("data blog",json.data);

    return json.data || [];
  } catch (err) {
    console.error(err);
    return [];
  }
}

// Helper function to get tag color based on tag name using CSS variables
function getTagStyle(tag: string): string {
  const tagLower = tag.toLowerCase();
  
  if (tagLower.includes("referral") || tagLower.includes("refer")) {
    return "border-[var(--primary-border)] bg-[var(--primary-soft)] text-[var(--primary)]";
  }
  if (tagLower.includes("career") || tagLower.includes("growth")) {
    return "border-[var(--success-border)] bg-[var(--success-soft)] text-[var(--success)]";
  }
  if (tagLower.includes("interview") || tagLower.includes("tips")) {
    return "border-[var(--info-border)] bg-[var(--info-soft)] text-[var(--info)]";
  }
  if (tagLower.includes("job") || tagLower.includes("search") || tagLower.includes("hiring")) {
    return "border-[var(--warning-border)] bg-[var(--warning-soft)] text-[var(--warning)]";
  }
  if (tagLower.includes("fresher") || tagLower.includes("alumni") || tagLower.includes("network")) {
    return "border-[var(--primary-border)] bg-[var(--primary-soft)] text-[var(--primary)]";
  }
  if (tagLower.includes("resume") || tagLower.includes("cv")) {
    return "border-[var(--success-border)] bg-[var(--success-soft)] text-[var(--success)]";
  }
  if (tagLower.includes("salary") || tagLower.includes("compensation")) {
    return "border-[var(--warning-border)] bg-[var(--warning-soft)] text-[var(--warning)]";
  }
  if (tagLower.includes("remote") || tagLower.includes("work")) {
    return "border-[var(--info-border)] bg-[var(--info-soft)] text-[var(--info)]";
  }
  
  return "border-[var(--border)] bg-[var(--background-soft)] text-[var(--text-secondary)]";
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

  const logo ="/frontend/public/og-image.png"

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

      <div className="mx-auto max-w-6xl mt-8 px-4 py-8 sm:px-6 lg:px-8">
        {/* Hero Section - Smaller */}
        <div className="relative mb-10 overflow-hidden rounded-2xl bg-gradient-to-br from-[var(--primary)] via-[var(--primary-dark)] to-[var(--primary-deep)] px-6 py-10 text-center shadow-xl sm:px-10 lg:py-12">
          <div className="absolute inset-0 bg-[url('/pattern.svg')] opacity-10"></div>
          <div className="relative z-10">
            <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-white/20 px-4 py-1.5 backdrop-blur-sm">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white opacity-75"></span>
                <span className="relative inline-flex h-2 w-2 rounded-full bg-white"></span>
              </span>
              <span className="text-xs font-medium text-white">
                Latest Insights & Stories
              </span>
            </div>

            <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">
              <span className="block">Explore Our</span>
              <span className="block bg-gradient-to-r from-yellow-200 via-amber-200 to-orange-200 bg-clip-text text-transparent">
                Knowledge Hub
              </span>
            </h1>

            <p className="mx-auto mt-3 max-w-2xl text-xs text-white/90 md:text-sm">
              Discover expert career advice, interview strategies, resume tips,
              and employee referral insights to accelerate your professional
              growth.
            </p>

            <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/20 px-3 py-1 text-xs text-white backdrop-blur-sm">
                <TrendingUp className="h-3 w-3" />
                Trending Topics
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/20 px-3 py-1 text-xs text-white backdrop-blur-sm">
                <Award className="h-3 w-3" />
                Expert Advice
              </span>
            </div>
          </div>
        </div>

        {/* Blog Grid - Smaller cards with reduced width */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {blogs.map((blog) => (
            <Link
              key={blog._id}
              href={`/blogs/${blog._id}`}
              className="group relative overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--card)] shadow-md transition-all duration-300 hover:-translate-y-1 hover:border-[var(--primary-border)] hover:shadow-lg"
            >
              {/* Image Container - Even smaller */}
              <div className="relative h-28 w-full overflow-hidden bg-[var(--background-soft)]">
                {blog.coverImage ? (
                  <Image
                    src={blog.coverImage}
                    alt={blog.title}
                    fill
                    className="object-cover transition duration-500 group-hover:scale-105"
                    sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-[var(--primary-soft)] to-[var(--background-soft)]">
                    <div className="relative h-10 w-10">
                      <Image
                        src="https://referd.in/og-image.png"
                        alt="Referd Logo"
                        fill
                        className="object-contain"
                        priority
                      />
                    </div>
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent"></div>
              </div>

              <div className="p-2.5">
                {/* Tags */}
                <div className="mb-1.5 flex flex-wrap items-center gap-1">
                  {blog.tags.slice(0, 2).map((tag) => (
                    <span
                      key={tag}
                      className={`inline-flex items-center gap-0.5 rounded-full border px-1.5 py-0.5 text-[7px] font-medium ${getTagStyle(tag)}`}
                    >
                      <Hash className="h-1.5 w-1.5" />
                      {tag}
                    </span>
                  ))}
                  {blog.tags.length > 2 && (
                    <span className="inline-flex items-center rounded-full border border-[var(--border)] bg-[var(--background-soft)] px-1.5 py-0.5 text-[7px] font-medium text-[var(--text-muted)]">
                      +{blog.tags.length - 2}
                    </span>
                  )}
                </div>

                <h2 className="line-clamp-2 text-xs font-semibold text-[var(--text-primary)] transition-colors duration-300 group-hover:text-[var(--primary)]">
                  {blog.title}
                </h2>

                <p className="mt-1 line-clamp-2 text-[9px] leading-relaxed text-[var(--text-secondary)]">
                  {blog.content.replace(/<[^>]*>/g, "").substring(0, 60)}...
                </p>

                {/* Author, Date, Read Time */}
                <div className="mt-1.5 flex items-center justify-between border-t border-[var(--border)] pt-1.5 text-[7px] text-[var(--text-muted)]">
                  <div className="flex items-center gap-1">
                    <span className="inline-flex items-center gap-0.5">
                      <User className="h-1.5 w-1.5" />
                      {blog.author}
                    </span>
                    <span className="inline-flex items-center gap-0.5">
                      <Calendar className="h-1.5 w-1.5" />
                      {new Date(blog.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      })}
                    </span>
                  </div>
                  <span className="inline-flex items-center gap-0.5">
                    <Clock className="h-1.5 w-1.5" />
                    {Math.ceil(blog.content.split(" ").length / 200)} min
                  </span>
                </div>

                {/* Read More Link - Smaller */}
                <div className="mt-1 flex items-center justify-end">
                  <span className="inline-flex items-center gap-0.5 text-[8px] font-medium text-[var(--primary)] transition-all duration-300 group-hover:gap-1">
                    Read
                    <ArrowRight className="h-2 w-2 transition-transform duration-300 group-hover:translate-x-0.5" />
                  </span>
                </div>
              </div>

              {/* Decorative border on hover */}
              <div className="absolute inset-0 rounded-xl border border-transparent transition-all duration-300 group-hover:border-[var(--primary-border)]/30"></div>
            </Link>
          ))}
        </div>

        {/* Footer CTA Section - Smaller */}
        <div className="mt-16">
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[var(--primary-dark)] via-[var(--primary)] to-[var(--primary-deep)] px-6 py-10 text-center shadow-xl sm:px-10">
            <div className="absolute inset-0 bg-[url('/pattern.svg')] opacity-5"></div>
            <div className="relative z-10">
              <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm">
                <BookOpen className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white sm:text-2xl">
                Stay Updated with Our Latest Content
              </h3>
              <p className="mx-auto mt-2 max-w-2xl text-xs text-white/90">
                Join thousands of professionals who benefit from our career
                insights, interview guides, and referral strategies.
              </p>
              <div className="mt-4 flex flex-wrap items-center justify-center gap-3">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-white/20 px-4 py-1.5 text-xs text-white backdrop-blur-sm">
                  <span className="relative flex h-1.5 w-1.5">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75"></span>
                    <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-green-400"></span>
                  </span>
                  New posts weekly
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-white/20 px-4 py-1.5 text-xs text-white backdrop-blur-sm">
                  <Award className="h-3 w-3" />
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