/**
 * WiFi RTT Location Service
 * This module provides functions to get real-time indoor positioning using WiFi RTT
 * Falls back to simulation when WiFi RTT is not available
 */

// Cache for storing initialization status
let isInitialized = false;

// Simulation variables
let currentX = 40;
let currentY = 12;
const xLimit = 60;
const yLimit = 8;
let directionX = 1;
let directionY = 0;

/**
 * Initialize the WiFi RTT system
 * @returns {Promise<boolean>} True if initialization was successful
 */
async function initializeRTT() {
      try {
            // Check if we're running in the Android WebView with RTT support
            if (typeof window.Android === "undefined") {
                  console.error(
                        "WiFi RTT is only available in the Android app"
                  );
                  return false;
            }

            // Check if device supports WiFi RTT
            const isSupported = await window.Android.checkWifiRTTSupport();
            if (!isSupported) {
                  console.error("This device does not support WiFi RTT");
                  return false;
            }

            // Initialize the RTT system
            const initialized = await window.Android.initializeWifiRTT();
            isInitialized = initialized;
            return initialized;
      } catch (error) {
            console.error("Failed to initialize WiFi RTT:", error);
            return false;
      }
}

/**
 * Get the current location using WiFi RTT
 * @returns {Promise<{x: number, y: number} | null>} Current position or null if error
 */
export async function getWifiRTTLocation() {
      try {
            // Initialize if not already done
            if (!isInitialized) {
                  const initialized = await initializeRTT();
                  if (!initialized) {
                        throw new Error("Failed to initialize WiFi RTT");
                  }
            }

            // Get position from Android bridge
            const positionStr = await window.Android.getWifiRTTPosition();
            const position = JSON.parse(positionStr);

            // Check for errors from native code
            if (position.error) {
                  throw new Error(position.error);
            }

            // Return the position coordinates
            return {
                  x: position.x,
                  y: position.y,
            };
      } catch (error) {
            console.error("Error getting WiFi RTT location:", error);
            // Fall back to simulation
            return getSimulatedLocation();
      }
}

/**
 * Get simulated location when WiFi RTT is not available
 * @returns {Promise<{x: number, y: number}>} Simulated position
 */
async function getSimulatedLocation() {
      return new Promise((resolve) => {
            setTimeout(() => {
                  // Update position
                  currentX += directionX;
                  currentY += directionY;

                  // Bounce logic
                  if (currentX >= xLimit || currentX <= 0) directionX *= -1;
                  if (currentY >= yLimit || currentY <= 0) directionY *= -1;

                  resolve({ x: currentX, y: currentY });
            }, 500);
      });
}
