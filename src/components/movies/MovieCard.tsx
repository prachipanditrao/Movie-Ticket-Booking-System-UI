
"use client";

import type { Movie } from '@/types';
import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CalendarDays, Clock, Ticket } from 'lucide-react';
import { formatDurationFromMs } from '@/lib/utils';
import { useState, useEffect } from 'react';

interface MovieCardProps {
  movie: Movie;
}

export function MovieCard({ movie }: MovieCardProps) {
  const placeholderSrc = `https://placehold.co/400x600.png?text=${encodeURIComponent(movie.name || 'Movie')}`;
  const [currentImageSrc, setCurrentImageSrc] = useState(movie.posterUrl || placeholderSrc);

  useEffect(() => {
    // Update image src if movie.posterUrl changes and is valid
    if (movie.posterUrl) {
      setCurrentImageSrc(movie.posterUrl);
    } else {
      setCurrentImageSrc(placeholderSrc);
    }
  }, [movie.posterUrl, placeholderSrc]);

  return (
    <Card className="flex flex-col overflow-hidden shadow-lg hover:shadow-primary/30 transition-shadow duration-300 h-full">
      <CardHeader className="p-0 relative">
        <Link href={`/movies/${movie.id}`} className="block">
          <Image
            src={currentImageSrc}
            alt={movie.name || 'Movie poster'}
            width={400}
            height={600}
            className="w-full h-auto object-cover aspect-[2/3] group-hover:opacity-90 transition-opacity"
            data-ai-hint="movie poster"
            onError={() => {
              setCurrentImageSrc(placeholderSrc);
            }}
          />
        </Link>
      </CardHeader>
      <CardContent className="p-4 flex-grow">
        <Link href={`/movies/${movie.id}`}>
          <CardTitle className="text-xl font-semibold hover:text-primary transition-colors line-clamp-2 mb-2">
            {movie.name || 'Untitled Movie'}
          </CardTitle>
        </Link>
        <div className="text-sm text-muted-foreground space-y-1">
          <p className="flex items-center"><Ticket className="w-4 h-4 mr-2 text-accent" /> {movie.genre || 'N/A'}</p>
          <p className="flex items-center"><Clock className="w-4 h-4 mr-2 text-accent" /> {formatDurationFromMs(movie.duration)}</p>
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Button asChild className="w-full bg-accent text-accent-foreground hover:bg-accent/90">
          <Link href={`/movies/${movie.id}`}>
            <CalendarDays className="w-4 h-4 mr-2" /> View Showtimes
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
