// mqtt.js
// SCADA v4 MQTT komunikacija


let mqttClient;





function connectMQTT(){


    const options = {


        username:
        SCADA_SETTINGS.mqtt.username,


        password:
        SCADA_SETTINGS.mqtt.password,


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
        "error",
        function(error){


            console.error(
                "MQTT error",
                error
            );


        }

    );




    mqttClient.on(
        "offline",
        function(){


            console.log(
                "MQTT offline"
            );


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



            addHistory(

                chamberID,

                value

            );



            checkAlarm(

                chamberID,

                sensor,

                value

            );



        break;







        case "vlazni":



            updateChamberValue(

                chamberID,

                "wet",

                value

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
