
"use client";

import type { Seat, Show, BookingPayload } from '@/types';
import { useState, useEffect, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Armchair, XCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';
import { useAuth } from '@/hooks/useAuth';
import { bookTickets } from '@/lib/api';


interface SeatSelectionGridProps {
  showId: string;
  initialSeats: Seat[];
  showDetails: Show | null;
}

const MAX_SELECTED_SEATS = 6; // Example limit

export function SeatSelectionGrid({ showId, initialSeats, showDetails }: SeatSelectionGridProps) {
  const [seats, setSeats] = useState<Seat[]>(initialSeats);
  const [selectedSeats, setSelectedSeats] = useState<Seat[]>([]);
  const [isLoading, setIsLoading] = useState(false); // For booking action
  const { toast } = useToast();
  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
    setSeats(initialSeats.map(seat => ({ ...seat, status: seat.status === 'booked' ? 'booked' : 'available' })));
  }, [initialSeats]);

  const handleSeatClick = (seatId: string) => {
    const seat = seats.find(s => s.id === seatId);
    if (!seat || seat.status === 'booked' || seat.status === 'unavailable') return;

    const isSelected = selectedSeats.some(s => s.id === seatId);

    if (isSelected) {
      setSelectedSeats(prev => prev.filter(s => s.id !== seatId));
      setSeats(prev => prev.map(s => s.id === seatId ? { ...s, status: 'available' } : s));
    } else {
      if (selectedSeats.length >= MAX_SELECTED_SEATS) {
        toast({
          variant: "destructive",
          title: "Selection Limit Reached",
          description: `You can select a maximum of ${MAX_SELECTED_SEATS} seats.`,
        });
        return;
      }
      setSelectedSeats(prev => [...prev, seat]);
      setSeats(prev => prev.map(s => s.id === seatId ? { ...s, status: 'selected' } : s));
    }
  };

  const totalPrice = useMemo(() => {
    const seatPrice = showDetails?.price || 150; 
    return selectedSeats.length * seatPrice;
  }, [selectedSeats, showDetails]);

  const handleBooking = async () => {
    if (selectedSeats.length === 0) {
      toast({
        variant: "destructive",
        title: "No Seats Selected",
        description: "Please select at least one seat to proceed.",
      });
      return;
    }

    if (!isAuthenticated || !user) {
      toast({
        variant: "destructive",
        title: "Authentication Required",
        description: "You must be logged in to book tickets.",
      });
      return;
    }

    setIsLoading(true);

    const bookingPayload: BookingPayload = {
      userId: user.id,
      showId: showId,
      seatNumbers: selectedSeats.map(s => s.seatNumber),
    };

    try {
      const confirmation = await bookTickets(bookingPayload);
      toast({
        title: "Booking Successful!",
        description: confirmation.message || `You've booked ${selectedSeats.length} seat(s). Total: ₹${totalPrice.toFixed(2)}.`,
      });
      // Update seat statuses to booked
      setSeats(prevSeats => prevSeats.map(s => 
        selectedSeats.some(ss => ss.id === s.id) ? { ...s, status: 'booked' } : s
      ));
      setSelectedSeats([]);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Booking Failed",
        description: error.message || "An unexpected error occurred. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const seatRows = useMemo(() => {
    const rows: { [key: string]: Seat[] } = {};
    seats.forEach(seat => {
      const rowKey = seat.seatNumber.charAt(0); 
      if (!rows[rowKey]) rows[rowKey] = [];
      rows[rowKey].push(seat);
    });
    Object.values(rows).forEach(row => row.sort((a, b) => {
      const numA = parseInt(a.seatNumber.substring(1));
      const numB = parseInt(b.seatNumber.substring(1));
      return numA - numB;
    }));
    return Object.entries(rows).sort(([keyA], [keyB]) => keyA.localeCompare(keyB));
  }, [seats]);


  if (!showDetails) {
    return (
      <div className="w-full max-w-3xl mx-auto p-4 md:p-6 bg-card rounded-lg shadow-xl">
        <Skeleton className="h-8 w-3/4 mb-4" />
        <Skeleton className="h-4 w-1/2 mb-6" />
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex justify-center space-x-2">
              {[...Array(8)].map((_, j) => <Skeleton key={j} className="w-10 h-10 rounded" />)}
            </div>
          ))}
        </div>
        <Skeleton className="h-12 w-full mt-8" />
      </div>
    );
  }

  return (
    <div className="w-full max-w-3xl mx-auto p-4 md:p-6 bg-card rounded-lg shadow-xl">
      <div className="mb-6 text-center">
        <h2 className="text-2xl font-bold text-primary">Select Your Seats</h2>
        <p className="text-muted-foreground">Screen This Way</p>
        <div className="w-3/4 h-2 mx-auto my-3 bg-foreground/50 rounded-sm"></div>
      </div>

      <div className="space-y-2 mb-6 overflow-x-auto pb-4">
        {seatRows.map(([rowKey, rowSeats]) => (
          <div key={rowKey} className="flex items-center justify-center space-x-1.5">
            <span className="w-6 text-sm font-medium text-muted-foreground text-center">{rowKey}</span>
            {rowSeats.map(seat => (
              <Button
                key={seat.id}
                variant="outline"
                size="icon"
                className={cn(
                  "w-10 h-10 p-0 border-2 transition-all duration-150 ease-in-out flex items-center justify-center", 
                  seat.status === 'available' && "border-primary/50 text-primary/70 hover:bg-primary/10 hover:border-primary",
                  seat.status === 'selected' && "bg-accent text-accent-foreground border-accent hover:bg-accent/90",
                  seat.status === 'booked' && "bg-muted text-muted-foreground/50 border-muted-foreground/30 cursor-not-allowed",
                  seat.status === 'unavailable' && "bg-destructive/20 text-destructive/50 border-destructive/30 cursor-not-allowed"
                )}
                onClick={() => handleSeatClick(seat.id)}
                disabled={seat.status === 'booked' || seat.status === 'unavailable'}
                aria-label={`Seat ${seat.seatNumber}, Status: ${seat.status}`}
              >
                <span className="text-xs font-semibold">{seat.seatNumber.substring(1)}</span>
              </Button>
            ))}
             <span className="w-6 text-sm font-medium text-muted-foreground text-center">{rowKey}</span>
          </div>
        ))}
      </div>

      <div className="flex justify-around items-center my-6 p-3 bg-background/50 rounded-md text-sm">
        <div className="flex items-center"><Armchair className="w-5 h-5 mr-2 text-primary/70" /> Available</div>
        <div className="flex items-center"><Armchair className="w-5 h-5 mr-2 text-accent" /> Selected</div>
        <div className="flex items-center"><Armchair className="w-5 h-5 mr-2 text-muted-foreground/50" /> Booked</div>
      </div>

      {selectedSeats.length > 0 && (
        <div className="my-6 p-4 border border-primary/30 rounded-lg bg-primary/5">
          <h3 className="text-lg font-semibold text-primary mb-2">Your Selection:</h3>
          <div className="flex flex-wrap gap-2 mb-3">
            {selectedSeats.map(seat => (
              <Badge key={seat.id} variant="default" className="bg-accent text-accent-foreground">
                {seat.seatNumber}
                <Button variant="ghost" size="icon" className="ml-1 h-4 w-4 p-0 text-accent-foreground/70 hover:text-accent-foreground" onClick={() => handleSeatClick(seat.id)}>
                  <XCircle className="h-3 w-3" />
                </Button>
              </Badge>
            ))}
          </div>
          <p className="text-xl font-bold text-primary flex items-center">
             Total: ₹{totalPrice.toFixed(2)}
          </p>
        </div>
      )}

      <Button 
        onClick={handleBooking} 
        disabled={selectedSeats.length === 0 || isLoading || !isAuthenticated} 
        className="w-full text-lg py-6 bg-primary hover:bg-primary/90 text-primary-foreground"
      >
        {isLoading ? 'Processing...' : `Book ${selectedSeats.length} Seat(s)`}
      </Button>
      {!isAuthenticated && selectedSeats.length > 0 && (
        <p className="text-xs text-destructive text-center mt-2">
          Please log in to complete your booking.
        </p>
      )}
    </div>
  );
}
