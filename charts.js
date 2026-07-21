// charts.js
// Historijski grafovi SCADA v4


const charts = {};

const chartData = {};




// Kreiranje grafova

function createCharts(){


    SCADA_SETTINGS.chambers.forEach(
        chamber => {


        let canvas =
        document.getElementById(
            `chart-${chamber.id}`
        );


        if(!canvas)
            return;



        chartData[chamber.id] = {

            labels: [],

            values: []

        };




        charts[chamber.id] = 
        new Chart(

            canvas,

            {

            type: "line",


            data: {


                labels:
                chartData[chamber.id].labels,


                datasets: [

                    {

                    label:
                    "Temperatura °C",


                    data:
                    chartData[chamber.id].values,


                    tension: 0.3

                    }

                ]

            },


            options: {


                responsive:true,


                scales:{


                    y: {

                        beginAtZero:false,

                        suggestedMax:80

                    }


                }

            }


        });



    });


}








// Dodavanje novog mjerenja

function addChartValue(
    id,
    value
){



    if(!chartData[id])
        return;



    let now =
    new Date()
    .toLocaleTimeString();



    chartData[id]
    .labels
    .push(now);



    chartData[id]
    .values
    .push(
        Number(value)
    );




    // maksimalno 100 tačaka

    if(
        chartData[id].labels.length > 100
    ){

        chartData[id].labels.shift();

        chartData[id].values.shift();

    }



    charts[id].update();



}
