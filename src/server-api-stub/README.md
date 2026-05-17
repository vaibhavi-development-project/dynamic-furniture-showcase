# MongoDB Backend Stub (for your Node/Express server)

The frontend uses two swappable layers — replace the localStorage logic with
real `fetch()` calls to these endpoints once your MongoDB backend is live.

## Suggested Express + Mongoose routes

```js
// server/index.js
import express from "express";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";
import cors from "cors";

await mongoose.connect(process.env.MONGODB_URI);

const User = mongoose.model("User", new mongoose.Schema({
  name: String,
  email: { type: String, unique: true, lowercase: true, index: true },
  passwordHash: String,
  role: { type: String, enum: ["customer", "admin"], default: "customer" },
}, { timestamps: true }));

const Product = mongoose.model("Product", new mongoose.Schema({
  name: String, category: String, price: Number, color: String,
  style: String, size: String, description: String, image: String,
  featured: Boolean,
}, { timestamps: true }));

const Contact = mongoose.model("Contact", new mongoose.Schema({
  phone: String, whatsapp: String, email: String, address: String,
}));

const app = express();
app.use(cors({ origin: process.env.WEB_ORIGIN, credentials: true }));
app.use(express.json());
app.use(cookieParser());

const sign = (u) => jwt.sign({ id: u._id, role: u.role }, process.env.JWT_SECRET, { expiresIn: "7d" });
const auth = (roles = []) => (req, res, next) => {
  try {
    const t = req.cookies.token;
    const p = jwt.verify(t, process.env.JWT_SECRET);
    if (roles.length && !roles.includes(p.role)) return res.sendStatus(403);
    req.user = p; next();
  } catch { res.sendStatus(401); }
};

// ── Customer auth ─────────────────────────────────────────
app.post("/api/auth/register", async (req, res) => {
  const { name, email, password } = req.body;
  const passwordHash = await bcrypt.hash(password, 10);
  const u = await User.create({ name, email, passwordHash, role: "customer" });
  res.cookie("token", sign(u), { httpOnly: true, sameSite: "lax", secure: true });
  res.json({ id: u._id, name: u.name, email: u.email });
});

app.post("/api/auth/login", async (req, res) => {
  const u = await User.findOne({ email: req.body.email.toLowerCase() });
  if (!u || !(await bcrypt.compare(req.body.password, u.passwordHash))) return res.sendStatus(401);
  res.cookie("token", sign(u), { httpOnly: true, sameSite: "lax", secure: true });
  res.json({ id: u._id, name: u.name, email: u.email });
});

app.post("/api/auth/logout", (_req, res) => { res.clearCookie("token"); res.sendStatus(204); });
app.get("/api/auth/me", auth(), async (req, res) => {
  const u = await User.findById(req.user.id);
  res.json({ id: u._id, name: u.name, email: u.email });
});

// ── Admin auth ────────────────────────────────────────────
app.post("/api/admin/login", async (req, res) => {
  const u = await User.findOne({ email: req.body.email.toLowerCase(), role: "admin" });
  if (!u || !(await bcrypt.compare(req.body.password, u.passwordHash))) return res.sendStatus(401);
  res.cookie("token", sign(u), { httpOnly: true, sameSite: "lax", secure: true });
  res.json({ id: u._id, name: u.name, email: u.email, role: "admin" });
});

// ── Products (admin write) ────────────────────────────────
app.get("/api/products", async (_req, res) => res.json(await Product.find()));
app.post("/api/products", auth(["admin"]), async (req, res) => res.json(await Product.create(req.body)));
app.put("/api/products/:id", auth(["admin"]), async (req, res) =>
  res.json(await Product.findByIdAndUpdate(req.params.id, req.body, { new: true })));
app.delete("/api/products/:id", auth(["admin"]), async (req, res) => {
  await Product.findByIdAndDelete(req.params.id); res.sendStatus(204);
});

// ── Contact info ──────────────────────────────────────────
app.get("/api/contact", async (_req, res) => res.json((await Contact.findOne()) || {}));
app.put("/api/contact", auth(["admin"]), async (req, res) => {
  const c = await Contact.findOneAndUpdate({}, req.body, { upsert: true, new: true });
  res.json(c);
});

// Seed an admin once:
//   await User.create({ name: "Admin", email: "admin@maisonor.com",
//     passwordHash: await bcrypt.hash("yourpass", 10), role: "admin" });

app.listen(4000);
```

## Frontend swap points

Replace these files' bodies with `fetch()` calls to the routes above:

- `src/lib/customer-auth.ts` → `/api/auth/*`
- `src/lib/admin-auth.ts` → `/api/admin/login` + `/api/auth/me` (check `role==='admin'`)
- `src/lib/data.ts` → `/api/products`, `/api/contact`

Set `VITE_API_URL` and use `fetch(\`\${import.meta.env.VITE_API_URL}/api/...\`, { credentials: 'include' })`.
