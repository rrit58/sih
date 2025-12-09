import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import openai from 'openai';
import bodyParser from 'body-parser';
dotenv.config();


// === CONNECT TO MONGODB === //
mongoose
  .connect(process.env.MONGODB_URL)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error("❌ MongoDB Error:", err));


const app = express();


// === CORS CONFIGURATION === //
const corsOptions = {
  origin: ['http://localhost:5173', 'http://localhost:5174', 'http://localhost:3000'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization'],
  optionsSuccessStatus: 200
};


// === MIDDLEWARE  === //
app.use(cors());

app.use(cors(corsOptions));

// 2. Body parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 3. Global OPTIONS preflight handler
app.use((req, res, next) => {
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', req.headers.origin || '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    return res.sendStatus(200);
  }
  next();
});

// === UNIFIED REGISTRATION ROUTE === //


app.use("/uploads", express.static("uploads"));


app.use((req, res, next) => {
  try {
    const origin = req.headers.origin;
    const allowed = corsOptions.origin || [];

    const originAllowed = Array.isArray(allowed) ? allowed.includes(origin) : true;

    if (origin && originAllowed) {
      res.setHeader('Access-Control-Allow-Origin', origin);
      if (corsOptions.credentials) res.setHeader('Access-Control-Allow-Credentials', 'true');
      res.setHeader('Access-Control-Allow-Methods', Array.isArray(corsOptions.methods) ? corsOptions.methods.join(',') : 'GET,POST,PUT,DELETE,OPTIONS');
      res.setHeader('Access-Control-Allow-Headers', Array.isArray(corsOptions.allowedHeaders) ? corsOptions.allowedHeaders.join(',') : 'Content-Type,Authorization');
    }

    if (req.method === 'OPTIONS') {
      return res.sendStatus(corsOptions.optionsSuccessStatus || 200);
    }

    next();
  } catch (err) {
    console.warn('CORS middleware error:', err && err.message ? err.message : err);
    next();
  }
});

app.use(cors({
	origin: "*",          
	methods: ["GET", "POST", "PUT", "DELETE"],
	allowedHeaders: ["Content-Type"]
}));

app.use(bodyParser.json())
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// === IMPORT ROUTE === //
// import eventRoutes from "./panchayat/eventRoutes.js"
import authRoutes from './routes/authRoutes.js';
import mapRoutes from './routes/mapRoutes.js';
import registrationRoutes from './routes/registrationRoutes.js';
import checkerRoute from './routes/checkerRoutes.js';
import centerRoutes from './routes/centerRoutes.js';


app.use("/api/auth", authRoutes);  
app.use("/uploads",express.static("uploads"));
// app.use("/api/events", eventRoutes);

// Mount Center
try {
  app.use('/api/centers', centerRoutes)
  console.log("✅ Center Route Mounted: POST /api/register");
} catch (e) {
  console.error("❌ Center Route Error:", e.message);
}

// Mount Checker
try {
  app.use("/api", registrationRoutes);
  console.log("✅ Registration Route Mounted: POST /api/register");
} catch (e) {
  console.error("❌ Registration routes error:", e.message);
}

// === AUTH ROUTES === //
try {
  app.use("/api/auth", mapRoutes);
  console.log("✅ Auth Routes Mounted: /api/auth/*");
} catch (e) {
  console.warn("⚠️  Map routes missing:", e.message);
}

// === CHECKER ROUTES (OPTIONAL) === //
try {
  app.use("/api", checkerRoute);
  console.log("✅ Checker Routes Mounted: /api/checker/*");
} catch (e) {
  console.warn("⚠️  Checker routes missing:", e.message);
}

// === TEST ENDPOINT === //
app.get("/api/ping", (req, res) => res.json({ ok: true }));

// === 404 HANDLER === //
app.use((req, res) => {
  res.status(404).json({ error: "Endpoint not found" });
});

// === ERROR HANDLER === //
app.use((err, req, res, next) => {
  console.error("Server error:", err);
  res.status(500).json({ error: err.message || "Internal server error" });
});


// === START SERVER === //
const port = process.env.PORT;
app.listen(port, () => {
  console.log(`\n🚀 Server running on port ${port}`);
  console.log(`📍 Frontend: http://localhost:5174`);
  console.log(`📍 Backend: http://localhost:${port}`);
  console.log(`📍 Register: POST http://localhost:${port}/api/register\n`);
});
