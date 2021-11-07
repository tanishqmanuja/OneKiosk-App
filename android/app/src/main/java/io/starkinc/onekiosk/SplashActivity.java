package io.starkinc.onekiosk;

import android.content.Intent;
import android.graphics.Color;
import android.os.Bundle;

import androidx.annotation.Nullable;
import androidx.appcompat.app.AppCompatActivity;
import androidx.core.splashscreen.SplashScreen;

public class SplashActivity extends AppCompatActivity {
  @Override
  protected void onCreate(@Nullable Bundle savedInstanceState) {
    super.onCreate(savedInstanceState);
//    ThemeHelper.applyBgToActivity(this);
//    Intent intent = new Intent(this, MainActivity.class);
//    startActivity(intent);
//    finish();

    // Handle the splash screen transition.
    SplashScreen splashScreen = SplashScreen.installSplashScreen(this);
    Intent intent = new Intent(this, MainActivity.class);
    startActivity(intent);
    finish();
  }
}
