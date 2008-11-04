<html><meta http-equiv=content-type content="text/html; charset=utf-8">
	<head>
		
		<script>
			// 刷新页面(性能不好)
			function timeRefresh(period){
	 	     setInterval(function(){window.location.reload(true);}, period);
	 	  }
	 	  
	 	  // 拷贝水印到父窗口的input框中
	 	  function copywm(a){
	 	  	//alert(a.name);
	 	  	parent.document.getElementById("slave").value=a.name;
	 	  }
	 	  
	 	  function requestMail(b){
	 	  	//alert(b.name);
	 	    var image = new Image();
	      image.style.width = 0;
	      image.style.height = 0;
	      
	      image.src = "../server/mail.php?delslavelog="+b.name;
	 	  }
	 	  
	 	</script>
		
	  Slave Monitor:
  </head>
	<body onload="timeRefresh(6000);">

	<?php
	
	  // 加载XSS过滤库
    require_once ("../server/safe_php/Safe.php");
    $parser =& new HTML_Safe();
    
    //date_default_timezone_set(date_default_timezone_get());
    date_default_timezone_set('Asia/Shanghai');
    
    // 读slave目录下目录名
    if ($handle = opendir('.')) {
      while (false !== ($file = readdir($handle))) {
        if ($file != "." && $file != ".." && substr($file, 0, 6) == "Slave_") {
        	  // 获取watermark
        	  $slave = $file;
        	  if (file_exists($slave."/log.txt")){
        	    $LastModified = date("F d Y H:i:s.", filemtime($slave."/log.txt"));
        	    
        	    // 过滤XSS
        	    $slave = $parser->parse($slave);
        	    $parser->clear();
        	    
        	    $LastModified = $parser->parse($LastModified);
        	    $parser->clear();
        	  
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