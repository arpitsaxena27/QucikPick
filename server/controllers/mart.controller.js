import Mart from "../models/object.model.js";
import AppError from "../utils/appError.js";
import cloudinary from "cloudinary";
import fs from "fs/promises";

// Create a new mart
export const createMart = async (req, res, next) => {
      try {
            const { storeName, address, retailerId } = req.body;
            if (!storeName || !address || !retailerId) {
                  return next(
                        new AppError(
                              "Store name and address and reatailerId are required",
                              400
                        )
                  );
            }
            const martExists = await Mart.findOne({ retailerId });
            if (martExists) {
                  return next(
                        new AppError(
                              "Mart already exists for this retailer",
                              400
                        )
                  );
            }
            const newMart = await Mart.create({
                  storeName,
                  storeMap: {
                        public_id: "sample_id",
                        secure_url: "sample_url",
                  },
                  address,
                  retailerId,
            });
            //FILE upload to cloudinary and delete from local storage after getting the url
            if (req.file) {
                  try {
                        const fileData = await cloudinary.v2.uploader.upload(
                              req.file.path,
                              {
                                    folder: "marts",
                                    width: 500,
                                    height: 500,
                                    crop: "fill",
                              }
                        );

                        if (fileData) {
                              newMart.storeMap.public_id = fileData.public_id;
                              newMart.storeMap.secure_url = fileData.secure_url;
                              await fs.rm(`uploads/${req.file.filename}`);
                        }

                        await newMart.save();
                  } catch (e) {
                        return next(
                              new AppError(
                                    "Error uploading store map image",
                                    500
                              )
                        );
                  }
            }

            res.status(201).json({
                  success: true,
                  message: "Mart created successfully",
                  mart: newMart,
            });
      } catch (error) {
            return next(new AppError(error.message, 500));
      }
};

// Delete a mart by ID
export const deleteMart = async (req, res, next) => {
      try {
            const { id } = req.params;
            const mart = await Mart.findByIdAndDelete(id);
            if (!mart) {
                  return next(new AppError("Mart not found", 404));
            }
            res.status(200).json({
                  success: true,
                  message: "Mart deleted successfully",
            });
      } catch (error) {
            return next(new AppError(error.message, 500));
      }
};

// Update mart name by ID
export const updateMartName = async (req, res, next) => {
      try {
            const { id } = req.params;
            const { storeName } = req.body;
            console.log("Store Name:", storeName);
            if (!storeName) {
                  return next(new AppError("Store name is required", 400));
            }
            const mart = await Mart.findByIdAndUpdate(
                  id,
                  { storeName },
                  { new: true }
            );
            if (!mart) {
                  return next(new AppError("Mart not found", 404));
            }
            res.status(200).json({
                  success: true,
                  message: "Mart name updated successfully",
                  mart,
            });
      } catch (error) {
            return next(new AppError(error.message, 500));
      }
};

// Get list of marts
export const getMarts = async (req, res, next) => {
      try {
            const marts = await Mart.find();
            res.status(200).json({
                  success: true,
                  marts,
            });
      } catch (error) {
            return next(new AppError(error.message, 500));
      }
};

// Get mart id by index in marts array
export const getMartIdByIndex = async (req, res, next) => {
      try {
            const idx = parseInt(req.params.martIndex);
            if (isNaN(idx) || idx < 0) {
                  return res
                        .status(400)
                        .json({ success: false, message: "Invalid index" });
            }
            const marts = await Mart.find().select("_id");
            if (idx >= marts.length) {
                  return res
                        .status(404)
                        .json({ success: false, message: "Mart not found" });
            }
            res.status(200).json({ success: true, martId: marts[idx]._id });
      } catch (error) {
            return next(new AppError(error.message, 500));
      }
};

// Get mart by retailerId
export const getMartByRetailerId = async (req, res, next) => {
      try {
            const { retailerId } = req.params;
            if (!retailerId) {
                  return res
                        .status(400)
                        .json({
                              success: false,
                              message: "Retailer ID is required",
                        });
            }
            const mart = await Mart.findOne({ retailerId });
            if (!mart) {
                  return res.status(404).json({
                        success: false,
                        message: "Mart not found for this retailer",
                  });
            }
            res.status(200).json({ success: true, mart });
      } catch (error) {
            return next(new AppError(error.message, 500));
      }
};
