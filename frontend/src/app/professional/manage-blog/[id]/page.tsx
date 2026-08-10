"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Blog } from "@/types/blog";
import { blogService } from "@/services/blogService";
import {
  ChevronLeft,
  Edit,
  Trash2,
  Calendar,
  Clock,
  BookOpen,
  Heart,
  Save,
  Tag,
  User,
  Eye,
  EyeOff,
  Loader2,
  ArrowLeft,
  Share2,
  Copy,
  Check,
  X,
  Plus,
  Image as ImageIcon,
  FileText,
} from "lucide-react";

export default function BlogDetailPage() {
  const params = useParams();
  const router = useRouter();
  const blogId = params?.id as string;

  const [blog, setBlog] = useState<Blog | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  // Edit mode state
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");
  const [editAuthor, setEditAuthor] = useState("");
  const [editTags, setEditTags] = useState<string[]>([]);
  const [editTagInput, setEditTagInput] = useState("");
  const [editIsPublished, setEditIsPublished] = useState(true);
  const [editImage, setEditImage] = useState<File | null>(null);
  const [editImagePreview, setEditImagePreview] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (blogId) {
      fetchBlogDetail();
    }
  }, [blogId]);

  const fetchBlogDetail = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await blogService.getBlog(blogId);
      if (result.success && result.data) {
        setBlog(result.data);
        setEditTitle(result.data.title);
        setEditContent(result.data.content);
        setEditAuthor(result.data.author || "");
        setEditTags(result.data.tags || []);
        setEditIsPublished(result.data.isPublished);
        setEditImagePreview(result.data.coverImage || "");
      } else {
        setError(result.message || "Blog not found");
      }
    } catch (error) {
      setError("Failed to load blog");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this blog?")) return;
    const result = await blogService.deleteBlog(blogId);
    if (result.success) {
      router.push("/professional/manage-blog");
    } else {
      alert(result.message || "Failed to delete blog");
    }
  };

  const handleCopyLink = async () => {
    try {
      const baseUrl = window.location.origin;
      const blogUrl = `${baseUrl}/blogs/${blogId}`;

      await navigator.clipboard.writeText(blogUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
      const baseUrl = window.location.origin;
      const blogUrl = `${baseUrl}/blogs/${blogId}`;
      const textArea = document.createElement("textarea");
      textArea.value = blogUrl;
      document.body.appendChild(textArea);
      textArea.select();
      try {
        document.execCommand("copy");
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (fallbackErr) {
        console.error("Fallback copy failed:", fallbackErr);
        alert(`Copy this URL: ${blogUrl}`);
      }
      document.body.removeChild(textArea);
    }
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    const formData = new FormData();
    formData.append("title", editTitle);
    formData.append("content", editContent);
    formData.append("author", editAuthor);
    formData.append("isPublished", String(editIsPublished));
    editTags.forEach((tag) => formData.append("tags[]", tag));
    if (editImage) formData.append("image", editImage);

    const result = await blogService.updateBlog(blogId, formData);
    setSubmitting(false);

    if (result.success && result.data) {
      setBlog(result.data);
      setIsEditing(false);
      alert("Blog updated successfully!");
    } else {
      alert(result.message || "Failed to update blog");
    }
  };

  const addEditTag = () => {
    if (editTagInput.trim() && !editTags.includes(editTagInput.trim())) {
      setEditTags([...editTags, editTagInput.trim()]);
      setEditTagInput("");
    }
  };

  const removeEditTag = (tag: string) => {
    setEditTags(editTags.filter((t) => t !== tag));
  };

  const handleEditImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert("Image size should be less than 5MB");
        return;
      }
      setEditImage(file);
      const reader = new FileReader();
      reader.onloadend = () => setEditImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getReadTime = (content: string) => {
    return Math.ceil(content.length / 500);
  };

  const cancelEdit = () => {
    setIsEditing(false);
    if (blog) {
      setEditTitle(blog.title);
      setEditContent(blog.content);
      setEditAuthor(blog.author || "");
      setEditTags(blog.tags || []);
      setEditIsPublished(blog.isPublished);
      setEditImagePreview(blog.coverImage || "");
      setEditImage(null);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-4 sm:p-6 md:p-8">
        <div className="flex justify-center items-center min-h-[400px] flex-col gap-3">
          <Loader2 className="animate-spin text-[var(--primary)]" size={40} />
          <span className="text-[var(--text-secondary)]">Loading blog post...</span>
        </div>
      </div>
    );
  }

  if (error || !blog) {
    return (
      <div className="max-w-4xl mx-auto p-4 sm:p-6 md:p-8">
        <div className="surface-card p-8 text-center rounded-xl border border-[var(--border)]">
          <div className="text-6xl mb-4">🔍</div>
          <h2 className="text-xl font-semibold text-[var(--text-primary)] mb-2">
            {error || "Blog not found"}
          </h2>
          <p className="text-[var(--text-muted)] mb-4">
            The blog post you&apos;re looking for doesn&apos;t exist or you
            don&apos;t have permission to view it.
          </p>
          <Link
            href="/professional/manage-blog"
            className="btn-primary inline-flex items-center gap-2"
          >
            <ArrowLeft size={18} /> Back to Blogs
          </Link>
        </div>
      </div>
    );
  }

  // Edit Mode
  if (isEditing) {
    return (
      <div className="max-w-4xl mx-auto p-4 sm:p-6 md:p-8">
        <button
          onClick={cancelEdit}
          className="inline-flex items-center gap-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors mb-4 text-sm"
        >
          <ChevronLeft size={18} /> Cancel Editing
        </button>

        <div className="surface-card p-4 sm:p-6 rounded-xl border border-[var(--border)] shadow-sm">
          <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-6 flex items-center gap-2">
            <Edit size={24} className="text-[var(--primary)]" /> Edit Blog
          </h2>

          <form onSubmit={handleEditSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Title */}
              <div>
                <label className="form-label text-xs flex items-center gap-1 text-[var(--text-secondary)]">
                  <FileText size={12} /> Title <span className="text-[var(--danger)]">*</span>
                </label>
                <input
                  type="text"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  required
                  className="input-field w-full text-sm"
                  style={{ minHeight: '2rem', padding: '0.3rem 0.6rem' }}
                  placeholder="Enter your blog title"
                />
              </div>

              {/* Author */}
              <div>
                <label className="form-label text-xs flex items-center gap-1 text-[var(--text-secondary)]">
                  <User size={12} /> Author <span className="text-[var(--danger)]">*</span>
                </label>
                <input
                  type="text"
                  value={editAuthor}
                  onChange={(e) => setEditAuthor(e.target.value)}
                  required
                  className="input-field w-full text-sm"
                  style={{ minHeight: '2rem', padding: '0.3rem 0.6rem' }}
                  placeholder="Enter author name"
                />
              </div>
            </div>

            {/* Content */}
            <div className="mt-3">
              <label className="form-label text-xs flex items-center gap-1 text-[var(--text-secondary)]">
                <BookOpen size={12} /> Content <span className="text-[var(--danger)]">*</span>
              </label>
              <textarea
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                required
                rows={8}
                className="textarea-field w-full text-sm"
                style={{ minHeight: '4rem', padding: '0.3rem 0.6rem' }}
                placeholder="Write your blog content here..."
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
              {/* Cover Image */}
              <div>
                <label className="form-label text-xs flex items-center gap-1 text-[var(--text-secondary)]">
                  <ImageIcon size={12} /> Cover Image
                </label>
                <div className="flex flex-wrap items-center gap-2">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleEditImageChange}
                    id="editCoverImage"
                    className="hidden"
                  />
                  <label
                    htmlFor="editCoverImage"
                    className="btn-secondary cursor-pointer flex items-center gap-1 text-xs"
                    style={{ padding: '0.3rem 0.8rem', fontSize: '0.7rem' }}
                  >
                    <ImageIcon size={12} />
                    {editImage ? "Change" : "Upload"}
                  </label>
                  <span className="text-[var(--text-muted)] text-[10px]">PNG, JPG up to 5MB</span>
                </div>
                {editImagePreview && (
                  <div className="relative mt-2">
                    <img
                      src={editImagePreview}
                      alt="Preview"
                      className="rounded-lg max-h-32 w-auto object-cover border border-[var(--border)]"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setEditImage(null);
                        setEditImagePreview("");
                      }}
                      className="absolute top-1 right-1 bg-black/60 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-[var(--danger)] transition-colors text-xs"
                    >
                      <X size={14} />
                    </button>
                  </div>
                )}
              </div>

              {/* Tags */}
              <div>
                <label className="form-label text-xs flex items-center gap-1 text-[var(--text-secondary)]">
                  <Tag size={12} /> Tags
                </label>
                <div className="flex gap-1">
                  <input
                    type="text"
                    value={editTagInput}
                    onChange={(e) => setEditTagInput(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addEditTag())}
                    className="input-field flex-1 text-sm"
                    style={{ minHeight: '2rem', padding: '0.3rem 0.6rem' }}
                    placeholder="Add tag"
                  />
                  <button
                    type="button"
                    onClick={addEditTag}
                    className="btn-secondary flex items-center gap-1 text-xs"
                    style={{ padding: '0.3rem 0.8rem' }}
                  >
                    <Plus size={12} /> Add
                  </button>
                </div>
                <div className="flex flex-wrap gap-1 mt-1">
                  {editTags.map((tag) => (
                    <span key={tag} className="badge badge-primary text-xs flex items-center gap-1" style={{ padding: '0.1rem 0.5rem' }}>
                      #{tag}
                      <button
                        type="button"
                        onClick={() => removeEditTag(tag)}
                        className="text-[var(--primary)]/70 hover:text-[var(--danger)] transition-colors"
                      >
                        <X size={10} />
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Publish Status */}
            <div className="mt-3">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={editIsPublished}
                  onChange={(e) => setEditIsPublished(e.target.checked)}
                  className="w-3.5 h-3.5 accent-[var(--primary)] cursor-pointer"
                />
                <span className="text-[var(--text-secondary)] text-xs font-medium">
                  Publish immediately
                </span>
              </label>
            </div>

            {/* Form Buttons */}
            <div className="flex flex-col sm:flex-row gap-2 mt-3 pt-3 border-t border-[var(--border)]">
              <button
                type="button"
                onClick={cancelEdit}
                className="btn-secondary w-full sm:w-auto flex items-center justify-center gap-1 text-xs"
                style={{ padding: '0.3rem 1rem', fontSize: '0.75rem' }}
              >
                <X size={12} /> Cancel
              </button>
              <button
                type="submit"
                className="btn-primary flex-1 flex items-center justify-center gap-1 text-xs"
                disabled={submitting}
                style={{ fontSize: '0.75rem', padding: '0.3rem 0.5rem' }}
              >
                {submitting ? (
                  <Loader2 size={14} className="animate-spin" />
                ) : (
                  <>
                    <Save size={14} /> Update Blog
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  // View Mode
  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 md:p-8">
      {/* Back Button */}
      <Link
        href="/professional/manage-blog"
        className="inline-flex items-center gap-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors mb-4 text-sm"
      >
        <ChevronLeft size={18} /> Back to Blogs
      </Link>

      {/* Blog Post */}
      <article className="surface-card overflow-hidden rounded-xl border border-[var(--border)] shadow-sm">
        {/* Cover Image with Fallback */}
        <div className="relative w-full h-56 sm:h-64 md:h-72 bg-[var(--background-soft)]">
          {blog.coverImage ? (
            <img
              src={blog.coverImage}
              alt={blog.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-[var(--primary-soft)] to-[var(--background-soft)]">
              <div className="relative h-20 w-20">
                <Image
                  src="/logo.png"
                  alt="Referd Logo"
                  fill
                  className="object-contain"
                />
              </div>
            </div>
          )}
        </div>

        <div className="p-4 sm:p-6 md:p-8">
          {/* Title and Status */}
          <div className="flex flex-wrap justify-between items-start gap-3 mb-4">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[var(--text-primary)] leading-tight flex items-start gap-3">
              <BookOpen size={28} className="text-[var(--primary)] shrink-0 mt-1" />
              {blog.title}
            </h1>
            <span
              className={`badge ${blog.isPublished ? "badge-success" : "badge-warning"} shrink-0 flex items-center gap-1`}
            >
              {blog.isPublished ? <Eye size={14} /> : <EyeOff size={14} />}
              {blog.isPublished ? "Published" : "Draft"}
            </span>
          </div>

          {/* Author Info */}
          <div className="flex flex-wrap items-center gap-3 mb-4 pb-4 border-b border-[var(--border)]">
            <div className="flex items-center gap-3">
              {blog.userId && typeof blog.userId === "object" && (
                <>
                  {blog.userId.profileImage ? (
                    <img
                      src={blog.userId.profileImage}
                      alt={blog.userId.name}
                      className="w-10 h-10 rounded-full object-cover border border-[var(--border)]"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-[var(--primary-soft)] flex items-center justify-center text-[var(--primary)] font-semibold">
                      {blog.userId.name?.[0]?.toUpperCase() || "U"}
                    </div>
                  )}
                  <div>
                    <div className="font-semibold text-[var(--text-primary)] text-sm flex items-center gap-1.5">
                      <User size={14} /> {blog.userId.name}
                    </div>
                    <div className="text-[var(--text-muted)] text-xs">
                      {blog.userId.email}
                    </div>
                  </div>
                </>
              )}
              {blog.author && !blog.userId && (
                <div>
                  <div className="font-semibold text-[var(--text-primary)] text-sm flex items-center gap-1.5">
                    <User size={14} /> {blog.author}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Stats & Meta */}
          <div className="flex flex-wrap items-center justify-between gap-4 mb-4 p-3 bg-[var(--background-soft)] rounded-lg border border-[var(--border)]">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Heart size={20} className="text-[var(--danger)]" fill="currentColor" />
                <span className="text-[var(--text-secondary)] font-medium">
                  {blog.likes || 0} likes
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Save size={20} className="text-[var(--primary)]" />
                <span className="text-[var(--text-secondary)] font-medium">
                  {blog.saves || 0} saves
                </span>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 text-sm text-[var(--text-muted)]">
              <span className="flex items-center gap-1.5">
                <Calendar size={16} /> {formatDate(blog.createdAt)}
              </span>
              <span className="flex items-center gap-1.5">
                <Clock size={16} /> {formatTime(blog.createdAt)}
              </span>
              <span className="flex items-center gap-1.5">
                <BookOpen size={16} /> {getReadTime(blog.content)} min read
              </span>
            </div>
          </div>

          {/* Tags */}
          {blog.tags && blog.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-6">
              {blog.tags.map((tag) => (
                <span
                  key={tag}
                  className="badge badge-primary flex items-center gap-1"
                >
                  <Tag size={12} /> #{tag}
                </span>
              ))}
            </div>
          )}

          {/* Content */}
          <div className="prose prose-sm sm:prose-base max-w-none text-[var(--text-primary)]">
            <div className="whitespace-pre-wrap leading-relaxed text-[var(--text-secondary)]">
              {blog.content}
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-wrap gap-3 mt-6 pt-6 border-t border-[var(--border)]">
            <button
              onClick={() => setIsEditing(true)}
              className="btn-primary flex items-center gap-2 text-xs"
              style={{ padding: '0.3rem 0.8rem', fontSize: '0.75rem' }}
            >
              <Edit size={14} /> Edit Blog
            </button>
            <button
              onClick={handleDelete}
              className="btn-danger flex items-center gap-2 text-xs"
              style={{ padding: '0.3rem 0.8rem', fontSize: '0.75rem' }}
            >
              <Trash2 size={14} /> Delete Blog
            </button>
            <button
              onClick={handleCopyLink}
              className="btn-secondary flex items-center gap-2 text-xs"
              style={{ padding: '0.3rem 0.8rem', fontSize: '0.75rem' }}
            >
              {copied ? (
                <>
                  <Check size={14} className="text-[var(--success)]" /> Copied!
                </>
              ) : (
                <>
                  <Copy size={14} /> Copy Link
                </>
              )}
            </button>
            <button
              onClick={() => {
                if (navigator.share) {
                  navigator.share({
                    title: blog.title,
                    text: blog.content.substring(0, 200) + "...",
                    url: `https://referd.in/blogs/${blog._id}`,
                  });
                }
              }}
              className="btn-secondary flex items-center gap-2 text-xs"
              style={{ padding: '0.3rem 0.8rem', fontSize: '0.75rem' }}
            >
              <Share2 size={14} /> Share
            </button>
          </div>
        </div>
      </article>

      {/* Bottom Navigation */}
      <div className="mt-6 flex flex-wrap justify-between items-center gap-4">
        <Link
          href="/professional/manage-blog"
          className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors text-sm flex items-center gap-2"
        >
          <ArrowLeft size={16} /> Back to Manage Blogs
        </Link>
        <div className="text-[var(--text-muted)] text-xs flex items-center gap-1">
          <Tag size={12} /> ID: {blog._id}
        </div>
      </div>
    </div>
  );
}