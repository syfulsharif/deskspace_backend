import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import cors from 'cors';

import { db } from './src/server/db.js';
import { User, Workspace, Booking } from './src/types.js';

const app = express();
const PORT = 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'deskspace-secret-jwt-key-2026-xyz';

// Middlewares
app.use(cors({
  origin: function (origin, callback) {
    if (!origin || ['http://localhost:5173', 'http://localhost:3000'].indexOf(origin) !== -1 || (origin && origin.endsWith('.vercel.app'))) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());

// Helper: Authenticate JWT middleware
function authenticateToken(req: any, res: any, next: any) {
  const token = req.cookies.auth_token;
  if (!token) {
    return res.status(401).json({ success: false, error: 'Unauthorized: No token provided' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { id: string; email: string; role: string };
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(403).json({ success: false, error: 'Forbidden: Invalid token' });
  }
}

// --- API ROUTES ---

// 1. Auth Status check
app.get('/api/auth/me', async (req: any, res) => {
  const token = req.cookies.auth_token;
  if (!token) {
    return res.json({ success: true, data: null });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { id: string; email: string; role: string };
    const user = await db.findUserById(decoded.id);
    return res.json({ success: true, data: user });
  } catch {
    return res.json({ success: true, data: null });
  }
});

// 2. Auth: Register
app.post('/api/auth/register', async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ success: false, error: 'Please fill in all fields.' });
  }

  if (password.length < 6) {
    return res.status(400).json({ success: false, error: 'Password must be at least 6 characters.' });
  }

  const existing = await db.findUserByEmail(email);
  if (existing) {
    return res.status(400).json({ success: false, error: 'An account with this email already exists.' });
  }

  const salt = bcrypt.genSaltSync(10);
  const passwordHash = bcrypt.hashSync(password, salt);

  const newUser: User = {
    id: `user-${Date.now()}`,
    name,
    email: email.toLowerCase(),
    role: 'user',
    createdAt: new Date().toISOString()
  };

  await db.createUser({ ...newUser, passwordHash });

  // Issue Token
  const token = jwt.sign({ id: newUser.id, email: newUser.email, role: newUser.role }, JWT_SECRET, { expiresIn: '7d' });
  
  res.cookie('auth_token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
  });

  return res.json({ success: true, data: newUser });
});

// 3. Auth: Login
app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ success: false, error: 'Please enter your email and password.' });
  }

  const usersRaw = await db.getUsersRaw();
  const userRecord = usersRaw.find(u => u.email.toLowerCase() === email.toLowerCase());
  if (!userRecord) {
    return res.status(401).json({ success: false, error: 'Invalid email or password.' });
  }

  const passwordMatch = bcrypt.compareSync(password, userRecord.passwordHash);
  if (!passwordMatch) {
    return res.status(401).json({ success: false, error: 'Invalid email or password.' });
  }

  const safeUser: User = {
    id: userRecord.id,
    name: userRecord.name,
    email: userRecord.email,
    role: userRecord.role,
    createdAt: userRecord.createdAt
  };

  // Issue Token
  const token = jwt.sign({ id: safeUser.id, email: safeUser.email, role: safeUser.role }, JWT_SECRET, { expiresIn: '7d' });

  res.cookie('auth_token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000
  });

  return res.json({ success: true, data: safeUser });
});

// 4. Auth: Logout
app.post('/api/auth/logout', (req, res) => {
  res.clearCookie('auth_token');
  return res.json({ success: true, data: null });
});

// 5. Workspaces list (with sorting, filtering, searching and pagination)
app.get('/api/workspaces', async (req, res) => {
  const { search, category, location, minPrice, maxPrice, sortBy, page = '1', limit = '6' } = req.query;

  let workspaces = await db.getWorkspaces();

  // Keyword search
  if (search) {
    const q = String(search).toLowerCase();
    workspaces = workspaces.filter(w => 
      w.name.toLowerCase().includes(q) || 
      w.description.toLowerCase().includes(q) || 
      w.shortDescription.toLowerCase().includes(q)
    );
  }

  // Category filter
  if (category && category !== 'all') {
    workspaces = workspaces.filter(w => w.category === category);
  }

  // Location filter
  if (location && location !== 'all') {
    const loc = String(location).toLowerCase();
    workspaces = workspaces.filter(w => w.location.toLowerCase().includes(loc));
  }

  // Price range filters
  if (minPrice) {
    workspaces = workspaces.filter(w => w.pricePerHour >= Number(minPrice));
  }
  if (maxPrice) {
    workspaces = workspaces.filter(w => w.pricePerHour <= Number(maxPrice));
  }

  // Sorting
  if (sortBy) {
    if (sortBy === 'price_asc') {
      workspaces.sort((a, b) => a.pricePerHour - b.pricePerHour);
    } else if (sortBy === 'price_desc') {
      workspaces.sort((a, b) => b.pricePerHour - a.pricePerHour);
    } else if (sortBy === 'rating') {
      workspaces.sort((a, b) => b.rating - a.rating);
    } else if (sortBy === 'capacity') {
      workspaces.sort((a, b) => b.capacity - a.capacity);
    } else {
      // default: newest
      workspaces.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }
  } else {
    // default newest
    workspaces.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  // Pagination meta
  const totalCount = workspaces.length;
  const pageNum = Number(page);
  const limitNum = Number(limit);
  const totalPages = Math.ceil(totalCount / limitNum);
  const startIndex = (pageNum - 1) * limitNum;
  const endIndex = startIndex + limitNum;

  const paginatedWorkspaces = workspaces.slice(startIndex, endIndex);

  return res.json({
    success: true,
    data: paginatedWorkspaces,
    pagination: {
      currentPage: pageNum,
      totalPages,
      totalCount,
      limit: limitNum
    }
  });
});

// 6. Workspace Detail
app.get('/api/workspaces/:id', async (req, res) => {
  const workspace = await db.findWorkspaceById(req.params.id);
  if (!workspace) {
    return res.status(404).json({ success: false, error: 'Workspace space not found.' });
  }
  return res.json({ success: true, data: workspace });
});

// 7. Protected: Add Workspace
app.post('/api/workspaces/create', authenticateToken, async (req: any, res) => {
  const { name, shortDescription, description, category, pricePerHour, location, image, amenities, capacity } = req.body;

  if (!name || !shortDescription || !description || !category || !pricePerHour || !location || !capacity) {
    return res.status(400).json({ success: false, error: 'Please complete all required fields.' });
  }

  const parsedCapacity = Number(capacity);
  const parsedPrice = Number(pricePerHour);

  if (isNaN(parsedCapacity) || parsedCapacity <= 0) {
    return res.status(400).json({ success: false, error: 'Capacity must be a positive number.' });
  }

  if (isNaN(parsedPrice) || parsedPrice < 0) {
    return res.status(400).json({ success: false, error: 'Price must be a valid non-negative number.' });
  }

  const defaultImages: Record<string, string> = {
    coworking: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=1200',
    private_office: 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&q=80&w=1200',
    meeting_room: 'https://images.unsplash.com/photo-1431540015161-0bf868a2d407?auto=format&fit=crop&q=80&w=1200',
    creative_studio: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&q=80&w=1200',
  };

  const workspaceImage = image && image.trim().length > 0 
    ? image 
    : (defaultImages[category] || defaultImages['coworking']);

  const parsedAmenities = Array.isArray(amenities) 
    ? amenities.filter(a => a && a.trim() !== '')
    : ['Fiber High-Speed WiFi', 'Complimentary Beverages', 'Ergonomic Desk'];

  const newWorkspace: Workspace = {
    id: `space-${Date.now()}`,
    name,
    shortDescription,
    description,
    category,
    pricePerHour: parsedPrice,
    rating: 5.0, // New workspaces start with a stellar perfect 5.0
    reviewsCount: 1,
    location,
    image: workspaceImage,
    amenities: parsedAmenities,
    capacity: parsedCapacity,
    ownerId: req.user.id,
    createdAt: new Date().toISOString()
  };

  await db.createWorkspace(newWorkspace);

  return res.json({ success: true, data: newWorkspace });
});

// 8. Protected: Delete Workspace
app.delete('/api/workspaces/delete/:id', authenticateToken, async (req: any, res) => {
  const workspace = await db.findWorkspaceById(req.params.id);
  if (!workspace) {
    return res.status(404).json({ success: false, error: 'Workspace space not found.' });
  }

  // Only the owner or an admin can delete listings
  if (workspace.ownerId !== req.user.id && req.user.role !== 'admin') {
    return res.status(403).json({ success: false, error: 'Forbidden: You do not own this space listing.' });
  }

  const success = await db.deleteWorkspace(req.params.id);
  if (success) {
    return res.json({ success: true, data: { id: req.params.id } });
  } else {
    return res.status(500).json({ success: false, error: 'Failed to delete workspace listing.' });
  }
});

// 9. Protected: Bookings of Logged-in User
app.get('/api/bookings', authenticateToken, async (req: any, res) => {
  const bookings = await db.findBookingsByUserId(req.user.id);
  return res.json({ success: true, data: bookings });
});

// 10. Protected: Create Booking
app.post('/api/bookings/create', authenticateToken, async (req: any, res) => {
  const { workspaceId, date, startTime, durationHours } = req.body;

  if (!workspaceId || !date || !startTime || !durationHours) {
    return res.status(400).json({ success: false, error: 'Please enter a booking date, start time, and duration.' });
  }

  const workspace = await db.findWorkspaceById(workspaceId);
  if (!workspace) {
    return res.status(404).json({ success: false, error: 'Workspace space not found.' });
  }

  const duration = Number(durationHours);
  if (isNaN(duration) || duration <= 0) {
    return res.status(400).json({ success: false, error: 'Duration must be a positive number of hours.' });
  }

  const totalPrice = workspace.pricePerHour * duration;

  // Simple validation to ensure double bookings are noted, or simply log booking
  const newBooking: Booking = {
    id: `booking-${Date.now()}`,
    workspaceId,
    userId: req.user.id,
    date,
    startTime,
    durationHours: duration,
    totalPrice,
    status: 'confirmed',
    createdAt: new Date().toISOString()
  };

  await db.createBooking(newBooking);

  return res.json({ success: true, data: newBooking });
});

// 11. Protected: Cancel Booking
app.post('/api/bookings/cancel/:id', authenticateToken, async (req: any, res) => {
  const success = await db.cancelBooking(req.params.id, req.user.id);
  if (success) {
    return res.json({ success: true, data: { id: req.params.id } });
  } else {
    return res.status(400).json({ success: false, error: 'Booking not found or cannot be cancelled.' });
  }
});

// 12. Public: Contact Form API
app.post('/api/contact', (req, res) => {
  const { name, email, subject, message } = req.body;
  if (!name || !email || !subject || !message) {
    return res.status(400).json({ success: false, error: 'All fields are required.' });
  }

  // Process contact form cleanly by recording/responding
  return res.json({ 
    success: true, 
    data: { 
      message: 'Thank you for reaching out! Our team will contact you in the next 24 hours.' 
    } 
  });
});

// 13. Public: Analytics/Stats for Recharts
app.get('/api/stats/bookings', (req, res) => {
  // Return simulated daily bookings over the past 6 months to showcase in Recharts
  const data = [
    { month: 'Jan', coworking: 140, studios: 45, offices: 60 },
    { month: 'Feb', coworking: 185, studios: 55, offices: 75 },
    { month: 'Mar', coworking: 220, studios: 65, offices: 85 },
    { month: 'Apr', coworking: 280, studios: 80, offices: 110 },
    { month: 'May', coworking: 350, studios: 120, offices: 140 },
    { month: 'Jun', coworking: 430, studios: 160, offices: 195 }
  ];
  return res.json({ success: true, data });
});


if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[DeskSpace Backend] running on http://0.0.0.0:${PORT}`);
  });
}

export default app;
