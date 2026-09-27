//!================================== don't touch if it's working ======================================
#include <Arduino.h>
#include <ESP32Servo.h>

#define EN_A 14
#define EN_B 13
#define IN1 33
#define IN2 25
#define IN3 26
#define IN4 27
#define TRIG_PIN 18
#define ECHO_PIN 19
#define SERVO_PIN 17

// Pengaturan PWM untuk ESP32
const int freq = 30000;
const int pwmChannelA = 4;
const int pwmChannelB = 5;
const int resolution = 8;

// Servo 
Servo USCServo;

void robot_move_forward(int speed) {
  ledcWrite(pwmChannelA, abs(speed));
  ledcWrite(pwmChannelB, abs(speed));
  if (speed < 0) {  
    digitalWrite(IN1, HIGH);
    digitalWrite(IN2, LOW);
    digitalWrite(IN3, LOW);
    digitalWrite(IN4, HIGH);
  }
  else {
    digitalWrite(IN1, LOW);
    digitalWrite(IN2, HIGH);
    digitalWrite(IN3, HIGH);
    digitalWrite(IN4, LOW);
  }
}

void robot_rotate_clockwise(int speed) {
  ledcWrite(pwmChannelA, abs(speed));
  ledcWrite(pwmChannelB, abs(speed));
  if (speed < 0) {  
    digitalWrite(IN1, LOW);
    digitalWrite(IN2, HIGH);
    digitalWrite(IN3, LOW);
    digitalWrite(IN4, HIGH);
  }
  else {
    digitalWrite(IN1, HIGH);
    digitalWrite(IN2, LOW);
    digitalWrite(IN3, HIGH);
    digitalWrite(IN4, LOW);
  }
}

void robot_rotate_counter_clockwise(int speed) {
  ledcWrite(pwmChannelA, abs(speed));
  ledcWrite(pwmChannelB, abs(speed));
  if (speed < 0) {  
    digitalWrite(IN1, HIGH);
    digitalWrite(IN2, LOW);
    digitalWrite(IN3, HIGH);
    digitalWrite(IN4, LOW);
  }
  else {
    digitalWrite(IN1, LOW);
    digitalWrite(IN2, HIGH);
    digitalWrite(IN3, LOW);
    digitalWrite(IN4, HIGH);
  }
}

void move_servo(int angle) {
  USCServo.write(angle + 90);
}

float get_distance() {
  digitalWrite(TRIG_PIN, LOW);
  delayMicroseconds(2);
  digitalWrite(TRIG_PIN, HIGH);
  delayMicroseconds(10);
  digitalWrite(TRIG_PIN, LOW);

  float duration = pulseIn(ECHO_PIN, HIGH, 30000);
  if (duration == 0) {
    return 100; // Return -1 if no echo is received within the timeout
  }
  float distance = (duration*0.0343)/2;
  return distance;
}

void setup() {
  //motor setup
  pinMode(IN1, OUTPUT);
  pinMode(IN2, OUTPUT);
  pinMode(IN3, OUTPUT);
  pinMode(IN4, OUTPUT);

  ledcSetup(pwmChannelA, freq, resolution);
  ledcSetup(pwmChannelB, freq, resolution);
  ledcAttachPin(EN_A, pwmChannelA);
  ledcAttachPin(EN_B, pwmChannelB);

  // ultrasonic setup
  pinMode(TRIG_PIN, OUTPUT);
  pinMode(ECHO_PIN, INPUT);

  //servo setup
  USCServo.attach(SERVO_PIN);
  USCServo.write(0); 

  Serial.begin(9600);

}
//!=====================================================================================================

//*================================== write your logic down here =======================================
//? initiation and global variable here
int counter = 0;
int dt = 50; //ms

void loop() {
  //? place the code inside while loop on webots here

  delay(dt);
}
