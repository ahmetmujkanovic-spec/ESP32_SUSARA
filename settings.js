const SCADA_SETTINGS = {

    // Broj komora
    chambers: [

        {
            id: 1,
            name: "Sušara 1",
            sensors: {
                dry: "susara/1/suhi",
                wet: "susara/1/vlazni",
                delta: "susara/1/delta"
            }
        },

        {
            id: 2,
            name: "Sušara 2",
            sensors: {
                dry: "susara/2/suhi",
                wet: "susara/2/vlazni",
                delta: "susara/2/delta"
            }
        },

        {
            id: 3,
            name: "Sušara 3",
            sensors: {
                dry: "susara/3/suhi",
                wet: "susara/3/vlazni",
                delta: "susara/3/delta"
            }
        }

    ],


    // Granice alarma

    alarms: {

        maxTemperature: 65,

        sensorTimeout: 120000   // 2 minute

    },


    // MQTT

    mqtt: {

        host: "wss://f061290ac3f24bb7a4bd389b716bddc6.s1.eu.hivemq.cloud:8884/mqtt",

        username: "esp32",

        password: "1234Aaaa"

    }

};
