


#ifdef ARDUINO_ARCH_RENESAS

#include "hardware_interface.hpp"
#include <Arduino.h>
#include <FspTimer.h>

namespace hardware_interface {

    FspTimer dcc_timer;
    void (*signal_callback)() = nullptr;

    bool beginTimer(float rate, void (*timer_callback)(timer_callback_args_t *));

    void direction_b_on(){
        R_PORT1->POSR = (1 << 2);
    };
    void direction_b_off() {
        R_PORT1->PORR = (1 << 2);
    }
    constexpr float TIMER_RATE = 1'000'000.0f / 58.0f;

    void callback(timer_callback_args_t *p_args) {
        signal_callback();
    }

    void set_up_hardware(void (*timer_callback)()) {
        pinMode(13, OUTPUT);
        pinMode(11, OUTPUT);

        digitalWrite(11, HIGH);

        signal_callback = timer_callback;

        Serial.print(beginTimer(TIMER_RATE, callback));
    }



    bool beginTimer(float rate, void (*timer_callback)(timer_callback_args_t *)) {
        uint8_t timer_type = GPT_TIMER;
        int8_t tindex = FspTimer::get_available_timer(timer_type);
        if (tindex < 0){
          tindex = FspTimer::get_available_timer(timer_type, true);
        }
        if (tindex < 0){
          return false;
        }
      
        FspTimer::force_use_of_pwm_reserved_timer();
      
        Serial.println("Beep");

        if(!dcc_timer.begin(TIMER_MODE_PERIODIC, timer_type, tindex, rate, 0.0f, timer_callback)){
          return false;
        }

        Serial.println("Boop");
      
        if (!dcc_timer.setup_overflow_irq()){
          return false;
        }
      
        if (!dcc_timer.open()){
          return false;
        }
      
        if (!dcc_timer.start()){
          return false;
        }
        return true;
      }
}

#endif