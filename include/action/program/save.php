<?php

namespace program;

class save {

    public static function getUser() {
        return ['stranger' => '*'];
    }

    public static function execute($p) {
        $file = \fopen(FILE_CONFIG, "w");
        if (!$file) {
            throw new \Exception('fopen failed');
        }
        foreach ($p as $v) {
            $r = fputcsv($file, $v, "\t", "\n");
            if (!$r) {
                \fclose($file);
                throw new \Exception('fputcsv failed');
            }
        }
        \fclose($file);
    }

}
