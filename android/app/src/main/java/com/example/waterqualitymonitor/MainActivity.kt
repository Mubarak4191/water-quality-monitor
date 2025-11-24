package com.example.waterqualitymonitor

import android.Manifest
import android.annotation.SuppressLint
import android.bluetooth.BluetoothAdapter
import android.bluetooth.BluetoothManager
import android.bluetooth.le.ScanCallback
import android.bluetooth.le.ScanResult
import android.content.Intent
import android.content.pm.PackageManager
import android.os.Build
import android.os.Bundle
import android.webkit.JavascriptInterface
import android.webkit.WebView
import android.webkit.WebViewClient
import android.widget.Toast
import androidx.activity.result.contract.ActivityResultContracts
import androidx.appcompat.app.AppCompatActivity
import androidx.core.app.ActivityCompat
import com.example.waterqualitymonitor.databinding.ActivityMainBinding

class MainActivity : AppCompatActivity() {

    private lateinit var binding: ActivityMainBinding
    private val bluetoothAdapter: BluetoothAdapter by lazy {
        val bluetoothManager = getSystemService(BLUETOOTH_SERVICE) as BluetoothManager
        bluetoothManager.adapter
    }
    private val isBluetoothEnabled: Boolean
        get() = bluetoothAdapter.isEnabled

    // --- Permission Handling ---
    private val permissions = if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.S) {
        arrayOf(
            Manifest.permission.BLUETOOTH_SCAN,
            Manifest.permission.BLUETOOTH_CONNECT
        )
    } else {
        arrayOf(
            Manifest.permission.BLUETOOTH,
            Manifest.permission.BLUETOOTH_ADMIN,
            Manifest.permission.ACCESS_FINE_LOCATION
        )
    }

    private val requestPermissionLauncher =
        registerForActivityResult(ActivityResultContracts.RequestMultiplePermissions()) { permissions ->
            val granted = permissions.entries.all { it.value }
            if (granted) {
                startBleScan()
            } else {
                Toast.makeText(this, "Bluetooth permissions are required for device scanning.", Toast.LENGTH_LONG).show()
            }
        }

    private val enableBluetoothLauncher =
        registerForActivityResult(ActivityResultContracts.StartActivityForResult()) { result ->
            if (result.resultCode == RESULT_OK) {
                checkPermissionsAndScan()
            } else {
                Toast.makeText(this, "Bluetooth must be enabled to scan for devices.", Toast.LENGTH_LONG).show()
            }
        }

    @SuppressLint("SetJavaScriptEnabled")
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityMainBinding.inflate(layoutInflater)
        setContentView(binding.root)

        binding.webView.apply {
            settings.javaScriptEnabled = true
            webViewClient = WebViewClient()
            // The URL should point to your Next.js dev server, or the deployed URL.
            // For local dev, ensure your Android device/emulator can access this address.
            loadUrl("http://10.0.2.2:9002/settings")
            addJavascriptInterface(WebAppInterface(this@MainActivity), "Android")
        }
    }

    private fun checkPermissionsAndScan() {
        val allPermissionsGranted = permissions.all {
            ActivityCompat.checkSelfPermission(this, it) == PackageManager.PERMISSION_GRANTED
        }
        if (allPermissionsGranted) {
            startBleScan()
        } else {
            requestPermissionLauncher.launch(permissions)
        }
    }

    @SuppressLint("MissingPermission")
    private fun startBleScan() {
         if (!isBluetoothEnabled) {
            val enableBtIntent = Intent(BluetoothAdapter.ACTION_REQUEST_ENABLE)
            enableBluetoothLauncher.launch(enableBtIntent)
            return
        }
        Toast.makeText(this, "Scanning for BLE devices...", Toast.LENGTH_SHORT).show()
        bluetoothAdapter.bluetoothLeScanner.startScan(bleScanCallback)
    }

    private val bleScanCallback = object : ScanCallback() {
        @SuppressLint("MissingPermission")
        override fun onScanResult(callbackType: Int, result: ScanResult?) {
            super.onScanResult(callbackType, result)
            result?.device?.let { device ->
                val deviceName = device.name ?: "Unnamed Device"
                val deviceAddress = device.address
                // Pass the found device back to the WebView
                 binding.webView.post {
                    binding.webView.evaluateJavascript(
                        "window.addBluetoothDevice('${deviceName}', '${deviceAddress}')",
                        null
                    )
                }
            }
        }

        override fun onScanFailed(errorCode: Int) {
            super.onScanFailed(errorCode)
            Toast.makeText(this@MainActivity, "BLE Scan Failed: $errorCode", Toast.LENGTH_LONG).show()
        }
    }

    // This interface is exposed to JavaScript in the WebView
    inner class WebAppInterface(private val activity: MainActivity) {
        @JavascriptInterface
        fun startScan() {
            activity.checkPermissionsAndScan()
        }
    }
}
