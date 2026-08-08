// app/professional/manage-blog/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Blog } from '@/types/blog';
import { blogService } from '@/services/blogService';
import {
  Plus,
  X,
  Edit,
  Trash2,
  Eye,
  Calendar,
  Clock,
  BookOpen,
  Heart,
  Save,
  Tag,
  User,
  Image as ImageIcon,
  FileText,
  Loader2,
} from 'lucide-react';

export default function ManageBlog() {
  const router = useRouter();
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingBlog, setEditingBlog] = useState<Blog | null>(null);

  // Form state
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [author, setAuthor] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [isPublished, setIsPublished] = useState(true);
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    setLoading(true);
    const result = await blogService.getUserBlogs();
    if (result.success && result.data) {
      setBlogs(result.data);
    }
    setLoading(false);
  };

  const resetForm = () => {
    setTitle('');
    setContent('');
    setAuthor('');
    setTags([]);
    setTagInput('');
    setIsPublished(true);
    setImage(null);
    setImagePreview('');
    setEditingBlog(null);
    setShowForm(false);
  };

  const handleEdit = (blog: Blog) => {
    setEditingBlog(blog);
    setTitle(blog.title);
    setContent(blog.content);
    setAuthor(blog.author || '');
    setTags(blog.tags || []);
    setIsPublished(blog.isPublished);
    setImagePreview(blog.coverImage || '');
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    const formData = new FormData();
    formData.append('title', title);
    formData.append('content', content);
    formData.append('author', author);
    formData.append('isPublished', String(isPublished));
    tags.forEach(tag => formData.append('tags[]', tag));
    if (image) formData.append('image', image);

    let result;
    if (editingBlog) {
      result = await blogService.updateBlog(editingBlog._id, formData);
    } else {
      result = await blogService.createBlog(formData);
    }

    setSubmitting(false);

    if (result.success) {
      await fetchBlogs();
      resetForm();
      alert(editingBlog ? 'Blog updated successfully!' : 'Blog created successfully!');
    } else {
      alert(result.message || 'Failed to save blog');
    }
  };

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm('Are you sure you want to delete this blog?')) return;
    const result = await blogService.deleteBlog(id);
    if (result.success) {
      await fetchBlogs();
      alert('Blog deleted successfully!');
    } else {
      alert(result.message || 'Failed to delete blog');
    }
  };

  const addTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput('');
    }
  };

  const removeTag = (tag: string) => {
    setTags(tags.filter(t => t !== tag));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert('Image size should be less than 5MB');
        return;
      }
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getReadTime = (content: string) => {
    return Math.ceil(content.length / 500);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <Loader2 className="animate-spin text-primary" size={32} />
        <span className="ml-3 text-secondary">Loading your blogs...</span>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-primary flex items-center gap-2">
            <FileText size={24} className="text-primary" />
            Manage Blogs
          </h1>
          <p className="text-muted text-sm">Create and manage your blog posts</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className={`btn-primary flex items-center gap-2 ${showForm ? 'bg-danger hover:bg-danger/90' : ''}`}
          style={{ padding: '0.4rem 1rem', fontSize: '0.8rem', minHeight: '2.2rem' }}
        >
          {showForm ? (
            <>
              <X size={16} /> Cancel
            </>
          ) : (
            <>
              <Plus size={16} /> Create Blog
            </>
          )}
        </button>
      </div>

      {/* Statistics - Smaller */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-6">
        <div className="card p-2 text-center">
          <div className="text-lg font-bold text-primary">{blogs.length}</div>
          <div className="text-xs text-muted">Total</div>
        </div>
        <div className="card p-2 text-center">
          <div className="text-lg font-bold text-success">{blogs.filter(b => b.isPublished).length}</div>
          <div className="text-xs text-muted">Published</div>
        </div>
        <div className="card p-2 text-center">
          <div className="text-lg font-bold text-warning">{blogs.filter(b => !b.isPublished).length}</div>
          <div className="text-xs text-muted">Drafts</div>
        </div>
        <div className="card p-2 text-center">
          <div className="text-lg font-bold text-primary">
            {blogs.reduce((acc, b) => acc + (b.likes || 0), 0)}
          </div>
          <div className="text-xs text-muted">Likes</div>
        </div>
      </div>

      {/* Blog Form - Compact */}
      {showForm && (
        <form onSubmit={handleSubmit} className="card p-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {/* Title */}
            <div>
              <label className="form-label text-xs flex items-center gap-1">
                <FileText size={12} /> Title <span className="text-danger">*</span>
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="input-field text-sm"
                style={{ minHeight: '2rem', padding: '0.3rem 0.6rem' }}
                placeholder="Enter title"
              />
            </div>

            {/* Author */}
            <div>
              <label className="form-label text-xs flex items-center gap-1">
                <User size={12} /> Author <span className="text-danger">*</span>
              </label>
              <input
                type="text"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                required
                className="input-field text-sm"
                style={{ minHeight: '2rem', padding: '0.3rem 0.6rem' }}
                placeholder="Enter author"
              />
            </div>
          </div>

          {/* Content */}
          <div className="mt-3">
            <label className="form-label text-xs flex items-center gap-1">
              <BookOpen size={12} /> Content <span className="text-danger">*</span>
            </label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
              rows={4}
              className="textarea-field text-sm"
              style={{ minHeight: '4rem', padding: '0.3rem 0.6rem' }}
              placeholder="Write your blog content..."
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
            {/* Cover Image */}
            <div>
              <label className="form-label text-xs flex items-center gap-1">
                <ImageIcon size={12} /> Cover Image
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  id="coverImage"
                  className="hidden"
                />
                <label
                  htmlFor="coverImage"
                  className="btn-secondary cursor-pointer flex items-center gap-1 text-xs"
                  style={{ padding: '0.3rem 0.8rem', fontSize: '0.7rem' }}
                >
                  <ImageIcon size={12} />
                  {image ? 'Change' : 'Upload'}
                </label>
                <span className="text-muted text-[10px]">PNG, JPG up to 5MB</span>
              </div>
              {imagePreview && (
                <div className="relative mt-2">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="rounded-lg max-h-32 w-auto object-cover border border-border"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setImage(null);
                      setImagePreview('');
                    }}
                    className="absolute top-1 right-1 bg-overlay text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-danger transition-colors text-xs"
                  >
                    <X size={14} />
                  </button>
                </div>
              )}
            </div>

            {/* Tags */}
            <div>
              <label className="form-label text-xs flex items-center gap-1">
                <Tag size={12} /> Tags
              </label>
              <div className="flex gap-1">
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && addTag()}
                  className="input-field flex-1 text-sm"
                  style={{ minHeight: '2rem', padding: '0.3rem 0.6rem' }}
                  placeholder="Add tag"
                />
                <button
                  type="button"
                  onClick={addTag}
                  className="btn-secondary flex items-center gap-1 text-xs"
                  style={{ padding: '0.3rem 0.8rem' }}
                >
                  <Plus size={12} /> Add
                </button>
              </div>
              <div className="flex flex-wrap gap-1 mt-1">
                {tags.map(tag => (
                  <span key={tag} className="badge badge-primary text-xs flex items-center gap-1" style={{ padding: '0.1rem 0.5rem' }}>
                    #{tag}
                    <button
                      type="button"
                      onClick={() => removeTag(tag)}
                      className="text-primary/70 hover:text-danger transition-colors"
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
                checked={isPublished}
                onChange={(e) => setIsPublished(e.target.checked)}
                className="w-3.5 h-3.5 accent-primary cursor-pointer"
              />
              <span className="text-secondary text-xs font-medium">Publish immediately</span>
            </label>
          </div>

          {/* Form Buttons */}
          <div className="flex gap-2 mt-3 pt-3 border-t border-border">
            <button
              type="button"
              onClick={resetForm}
              className="btn-secondary flex items-center gap-1 text-xs"
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
                  {editingBlog ? <Edit size={14} /> : <Plus size={14} />}
                  {editingBlog ? 'Update' : 'Create'}
                </>
              )}
            </button>
          </div>
        </form>
      )}

      {/* Blog Grid - 3 cards per row */}
      {blogs.length === 0 ? (
        <div className="card p-8 text-center border-dashed">
          <div className="text-5xl mb-3">📝</div>
          <h3 className="text-base font-semibold text-primary">No blogs yet</h3>
          <p className="text-muted text-sm">Start creating your first blog post!</p>
          <button
            onClick={() => setShowForm(true)}
            className="btn-primary mt-3 flex items-center gap-1 mx-auto text-sm"
            style={{ padding: '0.4rem 1rem' }}
          >
            <Plus size={14} /> Create Blog
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {blogs.map(blog => (
            <div
              key={blog._id}
              className="card card-hover overflow-hidden cursor-pointer"
              onClick={() => router.push(`/professional/manage-blog/${blog._id}`)}
              style={{ transition: 'all 0.3s ease' }}
            >
              {blog.coverImage && (
                <img
                  src={blog.coverImage}
                  alt={blog.title}
                  className="w-full h-32 sm:h-36 object-cover"
                />
              )}
              <div className="p-3">
                <div className="flex justify-between items-start gap-1 mb-1.5">
                  <h3 className="text-sm font-bold text-primary truncate flex items-center gap-1">
                    <FileText size={14} className="text-primary shrink-0" />
                    {blog.title}
                  </h3>
                  <span className={`badge text-[10px] ${blog.isPublished ? 'badge-success' : 'badge-warning'} flex items-center gap-0.5 shrink-0`} style={{ padding: '0.1rem 0.4rem' }}>
                    {blog.isPublished ? 'Published' : 'Draft'}
                  </span>
                </div>

                {/* Author Info */}
                <div className="flex items-center gap-1.5 mb-1.5">
                  
                  {blog.author && (
                    <span className="text-[10px] text-muted flex items-center gap-0.5">
                      <User size={10} />by {blog.author}
                    </span>
                  )}
                </div>

                <p className="text-secondary text-xs leading-relaxed mb-1.5 line-clamp-2">
                  {blog.content}
                </p>

                <div className="flex items-center gap-2 text-[10px] text-muted mb-1.5">
                  <span className="flex items-center gap-0.5">
                    <Calendar size={10} /> {formatDate(blog.createdAt)}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-0.5">
                    <Clock size={10} /> {getReadTime(blog.content)}m
                  </span>
                </div>

                {blog.tags && blog.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-1.5">
                    {blog.tags.slice(0, 3).map(tag => (
                      <span key={tag} className="badge badge-primary text-[9px] flex items-center gap-0.5" style={{ padding: '0.05rem 0.4rem' }}>
                        <Tag size={8} /> #{tag}
                      </span>
                    ))}
                    {blog.tags.length > 3 && (
                      <span className="badge text-[9px]" style={{ padding: '0.05rem 0.4rem' }}>
                        +{blog.tags.length - 3}
                      </span>
                    )}
                  </div>
                )}

                <div className="flex gap-3 text-[10px] text-muted mb-1.5">
                  <span className="flex items-center gap-0.5">
                    <Heart size={12} className="text-danger" /> {blog.likes || 0}
                  </span>
                  <span className="flex items-center gap-0.5">
                    <Save size={12} className="text-primary" /> {blog.saves || 0}
                  </span>
                </div>

                <div className="flex flex-wrap gap-1 pt-2 border-t border-border">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      router.push(`/professional/manage-blog/${blog._id}`);
                    }}
                    className="btn-primary flex items-center gap-0.5 text-[10px]"
                    style={{ padding: '0.2rem 0.6rem', fontSize: '0.6rem', minHeight: '1.6rem' }}
                  >
                    <Eye size={12} /> View
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEdit(blog);
                    }}
                    className="btn-secondary flex items-center gap-0.5 text-[10px]"
                    style={{ padding: '0.2rem 0.6rem', fontSize: '0.6rem', minHeight: '1.6rem' }}
                  >
                    <Edit size={12} /> Edit
                  </button>
                  <button
                    onClick={(e) => handleDelete(blog._id, e)}
                    className="btn-danger flex items-center gap-0.5 text-[10px]"
                    style={{ padding: '0.2rem 0.6rem', fontSize: '0.6rem', minHeight: '1.6rem' }}
                  >
                    <Trash2 size={12} /> Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}