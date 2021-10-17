package io.starkinc.onekiosk;

import android.app.Application;

public class OneKioskApplication extends Application {
  public void onCreate() {
    super.onCreate();
    ThemeHelper.init(this);
  }
}
