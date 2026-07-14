import mongoose from 'mongoose';
import { User, Workspace, Booking } from '../types.js';

mongoose.connect(process.env.MONGODB_URI as string)
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.error('MongoDB Connection Error:', err));

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

export const db = {
  // --- USERS DATABASE ---
  async getUsersRaw(): Promise<any[]> {
    return await UserModel.find({}).lean();
  },

  async findUserByEmail(email: string): Promise<any | null> {
    const user = await UserModel.findOne({ email: new RegExp(`^${email}$`, 'i') }).lean();
    return user || null;
  },

  async findUserById(id: string): Promise<User | null> {
    const user = await UserModel.findOne({ id }).lean() as any;
    if (!user) return null;
    const { passwordHash, _id, __v, ...safeUser } = user;
    return safeUser as User;
  },

  async createUser(user: User & { passwordHash: string }): Promise<User> {
    const newUser = new UserModel(user);
    await newUser.save();
    const { passwordHash, ...safeUser } = user;
    return safeUser as User;
  },

  // --- WORKSPACES DATABASE ---
  async getWorkspaces(): Promise<Workspace[]> {
    const workspaces = await WorkspaceModel.find({}).lean();
    return workspaces.map(({ _id, __v, ...w }: any) => w as Workspace);
  },

  async findWorkspaceById(id: string): Promise<Workspace | null> {
    const workspace = await WorkspaceModel.findOne({ id }).lean() as any;
    if (!workspace) return null;
    const { _id, __v, ...w } = workspace;
    return w as Workspace;
  },

  async createWorkspace(workspace: Workspace): Promise<Workspace> {
    const newWorkspace = new WorkspaceModel(workspace);
    await newWorkspace.save();
    return workspace;
  },

  async deleteWorkspace(id: string): Promise<boolean> {
    const result = await WorkspaceModel.deleteOne({ id });
    return result.deletedCount > 0;
  },

  // --- BOOKINGS DATABASE ---
  async getBookings(): Promise<Booking[]> {
    const bookings = await BookingModel.find({}).lean();
    return bookings.map(({ _id, __v, ...b }: any) => b as Booking);
  },

  async findBookingsByUserId(userId: string): Promise<Booking[]> {
    const bookings = await BookingModel.find({ userId }).lean() as any[];
    const workspaces = await this.getWorkspaces();
    return bookings
      .map(({ _id, __v, ...b }) => ({
        ...b,
        workspace: workspaces.find(w => w.id === b.workspaceId)
      }))
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  },

  async createBooking(booking: Booking): Promise<Booking> {
    const newBooking = new BookingModel(booking);
    await newBooking.save();
    return booking;
  },

  async cancelBooking(bookingId: string, userId: string): Promise<boolean> {
    const result = await BookingModel.updateOne({ id: bookingId, userId }, { status: 'cancelled' });
    return result.modifiedCount > 0;
  }
};
