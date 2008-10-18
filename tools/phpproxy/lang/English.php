
<title>[=PhpProxy=] Online Access To Any Site--></title>
<script>
function chg_lang(){
   document.phpproxy.submit();
}
</script>
</head>
<body bgcolor="#3399CC" text="#000000">
<form action="" method=post name="phpproxy" id="phpproxy">
  <blockquote>
    <div align="left">
      <p><strong><font size="5" face="Arial, Helvetica, sans-serif">[=PhpProxy=]
        Online--></font></strong></p>
      <p> <font size="5">Url&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;:
        <input type=text  height=20 name=url >
        <font size="3">your url</font><br>
        <font size="2"> generally£¬you use this server's IP to surf!</font><font size="2">if you have a proxy host, you can use it
        </font><br>
        Proxy Server:
        <input type=text  height=20 name=proxyserver>
        </font><font size="5"><br>
        <font size="5"> Proxy Port&nbsp;&nbsp;:
        <input type=text  height=20 name=proxyport >
        <font size="3">port(default:80)</font> </font></p>
      <p>
        <font size="5"> Language&nbsp;&nbsp;&nbsp;&nbsp;:
        <select  height=20 name=lang onchange="chg_lang()">
        <option value="" >====Select Lang====</option>
        <?
        if ($dh = opendir(getcwd())) {
            while (($file = readdir($dh)) !== false) {
               if ($file != '..' && $file != '.'){
                   $p=pathinfo($file);
                   $value=substr($file,0,strlen($file)-strlen($p['extension'])-1);
                   echo "<option value=\"$value\" >==$value==</option>";

               }

            }
            closedir($dh);
        }
        ?>
        </select>
      <p><br>
        <input type=submit height=16 name=phpproxy value="Surf!"><input type="checkbox" name="hide_mini_form" onclick="{document.phpproxy.hide_mini_form.value=document.phpproxy.hide_mini_form.value="checked" ? "":"checked";}">Hide Form
      </p>
      </div>
  </blockquote>
</form>

<blockquote>
  <p><tt>Feature List(version 2.0)£º</tt></p>
  <p><tt>1.Surport show images¡£</tt></p>
  <p><tt>2.Surport get£¬post data to server£¬send cookie to server¡£currently,this version do not support upload files by PhpProxy.</tt></p>
  <p><tt>3.Support http£¬https which need  PHP installed with complied openssl moudule.</tt></p>
  <p><tt>4.Support proxy.</tt>
  <p><tt>5.Support download zip,tar.gz and so on.</tt></p>
  <p><tt>6.Add config file,easy to configure lots of settings,may permit anyone to use phpproxy,also point phpproxy to your homepage.</tt></p>

  <br>
  </p>
  <p>&nbsp; </p>
</blockquote>
<div align="center">

  <p><font size="3">]<a href="http://yabsoft.biz" target="_blank">Main Site</a>[===]<a href="http://members.lycos.co.uk/dotop/phpBB2" target="_blank">
    Surport Forum</a>[</font></p>
  <p><font size="3">PhpProxy&copy;ÑÅ²½×Ó2004-2005</font></p>
</div>
