// API帮助

anehta.help = function(args){
	switch (args) {
		case "core":
		  alert("Anehta core API Help: \r\n\r\n" +
		        "  anehta.core.freeze(ms); //freeze current page during the time(ms)\r\n\r\n" +
		        "  anehtaCache.addItem(Key, Value); //add a key to cache; return Value;\r\n\r\n" +
		        "  anehtaCache.removeItem(Key); //remove value of the key; return the value of the removed key;\r\n\r\n" +
		        "  anehtaCache.dropItem(Key); //delete the key in the cache; return true/false;\r\n\r\n" +
		        "  anehtaCache.getItem(Key); //get the value of the key; return the value;\r\n\r\n" +
		        "  anehtaCache.setItem(Key, Value); //change the value of the key;if key not exist, add one;\r\n\r\n" +
		        "  anehtaCache.appendItem(Key, Value); //append value to the specific key; \r\n\r\n" +
		        "  anehtaCache.hasItem(Key); //test if the key exist; \r\n\r\n" +
		        "  anehtaCache.showKeys(); //alert all keys in the cache; \r\n\r\n" +
		        "  anehtaCache.clone(); //clone a cache object; return the cloned object;\r\n\r\n" +
		        "  anehtaCache.clear(); //empty the cache; \r\n\r\n" +
		        "  anehta.core.setWatermark(flashID, value); //set the value as the flash cookie; invoke the flashID's callback\r\n\r\n" +
		        "  anehta.core.getWatermark(flashID); //get the value of the flash cookie; invoke the flashID's callback\r\n\r\n"
		        );
		  break;
		  
		case "dom":
		  alert("Anehta dom API Help: \r\n\r\n" +
		        "  anehta.dom.bindEvent(o, e, fn); //bind a function 'fn()' to Event 'e' of element 'o'\r\n\r\n" +
		        "  anehta.dom.unbindEvent(o, e, fn); //unbind a function 'fn()' to Event 'e' of element 'o'\r\n\r\n" +
		        "  anehta.dom.getDocument(targetwindow); //return the document object of the target window\r\n\r\n" +
		        "  anehta.dom.addCookie(cookiename,value); //add a 'name=value;' to current cookies; return true/false\r\n\r\n" +
		        "  anehta.dom.checkCookie(cookiename); //check if current cookies contain a cookie named 'cookiename'; return true/false\r\n\r\n" +
		        "  anehta.dom.getCookie(cookiename); //get the cookiename's value from current cookies; return the value of cookiename\r\n\r\n" +
		        "  anehta.dom.setCookie(cookiename,value); //change the value of cookiename; return true/false\r\n\r\n" +
		        "  anehta.dom.delCookie(cookiename); //expire the cookiename from current cookies; return true/false\r\n\r\n" +
		        "  anehta.dom.persistCookie(cookiename); //make the cookiename never expired; return true/false\r\n\r\n" +
		        "  anehta.dom.getQueryStr(qstrname); //get the value of the qstrname from current uri; return the param's value\r\n\r\n"
		        );
		  break;
		  
		case "net":
		  alert("Anehta net API Help: \r\n\r\n" +
		        "  anehta.net.getURL(targeturl); //create an image element and GET the targeturl once as an img src\r\n\r\n" +
		        "  anehta.net.postForm(targeturl); //create a form element and POST to the targeturl, current page will be redirected\r\n\r\n" +
		        "  anehta.net.postFormIntoIframe(iframe, targeturl, postdata); //create a form element and POST with the postdata to the targeturl inside the iframe, current page won't be redirected\r\n\r\n" +
		        "  anehta.net.cssGet(targeturl); //create a style element and IMPORT the targeturl;this will make a GET request.\r\n\r\n"
		        );
		  break;
		  
		case "logger":
		  alert("Anehta logger API Help: \r\n\r\n" +
		        "  anehta.logger.logInfo(param); //send param as querystrings to the anehta server by getURL() function;plain text transfer\r\n\r\n" +
		        "  anehta.logger.logCookie(); //get watermark, cookie, current uri, and send them to the anehta server by getURL() function; base64 encoded\r\n\r\n" +
		        "  anehta.logger.logForm(form); //get all the inputs value of the specific form and send them to the anehta server by getURL() function; base64 encoded\r\n\r\n" +
		        "  anehta.logger.logCache(); //check the cache data in every 5 seconds,if cache data changed,send them to the anehta server by postFormIntoIframe() function; plain text transfer\r\n\r\n"
		        );
		  break;
		  
		case "ajax":
		  alert("Anehta ajax API Help: \r\n\r\n" +
		        "  anehtaXmlHttp.init(); //initial the ajax;you must call this function before your ajax request\r\n\r\n" +
		        "  anehta.ajax.post(url, postdata); //ajax post; save response in cache as 'ajaxPostResponseHeaders' and 'ajaxPostResponse'\r\n\r\n" +
		        "  anehta.ajax.get(url); //ajax get; save response in cache as 'ajaxGetResponseHeaders' and 'ajaxGetResponse'\r\n\r\n"
		        );
		  break;
		  
		case "inject":
		  alert("Anehta inject API Help: \r\n\r\n" +
		        "  anehta.inject.injectScript(url); //create a script element with the 'url' as the src attribute and append it to body\r\n\r\n" +
		        "  anehta.inject.removeScript(s); //remove the specific script s from body\r\n\r\n" +
		        "  anehta.inject.addScript(url); //add a script with the 'url' as the src attribute by a document.write() method\r\n\r\n" +
		        "  anehta.inject.injectCSS(url); //create a link element with the 'url' as the href attribute\r\n\r\n" +
		        "  anehta.inject.injectIframe(url); //create a hidden iframe point to the specific url and append to body\r\n\r\n" +
		        "  anehta.inject.addIframe(url); //create a div element and set its innerHTML as a hidden iframe which points to the specific url\r\n\r\n" +
		        "  anehta.inject.createIframe(w); //create a hidden iframe under the specific window 'w'; return the iframe\r\n\r\n" +
		        "  anehta.inject.injectScriptIntoIframe(f, proc); //write javascripts 'proc' to the specific iframe 'f'.\r\n\r\n" +
		        "  anehta.inject.injectFlash(flashId, flashSrc, flashParam); //create a div and inject a flash into it;\r\n\r\n" +
		        "  anehtaHook.hook('fnhooked', 'savedfn', 'fn'); //hook the fnhooked() function with fn() function; the original function will be save as savedfn().\r\n\r\n" +
		        "  anehtaHook.unhook('fnhooked', 'savedfn'); //recover the fnhooked() function from the savedfn() function.\r\n\r\n" +
		        "  anehtaHook.injectFn('fninjected', 'savedfn', 'fn'); //inject the fnhooked() function with fn() function; the original function will be save as savedfn().\r\n\r\n" +
		        "  anehtaHook.hookSubmit(f, injectFn); //hook the submit of form 'f', and call injectFn() function before f's submit.\r\n\r\n" 		      
		        );
		  break;
		  
		case "hook":
		  alert("Anehta hook API Help: \r\n\r\n" +
		        "  anehtaHook.hook('fnhooked', 'savedfn', 'fn'); //hook the fnhooked() function with fn() function; the original function will be save as savedfn().\r\n\r\n" +
		        "  anehtaHook.unhook('fnhooked', 'savedfn'); //recover the fnhooked() function from the savedfn() function.\r\n\r\n" +
		        "  anehtaHook.injectFn('fninjected', 'savedfn', 'fn'); //inject the fnhooked() function with fn() function; the original function will be save as savedfn().\r\n\r\n" +
		        "  anehta.hook.hookSubmit(f, injectFn); //hook the submit of form 'f', and call injectFn() function before f's submit.\r\n\r\n" +
		        "  anehta.hook.hookForm(f); //hook the submit of form 'f', and log all the inputs value to server.\r\n\r\n" +		      
		        "  anehta.hook.hookAllForms(); //hook the submit of all forms in current page, and log the inputs value to server when a form is submiting.\r\n\r\n" +	      
		        "  anehta.hook.installKeylogger(o, trigger); //install a keylogger on element 'o', trigger's value might be 'blur' or 'unload' which means when to trigger the logger.\r\n\r\n" +
		        "  anehta.hook.installKeyloggerToAllInputs(); // install a keylogger to all the input and textarea tags in current page, trigger the logger when blur.\r\n\r\n"		      	      
		        );
		  break;		  
		  
		case "detect":
		  alert("Anehta detect API Help: \r\n\r\n" +
		        "  anehtaBrowser.type(); //sniffer the browser type in a reliable way; return msie/mozilla/opera/safari/chrome; also save a 'BrowserSniffer' in cache\r\n\r\n" +
		        "  anehtaBrowser.version(); // return the browser version from userAgent.\r\n\r\n" +
		        "  anehta.detect.screenSize(); // return the client's Screen Size.\r\n\r\n" +
		        "  anehta.detect.flash(targetVersion); // check if the client support flash and flash version is higher than targetVersion; return true/false\r\n\r\n" +
		        "  anehta.detect.activex(objName); // check if client has the specific objName activex control; return true/false\r\n\r\n" +
		        "  anehta.detect.ffplugin(pluginName); // check if client has the specific firefox plugin; return true/false.\r\n\r\n"		        
		        );
		  break;
		  
		case "scanner":
		  alert("Anehta scanner API Help: \r\n\r\n" +
		        "  anehta.scanner.activex(); //scan all activex controls from anehta.signatures.activex list, save the result as 'Activex' in cache; return the result\r\n\r\n" +
		        "  anehta.scanner.ffPlugins (); //scan all the firefox plugins, save the result as 'FirefoxPlugins' in the cache; return the result.\r\n\r\n" +
		        "  anehta.scanner.checkPort(scanHost, scanPort, timeout); //check the specific port on the specific host is open or closed.\r\n\r\n" +
		        "  anehta.scanner.ports(target, timeout); //scan all the ports listed in anehta.signatures.ports against the specific host.\r\n\r\n" +
		        "  anehta.scanner.history(); //scan if the client has ever visited the links listed in anehta.signatures.sites; save the result as 'sitesHistory' in cache; return the result\r\n\r\n"
		        );
		  break;

		case "trick":
		  alert("Anehta trick API Help: \r\n" +
		        "  anehta.trick.hijackLink(link, url); //change the href of the link when user click on the link.\r\n\r\n"
		        );
		  break;
		  		  
		case "misc":
		  alert("Anehta misc API Help: \r\n" +
		        "  anehta.misc.realtimeCMD(); //inject a realtime module to current page and apply commands from anehta server.\r\n\r\n" +
		        "  anehta.misc.getClipboard(); //get the clipboard's content(text); IE only.\r\n\r\n" +
		        "  anehta.misc.setClipboard(); //set the clipboard's content(text); IE only.\r\n\r\n" +
		        "  anehta.misc.getCurrentPage(); //return the current page's html code.\r\n\r\n"
		        );
		  break;
		  
		case "crypto":
		  alert("Anehta crypto API Help: \r\n" +
		        "  anehta.crypto.base64Encode(str); //return the base64 encode of the str.\r\n\r\n" +
		        "  anehta.crypto.base64Decode(str); //decode the base64 str, and return the decoded one.\r\n\r\n"
		        );
		  break;   
		               
		default:
		  alert("Usage: anehta.help(args);\r\n" +
		        "args could be: core,dom,net,logger,ajax,inject,hook,detect,scanner,trick,misc,crypto \r\n\r\n" +
		        "example: anehta.help('core'); \r\n" +
		        "  will show the anehta core api mannual.");
	}	
} 