
const mockListings = [
    {
        id: 1,
        title: "Luxury Beachfront Villa",
        location: "Malibu, California",
        price: 450,
        rating: 4.9,
        reviews: 128,
        image: "https://images.unsplash.com/photo-1505142468610-359e7d316be0?w=800",
        host: "Sarah Johnson",
        guests: 8,
        bedrooms: 4,
        beds: 5,
        baths: 3,
        amenities: ["WiFi", "Pool", "Kitchen", "Beach Access", "Parking"],
        description: "Stunning ocean views from this modern beachfront property. Perfect for families or groups looking for a luxurious coastal getaway."
    },
    {
        id: 2,
        title: "Cozy Mountain Cabin",
        location: "Aspen, Colorado",
        price: 280,
        rating: 4.8,
        reviews: 94,
        image: "https://images.unsplash.com/photo-1587061949409-02df41d5e562?w=800",
        host: "Michael Chen",
        guests: 6,
        bedrooms: 3,
        beds: 4,
        baths: 2,
        amenities: ["WiFi", "Fireplace", "Kitchen", "Ski Access", "Hot Tub"],
        description: "Perfect mountain retreat with breathtaking views. Close to ski slopes and hiking trails."
    },
    {
        id: 3,
        title: "Downtown Loft",
        location: "New York, NY",
        price: 195,
        rating: 4.7,
        reviews: 156,
        image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800",
        host: "Emma Davis",
        guests: 4,
        bedrooms: 2,
        beds: 2,
        baths: 1,
        amenities: ["WiFi", "Kitchen", "Workspace", "Gym", "Doorman"],
        description: "Modern loft in the heart of Manhattan. Walking distance to subways, restaurants, and attractions."
    },
    {
        id: 4,
        title: "Tropical Paradise Bungalow",
        location: "Bali, Indonesia",
        price: 120,
        rating: 5.0,
        reviews: 203,
        image: "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=800",
        host: "Ketut Sharma",
        guests: 2,
        bedrooms: 1,
        beds: 1,
        baths: 1,
        amenities: ["WiFi", "Pool", "Kitchen", "Garden", "Outdoor Shower"],
        description: "Secluded bungalow surrounded by rice fields. Experience authentic Balinese culture and hospitality."
    },
    {
        id: 5,
        title: "Historic Parisian Apartment",
        location: "Paris, France",
        price: 320,
        rating: 4.9,
        reviews: 87,
        image: "https://images.unsplash.com/photo-1502672260066-6bc35f0e1d1e?w=800",
        host: "Marie Laurent",
        guests: 4,
        bedrooms: 2,
        beds: 2,
        baths: 1,
        amenities: ["WiFi", "Kitchen", "Balcony", "Elevator"],
        description: "Classic Parisian charm near the Eiffel Tower. Beautifully decorated with vintage furniture and modern amenities."
    },
    {
        id: 6,
        title: "Desert Oasis Villa",
        location: "Dubai, UAE",
        price: 580,
        rating: 4.8,
        reviews: 62,
        image: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800",
        host: "Ahmed Al-Mansoori",
        guests: 10,
        bedrooms: 5,
        beds: 6,
        baths: 4,
        amenities: ["WiFi", "Pool", "Kitchen", "Spa", "Parking", "Butler"],
        description: "Luxurious villa with stunning desert views. Private pool, spa, and 24/7 butler service included."
    }
];

// ========== State Management ==========
let currentUser = null;
let wishlist = [];
let currentListings = [...mockListings];

// ========== DOM Elements ==========
const userMenuBtn = document.getElementById('userMenuBtn');
const userMenu = document.getElementById('userMenu');
const loginBtn = document.getElementById('loginBtn');
const signupBtn = document.getElementById('signupBtn');
const loginModal = document.getElementById('loginModal');
const signupModal = document.getElementById('signupModal');
const propertyModal = document.getElementById('propertyModal');
const closeLogin = document.getElementById('closeLogin');
const closeSignup = document.getElementById('closeSignup');
const closeProperty = document.getElementById('closeProperty');
const loginForm = document.getElementById('loginForm');
const signupForm = document.getElementById('signupForm');
const listingsGrid = document.getElementById('listingsGrid');
const searchLocation = document.getElementById('searchLocation');
const checkIn = document.getElementById('checkIn');
const checkOut = document.getElementById('checkOut');

// ========== Initialize App ==========
document.addEventListener('DOMContentLoaded', () => {
    renderListings(currentListings);
    setupEventListeners();
    loadUserFromStorage();
});

// ========== Event Listeners ==========
function setupEventListeners() {
    // User menu toggle
    userMenuBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        userMenu.classList.toggle('active');
    });

    // Close menu when clicking outside
    document.addEventListener('click', () => {
        userMenu.classList.remove('active');
    });

    // Modal controls
    loginBtn.addEventListener('click', () => {
        loginModal.classList.add('active');
        userMenu.classList.remove('active');
    });

    signupBtn.addEventListener('click', () => {
        signupModal.classList.add('active');
        userMenu.classList.remove('active');
    });

    closeLogin.addEventListener('click', () => {
        loginModal.classList.remove('active');
    });

    closeSignup.addEventListener('click', () => {
        signupModal.classList.remove('active');
    });

    closeProperty.addEventListener('click', () => {
        propertyModal.classList.remove('active');
    });

    // Close modals on outside click
    [loginModal, signupModal, propertyModal].forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.remove('active');
            }
        });
    });

    // Form submissions
    loginForm.addEventListener('submit', handleLogin);
    signupForm.addEventListener('submit', handleSignup);

    // Search functionality
    searchLocation.addEventListener('input', handleSearch);
    
    // Search button
    document.querySelector('.search-btn').addEventListener('click', handleSearch);
}

// ========== Render Functions ==========
function renderListings(listings) {
    listingsGrid.innerHTML = '';
    
    listings.forEach(listing => {
        const card = createListingCard(listing);
        listingsGrid.appendChild(card);
    });
}

function createListingCard(listing) {
    const card = document.createElement('div');
    card.className = 'listing-card';
    
    const isInWishlist = wishlist.includes(listing.id);
    
    card.innerHTML = `
        <div class="listing-image">
            <img src="${listing.image}" alt="${listing.title}">
            <button class="wishlist-btn ${isInWishlist ? 'active' : ''}" data-id="${listing.id}">
                <i class="fas fa-heart"></i>
            </button>
        </div>
        <div class="listing-info">
            <div class="listing-header">
                <div class="listing-title">${listing.title}</div>
                <div class="listing-rating">
                    <i class="fas fa-star"></i>
                    ${listing.rating}
                </div>
            </div>
            <div class="listing-location">${listing.location}</div>
            <div class="listing-details">${listing.guests} guests · ${listing.bedrooms} bedrooms</div>
            <div class="listing-price">
                <strong>$${listing.price}</strong> <span>night</span>
            </div>
        </div>
    `;
    
    // Add click event to open property details
    card.addEventListener('click', (e) => {
        if (!e.target.closest('.wishlist-btn')) {
            showPropertyDetails(listing);
        }
    });
    
    // Wishlist button event
    const wishlistBtn = card.querySelector('.wishlist-btn');
    wishlistBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleWishlist(listing.id);
    });
    
    return card;
}

function showPropertyDetails(listing) {
    const propertyContent = document.getElementById('propertyContent');
    
    propertyContent.innerHTML = `
        <div class="property-images">
            <img src="${listing.image}" alt="${listing.title}">
        </div>
        <div class="property-header">
            <h2>${listing.title}</h2>
            <div class="property-meta">
                <span><i class="fas fa-star"></i> ${listing.rating} (${listing.reviews} reviews)</span>
                <span><i class="fas fa-map-marker-alt"></i> ${listing.location}</span>
            </div>
        </div>
        <div class="property-description">
            <h3>About this place</h3>
            <p>${listing.description}</p>
        </div>
        <div class="property-amenities">
            <h3>What this place offers</h3>
            <ul>
                ${listing.amenities.map(amenity => `<li><i class="fas fa-check"></i> ${amenity}</li>`).join('')}
            </ul>
        </div>
        <div class="property-host">
            <h3>Hosted by ${listing.host}</h3>
            <p>${listing.guests} guests · ${listing.bedrooms} bedrooms · ${listing.beds} beds · ${listing.baths} baths</p>
        </div>
        <div class="property-booking">
            <h3>$${listing.price} / night</h3>
            <div class="booking-dates">
                <input type="date" id="bookCheckIn" placeholder="Check-in">
                <input type="date" id="bookCheckOut" placeholder="Check-out">
            </div>
            <button class="btn-book" onclick="handleBooking(${listing.id})">Reserve</button>
        </div>
    `;
    
    propertyModal.classList.add('active');
}

// ========== Authentication ==========
function handleLogin(e) {
    e.preventDefault();
    
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    
    // Mock authentication
    currentUser = {
        name: email.split('@')[0],
        email: email
    };
    
    saveUserToStorage();
    loginModal.classList.remove('active');
    updateUIForLoggedInUser();
    
    showNotification('Welcome back!');
}

function handleSignup(e) {
    e.preventDefault();
    
    const name = document.getElementById('signupName').value;
    const email = document.getElementById('signupEmail').value;
    const password = document.getElementById('signupPassword').value;
    
    // Mock registration
    currentUser = {
        name: name,
        email: email
    };
    
    saveUserToStorage();
    signupModal.classList.remove('active');
    updateUIForLoggedInUser();
    
    showNotification('Account created successfully!');
}

function updateUIForLoggedInUser() {
    if (currentUser) {
        document.getElementById('loginBtn').textContent = currentUser.name;
        document.getElementById('signupBtn').textContent = 'Log out';
        document.getElementById('signupBtn').onclick = handleLogout;
    }
}

function handleLogout() {
    currentUser = null;
    wishlist = [];
    localStorage.removeItem('airbnbUser');
    localStorage.removeItem('airbnbWishlist');
    
    document.getElementById('loginBtn').textContent = 'Log in';
    document.getElementById('signupBtn').textContent = 'Sign up';
    document.getElementById('signupBtn').onclick = null;
    
    renderListings(currentListings);
    showNotification('Logged out successfully');
}

// ========== Wishlist Functions ==========
function toggleWishlist(listingId) {
    if (!currentUser) {
        loginModal.classList.add('active');
        return;
    }
    
    const index = wishlist.indexOf(listingId);
    
    if (index > -1) {
        wishlist.splice(index, 1);
        showNotification('Removed from wishlist');
    } else {
        wishlist.push(listingId);
        showNotification('Added to wishlist');
    }
    
    localStorage.setItem('airbnbWishlist', JSON.stringify(wishlist));
    renderListings(currentListings);
}

// ========== Booking Function ==========
function handleBooking(listingId) {
    if (!currentUser) {
        propertyModal.classList.remove('active');
        loginModal.classList.add('active');
        return;
    }
    
    const checkIn = document.getElementById('bookCheckIn').value;
    const checkOut = document.getElementById('bookCheckOut').value;
    
    if (!checkIn || !checkOut) {
        showNotification('Please select check-in and check-out dates', 'error');
        return;
    }
    
    const listing = mockListings.find(l => l.id === listingId);
    const nights = Math.ceil((new Date(checkOut) - new Date(checkIn)) / (1000 * 60 * 60 * 24));
    const totalPrice = nights * listing.price;
    
    // Mock booking
    const booking = {
        listingId,
        checkIn,
        checkOut,
        nights,
        totalPrice,
        status: 'confirmed'
    };
    
    console.log('Booking created:', booking);
    
    propertyModal.classList.remove('active');
    showNotification(`Booking confirmed! Total: $${totalPrice}`);
}

// ========== Search Function ==========
function handleSearch() {
    const searchQuery = searchLocation.value.toLowerCase();
    
    if (!searchQuery) {
        currentListings = [...mockListings];
    } else {
        currentListings = mockListings.filter(listing => 
            listing.title.toLowerCase().includes(searchQuery) ||
            listing.location.toLowerCase().includes(searchQuery)
        );
    }
    
    renderListings(currentListings);
}

// ========== Local Storage ==========
function saveUserToStorage() {
    localStorage.setItem('airbnbUser', JSON.stringify(currentUser));
}

function loadUserFromStorage() {
    const savedUser = localStorage.getItem('airbnbUser');
    const savedWishlist = localStorage.getItem('airbnbWishlist');
    
    if (savedUser) {
        currentUser = JSON.parse(savedUser);
        updateUIForLoggedInUser();
    }
    
    if (savedWishlist) {
        wishlist = JSON.parse(savedWishlist);
    }
}

// ========== Notification System ==========
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#4CAF50' : '#f44336'};
        color: white;
        padding: 16px 24px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 3000;
        animation: slideIn 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Add animation styles
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);