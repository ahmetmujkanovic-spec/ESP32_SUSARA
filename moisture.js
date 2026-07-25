// =====================================================
// SCADA v4 - MOISTURE INPUT
// =====================================================


function openMoisture(id){


    let value = "";


    if(
        cycles[id] &&
        cycles[id].moisture !== undefined
    ){

        value = cycles[id].moisture;

    }



    let moisture = prompt(

        "Unesi trenutnu vlagu drveta (%)",

        value

    );


    if(moisture === null)
        return;



    moisture =
    Number(moisture);



    if(
        isNaN(moisture) ||
        moisture < 0 ||
        moisture > 100
    ){

        alert(
            "Neispravna vrijednost vlage"
        );

        return;

    }



    updateMoisture(

        id,

        moisture

    );
    sendCycleSettings(id);


}
