#include <jni.h>
#include <v8.h>
#include <libplatform/libplatform.h>
#include <vector>
#include <iostream>
#include "Metadata.h"

// 1. Global pointer to the Java Virtual Machine
JavaVM* g_jvm = nullptr;

// 2. Automatically called by the OS when Java executes System.loadLibrary()
JNIEXPORT jint JNICALL JNI_OnLoad(JavaVM* vm, void* reserved) {
    g_jvm = vm;
    return JNI_VERSION_1_6; // Standard JNI version
}

// Helper to get the JNI Environment for the current execution thread
JNIEnv* GetJNIEnv() {
    JNIEnv* env = nullptr;
    g_jvm->GetEnv(reinterpret_cast<void**>(&env), JNI_VERSION_1_6);
    return env;
}

// 3. The callback triggered by V8 when JS calls 'nativeSum'
void MathSumCallback(const v8::FunctionCallbackInfo<v8::Value> &args) {
    v8::Isolate* isolate = args.GetIsolate();
    v8::HandleScope handle_scope(isolate);

    JNIEnv* env = GetJNIEnv();

    jclass mathClass = env->FindClass(JniMetadata::CLASS_SUM.c_str());
    jmethodID targetMethod = env->GetStaticMethodID(
        mathClass, 
        JniMetadata::METHOD_SUM.c_str(), 
        JniMetadata::SIG_SUM.c_str()
    );

    std::vector<jvalue> jniArgs(args.Length());
    for(int i = 0; i < args.Length(); i++) {
        if(args[i]->IsNumber()) {
            jniArgs[i].i = args[i]->Int32Value(isolate->GetCurrentContext()).FromMaybe(0);
        }
    }

    jint result = env->CallStaticIntMethodA(mathClass, targetMethod, jniArgs.data());
    args.GetReturnValue().Set(v8::Integer::New(isolate, result));
}

// 4. Exposed function for Java to boot the engine
extern "C" JNIEXPORT void JNICALL
Java_com_vhugo_NativeBridge_startV8Engine(JNIEnv* env, jobject thiz) {
    
    // Bootstrap V8 Platform
    std::unique_ptr<v8::Platform> platform = v8::platform::NewDefaultPlatform();
    v8::V8::InitializePlatform(platform.get());
    v8::V8::Initialize();

    v8::Isolate::CreateParams create_params;
    create_params.array_buffer_allocator = v8::ArrayBuffer::Allocator::NewDefaultAllocator();
    v8::Isolate* isolate = v8::Isolate::New(create_params);

    {
        v8::Isolate::Scope isolate_scope(isolate);
        v8::HandleScope handle_scope(isolate);

        // Bind 'nativeSum' to the V8 global object
        v8::Local<v8::ObjectTemplate> global = v8::ObjectTemplate::New(isolate);
        global->Set(
            v8::String::NewFromUtf8(isolate, "nativeSum").ToLocalChecked(),
            v8::FunctionTemplate::New(isolate, MathSumCallback)
        );

        v8::Local<v8::Context> context = v8::Context::New(isolate, nullptr, global);
        v8::Context::Scope context_scope(context);

        // This is the JavaScript code we are executing dynamically
        const char* js_code = 
            "const result = nativeSum(100, 250);"
            "result;"; // Return the value so we can print it in C++

        v8::Local<v8::String> source = v8::String::NewFromUtf8(isolate, js_code).ToLocalChecked();
        v8::Local<v8::Script> script = v8::Script::Compile(context, source).ToLocalChecked();
        
        // Execute JS
        v8::Local<v8::Value> result = script->Run(context).ToLocalChecked();

        // Print to console to prove the roundtrip: JS -> C++ -> Java -> C++ -> JS
        v8::String::Utf8Value utf8(isolate, result);
        std::cout << "Success! V8 executed JS and Java JNI returned: " << *utf8 << std::endl;
    }

    // Teardown memory
    isolate->Dispose();
    v8::V8::Dispose();
    v8::V8::DisposePlatform();
    delete create_params.array_buffer_allocator;
}