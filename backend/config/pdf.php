<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Driver
    |--------------------------------------------------------------------------
    |
    | Currently only "browsershot" is supported.
    |
    */

    'driver' => 'browsershot',

    /*
    |--------------------------------------------------------------------------
    | Browsershot options
    |--------------------------------------------------------------------------
    |
    | These options are passed to the Browsershot instance.
    |
    */

    'browsershot' => [
        'node_binary' => env('NODE_BINARY', '/usr/bin/node'),
        'npm_binary' => env('NPM_BINARY', '/usr/bin/npm'),
        'timeout' => 60,
        'no_sandbox' => true,
        'options' => [
            'format' => 'A4',
            'displayHeaderFooter' => false,
            'printBackground' => true,
        ],
    ],

];
