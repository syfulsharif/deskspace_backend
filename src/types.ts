/**
 * Shared Type Definitions for Co-working Space & Studio Finder
 */

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  createdAt: string;
}

export interface Workspace {
  id: string;
  name: string;
  description: string;
  shortDescription: string;
  category: 'coworking' | 'private_office' | 'meeting_room' | 'creative_studio';
  pricePerHour: number;
  rating: number;
  reviewsCount: number;
  location: string;
  image: string;
  amenities: string[];
  capacity: number;
  ownerId: string;
  createdAt: string;
}

export interface Booking {
  id: string;
  workspaceId: string;
  userId: string;
  date: string;
  startTime: string;
  durationHours: number;
  totalPrice: number;
  status: 'confirmed' | 'cancelled';
  createdAt: string;
  workspace?: Workspace; // Joined workspace details for rendering
}

export interface APIResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  pagination?: {
    currentPage: number;
    totalPages: number;
    totalCount: number;
    limit: number;
  };
}
