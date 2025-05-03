
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Format price to display with integer value and ₹ symbol
export function formatPrice(price: number): string {
  return `₹${Math.round(price)}`;
}

// Generate a random price between 250-999
export function generateRandomPrice(): number {
  return Math.floor(Math.random() * (999 - 250 + 1)) + 250;
}
