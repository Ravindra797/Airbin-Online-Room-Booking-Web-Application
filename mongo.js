// seed.js - MongoDB Database Seed Script
// Save as: seed.js
// Run: node seed.js

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// MongoDB Connection
const MONGODB_URI = 'mongodb://localhost:27017/airbnb';

mongoose.connect(MONGODB_URI)
  .then(() => console.log('✅ MongoDB Connected'))
  .catch(err => console.error('❌ MongoDB Error:', err));

// ========== SCHEMAS ==========

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  isHost: Boolean,
  createdAt: { type: Date, default: Date.now }
});

const listingSchema = new mongoose.Schema({
  title: String,
  description: String,
  propertyType: String,
  price: Number,
  location: {
    city: String,
    country: String
  },
  images: [{ url: String }],
  amenities: [String],
  capacity: {
    guests: Number,
    bedrooms: Number,
    beds: Number,
    bathrooms: Number
  },
  host: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  rating: { type: Number, default: 0 },
  reviews: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    rating: Number,
    comment: String,
    createdAt: { type: Date, default: Date.now }
  }],
  createdAt: { type: Date, default: Date.now }
});

const bookingSchema = new mongoose.Schema({
  listing: { type: mongoose.Schema.Types.ObjectId, ref: 'Listing' },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  checkIn: Date,
  checkOut: Date,
  guests: Number,
  totalPrice: Number,
  status: String,
  createdAt: { type: Date, default: Date.now }
});

// Models
const User = mongoose.model('User', userSchema);
const Listing = mongoose.model('Listing', listingSchema);
const Booking = mongoose.model('Booking', bookingSchema);

// ========== SEED DATA ==========

async function seedDatabase() {
  try {
    console.log('🗑️  Clearing database...');
    await User.deleteMany({});
    await Listing.deleteMany({});
    await Booking.deleteMany({});

    // Hash password
    const password = await bcrypt.hash('password123', 10);

    // Create Users
    console.log('👤 Creating users...');
    const users = await User.insertMany([
      {
        name: 'Sarah Johnson',
        email: 'sarah@example.com',
        password: password,
        isHost: true
      },
      {
        name: 'Michael Chen',
        email: 'michael@example.com',
        password: password,
        isHost: true
      },
      {
        name: 'Emma Davis',
        email: 'emma@example.com',
        password: password,
        isHost: true
      },
      {
        name: 'Ketut Sharma',
        email: 'ketut@example.com',
        password: password,
        isHost: true
      },
      {
        name: 'Marie Laurent',
        email: 'marie@example.com',
        password: password,
        isHost: true
      },
      {
        name: 'Ahmed Al-Mansoori',
        email: 'ahmed@example.com',
        password: password,
        isHost: true
      },
      {
        name: 'John Traveler',
        email: 'john@example.com',
        password: password,
        isHost: false
      }
    ]);

    console.log(`✅ Created ${users.length} users`);

    // Create Listings
    console.log('🏠 Creating listings...');
    const listings = await Listing.insertMany([
      {
        title: 'Luxury Beachfront Villa',
        description: 'Stunning ocean views from this modern beachfront property.',
        propertyType: 'Villa',
        price: 450,
        location: {
          city: 'Malibu',
          country: 'United States'
        },
        images: [
          { url: 'https://images.unsplash.com/photo-1505142468610-359e7d316be0?w=800' }
        ],
        amenities: ['WiFi', 'Pool', 'Kitchen', 'Beach Access', 'Parking'],
        capacity: {
          guests: 8,
          bedrooms: 4,
          beds: 5,
          bathrooms: 3
        },
        host: users[0]._id,
        rating: 4.9,
        reviews: [
          {
            user: users[6]._id,
            rating: 5,
            comment: 'Amazing property!',
            createdAt: new Date()
          }
        ]
      },
      {
        title: 'Cozy Mountain Cabin',
        description: 'Perfect mountain retreat with breathtaking views.',
        propertyType: 'Cabin',
        price: 280,
        location: {
          city: 'Aspen',
          country: 'United States'
        },
        images: [
          { url: 'https://images.unsplash.com/photo-1587061949409-02df41d5e562?w=800' }
        ],
        amenities: ['WiFi', 'Fireplace', 'Kitchen', 'Ski Access', 'Hot Tub'],
        capacity: {
          guests: 6,
          bedrooms: 3,
          beds: 4,
          bathrooms: 2
        },
        host: users[1]._id,
        rating: 4.8,
        reviews: []
      },
      {
        title: 'Downtown Loft',
        description: 'Modern loft in the heart of Manhattan.',
        propertyType: 'Loft',
        price: 195,
        location: {
          city: 'New York',
          country: 'United States'
        },
        images: [
          { url: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800' }
        ],
        amenities: ['WiFi', 'Kitchen', 'Workspace', 'Gym', 'Doorman'],
        capacity: {
          guests: 4,
          bedrooms: 2,
          beds: 2,
          bathrooms: 1
        },
        host: users[2]._id,
        rating: 4.7,
        reviews: []
      },
      {
        title: 'Tropical Paradise Bungalow',
        description: 'Secluded bungalow surrounded by rice fields.',
        propertyType: 'House',
        price: 120,
        location: {
          city: 'Ubud',
          country: 'Indonesia'
        },
        images: [
          { url: 'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=800' }
        ],
        amenities: ['WiFi', 'Pool', 'Kitchen', 'Garden', 'Outdoor Shower'],
        capacity: {
          guests: 2,
          bedrooms: 1,
          beds: 1,
          bathrooms: 1
        },
        host: users[3]._id,
        rating: 5.0,
        reviews: []
      },
      {
        title: 'Historic Parisian Apartment',
        description: 'Classic Parisian charm near the Eiffel Tower.',
        propertyType: 'Apartment',
        price: 320,
        location: {
          city: 'Paris',
          country: 'France'
        },
        images: [
          { url: 'https://images.unsplash.com/photo-1502672260066-6bc35f0e1d1e?w=800' }
        ],
        amenities: ['WiFi', 'Kitchen', 'Balcony', 'Elevator'],
        capacity: {
          guests: 4,
          bedrooms: 2,
          beds: 2,
          bathrooms: 1
        },
        host: users[4]._id,
        rating: 4.9,
        reviews: []
      },
      {
        title: 'Desert Oasis Villa',
        description: 'Luxurious villa with stunning desert views.',
        propertyType: 'Villa',
        price: 580,
        location: {
          city: 'Dubai',
          country: 'United Arab Emirates'
        },
        images: [
          { url: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800' }
        ],
        amenities: ['WiFi', 'Pool', 'Kitchen', 'Spa', 'Parking', 'Butler'],
        capacity: {
          guests: 10,
          bedrooms: 5,
          beds: 6,
          bathrooms: 4
        },
        host: users[5]._id,
        rating: 4.8,
        reviews: []
      }
    ]);

    console.log(`✅ Created ${listings.length} listings`);

    // Create Sample Bookings
    console.log('📅 Creating bookings...');
    const bookings = await Booking.insertMany([
      {
        listing: listings[0]._id,
        user: users[6]._id,
        checkIn: new Date('2024-03-15'),
        checkOut: new Date('2024-03-20'),
        guests: 6,
        totalPrice: 2250,
        status: 'confirmed'
      },
      {
        listing: listings[1]._id,
        user: users[6]._id,
        checkIn: new Date('2024-04-10'),
        checkOut: new Date('2024-04-15'),
        guests: 4,
        totalPrice: 1400,
        status: 'confirmed'
      }
    ]);

    console.log(`✅ Created ${bookings.length} bookings`);

    console.log('\n🎉 Database seeded successfully!');
    console.log('\n📊 Summary:');
    console.log(`   Users: ${users.length}`);
    console.log(`   Listings: ${listings.length}`);
    console.log(`   Bookings: ${bookings.length}`);
    console.log('\n👤 Test Credentials:');
    console.log('   Email: sarah@example.com');
    console.log('   Password: password123');
    console.log('\n📝 MongoDB Commands:');
    console.log('   View users: db.users.find()');
    console.log('   View listings: db.listings.find()');
    console.log('   View bookings: db.bookings.find()');

  } catch (error) {
    console.error('❌ Seed Error:', error);
  } finally {
    mongoose.connection.close();
    console.log('\n✅ Connection closed');
    process.exit(0);
  }
}


seedDatabase();

