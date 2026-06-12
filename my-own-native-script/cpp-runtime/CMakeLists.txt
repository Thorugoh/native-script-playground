# /cpp-runtime/CMakeLists.txt
cmake_minimum_required(VERSION 3.22)

project(NativeScriptRuntimePOC)

set(CMAKE_CXX_STANDARD 20)
set(CMAKE_CXX_STANDARD_REQUIRED ON)
set(CMAKE_CXX_EXTENSIONS OFF)

find_package(JNI REQUIRED)

set(V8_INCLUDE_DIR "/opt/homebrew/opt/v8/include")
set(V8_LIB_DIR "/opt/homebrew/opt/v8/lib")

add_library(
    runtime_poc
    SHARED
    runtime.cpp
)

target_compile_definitions(
    runtime_poc 
    PRIVATE 
    V8_COMPRESS_POINTERS
)

target_include_directories(
    runtime_poc 
    PRIVATE 
    ${JNI_INCLUDE_DIRS}
    ${V8_INCLUDE_DIR}
)

target_link_directories(
    runtime_poc
    PRIVATE
    ${V8_LIB_DIR}
)

target_link_libraries(
    runtime_poc
    PRIVATE
    v8
    v8_libplatform
    v8_libbase
)