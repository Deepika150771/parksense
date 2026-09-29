/*
 * ============================================================================
 * ParkSense - ESP32 Smart Parking Sensor Node Firmware
 * ============================================================================
 * Hardware Components:
 *   - ESP32 Development Board (NodeMCU ESP-WROOM-32)
 *   - HC-SR04 Ultrasonic Distance Sensor
 *   - Green LED (Status: Available)
 *   - Red LED (Status: Occupied)
 *   - Piezo Buzzer (Optional sound alert when vehicle parks)
 *
 * Wiring Pinout:
 *   HC-SR04 VCC   -> 5V
 *   HC-SR04 GND   -> GND
 *   HC-SR04 TRIG  -> GPIO 5
 *   HC-SR04 ECHO  -> GPIO 18
 *   GREEN LED     -> GPIO 2 (with 220 ohm resistor)
 *   RED LED       -> GPIO 4 (with 220 ohm resistor)
 *   BUZZER        -> GPIO 19
 * ============================================================================
 */

#include <WiFi.h>
#include <HTTPClient.h>
#include <ArduinoJson.h> // Ensure ArduinoJson library v6+ is installed in Arduino IDE

// ================= USER CONFIGURATION =================
const char* WIFI_SSID     = "YOUR_WIFI_SSID";
const char* WIFI_PASSWORD = "YOUR_WIFI_PASSWORD";

// Express API Server Endpoint
// Replace with your computer's local IP address (e.g. 192.168.1.100)
const char* SERVER_URL    = "http://192.168.1.100:5000/api/v1/sensors/reading";

// Parking Slot ID assigned to this sensor node
const char* SLOT_ID       = "A-01";
const char* SENSOR_ID     = "ESP32_SR04_A01";

// Distance Threshold in centimeters (below this = Occupied)
const float DISTANCE_THRESHOLD_CM = 35.0;

// Hardware Pin Definitions
#define TRIG_PIN  5
#define ECHO_PIN  18
#define LED_GREEN 2
#define LED_RED   4
#define BUZZER_PIN 19

// Operational Parameters
const unsigned long TRANSMIT_INTERVAL_MS = 2000; // Telemetry interval (2 seconds)
unsigned long lastTransmitTime = 0;
bool previousStateOccupied = false;

void setup() {
  Serial.begin(115200);
  delay(1000);
  
  Serial.println("\n=================================================");
  Serial.println("  ParkSense IoT Ultrasonic Sensor Node Starting  ");
  Serial.println("=================================================");

  // Pin Configurations
  pinMode(TRIG_PIN, OUTPUT);
  pinMode(ECHO_PIN, INPUT);
  pinMode(LED_GREEN, OUTPUT);
  pinMode(LED_RED, OUTPUT);
  pinMode(BUZZER_PIN, OUTPUT);

  // Initial LED State
  digitalWrite(LED_GREEN, HIGH);
  digitalWrite(LED_RED, LOW);

  // Connect to WiFi Network
  connectWiFi();
}

void loop() {
  // Reconnect WiFi if lost
  if (WiFi.status() != WL_CONNECTED) {
    connectWiFi();
  }

  // Periodic Telemetry Timer
  if (millis() - lastTransmitTime >= TRANSMIT_INTERVAL_MS) {
    lastTransmitTime = millis();
    
    // Read Distance from HC-SR04
    float distanceCm = getFilteredDistanceCm();
    bool isOccupied = (distanceCm < DISTANCE_THRESHOLD_CM);

    // Update Local Visual Indicators (LEDs & Buzzer)
    updateHardwareIndicators(isOccupied);

    // Detect State Transition (Vehicle Arrived / Departed)
    if (isOccupied != previousStateOccupied) {
      Serial.printf("[STATE CHANGE] Slot %s: %s -> %s (Dist: %.1f cm)\n",
                    SLOT_ID,
                    previousStateOccupied ? "OCCUPIED" : "AVAILABLE",
                    isOccupied ? "OCCUPIED" : "AVAILABLE",
                    distanceCm);

      if (isOccupied) {
        // Sound short welcome beep
        tone(BUZZER_PIN, 1000, 200);
      } else {
        // Sound departure beep
        tone(BUZZER_PIN, 600, 150);
      }
      previousStateOccupied = isOccupied;
    }

    // Transmit JSON Telemetry to Express API
    sendSensorDataToBackend(distanceCm, isOccupied);
  }
}

// ================= HELPER FUNCTIONS =================

// Connect to Local WiFi Access Point
void connectWiFi() {
  Serial.printf("[WiFi] Connecting to %s ", WIFI_SSID);
  WiFi.mode(WIFI_STA);
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);

  int retries = 0;
  while (WiFi.status() != WL_CONNECTED && retries < 20) {
    delay(500);
    Serial.print(".");
    retries++;
  }

  if (WiFi.status() == WL_CONNECTED) {
    Serial.println("\n[WiFi] Connected Successfully!");
    Serial.printf("[WiFi] IP Address: %s\n", WiFi.localIP().toString().c_str());
  } else {
    Serial.println("\n[WiFi Warning] Connection Failed! Will retry in next loop...");
  }
}

// Read Distance from HC-SR04 Ultrasonic Sensor with median noise filtering
float getFilteredDistanceCm() {
  const int NUM_SAMPLES = 5;
  float samples[NUM_SAMPLES];

  for (int i = 0; i < NUM_SAMPLES; i++) {
    // Clear trigger pin
    digitalWrite(TRIG_PIN, LOW);
    delayMicroseconds(2);
    
    // Send 10us HIGH pulse
    digitalWrite(TRIG_PIN, HIGH);
    delayMicroseconds(10);
    digitalWrite(TRIG_PIN, LOW);

    // Read echo pulse duration (in microseconds)
    long duration = pulseIn(ECHO_PIN, HIGH, 30000); // 30ms timeout

    if (duration == 0) {
      // Timeout fallback (no obstacle detected in 5m range)
      samples[i] = 400.0;
    } else {
      // Distance calculation (speed of sound = 0.0343 cm/us)
      samples[i] = (duration * 0.0343) / 2.0;
    }
    delay(10);
  }

  // Calculate median sample for noise rejection
  for (int i = 0; i < NUM_SAMPLES - 1; i++) {
    for (int j = i + 1; j < NUM_SAMPLES; j++) {
      if (samples[i] > samples[j]) {
        float temp = samples[i];
        samples[i] = samples[j];
        samples[j] = temp;
      }
    }
  }

  return samples[NUM_SAMPLES / 2];
}

// Update Local Status LEDs
void updateHardwareIndicators(bool isOccupied) {
  if (isOccupied) {
    digitalWrite(LED_GREEN, LOW);
    digitalWrite(LED_RED, HIGH);
  } else {
    digitalWrite(LED_GREEN, HIGH);
    digitalWrite(LED_RED, LOW);
  }
}

// Transmit HTTP POST Request to Express Server
void sendSensorDataToBackend(float distanceCm, bool isOccupied) {
  if (WiFi.status() != WL_CONNECTED) return;

  HTTPClient http;
  http.begin(SERVER_URL);
  http.addHeader("Content-Type", "application/json");

  // Create JSON Payload
  StaticJsonDocument<200> doc;
  doc["slotId"]       = SLOT_ID;
  doc["sensorId"]     = SENSOR_ID;
  doc["distanceCm"]   = round(distanceCm * 10) / 10.0;
  doc["batteryLevel"] = 98; // Simulated battery / input power percentage

  String jsonPayload;
  serializeJson(doc, jsonPayload);

  Serial.printf("[HTTP POST] Sending to %s -> %s\n", SERVER_URL, jsonPayload.c_str());

  int httpCode = http.POST(jsonPayload);

  if (httpCode > 0) {
    Serial.printf("[HTTP Response] Code: %d\n", httpCode);
  } else {
    Serial.printf("[HTTP Error] Failed to send POST request. Error: %s\n", http.errorToString(httpCode).c_str());
  }

  http.end();
}
