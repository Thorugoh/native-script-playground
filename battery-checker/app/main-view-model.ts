import { Observable, Application , Utils } from '@nativescript/core'

function ctx(): android.content.Context {
  return Utils.android.getApplicationContext();
}

function batteryLevel(): number {
  const bm = ctx().getSystemService(android.content.Context.BATTERY_SERVICE) as android.os.BatteryManager;
  return bm.getIntProperty(android.os.BatteryManager.BATTERY_PROPERTY_CAPACITY);
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

  return vm;
}