import 'dotenv/config';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { User, Workspace, Booking } from './src/types.js';

const userSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  role: { type: String, required: true },
  passwordHash: { type: String, required: true },
  createdAt: { type: String, required: true }
});

const workspaceSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  shortDescription: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, required: true },
  pricePerHour: { type: Number, required: true },
  rating: { type: Number, required: true },
  reviewsCount: { type: Number, required: true },
  location: { type: String, required: true },
  image: { type: String, required: true },
  amenities: { type: [String], required: true },
  capacity: { type: Number, required: true },
  ownerId: { type: String, required: true },
  createdAt: { type: String, required: true }
});

const bookingSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  workspaceId: { type: String, required: true },
  userId: { type: String, required: true },
  date: { type: String, required: true },
  startTime: { type: String, required: true },
  durationHours: { type: Number, required: true },
  totalPrice: { type: Number, required: true },
  status: { type: String, required: true },
  createdAt: { type: String, required: true }
});

const UserModel = mongoose.model('User', userSchema);
const WorkspaceModel = mongoose.model('Workspace', workspaceSchema);
const BookingModel = mongoose.model('Booking', bookingSchema);

async function seed() {
  try {
    console.log('Connecting to MongoDB...', process.env.MONGODB_URI?.substring(0, 20) + '...');
    await mongoose.connect(process.env.MONGODB_URI as string);
    console.log('Connected.');
    
    // Check if data already exists
    const usersCount = await UserModel.countDocuments();
    if (usersCount > 0) {
      console.log('Database already contains users. Clearing data...');
      await UserModel.deleteMany({});
      await WorkspaceModel.deleteMany({});
      await BookingModel.deleteMany({});
    }

    // Create Admin User
    const adminSalt = bcrypt.genSaltSync(10);
    const adminHash = bcrypt.hashSync('password123', adminSalt);
    const admin = new UserModel({
      id: 'user-admin',
      name: 'System Admin',
      email: 'admin@deskspace.com',
      role: 'admin',
      passwordHash: adminHash,
      createdAt: new Date().toISOString()
    });
    await admin.save();

    // Create Demo User
    const userSalt = bcrypt.genSaltSync(10);
    const userHash = bcrypt.hashSync('password123', userSalt);
    const user = new UserModel({
      id: 'user-demo',
      name: 'Demo User',
      email: 'user@deskspace.com',
      role: 'user',
      passwordHash: userHash,
      createdAt: new Date().toISOString()
    });
    await user.save();

    console.log('Users created.');

    // Create Workspaces
    const workspaces = [
      {
        id: 'space-1',
        name: 'The Pioneer Tech Hub',
        shortDescription: 'Modern co-working hot desks with fiber internet.',
        description: 'Enjoy blazing fast internet, unlimited coffee, and an inspiring environment.',
        category: 'coworking',
        pricePerHour: 15,
        rating: 4.9,
        reviewsCount: 124,
        location: 'Downtown Seattle',
        image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=1200',
        amenities: ['Fiber WiFi', 'Coffee', 'Ergonomic Desk', 'Phone Booths'],
        capacity: 1,
        ownerId: admin.id,
        createdAt: new Date().toISOString()
      },
      {
        id: 'space-2',
        name: 'Soundwave Podcast Studio',
        shortDescription: 'Acoustically treated studio with RODE mics.',
        description: 'Professional grade audio recording studio perfect for podcasts and voiceovers.',
        category: 'creative_studio',
        pricePerHour: 45,
        rating: 5.0,
        reviewsCount: 32,
        location: 'Capitol Hill, Seattle',
        image: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&q=80&w=1200',
        amenities: ['Acoustic Panels', 'Microphones', 'Mixer', 'Air Conditioning'],
        capacity: 4,
        ownerId: admin.id,
        createdAt: new Date().toISOString()
      },
      {
        id: 'space-3',
        name: 'Executive Boardroom',
        shortDescription: 'High-end meeting room with city views.',
        description: 'Impress your clients with panoramic views and top-tier presentation equipment.',
        category: 'meeting_room',
        pricePerHour: 75,
        rating: 4.8,
        reviewsCount: 45,
        location: 'Bellevue',
        image: 'https://images.unsplash.com/photo-1431540015161-0bf868a2d407?auto=format&fit=crop&q=80&w=1200',
        amenities: ['Projector', 'Whiteboard', 'Catering Optional', 'Teleconferencing'],
        capacity: 12,
        ownerId: admin.id,
        createdAt: new Date().toISOString()
      },
      {
        id: 'space-4',
        name: 'Private Focus Suite',
        shortDescription: 'Quiet private office for deep work.',
        description: 'Lockable office with standing desk, dual monitors, and natural light.',
        category: 'private_office',
        pricePerHour: 30,
        rating: 4.7,
        reviewsCount: 88,
        location: 'South Lake Union',
        image: 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&q=80&w=1200',
        amenities: ['Standing Desk', 'Dual Monitors', 'Whiteboard'],
        capacity: 1,
        ownerId: user.id,
        createdAt: new Date().toISOString()
      }
    ];

    await WorkspaceModel.insertMany(workspaces);
    console.log('Workspaces created.');

    // Create Bookings
    const booking = new BookingModel({
      id: 'booking-1',
      workspaceId: 'space-1',
      userId: user.id,
      date: '2026-08-10',
      startTime: '09:00',
      durationHours: 4,
      totalPrice: 60,
      status: 'confirmed',
      createdAt: new Date().toISOString()
    });
    await booking.save();
    
    console.log('Bookings created.');
    console.log('Database seeding complete!');
    process.exit(0);
  } catch (error) {
    console.error('Seeding error:', error);
    process.exit(1);
  }
}

seed();
