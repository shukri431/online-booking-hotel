

// Import  functions from global.js
import { islogin, navaAction, Activenav, ProctectRoutes } from "./global.js";

const API_URL = 'https://api.npoint.io/bb8116c79b1db2eff123';

const FALLBACK_IMAGE_FILENAME = "images/room.jpg"; 
const FALLBACK_IMAGE_PATH = `./${FALLBACK_IMAGE_FILENAME}`;

//  Elements
const roomsContainer = document.getElementById('rooms-container');
const priceSort = document.getElementById('price-sort');
const roomTypeFilter = document.getElementById('room-type-filter');
const ratingFilter = document.getElementById('rating-filter');
const roomsHeroSection = document.getElementById('rooms-hero-section'); 

let allRooms = [];


window.bookRoom = function(roomId, roomName) {
    const loginStatus = islogin();
    
    if (!loginStatus.login) {
      
        Swal.fire({
            title: 'Login Required',
            text: "You must be logged in to proceed with a booking.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Go to Login',
            cancelButtonText: 'Stay Here',
            confirmButtonColor: '#007bff'
        }).then((result) => {
            if (result.isConfirmed) {
                window.location.href = "login.html";
            }
        });
        return;
    }

    Swal.fire({
        title: 'Confirm Booking?',
        html: `You are about to book the **${roomName}**.<br>Proceed to the check-out page?`,
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Yes, Book Now! 🚀',
        cancelButtonText: 'No, Cancel',
        confirmButtonColor: '#28a745',
        cancelButtonColor: '#dc3545'   
    }).then((result) => {
        if (result.isConfirmed) {
          
            const bookingUrl = `Booking.html?roomId=${roomId}&roomName=${encodeURIComponent(roomName)}`;
            window.location.href = bookingUrl;
        }
    });
};

function renderRooms(roomsToDisplay) {
    roomsContainer.innerHTML = ''; 

    if (roomsToDisplay.length === 0) {
        roomsContainer.innerHTML = '<p class="no-results">No rooms match your current filters. Try adjusting your selections.</p>';
        return;
    }

    roomsToDisplay.forEach(room => {
        const card = document.createElement('div');
        card.classList.add('card');
        
        const starsHtml = '⭐'.repeat(room.rating);
        const specificImagePath = `./images/${room.id}.jpg`;
        
        const errorFallbackChain = 
            `this.onerror=null; ` + 
            `this.src='./images/${room.id}.jpeg';` + 
            `this.onerror=function(){this.src='${FALLBACK_IMAGE_PATH}'};`;

        card.innerHTML = `
            <img src="${specificImagePath}" 
                 alt="${room.name}" 
                 loading="lazy"
                 onerror="${errorFallbackChain}">
            <h3>${room.name} (${room.type})</h3>
            <p>${room.description}</p>
            <div class="room-details">
                <span class="price">$${room.price} per night</span>
                <span class="rating">${starsHtml}</span>
            </div>
            <button onclick="bookRoom(${room.id}, '${room.name.replace(/'/g, "\\'")}')">Book Now</button>
        `;
        
        roomsContainer.appendChild(card);
    });
}


 
function generateDummyRooms(startId, endId) {
    const types = ["Single", "Double", "Suite", "Family", "Deluxe", "Twin"];
    const descriptions = [
        "A quiet space with high-speed internet.",
        "Luxurious master bedroom with marble bath.",
        "Spacious living area and separate dining.",
        "Two connecting rooms ideal for larger groups."
    ];
    const dummyRooms = [];

    for (let id = startId; id <= endId; id++) {
        const type = types[id % types.length];
        const description = descriptions[id % descriptions.length];
        const rating = (id % 5) + 1; 
        const price = 150 + (id * 5) + (Math.floor(Math.random() * 50));
        
        dummyRooms.push({
            id: id,
            name: `${type} Comfort ${id}`,
            description: description,
            price: price,
            rating: rating,
            type: type,
            image: '' 
        });
    }
    return dummyRooms;
}


async function fetchRooms() {
    try {
        roomsContainer.innerHTML = '<div class="loading-message">Loading rooms...</div>';
        const response = await fetch(API_URL);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        let fetchedRooms = await response.json();

    
        const dummyRooms = generateDummyRooms(fetchedRooms.length + 1, 100);
       
        allRooms = fetchedRooms.concat(dummyRooms);
        
        populateTypeFilter();
        applyFiltersAndSort(); 
    } catch (error) {
        console.error('Could not fetch rooms:', error);
        roomsContainer.innerHTML = '<p class="error-message">Failed to load room data. Please ensure the API link is correct and you have an internet connection.</p>';
    }
}


function populateTypeFilter() {
    const types = [...new Set(allRooms.map(room => room.type))].sort();
    roomTypeFilter.querySelectorAll('option:not(:first-child)').forEach(option => option.remove());

    types.forEach(type => {
        const option = document.createElement('option');
        option.value = type;
        option.textContent = type;
        roomTypeFilter.appendChild(option);
    });
}


function applyFiltersAndSort() {
    let filteredRooms = [...allRooms]; 
    
 
    const selectedType = roomTypeFilter.value;
    if (selectedType && selectedType !== 'Room Type') {
        filteredRooms = filteredRooms.filter(room => room.type === selectedType);
    }
    
 
    const selectedRating = ratingFilter.value;
    if (selectedRating && selectedRating !== 'Rating') {
        const minRating = parseInt(selectedRating);
        filteredRooms = filteredRooms.filter(room => room.rating >= minRating);
    }

 
    const sortOrder = priceSort.value;
    if (sortOrder === 'low_to_high') {
        filteredRooms.sort((a, b) => a.price - b.price);
    } else if (sortOrder === 'high_to_low') {
        filteredRooms.sort((a, b) => b.price - a.price);
    }
    
    renderRooms(filteredRooms);
}



function initializeRoomsPage() {

    const authActionLinks = document.querySelectorAll(".login-link-wrapper, .signup-link-wrapper"); 
    const userInfoElement = document.querySelector(".nav-user-info"); 
    const logoutElement = document.querySelector(".logged-in-action"); 
    navaAction(authActionLinks, userInfoElement, logoutElement);

    const navLinks = document.querySelectorAll("a.nav-link");
    Activenav(navLinks);
    

    if (islogin().login && roomsHeroSection) {
        roomsHeroSection.style.display = 'block';
    }


    priceSort.addEventListener('change', applyFiltersAndSort);
    roomTypeFilter.addEventListener('change', applyFiltersAndSort);
    ratingFilter.addEventListener('change', applyFiltersAndSort);
    fetchRooms(); 
}

// Run initialization
document.addEventListener('DOMContentLoaded', initializeRoomsPage);