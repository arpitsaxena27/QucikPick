import React from "react";

export default function Detect({
      showDetectGuide = true,
      onClose = () => {},
      ctaText = "Click here to detect shelves!",
}) {
      if (!showDetectGuide) return null;

      return (
            <>
                  <div
                        className="fixed top-32 md:top-28 left-6 md:left-24 z-50 flex items-start pointer-events-none"
                        aria-hidden={showDetectGuide ? "false" : "true"}
                  >
                        <div className="relative pointer-events-auto">
                              {/* Tooltip / Guide Card */}
                              <div
                                    className="bg-white/95 backdrop-blur-sm border border-yellow-200 px-3 py-2 rounded-lg shadow-lg max-w-xs"
                                    role="status"
                                    aria-live="polite"
                              >
                                    <div className="flex items-start gap-3">
                                          <div>
                                                <div className="text-sm font-semibold text-gray-900">
                                                      {ctaText}
                                                </div>
                                                <div className="text-xs text-gray-600 mt-0.5">
                                                      Auto-detect shelf shapes &
                                                      layout
                                                </div>
                                          </div>
                                          <button
                                                onClick={onClose}
                                                className="ml-auto -mr-1 p-1 rounded-full hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-300"
                                                aria-label="Close detection guide"
                                          >
                                                <svg
                                                      width="14"
                                                      height="14"
                                                      viewBox="0 0 24 24"
                                                      fill="none"
                                                      xmlns="http://www.w3.org/2000/svg"
                                                >
                                                      <path
                                                            d="M6 6L18 18M6 18L18 6"
                                                            stroke="#374151"
                                                            strokeWidth="2"
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                      />
                                                </svg>
                                          </button>
                                    </div>
                              </div>

                              {/* Clean dashed guide line + left-pointing arrowhead + finger tip */}
                              <div className="mt-4 -ml-2 flex items-center">
                                    {/* finger emoji tip placed BEFORE the svg so it overlaps the left tip */}
                                    <div
                                          className="relative -mr-20 -mt-8 w-8 h-8 flex items-center justify-center"
                                          aria-hidden="true"
                                    >
                                          <div
                                                className="rounded-full bg-white shadow-md w-8 h-8 flex items-center justify-center text-lg animate-bob"
                                                style={{
                                                      position: "relative",
                                                      top: "70px",
                                                      left: "-60px",
                                                }}
                                          >
                                                👆
                                          </div>
                                    </div>

                                    <svg
                                          width="260"
                                          height="110"
                                          viewBox="0 0 260 110"
                                          fill="none"
                                          aria-hidden="true"
                                          className="overflow-visible"
                                    >
                                          <defs>
                                                <linearGradient
                                                      id="g1"
                                                      x1="0"
                                                      x2="1"
                                                >
                                                      <stop
                                                            offset="0%"
                                                            stopColor="#FFD54A"
                                                      />
                                                      <stop
                                                            offset="100%"
                                                            stopColor="#FF8A65"
                                                      />
                                                </linearGradient>
                                          </defs>

                                          {/* reversed dashed curve: starts at right (236) and goes to left (14) */}
                                          <path
                                                d="M236 82 C160 22, 80 22, 14 82"
                                                stroke="url(#g1)"
                                                strokeWidth="4"
                                                strokeLinecap="round"
                                                fill="none"
                                                strokeDasharray="10 8"
                                                className="stroke-dash-animate"
                                          />

                                          {/* left-pointing arrow head (tip at left) */}
                                          <polygon
                                                points="14,82 30,68 30,96"
                                                fill="#FF8A65"
                                                stroke="#E65100"
                                                strokeWidth="0.8"
                                                className="opacity-95"
                                          />
                                    </svg>
                              </div>
                        </div>
                  </div>

                  {/* Local animations: dash movement, gentle bob */}
                  <style>{`
        /* moving dashed stroke (keeps flowing along the path) */
        @keyframes dash {
          to { stroke-dashoffset: -36; }
        }
        .stroke-dash-animate {
          animation: dash 1.6s linear infinite;
        }

        /* gentle bob for the finger icon */
        @keyframes bob {
          0% { transform: translateY(0); }
          50% { transform: translateY(-6px); }
          100% { transform: translateY(0); }
        }
        .animate-bob {
          animation: bob 1.8s ease-in-out infinite;
        }
      `}</style>
            </>
      );
}
