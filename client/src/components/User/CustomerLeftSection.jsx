import { useState, useRef, useEffect } from "react";
import PropTypes from "prop-types";
import { useDispatch, useSelector } from "react-redux";
import CustomerMap from "./CustomerMap";
import { getWifiRTTLocation } from "./WifiRTTLocation";
import {
      fetchShelfInfoByMartId,
      fetchMapImage,
      selectShelves,
      selectMartId,
      selectMapImage,
} from "../../store/slices/productsSlice";

function CustomerLeftSection({ selectedProduct, onShelfSelect }) {
      const dispatch = useDispatch();
      const martId = useSelector(selectMartId);
      console.log("CustomerLeftSection martId:", martId);
      const shelves = useSelector(selectShelves);
      const mapImage = useSelector(selectMapImage);
      console.log("CustomerLeftSection mapImage:", mapImage);
      const [scale, setScale] = useState(0.71);
      const [isCollapsed, setIsCollapsed] = useState(false);
      const scrollContainerRef = useRef(null);

      const [isDragging, setIsDragging] = useState(false);
      const [startX, setStartX] = useState(0);
      const [startY, setStartY] = useState(0);
      const [scrollLeft, setScrollLeft] = useState(0);
      const [scrollTop, setScrollTop] = useState(0);
      const [isTracking, setIsTracking] = useState(false);
      useEffect(() => {
            if (!isTracking) return;

            const interval = setInterval(async () => {
                  const location = await getWifiRTTLocation();
                  setStartLocation(location);
            }, 1000); // or 2000ms if you like

            return () => clearInterval(interval);
      }, [isTracking]);

      // Default entrance location (hardcoded)
      const trance = { x: 16, y: 25 };

      // State to hold current start location (starts with entrance)
      const [startLocation, setStartLocation] = useState(trance);

      const handleMouseDown = (e) => {
            const tag = e.target.tagName.toLowerCase();
            if (["input", "button", "textarea", "select"].includes(tag)) return;

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

      const handleMouseUp = () => {
            setIsDragging(false);
      };

      const handleResetClick = () => {
            setScale(0.71);
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

      // 📍 Use My Location button handler
      const handleUseLocationClick = () => {
            setIsTracking(true);
      };

      useEffect(() => {
            if (martId) {
                  dispatch(fetchShelfInfoByMartId(martId));
                  dispatch(fetchMapImage(martId));
            }
      }, [martId]);

      useEffect(() => {
            const { scrollWidth, scrollHeight, clientWidth, clientHeight } =
                  scrollContainerRef.current;
            scrollContainerRef.current.scrollTo({
                  top: (scrollHeight - clientHeight) / 2,
                  left: (scrollWidth - clientWidth) / 2,
                  behavior: "smooth",
            });
      }, []);

      return (
            <>
                  {/* Control Buttons */}
                  <div
                        className={`flex items-center absolute top-32 md:top-24 left-4 z-10 space-y-2 ${
                              isCollapsed ? "flex-row gap-1" : "flex-col"
                        } md:h-screen`}
                  >
                        <button
                              onClick={() =>
                                    setScale((prev) => Math.min(prev + 0.1, 3))
                              }
                              className="mt-2 bg-white p-2 rounded shadow-md border border-gray-300"
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
                              onClick={handleResetClick}
                              className="bg-white p-2 rounded shadow-md border border-gray-300"
                        >
                              🔄
                        </button>

                        <button
                              onClick={handleUseLocationClick}
                              className="bg-blue-500 text-white p-2 rounded shadow-md border border-gray-300"
                        >
                              📍
                        </button>
                  </div>
                  {/* Scrollable Map */}
                  <div
                        ref={scrollContainerRef}
                        onMouseDown={handleMouseDown}
                        onMouseMove={handleMouseMove}
                        onMouseUp={handleMouseUp}
                        onMouseLeave={handleMouseUp}
                        className={`mt-1 w-full flex justify-center items-center md:w-3/4 ${
                              isCollapsed
                                    ? "h-[100px]"
                                    : "h-[40vh] md:h-[90vh]"
                        } overflow-auto relative border-8 border-[#ffc221]`}
                        style={{
                              touchAction: "pan-x pan-y",
                              overscrollBehavior: "contain",
                              WebkitOverflowScrolling: "touch",
                        }}
                  >
                        <div
                              className="transition-all duration-300 ease-in-out flex justify-center items-center"
                              style={{
                                    width: `${scale * 100}%`,
                                    height: `${scale * 100}%`,
                              }}
                        >
                              <CustomerMap
                                    mapImage={mapImage}
                                    shelves={shelves}
                                    selectedProduct={selectedProduct}
                                    onShelfClick={onShelfSelect}
                                    startLocation={startLocation}
                              />
                        </div>
                  </div>

                  {/* Collapse Toggle */}
                  <div className="justify-center mt-[-30px] z-10 lg:hidden flex">
                        <button
                              onClick={() => setIsCollapsed(!isCollapsed)}
                              className="bg-white rounded shadow-md border border-gray-300"
                        >
                              {isCollapsed ? "🔽" : "🔼"}
                        </button>
                  </div>
            </>
      );
}
CustomerLeftSection.propTypes = {
      selectedProduct: PropTypes.object.isRequired,
      onShelfSelect: PropTypes.func.isRequired,
};

export default CustomerLeftSection;
