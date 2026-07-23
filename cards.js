// cards.js
// SCADA v4 - kreiranje kartica


function createChamberCards(){


    const container =
    document.getElementById("chambers");


    if(!container){

        console.error(
            "Nema #chambers elementa"
        );

        return;
    }


    container.innerHTML = "";



    SCADA_SETTINGS.chambers.forEach(
        chamber => {


        const card =
        document.createElement("div");


        card.className =
        "dryerCard";



        card.id =
        "card-" + chamber.id;



        card.innerHTML = `


        <div class="cardHeader">


    <div class="dryerTitle">

        ${chamber.name}

    </div>


    <div class="cardActions">


        <button 
        class="settingsButton"
        onclick="openSettings(${chamber.id})">
        ⚙
        </button>

        <button 
            class="moistureButton"
                onclick="openMoisture(${chamber.id})">
                💧
        </button>


        <span 
        class="stateBadge"
        id="status-${chamber.id}">
        OFFLINE
        </span>


    </div>


</div>


</div>


        <div class="gaugeArea">


            <canvas

            class="gauge"

            id="gauge-${chamber.id}">

            </canvas>


        </div>





        <div class="values">



            <div class="row">

                <span>
                Suhi termometar
                </span>


                <strong
                class="suhi"
                id="dry-${chamber.id}">

                -- °C

                </strong>


            </div>





            <div class="row">

                <span>
                Vlažni termometar
                </span>


                <strong
                class="vlazni"
                id="wet-${chamber.id}">

                -- °C

                </strong>


            </div>





            <div class="row">

                <span>
                Delta T
                </span>


                <strong
                class="delta"
                id="delta-${chamber.id}">

                -- °C

                </strong>


            </div>



        </div>


<div class="cycleInfo">

    <div class="row">
        <span>Debljina:</span>
        <span id="thickness-${chamber.id}">
            -
        </span>
    </div>


    <div class="row">
        <span>Početak:</span>
        <span id="start-${chamber.id}">
            -
        </span>
    </div>


    <div class="row">
        <span>Trajanje:</span>
        <span id="cycle-${chamber.id}">
            -
        </span>
    </div>

    <div class="row">
    <span>Vlaga:</span>
    <span id="moisture-${chamber.id}">
        -
    </span>
</div>


<div class="row">
    <span>Režim:</span>
    <span id="mode-${chamber.id}">
        -
    </span>
</div>


<div class="row">
    <span>Cilj:</span>
    <span id="target-${chamber.id}">
        -
    </span>
</div>

</div>


        <div class="trendBox">


            <canvas

            class="trendCanvas"

            id="chart-${chamber.id}">

            </canvas>


        </div>





        <div class="statusLine">

            <span>
                Zadnje mjerenje:
            </span>


            <span 
                id="time-${chamber.id}">
                    --
                </span>


            </div>


        `;



        container.appendChild(card);



        }

    );


}





function updateChamberStatus(
    id,
    online
){


    const status =
    document.getElementById(
        "status-" + id
    );


    const card =
    document.getElementById(
        "card-" + id
    );



    if(!status)
        return;



    if(online){


        status.className =
        "stateBadge online";


        status.innerHTML =
        "ONLINE";


        if(card)
        card.classList.remove(
            "cardOffline"
        );


    }

    else{


        status.className =
        "stateBadge offline";


        status.innerHTML =
        "OFFLINE";


        if(card)
        card.classList.add(
            "cardOffline"
        );


    }


}







function updateChamberValue(
    id,
    sensor,
    value
){


    let element=null;



    if(sensor==="dry"){

        element =
        document.getElementById(
            "dry-" + id
        );

    }


    if(sensor==="wet"){

        element =
        document.getElementById(
            "wet-" + id
        );

    }


    if(sensor==="delta"){

        element =
        document.getElementById(
            "delta-" + id
        );

    }



    if(element){

        element.innerHTML =
        Number(value)
        .toFixed(1)
        +" °C";

    }



    if(
        sensor==="dry" &&
        typeof updateGauge==="function"
    ){

        updateGauge(
            id,
            value
        );

    }


}





function updateLastSeen(id){


    const el =
    document.getElementById(
        "time-" + id
    );


    if(el){


        let now =
        new Date();



        el.innerHTML =
        now.toLocaleTimeString();



    }


}
