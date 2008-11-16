<?php
/*
* 注： 此类来源于互联网
*作者:pangmen
*日期:2007-11-14
*功能:操作XML文件(增、删、改、查)
*版本:正则版
*附:大家可以随意修改此类，合适的话发我一份:)
*   我的E-mail:ad2008bobo@yahoo.com.cn
*
* 使用用例
header('content-type: text/html; charset=utf-8');
include('./libs/x.class.php');
$rootname='ROOT';//根标签名
$fpath='./libs/ooooooooooooooo.xml';//文件的路径，不用手动创建文件
$x=new OpXML('ROOT',$fpath);

//增
$arr=array('username'=>'pangmen','sex'=>'男','tel'=>'139999999','address'=>'北京');
$x->insert($arr);

//删
//$x->deleteRecordById(1);

//改
//$arr=array('username'=>'pangmen','sex'=>'男','tel'=>'139999999','address'=>'北京');
//$x->updateRecordById(1,$arr);

//查(一条记录)
//print_r($x->getRecordById(1));

//查(所有记录)
//print_r($x->getList()); 
*/

class OpXML
{
private $fpath;
private $enter;
private $root;
function __construct($root,$fpath)
{
  $this->fpath=$fpath;
  $this->root=$root;
  $this->enter=chr(13).chr(10);
  $this->checkFile();
}
/*
*函数名:insert
*说明:插入一条记录
*/
public function insert($fields)
{
  $content=$this->getFileContent();
  preg_match_all('|<key>(\d+?)<\/key>|',$content,$matches);
  rsort($matches[1]);
  $newkey=$matches[1][0]+1;
  
  $record='<record>'.$this->enter;
  $record.='<key>'.$newkey.'</key>'.$this->enter;
  foreach($fields as $k=>$v)
  {
   $record.="<$k>$v</$k>".$this->enter;
  }
  $record.='</record>'.$this->enter.$this->enter;
  $this->save(preg_replace('/(?=<\/'.$this->root.'>)/',$record,$content));
  return true;
}
/*
*函数名:insertM
*说明:插入多条记录，参数类型必须是二维数组
*/
public function insertM($arr)
{
  $content=$this->getFileContent();
  preg_match_all('|<key>(\d+?)<\/key>|',$content,$matches);
  rsort($matches[1]);
  $newkey=$matches[1][0]+1;
  
  $record='';
  for($i=0;$i<count($arr);$i++)
  {
   $record.='<record>'.$this->enter;
   $record.='<key>'.$newkey.'</key>'.$this->enter;
   foreach($arr[$i] as $k=>$v)
   {
    $record.="<$k>$v</$k>".$this->enter;
   }
   $record.='</record>'.$this->enter.$this->enter;
   $newkey++;
  }
  $this->save(preg_replace('/(?=<\/'.$this->root.'>)/',$record,$content));
  return true;
}
/*
*函数名:checkFile
*说明:如果文件不存在，则创建之，并初始化
*     否则检查文件规则是否被破坏
*/
private function checkFile()
{
  if(!file_exists($this->fpath))
  {
   $xmlstr='';
   $xmlstr='<?xml version="1.0" encoding="UTF-8"?>'.$this->enter;
   $xmlstr.='<'.$this->root.'>'.$this->enter.$this->enter;
   $xmlstr.='</'.$this->root.'>';
   $this->save($xmlstr);
  }
  else
  {
   $content=$this->getFileContent();
   $bool_statement=preg_match('/<\?xml version="1\.0".*?\?>/',$content)==0 ? false : true;
   $bool_root=preg_match('/<'.$this->root.'>.*<\/'.$this->root.'>/s',$content)==0 ? false : true;
   preg_match_all('|(<record>(?:.+?)<\/record>)|s',$content,$matches);
   for($i=0;$i<count($matches[1]);$i++)
   {
    $re='/^<record>\s*<key>(\d+)<\/key>\s*[\s\S]*\s*<\/record>$/';
    $bool_record=preg_match($re,$matches[1][$i],$arr)==0 ? false : true;
    $keys[]=$arr[1];
    if(!$bool_record) break;
   }
   rsort($keys);
   //$bool_repeat=preg_match('/(\d),\1/',join(',',$keys),$wb)==0 ? true : false;
   //if(!($bool_statement && $bool_root && $bool_record && $bool_repeat))
   if(!($bool_statement && $bool_root && $bool_record))
   {
    echo '文件规则已被破坏';
    exit;
   }
  }
}
/*
*函数名:getRecordById
*说明:根据主键ID，获取字段信息
*/
public function getRecordById($id)
{
  $content=$this->getFileContent();
  
  preg_match('/<record>(\s*<key>'.$id.'<\/key>.+?)<\/record>/s',$content,$matches);
  preg_match_all('|(<.+</.+>)|',$matches[1],$arr);
  $arrstr='';
  for($i=0;$i<count($arr[1]);$i++)
  {
   preg_match('/^.+>(.+)<\/(.+)>/',$arr[1][$i],$farr);
   $arrstr.="'$farr[2]'=>'$farr[1]'";
   if($i<count($arr[1])-1) $arrstr.=',';
  }
  eval("\$row=array($arrstr);");  // 可能被xpath注射，以后补
  return $row;
}
/*
*函数名:checkFile
*说明:根据主键ID，更新字段
*/
public function updateRecordById($id,$form_arr=array())
{
  $content=$this->getFileContent();
  foreach($form_arr as $k=>$v)
  {
   $re='/(<key>'.$id.'<\/key>[\s\S]*?<'.$k.'>).+?(<\/'.$k.'>)/s';
   $content=preg_replace($re,'$1'.$v.'$2',$content);
  }
  $this->save($content);
  return true;
}
public function deleteRecordById($id)
{
  $content=$this->getFileContent();
  $content=preg_replace('/<record>\s*<key>'.$id.'+.+?<\/record>(\s)?/s','',$content);
  $this->save($content);
}
/*
*函数名:getList
*说明:获取所有记录，返回一个二维数组
*     先获取所有record记录，再获取字段名和值
*/
public function getList()
{
  $content=$this->getFileContent();
  $rs=array();
  preg_match_all('|<record>(.+?)<\/record>|s',$content,$matches);
  for($i=0;$i<count($matches[1]);$i++)
  {
   preg_match_all('|(<.+</.+>)|',$matches[1][$i],$tmparr);
   $arrstr='';
   for($j=0;$j<count($tmparr[1]);$j++)
   {
    preg_match('/^.+>(.+)<\/(.+)>/',$tmparr[1][$j],$farr);
    $arrstr.="'$farr[2]'=>'$farr[1]'";
    if($j<count($tmparr[1])-1) $arrstr.=',';
   }
   eval("\$rs[]=array($arrstr);");
  }
  return $rs;
}
private function getFileContent()
{
  $hd=fopen($this->fpath,'r');
  $content=fread($hd,filesize($this->fpath));
  fclose($hd);
  return $content;
}
private function save($content)
{
  $hd=fopen($this->fpath,'w');
  fwrite($hd,$content);
  fclose($hd);
}
}
?> 