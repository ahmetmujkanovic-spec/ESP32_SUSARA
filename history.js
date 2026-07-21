// history.js
// Lokalna historija podataka SCADA v4


const HISTORY_LIMIT = 500;



// Učitavanje historije za sušaru

function loadHistory(id) {


    let data =
        localStorage.getItem(
            "susara_" + id
        );


    if(data) {

        return JSON.parse(data);

    }


    return [];

}




// Spremanje historije

function saveHistory(
    id,
    data
){


    localStorage.setItem(

        "susara_" + id,

        JSON.stringify(data)

    );


}




// Dodavanje nove vrijednosti

function addHistory(
    id,
    value
){


    let history =
        loadHistory(id);



    history.push({

        time:
        new Date()
        .toISOString(),


        temperature:
        Number(value)

    });



    // ograničenje broja zapisa

    if(
        history.length > HISTORY_LIMIT
    ){

        history.shift();

    }



    saveHistory(
        id,
        history
    );


}




// Dohvat historije

function getHistory(id){

    return loadHistory(id);

}




// Brisanje historije

function clearHistory(id){


    localStorage.removeItem(

        "susara_" + id

    );


}
