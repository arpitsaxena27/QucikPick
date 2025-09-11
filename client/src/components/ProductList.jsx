import { useState, useEffect } from "react";
import PropTypes from "prop-types";
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
      setShelvesState,
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
            imageFile: null,
            nid: "",
            name: "",
      });
      const [imageInputType, setImageInputType] = useState("url"); // "url" or "file"
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

      // Remove the shuffle effect as it interferes with proper filtering

      useEffect(() => {
            const query = (searchQuery || "").trim().toLowerCase();

            // Only filter by search query since shelf filtering is handled by the API
            let newFilteredProducts = storeProducts.filter((product) => {
                  return (
                        product.productName &&
                        typeof product.productName === "string" &&
                        product.productName.toLowerCase().includes(query)
                  );
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

            // Update shelf name in UI immediately
            const updatedShelves = shelves.map((shelf) =>
                  shelf.nid === selectedCategory
                        ? { ...shelf, name: newShelfName.trim() }
                        : shelf
            );

            // Update filtered products to show new shelf name immediately
            const updatedProducts = filteredProducts.map((product) =>
                  product.nid === selectedCategory
                        ? { ...product, name: newShelfName.trim() }
                        : product
            );

            // Update both states immediately
            dispatch(setShelvesState(updatedShelves));
            setFilteredProducts(updatedProducts);

            setShelfDialogOpen(false);

            try {
                  await dispatch(
                        updateShelfName({
                              martId,
                              shelvesId: selectedCategory,
                              newName: newShelfName.trim(),
                        })
                  ).unwrap();

                  // Don't need to show success message as UI is already updated
            } catch (error) {
                  console.error("Error updating shelf name:", error);
                  // Revert both UI changes on error
                  const revertShelves = shelves.map((shelf) =>
                        shelf.nid === selectedCategory
                              ? { ...shelf, name: shelf.name }
                              : shelf
                  );
                  const originalShelf = shelves.find(
                        (s) => s.nid === selectedCategory
                  );
                  const revertProducts = filteredProducts.map((product) =>
                        product.nid === selectedCategory
                              ? { ...product, name: originalShelf.name }
                              : product
                  );
                  dispatch(setShelvesState(revertShelves));
                  setFilteredProducts(revertProducts);
                  alert(
                        "Failed to update shelf name. Changes have been reverted."
                  );
            }
      };

      const handleSubmit = async () => {
            try {
                  if (dialogMode === "add") {
                        if (
                              !productForm.productName ||
                              !productForm.price ||
                              !productForm.quantity ||
                              (imageInputType === "url" &&
                                    !productForm.imageUrl) ||
                              (imageInputType === "file" &&
                                    !productForm.imageFile)
                        ) {
                              alert("Please fill in all required fields");
                              return;
                        }

                        console.log("Adding product with data:", {
                              productData: productForm,
                              martId,
                        });

                        const formData = new FormData();
                        formData.append("productName", productForm.productName);
                        formData.append("price", productForm.price);
                        formData.append("quantity", productForm.quantity);
                        formData.append("nid", productForm.nid);

                        if (
                              imageInputType === "file" &&
                              productForm.imageFile
                        ) {
                              formData.append(
                                    "productImage",
                                    productForm.imageFile
                              );
                        } else if (
                              imageInputType === "url" &&
                              productForm.imageUrl
                        ) {
                              formData.append("imageUrl", productForm.imageUrl);
                        }

                        const resultAction = await dispatch(
                              addProduct({
                                    productData: formData,
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
                        const formData = new FormData();
                        formData.append("productName", productForm.productName);
                        formData.append("price", productForm.price);
                        formData.append("quantity", productForm.quantity);
                        formData.append("nid", productForm.nid);

                        if (
                              imageInputType === "file" &&
                              productForm.imageFile
                        ) {
                              formData.append(
                                    "productImage",
                                    productForm.imageFile
                              );
                        } else if (
                              imageInputType === "url" &&
                              productForm.imageUrl
                        ) {
                              formData.append("imageUrl", productForm.imageUrl);
                        }

                        console.log("Updating product:", {
                              productId: editingProduct._id,
                              formData: Object.fromEntries(formData),
                              martId,
                        });

                        const updateResult = await dispatch(
                              updateProduct({
                                    productId: editingProduct._id,
                                    productData: formData,
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
                                    <div className="space-y-2">
                                          <div className="flex gap-4">
                                                <label className="flex items-center">
                                                      <input
                                                            type="radio"
                                                            value="url"
                                                            checked={
                                                                  imageInputType ===
                                                                  "url"
                                                            }
                                                            onChange={(e) => {
                                                                  setImageInputType(
                                                                        e.target
                                                                              .value
                                                                  );
                                                                  setProductForm(
                                                                        {
                                                                              ...productForm,
                                                                              imageFile:
                                                                                    null,
                                                                        }
                                                                  );
                                                            }}
                                                            className="mr-2"
                                                      />
                                                      Image URL
                                                </label>
                                                <label className="flex items-center">
                                                      <input
                                                            type="radio"
                                                            value="file"
                                                            checked={
                                                                  imageInputType ===
                                                                  "file"
                                                            }
                                                            onChange={(e) => {
                                                                  setImageInputType(
                                                                        e.target
                                                                              .value
                                                                  );
                                                                  setProductForm(
                                                                        {
                                                                              ...productForm,
                                                                              imageUrl: "",
                                                                        }
                                                                  );
                                                            }}
                                                            className="mr-2"
                                                      />
                                                      Upload Image
                                                </label>
                                          </div>
                                          {imageInputType === "url" ? (
                                                <TextField
                                                      label="Image URL"
                                                      value={
                                                            productForm.imageUrl
                                                      }
                                                      onChange={(e) =>
                                                            setProductForm({
                                                                  ...productForm,
                                                                  imageUrl: e
                                                                        .target
                                                                        .value,
                                                            })
                                                      }
                                                      fullWidth
                                                      size="small"
                                                      required={
                                                            imageInputType ===
                                                            "url"
                                                      }
                                                />
                                          ) : (
                                                <div className="flex flex-col">
                                                      <input
                                                            type="file"
                                                            accept="image/*"
                                                            onChange={(e) =>
                                                                  setProductForm(
                                                                        {
                                                                              ...productForm,
                                                                              imageFile:
                                                                                    e
                                                                                          .target
                                                                                          .files[0],
                                                                        }
                                                                  )
                                                            }
                                                            className="py-1"
                                                            required={
                                                                  imageInputType ===
                                                                  "file"
                                                            }
                                                      />
                                                      {productForm.imageFile && (
                                                            <p className="text-sm text-gray-600 mt-1">
                                                                  Selected:{" "}
                                                                  {
                                                                        productForm
                                                                              .imageFile
                                                                              .name
                                                                  }
                                                            </p>
                                                      )}
                                                </div>
                                          )}
                                    </div>
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
ProductList.propTypes = {
      searchQuery: PropTypes.string,
      selectedCategory: PropTypes.string,
      sortOrder: PropTypes.string,
      onProductClick: PropTypes.func.isRequired,
      onAddToCart: PropTypes.func,
      userRole: PropTypes.string,
};

export default ProductList;
