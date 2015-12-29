Anehta core API Help:
> anehta.core.freeze(ms); //freeze current page during the time(ms)

> anehtaCache.addItem(Key, Value); //add a key to cache; return Value;

> anehtaCache.removeItem(Key); //remove value of the key; return the value of the removed key;

> anehtaCache.dropItem(Key); //delete the key in the cache; return true/false;

> anehtaCache.getItem(Key); //get the value of the key; return the value;

> anehtaCache.setItem(Key, Value); //change the value of the key;if key not exist, add one;

> anehtaCache.appendItem(Key, Value); //append value to the specific key;

> anehtaCache.hasItem(Key); //test if the key exist;

> anehtaCache.showKeys(); //alert all keys in the cache;

> anehtaCache.clone(); //clone a cache object; return the cloned object;

> anehtaCache.clear(); //empty the cache;

> anehta.core.setWatermark(flashID, value); //set the value as the flash cookie; invoke the flashID's callback

> anehta.core.getWatermark(flashID); //get the value of the flash cookie; invoke the flashID's callback


Anehta dom API Help:
> anehta.dom.getDocument(targetwindow); //return the document object of the target window

> anehta.dom.addCookie(cookiename,value); //add a 'name=value;' to current cookies; return true/false

> anehta.dom.checkCookie(cookiename); //check if current cookies contain a cookie named 'cookiename'; return true/false

> anehta.dom.getCookie(cookiename); //get the cookiename's value from current cookies; return the value of cookiename

> anehta.dom.setCookie(cookiename,value); //change the value of cookiename; return true/false

> anehta.dom.delCookie(cookiename); //expire the cookiename from current cookies; return true/false

> anehta.dom.persistCookie(cookiename); //make the cookiename never expired; return true/false

> anehta.dom.getQueryStr(qstrname); //get the value of the qstrname from current uri; return the param's value





Anehta net API Help:
> anehta.net.getURL(targeturl); //create an image element and GET the targeturl once as an img src

> anehta.net.postForm(targeturl); //create a form element and POST to the targeturl, current page will be redirected

> anehta.net.postFormIntoIframe(iframe, targeturl, postdata); //create a form element and POST with the postdata to the targeturl inside the iframe, current page won't be redirected

> anehta.net.cssGet(targeturl); //create a style element and IMPORT the targeturl;this will make a GET request.




Anehta logger API Help:
> anehta.logger.logInfo(param); //send param as querystrings to the anehta server by getURL() function;plain text transfer

> anehta.logger.logCookie(); //get watermark, cookie, current uri, and send them to the anehta server by getURL() function; base64 encoded

> anehta.logger.logForm(form); //get all the inputs value of the specific form and send them to the anehta server by getURL() function; base64 encoded

> anehta.logger.logCache(); //check the cache data in every 5 seconds,if cache data changed,send them to the anehta server by postFormIntoIframe() function; plain text transfer





Anehta ajax API Help:
> anehtaXmlHttp.init(); //initial the ajax;you must call this function before your ajax request

> anehta.ajax.post(url, postdata); //ajax post; save response in cache as 'ajaxPostResponseHeaders' and 'ajaxPostResponse

> anehta.ajax.get(url); //ajax get; save response in cache as 'ajaxGetResponseHeaders' and 'ajaxGetResponse





Anehta inject API Help:
> anehta.inject.injectScript(url); //create a script element with the 'url' as the src attribute and append it to body

> anehta.inject.removeScript(s); //remove the specific script s from body

> anehta.inject.addScript(url); //add a script with the 'url' as the src attribute by a document.write() method

> anehta.inject.injectCSS(url); //create a link element with the 'url' as the href attribute

> anehta.inject.injectIframe(url); //create a hidden iframe point to the specific url and append to body

> anehta.inject.addIframe(url); //create a div element and set its innerHTML as a hidden iframe which points to the specific url

> anehta.inject.createIframe(w); //create a hidden iframe under the specific window 'w'; return the iframe

> anehta.inject.injectScriptIntoIframe(f, proc); //write javascripts 'proc' to the specific iframe 'f'.

> anehta.inject.injectFlash(flashId, flashSrc, flashParam); //create a div and inject a flash into it;

> anehtaHook.hook('fnhooked', 'savedfn', 'fn'); //hook the fnhooked() function with fn() function; the original function will be save as savedfn().

> anehtaHook.unhook('fnhooked', 'savedfn'); //recover the fnhooked() function from the savedfn() function.

> anehtaHook.injectFn('fninjected', 'savedfn', 'fn'); //inject the fnhooked() function with fn() function; the original function will be save as savedfn()

> anehtaHook.hookSubmit(f, injectFn); //hook the submit of form 'f', and call injectFn() function before f's submit.



Anehta detect API Help:
> anehtaBrowser.type(); //sniffer the browser type in a reliable way; return msie/mozilla/opera/safari/chrome; also save a 'BrowserSniffer' in cache

> anehtaBrowser.version(); // return the browser version from userAgent.

> anehta.detect.screenSize(); // return the client's Screen Size.

> anehta.detect.flash(targetVersion); // check if the client support flash and flash version is higher than targetVersion; return true/false

> anehta.detect.activex(objName); // check if client has the specific objName activex control; return true/false

> anehta.detect.ffplugin(pluginName); // check if client has the specific firefox plugin; return true/false.




Anehta scanner API Help:
> anehta.scanner.activex(); //scan all activex controls from anehta.signatures.activex list, save the result as 'Activex' in cache; return the result

> anehta.scanner.ffPlugins (); //scan all the firefox plugins, save the result as 'FirefoxPlugins' in the cache; return the result.

> anehta.scanner.checkPort(scanHost, scanPort, timeout); //check the specific port on the specific host is open or closed.

> anehta.scanner.ports(target, timeout); //scan all the ports listed in anehta.signatures.ports against the specific host.

> anehta.scanner.history(); //scan if the client has ever visited the links listed in anehta.signatures.sites; save the result as 'sitesHistory' in cache; return the result




Anehta misc API Help:
> anehta.misc.getClipboard(); //get the clipboard's content(text); IE only.

> anehta.misc.setClipboard(); //set the clipboard's content(text); IE only.

> anehta.misc.getCurrentPage(); //return the current page's html code.




Anehta crypto API Help:
> anehta.crypto.base64Encode(str); //return the base64 encode of the str.

> anehta.crypto.base64Decode(str); //decode the base64 str, and return the decoded one.