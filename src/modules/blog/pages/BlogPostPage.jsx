import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/modules/auth/AuthProvider';
import { useForm } from 'react-hook-form';
import * as Sentry from '@sentry/browser';

export default function BlogPostPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { user, getToken } = useAuth();
  const { register, handleSubmit, reset, formState: { errors } } = useForm();
  
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [commentLoading, setCommentLoading] = useState(false);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/posts?slug=${slug}`);
        
        if (!response.ok) {
          if (response.status === 404) {
            navigate('/404');
            return;
          }
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        
        const data = await response.json();
        setPost(data);
        
        // Fetch comments for this post
        fetchComments(data.id);
      } catch (err) {
        console.error('Error fetching post:', err);
        Sentry.captureException(err);
        setError('Gagal memuat artikel. Silakan coba lagi nanti.');
      } finally {
        setLoading(false);
      }
    };
    
    const fetchComments = async (postId) => {
      try {
        const response = await fetch(`/api/comments?postId=${postId}`);
        
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        
        const data = await response.json();
        setComments(data);
      } catch (err) {
        console.error('Error fetching comments:', err);
        Sentry.captureException(err);
      }
    };
    
    if (slug) {
      fetchPost();
    }
  }, [slug, navigate]);
  
  const onSubmitComment = async (data) => {
    if (commentLoading) return;
    
    try {
      setCommentLoading(true);
      const token = getToken();
      
      if (!token) {
        throw new Error('Anda harus login untuk mengirim komentar');
      }
      
      const response = await fetch('/api/comments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          postId: post.id,
          content: data.comment
        }),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      
      const newComment = await response.json();
      setComments(prevComments => [...prevComments, newComment]);
      reset({ comment: '' });
    } catch (err) {
      console.error('Error posting comment:', err);
      Sentry.captureException(err);
      setError('Gagal mengirim komentar. Silakan coba lagi nanti.');
    } finally {
      setCommentLoading(false);
    }
  };
  
  if (loading) {
    return (
      <div className="py-24">
        <div className="container mx-auto px-4">
          <div className="flex justify-center py-12">
            <div className="frost-loading frost-loading-lg"></div>
          </div>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="py-24">
        <div className="container mx-auto px-4">
          <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-md text-center">
            {error}
          </div>
        </div>
      </div>
    );
  }
  
  if (!post) {
    return null; // Should never happen due to 404 redirect
  }
  
  return (
    <div className="py-24">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* Back link */}
          <Link to="/blog" className="inline-flex items-center text-frost-600 hover:text-frost-800 mb-6">
            <svg className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Kembali ke Blog
          </Link>
          
          {/* Post header */}
          <h1 className="text-3xl md:text-4xl font-orbitron font-bold mb-4">
            {post.title}
          </h1>
          
          <div className="flex items-center text-warlord-500 mb-6">
            <svg className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span>
              {new Date(post.createdAt).toLocaleDateString('id-ID', {
                day: 'numeric',
                month: 'long',
                year: 'numeric'
              })}
            </span>
            <span className="mx-3">•</span>
            <svg className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
            <span>{post.viewCount} kali dilihat</span>
          </div>
          
          {/* Featured image */}
          {post.imageUrl && (
            <div className="mb-8">
              <img 
                src={post.imageUrl} 
                alt={post.title}
                className="w-full h-auto rounded-lg shadow-md"
              />
            </div>
          )}
          
          {/* Post content */}
          <div className="prose max-w-none mb-12">
            {post.content.split('\n').map((paragraph, index) => (
              <p key={index} className="mb-4">{paragraph}</p>
            ))}
          </div>
          
          {/* Comments section */}
          <div className="mt-12 border-t border-frost-100 pt-8">
            <h2 className="text-2xl font-orbitron font-bold mb-6">Komentar ({comments.length})</h2>
            
            {/* Comment form */}
            {user ? (
              <div className="mb-8">
                <form onSubmit={handleSubmit(onSubmitComment)}>
                  <div className="frost-form-group">
                    <label htmlFor="comment" className="frost-label">Tambahkan Komentar</label>
                    <textarea
                      id="comment"
                      rows="4"
                      className="frost-input"
                      placeholder="Tulis komentar Anda di sini..."
                      {...register('comment', { 
                        required: 'Komentar tidak boleh kosong' 
                      })}
                    ></textarea>
                    {errors.comment && <p className="frost-error">{errors.comment.message}</p>}
                  </div>
                  <button 
                    type="submit" 
                    className="btn-primary cursor-pointer"
                    disabled={commentLoading}
                  >
                    {commentLoading ? (
                      <>
                        <span className="frost-loading mr-2"></span>
                        <span>Mengirim...</span>
                      </>
                    ) : 'Kirim Komentar'}
                  </button>
                </form>
              </div>
            ) : (
              <div className="mb-8 p-4 bg-frost-50 rounded-md border border-frost-100">
                <p className="mb-2">Anda harus login untuk memberikan komentar.</p>
                <Link to="/login" className="btn-primary inline-block">
                  Login
                </Link>
              </div>
            )}
            
            {/* Comments list */}
            <div className="space-y-6">
              {comments.length > 0 ? (
                comments.map(comment => (
                  <div key={comment.id} className="frost-card p-4">
                    <div className="flex items-start">
                      <div className="flex-shrink-0 mr-3">
                        {comment.userProfilePicture ? (
                          <img 
                            src={comment.userProfilePicture} 
                            alt={comment.userName}
                            className="w-10 h-10 rounded-full"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-frost-600 flex items-center justify-center text-white font-bold">
                            {comment.userName?.charAt(0).toUpperCase() || 'U'}
                          </div>
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center mb-1">
                          <span className="font-bold text-frost-800">{comment.userName}</span>
                          <span className="text-xs text-warlord-500 ml-2">
                            {new Date(comment.createdAt).toLocaleDateString('id-ID', {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric'
                            })}
                          </span>
                        </div>
                        <p className="text-warlord-700">{comment.content}</p>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-center text-warlord-500">
                  Belum ada komentar. Jadilah yang pertama berkomentar!
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}