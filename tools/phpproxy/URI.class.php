<?php

//**************************************************************//
/* class that deals with URI details
*
* void process_uri(string url) - the method parces given URL,
*       fills the missing parts of the URL and sets class field $url (array)
*
* string get_full_uri(void) - returns full URI and updates $this->url['full']
*       use it instead of $object_name->url['full']
*
* function process() recieves the string containing absolute path to the URL
* and writes the array, containing the elements of that URI,
* to the class field $array
* E.g. "https://urser:pass@example.com:80/path/file.ext?query=url_encoded" will be
* presented in $this->uri as object:
* class uri(){
*     var $scheme = "https://";
*     var $host = "example.com";
*     var $user = "urser";
*     var $pass = ":pass@";
*     var $path = "/path/file.ext";
*     var $query = "?query=url_encoded";
*     var $port = 80;
*     var $port_string = ":80";
*     var $fragment = "";
*     var $full = "http://urser:pass@example.com/path/file.ext?query=url_encoded";
*              (caution: use ->get_full_uri() to get full URL)
* }
* while "example.com" will lead to
* class uri(){
*     var $scheme = "http://";
*     var $host = "example.com";
*     var $pass = "";
*     var $user = "";
*     var $port = 80;
*     var $port_string = "";
*     var $path = "/";
*     var $query = "";
*     var $fragment => "";
*     var $full = "http://example.com/";
*              (caution: use $object_name->get_full_uri() to get full URL)
* }
*/

class URI{
var $array;
var $changed = false;
var $scheme;
var $host;
var $user;
var $pass;
var $path;
var $query;
var $port;
var $port_string;
var $fragment;
var $full;
var $history = array();

function URI($new_uri){
    $this->process($new_uri);
}

function process($new_uri){
    //log history
    $this->history[] = $new_uri;
    //init variables, results of parse_url() may redefine them
    $this->scheme = "https://";
    $this->host = "";
    $this->user = "";
    $this->pass = "";
    $this->path = "";
    $this->query = "";
    $this->port = 80;
    $this->port_string = ":80";
    $this->fragment = "";
    $this->full = "";
    $this->array = array();
    //$uri_user=$uri_pass=$uri_port=$uri_fragment='';
    if (!is_integer(strpos($new_uri, "://"))){
            $new_uri = "http://$new_uri";

    }
    //echo "---------------------".$new_uri."---------";
    //parse current url - get parts
    $uri_array = parse_url ($new_uri);
    $uri_host = $uri_array['host'];

    //set varables with parts of URI
    //sheme://
    //echo "111111111".$uri_array['scheme'];
    if (isset($uri_array['scheme'])) $uri_array['scheme'] .= "://";
    else $uri_array['scheme'] = "http://";
    //user:password@
    if (isset($uri_array['user'])){
        if (isset($uri_array['pass']))
            $uri_array['pass'] = ":".$uri_array['pass']."@";
        else {
                $uri_array['user'] .= "@";
            $uri_array['pass'] = "";
        }
    }else $uri_array['user'] = $uri_array['pass'] = "";
    //:port
        if (isset($uri_array['port'])) $uri_array['port_string'] = ":".$uri_array['port'];
    else {
            $uri_array['port'] = 80;
        $uri_array['port_string'] = "";
    }
    //path
        if (!isset($uri_array['path'])) $uri_path = $uri_array['path'] = "/";
        //?query
    if (isset($uri_array['query'])) $uri_array['query'] = "?".$uri_array['query'];
    else $uri_query = $uri_array['query'] = "";
    //fragment
    if (isset($uri_array['fragment'])) $uri_array['fragment'] = "#".$uri_array['fragment'];
    else $uri_array['fragment'] = "";

    //store processed parts of URI in the class field
    $this->array = $uri_array;
    
    //assign class fields
    foreach($uri_array as $key=>$value){
        $this->$key = $value;
    }
    $this->get_full_uri();
    
}

// (re)compile the full uri and return the string
function get_full_uri(){
    $this->full = $this->scheme.$this->user.$this->pass.
        $this->host.$this->port_string.$this->path.$this->query;
    return $this->full;
}

//call it to set changed flag to off
function unchanged(){
    $this->changed = false;
}

//end of the class
}
?>
