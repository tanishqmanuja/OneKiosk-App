@file:JvmName("ThemeHelper")

package io.starkinc.onekiosk

import android.content.Context
import android.content.SharedPreferences
import android.os.Build
import androidx.appcompat.app.AppCompatDelegate
import android.app.Activity
import android.content.res.Configuration
import android.content.res.Configuration.UI_MODE_NIGHT_YES
import androidx.annotation.NonNull
import android.graphics.Color

object ThemeHelper {

  private const val LIGHT_MODE = "light"
  private const val DARK_MODE = "dark"
  private const val DEFAULT_MODE = "default"

  @JvmStatic
  fun init(context: Context) {
    val themePrefs: SharedPreferences = context.getSharedPreferences("ThemePrefs", 0)
    val themeMode: String? = themePrefs.getString("mode", DEFAULT_MODE)
    applyTheme(themeMode)
  }

  @JvmStatic
  fun applyTheme(@NonNull themePref: String?) {
    when (themePref) {
      LIGHT_MODE -> {
        AppCompatDelegate.setDefaultNightMode(AppCompatDelegate.MODE_NIGHT_NO)
      }
      DARK_MODE -> {
        AppCompatDelegate.setDefaultNightMode(AppCompatDelegate.MODE_NIGHT_YES)
      }
      else -> {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
          AppCompatDelegate.setDefaultNightMode(AppCompatDelegate.MODE_NIGHT_FOLLOW_SYSTEM)
        } else {
          AppCompatDelegate.setDefaultNightMode(AppCompatDelegate.MODE_NIGHT_AUTO_BATTERY)
        }
      }
    }
  }

  @JvmStatic
  fun applyBgToActivity(activity: Activity) {
    val themePrefs: SharedPreferences =
      activity.applicationContext.getSharedPreferences("ThemePrefs", 0)

    val bgLight: String? = themePrefs.getString("bgLight", "#FFFFFF")
    val bgDark: String? = themePrefs.getString("bgDark", "#1B1B1F")

//    val bgLight = "#ff0000"
//    val bgDark = "#00ff00"

    if (isDarkModeEnabled(activity.applicationContext)) {
      activity.window.decorView.setBackgroundColor(Color.parseColor(bgDark))
    } else {
      activity.window.decorView.setBackgroundColor(Color.parseColor(bgLight))
    }
  }


  @JvmStatic
  fun isDarkModeEnabled(context: Context): Boolean {
    return context.resources.configuration.uiMode and
      Configuration.UI_MODE_NIGHT_MASK == UI_MODE_NIGHT_YES
  }

  @JvmStatic
  fun enableDarkMode(context: Context) {
    val themePrefs: SharedPreferences = context.getSharedPreferences("ThemePrefs", 0)
    val themePrefsEditor: SharedPreferences.Editor = themePrefs.edit()
    AppCompatDelegate.setDefaultNightMode(AppCompatDelegate.MODE_NIGHT_YES)
    themePrefsEditor.putString("mode", DARK_MODE)
    themePrefsEditor.apply()
  }

  @JvmStatic
  fun enableLightMode(context: Context) {
    val themePrefs: SharedPreferences = context.getSharedPreferences("ThemePrefs", 0)
    val themePrefsEditor: SharedPreferences.Editor = themePrefs.edit()
    AppCompatDelegate.setDefaultNightMode(AppCompatDelegate.MODE_NIGHT_NO)
    themePrefsEditor.putString("mode", LIGHT_MODE)
    themePrefsEditor.apply()
  }

  @JvmStatic
  fun enableDefaultMode(context: Context) {
    val themePrefs: SharedPreferences = context.getSharedPreferences("ThemePrefs", 0)
    val themePrefsEditor: SharedPreferences.Editor = themePrefs.edit()

    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
      AppCompatDelegate.setDefaultNightMode(AppCompatDelegate.MODE_NIGHT_FOLLOW_SYSTEM)
    } else {
      AppCompatDelegate.setDefaultNightMode(AppCompatDelegate.MODE_NIGHT_AUTO_BATTERY)
    }

    themePrefsEditor.putString("mode", LIGHT_MODE)
    themePrefsEditor.apply()
  }

}
