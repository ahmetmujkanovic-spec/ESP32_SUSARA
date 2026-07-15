// =====================================================
// SCADA v4 - SVG GAUGE
// =====================================================


function updateGauge(id,temperature){


    let card =
    document.getElementById(
        "dryer_"+id
    );


    if(!card)
        return;



    let circle =
    card.querySelector(
        ".gaugeValue"
    );


    let text =
    card.querySelector(
        ".gaugeTemp"
    );



    if(!circle || !text)
        return;



    // vrijednost 0-100°C

    let value =
    Math.max(
        0,
        Math.min(
            temperature,
            100
        )
    );



    // krug

    let radius = 70;


    let circumference =
    2 * Math.PI * radius;



    circle.style.strokeDasharray =
    circumference;



    let offset =
    circumference -
    (value / 100) *
    circumference;



    circle.style.strokeDashoffset =
    offset;



    // broj temperature

    text.textContent =
    temperature.toFixed(1);



    // boja

    if(temperature >= 65){


        circle.style.stroke =
        "#ff3333";


    }
    else if(temperature >= 40){


        circle.style.stroke =
        "#ffd54f";


    }
    else{


        circle.style.stroke =
        "#00ff99";


    }


}
