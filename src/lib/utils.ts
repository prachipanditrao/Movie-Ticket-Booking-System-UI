import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDurationFromMs(ms: number | undefined | null): string {
  if (ms === undefined || ms === null || ms <= 0) {
    return 'N/A';
  }

  const totalSeconds = Math.floor(ms / 1000);
  const totalMinutes = Math.floor(totalSeconds / 60);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  if (hours > 0 && minutes > 0) {
    return `${hours}h ${minutes}m`;
  } else if (hours > 0) {
    return `${hours}h`;
  } else if (minutes > 0) {
    return `${minutes}m`;
  } else {
    // This case should ideally not be reached if ms > 0 and represents less than a minute.
    // For very short durations (e.g., 30000ms = 30s), it will show as "N/A".
    // If sub-minute precision is needed, this logic can be adjusted.
    // For typical movie durations, this is fine.
    return 'N/A'; 
  }
}
