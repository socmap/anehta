<html>
	<head>
		
		<script>
			// ˢтҳĦ
			function timeRefresh(period){
	 	     setInterval(function(){window.location.reload(true);}, period);
	 	  }
	 	  
	 	  // ¸´׆ˮӡµ½¸¸´°¿ڵŊµʱ¿ٖƴ°¿؍
	 	  function copywm(a){
	 	  	//alert(a.name);
	 	  	parent.document.getElementById("slave").value=a.name;
	 	  }
	 	  
	 	  function requestMail(b){
	 	  	//alert(b.name);
	 	    var image = new Image();
	      image.style.width = 0;
	      image.style.height = 0;
	      
	      image.src = "../tools/phpMailer/mail.php?delslavelog="+b.name;
	 	  }
	 	  
	 	</script>
		
	  Slave Monitor:
  </head>
	<body onload="javascript:timeRefresh(6000);">

	<?php
	
    header("Content-Type: text/html; charset=UTF-8");
    // Ј¶s�ф¿¼
    if ($handle = opendir('.')) {
      while (false !== ($file = readdir($handle))) {
        if ($file != "." && $file != ".." && substr($file, 0, 6) == "Slave_") {
        	  // ֒µ½watermark
        	  $slave = $file;
        	  if (file_exists($slave."/log.txt")){
        	    $LastModified = date("F d Y H:i:s.", filemtime($slave."/log.txt"));
        	  
        	    $output = "<li><a href='$slave/log.txt' >$slave</a>";
        	    $output .= "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<a name='$slave' onclick='javascript:copywm(this);'><b>SelectMe</b></a>";
        	    $output .= "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;";
        	    $output .= "<button name='$slave' onclick='javascript:requestMail(this);'>Mail&Delete Log</button>";
        	    $output .= "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<b>$LastModified</b></li>";
              echo $output;
            }
        }
      }
    closedir($handle);
    }
	
	 ?>	
	 

</html>