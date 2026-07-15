// =====================================================
// SCADA v4 - MQTT CONNECTION
// =====================================================


const MQTT_SERVER =
"wss://f061290ac3f24bb7a4bd389b716bddc6.s1.eu.hivemq.cloud:8884/mqtt";


const MQTT_OPTIONS = {

    username:"esp32",

    password:"1234Aaaa",

    reconnectPeriod:2000,

    clean:true

};


// =====================================================
// CONNECT
// =====================================================

const mqttClient = mqtt.connect(
    MQTT_SERVER,
    MQTT_OPTIONS
);



// =====================================================
// CONNECTED
// =====================================================

mqttClient.on("connect",()=>{


    console.log("MQTT connected");


    document
    .getElementById("mqttState")
    .innerHTML="CONNECTED";


    document
    .getElementById("mqttState")
    .className="green";



    /*
       Prima sve sušare:

       susara/1/suhi
       susara/1/vlazni
       susara/1/delta
       susara/1/status

       susara/2/...

    */


    mqttClient.subscribe(
        "susara/+/+"
    );


});



// =====================================================
// MESSAGE
// =====================================================

mqttClient.on(
"message",
(topic,message)=>{


    let data =
    message.toString();


    console.log(
        topic,
        data
    );


    mqttData(
        topic,
        data
    );


});



// =====================================================
// RECONNECT
// =====================================================

mqttClient.on("reconnect",()=>{


    console.log(
        "MQTT reconnecting"
    );


    document
    .getElementById("mqttState")
    .innerHTML="RECONNECTING";


    document
    .getElementById("mqttState")
    .className="yellow";


});



// =====================================================
// OFFLINE
// =====================================================

mqttClient.on("offline",()=>{


    console.log(
        "MQTT offline"
    );


    document
    .getElementById("mqttState")
    .innerHTML="OFFLINE";


    document
    .getElementById("mqttState")
    .className="red";


});



// =====================================================
// ERROR
// =====================================================

mqttClient.on("error",(err)=>{


    console.log(
        "MQTT ERROR",
        err
    );


});
