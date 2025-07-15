import jwt from "jsonwebtoken";
import AppError from "../utils/appError.js";

export const isLoggedIn = async (req, res, next) => {
      const { token } = req.cookies;

      if (!token) {
            return next(
                  new AppError("Unauthenticated, please login first", 401)
            );
      }

      try {
            const userDetails = jwt.verify(token, process.env.JWT_SECRET);
            req.user = userDetails;
            next();
      } catch (error) {
            return next(new AppError("Invalid token or token expired", 401));
      }
};
