// gauges.js
// Canvas gauge za SCADA v4


const gauges = {};




// Kreiranje svih gauge-ova

function createGauges(){


    SCADA_SETTINGS.chambers.forEach(
        chamber => {


        let canvas =
        document.getElementById(
            `gauge-${chamber.id}`
        );


        if(!canvas)
            return;



        canvas.width = 220;
        canvas.height = 130;



        gauges[chamber.id] = {

            canvas: canvas,

            ctx:
            canvas.getContext("2d"),

            value: 0,

            target: 0

        };



        drawGauge(
            chamber.id
        );


        }

    );



}






// Ažuriranje vrijednosti

function updateGauge(
    id,
    value
){


    if(!gauges[id])
        return;



    gauges[id].target =
    Number(value);



    animateGauge(id);



}






// Animacija kazaljke

function animateGauge(id){



    let gauge =
    gauges[id];



    if(
        Math.abs(
            gauge.value -
            gauge.target
        ) < 0.1
    ){


        gauge.value =
        gauge.target;



        drawGauge(id);

        return;


    }



    gauge.value +=
    (gauge.target -
    gauge.value) * 0.08;



    drawGauge(id);



    requestAnimationFrame(
        () =>
        animateGauge(id)
    );



}







// Crtanje gauge-a

function drawGauge(id){



    let gauge =
    gauges[id];



    if(!gauge)
        return;



    let ctx =
    gauge.ctx;



    let canvas =
    gauge.canvas;



    ctx.clearRect(
        0,
        0,
        canvas.width,
        canvas.height
    );



    let cx =
    canvas.width / 2;



    let cy =
    canvas.height - 15;



    let radius = 80;




    // luk skale

    ctx.beginPath();

    ctx.arc(

        cx,

        cy,

        radius,

        Math.PI,

        0

    );


    ctx.lineWidth = 15;

    ctx.strokeStyle =
    "#555";

    ctx.stroke();





    // kazaljka

    let angle =
    Math.PI +
    (
        gauge.value / 80
    )
    *
    Math.PI;



    let x =
    cx +
    Math.cos(angle)
    *
    radius;



    let y =
    cy +
    Math.sin(angle)
    *
    radius;



    ctx.beginPath();


    ctx.moveTo(
        cx,
        cy
    );


    ctx.lineTo(
        x,
        y
    );


    ctx.lineWidth = 4;

    ctx.strokeStyle =
    getGaugeColor(
        gauge.value
    );


    ctx.stroke();






    // vrijednost

    ctx.font =
    "22px Arial";


    ctx.textAlign =
    "center";


    ctx.fillStyle =
    "white";


    ctx.fillText(

        gauge.value
        .toFixed(1)
        + " °C",

        cx,

        cy - 35

    );



}





// Boja prema temperaturi

function getGaugeColor(value){



    if(
        value >= 65
    )
        return "red";



    if(
        value >= 50
    )
        return "orange";



    return "lime";



}
