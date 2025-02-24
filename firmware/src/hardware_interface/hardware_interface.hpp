namespace hardware_interface {
    void enable_b();
    void disable_b();
    void direction_b_on();
    void direction_b_off();
    void set_up_hardware(void (*timer_callback)());
}