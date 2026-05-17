// Customer authentication. Frontend-only mock store designed to be swapped
// for MongoDB API calls. Replace the implementations with fetch('/api/auth/...')
// against your Node + MongoDB backend (see /server-api-stub for reference).
//
// Suggested MongoDB collection:
//   users: { _id, name, email (unique), passwordHash, createdAt }

export interface Customer {
  id: string;
  name: string;
  email: string;
  createdAt: string;
}

const USERS_KEY = "maisonor.users.v1";
const SESSION_KEY = "maisonor.customer.session";

interface StoredUser extends Customer {
  password: string; // mock only — backend will store bcrypt hash
}

function isBrowser() { return typeof window !== "undefined"; }

function readUsers(): StoredUser[] {
  if (!isBrowser()) return [];
  try { return JSON.parse(localStorage.getItem(USERS_KEY) || "[]"); } catch { return []; }
}
function writeUsers(u: StoredUser[]) {
  if (!isBrowser()) return;
  localStorage.setItem(USERS_KEY, JSON.stringify(u));
}

/** REPLACE: POST /api/auth/register */
export async function registerCustomer(name: string, email: string, password: string): Promise<Customer> {
  const users = readUsers();
  const e = email.trim().toLowerCase();
  if (users.find(u => u.email === e)) throw new Error("An account with this email already exists");
  const user: StoredUser = {
    id: crypto.randomUUID(),
    name: name.trim(),
    email: e,
    password,
    createdAt: new Date().toISOString(),
  };
  users.push(user);
  writeUsers(users);
  const { password: _, ...pub } = user;
  sessionStorage.setItem(SESSION_KEY, JSON.stringify(pub));
  window.dispatchEvent(new Event("maisonor:auth"));
  return pub;
}

/** REPLACE: POST /api/auth/login */
export async function loginCustomer(email: string, password: string): Promise<Customer> {
  const users = readUsers();
  const u = users.find(x => x.email === email.trim().toLowerCase());
  if (!u || u.password !== password) throw new Error("Invalid email or password");
  const { password: _, ...pub } = u;
  sessionStorage.setItem(SESSION_KEY, JSON.stringify(pub));
  window.dispatchEvent(new Event("maisonor:auth"));
  return pub;
}

/** REPLACE: POST /api/auth/logout */
export function logoutCustomer() {
  sessionStorage.removeItem(SESSION_KEY);
  if (isBrowser()) window.dispatchEvent(new Event("maisonor:auth"));
}

/** REPLACE: GET /api/auth/me (read JWT cookie) */
export function getCurrentCustomer(): Customer | null {
  if (!isBrowser()) return null;
  const raw = sessionStorage.getItem(SESSION_KEY);
  if (!raw) return null;
  try { return JSON.parse(raw); } catch { return null; }
}

export function isCustomerAuthed(): boolean {
  return getCurrentCustomer() !== null;
}
