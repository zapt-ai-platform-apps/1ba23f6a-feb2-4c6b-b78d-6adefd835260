import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation, EffectFade } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import 'swiper/css/effect-fade';
import * as Sentry from '@sentry/browser';

export default function HomePage() {
  const [latestPosts, setLatestPosts] = useState([]);
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch latest posts
        const postsRes = await fetch('/api/posts');
        if (!postsRes.ok) throw new Error('Failed to fetch posts');
        const postsData = await postsRes.json();
        setLatestPosts(postsData.slice(0, 3));
        
        // Fetch upcoming events
        const eventsRes = await fetch('/api/events');
        if (!eventsRes.ok) throw new Error('Failed to fetch events');
        const eventsData = await eventsRes.json();
        setUpcomingEvents(eventsData.slice(0, 3));
        
        // Fetch match results
        const matchesRes = await fetch('/api/matches');
        if (!matchesRes.ok) throw new Error('Failed to fetch matches');
        const matchesData = await matchesRes.json();
        setMatches(matchesData.slice(0, 3));
        
      } catch (error) {
        console.error('Error fetching homepage data:', error);
        Sentry.captureException(error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);
  
  // Carousel items
  const carouselItems = [
    {
      title: 'Kuasai Arena Mobile Legends dengan Frost Warlord',
      subtitle: 'Bergabunglah dengan tim e-sport profesional kami',
      bgImage: 'PLACEHOLDER',
      bgImageAlt: 'Mobile Legends team in competition',
      bgImageRequest: 'professional e-sports team competing in mobile legends'
    },
    {
      title: 'Latihan Rutin dan Profesional',
      subtitle: 'Tingkatkan kemampuan bermainmu bersama pemain terbaik',
      bgImage: 'PLACEHOLDER',
      bgImageAlt: 'Team practice session',
      bgImageRequest: 'e-sports team practicing together at gaming setup'
    },
    {
      title: 'Jadilah Bagian dari Keluarga Frost Warlord',
      subtitle: 'Kompetisi, persahabatan, dan prestasi dalam satu tim',
      bgImage: 'PLACEHOLDER',
      bgImageAlt: 'Team celebration',
      bgImageRequest: 'e-sports team celebrating victory together'
    }
  ];
  
  return (
    <div className="pt-16">
      {/* Hero Carousel */}
      <section className="relative">
        <Swiper
          modules={[Autoplay, Pagination, Navigation, EffectFade]}
          effect="fade"
          spaceBetween={0}
          slidesPerView={1}
          autoplay={{ delay: 5000, disableOnInteraction: false }}
          pagination={{ clickable: true }}
          navigation
          className="h-[70vh] md:h-[80vh]"
        >
          {carouselItems.map((item, index) => (
            <SwiperSlide key={index} className="relative">
              <img src="https://images.unsplash.com/photo-1516880711640-ef7db81be3e1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w2NjQ4Nzh8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBtb2JpbGUlMjBsZWdlbmRzJTIwdGVhbSUyMHBvc2luZyUyMHRvZ2V0aGVyfGVufDB8fHx8MTc0NTU2OTAzM3ww&ixlib=rb-4.0.3&q=80&w=1080" 
                src={item.bgImage} 
                alt={item.bgImageAlt}
                data-image-request={item.bgImageRequest}
                className="absolute inset-0 w-full h-full object-cover"
              />
            </div>
            <div className="md:w-1/2 md:pl-12">
              <h2 className="text-2xl md:text-3xl font-orbitron font-bold mb-6 text-frost-800">
                Tentang Frost Warlord
              </h2>
              <p className="text-warlord-700 mb-4">
                Frost Warlord adalah tim e-sport Mobile Legends yang berkomitmen menjadi yang terdepan di panggung kompetitif. Didirikan pada tahun 2022, tim kami telah berkembang menjadi salah satu tim yang diperhitungkan di Indonesia.
              </p>
              <p className="text-warlord-700 mb-6">
                Kami menyediakan lingkungan profesional bagi para pemain untuk mengembangkan keterampilan mereka, memperluas jaringan, dan berkompetisi di berbagai turnamen Mobile Legends.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-frost-50 p-4 rounded-lg border border-frost-100 text-center">
                  <div className="text-2xl font-bold text-frost-600 mb-1">20+</div>
                  <div className="text-warlord-600">Anggota Aktif</div>
                </div>
                <div className="bg-frost-50 p-4 rounded-lg border border-frost-100 text-center">
                  <div className="text-2xl font-bold text-frost-600 mb-1">15+</div>
                  <div className="text-warlord-600">Turnamen</div>
                </div>
                <div className="bg-frost-50 p-4 rounded-lg border border-frost-100 text-center">
                  <div className="text-2xl font-bold text-frost-600 mb-1">5+</div>
                  <div className="text-warlord-600">Penghargaan</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Team Members */}
      <section className="py-16 bg-gradient-to-r from-frost-900 to-ice-900 text-white">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-orbitron font-bold mb-8 text-center">
            Tim Utama
          </h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
            {['Jungler', 'Gold Lane', 'Mid Lane', 'Exp Lane', 'Roamer'].map((role, index) => (
              <div key={index} className="bg-frost-800 bg-opacity-50 p-4 rounded-lg text-center border border-frost-700">
                <img src="https://images.unsplash.com/photo-1507679799987-c73779587ccf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w2NjQ4Nzh8MHwxfHNlYXJjaHwxfHwlNjBwcm9mZXNzaW9uYWwlMjBtb2JpbGUlMjBsZWdlbmRzJTIwJTI0JTdCcm9sZXxlbnwwfHx8fDE3NDU1NjkwMzR8MA&ixlib=rb-4.0.3&q=80&w=1080" 
                   
                  alt={`${role} player`}
                  data-image-request={`professional mobile legends ${role} player portrait`}
                  className="w-24 h-24 mx-auto rounded-full mb-3 object-cover border-2 border-frost-400"
                />
                <h3 className="font-orbitron font-bold text-lg mb-1">
                  {['Frost King', 'Ice Ranger', 'Cryo Mage', 'Blizzard', 'Glacier'][index]}
                </h3>
                <p className="text-frost-300 mb-2">{role}</p>
                <p className="text-sm text-frost-100">
                  Pro player dengan pengalaman lebih dari 3 tahun
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Latest News */}
      <section className="py-16 bg-frost-50">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-orbitron font-bold mb-8 text-center">
            Berita Terbaru
          </h2>
          
          {loading ? (
            <div className="flex justify-center">
              <div className="frost-loading frost-loading-lg"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {latestPosts.length > 0 ? (
                latestPosts.map(post => (
                  <div key={post.id} className="frost-card transition-transform hover:-translate-y-1 hover:shadow-lg">
                    <div className="h-48 overflow-hidden">
                      <img 
                        src={post.imageUrl || "PLACEHOLDER"} 
                        data-image-request={!post.imageUrl ? "mobile legends gameplay action shot" : ""}
                        alt={post.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="p-4">
                      <div className="text-sm text-frost-600 mb-2">
                        {new Date(post.createdAt).toLocaleDateString()}
                      </div>
                      <h3 className="text-lg font-bold mb-2">{post.title}</h3>
                      <p className="text-warlord-600 mb-4 line-clamp-2">
                        {post.content.slice(0, 120)}...
                      </p>
                      <Link to={`/blog/${post.slug}`} className="text-frost-600 hover:text-frost-800 font-semibold text-sm inline-flex items-center cursor-pointer">
                        Baca Selengkapnya
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </Link>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-3 text-center text-warlord-600">
                  Belum ada berita terbaru.
                </div>
              )}
            </div>
          )}
          
          <div className="text-center mt-8">
            <Link to="/blog" className="inline-block bg-frost-600 hover:bg-frost-700 text-white font-bold py-2 px-6 rounded-lg transition-colors cursor-pointer">
              Lihat Semua Berita
            </Link>
          </div>
        </div>
      </section>
      
      {/* Match Results */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-orbitron font-bold mb-8 text-center">
            Hasil Pertandingan Terbaru
          </h2>
          
          {loading ? (
            <div className="flex justify-center">
              <div className="frost-loading frost-loading-lg"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {matches.length > 0 ? (
                matches.map(match => (
                  <div key={match.id} className="bg-white rounded-lg shadow-md overflow-hidden border border-frost-100">
                    <div className="p-4">
                      <div className="text-sm text-frost-600 mb-2">
                        {new Date(match.matchDate).toLocaleDateString()}
                      </div>
                      <div className="flex justify-between items-center mb-4">
                        <div className="text-center">
                          <div className="font-bold text-xl">FW</div>
                          <div className="font-bold text-2xl text-frost-600">{match.ourScore || "-"}</div>
                        </div>
                        <div className="text-center">VS</div>
                        <div className="text-center">
                          <div className="font-bold text-xl">{match.opponent}</div>
                          <div className="font-bold text-2xl text-warlord-600">{match.opponentScore || "-"}</div>
                        </div>
                      </div>
                      <div className={`text-center py-1 px-2 rounded-full ${
                        match.matchResult === 'win' ? 'bg-green-100 text-green-800' : 
                        match.matchResult === 'loss' ? 'bg-red-100 text-red-800' : 
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {match.matchResult === 'win' ? 'Menang' : 
                         match.matchResult === 'loss' ? 'Kalah' : 
                         'Tertunda'}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-3 text-center text-warlord-600">
                  Belum ada hasil pertandingan.
                </div>
              )}
            </div>
          )}
          
          <div className="text-center mt-8">
            <Link to="/dashboard/matches" className="inline-block bg-frost-600 hover:bg-frost-700 text-white font-bold py-2 px-6 rounded-lg transition-colors cursor-pointer">
              Lihat Semua Pertandingan
            </Link>
          </div>
        </div>
      </section>
      
      {/* Call to Action */}
      <section className="py-16 bg-gradient-to-r from-frost-800 to-ice-800 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-4xl font-orbitron font-bold mb-4">
            Siap Bergabung dengan Frost Warlord?
          </h2>
          <p className="text-lg mb-8 max-w-2xl mx-auto">
            Kami selalu mencari bakat baru untuk bergabung dengan tim kami. Apakah Anda siap untuk mengambil tantangan?
          </p>
          <Link to="/register" className="bg-white text-frost-800 hover:bg-frost-100 font-bold py-3 px-8 rounded-lg transition-colors text-lg cursor-pointer">
            Daftar Sekarang
          </Link>
        </div>
      </section>
    </div>
  );
}