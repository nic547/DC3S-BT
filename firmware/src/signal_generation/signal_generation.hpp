#pragma once

namespace signal_generation {
    void setup();

    extern uint8_t nextData[6];
    extern int nextDataLenght;
    extern bool nextDataIsReady;
    extern bool nextDataIsUsed;

    extern int debugWrittenBit;
    extern int debugBitDuration;
};
