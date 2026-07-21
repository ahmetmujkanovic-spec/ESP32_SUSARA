// =====================================================
// SCADA v4 - SETTINGS UI
// =====================================================


let selectedDryer = 0;



function openSettings(id){


    selectedDryer = id;


    document.getElementById(
        "settingsModal"
    ).style.display = "block";


}



function closeSettings(){


    document.getElementById(
        "settingsModal"
    ).style.display = "none";


}





function saveSettings(){


    let t1 =
    document.getElementById(
        "thickness1"
    );


    let t2 =
    document.getElementById(
        "thickness2"
    );


    let date =
    document.getElementById(
        "startDate"
    );



    let data = {};



    if(t1.value !== ""){


        data.thickness1 = {


            name:t1.options[t1.selectedIndex].text,


            mm:Number(
                t1.value
            )


        };


    }




    if(t2.value !== ""){


        data.thickness2 = {


            name:t2.options[t2.selectedIndex].text,


            mm:Number(
                t2.value
            )


        };


    }




    data.startDate =
    date.value;



    mqttClient.publish(

        "susara/" +
        selectedDryer +
        "/settings",

        JSON.stringify(data),

        {
            retain:true
        }

    );



    closeSettings();


}
