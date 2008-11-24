var JSONER={version:1.024};
function Jsoner(){
this.fDataProviderCache=new HashMap();
this.fLogger=new Logger("Jsoner");
this.isWalkArray=function(_1,_2,_3){
return COMMONS.isArray(_2);
};
this.isWalkNode=function(_4,_5,_6){
return COMMONS.isObject(_5)&&!COMMONS.isDate(_5)&&!COMMONS.isRegExp(_5);
};
}
Jsoner.JSON_NODE_START=1;
Jsoner.JSON_NODE_END=2;
Jsoner.JSON_NODE_LEAF=3;
Jsoner.JSON_ATTRIBUTE=4;
Jsoner.JSON_NODE_CROSS_LINKED=5;
Jsoner.MAGIC_HASH_CODE="$lnk";
Jsoner.CROSS_LINK_PREFIX="#link:";
Jsoner.prototype.isMatch=function(_7,_8){
var _9=false;
if(COMMONS.isDefined(_7)){
var _a=String(_8);
if(COMMONS.isRegExp(_7)){
_9=_7.test(_a);
}else{
if(COMMONS.isString(_7)){
var _b=_7.indexOf("*");
if(_b===-1){
_9=(_8===_7);
}else{
if(_b===0){
if(_7.length>1){
var _c=_7.substr(1);
_9=_a.lastIndexOf(_c)===(_a.length-_c.length);
}
}else{
var _d=_7.split("*");
_9=_a.indexOf(_d[0])===0;
if(_9&&_d.length>1){
var _e=_d[_d.length-1];
_9=_a.lastIndexOf(_e)===(_a.length-_e.length);
}
}
}
}
}
}
return _9;
};
Jsoner.prototype.converterFactory=function(_f){
var _10=COMMONS.proxy;
if(COMMONS.isFunction(_f)){
_10=_f;
}else{
if(COMMONS.isObject(_f)){
_10=function(_11){
for(var _12 in _f){
if(_f.hasOwnProperty(_12)&&this.isMatch(_12,_11)){
return _f[_12];
}
}
return _11;
};
}
}
return _10;
};
Jsoner.prototype.populate=function(_13,_14,_15,_16){
function parseSegment(_17){
var _18=_17;
if(_17.charAt(_17.length-1)==="]"){
var _19=_17.indexOf("[");
_18={path:_17.substring(0,_19),index:_17.substring(_19+1,_17.length-1)};
}
return _18;
}
var _1a=_14.split(".");
var obj=_13;
var _1c;
var _1d;
for(var i=0;(i<_1a.length-1)&&(obj!==null);i++){
_1d=parseSegment(_1a[i]);
if(COMMONS.isString(_1d)){
_1c=obj[_1d];
if(_16){
if(!COMMONS.isDefined(_1c)){
_1c={};
obj[_1d]=_1c;
}else{
if(COMMONS.isArray(_1c)&&!COMMONS.isDefined(_1c[0])){
_1c[0]={};
}
}
}
obj=COMMONS.isArray(_1c)?_1c[0]:_1c;
}else{
_1c=obj[_1d.path];
if(!COMMONS.isDefined(_1c)&&_16){
_1c=[];
obj[_1d.path]=_1c;
}else{
if(!COMMONS.isArray(_1c)){
_1c=[_1c];
obj[_1d.path]=_1c;
}
}
obj=_1c;
if(COMMONS.isDefined(obj)){
_1c=obj[_1d.index];
if(!COMMONS.isDefined(_1c)&&_16){
_1c={};
obj[_1d.index]=_1c;
}
obj=_1c;
}
}
}
if(COMMONS.isDefined(obj)){
_1d=parseSegment(_1a[_1a.length-1]);
if(COMMONS.isString(_1d)){
obj[_1d]=_15;
}else{
_1c=obj[_1d.path];
if(!COMMONS.isDefined(_1c)){
_1c=[];
obj[_1d.path]=_1c;
}else{
if(!COMMONS.isArray(_1c)){
_1c=[_1c];
obj[_1d.path]=_1c;
}
}
_1c[_1d.index]=_15;
}
}
return _13;
};
Jsoner.prototype.registerDataProvider=function(_1f,_20){
this.fDataProviderCache.put(_1f,_20);
};
Jsoner.prototype.getValue=function(_21,_22){
var _23=undefined;
if(COMMONS.isObject(_21)){
try{
_23=_21[_22];
if(COMMONS.isUndefined(_23)){
var fnc=this.fDataProviderCache.get(_22);
if(!COMMONS.isFunction(fnc)){
var _25="return aData";
if(_22.length>0){
if(_22.charAt(0)==="["){
_25+=_22;
}else{
_25+="."+_22;
}
}
fnc=new Function("aData",_25);
this.registerDataProvider(_22,fnc);
}
_23=fnc.call(this,_21);
}
}
catch(ex){
}
}
return _23;
};
Jsoner.prototype.setValue=function(_26,_27,_28,_29){
var _2a=_26;
if(COMMONS.isObject(_26)){
var _2b=(COMMONS.isUndefined(_29)||_29);
this.populate(_26,_27,_28,_2b);
}
return _2a;
};
Jsoner.prototype.isMute=function(_2c,_2d,_2e){
var _2f=_2c===Jsoner.MAGIC_HASH_CODE||!_2e.hasOwnProperty(_2c)||COMMONS.isFunction(_2d);
return _2f;
};
Jsoner.prototype.isAttribute=function(_30,_31){
var _32=true;
if(_31===null||COMMONS.isObject(_31)){
_32=COMMONS.isDate(_31)||COMMONS.isRegExp(_31)||_31===null;
}
return _32;
};
Jsoner.prototype.isText=function(_33){
return (_33==="text");
};
Jsoner.prototype.isCDATA=function(_34){
return (_34==="PCDATA");
};
Jsoner.prototype.collectAttributes=function(_35,_36,_37){
var _38=[];
var _39;
if(COMMONS.isObject(_36)){
for(var _3a in _36){
try{
_39=_36[_3a];
if(!this.isMute(_3a,_39,_36)&&this.isAttribute(_3a,_39)){
_38.push({name:_3a,value:_39});
}
}
catch(ex){
this.fLogger.warning("collectAttributes, unable to collect attribute:"+_3a,ex);
}
}
}
return _38;
};
Jsoner.prototype.collectChildren=function(_3b,_3c,_3d){
var _3e=[];
var _3f;
for(var _40 in _3c){
try{
_3f=_3c[_40];
if(!this.isMute(_40,_3f,_3c)&&!this.isAttribute(_40,_3f)){
_3e.push({name:_40,value:_3f});
}
}
catch(ex){
this.fLogger.warning("collectChildren, unable to collect child:"+_40,ex);
}
}
return _3e;
};
Jsoner.prototype.isResolveCrossLinks=function(_41){
return true;
};
Jsoner.prototype.addHashCode=function(_42,_43){
if(COMMONS.isObject(_42)){
_42[Jsoner.MAGIC_HASH_CODE]=_43;
}
};
Jsoner.prototype.getHashCode=function(_44){
var _45=undefined;
if(COMMONS.isObject(_44)){
_45=_44[Jsoner.MAGIC_HASH_CODE];
}
return _45;
};
Jsoner.prototype.removeHashCode=function(_46){
if(COMMONS.isObject(_46)&&_46[Jsoner.MAGIC_HASH_CODE]!==undefined){
_46[Jsoner.MAGIC_HASH_CODE]=undefined;
delete _46[Jsoner.MAGIC_HASH_CODE];
}
};
Jsoner.prototype.jsonTreeWalker=function(_47,_48){
var _49=-1;
var _4a=[];
var _4b=true;
var map=new HashMap();
function walkNode(_4d,_4e,_4f,_50){
var _51,index,value;
if(_4b){
if(this.isWalkArray(_4a,_4e,_47)){
for(var i=0;i<_4e.length&&_4b;i++){
walkNode.call(this,_4d,_4e[i],_4f,i);
}
}else{
var _53=COMMONS.isDefined(_50)?_4d+"["+_50+"]":_4d;
if(_4f>_49){
_4a.push(_53);
_49=_4f;
}else{
_4a[_4f]=_53;
}
if(this.isWalkNode(_4a,_4e,_47)){
try{
_51=this.collectAttributes(_4a,_4e,_47);
index=this.getHashCode(_4e);
if(COMMONS.isUndefined(index)){
if(this.isResolveCrossLinks(_4e)){
index=map.getSize();
this.addHashCode(_4e,index);
map.put(index,_4d);
}
try{
var _54=this.collectChildren(_4a,_4e,_47);
if(_54.length>0){
try{
_4b=_48.call(this,_4a,_4e,_51,Jsoner.JSON_NODE_START,_4f,_50);
}
catch(ex){
this.fLogger.error("jsonTreeWalker, ["+_4a+"] call back error",ex);
}
if(_4b){
for(var i=0;i<_54.length&&_4b;i++){
walkNode.call(this,_54[i].name,_54[i].value,_4f+1,null);
}
_4a.pop();
_49--;
_4b=_48.call(this,_4a,_4e,null,Jsoner.JSON_NODE_END,_4f,_50);
}
}else{
try{
_4b=_48.call(this,_4a,_4e,_51,Jsoner.JSON_NODE_LEAF,_4f,_50);
}
catch(ex){
this.fLogger.error("jsonTreeWalker, ["+_4a+"] call back error",ex);
}
}
}
finally{
this.removeHashCode(_4e);
}
}else{
value=map.get(index);
try{
_4b=_48.call(this,_4a,value,_51,Jsoner.JSON_NODE_CROSS_LINKED,_4f,_50);
}
catch(ex){
this.fLogger.error("jsonTreeWalker, ["+_4a+"] call back error",ex);
}
}
}
catch(exception){
this.fLogger.error("jsonTreeWalker, traverse node "+_4d+" failed",exception);
}
}else{
_4b=_48.call(this,_4a,_4e,null,Jsoner.JSON_ATTRIBUTE,_4f,_50);
}
}
}
}
if(COMMONS.isFunction(_48)){
if(this.isWalkArray([],_47,_47)){
walkNode.call(this,"",_47,0);
}else{
var _55;
for(var _56 in _47){
try{
_55=_47[_56];
if(!this.isMute(_56,_55,_47)){
walkNode.call(this,_56,_55,0);
}
}
catch(ex){
this.fLogger.info("jsonTreeWalker, unable to walk object property: "+_56,ex);
}
}
}
map.clear();
}else{
this.fLogger.error("jsonTreeWalker, callback function undefined");
}
};
Jsoner.prototype.getLastProperty=function(_57){
var _58=undefined;
if(COMMONS.isArray(_57)){
_58=_57[_57.length-1];
if(_58.charAt(_58.length-1)==="]"){
var _59=_58.indexOf("[");
if(_59>0){
_58=_58.substring(0,_59);
}
}
}
return _58;
};
Jsoner.prototype.jsonToXML=function(_5a,_5b,_5c,_5d,_5e){
var _5f=function(_60){
var _61="";
for(var i=0;i<_60;i++){
_61+=" ";
}
return _61;
};
var _63=function(_64,_65,_66,_67){
var _68=_64;
if(_67===Jsoner.JSON_NODE_CROSS_LINKED){
_68=Jsoner.CROSS_LINK_PREFIX+_68;
}
return _68;
};
var _69="";
var _6a=this.converterFactory(_5c);
var _6b=this.converterFactory(_5d);
var _6c=this.converterFactory(_5e?_5e:_63);
this.jsonTreeWalker(_5a,function(_6d,_6e,_6f,_70){
var _71;
var _72;
var _73;
var _74=_6a.call(this,this.getLastProperty(_6d),_6d,_70);
if(COMMONS.isDefined(_74)){
if(_5b){
_69+=_5f(_6d.length-1);
}
if(_70===Jsoner.JSON_NODE_START||_70===Jsoner.JSON_NODE_LEAF){
var _75="";
var _76="";
_69+="<"+_74;
if(COMMONS.isArray(_6f)){
for(var i=0;i<_6f.length;i++){
_73=_6f[i];
_72=_73.name;
_71=_6c.call(this,_73.value,_72,_6d,_70);
if(!COMMONS.isUndefined(_71)){
_72=_6b.call(this,_72,_71,_6d);
if(COMMONS.isDefined(_72)){
if(this.isText(_72)){
_76+=_71;
}else{
if(this.isCDATA(_72)){
_75+=_71;
}else{
_69+=" "+_72+"=\""+_71+"\"";
}
}
}
}
}
}
if(_75.length>0||_76.length>0){
_69+=">";
if(_5b){
_69+="\n"+_5f(_6d.length);
}
_69+=(_75.length>0)?"<![CDATA["+_75+_76+"]]>":_76;
if(_70===Jsoner.JSON_NODE_LEAF){
if(_5b){
_69+="\n"+_5f(_6d.length-1);
}
_69+="</"+_74+">";
}
}else{
_69+=(_70===Jsoner.JSON_NODE_LEAF)?"/>":">";
}
}else{
if(_70===Jsoner.JSON_NODE_END){
_69+="</"+_74+">";
}else{
if(_70===Jsoner.JSON_ATTRIBUTE||_70===Jsoner.JSON_NODE_CROSS_LINKED){
_71=_6c.call(this,_6e,_74,_6d,_70);
if(COMMONS.isDefined(_71)){
_69+="<"+_74+">"+_71+"</"+_74+">";
}
}
}
}
if(_5b){
_69+="\n";
}
}
return true;
});
return _69;
};
Jsoner.prototype.jsonPathEvaluator=function(_78,_79){
var _7a=true;
this.jsonTreeWalker(_78,function(_7b,_7c,_7d,_7e){
var _7f;
var _80;
if(_7e===Jsoner.JSON_NODE_START||_7e===Jsoner.JSON_NODE_LEAF||_7e===Jsoner.JSON_ATTRIBUTE||_7e===Jsoner.JSON_NODE_CROSS_LINKED){
var _81=_7b.join(".");
if(_7e===Jsoner.JSON_NODE_CROSS_LINKED){
var _82=_81.lastIndexOf(_7c);
_80=Jsoner.CROSS_LINK_PREFIX+(_82>0?_81.substring(0,_82+_7c.length):_7c);
_7a=_79.call(this,_81,_80,_7e);
}else{
if(COMMONS.isArray(_7d)){
for(var i=0;i<_7d.length;i++){
_7f=_7d[i];
_7a=_79.call(this,_81+"."+_7f.name,_7f.value,_7e);
if(!_7a){
break;
}
}
}else{
_7a=_79.call(this,_81,_7c,_7e);
}
}
}
return _7a;
});
};
Jsoner.prototype.jsonToPathValue=function(_84){
var _85="";
this.jsonPathEvaluator(_84,function(_86,_87,_88){
_85+=_86+" = "+_87+"\n";
return true;
});
return _85;
};
Jsoner.prototype.createNewInstance=function(_89){
var _8a=_89;
if(COMMONS.isObject(_89)){
var _8b=JSINER.getConstructor(_89);
_8a=new _8b();
}
return _8a;
};
Jsoner.prototype.clone=function(_8c){
var map=new HashMap();
var _8e=function(_8f){
var _90;
var _91;
var _92=this.getHashCode(_8f);
if(COMMONS.isUndefined(_92)){
_90=this.createNewInstance(_8f);
if(this.isResolveCrossLinks(_8f)){
_92=map.getSize();
this.addHashCode(_8f,_92);
map.put(_92,_90);
}
try{
for(var _93 in _8f){
_91=_8f[_93];
if(!this.isMute(_93,_91,_8f)){
if(!this.isAttribute(_93,_91)){
_92=this.getHashCode(_91);
if(COMMONS.isDefined(_92)){
_91=map.get(_92);
}else{
_91=_8e.call(this,_91);
}
}
_90[_93]=_91;
}
}
}
finally{
this.removeHashCode(_8f);
}
}else{
_90=map.get(_92);
}
return _90;
};
var _94=_8e.call(this,_8c,map);
map.clear();
return _94;
};
Jsoner.prototype.merge=function(_95,_96,_97){
var _98=this.clone(_95);
var _99=(COMMONS.isUndefined(_97)||_97);
var map=new HashMap();
if(COMMONS.isObject(_96)&&COMMONS.isObject(_95)){
this.jsonPathEvaluator(_96,function(_9b,_9c,_9d){
if(_9d!==Jsoner.JSON_NODE_CROSS_LINKED){
var _9e=COMMONS.isUndefined(this.getValue(_98,_9b));
if(!_9e){
var _9f=_9b.lastIndexOf(".");
if(_9f>0){
var _a0=_9b.substring(_9f+1);
_9e=this.isAttribute(_a0,_9c);
}
}
if(_9e){
if(COMMONS.isString(_9c)&&_9c.indexOf(Jsoner.CROSS_LINK_PREFIX)===0){
map.put(_9b,_9c.substring(Jsoner.CROSS_LINK_PREFIX.length));
}else{
this.populate(_98,_9b,_9c,_99);
}
}
}else{
map.put(_9b,_9c.substring(Jsoner.CROSS_LINK_PREFIX.length));
}
return true;
});
if(!map.isEmpty()){
var _a1;
for(var _a2 in map.fObject){
if(map.fObject.hasOwnProperty(_a2)){
_a1=this.getValue(_98,map.get(_a2));
this.populate(_98,_a2,_a1,_99);
}
}
}
}
return _98;
};
Jsoner.prototype.isEquals=function(_a3,_a4){
var _a5=function(_a6,_a7){
var _a8=true;
var _a9=new HashMap();
var _aa=new KeySet();
this.jsonPathEvaluator(_a6,function(_ab,_ac,_ad){
if(_ad!==Jsoner.JSON_NODE_CROSS_LINKED){
if(!this.isEquals(_ac,this.getValue(_a7,_ab))){
this.fLogger.info("isEquals, difference found:"+_ab);
_a8=false;
}else{
_aa.add(_ab);
}
}else{
_a9.put(_ab,_ac);
}
return _a8;
});
if(_a8){
this.jsonPathEvaluator(_a7,function(_ae,_af,_b0){
if(!_aa.isContains(_ae)){
if(_b0!==Jsoner.JSON_NODE_CROSS_LINKED){
if(!this.isEquals(_af,this.getValue(_a6,_ae))){
this.fLogger.info("isEquals, difference found:"+_ae);
_a8=false;
}
}else{
if(!this.isEquals(_af,_a9.get(_ae))){
this.fLogger.info("isEquals, cross link not equal:"+_ae);
_a8=false;
}else{
_a9.remove(_ae);
}
}
}
return _a8;
});
}
return _a8&&_a9.isEmpty();
};
var _b1=JSINER.getType(_a3)===JSINER.getType(_a4);
if(_b1){
if(COMMONS.isObject(_a3)){
if(COMMONS.isArray(_a3)){
_b1=(_a3.length===_a4.length);
}
if(_b1){
_b1=_a5.call(this,_a3,_a4);
}
}else{
_b1=(_a3===_a4);
}
}
return _b1;
};
Jsoner.prototype.getDifference=function(_b2,_b3){
var _b4=function(_b5){
var _b6=_b5;
var _b7=_b5.lastIndexOf("]");
if(_b7>0&&_b7<_b5.length-1){
var _b8=_b5.lastIndexOf("[");
_b6={path:_b5.substring(0,_b8),index:COMMONS.toInteger(_b5.substring(_b8+1,_b7)),property:_b5.substring(_b7+2)};
}
return _b6;
};
var _b9=function(_ba,_bb,_bc){
var _bd=new HashMap();
var _be=new KeySet();
this.jsonPathEvaluator(_ba,function(_bf,_c0,_c1){
if(_c1!==Jsoner.JSON_NODE_CROSS_LINKED){
_be.add(_bf);
if(!this.isEquals(_c0,this.getValue(_bb,_bf))){
this.setValue(_bc,_bf,_c0);
}
}else{
_bd.put(_bf,_c0);
}
return true;
});
this.jsonPathEvaluator(_bb,function(_c2,_c3,_c4){
if(!_be.isContains(_c2)){
if(_c4!==Jsoner.JSON_NODE_CROSS_LINKED){
var _c5=this.getValue(_ba,_c2);
if(!this.isEquals(_c3,_c5)){
var obj=_b4(_c2);
if(!COMMONS.isString(obj)){
var _c7;
for(var i=0;i<obj.index;i++){
_c7=obj.path+"["+i+"]."+obj.property;
this.setValue(_bc,_c7,this.getValue(_ba,_c7));
}
}
this.setValue(_bc,_c2,_c5);
}
}else{
if(this.isEquals(_c3,_bd.get(_c2))){
_bd.remove(_c2);
}
}
}
return true;
});
if(!_bd.isEmpty()){
for(var _c9 in _bd.fObject){
if(_bd.fObject.hasOwnProperty(_c9)){
this.setValue(_bc,_c9,_bd.fObject[_c9]);
}
}
}
};
var _ca=_b2;
if(COMMONS.isObject(_b2)&&COMMONS.isObject(_b3)){
_ca=this.createNewInstance(_b2);
_b9.call(this,_b2,_b3,_ca);
}
return _ca;
};
Jsoner.prototype.jsonToMap=function(_cb,_cc,_cd){
var _ce={};
if(COMMONS.isArray(_cb)){
var key;
for(var i=0;i<_cb.length;i++){
key=this.getValue(_cb[i],_cc);
if(COMMONS.isDefined(key)){
_ce[key]=this.getValue(_cb[i],_cd);
}
}
}else{
this.fLogger.error("jsonToMap, unsupported data type, array required: "+_cb);
}
return _ce;
};
Jsoner.prototype.visit=function(_d1,_d2,_d3){
this.jsonTreeWalker(_d1,function(_d4,_d5,_d6,_d7){
var _d8=true;
if(_d7===Jsoner.JSON_NODE_START||_d7===Jsoner.JSON_NODE_LEAF||_d7===Jsoner.JSON_ATTRIBUTE){
if(_d2.call(this,_d4,_d5,_d6)){
_d8=_d3.call(this,_d4,_d5,_d6);
}
}
return _d8;
});
};
Jsoner.prototype.defaultAcceptor=function(_d9,_da,_db,_dc){
var _dd=true;
if(COMMONS.isDefined(_db)){
var _de=_d9.join(".");
_dd=this.isMatch(_db,_de);
}
if(_dd&&COMMONS.isDefined(_dc)){
var _df;
var _e0;
for(var _e1 in _dc){
_df=this.getValue(_da,_e1);
_e0=_dc[_e1];
if(COMMONS.isRegExp(_e0)){
_dd=_e0.test(""+_df);
}else{
_dd=(_e0===_df);
}
if(!_dd){
break;
}
}
}
return _dd;
};
Jsoner.prototype.lookupAll=function(_e2,_e3,_e4){
var _e5=[];
this.visit(_e2,function(_e6,_e7,_e8){
return this.defaultAcceptor.call(this,_e6,_e7,_e3,_e4);
},function(_e9,_ea){
_e5.push(_ea);
return true;
});
return _e5;
};
Jsoner.prototype.lookupFirst=function(_eb,_ec,_ed){
var _ee=null;
this.visit(_eb,function(_ef,_f0,_f1){
return this.defaultAcceptor(_ef,_f0,_ec,_ed);
},function(_f2,_f3){
_ee=_f3;
return false;
});
return _ee;
};
Jsoner.prototype.isContains=function(_f4,_f5,_f6){
var _f7=this.lookupFirst(_f4,_f5,_f6);
return (_f7!==null);
};
Jsoner.prototype.getCount=function(_f8,_f9,_fa){
var _fb=0;
this.visit(_f8,function(_fc,_fd,_fe){
return this.defaultAcceptor(_fc,_fd,_f9,_fa);
},function(_ff,_100){
_fb++;
return true;
});
return _fb;
};
Jsoner.prototype.getAttributes=function(_101,_102){
var _103=this.getValue(_101,_102);
var _104=this.collectAttributes(_102,_103,_101);
return _104;
};
Jsoner.prototype.getChildren=function(_105,_106){
var _107=[];
var obj=this.getValue(_105,_106);
if(COMMONS.isDefined(obj)){
_107=this.collectChildren(_106,obj,_105);
}
return _107;
};
Jsoner.prototype.isLeaf=function(_109,_10a){
var _10b=this.getChildren(_109,_10a);
return _10b.length===0;
};
Jsoner.prototype.getFirstChild=function(_10c,_10d){
var _10e=this.getChildren(_10c,_10d);
var _10f=_10e.length>0?_10e[0]:undefined;
return _10f;
};
Jsoner.prototype.getLastChild=function(_110,_111){
var _112=this.getChildren(_110,_111);
var _113=_112.length>0?_112[_112.length-1]:undefined;
return _113;
};
Jsoner.prototype.addChild=function(_114,_115,_116,_117){
function parsePath(_118){
var _119=_118;
if(_118.charAt(_118.length-1)==="]"){
var _11a=_118.lastIndexOf("[");
_119={path:_118.substring(0,_11a),index:_118.substring(_11a+1,_118.length-1)};
}
return _119;
}
var obj=this.getValue(_114,_115);
if(COMMONS.isUndefined(_117)){
if(COMMONS.isUndefined(obj)){
this.setValue(_114,_115,_116);
}else{
if(!COMMONS.isArray(obj)){
obj=[obj];
this.setValue(_114,_115,obj);
}
obj.push(_116);
}
}else{
if(COMMONS.isUndefined(obj)){
obj=[];
this.setValue(_114,_115,obj);
}else{
if(!COMMONS.isArray(obj)){
obj=[obj];
this.setValue(_114,_115,obj);
}
if(_117<obj.length){
for(var i=obj.length-1;i>=_117;i--){
obj[i+1]=obj[i];
}
}
obj[_117]=_116;
}
}
return _114;
};
Jsoner.prototype.removeChildren=function(_11d,_11e){
var obj=this.getValue(_11d,_11e);
if(!COMMONS.isUndefined(obj)){
this.setValue(_11d,_11e,undefined);
delete _11d[_11e];
}
return _11d;
};
Jsoner.prototype.removeChild=function(_120,_121,_122){
var obj=this.getValue(_120,_121);
if(!COMMONS.isUndefined(obj)){
if(COMMONS.isArray(obj)){
var _124=-1;
for(var i=0;i<obj.length;i++){
var _126=obj[i];
if(_126===_122){
_124=i;
break;
}
}
if(_124!==-1){
for(var i=_124;i<obj.length-1;i++){
obj[i]=obj[i+1];
}
obj.length=obj.length-1;
}
}else{
if(this.isEquals(obj,_122)){
this.setValue(_120,_121,undefined);
delete _120[_121];
}
}
}
return _120;
};
Jsoner.prototype.htmlFormEvaluator=function(_127,_128){
if(COMMONS.isDefined(_127)){
for(var i=0;i<_127.elements.length;i++){
var _12a=_127.elements[i];
if(_12a.name){
_128.call(this,_12a.name,_12a);
}
}
}
};
Jsoner.prototype.setFieldValue=function(_12b,_12c){
if(COMMONS.isObject(_12b)){
if(typeof (_12b)==="select"){
for(var i=0;i<_12b.options.length;i++){
var _12e=_12b.options[i];
if(_12e.value===_12c){
_12b.selectedIndex=i;
_12e.selected=true;
}else{
_12e.removeAttribute("selected");
}
}
}else{
if(_12b.type==="checkbox"||_12b.type==="radio"){
_12b.checked=(_12b.value===(""+_12c));
}else{
_12b.value=COMMONS.isDefined(_12c)?_12c:"";
}
}
}
};
Jsoner.prototype.getFieldValue=function(_12f){
var _130=undefined;
if(COMMONS.isObject(_12f)){
if(typeof (_12f)==="select"){
_130=_12f.options[_12f.selectedIndex].value;
}else{
if(_12f.type==="checkbox"){
_130=_12f.checked?_12f.value:false;
}else{
if(_12f.type==="radio"){
if(_12f.checked){
_130=_12f.value;
}
}else{
_130=_12f.value;
}
}
}
}
return _130;
};
Jsoner.prototype.populateJsonToForm=function(_131,_132,_133){
if(COMMONS.isDefined(_132)&&COMMONS.isDefined(_131)){
var _134=this.converterFactory(_133);
this.htmlFormEvaluator(_132,function(_135,_136){
var path=_134.call(this,_135,_136);
if(COMMONS.isString(path)){
var _138=this.getValue(_131,path);
if(this.getFieldValue(_136)!==_138){
this.setFieldValue(_136,_138?_138:"");
if(COMMONS.isFunction(_136.onchange)){
_136.onchange.call(_136);
}else{
if(COMMONS.isFunction(_136.onclick)){
_136.onclick.call(_136);
}
}
}
}
});
}
};
Jsoner.prototype.defaultHtmlConverter=function(_139,_13a){
var _13b=_139;
if(COMMONS.toBoolean(_13a.readOnly)||COMMONS.toBoolean(_13a.disabled)){
_13b=null;
}
return _13b;
};
Jsoner.prototype.populateFormToJson=function(_13c,_13d,_13e){
var _13f=_13d;
var _140=new KeySet();
if(COMMONS.isObject(_13c)){
var _141=this.converterFactory(_13e||this.defaultHtmlConverter);
this.htmlFormEvaluator(_13c,function(_142,_143){
var path=_141.call(this,_142,_143);
if(COMMONS.isString(path)){
var _145=this.getFieldValue(_143);
if(COMMONS.isDefined(_145)){
var _146=this.getValue(_13f,path);
if(COMMONS.isNumber(_146)){
_145=COMMONS.toFloat(_145);
}else{
if(COMMONS.isBoolean(_146)){
_145=COMMONS.toBoolean(_145);
}
}
this.populate(_13f,path,_145,true);
}
}
});
}
return _13f;
};
Jsoner.prototype.PATTERN_CDATA_KEY="CDATA";
Jsoner.prototype.PATTERN_DEFAULT_KEY="default";
Jsoner.prototype.selectPatternResolver=function(_147,_148,_149){
var _14a=this.getValue(_147,_148);
if(COMMONS.isUndefined(_14a)){
var _14b=_148.lastIndexOf(".");
if(_14b>0){
_148=_148.substring(_14b+1);
}
if(this.isText(_148)||this.isCDATA(_148)){
_14a=this.getValue(_147,this.PATTERN_CDATA_KEY);
}
if(COMMONS.isUndefined(_14a)){
var type=typeof (_149);
_14a=this.getValue(_147,type);
if(COMMONS.isUndefined(_14a)){
_14a=this.getValue(_147,this.PATTERN_DEFAULT_KEY);
}
}
}
return this.clone(_14a);
};
Jsoner.prototype.cascadePatternResolver=function(_14d,_14e,_14f){
var _150=this.merge(this.getValue(_14d,this.PATTERN_DEFAULT_KEY),this.getValue(_14d,typeof (_14f)),true);
var _151=_14e.lastIndexOf(".");
if(_151>0){
var name=_14e.substring(_151+1);
if(this.isText(name)||this.isCDATA(name)){
_150=this.merge(_150,this.getValue(_14d,this.PATTERN_CDATA_KEY),true);
}
}
var key=[];
var path=_14e.split(".");
for(var i=0;i<path.length;i++){
key.push(path[i]);
_150=this.merge(_150,this.getValue(_14d,key.join(".")),true);
}
return _150;
};
Jsoner.prototype.jsonToHTML=function(_156,_157,_158,_159,_15a){
var _15b=_158||this.cascadePatternResolver;
var _15c=_15a||this.jsonToDOM;
var _15d=COMMONS.isFunction(_159)?_159:function(){
return _159;
};
this.jsonPathEvaluator(_156,function(_15e,_15f){
var _160=_15b.call(this,_157,_15e,_15f);
if(COMMONS.isDefined(_160)){
var _161=_15d.call(this,_15e,_15f);
if(COMMONS.isObject(_161)){
var node=_15c.call(this,_160,_161.ownerDocument||document,_15e,_15f);
if(COMMONS.isObject(node)){
if(COMMONS.isArray(node)){
for(var i=0;i<node.length;i++){
_161.appendChild(node[i]);
}
}else{
_161.appendChild(node);
}
}
}
}
return true;
});
};
Jsoner.prototype.jsonToDOM=function(_164,_165,_166,_167){
var _168=null;
var _169=null;
var _16a=0;
var _16b=this.converterFactory(_166);
var _16c=this.converterFactory(_167);
this.jsonTreeWalker(_164,function(_16d,_16e,_16f,_170,_171){
var _172=null;
if(_170===Jsoner.JSON_NODE_START||_170===Jsoner.JSON_NODE_LEAF||_170===Jsoner.JSON_ATTRIBUTE){
var _173=_16b.call(this,this.getLastProperty(_16d),_16e);
if(COMMONS.isString(_173)){
_172=_165.createElement(_173);
if(_170===Jsoner.JSON_ATTRIBUTE){
_172.appendChild(_165.createTextNode(_16e));
}
if(COMMONS.isArray(_16f)){
for(var i=0;i<_16f.length;i++){
var _175=_16f[i];
var name=_16c.call(this,_175.name,_175.value,_16d);
if(COMMONS.isDefined(name)){
var _177=_175.value;
if(this.isText(name)||this.isCDATA(name)){
_172.appendChild(_165.createTextNode(_177));
}else{
if(name==="class"){
_172.className=_177;
}else{
if(COMMONS.isIE&&(name.indexOf("on")===0)){
_172.attachEvent(name,new Function("",_177));
}else{
if(COMMONS.isIE&&name==="style"){
_172.style.cssText=_177;
}else{
_172.setAttribute(name,_177);
}
}
}
}
}
}
}
if(_171===0){
_168=_168?[_168]:_172;
if(COMMONS.isArray(_168)){
_168.push(_172);
}
}else{
while(_16a>=_171){
_169=_169.parentNode;
_16a--;
}
if((_16d==="tr"||_16d==="TR")&&_169.nodeName==="TABLE"){
var _178=_165.createElement("tbody");
_169.appendChild(_178);
_169=_178;
}
_169.appendChild(_172);
}
_169=_172;
_16a=_171;
}
}
return true;
});
return _168;
};
