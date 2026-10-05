const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Fake in-memory data
let rooms = [
  { id: 1, name: "Deluxe Suite", price: 120, available: true },
  { id: 2, name: "Ocean View Room", price: 200, available: true },
  { id: 3, name: "Standard Room", price: 80, available: true },
];

let bookings = [];
let nextBookingId = 1;

// 🏨 Get all rooms
app.get('/api/rooms', (req, res) => {
  res.json(rooms);
});

// 🧾 Create a booking
app.post('/api/bookings', (req, res) => {
  const { room_id, guest_name, email, check_in, check_out } = req.body;
  const room = rooms.find(r => r.id === room_id);

  if (!room || !room.available) {
    return res.status(400).json({ error: "Room not available" });
  }

  const booking = {
    booking_id: nextBookingId++,
    room_id,
    room_name: room.name,
    guest_name,
    email,
    check_in,
    check_out,
    status: "confirmed"
  };

  room.available = false; // Mark room as booked
  bookings.push(booking);

  res.status(201).json(booking);
});

// ✅ Get booking confirmation
app.get('/api/bookings/:id', (req, res) => {
  const booking = bookings.find(b => b.booking_id === parseInt(req.params.id));
  if (!booking) {
    return res.status(404).json({ error: "Booking not found" });
  }
  res.json(booking);
});

// 🛠️ Admin - Get all bookings
app.get('/api/admin/bookings', (req, res) => {
  res.json(bookings);
});

// 🛠️ Admin - Reset availability
app.post('/api/admin/reset', (req, res) => {
  rooms.forEach(room => room.available = true);
  bookings = [];
  nextBookingId = 1;
  res.json({ message: "System reset successfully" });
});

// Start server
const PORT = 4000;
app.listen(PORT, () => console.log(`🚀 Hotel Booking API running on port ${PORT}`));
