#pragma once

#include <Arduino.h>

namespace net {
#pragma pack(1)
struct SpeedCommand128 {
  SpeedCommand128()
      : engine(0), speed(0), direction(0) {
  }

  operator uint8_t *() {
    return reinterpret_cast<uint8_t *>(this);
  }

  uint16_t engine;
  uint8_t speed;
  uint8_t direction;
};

#pragma pack(1)
struct FunctionCommand {
  FunctionCommand()
      : engine(0), function(0), state(0) {
  }

  operator uint8_t *() {
    return reinterpret_cast<uint8_t *>(this);
  }

  uint16_t engine;
  uint8_t function;
  uint8_t state;
};

#pragma pack(1)
struct Session {
  Session() {
    id[0] = UINT32_MAX;
    id[1] = UINT32_MAX;
    id[2] = UINT32_MAX;
    id[3] = UINT32_MAX;
  }
    operator uint8_t *() {
    return reinterpret_cast<uint8_t *>(this);
  }
  uint32_t id[4];
};

} // namespace net
