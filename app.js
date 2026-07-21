// app.js
// Glavna inicijalizacija SCADA v4


window.onload = function(){


    console.log(
        "SCADA v4 start"
    );



    // napravi kartice sušara

    createChamberCards();



    // napravi gauge prikaze

    createGauges();



    // napravi grafove

    createCharts();



    // spoji MQTT

    connectMQTT();



};

function setMQTTStatus(online){


    const el =
    document.getElementById(
        "mqttStatus"
    );


    if(!el)
        return;



    if(online){


        el.innerHTML =
        "MQTT ONLINE";


        el.className =
        "green";


    }
    else{


        el.innerHTML =
        "MQTT NIJE DOSTUPAN";


        el.className =
        "red";


    }


}
