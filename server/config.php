<html><meta http-equiv=content-type content="text/html; charset=utf-8">
	<head>
		Anehta Config
		<script src="../library/anehta.js"></script>
  </head>
  <body>
  	
  	<form id="anehtaconfig" name="anehtaconfig" action="<?php $_SERVER['PHP_SELF']; ?>" method="post" onsubmit="return encodeparam(this);">
  		Anehta URL: <input type="text" id="anehtaurl" name="anehtaurl" value="" />
  		<div>Boomerang Target: <input type="text" id="boomerangtarget" name="boomerangtarget" value="" /> <br />
  			   Boomerang Src: <input type="text" id="boomerangsrc" name="boomerangsrc" value="" />
  		</div>
  		<br /><br />
  		<div>Mail Server Config -- coming soon. please modify mail.php to change mailaddress.
  			
  		</div>
  		<script>
        function encodeparam(f){
        	var inputs = f.getElementsByTagName("input");
        	for (i=0; i<inputs.length; i++){        		
  		      inputs[i].value = anehta.crypto.base64Encode(inputs[i].value);
  		      //alert(inputs[i].name+"  "+inputs[i].value);
  		    }
  		    anehta.core.freeze(200);
  		    f.submit();
  		  }	
  		</script>
  		<input type="submit" value="save" />
  	</form>
  	
  </body>
</html>

<?php
/*
* 统一配置anehta 配置文件
* 包括： anehtaurl, mail server, auth 等
*
*/

  require("xml.php");

  // 全部base64编码进入xml文件，否则可能被xpath注射
  if (!empty($_POST['anehtaurl']))
    //$anehtaurl = base64_encode($_POST['anehtaurl']);
    $anehtaurl = $_POST['anehtaurl'];
  if (!empty($_POST['boomerangtarget']))  
    //$boomerangtarget = base64_encode($_POST['boomerangtarget']);
    $boomerangtarget = $_POST['boomerangtarget'];
  if (!empty($_POST['boomerangsrc']))
    //$boomerangsrc = base64_encode($_POST['boomerangsrc']);
    $boomerangsrc = $_POST['boomerangsrc'];
  
  $fpath = 'config.xml';//文件的路径，不用手动创建文件
  
  if (file_exists($fpath) == false){ //配置文件不存在就生成一个
    $anehtaConfig = new OpXML('anehtaConfig',$fpath);

    //增加一条记录
    $arr = array('homepage'=>'http://anehta.googlecode.com','author'=>'axis','blog'=>'http://hi.baidu.com/aullik5','team'=>'http://www.ph4nt0m.org');
    $anehtaConfig->insert($arr);
  } else { //配置文件存在，开始更新记录
  	$anehtaConfig = new OpXML('anehtaConfig',$fpath);
  	
  	//增加一条记录
    $arr = array('homepage'=>'http://anehta.googlecode.com','author'=>'axis','blog'=>'http://hi.baidu.com/aullik5','team'=>'http://www.ph4nt0m.org');
    $anehtaConfig->updateRecordById(1, $arr);

    // 根据提交的配置信息插入xml文件
    if ($anehtaurl && $boomerangtarget && $boomerangsrc){
      $arr = array('anehtaurl'=>$anehtaurl, 'boomerangtarget'=>$boomerangtarget, 'boomerangsrc'=>$boomerangsrc);
    } else {
    	echo "Please complete the configure!";
    	exit;
    }

    if ($anehtaConfig->getRecordById(2)) { // 有记录则更新
      $anehtaConfig->updateRecordById(2, $arr);
    } else { // 没有则插入
    	$anehtaConfig->insert($arr);
    }
  }

  //读取配置
  $config = $anehtaConfig->getRecordById(2);
  
  reset($config);
  while (list($key, $val) = each($config))
  {
  	$val = htmlspecialchars(base64_decode($val));
    echo "<b>$key</b> => $val<br />";
  }
  
  
  //更新配置文件
  
  //更新anehtaurl  在 anehta.js feed.js clx.js中
  $write_anehtaurl = base64_decode($config["anehtaurl"]);
  
  //unlink("../library/anehta.js");
  $anehta_raw = file_get_contents("../library/anehta_raw");
  $fp = fopen("../library/anehta.js", "w+");
  fwrite($fp, "var anehtaurl = \"$write_anehtaurl\";\r\n".$anehta_raw);
  fclose($fp);
  
  //unlink("../feed.js");
  $feed_raw = file_get_contents("../feed_raw");
  $fp = fopen("../feed.js", "w+");
  fwrite($fp, "var anehtaurl = \"$write_anehtaurl\";\r\n".$feed_raw);
  fclose($fp);
  
  //unlink("../module/clx.js");
  $clx_raw = file_get_contents("../module/clx_raw");
  $fp = fopen("../module/clx.js", "w+");
  fwrite($fp, "var anehtaurl = \"$write_anehtaurl\";\r\n".$clx_raw);
  fclose($fp);
  
  
  // 更新boomerang 的target和src
  $write_booemrangtarget = base64_decode($config["boomerangtarget"]);
  $write_boomerangsrc = base64_decode($config["boomerangsrc"]);
  $boomerang_raw = file_get_contents("../module/boomerang_raw");
  $fp = fopen("../module/boomerang.js", "w+");
  fwrite($fp, "var target = \"$write_booemrangtarget\";\r\n"."var org_url = \"$write_boomerangsrc\";\r\n".$boomerang_raw);
  fclose($fp);
  
?>

