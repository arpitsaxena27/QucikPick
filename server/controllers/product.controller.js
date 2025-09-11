import Mart from "../models/object.model.js";
import AppError from "../utils/appError.js";
import cloudinary from "cloudinary";

// Add a product to a shelf by martId and shelf nid
export const addProduct = async (req, res, next) => {
      try {
            const { martId, nid } = req.params;
            const { productName, quantity, price, imageUrl } = req.body;
            if (!productName || quantity == null || price == null) {
                  return next(
                        new AppError(
                              "Product name, quantity and price are required",
                              400
                        )
                  );
            }

            let finalImageUrl;
            try {
                  if (req.file) {
                        // If image file is uploaded, upload to cloudinary
                        console.log(
                              "Uploading file to Cloudinary:",
                              req.file.path
                        );
                        const result = await cloudinary.v2.uploader.upload(
                              req.file.path,
                              {
                                    folder: "product_images",
                                    resource_type: "auto",
                              }
                        );
                        finalImageUrl = result.secure_url;
                        console.log(
                              "Cloudinary upload successful:",
                              result.secure_url
                        );
                  } else if (imageUrl) {
                        // If imageUrl is provided, use it directly
                        finalImageUrl = imageUrl;
                        console.log("Using provided image URL:", imageUrl);
                  } else {
                        console.log("No image file or URL provided");
                        return next(
                              new AppError(
                                    "Either image file or image URL is required",
                                    400
                              )
                        );
                  }
            } catch (cloudinaryError) {
                  console.error("Cloudinary upload error:", cloudinaryError);
                  return next(
                        new AppError("Failed to process image upload", 500)
                  );
            }

            const mart = await Mart.findById(martId);
            if (!mart) return next(new AppError("Mart not found", 404));
            const shelf = mart.shelves.find((s) => s.nid === nid);
            if (!shelf) return next(new AppError("Shelf not found", 404));
            shelf.products.push({
                  productName,
                  quantity,
                  price,
                  imageUrl: finalImageUrl,
            });
            await mart.save();
            res.status(201).json({
                  success: true,
                  message: "Product added",
                  products: shelf.products,
            });
      } catch (error) {
            return next(new AppError(error.message, 500));
      }
};

// Update a product in a shelf by martId, shelf nid, and productId
export const updateProduct = async (req, res, next) => {
      try {
            const { martId, nid, productId } = req.params;
            const { productName, quantity, price, imageUrl } = req.body;

            // Find the mart and shelf
            const mart = await Mart.findById(martId);
            if (!mart) return next(new AppError("Mart not found", 404));
            const shelf = mart.shelves.find((s) => s.nid === nid);
            if (!shelf) return next(new AppError("Shelf not found", 404));
            const product = shelf.products.id(productId);
            if (!product) {
                  return next(new AppError("Product not found", 404));
            }

            // Handle image update
            let finalImageUrl = product.imageUrl; // Keep existing image by default
            try {
                  if (req.file) {
                        // If new image file is uploaded
                        const result = await cloudinary.v2.uploader.upload(
                              req.file.path,
                              {
                                    folder: "product_images",
                                    resource_type: "auto",
                              }
                        );
                        finalImageUrl = result.secure_url;
                  } else if (imageUrl && imageUrl !== product.imageUrl) {
                        // If new image URL is provided and it's different from current
                        finalImageUrl = imageUrl;
                  }
            } catch (cloudinaryError) {
                  console.error("Cloudinary upload error:", cloudinaryError);
                  return next(
                        new AppError("Failed to process image upload", 500)
                  );
            }

            // Update product fields
            if (productName !== undefined) product.productName = productName;
            if (quantity !== undefined) product.quantity = Number(quantity);
            if (price !== undefined) product.price = Number(price);
            product.imageUrl = finalImageUrl;

            await mart.save();
            res.status(200).json({
                  success: true,
                  message: "Product updated",
                  product,
            });
      } catch (error) {
            return next(new AppError(error.message, 500));
      }
};

// Delete a product from a shelf by martId, shelf nid, and productId
export const deleteProduct = async (req, res, next) => {
      try {
            const { martId, nid, productId } = req.params;
            const mart = await Mart.findById(martId);
            if (!mart) return next(new AppError("Mart not found", 404));
            const shelf = mart.shelves.find((s) => s.nid === nid);
            if (!shelf) return next(new AppError("Shelf not found", 404));
            const initialLength = shelf.products.length;
            shelf.products = shelf.products.filter(
                  (p) => p._id.toString() !== productId
            );
            if (shelf.products.length === initialLength) {
                  return next(new AppError("Product not found", 404));
            }
            await mart.save();
            res.status(200).json({
                  success: true,
                  message: "Product deleted",
                  products: shelf.products,
            });
      } catch (error) {
            return next(new AppError(error.message, 500));
      }
};

// Get all products in a mart by martId (across all shelves)
export const getAllProductsOfMart = async (req, res, next) => {
      try {
            const { martId } = req.params;
            const mart = await Mart.findById(martId);
            if (!mart) return next(new AppError("Mart not found", 404));
            // Aggregate all products from all shelves
            const products = mart.shelves.flatMap((shelf) =>
                  shelf.products.map((product) => ({
                        ...product.toObject(),
                        nid: shelf.nid,
                        shelfName: shelf.name,
                  }))
            );
            res.status(200).json({ success: true, products });
      } catch (error) {
            return next(new AppError(error.message, 500));
      }
};

// Get all products in a shelf by martId and shelf nid
export const getProducts = async (req, res, next) => {
      try {
            const { martId, nid } = req.params;
            const mart = await Mart.findById(martId);
            if (!mart) return next(new AppError("Mart not found", 404));
            const shelf = mart.shelves.find((s) => s.nid === nid);
            if (!shelf) return next(new AppError("Shelf not found", 404));
            res.status(200).json({ success: true, products: shelf.products });
      } catch (error) {
            return next(new AppError(error.message, 500));
      }
};

// Get product id by index in shelf products array
export const getProductIdByIndex = async (req, res, next) => {
      try {
            const { martId, nid, productIndex } = req.params;
            const idx = parseInt(productIndex);
            if (isNaN(idx) || idx < 0) {
                  return res
                        .status(400)
                        .json({ success: false, message: "Invalid index" });
            }
            const mart = await Mart.findById(martId);
            if (!mart) return next(new AppError("Mart not found", 404));
            const shelf = mart.shelves.find((s) => s.nid === nid);
            if (!shelf) return next(new AppError("Shelf not found", 404));
            if (idx >= shelf.products.length) {
                  return res
                        .status(404)
                        .json({ success: false, message: "Product not found" });
            }
            res.status(200).json({
                  success: true,
                  productId: shelf.products[idx]._id,
            });
      } catch (error) {
            return next(new AppError(error.message, 500));
      }
};

// Update product quantity and delete if quantity becomes zero
export const updateProductQuantity = async (req, res, next) => {
      try {
            const { martId, nid, productId } = req.params;
            const { quantity } = req.body;

            if (quantity === undefined) {
                  return next(new AppError("Quantity is required", 400));
            }

            const mart = await Mart.findById(martId);
            if (!mart) return next(new AppError("Mart not found", 404));

            const shelf = mart.shelves.find((s) => s.nid === nid);
            if (!shelf) return next(new AppError("Shelf not found", 404));

            const product = shelf.products.id(productId);
            if (!product) {
                  return next(new AppError("Product not found", 404));
            }

            if (quantity <= 0) {
                  // Remove the product if quantity is zero or negative
                  shelf.products = shelf.products.filter(
                        (p) => p._id.toString() !== productId
                  );
                  await mart.save();
                  return res.status(200).json({
                        success: true,
                        message: "Product deleted due to zero quantity",
                        deleted: true,
                  });
            }

            // Update quantity if greater than 0
            product.quantity = quantity;
            await mart.save();

            res.status(200).json({
                  success: true,
                  message: "Product quantity updated",
                  product,
                  deleted: false,
            });
      } catch (error) {
            return next(new AppError(error.message, 500));
      }
};
