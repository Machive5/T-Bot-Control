// pin motor
const uint8_t IN1 = 16;
const uint8_t IN2 = 5;
const uint8_t IN3 = 4;
const uint8_t IN4 = 0;

// pin ultrasonic
const uint8_t USCT = 2;
const uint8_t USCE = 14;

void maju(){
  digitalWrite(IN1, LOW);
  digitalWrite(IN2, HIGH);
  digitalWrite(IN3, HIGH);
  digitalWrite(IN4, LOW);
}

void berputar(){
  digitalWrite(IN1, LOW);
  digitalWrite(IN2, HIGH);
  digitalWrite(IN3, LOW);
  digitalWrite(IN4, HIGH);
}

float dapatkan_jarak_usc(uint8_t trig, uint8_t echo){
  digitalWrite(trig, LOW);
  delayMicroseconds(2);
  digitalWrite(trig, HIGH);
  delayMicroseconds(10);
  digitalWrite(trig, LOW);

  float duration = pulseIn(echo, HIGH, 20000);
  float distance = (duration*0.0343)/2;
  return distance;
}

void setup() {
  // put your setup code here, to run once:

  pinMode(IN1, OUTPUT);
  pinMode(IN2, OUTPUT);
  pinMode(IN3, OUTPUT);
  pinMode(IN4, OUTPUT);

  pinMode(USCT, OUTPUT);
  pinMode(USCE, INPUT);


  Serial.begin(115200);

}

void loop() {
  // put your main code here, to run repeatedly:

  float jarak = dapatkan_jarak_usc(USCT, USCE);

  Serial.println("=====================");
  Serial.println(jarak);

  if (jarak > 20){
    maju();
    Serial.println("maju");
  }
  else {
    berputar();
    Serial.println("berputar");
  }

  delay(33);
}
