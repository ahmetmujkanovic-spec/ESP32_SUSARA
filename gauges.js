// gauges.js

const gauges={};



function createGauges(){


SCADA_SETTINGS.chambers.forEach(
chamber=>{


let canvas =
document.getElementById(
"gauge-"+chamber.id
);



if(!canvas)
return;



canvas.width=180;
canvas.height=120;



gauges[chamber.id]={

canvas:canvas,

ctx:canvas.getContext("2d"),

value:0,

target:0

};



drawGauge(chamber.id);



});


}






function updateGauge(id,value){


if(!gauges[id])
return;


gauges[id].target =
Number(value);


animateGauge(id);


}






function animateGauge(id){


let g=gauges[id];


g.value +=
(g.target-g.value)*0.1;



drawGauge(id);



if(
Math.abs(g.target-g.value)>0.1
)

requestAnimationFrame(
()=>animateGauge(id)
);


}






function drawGauge(id){


let g=gauges[id];


let ctx=g.ctx;

let c=g.canvas;


ctx.clearRect(
0,0,c.width,c.height
);



ctx.beginPath();


ctx.arc(
90,
90,
65,
Math.PI,
0
);



ctx.lineWidth=12;

ctx.strokeStyle="#2b3744";

ctx.stroke();





let angle =
Math.PI +
(g.value/80)*Math.PI;



ctx.beginPath();


ctx.moveTo(
90,90
);


ctx.lineTo(
90+Math.cos(angle)*65,
90+Math.sin(angle)*65
);



ctx.strokeStyle=
g.value>65?
"#ff5555":
"#00ff99";


ctx.lineWidth=4;

ctx.stroke();





ctx.fillStyle="white";

ctx.font="22px Segoe UI";

ctx.textAlign="center";


ctx.fillText(

g.value.toFixed(1)+"°C",

90,

55

);



}
