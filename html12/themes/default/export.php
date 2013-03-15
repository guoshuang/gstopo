$json = json_decode($_GET['json'], true);

    $output = '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" width="'.$json[0]['width'].'" height="'.$json[0]['height'].'" xml:space="preserve"><desc>Created with Raphael</desc><defs></defs>';

    for ($i=1; $i &lt; count($json); $i++) {
        if ($json[$i]['type'] == "image") {
            $base64 = base64_encode(file_get_contents($json[$i]['src']));

            $output .= '<image overflow="visible" x="'.$json[$i]["x"].'" y="'.$json[$i]["y"].'" width="'.$json[$i]["width"].'" height="'.$json[$i]["height"].'" transform="'.$json[$i]["transform"].'" preserveAspectRatio="none" xlink:href="data:image/png;base64,'.$base64.'"></image>';
        }

        if ($json[$i]['type'] == "path") {
            $output .= '<path fill="'.$json[$i]['fill'].'" stroke="'.$json[$i]['stroke'].'" d="'.$json[$i]['path'].'" style="opacity: '.$json[$i]['opacity'].';" opacity="'.$json[$i]['opacity'].'" transform="'.$json[$i]['transform'].'"></path>';
        }
    }

    $output .= '</svg>';