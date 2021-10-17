package io.starkinc.onekiosk;

import android.graphics.Color;
import android.os.Bundle;

import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {
  @Override
  public void onCreate(Bundle savedInstanceState) {
    super.onCreate(savedInstanceState);
    ThemeHelper.applyBgToActivity(this);
    registerPlugin(ThemePlugin.class);
  }
}
