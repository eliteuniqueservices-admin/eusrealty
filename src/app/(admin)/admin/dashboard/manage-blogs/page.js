'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  Plus, X, Pencil, Trash2, ChevronDown, Eye, Search,
  FileText, Clock, Tag, CheckCircle, AlertCircle, Save,
  HelpCircle, Image as ImageIcon
} from 'lucide-react';

const CATEGORIES = [
  'Market Trends', 'Buying Guides', 'Investment Tips',
  'Locality Reviews', 'Legal & RERA', 'Home Loan Tips',
  'NRI Corner', 'Developer Insights'
];

const STATUS_OPTIONS = ['Draft', 'Published'];

export default function ManageBlogs() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingBlog, setEditingBlog] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [saving, setSaving] = useState(false);

  // FAQ state
  const [faqs, setFaqs] = useState([]);

  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    summary: '',
    content: '',
    category: '',
    tags: '',
    status: 'Draft',
    image: '',
    author: {
      name: 'Rahul Upadhyay',
      role: 'CTO & Growth Engineer',
      image: '/uploads/Rahul.jpeg'
    }
  });

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/blogs');
      if (res.ok) {
        const data = await res.json();
        setBlogs(data);
      }
    } catch (error) {
      console.error('Failed to load blogs:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateSlug = useCallback((title) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === 'title') {
      setFormData(prev => ({
        ...prev,
        title: value,
        slug: generateSlug(value)
      }));
    } else if (name.startsWith('author.')) {
      const field = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        author: { ...prev.author, [field]: value }
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const openAddModal = () => {
    setFormData({
      title: '',
      slug: '',
      summary: '',
      content: '',
      category: '',
      tags: '',
      status: 'Draft',
      image: '',
      author: {
        name: 'Rahul Upadhyay',
        role: 'CTO & Growth Engineer',
        image: '/uploads/Rahul.jpeg'
      }
    });
    setFaqs([]);
    setEditingBlog(null);
    setShowModal(true);
  };

  const openEditModal = (blog) => {
    setFormData({
      title: blog.title || '',
      slug: blog.slug || '',
      summary: blog.summary || '',
      content: blog.content || '',
      category: blog.category || '',
      tags: Array.isArray(blog.tags) ? blog.tags.join(', ') : (blog.tags || ''),
      status: blog.status || 'Draft',
      image: blog.image || '',
      author: blog.author || {
        name: 'Rahul Upadhyay',
        role: 'CTO & Growth Engineer',
        image: '/uploads/Rahul.jpeg'
      }
    });
    setFaqs(blog.faqs || []);
    setEditingBlog(blog);
    setShowModal(true);
  };

  const handleSubmit = async () => {
    if (!formData.title || !formData.slug || !formData.content || !formData.category) {
      alert('Please fill in all required fields (Title, Slug, Content, Category).');
      return;
    }

    setSaving(true);

    const tags = typeof formData.tags === 'string'
      ? formData.tags.split(',').map(t => t.trim()).filter(Boolean)
      : formData.tags;

    const payload = {
      ...formData,
      tags,
      faqs: faqs.filter(f => f.q && f.a)
    };

    try {
      if (editingBlog) {
        const res = await fetch(`/api/blogs/${editingBlog._id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        if (res.ok) {
          const updated = await res.json();
          setBlogs(prev => prev.map(b => b._id === editingBlog._id ? updated : b));
        }
      } else {
        const res = await fetch('/api/blogs', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        if (res.ok) {
          const created = await res.json();
          setBlogs(prev => [created, ...prev]);
        }
      }
      setShowModal(false);
    } catch (error) {
      console.error('Failed to save blog:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this blog post?')) return;
    try {
      const res = await fetch(`/api/blogs/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setBlogs(prev => prev.filter(b => b._id !== id));
      }
    } catch (error) {
      console.error('Failed to delete blog:', error);
    }
  };

  const toggleStatus = async (blog) => {
    const newStatus = blog.status === 'Published' ? 'Draft' : 'Published';
    try {
      const res = await fetch(`/api/blogs/${blog._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      if (res.ok) {
        const updated = await res.json();
        setBlogs(prev => prev.map(b => b._id === blog._id ? updated : b));
      }
    } catch (error) {
      console.error('Failed to toggle status:', error);
    }
  };

  const addFaq = () => {
    setFaqs(prev => [...prev, { q: '', a: '' }]);
  };

  const updateFaq = (index, field, value) => {
    setFaqs(prev => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  const removeFaq = (index) => {
    setFaqs(prev => prev.filter((_, i) => i !== index));
  };

  // Filtering
  const filteredBlogs = blogs.filter(blog => {
    const matchesSearch = !searchQuery ||
      blog.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      blog.category?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = !filterStatus || blog.status === filterStatus;
    const matchesCategory = !filterCategory || blog.category === filterCategory;
    return matchesSearch && matchesStatus && matchesCategory;
  });

  const formatDate = (dateStr) => {
    if (!dateStr) return '—';
    return new Date(dateStr).toLocaleDateString('en-IN', {
      day: 'numeric', month: 'short', year: 'numeric'
    });
  };

  return (
    <div className="bg-slate-50 min-h-screen p-6 md:p-8 font-sans text-slate-900">

      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-4 mb-8 pb-6 border-b border-slate-200">
        <div>
          <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight mb-2">Blog Manager</h1>
          <p className="text-slate-500 font-medium">Create, edit and publish blog articles for SEO and engagement</p>
        </div>
        <button
          onClick={openAddModal}
          className="flex items-center gap-2 bg-blue-600 text-white px-6 py-2.5 rounded-xl font-bold hover:bg-blue-700 transition shadow-md shadow-blue-600/20 active:scale-95"
        >
          <Plus size={18} strokeWidth={3} /> New Article
        </button>
      </div>

      {/* SEARCH & FILTER */}
      <div className="bg-white border border-slate-200 p-6 rounded-2xl mb-8 shadow-sm">
        <div className="flex justify-between items-center mb-5">
          <h3 className="text-lg font-bold flex items-center gap-2">
            <Search size={20} className="text-slate-400" /> Find Articles
          </h3>
          {(searchQuery || filterStatus || filterCategory) && (
            <button
              onClick={() => { setSearchQuery(''); setFilterStatus(''); setFilterCategory(''); }}
              className="text-sm text-blue-600 font-bold hover:text-blue-800 transition"
            >
              Clear Filters
            </button>
          )}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input
            type="text"
            placeholder="Search by title or category..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-4 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 placeholder-slate-400 font-medium hover:border-slate-300 focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all"
          />
          <div className="relative">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="appearance-none cursor-pointer w-full pl-4 pr-10 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 font-medium hover:border-slate-300 focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all"
            >
              <option value="">All Status</option>
              {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={18} />
          </div>
          <div className="relative">
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="appearance-none cursor-pointer w-full pl-4 pr-10 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 font-medium hover:border-slate-300 focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all"
            >
              <option value="">All Categories</option>
              {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={18} />
          </div>
        </div>
      </div>

      {/* BLOG LIST */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="flex items-center justify-between p-5 border-b border-slate-100 bg-slate-50/50">
          <span className="font-bold text-slate-700">
            {filteredBlogs.length} {filteredBlogs.length === 1 ? 'Article' : 'Articles'} Found
          </span>
        </div>

        {loading ? (
          <div className="p-10 text-center text-slate-500 font-bold">Loading articles...</div>
        ) : (
          <div className="flex flex-col divide-y divide-slate-100">
            {filteredBlogs.map((blog) => (
              <div
                key={blog._id}
                className="group flex flex-col lg:flex-row lg:items-center gap-6 p-5 transition-all hover:bg-slate-50/80"
              >
                {/* Identity */}
                <div className="flex items-start gap-4 flex-1">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <FileText size={18} className="text-blue-600" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h2 className="font-bold text-lg text-slate-900 group-hover:text-blue-600 transition-colors truncate">
                      {blog.title}
                    </h2>
                    <div className="flex flex-wrap items-center gap-3 text-sm text-slate-500 mt-1">
                      <span className="flex items-center gap-1 font-medium">
                        <Tag size={13} className="text-slate-400" /> {blog.category}
                      </span>
                      <span className="flex items-center gap-1 font-medium">
                        <Clock size={13} className="text-slate-400" /> {blog.readTime || '—'} min
                      </span>
                      <span className="font-medium">{formatDate(blog.createdAt)}</span>
                    </div>
                    <p className="text-slate-400 text-sm mt-1 line-clamp-1">{blog.summary}</p>
                  </div>
                </div>

                {/* Status & Actions */}
                <div className="flex items-center gap-3 lg:gap-4 flex-shrink-0">
                  <button
                    onClick={() => toggleStatus(blog)}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold border transition-colors cursor-pointer ${
                      blog.status === 'Published'
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                        : 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100'
                    }`}
                    title={`Click to ${blog.status === 'Published' ? 'unpublish' : 'publish'}`}
                  >
                    {blog.status === 'Published'
                      ? <><CheckCircle size={13} /> Published</>
                      : <><AlertCircle size={13} /> Draft</>
                    }
                  </button>
                  <button
                    onClick={() => openEditModal(blog)}
                    className="p-2 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition"
                    title="Edit"
                  >
                    <Pencil size={18} />
                  </button>
                  <button
                    onClick={() => handleDelete(blog._id)}
                    className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                    title="Delete"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))}

            {filteredBlogs.length === 0 && !loading && (
              <div className="text-center py-24 bg-slate-50/50">
                <FileText size={48} className="mx-auto text-slate-300 mb-4" />
                <p className="text-slate-900 font-black text-xl mb-2">No articles found</p>
                <p className="text-slate-500 font-medium max-w-sm mx-auto">
                  Create your first blog post to start building organic search traffic.
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* ADD / EDIT MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white w-full max-w-4xl rounded-[2rem] p-8 max-h-[90vh] overflow-y-auto shadow-2xl">
            {/* Modal Header */}
            <div className="flex justify-between items-center mb-8 sticky top-0 bg-white/90 backdrop-blur-md pb-4 border-b border-slate-100 z-10">
              <div>
                <h2 className="text-2xl font-black text-slate-900">
                  {editingBlog ? 'Edit Article' : 'Create New Article'}
                </h2>
                <p className="text-slate-500 font-medium mt-1">
                  Fill in the details below. Fields marked * are required.
                </p>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="bg-slate-100 p-2 text-slate-500 hover:bg-slate-200 hover:text-slate-800 rounded-full transition"
              >
                <X size={20} strokeWidth={3} />
              </button>
            </div>

            <div className="space-y-10">
              {/* BASIC INFO */}
              <section>
                <h3 className="font-bold text-lg text-slate-900 mb-4 flex items-center gap-2">
                  <FileText size={20} className="text-blue-600" /> Article Details
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    name="title"
                    placeholder="Article Title *"
                    onChange={handleChange}
                    value={formData.title}
                    className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium col-span-2"
                  />
                  <div className="col-span-2">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">Slug (auto-generated):</span>
                      <span className="text-xs font-mono text-blue-600 bg-blue-50 px-2 py-0.5 rounded">/blog/{formData.slug || '...'}</span>
                    </div>
                    <input
                      name="slug"
                      placeholder="URL slug *"
                      onChange={handleChange}
                      value={formData.slug}
                      className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium font-mono"
                    />
                  </div>
                  <textarea
                    name="summary"
                    placeholder="Short summary / excerpt *"
                    onChange={handleChange}
                    value={formData.summary}
                    rows={2}
                    className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium col-span-2"
                  />
                  <div className="relative">
                    <select
                      name="category"
                      onChange={handleChange}
                      value={formData.category}
                      className="appearance-none w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium cursor-pointer"
                    >
                      <option value="">Select Category *</option>
                      {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={18} />
                  </div>
                  <div className="relative">
                    <select
                      name="status"
                      onChange={handleChange}
                      value={formData.status}
                      className="appearance-none w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium cursor-pointer"
                    >
                      {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={18} />
                  </div>
                  <input
                    name="tags"
                    placeholder="Tags (comma separated, e.g. Pune, Wakad, Investment)"
                    onChange={handleChange}
                    value={formData.tags}
                    className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium col-span-2"
                  />
                </div>
              </section>

              {/* COVER IMAGE */}
              <section>
                <h3 className="font-bold text-lg text-slate-900 mb-4 flex items-center gap-2">
                  <ImageIcon size={20} className="text-blue-600" /> Cover Image
                </h3>
                <input
                  name="image"
                  placeholder="Cover image URL (e.g. https://images.unsplash.com/...)"
                  onChange={handleChange}
                  value={formData.image}
                  className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                />
                {formData.image && (
                  <div className="mt-3 w-full h-40 rounded-xl overflow-hidden border border-slate-200 bg-slate-100 relative">
                    <img src={formData.image} alt="Cover preview" className="w-full h-full object-cover" />
                  </div>
                )}
              </section>

              {/* CONTENT */}
              <section>
                <h3 className="font-bold text-lg text-slate-900 mb-4">Article Content (HTML) *</h3>
                <textarea
                  name="content"
                  placeholder="<h2>Your heading</h2><p>Your paragraph content goes here...</p>"
                  onChange={handleChange}
                  value={formData.content}
                  rows={12}
                  className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm min-h-[200px]"
                />
              </section>

              {/* AUTHOR */}
              <section>
                <h3 className="font-bold text-lg text-slate-900 mb-4">Author</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <input
                    name="author.name"
                    placeholder="Author Name"
                    onChange={handleChange}
                    value={formData.author.name}
                    className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                  />
                  <input
                    name="author.role"
                    placeholder="Author Role"
                    onChange={handleChange}
                    value={formData.author.role}
                    className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                  />
                  <input
                    name="author.image"
                    placeholder="Author Image URL"
                    onChange={handleChange}
                    value={formData.author.image}
                    className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                  />
                </div>
              </section>

              {/* FAQs */}
              <section>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-bold text-lg text-slate-900 flex items-center gap-2">
                    <HelpCircle size={20} className="text-blue-600" /> FAQs (Structured Data)
                  </h3>
                  <button
                    onClick={addFaq}
                    className="text-sm font-bold text-blue-600 bg-blue-50 px-3 py-1.5 rounded-lg hover:bg-blue-100 transition"
                  >
                    + Add FAQ
                  </button>
                </div>
                <div className="space-y-4 bg-slate-50 p-4 rounded-xl border border-slate-200">
                  {faqs.length === 0 && (
                    <p className="text-sm text-slate-500 font-medium text-center py-2">
                      No FAQs added yet. FAQs generate rich results in Google Search.
                    </p>
                  )}
                  {faqs.map((faq, index) => (
                    <div key={index} className="bg-white p-4 rounded-xl border border-slate-200 space-y-3 relative">
                      <button
                        onClick={() => removeFaq(index)}
                        className="absolute top-3 right-3 p-1 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition"
                      >
                        <X size={16} />
                      </button>
                      <div className="flex items-start gap-2">
                        <span className="text-xs uppercase bg-blue-50 text-blue-600 px-2 py-0.5 rounded font-black mt-1 flex-shrink-0">Q</span>
                        <input
                          placeholder="Question"
                          value={faq.q}
                          onChange={(e) => updateFaq(index, 'q', e.target.value)}
                          className="flex-1 p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium text-sm"
                        />
                      </div>
                      <div className="flex items-start gap-2">
                        <span className="text-xs uppercase bg-emerald-50 text-emerald-600 px-2 py-0.5 rounded font-black mt-1 flex-shrink-0">A</span>
                        <textarea
                          placeholder="Answer"
                          value={faq.a}
                          onChange={(e) => updateFaq(index, 'a', e.target.value)}
                          rows={2}
                          className="flex-1 p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium text-sm"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* ACTION BUTTONS */}
              <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-slate-200">
                <button
                  onClick={() => setShowModal(false)}
                  className="flex-1 py-3.5 bg-slate-100 text-slate-700 rounded-xl font-bold hover:bg-slate-200 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={saving}
                  className="flex-1 flex items-center justify-center gap-2 py-3.5 bg-blue-600 text-white rounded-xl font-bold shadow-md shadow-blue-600/20 hover:bg-blue-700 transition disabled:opacity-60"
                >
                  <Save size={18} />
                  {saving ? 'Saving...' : (editingBlog ? 'Update Article' : 'Create Article')}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
