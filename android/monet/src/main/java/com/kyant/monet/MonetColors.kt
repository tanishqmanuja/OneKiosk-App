package com.kyant.monet

import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.toArgb
import com.kyant.monet.nativemonet.ColorScheme

data class MonetColors(
  val accent1: List<Color>,
  val accent2: List<Color>,
  val accent3: List<Color>,
  val neutral1: List<Color>,
  val neutral2: List<Color>
)

fun monetColorsOf(color: Color, darkTheme: Boolean = false): MonetColors {
    val scheme = ColorScheme(color.toArgb(), darkTheme)
    return MonetColors(
        scheme.accent1.map { Color(it) },
        scheme.accent2.map { Color(it) },
        scheme.accent3.map { Color(it) },
        scheme.neutral1.map { Color(it) },
        scheme.neutral2.map { Color(it) }
    )
}
