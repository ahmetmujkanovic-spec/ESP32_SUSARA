// alarms.js
// SCADA v4 alarm sistem


let alarms = [];

// vrijeme zadnjeg primljenog podatka po sušari

let lastSeen = {};

let lastSensorSeen = {};

// registracija dolaska podatka

function updateDeviceSeen(id){


    lastSeen[id] =
    Date.now();



    // ako se uređaj vratio
    // ukloni offline alarm

    removeOfflineAlarm(id);


}

function checkOfflineDevices(){


    let now =
    Date.now();



    SCADA_SETTINGS.chambers.forEach(
        chamber => {



        let last =
        lastSeen[chamber.id];



        if(!last)
            return;



        if(
            now - last >
            SCADA_SETTINGS.alarms.offlineTimeout
        ){



            addAlarm(

                chamber.id,

                "ESP32 nema komunikaciju"

            );



            updateChamberStatus(

                chamber.id,

                false

            );


        }



        }

    );


}

// Provjera pristiglih podataka

function checkAlarm(id, sensor, value){


    let message = null;



    // Visoka temperatura

    if(
        sensor === "suhi" &&
        Number(value) >
        SCADA_SETTINGS.alarms.maxTemperature
    ){

        message =
        "Visoka temperatura: "
        + Number(value).toFixed(1)
        + " °C";

    }



    // ESP offline

    if(
        sensor === "status" &&
        value !== "ONLINE"
    ){

        message =
        "ESP32 offline";

    }





    if(message){

        addAlarm(
            id,
            message
        );

    }
    else{

        // ako je stanje normalno
        // ukloni alarm tog tipa

        if(sensor==="suhi"){

            removeTemperatureAlarm(id);

        }


        if(sensor==="status"){

            removeOfflineAlarm(id);

        }

    }


}







// Dodavanje alarma

function addAlarm(
    id,
    message
){



    let exists =
    alarms.find(
        alarm =>
        alarm.id === id &&
        alarm.message === message
    );



    if(exists)
        return;




    alarms.push({

        id:id,

        message:message,

        time:
        new Date()

    });



    setCardAlarm(id,true);


    renderAlarms();


}







// Uklanjanje svih alarma jedne sušare

function clearChamberAlarms(id){



    alarms =
    alarms.filter(
        alarm =>
        alarm.id !== id
    );



    setCardAlarm(id,false);


    renderAlarms();


}







// Ukloni alarm previsoke temperature

function removeTemperatureAlarm(id){



    alarms =
    alarms.filter(
        alarm =>

        !(
            alarm.id === id &&
            alarm.message.includes(
                "Visoka temperatura"
            )

        )

    );



    checkCardAlarm(id);


    renderAlarms();


}






// Ukloni offline alarm

function removeOfflineAlarm(id){


    alarms =
    alarms.filter(
        alarm =>

        !(
            alarm.id === id &&

            (
                alarm.message.includes("offline") ||
                alarm.message.includes("nema komunikaciju")
            )

        )

    );


    checkCardAlarm(id);


    renderAlarms();


}







// Provjera da li kartica još ima alarm

function checkCardAlarm(id){


    let exists =
    alarms.some(
        alarm =>
        alarm.id === id
    );


    setCardAlarm(
        id,
        exists
    );


}








// Dodavanje/uklanjanje crvenog efekta kartice

function setCardAlarm(
    id,
    state
){



    let card =
    document.getElementById(
        "card-" + id
    );



    if(!card)
        return;



    if(state){

        card.classList.add(
            "cardAlarm"
        );

    }
    else{

        card.classList.remove(
            "cardAlarm"
        );

    }


}







// Prikaz alarma

function renderAlarms(){



    let panel =
    document.getElementById(
        "alarmList"
    );



    let counter =
    document.getElementById(
        "alarmCount"
    );



    if(counter){

        counter.innerHTML =
        alarms.length;


        if(alarms.length > 0){

            counter.className =
            "red";

        }
        else{

            counter.className =
            "green";

        }

    }





    if(!panel)
        return;




    if(
        alarms.length === 0
    ){

        panel.innerHTML =
        "Nema alarma";


        return;

    }






    panel.innerHTML = "";



    alarms.forEach(
        alarm => {



        let div =
        document.createElement(
            "div"
        );


        div.className =
        "alarm";



        div.innerHTML = `

        Sušara ${alarm.id}

        <br>

        ${alarm.message}

        <br>

        <small>
        ${alarm.time.toLocaleTimeString()}
        </small>

        `;



        panel.appendChild(div);



        }

    );


}


function updateSensorSeen(id, sensor){

    if(!lastSensorSeen[id]){
        lastSensorSeen[id] = {};
    }


    lastSensorSeen[id][sensor] =
    Date.now();


    removeSensorAlarm(
        id,
        sensor
    );

}

function checkOfflineSensors(){

    let now = Date.now();


    SCADA_SETTINGS.chambers.forEach(
        chamber => {


        ["suhi","vlazni"].forEach(
            sensor => {


            let last =
            lastSensorSeen[chamber.id]?.[sensor];


            if(!last)
                return;


            if(
                now - last > 60000
            ){

                addAlarm(

                    chamber.id,

                    "Nema podatka: " + sensor

                );

            }


        });


    });


}

setInterval(

    checkOfflineDevices,

    10000

);

setInterval(
    checkOfflineSensors,
    10000
);
