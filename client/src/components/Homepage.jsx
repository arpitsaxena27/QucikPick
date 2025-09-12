import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import React from "react";
import shopIcon from "../assets/images/retail_icon.png";
import userIcon from "../assets/images/user_icon.png";
import retailBg from "../../public/retail_bg.jpg";
import userBg from "../assets/images/user_bg.jpg";
import defaultBg from "../assets/images/default_bg.jpg";
import { Container, LoginOption } from "./StyledComponents";

// Enhanced, responsive Homepage for the QuickPick project
export default function Homepage() {
      const navigate = useNavigate();
      const [isMobile, setIsMobile] = React.useState(window.innerWidth < 768);

      React.useEffect(() => {
            const handleResize = () => setIsMobile(window.innerWidth < 768);
            window.addEventListener("resize", handleResize);
            return () => window.removeEventListener("resize", handleResize);
      }, []);

      const handleLogin = (type) => {
            if (type === "user") navigate("/user-login");
            else if (type === "retail") navigate("/retail-login");
      };

      // card props for hover / tap with responsive-friendly background sizing
      const cardHoverProps = (bg, position) =>
            isMobile
                  ? {
                          whileTap: {
                                opacity: 0.96,
                                backgroundImage: `url(${bg})`,
                                backgroundSize: "cover",
                                backgroundPosition: position,
                                scale: 0.985,
                          },
                    }
                  : {
                          whileHover: {
                                opacity: 0.98,
                                backgroundImage: `url(${bg})`,
                                backgroundSize: "cover",
                                backgroundPosition: position,
                                boxShadow: "0 18px 40px rgba(12,62,123,0.18)",
                          },
                    };

      const containerVariants = {
            hidden: { opacity: 0 },
            show: { opacity: 1, transition: { staggerChildren: 0.12 } },
      };

      const optionVariants = {
            hidden: { opacity: 0, y: 12 },
            show: {
                  opacity: 1,
                  y: 0,
                  transition: { type: "spring", stiffness: 350, damping: 22 },
            },
      };

      return (
            <Container className="h-max w-full mt-10 md:mt-0 flex flex-col items-center justify-center bg-gradient-to-b from-white via-slate-50 to-slate-100">
                  {/* Top header */}
                  <div className="pt-10 md:pt-0 absolute top-4 left-0 right-0 flex items-center justify-between px-4 md:px-16">
                        <div className="flex items-center gap-3">
                              <div className="w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center bg-[#0c3e7b] shadow-lg">
                                    <img
                                          src={shopIcon}
                                          alt="QuickPick logo"
                                          className="w-6 h-6 md:w-7 md:h-7"
                                    />
                              </div>
                              <div className="leading-tight">
                                    <h1 className="text-lg md:text-2xl font-bold text-[#0c3e7b]">
                                          QuickPick
                                    </h1>
                                    <p className="text-[10px] md:text-sm text-slate-500">
                                          Future of Retail — Walmart Sparkathon
                                    </p>
                              </div>
                        </div>
                  </div>

                  <main className="w-full max-w-6xl px-4 md:px-12 py-20 md:py-32">
                        <section className="mb-8 text-center px-2 md:px-0">
                              <motion.h2
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.05, duration: 0.6 }}
                                    className="text-3xl md:text-5xl lg:text-6xl font-extrabold text-[#0c3e7b]"
                              >
                                    QuickPick
                              </motion.h2>
                              <motion.p
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.15, duration: 0.8 }}
                                    className="mt-3 max-w-2xl mx-auto text-slate-600 text-sm md:text-base px-4"
                              >
                                    Smart in-store mapping, quick checkout and
                                    personalized recommendations — built to
                                    reduce friction and save time for both
                                    shoppers and store managers.
                              </motion.p>
                        </section>

                        <motion.div
                              variants={containerVariants}
                              initial="hidden"
                              animate="show"
                              className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 items-stretch"
                        >
                              <motion.div
                                    variants={optionVariants}
                                    className="flex items-center justify-center"
                              >
                                    <LoginOption
                                          initial={{ opacity: 0 }}
                                          animate={{ opacity: 1 }}
                                          transition={{
                                                delay: 0.2,
                                                duration: 0.6,
                                          }}
                                          {...cardHoverProps(
                                                retailBg,
                                                "top left"
                                          )}
                                          className="relative w-full max-w-xl h-64 md:h-80 rounded-2xl flex flex-col items-start justify-between p-6 md:p-8 bg-white bg-no-repeat bg-center bg-cover overflow-hidden"
                                          style={{
                                                backgroundImage: `url(${defaultBg})`,
                                                backgroundSize: "cover",
                                                backgroundPosition: "center",
                                          }}
                                          aria-label="Retail Login"
                                    >
                                          <div className="flex flex-col gap-2 z-10">
                                                <div className="flex items-center gap-3">
                                                      <div className="p-2 rounded-md bg-[#eef6ff]">
                                                            <img
                                                                  src={shopIcon}
                                                                  alt="Retail"
                                                                  className="w-10 h-10 md:w-14 md:h-14"
                                                            />
                                                      </div>
                                                      <div>
                                                            <h3 className="text-lg md:text-2xl font-semibold text-[#0c3e7b]">
                                                                  Retail Manager
                                                            </h3>
                                                            <p className="text-xs md:text-sm text-slate-500 max-w-[18rem] md:max-w-[20rem]">
                                                                  Manage store
                                                                  map, shelves,
                                                                  and real-time
                                                                  inventory.
                                                                  Built for
                                                                  store staff
                                                                  and managers.
                                                            </p>
                                                      </div>
                                                </div>
                                          </div>

                                          <div className="w-full flex flex-col md:flex-row items-center justify-between z-10 gap-3 md:gap-0">
                                                <div className="text-[11px] md:text-xs text-slate-500">
                                                      Secure staff access
                                                </div>
                                                <motion.button
                                                      whileHover={{
                                                            scale: 1.03,
                                                      }}
                                                      whileTap={{ scale: 0.97 }}
                                                      onClick={() =>
                                                            handleLogin(
                                                                  "retail"
                                                            )
                                                      }
                                                      className="w-full mt-5 md:w-auto ml-0 md:ml-4 px-6 py-3 
             text-sm md:text-base font-semibold 
             rounded-lg shadow-md 
             bg-[#0c3e7b] hover:bg-[#0056b3] 
             text-white transition-colors duration-300"
                                                      aria-label="Retail Login Button"
                                                >
                                                      Retail Login
                                                </motion.button>
                                          </div>

                                          {/* subtle decorative panel */}
                                          <div className="absolute right-4 bottom-4 opacity-12 select-none pointer-events-none">
                                                <img
                                                      src={retailBg}
                                                      alt=""
                                                      className="object-center w-30 h-40 md:w-72 rounded-lg md:object-cover"
                                                />
                                          </div>
                                    </LoginOption>
                              </motion.div>

                              <motion.div
                                    variants={optionVariants}
                                    className="flex items-center justify-center"
                              >
                                    <LoginOption
                                          initial={{ opacity: 0 }}
                                          animate={{ opacity: 1 }}
                                          transition={{
                                                delay: 0.3,
                                                duration: 0.6,
                                          }}
                                          {...cardHoverProps(
                                                userBg,
                                                "bottom right"
                                          )}
                                          className="relative w-full max-w-xl h-64 md:h-80 rounded-2xl flex flex-col items-start justify-between p-6 md:p-8 bg-white bg-no-repeat bg-center bg-cover overflow-hidden"
                                          style={{
                                                backgroundImage: `url(${defaultBg})`,
                                                backgroundSize: "cover",
                                                backgroundPosition: "center",
                                          }}
                                          aria-label="User Login"
                                    >
                                          <div className="flex flex-col gap-2 z-10">
                                                <div className="flex items-center gap-3">
                                                      <div className="p-2 rounded-md bg-[#fff7e6]">
                                                            <img
                                                                  src={userIcon}
                                                                  alt="User"
                                                                  className="w-10 h-10 md:w-14 md:h-14"
                                                            />
                                                      </div>
                                                      <div>
                                                            <h3 className="text-lg md:text-2xl font-semibold text-[#0c3e7b]">
                                                                  Customer /
                                                                  Shopper
                                                            </h3>
                                                            <p className="text-xs md:text-sm text-slate-500 max-w-[18rem] md:max-w-[20rem]">
                                                                  Find items
                                                                  quickly with
                                                                  store maps,
                                                                  add to cart
                                                                  and enjoy a
                                                                  seamless
                                                                  checkout
                                                                  experience.
                                                            </p>
                                                      </div>
                                                </div>
                                          </div>

                                          <div className="w-full flex flex-col md:flex-row items-center justify-between z-10 gap-3 md:gap-0">
                                                <div className="text-[11px] md:text-xs text-slate-500">
                                                      Fast & secure for shoppers
                                                </div>
                                                <motion.button
                                                      whileHover={{
                                                            scale: 1.03,
                                                      }}
                                                      whileTap={{ scale: 0.97 }}
                                                      onClick={() =>
                                                            handleLogin(
                                                                  "user"
                                                            )
                                                      }
                                                      className="w-full mt-5 md:w-auto ml-0 md:ml-4 px-6 py-3 
             text-sm md:text-base font-semibold 
             rounded-lg shadow-md 
             bg-[#0c3e7b] hover:bg-[#0056b3] 
             text-white transition-colors duration-300"
                                                      aria-label="Retail Login Button"
                                                >
                                                      User Login
                                                </motion.button>
                                          </div>

                                          <div className="absolute left-4 bottom-4 opacity-12 select-none pointer-events-none">
                                                <img
                                                      src={userBg}
                                                      alt=""
                                                      className="object-center w-30 h-40 md:w-72 rounded-lg md:object-cover"
                                                />
                                          </div>
                                    </LoginOption>
                              </motion.div>
                        </motion.div>

                        <section className="mt-6 text-center px-4 md:px-0">
                              <p className="text-sm md:text-sm text-slate-500 max-w-3xl mx-auto">
                                    Need admin access? Contact your store
                                    administrator or go to the internal portal.
                              </p>
                        </section>
                  </main>

                  <div className="absolute bottom-4 left-0 right-0 text-center text-xs text-slate-400">
                        © {new Date().getFullYear()} QuickPick · Built for
                        Walmart Sparkathon
                  </div>
            </Container>
      );
}
