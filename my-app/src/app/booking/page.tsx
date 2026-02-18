'use client';

import React, { useState } from 'react';
import './BookingSystem.css';

const sports = [
  { id: 'football', name: 'Football', price: 1500 },
  { id: 'cricket', name: 'Cricket', price: 2000 },
  { id: 'badminton', name: 'Badminton', price: 800 },
  { id: 'tennis', name: 'Tennis', price: 1200 },
];

const timeSlots = [
  '06:00 AM', '07:00 AM', '08:00 AM', '09:00 AM',
  '04:00 PM', '05:00 PM', '06:00 PM', '07:00 PM',
  '08:00 PM', '09:00 PM', '10:00 PM', '11:00 PM',
];

export default function BookingPage() {
  const [selectedSport, setSelectedSport] = useState(sports[0]);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [image, setImage] = useState<string | null>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const currentPrice = selectedSport.price;

  return (
    <div className="booking-container">
      {/* Hero Section */}
      <section className="hero">
        <img src="/turf-hero.png" alt="Hero Background" className="hero-image" />
        <div className="hero-content">
          <h1 className="hero-title">Book Your Turf</h1>
          <p className="hero-subtitle">Select your sport, date & time and start playing.</p>
          <button 
            className="btn-primary"
            onClick={() => document.getElementById('booking-form')?.scrollIntoView({ behavior: 'smooth' })}
          >
            Book Now
          </button>
        </div>
      </section>

      {/* Main Content */}
      <main className="main-content" id="booking-form">
        <div className="booking-card">
          <h2 className="section-title">Reservation Details</h2>
          
          <div className="field">
            <label className="field-label">Upload Turf Image</label>
            <div className="image-preview">
              {image ? (
                <img src={image} alt="Preview" />
              ) : (
                <div className="upload-placeholder">
                  Click below to upload a preview 
                </div>
              )}
            </div>
            <input 
              type="file" 
              accept="image/*" 
              onChange={handleImageUpload}
              className="input-field"
              style={{ padding: '8px' }}
            />
          </div>

          <div className="field">
            <label className="field-label">Select Sport</label>
            <select 
              className="input-field"
              value={selectedSport.id}
              onChange={(e) => setSelectedSport(sports.find(s => s.id === e.target.value) || sports[0])}
            >
              {sports.map(sport => (
                <option key={sport.id} value={sport.id}>{sport.name}</option>
              ))}
            </select>
          </div>

          <div className="field">
            <label className="field-label">Select Date</label>
            <input 
              type="date" 
              className="input-field"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
            />
          </div>

          <div className="field">
            <label className="field-label">Select Time Slot</label>
            <div className="time-grid">
              {timeSlots.map(slot => (
                <div 
                  key={slot}
                  className={`time-slot ${selectedTime === slot ? 'selected' : ''}`}
                  onClick={() => setSelectedTime(slot)}
                >
                  {slot}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Summary Panel */}
        <aside className="summary-panel">
          <h2 className="section-title">Booking Summary</h2>
          
          <div className="summary-item">
            <span>Sport</span>
            <span style={{ fontWeight: 600 }}>{selectedSport.name}</span>
          </div>
          
          <div className="summary-item">
            <span>Date</span>
            <span style={{ fontWeight: 600 }}>{selectedDate || 'Not selected'}</span>
          </div>
          
          <div className="summary-item">
            <span>Time</span>
            <span style={{ fontWeight: 600 }}>{selectedTime || 'Not selected'}</span>
          </div>

          <div className="summary-total">
            <span>Total Price</span>
            <span>₹{currentPrice}</span>
          </div>

          <button 
            className="btn-primary" 
            style={{ width: '100%', marginTop: '24px' }}
            disabled={!selectedDate || !selectedTime}
            onClick={() => alert('Booking Confirmed!')}
          >
            Confirm Booking
          </button>
          
          {!selectedDate || !selectedTime ? (
            <p className="error-text" style={{ textAlign: 'center', marginTop: '12px' }}>
              Please select date and time to continue
            </p>
          ) : null}
        </aside>
      </main>
    </div>
  );
}
