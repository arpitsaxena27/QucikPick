import Mart from "../models/object.model.js";
import AppError from "../utils/appError.js";

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

// Add a shelf to a mart
export const addShelf = async (req, res, next) => {
      try {
            const { martId } = req.params;
            const { name, nid } = req.body;
            if (!name) {
                  return next(new AppError("Shelf name is required", 400));
            }
            if (!nid) {
                  return next(new AppError("Shelf nid is required", 400));
            }
            const mart = await Mart.findById(martId);
            if (!mart) {
                  return next(new AppError("Mart not found", 404));
            }
            // Check if shelf with this nid already exists
            const shelfExists = mart.shelves.some((shelf) => shelf.nid === nid);
            if (shelfExists) {
                  return next(
                        new AppError("Shelf with this nid already exists", 400)
                  );
            }
            const newShelf = {
                  name,
                  nid,
                  boundingBox: {
                        x: req.body.boundingBox?.x || 0,
                        y: req.body.boundingBox?.y || 0,
                        width: req.body.boundingBox?.width || 0,
                        height: req.body.boundingBox?.height || 0,
                  },
                  points: req.body.points || [],
                  area: req.body.area || 0,
                  isConvex: req.body.isConvex || false,
                  products: [],
            };
            mart.shelves.push(newShelf);
            await mart.save();
            res.status(201).json({
                  success: true,
                  message: "Shelf added successfully",
                  shelves: mart.shelves,
            });
      } catch (error) {
            return next(new AppError(error.message, 500));
      }
};

// Update a shelf's name in a mart using `nid`
export const updateShelf = async (req, res, next) => {
      try {
            const { martId, shelfId } = req.params; // shelfId is actually 'nid' here
            const { name } = req.body;

            if (!name) {
                  return next(new AppError("Shelf name is required", 400));
            }

            const mart = await Mart.findById(martId);
            if (!mart) {
                  return next(new AppError("Mart not found", 404));
            }

            const shelf = mart.shelves.find((shelf) => shelf.nid === shelfId);
            if (!shelf) {
                  return next(new AppError("Shelf not found", 404));
            }

            shelf.name = name;
            await mart.save();

            res.status(200).json({
                  success: true,
                  message: "Shelf updated successfully",
                  shelf,
            });
      } catch (error) {
            return next(new AppError(error.message, 500));
      }
};

// Get all shelves in a mart
export const getShelves = async (req, res, next) => {
      try {
            const { martId } = req.params;
            const mart = await Mart.findById(martId);
            if (!mart) {
                  return next(new AppError("Mart not found", 404));
            }

            // Transform the shelves data to match the frontend's expected structure
            const transformedShelves = mart.shelves.map((shelf) => ({
                  id: shelf._id,
                  nid: shelf.nid,
                  name: shelf.name,
                  boundingBox: {
                        x: shelf.boundingBox?.x || 0,
                        y: shelf.boundingBox?.y || 0,
                        width: shelf.boundingBox?.width || 0,
                        height: shelf.boundingBox?.height || 0,
                  },
                  points: shelf.points || [],
                  area: shelf.area || 0,
                  isConvex: shelf.isConvex || false,
                  products: shelf.products || [],
            }));

            res.status(200).json({
                  success: true,
                  shelves: transformedShelves,
            });
      } catch (error) {
            return next(new AppError(error.message, 500));
      }
};

// Get a particular shelf by nid in a mart
export const getShelfByNid = async (req, res, next) => {
      try {
            const { martId, nid } = req.params;
            const mart = await Mart.findById(martId);
            if (!mart) {
                  return next(new AppError("Mart not found", 404));
            }
            const shelf = mart.shelves.find((shelf) => shelf.nid === nid);
            if (!shelf) {
                  return next(new AppError("Shelf not found", 404));
            }
            res.status(200).json({
                  success: true,
                  shelf,
            });
      } catch (error) {
            return next(new AppError(error.message, 500));
      }
};
