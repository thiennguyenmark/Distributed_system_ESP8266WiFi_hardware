#include <ESP8266WiFi.h>
#include <FirebaseArduino.h>
#include <Ticker.h>
#include "DHT.h"

// Set these to run example.
#define FIREBASE_HOST "https://thiennguyen-phantan.firebaseio.com"
#define FIREBASE_AUTH "GrkTZLJ0TGXlfzjUoTDCm6ahtizvLXxaEEXSYLFB"
#define WIFI_SSID "Nam Long"
#define WIFI_PASSWORD "0919282726"

#define LAMP_PIN D3
#define PRESENCE_PIN D4
#define DHT_PIN D5
#define DHTTYPE DHT11
// Publique a cada 5 min
#define PUBLISH_INTERVAL 1000*60*5

DHT dht(DHT_PIN, DHTTYPE);
Ticker ticker;
bool publishNewState = true;

void publish(){
  publishNewState = true;
}

void setupPins(){

  pinMode(LAMP_PIN, OUTPUT);
  digitalWrite(LAMP_PIN, LOW);

  pinMode(PRESENCE_PIN, INPUT);

  dht.begin();
}

void setupWifi(){
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
  Serial.print("connecting");
  while (WiFi.status() != WL_CONNECTED) {
    Serial.print(".");
    delay(500);
  }
  Serial.println();
  Serial.print("connected: ");
  Serial.println(WiFi.localIP());
}

void setupFirebase(){
  Firebase.begin(FIREBASE_HOST, FIREBASE_AUTH);
  Firebase.setBool("lamp", false);
  Firebase.setBool("presence", false);
}

void setup() {
  Serial.begin(9600);

  setupPins();
  setupWifi();

  setupFirebase();

  ticker.attach_ms(PUBLISH_INTERVAL, publish);
}

void loop() {

  if(publishNewState){
    Serial.println("Publish new State");
    float humidity = dht.readHumidity();
    float temperature = dht.readTemperature();
    if(!isnan(humidity) && !isnan(temperature)){

      Firebase.pushFloat("temperature", temperature);
      Firebase.pushFloat("humidity", humidity);
      publishNewState = false;

    }else{

      Serial.println("Error Publishing");

    }
  }

  int presence = digitalRead(PRESENCE_PIN);
  Firebase.setBool("presence", presence == HIGH);

  bool lampValue = Firebase.getBool("lamp");
  digitalWrite(LAMP_PIN, lampValue ? HIGH : LOW);

  delay(200);
}
