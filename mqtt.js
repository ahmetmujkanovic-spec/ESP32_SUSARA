// mqtt.js
// MQTT komunikacija za SCADA v4


let mqttClient;



function connectMQTT() {


    const options = {

        username: SCADA_SETTINGS.mqtt.username,

        password: SCADA_SETTINGS.mqtt.password,


        reconnectPeriod: 5000,


        clientId:
            "SCADA_" + Math.random()
            .toString(16)
            .substr(2,8)

    };



    mqttClient = mqtt.connect(

        SCADA_SETTINGS.mqtt.host,

        options

    );



    mqttClient.on("connect", function(){


        console.log(
            "MQTT Connected"
        );



        subscribeTopics();



    });



    mqttClient.on("error", function(error){


        console.error(
            "MQTT Error:",
            error
        );


    });



    mqttClient.on("offline", function(){


        console.log(
            "MQTT Offline"
        );


    });



    mqttClient.on("message",
        function(topic, message){


            processMQTTMessage(

                topic,

                message.toString()

            );


        }
    );



}




// Pretplata na sve teme

function subscribeTopics(){



    SCADA_SETTINGS.chambers.forEach(
        chamber => {



            mqttClient.subscribe(

                `susara/${chamber.id}/suhi`

            );


            mqttClient.subscribe(

                `susara/${chamber.id}/vlazni`

            );


            mqttClient.subscribe(

                `susara/${chamber.id}/delta`

            );


            mqttClient.subscribe(

                `susara/${chamber.id}/status`

            );



        }
    );



}




// Obrada pristiglih podataka

function processMQTTMessage(topic, value){



    console.log(
        topic,
        value
    );



    let parts = topic.split("/");



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



        case "status":


            updateChamberStatus(

                chamberID,

                value === "ONLINE"

            );


            break;



    }



    updateLastSeen(chamberID);



    // šalje alarm modulu

    if(typeof checkAlarm === "function"){


        checkAlarm(

            chamberID,

            sensor,

            value

        );


    }



}




// Slanje MQTT poruke

function mqttPublish(topic,value){


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
