
'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { collection, query, orderBy, doc, updateDoc, increment } from 'firebase/firestore';
import { Loader2, ThumbsUp, Eye, Bookmark } from 'lucide-react';
import { format } from 'date-fns';

import { useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import type { Post } from '@/docs/backend-types';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';

export default function BlogPage() {
  const firestore = useFirestore();
  const { toast } = useToast();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const postsQuery = useMemoFirebase(() => {
    return query(collection(firestore, 'posts'), orderBy('createdAt', 'desc'));
  }, [firestore]);

  const { data: posts, isLoading, error } = useCollection<Post>(postsQuery);

  const categories = useMemo(() => {
    if (!posts) return [];
    const allCategories = posts.map(p => p.category);
    return ['All', ...Array.from(new Set(allCategories))];
  }, [posts]);

  const filteredPosts = useMemo(() => {
    if (!posts) return [];
    if (!selectedCategory || selectedCategory === 'All') return posts;
    return posts.filter(p => p.category === selectedCategory);
  }, [posts, selectedCategory]);

  const handleLike = (postId: string) => {
    const postRef = doc(firestore, 'posts', postId);
    updateDoc(postRef, {
      likes: increment(1),
    }).catch(err => {
      console.error('Error liking post:', err);
      toast({
        title: 'Error',
        description: 'Could not like the post. Please try again.',
        variant: 'destructive',
      });
    });
  };

  const formatDate = (date: any) => {
    if (!date) return 'N/A';
    const d = date.toDate ? date.toDate() : new Date(date);
    return format(d, 'MMMM d, yyyy');
  };

  return (
    <div className="container py-16 md:py-24">
      <header className="text-center mb-16">
        <h1 className="font-headline text-4xl md:text-6xl font-black tracking-tighter">The DukaanMitra Blog</h1>
        <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
          Insights, guides, and stories for the modern Indian retailer.
        </p>
      </header>

      <div className="flex justify-center mb-8 flex-wrap gap-2">
        {categories.map(category => (
          <Button
            key={category}
            variant={selectedCategory === category || (category === 'All' && !selectedCategory) ? 'default' : 'outline'}
            onClick={() => setSelectedCategory(category === 'All' ? null : category)}
            className="rounded-full"
          >
            {category}
          </Button>
        ))}
      </div>

      {isLoading && (
        <div className="flex justify-center mt-20">
          <Loader2 className="w-12 h-12 animate-spin text-primary" />
        </div>
      )}

      {error && (
        <div className="text-center text-destructive mt-20">
          <p>Error loading posts. Please try again later.</p>
        </div>
      )}

      {!isLoading && filteredPosts && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredPosts.length === 0 ? (
            <p className="col-span-full text-center text-muted-foreground mt-12">
              No posts found in this category.
            </p>
          ) : (
            filteredPosts.map(post => (
              <Card key={post.id} className="flex flex-col transition-all hover:shadow-lg hover:-translate-y-1">
                <CardHeader>
                  <Badge variant="secondary" className="w-fit mb-2">{post.category}</Badge>
                  <CardTitle className="text-xl font-bold leading-snug">
                    <Link href={`/blog/${post.slug}`} className="hover:text-primary transition-colors">
                      {post.title}
                    </Link>
                  </CardTitle>
                  <CardDescription>{formatDate(post.createdAt)} by {post.author}</CardDescription>
                </CardHeader>
                <CardContent className="flex-grow">
                  <p className="text-muted-foreground">{post.excerpt}</p>
                </CardContent>
                <CardFooter className="flex justify-between items-center border-t pt-4">
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1.5">
                      <ThumbsUp className="w-4 h-4" /> {post.likes || 0}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Eye className="w-4 h-4" /> {post.views || 0}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="icon" onClick={() => handleLike(post.id)}>
                      <ThumbsUp className="w-5 h-5" />
                    </Button>
                    <Button variant="ghost" size="icon">
                      <Bookmark className="w-5 h-5" />
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            ))
          )}
        </div>
      )}
    </div>
  );
}
