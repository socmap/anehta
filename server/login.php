<?php
  //加载auth类
  include_once("class/auth_Class.php");

  header("Content-Type: text/html; charset=utf-8");
?>


<html>
	<head>
		<title>Anehta!</title>
	  <link rel="stylesheet" type="text/css" href="css/style.css" />		
  </head>
  
  <body>

<!-- 以下是自定义部分 -->
<center>
<div id="shiftcontainer" class="shiftcontainer" style="margin-top: 120px;">
  <div class="shadowcontainer" style="width: 400px; ">
    <div class="innerdiv" style="height:300px;font-size: 12px; font-family: verdana; font-weight: bold; color: grey;">
      <img id="logo" style="float:top;z-index: 19999" src="../server/img/logo.jpg" />
      <br><br>
      Anehta Login<br><br>
      <form action="<?php echo $_SERVER['PHP_SELF']; ?>" method=post>
  		  Username: <input type=text name="username" value="" /><br>
  		  Password: <input type=password name="password" value="" /><br>
  		  <input type=submit class="formbutton2" value="login" />
  		  <input type=reset class="formbutton2" style="margin-left: 50px;" value="reset" />  		
  	  </form>
<font style="color:red;">
<?php 

  $error = "用户名或密码错误";  
  
  if (isset($_POST["username"]) && isset($_POST["password"])){  
    if (empty($_POST["username"]) || empty($_POST["password"])){
    	echo "用户名或密码为空";
    	//return false;
    } 
    else {
    	$username = $_POST["username"];
      $password = $_POST["password"];
    	
      if ($username == $U){
      	if ($password == $P){
      		$token = mt_rand(); // 生成token
      		
      		$fp = fopen("../temp/session_token", "w+");
      		fwrite($fp, $token);
      		fclose($fp);
      		
      		$cookieValue = authCode("$username,$password,$token", $textKey, "ENCODE");
      		//echo $cookieValue;  	
      		// 写入cookie	
      		createCookie("anehtaDoor", $cookieValue, 0, '/', '', 0, 1);
      		
      		// 跳转url到referer
      		if (isset($_GET["redirect"])){ // 这里没检查跳转的域，有钓鱼的风险
      			$redirect = $_GET["redirect"];
      			header("Location: $redirect");
      		} else {
      			header("Location: admin.php");
      		}
      		  		  		
      	} else { // 密码错
      	  echo $error;
      	  //return false;	
      	}
      } else {  // 用户名错
      	echo $error;
      	//return false;
      }  
    }
  }
?>
</font>  	    	  
    </div>
  </div>
</div>  	
</center>


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


