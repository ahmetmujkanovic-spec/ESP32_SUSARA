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
