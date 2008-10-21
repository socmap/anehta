<?php
//将接收到的cookie写入webproxy的cookie文件中
$customecookie = $_SERVER['QUERY_STRING'];

$fp = fopen("tools\\glype\\cookie.txt", "w+");

fwrite($fp, urldecode($customecookie));

fclose($fp);

?>