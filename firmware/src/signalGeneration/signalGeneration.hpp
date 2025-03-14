#pragma once

#include <Arduino.h>

namespace signalGeneration {
void setup();

extern uint8_t nextData[6];
extern int nextDataLenght;
extern bool nextDataIsReady;
extern bool nextDataIsUsed;

extern int debugWrittenBit;
extern int debugBitDuration;
}; // namespace signalGeneration
