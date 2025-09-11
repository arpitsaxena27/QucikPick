import jwt from "jsonwebtoken";
import AppError from "../utils/appError.js";

export const isLoggedIn = async (req, res, next) => {
      try {
            console.log("Environment:", {
                  NODE_ENV: process.env.NODE_ENV,
                  JWT_SECRET_EXISTS: !!process.env.JWT_SECRET,
            });

            if (!process.env.JWT_SECRET) {
                  throw new Error("JWT_SECRET not configured");
            }

            // 1. Get the token
            let token;
            let validToken = null;

            // First check Authorization header
            const authHeader = req.headers.authorization;
            console.log("Authorization Header:", authHeader);

            if (authHeader && authHeader.startsWith("Bearer ")) {
                  token = authHeader.split(" ")[1];
                  console.log(
                        "Found Bearer token:",
                        token ? token.substring(0, 20) + "..." : "none"
                  );

                  try {
                        validToken = jwt.verify(token, process.env.JWT_SECRET);
                        console.log("Bearer token verification successful");
                  } catch (e) {
                        console.log("Bearer token invalid:", e.message);
                  }
            }

            // Then check cookies if no valid token yet
            console.log("Checking cookies:", {
                  hasCookies: !!req.cookies,
                  hasTokenCookie: req.cookies?.token ? "yes" : "no",
            });

            if (!validToken && req.cookies?.token) {
                  // Clean and split the token string
                  const rawTokenString = req.cookies.token;
                  console.log(
                        "Raw cookie token:",
                        rawTokenString
                              ? rawTokenString.substring(0, 20) + "..."
                              : "none"
                  );

                  let cookieTokens = [];
                  try {
                        cookieTokens = rawTokenString
                              .split(";")
                              .map((t) => t.trim())
                              .filter((t) => t);
                        console.log(
                              `Found ${cookieTokens.length} tokens in cookie`
                        );
                  } catch (e) {
                        console.log(
                              "Error splitting cookie tokens:",
                              e.message
                        );
                  }

                  // Try each token
                  for (const t of cookieTokens) {
                        try {
                              console.log(
                                    "Verifying cookie token:",
                                    t.substring(0, 20) + "..."
                              );
                              validToken = jwt.verify(
                                    t,
                                    process.env.JWT_SECRET
                              );
                              token = t;
                              console.log("Found valid cookie token");
                              break;
                        } catch (e) {
                              console.log(
                                    "Cookie token verification failed:",
                                    e.message
                              );
                              // Clear invalid token
                              res.clearCookie("token", {
                                    httpOnly: true,
                                    secure: true,
                                    sameSite: "None",
                                    path: "/",
                              });
                        }
                  }
            }

            // No valid token found
            if (!validToken) {
                  console.log("No valid token found after all checks");
                  throw new Error("No valid token provided");
            }

            // Set the user from the valid token we found
            req.user = validToken;
            console.log("User set from token:", {
                  userId: validToken.id,
                  tokenExp: new Date(validToken.exp * 1000).toISOString(),
            });

            // If we found a valid token, always set a fresh, clean cookie
            res.cookie("token", token, {
                  httpOnly: true,
                  secure: true,
                  sameSite: "None",
                  path: "/",
                  maxAge: 24 * 60 * 60 * 1000, // 24 hours
            });
            console.log("Set fresh cookie with valid token");

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
