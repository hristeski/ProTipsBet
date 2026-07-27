// // Reads from NEXT_PUBLIC_API_URL (set this in .env.local for dev,
// // and in Vercel's Project Settings -> Environment Variables for production).
// // Falls back to localhost so nothing breaks if it's not set yet.
// export const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5103";

// export function authHeaders(): HeadersInit {
//   if (typeof window === "undefined") return {};
//   const token = window.localStorage.getItem("protipsbet_token");
//   return token ? { Authorization: `Bearer ${token}` } : {};
// }

export const API_BASE = "http://localhost:5103";

export function authHeaders(): HeadersInit {
  if (typeof window === "undefined") return {};
  const token = window.localStorage.getItem("protipsbet_token");
  return token ? { Authorization: `Bearer ${token}` } : {};
}