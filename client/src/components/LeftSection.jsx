// import StoreMap from "./StoreMap";
// import { useState, useRef, useEffect } from "react";

// function LeftSection({ updateCount }) {
//       const [scale, setScale] = useState(0.71);
//       const [isCollapsed, setIsCollapsed] = useState(false);
//       const scrollContainerRef = useRef(null);
//       const [isDragging, setIsDragging] = useState(false);
//       const [startX, setStartX] = useState(0);
//       const [startY, setStartY] = useState(0);
//       const [scrollLeft, setScrollLeft] = useState(0);
//       const [scrollTop, setScrollTop] = useState(0);

//       const updateCount1 = (newValue) => {
//             updateCount(newValue);
//       };
//       const handleMouseDown = (e) => {
//             e.preventDefault();
//             setIsDragging(true);
//             setStartX(e.pageX - scrollContainerRef.current.offsetLeft);
//             setStartY(e.pageY - scrollContainerRef.current.offsetTop);
//             setScrollLeft(scrollContainerRef.current.scrollLeft);
//             setScrollTop(scrollContainerRef.current.scrollTop);
//       };

//       const handleMouseMove = (e) => {
//             if (!isDragging) return;
//             e.preventDefault();
//             const x = e.pageX - scrollContainerRef.current.offsetLeft;
//             const y = e.pageY - scrollContainerRef.current.offsetTop;
//             const walkX = (x - startX) * 1.5; // Adjust the multiplier for speed
//             const walkY = (y - startY) * 1.5;
//             scrollContainerRef.current.scrollLeft = scrollLeft - walkX;
//             scrollContainerRef.current.scrollTop = scrollTop - walkY;
//       };

//       const handleMouseUp = () => {
//             setIsDragging(false);
//       };

//       const handleReset = () => {
//             setScale(0.71); // Reset scale
//             setTimeout(() => {
//                   if (scrollContainerRef.current) {
//                         const {
//                               scrollWidth,
//                               scrollHeight,
//                               clientWidth,
//                               clientHeight,
//                         } = scrollContainerRef.current;

//                         scrollContainerRef.current.scrollTo({
//                               top: (scrollHeight - clientHeight) / 2,
//                               left: (scrollWidth - clientWidth) / 2 + 37,
//                               behavior: "smooth",
//                         });
//                   }
//             }, 200); // Small delay to ensure scale updates first
//       };

//       const handleMobileReset = () => {
//             setScale(0.71); // Reset scale
//             setTimeout(() => {
//                   if (scrollContainerRef.current) {
//                         const {
//                               scrollWidth,
//                               scrollHeight,
//                               clientWidth,
//                               clientHeight,
//                         } = scrollContainerRef.current;

//                         scrollContainerRef.current.scrollTo({
//                               top: (scrollHeight - clientHeight) / 2,
//                               left: (scrollWidth - clientWidth) / 2 + 20,
//                               behavior: "smooth",
//                         });
//                   }
//             }, 200);
//       };

//       const handleResetClick = () => {
//             if (window.innerWidth <= 768) {
//                   handleMobileReset();
//             } else {
//                   handleReset();
//             }
//       };

//       useEffect(() => {
//             if (scrollContainerRef.current) {
//                   const {
//                         scrollWidth,
//                         scrollHeight,
//                         clientWidth,
//                         clientHeight,
//                   } = scrollContainerRef.current;
//                   scrollContainerRef.current.scrollTo({
//                         top: (scrollHeight - clientHeight) / 2,
//                         left: (scrollWidth - clientWidth) / 2 + 31,
//                         behavior: "smooth",
//                   });
//             }
//       }, []);

//       // Handle Mobile Pinch Zoom
//       let initialDistance = null;
//       const handleTouchStart = (e) => {
//             if (e.touches.length === 2) {
//                   const dx = e.touches[0].clientX - e.touches[1].clientX;
//                   const dy = e.touches[0].clientY - e.touches[1].clientY;
//                   initialDistance = Math.sqrt(dx * dx + dy * dy);
//             }
//       };

//       const handleTouchMove = (e) => {
//             if (e.touches.length === 2 && initialDistance) {
//                   e.preventDefault();
//                   const dx = e.touches[0].clientX - e.touches[1].clientX;
//                   const dy = e.touches[0].clientY - e.touches[1].clientY;
//                   const newDistance = Math.sqrt(dx * dx + dy * dy);
//                   const zoomFactor = 0.03; // Increased sensitivity

//                   setScale((prevScale) =>
//                         Math.min(
//                               Math.max(
//                                     prevScale *
//                                           (1 +
//                                                 zoomFactor *
//                                                       (newDistance -
//                                                             initialDistance)),
//                                     0.5
//                               ),
//                               3
//                         )
//                   );
//                   initialDistance = newDistance;
//             }
//       };
//       return (
//             <>
//                   <div className={`flex items-center  absolute top-32 md:top-24 left-4 z-10 space-y-2 ${isCollapsed
//                                     ? "flex-row gap-1"
//                                     : "flex-col"} md:h-screen`}>
//                         {/* Zoom In Button */}
//                         <button
//                               onClick={() =>
//                                     setScale((prev) => Math.min(prev + 0.1, 3))
//                               }
//                               className="mt-2 bg-white p-2 rounded shadow-md border border-gray-300"
//                         >
//                               ➕
//                         </button>

//                         {/* Zoom Out Button */}
//                         <button
//                               onClick={() =>
//                                     setScale((prev) =>
//                                           Math.max(prev - 0.1, 0.5)
//                                     )
//                               }
//                               className="bg-white p-2 rounded shadow-md border border-gray-300"
//                         >
//                               ➖
//                         </button>

//                         {/* Reset Zoom Button - Updated onClick handler */}
//                         <button
//                               onClick={handleResetClick}
//                               className="bg-white p-2 rounded shadow-md border border-gray-300"
//                         >
//                               🔄
//                         </button>
//                   </div>
//                   <div
//                         ref={scrollContainerRef}
//                         onMouseDown={handleMouseDown}
//                         onMouseMove={handleMouseMove}
//                         onMouseUp={handleMouseUp}
//                         onMouseLeave={handleMouseUp}
//                         onTouchStart={handleTouchStart}
//                         onTouchMove={handleTouchMove}
//                         className={`mt-1 w-full md:w-2/3 ${
//                               isCollapsed
//                                     ? "h-[100px]"
//                                     : "h-[400px] md:h-screen"
//                         } overflow-auto relative border-8 border-[#ffc221] touch-none`}
//                         style={{
//                               touchAction: "pan-x pan-y", // Allows single-finger scrolling
//                               overscrollBehavior: "contain", // Prevents unintended page scrolling
//                               WebkitOverflowScrolling: "touch", // Enables smooth scrolling on iOS
//                         }}
//                   >
//                         <div
//                               className="transform origin-center transition-transform"
//                               style={{
//                                     transform: `scale(${scale})`,
//                               }}
//                         >
//                               <StoreMap updateCount1={updateCount1} />
//                         </div>
//                   </div>
//                   <div className="justify-center mt-[-30px] z-10 lg:hidden flex">
//                         <button
//                               onClick={() => setIsCollapsed(!isCollapsed)}
//                               className="bg-white rounded shadow-md border border-gray-300"
//                         >
//                               {isCollapsed ? "🔽" : "🔼"}
//                         </button>
//                   </div>
//             </>
//       );
// }

// export default LeftSection;
import RetailMap from "./RetailMap";
import { useState, useRef, useEffect } from "react";
import { useSelector } from "react-redux";
import { selectShelves } from "../store/slices/productsSlice";

function LeftSection({ updateCount }) {
  const [scale, setScale] = useState(0.71);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const scrollContainerRef = useRef(null);
  const fileInputRef = useRef(null);
  const shapeDetectorRef = useRef(null);
  const userRole = useSelector((state) => state.products.userRole);
  const shelves = useSelector(selectShelves);

  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [startY, setStartY] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [scrollTop, setScrollTop] = useState(0);

  const [isPinMode, setIsPinMode] = useState(false);
  const [pins, setPins] = useState([]);
  const mapContainerRef = useRef(null);
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

  const handleMouseUp = () => setIsDragging(false);

  const handleReset = () => {
    setScale(0.71);
    setTimeout(() => {
      const { scrollWidth, scrollHeight, clientWidth, clientHeight } =
        scrollContainerRef.current;
      scrollContainerRef.current.scrollTo({
        top: (scrollHeight - clientHeight) / 2,
        left: (scrollWidth - clientWidth) / 2,
        behavior: "smooth",
      });
    }, 200);
  };

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
        Math.min(Math.max(prevScale * (1 + zoomFactor * (newDistance - initialDistance)), 0.5), 3)
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

  return (
    <>
      {/* Button controls */}
      <div
        className={`flex items-center absolute top-32 md:top-24 left-4 z-10 space-y-2 ${
          isCollapsed ? "flex-row gap-1" : "flex-col"
        } md:h-screen`}
      >
        <button onClick={() => setScale((prev) => Math.min(prev + 0.1, 3))} className="bg-white p-2 rounded shadow-md border border-gray-300">➕</button>
        <button onClick={() => setScale((prev) => Math.max(prev - 0.1, 0.5))} className="bg-white p-2 rounded shadow-md border border-gray-300">➖</button>
        <button onClick={handleReset} className="bg-white p-2 rounded shadow-md border border-gray-300">🔄</button>

        {userRole === "retailer" && (
          <>
            <button onClick={() => fileInputRef.current.click()} className="bg-green-500 text-white px-3 py-1 rounded shadow-md">Upload Map</button>
            <button onClick={handleDetectClick} className="bg-blue-500 text-white px-3 py-1 rounded shadow-md">Detect Shapes</button>
            <input type="file" accept="image/*" ref={fileInputRef} onChange={handleImageUploadChange} style={{ display: "none" }} />
            <button onClick={() => setIsPinMode(true)} className="bg-purple-500 text-white px-3 py-1 rounded shadow-md">📍 AP Location</button>
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
          isCollapsed ? "h-[100px]" : "h-[400px] md:h-screen"
        } overflow-auto relative border-8 border-[#ffc221] touch-none`}
        style={{
          touchAction: "pan-x pan-y",
          overscrollBehavior: "contain",
          WebkitOverflowScrolling: "touch",
        }}
      >
        <div className="flex items-center justify-center min-h-full min-w-full">
          <div className="relative" ref={mapContainerRef}>
            <div
              className="transform origin-center transition-transform"
              style={{ transform: `scale(${scale})` }}
              onClick={handleMapClick}
            >
              <RetailMap ref={shapeDetectorRef} shelves={shelves} onShelfClick={handleShelfClick} />
              {/* Pins overlay */}
              <svg className="absolute top-0 left-0" style={{ pointerEvents: "none", overflow: "visible" }}>
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
      </div>

      {/* Collapse button */}
      <div className="justify-center mt-[-30px] z-10 lg:hidden flex">
        <button onClick={() => setIsCollapsed(!isCollapsed)} className="bg-white rounded shadow-md border border-gray-300">
          {isCollapsed ? "🔽" : "🔼"}
        </button>
      </div>
    </>
  );
}

export default LeftSection;
