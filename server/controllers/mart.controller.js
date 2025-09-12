import Mart from "../models/object.model.js";
import AppError from "../utils/appError.js";
import cloudinary from "cloudinary";
import fs from "fs/promises";

// Helper function to calculate polygon area using Shoelace formula
const calculatePolygonArea = (points) => {
      let area = 0;
      const n = points.length;

      for (let i = 0; i < n; i++) {
            const j = (i + 1) % n;
            area += points[i].x * points[j].y;
            area -= points[j].x * points[i].y;
      }

      return Math.abs(area) / 2;
};

// Helper function to calculate if a polygon is convex
const isPolygonConvex = (points) => {
      if (points.length < 3) return false;

      let sign = 0;
      const n = points.length;

      for (let i = 0; i < n; i++) {
            const p1 = points[i];
            const p2 = points[(i + 1) % n];
            const p3 = points[(i + 2) % n];

            // Calculate cross product
            const cross =
                  (p2.x - p1.x) * (p3.y - p1.y) - (p2.y - p1.y) * (p3.x - p1.x);

            if (i === 0) {
                  sign = Math.sign(cross);
            } else if (sign * cross < 0) {
                  return false;
            }
      }
      return true;
};

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

            // Create the mart
            const newMart = await Mart.create({
                  storeName,
                  storeMap: {
                        public_id: "sample_id",
                        secure_url: "sample_url",
                  },
                  address,
                  retailerId,
            });

            // Create payment record for the mart
            const Payment = (await import("../models/Payment.model.js"))
                  .default;
            await Payment.create({
                  martId: newMart._id,
                  retailerId,
                  payments: [], // Initially empty array of payments
            });
            //FILE upload to cloudinary and delete from local storage after getting the url
            if (req.file) {
                  try {
                        const fileData = await cloudinary.v2.uploader.upload(
                              req.file.path,
                              {
                                    folder: "marts",
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
                  return res.status(400).json({
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

// Get mart by ID
export const getMartById = async (req, res, next) => {
      try {
            const { id } = req.params;
            if (!id) {
                  return res.status(400).json({
                        success: false,
                        message: "Mart ID is required",
                  });
            }
            const mart = await Mart.findById(id);
            if (!mart) {
                  return next(new AppError("Mart not found", 404));
            }
            res.status(200).json({ success: true, mart });
      } catch (error) {
            return next(new AppError(error.message, 500));
      }
};

// Update complete mart details including store map
export const updateMart = async (req, res, next) => {
      try {
            const { id } = req.params;
            const { storeName, address } = req.body;

            const mart = await Mart.findById(id);
            if (!mart) {
                  return next(new AppError("Mart not found", 404));
            }

            // Update basic mart details
            mart.storeName = storeName || mart.storeName;
            mart.address = address || mart.address;

            // Handle store map update if a new file is provided
            if (req.file) {
                  // Delete old image from cloudinary if it exists
                  if (mart.storeMap && mart.storeMap.public_id) {
                        try {
                              await cloudinary.v2.uploader.destroy(
                                    mart.storeMap.public_id
                              );
                        } catch (error) {
                              console.error("Error deleting old image:", error);
                        }
                  }

                  // Upload new image to cloudinary
                  try {
                        const fileData = await cloudinary.v2.uploader.upload(
                              req.file.path,
                              {
                                    folder: "marts",
                              }
                        );

                        if (fileData) {
                              mart.storeMap.public_id = fileData.public_id;
                              mart.storeMap.secure_url = fileData.secure_url;
                              // Clear the shelves array as the map has changed
                              mart.shelves = [];
                              await fs.rm(`uploads/${req.file.filename}`);
                        }
                  } catch (error) {
                        return next(
                              new AppError(
                                    "Error uploading store map image",
                                    500
                              )
                        );
                  }
            }

            await mart.save();

            res.status(200).json({
                  success: true,
                  message: "Mart updated successfully",
                  mart,
            });
      } catch (error) {
            return next(new AppError(error.message, 500));
      }
};

// Add multiple shelves to a mart
export const addMultipleShelves = async (req, res, next) => {
      try {
            const { martId } = req.params;
            const { shelves } = req.body;

            console.log("Received request:", {
                  martId,
                  shelves: shelves,
            });

            if (!Array.isArray(shelves) || shelves.length === 0) {
                  return next(
                        new AppError(
                              "Shelves array is required and cannot be empty",
                              400
                        )
                  );
            }

            const mart = await Mart.findById(martId);
            if (!mart) {
                  return next(new AppError("Mart not found", 404));
            }

            // Check if shelves already exist
            if (mart.shelves && mart.shelves.length > 0) {
                  return res.status(200).json({
                        success: false,
                        message: "Shelves already exist for this mart",
                        shelves: mart.shelves,
                  });
            }

            // Validate each shelf object in the array
            for (const [index, shelf] of shelves.entries()) {
                  console.log(`Validating shelf ${index}:`, shelf);

                  if (!shelf.name) {
                        return next(
                              new AppError(
                                    `Shelf ${index} is missing name`,
                                    400
                              )
                        );
                  }
                  if (!shelf.nid) {
                        return next(
                              new AppError(`Shelf ${index} is missing nid`, 400)
                        );
                  }
                  if (!shelf.points) {
                        return next(
                              new AppError(
                                    `Shelf ${index} is missing points`,
                                    400
                              )
                        );
                  }
                  if (!shelf.boundingBox) {
                        return next(
                              new AppError(
                                    `Shelf ${index} is missing boundingBox`,
                                    400
                              )
                        );
                  }

                  // Validate points array
                  if (!Array.isArray(shelf.points) || shelf.points.length < 3) {
                        return next(
                              new AppError(
                                    `Shelf ${index} must have at least 3 points`,
                                    400
                              )
                        );
                  }

                  // Validate boundingBox structure
                  const { x, y, width, height } = shelf.boundingBox;
                  if (
                        typeof x !== "number" ||
                        typeof y !== "number" ||
                        typeof width !== "number" ||
                        typeof height !== "number"
                  ) {
                        return next(
                              new AppError(
                                    `Shelf ${index} has invalid boundingBox properties`,
                                    400
                              )
                        );
                  }
            }

            // Calculate area and isConvex for each shelf before adding
            const processedShelves = shelves.map((shelf) => {
                  // Calculate area from points
                  const area = calculatePolygonArea(shelf.points);

                  // Calculate isConvex
                  const isConvex = isPolygonConvex(shelf.points);

                  return {
                        ...shelf,
                        area,
                        isConvex,
                  };
            });

            // Add all processed shelves to the mart
            mart.shelves.push(...processedShelves);
            await mart.save();

            res.status(200).json({
                  success: true,
                  message: "Shelves added successfully",
                  shelves: mart.shelves,
            });
      } catch (error) {
            return next(new AppError(error.message, 500));
      }
};
