import RetailMap from "./RetailMap";
import { useState, useRef, useEffect } from "react";
import PropTypes from "prop-types";
import { useSelector } from "react-redux";
import axios from "axios";
import { selectShelves } from "../../store/slices/productsSlice";
import Detect from "./Detect";

function LeftSection({ updateCount }) {
      const [scale, setScale] = useState(0.5);
      const [isCollapsed, setIsCollapsed] = useState(false);
      const [hasExistingMap, setHasExistingMap] = useState(false);
      const [isDialogOpen, setIsDialogOpen] = useState(false);
      const [storeData, setStoreData] = useState({
            storeName: "",
            address: "",
      });
      const [martId, setMartId] = useState(null);
      const [showDetectGuide, setShowDetectGuide] = useState(false);
      const scrollContainerRef = useRef(null);
      const fileInputRef = useRef(null);
      const shapeDetectorRef = useRef(null);
      const userRole = useSelector((state) => state.products.userRole);
      const retailerId = useSelector((state) => state.products.retailerId);
      const shelves = useSelector(selectShelves);

      const [isDragging, setIsDragging] = useState(false);
      const [startX, setStartX] = useState(0);
      const [startY, setStartY] = useState(0);
      const [scrollLeft, setScrollLeft] = useState(0);
      const [scrollTop, setScrollTop] = useState(0);
      const SERVER_URL = import.meta.env.VITE_SERVER_URL;

      const [isPinMode, setIsPinMode] = useState(false);
      const [pins, setPins] = useState([]);
      const handleMouseDown = (e) => {
            e.preventDefault();
            setIsDragging(true);
            setStartX(e.pageX - scrollContainerRef.current.offsetLeft);
            setStartY(e.pageY - scrollContainerRef.current.offsetTop);
            setScrollLeft(scrollContainerRef.current.scrollLeft);
            setScrollTop(scrollContainerRef.current.scrollTop);
      };

      const handleMouseMove = (e) => {
            if (!isDragging) return;
            e.preventDefault();
            const x = e.pageX - scrollContainerRef.current.offsetLeft;
            const y = e.pageY - scrollContainerRef.current.offsetTop;
            const walkX = (x - startX) * 1.5;
            const walkY = (y - startY) * 1.5;
            scrollContainerRef.current.scrollLeft = scrollLeft - walkX;
            scrollContainerRef.current.scrollTop = scrollTop - walkY;
      };

      // Fetch existing mart data if availablereact";

      const handleMouseUp = () => setIsDragging(false);

      const handleReset = () => {
            setScale(0.5);
            setTimeout(() => {
                  const {
                        scrollWidth,
                        scrollHeight,
                        clientWidth,
                        clientHeight,
                  } = scrollContainerRef.current;
                  scrollContainerRef.current.scrollTo({
                        top: (scrollHeight - clientHeight) / 2,
                        left: (scrollWidth - clientWidth) / 2,
                        behavior: "smooth",
                  });
            }, 200);
      };

      // Example: auto-hide after 8 seconds (optional)
      useEffect(() => {
            const t = setTimeout(() => setShowDetectGuide(false), 8000);
            return () => clearTimeout(t);
      }, []);

      // Auto-reset when component mounts with 1 second delay
      useEffect(() => {
            const timer = setTimeout(() => {
                  handleReset();
            }, 50);

            return () => clearTimeout(timer); // Cleanup timer on unmount
      }, []);

      // Fetch existing mart data if available
      useEffect(() => {
            const fetchMartData = async () => {
                  if (retailerId) {
                        try {
                              const response = await axios.get(
                                    `${SERVER_URL}/api/mart/retailer/${retailerId}`,
                                    {
                                          withCredentials: true,
                                    }
                              );
                              if (response.data?.mart?._id) {
                                    setMartId(response.data.mart._id);
                                    setHasExistingMap(true);
                              }
                        } catch (error) {
                              console.error("Error fetching mart data:", error);
                        }
                  }
            };
            fetchMartData();
      }, [retailerId, SERVER_URL]);

      useEffect(() => {
            const { scrollWidth, scrollHeight, clientWidth, clientHeight } =
                  scrollContainerRef.current;
            scrollContainerRef.current.scrollTo({
                  top: (scrollHeight - clientHeight) / 2,
                  left: (scrollWidth - clientWidth) / 2,
                  behavior: "smooth",
            });
      }, []);

      // Pinch zoom
      let initialDistance = null;
      const handleTouchStart = (e) => {
            if (e.touches.length === 2) {
                  const dx = e.touches[0].clientX - e.touches[1].clientX;
                  const dy = e.touches[0].clientY - e.touches[1].clientY;
                  initialDistance = Math.sqrt(dx * dx + dy * dy);
            }
      };

      const handleTouchMove = (e) => {
            if (e.touches.length === 2 && initialDistance) {
                  e.preventDefault();
                  const dx = e.touches[0].clientX - e.touches[1].clientX;
                  const dy = e.touches[0].clientY - e.touches[1].clientY;
                  const newDistance = Math.sqrt(dx * dx + dy * dy);
                  const zoomFactor = 0.03;

                  setScale((prevScale) =>
                        Math.min(
                              Math.max(
                                    prevScale *
                                          (1 +
                                                zoomFactor *
                                                      (newDistance -
                                                            initialDistance)),
                                    0.5
                              ),
                              3
                        )
                  );
                  initialDistance = newDistance;
            }
      };

      const handleImageUploadChange = (event) => {
            const file = event.target.files[0];
            if (file && shapeDetectorRef.current) {
                  shapeDetectorRef.current.handleImageUpload(file);
            }
      };

      const handleDetectClick = () => {
            if (shapeDetectorRef.current) {
                  shapeDetectorRef.current.processImage();
            }
      };

      const handleShelfClick = (nid) => {
            console.log("Shelf clicked: ", nid);
            updateCount(nid);
      };

      const handleMapClick = (e) => {
            if (!isPinMode) return;
            const rect = e.currentTarget.getBoundingClientRect();
            const x = (e.clientX - rect.left) / scale;
            const y = (e.clientY - rect.top) / scale;
            setPins((prev) => [...prev, { x, y }]);
            setIsPinMode(false);
      };

      const handleSubmit = async (e) => {
            e.preventDefault();

            try {
                  const formData = new FormData();
                  formData.append("storeName", storeData.storeName);
                  formData.append("address", storeData.address);
                  formData.append("retailerId", retailerId);

                  if (fileInputRef.current.files[0]) {
                        formData.append("storeMap", fileInputRef.current.files[0]);
                  }

                  const url = hasExistingMap
                        ? `${SERVER_URL}/api/mart/${martId}`
                        : `${SERVER_URL}/api/mart`;

                  const method = hasExistingMap ? "PATCH" : "POST";

                  const response = await axios({
                        method,
                        url,
                        data: formData,
                        headers: {
                              "Content-Type": "multipart/form-data",
                        },
                        withCredentials: true,
                  });

                  if (response.data.success) {
                        setIsDialogOpen(false);
                        setHasExistingMap(true);
                        setMartId(response.data.mart._id);

                        // Clear file input
                        if (fileInputRef.current) {
                              fileInputRef.current.value = "";
                        }

                        // Update storeData with new values
                        setStoreData({
                              storeName: response.data.mart.storeName,
                              address: response.data.mart.address,
                        });

                        // Show success message
                        alert(
                              hasExistingMap
                                    ? "Store updated successfully!"
                                    : "Store created successfully!"
                        );

                        // Update count to trigger re-render of parent components if needed
                        updateCount && updateCount();

                        // If there's a new map, update the shape detector
                        if (
                              fileInputRef.current.files[0] &&
                              shapeDetectorRef.current
                        ) {
                              shapeDetectorRef.current.handleImageUpload(
                                    fileInputRef.current.files[0]
                              );
                        }

                        // Show the detect guide
                        setShowDetectGuide(true);
                        setTimeout(() => setShowDetectGuide(false), 10000);
                  } else {
                        alert(
                              response.data.message ||
                                    "Error processing your request"
                        );
                  }
            } catch (error) {
                  console.error("Error:", error);
                  alert("An error occurred while processing your request");
            }
      };

      const handleChange = (e) => {
            const { name, value } = e.target;
            setStoreData((prev) => ({
                  ...prev,
                  [name]: value,
            }));
      };

      return (
            <>
                  {/* Store Upload Dialog */}
                  {isDialogOpen && (
                        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                              <div className="bg-white p-6 rounded-lg w-96">
                                    <h2 className="text-xl font-bold mb-4">
                                          {hasExistingMap
                                                ? "Update Store Map"
                                                : "Upload Store Map"}
                                    </h2>
                                    <form
                                          onSubmit={handleSubmit}
                                          className="space-y-4"
                                    >
                                          <div>
                                                <label className="block text-sm font-medium text-gray-700">
                                                      Store Name
                                                </label>
                                                <input
                                                      type="text"
                                                      name="storeName"
                                                      value={
                                                            storeData.storeName
                                                      }
                                                      onChange={handleChange}
                                                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                                      required
                                                />
                                          </div>
                                          <div>
                                                <label className="block text-sm font-medium text-gray-700">
                                                      Address
                                                </label>
                                                <textarea
                                                      name="address"
                                                      value={storeData.address}
                                                      onChange={handleChange}
                                                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                                      required
                                                />
                                          </div>
                                          <div>
                                                <label className="block text-sm font-medium text-gray-700">
                                                      Retailer ID
                                                </label>
                                                <input
                                                      type="text"
                                                      value={retailerId}
                                                      className="mt-1 block w-full rounded-md border-gray-300 bg-gray-100 cursor-not-allowed"
                                                      disabled
                                                />
                                          </div>
                                          <div>
                                                <label className="block text-sm font-medium text-gray-700">
                                                      Store Map
                                                </label>
                                                <input
                                                      type="file"
                                                      accept="image/*"
                                                      ref={fileInputRef}
                                                      className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                                                      required
                                                />
                                          </div>
                                          <div className="flex justify-end space-x-3">
                                                <button
                                                      type="button"
                                                      onClick={() =>
                                                            setIsDialogOpen(
                                                                  false
                                                            )
                                                      }
                                                      className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                                                >
                                                      Cancel
                                                </button>
                                                <button
                                                      type="submit"
                                                      className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
                                                >
                                                      {hasExistingMap
                                                            ? "Update"
                                                            : "Upload"}
                                                </button>
                                          </div>
                                    </form>
                              </div>
                        </div>
                  )}

                  {/* Button controls */}
                  <div
                        className={`flex items-center absolute top-32 md:top-24 left-4 z-10 space-y-2 ${
                              isCollapsed ? "flex-row gap-1" : "flex-col"
                        } md:h-screen`}
                  >
                        <button
                              onClick={() =>
                                    setScale((prev) => Math.min(prev + 0.1, 3))
                              }
                              className="bg-white p-2 mt-2 rounded shadow-md border border-gray-300"
                        >
                              ➕
                        </button>
                        <button
                              onClick={() =>
                                    setScale((prev) =>
                                          Math.max(prev - 0.1, 0.5)
                                    )
                              }
                              className="bg-white p-2 rounded shadow-md border border-gray-300"
                        >
                              ➖
                        </button>
                        <button
                              onClick={handleReset}
                              className="bg-white p-2 rounded shadow-md border border-gray-300"
                        >
                              🔄
                        </button>
                        {userRole === "retailer" && (
                              <div className="relative inline-block group">
                                    <button
                                          onClick={() => setIsDialogOpen(true)}
                                          className="bg-white p-2 rounded shadow-md border border-gray-300 hover:bg-blue-50"
                                    >
                                          🗺️
                                    </button>
                                    <span className="absolute top-5 left-1/2 -translate-x-1/2 mt-2 w-max bg-gray-800 text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                          Update Store Map
                                    </span>
                              </div>
                        )}

                        {userRole === "retailer" && (
                              <>
                                    {!hasExistingMap && (
                                          <button
                                                onClick={() =>
                                                      setIsDialogOpen(true)
                                                }
                                                className="bg-yellow-500 absolute left-0 md:left-96 text-black w-52 h-16 text-2xl top-72  px-4 py-2 rounded-lg shadow-md 
             animate-bounce hover:scale-110 hover:bg-blue-700 hover:text-white
             transition-all duration-300"
                                          >
                                                Create Store
                                          </button>
                                    )}
                                    <div className="relative inline-block group">
                                          <button
                                                onClick={handleDetectClick}
                                                className="bg-white p-2 rounded shadow-md border border-gray-300
             animate-pulse hover:scale-110 hover:bg-blue-600 
             transition-all duration-300"
                                          >
                                                🔍
                                          </button>
                                          <span className="absolute top-5 left-1/2 -translate-x-1/2 mt-2 w-max bg-gray-800 text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                                DETECT SHELVES
                                          </span>
                                    </div>

                                    <input
                                          type="file"
                                          accept="image/*"
                                          ref={fileInputRef}
                                          onChange={handleImageUploadChange}
                                          style={{ display: "none" }}
                                    />
                                    <div className="relative inline-block group">
                                          <button
                                                onClick={() =>
                                                      setIsPinMode(true)
                                                }
                                                className="bg-white p-2 rounded shadow-md border border-gray-300"
                                          >
                                                📍
                                          </button>
                                          <span className="absolute top-5 left-1/2 -translate-x-1/2 mt-2 w-max bg-gray-800 text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                                ADD ROUTER LOCATIONS
                                          </span>
                                    </div>
                              </>
                        )}
                  </div>

                  {/* Map container */}
                  <div
                        ref={scrollContainerRef}
                        onMouseDown={handleMouseDown}
                        onMouseMove={handleMouseMove}
                        onMouseUp={handleMouseUp}
                        onMouseLeave={handleMouseUp}
                        onTouchStart={handleTouchStart}
                        onTouchMove={handleTouchMove}
                        className={`mt-1 w-full md:w-2/3 ${
                              isCollapsed
                                    ? "h-[100px]"
                                    : "h-[400px] md:h-screen"
                        } overflow-auto relative border-8 border-[#ffc221] touch-none`}
                        style={{
                              touchAction: "pan-x pan-y",
                              overscrollBehavior: "contain",
                              WebkitOverflowScrolling: "touch",
                        }}
                  >
                        <div className="flex items-center justify-center">
                              <div
                                    className="transform origin-center transition-transform"
                                    style={{
                                          transform: `scale(${scale})`,
                                    }}
                                    onClick={handleMapClick}
                              >
                                    <RetailMap
                                          ref={shapeDetectorRef}
                                          shelves={shelves}
                                          onShelfClick={handleShelfClick}
                                          onMapLoad={setHasExistingMap}
                                          isPinMode={isPinMode}
                                          pins={pins}
                                          onMapClick={handleMapClick}
                                          martId={martId}
                                    />
                                    {/* Pins overlay */}
                                    <svg
                                          className="absolute top-0 left-0"
                                          style={{
                                                pointerEvents: "none",
                                                overflow: "visible",
                                          }}
                                    >
                                          {pins.map((pin, idx) => (
                                                <circle
                                                      key={idx}
                                                      cx={pin.x}
                                                      cy={pin.y}
                                                      r="8"
                                                      fill="red"
                                                      stroke="#000"
                                                      strokeWidth="1.5"
                                                />
                                          ))}
                                    </svg>
                              </div>
                        </div>
                  </div>

                  {/* Collapse button */}
                  <div className="justify-center mt-[-30px] z-10 lg:hidden flex">
                        <button
                              onClick={() => setIsCollapsed(!isCollapsed)}
                              className="bg-white rounded shadow-md border border-gray-300"
                        >
                              {isCollapsed ? "🔽" : "🔼"}
                        </button>
                  </div>

                  <Detect
                        showDetectGuide={showDetectGuide}
                        onClose={() => setShowDetectGuide(false)}
                        ctaText="Click here to detect shelves!"
                  />
            </>
      );
}
LeftSection.propTypes = {
      updateCount: PropTypes.func.isRequired,
};

export default LeftSection;
