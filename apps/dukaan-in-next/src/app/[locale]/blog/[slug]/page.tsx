
'use client';

import { useState, useEffect, useMemo } from 'react';
import { useParams } from 'next/navigation';
import { collection, query, where, doc, updateDoc, increment, addDoc, serverTimestamp, orderBy } from 'firebase/firestore';
import { Loader2, ThumbsUp, Eye, Send, User } from 'lucide-react';
import { format } from 'date-fns';

import { useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import type { Post, Comment } from '@/docs/backend-types';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getMockBlogData } from '@/lib/blog-data';

export default function BlogPostPage() {
  const firestore = useFirestore();
  const { toast } = useToast();
  const params = useParams();
  const slug = params?.slug as string;

  const [post, setPost] = useState<Post | null>(null);
  const [viewCounted, setViewCounted] = useState(false);
  const [commentName, setCommentName] = useState('');
  const [commentMessage, setCommentMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { mockPost, mockComment } = getMockBlogData();

  const postQuery = useMemoFirebase(() => {
    if (!slug) return null;
    return query(collection(firestore, 'posts'), where('slug', '==', slug));
  }, [firestore, slug]);

  const { data: postData, isLoading: isPostLoading } = useCollection<Post>(postQuery);
  
  const commentsQuery = useMemoFirebase(() => {
    if (!slug) return null;
    return query(collection(firestore, 'comments'), where('postSlug', '==', slug), orderBy('createdAt', 'asc'));
  }, [firestore, slug]);

  const { data: comments, isLoading: areCommentsLoading } = useCollection<Comment>(commentsQuery);

  useEffect(() => {
    if (postData && postData.length > 0) {
      const currentPost = postData[0];
      setPost(currentPost);
      if (!viewCounted && !currentPost.id.startsWith('mock-')) {
        const postRef = doc(firestore, 'posts', currentPost.id);
        updateDoc(postRef, {
          views: increment(1),
        })
          .then(() => setViewCounted(true))
          .catch(err => console.error('Failed to increment view count', err));
      }
    } else if (!isPostLoading && slug === mockPost.slug) {
        setPost(mockPost);
    }
  }, [postData, isPostLoading, firestore, viewCounted, slug, mockPost]);

  const handleLike = () => {
    if (!post) return;
    if (post.id.startsWith('mock-')) {
        toast({ title: 'Liked!', description: 'Your feedback is valuable.' });
        return;
    }
    const postRef = doc(firestore, 'posts', post.id);
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

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentName.trim() || !commentMessage.trim() || !post) return;

    setIsSubmitting(true);
    try {
      await addDoc(collection(firestore, 'comments'), {
        postSlug: post.slug,
        name: commentName,
        message: commentMessage,
        createdAt: serverTimestamp(),
      });
      setCommentName('');
      setCommentMessage('');
      toast({ title: 'Success', description: 'Your comment has been posted.' });
    } catch (error) {
      console.error('Error adding comment:', error);
      toast({
        title: 'Error',
        description: 'Could not post your comment. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatDate = (date: any) => {
    if (!date) return 'N/A';
    const d = date.toDate ? date.toDate() : new Date(date);
    return format(d, 'MMMM d, yyyy');
  };
  
  const allComments = useMemo(() => {
    const realComments = comments || [];
    if (slug === mockPost.slug && realComments.length === 0) {
        return [mockComment];
    }
    return realComments;
  }, [comments, slug, mockPost.slug, mockComment]);


  if (isPostLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="w-12 h-12 animate-spin text-primary" />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="container py-24 text-center">
        <h1 className="text-2xl font-bold">Post not found</h1>
        <p className="text-muted-foreground">The requested blog post could not be located.</p>
        <Button asChild className="mt-4">
          <a href="/blog">Back to Blog</a>
        </Button>
      </div>
    );
  }

  return (
    <div className="container max-w-4xl py-16 md:py-24">
      <article className="prose prose-invert max-w-none prose-lg">
        <header className="mb-12">
          <Badge variant="secondary" className="mb-4">{post.category}</Badge>
          <h1 className="font-headline font-black !text-4xl md:!text-5xl tracking-tighter !mb-4">{post.title}</h1>
          <p className="text-muted-foreground text-base">
            By {post.author} on {formatDate(post.createdAt)}
          </p>
          <div className="mt-6 flex items-center gap-6 border-y border-border py-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Eye className="w-5 h-5" /> {post.views || 0} Views
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <ThumbsUp className="w-5 h-5" /> {post.likes || 0} Likes
            </div>
            <Button onClick={handleLike} variant="outline">
              <ThumbsUp className="w-4 h-4 mr-2" /> Like
            </Button>
          </div>
        </header>

        <div dangerouslySetInnerHTML={{ __html: post.content || '' }} />
        
        <footer className="mt-16 border-t border-border pt-8 space-y-4 text-center bg-card p-8 rounded-lg">
            <h3 className="text-xl font-bold">“Kya aap apni dukaan me yeh try karenge?”</h3>
            <p className="text-muted-foreground">“Comment me likhiye: aapka biggest daily challenge kya hai?”</p>
            <p className="text-sm">“Is article ko apne doston ke saath share karein.”</p>
        </footer>

      </article>

      <section className="mt-20">
        <h2 className="font-headline text-3xl font-bold mb-8">Comments</h2>
        <div className="space-y-8 mb-12">
          {areCommentsLoading && <Loader2 className="w-6 h-6 animate-spin" />}
          {!areCommentsLoading && allComments && allComments.length > 0 ? (
            allComments.map(comment => (
              <div key={comment.id} className="flex items-start gap-4">
                <div className="bg-muted rounded-full p-3">
                  <User className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <p className="font-bold">{comment.name || comment.authorName || 'Anonymous'}</p>
                    <p className="text-xs text-muted-foreground">{formatDate(comment.createdAt)}</p>
                  </div>
                  <p className="text-muted-foreground mt-1">{comment.message || comment.content}</p>
                </div>
              </div>
            ))
          ) : (
            !areCommentsLoading && <p className="text-muted-foreground">Be the first to comment!</p>
          )}
        </div>

        <Card>
            <CardHeader>
                <CardTitle>Leave a Comment</CardTitle>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleCommentSubmit} className="space-y-4">
                    <Input 
                        placeholder="Your name"
                        value={commentName}
                        onChange={e => setCommentName(e.target.value)}
                        required
                    />
                    <Textarea 
                        placeholder="Write your comment here..."
                        value={commentMessage}
                        onChange={e => setCommentMessage(e.target.value)}
                        required
                    />
                    <Button type="submit" disabled={isSubmitting}>
                        {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Post Comment <Send className="ml-2 w-4 h-4"/>
                    </Button>
                </form>
            </CardContent>
        </Card>
      </section>
    </div>
  );
}
