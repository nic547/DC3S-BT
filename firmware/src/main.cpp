#include <Arduino.h>
#include "signal_generation/signal_generation.hpp"

void setup() {
  Serial.begin(921600);
  delay(5000);
  Serial.println("Starting up...");
  signal_generation::setup();
  Serial.println("Setup complete.");
}

void loop() {
  if (signal_generation::debugWrittenBit != 0) {
    Serial.println(signal_generation::debugBitDuration);
    Serial.print(signal_generation::debugWrittenBit - 1);
    Serial.print(";");
    signal_generation::debugWrittenBit = 0;
  }
  
}