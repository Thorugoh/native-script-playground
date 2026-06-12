package com.vhugo;

public class NativeBridge {
    static {
        System.loadLibrary("runtime_poc");
    }

    public native void startV8Engine();

    public static void main(String[] args) {
        System.out.println("Starting...");

        // Instantiate the bridge
        NativeBridge bridge = new NativeBridge();

        // This call crosses the JNI boundary, entering the C++ world to boot V8 and execute JS
        bridge.startV8Engine();

        System.out.println("POC Finished.");
    }
}
