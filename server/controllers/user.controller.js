import { User } from "../models/user.model.js";
import AppError from "../utils/appError.js";
import cloudinary from "cloudinary";
import fs from "fs/promises";

const cookieExpiryDays = parseInt(process.env.COOKIE_EXPIRY) || 1;

const cookieOptions = {
      expires: new Date(Date.now() + cookieExpiryDays * 24 * 60 * 60 * 1000),
      httpOnly: true,
      sameSite: "none",
      secure: process.env.NODE_ENV === "production", // will be false in development
};

export const registerUser = async (req, res, next) => {
      try {
            const { name, email, password, role } = req.body;

            if (!name || !email || !password) {
                  return next(new AppError("All fields are required", 400));
            }

            const userExists = await User.findOne({ email });
            if (userExists) {
                  return next(new AppError("Email already registered", 400));
            }

            const newUser = await User.create({
                  name,
                  email,
                  password,
                  role,
                  avatar: {
                        public_id: "sample_id",
                        secure_url: "sample_url",
                  },
            });

            //FILE upload to clodinary and delete from local storage after getting the url
            if (req.file) {
                  console.log(req.file);
                  try {
                        const fileData = await cloudinary.v2.uploader.upload(
                              req.file.path,
                              {
                                    folder: "avatars",
                                    width: 250,
                                    height: 250,
                                    crop: "fill",
                                    gravity: "face",
                              }
                        );

                        if (fileData) {
                              newUser.avatar.public_id = fileData.public_id;
                              newUser.avatar.secure_url = fileData.secure_url;
                              await fs.rm(`uploads/${req.file.filename}`);
                        }

                        await newUser.save();
                  } catch (e) {}
            }

            newUser.password = undefined;
            const token = await newUser.generateJWTToken();

            res.cookie("token", token, cookieOptions);
            res.status(201).json({
                  success: true,
                  message: "User registered successfully",
                  user: newUser,
            });
      } catch (error) {
            return next(new AppError(error.message, 500));
      }
};

export const loginUser = async (req, res, next) => {
      try {
            const { email, password } = req.body;

            if (!email || !password) {
                  return next(new AppError("All fields are required", 400));
            }

            const user = await User.findOne({ email }).select("+password");

            if (!user || !(await user.comparePassword(password))) {
                  return next(new AppError("Invalid credentials", 401));
            }

            const token = await user.generateJWTToken();
            user.password = undefined;

            res.cookie("token", token, cookieOptions);
            res.status(200).json({
                  success: true,
                  message: "Logged in successfully",
                  user,
            });
      } catch (error) {
            return next(new AppError(error.message, 500));
      }
};

export const logoutUser = (req, res, next) => {
  try {
    res.cookie("token", "", {
      ...cookieOptions,         // reuse same flags as login
      expires: new Date(0),     // force expire
    });

    res.status(200).json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (error) {
    return next(new AppError(error.message, 500));
  }
};


export const getProfile = async (req, res, next) => {
      try {
            const userId = req.user.id;
            const user = await User.findById(userId);

            if (!user) {
                  return next(new AppError("User not found", 404));
            }

            res.status(200).json({
                  success: true,
                  message: "User details fetched successfully",
                  user,
            });
      } catch (error) {
            return next(new AppError(error.message, 500));
      }
};

export const forgotPassword = async (req, res, next) => {
      try {
            const { email } = req.body;
            if (!email) {
                  return next(new AppError("Email is required", 400));
            }
            const user = await User.findOne(email);
            if (!user) {
                  return next(new AppError("User not found", 404));
            }
            const resetToken = user.getResetPasswordToken();
            await user.save();
            const resetURl = `${process.env.FRONTNED_URL}/reset-password/${resetToken}`;
            const message = `Click on the link to reset your password: \n\n ${resetURl} \n\n If you did not request this email, please ignore it.`;
            const subject = "Password reset link";
            try {
                  await sendEmail(email, subject, message);
                  res.status(200).json({
                        success: true,
                        message: `Email sent to ${email} successfully`,
                  });
            } catch (e) {
                  user.forgotPasswordToken = undefined;
                  user.forgotPasswordExpiry = undefined;
                  await user.save();
                  return next(
                        new AppError(
                              "Email could not be sent, please try again",
                              500
                        )
                  );
            }
      } catch (error) {
            return next(
                  new AppError(
                        error.message ||
                              "Something went wrong, please try again.",
                        500
                  )
            );
      }
};

export const resetPassword = async (req, res, next) => {
      res.status(200).json({
            success: true,
            message: "Password changed successfully",
      });
};

export const updateUser = async (req, res, next) => {
      res.status(200).json({
            success: true,
            message: "User details updated successfully",
      });
};
