<?php
/***********
* This script takes html retrieved from the remote server and changes all links
* so that it will lead to the script itself with original URL as parameter
*
*/
/*
# changes:(by stephen yabziz 2004.05.14 17.03)
# 1.modify validate urls contained in js script and style,
# eg:window.open(url),document.form.action="url";
# style:url("path/to/images")
# 2.block popup windows;
# 3.diabled js script
# 4.disabled specialed function in js script
*/
class ParseHtml{
var $tag_modifications = array ();//tags modifications
var $source_html;                 //page recieved from the web server
var $html = "";                   //html to display to user agent
var $URI;                         //object with parsed url of html page
var $disabled_js=false;
var $disabled_js_funcs="";
//array of correspondence
var $tag_attributes = array("A" => "HREF",
                            "LINK" => "HREF",
                            "IMG" => "SRC",
                            "FORM" => "ACTION",
                            "TD"  =>"BACKGROUND",
                            "BODY"  =>"BACKGROUND",
                            "TABLE"  =>"BACKGROUND",
                            "META" => "URL",
                            "SCRIPT" => "SRC"
                            );
//replace $key($url)
var $tag_script = array("open"=> "(",
                        ".action"=> "="
                        //"href"=> "=",
                     );
//replace $key($url)
var $tag_style = array("url"=> "("
                     );
//stop popup windows with the specialed url
var $block_pop_url = array(//"news.sohu.com","mail.163.com","alumni.chinaren.com"
                     );
                     

function Parse($html,$URI_obj){
    global $HTTP_SERVER_VARS;
    $this->source_html = $html;
    $this->URI =& $URI_obj;
    $this->script_url = "http://".$HTTP_SERVER_VARS['HTTP_HOST'].$HTTP_SERVER_VARS["SCRIPT_NAME"];
    //offset - position of the parser
    $offset = 0;
    $done = false;
    while (!$done){
        //finding tag opening
        $tag_open_pos = strpos ($html, "<", $offset);
        //if($offset==589) echo "0000".$tag_open_pos;
        if ($tag_open_pos === false){
            //no more tags - just adding the rest of the contents
            $this->html .= substr ($this->source_html, $offset);
            break;
        }
        //there is a tag opening smbol, add preceding page contents
        //(after prev. tag)
        $this->html .= substr ($this->source_html, $offset, $tag_open_pos-$offset);

        //moving the parse pointer to the beginning of the tag
        $offset = $tag_open_pos+1;

        //finding the position of ">" symbol
        $tag_close_pos = strpos ($html, ">", $offset);
        //$tag_close_pos = strpos ($html, "<", $tag_close_pos+1);

        //$tag_close_pos = strpos ($html, "<", $tag_close_pos+1);
        //echo "start-".$offset . "-".$tag_close_pos."-end";
        $offset = $tag_close_pos+1;
        //if there is no closing ">", considering it's the last tag, process it
        //and break the cycle
        //else move parse pointer behind the end of the tag and continue
        if ($tag_close_pos){
            //get the content of the tag to analyse
            $tag_content = trim (substr($html, $tag_open_pos+1, $tag_close_pos-$tag_open_pos-1));
            //change the tag, if needed
            if ($this->is_opening_tag("<$tag_content")){
                $space_position = strpos($tag_content, " ");
                if ($space_position!=false){//tag has attributes
                    $tag_name = substr($tag_content, 0, $space_position);
                }else{
                    $tag_name = $tag_content;
                }

                if((strtoupper($tag_name)=="SCRIPT")||(strtoupper($tag_name)=="STYLE")){

                    //find:$this->html .= "<\". $new_tag . ">";
                    $tag_open2_pos = strpos ($html, "<", $offset);
                    //$offset=$tag_open2_pos;
                    $tag_close2_pos = strpos ($html, ">", $tag_open2_pos);
                    $close_tag = trim (substr($html, $tag_open2_pos+1, $tag_close2_pos-$tag_open2_pos-1));
                    //echo "====$tag_close2_pos ==$tag_open2_pos=====".$close_tag;
                    if((!$this->is_closeing_tag("<$close_tag"))&&(strtoupper($tag_name)=="SCRIPT")){ //echo "close tag:$close_tag";
                         $tag_tmp_pos = strpos ($html, "</$tag_name>", $tag_close2_pos);
                         if($tag_tmp_pos==false){//bad close tag
                             $new_tag_content=$tag_content;
                             $isbreak=true;
                         }
                         else{
                             $tag_text = (substr($html, $offset, $tag_tmp_pos-$offset));
                             //script> code</script
                             $new_tag_content ="".$tag_content.">".$tag_text."</$tag_name";
                             if($this->disabled_js==true){$offset=$tag_tmp_pos+strlen("</script")+1;}
                             $offset=$tag_tmp_pos+strlen("</script")+1;
                             $isbreak=false;
                         }
                    }
                    else{
                        //$tag_open2_pos = strpos ($html, ">", $tag_open2_pos);
                        $tag_text = trim (substr($html, $offset, $tag_close2_pos-$offset));
                        $offset=$tag_close2_pos+1;
                        //==:script> code</script
                        $new_tag_content ="".$this->change_tag($tag_content,'','').">".$tag_text;
                        $isbreak=false;
                    }

                    if((strtoupper($tag_name)=="SCRIPT")&&($isbreak==false)){
                        if($this->disabled_js==true) {
                            $new_tag_content ="".$tag_content.">disabled<"."/script";//$close_tag;
                        }
                        else{
                         foreach($this->tag_script as $key=>$value){
                            $disabled_js_func=split(",",$this->disabled_js_funcs);
                            foreach($disabled_js_func as $mykey=>$func){
                                 $new_tag_content=str_replace($func,"$func=false;//",$new_tag_content);

                            }
                            $subdone=false;
                            $suboffset=0;
                            $tmp_tag_content="";
                            $my_tag_content="";
                            $pre_tag_content="";
                            while(!$subdone){
                                $attrpos=strpos($new_tag_content,$key,$suboffset);
                                //if no string found,return
                                if($attrpos==false){
                                    $my_tag_content = substr ($new_tag_content, $suboffset);
                                    break;
                                }
                                $pre_tag_content =substr ($new_tag_content, $suboffset,$attrpos-$suboffset);
                                $suboffset=$attrpos+strlen($key);
                                //find next string $key
                                $attrpos2=strpos($new_tag_content,$key,$suboffset);

                                //if next is not found,only actioned one times,then break
                                if($attrpos2==false){
                                    $tmp_tag_content =substr ($new_tag_content, $attrpos);
                                    $my_tag_content.= $pre_tag_content.$this->change_tag($tmp_tag_content,$key,$tag_name);
                                    break;
                                }

                                //found next string
                                $tmp_tag_content =substr($new_tag_content, $attrpos,$attrpos2-$attrpos);
                                $my_tag_content.= $pre_tag_content.$this->change_tag($tmp_tag_content,$key,$tag_name);
                                $suboffset=$attrpos2;

                            }
                            $new_tag_content=$my_tag_content;
                            unset($suboffset,$attrpos,$attrpos2,$close_tag);
                         }
                        }
                    }
                    if(strtoupper($tag_name)=="STYLE"){
                        foreach($this->tag_style as $key=>$value){
                            $subdone=false;
                            $suboffset=0;
                            $tmp_tag_content="";
                            $my_tag_content="";
                            $pre_tag_content="";
                            while(!$subdone){
                                $attrpos=strpos($new_tag_content,$key,$suboffset);
                                //if no string found,return
                                if($attrpos==false){
                                    $my_tag_content = substr ($new_tag_content, $suboffset);
                                    break;
                                }
                                $pre_tag_content =substr ($new_tag_content, $suboffset,$attrpos-$suboffset);
                                $suboffset=$attrpos+strlen($key);

                                //find next string $key
                                $attrpos2=strpos($new_tag_content,$key,$suboffset);

                                //if next is not found,only actioned one times,then break
                                if($attrpos2==false){
                                    $tmp_tag_content =substr ($new_tag_content, $attrpos);
                                    $my_tag_content.= $pre_tag_content.$this->change_tag($tmp_tag_content,$key,$tag_name);
                                    break;
                                }

                                //found next string
                                $tmp_tag_content =substr($new_tag_content, $attrpos,$attrpos2-$attrpos);

                                $my_tag_content.= $pre_tag_content.$this->change_tag($tmp_tag_content,$key,$tag_name);
                                //echo "<br>=======".$pre_tag_content."========<br>";
                                //$new_tag_content =$tmp_tag_content.substr ($new_tag_content, $attrpos2);
                                //$attrpos2=strpos($new_tag_content,$key,$suboffset);
                                $suboffset=$attrpos2;

                            }
                            $new_tag_content=$my_tag_content;
                            unset($suboffset,$attrpos,$attrpos2);
                        }
                    }
                    $new_tag=$new_tag_content;
                }else{
                    $new_tag = $this->change_tag ($tag_content,"","");

                }


            }else{
                $new_tag = $tag_content;
            }
            //add tag (changed or not) to the page
            $this->html .= "<". $new_tag . ">";

            //move page pointer behind the end of the tag
            //$offset = $tag_close_pos+1;
        }else{
            $tag_content = trim (substr($html, $tag_open_pos+1));
            if ($this->is_opening_tag("<$tag_content")){
                $new_tag = $this->change_tag ($tag_content,"","");
            }else{
                $new_tag = $tag_content;
            }
            $this->html .= "<". $new_tag . ">";
            //$this->html .= "<". $new_tag . "<";
            break;
        }
        unset ($tag_open_pos, $tag_close_pos);
    }

}

function is_opening_tag($tag){
    return !preg_match("~^< */~", $tag);
}
function is_closeing_tag($tag){
    return preg_match("~^< */~", $tag);
}
//change tag attribute's value
//making the changes in the tags
function change_tag ($tag_content,$attr_name,$tag_name){
    //get tag name
    if(!$tag_name){
       $space_position = strpos($tag_content, " ");
       if ($space_position&&(!$attr_name)){//tag has attributes
           $tag_name = substr($tag_content, 0, $space_position);
       }else return ($tag_content);
    }
    //should we change this tag?

    if ((!array_key_exists(strtoupper($tag_name), $this->tag_attributes))&&(!$attr_name)){
        return ($tag_content);
    }

    if((array_key_exists(strtoupper($tag_name), $this->tag_attributes))&&(!$attr_name)){
        $attr_name = $this->tag_attributes[strtoupper($tag_name)];
    }else{
        ;//else use para  $attr_name
    }

    //get the value of the attribute
    //find symbol around the value (can be ', " or nothing) and split the tag
    $regexp = "/$attr_name\s*[=|(]\s*('|\")?.*/im";
    preg_match ($regexp, $tag_content, $found);
    $prefound=$found[1];

    if (isset($found[1])){
        $quote = $found[1];
        $regexp = "/(.*)$attr_name\s*[=|(]?\s*$quote([^$quote^)]*)$quote?[\s]?(.*)/is";
    }else{
        //echo $tag_content."<br>";
        //$regexp = "/(.*)$attr_name\s*=\s*(\S+)\s?(.*)/is";
        //$regexp = "/(.*)$attr_name\s*[=|(]\s*([^)]*\S+)[\s|)]?(.*)/is";
        $regexp = "/(.*)$attr_name\s*[=|(]\s*([^)]*)[\s|)]?(.*)/is";
        if (preg_match ($regexp, $tag_content, $found)){
          //echo "<br>===".$found[1]."<br>";
          //echo $found[2]."<br>";
          //echo $found[3]."==end<br>";
        }
        //$regexp = "/(.*)$attr_name\s*=\s*(\S+)\s?(.*)/is";

    }
    if (!preg_match ($regexp, $tag_content, $found))
        return $tag_content;

    $tag_part_before_attribute = $found[1];
    $attr_value = $found[2];
    //echo $attr_value;
    if(!isset($prefound)){
        $quote="";
        $attr_value_pos=strpos($tag_content,$attr_value,0);
        $tag_part_after_attribute=substr($tag_content,$attr_value_pos+strlen($attr_value));
    }
    else{
        $tag_part_after_attribute = $found[3];
    }
    //convert relative address to absolute (if needed)
    //$attr_value is a url? # find <a href=# find single or double quote
    //$js_match="/\s*[javascript|mail\s*to]\s*:/im";
    $js_match="/\s*javascript\s*:/im";
    if (!preg_match($js_match, $attr_value, $found)){
         $new_attr_value = $this->convert_relative_link($attr_value);
         //change the tag attribute value so the tag will point to the script,
         //and the original URL becomes the variable value passed to the script
         $new_attr_value = $this->link_url_to_script ($new_attr_value);
    }else{
         //$new_attr_value=$attr_value;
         return ($tag_content);
         //echo $tag_content."<br>";
    }
    //echo $new_attr_value."<br>";


    //compiling new tag contentents
    //adding the beginning of the tag
    $new_tag_content = $tag_part_before_attribute;
    //adding new attribute
    if ((strtoupper($tag_name)=="SCRIPT")||(strtoupper($tag_name)=="STYLE")){
        if($this->tag_script[$attr_name]){
            //diabled popup window with $url
            if(($attr_name=="open")&&($this->block_pop_url[0]!="")){
                foreach($this->block_pop_url as $key=>$url){
                   $urlpos=strpos($new_attr_value,$url,0);
                   if($urlpos!=false){
                       $new_attr_value='disabled!';
                   }
                }
                if($new_attr_value!="disabled!"){
                     $new_tag_content .= $attr_name. $this->tag_script[$attr_name]. "$quote".$new_attr_value."$quote";
                }else{
                     $new_tag_content .= $attr_name."=false;//";
                }
            }else{
                $new_tag_content .= $attr_name. $this->tag_script[$attr_name]. "$quote".$new_attr_value."$quote";
            }
        }
        if($this->tag_style[$attr_name]){
            $new_tag_content .= $attr_name. $this->tag_style[$attr_name]. "$quote".$new_attr_value."$quote";
        }
    }
    else{
        $new_tag_content .= $attr_name. "=" . "$quote".$new_attr_value."$quote";
    }
    //adding the rest of the tag intact
    $new_tag_content .= $tag_part_after_attribute;
    return $new_tag_content;
}

// function recieves the URI from the tag attribute and checks if it is relative
// if so, function converts the URI to the absolute form
// using data on current URI from the class variable (array) $url
function convert_relative_link ($relative_url){
    $regexp = "~^http://~i";
    $regexp1 = "~^https://~i";
    if (preg_match($regexp, $relative_url)||preg_match($regexp1, $relative_url)){
        return ($relative_url); // this is an absolute URL, no change needed
    }
    //attach relative link to the current URI's directory
    if(substr($this->URI->path,strlen($this->URI->path)-1)=="/"){
        $new_path = substr($this->URI->path,0,strlen($this->URI->path)-1)."/". $relative_url;
    }else{
        $new_path = dirname($this->URI->path)."/". $relative_url;
    }
    //replace back and repetitive slashes with a single forward one
    $new_path = preg_replace ("~((\\\\+)|/){2,}~", "/", $new_path);
    //parse links to the upper directories
    if (strpos($new_path, "/../") !== false){
        $path_array = explode ("/", $new_path);
        foreach ($path_array as $key=>$value){
            if ($value == ".."){
                if ($key > 2){
                    unset ($path_array[$key-1]);
                }
                unset ($path_array[$key]);
            }
        }
        $new_path = implode ("/", $path_array);
    }
    //writing absolute url based on relative and base page addresses
    $absolute_url = $this->URI->scheme.$this->URI->user.$this->URI->pass.
        $this->URI->host.$this->URI->port_string.$new_path;
    return $absolute_url;
}

//url from the web page becomes the attribute passed to the script
function link_url_to_script ($url){
    global $HTTP_SERVER_VARS;
    //$script_url = "http://".$HTTP_SERVER_VARS['HTTP_HOST'].$HTTP_SERVER_VARS ['PHP_SELF'];

    //detect fragment in the target URI
    if ($fragment_pos = strpos($url, "#")){
        $fragment = substr($url, $fragment_pos);
    }else{
        $fragment ="";
    }
    //encode target URI to be passed as a parameter
    //$point_to = urlencode($url);
    $point_to = $url;
    //echo $url."<br>";
    if(strpos($url,"://")!=false){
       $point_to=str_replace(':/','',$point_to);
    }
    else{
       $point_to=str_replace(':','',$point_to);
    }
    $full_new_url = $this->script_url."/".$point_to.$fragment;
    return $full_new_url;
}
//end of the class
}
?>
