import { clsx } from "clsx";
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

// Clears authentication / organization keys and navigates to the login page.
export function logout(redirect = "/login") {
  const keys = [
    "token",
    "organization_unit",
    "university_name",
    "faculty_name",
    "district",
    "zone",
    "school_name",
    "user",
  ];
  try {
    keys.forEach((k) => localStorage.removeItem(k));
  } catch (err) {
    // ignore storage errors
  }
  // Redirect to the login page
  if (typeof window !== "undefined") {
    window.location.href = redirect;
  }
}
