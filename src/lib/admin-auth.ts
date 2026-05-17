// Simple client-side admin gate. Replace with a real server check (JWT from your
// MongoDB/Node backend) when wiring the real backend. This keeps the admin area
// hidden from regular customers and out of the public navigation.

const KEY = "maisonor.admin.session";
// Default credentials — change in production. The user will replace this with
// a real /api/admin/login call against MongoDB.
export const ADMIN_USER = "admin";
export const ADMIN_PASS = "maisonor2026";

export function isAdminAuthed(): boolean {
  if (typeof window === "undefined") return false;
  return sessionStorage.getItem(KEY) === "1";
}

export function adminLogin(user: string, pass: string): boolean {
  if (user === ADMIN_USER && pass === ADMIN_PASS) {
    sessionStorage.setItem(KEY, "1");
    return true;
  }
  return false;
}

export function adminLogout() {
  sessionStorage.removeItem(KEY);
}
