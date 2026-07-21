// settings.js
// Glavne postavke SCADA v4


const SCADA_SETTINGS = {


    // =========================
    // SUŠARE
    // =========================


    chambers: [


        {

            id: 1,

            name: "Sušara 1",


            mqttPrefix:
            "susara/1"


        },



        {

            id: 2,

            name: "Sušara 2",


            mqttPrefix:
            "susara/2"


        },



        {

            id: 3,

            name: "Sušara 3",


            mqttPrefix:
            "susara/3"


        }



    ],





    // =========================
    // MQTT
    // =========================


    mqtt: {


        host:
        "wss://TVOJ_HIVEMQ_SERVER:8884/mqtt",


        username:
        "USERNAME",


        password:
        "PASSWORD",



        topics:{


            dry:
            "suhi",


            wet:
            "vlazni",


            delta:
            "delta",


            status:
            "status"


        }


    },






    // =========================
    // ALARMI
    // =========================


    alarms:{


        maxTemperature:
        65,


        offlineTimeout:
        120000,


        warningTemperature:
        55


    },







    // =========================
    // SISTEM
    // =========================


    system:{


        name:
        "SCADA Sušara V4",



        refresh:
        1000


    }


};
