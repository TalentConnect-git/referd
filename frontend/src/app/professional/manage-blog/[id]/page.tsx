
"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
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
        // Set edit form values
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
      
      const baseUrl = window.location.origin; // Gets http://localhost:3000 or https://yourdomain.
      const blogUrl = `${baseUrl}/blog/${blogId}`;

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
          <Loader2 className="animate-spin text-primary" size={40} />
          <span className="text-secondary">Loading blog post...</span>
        </div>
      </div>
    );
  }

  if (error || !blog) {
    return (
      <div className="max-w-4xl mx-auto p-4 sm:p-6 md:p-8">
        <div className="card p-8 text-center">
          <div className="text-6xl mb-4">🔍</div>
          <h2 className="text-xl font-semibold text-primary mb-2">
            {error || "Blog not found"}
          </h2>
          <p className="text-muted mb-4">
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
          className="inline-flex items-center gap-2 text-secondary hover:text-primary transition-colors mb-4 text-sm"
        >
          <ChevronLeft size={18} /> Cancel Editing
        </button>

        <div className="card p-4 sm:p-6">
          <h2 className="text-2xl font-bold text-primary mb-6 flex items-center gap-2">
            <Edit size={24} /> Edit Blog
          </h2>

          <form onSubmit={handleEditSubmit}>
            {/* Title */}
            <div className="mb-4">
              <label className="form-label flex items-center gap-2">
                <FileText size={16} /> Title{" "}
                <span className="text-danger">*</span>
              </label>
              <input
                type="text"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                required
                className="input-field"
                placeholder="Enter your blog title"
              />
            </div>

            {/* Author */}
            <div className="mb-4">
              <label className="form-label flex items-center gap-2">
                <User size={16} /> Author <span className="text-danger">*</span>
              </label>
              <input
                type="text"
                value={editAuthor}
                onChange={(e) => setEditAuthor(e.target.value)}
                required
                className="input-field"
                placeholder="Enter author name"
              />
            </div>

            {/* Content */}
            <div className="mb-4">
              <label className="form-label flex items-center gap-2">
                <BookOpen size={16} /> Content{" "}
                <span className="text-danger">*</span>
              </label>
              <textarea
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                required
                rows={10}
                className="textarea-field"
                placeholder="Write your blog content here..."
              />
            </div>

            {/* Cover Image */}
            <div className="mb-4">
              <label className="form-label flex items-center gap-2">
                <ImageIcon size={16} /> Cover Image
              </label>
              <div className="flex flex-wrap items-center gap-3">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleEditImageChange}
                  id="editCoverImage"
                  className="hidden"
                />
                <label
                  htmlFor="editCoverImage"
                  className="btn-secondary cursor-pointer flex items-center gap-2"
                  style={{ fontSize: "0.8125rem" }}
                >
                  <ImageIcon size={16} />
                  {editImage ? "Change Image" : "Upload Image"}
                </label>
                <span className="text-muted text-xs">PNG, JPG up to 5MB</span>
              </div>
              {editImagePreview && (
                <div className="relative mt-3">
                  <img
                    src={editImagePreview}
                    alt="Preview"
                    className="rounded-lg max-h-64 w-auto object-cover border border-border"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setEditImage(null);
                      setEditImagePreview("");
                    }}
                    className="absolute top-2 right-2 bg-overlay text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-danger transition-colors"
                  >
                    <X size={18} />
                  </button>
                </div>
              )}
            </div>

            {/* Tags */}
            <div className="mb-4">
              <label className="form-label flex items-center gap-2">
                <Tag size={16} /> Tags
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={editTagInput}
                  onChange={(e) => setEditTagInput(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && addEditTag()}
                  className="input-field flex-1"
                  placeholder="Add tag and press Enter"
                />
                <button
                  type="button"
                  onClick={addEditTag}
                  className="btn-secondary flex items-center gap-1"
                  style={{ fontSize: "0.8125rem" }}
                >
                  <Plus size={16} /> Add
                </button>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {editTags.map((tag) => (
                  <span
                    key={tag}
                    className="badge badge-primary flex items-center gap-1"
                  >
                    #{tag}
                    <button
                      type="button"
                      onClick={() => removeEditTag(tag)}
                      className="text-primary/70 hover:text-danger transition-colors"
                    >
                      <X size={14} />
                    </button>
                  </span>
                ))}
              </div>
            </div>

            {/* Publish Status */}
            <div className="mb-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={editIsPublished}
                  onChange={(e) => setEditIsPublished(e.target.checked)}
                  className="w-4 h-4 accent-primary cursor-pointer"
                />
                <span className="text-secondary text-sm font-medium">
                  Publish immediately
                </span>
              </label>
            </div>

            {/* Form Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-border">
              <button
                type="button"
                onClick={cancelEdit}
                className="btn-secondary w-full sm:w-auto flex items-center justify-center gap-2"
              >
                <X size={16} /> Cancel
              </button>
              <button
                type="submit"
                className="btn-primary flex-1 flex items-center justify-center gap-2"
                disabled={submitting}
                style={{ fontSize: "0.875rem" }}
              >
                {submitting ? (
                  <Loader2 size={18} className="animate-spin" />
                ) : (
                  <>
                    <Save size={18} /> Update Blog
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
        className="inline-flex items-center gap-2 text-secondary hover:text-primary transition-colors mb-4 text-sm"
      >
        <ChevronLeft size={18} /> Back to Blogs
      </Link>

      {/* Blog Post */}
      <article className="card overflow-hidden">
        {/* Cover Image */}
        {blog.coverImage && (
          <div className="relative w-full h-64 sm:h-80 md:h-96">
            <img
              src={blog.coverImage}
              alt={blog.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        <div className="p-4 sm:p-6 md:p-8">
          {/* Title and Status */}
          <div className="flex flex-wrap justify-between items-start gap-3 mb-4">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-primary leading-tight flex items-start gap-3">
              <BookOpen size={28} className="text-primary shrink-0 mt-1" />
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
          <div className="flex flex-wrap items-center gap-3 mb-4 pb-4 border-b border-border">
            <div className="flex items-center gap-3">
              {blog.userId && typeof blog.userId === "object" && (
                <>
                  {blog.userId.profileImage ? (
                    <img
                      src={blog.userId.profileImage}
                      alt={blog.userId.name}
                      className="w-10 h-10 rounded-full object-cover border border-border"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-primary-soft flex items-center justify-center text-primary font-semibold">
                      {blog.userId.name?.[0]?.toUpperCase() || "U"}
                    </div>
                  )}
                  <div>
                    <div className="font-semibold text-primary text-sm flex items-center gap-1.5">
                      <User size={14} /> {blog.userId.name}
                    </div>
                    <div className="text-muted text-xs">
                      {blog.userId.email}
                    </div>
                  </div>
                </>
              )}
              {blog.author && !blog.userId && (
                <div>
                  <div className="font-semibold text-primary text-sm flex items-center gap-1.5">
                    <User size={14} /> {blog.author}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Stats & Meta - MOVED TO TOP */}
          <div className="flex flex-wrap items-center justify-between gap-4 mb-4 p-3 bg-background-soft rounded-lg border border-border">
            {/* Likes & Saves */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Heart size={20} className="text-danger" fill="currentColor" />
                <span className="text-secondary font-medium">
                  {blog.likes || 0} likes
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Save size={20} className="text-primary" />
                <span className="text-secondary font-medium">
                  {blog.saves || 0} saves
                </span>
              </div>
            </div>

            {/* Meta Info */}
            <div className="flex flex-wrap items-center gap-3 text-sm text-muted">
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
          <div className="prose prose-sm sm:prose-base max-w-none text-primary">
            <div className="whitespace-pre-wrap leading-relaxed text-secondary">
              {blog.content}
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-wrap gap-3 mt-6 pt-6 border-t border-border">
            <button
              onClick={() => setIsEditing(true)}
              className="btn-primary flex items-center gap-2"
            >
              <Edit size={18} /> Edit Blog
            </button>
            <button
              onClick={handleDelete}
              className="btn-danger flex items-center gap-2"
            >
              <Trash2 size={18} /> Delete Blog
            </button>
            <button
              onClick={handleCopyLink}
              className="btn-secondary flex items-center gap-2"
            >
              {copied ? (
                <>
                  <Check size={18} className="text-success" /> Copied!
                </>
              ) : (
                <>
                  <Copy size={18} /> Copy Link
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
              className="btn-secondary flex items-center gap-2"
            >
              <Share2 size={18} /> Share
            </button>
          </div>
        </div>
      </article>

      {/* Bottom Navigation */}
      <div className="mt-6 flex flex-wrap justify-between items-center gap-4">
        <Link
          href="/professional/manage-blog"
          className="text-secondary hover:text-primary transition-colors text-sm flex items-center gap-2"
        >
          <ArrowLeft size={16} /> Back to Manage Blogs
        </Link>
        <div className="text-muted text-xs flex items-center gap-1">
          <Tag size={12} /> ID: {blog._id}
        </div>
      </div>
    </div>
  );
}
