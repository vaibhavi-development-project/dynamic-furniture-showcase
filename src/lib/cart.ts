// Cart session — per-customer, persisted in sessionStorage.
// Swap for /api/cart endpoints against MongoDB when wiring backend.
//
// Suggested MongoDB collection:
//   carts: { _id, userId, items: [{ productId, qty, addedAt }], updatedAt }

import { getCurrentCustomer } from "./customer-auth";

export interface CartItem {
  productId: string;
  qty: number;
  addedAt: string;
}

const KEY_PREFIX = "maisonor.cart.";
const EVENT = "maisonor:cart";

function isBrowser() { return typeof window !== "undefined"; }

function key(): string | null {
  const u = getCurrentCustomer();
  if (!u) return null;
  return KEY_PREFIX + u.id;
}

function read(): CartItem[] {
  if (!isBrowser()) return [];
  const k = key(); if (!k) return [];
  try { return JSON.parse(sessionStorage.getItem(k) || "[]"); } catch { return []; }
}

function write(items: CartItem[]) {
  if (!isBrowser()) return;
  const k = key(); if (!k) return;
  sessionStorage.setItem(k, JSON.stringify(items));
  window.dispatchEvent(new Event(EVENT));
}

export function getCart(): CartItem[] { return read(); }

export function getCartCount(): number {
  return read().reduce((n, i) => n + i.qty, 0);
}

/** REPLACE: POST /api/cart/add */
export function addToCart(productId: string, qty = 1) {
  const items = read();
  const existing = items.find(i => i.productId === productId);
  if (existing) existing.qty += qty;
  else items.push({ productId, qty, addedAt: new Date().toISOString() });
  write(items);
}

/** REPLACE: PATCH /api/cart/:productId */
export function updateQty(productId: string, qty: number) {
  const items = read();
  const it = items.find(i => i.productId === productId);
  if (!it) return;
  if (qty <= 0) write(items.filter(i => i.productId !== productId));
  else { it.qty = qty; write(items); }
}

/** REPLACE: DELETE /api/cart/:productId */
export function removeFromCart(productId: string) {
  write(read().filter(i => i.productId !== productId));
}

/** REPLACE: DELETE /api/cart */
export function clearCart() { write([]); }

export function onCartChange(cb: () => void) {
  if (!isBrowser()) return () => {};
  window.addEventListener(EVENT, cb);
  window.addEventListener("maisonor:auth", cb);
  return () => {
    window.removeEventListener(EVENT, cb);
    window.removeEventListener("maisonor:auth", cb);
  };
}
