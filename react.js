

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

const API_URL = 'http://localhost:5000/api';

// Configure axios
const api = axios.create({
  baseURL: API_URL
});

api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

function App() {
  const [user, setUser] = useState(null);
  const [listings, setListings] = useState([]);
  const [selectedListing, setSelectedListing] = useState(null);
  const [showLogin, setShowLogin] = useState(false);
  const [showSignup, setShowSignup] = useState(false);

  useEffect(() => {
    fetchListings();
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const res = await api.get('/auth/me');
        setUser(res.data.user);
      } catch (err) {
        localStorage.removeItem('token');
      }
    }
  };

  const fetchListings = async () => {
    try {
      const res = await api.get('/listings');
      setListings(res.data.data);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="App">
      <Header user={user} setShowLogin={setShowLogin} setShowSignup={setShowSignup} />
      <ListingsGrid listings={listings} onSelect={setSelectedListing} />
      
      {showLogin && <LoginModal onClose={() => setShowLogin(false)} onSuccess={setUser} />}
      {showSignup && <SignupModal onClose={() => setShowSignup(false)} onSuccess={setUser} />}
      {selectedListing && <PropertyModal listing={selectedListing} onClose={() => setSelectedListing(null)} />}
    </div>
  );
}

// Header Component
function Header({ user, setShowLogin, setShowSignup }) {
  return (
    <header className="header">
      <div className="container">
        <div className="logo">
          <i className="fas fa-home"></i>
          <span>airbnb</span>
        </div>
        <div className="search-bar">
          <input type="text" placeholder="Search..." />
          <button><i className="fas fa-search"></i></button>
        </div>
        <div className="user-menu">
          {user ? (
            <span>Welcome, {user.name}</span>
          ) : (
            <>
              <button onClick={() => setShowLogin(true)}>Login</button>
              <button onClick={() => setShowSignup(true)}>Signup</button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

// Listings Grid Component
function ListingsGrid({ listings, onSelect }) {
  return (
    <div className="container">
      <div className="listings-grid">
        {listings.map(listing => (
          <div key={listing._id} className="listing-card" onClick={() => onSelect(listing)}>
            <img src={listing.images[0]?.url} alt={listing.title} />
            <h3>{listing.title}</h3>
            <p>{listing.location.city}, {listing.location.country}</p>
            <p className="price">${listing.price} / night</p>
          </div>
        ))}
      </div>
    </div>
  );
}

// Login Modal Component
function LoginModal({ onClose, onSuccess }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/auth/login', { email, password });
      localStorage.setItem('token', res.data.token);
      onSuccess(res.data.user);
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="modal" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <button className="close" onClick={onClose}>&times;</button>
        <h2>Login</h2>
        {error && <div className="error">{error}</div>}
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />
          <button type="submit">Login</button>
        </form>
      </div>
    </div>
  );
}

// Signup Modal Component
function SignupModal({ onClose, onSuccess }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/auth/register', { name, email, password });
      localStorage.setItem('token', res.data.token);
      onSuccess(res.data.user);
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Signup failed');
    }
  };

  return (
    <div className="modal" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <button className="close" onClick={onClose}>&times;</button>
        <h2>Sign Up</h2>
        {error && <div className="error">{error}</div>}
        <form onsubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={e => setName(e.target.value)}
            required
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />
          <button type="submit">Sign Up</button>
        </form>
      </div>
    </div>
  );
}

// Property Modal Component
function PropertyModal({ listing, onClose }) {
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');

  const handleBooking = async () => {
    try {
      await api.post('/bookings', {
        listingId: listing._id,
        checkIn,
        checkOut,
        guests: 2
      });
      alert('Booking confirmed!');
      onClose();
    } catch (err) {
      alert(err.response?.data?.message || 'Booking failed');
    }
  };

  return (
    <div className="modal" onClick={onClose}>
      <div className="modal-content large" onClick={e => e.stopPropagation()}>
        <button className="close" onClick={onClose}>&times;</button>
        <img src={listing.images[0]?.url} alt={listing.title} />
        <h2>{listing.title}</h2>
        <p>{listing.description}</p>
        <div className="booking">
          <h3>${listing.price} / night</h3>
          <input type="date" value={checkIn} onChange={e => setCheckIn(e.target.value)} />
          <input type="date" value={checkOut} onChange={e => setCheckOut(e.target.value)} />
          <button onClick={handleBooking}>Book Now</button>
        </div>
      </div>
    </div>
  );
}


export default App;
