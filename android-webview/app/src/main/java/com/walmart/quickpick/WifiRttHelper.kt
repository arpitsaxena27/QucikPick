package com.walmart.quickpick

import android.content.Context
import android.net.wifi.rtt.RangingRequest
import android.net.wifi.rtt.RangingResult
import android.net.wifi.rtt.RangingResultCallback
import android.net.wifi.rtt.WifiRttManager
import android.net.wifi.ScanResult
import android.os.Handler
import android.os.Looper
import kotlin.math.*

/**
 * Data class representing a WiFi access point (anchor) with its physical location
 * @property bssid The MAC address of the access point
 * @property x X-coordinate of the access point in meters
 * @property y Y-coordinate of the access point in meters
 */
data class Anchor(val bssid: String, val x: Double, val y: Double)

/**
 * Data class representing a distance measurement from an anchor point
 * @property anchor The access point that was measured
 * @property distanceMeters The measured distance in meters
 * @property stdDevMeters Standard deviation of the measurement in meters
 */
data class Measurement(val anchor: Anchor, val distanceMeters: Double, val stdDevMeters: Double)

/**
 * Helper class to manage WiFi RTT ranging operations
 * This class handles distance measurements to WiFi access points and position calculations
 * @property ctx Android Context needed for system services
 * @property anchors List of known access points with their positions
 */
class WifiRttHelper(private val ctx: Context, private val anchors: List<Anchor>) {
    // Get the RTT manager system service for distance measurements
    private val rttManager = ctx.getSystemService(Context.WIFI_RTT_RANGING_SERVICE) as WifiRttManager
    // Handler to ensure callbacks run on the main thread
    private val mainExecutor = Handler(Looper.getMainLooper())

    /**
     * Start ranging operation to measure distances to WiFi access points
     * @param scanResults List of scanned WiFi access points
     * @param onResult Callback function called with successful measurements
     * @param onError Callback function called when an error occurs
     */
    fun startRanging(
        scanResults: List<ScanResult>, 
        onResult: (List<Measurement>)->Unit, 
        onError: (String)->Unit
    ) {
        // Filter for access points that support 802.11mc (WiFi RTT)
        val responders = scanResults.filter { it.is80211mcResponder }
        if (responders.isEmpty()) {
            onError("No RTT-capable APs found.")
            return
        }

        // Build ranging request with all available responders
        val builder = RangingRequest.Builder()
        responders.forEach { builder.addResponder(it) }
        val req = builder.build()

        // Start the ranging operation
        rttManager.startRanging(req, mainExecutor::post, object: RangingResultCallback() {
            override fun onRangingResults(results: List<RangingResult>) {
                val measurements = mutableListOf<Measurement>()
                
                // Process each ranging result
                for (res in results) {
                    if (res.status == RangingResult.STATUS_SUCCESS) {
                        // Convert measurements from millimeters to meters
                        val distanceM = res.distanceMm / 1000.0
                        val stdDev = res.distanceStdDevMm / 1000.0
                        
                        // Find matching anchor point by MAC address
                        val anchor = anchors.find { 
                            it.bssid.equals(res.macAddress.toString(), ignoreCase = true) 
                        }
                        
                        if (anchor != null) {
                            measurements.add(Measurement(anchor, distanceM, stdDev))
                        }
                    }
                }

                // Need at least 3 measurements for trilateration
                if (measurements.size < 3) {
                    onError("Need at least 3 valid AP ranges to trilaterate. Got: ${measurements.size}")
                    return
                }
                onResult(measurements)
            }

            override fun onRangingFailure(code: Int) {
                onError("Ranging failure: $code")
            }
        })
    }

    /**
     * Calculate device position using multilateration
     * Uses linearized least squares method to solve the system of equations
     * @param measurements List of distance measurements to known anchor points
     * @return Pair of (x,y) coordinates in meters, or null if calculation fails
     */
    fun estimatePosition(measurements: List<Measurement>): Pair<Double, Double>? {
        // Use first anchor as reference point to linearize equations
        val ref = measurements[0]
        val x1 = ref.anchor.x
        val y1 = ref.anchor.y
        val d1 = ref.distanceMeters

        // Set up linear system A * [x,y]^T = b
        val rows = measurements.size - 1
        val A = Array(rows) { DoubleArray(2) }
        val b = DoubleArray(rows)

        // Build system of equations
        for (i in 1 until measurements.size) {
            val m = measurements[i]
            val xi = m.anchor.x
            val yi = m.anchor.y
            val di = m.distanceMeters

            // Coefficients for linearized equations
            A[i-1][0] = 2.0 * (xi - x1)
            A[i-1][1] = 2.0 * (yi - y1)
            b[i-1] = (xi*xi + yi*yi - di*di) - (x1*x1 + y1*y1 - d1*d1)
        }

        // Solve using normal equations: (A^T A) x = A^T b
        val AtA = Array(2) { DoubleArray(2) }
        val Atb = DoubleArray(2)
        
        // Calculate A^T A and A^T b
        for (i in 0 until rows) {
            AtA[0][0] += A[i][0] * A[i][0]
            AtA[0][1] += A[i][0] * A[i][1]
            AtA[1][0] += A[i][1] * A[i][0]
            AtA[1][1] += A[i][1] * A[i][1]

            Atb[0] += A[i][0] * b[i]
            Atb[1] += A[i][1] * b[i]
        }

        // Invert 2x2 matrix
        val det = AtA[0][0]*AtA[1][1] - AtA[0][1]*AtA[1][0]
        if (abs(det) < 1e-9) return null  // Matrix is singular
        
        val inv00 =  AtA[1][1] / det
        val inv01 = -AtA[0][1] / det
        val inv10 = -AtA[1][0] / det
        val inv11 =  AtA[0][0] / det

        // Calculate final position
        val x = inv00*Atb[0] + inv01*Atb[1]
        val y = inv10*Atb[0] + inv11*Atb[1]
        return Pair(x, y)
    }
}