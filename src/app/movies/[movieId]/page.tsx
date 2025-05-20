
"use client";

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import type { Movie, Show } from '@/types';
import { getMovieById, getShowsByMovieId } from '@/lib/api';
import Image from 'next/image';
import { ShowTimeCard } from '@/components/movies/ShowTimeCard';
import { Badge } from '@/components/ui/badge';
import { Clock, TicketIcon, CalendarDays, AlertTriangle, ChevronLeft } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { formatDurationFromMs } from '@/lib/utils';

export default function MovieDetailsPage() {
  const params = useParams<{ movieId: string }>();
  const movieId = params.movieId;
  const router = useRouter();

  const [movie, setMovie] = useState<Movie | null>(null);
  const [shows, setShows] = useState<Show[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const placeholderBase = `https://placehold.co/400x600.png`;
  const [currentImageSrc, setCurrentImageSrc] = useState(placeholderBase);


  useEffect(() => {
    if (movie) {
      const movieSpecificPlaceholder = `${placeholderBase}?text=${encodeURIComponent(movie.name || 'Movie')}`;
      setCurrentImageSrc(movie.posterUrl || movieSpecificPlaceholder);
    } else {
      setCurrentImageSrc(placeholderBase);
    }
  }, [movie, placeholderBase]);

  useEffect(() => {
    if (!movieId) {
      setIsLoading(false);
      setError("Movie ID is missing.");
      return;
    }

    async function loadMovieDetails() {
      setIsLoading(true);
      setError(null);
      try {
        const fetchedMovie = await getMovieById(movieId as string);
        
        if (fetchedMovie) {
          setMovie(fetchedMovie);
          const movieSpecificPlaceholder = `${placeholderBase}?text=${encodeURIComponent(fetchedMovie.name || 'Movie')}`;
      setCurrentImageSrc(fetchedMovie.posterUrl || movieSpecificPlaceholder);
          const fetchedShows = await getShowsByMovieId(movieId as string);
          setShows(fetchedShows);
        } else {
          setError("Movie not found.");
        }
      } catch (e: any) {
        console.error(`Failed to fetch movie details for ${movieId}:`, e);
        setError(e.message || "Could not load movie details. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    }

    loadMovieDetails();
  }, [movieId, placeholderBase]);

  if (isLoading) {
    return (
      <div className="max-w-5xl mx-auto animate-pulse">
        <Button variant="outline" className="mb-6 group opacity-50 cursor-not-allowed" disabled>
          <ChevronLeft className="mr-2 h-4 w-4" />
          Back to Movies
        </Button>
        <div className="md:flex md:space-x-8">
          <div className="md:w-1/3 mb-6 md:mb-0">
            <Skeleton className="rounded-lg shadow-xl w-full aspect-[2/3] h-auto object-cover" />
          </div>
          <div className="md:w-2/3">
            <Skeleton className="h-10 w-3/4 mb-3 bg-muted" /> {/* Title */}
            <div className="flex items-center space-x-3 mb-4">
              <Skeleton className="h-6 w-20 bg-muted rounded-full" /> {/* Badge */}
              <Skeleton className="h-6 w-24 bg-muted" /> {/* Duration */}
            </div>
            <Skeleton className="h-4 w-full mb-2 bg-muted" /> {/* Description line 1 */}
            <Skeleton className="h-4 w-full mb-2 bg-muted" /> {/* Description line 2 */}
            <Skeleton className="h-4 w-3/4 mb-6 bg-muted" /> {/* Description line 3 */}
            
            <Separator className="my-6 bg-border" />

            <Skeleton className="h-8 w-1/3 mb-6 bg-muted" /> {/* Showtimes title */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[1, 2, 3].map(i => (
                <div key={i} className="rounded-lg border bg-card p-4 space-y-3">
                  <Skeleton className="h-6 w-1/2 bg-muted" />
                  <Skeleton className="h-4 w-3/4 bg-muted" />
                  <Skeleton className="h-4 w-1/2 bg-muted" />
                  <Skeleton className="h-10 w-full bg-muted mt-2" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center text-center py-10 min-h-[calc(100vh-15rem)]">
        <AlertTriangle className="w-16 h-16 text-destructive mb-6" />
        <h1 className="text-3xl font-bold text-destructive mb-4">Error Loading Movie</h1>
        <p className="text-muted-foreground max-w-md">{error}</p>
         <Button variant="outline" onClick={() => router.back()} className="mt-8">
          <ChevronLeft className="mr-2 h-4 w-4" />
          Go Back
        </Button>
      </div>
    );
  }

  if (!movie) {
    return (
       <div className="flex flex-col items-center justify-center text-center py-10 min-h-[calc(100vh-15rem)]">
        <AlertTriangle className="w-16 h-16 text-amber-500 mb-6" />
        <h1 className="text-3xl font-bold text-amber-600 mb-4">Movie Not Found</h1>
        <p className="text-muted-foreground max-w-md">The movie you are looking for could not be found.</p>
        <Button variant="outline" onClick={() => router.back()} className="mt-8">
          <ChevronLeft className="mr-2 h-4 w-4" />
          Go Back
        </Button>
      </div>
    );
  }
  
  const movieSpecificPlaceholder = `${placeholderBase}?text=${encodeURIComponent(movie.name || 'Movie')}`;

  return (
    <div className="max-w-5xl mx-auto">
      <Button variant="outline" onClick={() => router.back()} className="mb-6 group">
        <ChevronLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform" />
        Back to Movies
      </Button>
      <div className="md:flex md:space-x-8">
        <div className="md:w-1/3 mb-6 md:mb-0">
          <Image
            src={currentImageSrc}
            alt={movie.name || 'Movie poster detail'}
            width={400}
            height={600}
            className="rounded-lg shadow-xl w-full h-auto object-cover"
            priority // Good for LCP if this is the main image
            data-ai-hint="movie poster detail"
            onError={() => {
              setCurrentImageSrc(movieSpecificPlaceholder);
            }}
          />
        </div>
        <div className="md:w-2/3">
          <h1 className="text-4xl font-bold text-primary mb-3 tracking-tight">{movie.name || 'Untitled Movie'}</h1>
          <div className="flex items-center space-x-3 mb-4 text-muted-foreground">
            <Badge variant="secondary" className="text-sm"><TicketIcon className="w-4 h-4 mr-1.5" />{movie.genre || 'N/A'}</Badge>
            <span className="flex items-center"><Clock className="w-4 h-4 mr-1.5" /> {formatDurationFromMs(movie.duration)}</span>
          </div>
          <p className="text-lg text-foreground/80 leading-relaxed mb-6">{movie.description || 'No description available.'}</p>
          
          <Separator className="my-6" />

          <h2 className="text-3xl font-semibold text-primary mb-6 flex items-center">
            <CalendarDays className="w-7 h-7 mr-3 text-accent" /> Showtimes
          </h2>
          {shows.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {shows.sort((a, b) => new Date(a.showTime).getTime() - new Date(b.showTime).getTime()).map((show) => (
                <ShowTimeCard key={show.id} show={show} movieId={movie!.id} />
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground">No showtimes available for this movie at the moment.</p>
          )}
        </div>
      </div>
    </div>
  );
}
