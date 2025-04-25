import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import * as Sentry from '@sentry/browser';

export default function BlogPage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/posts');
        
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        
        const data = await response.json();
        setPosts(data);
      } catch (err) {
        console.error('Error fetching posts:', err);
        Sentry.captureException(err);
        setError('Gagal memuat artikel. Silakan coba lagi nanti.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchPosts();
  }, []);
  
  return (
    <div className="py-24">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl md:text-4xl font-orbitron font-bold mb-8 text-center">
          Blog &amp; Berita Frost Warlord
        </h1>
        
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="frost-loading frost-loading-lg"></div>
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-md text-center">
            {error}
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-12 text-warlord-600">
            Belum ada artikel yang dipublikasikan.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {posts.map(post => (
              <article key={post.id} className="frost-card hover:shadow-lg transition-shadow duration-300">
                <div className="h-48 overflow-hidden">
                  <img 
                    src={post.imageUrl || 'PLACEHOLDER'} 
                    data-image-request={!post.imageUrl ? "mobile legends gameplay action shot" : ""}
                    alt={post.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-6">
                  <div className="flex items-center text-sm text-warlord-500 mb-3">
                    <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    {new Date(post.createdAt).toLocaleDateString('id-ID', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric'
                    })}
                  </div>
                  <h2 className="text-xl font-bold mb-3">
                    <Link to={`/blog/${post.slug}`} className="text-frost-800 hover:text-frost-600 transition-colors">
                      {post.title}
                    </Link>
                  </h2>
                  <p className="text-warlord-600 mb-4">
                    {post.content.substring(0, 120)}...
                  </p>
                  <Link to={`/blog/${post.slug}`} className="inline-block text-frost-600 font-medium hover:text-frost-800 transition-colors">
                    Baca Selengkapnya →
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}