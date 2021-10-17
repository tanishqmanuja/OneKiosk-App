package io.starkinc.onekiosk

import android.content.SharedPreferences
import android.graphics.Color.parseColor
import com.getcapacitor.JSObject
import com.getcapacitor.Plugin
import io.starkinc.onekiosk.ThemeHelper.isDarkModeEnabled
import io.starkinc.onekiosk.ThemeHelper.enableDarkMode
import io.starkinc.onekiosk.ThemeHelper.enableLightMode
import io.starkinc.onekiosk.ThemeHelper.enableDefaultMode
import com.getcapacitor.annotation.CapacitorPlugin
import com.getcapacitor.PluginMethod
import com.getcapacitor.PluginCall
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.toArgb
import com.google.gson.Gson
import com.kyant.monet.MonetColors
import com.kyant.monet.monetColorsOf

@CapacitorPlugin(name = "Theme")
class ThemePlugin : Plugin() {
  @PluginMethod
  fun isDarkModeEnabled(call: PluginCall) {
    val isDarkMode = isDarkModeEnabled(this.activity.applicationContext)
    val ret = JSObject()
    ret.put("value", isDarkMode)
    call.resolve(ret)
  }

  @PluginMethod
  fun enableDarkMode(call: PluginCall) {
    enableDarkMode(this.activity.applicationContext)
    call.resolve()
  }

  @PluginMethod
  fun enableLightMode(call: PluginCall) {
    enableLightMode(this.activity.applicationContext)
    call.resolve()
  }

  @PluginMethod
  fun enableDefaultMode(call: PluginCall) {
    enableDefaultMode(this.activity.applicationContext)
    call.resolve()
  }

  @PluginMethod
  fun setBackgroundColors(call: PluginCall) {
    val clrLight = call.getString("light")
    val clrDark = call.getString("dark")

    val themePrefs: SharedPreferences =
      this.activity.applicationContext.getSharedPreferences("ThemePrefs", 0)
    val themePrefsEditor: SharedPreferences.Editor = themePrefs.edit()

    themePrefsEditor.putString("bgLight", clrLight)
    themePrefsEditor.putString("bgDark", clrDark)

    themePrefsEditor.apply()
    call.resolve()
  }

  @PluginMethod
  fun getMonetColors(call: PluginCall) {
    val clr = parseColor(call.getString("color"))
    val monetColors: MonetColors = monetColorsOf(Color(clr), false)
    val jsonString = Gson().toJson(monetColorsToHex(monetColors))
    val ret = JSObject(jsonString)
    call.resolve(ret)
  }

  private data class CustomMonetColors(
    var accent1: List<String>,
    var accent2: List<String>,
    var accent3: List<String>,
    var neutral1: List<String>,
    var neutral2: List<String>
  )

  private fun monetColorsToHex(colors: MonetColors): Any {
    val (a1, a2, a3, n1, n2) = colors
    val clrs = arrayOf(a1, a2, a3, n1, n2).map { list  -> list.map { colorToHex(it) } }
    return CustomMonetColors(clrs[0], clrs[1], clrs[2], clrs[3], clrs[4])
  }

  private fun colorToHex(x: Color): String {
    val intColor = x.toArgb()
    return java.lang.String.format("#%06X", 0xFFFFFF and intColor)
  }
}
