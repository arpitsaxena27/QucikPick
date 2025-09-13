// WiFi RTT Bridge for Mobile Devices
class WifiRTTBridge {
      constructor() {
            this.isAvailable =
                  typeof Android !== "undefined" && Android.initializeWifiRTT;
      }

      async initializeRTT() {
            if (!this.isAvailable) {
                  throw new Error("WiFi RTT is not available on this device");
            }
            return await Android.initializeWifiRTT();
      }

      async getCurrentPosition() {
            if (!this.isAvailable) {
                  throw new Error("WiFi RTT is not available on this device");
            }
            try {
                  const position = await Android.getWifiRTTPosition();
                  return JSON.parse(position);
            } catch (error) {
                  console.error("Error getting WiFi RTT position:", error);
                  throw error;
            }
      }

      async checkRTTSupport() {
            if (!this.isAvailable) return false;
            return await Android.checkWifiRTTSupport();
      }
}

// Export as global variable
window.WifiRTTBridge = new WifiRTTBridge();
