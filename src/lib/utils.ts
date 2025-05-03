
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Format price to display with integer value and ₹ symbol
export function formatPrice(price: number): string {
  return `₹${Math.round(price)}`;
}
