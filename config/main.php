<?php

define('FILE_CONFIG', '/etc/controller/alr/config.tsv');

function f_getConfig() {
    return [
        'acp' => [
            'use' => '1'
        ],
        'sock' => [
            'use' => '1',
            'port' => 49174,
            'addr' => '127.0.0.1',
            'timeout'=>1
        ],
        'session' => [
            'use' => '4',
        ],
        'check' => [
            'use' => [1],
        ]
    ];
}
