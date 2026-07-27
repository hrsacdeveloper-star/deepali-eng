import React, { useState, useEffect } from 'react';
import { supabase } from '@/db/supabase';
import { Button } from '@/components/ui/button';
import { Trash2, Upload, FileText, Loader2, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';
import { extractTextFromPDF } from '@/lib/pdfParser';

interface Document {
  id: string;
  title: string;
  pdf_url: string;
  content: string;
  created_at: string;
}

export default function ChatbotDocumentsAdmin() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [title, setTitle] = useState('');
  const [file, setFile] = useState<File | null>(null);

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('chatbot_documents')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setDocuments(data || []);
    } catch (error: any) {
      toast.error('Failed to load documents: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !title) {
      toast.error('Please provide a title and select a PDF file');
      return;
    }

    if (file.type !== 'application/pdf') {
      toast.error('Only PDF files are allowed');
      return;
    }

    if (file.size > 20 * 1024 * 1024) {
      toast.error('File size must be under 20MB');
      return;
    }

    setIsUploading(true);
    try {
      toast.info('Extracting text from PDF... This might take a moment.');
      const chunks = await extractTextFromPDF(file);
      
      if (chunks.length === 0) {
        throw new Error('No readable text found in this PDF.');
      }

      toast.info('Uploading file...');
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2)}_${Date.now()}.${fileExt}`;
      const filePath = `chatbot_docs/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('images') // We use the existing storage bucket
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: publicUrlData } = supabase.storage
        .from('images')
        .getPublicUrl(filePath);

      toast.info('Saving to database...');
      
      // Save each chunk as a separate row for better FTS precision
      // Or save as one row per document. The prompt says "Search paragraphs. Find the most relevant paragraph. Return that paragraph."
      // So storing each chunk as a separate row is the best approach.
      const rows = chunks.map(chunk => ({
        title: title,
        pdf_url: publicUrlData.publicUrl,
        content: chunk
      }));

      const { error: dbError } = await supabase
        .from('chatbot_documents')
        .insert(rows);

      if (dbError) throw dbError;

      toast.success('Document uploaded and processed successfully!');
      setTitle('');
      setFile(null);
      
      // Reset file input
      const fileInput = document.getElementById('pdf-upload') as HTMLInputElement;
      if (fileInput) fileInput.value = '';
      
      fetchDocuments();
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async (titleToDelete: string, pdfUrl: string) => {
    if (!window.confirm(`Are you sure you want to delete all chunks for "${titleToDelete}"?`)) return;

    try {
      const { error } = await supabase
        .from('chatbot_documents')
        .delete()
        .eq('pdf_url', pdfUrl);

      if (error) throw error;
      toast.success('Document deleted successfully');
      fetchDocuments();
    } catch (error: any) {
      toast.error('Failed to delete document: ' + error.message);
    }
  };

  // Group by URL to show documents instead of individual chunks
  const groupedDocuments = documents.reduce((acc, doc) => {
    if (!acc[doc.pdf_url]) {
      acc[doc.pdf_url] = { ...doc, chunksCount: 0 };
    }
    acc[doc.pdf_url].chunksCount++;
    return acc;
  }, {} as Record<string, Document & { chunksCount: number }>);

  return (
    <div className="p-6 bg-muted/20 min-h-full">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Chatbot Documents Management</h1>
          <Button onClick={fetchDocuments} variant="outline" size="sm">
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border">
          <h2 className="text-lg font-semibold mb-4">Upload New Document</h2>
          <form onSubmit={handleUpload} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Document Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                placeholder="e.g. Deepali Brochure 2024"
                className="w-full border rounded-md px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">PDF File (Max 20MB)</label>
              <input
                id="pdf-upload"
                type="file"
                accept="application/pdf"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
                required
                className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-primary/90"
              />
            </div>
            <Button type="submit" disabled={isUploading || !file || !title}>
              {isUploading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Upload className="w-4 h-4 mr-2" />}
              {isUploading ? 'Processing...' : 'Upload & Extract Text'}
            </Button>
          </form>
        </div>

        <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
          <table className="w-full text-sm text-left">
            <thead className="bg-muted text-muted-foreground">
              <tr>
                <th className="px-4 py-3 font-medium">Title</th>
                <th className="px-4 py-3 font-medium">Paragraphs</th>
                <th className="px-4 py-3 font-medium">Added</th>
                <th className="px-4 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {isLoading ? (
                <tr>
                  <td colSpan={4} className="px-4 py-8 text-center text-muted-foreground">
                    <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2" />
                    Loading documents...
                  </td>
                </tr>
              ) : Object.values(groupedDocuments).length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-4 py-8 text-center text-muted-foreground">
                    No documents uploaded yet.
                  </td>
                </tr>
              ) : (
                Object.values(groupedDocuments).map((doc) => (
                  <tr key={doc.pdf_url} className="hover:bg-muted/50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="font-medium flex items-center">
                        <FileText className="w-4 h-4 mr-2 text-blue-500" />
                        {doc.title}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">{doc.chunksCount} chunks</td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {new Date(doc.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center space-x-2">
                        <a 
                          href={doc.pdf_url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-primary hover:underline text-xs"
                        >
                          View PDF
                        </a>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(doc.title, doc.pdf_url)}
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
  );
}
