// mqtt.js
// SCADA v4 MQTT komunikacija


let mqttClient;





function connectMQTT(){


    const options = {


        username:
        SCADA_SETTINGS.mqtt.username,


        password:
        SCADA_SETTINGS.mqtt.password,

         keepalive: 60,


        reconnectPeriod:
        5000,


        clientId:
        "SCADA_" +
        Math.random()
        .toString(16)
        .substring(2,10)


    };




    mqttClient =
    mqtt.connect(

        SCADA_SETTINGS.mqtt.host,

        options

    );







    mqttClient.on(
    "connect",
    function(){


        console.log(
            "MQTT connected"
        );


        setMQTTStatus(true);


        subscribeTopics();


    }

);







    mqttClient.on(
        "message",
        function(topic,message){



            processMQTTMessage(

                topic,

                message.toString()

            );


        }

    );







mqttClient.on(
    "offline",
    function(){


        console.log(
            "MQTT offline"
        );


        setMQTTStatus(false);


    }

);


mqttClient.on(
    "error",
    function(error){


        console.log(
            "MQTT error",
            error
        );


        setMQTTStatus(false);


    }

);



}









// Pretplata na teme svih sušara

function subscribeTopics(){



    SCADA_SETTINGS.chambers.forEach(

        chamber => {



        let base =
        chamber.mqttPrefix;




        mqttClient.subscribe(
            base +
            "/" +
            SCADA_SETTINGS.mqtt.topics.dry
        );



        mqttClient.subscribe(
            base +
            "/" +
            SCADA_SETTINGS.mqtt.topics.wet
        );



        mqttClient.subscribe(
            base +
            "/" +
            SCADA_SETTINGS.mqtt.topics.delta
        );



        mqttClient.subscribe(
            base +
            "/" +
            SCADA_SETTINGS.mqtt.topics.status
        );

        mqttClient.subscribe(
            base + "/settings"
        );



        console.log(
            "Subscribed:",
            base
        );



        }

    );



}









// Obrada MQTT poruke

function processMQTTMessage(
    topic,
    value
){



    console.log(
        topic,
        value
    );



    let parts =
    topic.split("/");



    if(parts.length !== 3)
        return;




    let chamberID =
    Number(parts[1]);



    let sensor =
    parts[2];

    if(
        (sensor === "suhi" || sensor === "vlazni") &&
        Number(value) <= -127
    ){

        addAlarm(
            chamberID,
            "Greška senzora: " + sensor
        );

    return;

    }


    switch(sensor){



        case "suhi":



            updateChamberValue(

                chamberID,

                "dry",

                value

            );



            updateGauge(

                chamberID,

                value

            );



            addChartValue(

                chamberID,

                value

            );



            //addHistory(

                //chamberID,

                //value

            //);



            checkAlarm(

                chamberID,

                sensor,

                value

            );

            updateSensorSeen(
                chamberID,
                sensor
            );



        break;







        case "vlazni":



            updateChamberValue(

                chamberID,

                "wet",

                value

            );

            updateSensorSeen(
                chamberID,
                sensor
            );



        break;







        case "delta":



            updateChamberValue(

                chamberID,

                "delta",

                value

            );



        break;


        case "settings":


            let data =
                JSON.parse(value);


           updateCycleSettings(
                chamberID,
                data
            );


        break;




        case "status":



            updateChamberStatus(

                chamberID,

                value === "ONLINE"

            );



            checkAlarm(

                chamberID,

                sensor,

                value

            );



        break;



    }




    updateLastSeen(
        chamberID
    );

    updateDeviceSeen(
        chamberID
    );

  if(topic === "susara/version")
{
    const fw =
    document.getElementById(
        "firmwareVersion"
    );

    if(fw)
    {
        fw.innerHTML = value;
    }
}


}

function removeSensorAlarm(id, sensor){

    alarms =
    alarms.filter(

        alarm =>

        !(
            alarm.id === id &&
            alarm.message.includes(
                "Nema podatka: " + sensor
            )
        )

    );


    checkCardAlarm(id);

    renderAlarms();

}

// Slanje poruke

function mqttPublish(
    topic,
    value
){


    if(
        mqttClient &&
        mqttClient.connected
    ){


        mqttClient.publish(

            topic,

            String(value)

        );


    }


}

function sendFirmwareUpdate(url)
{
    if(!mqttClient || !mqttClient.connected)
    {
        console.log("MQTT nije spojen");
        return;
    }


    mqttClient.publish(
        "susara/update",
        url
    );


    console.log("OTA poslano:", url);
}
