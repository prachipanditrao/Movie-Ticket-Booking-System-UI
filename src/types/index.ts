
export interface Movie {
  id: string;
  name: string;
  genre: string;
  duration: number; // in milliseconds
  description: string;
  posterUrl: string;
}

export interface Show {
  id: string;
  movieId: string;
  theatreId: string;
  theatreName?: string; // Optional: if API sometimes includes it directly
  showTime: string; // ISO date string
  seatAvailability?: Record<string, boolean>; // e.g., {"A1": true, "A2": false}
  price?: number; // Price per seat for this show, if uniform
}

export interface Seat {
  id: string;
  seatNumber: string;
  status: 'available' | 'booked' | 'unavailable' | 'selected'; // Added 'selected' for UI state
  showId: string;
  price?: number; // Optional: if seats have different prices
}

export interface User {
  id: string;
  username: string;
  email: string;
  // Add other user fields as needed
}

export interface AuthToken {
  token: string;
  user?: User; // User details might be part of the token or a separate response
}

export interface ApiError {
  message: string;
  details?: Record<string, any>;
}

export interface BookingPayload {
  userId: string;
  showId: string;
  seatNumbers: string[];
}

export interface BookingConfirmation {
  bookingId?: string; // Example field, adjust based on actual API response
  message: string;
  // other relevant booking details from the API response
}

export interface Theatre {
  id: string;
  name: string;
  // Add any other relevant theatre properties if your API provides them
  // e.g., location: string, capacity: number, etc.
}
