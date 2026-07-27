#include <WiFi.h>
#include <WiFiMulti.h>
#include <WiFiClientSecure.h>
#include <PubSubClient.h>
#include <WebServer.h>
#include <OneWire.h>
#include <DallasTemperature.h>
#include <Update.h>
#include <Preferences.h>
#include <ArduinoJson.h>
#include <HTTPClient.h>
#include <HTTPUpdate.h>
#include <esp_ota_ops.h>

#define FW_VERSION "1.0.4"

// ================= WIFI =================
WiFiMulti wifiMulti;

Preferences preferences;

// ================= MQTT =================
const char* mqtt_server = "f061290ac3f24bb7a4bd389b716bddc6.s1.eu.hivemq.cloud";
const int mqtt_port = 8883;
const char* mqtt_user = "esp32";
const char* mqtt_pass = "1234Aaaa";
// ================= OTA LOGIN =================
const char* otaUser = "admin";
const char* otaPass = "Susara2026";

const char* OTA_TOPIC = "susara/update";
const char* OTA_STATUS_TOPIC = "susara/update/status";
const char* OTA_VERSION_TOPIC = "susara/version";

// ================= TLS =================
WiFiClientSecure secureClient;
PubSubClient client(secureClient);

// ================= WEB =================
WebServer server(80);

// ================= PINS =================
#define BUS1 19
#define BUS2 17
#define BUS3 4

OneWire ow1(BUS1);
OneWire ow2(BUS2);
OneWire ow3(BUS3);

DallasTemperature s1(&ow1);
DallasTemperature s2(&ow2);
DallasTemperature s3(&ow3);

// ================= PLACEHOLDER ADRESE =================
//28 42 0D 6A 00 00 00 62
//28 B5 2D 6A 00 00 00 6D
// SUŠARA 1
DeviceAddress s1_hot = {0x28, 0x42, 0x0D, 0x6A, 0x00, 0x00, 0x00, 0x62};
DeviceAddress s1_cold = {0x28, 0xB5, 0x2D, 0x6A, 0x00, 0x00, 0x00, 0x6D};

// SUŠARA 2
//28 62 EC 6A 00 00 00 C3
//28 BE 95 6A 00 00 00 E4
DeviceAddress s2_hot = {0x28, 0x62, 0xEC, 0x6A, 0x00, 0x00, 0x00, 0xC3};
DeviceAddress s2_cold = {0x28, 0xBE, 0x95, 0x6A, 0x00, 0x00, 0x00, 0xE4};

// samo jedan 28 CA 8A 6A 00 00 00 B3
// SUŠARA 3
DeviceAddress s3_hot = {0x28, 0xCA, 0x8A, 0x6A, 0x00, 0x00, 0x00, 0xB3};
DeviceAddress s3_cold = {0x28, 0x32, 0x32, 0x32, 0x32, 0x32, 0x32, 0x32};

// ================= DATA =================
float s1_hot_t, s1_cold_t, s1_delta;
float s2_hot_t, s2_cold_t, s2_delta;
float s3_hot_t, s3_cold_t, s3_delta;

// ================= STATUS =================
String alarm1 = "OK";
String alarm2 = "OK";
String alarm3 = "OK";

// ================= READ =================
void readSensors()
{
  s1.requestTemperatures();
  s2.requestTemperatures();
  s3.requestTemperatures();

  s1_hot_t  = s1.getTempC(s1_hot);
  s1_cold_t = s1.getTempC(s1_cold);
  s1_delta  = s1_hot_t - s1_cold_t;

  s2_hot_t  = s2.getTempC(s2_hot);
  s2_cold_t = s2.getTempC(s2_cold);
  s2_delta  = s2_hot_t - s2_cold_t;

  s3_hot_t  = s3.getTempC(s3_hot);
  //s3_cold_t = s3.getTempC(s3_cold);
  s3_cold_t=0;
  s3_delta  = s3_hot_t - s3_cold_t;

  Serial.println("---------------");

  Serial.print("S1 hot: ");
  Serial.println(s1_hot_t);

  Serial.print("S1 cold: ");
  Serial.println(s1_cold_t);

  Serial.print("S2 hot: ");
  Serial.println(s2_hot_t);

  Serial.print("S2 cold: ");
  Serial.println(s2_cold_t);

  Serial.print("S3 hot: ");
  Serial.println(s3_hot_t);

  Serial.print("S3 cold: ");
  Serial.println(s3_cold_t);

  // ALARM LOGIKA
  alarm1 = (s1_delta < 2) ? "VLAGA VISOKA" : (s1_delta > 15) ? "SUŠENJE OK" : "STABILNO";
  alarm2 = (s2_delta < 2) ? "VLAGA VISOKA" : (s2_delta > 15) ? "SUŠENJE OK" : "STABILNO";
  alarm3 = (s3_delta < 2) ? "VLAGA VISOKA" : (s3_delta > 15) ? "SUŠENJE OK" : "STABILNO";
}

// ================= MQTT =================
void sendMQTT()
{
  char b[10];

  // SUŠARA 1
  dtostrf(s1_hot_t, 4, 2, b);  client.publish("susara/1/suhi", b);
  dtostrf(s1_cold_t, 4, 2, b); client.publish("susara/1/vlazni", b);
  dtostrf(s1_delta, 4, 2, b);  client.publish("susara/1/delta", b);

  // SUŠARA 2
  dtostrf(s2_hot_t, 4, 2, b);  client.publish("susara/2/suhi", b);
  dtostrf(s2_cold_t, 4, 2, b); client.publish("susara/2/vlazni", b);
  dtostrf(s2_delta, 4, 2, b);  client.publish("susara/2/delta", b);

  // SUŠARA 3
  dtostrf(s3_hot_t, 4, 2, b);  client.publish("susara/3/suhi", b);
  dtostrf(s3_cold_t, 4, 2, b); client.publish("susara/3/vlazni", b);
  dtostrf(s3_delta, 4, 2, b);  client.publish("susara/3/delta", b);

  client.publish("susara/1/status","ONLINE", true);
  client.publish("susara/2/status","ONLINE", true);
  client.publish("susara/3/status","ONLINE", true);
}

void sendDeviceInfo()
{
    client.publish(
        OTA_STATUS_TOPIC,
        "ONLINE",
        true
    );

    client.publish(
        OTA_VERSION_TOPIC,
        FW_VERSION,
        true
    );

    Serial.println("Device info poslano");
}

// ================= MQTT CONNECT =================
void reconnectMQTT()
{
  while (!client.connected())
  {
    String id = "SCADA-" + String(random(0xffff), HEX);

 if (client.connect(id.c_str(), mqtt_user, mqtt_pass))
{
    Serial.println("MQTT OK");

    client.subscribe("susara/+/settings");
    client.subscribe(OTA_TOPIC);

    sendDeviceInfo();

    sendSavedSettings(1);
    sendSavedSettings(2);
    sendSavedSettings(3);
}
    else
    {
      Serial.print("MQTT FAIL ");
      Serial.println(client.state());
      delay(3000);
    }
  }
}

void startOTA(String url)
{
    Serial.println("OTA URL:");
    Serial.println(url);
    client.publish(OTA_STATUS_TOPIC, "DOWNLOADING", true);

    WiFiClientSecure otaClient;
    otaClient.setInsecure();

    t_httpUpdate_return result =
        httpUpdate.update(otaClient, url);

    switch (result)
    {
        case HTTP_UPDATE_FAILED:

            client.publish(
                OTA_STATUS_TOPIC,
                ("FAILED: " + String(httpUpdate.getLastErrorString())).c_str(),
                true
            );

            break;

        case HTTP_UPDATE_NO_UPDATES:

            client.publish(
                OTA_STATUS_TOPIC,
                "NO UPDATE",
                true
            );

            break;

        case HTTP_UPDATE_OK:

            // ESP će se automatski restartovati

            break;
    }
}

void sendSavedSettings(int dryer)
{
    String prefix = "s" + String(dryer) + "_";

    StaticJsonDocument<256> doc;

if(preferences.isKey((prefix + "moisture").c_str()))
{
    doc["moisture"] =
        preferences.getFloat(
            (prefix + "moisture").c_str()
        );
}

    JsonObject t1 = doc.createNestedObject("thickness1");

    t1["name"] =
    preferences.getString(
        (prefix+"t1name").c_str(),
        ""
    );

    t1["mm"] =
    preferences.getInt(
        (prefix+"t1mm").c_str(),
        0
    );

if(preferences.isKey((prefix + "t2name").c_str()))
{
    JsonObject t2 = doc.createNestedObject("thickness2");

    t2["name"] =
        preferences.getString((prefix + "t2name").c_str());

    t2["mm"] =
        preferences.getInt((prefix + "t2mm").c_str());
}

    doc["startDate"] =
    preferences.getString(
        (prefix+"startDate").c_str(),
        ""
    );


    String out;

    serializeJson(doc,out);


    client.publish(
        ("susara/"+String(dryer)+"/settings").c_str(),
        out.c_str(),
        true
    );
}

void loadCycleSettings()
{
    for(int dryer=1; dryer<=3; dryer++)
    {
        String p="s"+String(dryer)+"_";

        Serial.println("----------------");

        Serial.print("Sušara ");
        Serial.println(dryer);

        Serial.print("T1: ");
        Serial.print(preferences.getString((p+"t1name").c_str(),"-"));
        Serial.print(" ");
        Serial.println(preferences.getInt((p+"t1mm").c_str(),0));

        Serial.print("T2: ");
        Serial.print(preferences.getString((p+"t2name").c_str(),"-"));
        Serial.print(" ");
        Serial.println(preferences.getInt((p+"t2mm").c_str(),0));

        Serial.print("Datum: ");
        Serial.println(
            preferences.getString((p+"startDate").c_str(),"-")
        );
    }
}

// ================= WEB =================
void handleRoot()
{
  String html = R"rawliteral(
<!DOCTYPE html>
<html>
<head>
<meta name="viewport" content="width=device-width, initial-scale=1">
<style>
body{
  background:#000;
  color:#00ff99;
  font-family:Arial;
  margin:0
}

h2{
  text-align:center
}

.info{
  text-align:center;
  background:#111;
  margin:10px;
  padding:10px;
  border-radius:10px;
  font-size:18px;
}

.grid{
  display:grid;
  grid-template-columns:1fr 1fr 1fr;
  gap:10px;
  padding:10px
}

.card{
  background:#111;
  padding:10px;
  border-radius:10px;
  text-align:center
}

.value{
  font-size:28px
}

</style>
</head>

<body>

<h2>LOCAL SCADA DASHBOARD</h2>

<div class="info">
Sušara ESP32 #1<br>
IP adresa: )rawliteral";

html += WiFi.localIP().toString();

html += R"rawliteral(
<br>
WiFi signal: )rawliteral";

html += String(WiFi.RSSI());

html += R"rawliteral(
 dBm
</div>


<div class="grid">

<div class="card">
SUŠARA 1<br>
<div id="s1">--</div>
</div>

<div class="card">
SUŠARA 2<br>
<div id="s2">--</div>
</div>

<div class="card">
SUŠARA 3<br>
<div id="s3">--</div>
</div>

</div>


<script>
setInterval(()=>{
fetch('/data')
.then(r=>r.json())
.then(d=>{
document.getElementById("s1").innerHTML=d.s1;
document.getElementById("s2").innerHTML=d.s2;
document.getElementById("s3").innerHTML=d.s3;
});
},2000);
</script>

</body>
</html>
)rawliteral";

  server.send(200,"text/html",html);
}

// ================= JSON =================
void handleData()
{
  String json = "{";
  json += "\"s1\":\"" + String(s1_delta) + " (" + alarm1 + ")\",";
  json += "\"s2\":\"" + String(s2_delta) + " (" + alarm2 + ")\",";
  json += "\"s3\":\"" + String(s3_delta) + " (" + alarm3 + ")\"";
  json += "}";

  server.send(200,"application/json",json);
}

void handleUpdatePage()
{
    if (!server.authenticate(otaUser, otaPass))
    {
        return server.requestAuthentication();
    }

  server.send(200, "text/html",
    "<form method='POST' action='/update' enctype='multipart/form-data'>"
    "<input type='file' name='update'>"
    "<input type='submit' value='Update'>"
    "</form>");
}

void handleUpdateUpload()
{
  HTTPUpload& upload = server.upload();

  if (upload.status == UPLOAD_FILE_START)
  {
    Serial.printf("OTA: %s\n", upload.filename.c_str());

    if (!Update.begin(UPDATE_SIZE_UNKNOWN))
      Update.printError(Serial);
  }
  else if (upload.status == UPLOAD_FILE_WRITE)
  {
    if (Update.write(upload.buf, upload.currentSize) != upload.currentSize)
      Update.printError(Serial);
  }
  else if (upload.status == UPLOAD_FILE_END)
  {
    if (Update.end(true))
    {
      Serial.println("OTA uspješan.");
    }
    else
    {
      Update.printError(Serial);
    }
  }
}

void saveCycleSettings(String json, int dryer)
{

    StaticJsonDocument<512> doc;


    DeserializationError error =
    deserializeJson(doc, json);


    if(error)
    {
        Serial.println("JSON greska");
        return;
    }


    String prefix = "s" + String(dryer) + "_";
    String key;

    if(doc["thickness1"])
    {
      key = prefix + "t1name";

        preferences.putString(
    key.c_str(),
    doc["thickness1"]["name"].as<String>()
);
  key = prefix + "t1mm";

        preferences.putInt(
    key.c_str(),
    doc["thickness1"]["mm"]
);

    }
    else
    {
      preferences.remove((prefix + "t1name").c_str());
      preferences.remove((prefix + "t1mm").c_str());
    }



    if(doc["thickness2"])
    {
      key = prefix + "t2name";

preferences.putString(
    key.c_str(),
    doc["thickness2"]["name"].as<String>()
);
  key = prefix + "t2mm";

        preferences.putInt(
    key.c_str(),
    doc["thickness2"]["mm"]
);


    }
    else
    {
      preferences.remove((prefix + "t2name").c_str());
      preferences.remove((prefix + "t2mm").c_str());
    }


key = prefix + "startDate";

preferences.putString(
    key.c_str(),
    doc["startDate"].as<String>()
);

if(doc["moisture"])
{
    preferences.putFloat(
        (prefix + "moisture").c_str(),
        doc["moisture"]
    );
}

    Serial.print("Sacuvan ciklus susare ");
    Serial.println(dryer);

}

// ================= SETUP =================
void setup()
{
  Serial.begin(115200);

  confirmFirmware();

  wifiMulti.addAP("Net_639446","JPL1JPL1");
  wifiMulti.addAP("MERCUSYS_6BA0","47903173");
  wifiMulti.addAP("MojaTV_Full_645351","XEDIXEDI");

  while(wifiMulti.run()!=WL_CONNECTED)
  {
    delay(500);
    Serial.print(".");
  }

  Serial.println("\nWiFi OK");
  Serial.print("IP adresa: ");
  Serial.println(WiFi.localIP());

  secureClient.setInsecure();
  client.setServer(mqtt_server,mqtt_port);
  client.setCallback(mqttCallback);

  preferences.begin("susara", false);
  loadCycleSettings();

  s1.begin();
  s2.begin();
  s3.begin();

  DeviceAddress addr;

Serial.println("BUS1");
for(int i=0;i<s1.getDeviceCount();i++)
{
  s1.getAddress(addr,i);
  printAddress(addr);
}

Serial.println("BUS2");
for(int i=0;i<s2.getDeviceCount();i++)
{
  s2.getAddress(addr,i);
  printAddress(addr);
}

Serial.println("BUS3");
for(int i=0;i<s3.getDeviceCount();i++)
{
  s3.getAddress(addr,i);
  printAddress(addr);
}

server.on("/update", HTTP_GET, handleUpdatePage);

server.on(
  "/update",
  HTTP_POST,
  []()
  {
    if (!server.authenticate(otaUser, otaPass))
    {
      return server.requestAuthentication();
    }

    server.sendHeader("Connection", "close");
    server.send(200, "text/plain",
      Update.hasError() ? "Update FAILED" : "Update OK. Restart...");

    delay(1000);
    ESP.restart();
  },
  handleUpdateUpload
);

  server.on("/",handleRoot);
  server.on("/data",handleData);
  server.begin();
}

// ================= LOOP =================
unsigned long lastSend=0;

void loop()
{
  if(!client.connected()) reconnectMQTT();

  client.loop();
  server.handleClient();

  if(millis()-lastSend>5000)
  {
    lastSend=millis();

    readSensors();
    sendMQTT();
  }
}

void printAddress(DeviceAddress deviceAddress)
{
  for (uint8_t i = 0; i < 8; i++)
  {
    if (deviceAddress[i] < 16) Serial.print("0");
    Serial.print(deviceAddress[i], HEX);
    if (i < 7) Serial.print(" ");
  }
  Serial.println();
}

// ================= MQTT CALLBACK =================

// ================= MQTT CALLBACK =================

void mqttCallback(char* topic, byte* payload, unsigned int length)
{

    String message = "";

    for(unsigned int i = 0; i < length; i++)
    {
        message += (char)payload[i];
    }


    String t = String(topic);


    Serial.println("MQTT:");
    Serial.println(t);
    Serial.println(message);


    // ================= OTA UPDATE =================

    if(t == OTA_TOPIC)
{
    if(message.length() > 10)
    {
        startOTA(message);
    }
    else
    {
        Serial.println("Neispravan OTA URL");
    }

    return;
}


    // ================= SETTINGS =================

    if(t.endsWith("/settings"))
    {

        int dryer = t.substring(7,8).toInt();


        saveCycleSettings(
            message,
            dryer
        );

    }

}

void confirmFirmware()
{
    const esp_partition_t *running =
        esp_ota_get_running_partition();

    esp_ota_img_states_t ota_state;


    if (esp_ota_get_state_partition(running, &ota_state) == ESP_OK)
    {
        if (ota_state == ESP_OTA_IMG_PENDING_VERIFY)
        {
            Serial.println("Novi firmware ceka potvrdu");


            if (esp_ota_mark_app_valid_cancel_rollback() == ESP_OK)
            {
                Serial.println("Firmware potvrden");
            }
            else
            {
                Serial.println("Greska potvrde firmware-a");
            }
        }
    }
}
