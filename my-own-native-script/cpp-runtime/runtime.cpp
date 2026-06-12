#include <jni.h>
#include <v8.h>
#include <libplatform/libplatform.h>
#include <vector>
#include "Metadata.h"

JavaVM* g_jvm = nullptr;

JNIEXPORT jint JNICALL JNI_OnLoad(JavaVM* vm, void*) {
    g_jvm = vm;
    return JNI_VERSION_1_6;
}

void MathSumCallback(const v8::FunctionCallbackInfo<v8::Value>& args) {
    v8::Isolate* isolate = args.GetIsolate();
    
    JNIEnv* env;
    g_jvm->GetEnv(reinterpret_cast<void**>(&env), JNI_VERSION_1_6);

    jclass mathClass = env->FindClass(JniMetadata::CLASS_SUM.c_str());
    jmethodID targetMethod = env->GetStaticMethodID(mathClass, JniMetadata::METHOD_SUM.c_str(), JniMetadata::SIG_SUM.c_str());

    std::vector<jvalue> jniArgs(args.Length());
    for(int i = 0; i < args.Length(); i++) {
        if(args[i]->IsNumber()) {
            jniArgs[i].i = args[i]->Int32Value(isolate->GetCurrentContext()).FromMaybe(0);
        }
    }

    jint result = env->CallStaticIntMethodA(mathClass, targetMethod, jniArgs.data());
    args.GetReturnValue().Set(v8::Integer::New(isolate, result));
}

void MathUtilsConstructor(const v8::FunctionCallbackInfo<v8::Value>& args) {
    if (args.IsConstructCall()) args.GetReturnValue().Set(args.This());
}

extern "C" JNIEXPORT void Java_com_vhugo_NativeBridge_startV8Engine(JNIEnv* env, jobject thiz) {
    std::unique_ptr<v8::Platform> platform = v8::platform::NewDefaultPlatform();
    v8::V8::InitializePlatform(platform.get());
    v8::V8::Initialize();

    v8::Isolate::CreateParams create_params;
    create_params.array_buffer_allocator = v8::ArrayBuffer::Allocator::NewDefaultAllocator();
    v8::Isolate* isolate = v8::Isolate::New(create_params);

    {
        v8::Isolate::Scope isolate_scope(isolate);
        v8::HandleScope handle_scope(isolate);

        v8::Local<v8::ObjectTemplate> global = v8::ObjectTemplate::New(isolate);

        v8::Local<v8::FunctionTemplate> mathClass = v8::FunctionTemplate::New(isolate, MathUtilsConstructor);
        mathClass->SetClassName(v8::String::NewFromUtf8(isolate, "MathUtils").ToLocalChecked());
        mathClass->PrototypeTemplate()->Set(v8::String::NewFromUtf8(isolate, "sum").ToLocalChecked(), v8::FunctionTemplate::New(isolate, MathSumCallback));
        
        global->Set(v8::String::NewFromUtf8(isolate, "MathUtils").ToLocalChecked(), mathClass);

        v8::Local<v8::Context> context = v8::Context::New(isolate, nullptr, global);
        v8::Context::Scope context_scope(context);

        const char* js_code = "const m = new MathUtils(); m.sum(150, 450);";
        v8::Local<v8::Value> result = v8::Script::Compile(context, v8::String::NewFromUtf8(isolate, js_code).ToLocalChecked())
                                        .ToLocalChecked()
                                        ->Run(context)
                                        .ToLocalChecked();

        v8::String::Utf8Value final_res(isolate, result);
        printf("[C++] Result from JS execution: %s\n", *final_res);
    }

    isolate->Dispose();
    v8::V8::Dispose();
    v8::V8::DisposePlatform();
    delete create_params.array_buffer_allocator;
}