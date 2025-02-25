#pragma once

#include <Arduino.h>
#include <signal_generation/signal_generation.hpp>

namespace state_manager {
  void process();
  void setFunction(uint16_t address, uint8_t number, bool on);
  void setSpeed(uint16_t address, uint8_t speed, bool forwards);
}