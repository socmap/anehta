<?php
/*********************************
* JSON CallBack
*********************************/
// 将slave信息存储到xml文件中
require("xml.php");

//加载XML解析类
include_once("class/xml_Class.php");

$xml = "";
$data = "";
$rss = "";
$jsoncallback = "";
if (!empty($_GET["jsoncallback"])){
	$jsoncallback = $_GET["jsoncallback"];
}


// 取所有的XSS Domain
if ($jsoncallback == "getSlaveData"){
	//header("Content-type: text/xml");
	$xml = file_get_contents("../slave/slave.xml"); // 从db中取数据
	
	$data = XML_unserialize($xml);  // 返回数组

	//print_r($data);
	$data = json_encode($data);

	echo $data;
	
	//$data = ""; // 清空	
}


// 获取rss feed
if ($jsoncallback == "getSlaveRSS"){	
	
	if(file_exists("rss.xml")){
		//header("Content-type: text/xml");
		
	  $rss = file_get_contents("rss.xml"); // 从RSS中取数据
	  
	  //echo $rss;
	  $data = XML_unserialize($rss);  // 返回数组
	  //print_r($data);
	  $data = json_encode($data);	
	  echo $data;	
	  //$data = ""; // 清空	
  }
}


// 获取clientproxy
if ($jsoncallback == "getClientProxy"){
	if(file_exists("../slave/clientproxy.xml")){		
	  $clientproxy = file_get_contents("../slave/clientproxy.xml"); // 从RSS中取数据
	  
	  $data = XML_unserialize($clientproxy);  // 返回数组
	  //print_r($data);
	  $data = json_encode($data);	
	  echo $data;	
	  
	  unlink("../slave/clientproxy.xml");
	  //$data = ""; // 清空	
  }
}



?>