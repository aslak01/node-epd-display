#include <napi.h>
extern "C" {
  #include "EPD_3in7.h"
  #include "DEV_Config.h"
}

Napi::Value Init(const Napi::CallbackInfo& info) {
    Napi::Env env = info.Env();
    UBYTE result = DEV_Module_Init();
    return Napi::Number::New(env, result);
}

void Exit(const Napi::CallbackInfo& info) {
    DEV_Module_Exit();
}

Napi::Value Init4Gray(const Napi::CallbackInfo& info) {
    EPD_3IN7_4Gray_Init();
    return info.Env().Undefined();
}

Napi::Value Init1Gray(const Napi::CallbackInfo& info) {
    EPD_3IN7_1Gray_Init();
    return info.Env().Undefined();
}

Napi::Value Clear4Gray(const Napi::CallbackInfo& info) {
    EPD_3IN7_4Gray_Clear();
    return info.Env().Undefined();
}

Napi::Value Clear1Gray(const Napi::CallbackInfo& info) {
    EPD_3IN7_1Gray_Clear();
    return info.Env().Undefined();
}

Napi::Value Display4Gray(const Napi::CallbackInfo& info) {
    Napi::Env env = info.Env();
    if (info.Length() < 1 || !info[0].IsTypedArray()) {
        Napi::TypeError::New(env, "Uint8Array expected").ThrowAsJavaScriptException();
        return env.Undefined();
    }

    Napi::Uint8Array imageArray = info[0].As<Napi::Uint8Array>();
    EPD_3IN7_4Gray_Display(imageArray.Data());
    return env.Undefined();
}

Napi::Value Display1Gray(const Napi::CallbackInfo& info) {
    Napi::Env env = info.Env();
    if (info.Length() < 1 || !info[0].IsTypedArray()) {
        Napi::TypeError::New(env, "Uint8Array expected").ThrowAsJavaScriptException();
        return env.Undefined();
    }

    Napi::Uint8Array imageArray = info[0].As<Napi::Uint8Array>();
    EPD_3IN7_1Gray_Display(imageArray.Data());
    return env.Undefined();
}

Napi::Value Sleep(const Napi::CallbackInfo& info) {
    EPD_3IN7_Sleep();
    return info.Env().Undefined();
}

Napi::Object InitAll(Napi::Env env, Napi::Object exports) {
    exports.Set("init", Napi::Function::New(env, Init));
    exports.Set("exit", Napi::Function::New(env, Exit));
    exports.Set("init4Gray", Napi::Function::New(env, Init4Gray));
    exports.Set("init1Gray", Napi::Function::New(env, Init1Gray));
    exports.Set("clear4Gray", Napi::Function::New(env, Clear4Gray));
    exports.Set("clear1Gray", Napi::Function::New(env, Clear1Gray));
    exports.Set("display4Gray", Napi::Function::New(env, Display4Gray));
    exports.Set("display1Gray", Napi::Function::New(env, Display1Gray));
    exports.Set("sleep", Napi::Function::New(env, Sleep));
    return exports;
}

NODE_API_MODULE(epd3in7, InitAll)
