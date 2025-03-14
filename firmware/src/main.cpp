#include "net/net.hpp"
#include "signalGeneration/signalGeneration.hpp"
#include "stateManager.hpp"
#include <Arduino.h>
#include <ArduinoBLE.h>

void setup() {
  Serial.begin(921600);
  delay(5000);
  Serial.println("Starting up...");
  signalGeneration::setup();
  net::init();
  Serial.println("Setup complete.");
}

void loop() {
  if (signalGeneration::debugWrittenBit != 0) {
    // Serial.println(signal_generation::debugBitDuration);
    // Serial.print(signal_generation::debugWrittenBit - 1);
    // Serial.print(";");
    // signal_generation::debugWrittenBit = 0;
  }

  net::process();
  state_manager::process();
}