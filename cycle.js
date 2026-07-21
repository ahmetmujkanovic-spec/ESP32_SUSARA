// =====================================================
// SCADA v4 - CYCLE MANAGEMENT
// =====================================================


let cycles = {};




// =====================================================
// Primanje postavki sušare sa ESP32
// =====================================================

function updateCycleSettings(id, data){


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


        let date =
        new Date(
            cycle.startDate
        );



        startElement.innerHTML =
        date.toLocaleString();


    }







    // ---------- trajanje ----------


    let durationElement =
    document.getElementById(
        "cycle-" + id
    );



    if(durationElement && cycle.startDate){



        let start =
        new Date(
            cycle.startDate
        );



        let now =
        new Date();



        let diff =
        now - start;



        if(diff >= 0){


            durationElement.innerHTML =
            formatDuration(diff);


        }



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
