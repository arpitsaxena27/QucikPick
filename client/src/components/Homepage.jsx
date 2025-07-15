import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import React from "react";
import shopIcon from "../assets/images/retail_icon.png";
import userIcon from "../assets/images/user_icon.png";
import retailBg from "../../public/retail_bg.jpg";
import userBg from "../assets/images/user_bg.jpg";
import defaultBg from "../assets/images/default_bg.jpg";
import {
      Container,
      ButtonText,
      LoginOptions,
      LoginOption,
      Icon,
      Button,
} from "./StyledComponents";

function Homepage() {
      const navigate = useNavigate();
      const [isMobile, setIsMobile] = React.useState(window.innerWidth < 768);

      React.useEffect(() => {
            const handleResize = () => {
                  setIsMobile(window.innerWidth < 768);
            };

            window.addEventListener("resize", handleResize);
            return () => window.removeEventListener("resize", handleResize);
      }, []);

      const handleLogin = (type) => {
            if (type === "user") {
                  navigate("/user-login");
            } else if (type === "retail") {
                  navigate("/retail-login");
            }
      };

      return (
            <Container className="flex flex-col items-center justify-center min-h-screen w-full">
                  <div className="bg-[#ffc221] w-full">
                        <motion.p
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              transition={{ delay: 0.25, duration: 1.5 }}
                              className="text-8xl md:text-9xl font-semibold  text-center text-[#0c3e7b] p-5"
                        >
                              QuickPick
                        </motion.p>
                  </div>
                  <LoginOptions className="flex flex-col md:flex-row items-center justify-center w-full gap-6 ">
                        <LoginOption
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              transition={{ delay: 0.25, duration: 1.5 }}
                              {...(isMobile
                                    ? {
                                            whileTap: {
                                                  opacity: 0.9,
                                                  backgroundImage: `url(${retailBg})`,
                                                  backgroundSize: "cover",
                                                  backgroundPosition:
                                                        "top left",
                                                  scale: 0.95,
                                            },
                                      }
                                    : {
                                            whileHover: {
                                                  opacity: 0.9,
                                                  backgroundImage: `url(${retailBg})`,
                                                  backgroundSize: "cover",
                                                  backgroundPosition:
                                                        "top left",
                                            },
                                      })}
                              className="relative w-full md:w-1/2 max-w-sm md:max-w-md h-72 rounded-lg flex flex-col items-center justify-center p-6 bg-no-repeat bg-center bg-contain"
                              style={{
                                    backgroundImage: `url(${defaultBg})`,
                              }}
                        >
                              <motion.div
                                    initial={{ scale: 0.8 }}
                                    animate={{ scale: 1 }}
                                    transition={{
                                          type: "spring",
                                          stiffness: 500,
                                          damping: 15,
                                          mass: 1,
                                    }}
                              >
                                    <Icon
                                          src={shopIcon}
                                          alt="Retail Login"
                                          className="w-16 h-16 md:w-20 md:h-20"
                                    />
                              </motion.div>
                              <Button
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    onClick={() => handleLogin("retail")}
                                    className="mt-4 px-6 py-3 md:px-8 md:py-4 text-base md:text-lg"
                              >
                                    <ButtonText>Retail Login</ButtonText>
                              </Button>
                        </LoginOption>

                        <LoginOption
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              transition={{ delay: 0.25, duration: 1.5 }}
                              {...(isMobile
                                    ? {
                                            whileTap: {
                                                  opacity: 0.9,
                                                  backgroundImage: `url(${userBg})`,
                                                  backgroundSize: "cover",
                                                  backgroundPosition:
                                                        "bottom right",
                                                  scale: 0.95,
                                            },
                                      }
                                    : {
                                            whileHover: {
                                                  opacity: 0.9,
                                                  backgroundImage: `url(${userBg})`,
                                                  backgroundSize: "cover",
                                                  backgroundPosition:
                                                        "bottom right",
                                            },
                                      })}
                              className="relative w-full md:w-1/2 max-w-sm md:max-w-md h-72 rounded-lg flex flex-col items-center justify-center p-6 bg-no-repeat bg-center bg-contain"
                              style={{
                                    backgroundImage: `url(${defaultBg})`,
                              }}
                        >
                              <motion.div
                                    initial={{ scale: 0.8 }}
                                    animate={{ scale: 1 }}
                                    transition={{
                                          type: "spring",
                                          stiffness: 500,
                                          damping: 15,
                                          mass: 1,
                                    }}
                              >
                                    <Icon
                                          src={userIcon}
                                          alt="User Login"
                                          className="w-16 h-16 md:w-20 md:h-20"
                                    />
                              </motion.div>
                              <Button
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    onClick={() => handleLogin("user")}
                                    className="mt-4 px-6 py-3 md:px-8 md:py-4 text-base md:text-lg"
                              >
                                    <ButtonText>User Login</ButtonText>
                              </Button>
                        </LoginOption>
                  </LoginOptions>
            </Container>
      );
}

export default Homepage;
