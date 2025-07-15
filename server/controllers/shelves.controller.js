import Mart from "../models/object.model.js";
import AppError from "../utils/appError.js";

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
            const newShelf = { name, nid };
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
            res.status(200).json({
                  success: true,
                  shelves: mart.shelves,
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
