'use client';

import Footer from '@/components/Footer';
import Navbar from '@/components/Navbar';
import Link from 'next/link';
import './Home.css';

const featuredTurfs = [
  {
    id: 1,
    name: 'Apex Arena',
    location: 'Bandra, Mumbai',
    rating: 4.8,
    reviews: 124,
    price: 1500,
    category: 'Football',
    image: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?q=80\u0026w=1000\u0026auto=format\u0026fit=crop',
  },
  {
    id: 2,
    name: 'The Box',
    location: 'Indiranagar, Bangalore',
    rating: 4.9,
    reviews: 89,
    price: 1200,
    category: 'Cricket',
    image: 'https://images.unsplash.com/photo-1531415074968-036ba1b575da?q=80\u0026w=1000\u0026auto=format\u0026fit=crop',
  },
  {
    id: 3,
    name: 'Smash Point',
    location: 'Gachibowli, Hyderabad',
    rating: 4.7,
    reviews: 156,
    price: 800,
    category: 'Badminton',
    image: 'https://images.unsplash.com/photo-1626224580194-860c36f6756f?q=80\u0026w=1000\u0026auto=format\u0026fit=crop',
  },
  {
    id: 4,
    name: 'Vantage Court',
    location: 'Vasant Kunj, Delhi',
    rating: 4.6,
    reviews: 210,
    price: 2000,
    category: 'Tennis',
    image: 'https://images.unsplash.com/photo-1622279457486-62dcc4a4bd13?q=80\u0026w=1000\u0026auto=format\u0026fit=crop',
  },
  {
    id: 5,
    name: 'Velocity Turf',
    location: 'Koramangala, Bangalore',
    rating: 4.9,
    reviews: 312,
    price: 1800,
    category: 'Football',
    image: 'https://images.unsplash.com/photo-1529900748604-07564a03e7a6?q=80\u0026w=1000\u0026auto=format\u0026fit=crop',
  },
  {
    id: 6,
    name: 'Strikers Hub',
    location: 'Powai, Mumbai',
    rating: 4.5,
    reviews: 78,
    price: 1400,
    category: 'Football',
    image: 'https://images.unsplash.com/photo-1431324155629-1a6eda1eed2d?q=80\u0026w=1000\u0026auto=format\u0026fit=crop',
  },
];

export default function Home() {
  return (
    <div className="home-container">
      <Navbar />
      
      {/* Hero Section */}
      <section className="home-hero">
        <img src="/turf-hero.png" alt="PlayHere Hero" className="home-hero-img" />
        <div className="home-hero-content">
          <h1>Play Anywhere. Anywhere.</h1>
          <p>Book the best sports turfs in your city in seconds.</p>
          
          <div className="search-bar">
            <input 
              type="text" 
              placeholder="Search by city, turf name or sport..." 
              className="search-input"
            />
            <button className="search-btn">Search</button>
          </div>
        </div>
      </section>

      {/* Featured Turfs */}
      <section className="section-container">
        <div className="section-header">
          <div>
            <p style={{ fontWeight: 600, color: '#666', marginBottom: '8px' }}>DISCOVER</p>
            <h2>Featured Turfs</h2>
          </div>
          <Link href="/locations" style={{ fontWeight: 600, textDecoration: 'underline' }}>View all cities</Link>
        </div>

        <div className="turf-grid">
          {featuredTurfs.map((turf) => (
            <div key={turf.id} className="turf-card">
              <img src={turf.image} alt={turf.name} className="turf-card-img" />
              <div className="turf-card-content">
                <div className="turf-meta">
                  <span className="turf-category">{turf.category}</span>
                  <div className="turf-rating">
                    <span className="star">★</span> {turf.rating} 
                    <span style={{ fontWeight: 400, color: '#666' }}>({turf.reviews})</span>
                  </div>
                </div>
                <h3 className="turf-title">{turf.name}</h3>
                <div className="turf-location">
                   {turf.location}
                </div>
                
                <div className="turf-price">
                  <div className="price-tag">
                    ₹{turf.price} <span>/ hr</span>
                  </div>
                  <Link href="/booking" className="book-btn">
                    Book Now
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Stats Section */}
      <section style={{ backgroundColor: '#000', color: '#fff', padding: '80px 0' }}>
        <div className="section-container" style={{ margin: 0, maxWidth: '100%' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', textAlign: 'center', gap: '40px' }}>
                <div>
                    <h2 style={{ fontSize: '3rem', marginBottom: '10px' }}>500+</h2>
                    <p style={{ opacity: 0.7 }}>Premium Turfs</p>
                </div>
                <div>
                    <h2 style={{ fontSize: '3rem', marginBottom: '10px' }}>20+</h2>
                    <p style={{ opacity: 0.7 }}>Cities</p>
                </div>
                <div>
                    <h2 style={{ fontSize: '3rem', marginBottom: '10px' }}>10k+</h2>
                    <p style={{ opacity: 0.7 }}>Happy Players</p>
                </div>
                <div>
                    <h2 style={{ fontSize: '3rem', marginBottom: '10px' }}>4.9/5</h2>
                    <p style={{ opacity: 0.7 }}>Average Rating</p>
                </div>
            </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
