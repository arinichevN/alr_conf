<?php

namespace program;

class geta {

    public static function getUser() {
        return ['stranger' => '*'];
    }

    public static function execute() {
        $file = \fopen(FILE_CONFIG, "r");
        if (!$file) {
            throw new \Exception('fopen failed');
        }
        $data = [[
        'sock_port' => null,
        'pid_path' => null,
        'sock_buf_size' => null,
        'cycle_duration_sec' => null,
        'cycle_duration_nsec' => null,
        'cope_duration' => null,
        'call_interval' => null,
        'log_limit' => null,
        'sum_interval' => null,
        'phone_number_group_id' => null,
        'cell_peer_id' => null,
        'db_data_path' => null,
        'db_public_path' => null,
        'db_log_path' => null
        ]];
        $n = fscanf($file, "%d\t%255s\t%d\t%ld\t%ld\t%ld\t%ld\t%d\t%ld\t%d\t%32s\t%255s\t%255s\t%255s\n", $data[0]['sock_port'], $data[0]['pid_path'], $data[0]['sock_buf_size'], $data[0]['cycle_duration_sec'], $data[0]['cycle_duration_nsec'], $data[0]['cope_duration'], $data[0]['call_interval'], $data[0]['log_limit'], $data[0]['sum_interval'], $data[0]['phone_number_group_id'], $data[0]['cell_peer_id'], $data[0]['db_data_path'], $data[0]['db_public_path'], $data[0]['db_log_path']);
        if ($n != 14) {
            \fclose($file);
            throw new \Exception('bad format');
        }
        \fclose($file);
        return $data;
    }

}
