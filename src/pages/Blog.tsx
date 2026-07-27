import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '@/db/supabase';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Calendar, User, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { FadeIn } from '@/components/ui/fade-in';

interface Article {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  image_url: string;
  author: string;
  published_at: string;
  type: string;
}

const Blog: React.FC = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const { data } = await supabase
          .from('articles')
          .select('*')
          .eq('is_published', true)
          .order('published_at', { ascending: false });
        if (data) setArticles(data);
      } catch (error) {
        console.error('Error fetching articles:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchArticles();
  }, []);

  const filteredArticles = articles.filter(article => 
    article.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    (article.excerpt && article.excerpt.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="flex flex-col w-full overflow-x-hidden">
      <motion.section initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-50px" }} transition={{ duration: 0.6 }} className="bg-muted py-16 md:py-24">
        <div className="container">
          <div className="max-w-3xl space-y-4">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground">Insights & News</h1>
            <p className="text-lg text-muted-foreground text-pretty">
              The latest updates, industry trends, and technical articles from Deepali Engineering.
            </p>
          </div>
        </div>
      </motion.section>

      <motion.section initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-50px" }} transition={{ duration: 0.6 }} className="py-12 md:py-16">
        <div className="container">
          <div className="flex flex-col lg:flex-row gap-10">
            {/* Sidebar */}
            <aside className="w-full lg:w-64 shrink-0 space-y-8">
              <div className="space-y-4">
                <h3 className="font-bold text-foreground text-lg">Search</h3>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input 
                    type="search" 
                    placeholder="Search articles..." 
                    className="pl-9"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>
            </aside>

            {/* Articles List */}
            <div className="flex-1 min-w-0">
              {loading ? (
                <div className="flex justify-center py-20">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
                </div>
              ) : filteredArticles.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {filteredArticles.map((article) => (
                    <Link to={`/blog/${article.slug}`} key={article.id} className="group flex flex-col h-full">
                      <div className="aspect-[16/9] rounded-lg overflow-hidden bg-muted mb-4 shadow-sm">
                        <img 
                          src={article.image_url || "https://miaoda-site-img.s3cdn.medo.dev/images/KLing_9694a84c-1ea2-4c0e-9537-85a3aa36dda7.jpg"} 
                          alt={article.title} 
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                        />
                      </div>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground mb-3">
                        {article.published_at && (
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {new Date(article.published_at).toLocaleDateString()}
                          </div>
                        )}
                        {article.author && (
                          <div className="flex items-center gap-1">
                            <User className="h-3 w-3" />
                            {article.author}
                          </div>
                        )}
                        <span className="uppercase font-semibold tracking-wider text-[10px] bg-secondary px-2 py-0.5 rounded">{article.type}</span>
                      </div>
                      <h3 className="text-xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors line-clamp-2">
                        {article.title}
                      </h3>
                      <p className="text-muted-foreground text-sm line-clamp-3 mb-4 flex-1 text-pretty">
                        {article.excerpt}
                      </p>
                      <div className="flex items-center text-sm font-medium text-primary mt-auto">
                        Read Article <ChevronRight className="ml-1 h-4 w-4" />
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="text-center py-20 bg-muted/50 rounded-lg">
                  <h3 className="text-xl font-medium text-foreground mb-2">No articles found</h3>
                  <p className="text-muted-foreground">Try adjusting your search terms.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </motion.section>
    </div>
  );
};

export default Blog;
