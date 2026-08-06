"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Bookmark,
  Calendar,
  User,
  ArrowRight,
  Clock,
  Hash,
  BookOpen,
  Sparkles,
} from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import axiosInstance from "@/lib/axiosInstance";

interface Blog {
  _id: string;
  title: string;
  content: string;
  coverImage: string;
  author: string;
  tags: string[];
  createdAt: string;
  likes?: number;
  saves?: number;
  views?: number;
}

// Helper function to get tag color
function getTagColor(tag: string): string {
  if (!tag) return "tag-default";

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

export default function SavedBlogsPage() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchSavedBlogs();
  }, []);

  const fetchSavedBlogs = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        setError("Please login to view saved blogs");
        setLoading(false);
        return;
      }

      const response = await axiosInstance.get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/blogs/saved`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      // Filter out blogs with null/undefined _id or invalid data
      const validBlogs = (response.data.data || []).filter(
        (blog: Blog) => blog && blog._id && blog._id !== null && blog._id !== undefined
      );

      setBlogs(validBlogs);
      setError(null);
    } catch (error: any) {
      console.error("Failed to fetch saved blogs", error);
      if (error.response?.status === 401) {
        setError("Please login to view saved blogs");
      } else {
        setError("Failed to load saved blogs. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const getReadTime = (content: string) => {
    const words = content?.replace(/<[^>]*>/g, "").split(" ").length || 0;
    return Math.ceil(words / 200) || 1;
  };

  const formatDate = (date: string) => {
    if (!date) return "Recent";
    try {
      return new Date(date).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
      });
    } catch {
      return "Recent";
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-[var(--background)] flex flex-col">
        <Navbar />
        <div className="flex-1 mt-8 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--primary)] mx-auto"></div>
            <p className="mt-4 text-[var(--text-muted)]">
              Loading saved blogs...
            </p>
          </div>
        </div>
        <Footer />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[var(--background)] flex flex-col">
      <Navbar />

      <div className="flex-1 mx-auto mt-8 max-w-7xl w-full px-4 py-8 sm:px-6 lg:px-8">
        {/* Header with gradient */}
        <div className="relative mb-8 overflow-hidden rounded-xl bg-gradient-to-r from-[var(--primary)]/10 via-[var(--primary-soft)] to-transparent p-4 sm:p-5">
          <div className="relative z-10 flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
            <div className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-xl bg-[var(--primary)] shadow-lg shadow-[var(--primary)]/20">
              <Bookmark className="h-5 w-5 sm:h-6 sm:w-6 text-white fill-current" />
            </div>
            <div className="flex-1">
              <h1 className="text-lg sm:text-xl font-bold text-[var(--text-primary)]">
                Saved Blogs
              </h1>
              <p className="text-xs text-[var(--text-muted)] mt-0.5">
                Your bookmarked articles to read later
              </p>
            </div>
            {!loading && blogs.length > 0 && (
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[var(--primary-soft)] border border-[var(--primary-border)]">
                <span className="text-xs font-medium text-[var(--primary)]">
                  {blogs.length} {blogs.length === 1 ? "Blog" : "Blogs"} Saved
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Error State */}
        {error && (
          <div className="rounded-2xl border border-[var(--danger-border)] bg-[var(--danger-soft)] p-8 text-center">
            <BookOpen className="mx-auto h-12 w-12 text-[var(--danger)]" />
            <h2 className="mt-4 text-lg font-semibold text-[var(--text-primary)]">
              {error}
            </h2>
            {error.includes("login") && (
              <Link
                href="/login"
                className="mt-4 inline-flex items-center gap-2 rounded-lg bg-[var(--primary)] px-6 py-2.5 text-sm font-medium text-white hover:bg-[var(--primary-dark)] transition-all hover:scale-105"
              >
                Login to Continue
                <ArrowRight className="h-4 w-4" />
              </Link>
            )}
          </div>
        )}

        {/* Empty State */}
        {!error && !loading && blogs.length === 0 && (
          <div className="rounded-2xl border-2 border-dashed border-[var(--border)] bg-[var(--card)] p-12 text-center">
            <div className="mx-auto h-16 w-16 rounded-full bg-[var(--background-soft)] flex items-center justify-center">
              <Bookmark className="h-8 w-8 text-[var(--text-muted)]" />
            </div>
            <h2 className="mt-4 text-xl font-semibold text-[var(--text-primary)]">
              No saved blogs yet
            </h2>
            <p className="mt-2 text-sm text-[var(--text-muted)] max-w-md mx-auto">
              Start saving blogs you want to read later. Click the bookmark icon
              on any blog post.
            </p>
            <Link
              href="/blogs"
              className="mt-6 inline-flex items-center gap-2 rounded-lg bg-[var(--primary)] px-6 py-2.5 text-sm font-medium text-white hover:bg-[var(--primary-dark)] transition-all hover:scale-105 shadow-lg shadow-[var(--primary)]/20"
            >
              Explore Blogs
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        )}

        {/* Blog Grid */}
        {!error && !loading && blogs.length > 0 && (
          <>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {blogs.map((blog, index) => (
                <Link
                  key={blog._id || index}
                  href={`/blogs/${blog._id}`}
                  className="group overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--card)] shadow-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-xl hover:border-[var(--primary-border)] animate-fadeIn"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  {/* Image */}
                  <div className="relative h-52 w-full overflow-hidden bg-[var(--background-soft)]">
                    <Image
                      src={blog.coverImage || "/blog-placeholder.jpg"}
                      alt={blog.title || "Blog"}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />

                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>

                    {/* Read Time Badge */}
                    <div className="absolute bottom-3 right-3 flex items-center gap-1.5 rounded-full bg-black/60 px-3 py-1.5 text-xs text-white backdrop-blur-md">
                      <Clock className="h-3.5 w-3.5" />
                      {getReadTime(blog.content)} min
                    </div>

                    {/* Saved Badge */}
                    <div className="absolute top-3 right-3 rounded-full bg-gradient-to-r from-[var(--primary)] to-[var(--primary-dark)] px-3 py-1 text-[10px] font-medium text-white shadow-lg">
                      ★ Saved
                    </div>

                    {/* Author Badge */}
                    <div className="absolute bottom-3 left-3 flex items-center gap-1.5 rounded-full bg-black/60 px-3 py-1.5 text-xs text-white backdrop-blur-md">
                      <User className="h-3 w-3" />
                      {blog.author || "Unknown"}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-5">
                    {/* Tags */}
                    {blog.tags && blog.tags.length > 0 && (
                      <div className="mb-3 flex flex-wrap gap-1.5">
                        {blog.tags.slice(0, 3).map((tag) => (
                          <span
                            key={tag}
                            className={`inline-flex items-center gap-0.5 rounded-full border px-2 py-0.5 text-[10px] font-medium ${getTagColor(tag)}`}
                          >
                            <Hash className="h-4.5 w-4.5" />
                            {tag}
                          </span>
                        ))}
                        {blog.tags.length > 3 && (
                          <span className="inline-flex items-center rounded-full border border-[var(--border)] bg-[var(--background-soft)] px-2 py-0.5 text-[10px] font-medium text-[var(--text-muted)]">
                            +{blog.tags.length - 3}
                          </span>
                        )}
                      </div>
                    )}

                    <h2 className="line-clamp-2 text-lg font-bold text-[var(--text-primary)] transition-colors group-hover:text-[var(--primary)]">
                      {blog.title || "Untitled Blog"}
                    </h2>

                    <p className="mt-2 line-clamp-2 text-sm text-[var(--text-muted)] leading-relaxed">
                      {blog.content?.replace(/<[^>]*>/g, "").substring(0, 120) || "No content available"}
                      {blog.content && blog.content.length > 120 ? "..." : ""}
                    </p>

                    <div className="mt-4 flex items-center justify-between border-t border-[var(--border)] pt-3 text-xs text-[var(--text-muted)]">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {formatDate(blog.createdAt)}
                      </span>
                      <span className="inline-flex items-center gap-1.5 text-xs font-medium text-[var(--primary)] transition-all duration-300 group-hover:gap-2.5">
                        Read More
                        <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" />
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {/* Stats Footer */}
            <div className="mt-10 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-[var(--border)] bg-[var(--card)] p-4 px-6 shadow-sm">
              <div className="flex items-center gap-6 text-sm text-[var(--text-muted)]">
                <span className="flex items-center gap-2">
                  <Bookmark className="h-4 w-4 text-[var(--primary)]" />
                  <span className="font-medium text-[var(--text-primary)]">
                    {blogs.length}
                  </span>
                  {blogs.length === 1 ? "blog saved" : "blogs saved"}
                </span>
                <span className="hidden sm:inline text-[var(--border)]">|</span>
                <span className="hidden sm:flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  Last updated:{" "}
                  {new Date().toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </span>
              </div>
              <Link
                href="/blogs"
                className="inline-flex items-center gap-2 text-sm font-medium text-[var(--primary)] hover:gap-3 transition-all duration-300"
              >
                Browse more blogs
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </>
        )}
      </div>

      <Footer />
    </main>
  );
}