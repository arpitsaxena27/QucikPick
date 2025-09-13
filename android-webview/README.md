# QuickPick Android WebView

This Android application wraps the QuickPick web application in a WebView and provides WiFi RTT functionality for indoor positioning.

## Setup

1. Clone the repository
2. Open the project in Android Studio
3. Update the WebView URL in `MainActivity.kt` to point to your web application
4. Configure your WiFi RTT anchor points in `MainActivity.kt`
5. Build and run the application

## Requirements

- Android Studio Arctic Fox or newer
- Android SDK 28 or higher (required for WiFi RTT)
- Device with WiFi RTT support for testing

## Configuration

### WiFi RTT Anchor Points

Update the anchor points in `MainActivity.kt`:

```kotlin
wifiRttHelper = WifiRttHelper(this, listOf(
    Anchor("00:11:22:33:44:55", 10.0, 20.0), // Example
    // Add more anchor points here
))
```

Each anchor point needs:

- BSSID (MAC address) of the WiFi access point
- X coordinate in meters
- Y coordinate in meters

### Web Application URL

Update the URL in `MainActivity.kt`:

```kotlin
webView.loadUrl("http://your-webapp-url.com")
```

## Features

- WebView integration with QuickPick web application
- WiFi RTT support for indoor positioning
- JavaScript bridge for web-native communication
- Position updates in real-time

## Testing

To test WiFi RTT functionality:

1. Ensure your device supports WiFi RTT (Android 9 or higher)
2. Configure WiFi RTT anchor points with actual access point BSSIDs
3. Grant location permissions to the app
4. Use the web interface to request position updates

## Permissions

The app requires the following permissions:

- INTERNET
- ACCESS_WIFI_STATE
- CHANGE_WIFI_STATE
- ACCESS_FINE_LOCATION
- ACCESS_COARSE_LOCATION

These are automatically requested at runtime when needed.
