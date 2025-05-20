
"use client";

import type { Show, Theatre } from '@/types';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CalendarClock, MonitorPlay, Ticket } from 'lucide-react'; 
import { format } from 'date-fns';
import { useState, useEffect } from 'react';
import { getTheatreById } from '@/lib/api';

interface ShowTimeCardProps {
  show: Show;
  movieId: string;
}

export function ShowTimeCard({ show, movieId }: ShowTimeCardProps) {
  const showDateTime = new Date(show.showTime);
  const [theatreDisplayName, setTheatreDisplayName] = useState<string>(show.theatreName || show.theatreId || 'N/A');
  const [isLoadingTheatre, setIsLoadingTheatre] = useState<boolean>(false);

  useEffect(() => {
    if (show.theatreName) {
      setTheatreDisplayName(show.theatreName);
    } else if (show.theatreId) {
      setIsLoadingTheatre(true);
      setTheatreDisplayName('Loading...'); 
      getTheatreById(show.theatreId)
        .then((theatreData: Theatre | null) => { // Expect Theatre or null
          if (theatreData && theatreData.name) {
            setTheatreDisplayName(theatreData.name);
          } else {
            // Fallback to ID if name is not in response or theatreData is null
            console.warn(`Theatre name not found for ID ${show.theatreId}, using ID as fallback.`);
            setTheatreDisplayName(show.theatreId); 
          }
        })
        .catch((error) => {
          console.error(`Failed to fetch theatre name for ID ${show.theatreId}:`, error);
          // Fallback to theatreId on error
          setTheatreDisplayName(show.theatreId);
        })
        .finally(() => {
          setIsLoadingTheatre(false);
        });
    } else {
      setTheatreDisplayName('N/A'); // No theatreName and no theatreId
    }
  }, [show.theatreName, show.theatreId]);

  return (
    <Card className="shadow-md hover:shadow-lg transition-shadow duration-300">
      <CardHeader>
        <CardTitle className="text-xl text-primary flex items-center">
          <CalendarClock className="w-5 h-5 mr-2" /> {format(showDateTime, 'p')}
        </CardTitle>
        <CardDescription>{format(showDateTime, 'eeee, MMMM do')}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-2">
        <p className="text-sm text-muted-foreground flex items-center">
            <MonitorPlay className="w-4 h-4 mr-2 text-accent" /> 
            Theatre: {isLoadingTheatre ? 'Loading...' : theatreDisplayName}
        </p>
      </CardContent>
      <CardContent className="pt-0">
        <Button asChild className="w-full bg-accent text-accent-foreground hover:bg-accent/90">
          <Link href={`/movies/${movieId}/shows/${show.id}/seats`}>
            <Ticket className="w-4 h-4 mr-2" /> Select Seats
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}
