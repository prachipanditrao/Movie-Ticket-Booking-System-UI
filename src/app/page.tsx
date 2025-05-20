"use client";

import { useState, useEffect } from 'react';
import { getMovies } from '@/lib/api';
import { MovieCard } from '@/components/movies/MovieCard';
import type { Movie } from '@/types';
import { Skeleton } from '@/components/ui/skeleton';

// Note: `export const revalidate` is not effective for Client Components
// if data fetching is done client-side as it is now.

export default function HomePage() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadMovies() {
      setIsLoading(true);
      try {
        const fetchedMovies = await getMovies();
        setMovies(fetchedMovies);
        setError(null);
      } catch (e: any) {
        console.error("Failed to fetch movies:", e);
        setError(e.message || "Could not load movies. Please try again later.");
        setMovies([]); // Clear movies on error to avoid showing stale data
      } finally {
        setIsLoading(false);
      }
    }
    loadMovies();
  }, []); // Empty dependency array ensures this runs once on mount

  if (isLoading) {
    return (
      <div>
        <h1 className="text-4xl font-bold mb-8 text-center text-primary tracking-tight">Now Showing</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {Array.from({ length: 5 }).map((_, index) => (
            <div key={index} className="flex flex-col overflow-hidden shadow-lg h-full rounded-lg border bg-card p-0">
              <Skeleton className="w-full aspect-[2/3]" /> {/* Poster */}
              <div className="p-4 flex-grow space-y-2">
                <Skeleton className="h-6 w-3/4" /> {/* Title */}
                <Skeleton className="h-4 w-1/2" /> {/* Genre */}
                <Skeleton className="h-4 w-1/3" /> {/* Duration */}
              </div>
              <div className="p-4 pt-0 mt-2">
                <Skeleton className="h-10 w-full" /> {/* Button */}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-10">
        <h1 className="text-2xl font-semibold text-destructive mb-4">Error Loading Movies</h1>
        <p className="text-muted-foreground">{error}</p>
        {/* Optional: Could add a retry button here */}
      </div>
    );
  }

  if (movies.length === 0) {
    return (
      <div className="text-center py-10">
        <h1 className="text-2xl font-semibold text-primary mb-4">No Movies Available</h1>
        <p className="text-muted-foreground">Please check back later for new movie listings.</p>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-4xl font-bold mb-8 text-center text-primary tracking-tight">Now Showing</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {movies.map((movie) => (
          <MovieCard key={movie.id} movie={movie} />
        ))}
      </div>
    </div>
  );
}
