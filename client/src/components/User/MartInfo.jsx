import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
      selectUserRole,
      selectShelves,
      selectLoading,
      selectProducts,
      fetchShelfInfoByMartId,
      fetchProducts,
      fetchProductsByShelf,
      setMartId,
} from "../../store/slices/productsSlice";
import { RotateCcw } from "lucide-react"; // Importing icon
import {
      AppBar,
      Toolbar,
      IconButton,
      Drawer,
      Badge,
      InputBase,
      MenuItem,
      Select,
      ListItem,
      ListItemText,
} from "@mui/material";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import SearchIcon from "@mui/icons-material/Search";
import MenuIcon from "@mui/icons-material/Menu";
import ProductList from "../ProductList";
import axios from "axios";

const SERVER_URL = import.meta.env.VITE_SERVER_URL;

import Cart from "./Cart";
import CustomerLeftSection from "./CustomerLeftSection";

const MartInfo = () => {
      const location = useLocation();
      const { mart } = location.state || {};
      const dispatch = useDispatch();

      const [selectedProduct, setSelectedProduct] = useState(null);
      const [selectedCategory, setSelectedCategory] = useState("");
      const [searchQuery, setSearchQuery] = useState("");
      const [sortOrder, setSortOrder] = useState("default");
      const [isCartOpen, setIsCartOpen] = useState(false);
      const [drawerOpen, setDrawerOpen] = useState(false);
      const [cart, setCart] = useState(() => {
            return JSON.parse(localStorage.getItem("cart")) || [];
      });

      // Redux state selectors
      const shelves = useSelector(selectShelves);
      const loading = useSelector(selectLoading);
      const products = useSelector(selectProducts);

      // Fetch initial shelves data and set mart ID
      useEffect(() => {
            console.log(mart.id);
            if (!mart?.id) return;
            dispatch(setMartId(mart.id));
            dispatch(fetchShelfInfoByMartId(mart.id));
      }, [mart?.id, dispatch]);

      // Fetch products when either mart ID or selected category changes
      useEffect(() => {
            if (!mart?.id) return;

            console.log("Product fetch effect triggered:", {
                  martId: mart.id,
                  selectedCategory,
                  productsCount: products?.length,
            });

            if (selectedCategory) {
                  console.log("Fetching products for shelf:", selectedCategory);
                  dispatch(
                        fetchProductsByShelf({
                              martId: mart.id,
                              nid: selectedCategory,
                        })
                  );
            } else {
                  console.log("Fetching all products for mart:", mart.id);
                  dispatch(fetchProducts({ martId: mart.id }));
            }
      }, [mart?.id, selectedCategory, dispatch, products?.length]);

      const getSelectedShelfName = () => {
            if (!selectedCategory) return "All Items";
            const shelf = shelves?.find((s) => s.nid === selectedCategory);
            return shelf ? shelf.name : "All Items";
      };

      const handleShowAllItems = () => {
            setSelectedCategory("");
            if (mart?.id) {
                  dispatch(fetchProducts({ martId: mart.id }));
            }
      };

      useEffect(() => {
            localStorage.setItem("cart", JSON.stringify(cart));
      }, [cart]);

      const handleSearch = (event) => setSearchQuery(event.target.value);
      const toggleCart = () => setIsCartOpen(!isCartOpen);
      const toggleDrawer = () => setDrawerOpen(!drawerOpen);

      const logOut = async () => {
            try {
                  // Make logout API call
                  await axios.post(`${SERVER_URL}/api/auth/logout`, {
                        withCredentials: true,
                  });
                  
                  // Clear any local storage
                  localStorage.removeItem("user");
                  
                  // You can add any additional cleanup here
                  
                  // The Link component will handle the navigation to "/"
            } catch (error) {
                  console.error("Logout failed:", error);
                  // Continue with local logout even if server logout fails
            }
            toggleDrawer();
      };

      const handleAddToCart = (product) => {
            console.log("Adding to cart:", product);
            // Add martId and shelfNid to the product before adding to cart
            const productWithIds = {
                  ...product,
                  martId: mart.id,
                  shelfNid: selectedCategory || product.nid,
            };
            setCart((prevCart) => [...prevCart, productWithIds]);
      };

      return (
            <div className="pt-10 md:pt-0 bg-gray-100">
                  {/* Navigation Bar */}
                  <AppBar position="fixed" className="bg-[#0c3e7b] z-50">
                        <Toolbar className="flex justify-between px-6 pt-10 md:pt-0 pb-2 md:pb-0 bg-[#0c3e7b]">
                              <IconButton
                                    edge="start"
                                    color="inherit"
                                    aria-label="menu"
                                    className="md:hidden"
                                    onClick={toggleDrawer}
                              >
                                    <MenuIcon />
                              </IconButton>
                              <div className="relative flex items-center mx-8 bg-white rounded px-3 w-full max-w-xs sm:max-w-sm">
                                    <SearchIcon className="text-gray-500" />
                                    <InputBase
                                          placeholder="Search…"
                                          value={searchQuery}
                                          onChange={handleSearch}
                                          className="ml-2 text-black focus:outline-none w-full"
                                    />
                              </div>
                              <IconButton color="inherit" onClick={toggleCart}>
                                    <Badge
                                          badgeContent={cart.length}
                                          color="error"
                                    >
                                          <ShoppingCartIcon />
                                    </Badge>
                              </IconButton>
                        </Toolbar>
                  </AppBar>

                  {/* Drawer for Mobile Navigation */}
                  <Drawer
                        anchor="left"
                        open={drawerOpen}
                        onClose={toggleDrawer}
                  >
                        <div className="w-64 pt-10 pl-1 md:pl-0 md:pt-2 bg-[#0c3e7b] h-full text-white">
                              <ListItem
                                    button
                                    component={Link}
                                    to="/"
                                    onClick={toggleDrawer}
                              >
                                    <ListItemText primary="Home" />
                              </ListItem>
                              <ListItem
                                    button
                                    component={Link}
                                    to="/Mart"
                                    onClick={toggleDrawer}
                              >
                                    <ListItemText primary="Stores" />
                              </ListItem>
                              <ListItem
                                    button
                                    component={Link}
                                    to="/user-help"
                                    onClick={toggleDrawer}
                              >
                                    <ListItemText primary="Help" />
                              </ListItem>
                              <ListItem
                                    button
                                    component={Link}
                                    to="/"
                                    onClick={logOut}
                              >
                                    <ListItemText primary="Log out" />
                              </ListItem>
                        </div>
                  </Drawer>

                  {/* Main Content */}
                  <div className="flex flex-col md:flex-row mt-16">
                        {/* Left Section */}
                        <CustomerLeftSection
                              selectedProduct={selectedProduct}
                              onShelfSelect={(nid) => {
                                    console.log("Shelf selected:", nid);
                                    setSelectedCategory(nid);
                                    if (mart?.id && nid) {
                                          console.log(
                                                "Fetching products for mart:",
                                                mart.id,
                                                "shelf:",
                                                nid
                                          );
                                          dispatch(
                                                fetchProductsByShelf({
                                                      martId: mart.id,
                                                      nid: nid,
                                                })
                                          );
                                    }
                              }}
                        />

                        {/* Right Section */}
                        <div className="mt-1 w-full md:w-1/3 p-4 h-screen bg-white shadow-md overflow-scroll">
                              <h2 className="text-3xl font-bold mb-2 text-center text-gray-900">
                                    {mart?.name}
                                    <br />
                                    <span className="text-lg text-gray-600">
                                          {mart?.location}
                                    </span>
                              </h2>

                              <div className="flex justify-center gap-6 items-center mb-4">
                                    <h3 className="text-2xl font-semibold mb-4 text-center text-gray-900">
                                          {getSelectedShelfName()}
                                    </h3>
                                    <div className="flex justify-center mb-4">
                                          <button
                                                onClick={handleShowAllItems}
                                                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded flex items-center gap-2"
                                                disabled={!selectedCategory}
                                                title="Show All Items"
                                          >
                                                <RotateCcw size={18} />
                                          </button>
                                    </div>
                              </div>

                              {/* Sorting Dropdown */}
                              <Select
                                    value={sortOrder}
                                    onChange={(e) =>
                                          setSortOrder(e.target.value)
                                    }
                                    className="w-full mb-4 h-10"
                              >
                                    <MenuItem value="default">Default</MenuItem>
                                    <MenuItem value="price_asc">
                                          Price: Low to High
                                    </MenuItem>
                                    <MenuItem value="price_desc">
                                          Price: High to Low
                                    </MenuItem>
                              </Select>

                              <p className="text-2xl font-bold flex justify-center m-7">
                                    Product List
                              </p>

                              <ProductList
                                    searchQuery={searchQuery}
                                    selectedCategory={selectedCategory}
                                    sortOrder={sortOrder}
                                    onProductClick={(product) =>
                                          setSelectedProduct(product)
                                    } // now receives product object
                                    onAddToCart={handleAddToCart}
                                    userRole="customer"
                              />
                        </div>
                  </div>

                  {/* Cart Drawer */}
                  <Cart
                        cart={cart}
                        isCartOpen={isCartOpen}
                        toggleCart={toggleCart}
                        setCart={setCart}
                        martId={mart?.id} // Passing mart ID to Cart
                  ></Cart>
            </div>
      );
};

export default MartInfo;
