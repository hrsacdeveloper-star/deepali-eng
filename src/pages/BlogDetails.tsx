import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '@/db/supabase';
import { Button } from '@/components/ui/button';
import { Calendar, User, ChevronRight, Share2 } from 'lucide-react';
import { FadeIn } from '@/components/ui/fade-in';

interface ArticleDetails {
  id: string;
  title: string;
  slug: string;
  content: string;
  image_url: string;
  author: string;
  published_at: string;
  type: string;
}

const BlogDetails: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [article, setArticle] = useState<ArticleDetails | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArticle = async () => {
      if (!slug) return;
      setLoading(true);
      try {
        const { data } = await supabase
          .from('articles')
          .select('*')
          .eq('slug', slug)
          .single();
        
        if (data) setArticle(data);
      } catch (error) {
        console.error('Error fetching article details:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchArticle();
  }, [slug]);

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="container py-24 text-center">
        <h1 className="text-3xl font-bold mb-4">Article Not Found</h1>
        <Button asChild><Link to="/blog">Return to Insights</Link></Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full overflow-x-hidden">
      <div className="bg-muted py-6">
        <div className="container">
          <div className="flex items-center text-sm text-muted-foreground">
            <Link to="/" className="hover:text-primary">Home</Link>
            <ChevronRight className="h-4 w-4 mx-2" />
            <Link to="/blog" className="hover:text-primary">Insights</Link>
            <ChevronRight className="h-4 w-4 mx-2" />
            <span className="text-foreground font-medium truncate max-wxs">{article.title}</span>
          </div>
        </div>
      </div>

      <article className="py-12 md:py-20">
        <div className="container max-w-4xl">
          <div className="space-y-6 mb-10 text-center">
            <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground">
              <span className="uppercase font-bold tracking-wider text-xs text-primary">{article.type}</span>
              <span>•</span>
              {article.published_at && (
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  {new Date(article.published_at).toLocaleDateString()}
                </div>
              )}
              {article.author && (
                <>
                  <span>•</span>
                  <div className="flex items-center gap-1">
                    <User className="h-4 w-4" />
                    {article.author}
                  </div>
                </>
              )}
            </div>
            
            <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-foreground text-balance">
              {article.title}
            </h1>
          </div>

          <div className="aspect-[16/9] md:aspect-[21/9] rounded-xl overflow-hidden bg-muted mb-12 shadow-md">
            <img 
              src={article.image_url || "https://miaoda-site-img.s3cdn.medo.dev/images/KLing_9694a84c-1ea2-4c0e-9537-85a3aa36dda7.jpg"} 
              alt={article.title} 
              className="w-full h-full object-cover" 
            />
          </div>

          <div className="prose prose-slate dark:prose-invert prose-lg max-w-none text-muted-foreground text-pretty">
            {/* Real implementation would use markdown parser or dangerouslySetInnerHTML if trusted. Using simple text for now */}
            {article.content.split('\n').map((paragraph, idx) => (
              <p key={idx}>{paragraph}</p>
            ))}
          </div>

          <div className="mt-16 pt-8 border-t flex items-center justify-between">
            <Button variant="outline" asChild>
              <Link to="/blog">← Back to Insights</Link>
            </Button>
            <Button variant="ghost" className="gap-2" asChild>
              <button onClick={() => {
                if (navigator.share) {
                  navigator.share({
                    title: article.title,
                    url: window.location.href
                  });
                }
              }}>
                <Share2 className="h-4 w-4" /> Share
              </button>
            </Button>
          </div>
        </div>
      </article>
    </div>
  );
};

export default BlogDetails;
