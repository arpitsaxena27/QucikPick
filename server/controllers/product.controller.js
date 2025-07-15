import Mart from "../models/object.model.js";
import AppError from "../utils/appError.js";

// Add a product to a shelf by martId and shelf nid
export const addProduct = async (req, res, next) => {
      try {
            const { martId, nid } = req.params;
            const { productName, quantity, price, imageUrl } = req.body;
            if (!productName || quantity == null || price == null || !imageUrl) {
                  return next(
                        new AppError("All product fields are required", 400)
                  );
            }
            const mart = await Mart.findById(martId);
            if (!mart) return next(new AppError("Mart not found", 404));
            const shelf = mart.shelves.find((s) => s.nid === nid);
            if (!shelf) return next(new AppError("Shelf not found", 404));
            shelf.products.push({ productName, quantity, price, imageUrl });
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
            const mart = await Mart.findById(martId);
            if (!mart) return next(new AppError("Mart not found", 404));
            const shelf = mart.shelves.find((s) => s.nid === nid);
            if (!shelf) return next(new AppError("Shelf not found", 404));
            const product = shelf.products.id(productId);
            if (!product) {
                  return next(new AppError("Product not found", 404));
            }
            if (productName !== undefined) product.productName = productName;
            if (quantity !== undefined) product.quantity = quantity;
            if (price !== undefined) product.price = price;
            if (imageUrlUrl !== undefined) product.imageUrlUrl = imageUrl;
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
