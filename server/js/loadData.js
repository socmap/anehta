var jTools = new Jsoner();
// 从server取数据到本地
function initData(){
	/**************************
	* 各种效果
	**************************/ 
  setTimeout(function(){$("#logo").effect("bounce", {}, 400);}, 3000);
  $("#logo").click(function(){$("#logo").effect("bounce", {}, 400);});
  
  //$("#basictab > li").effect("slide", {direction:"down"}, 800);
  
  if (document.getElementById("xssSites")){
    setTimeout(function(){
    	$("#xssSites").effect("slide", {direction:"left"}, 800);
    	$("#xssSites")[0].style.visibility = "visible";
    	}, 50); 
  	$("#xssSites").draggable();	
  }
  	
  //$("#shiftcontainer").effect("bounce", {}, 800);
  
  // 可拖拽
  $("#logo").draggable();  
  //$("#shiftcontainer").draggable();	
  $("li").draggable();	
	$("td").draggable();		    	
		    	
		    	
	/**************************
	* 初始化数据
	**************************/ 		    	
	// 先取一次记录
	$.getJSON("../server/jsoncallback.php?jsoncallback=getSlaveData",
	    function(data){
	    	//alert(data);
	    	// 所有slave记录都存到cache中
	    	anehtaCache.setItem("slaveRecords", data.slaveData);
	    	
        // 释放内存
	      setTimeout(function(){data = null;}, 500);	    	
	    	
	    });	 
	setTimeout(function(){loadXSSsites();},1000);
	
	// 然后每隔10秒钟去取一次slave记录
	setInterval(function(){
		var key;
		if (slaveData){
		  key = slaveData.record.length;
	  } else {
	  	key = 1;
	  }
	  	
		var ts = new Date();
	  $.getJSON("../server/jsoncallback.php?jsoncallback=updateSlaveData&key="+key+"&ts="+ts.getTime(),
    //$.getJSON("../server/jsoncallback.php?jsoncallback=getSlaveData",
	    function(data){
	    	//alert(data);
	    	// 所有slave记录都存到cache中
	    	if (slaveData){ // 已经有定义; 需要把更新的记录附在原来的后面两个json对象
	    		for (i=0; i<data.length; i++){
	    		  jTools.addChild(slaveData, "record", data[i]);
	    	  }
	    		//alert(slaveData.record.length);

	    		anehtaCache.setItem("slaveRecords", slaveData);
	    		
	    	} else { // 没有定义
	    	  //anehtaCache.setItem("slaveRecords", data.slaveData);
	    	  setTimeout(function(){ window.location.reload(true);}, 2000); // 刷新页面
	      }

        // 释放内存
	      setTimeout(function(){data = null;}, 500);	    	
	    	
	    });	    	
	  setTimeout(function(){loadXSSsites();},1000);
	},
	20000);	   	// 20秒    	 
	 	
}	


/*************************************
* 动态生成 left bar
*************************************/
var slaveData;	
var slaveWatermark = new Array();
var slaves = new Array();  // slave 的获取和判断放到了 dropdownmenu()函数中

function loadXSSsites(){
	//alert("load XSS Sites");
	// 释放内存先
	slaveData = null;
	slaveData = anehtaCache.getItem("slaveRecords");	
		
  var requestURI;
  var xssDomain
  var sites = new Array();
  var tag;
  var leftbar;

  if ($d.getElementById("xssSites")){
    leftbar = $("#xssSites")[0]; // 获取div  
    
    if (!slaveData){
    	return false;
    }

    // 获取sites
	  for (i=0; i< slaveData.record.length; i++){
	  	//alert(anehta.crypto.base64Decode(slaveData.record[i].xssGot.ajaxPostResponse));	  	
	  	requestURI = $.trim(slaveData.record[i].xssGot.requestURI);
	  	xssDomain = requestURI.split('/');  // 获取domain
	  	xssDomain = xssDomain[2];
	  	
	  	sites[i] = xssDomain;		
	  	
	  	// 检查是否有相同记录
	    if (i>0){
	  		tag = 0;
	  		for (j=0; j<i; j++){
	  			if (sites[i] == sites[j]){
	  				//alert("catch the duplicated!");
	  				tag = 1;
	  				break;
	  			}
	  		}
	  		
	  		if (tag ==1){
	  			continue;
	  		}			
	  	}	
	  	
	  	// 如果和现有的li里记录相同则也不增加
	  	tag = 0;
	  	for (j=0; j<leftbar.getElementsByTagName('ul')[0].getElementsByTagName('li').length; j++){
	  		if ( sites[i] == leftbar.getElementsByTagName('ul')[0].getElementsByTagName('li')[j].getElementsByTagName('a')[0].innerHTML){
	  		   tag = 1;   	
	  		   break;   	
	  		}	
	  	}
	  	
	  	if (tag == 1){
	  		continue;
	  	}
	  	
	  	// 增加一个site记录
	  	var li = $d.createElement('li');
	  	li.innerHTML = "<a onMouseover=\"dropdownmenu(this, event, slaves, '150px')\" onMouseout=\"delayhidemenu()\" href='#'>"+xssDomain+"<\/a>";
	  	leftbar.getElementsByTagName('ul')[0].appendChild(li);
	  }		
  }	
  
  // 释放内存
  setTimeout(function(){sites = null;}, 1000);

}



/*******************************************
* 根据 slaveid生成滑动menu
*******************************************/
/***********************************************
* AnyLink Vertical Menu- © Dynamic Drive (www.dynamicdrive.com)
* This notice MUST stay intact for legal use
* Visit http://www.dynamicdrive.com/ for full source code
***********************************************/

//Contents for menu 1
var menu1=new Array()
menu1[0]='<a href="http://www.javascriptkit.com">JavaScript Kit</a>'

//Contents for menu 2, and so on
var menu2=new Array()
		
var disappeardelay=250  //menu disappear speed onMouseout (in miliseconds)
var horizontaloffset=2 //horizontal offset of menu from default location. (0-5 is a good value)

/////No further editting needed

var ie4=document.all
var ns6=document.getElementById&&!document.all

if (ie4||ns6)
  document.write('<div id="dropmenudiv" style="visibility:hidden;width: 160px" onMouseover="clearhidemenu()" onMouseout="dynamichide(event)"></div>')

function getposOffset(what, offsettype){
  var totaloffset=(offsettype=="left")? what.offsetLeft : what.offsetTop;
  var parentEl=what.offsetParent;
  while (parentEl!=null){
    totaloffset=(offsettype=="left")? totaloffset+parentEl.offsetLeft : totaloffset+parentEl.offsetTop;
    parentEl=parentEl.offsetParent;
  }
  return totaloffset;
}


function showhide(obj, e, visible, hidden, menuwidth){
  if (ie4||ns6)
    dropmenuobj.style.left=dropmenuobj.style.top=-500
  dropmenuobj.widthobj=dropmenuobj.style
  dropmenuobj.widthobj.width=menuwidth
  if (e.type=="click" && obj.visibility==hidden || e.type=="mouseover")
    obj.visibility=visible
  else if (e.type=="click")
    obj.visibility=hidden
}

function iecompattest(){
  return (document.compatMode && document.compatMode!="BackCompat")? document.documentElement : document.body
}

function clearbrowseredge(obj, whichedge){
  var edgeoffset=0
  if (whichedge=="rightedge"){
    var windowedge=ie4 && !window.opera? iecompattest().scrollLeft+iecompattest().clientWidth-15 : window.pageXOffset+window.innerWidth-15
    dropmenuobj.contentmeasure=dropmenuobj.offsetWidth
    if (windowedge-dropmenuobj.x-obj.offsetWidth < dropmenuobj.contentmeasure)
      edgeoffset=dropmenuobj.contentmeasure+obj.offsetWidth
  }
  else{
    var topedge=ie4 && !window.opera? iecompattest().scrollTop : window.pageYOffset
    var windowedge=ie4 && !window.opera? iecompattest().scrollTop+iecompattest().clientHeight-15 : window.pageYOffset+window.innerHeight-18
    dropmenuobj.contentmeasure=dropmenuobj.offsetHeight
    if (windowedge-dropmenuobj.y < dropmenuobj.contentmeasure){ //move menu up?
      edgeoffset=dropmenuobj.contentmeasure-obj.offsetHeight
      if ((dropmenuobj.y-topedge)<dropmenuobj.contentmeasure) //up no good either? (position at top of viewable window then)
        edgeoffset=dropmenuobj.y
    }
  }
  return edgeoffset
}

function populatemenu(what){
  if (ie4||ns6)
    dropmenuobj.innerHTML=what.join("")
}


var obj_call_dropdownmenu;
function dropdownmenu(obj, e, menucontents, menuwidth){
	obj_call_dropdownmenu = obj; // 标记是谁调用的本函数
	// 根据xssDomain获取slaves
	//slaveData = anehtaCache.getItem("slaveRecords");	
			
	for (i=0; i< slaveData.record.length; i++){						  
    if ( ($.trim(slaveData.record[i].xssGot.requestURI).split('/'))[2] == obj.innerHTML){
    	// 从cache中取出slave watermark, 只取出在当前域名下的记录
	    slaveWatermark[i] = $.trim(slaveData.record[i].slaveWatermark);
			//alert("进入域名判断"+slaveWatermark[i]);
			
			// 检查是否有相同记录
	    if (i>0){
		  	tag = 0;
		  	for (j=0; j<i; j++){
		  		if (slaveWatermark[i] == slaveWatermark[j]){
		  			//alert("catch the duplicated!");
		  			tag = 1;
		  			break;
		  		}
		  	}
		  	
		  	if (tag ==1){
		  		continue;
		  	}			
		  }	
		//alert("after catch"+slaveWatermark[i]);  
		slaves[i] = "<a onclick='return dosomething(this);' href='#'>"+slaveWatermark[i]+"</a>";
		}				
	}	
		
  if (window.event) event.cancelBubble=true
    else if (e.stopPropagation) e.stopPropagation()
      clearhidemenu()
  dropmenuobj=document.getElementById? document.getElementById("dropmenudiv") : dropmenudiv
  populatemenu(menucontents)
  
  if (ie4||ns6){
    showhide(dropmenuobj.style, e, "visible", "hidden", menuwidth)
    dropmenuobj.x=getposOffset(obj, "left")
    dropmenuobj.y=getposOffset(obj, "top")
    dropmenuobj.style.left=dropmenuobj.x-clearbrowseredge(obj, "rightedge")+obj.offsetWidth+horizontaloffset+"px"
    dropmenuobj.style.top=dropmenuobj.y-clearbrowseredge(obj, "bottomedge")+"px"
  }
  
  slaves = new Array(); // clear
  slaveWatermark = new Array();
  return clickreturnvalue()
}

function clickreturnvalue(){
  if (ie4||ns6) return false
  else return true
}

function contains_ns6(a, b) {
  while (b.parentNode)
    if ((b = b.parentNode) == a)
      return true;
    return false;
}

function dynamichide(e){
  if (ie4&&!dropmenuobj.contains(e.toElement))
    delayhidemenu()
  else if (ns6&&e.currentTarget!= e.relatedTarget&& !contains_ns6(e.currentTarget, e.relatedTarget))
    delayhidemenu()
}

function hidemenu(e){
  if (typeof dropmenuobj!="undefined"){
    if (ie4||ns6)
      dropmenuobj.style.visibility="hidden"
  }
}

function delayhidemenu(){
  if (ie4||ns6)
    delayhide=setTimeout("hidemenu()",disappeardelay)
}

function clearhidemenu(){
  if (typeof delayhide!="undefined")
    clearTimeout(delayhide)
}


/*******************************************
* 把所有的slave记录mail到邮箱
* 并在服务器上删除
*******************************************/
function dumpToMail(){
  var confirm = document.createElement("div");
  confirm.id = "confirm_mail";
  confirm.style.border = "1px solid black";
  confirm.style.background = "white";
  confirm.innerHTML = "<div style='float:left; margin: 15 15 15 15px; fontFamily: Verdana,Arial,Helvetica,sans-serif; font-size:14px;  color: #200;'>" + 
                      "您确定要在服务器上删除所有Slave记录，并发送至配置文件中指定的邮箱吗？<br><br><br>" +
                      "<button id='confirm_mail_yes' class='formbutton2' style='float:left; margin-left: 45px; width: 55px; height: 25px;' onclick='javascript:sendSlaveMail();'>Yes</button>" +
                      "<button id='confirm_mail_cancel' class='formbutton2' style='float:right; margin-right: 45px; width: 55px; height: 25px;' onclick='javascript:$(\"#logo\")[0].style.zIndex = \"19999\"; $(\"#confirm_mail\").dialog(\"destroy\").remove();'>Cancel</button>" +
                      "</div>";
  $d.body.appendChild(confirm);

  $("#confirm_mail").dialog({
  	open: function(){
  		$("#logo")[0].style.zIndex = "1000";
  		$("#confirm_mail_cancel")[0].focus();
  	},
  	  	
	  modal: true,
	  
	  title: "&nbsp;&nbsp;&nbsp;Warning!",
	  
	  overlay: { 
      opacity: 0.8, 
      background: "#cccccc" 
    },
    
    dialogClass: "../server/css/style.css",   
       
    draggable: false,
       
    close: function(){
    	$("#logo")[0].style.zIndex = "19999";
    	$("#confirm_mail").dialog("destroy").remove();
    }  	
  });  
}

function sendSlaveMail(){
	var image = new Image();
	image.style.width = 0;
	image.style.height = 0;	      
	image.src = "../server/mail.php";
	
	$("#logo")[0].style.zIndex = "19999";
	$("#confirm_mail").dialog("destroy").remove();
}