=============== phprpoxy [==>Opentools.Uni.cc]===================
   这个代理程序一定程度模仿了 cgiproxy ，他是利用perl编写的，而我这个
是用php编写的，故名之为 phpproxy ！
   这个程序发布在gpl协议下，因此在该协议下，你可以修改，重新发布！
欢迎大家反映bug，请到 
  http://members.lycos.co.uk/dotop/phpBB2/index.php
  (这个网站经常封中国的ip，那时不要忘记用我的phpproxy访问呀：）
   或者到我的另一个站点：http://yabsoft.biz
  )
  如有任何使用上的问题，也可到上述网址求助。

=============== feather   list:   ===============================
功能列表：

1.支持图象显示。

2.可以向服务器get，post数据，可以传递cookie。 现在支持上传文件。

3.支持http，https协议，但 https 需要 php 安装 openssl 模块。

4.支持代理服务器设置。

5.支持下载zip,tar.gz等。

6.自动修改script,style中的url,open,action等url值。

7.可以 disabled javascript,也可以阻止特定网址的弹出窗口。

8.支持多语言设置。

9.增加了配置文件,更易于设置各项功能,可以开放phpproxy,也可仅指向某个网页。



===================changs history================================
version 2.1
1.主要增加了通过phpproxy上传文件！
2.还有其他一些细微改动
version 2.0 
1.这一版主要增加了修改style，script标签中的url属性。如style中的background-image：url("others/url/images")
转化为background-image：url("your/url/others/url/images"),这样就可以更好的输出漂亮的网页。其他script中的
url修改与此雷同，不再说明。
2.增加了设置文件，可以对外公开你的phpproxy，也可指向你的某一网页，后者尤其适用于访问你的被封ip的网页。
更多的设置见config.php。
3.支持多语言，我把语言文件单拿出来，里面主要是html，可以安全方便的修改。
4.改正了zip等文件不能下载的bug；改正了转向网址的相对url的替换的bug，如输入的网址是http：//your/bbs
如果你的网页中有相对路径/images/pic.jpg，则被转化为http：//your/bbs/images/pic.jpg，而不是
http：//your/images/pic.jpg。

version 1.0 
首次发布 phpproxy 1.0

=======================to  do ===================================
过滤特定网址的弹出窗口；
......
你还想要什么功能，有什么想法，不要犹豫，请告诉我，我会认真考虑！

   
