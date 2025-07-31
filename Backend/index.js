import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";

dotenv.config();

const app = express();

// Middleware
app.use(
  cors({
    origin: "http://localhost:5173", // Frontend URL
    methods: "GET,POST,PUT,DELETE",
    credentials: true,
  })
);
app.use(bodyParser.json());
app.use(cookieParser());

// Routes
app.use("/api/auth", authRoutes);

app.use("/api/user", userRoutes );


// Connect to DB
connectDB();

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
