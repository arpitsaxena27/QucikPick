import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Ensure the environment variable is loaded correctly
const SERVER_URL = import.meta.env.SERVER_URL || "http://localhost:5000";

// Fetch user role and retailerId
export const fetchUserRole = createAsyncThunk(
      "products/fetchUserRole",
      async () => {
            const response = await axios.get(`${SERVER_URL}/api/auth/profile`, {
                  withCredentials: true,
            });
            // Assuming API returns { user: { role: 'retailer' | 'user', retailerId: '...' } }
            return {
                  role: response.data.user.role,
                  retailerId: response.data.user._id,
            };
      }
);

// Fetch shelf info for retailer role
export const fetchShelfInfo = createAsyncThunk(
      "products/fetchShelfInfo",
      async (retailerId) => {
            console.log("Fetching shelf info for retailerId:", retailerId);
            const response = await axios.get(
                  `${SERVER_URL}/api/mart/retailer/${retailerId}`,
                  {
                        withCredentials: true,
                  }
            );
            const mart = response.data.mart;
            console.log("Retailer Shelf Info Response:", mart);
            const res = mart.shelves.map(({ nid, name }) => ({ nid, name }));
            return {
                  shelves: res,
                  martId: mart._id,
            };
      }
);

// New thunk to fetch shelf info by martId for user role
export const fetchShelfInfoByMartId = createAsyncThunk(
      "products/fetchShelfInfoByMartId",
      async (martId) => {
            console.log("Fetching shelf info for martId:", martId);
            const response = await axios.get(
                  `${SERVER_URL}/api/mart/${martId}/shelves`,
                  {
                        withCredentials: true,
                  }
            );
            const mart = response.data;
            console.log("User Shelf Info Response:", response.data);
            const shelves = mart.shelves.map(({ nid, name }) => ({
                  nid,
                  name,
            }));
            console.log("Shelves:", shelves);
            return {
                  shelves,
                  martId: mart._id,
            };
      }
);

// Fetch products
export const fetchProducts = createAsyncThunk(
      "products/fetchProducts",
      async ({ martId }) => {
            console.log("Fetching products for martId:", martId);
            const response = await axios.get(
                  `${SERVER_URL}/api/mart/${martId}/products`,
                  {
                        withCredentials: true,
                  }
            );
            console.log("Products Response:", response.data.products);
            // Transform the data to flatten products
            return response.data.products;
      }
);

// Fetch products by shelf nid and martId
export const fetchProductsByShelf = createAsyncThunk(
      "products/fetchProductsByShelf",
      async ({ martId, nid }) => {
            const response = await axios.get(
                  `${SERVER_URL}/api/mart/${martId}/shelves/${nid}/products`,
                  {
                        withCredentials: true,
                  }
            );
            console.log("Products by Shelf Response:", response.data.products);
            return response.data.products;
      }
);
// Add new product
export const addProduct = createAsyncThunk(
      "products/addProduct",
      async ({ productData, martId }) => {
            // Format the data according to the server's expected structure
            const formattedData = {
                  productName: productData.productName,
                  price: Number(productData.price),
                  quantity: Number(productData.quantity),
                  imageUrl: productData.imageUrl || productData.image,
            };

            console.log("Sending formatted data:", formattedData);

            const response = await axios.post(
                  `${SERVER_URL}/api/mart/${martId}/shelves/${productData.nid}/products`,
                  formattedData,
                  {
                        headers: { "Content-Type": "application/json" },
                        withCredentials: true,
                  }
            );
            return response.data.products;
      }
);

// Update product
export const updateProduct = createAsyncThunk(
      "products/updateProduct",
      async ({ productId, productData, martId }) => {
            // Format the data according to the server's expected structure
            const formattedData = {
                  productName: productData.productName,
                  price: Number(productData.price),
                  quantity: Number(productData.quantity),
                  image: productData.imageUrl || productData.image,
            };

            console.log("Sending formatted data for update:", formattedData);

            const response = await axios.patch(
                  `${SERVER_URL}/api/mart/${martId}/shelves/${productData.nid}/products/${productId}`,
                  formattedData,
                  {
                        headers: { "Content-Type": "application/json" },
                        withCredentials: true,
                  }
            );
            console.log("Update response:", response.data);
            return response.data.product;
      }
);

// Delete product
export const deleteProduct = createAsyncThunk(
      "products/deleteProduct",
      async ({ productId, productData, martId }) => {
            console.log("Deleting product:", {
                  productId,
                  nid: productData.nid,
                  martId,
            });

            const response = await axios.delete(
                  `${SERVER_URL}/api/mart/${martId}/shelves/${productData.nid}/products/${productId}`,
                  {
                        withCredentials: true,
                  }
            );

            console.log("Delete response:", response.data);
            return productId;
      }
);

// Add new thunk for editing shelf name
export const updateShelfName = createAsyncThunk(
      "products/updateShelfName",
      async ({ martId, newName, shelvesId }) => {
            const response = await axios.patch(
                  `${SERVER_URL}/api/mart/${martId}/shelves/${shelvesId}`,
                  { name: newName },
                  {
                        headers: { "Content-Type": "application/json" },
                        withCredentials: true,
                  }
            );
            return { name: response.data.name };
      }
);

const productsSlice = createSlice({
      name: "products",
      initialState: {
            products: [],
            shelves: [],
            loading: false,
            error: null,
            userRole: null, // 'retailer' | 'user' | null
            isRoleLoading: false,
            roleError: null,
            retailerId: null, // <-- new state variable
            martId: null, // <-- new state variable for mart ID
      },
      reducers: {},
      extraReducers: (builder) => {
            builder
                  .addCase(fetchProducts.pending, (state) => {
                        state.loading = true;
                        state.error = null;
                  })
                  .addCase(fetchProducts.fulfilled, (state, action) => {
                        state.loading = false;
                        state.products = action.payload;
                  })
                  .addCase(fetchProducts.rejected, (state, action) => {
                        state.loading = false;
                        state.error = action.error.message;
                  })

                  // Add cases for fetchProductsByShelf
                  .addCase(fetchProductsByShelf.pending, (state) => {
                        state.loading = true;
                        state.error = null;
                  })
                  .addCase(fetchProductsByShelf.fulfilled, (state, action) => {
                        state.loading = false;
                        state.products = action.payload;
                  })
                  .addCase(fetchProductsByShelf.rejected, (state, action) => {
                        state.loading = false;
                        state.error = action.error.message;
                  })

                  // User role and retailerId cases
                  .addCase(fetchUserRole.pending, (state) => {
                        state.isRoleLoading = true;
                        state.roleError = null;
                  })
                  .addCase(fetchUserRole.fulfilled, (state, action) => {
                        state.isRoleLoading = false;
                        state.userRole = action.payload.role;
                        state.retailerId = action.payload.retailerId;
                  })
                  .addCase(fetchUserRole.rejected, (state, action) => {
                        state.isRoleLoading = false;
                        state.roleError = action.error.message;
                  })

                  // Add product cases
                  .addCase(addProduct.fulfilled, (state, action) => {
                        state.products.push(action.payload);
                  })

                  // Update product cases
                  .addCase(updateProduct.fulfilled, (state, action) => {
                        const index = state.products.findIndex(
                              (product) => product._id === action.payload._id
                        );
                        if (index !== -1) {
                              state.products[index] = action.payload;
                        }
                  })

                  // Delete product cases
                  .addCase(deleteProduct.fulfilled, (state, action) => {
                        state.products = state.products.filter(
                              (product) => product._id !== action.payload
                        );
                  })

                  // Add cases for retailer shelf info
                  .addCase(fetchShelfInfo.pending, (state) => {
                        state.loading = true;
                        state.error = null;
                  })
                  .addCase(fetchShelfInfo.fulfilled, (state, action) => {
                        state.loading = false;
                        state.shelves = action.payload.shelves;
                        state.martId = action.payload.martId;
                  })
                  .addCase(fetchShelfInfo.rejected, (state, action) => {
                        state.loading = false;
                        state.error = action.error.message;
                  })

                  // Add cases for fetching shelf info by martId
                  .addCase(fetchShelfInfoByMartId.pending, (state) => {
                        state.loading = true;
                        state.error = null;
                  })
                  .addCase(
                        fetchShelfInfoByMartId.fulfilled,
                        (state, action) => {
                              state.loading = false;
                              state.shelves = action.payload.shelves;
                              state.martId = action.payload.martId;
                        }
                  )
                  .addCase(fetchShelfInfoByMartId.rejected, (state, action) => {
                        state.loading = false;
                        state.error = action.error.message;
                  })

                  // Add cases for updating shelf name
                  .addCase(updateShelfName.pending, (state) => {
                        state.loading = true;
                        state.error = null;
                  })
                  .addCase(updateShelfName.fulfilled, (state, action) => {
                        state.loading = false;
                        const { nid, name } = action.payload;
                        // Update name in shelves array
                        const shelfIndex = state.shelves.findIndex(
                              (shelf) => shelf.nid === nid
                        );
                        if (shelfIndex !== -1) {
                              state.shelves[shelfIndex].name = name;
                        }
                        // Update name in products array
                        state.products = state.products.map((product) =>
                              product.nid === nid
                                    ? { ...product, name }
                                    : product
                        );
                  })
                  .addCase(updateShelfName.rejected, (state, action) => {
                        state.loading = false;
                        state.error = action.error.message;
                  });
      },
});

// Selectors
export const selectUserRole = (state) => state.products.userRole;
export const selectIsRetailer = (state) =>
      state.products.userRole === "retailer";
export const selectProducts = (state) => state.products.products;
export const selectLoading = (state) => state.products.loading;
export const selectError = (state) => state.products.error;
export const selectShelves = (state) => state.products.shelves;
export const selectRetailerId = (state) => state.products.retailerId;
export const selectMartId = (state) => state.products.martId;

export default productsSlice.reducer;
