
import type { Movie, Show, BookingPayload, BookingConfirmation, Theatre } from '@/types';
import { getToken } from './auth';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "https://movie-ticket-booking-system-b2uj.onrender.com";

async function fetchWrapper<T>(url: string, options: RequestInit = {}): Promise<T> {
  const token = getToken();
  
  const headers = new Headers(options.headers || {});

  if (!headers.has('Accept')) {
    headers.set('Accept', 'application/json');
  }

  if (typeof window === 'undefined') { // Server-side request
    if (!headers.has('User-Agent')) {
      headers.set('User-Agent', 'Mozilla/5.0 (compatible; CineBookerApp/1.0; +http://localhost:3000)');
    }
  }
  
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  const fetchOptions: RequestInit = {
    ...options,
    headers,
  };

  let response: Response;
  try {
    response = await fetch(url, fetchOptions);
  } catch (networkError: any) {
    console.error(`Network error in fetchWrapper for ${url}:`, networkError);
    let hostname;
    try {
      hostname = new URL(url).hostname;
    } catch (e) {
      hostname = "the API server";
    }
    if (networkError.message === "Failed to fetch") {
      throw new Error(
        `Unable to connect to ${hostname}. Please check your internet connection and try again. If the problem persists, the server may be unavailable.`
      );
    }
    throw new Error(networkError.message || `An unexpected network error occurred while trying to reach ${url}`);
  }

  if (!response.ok) {
    let errorMessage = `HTTP error! status: ${response.status}`;
    try {
      const errorData: any = await response.json(); 
      if (errorData && typeof errorData.message === 'string' && errorData.message.trim() !== '') {
        errorMessage = errorData.message; 
      } else if (response.statusText) {
        errorMessage = `${errorMessage} - ${response.statusText}`;
      }
    } catch (jsonError) {
      if (response.statusText && !errorMessage.includes(response.statusText)) {
         errorMessage = `${errorMessage} - ${response.statusText}`;
      }
      console.warn(`API error response for ${url} was not valid JSON or did not contain a message field. Status: ${response.status}. URL: ${url}`);
    }
    throw new Error(errorMessage);
  }
  return response.json() as Promise<T>;
}

export async function getMovies(): Promise<Movie[]> {
  return fetchWrapper<Movie[]>(`${API_BASE_URL}/bookings/movies`);
}

export async function getMovieById(movieId: string): Promise<Movie | null> {
  try {
    // Assuming API doesn't have a direct /movies/{id} endpoint,
    // so fetching all and filtering. If it does, this can be optimized.
    const movies = await getMovies();
    return movies.find(movie => movie.id === movieId) || null;
  } catch (error) {
    console.error(`Failed to fetch movie ${movieId}:`, error);
    throw error; 
  }
}

export async function getShows(): Promise<Show[]> {
  return fetchWrapper<Show[]>(`${API_BASE_URL}/bookings/shows`);
}

export async function getShowsByMovieId(movieId: string): Promise<Show[]> {
  const allShows = await getShows();
  return allShows.filter(show => show.movieId === movieId);
}

export async function getShowById(showId: string): Promise<Show | null> {
   try {
    const shows = await getShows(); // Assuming no direct /shows/{id} endpoint
    return shows.find(show => show.id === showId) || null;
  } catch (error) {
    console.error(`Failed to fetch show ${showId}:`, error);
    throw error;
  }
}

export async function bookTickets(payload: BookingPayload): Promise<BookingConfirmation> {
  return fetchWrapper<BookingConfirmation>(`${API_BASE_URL}/bookings`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });
}

export async function getTheatreById(theatreId: string): Promise<Theatre | null> {
  try {
    // Expect the API to return an array of theatres, even if it's just one for the given ID
    const theatres = await fetchWrapper<Theatre[]>(`${API_BASE_URL}/bookings/theatres/${theatreId}`);
    if (theatres && theatres.length > 0) {
      // Assuming the first theatre in the array is the correct one for the given ID
      return theatres[0];
    }
    console.warn(`Theatre with ID ${theatreId} not found or API returned an empty array.`);
    return null;
  } catch (error) {
    console.error(`Failed to fetch theatre ${theatreId}:`, error);
    throw error; // Re-throw the error to be handled by the calling component
  }
}
