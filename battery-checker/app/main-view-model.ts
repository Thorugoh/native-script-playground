import { Observable, Application , Utils } from '@nativescript/core'

function ctx(): android.content.Context {
  return Utils.android.getApplicationContext();
}

function batteryLevel(): number {
  const bm = ctx().getSystemService(android.content.Context.BATTERY_SERVICE) as android.os.BatteryManager;
  return bm.getIntProperty(android.os.BatteryManager.BATTERY_PROPERTY_CAPACITY);
}

function vibrate(ms: number): void {
  const v = ctx().getSystemService(android.content.Context.VIBRATOR_SERVICE) as android.os.Vibrator;
  if (android.os.Build.VERSION.SDK_INT >= 26) {
    v.vibrate(
      android.os.VibrationEffect.createOneShot(
        ms,
        android.os.VibrationEffect.DEFAULT_AMPLITUDE
      )
    );
  } else {
    v.vibrate(ms); // fallback API < 26
  }
}

function toast(msg: string): void {
  android.widget.Toast
    .makeText(ctx(), msg, android.widget.Toast.LENGTH_SHORT)
    .show();
}

export function createViewModel(): Observable {
  const vm = new Observable();

  vm.set("battery", batteryLevel());
  vm.set("log", "Ready press a button");

  vm.set('onUpdateBattery', () => {
    const level = batteryLevel();
    vm.set("battery", level);
    vm.set("log", `Battery read via BatteryManager: ${level}`)
  });

  vm.set("onVibrate", () => {
    vibrate(400)
    vm.set('log', 'vibrate via android.os.VibrationEffect.');
  });

  vm.set('onToast', () => {
    toast('Hi L&L 👋');
    vm.set('log', 'Toast triggered via android.widget.Toast.');
  });

  return vm;
}