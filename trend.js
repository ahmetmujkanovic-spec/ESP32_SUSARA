// =====================================================
// SCADA v4 - TEMPERATURE TREND
// =====================================================


function addTrendValue(id,value){


    if(!dryers[id])
        return;


    let d = dryers[id];


    d.history.push(value);


    // čuvamo zadnjih 50 vrijednosti

    if(d.history.length > 50){

        d.history.shift();

    }


    drawTrend(id);

}



// =====================================================
// CRTANJE GRAFA
// =====================================================

function drawTrend(id){


    let card =
    document.getElementById(
        "dryer_"+id
    );


    if(!card)
        return;



    let canvas =
    card.querySelector(
        ".trendCanvas"
    );


    if(!canvas)
        return;



    let ctx =
    canvas.getContext(
        "2d"
    );



    let width =
    canvas.clientWidth;


    let height =
    canvas.clientHeight;



    canvas.width =
    width;


    canvas.height =
    height;



    ctx.clearRect(
        0,
        0,
        width,
        height
    );



    let data =
    dryers[id].history;



    if(data.length < 2)
        return;



    let max =
    Math.max(
        ...data,
        100
    );


    let min =
    Math.min(
        ...data,
        0
    );



    ctx.beginPath();



    data.forEach((v,i)=>{


        let x =
        i *
        (width/(data.length-1));



        let y =
        height -
        ((v-min)/(max-min))
        *
        height;



        if(i===0)

            ctx.moveTo(
                x,
                y
            );

        else

            ctx.lineTo(
                x,
                y
            );


    });



    ctx.strokeStyle =
    "#00ff99";


    ctx.lineWidth =
    2;


    ctx.stroke();



}
