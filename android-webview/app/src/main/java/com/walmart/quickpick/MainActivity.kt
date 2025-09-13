package com.walmart.quickpick

import android.os.Bundle
import android.webkit.WebView
import android.webkit.WebViewClient
import android.webkit.WebChromeClient
import androidx.appcompat.app.AppCompatActivity

/**
 * Main Activity that hosts the WebView and sets up the WiFi RTT functionality
 * This activity loads your web app and injects the JavaScript interface for WiFi RTT
 */

import android.annotation.SuppressLint
import android.os.Bundle
import android.webkit.JavascriptInterface
import android.webkit.WebView
import android.webkit.WebViewClient
import androidx.appcompat.app.AppCompatActivity
import com.walmart.quickpick.rtt.WifiRttHelper

class MainActivity : AppCompatActivity() {
    private lateinit var webView: WebView
    private lateinit var wifiRttHelper: WifiRttHelper

    @SuppressLint("SetJavaScriptEnabled")
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        
        // Initialize WiFi RTT Helper
        wifiRttHelper = WifiRttHelper(this, listOf(
            // Add your anchor points here
            // Example: Anchor("00:11:22:33:44:55", 10.0, 20.0)
        ))

        // Setup WebView
        webView = WebView(this)
        webView.settings.javaScriptEnabled = true
        webView.webViewClient = WebViewClient()

        // Add JavaScript interface
        webView.addJavascriptInterface(WebAppInterface(), "Android")

        // Load your web app URL
        webView.loadUrl("http://your-webapp-url.com") // Replace with your web app URL

        setContentView(webView)
    }

    inner class WebAppInterface {
        @JavascriptInterface
        fun initializeWifiRTT(): Boolean {
            return try {
                // Any initialization code needed
                true
            } catch (e: Exception) {
                false
            }
        }

        @JavascriptInterface
        fun getWifiRTTPosition(): String {
            return try {
                // Get the current position using WifiRttHelper
                // This is a placeholder - implement actual positioning logic
                "{\"x\": 0.0, \"y\": 0.0}"
            } catch (e: Exception) {
                "{\"error\": \"${e.message}\"}"
            }
        }

        @JavascriptInterface
        fun checkWifiRTTSupport(): Boolean {
            return try {
                // Check if device supports WiFi RTT
                android.os.Build.VERSION.SDK_INT >= android.os.Build.VERSION_CODES.P
            } catch (e: Exception) {
                false
            }
        }
    }
}