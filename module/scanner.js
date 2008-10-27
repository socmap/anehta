// Scanner,Detector
// 扫描结果会自动保存在cache中
// cache中的结果会定时发送到server

//出于性能考虑扫描列表放在这里
// activex 签名
anehta.signatures.activex = new Array(
  "Flash Player 8|ShockwaveFlash.ShockwaveFlash.8|classID",
  "Flash Player 9|ShockwaveFlash.ShockwaveFlash.9|classID",
  "360Safe|360SafeLive.Update|classID",
  "Alibaba User(AliEdit)|Aliedit.EditCtrl|classID",
  "CMB Bank|CMBHtmlControl.Edit|classID",
  //"Apple IPOD USER|IPodUpdaterExt.iPodUpdaterInterface|classID",  非安全的控件
  //"Apple iTunes|iTunesAdmin.iTunesAdmin|classID",
  "JRE 1.5(WebStart)|JavaWebStart.isInstalled.1.5.0.0|classID",
  "JRE 1.6(WebStart)|JavaWebStart.isInstalled.1.6.0.0|classID",
  //"KMPlayer|KMPlayer.TKMPDropTarget|classID",
  //"KingSoft Word(词霸)|KSEngine.Word|classID",
  //"Windows live Messanger|Messenger.MsgrObject|classID",
  //"Nero|NeroFileDialog.NeroFileDlg|classID",
  //"Nokia Cellphone|NokiaCL.PhoneControl|classID",
  "PPlayer|PPlayer.XPPlayer|classID",
  "Tencent QQ|Qqedit.PasswordEditCtrl|classID",
  "QuickTime|QuickTime.QTElementBehavior|classID",
  //"Symantec Anti-Virus|Symantec.stInetTransferItem|classID",
  "Xunlei|XunLeiBHO.ThunderIEHelper|classID",
  //"Yahoo Messenger|Yahoo.Messenger|classID",
  ""
);

anehta.signatures.ffextensions = [
  {name: 'Adblock Plus', url: 'chrome://adblockplus/skin/adblockplus.png'},
  {name: 'Customize Google', url: 'chrome://customizegoogle/skin/32x32.png'},
  {name: 'DownThemAll!', url: 'chrome://dta/content/immagini/icon.png'},
  {name: 'Faster Fox', url: 'chrome://fasterfox/skin/icon.png'},
  {name: 'Flash Block', url: 'chrome://flashblock/skin/flash-on-24.png'},
  {name: 'FlashGot', url: 'chrome://flashgot/skin/icon32.png'},
  {name: 'Google Toolbar', url: 'chrome://google-toolbar/skin/icon.png'},
  {name: 'Greasemonkey', url: 'chrome://greasemonkey/content/status_on.gif'},
  {name: 'IE Tab', url: 'chrome://ietab/skin/ietab-button-ie16.png'},
  {name: 'IE View', url: 'chrome://ieview/skin/ieview-icon.png'},
  {name: 'JS View', url: 'chrome://jsview/skin/jsview.gif'},
  {name: 'Live HTTP Headers', url: 'chrome://livehttpheaders/skin/img/Logo.png'},
  {name: 'SEO For Firefox', url: 'chrome://seo4firefox/content/icon32.png'},
  {name: 'Search Status', url: 'chrome://searchstatus/skin/cax10.png'},
  {name: 'Server Switcher', url: 'chrome://switcher/skin/icon.png'},
  {name: 'StumbleUpon', url: 'chrome://stumbleupon/content/skin/logo32.png'},
  {name: 'Torrent-Search Toolbar', url: 'chrome://torrent-search/skin/v.png'},
  {name: 'User Agent Switcher', url: 'chrome://useragentswitcher/content/logo.png'},
  {name: 'View Source With', url: 'chrome://viewsourcewith/skin/ff/tb16.png'},
  {name: 'Web Developer', url: 'chrome://webdeveloper/content/images/logo.png'}
];    
      
      
anehta.signatures.sites = new Array(
  "http://www.google.com",
  "http://www.google.cn",
  "http://www.baidu.com",
  "http://www.taobao.com",
  "http://www.alipay.com",
  "http://www.sohu.com",
  "http://www.sina.com.cn",
  "http://www.163.com",
  "http://www.qq.com",
  "http://www.qidian.com",
  "http://www.tianyaclub.com",
  "http://www.kaixin001.com",
  "http://www.xiaonei.com",
  "http://planet.ph4nt0m.org",
  "http://hi.baidu.com/aullik5",
  "http://www.secwiki.com/anehta/demo.html",
  "http://hi.baidu.com/fvck"
);
 

anehta.signatures.ports = new Array(21, 22, 23, 25, 53, 80, 
  110, 118, 137, 139, 143, 161, 389, 443, 445, 547, 1080, 1433,
  1521, 3306, 3389, 8000, 8008, 8080, 8888, 10000);
  

anehta.scanner.ffplugins();
//alert(anehta.detect.ffplugin("s"));
anehta.scanner.activex();

anehta.scanner.history();

// 扫描端口效果很不好
//anehta.scanner.ports("www.secwiki.com", 900);
//anehta.scanner.checkPort("www.secwiki.com", "135", 900);