#include "stateManager.hpp"
#include "signalGeneration/signalGeneration.hpp"

namespace state_manager {
struct locomotive {
  uint16_t address : 14;
  uint8_t speed : 7;
  uint8_t targetSpeed : 7;
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

uint8_t extractF0_4(uint8_t f0_4);
locomotive *GetEngineSlot(uint16_t address);
void generateSpeedCommand(locomotive &engine);
void checkForChanges(state_manager::locomotive &loco, bool &retFlag);

void generateFunction21_28Command(state_manager::locomotive &loco);

void generateFunction13_20Command(state_manager::locomotive &loco);

void generateFunction9_12Command(state_manager::locomotive &loco);

void generateFunctions5_8Command(state_manager::locomotive &loco);

void generateFunctions0_4Command(state_manager::locomotive &loco);

locomotive locos[50];
int lastSelectedEngine = 0;

void process() {

  noInterrupts();
  if (signalGeneration::nextDataIsReady || signalGeneration::nextDataIsUsed) {
    interrupts();
    return;
  }
  interrupts();

  for (int i = 0; i < 50; i++) {
    // We don't want to process the whole array from the beginning every time to try and evenly distribute the "bandwidth"
    // We therefore keep track of the last engine processed and start from the next slot
    int j = (i + lastSelectedEngine + 1) % 50;
    auto &loco = locos[j];

    // A slot with address 0 (Broadcast) is considered empty
    if (loco.address == 0) {
      continue;
    }
    bool hasFoundChange;
    checkForChanges(loco, hasFoundChange);
    if (hasFoundChange) {
      return;
    }
  }

  // If we get here there we no changes - instead we send a reminder packet

  for (int i = 0; i < 50; i++) {
    // We don't want to process the whole array from the beginning every time to try and evenly distribute the "bandwidth"
    // We therefore keep track of the last engine processed and start from the next slot
    int j = (i + lastSelectedEngine + 1) % 50;
    auto &loco = locos[j];

    // A slot with address 0 (Broadcast) is considered empty
    if (loco.address == 0) {
      continue;
    }

    switch (loco.reminderCycle) {
    case 0:
      generateSpeedCommand(loco);
      break;
    case 1:
      generateFunctions0_4Command(loco);
      break;
    case 2:
      generateFunctions5_8Command(loco);
      break;
    case 3:
      generateSpeedCommand(loco);
      break;
    case 4:
      generateFunction9_12Command(loco);
      break;
    case 5:
      generateFunction13_20Command(loco);
      break;
    case 6:
      generateSpeedCommand(loco);
      break;
    case 7:
      generateFunction21_28Command(loco);
      loco.reminderCycle = -1;
      break;
    }
    loco.reminderCycle++;
    return;
  }
}

void checkForChanges(state_manager::locomotive &loco, bool &hasFoundChanges) {
  hasFoundChanges = true;
  if (loco.targetSpeed != loco.speed || loco.targetDirection != loco.direction) {
    generateSpeedCommand(loco);
    return;
  }
  if (loco.targetFunction0_4 != loco.function0_4) {
    generateFunctions0_4Command(loco);
    return;
  }

  if (loco.targetFunction5_8 != loco.function5_8) {
    generateFunctions5_8Command(loco);
    return;
  }

  if (loco.targetFunction9_12 != loco.function9_12) {
    generateFunction9_12Command(loco);
    return;
  }

  if (loco.targetFunction13_20 != loco.function13_20) {
    generateFunction13_20Command(loco);
    return;
  }

  if (loco.targetFunction21_28 != loco.function21_28) {
    generateFunction21_28Command(loco);
    return;
  }
  hasFoundChanges = false;
}

void generateFunction21_28Command(state_manager::locomotive &loco) {
  signalGeneration::nextData[0] = loco.address;
  signalGeneration::nextData[1] = 0b1101'1111;
  signalGeneration::nextData[2] = loco.targetFunction21_28;
  signalGeneration::nextDataLenght = 3;
  signalGeneration::nextDataIsReady = true;

  loco.function21_28 = loco.targetFunction21_28;
}

void generateFunction13_20Command(state_manager::locomotive &loco) {
  signalGeneration::nextData[0] = loco.address;
  signalGeneration::nextData[1] = 0b1101'1110;
  signalGeneration::nextData[2] = loco.targetFunction13_20;
  signalGeneration::nextDataLenght = 3;
  signalGeneration::nextDataIsReady = true;

  loco.function13_20 = loco.targetFunction13_20;
}

void generateFunction9_12Command(state_manager::locomotive &loco) {

  signalGeneration::nextData[0] = loco.address;
  signalGeneration::nextData[1] = 0b1010'0000 | loco.targetFunction9_12;
  signalGeneration::nextDataLenght = 2;
  signalGeneration::nextDataIsReady = true;

  loco.function9_12 = loco.targetFunction9_12;
}

void generateFunctions5_8Command(state_manager::locomotive &loco) {
  signalGeneration::nextData[0] = loco.address;
  signalGeneration::nextData[1] = 0b1011'0000 | loco.targetFunction5_8;
  signalGeneration::nextDataLenght = 2;
  signalGeneration::nextDataIsReady = true;

  loco.function5_8 = loco.targetFunction5_8;
}

void generateFunctions0_4Command(state_manager::locomotive &loco) {


  if (loco.address < 128) {
    signalGeneration::nextData[0] = loco.address;
    signalGeneration::nextData[1] = 0b1000'0000 | extractF0_4(loco.targetFunction0_4);
    signalGeneration::nextDataLenght = 2;
    signalGeneration::nextDataIsReady = true;
  } else {
    signalGeneration::nextData[0] = loco.address >> 8 | 0b1100'0000;
    signalGeneration::nextData[1] = loco.address;
    signalGeneration::nextData[2] = 0b1000'0000 | extractF0_4(loco.targetFunction0_4);
    signalGeneration::nextDataLenght = 3;
    signalGeneration::nextDataIsReady = true;
  }

  loco.function0_4 = loco.targetFunction0_4;
}

void setFunction(uint16_t address, uint8_t number, bool on) {
  auto engine = GetEngineSlot(address);
  engine->address = address;

  Serial.println("Setting function " + String(number) + " to " + String(on) + " for address " + String(address));

  if (number <= 4) {
    if (on) {
      engine->targetFunction0_4 |= 1 << number;
    } else {
      engine->targetFunction0_4 &= ~(1 << number);
    }
    return;
  }

  if (number <= 8) {
    if (on) {
      engine->targetFunction5_8 |= 1 << (number - 5);
    } else {
      engine->targetFunction5_8 &= ~(1 << (number - 5));
    }
    return;
  }

  if (number <= 12) {
    if (on) {
      engine->targetFunction9_12 |= 1 << (number - 9);
    } else {
      engine->targetFunction9_12 &= ~(1 << (number - 9));
    }
    return;
  }

  if (number <= 20) {
    if (on) {
      engine->targetFunction13_20 |= 1 << (number - 13);
    } else {
      engine->targetFunction13_20 &= ~(1 << (number - 13));
    }
    return;
  }

  if (number <= 28) {
    if (on) {
      engine->targetFunction21_28 |= 1 << (number - 21);
    } else {
      engine->targetFunction21_28 &= ~(1 << (number - 21));
    }
    return;
  }
}

void setSpeed(uint16_t address, uint8_t speed, bool forwards) {

  auto engine = GetEngineSlot(address);
  if (speed > 0) {
    speed++; // 1 would be emergency stop, not an actual speed.
  }
  engine->address = address;
  engine->targetSpeed = speed;
  engine->targetDirection = forwards;
}

void generateSpeedCommand(locomotive &loco) {
  signalGeneration::nextData[0] = loco.address;
  signalGeneration::nextData[1] = 0b0011'1111;
  signalGeneration::nextData[2] = loco.targetSpeed | (loco.targetDirection << 7);
  signalGeneration::nextDataLenght = 3;
  signalGeneration::nextDataIsReady = true;

  loco.speed = loco.targetSpeed;
  loco.direction = loco.targetDirection;
  return;
}

uint8_t extractF0_4(uint8_t f0_4) {
  uint8_t f0 = (f0_4 & 0b00000001) << 4;
  uint8_t f1_4 = f0_4 >> 1;
  return (f0 | f1_4);
}

locomotive *GetEngineSlot(uint16_t address) {
  // TODO: Actually do manage the slots
  return &locos[address % 50];
}
} // namespace state_manager