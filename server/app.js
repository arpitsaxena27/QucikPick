import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import errorMiddleware from "./middlewares/error.middleware.js";
import userRoutes from "./routes/user.routes.js";
import martRoutes from "./routes/mart.routes.js";
import cloudinary from "cloudinary";

// Configure dotenv
dotenv.config();

const app = express();

// Middlewares
// Built-In
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Server Status Check Route
app.get("/ping", (_req, res) => {
      res.send("Pong");
});

//cors
app.use(
      cors({
            origin: process.env.FRONTEND_URL,
            methods: "GET, POST, PUT, DELETE, PATCH, OPTIONS",
            credentials: true,
      })
);

app.use(cookieParser());
app.use(morgan("dev"));

//clodinary config 
cloudinary.v2.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
});


// Routes
app.use("/api/auth", userRoutes);
app.use('/api/mart', martRoutes);

// Default catch all route - 404
app.all("*", (_req, res) => {
      res.status(404).send("OOPS!!! 404 Page Not Found");
});

// Custom error handling middleware when any error occurs
app.use(errorMiddleware);

export default app;
