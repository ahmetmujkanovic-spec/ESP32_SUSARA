// =====================================================
// SCADA v4 - APP CORE
// =====================================================

const dryers = {};

let alarmTotal = 0;


// =====================================================
// KREIRANJE KARTICE
// =====================================================

function createDryer(id){

    if(dryers[id]) return;


    const template =
        document.getElementById("dryerTemplate");


    const clone =
        template.content.cloneNode(true);


    const card =
        clone.querySelector(".dryerCard");


    card.id = "dryer_" + id;


    clone.querySelector(".dryerNumber").innerHTML = id;


    document
    .getElementById("dryerGrid")
    .appendChild(clone);



    dryers[id]={

        id:id,

        suhi:null,

        vlazni:null,

        delta:null,

        status:"UNKNOWN",

        thickness1:null,
        
        thickness2:null,

        startDate:null,

        duration:null,
        
        lastSeen:Date.now(),

        alarm:false,

        history:[]

    };


    console.log("Nova sušara:",id);


    updateGauge(id,0);

}
//računanje trajanja ciklusa sušenja
function calculateDuration(start)
{
    if(!start)
        return "--";


    let begin = new Date(start);
    let now = new Date();


    let diff = now - begin;


    let days = Math.floor(
        diff / (1000*60*60*24)
    );


    return days + " dana";
}

// =====================================================
// AŽURIRANJE PODATAKA
// =====================================================

function updateValue(id,field,value){


    if(!dryers[id]){

        createDryer(id);

    }


    let d=dryers[id];


    d.lastSeen=Date.now();


    if(field==="suhi"){

        d.suhi=value;

        addTrendValue(id,value);

    }


    if(field==="vlazni"){

        d.vlazni=value;

    }


    if(field==="delta"){

        d.delta=value;

    }


    if(field==="status"){

        d.status=value;

    }



    refreshCard(id);


}


// =====================================================
// OSVJEŽAVANJE KARTICE
// =====================================================

function refreshCard(id){


    let d=dryers[id];


    let card=document.getElementById(
        "dryer_"+id
    );


    if(!card) return;



    let suhi =
        card.querySelector(".suhi");


    let vlazni =
        card.querySelector(".vlazni");


    let delta =
        card.querySelector(".delta");
    
let thickness =
    card.querySelector(".thickness");

let startDate =
    card.querySelector(".startDate");

let duration =
    card.querySelector(".duration");

    let status =
        card.querySelector(".stateBadge");


    if(d.suhi!==null)
        suhi.innerHTML=d.suhi.toFixed(1)+" °C";


    if(d.vlazni!==null)
        vlazni.innerHTML=d.vlazni.toFixed(1)+" °C";


    if(d.delta!==null)
        delta.innerHTML=d.delta.toFixed(1)+" °C";



    // Gauge koristi suhu temperaturu

    if(d.suhi!==null){

        updateGauge(id,d.suhi);

    }



    // Alarm temperatura

    if(d.suhi>65){

        setAlarm(id,true);

    }
    else{

        setAlarm(id,false);

    }



    if(d.status==="ONLINE"){

        status.innerHTML="ONLINE";

        status.className="stateBadge online";

    }

if(thickness)
{
    if(d.thickness!==null)
        thickness.innerHTML =
        d.thickness + " mm";
}


if(startDate)
{
    if(d.startDate)
        startDate.innerHTML =
        new Date(d.startDate)
        .toLocaleString();
}


if(duration)
{
    duration.innerHTML =
    calculateDuration(d.startDate);
}
    
}


// =====================================================
// ALARM
// =====================================================

function setAlarm(id,state){


    let d=dryers[id];

    if(d.alarm===state)
        return;


    d.alarm=state;


    let card=document.getElementById(
        "dryer_"+id
    );


    if(state){

        card.classList.add("cardAlarm");

        alarmTotal++;

    }
    else{

        card.classList.remove("cardAlarm");

        alarmTotal--;

        if(alarmTotal<0)
            alarmTotal=0;

    }


    document
    .getElementById("alarmCount")
    .innerHTML=alarmTotal;

}


// =====================================================
// MQTT PODACI
// =====================================================

function mqttData(topic,message){


    let parts=topic.split("/");


    /*
       susara/1/suhi

       parts[0] = susara
       parts[1] = broj
       parts[2] = podatak
    */


    if(parts.length<3)
        return;


    let id=parts[1];

    let field=parts[2];


    let value;


    if(field==="status"){

        value=message;

    }
    else{

        value=parseFloat(message);

        if(isNaN(value))
            return;

    }


    updateValue(
        id,
        field,
        value
    );


    document
    .getElementById("lastUpdate")
    .innerHTML=
    new Date()
    .toLocaleTimeString();


}


// =====================================================
// ONLINE BROJ
// =====================================================

function updateOnlineCount(){


    let count=0;


    for(let id in dryers){


        let d=dryers[id];


        if(Date.now()-d.lastSeen < 120000){

            count++;

        }

    }


    document
    .getElementById("onlineCount")
    .innerHTML=count;

}


// =====================================================
// OFFLINE DETEKCIJA
// =====================================================

setInterval(()=>{


    for(let id in dryers){


        let d=dryers[id];


        let card=
        document.getElementById(
            "dryer_"+id
        );


        let badge=
        card.querySelector(".stateBadge");



        if(Date.now()-d.lastSeen > 120000){


            card.classList.add(
                "cardOffline"
            );


            badge.innerHTML="OFFLINE";

            badge.className=
            "stateBadge offline";


        }
        else{


            card.classList.remove(
                "cardOffline"
            );


            if(!d.alarm){

                badge.innerHTML="ONLINE";

                badge.className=
                "stateBadge online";

            }

        }


    }


    updateOnlineCount();


},10000);
