// cards.js
// Kreiranje SCADA kartica za sušare


function createChamberCards() {

    const container = document.getElementById("chambers");


    if (!container) {
        console.error("Nije pronađen element #chambers");
        return;
    }


    container.innerHTML = "";


    SCADA_SETTINGS.chambers.forEach(chamber => {


        const card = document.createElement("div");

        card.className = "chamber-card";

        card.id = `chamber-${chamber.id}`;


        card.innerHTML = `

            <div class="card-header">

                <h2>${chamber.name}</h2>

                <span 
                    class="status offline"
                    id="status-${chamber.id}">
                    OFFLINE
                </span>

            </div>



            <div class="values">


                <div class="value-box">

                    <span>Suhi termometar</span>

                    <strong id="dry-${chamber.id}">
                        -- °C
                    </strong>

                </div>



                <div class="value-box">

                    <span>Vlažni termometar</span>

                    <strong id="wet-${chamber.id}">
                        -- °C
                    </strong>

                </div>



                <div class="value-box delta">

                    <span>Delta T</span>

                    <strong id="delta-${chamber.id}">
                        -- °C
                    </strong>

                </div>


            </div>



            <div class="gauge-area">

                <canvas 
                    id="gauge-${chamber.id}">
                </canvas>

            </div>



            <div class="last-update">

                Zadnje ažuriranje:
                <span id="time-${chamber.id}">
                    --
                </span>

            </div>


        `;


        container.appendChild(card);


    });


}



// Funkcija za promjenu statusa

function updateChamberStatus(id, online) {


    const status = document.getElementById(
        `status-${id}`
    );


    if (!status) return;



    if (online) {

        status.innerHTML = "ONLINE";

        status.classList.remove("offline");

        status.classList.add("online");

    }

    else {

        status.innerHTML = "OFFLINE";

        status.classList.remove("online");

        status.classList.add("offline");

    }

}



// Ažuriranje vrijednosti senzora

function updateChamberValue(id, sensor, value) {


    let element;



    switch(sensor) {


        case "dry":

            element = document.getElementById(
                `dry-${id}`
            );

            break;



        case "wet":

            element = document.getElementById(
                `wet-${id}`
            );

            break;



        case "delta":

            element = document.getElementById(
                `delta-${id}`
            );

            break;

    }



    if (element) {

        element.innerHTML = 
            Number(value).toFixed(1) + " °C";

    }
    if(sensor === "dry") {

    updateGauge(
        id,
        value
    );

}


}



// vrijeme zadnjeg podatka

function updateLastSeen(id) {


    const el = document.getElementById(
        `time-${id}`
    );


    if(el) {

        el.innerHTML =
            new Date().toLocaleTimeString();

    }


}
