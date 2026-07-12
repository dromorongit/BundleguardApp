package expo.modules.usagestats

import android.content.Context
import android.content.Intent
import android.provider.Settings
import android.net.NetworkCapabilities
import android.app.usage.NetworkStatsManager
import android.content.pm.PackageManager
import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition
import expo.modules.kotlin.exception.CodedException

class UsageStatsModule : Module() {
  private val context: Context
    get() = appContext.reactContext ?: throw Exception("React context is null")

  private fun checkPermissionOrThrow() {
    if (!hasUsageAccessPermission()) {
      throw CodedException("PERMISSION_DENIED", "Usage access permission not granted. Please enable it in Settings.")
    }
  }

  override fun definition() = ModuleDefinition {
    Name("UsageStats")

    Function("hasUsageAccessPermission") {
      hasUsageAccessPermission()
    }

    Function("openUsageAccessSettings") {
      openUsageAccessSettings()
    }

    AsyncFunction("getTotalMobileDataUsage") { startTime: Long, endTime: Long ->
      getTotalMobileDataUsage(startTime, endTime)
    }

    AsyncFunction("getPerAppMobileDataUsage") { startTime: Long, endTime: Long ->
      getPerAppMobileDataUsage(startTime, endTime)
    }
  }

  private fun hasUsageAccessPermission(): Boolean {
    val appOpsManager = context.getSystemService(Context.APP_OPS_SERVICE) as android.app.AppOpsManager
    val mode = appOpsManager.checkOpNoThrow(
      "android:get_usage_stats",
      android.os.Process.myUid(),
      context.packageName
    )
    return mode == android.app.AppOpsManager.MODE_ALLOWED
  }

  private fun openUsageAccessSettings() {
    val intent = Intent(Settings.ACTION_USAGE_ACCESS_SETTINGS)
    intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
    context.startActivity(intent)
  }

  private fun getTotalMobileDataUsage(startTime: Long, endTime: Long): Long {
    checkPermissionOrThrow()
    val networkStatsManager = context.getSystemService(Context.NETWORK_STATS_SERVICE) as NetworkStatsManager
    return try {
      val bucket = networkStatsManager.querySummaryForDevice(
        NetworkCapabilities.TRANSPORT_CELLULAR,
        null,
        startTime,
        endTime
      )
      (bucket?.rxBytes ?: 0L) + (bucket?.txBytes ?: 0L)
    } catch (e: Exception) {
      0L
    }
  }

  private fun getPerAppMobileDataUsage(startTime: Long, endTime: Long): ArrayList<Map<String, Any>> {
    checkPermissionOrThrow()
    val networkStatsManager = context.getSystemService(Context.NETWORK_STATS_SERVICE) as NetworkStatsManager
    val packageManager = context.packageManager
    val result = ArrayList<Map<String, Any>>()
    
    try {
      val cursor = networkStatsManager.querySummary(
        NetworkCapabilities.TRANSPORT_CELLULAR,
        null,
        startTime,
        endTime
      )
      
      cursor.use {
        val packageNameCol = it.getColumnIndex("package_name")
        val rxBytesCol = it.getColumnIndex("rx_bytes")
        val txBytesCol = it.getColumnIndex("tx_bytes")
        
        while (it.moveToNext()) {
          val packageName = it.getString(packageNameCol)
          val rxBytes = it.getLong(rxBytesCol)
          val txBytes = it.getLong(txBytesCol)
          val totalBytes = rxBytes + txBytes
          
          // Skip if no data used
          if (totalBytes == 0L) continue
          
          // Resolve package name and app label
          val appInfo = try {
            val info = packageManager.getApplicationInfo(packageName, 0)
            val label = packageManager.getApplicationLabel(info).toString()
            packageName to label
          } catch (e: Exception) {
            null to null
          }
          
          if (appInfo.first != null && appInfo.second != null) {
            val map = HashMap<String, Any>()
            map["packageName"] = appInfo.first!!
            map["appLabel"] = appInfo.second!!
            map["bytesUsed"] = totalBytes
            result.add(map)
          }
        }
      }
    } catch (e: Exception) {
      // Empty result on error
    }
    
    return result
  }
}