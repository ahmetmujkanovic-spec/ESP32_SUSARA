// =====================================================
// SCADA v4 - SERVICE WORKER
// =====================================================

const CACHE_NAME = "scada-v4-cache-v29";

const FILES_TO_CACHE = [


    "./index.html",

    "./style.css",

    "./manifest.json",

    "./app.js",

    "./settings.js",

    "./settingsUI.js",

    "./cards.js",

    "./gauges.js",

    "./charts.js",

    "./alarms.js",

    "./cycle.js",

    "./mqtt.js",

    "./icon-192.png",

    //"./icon-512.png"

];


// =====================================================
// INSTALL
// =====================================================

self.addEventListener(
"install",
event=>{


    event.waitUntil(

        caches.open(CACHE_NAME)
        .then(cache=>{

            return cache.addAll(
                FILES_TO_CACHE
            );

        })

    );


    self.clients.matchAll()
    .then(clients=>{

        clients.forEach(client=>{

            client.postMessage({

                type:"UPDATE_AVAILABLE"

            });

        });

    });


    self.skipWaiting();


});


// =====================================================
// ACTIVATE
// =====================================================

self.addEventListener(
"activate",
event=>{


    event.waitUntil(

        caches.keys()
        .then(keys=>{


            return Promise.all(

                keys.map(key=>{


                    if(key !== CACHE_NAME){

                        return caches.delete(key);

                    }


                })

            );


        })

    );


    self.clients.claim();


});



// =====================================================
// FETCH
// =====================================================

self.addEventListener(
"fetch",
event=>{


    event.respondWith(

        caches.match(event.request)
        .then(response=>{


            if(response){

                return response;

            }


            return fetch(event.request);


        })

    );


});
