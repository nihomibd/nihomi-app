import React, { useState, useEffect } from 'react';
import {
  Database,
  Search,
  Plus,
  BookOpen,
  Tag,
  Clock,
  User,
  Shield,
  Layers,
  CheckCircle2,
  ChevronRight,
  X
} from 'lucide-react';
import { apiRequest } from '../../lib/api';

export const FounderBrainTab: React.FC = () => {
  const [items, setItems] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newItem, setNewItem] = useState({
    category: 'DECISION_LOG',
    title: '',
    summary: '',
    content: '',
    tags: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const categories = [
    { id: 'ALL', label: 'All Knowledge' },
    { id: 'STRATEGY', label: 'Strategy & MRR' },
    { id: 'BRAND_IDENTITY', label: 'Brand & Ethos' },
    { id: 'PEDAGOGY', label: 'N5–N1 Pedagogy' },
    { id: 'OPERATIONAL_MANUAL', label: 'Ops Manuals' },
    { id: 'DECISION_LOG', label: 'Decision Logs' },
    { id: 'RISK_REGISTER', label: 'Risk Register' },
    { id: 'EXPERIMENTS_LOG', label: 'Experiments' }
  ];

  const fetchBrainItems = async () => {
    setIsLoading(true);
    try {
      let url = '/api/founder/company-brain';
      if (searchQuery.trim()) {
        url = `/api/founder/company-brain/search?q=${encodeURIComponent(searchQuery.trim())}`;
      } else if (selectedCategory !== 'ALL') {
        url = `/api/founder/company-brain?category=${selectedCategory}`;
      }

      const res = await apiRequest(url);
      if (res.success) {
        setItems(res.items || res.results || []);
      }
    } catch {
      // quiet fallback
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBrainItems();
  }, [selectedCategory, searchQuery]);

  const handleAddItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItem.title || !newItem.content) return;
    setIsSubmitting(true);
    try {
      const res = await apiRequest('/api/founder/company-brain', {
        method: 'POST',
        body: JSON.stringify({
          category: newItem.category,
          title: newItem.title,
          summary: newItem.summary,
          content: newItem.content,
          tags: newItem.tags.split(',').map((t) => t.trim()).filter(Boolean)
        })
      });

      if (res.success) {
        setShowAddModal(false);
        setNewItem({ category: 'DECISION_LOG', title: '', summary: '', content: '', tags: '' });
        fetchBrainItems();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 text-left max-w-6xl mx-auto">
      {/* 1. HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-stone-950">Company Brain & Intelligence Core</h2>
          <p className="text-xs text-stone-500">
            Authoritative corporate knowledge base grounding AI CEO responses, pedagogy, and strategic planning.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2 bg-stone-950 hover:bg-stone-800 text-white text-xs font-bold rounded-xl transition-colors flex items-center space-x-1.5 w-fit cursor-pointer shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>Record New Intelligence</span>
        </button>
      </div>

      {/* 2. SEARCH & CATEGORY FILTER */}
      <div className="space-y-3">
        <div className="relative">
          <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-3.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search Company Brain (e.g. 'Minna no Nihongo', 'Gate 1', 'SSLCommerz', 'SSW Visa')..."
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-stone-200 rounded-2xl text-xs sm:text-sm font-medium focus:outline-hidden focus:border-stone-950 shadow-2xs"
          />
        </div>

        <div className="flex space-x-2 overflow-x-auto pb-1">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => {
                setSelectedCategory(cat.id);
                setSearchQuery('');
              }}
              className={`px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-colors cursor-pointer shrink-0 ${
                selectedCategory === cat.id && !searchQuery
                  ? 'bg-stone-950 text-white'
                  : 'bg-white hover:bg-stone-50 text-stone-600 border border-stone-200'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* 3. BRAIN ITEMS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map((item) => (
          <div
            key={item.id}
            onClick={() => setSelectedItem(item)}
            className="bg-white p-5 rounded-3xl border border-stone-200 shadow-2xs hover:border-stone-400 transition-all cursor-pointer space-y-3 flex flex-col justify-between"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-md bg-stone-100 text-stone-700">
                  {item.category}
                </span>
                <span className="text-[10px] text-stone-400 font-mono">
                  {new Date(item.createdAt).toLocaleDateString()}
                </span>
              </div>

              <h3 className="text-sm font-bold text-stone-950 line-clamp-1">{item.title}</h3>
              <p className="text-xs text-stone-600 line-clamp-3 leading-relaxed">
                {item.summary || item.content}
              </p>
            </div>

            <div className="pt-2 border-t border-stone-100 flex items-center justify-between">
              <div className="flex items-center space-x-1 overflow-hidden">
                {(item.tags || []).slice(0, 2).map((tag: string, i: number) => (
                  <span key={i} className="text-[10px] text-stone-500 bg-stone-50 px-1.5 py-0.5 rounded border border-stone-200 font-mono">
                    #{tag}
                  </span>
                ))}
              </div>
              <span className="text-xs font-bold text-stone-900 flex items-center space-x-1 shrink-0">
                <span>View</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* ITEM DETAIL MODAL */}
      {selectedItem && (
        <div className="fixed inset-0 z-50 bg-stone-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[85vh] overflow-y-auto p-6 sm:p-8 space-y-6 shadow-2xl text-left border border-stone-200">
            <div className="flex items-start justify-between border-b border-stone-100 pb-4">
              <div className="space-y-1">
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-md bg-stone-100 text-stone-700">
                  {selectedItem.category}
                </span>
                <h3 className="text-lg font-black text-stone-950">{selectedItem.title}</h3>
                <div className="text-[11px] text-stone-400 font-mono">
                  Author: {selectedItem.author} • Updated: {new Date(selectedItem.updatedAt).toLocaleString()}
                </div>
              </div>

              <button
                onClick={() => setSelectedItem(null)}
                className="p-1.5 hover:bg-stone-100 rounded-xl text-stone-400 hover:text-stone-700 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {selectedItem.summary && (
              <div className="bg-amber-50/60 border border-amber-100 p-4 rounded-2xl space-y-1">
                <span className="text-[10px] font-bold text-amber-800 uppercase tracking-wider block">Executive Summary</span>
                <p className="text-xs text-amber-900 font-medium leading-relaxed">{selectedItem.summary}</p>
              </div>
            )}

            <div className="space-y-2">
              <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block">Full Document Text</span>
              <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 text-xs sm:text-sm text-stone-800 whitespace-pre-wrap leading-relaxed font-sans">
                {selectedItem.content}
              </div>
            </div>

            <div className="flex flex-wrap gap-1.5 pt-2">
              {(selectedItem.tags || []).map((tag: string, i: number) => (
                <span key={i} className="text-xs text-stone-600 bg-stone-100 px-2 py-0.5 rounded-md font-mono">
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ADD NEW BRAIN ITEM MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-stone-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <form
            onSubmit={handleAddItem}
            className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 space-y-4 shadow-2xl text-left border border-stone-200"
          >
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <h3 className="text-base font-black text-stone-950">Add Document to Company Brain</h3>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="p-1 hover:bg-stone-100 rounded-lg text-stone-400 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-bold text-stone-600">Category</label>
              <select
                value={newItem.category}
                onChange={(e) => setNewItem({ ...newItem, category: e.target.value })}
                className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs font-bold"
              >
                <option value="STRATEGY">STRATEGY</option>
                <option value="BRAND_IDENTITY">BRAND_IDENTITY</option>
                <option value="PEDAGOGY">PEDAGOGY</option>
                <option value="OPERATIONAL_MANUAL">OPERATIONAL_MANUAL</option>
                <option value="DECISION_LOG">DECISION_LOG</option>
                <option value="RISK_REGISTER">RISK_REGISTER</option>
                <option value="EXPERIMENTS_LOG">EXPERIMENTS_LOG</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-bold text-stone-600">Document Title</label>
              <input
                type="text"
                value={newItem.title}
                onChange={(e) => setNewItem({ ...newItem, title: e.target.value })}
                placeholder="e.g. SSW Visa Preparation Strategy"
                className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs font-medium"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-bold text-stone-600">Summary (Optional)</label>
              <input
                type="text"
                value={newItem.summary}
                onChange={(e) => setNewItem({ ...newItem, summary: e.target.value })}
                placeholder="Brief high-level summary..."
                className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs font-medium"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-bold text-stone-600">Full Content</label>
              <textarea
                rows={5}
                value={newItem.content}
                onChange={(e) => setNewItem({ ...newItem, content: e.target.value })}
                placeholder="Paste authoritative policy, decision rationale, or lesson guideline..."
                className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs font-medium resize-none"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-bold text-stone-600">Tags (Comma-separated)</label>
              <input
                type="text"
                value={newItem.tags}
                onChange={(e) => setNewItem({ ...newItem, tags: e.target.value })}
                placeholder="japan, visa, n5, policy"
                className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs font-medium"
              />
            </div>

            <div className="flex justify-end space-x-2 pt-2">
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-bold rounded-xl cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-4 py-2 bg-stone-950 hover:bg-stone-800 text-white text-xs font-bold rounded-xl cursor-pointer shadow-sm disabled:opacity-50"
              >
                {isSubmitting ? 'Saving...' : 'Add to Company Brain'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
