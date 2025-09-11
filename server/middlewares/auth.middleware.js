import jwt from "jsonwebtoken";
import AppError from "../utils/appError.js";

export const isLoggedIn = async (req, res, next) => {
      try {
            if (!process.env.JWT_SECRET) {
                  throw new Error("JWT_SECRET not configured");
            }

            // 1. Get the token
            let token;
            let validToken = null;

            // Check Authorization header first
            const authHeader = req.headers.authorization;
            if (authHeader && authHeader.startsWith("Bearer ")) {
                  token = authHeader.split(" ")[1];
                  try {
                        validToken = jwt.verify(token, process.env.JWT_SECRET);
                  } catch (e) {
                        console.log("Auth header token invalid:", e.message);
                  }
            }

            // If no valid token in header, check cookies
            if (!validToken && req.cookies && req.cookies.token) {
                  // Handle multiple tokens in cookie
                  const cookieTokens = req.cookies.token
                        .split(";")
                        .map((t) => t.trim());

                  // Try each token until we find a valid one
                  for (const t of cookieTokens) {
                        try {
                              validToken = jwt.verify(
                                    t,
                                    process.env.JWT_SECRET
                              );
                              token = t; // Keep track of the valid token
                              break;
                        } catch (e) {
                              console.log("Cookie token invalid:", e.message);
                              // Clear invalid token
                              res.clearCookie("token", {
                                    httpOnly: true,
                                    secure:
                                          process.env.NODE_ENV === "production",
                                    sameSite:
                                          process.env.NODE_ENV === "production"
                                                ? "None"
                                                : "Lax",
                              });
                        }
                  }
            }

            // No valid token found
            if (!validToken) {
                  throw new Error("No valid token provided");
            }

            // Set the user from the valid token we found
            req.user = validToken;

            // If we found a valid token but there were invalid ones, set a new clean cookie
            if (req.cookies.token && req.cookies.token.includes(";")) {
                  res.cookie("token", token, {
                        httpOnly: true,
                        secure: process.env.NODE_ENV === "production",
                        sameSite:
                              process.env.NODE_ENV === "production"
                                    ? "None"
                                    : "Lax",
                        maxAge: 24 * 60 * 60 * 1000, // 24 hours
                  });
            }

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
