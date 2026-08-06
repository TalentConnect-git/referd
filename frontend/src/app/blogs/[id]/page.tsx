"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  Calendar,
  User,
  Clock,
  ArrowLeft,
  Share2,
  Bookmark,
  Heart,
  Hash,
  Loader2,
} from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import axiosInstance from "@/lib/axiosInstance";
import Footer from "@/components/layout/Footer";

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
  likes?: number;
  saves?: number;
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

export default function BlogDetailPage() {
  const params = useParams();
  const router = useRouter();
  const blogId = params?.id as string; // 👈 Getting ID from URL

  const [blog, setBlog] = useState<Blog | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  // Reaction states
  const [isLiked, setIsLiked] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [savesCount, setSavesCount] = useState(0);
  const [isLiking, setIsLiking] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (blogId) {
      fetchBlog();
    }
  }, [blogId]);

  const fetchBlog = async () => {
    try {
      setLoading(true);

      const response = await axiosInstance.get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/blogs/${blogId}`,
      );

      const blogData = response.data.data;

      console.log(blogData);

      if (blogData) {
        setBlog(blogData);
        setLikesCount(blogData.likes || 0);
        setSavesCount(blogData.saves || 0);

        // Fetch user reaction if logged in
        const token = localStorage.getItem("token");
        if (token) {
          try {
            const reactionRes = await axiosInstance.get(
              `${process.env.NEXT_PUBLIC_API_URL}/api/blogs/${blogId}/reaction`,
              { headers: { Authorization: `Bearer ${token}` } },
            );
            setIsLiked(reactionRes.data.liked || false);
            setIsSaved(reactionRes.data.saved || false);
            setLikesCount(reactionRes.data.likes || 0);
            setSavesCount(reactionRes.data.saves || 0);
          } catch (err) {
            console.error("Error fetching reaction:", err);
          }
        }
      } else {
        setError(true);
      }
    } catch (err) {
      console.error("Error fetching blog:", err);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async () => {
    if (!blog) return;

    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }

    setIsLiking(true);
    try {
      const response = await axiosInstance.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/blogs/${blog._id}/like`,
        {},
        { headers: { Authorization: `Bearer ${token}` } },
      );

      setIsLiked(response.data.liked);
      setLikesCount(response.data.likes);
    } catch (err) {
      console.error("Error toggling like:", err);
    } finally {
      setIsLiking(false);
    }
  };

  const handleSave = async () => {
    if (!blog) return;

    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }

    setIsSaving(true);
    try {
      const response = await axiosInstance.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/blogs/${blog._id}/save`,
        {},
        { headers: { Authorization: `Bearer ${token}` } },
      );

      setIsSaved(response.data.saved);
      setSavesCount(response.data.saves);
    } catch (err) {
      console.error("Error toggling save:", err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleShare = async () => {
    const url = window.location.href;
    try {
      if (navigator.share) {
        await navigator.share({
          title: blog?.title || "Referd Blog",
          text: `Check out this blog: ${blog?.title}`,
          url: url,
        });
      } else {
        await navigator.clipboard.writeText(url);
        alert("Link copied to clipboard!");
      }
    } catch (err) {
      console.error("Error sharing:", err);
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-[var(--background)]">
        <Navbar />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--primary)] mx-auto"></div>
            <p className="mt-4 text-[var(--text-muted)]">Loading blog...</p>
          </div>
        </div>
      </main>
    );
  }

  if (error || !blog) {
    return (
      <main className="min-h-screen bg-[var(--background)]">
        <Navbar />
        <div className="flex items-center mt-8 justify-center min-h-[60vh] px-4">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-[var(--text-primary)]">
              404
            </h1>
            <p className="mt-2 text-[var(--text-muted)]">Blog not found</p>
            <Link
              href="/blogs"
              className="mt-4 inline-flex items-center gap-2 text-[var(--primary)] hover:underline"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Blogs
            </Link>
          </div>
        </div>
      </main>
    );
  }

  const wordCount = blog.content
    ? blog.content.replace(/<[^>]+>/g, "").split(/\s+/).length
    : 0;
  const readTime = Math.ceil(wordCount / 200) || 1;

  return (
    <main className="min-h-screen bg-[var(--background)]">
      <Navbar />

      <div className="mx-auto mt-8 max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Back Button */}
        <Link
          href="/blogs"
          className="group mb-6 inline-flex items-center gap-2 text-sm font-medium text-[var(--text-muted)] transition-colors hover:text-[var(--text-primary)]"
        >
          <ArrowLeft className="h-4 w-4 transition-transform duration-200 group-hover:-translate-x-1" />
          Back to Blogs
        </Link>

        {/* Cover Image */}
        <div className="relative mb-8 overflow-hidden rounded-2xl bg-[var(--background-soft)] shadow-lg">
          <Image
            src={blog.coverImage || "/blog-placeholder.jpg"}
            alt={blog.title || "Blog"}
            width={1200}
            height={700}
            className="h-auto w-full object-cover transition-transform duration-500 hover:scale-[1.02]"
            priority
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
          />

          {/* Reading Time Badge */}
          <div className="absolute bottom-4 right-4 flex items-center gap-1.5 rounded-full bg-black/60 px-4 py-2 text-xs font-medium text-white backdrop-blur-sm sm:bottom-6 sm:right-6">
            <Clock className="h-4 w-4 shrink-0" />
            <span>{readTime} min read</span>
          </div>
        </div>

        {/* Tags with Hashtags - Individual boxes */}
        {blog.tags && blog.tags.length > 0 && (
          <div className="mb-4 flex flex-wrap gap-2">
            {blog.tags.map((tag) => (
              <span
                key={tag}
                className={`inline-flex items-center gap-1 rounded-full border px-3 py-1 text-xs font-medium ${getTagColor(tag)}`}
              >
                <Hash className="h-3 w-3" />
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Title */}
        <h1 className="text-3xl font-bold leading-tight tracking-tight text-[var(--text-primary)] sm:text-4xl md:text-5xl">
          {blog.title}
        </h1>

        {/* Author + Date + Actions */}
        <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-y border-[var(--border)] py-4 text-sm text-[var(--text-muted)]">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4" />
              <span className="font-medium text-[var(--text-secondary)]">
                {blog.author || "Referd"}
              </span>
            </div>

            <span className="hidden sm:inline">•</span>

            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span>
                {blog.createdAt
                  ? new Date(blog.createdAt).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })
                  : "Recent"}
              </span>
            </div>
          </div>

          {/* Action Buttons with Like & Save */}
          <div className="flex items-center gap-2">
            {/* Share Button */}
            <button
              onClick={handleShare}
              className="rounded-lg border border-[var(--border)] p-2 text-[var(--text-muted)] transition-colors hover:border-[var(--primary-border)] hover:bg-[var(--primary-soft)] hover:text-[var(--primary)]"
              aria-label="Share"
            >
              <Share2 className="h-4 w-4" />
            </button>

            {/* Save Button */}
            <button
              onClick={handleSave}
              disabled={isSaving}
              className={`rounded-lg border p-2 transition-colors ${
                isSaved
                  ? "border-[var(--primary-border)] bg-[var(--primary-soft)] text-[var(--primary)]"
                  : "border-[var(--border)] text-[var(--text-muted)] hover:border-[var(--primary-border)] hover:bg-[var(--primary-soft)] hover:text-[var(--primary)]"
              }`}
              aria-label={isSaved ? "Unsave" : "Save"}
            >
              {isSaving ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Bookmark
                  className={`h-4 w-4 ${isSaved ? "fill-current" : ""}`}
                />
              )}
            </button>

            {/* Like Button */}
            <button
              onClick={handleLike}
              disabled={isLiking}
              className={`rounded-lg border p-2 transition-colors ${
                isLiked
                  ? "border-[var(--danger-border)] bg-[var(--danger-soft)] text-[var(--danger)]"
                  : "border-[var(--border)] text-[var(--text-muted)] hover:border-[var(--danger-border)] hover:bg-[var(--danger-soft)] hover:text-[var(--danger)]"
              }`}
              aria-label={isLiked ? "Unlike" : "Like"}
            >
              {isLiking ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : isLiked ? (
                <Heart className="h-4 w-4 fill-current" />
              ) : (
                <Heart className="h-4 w-4" />
              )}
            </button>
          </div>
        </div>

        {/* Like & Save Counts */}
        <div className="mt-3 flex items-center gap-6 text-sm text-[var(--text-muted)]">
          <span className="flex items-center gap-1.5">
            <Heart
              className={`h-4 w-4 ${isLiked ? "fill-[var(--danger)] text-[var(--danger)]" : ""}`}
            />
            {likesCount} {likesCount === 1 ? "like" : "likes"}
          </span>
          <span className="flex items-center gap-1.5">
            <Bookmark
              className={`h-4 w-4 ${isSaved ? "fill-[var(--primary)] text-[var(--primary)]" : ""}`}
            />
            {savesCount} {savesCount === 1 ? "save" : "saves"}
          </span>
        </div>

        {/* Blog Content */}
        <article
          className="prose prose-lg max-w-none mt-8 text-[var(--text-secondary)] prose-headings:text-[var(--text-primary)] prose-strong:text-[var(--text-primary)]"
          dangerouslySetInnerHTML={{
            __html: blog.content || "<p>No content available</p>",
          }}
        />

        {/* Divider */}
        <div className="my-12 border-t border-[var(--border)]" />

        {/* Author Section */}
        <div className="surface-card rounded-xl border border-[var(--border)] bg-[var(--card)] px-5 py-4 shadow-sm">
          <div className="flex items-center gap-4">
            {/* Avatar */}
            <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-[var(--primary-soft)] text-lg font-bold text-[var(--primary)]">
              {blog.author ? blog.author.charAt(0).toUpperCase() : "R"}
            </div>

            {/* Author Info */}
            <div className="flex flex-col">
              <h3 className="text-base font-semibold text-[var(--text-primary)]">
                {blog.author || "Referd Team"}
              </h3>

              <p className="mt-1 text-xs text-[var(--text-muted)]">
                Published on{" "}
                {blog.createdAt
                  ? new Date(blog.createdAt).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })
                  : "Recent"}
              </p>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </main>
  );
}
