# NativeScript Runtime Architecture POC

This repository contains a Proof of Concept (POC) demonstrating the core architectural principles of the NativeScript Runtime. It showcases how a JavaScript engine (V8) can synchronously communicate with a Java Virtual Machine (JVM) via the Java Native Interface (JNI) in a single memory space, avoiding the asynchronous serialization overhead (JSON bridging) found in older cross-platform frameworks.

## Architecture Overview

The POC simulates the exact pipeline used to bind native Android APIs to JavaScript dynamically:

1.  **Metadata Generator (ASM):** At build time, we inspect the target `.class` files using the ASM library to extract method names and JNI signatures (e.g., `(II)I`). This guarantees accurate dynamic method dispatching without hardcoding bindings.
2.  **C++ Runtime Layer:** A native shared library (`.dylib` / `.so`) that embeds the Google V8 Engine and acts as the mediator.
3.  **Dynamic Dispatch (JNI):** When JavaScript invokes a method, the C++ runtime intercepts it, inspects the arguments, marshals them dynamically into JNI arrays (`jvalue`), and triggers the Java execution synchronously.

## How the Layers Communicate

1.  **Bootstrapping:** The Java application starts and loads the C++ library (`System.loadLibrary`). Java then triggers an exported native function to boot the V8 engine.
2.  **Object Binding:** During V8 initialization, the C++ code creates V8 `ObjectTemplates` and injects proxies representing Java classes (like `MathUtils`) into the JavaScript global scope.
3.  **Execution & Marshalling:** * JS executes: `const m = new MathUtils(); m.sum(150, 450);`
    * V8 halts and triggers the C++ callback tied to the `sum` proxy.
    * C++ reads the incoming JS arguments, identifies them as numbers, and marshals them into a `jvalue` array.
    * C++ uses JNI's `CallStaticIntMethodA` to synchronously hit the real Java method.
    * Java calculates the result and returns it back up the stack through C++ to the JavaScript runtime.

## How to Run

### Prerequisites
* Java Development Kit (JDK 25 recommended for this specific build).
* CMake (version 3.22+).
* Google V8 Engine (pre-compiled). On Apple Silicon, install via Homebrew: `brew install v8`.
* Maven.

### Step 1: Compile the C++ Runtime
Navigate to the `cpp-runtime` directory and build the shared library.

```
cd cpp-runtime/build
cmake ..
cmake --build .
```

*This will generate the `libruntime_poc.dylib` (or `.so` on Linux).*

### Step 2: Build the Java Module
Compile your Java application containing the `MathUtils` logic and the `NativeBridge`.

```
cd ../math-app
mvn clean compile
```

### Step 3: Execute the Application
Run the `NativeBridge` class. You must provide the `java.library.path` pointing to the folder where CMake generated the dynamic library. 

*Note: If using Java 25+, you must also pass the `--enable-native-access` flag to allow JNI usage.*

```
cd target/classes
java --enable-native-access=ALL-UNNAMED -Djava.library.path=../../cpp-runtime/build com.vhugo.NativeBridge
```

**Expected Output:**

```
[C++] Result from JS execution: 600
```