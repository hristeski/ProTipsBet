// Minimal JWT payload decoder — no external library needed.
// We only need to read the claims, not verify the signature (the backend
// already verifies it on every request; this is just a client-side UI gate
// to avoid flashing admin content before an API call comes back).

interface JwtPayload {
  role?: string;
  // .NET's ClaimTypes.Role serializes under this long URI key instead of "role"
  "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"?: string;
  exp?: number; // unix seconds
  [key: string]: unknown;
}

function decodeJwtPayload(token: string): JwtPayload | null {
  try {
    const base64Url = token.split(".")[1];
    if (!base64Url) return null;

    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const json = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + c.charCodeAt(0).toString(16).padStart(2, "0"))
        .join("")
    );

    return JSON.parse(json);
  } catch {
    return null;
  }
}

export function isAdminToken(token: string | null): boolean {
  if (!token) return false;

  const payload = decodeJwtPayload(token);
  if (!payload) return false;

  // Check expiry
  if (payload.exp && Date.now() >= payload.exp * 1000) return false;

  // Check role — handle both short and long (.NET default) claim key formats
  const role =
    payload.role ??
    payload["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];

  return role === "Admin";
}
