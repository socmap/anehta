<?php
  //加载auth类
  include_once("class/auth_Class.php");

  header("Content-Type: text/html; charset=utf-8");
  
  checkLoginStatus();  
  
  createCookie("anehtaDoor", null, -1, '/', '', 0, 1);
  
  unlink("../temp/session_token");
  
  header("Location: login.php");
  
?>

