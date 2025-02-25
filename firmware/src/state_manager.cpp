#include "state_manager.hpp"
#include "signal_generation/signal_generation.hpp"

namespace state_manager {

uint8_t extractF0_4(uint8_t f0_4);

struct locomotive {
  uint16_t address : 14;
  uint8_t speed : 5;
  uint8_t targetSpeed : 5;
  uint8_t direction : 1;
  uint8_t targetDirection : 1;
  uint8_t function0_4 : 5;
  uint8_t targetFunction0_4 : 5;
  uint8_t function5_8 : 4;
  uint8_t targetFunction5_8 : 4;
  uint8_t function9_12 : 4;
  uint8_t targetFunction9_12 : 4;
  uint8_t function13_20 : 8;
  uint8_t targetFunction13_20 : 8;
  uint8_t function21_28 : 8;
  uint8_t targetFunction21_28 : 8;

  long lastUpdate;
  int reminderCycle;
};

locomotive locos;

void process() {

  noInterrupts();
  if (signal_generation::nextDataIsReady || signal_generation::nextDataIsUsed) {
    interrupts();
    return;
  }
  interrupts();

  if (locos.targetSpeed != locos.speed || locos.targetDirection != locos.direction) {
    signal_generation::nextData[0] = locos.address;
    signal_generation::nextData[1] = 0b0011'1111;
    signal_generation::nextData[2] = locos.targetSpeed | (locos.targetDirection << 7);
    signal_generation::nextDataLenght = 3;
    signal_generation::nextDataIsReady = true;

    locos.speed = locos.targetSpeed;
    locos.direction = locos.targetDirection;
    return;
  }

  if (locos.targetFunction0_4 != locos.function0_4) {
    signal_generation::nextData[0] = locos.address;
    signal_generation::nextData[1] = 0b1000'0000 | extractF0_4(locos.targetFunction0_4);
    signal_generation::nextDataLenght = 2;
    signal_generation::nextDataIsReady = true;

    locos.function0_4 = locos.targetFunction0_4;
    return;
  }

  if (locos.targetFunction5_8 != locos.function5_8) {
    signal_generation::nextData[0] = locos.address;
    signal_generation::nextData[1] = 0b1011'0000 | locos.targetFunction5_8;
    signal_generation::nextDataLenght = 2;
    signal_generation::nextDataIsReady = true;

    locos.function5_8 = locos.targetFunction5_8;
    return;
  }

  if (locos.targetFunction9_12 != locos.function9_12) {
    signal_generation::nextData[0] = locos.address;
    signal_generation::nextData[1] = 0b1010'0000 | locos.targetFunction9_12;
    signal_generation::nextDataLenght = 2;
    signal_generation::nextDataIsReady = true;

    locos.function9_12 = locos.targetFunction9_12;
    return;
  }

  if (locos.targetFunction13_20 != locos.function13_20) {
    signal_generation::nextData[0] = locos.address;
    signal_generation::nextData[1] = 0b1101'1110;
    signal_generation::nextData[2] = locos.targetFunction13_20;
    signal_generation::nextDataLenght = 3;
    signal_generation::nextDataIsReady = true;

    locos.function13_20 = locos.targetFunction13_20;
    return;
  }

  if (locos.targetFunction21_28 != locos.function21_28) {
    signal_generation::nextData[0] = locos.address;
    signal_generation::nextData[1] = 0b1101'1111;
    signal_generation::nextData[2] = locos.targetFunction21_28;
    signal_generation::nextDataLenght = 3;
    signal_generation::nextDataIsReady = true;

    locos.function21_28 = locos.targetFunction21_28;
    return;
  }
}

void setFunction(uint16_t address, uint8_t number, bool on) {
  locos.address = address;

  if (number <= 4) {
    if (on) {
      locos.targetFunction0_4 |= 1 << number;
    } else {
      locos.targetFunction0_4 &= ~(1 << number);
    }
    return;
  }

  if (number <= 8) {
    if (on) {
      locos.targetFunction5_8 |= 1 << (number - 5);
    } else {
      locos.targetFunction5_8 &= ~(1 << (number - 5));
    }
    return;
  }

  if (number <= 12) {
    if (on) {
      locos.targetFunction9_12 |= 1 << (number - 9);
    } else {
      locos.targetFunction9_12 &= ~(1 << (number - 9));
    }
    return;
  }

  if (number <= 20) {
    if (on) {
      locos.targetFunction13_20 |= 1 << (number - 13);
    } else {
      locos.targetFunction13_20 &= ~(1 << (number - 13));
    }
    return;
  }

  if (number <= 28) {
    if (on) {
      locos.targetFunction21_28 |= 1 << (number - 21);
    } else {
      locos.targetFunction21_28 &= ~(1 << (number - 21));
    }
    return;
  }
}

void setSpeed(uint16_t address, uint8_t speed, bool forwards) {

    if (speed > 0) {
        speed++; //1 would be emergency stop, not an actual speed.
    }
  locos.address = address;
  locos.targetSpeed = speed;
  locos.targetDirection = forwards;
}

uint8_t extractF0_4(uint8_t f0_4) {
  uint8_t f0 = (f0_4 & 0b00000001) << 4;
  uint8_t f1_4 = f0_4 >> 1;
  return (f0 | f1_4);
}
}