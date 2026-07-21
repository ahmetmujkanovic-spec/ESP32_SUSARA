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

// =====================================================
// SERVICE WORKER UPDATE MESSAGE
// =====================================================

if("serviceWorker" in navigator){


    navigator.serviceWorker.addEventListener(
        "message",
        function(event){


            if(event.data.type==="UPDATE_AVAILABLE"){


                 document
                    .getElementById("updateBanner")
                    .style.display="flex";
            }


        }

    );


}

function showUpdateMessage(){


    let box =
    document.createElement("div");


    box.innerHTML =
    `
    Dostupna je nova verzija SCADA sistema.
    <button onclick="location.reload()">
    Ažuriraj
    </button>
    `;


    box.className =
    "updateBox";


    document.body.appendChild(box);


}

function reloadSCADA(){

    location.reload();

}
