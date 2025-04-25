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
              <img src="https://images.unsplash.com/photo-1531545514256-b1400bc00f31?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w2NjQ4Nzh8MHwxfHNlYXJjaHw0fHxwcm9mZXNzaW9uYWwlMjBtb2JpbGUlMjBsZWdlbmRzJTIwZS1zcG9ydHMlMjB0ZWFtJTIwcG9zaW5nJTIwdG9nZXRoZXIlMjBpbiUyMGdhbWluZyUyMGplcnNleXN8ZW58MHx8fHwxNzQ1NTY3MzUyfDA&ixlib=rb-4.0.3&q=80&w=1080" 
                src={item.bgImage} 
                alt={item.bgImageAlt}
                data-image-request={item.bgImageRequest}
                className="absolute inset-0 w-full h-full object-cover"
              />
            </div>
            <div className="md:w-1/2">
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
                      <img src="https://images.unsplash.com/photo-1533022139390-e31c488d69e2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w2NjQ4Nzh8MHwxfHNlYXJjaHwxMHx8JTYwbW9iaWxlJTIwbGVnZW5kcyUyMCUyNCU3QnJvbGUudG9Mb3dlckNhc2UlMjglMjl8ZW58MHx8fHwxNzQ1NTY3MzUzfDA&ixlib=rb-4.0.3&q=80&w=1080" 
                        src={post.imageUrl || "PLACEHOLDER"} 
                        data-image-request={!post.imageUrl ? "mobile legends gameplay action shot" : ""}
                        alt={post.title}
                        className="w-full h-full object-cover"
                      />
                </div>
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
    </div>
  );
}