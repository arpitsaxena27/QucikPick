
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Plus, Edit, Trash2 } from "lucide-react"; // Importing icons
import {
      fetchProducts,
      addProduct,
      updateProduct,
      deleteProduct,
      selectShelves,
      fetchShelfInfo,
      updateShelfName,
      fetchProductsByShelf,
} from "../store/slices/productsSlice";
import {
      CircularProgress,
      Dialog,
      DialogTitle,
      DialogContent,
      DialogActions,
      Button,
      TextField,
} from "@mui/material";

const shuffleArray = (array) => {
      let shuffledArray = array.slice();
      for (let i = shuffledArray.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffledArray[i], shuffledArray[j]] = [
                  shuffledArray[j],
                  shuffledArray[i],
            ];
      }
      return shuffledArray;
};

const ProductList = ({
      searchQuery,
      selectedCategory,
      sortOrder,
      onProductClick,
      onAddToCart,
      userRole,
}) => {
      const dispatch = useDispatch();
      const { products: storeProducts, loading } = useSelector(
            (state) => state.products
      );
      const martId = useSelector((state) => state.products.martId);

      const [filteredProducts, setFilteredProducts] = useState([]);
      const [dialogOpen, setDialogOpen] = useState(false);
      const [dialogMode, setDialogMode] = useState("add"); // 'add' or 'edit'
      const [editingProduct, setEditingProduct] = useState(null);
      const [productForm, setProductForm] = useState({
            productName: "",
            price: "",
            quantity: "",
            imageUrl: "",
            nid: "",
            name: "",
      });
      const [shelfDialogOpen, setShelfDialogOpen] = useState(false);
      const [newShelfName, setNewShelfName] = useState("");

      useEffect(() => {
            dispatch(fetchProducts());
      }, [dispatch]);

      const shelves = useSelector(selectShelves);
      console.log(shelves);

      useEffect(() => {
            dispatch(fetchShelfInfo());
      }, [dispatch]);

      useEffect(() => {
            if (storeProducts.length > 0) {
                  setFilteredProducts(shuffleArray(storeProducts));
            }
      }, [storeProducts]);

      useEffect(() => {
            const query = (searchQuery || "").trim().toLowerCase();
            const newCategory = selectedCategory.trim().toLowerCase();
            console.log(selectedCategory);

            let newFilteredProducts = storeProducts.filter((product) => {
                  const matchesQuery =
                        product.productName &&
                        typeof product.productName === "string" &&
                        product.productName.toLowerCase().includes(query);
                  const matchesCategory = newCategory
                        ? product.nid &&
                          product.nid.toLowerCase() === newCategory
                        : true;
                  return matchesQuery && matchesCategory;
            });

            if (sortOrder === "price_asc") {
                  newFilteredProducts.sort((a, b) => a.price - b.price);
            } else if (sortOrder === "price_desc") {
                  newFilteredProducts.sort((a, b) => b.price - a.price);
            } else {
                  newFilteredProducts = shuffleArray(newFilteredProducts);
            }

            setFilteredProducts(newFilteredProducts);
      }, [searchQuery, selectedCategory, storeProducts, sortOrder]);

      // Function to fetch products by shelf nid when shelf/category is clicked
      const handleShelfClick = async (nid) => {
            if (martId && nid) {
                  console.log("Fetching products for shelf:", nid);
                  const resultAction = await dispatch(
                        fetchProductsByShelf({ martId, nid })
                  ).unwrap();
                  console.log("Fetched products:", resultAction);
                  setFilteredProducts(resultAction);
            }
      };

      useEffect(() => {
            if (selectedCategory) {
                  handleShelfClick(selectedCategory);
            } else if (martId) {
                  dispatch(fetchProducts({ martId }));
            }
      }, [selectedCategory, martId, dispatch]);

      const handleAddNew = () => {
            if (!selectedCategory) {
                  alert("Please select a shelf first");
                  return;
            }

            const currentShelf = shelves.find(
                  (shelf) => shelf.nid === selectedCategory
            );
            setDialogMode("add");
            setProductForm({
                  productName: "",
                  price: "",
                  quantity: "",
                  imageUrl: "",
                  image: "",
                  nid: selectedCategory, // Set the nid to selectedCategory
                  name: currentShelf ? currentShelf.name : "", // Set the name from shelf info
            });
            setDialogOpen(true);
      };

      const handleEdit = (product) => {
            setDialogMode("edit");
            setEditingProduct(product);
            setProductForm({
                  productName: product.productName,
                  price: product.price,
                  quantity: product.quantity,
                  imageUrl: product.imageUrl,
                  nid: product.nid,
                  name: product.name,
            });
            setDialogOpen(true);
      };

      const handleDelete = async (product) => {
            if (
                  window.confirm(
                        "Are you sure you want to delete this product?"
                  )
            ) {
                  try {
                        await dispatch(
                              deleteProduct({
                                    productId: product._id,
                                    productData: {
                                          nid: selectedCategory,
                                    },
                                    martId,
                              })
                        ).unwrap();

                        // Refresh the products list after delete
                        if (selectedCategory) {
                              handleShelfClick(selectedCategory);
                        } else if (martId) {
                              dispatch(fetchProducts({ martId }));
                        }
                  } catch (error) {
                        console.error("Error deleting product:", error);
                        alert("Failed to delete product. Please try again.");
                  }
            }
      };
      const handleEditShelve = () => {
            const currentShelf = shelves.find(
                  (shelf) => shelf.nid === selectedCategory
            );
            if (currentShelf) {
                  setNewShelfName(currentShelf.name);
                  setShelfDialogOpen(true);
            } else {
                  alert("Please select a shelf first");
            }
      };

      const handleShelfNameSubmit = async () => {
            if (!selectedCategory || !newShelfName.trim()) {
                  alert("Shelf name cannot be empty.");
                  return;
            }

            try {
                  await dispatch(
                        updateShelfName({
                              martId,
                              shelvesId: selectedCategory,
                              newName: newShelfName.trim(),
                        })
                  ).unwrap();

                  // Refresh shelves UI if needed
                  if (martId) {
                        dispatch(fetchProducts({ martId }));
                  }

                  setShelfDialogOpen(false);
                  alert("Shelf name updated successfully!");
            } catch (error) {
                  console.error("Error updating shelf name:", error);
                  alert("Failed to update shelf name. Please try again.");
            }
      };

      const handleSubmit = async () => {
            try {
                  if (dialogMode === "add") {
                        if (
                              !productForm.productName ||
                              !productForm.price ||
                              !productForm.quantity ||
                              !productForm.imageUrl
                        ) {
                              alert("Please fill in all required fields");
                              return;
                        }

                        console.log("Adding product with data:", {
                              productData: productForm,
                              martId,
                        });

                        const resultAction = await dispatch(
                              addProduct({
                                    productData: {
                                          productName: productForm.productName,
                                          price: productForm.price,
                                          quantity: productForm.quantity,
                                          imageUrl: productForm.imageUrl,
                                          nid: productForm.nid,
                                    },
                                    martId,
                              })
                        ).unwrap();

                        console.log("Add product result:", resultAction);

                        // Refresh products after adding
                        if (selectedCategory) {
                              handleShelfClick(selectedCategory);
                        } else if (martId) {
                              dispatch(fetchProducts({ martId }));
                        }
                  } else {
                        // Use new image URL if provided, otherwise use original
                        const imageUrl =
                              productForm.imageUrl ===
                              productForm.originalImageUrl
                                    ? productForm.originalImageUrl
                                    : productForm.imageUrl ||
                                      productForm.originalImageUrl;

                        console.log("Updating product:", {
                              productId: editingProduct._id,
                              productData: {
                                    productName: productForm.productName,
                                    price: productForm.price,
                                    quantity: productForm.quantity,
                                    imageUrl: imageUrl,
                                    nid: productForm.nid,
                              },
                              martId,
                        });

                        const updateResult = await dispatch(
                              updateProduct({
                                    productId: editingProduct._id,
                                    productData: {
                                          productName: productForm.productName,
                                          price: productForm.price,
                                          quantity: productForm.quantity,
                                          imageUrl: imageUrl,
                                          nid: productForm.nid,
                                    },
                                    martId,
                              })
                        ).unwrap();

                        console.log("Update result:", updateResult);

                        // Refresh the products list after update
                        if (selectedCategory) {
                              handleShelfClick(selectedCategory);
                        } else if (martId) {
                              dispatch(fetchProducts({ martId }));
                        }
                  }
                  setDialogOpen(false);
            } catch (error) {
                  console.error("Error in handleSubmit:", error);
                  alert("Failed to save product. Please try again.");
            }
      };

      return (
            <>
                  {loading ? (
                        <div className="flex justify-center">
                              <CircularProgress />
                        </div>
                  ) : (
                        <div className="container mx-auto">
                              <div className="flex justify-evenly items-center m-2">
                                    {userRole === "retailer" && (
                                          <div className="mb-4">
                                                <button
                                                      onClick={handleAddNew}
                                                      className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded flex items-center gap-2"
                                                      title="Add New Product"
                                                >
                                                      <Plus size={18} />
                                                </button>
                                          </div>
                                    )}
                                    {userRole === "retailer" && (
                                          <div className="mb-4">
                                                <button
                                                      onClick={handleEditShelve}
                                                      className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded flex items-center gap-2"
                                                      title="Edit Shelf Name"
                                                      disabled={
                                                            !selectedCategory
                                                      }
                                                >
                                                      <Edit size={18} />
                                                </button>
                                          </div>
                                    )}
                              </div>

                              <div className="flex flex-wrap justify-center gap-4">
                                    {filteredProducts.length > 0 ? (
                                          filteredProducts.map((product) => (
                                                <div
                                                      key={product._id}
                                                      className="w-[46%] bg-white border border-gray-200 shadow-sm hover:shadow-md transition duration-300 rounded-lg overflow-hidden flex flex-col"
                                                >
                                                      <div className="p-3 flex justify-center bg-gray-100">
                                                            <img
                                                                  src={
                                                                        product.imageUrl
                                                                  }
                                                                  alt={
                                                                        product.productName
                                                                  }
                                                                  className="h-40 md:h-48 object-contain w-auto cursor-pointer"
                                                                  onClick={() =>
                                                                        onProductClick(
                                                                              product
                                                                        )
                                                                  }
                                                            />
                                                      </div>
                                                      <div className="p-4 flex flex-col flex-grow">
                                                            <h2
                                                                  className="text-sm md:text-base font-semibold text-gray-800 hover:text-blue-500 cursor-pointer line-clamp-2 h-10"
                                                                  onClick={() =>
                                                                        onProductClick(
                                                                              product
                                                                        )
                                                                  }
                                                            >
                                                                  {
                                                                        product.productName
                                                                  }
                                                            </h2>
                                                            <p className="text-xs md:text-sm text-gray-600 mt-1">
                                                                  Quantity:{" "}
                                                                  {
                                                                        product.quantity
                                                                  }
                                                            </p>
                                                            <p className="text-lg md:text-xl font-bold text-red-600 mt-1">
                                                                  ₹
                                                                  {
                                                                        product.price
                                                                  }
                                                            </p>
                                                            {userRole !==
                                                                  "retailer" && (
                                                                  <button
                                                                        className="mt-4 w-full bg-yellow-500 hover:bg-yellow-600 text-black text-[11px] font-medium py-2 rounded-md transition"
                                                                        onClick={() =>
                                                                              onAddToCart(
                                                                                    product
                                                                              )
                                                                        }
                                                                  >
                                                                        Add to
                                                                        Cart
                                                                  </button>
                                                            )}
                                                      </div>
                                                      {userRole ===
                                                            "retailer" && (
                                                            <div className="p-2 flex justify-evenly gap-2 bg-gray-50">
                                                                  <button
                                                                        onClick={() =>
                                                                              handleEdit(
                                                                                    product
                                                                              )
                                                                        }
                                                                        className="bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 rounded text-sm flex items-center gap-2"
                                                                        title="Edit Product"
                                                                  >
                                                                        <Edit
                                                                              size={
                                                                                    16
                                                                              }
                                                                        />
                                                                  </button>
                                                                  <button
                                                                        onClick={() =>
                                                                              handleDelete(
                                                                                    product
                                                                              )
                                                                        }
                                                                        className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded text-sm flex items-center gap-2"
                                                                        title="Delete Product"
                                                                  >
                                                                        <Trash2
                                                                              size={
                                                                                    16
                                                                              }
                                                                        />
                                                                  </button>
                                                            </div>
                                                      )}
                                                </div>
                                          ))
                                    ) : (
                                          <p className="text-center w-full text-lg">
                                                No products found
                                          </p>
                                    )}
                              </div>
                        </div>
                  )}

                  <Dialog
                        open={dialogOpen}
                        onClose={() => setDialogOpen(false)}
                        maxWidth="sm"
                        fullWidth
                  >
                        <DialogTitle
                              sx={{
                                    borderBottom: "1px solid #e0e0e0",
                                    backgroundColor: "#f5f5f5",
                              }}
                        >
                              {dialogMode === "add"
                                    ? "Add New Product"
                                    : "Edit Product"}
                        </DialogTitle>
                        <DialogContent sx={{ p: 3, mt: 1 }}>
                              <div className="space-y-4">
                                    <TextField
                                          label="Product Name"
                                          value={productForm.productName}
                                          onChange={(e) =>
                                                setProductForm({
                                                      ...productForm,
                                                      productName:
                                                            e.target.value,
                                                })
                                          }
                                          fullWidth
                                          size="small"
                                          required
                                    />
                                    <div className="grid grid-cols-2 gap-4">
                                          <TextField
                                                label="Price"
                                                type="number"
                                                value={productForm.price}
                                                onChange={(e) =>
                                                      setProductForm({
                                                            ...productForm,
                                                            price: e.target
                                                                  .value,
                                                      })
                                                }
                                                size="small"
                                                required
                                                InputProps={{
                                                      startAdornment: (
                                                            <span className="text-gray-500 mr-1">
                                                                  ₹
                                                            </span>
                                                      ),
                                                }}
                                          />
                                          <TextField
                                                label="Quantity"
                                                type="number"
                                                value={productForm.quantity}
                                                onChange={(e) =>
                                                      setProductForm({
                                                            ...productForm,
                                                            quantity: e.target
                                                                  .value,
                                                      })
                                                }
                                                size="small"
                                                required
                                          />
                                    </div>
                                    <TextField
                                          label="Image URL"
                                          value={productForm.imageUrl}
                                          onChange={(e) =>
                                                setProductForm({
                                                      ...productForm,
                                                      imageUrl: e.target.value,
                                                })
                                          }
                                          fullWidth
                                          size="small"
                                          required
                                    />
                                    <TextField
                                          label="Shelve name"
                                          value={productForm.name}
                                          onChange={(e) =>
                                                setProductForm({
                                                      ...productForm,
                                                      name: e.target.value,
                                                })
                                          }
                                          fullWidth
                                          size="small"
                                          required
                                    />
                              </div>
                        </DialogContent>
                        <DialogActions
                              sx={{
                                    p: 2,
                                    borderTop: "1px solid #e0e0e0",
                                    backgroundColor: "#f5f5f5",
                              }}
                        >
                              <Button
                                    onClick={() => setDialogOpen(false)}
                                    variant="outlined"
                                    color="inherit"
                              >
                                    Cancel
                              </Button>
                              <Button
                                    onClick={handleSubmit}
                                    variant="contained"
                                    color="primary"
                                    sx={{ ml: 1 }}
                              >
                                    {dialogMode === "add"
                                          ? "Add Product"
                                          : "Save Changes"}
                              </Button>
                        </DialogActions>
                  </Dialog>

                  <Dialog
                        open={shelfDialogOpen}
                        onClose={() => setShelfDialogOpen(false)}
                        maxWidth="sm"
                        fullWidth
                  >
                        <DialogTitle
                              sx={{
                                    borderBottom: "1px solid #e0e0e0",
                                    backgroundColor: "#f5f5f5",
                              }}
                        >
                              Edit Shelf Name
                        </DialogTitle>
                        <DialogContent sx={{ p: 3, mt: 2 }}>
                              <TextField
                                    label="New Shelf Name"
                                    value={newShelfName}
                                    onChange={(e) =>
                                          setNewShelfName(e.target.value)
                                    }
                                    fullWidth
                                    size="small"
                                    required
                                    sx={{ mt: 1 }}
                              />
                        </DialogContent>
                        <DialogActions
                              sx={{
                                    p: 2,
                                    borderTop: "1px solid #e0e0e0",
                                    backgroundColor: "#f5f5f5",
                              }}
                        >
                              <Button
                                    onClick={() => setShelfDialogOpen(false)}
                                    color="inherit"
                              >
                                    Cancel
                              </Button>
                              <Button
                                    onClick={handleShelfNameSubmit}
                                    variant="contained"
                                    color="primary"
                                    disabled={!newShelfName.trim()}
                              >
                                    Save Changes
                              </Button>
                        </DialogActions>
                  </Dialog>
            </>
      );
};

export default ProductList;
