import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/modules/auth/AuthProvider';
import * as Sentry from '@sentry/browser';

export default function DashboardPage() {
  const { user } = useAuth();
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [latestPosts, setLatestPosts] = useState([]);
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch upcoming events
        const eventsRes = await fetch('/api/events');
        if (!eventsRes.ok) throw new Error('Failed to fetch events');
        const eventsData = await eventsRes.json();
        setUpcomingEvents(eventsData.slice(0, 3));
        
        // Fetch latest posts
        const postsRes = await fetch('/api/posts');
        if (!postsRes.ok) throw new Error('Failed to fetch posts');
        const postsData = await postsRes.json();
        setLatestPosts(postsData.slice(0, 3));
        
        // Fetch match results
        const matchesRes = await fetch('/api/matches');
        if (!matchesRes.ok) throw new Error('Failed to fetch matches');
        const matchesData = await matchesRes.json();
        setMatches(matchesData.slice(0, 3));
        
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        Sentry.captureException(error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);
  
  return (
    <div>
      <h1 className="text-2xl font-orbitron font-bold mb-6">Dashboard</h1>
      
      {/* Welcome Card */}
      <div className="frost-card p-6 mb-8 bg-gradient-to-r from-frost-700 to-frost-900 text-white">
        <h2 className="text-xl font-bold mb-2">Selamat Datang, {user?.name || 'Anggota'}!</h2>
        <p className="mb-4">
          Selamat datang di dashboard tim Frost Warlord. Di sini Anda dapat melihat jadwal latihan, hasil pertandingan, dan berinteraksi dengan anggota tim lainnya.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          <Link to="/dashboard/chat" className="bg-white/10 hover:bg-white/20 p-4 rounded-lg flex items-center justify-center transition duration-200">
            <svg className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            Chat Tim
          </Link>
          <Link to="/dashboard/schedule" className="bg-white/10 hover:bg-white/20 p-4 rounded-lg flex items-center justify-center transition duration-200">
            <svg className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            Jadwal Latihan
          </Link>
          <Link to="/dashboard/uploads" className="bg-white/10 hover:bg-white/20 p-4 rounded-lg flex items-center justify-center transition duration-200">
            <svg className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
            </svg>
            Upload Highlight
          </Link>
        </div>
      </div>
      
      {/* Dashboard Sections */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Upcoming Events */}
        <div className="frost-card overflow-hidden">
          <div className="bg-frost-800 text-white p-4">
            <h2 className="font-orbitron font-bold">Jadwal Mendatang</h2>
          </div>
          <div className="p-4">
            {loading ? (
              <div className="flex justify-center py-4">
                <div className="frost-loading"></div>
              </div>
            ) : upcomingEvents.length > 0 ? (
              <div className="space-y-4">
                {upcomingEvents.map(event => (
                  <div key={event.id} className="border-b border-frost-100 pb-3 last:border-0 last:pb-0">
                    <div className="font-medium text-frost-800">{event.title}</div>
                    <div className="text-sm text-warlord-600 flex items-center mt-1">
                      <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      {new Date(event.startTime).toLocaleDateString('id-ID', { 
                        day: 'numeric', month: 'long', year: 'numeric'
                      })}
                    </div>
                    <div className="text-sm text-warlord-600 flex items-center mt-1">
                      <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {new Date(event.startTime).toLocaleTimeString('id-ID', { 
                        hour: '2-digit', minute: '2-digit'
                      })}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-4 text-warlord-600">
                Belum ada jadwal mendatang.
              </div>
            )}
            <div className="mt-4 text-center">
              <Link to="/dashboard/schedule" className="text-frost-600 hover:text-frost-800 font-medium text-sm">
                Lihat Semua Jadwal →
              </Link>
            </div>
          </div>
        </div>
        
        {/* Latest Posts */}
        <div className="frost-card overflow-hidden">
          <div className="bg-frost-800 text-white p-4">
            <h2 className="font-orbitron font-bold">Berita Terbaru</h2>
          </div>
          <div className="p-4">
            {loading ? (
              <div className="flex justify-center py-4">
                <div className="frost-loading"></div>
              </div>
            ) : latestPosts.length > 0 ? (
              <div className="space-y-4">
                {latestPosts.map(post => (
                  <div key={post.id} className="border-b border-frost-100 pb-3 last:border-0 last:pb-0">
                    <div className="font-medium text-frost-800">{post.title}</div>
                    <div className="text-sm text-warlord-600 mt-1">
                      {post.content.substring(0, 100)}...
                    </div>
                    <Link to={`/blog/${post.slug}`} className="text-frost-600 hover:text-frost-800 text-sm font-medium mt-2 inline-block">
                      Baca Selengkapnya →
                    </Link>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-4 text-warlord-600">
                Belum ada berita terbaru.
              </div>
            )}
            <div className="mt-4 text-center">
              <Link to="/blog" className="text-frost-600 hover:text-frost-800 font-medium text-sm">
                Lihat Semua Berita →
              </Link>
            </div>
          </div>
        </div>
        
        {/* Match Results */}
        <div className="frost-card overflow-hidden">
          <div className="bg-frost-800 text-white p-4">
            <h2 className="font-orbitron font-bold">Hasil Pertandingan</h2>
          </div>
          <div className="p-4">
            {loading ? (
              <div className="flex justify-center py-4">
                <div className="frost-loading"></div>
              </div>
            ) : matches.length > 0 ? (
              <div className="space-y-4">
                {matches.map(match => (
                  <div key={match.id} className="border-b border-frost-100 pb-3 last:border-0 last:pb-0">
                    <div className="flex justify-between items-center">
                      <div className="font-medium text-frost-800">Frost Warlord vs {match.opponent}</div>
                      <div className={`text-xs font-medium px-2 py-1 rounded ${
                        match.matchResult === 'win' ? 'bg-green-100 text-green-800' :
                        match.matchResult === 'loss' ? 'bg-red-100 text-red-800' :
                        'bg-warlord-100 text-warlord-800'
                      }`}>
                        {match.matchResult === 'win' ? 'Menang' : 
                         match.matchResult === 'loss' ? 'Kalah' : 
                         'Seri'}
                      </div>
                    </div>
                    <div className="text-sm text-warlord-600 flex items-center mt-1">
                      <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      {new Date(match.matchDate).toLocaleDateString('id-ID', { 
                        day: 'numeric', month: 'long', year: 'numeric'
                      })}
                    </div>
                    <div className="text-sm font-medium mt-1">
                      Skor: {match.ourScore} - {match.opponentScore}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-4 text-warlord-600">
                Belum ada hasil pertandingan.
              </div>
            )}
            <div className="mt-4 text-center">
              <Link to="/dashboard/matches" className="text-frost-600 hover:text-frost-800 font-medium text-sm">
                Lihat Semua Pertandingan →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}