// alarms.js
// Alarmni sistem SCADA v4


let alarms = [];




// Glavna provjera alarma

function checkAlarm(id, sensor, value) {



    let chamberName =
        "Sušara " + id;



    // Alarm visoke temperature

    if(
        sensor === "suhi" &&
        Number(value) >
        SCADA_SETTINGS.alarms.maxTemperature
    ){


        addAlarm(

            id,

            chamberName,

            "Visoka temperatura: "
            + value
            + " °C"

        );


    }



    // Ako je status OFFLINE

    if(
        sensor === "status" &&
        value !== "ONLINE"
    ){


        addAlarm(

            id,

            chamberName,

            "ESP32 nije dostupan"

        );


    }


}




// Dodavanje alarma

function addAlarm(
    id,
    chamber,
    message
){


    let alarmID =
        id + "_" + message;



    // spriječi dupliranje

    let postoji =
        alarms.find(
            a =>
            a.id === alarmID
        );



    if(postoji)
        return;



    alarms.push({

        id: alarmID,

        chamber: chamber,

        message: message,

        time:
        new Date()

    });



    renderAlarms();


}




// Brisanje alarma

function removeAlarm(id){


    alarms =
    alarms.filter(
        a =>
        a.id !== id
    );


    renderAlarms();

}




// Prikaz alarma

function renderAlarms(){


    const panel =
    document.getElementById(
        "alarmList"
    );



    if(!panel)
        return;



    if(alarms.length === 0){


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
        "alarm-item";



        div.innerHTML = `

            <strong>
            ${alarm.chamber}
            </strong>
            <br>

            ${alarm.message}

            <br>

            <small>
            ${alarm.time
            .toLocaleTimeString()}
            </small>

        `;



        panel.appendChild(div);



        }

    );



}




// Provjera da li je sušara prestala slati podatke

function checkSensorTimeout(){


    SCADA_SETTINGS.chambers
    .forEach(
        chamber => {


        let last =
        document.getElementById(
            `time-${chamber.id}`
        );



        if(!last)
            return;



        // ovdje ćemo kasnije
        // dodati stvarno vrijeme
        // zadnjeg MQTT paketa



        }

    );



}



// provjera svakih 30 sekundi

setInterval(
    checkSensorTimeout,
    30000
);
