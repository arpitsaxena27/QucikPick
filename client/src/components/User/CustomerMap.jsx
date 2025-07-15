import  { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";

// BFS Pathfinder
const bfsPathfinder = (grid, start, end) => {
  const queue = [start];
  const cameFrom = {};
  const visited = new Set();
  const key = (p) => `${p.x},${p.y}`;
  visited.add(key(start));

  const directions = [
    { x: 0, y: -1 },
    { x: 1, y: 0 },
    { x: 0, y: 1 },
    { x: -1, y: 0 },
  ];

  while (queue.length > 0) {
    const current = queue.shift();

    if (current.x === end.x && current.y === end.y) {
      const path = [end];
      let prev = key(end);
      while (cameFrom[prev]) {
        path.unshift(cameFrom[prev]);
        prev = key(cameFrom[prev]);
      }
      return path;
    }

    for (const dir of directions) {
      const neighbor = { x: current.x + dir.x, y: current.y + dir.y };
      const neighborKey = key(neighbor);

      if (
        neighbor.x >= 0 &&
        neighbor.y >= 0 &&
        neighbor.x < grid[0].length &&
        neighbor.y < grid.length &&
        grid[neighbor.y][neighbor.x] === 0 &&
        !visited.has(neighborKey)
      ) {
        queue.push(neighbor);
        visited.add(neighborKey);
        cameFrom[neighborKey] = current;
      }
    }
  }
  return null;
};

const getRandomColor = () => {
  const colors = ["#ff6b6b", "#6bffb3", "#6bc1ff", "#ff6bda", "#ffc36b"];
  return colors[Math.floor(Math.random() * colors.length)];
};

const AnimatedPath = ({ points }) => {
  const color = "#f966ac";
  return (
    <>
      {points.map((point, index) => {
        const delay = index * 0.005;
        const lateralOffset = 1;
        return (
          <motion.circle
            key={`${point.x}-${point.y}-${index}`}
            cx={point.x}
            cy={point.y}
            r="7"
            fill={color}
            fillOpacity={0.8}
            animate={{
              scale: [1, 1.5, 1],
              opacity: [0.6, 1, 0.6],
              x: [0, lateralOffset, 0, -lateralOffset, 0],
            }}
            transition={{
              delay,
              duration: 2,
              ease: "easeInOut",
              repeat: Infinity,
            }}
          />
        );
      })}
    </>
  );
};

const CustomerMap = ({ mapImage, shelves = [], selectedProduct, onShelfClick, startLocation }) => {
  const [path, setPath] = useState([]);
  const [destShelf, setDestShelf] = useState(null);
  const [destColor, setDestColor] = useState("#ff0000");
  const scrollRef = useRef(null);

  const imageWidth = 1598;
  const imageHeight = 790;
  const gridSize = 30;

  const gridCols = Math.ceil(imageWidth / gridSize);
  const gridRows = Math.ceil(imageHeight / gridSize);

  const buildGrid = (excludeNid) => {
    const grid = Array.from({ length: gridRows }, () => Array(gridCols).fill(0));
    shelves.forEach((shelf) => {
      const xStart = Math.floor(shelf.boundingBox.x / gridSize);
      const yStart = Math.floor(shelf.boundingBox.y / gridSize);
      const xEnd = Math.floor((shelf.boundingBox.x + shelf.boundingBox.width) / gridSize);
      const yEnd = Math.floor((shelf.boundingBox.y + shelf.boundingBox.height) / gridSize);
      for (let y = yStart; y <= yEnd; y++) {
        for (let x = xStart; x <= xEnd; x++) {
          if (grid[y] && shelf.nid?.toLowerCase().trim() !== excludeNid?.toLowerCase().trim()) {
            grid[y][x] = 1;
          }
        }
      }
    });
    return grid;
  };

  const gridToPixel = (p) => ({
    x: p.x * gridSize + gridSize / 2,
    y: p.y * gridSize + gridSize / 2,
  });

  useEffect(() => {
    if (!selectedProduct || !startLocation) {
      setPath([]);
      setDestShelf(null);
      return;
    }

    const grid = buildGrid(selectedProduct.nid);
    const targetShelf = shelves.find(
      (s) => s.nid?.toLowerCase().trim() === selectedProduct.nid?.toLowerCase().trim()
    );

    if (!targetShelf) {
      console.warn("Shelf not found for product:", selectedProduct.nid);
      setPath([]);
      setDestShelf(null);
      return;
    }

    const dest = {
      x: Math.floor((targetShelf.boundingBox.x + targetShelf.boundingBox.width / 2) / gridSize),
      y: Math.floor((targetShelf.boundingBox.y + targetShelf.boundingBox.height / 2) / gridSize),
    };

    const computedPath = bfsPathfinder(grid, startLocation, dest);

    if (computedPath) {
      setPath(computedPath);
      setDestShelf(targetShelf);
      setDestColor(getRandomColor());
    } else {
      setPath([]);
      setDestShelf(null);
    }
  }, [selectedProduct, shelves, startLocation]);

  return (

    <div className="p-4 h-full w-full">
      <div
        ref={scrollRef}
        className="overflow-auto border-8 border-yellow-500 rounded-lg shadow-lg h-full w-full"
        style={{
          touchAction: "pan-x pan-y",
          overscrollBehavior: "contain",
          WebkitOverflowScrolling: "touch",
        }}
      >
        <div
          className="flex items-center justify-center bg-gradient-to-br from-white to-gray-100 w-full h-full"
          style={{ aspectRatio: `${imageWidth} / ${imageHeight}` }}
        >
          <svg
            viewBox={`0 0 ${imageWidth} ${imageHeight}`}
            className="border border-gray-300 rounded-md w-full h-full"
            preserveAspectRatio="xMidYMid meet"
          >

            {mapImage ? (
              <image href={mapImage} x="0" y="0" width={imageWidth} height={imageHeight} />
            ) : (
              <text x="100" y="100" fill="red">No Map Image</text>
            )}

            {/* Starting Point with concentric ripple animation */}
            {startLocation && (
              <g key={`ripples-${startLocation.x}-${startLocation.y}`}>
                <motion.circle
                  cx={gridToPixel(startLocation).x}
                  cy={gridToPixel(startLocation).y}
                  r="10"
                  fill="#00ff00"
                  stroke="#000"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                />
                {[0, 1, 2].map((i) => (
                  <motion.circle
                    key={`ripple-${i}`}
                    cx={gridToPixel(startLocation).x}
                    cy={gridToPixel(startLocation).y}
                    r="10"
                    fill="none"
                    stroke="#3b82f6"
                    strokeWidth="2"
                    animate={{
                      scale: [1, 3],
                      opacity: [0.6, 0],
                    }}
                    transition={{
                      duration: 2,
                      delay: i * 0.6,
                      repeat: Infinity,
                      repeatType: "loop",
                      ease: "easeOut",
                    }}
                  />
                ))}
              </g>
            )}
            {/* Path */}
            {path.length > 1 && (
              <AnimatedPath points={path.map(gridToPixel)} />
            )}

            {/* Shelves */}
            {shelves.map((shelf) => {
              const isDest = destShelf?.nid === shelf.nid;
              return isDest ? (
                <motion.rect
                  key={shelf.nid}
                  x={shelf.boundingBox.x}
                  y={shelf.boundingBox.y}
                  width={shelf.boundingBox.width}
                  height={shelf.boundingBox.height}
                  fill={destColor}
                  fillOpacity={0.6}
                  stroke="#000"
                  strokeWidth="2"
                  cursor="pointer"
                  animate={{ scale: [1, 1.1, 1], opacity: [0.6, 0.9, 0.6] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                  onClick={() => onShelfClick && onShelfClick(shelf.nid)}
                />
              ) : (
                <motion.rect
                  key={shelf.nid}
                  x={shelf.boundingBox.x}
                  y={shelf.boundingBox.y}
                  width={shelf.boundingBox.width}
                  height={shelf.boundingBox.height}
                  fill="#555"
                  fillOpacity={0.25}
                  stroke="#000"
                  strokeWidth="1"
                  cursor="pointer"
                  whileHover={{ scale: 1.05, fillOpacity: 0.5 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => onShelfClick && onShelfClick(shelf.nid)}
                />
              );
            })}
          </svg>
        </div>
      </div>
    </div>
  );
};

export default CustomerMap;

