

import { ProctectRoutes } from "./global.js";

const API_URL = 'https://api.npoint.io/bb8116c79b1db2eff123';

const FALLBACK_IMAGE_PATH = `./images/room.jpg`;

let currentRoom = null;
let roomPricePerNight = 0;

const checkInDateInput = document.getElementById('check-in');
const checkOutDateInput = document.getElementById('check-out');
const totalPriceDisplay = document.getElementById('total-price-display');
const bookingForm = document.getElementById('booking-form');

function calculateNights(dateIn, dateOut) {
if (!dateIn || !dateOut) return 0;


    const oneDay = 24 * 60 * 60 * 1000;
    const d1 = new Date(dateIn);
 const d2 = new Date(dateOut);

 if (d2 <= d1) return 0;

 const diffDays = Math.round(Math.abs((d2 - d1) / oneDay));
 return diffDays;
}

function updateTotalPrice() {
 const checkIn = checkInDateInput.value;
 const checkOut = checkOutDateInput.value;
 const nights = calculateNights(checkIn, checkOut);

 if (nights > 0 && roomPricePerNight > 0) {
  const totalPrice = nights * roomPricePerNight;
  totalPriceDisplay.textContent = `$${totalPrice.toLocaleString('en-US')}`;
 } else {
  totalPriceDisplay.textContent = `$0`;
 }
}

function getRoomIdFromUrl() {
 const params = new URLSearchParams(window.location.search);
 return parseInt(params.get('roomId'));
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

// function that returns room details 
function displayRoomDetails(room) {
 const detailsContainer = document.getElementById('room-details-container');
 const summaryRoomName = document.getElementById('summary-room-name');
 const summaryRoomPrice = document.getElementById('summary-room-price');
 const roomTypeSelect = document.getElementById('selected-room-type');
 
 currentRoom = room;
 roomPricePerNight = room.price;

 let specificImagePath = `./images/${room.id}.jpg`;
 
 const errorFallbackChain = 
  `this.onerror=null; ` + 
  `this.src='./images/${room.id}.jpeg';` + 
  `this.onerror=function(){this.src='${FALLBACK_IMAGE_PATH}'};`;
 
 detailsContainer.innerHTML = `
  <img src="${specificImagePath}" 
    alt="${room.name}" 
    onerror="${errorFallbackChain}">
  <h2 id="room-name-display">${room.name}</h2>
  <p>${room.description}</p>
  <span id="room-price-display">$${room.price} per night</span>
 `;

 summaryRoomName.textContent = room.name;
 summaryRoomPrice.textContent = `$${room.price}`;
 roomTypeSelect.textContent = room.type;
 roomTypeSelect.value = room.type;

 updateTotalPrice();
}

async function loadBookingDetails() {
  const roomId = getRoomIdFromUrl();
  const detailsContainer = document.getElementById('room-details-container');

  if (!roomId) {
    detailsContainer.innerHTML = '<p class="error-message">Error: No room selected. Please go back to the <a href="Rooms.html">Rooms page</a>.</p>';
    return;
  }

  try {
    detailsContainer.innerHTML = '<div class="loading-message">Loading room details...</div>';
    
    const response = await fetch(API_URL);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    let allRooms = await response.json();

    const dummyRooms = generateDummyRooms(allRooms.length + 1, 100);
    allRooms = allRooms.concat(dummyRooms);
    
    const room = allRooms.find(r => r.id === roomId);

    if (room) {
      displayRoomDetails(room);
    } else {
      detailsContainer.innerHTML = `<p class="error-message">Room with ID ${roomId} not found.</p>`;
    }

  } catch (error) {
    console.error('Could not load room details:', error);
    detailsContainer.innerHTML = '<p class="error-message">Failed to load room data. Please check connection and API link.</p>';
  }
}

checkInDateInput.addEventListener('change', updateTotalPrice);
checkOutDateInput.addEventListener('change', updateTotalPrice);

bookingForm.addEventListener('submit', function(event) {
  event.preventDefault();

  const nights = calculateNights(checkInDateInput.value, checkOutDateInput.value);
  const totalPrice = nights * roomPricePerNight;

  if (nights <= 0) {
    Swal.fire({
      icon: 'error',
      title: 'Booking Failed!',
      text: "Please select valid Check-in and Check-out dates. (Check-out must be after Check-in).",
      confirmButtonColor: '#d33'
    });
    return;
  }

  if (currentRoom) {
    const confirmationHtml = 
      `You've successfully booked the **${currentRoom.name}**!<br><br>` +
      `**Nights:** ${nights}<br>` +
      `**Total Price:** <span style="color: #4CAF50; font-weight: bold;">$${totalPrice.toLocaleString('en-US')}</span><br><br>` +
      `We look forward to hosting you!`;
    
    Swal.fire({
      title: 'Booking Confirmed! 🎉',
      html: confirmationHtml,
      icon: 'success',
      confirmButtonText: 'Go to Home Page',
      confirmButtonColor: '#007BFF' 
    })
    .then((result) => {
      if (result.isConfirmed) {
        window.location.href = "index.html"; 
      }
    });
    
  } else {
    alert("Booking failed: Room details were not loaded properly.");
  }
});


document.addEventListener('DOMContentLoaded', () => {
    ProctectRoutes(); 
    loadBookingDetails();
});