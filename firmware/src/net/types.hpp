#pragma once

#include <Arduino.h>

namespace net {
    #pragma pack(1)
    struct SpeedCommand128{
        uint16_t engine;
        uint8_t speed;
        uint8_t direction;
    };

    #pragma pack(1)
    struct FunctionCommand{
        uint16_t engine;
        uint8_t function;
        uint8_t state;
    };
}
