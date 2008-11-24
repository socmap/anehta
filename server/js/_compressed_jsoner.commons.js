var COMMONS={version:1.24,userAgent:navigator.userAgent.toLowerCase()};
COMMONS.isIE=COMMONS.userAgent.indexOf("msie")>-1;
COMMONS.isOpera=COMMONS.userAgent.indexOf("opera")>-1;
COMMONS.isSafari=(!COMMONS.isOpera&&COMMONS.userAgent.indexOf("safari")>-1);
COMMONS.isGecko=(!COMMONS.isOpera&&!COMMONS.isSafari&&COMMONS.userAgent.indexOf("gecko")>-1);
COMMONS.isWin32=(COMMONS.userAgent.indexOf("windows")>-1);
COMMONS.isMacOs=(COMMONS.userAgent.indexOf("mac")>-1);
COMMONS.returnFalse=function returnFalse(){
return false;
};
COMMONS.returnTrue=function returnTrue(){
return true;
};
COMMONS.proxy=function(_ba){
return _ba;
};
COMMONS.isObject=function(_bb){
return _bb!==null&&typeof (_bb)==="object";
};
COMMONS.isArray=function(_bc){
return _bc instanceof Array;
};
COMMONS.isRegExp=function(_bd){
return _bd instanceof RegExp;
};
COMMONS.isDate=function(_be){
return _be instanceof Date;
};
COMMONS.isNumber=function(_bf){
return typeof (_bf)==="number";
};
COMMONS.isBoolean=function(_c0){
return typeof (_c0)==="boolean";
};
COMMONS.isString=function(_c1){
return typeof (_c1)==="string";
};
COMMONS.isFunction=function(_c2){
return typeof (_c2)==="function";
};
COMMONS.isUndefined=function(_c3){
return _c3===undefined;
};
COMMONS.isDefined=function(_c4){
return _c4!==null&&_c4!==undefined;
};
COMMONS.toInteger=function(_c5){
var _c6=0;
if(_c5){
_c6=this.isNumber(_c5)?_c5:parseInt(_c5,10);
}
return _c6;
};
COMMONS.toFloat=function(_c7){
var _c8=0;
if(_c7){
_c8=this.isNumber(_c7)?_c7:parseFloat(_c7);
}
return _c8;
};
COMMONS.BOOLEAN_TRUE={"true":true,"yes":true,"ok":true};
COMMONS.toBoolean=function(_c9){
var _ca=false;
if(_c9){
_ca=this.isBoolean(_c9)?_c9:this.BOOLEAN_TRUE[_c9.toString().toLowerCase()];
}
return _ca;
};
function Logger(_cb){
this.fPrefix=_cb;
}
Logger.TRACE=20;
Logger.DEBUG=50;
Logger.INFO=70;
Logger.WARN=80;
Logger.ERROR=90;
Logger.FATAL=100;
Logger.prototype.trace=function(_cc,_cd){
this.log(Logger.TRACE,_cc,_cd);
};
Logger.prototype.debug=function(_ce,_cf){
this.log(Logger.DEBUG,_ce,_cf);
};
Logger.prototype.info=function(_d0,_d1){
this.log(Logger.INFO,_d0,_d1);
};
Logger.prototype.warning=function(_d2,_d3){
this.log(Logger.WARN,_d2,_d3);
};
Logger.prototype.error=function(_d4,_d5,_d6){
this.log(Logger.ERROR,_d4,_d5,_d6);
};
Logger.prototype.fatal=function(_d7,_d8,_d9){
this.log(Logger.FATAL,_d7,_d8,_d9);
};
Logger.prototype.log=function(_da,_db,_dc,_dd){
var txt=COMMONS.isDefined(this.fPrefix)?"["+this.fPrefix+"] "+_db:_db;
if(COMMONS.isDefined(_dc)){
txt+=": "+_dc.name+", "+_dc.message;
}
if(COMMONS.isDefined(_dd)){
txt+="\n"+_dd.toString();
}
this.printLog(_da,txt);
};
Logger.prototype.printLog=function(_df,_e0){
if(_df>Logger.WARN){
alert(_e0);
}
};
COMMONS.fLogger=new Logger("Common");
var JSINER={scriptPrefix:"script/",scriptSuffix:".js",version:1};
JSINER.fDependency={};
JSINER.fClassMap={};
JSINER.fLogger=new Logger("JSINER");
JSINER.getConstructor=function(_e1){
var _e2=null;
if(COMMONS.isString(_e1)){
_e2=window[_e1];
}else{
if(COMMONS.isFunction(_e1)){
_e2=_e1;
}else{
if(COMMONS.isObject(_e1)){
_e2=_e1.constructor;
}
}
}
return _e2;
};
JSINER.getType=function(_e3){
var _e4=(typeof _e3);
if(COMMONS.isObject(_e3)){
if(COMMONS.isRegExp(_e3)){
_e4="RegExp";
}else{
var _e5=this.getConstructor(_e3);
if(COMMONS.isDefined(_e5)){
var _e6=_e5.toString();
var _e7=_e6.indexOf("(");
_e4=((_e7>0)?_e6.substring(_e6.indexOf(" ")+1,_e7):_e6);
if(this.fClassMap[_e4]!==undefined){
_e4=this.fClassMap[_e4];
}else{
if(window[_e4]===undefined){
for(var _e8 in window){
if(window[_e8]===_e5){
this.fClassMap[_e4]=_e8;
_e4=_e8;
break;
}
}
}
}
}
}
}
return _e4;
};
JSINER.getScriptURI=function(_e9){
var _ea=null;
if(COMMONS.isString(_e9)){
_ea=this.scriptPrefix;
if(/js[i|o]ner/.test(_e9)){
_ea+=_e9;
}else{
_ea+=_e9.replace(/[.]/g,"/");
}
_ea=Transporter.addParameter(_ea+this.scriptSuffix,"ver",this.version);
}
return _ea;
};
JSINER.isScriptLoaded=function(_eb){
var _ec=this.fScripts.isContains(_eb);
if(!_ec){
var uri=this.getScriptURI(_eb);
var _ee=uri.indexOf("?");
if(_ee>0){
uri=uri.substring(0,_ee);
}
var _ef=document.getElementsByTagName("script");
for(var i=0;i<_ef.length;i++){
var src=_ef[i].src;
if(src.indexOf(uri)>=0){
_ec=true;
break;
}
}
}
this.fLogger.info("The script ["+_eb+"] are "+(_ec?"loaded":"not loaded"));
return _ec;
};
JSINER.setDependency=function(_f2){
this.fDependency=COMMONS.isDefined(_f2)?_f2:{};
};
JSINER.addDependency=function(_f3){
if(COMMONS.isDefined(_f3)){
for(var _f4 in _f3){
var _f5=this.fDependency[_f4];
if(!COMMONS.isArray(_f5)){
this.fDependency[_f4]=[];
_f5=this.fDependency[_f4];
}
var _f6=_f3[_f4];
if(COMMONS.isArray(_f6)){
for(var i=0;i<_f6.length;i++){
_f5.push(_f6[i]);
}
}else{
_f5.push(_f6);
}
}
}
};
JSINER.getDependency=function(_f8,_f9){
var _fa=this.getType(_f8);
return this.fDependency[_fa];
};
JSINER.createInstance=function(_fb,_fc){
var _fd=null;
if(COMMONS.isFunction(_fb)&&COMMONS.isFunction(_fc)&&_fc!==Object){
var _fe=_fb.prototype;
var _ff=_fb.prototype.toString;
_fb.prototype=new _fc();
_fb.prototype.constructor=_fb;
_fb.superClass=_fc.prototype;
for(var name in _fe){
_fb.prototype[name]=_fe[name];
}
_fb.prototype.toString=_ff;
_fb.$extend=true;
_fd=new _fb();
}
return _fd;
};
JSINER.extend=function(_101,_102){
var _103=function(_104,_105){
var _106=_104;
var cons=_104.constructor;
if(COMMONS.isUndefined(cons.$extend)){
var _108=this.getDependency(_104,_105);
if(COMMONS.isArray(_108)){
var _109=this;
this.inject(_108,function(){
var _10a=_109.getConstructor(_105);
_106=_109.createInstance(cons,_10a)||_106;
});
}else{
var _10b=this.getConstructor(_105);
_106=this.createInstance(cons,_10b)||_106;
}
}
return _106;
};
var _10c=_103.call(this,_101,_102);
var _10d=this.getConstructor(_102);
if(COMMONS.isFunction(_10d)){
_10d.call(_10c);
}
return _10c;
};
JSINER.INTERCEPT_BEFORE=0;
JSINER.INTERCEPT_AFTER=1;
JSINER.INTERCEPT_INSTEAD=2;
JSINER.INTERCEPT_ON_ERROR=3;
JSINER.fMethods=new HashMap();
JSINER.registerInterceptor=function(_10e,_10f,_110,_111){
var _112=this.getConstructor(_10e);
if(_112!==null&&COMMONS.isFunction(_111)){
var key=this.getType(_112)+"."+_10f;
var _114=_112.prototype[_10f];
if(!this.fMethods.isContains(key)){
this.fMethods.put(key,_114);
}
if(this.isUndefined(_114)){
_110=this.INTERCEPT_INSTEAD;
}
var _115=null;
switch(_110){
case this.INTERCEPT_BEFORE:
_115=function(){
_111.apply(this,arguments);
return _114.apply(this,arguments);
};
break;
case this.INTERCEPT_AFTER:
_115=function(){
var _116=_114.apply(this,arguments);
_111.apply(this,arguments);
return _116;
};
break;
case this.INTERCEPT_INSTEAD:
_115=function(){
var _117=_111.apply(this,arguments);
return _117;
};
break;
case this.INTERCEPT_ON_ERROR:
_115=function(){
var _118=null;
try{
_118=_114.apply(this,arguments);
}
catch(ex){
_118=_111.apply(this,arguments);
}
return _118;
};
break;
default:
this.fLogger.error("register interceptor, unsupported type "+_110);
break;
}
_112.prototype[_10f]=_115;
}else{
this.fLogger.error("register interceptor, unsupported arguments "+_10e);
}
};
JSINER.unregisterInterceptor=function(_119,_11a){
var _11b=this.getConstructor(_119);
if(_11b!==null){
var key=this.getType(_11b)+"."+_11a;
if(this.fMethods.isContains(key)){
_11b.prototype[_11a]=this.fMethods.get(key);
this.fMethods.remove(key);
}else{
this.fLogger.warning("unregister interceptor, "+key+" never was registered.");
}
}else{
this.fLogger.error("unregister interceptor, unable to obtain object constructor "+_119);
}
};
JSINER.getInfo=function(_11d,_11e){
var _11f=typeof (_11d);
if(COMMONS.isObject(_11d)){
_11f+="["+this.getType(_11d)+"]\n";
if(!_11e){
var _120=[];
var _121;
for(var name in _11d){
try{
_121=_11d[name];
_120.push(COMMONS.isFunction(_121)?(name+"()"):(name+"="+_121));
}
catch(ex){
_120.push(name);
}
}
if(_120.length>0){
_11f+=_120.sort().join(", ");
}
}
if(COMMONS.isArray(Object.attributes)){
var _123=[];
var _124;
try{
for(var j=0;j<_11d.attributes.length;j++){
_124=_11d.attributes[j];
if(_124.nodeValue!==null&&_124.nodeValue!==""){
_123.push(_124.name+"="+_124.nodeValue);
}
}
}
catch(ex){
}
if(_123.length>0){
_11f+="\n ["+_123.sort().join(", ")+"]";
}
}
}
return _11f;
};
function HashMap(_126){
this.fObject=_126||{};
this.fSize=0;
for(var name in this.fObject){
if(this.fObject.hasOwnProperty(name)){
this.fSize++;
}
}
}
HashMap.prototype.isEmpty=function(){
return this.getSize()===0;
};
HashMap.prototype.getSize=function(){
return this.fSize;
};
HashMap.prototype.get=function(aKey){
return this.fObject[aKey];
};
HashMap.prototype.isContains=function(aKey){
return COMMONS.isDefined(this.get(aKey));
};
HashMap.prototype.put=function(aKey,_12b){
if(!this.isContains(aKey)){
this.fSize++;
}
this.fObject[aKey]=_12b;
};
HashMap.prototype.remove=function(aKey){
if(this.isContains(aKey)){
this.fObject[aKey]=undefined;
delete this.fObject[aKey];
if(!this.isContains(aKey)){
this.fSize--;
}
}
};
HashMap.prototype.clear=function(){
this.fSize=0;
this.fObject={};
};
function KeySet(){
var self=JSINER.extend(this,HashMap);
for(var i=0;i<arguments.length;i++){
self.add(arguments[i]);
}
return self;
}
KeySet.prototype.add=function(aKey){
KeySet.superClass.put.call(this,aKey,true);
};
KeySet.prototype.getSize=function(){
return this.fSize;
};
JSINER.fScripts=new KeySet();
COMMONS.isEquals=function(_130,_131){
function isObjectEquals(_132,_133){
var _134=true;
var set=new KeySet();
for(var name in _132){
if(_132.hasOwnProperty(name)){
if(!COMMONS.isEquals(_132[name],_133[name])){
_134=false;
break;
}
set.add(name);
}
}
for(var name in _133){
if(_133.hasOwnProperty(name)&&!set.isContains(name)){
if(!COMMONS.isEquals(_132[name],_133[name])){
_134=false;
break;
}
}
}
return _134;
}
var _137=JSINER.getType(_130)===JSINER.getType(_131);
if(_137){
if(COMMONS.isObject(_130)){
if(!isNaN(_130.nodeType)){
_137=COMMONS.isString(_130.id);
if(_137){
_137=_130.nodeType===_131.nodeType&&_130.nodeName===_131.nodeName&&_130.id===_131.id;
}
}else{
if(COMMONS.isArray(_130)){
_137=(_130.length===_131.length);
}
if(_137){
_137=isObjectEquals(_130,_131);
}
}
}else{
_137=(_130===_131);
}
}
return _137;
};
function Transporter(_138,_139,_13a,_13b,_13c){
this.fAsynch=COMMONS.isBoolean(_13c)?_13c:true;
this.fTaskID=_139;
this.fCounter=COMMONS.isNumber(_13b)?Math.max(_13b,0):1;
this.fMethod=_13a;
this.onLoad=_138;
this.fTimeout=1000;
this.fURI=null;
this.fQueryString=null;
this.fTaskCounter=this.fCounter;
this.fReq=null;
this.fReqTaskID=null;
this.fResponseHandlers=new HashMap();
this.registerDefaults();
}
Transporter.fTaskSet=new KeySet();
Transporter.setTaskAlive=function(_13d,_13e){
if(COMMONS.isDefined(_13d)){
if(_13e){
Transporter.fTaskSet.add(_13d);
}else{
Transporter.fTaskSet.remove(_13d);
}
}
};
Transporter.isLoaderAlive=function(_13f){
var _140=!Transporter.fTaskSet.isEmpty();
return _140;
};
Transporter.isTaskAlive=function(_141){
var _142=false;
if(COMMONS.isDefined(_141)){
_142=Transporter.fTaskSet.isContains(_141);
}
return _142;
};
Transporter.addParameter=function(aURL,_144,_145){
var _146=aURL;
if(COMMONS.isString(aURL)&&COMMONS.isString(_144)&&COMMONS.isDefined(_145)){
var _147=_144+"=";
var _148=aURL.indexOf(_147);
if(_148>0){
_146=aURL.substring(0,_148+_147.length)+_145;
var _149=aURL.indexOf("&",_148+_147.length);
if(_149>0){
_146+=aURL.substring(_149,aURL.length);
}
}else{
_146+=(_146.indexOf("?")>0)?"&":"?";
_146+=_147+_145;
}
}
return _146;
};
Transporter.ActiveX_TRANSPORT=["Msxml2.XMLHTTP","Microsoft.XMLHTTP","Msxml2.XMLHTTP.5.0","Msxml2.XMLHTTP.4.0","MSXML2.XMLHTTP.3.0"];
Transporter.prototype.fLogger=new Logger("Transporter");
Transporter.prototype.getQueryString=function(_14a,_14b){
var _14c=null;
var _14d=COMMONS.isNumber(_14b)?Math.max(_14b,0):0;
if(COMMONS.isArray(_14a)&&_14a.length>=_14d){
_14c=_14a[_14d];
if(_14a.length>=_14d){
for(var i=_14d+1;i<_14a.length;i++){
_14c+=((i%2===1)?"=":"&")+_14a[i];
}
}
}
return _14c;
};
Transporter.prototype.getDefaultHandler=function(){
return this.errorHandler();
};
Transporter.prototype.getResponseHandler=function(_14f){
var _150=this.fResponseHandlers.get(_14f);
if(!COMMONS.isDefined(_150)){
_150=this.getDefaultHandler();
}
return _150;
};
Transporter.prototype.registerDefaults=function(){
this.setResponseHandeler(400,this.fatalErrorHandler);
this.setResponseHandeler(500,this.fatalErrorHandler);
this.setResponseHandeler(0,this.okHandler);
this.setResponseHandeler(200,this.okHandler);
};
Transporter.prototype.setResponseHandeler=function(_151,_152){
this.fResponseHandlers.put(_151,_152);
};
Transporter.prototype.customizeHeaders=function(_153){
var _154=(this.fMethod==="POST")?"application/x-www-form-urlencoded;charset=\"utf-8\"":"text/xml;charset=\"utf-8\"";
_153.setRequestHeader("Content-type",_154);
if(COMMONS.isGecko){
_153.setRequestHeader("Connection","close");
}
};
Transporter.prototype.request=function(aURI,_156,_157){
this.fURI=aURI;
this.fTaskCounter=this.fCounter;
this.fQueryString=_157;
this.fMethod=_156;
Transporter.setTaskAlive(this.fTaskID,true);
try{
this.doLoadData();
}
catch(ex){
this.fLogger.warning("doLoadData error happened",ex);
}
};
Transporter.prototype.sendData=function(aURI){
var _159=this.getQueryString(arguments,1);
this.request(aURI,"POST",_159);
};
Transporter.prototype.loadData=function(aURI){
var _15b=this.getQueryString(arguments,1);
this.request(aURI,"GET",_15b);
};
Transporter.prototype.doLoadData=function(){
if(window.XMLHttpRequest){
this.fReq=new XMLHttpRequest();
}else{
if(window.ActiveXObject){
if(COMMONS.isDefined(Transporter.ActiveX_TRANSPORT.transport)){
this.fReq=new ActiveXObject(Transporter.ActiveX_TRANSPORT.transport);
}else{
var _15c;
for(var i=0;i<Transporter.ActiveX_TRANSPORT.length;i++){
_15c=Transporter.ActiveX_TRANSPORT[i];
try{
this.fReq=new ActiveXObject(_15c);
Transporter.ActiveX_TRANSPORT.transport=_15c;
break;
}
catch(ex){
}
}
}
}
}
if(COMMONS.isDefined(this.fReq)){
this.fProcessed=false;
var _15e=this;
this.fReq.onreadystatechange=function(){
_15e.onReadyState.call(_15e);
};
try{
this.fReq.open(this.fMethod,this.fURI,this.fAsynch);
this.customizeHeaders(this.fReq);
this.fReq.send(this.fQueryString);
this.fLogger.info("Open request: "+this.fURI+(this.fQueryString?"?"+this.fQueryString:""));
if(!this.fAsynch&&COMMONS.isGecko&&this.fReq.readyState===4){
this.onReadyState();
}
}
catch(ex){
this.fatalErrorHandler();
}
}else{
this.fLogger.error("Browser not supported XMLHttpRequest");
}
};
Transporter.prototype.onReadyState=function(){
var _15f=this.fReq.readyState;
if(_15f===4){
if(!this.fProcessed){
var _160=this.getResponseHandler(this.fReq.status);
_160.call(this);
this.fReq.onreadystatechange=COMMONS.returnTrue;
this.fProcessed=true;
}
}
};
Transporter.prototype.okHandler=function(){
this.fLogger.info("Request successfully: "+this.fURI);
if(COMMONS.isFunction(this.onLoad)){
try{
this.onLoad.call(this);
}
catch(ex){
this.fLogger.error("Callback error: "+this.fURI,ex,this.onLoad);
}
}
Transporter.setTaskAlive(this.fTaskID,false);
};
Transporter.prototype.fatalErrorHandler=function(){
if(this.fReqTaskID!==null){
window.clearTimeout(this.fReqTaskID);
this.fReqTaskID=null;
}
Transporter.setTaskAlive(this.fTaskID,false);
if(COMMONS.isDefined(this.fReq)){
this.fLogger.error(this.fReq.status+", request "+this.fURI+" error. Headers: "+this.fReq.getAllResponseHeaders());
this.fReq.onreadystatechange=COMMONS.returnTrue;
this.fReq.abort();
}
};
Transporter.prototype.errorHandler=function(){
if(this.fReqTaskID!==null){
window.clearTimeout(this.fReqTaskID);
this.fReqTaskID=null;
}
if(this.fTaskCounter<=0){
Transporter.setTaskAlive(this.fTaskID,false);
this.fLogger.error(this.fReq.status+", request  "+this.fURI+" error. Headers: "+this.fReq.getAllResponseHeaders());
}else{
var _161=this;
this.fTaskCounter=this.fTaskCounter-1;
this.fReqTaskID=window.setTimeout(function(){
_161.doLoadData();
},this.fTimeout);
this.fLogger.info(this.fReq.status+", trying to request "+this.fURI+" again....");
}
};
Transporter.prototype.getResponsedText=function(){
var _162=null;
if(COMMONS.isDefined(this.fReq)){
_162=this.fReq.responseText;
}
return _162;
};
Transporter.prototype.getResponsedXML=function(){
var _163=null;
if(COMMONS.isDefined(this.fReq)){
try{
_163=this.fReq.responseXML;
}
catch(ex){
this.fLogger.error("Unable to parse responsed XML",ex);
}
}
return _163;
};
JSINER.inject=function(_164,_165){
var _166=function(_167,_168){
var _169=null;
for(var i=_167.fIndex;i<_168.length;i++){
var link=_168[_167.fIndex];
if(!JSINER.isScriptLoaded(link)){
_169=JSINER.getScriptURI(link);
if(_169!==null){
_167.fIndex=i;
break;
}
}
}
return _169;
};
if(COMMONS.isDefined(_164)){
if(!COMMONS.isArray(_164)){
_164=[_164];
}
var _16c=new Transporter(function(){
var code=this.getResponsedText();
if(window.execScript){
window.execScript(code,"javascript");
}else{
if(COMMONS.isSafari){
var _16e=document.getElementsByTagName("head");
var head=_16e.length>0?_16e[0]:document.body;
var _170=document.createElement("script");
_170.type="text/javascript";
_170.innerHTML=code;
head.appendChild(_170);
}else{
window.eval(code);
}
}
JSINER.fScripts.add(_164[this.fIndex]);
this.fIndex++;
var uri=_166(this,_164);
if(uri!==null){
this.loadData(uri);
}else{
if(COMMONS.isFunction(_165)){
_165();
}
}
});
_16c.fAsynch=false;
_16c.fIndex=0;
var uri=_166(_16c,_164);
if(uri!==null){
_16c.loadData(uri);
}else{
if(COMMONS.isFunction(_165)){
_165();
}
}
}
};
