
"use client";

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation'; // Import useRouter
import { getShowById } from '@/lib/api';
import type { Seat, Show } from '@/types';
import { SeatSelectionGrid } from '@/components/movies/SeatSelectionGrid';
import { AlertTriangle, ChevronLeft } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button'; // Import Button

export default function SeatSelectionPage() {
  const params = useParams<{ movieId: string; showId: string }>();
  const showId = params.showId;
  const router = useRouter(); // Initialize router

  const [initialSeats, setInitialSeats] = useState<Seat[]>([]);
  const [showDetails, setShowDetails] = useState<Show | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!showId) {
      setError("Show ID is missing.");
      setIsLoading(false);
      return;
    }

    async function loadShowData() {
      setIsLoading(true);
      setError(null);
      try {
        const showData = await getShowById(showId as string);
        
        if (!showData) {
          setError("Show details not found.");
          setShowDetails(null);
          setInitialSeats([]);
        } else {
          setShowDetails(showData);
          if (showData.seatAvailability && typeof showData.seatAvailability === 'object' && Object.keys(showData.seatAvailability).length > 0) {
            const transformedSeats: Seat[] = Object.entries(showData.seatAvailability).map(
              ([seatNumber, isAvailable]) => ({
                id: `${showData.id}-${seatNumber}`, // Ensure unique ID for each seat instance
                seatNumber: seatNumber,
                status: isAvailable ? 'available' : 'booked',
                showId: showData.id,
              })
            );
            setInitialSeats(transformedSeats);
          } else {
            setInitialSeats([]);
            console.warn(`Seat availability data is missing, not an object, or empty for show ${showId}:`, showData.seatAvailability);
          }
        }
      } catch (e: any) {
        console.error(`Failed to fetch show data for show ${showId}:`, e);
        setError(e.message || "Could not load seat information. Please try again later.");
        setInitialSeats([]);
        setShowDetails(null);
      } finally {
        setIsLoading(false);
      }
    }

    loadShowData();
  }, [showId]);

  if (isLoading) {
    return (
      <div className="py-8 w-full max-w-3xl mx-auto">
         <Skeleton className="h-10 w-40 mb-6 bg-muted" /> {/* Back button skeleton */}
        <div className="p-4 md:p-6 bg-card rounded-lg shadow-xl animate-pulse">
          <Skeleton className="h-8 w-3/4 mb-4 mx-auto bg-muted" />
          <Skeleton className="h-4 w-1/2 mb-3 mx-auto bg-muted" />
          <Skeleton className="w-3/4 h-2 mx-auto my-3 bg-muted/50 rounded-sm" />
          
          <div className="space-y-2 mb-6">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center justify-center space-x-1.5">
                <Skeleton className="w-6 h-6 rounded-sm bg-muted" />
                {[...Array(8)].map((_, j) => <Skeleton key={j} className="w-10 h-10 rounded bg-muted" />)}
                <Skeleton className="w-6 h-6 rounded-sm bg-muted" />
              </div>
            ))}
          </div>

          <div className="flex justify-around items-center my-6 p-3 bg-background/50 rounded-md">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex items-center">
                <Skeleton className="w-5 h-5 mr-2 rounded-sm bg-muted" />
                <Skeleton className="w-16 h-4 bg-muted" />
              </div>
            ))}
          </div>
          <Skeleton className="h-12 w-full mt-4 bg-muted" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center text-center py-10 min-h-[calc(100vh-15rem)]">
        <AlertTriangle className="w-12 h-12 text-destructive mb-4" />
        <h1 className="text-2xl font-semibold text-destructive mb-2">Error Loading Seat Data</h1>
        <p className="text-muted-foreground max-w-md">{error}</p>
        <Button variant="outline" onClick={() => router.back()} className="mt-8">
          <ChevronLeft className="mr-2 h-4 w-4" />
          Go Back
        </Button>
      </div>
    );
  }
  
  if (showDetails && initialSeats.length === 0) {
     return (
      <div className="flex flex-col items-center justify-center text-center py-10 min-h-[calc(100vh-15rem)]">
        <AlertTriangle className="w-12 h-12 text-amber-500 mb-4" />
        <h1 className="text-2xl font-semibold text-amber-600 mb-2">No Seats Defined</h1>
        <p className="text-muted-foreground max-w-md">Seat layout for this show is not available or `seatAvailability` was empty, missing, or in an unexpected format.</p>
         <Button variant="outline" onClick={() => router.back()} className="mt-8">
          <ChevronLeft className="mr-2 h-4 w-4" />
          Go Back
        </Button>
      </div>
    );
  }

  if (!showDetails) {
     return (
      <div className="flex flex-col items-center justify-center text-center py-10 min-h-[calc(100vh-15rem)]">
        <AlertTriangle className="w-12 h-12 text-destructive mb-4" />
        <h1 className="text-2xl font-semibold text-destructive mb-2">Show Not Found</h1>
        <p className="text-muted-foreground max-w-md">The details for this show could not be loaded.</p>
         <Button variant="outline" onClick={() => router.back()} className="mt-8">
          <ChevronLeft className="mr-2 h-4 w-4" />
          Go Back
        </Button>
      </div>
    );
  }

  return (
    <div className="py-8">
      <Button variant="outline" onClick={() => router.back()} className="mb-6 group max-w-3xl mx-auto flex">
        <ChevronLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform" />
        Back to Show Details
      </Button>
      <SeatSelectionGrid showId={showId as string} initialSeats={initialSeats} showDetails={showDetails} />
    </div>
  );
}
