# Firmware Development Notes

This folder contains the firmware for the MCU Board. The firmware is based on the Arduino Framework, but generally has to use lower-level functionality to keep up with the timing requirements of the DCC protocol. Currently it's only developed for the Arduino Uno R4, however supporting other boards is at least a possibility.

## Tooling

The firmware is using the PlatformIO Toolkit for development. You can install it as a plugin for VSCode (and other IDEs) or use the command line interface.
It doesn't support all boards officially, instead relying on Community Support for some boards. However I found it to be the easiest way to get a "real" IDE and a complete toolchain for
 various platforms. (other suggestions are welcome)

## Code Style

I've tried to follow the [LLVM Coding Standards](https://llvm.org/docs/CodingStandards.html)
