# DC3S-BT

Digital Command Control Command Station using Bluetooth

DC3S-BT is a experimental project to create a DCC command station utilizing Bluetooth and the WebBluetooth API.
It's targeting Arduino boards with a Bluetooth module, like the Arduino Uno R4 Wifi or the Arduino Coonnect RP 2040.

It's not intended to be a one-size-fits-all solution, rather focusing on the Bluetooth aspect.
Support for DC via Zero-Stretching, RailCom, feedback and other features are not planned.
If you need a more complete solution or one that doesn't rely on Bluetooth, I can wholeheartedly recommend the [DCC-EX](https://dcc-ex.com/)[(Github)](https://github.com/DCC-EX/CommandStation-EX) project.

## Plans

Initial plans:

- Support for controlling locomotives (speed 128 steps and 68 functions)
- Support for basic accessory decoders (turnouts and signals)
- Support for reading and writing CVs on a programming track
- Support for Arduino BLE platforms (mostly the Uno Wifi R4 and the Arduino Connect RP2040)
- Basic WebApp for controlling the command station

Further plans:

- Support for 28 and 14 speed steps
- Support for PoM (Programming on Main)
- Support for "joint" operations (combining the main and programming track)
- Support for the Raspberry Pi Pico and/or ESP32 platforms
- Apps for controlling the command station (probably via Tauri or similar)
- Support for extended accessory decoders
- etc ...
