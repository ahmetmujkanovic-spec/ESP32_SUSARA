// dryingPrograms.js
// Režimi sušenja

const DRYING_PROGRAMS = {

    hrast:{

        27:[

            {min:40, max:101, dry:53, delta:3.5},
            {min:30, max:40,  dry:57, delta:4.5},
            {min:20, max:30,  dry:60, delta:8.5},
            {min:15, max:20,  dry:64, delta:12},
            {min:10, max:15,  dry:66, delta:15},
            {min:0,  max:10,  dry:69, delta:21}

        ],

        32:[

            {min:40, max:101, dry:50, delta:3},
            {min:30, max:40,  dry:54, delta:4},
            {min:20, max:30,  dry:57, delta:8},
            {min:15, max:20,  dry:61, delta:11},
            {min:10, max:15,  dry:63, delta:15},
            {min:0,  max:10,  dry:66, delta:20}

        ],

        38:[

            {min:40, max:101, dry:50, delta:3},
            {min:30, max:40,  dry:54, delta:4},
            {min:20, max:30,  dry:57, delta:8},
            {min:15, max:20,  dry:61, delta:11},
            {min:10, max:15,  dry:63, delta:15},
            {min:0,  max:10,  dry:66, delta:20}

        ],

        48:[

            {min:40, max:101, dry:47, delta:3},
            {min:30, max:40,  dry:51, delta:4},
            {min:20, max:30,  dry:54, delta:7.5},
            {min:15, max:20,  dry:57, delta:10},
            {min:10, max:15,  dry:60, delta:14},
            {min:0,  max:10,  dry:63, delta:19}

        ]

    }

};
