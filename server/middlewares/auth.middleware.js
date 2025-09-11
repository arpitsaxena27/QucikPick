import jwt from "jsonwebtoken";
import AppError from "../utils/appError.js";

export const isLoggedIn = async (req, res, next) => {
      try {
            // 1. Get the token
            let token;

            // Check Authorization header first
            const authHeader = req.headers.authorization;
            if (authHeader && authHeader.startsWith("Bearer ")) {
                  token = authHeader.split(" ")[1];
            }

            // If no token in header, check cookies
            if (!token && req.cookies) {
                  token = req.cookies.token;
            }

            // No token found
            if (!token) {
                  throw new Error("No token provided");
            }

            // 2. Verify the token
            if (!process.env.JWT_SECRET) {
                  throw new Error("JWT_SECRET not configured");
            }

            let decoded;
            try {
                  decoded = jwt.verify(token, process.env.JWT_SECRET);
            } catch (jwtError) {
                  if (jwtError.name === "JsonWebTokenError") {
                        throw new Error("Invalid token");
                  } else if (jwtError.name === "TokenExpiredError") {
                        throw new Error("Token has expired");
                  } else {
                        throw new Error("Token verification failed");
                  }
            }

            // 3. Set the user and continue
            req.user = decoded;
            next();
      } catch (error) {
            console.error("Auth Error:", {
                  message: error.message,
                  headers: req.headers,
                  cookies: req.cookies,
            });

            return next(
                  new AppError(error.message || "Authentication failed", 401)
            );
      }
};
