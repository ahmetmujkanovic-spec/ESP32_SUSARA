// cards.js
// SCADA v4 kartice


function createChamberCards() {


    const container =
        document.getElementById("chambers");


    if (!container) {

        console.error(
            "Nema elementa chambers"
        );

        return;
    }



    container.innerHTML = "";



    SCADA_SETTINGS.chambers.forEach(
        chamber => {



        let card =
        document.createElement("div");


        card.className =
        "chamber-card";


        card.id =
        "card-" + chamber.id;



        card.innerHTML = `

        <div class="card-header">


            <h2>
                ${chamber.name}
            </h2>


            <div
            class="status offline"
            id="status-${chamber.id}">
                OFFLINE
            </div>


        </div>



        <div class="sensor-grid">



            <div class="sensor-box">

                <span>
                Suhi
                </span>

                <strong
                id="dry-${chamber.id}">
                -- °C
                </strong>

            </div>




            <div class="sensor-box">

                <span>
                Vlažni
                </span>

                <strong
                id="wet-${chamber.id}">
                -- °C
                </strong>

            </div>




            <div class="sensor-box delta-box">

                <span>
                Delta T
                </span>

                <strong
                id="delta-${chamber.id}">
                -- °C
                </strong>

            </div>



        </div>





        <div class="gauge-container">

            <canvas
            id="gauge-${chamber.id}">
            </canvas>

        </div>





        <div class="chart-container">


            <canvas
            id="chart-${chamber.id}">
            </canvas>


        </div>





        <div class="card-footer">


            <span>
            Zadnje:
            </span>


            <span
            id="time-${chamber.id}">
            --
            </span>


            <button
            onclick="showHistory(${chamber.id})">

                Historija

            </button>


        </div>


        `;



        container.appendChild(card);



        }

    );


}





// Promjena statusa

function updateChamberStatus(
    id,
    online
){



    let status =
    document.getElementById(
        "status-" + id
    );



    if(!status)
        return;



    if(online){


        status.innerHTML =
        "ONLINE";


        status.classList.remove(
            "offline"
        );


        status.classList.add(
            "online"
        );


    }

    else{


        status.innerHTML =
        "OFFLINE";


        status.classList.remove(
            "online"
        );


        status.classList.add(
            "offline"
        );


    }


}







// Upis vrijednosti senzora

function updateChamberValue(
    id,
    sensor,
    value
){



    let element;



    if(sensor === "dry"){

        element =
        document.getElementById(
            "dry-" + id
        );

    }



    if(sensor === "wet"){

        element =
        document.getElementById(
            "wet-" + id
        );

    }



    if(sensor === "delta"){

        element =
        document.getElementById(
            "delta-" + id
        );

    }



    if(element){


        element.innerHTML =
        Number(value)
        .toFixed(1)
        + " °C";


    }



    // gauge prati suhi termometar

    if(
        sensor === "dry" &&
        typeof updateGauge === "function"
    ){

        updateGauge(
            id,
            value
        );

    }


}




// Vrijeme zadnjeg paketa

function updateLastSeen(id){



    let element =
    document.getElementById(
        "time-" + id
    );



    if(element){


        element.innerHTML =
        new Date()
        .toLocaleTimeString();


    }


}





// Za sada samo priprema

function showHistory(id){


    console.log(
        "Historija sušare:",
        id
    );


}
