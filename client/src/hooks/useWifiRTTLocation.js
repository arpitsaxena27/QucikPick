import { useState, useEffect, useCallback } from "react";
import { getWifiRTTLocation } from "./WifiRTTLocation";

/**
 * React hook for using WiFi RTT location tracking
 * @param {Object} options Configuration options
 * @param {number} options.interval Update interval in milliseconds (default: 1000)
 * @param {boolean} options.autoStart Start tracking automatically (default: true)
 * @returns {Object} Location tracking state and controls
 */
export function useWifiRTTLocation({ interval = 1000, autoStart = true } = {}) {
      const [position, setPosition] = useState(null);
      const [error, setError] = useState(null);
      const [isTracking, setIsTracking] = useState(autoStart);
      const [isLoading, setIsLoading] = useState(false);

      // Function to get a single position update
      const updatePosition = useCallback(async () => {
            try {
                  setIsLoading(true);
                  setError(null);
                  const newPosition = await getWifiRTTLocation();
                  setPosition(newPosition);
            } catch (err) {
                  setError(err.message);
                  console.error("Error updating position:", err);
            } finally {
                  setIsLoading(false);
            }
      }, []);

      // Start/stop continuous tracking
      useEffect(() => {
            let timeoutId;

            async function trackPosition() {
                  await updatePosition();
                  if (isTracking) {
                        timeoutId = setTimeout(trackPosition, interval);
                  }
            }

            if (isTracking) {
                  trackPosition();
            }

            return () => {
                  if (timeoutId) {
                        clearTimeout(timeoutId);
                  }
            };
      }, [isTracking, interval, updatePosition]);

      // Control functions
      const startTracking = () => setIsTracking(true);
      const stopTracking = () => setIsTracking(false);
      const getPosition = updatePosition; // Get a single position update

      return {
            position, // Current position {x, y}
            error, // Error message if any
            isLoading, // Whether currently getting position
            isTracking, // Whether continuous tracking is active
            startTracking, // Start continuous tracking
            stopTracking, // Stop continuous tracking
            getPosition, // Get single position update
      };
}
