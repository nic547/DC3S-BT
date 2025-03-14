#include "signalGeneration.hpp"
#include "../hardwareInterface/hardwareInterface.hpp"
#include <Arduino.h>

namespace signalGeneration {
int currentBit = 1;
int bitCount = 0;
int isFullZero = false;
int state = 0;
bool isFirstHalf = true;
bool hasSentSeperator = false;

int debugWrittenBit = 0;
int debugPreviousBitTimestamp = 0;
int debugBitDuration = 0;

int dataBytes = 2;
// uint8_t data[6] = {0xD2, 0x2B, 0b10010000, 0x00, 0x00, 0x00};
uint8_t data[6] = {0b0010'1110, 0b1001'0000, 0x00, 0x00, 0x00, 0x00};

int nextDataLenght = 0;
uint8_t nextData[6] = {0x00, 0x00, 0x00, 0x00, 0x00, 0x00};
bool nextDataIsReady = false;
bool nextDataIsUsed = false;

uint8_t checksum = data[0] ^ data[1];

void dcc_signal_callback();
void turn_on();
void turn_off();
void getNextPacket();

void setup() {
  hardwareInterface::setUpHardware(dcc_signal_callback);
}

void dcc_signal_callback() {
  if (!currentBit && !isFullZero) {
    isFullZero = true;
    return;
  }
  isFullZero = false;

  if (isFirstHalf) {
    isFirstHalf = false;
    turn_off();
    return;
  }

  switch (state) {
  case 0: // Preamble
    if (bitCount < 14) {
      turn_on();
      return;
    }

    bitCount = 0;
    state = 1;
  // fall through to transmitting data
  case 1:
    if (bitCount % 8 == 0 && !hasSentSeperator) {
      currentBit = 0;
      turn_on();
      bitCount--;
      hasSentSeperator = true;
      return;
    }
    hasSentSeperator = false;

    if (bitCount < 8 * dataBytes) {
      currentBit = (data[bitCount / 8] >> (7 - (bitCount % 8))) & 1;
      turn_on();
      return;
    }
    bitCount = 0;
    state = 2;
  // fall trough to checksum
  case 2:
    if (bitCount < 8) {
      currentBit = (checksum >> (7 - bitCount)) & 1;
      turn_on();
      return;
    }
    bitCount = 0;
    state = 0;
    currentBit = 1;
    turn_on();
    getNextPacket();
  }
}

void turn_on() {
  bitCount++;
  isFirstHalf = true;
  hardwareInterface::direction_b_on();

  debugWrittenBit = currentBit + 1;
  auto now = micros();
  debugBitDuration = now - debugPreviousBitTimestamp;
  debugPreviousBitTimestamp = now;
}

void turn_off() {
  hardwareInterface::direction_b_off();
  isFirstHalf = false;
}

void getNextPacket() {
  // TODO: If I start using multi-core MCUs I might need something bigger here
  noInterrupts();
  if (!nextDataIsUsed && nextDataIsReady) {
    nextDataIsUsed = true;
    memcpy(data, nextData, 6);
    dataBytes = nextDataLenght;
    checksum = data[0];
    for (int i = 1; i < dataBytes; i++) {
      checksum ^= data[i];
    }
    nextDataIsReady = false;
    nextDataIsUsed = false;
  } else {
    data[0] = 0b1111'1111;
    data[1] = 0b0000'0000;
    checksum = 0b1111'1111;
    dataBytes = 2;
  }

  interrupts();
}
}; // namespace signal_generation