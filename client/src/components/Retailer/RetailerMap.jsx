import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
      fetchUserRole,
      selectUserRole,
      selectShelves,
      fetchShelfInfo,
      fetchProducts,
      selectMartId,
      selectRetailerId,
} from "../../store/slices/productsSlice";
import {
      AppBar,
      Toolbar,
      IconButton,
      Drawer,
      InputBase,
      MenuItem,
      Select,
      ListItem,
      ListItemText,
} from "@mui/material";
import { RotateCcw } from "lucide-react"; // Importing icon
import SearchIcon from "@mui/icons-material/Search";
import MenuIcon from "@mui/icons-material/Menu";
import ProductList from "../ProductList";
import LeftSection from "./LeftSection";
import axios from "axios";

const SERVER_URL = import.meta.env.VITE_SERVER_URL;

const MartInfo = () => {
      const location = useLocation();
      const { mart } = location.state || {};
      const [searchQuery, setSearchQuery] = useState("");
      const [destination, setDestination] = useState("");
      const [sortOrder, setSortOrder] = useState("default");
      const [selectedCategory, setSelectedCategory] = useState("");
      const [isCartOpen, setIsCartOpen] = useState(false);
      const [drawerOpen, setDrawerOpen] = useState(false);
      const updateCount = (newValue) => {
            setSelectedCategory(newValue);
      };
      const [cart, setCart] = useState(() => {
            return JSON.parse(localStorage.getItem("cart")) || [];
      });

      const dispatch = useDispatch();
      const userRole = useSelector(selectUserRole);
      selectUserRole;
      const shelves = useSelector(selectShelves);
      const martId = useSelector(selectMartId);
      const retailerId = useSelector(selectRetailerId);

      useEffect(() => {
            localStorage.setItem("cart", JSON.stringify(cart));
      }, [cart]);

      useEffect(() => {
            dispatch(fetchUserRole());
      }, [dispatch]);

      useEffect(() => {
            if (retailerId) {
                  dispatch(fetchShelfInfo(retailerId));
            }
      }, [retailerId, dispatch]);

      useEffect(() => {
            if (martId) {
                  dispatch(fetchProducts({ martId }));
            }
      }, [martId, dispatch]);

      const handleSearch = (event) => setSearchQuery(event.target.value);
      const handleProductClick = (nid) => setDestination(nid);
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
            setCart((prevCart) => [...prevCart, product]);
      };

      const getSelectedShelfName = () => {
            if (!selectedCategory) return "All Items";
            const shelf = shelves.find((s) => s.nid === selectedCategory);
            return shelf ? shelf.name : "All Items";
      };

      const handleShowAllItems = () => {
            setSelectedCategory("");
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
                                    to="/revenue"
                                    onClick={toggleDrawer}
                              >
                                    <ListItemText primary="Revenue" />
                              </ListItem>
                              <ListItem
                                    button
                                    component={Link}
                                    to="/retailer-help"
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
                        <LeftSection updateCount={updateCount} />
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
                                    onProductClick={handleProductClick}
                                    sortOrder={sortOrder}
                                    selectedCategory={selectedCategory}
                                    onAddToCart={handleAddToCart}
                                    userRole={userRole}
                              />=
                        </div>
                  </div>
            </div>
      );
};

export default MartInfo;
