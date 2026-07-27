import React, { useState, useEffect } from 'react';
import { supabase } from '@/db/supabase';
import { Button } from '@/components/ui/button';
import { Plus, Edit, Trash2, Loader2, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';

interface Knowledge {
  id: string;
  question: string;
  answer: string;
  category: string;
  keywords: string;
  created_at: string;
}

export default function ChatbotKnowledgeAdmin() {
  const [items, setItems] = useState<Knowledge[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [search, setSearch] = useState('');

  const [formData, setFormData] = useState({
    question: '',
    answer: '',
    category: '',
    keywords: ''
  });

  useEffect(() => {
    fetchKnowledge();
  }, []);

  const fetchKnowledge = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('chatbot_knowledge')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setItems(data || []);
    } catch (error: any) {
      toast.error('Failed to load knowledge base: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.question || !formData.answer) {
      toast.error('Question and Answer are required');
      return;
    }

    setIsSaving(true);
    try {
      if (isEditing && editingId) {
        const { error } = await supabase
          .from('chatbot_knowledge')
          .update({
            question: formData.question,
            answer: formData.answer,
            category: formData.category,
            keywords: formData.keywords,
            updated_at: new Date().toISOString()
          })
          .eq('id', editingId);

        if (error) throw error;
        toast.success('Knowledge updated successfully');
      } else {
        const { error } = await supabase
          .from('chatbot_knowledge')
          .insert([{
            question: formData.question,
            answer: formData.answer,
            category: formData.category,
            keywords: formData.keywords
          }]);

        if (error) throw error;
        toast.success('Knowledge added successfully');
      }

      resetForm();
      fetchKnowledge();
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleEdit = (item: Knowledge) => {
    setIsEditing(true);
    setEditingId(item.id);
    setFormData({
      question: item.question,
      answer: item.answer,
      category: item.category || '',
      keywords: item.keywords || ''
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this knowledge record?')) return;

    try {
      const { error } = await supabase
        .from('chatbot_knowledge')
        .delete()
        .eq('id', id);

      if (error) throw error;
      toast.success('Knowledge deleted successfully');
      fetchKnowledge();
    } catch (error: any) {
      toast.error('Failed to delete: ' + error.message);
    }
  };

  const resetForm = () => {
    setIsEditing(false);
    setEditingId(null);
    setFormData({
      question: '',
      answer: '',
      category: '',
      keywords: ''
    });
  };

  const filteredItems = items.filter(item => 
    item.question.toLowerCase().includes(search.toLowerCase()) || 
    item.answer.toLowerCase().includes(search.toLowerCase()) ||
    (item.keywords && item.keywords.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="p-6 bg-muted/20 min-h-full">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Knowledge Base Management</h1>
          <Button onClick={fetchKnowledge} variant="outline" size="sm">
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border">
          <h2 className="text-lg font-semibold mb-4">
            {isEditing ? 'Edit Knowledge' : 'Add New Knowledge'}
          </h2>
          <form onSubmit={handleSave} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="block text-sm font-medium">Question *</label>
                <textarea
                  value={formData.question}
                  onChange={(e) => setFormData({ ...formData, question: e.target.value })}
                  required
                  rows={2}
                  className="w-full border rounded-md px-3 py-2 text-sm"
                  placeholder="e.g., What are your office timings?"
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium">Answer *</label>
                <textarea
                  value={formData.answer}
                  onChange={(e) => setFormData({ ...formData, answer: e.target.value })}
                  required
                  rows={2}
                  className="w-full border rounded-md px-3 py-2 text-sm"
                  placeholder="e.g., Our office is open Monday to Saturday from 9 AM to 6 PM."
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium">Category</label>
                <input
                  type="text"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full border rounded-md px-3 py-2 text-sm"
                  placeholder="e.g., General, Products, HR"
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium">Keywords (comma separated)</label>
                <input
                  type="text"
                  value={formData.keywords}
                  onChange={(e) => setFormData({ ...formData, keywords: e.target.value })}
                  className="w-full border rounded-md px-3 py-2 text-sm"
                  placeholder="e.g., timing, hours, open, close"
                />
              </div>
            </div>
            <div className="flex space-x-2 pt-2">
              <Button type="submit" disabled={isSaving}>
                {isSaving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                {isEditing ? 'Update Knowledge' : 'Add Knowledge'}
              </Button>
              {isEditing && (
                <Button type="button" variant="outline" onClick={resetForm}>
                  Cancel
                </Button>
              )}
            </div>
          </form>
        </div>

        <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
          <div className="p-4 border-b bg-muted/50">
            <input
              type="text"
              placeholder="Search questions, answers, or keywords..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full max-w-md border rounded-md px-3 py-2 text-sm"
            />
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left whitespace-nowrap md:whitespace-normal">
              <thead className="bg-muted text-muted-foreground">
                <tr>
                  <th className="px-4 py-3 font-medium w-1/3">Question</th>
                  <th className="px-4 py-3 font-medium w-1/3">Answer</th>
                  <th className="px-4 py-3 font-medium">Category/Keywords</th>
                  <th className="px-4 py-3 font-medium w-[100px]">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {isLoading ? (
                  <tr>
                    <td colSpan={4} className="px-4 py-8 text-center text-muted-foreground">
                      <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2" />
                      Loading...
                    </td>
                  </tr>
                ) : filteredItems.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-4 py-8 text-center text-muted-foreground">
                      No records found.
                    </td>
                  </tr>
                ) : (
                  filteredItems.map((item) => (
                    <tr key={item.id} className="hover:bg-muted/50 transition-colors">
                      <td className="px-4 py-3 align-top">
                        <div className="font-medium line-clamp-3">{item.question}</div>
                      </td>
                      <td className="px-4 py-3 align-top">
                        <div className="text-muted-foreground line-clamp-3">{item.answer}</div>
                      </td>
                      <td className="px-4 py-3 align-top">
                        <div className="text-xs space-y-1">
                          {item.category && <span className="inline-block px-2 py-1 bg-primary/10 text-primary rounded-full">{item.category}</span>}
                          {item.keywords && <div className="text-muted-foreground break-words">{item.keywords}</div>}
                        </div>
                      </td>
                      <td className="px-4 py-3 align-top">
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEdit(item)}
                            className="text-blue-500 hover:text-blue-700 hover:bg-blue-50"
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDelete(item.id)}
                            className="text-red-500 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
