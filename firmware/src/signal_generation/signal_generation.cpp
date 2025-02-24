#include <Arduino.h>
#include "signal_generation.hpp"
#include "../hardware_interface/hardware_interface.hpp"

namespace signal_generation {
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
    //uint8_t data[6] = {0xD2, 0x2B, 0b10010000, 0x00, 0x00, 0x00};
    uint8_t data[6] = {0b0010'1110, 0b1001'0000, 0x00, 0x00, 0x00, 0x00};

    uint8_t checksum = data[0] ^ data[1];

    void dcc_signal_callback();
    void turn_on();
    void turn_off();

    void setup() {
        hardware_interface::set_up_hardware(dcc_signal_callback);
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
            //fall through to transmitting data
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
        }
    }

    void turn_on() {
        bitCount++;
        isFirstHalf = true;
        hardware_interface::direction_b_on();

        debugWrittenBit = currentBit + 1;
        auto now = micros();
        debugBitDuration = now - debugPreviousBitTimestamp;
        debugPreviousBitTimestamp = now;
    }

    void turn_off() {
        hardware_interface::direction_b_off();
        isFirstHalf = false;
    }
};