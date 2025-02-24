#include "net.hpp"

#include <ArduinoBLE.h>
#include "../version.hpp"
#include "signal_generation/signal_generation.hpp"
#include "types.hpp"

namespace net {
    void handleSpeed128Command (BLEDevice central, BLECharacteristic characteristic);
    void handleFunctionCommand (BLEDevice central, BLECharacteristic characteristic);

    namespace main {
        BLEService service = BLEService("789624c2-214b-4730-b53d-fe5aa3143250");
        BLECharacteristic version = BLECharacteristic("53b477e7-20c2-446a-bffc-762edee4eb06", BLERead, sizeof(version::value), true);
        BLECharacteristic hash = BLECharacteristic("cc203f79-84e1-4d9b-9e06-f23211a16c5d", BLERead, sizeof(version::hash), true);

    }

    namespace track {

    }

    namespace locomotive {
        BLEService service = BLEService("6d3fe63e-4083-483a-ab0c-36113ecb859f");
        BLECharacteristic speed128 = BLECharacteristic("a829de9a-6dff-4500-ad7b-90889ef346c0", BLERead | BLEWrite | BLENotify, sizeof(SpeedCommand128), true);
        BLECharacteristic function = BLECharacteristic("4d550020-9408-4c08-a9c0-904ead62a642", BLERead | BLEWrite | BLENotify, sizeof(FunctionCommand), true);
    }

    void init() {
        BLE.begin();
        BLE.setLocalName("DC3S-BT");

        main::version.writeValue(reinterpret_cast<const uint8_t*>(version::value), sizeof(version::value));
        main::hash.writeValue(reinterpret_cast<const uint8_t*>(version::hash), sizeof(version::hash));
        main::service.addCharacteristic(main::version);
        main::service.addCharacteristic(main::hash);
        BLE.addService(main::service);

        // Locomotive service

        locomotive::speed128.writeValue(SpeedCommand128(), sizeof(SpeedCommand128));
        locomotive::speed128.setEventHandler(BLEWritten, handleSpeed128Command);
        locomotive::service.addCharacteristic(locomotive::speed128);

        locomotive::function.writeValue(FunctionCommand(), sizeof(FunctionCommand));
        locomotive::function.setEventHandler(BLEWritten, handleFunctionCommand);
        locomotive::service.addCharacteristic(locomotive::function);
        BLE.addService(locomotive::service);

        BLE.setAdvertisedService(main::service);
        BLE.advertise();
    }

    void process() {
        BLE.poll();
    }

    void handleSpeed128Command (BLEDevice central, BLECharacteristic characteristic) {
        Serial.println("Speed128 command received");
        if (characteristic.written()) {
            SpeedCommand128 command;
            memcpy(&command, characteristic.value(), sizeof(SpeedCommand128));
            
            noInterrupts();
            if (!signal_generation::nextDataIsUsed) {
                signal_generation::nextDataIsUsed = true;
                interrupts();
                signal_generation::nextData[0] = (uint8_t)command.engine;
                signal_generation::nextData[1] = 0b0011'1111;
                signal_generation::nextData[2] = command.speed | (command.direction << 7);
                signal_generation::nextDataLenght = 3;
                signal_generation::nextDataIsReady = true;
                signal_generation::nextDataIsUsed = false;
            }
            else {
                interrupts();
            }
        }
    }

    void handleFunctionCommand (BLEDevice central, BLECharacteristic characteristic) {
        Serial.println("Speed128 command received");
        if (characteristic.written()) {
            FunctionCommand command;
            memcpy(&command, characteristic.value(), sizeof(FunctionCommand));
            
            noInterrupts();
            if (!signal_generation::nextDataIsUsed) {
                signal_generation::nextDataIsUsed = true;
                interrupts();
                signal_generation::nextData[0] = (uint8_t)command.engine;
                signal_generation::nextData[1] = 0b1000'0000 | command.state << 4;
                signal_generation::nextDataLenght = 2;
                signal_generation::nextDataIsReady = true;
                signal_generation::nextDataIsUsed = false;
            }
            else {
                interrupts();
            }
        }
    }
}