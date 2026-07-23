// =====================================================
// SCADA v4 - CYCLE MANAGEMENT
// =====================================================


let cycles = {};




// =====================================================
// Primanje postavki sušare sa ESP32
// =====================================================

function updateCycleSettings(id, data){

     console.log("CYCLE DATA:", id, data);

    cycles[id] = data;


    updateCycleDisplay(id);


}





// =====================================================
// Format vremena trajanja
// =====================================================

function formatDuration(milliseconds){


    let totalMinutes =
    Math.floor(
        milliseconds / 60000
    );



    let days =
    Math.floor(
        totalMinutes / 1440
    );



    let hours =
    Math.floor(
        (totalMinutes % 1440) / 60
    );



    let minutes =
    totalMinutes % 60;



    let text = "";



    if(days > 0){


        text += days;


        if(days == 1)
            text += " dan ";
        else
            text += " dana ";

    }




    if(hours > 0){


        text += hours;
        text += " h ";

    }




    if(minutes > 0 || text === ""){


        text += minutes;
        text += " min";

    }



    return text.trim();


}







// =====================================================
// Osvježavanje prikaza u kartici
// =====================================================

function updateCycleDisplay(id){



    let cycle =
    cycles[id];



    if(!cycle)
        return;




    // ---------- debljine ----------


    let thicknessText = "";



    if(cycle.thickness1){


        thicknessText +=
        cycle.thickness1.name +
        " (" +
        cycle.thickness1.mm +
        " mm)";


    }




    if(cycle.thickness2){


        if(thicknessText !== "")
            thicknessText += " + ";



        thicknessText +=
        cycle.thickness2.name +
        " (" +
        cycle.thickness2.mm +
        " mm)";

    }




    let thicknessElement =
    document.getElementById(
        "thickness-" + id
    );


    if(thicknessElement){


        thicknessElement.innerHTML =
        thicknessText || "-";


    }






    // ---------- početak ----------


    let startElement =
    document.getElementById(
        "start-" + id
    );



    if(startElement && cycle.startDate){

    startElement.innerHTML =
    formatDate(
        cycle.startDate
    );

}







// ---------- trajanje ----------


let durationElement =
document.getElementById(
    "cycle-" + id
);


if(durationElement && cycle.startDate){

    console.log(
        "START DATE:",
        cycle.startDate
    );


    let days =
    calculateDays(
        cycle.startDate
    );


    console.log(
        "DAYS:",
        days
    );


    durationElement.innerHTML =
    days + " dana";

}


// ---------- vlaga ----------

let moistureElement =
document.getElementById(
    "moisture-" + id
);


if(moistureElement){

    if(cycle.moisture !== undefined){

        moistureElement.innerHTML =
        cycle.moisture + " %";

    }
    else{

        moistureElement.innerHTML =
        "-";

    }

}


// =====================================================
// Automatsko osvježavanje trajanja
// =====================================================

setInterval(function(){



    Object.keys(cycles)
    .forEach(function(id){


        updateCycleDisplay(id);


    });



},60000);

function formatDate(date){


    let d =
    new Date(date);


    return d.toLocaleDateString();

}

function calculateDays(startDate){

    let start =
    new Date(startDate);


    let today =
    new Date();


    start.setHours(0,0,0,0);
    today.setHours(0,0,0,0);


    let diff =
    today - start;


    return Math.floor(
        diff / 86400000
    );

}
}

function updateMoisture(
    id,
    value
){

    if(!cycles[id])
        cycles[id] = {};


    cycles[id].moisture =
    Number(value);


    updateCycleDisplay(id);

}
