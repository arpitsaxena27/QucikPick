import jwt from "jsonwebtoken";
import AppError from "../utils/appError.js";

export const isLoggedIn = async (req, res, next) => {
      // Get token from multiple sources
      let token = req.cookies?.token; // First try cookies

      // If no cookie token, check Authorization header
      if (!token && req.headers.authorization?.startsWith("Bearer")) {
            token = req.headers.authorization.split(" ")[1];
      }

      if (!token) {
            return next(
                  new AppError("Unauthenticated, please login first", 401)
            );
      }

      try {
            if (!process.env.JWT_SECRET) {
                  console.error(
                        "JWT_SECRET is not defined in environment variables"
                  );
                  return next(new AppError("Server configuration error", 500));
            }

            const userDetails = jwt.verify(token, process.env.JWT_SECRET);
            req.user = userDetails;
            next();
      } catch (error) {
            console.error("Token verification error:", error.message);
            return next(new AppError("Invalid token or token expired", 401));
      }
};
