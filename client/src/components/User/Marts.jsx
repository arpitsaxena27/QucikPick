import { Link } from "react-router-dom";
import {
      AppBar,
      Toolbar,
      Card,
      CardContent,
      Typography,
      TextField,
      IconButton,
      Drawer,
      List,
      ListItem,
      ListItemText,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import axios from "axios";

const SERVER_URL = import.meta.env.VITE_SERVER_URL;

function Marts() {
      const [search, setSearch] = useState("");
      const [drawerOpen, setDrawerOpen] = useState(false);
      const [marts, setMarts] = useState([]);
      const [loading, setLoading] = useState(true);
      const [error, setError] = useState(null);

      useEffect(() => {
            const fetchMarts = async () => {
                  try {
                        const response = await axios.get(
                              `${SERVER_URL}/api/mart/`,
                              {
                                    withCredentials: true,
                              }
                        );
                        const martsData = response.data.marts;
                        setMarts(
                              martsData.map((mart) => ({
                                    id: mart._id,
                                    name: mart.storeName,
                                    location: mart.address,
                              }))
                        );
                        console.log("Fetched Marts:", response.data);
                        setLoading(false);
                  } catch (error) {
                        console.error("Error fetching marts:", error);
                        setError("Failed to load marts");
                        setLoading(false);
                  }
            };
            fetchMarts();
      }, []);

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
      };

      // Filter marts based on search query
      const filteredMarts = marts.filter(
            (mart) =>
                  mart.name.toLowerCase().includes(search.toLowerCase()) ||
                  mart.location.toLowerCase().includes(search.toLowerCase())
      );

      return (
            <>
                  {/* Navigation Bar */}
                  <AppBar position="fixed" className="bg-[#0c3e7b]">
                        <Toolbar className="flex justify-between px-6 bg-[#0c3e7b]">
                              <IconButton
                                    edge="start"
                                    color="inherit"
                                    aria-label="menu"
                                    className="md:hidden"
                                    onClick={() => setDrawerOpen(true)}
                              >
                                    <MenuIcon />
                              </IconButton>
                              <p className="text-white font-bold">
                                    Walmart Marts
                              </p>
                        </Toolbar>
                        <Drawer
                              anchor="left"
                              open={drawerOpen}
                              onClose={() => setDrawerOpen(false)}
                        >
                              <List className="w-64 bg-[#0c3e7b] h-full text-white">
                                    <ListItem
                                          button
                                          component={Link}
                                          to="/mart"
                                          onClick={() => setDrawerOpen(false)}
                                    >
                                          <ListItemText primary="Home" />
                                    </ListItem>
                                    <ListItem
                                          button
                                          component={Link}
                                          to="/user-help"
                                          onClick={() => setDrawerOpen(false)}
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
                              </List>
                        </Drawer>
                  </AppBar>

                  {/* Page Content */}
                  <div className="min-h-screen bg-[#ffc221] flex flex-col items-center pt-32 px-10">
                        {/* Search Bar */}
                        <TextField
                              variant="outlined"
                              placeholder="Search Marts..."
                              size="medium"
                              className="bg-white rounded-md w-full md:w-1/2 mb-8 shadow-md"
                              onChange={(e) => setSearch(e.target.value)}
                        />

                        {/* Marts Grid Section */}
                        <div className="grid grid-cols-1 mt-10 md:grid-cols-2 gap-8 w-full md:w-10/12">
                              {loading ? (
                                    <Typography
                                          variant="h6"
                                          className="text-blue-900 font-bold"
                                    >
                                          Loading marts...
                                    </Typography>
                              ) : error ? (
                                    <Typography
                                          variant="h6"
                                          className="text-red-600 font-bold"
                                    >
                                          {error}
                                    </Typography>
                              ) : filteredMarts.length > 0 ? (
                                    filteredMarts.map((mart, index) => (
                                          <motion.div
                                                key={mart.id}
                                                initial={{ opacity: 0, y: 50 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{
                                                      delay: index * 0.2,
                                                      duration: 0.8,
                                                }}
                                                whileHover={{ scale: 1.08 }}
                                                className="w-full"
                                          >
                                                <Link
                                                      to="/MartInfo"
                                                      state={{ mart: mart }}
                                                      className="block"
                                                >
                                                      <Card className="!bg-[#0c3e7b] text-black !rounded-xl !shadow-black !shadow-lg transform transition-all !hover:shadow-2xl">
                                                            <CardContent className="h-72 flex flex-col justify-center items-center text-center">
                                                                  <Typography
                                                                        variant="h5"
                                                                        className="font-bold text-white"
                                                                  >
                                                                        {
                                                                              mart.name
                                                                        }
                                                                  </Typography>
                                                                  <Typography
                                                                        variant="body2"
                                                                        className="text-gray-300"
                                                                  >
                                                                        {
                                                                              mart.location
                                                                        }
                                                                  </Typography>
                                                            </CardContent>
                                                      </Card>
                                                </Link>
                                          </motion.div>
                                    ))
                              ) : (
                                    <Typography
                                          variant="h6"
                                          className="text-blue-900 font-bold"
                                    >
                                          No marts found!
                                    </Typography>
                              )}
                        </div>
                  </div>
            </>
      );
}

export default Marts;
