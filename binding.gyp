{
  "targets": [
    {
      "target_name": "epd3in7",
      "sources": [ 
        "src/napi/epd3in7_wrapper.cpp",
        "src/napi/EPD_3in7.c", 
        "src/napi/DEV_Config.c",
        "src/napi/dev_hardware_SPI.c",
        "src/napi/sysfs_gpio.c",
        "src/napi/RPI_gpiod.c",
        "src/napi/sysfs_software_spi.c"
      ],
      "include_dirs": [
        "<!@(node -p \"require('node-addon-api').include\")",
        "src",
        "src/napi"
      ],
      "dependencies": [
        "<!(node -p \"require('node-addon-api').gyp\")"
      ],
      "cflags!": [ "-fno-exceptions" ],
      "cflags_cc!": [ "-fno-exceptions" ],
      "cflags": ["-std=c11"],
      "cflags_cc": ["-std=c++14"],
      "msvs_settings": {
        "VCCLCompilerTool": { "ExceptionHandling": 1 },
      },
      "defines": ["NAPI_DISABLE_CPP_EXCEPTIONS", "RPI"],
      "conditions": [
        ['OS=="linux"', {
          "defines": [
            "USE_LGPIO_LIB"
          ],
          "cflags": ["-std=c11"],
          "cflags_cc": ["-std=c++14"]
        }]
      ],
      "libraries": [
        "-lgpiod"
      ],
      "xcode_settings": {
        "GCC_ENABLE_CPP_EXCEPTIONS": "YES",
        "CLANG_CXX_LIBRARY": "libc++",
        "MACOSX_DEPLOYMENT_TARGET": "10.7"
      },
    }
  ]
}
