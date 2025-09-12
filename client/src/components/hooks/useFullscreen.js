import { useState, useEffect } from "react";

export function useFullscreen() {
      const [isFullscreen, setIsFullscreen] = useState(false);
      const [isSupported, setIsSupported] = useState(true);

      // Check fullscreen support on mount
      useEffect(() => {
            const doc = document.documentElement;
            const isFullscreenSupported =
                  doc.requestFullscreen ||
                  doc.webkitRequestFullscreen ||
                  doc.mozRequestFullScreen ||
                  doc.msRequestFullscreen;

            setIsSupported(Boolean(isFullscreenSupported));
      }, []);

      useEffect(() => {
            const handler = () => {
                  setIsFullscreen(
                        Boolean(
                              document.fullscreenElement ||
                                    document.webkitFullscreenElement ||
                                    document.mozFullScreenElement ||
                                    document.msFullscreenElement
                        )
                  );
            };

            // Add listeners for all browser variants
            document.addEventListener("fullscreenchange", handler);
            document.addEventListener("webkitfullscreenchange", handler);
            document.addEventListener("mozfullscreenchange", handler);
            document.addEventListener("MSFullscreenChange", handler);

            return () => {
                  document.removeEventListener("fullscreenchange", handler);
                  document.removeEventListener(
                        "webkitfullscreenchange",
                        handler
                  );
                  document.removeEventListener("mozfullscreenchange", handler);
                  document.removeEventListener("MSFullscreenChange", handler);
            };
      }, []);

      const enter = async (el = document.documentElement) => {
            try {
                  if (!el) return;
                  if (el.requestFullscreen) {
                        await el.requestFullscreen();
                  } else if (el.webkitRequestFullscreen) {
                        await el.webkitRequestFullscreen();
                  } else if (el.mozRequestFullScreen) {
                        await el.mozRequestFullScreen();
                  } else if (el.msRequestFullscreen) {
                        await el.msRequestFullscreen();
                  }
            } catch (err) {
                  console.error("Failed to enter fullscreen mode:", err);
            }
      };

      const exit = async () => {
            try {
                  if (document.exitFullscreen) {
                        await document.exitFullscreen();
                  } else if (document.webkitExitFullscreen) {
                        await document.webkitExitFullscreen();
                  } else if (document.mozCancelFullScreen) {
                        await document.mozCancelFullScreen();
                  } else if (document.msExitFullscreen) {
                        await document.msExitFullscreen();
                  }
            } catch (err) {
                  console.error("Failed to exit fullscreen mode:", err);
            }
      };

      const toggle = (el) => {
            if (!isSupported) {
                  console.warn("Fullscreen is not supported in this browser");
                  return;
            }
            if (isFullscreen) {
                  exit();
            } else {
                  enter(el);
            }
      };

      return { isFullscreen, isSupported, enter, exit, toggle };
}
