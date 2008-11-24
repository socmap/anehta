var SERIALIZER={version:1.24};
SERIALIZER.RESERVED_WORDS=new KeySet("abstract","as","boolean","break","byte","case","catch","char","class","continue","const","debugger","default","delete","do","double","else","enum","export","extends","false","final","finally","float","for","function","goto","if","implements","import","in","instanceof","int","interface","is","long","let","namespace","native","new","null","package","private","prototype","protected","public","return","short","static","super","switch","synchronized","this","throw","throws","transient","true","try","typeof","use","var","void","volatile","while","with");
SERIALIZER.fDefaults=new HashMap();
function Walker(){
var self=JSINER.extend(this,Jsoner);
self.isWalkNode=function(_517,_518){
return COMMONS.isObject(_518)&&isNaN(_518.nodeType);
};
return self;
}
Walker.prototype.fLogger=new Logger("Serializer.Walker");
Walker.prototype.getAttrName=function(_519){
var _51a=String(_519);
if(SERIALIZER.RESERVED_WORDS.isContains(_51a)||_51a.indexOf(" ")>=0||_51a.indexOf(".")>=0){
_51a="\""+_51a+"\"";
}
return _51a;
};
Walker.prototype.isMute=function(_51b,_51c,_51d){
var _51e=_51b===Jsoner.MAGIC_HASH_CODE||!_51d.hasOwnProperty(_51b)||(COMMONS.isObject(_51c)&&!isNaN(_51c.nodeType));
return _51e;
};
Walker.prototype.getDefaultInstance=function(_51f){
var type=JSINER.getType(_51f);
var _521=SERIALIZER.fDefaults.get(type);
if(COMMONS.isUndefined(_521)){
_521=_51f;
if(COMMONS.isObject(_51f)){
try{
var cons=JSINER.getConstructor(_51f);
_521=new cons();
SERIALIZER.fDefaults.put(type,_521);
}
catch(ex){
this.fLogger.warning("getDefaultInstance, unable to create new instance:"+type,ex);
}
}
}
return _521;
};
Walker.prototype.isDefaultProperty=function(_523,_524,_525){
var _526=false;
if(COMMONS.isDefined(_523)){
try{
var _527=this.getValue(_523,_524);
_526=this.isEquals(_525,_527);
}
catch(ex){
this.fLogger.warning("isDefaultProperty, unable to get property:"+_524,ex);
}
}
return _526;
};
Walker.prototype.array=[];
Walker.prototype.isPureArray=function(_528){
var _529=COMMONS.isArray(_528);
if(_529){
var _52a;
for(var name in _528){
if(name!=Jsoner.MAGIC_HASH_CODE){
_52a=_528[name];
if(isNaN(Number(name))&&!this.isDefaultProperty(this.array,name,_52a)){
_529=false;
break;
}
}
}
}
return _529;
};
Walker.prototype.collectAttributes=function(_52c,_52d,_52e){
var _52f=[];
var _530;
var _531;
if(COMMONS.isDefined(_52d)){
var def=this.getDefaultInstance(_52e);
var path=_52c.join(".");
for(var name in _52d){
try{
_530=_52d[name];
if(!this.isMute(name,_530,_52d)&&this.isAttribute(name,_530)){
_531=path.length>0?path+"."+name:name;
if(!this.isDefaultProperty(def,_531,_530)){
_52f.push({name:name,value:_530});
}
}
}
catch(ex){
this.fLogger.error("collectAttributes, unable to collect attribute:"+name,ex);
}
}
}
return _52f;
};
Walker.prototype.collectChildren=function(_535,_536,_537){
var _538;
var _539;
var _53a=[];
if(!this.isPureArray(_536)){
var def=this.getDefaultInstance(_537);
var path=_535.join(".");
for(var name in _536){
try{
_538=_536[name];
if(!this.isMute(name,_538,_536)&&!this.isAttribute(name,_538)){
_539=path.length>0?path+"."+name:name;
if(!this.isDefaultProperty(def,_539,_538)){
_53a.push({name:name,value:_538});
}
}
}
catch(ex){
this.fLogger.warning("collectChildren, unable to collect child:"+name,ex);
}
}
}
return _53a;
};
function Serializer(_53e){
function ValueWalker(){
return JSINER.extend(this,Walker);
}
ValueWalker.prototype.getDefaultInstance=function(_53f){
var def=ValueWalker.superClass.getDefaultInstance.call(this,_53f.value);
return {value:def};
};
this.fSerializers=new HashMap();
this.fDeserializers=new HashMap();
this.fPettyPrint=_53e;
this.fWalker=new ValueWalker();
this.fWalker.isWalkArray=function(_541,_542){
return false;
};
this.fCrossLinker=new ValueWalker();
this.initProcessors();
}
Serializer.FIELD_TYPE="type";
Serializer.FIELD_STREAM="data";
Serializer.DECODE_TABLE={"\b":"\\b","\t":"\\t","\n":"\\n","\f":"\\f","\r":"\\r","\"":"\\\"","\\":"\\\\"};
Serializer.REGEXP_TEST=/["\\\x00-\x1f]/;
Serializer.REGEXP_REPLACE=/([\x00-\x1f\\"])/g;
Serializer.SERIALIZE_METHOD="toJSONString";
Serializer.DESERIALIZE_METHOD="stringToJSON";
Serializer.prototype.fLogger=new Logger("Serializer");
Serializer.prototype.registerSerializer=function(_543,_544){
if(COMMONS.isFunction(_544)){
this.fSerializers.put(_543,_544);
}else{
this.fLogger.warning("registerSerializer, illegal argument type:"+_544);
}
};
Serializer.prototype.registerDeserializer=function(_545,_546){
if(COMMONS.isFunction(_546)){
this.fDeserializers.put(_545,_546);
}else{
this.fLogger.warning("registerSerializer, illegal argument type:"+_546);
}
};
Serializer.prototype.initProcessors=function(){
this.registerSerializer("object",this.serializeObject);
this.registerDeserializer("object",this.deserializeObject);
this.registerSerializer("string",this.serializeString);
this.registerSerializer("function",this.serializeFunction);
this.registerSerializer("Date",this.serializeDate);
this.registerDeserializer("Date",this.deserializeDate);
this.registerSerializer("RegExp",this.serializeRegexp);
};
Serializer.prototype.getSerializer=function(_547){
function defaultSerializer(_548){
return String(_548);
}
var _549=null;
if(COMMONS.isDefined(_547)){
_549=_547[Serializer.SERIALIZE_METHOD];
if(!COMMONS.isFunction(_549)){
_549=this.fSerializers.get(JSINER.getType(_547));
if(!COMMONS.isFunction(_549)){
_549=this.fSerializers.get(typeof (_547));
}
}
}
if(!COMMONS.isFunction(_549)){
_549=defaultSerializer;
}
return _549;
};
Serializer.prototype.getDeserializer=function(_54a){
var _54b=COMMONS.isDefined(_54a)?_54a[Serializer.DESERIALIZE_METHOD]:null;
if(!COMMONS.isFunction(_54b)&&COMMONS.isDefined(_54a)){
var type=_54a[Serializer.FIELD_TYPE];
if(COMMONS.isDefined(type)){
_54b=this.fDeserializers.get(type);
}
}
if(!COMMONS.isFunction(_54b)){
_54b=this.fDeserializers.get(typeof (_54a));
if(!COMMONS.isFunction(_54b)){
_54b=COMMONS.proxy;
}
}
return _54b;
};
Serializer.prototype.serializeDate=function(_54d){
var time=_54d.getTime();
_54d.time=_54d.getTime();
var _54f=this.serializeObject(_54d);
_54d.time=undefined;
delete _54d["time"];
return _54f;
};
Serializer.prototype.deserializeDate=function(_550){
var _551=this.deserializeObject(_550);
if(COMMONS.isDefined(_551.time)){
_551.setTime(_551.time);
_551.time=undefined;
delete _551["time"];
}
return _551;
};
Serializer.prototype.serializeRegexp=function(_552){
return _552.toString();
};
Serializer.prototype.serializeFunction=function(_553){
var _554=_553.toString();
var ind1=_554.indexOf(" ")+1;
var ind2=_554.indexOf("(");
if(ind1<ind2){
_554=_554.substring(ind1,ind2);
}else{
this.fLogger.warning("serializeFunction, anonymous function: "+_554);
}
return _554;
};
Serializer.prototype.serializeString=function(_557){
if(Serializer.REGEXP_TEST.test(_557)){
_557=_557.replace(Serializer.REGEXP_REPLACE,function(a,b){
var c=Serializer.DECODE_TABLE[b];
if(COMMONS.isDefined(c)){
return c;
}
c=b.charCodeAt();
return "\\u00"+Math.floor(c/16).toString(16)+(c%16).toString(16);
});
}
return "\""+_557+"\"";
};
Serializer.prototype.serializeObject=function(_55b){
var _55c="";
var _55d=[];
var _55e=this;
var _55f=this.fPettyPrint;
this.fWalker.jsonTreeWalker({value:_55b},function(_560,_561,_562,_563){
var _564;
var func;
var b=false;
if(_563===Jsoner.JSON_NODE_START||_563===Jsoner.JSON_NODE_LEAF){
if(_560.length>1){
if(_55c.charAt(_55c.length-1)!=="{"){
_55c+=_55f?",\n":",";
}
_55c+=this.getAttrName(this.getLastProperty(_560))+":";
}
if(this.isPureArray(_561)){
_55c+="[";
for(var i=0;i<_561.length;i++){
func=_55e.getSerializer(_561[i]);
if(COMMONS.isFunction(func)){
if(b){
_55c+=",";
}
_55c+=func.call(_55e,_561[i]);
b=true;
}
}
_55d.push("]");
}else{
var type=JSINER.getType(_561);
if(type==="Object"){
_55c+="{";
_55d.push("}");
}else{
_55c+="{\""+Serializer.FIELD_TYPE+"\":\""+type+"\",";
_55c+="\""+Serializer.FIELD_STREAM+"\":"+(_55f?"\n{":" {");
_55d.push(_55f?"}\n}":"}}");
}
for(var i=0;i<_562.length;i++){
_564=_562[i].value;
func=_55e.getSerializer(_564);
if(COMMONS.isFunction(func)){
_564=func.call(_55e,_564);
if(b){
_55c+=_55f?",\n":",";
}
_55c+=this.getAttrName(_562[i].name)+":"+_564;
b=true;
}
}
}
}
if(_563===Jsoner.JSON_NODE_END||_563===Jsoner.JSON_NODE_LEAF){
_55c+=_55d.pop();
}
return true;
});
return _55c;
};
Serializer.prototype.deserializeObject=function(_569){
var _56a=_569;
var _56b;
var func;
if(COMMONS.isObject(_569)){
var type=_569[Serializer.FIELD_TYPE];
if(COMMONS.isString(type)){
try{
var cons=JSINER.getConstructor(type);
_56a=new cons();
var data=_569[Serializer.FIELD_STREAM];
if(COMMONS.isObject(data)){
for(var name in data){
if(data.hasOwnProperty(name)){
_56b=_569.data[name];
func=this.getDeserializer(_56b);
if(COMMONS.isFunction(func)){
_56a[name]=func.call(this,_56b);
}
}
}
}
}
catch(ex){
this.fLogger.error("deSerialize error "+type,ex);
}
}else{
for(var name in _569){
if(_569.hasOwnProperty(name)){
_56b=_569[name];
func=this.getDeserializer(_56b);
if(COMMONS.isFunction(func)){
_56a[name]=func.call(this,_56b);
}
}
}
}
}
return _56a;
};
Serializer.prototype.serialize=function(_571){
var _572="undefined";
var func=this.getSerializer(_571);
if(COMMONS.isDefined(func)){
try{
_572=func.call(this,_571);
var _574=this.fPettyPrint;
this.fCrossLinker.jsonPathEvaluator({value:_571},function(_575,_576,_577){
if(_577===Jsoner.JSON_NODE_CROSS_LINKED){
_572+=_574?";\n":";";
var _578=_576.substring(6+Jsoner.CROSS_LINK_PREFIX.length);
_572+=Jsoner.CROSS_LINK_PREFIX+"."+_575.substring(6)+"="+(_578.length>0?+"result."+_578:"result");
}
return true;
});
}
catch(ex){
this.fLogger.error("serialize error",ex);
}
_572+=";";
}else{
this.fLogger.error("serialize, corresponding serializer not found:"+_571);
}
return _572;
};
Serializer.prototype.deserialize=function(_579){
var _57a=undefined;
if(COMMONS.isString(_579)){
var _57b=_579;
var _57c=null;
var _57d=_579.indexOf(Jsoner.CROSS_LINK_PREFIX);
if(_57d>0){
_57b=_579.substring(0,_57d);
_57c=_579.substring(_57d).replace(new RegExp(Jsoner.CROSS_LINK_PREFIX,"g"),"result");
}
try{
var _57e=undefined;
eval("_57e ="+_57b);
if(_57e!==undefined){
var func=this.getDeserializer(_57e);
if(COMMONS.isDefined(func)){
_57a=func.call(this,_57e);
}
}
if(_57c!==null){
try{
eval(_57c);
}
catch(ex){
this.fLogger.error("deSerialize, unable to deserialize cross links:"+_57c,ex);
}
}
}
catch(ex){
this.fLogger.error("deSerialize error",ex);
}
}else{
this.fLogger.error("deSerialize error, illegal argument type:"+_579);
}
return _57a;
};
