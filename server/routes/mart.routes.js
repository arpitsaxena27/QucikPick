import { Router } from "express";
import {
      createMart,
      deleteMart,
      updateMartName,
      getMarts,
      getMartIdByIndex,
      getMartByRetailerId,
} from "../controllers/mart.controller.js";
import {
      addShelf,
      updateShelf,
      getShelves,
      getShelfByNid,
} from "../controllers/shelves.controller.js";
import {
      addProduct,
      updateProduct,
      deleteProduct,
      getProducts,
      getProductIdByIndex,
      getAllProductsOfMart,
} from "../controllers/product.controller.js";
import upload from "../middlewares/multer.middleware.js";
import { isLoggedIn } from "../middlewares/auth.middleware.js";

const router = Router();

// Create a new mart
router.post("/", isLoggedIn, upload.single("storeMap"), createMart);
// Delete a mart by ID
router.delete("/:id", isLoggedIn, deleteMart);
// Update mart name by ID
router.patch("/:id", isLoggedIn, updateMartName);
// Get list of marts
router.get("/", isLoggedIn, getMarts);
// Get mart by index of array
router.get("/index/:martIndex", isLoggedIn, getMartIdByIndex);
// Get mart by retailer ID
router.get("/retailer/:retailerId", isLoggedIn, getMartByRetailerId);
// Get all products in a mart by martId (across all shelves)
router.get("/:martId/products", isLoggedIn, getAllProductsOfMart);

// Shelves CRUD inside marts
// Add a shelf to a mart
router.post("/:martId/shelves", isLoggedIn, addShelf);
// Update a shelf's name in a mart
router.patch("/:martId/shelves/:shelfId", isLoggedIn, updateShelf);
// Get all shelves in a mart
router.get("/:martId/shelves", isLoggedIn, getShelves);
// Get a particular shelf by nid in a mart
router.get("/:martId/shelves/nid/:nid", isLoggedIn, getShelfByNid);

// Products CRUD inside shelves
// Add a product to a shelf by martId and shelf nid
router.post("/:martId/shelves/:nid/products", isLoggedIn, addProduct);
// Update a product in a shelf by martId, shelf nid, and product index
router.patch(
      "/:martId/shelves/:nid/products/:productId",
      isLoggedIn,
      updateProduct
);
// Delete a product from a shelf by martId, shelf nid, and product index
router.delete(
      "/:martId/shelves/:nid/products/:productId",
      isLoggedIn,
      deleteProduct
);
// Get all products in a shelf by martId and shelf nid
router.get("/:martId/shelves/:nid/products", isLoggedIn, getProducts);
// Get product id by index in shelf products array
router.get(
      "/:martId/shelves/:nid/products/index/:productIndex",
      isLoggedIn,
      getProductIdByIndex
);

export default router;
