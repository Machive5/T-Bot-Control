#include <ESP8266WiFi.h>
#include <WiFiUdp.h>

const uint8_t IN1 = 16;
const uint8_t IN2 = 5;
const uint8_t IN3 = 4;
const uint8_t IN4 = 0;

const uint8_t USCT = 2;
const uint8_t USCE = 14;

// wifi settings
const char SSID[10] = "T-Bot V1";
const char pass[10] = "12345678";
IPAddress localIP(192, 168, 0, 1);
IPAddress gateway(192,168,0,1);
IPAddress subnet(255,255,255,0);

// UDP settings
WiFiUDP UDP;
const uint16_t port = 4444;
IPAddress connectedIP;
int16_t timeout = 3000;

struct ComData {
  int8_t speed; // 1: maju | -1: mundur | 0: diam
  int8_t rotation; // 1: berputar kanan | -1: berputar kiri | 0: diam
  uint8_t grab; // 1: capit tertutup | 0: capit terbuka
  uint8_t lift; // 1: griper naik | 0: gripper tutup
};

ComData data;

float dapatkan_jarak_ultrasonik(uint8_t trig, uint8_t echo){
  digitalWrite(trig, LOW);
  delayMicroseconds(2);
  digitalWrite(trig, HIGH);
  delayMicroseconds(10);
  digitalWrite(trig, LOW);

  float duration = pulseIn(echo, HIGH, 20000);
  float distance = (duration*.0343)/2;
  return distance;
}

void move(int8_t linear, int8_t rotation){
  int8_t left = linear - rotation;
  int8_t right = -linear - rotation;
  if (left > 0) {
    digitalWrite(IN1, LOW);
    digitalWrite(IN2, HIGH);
  }
  else if (left < 0){
    digitalWrite(IN1, HIGH);
    digitalWrite(IN2, LOW);
  }
  else{
    digitalWrite(IN1, LOW);
    digitalWrite(IN2, LOW);
  }

  if (right > 0) {
    digitalWrite(IN3, LOW);
    digitalWrite(IN4, HIGH);
  }
  else if (right < 0){
    digitalWrite(IN3, HIGH);
    digitalWrite(IN4, LOW);
  }
  else{
    digitalWrite(IN3, LOW);
    digitalWrite(IN4, LOW);
  }

}

void setup() {
  pinMode(IN1, OUTPUT);
  pinMode(IN2, OUTPUT);
  pinMode(IN3, OUTPUT);
  pinMode(IN4, OUTPUT);

  pinMode(USCT, OUTPUT);
  pinMode(USCE, INPUT);

  Serial.begin(115200);

  // ============================ setup komunikasi ====================================
  Serial.print("");
  Serial.println("Setting soft_ap config... ");
  Serial.println(WiFi.softAPConfig(localIP, gateway, subnet) ? "Success" : "Failed");
  Serial.print("Starting Wifi... ");
  Serial.println(WiFi.softAP(SSID, pass)? "Success" : "Failed");
  Serial.print("Soft-AP IP address: ");
  Serial.println(WiFi.softAPIP());

  Serial.print("setting udp server...");
  UDP.begin(port);
  Serial.printf("UDP Server started at IP %s, port %d", WiFi.softAPIP().toString().c_str(), port);

}

void loop() {
  // ========================================== udp process jangan sentuh kalo dah jalan ===========================================

  if (timeout <= 0){
    connectedIP.clear();
    Serial.println("disconnected...");
  }

  int size = UDP.parsePacket();
  if (size > 0){
    char buffer[8];
    int len;

    while (size > 0){
      if (size == 8){
        len = UDP.read(buffer, 8);
      }
      size = UDP.parsePacket();
    }

    IPAddress senderIP = UDP.remoteIP();
    
    Serial.println("buffer: ");
    Serial.println(buffer);

    if (len == 8){
      if (!connectedIP.isSet() && memcmp(buffer, "its", 3) == 0 && memcmp(&buffer[3], "rcnt", 4) == 0){
        connectedIP = senderIP;
        timeout = 3000;
        const char *reply = "itsrgrn";
        UDP.beginPacket(connectedIP, 4445);
        UDP.write(reply);
        UDP.endPacket();
      }
      else if (connectedIP == senderIP && memcmp(buffer, "its", 3) == 0){
        memcpy(&data, &buffer[3], 4);
        Serial.println("===================================");
        Serial.println("com data: ");
        Serial.printf("speed %d\n", data.speed);
        Serial.printf("rotation %d\n", data.rotation);
        Serial.printf("grab %d\n", data.grab);
        Serial.printf("lift %d\n", data.lift);
        timeout = 3000;
      }
    } 
  }
  timeout -= 33;
  // ============================================= robot logic =================================================
  // logika gerak buat servo dan motor taruh sini

  float jarak = dapatkan_jarak_ultrasonik(USCT, USCE);

  if (jarak > 20.0 || (linear != 1) ){
    move(data.speed, data.rotation);
  }
  else{
    digitalWrite(IN1, LOW);
    digitalWrite(IN2, LOW);
    digitalWrite(IN3, LOW);
    digitalWrite(IN4, LOW); 
  }

  delay(33); //buat clocking 
}