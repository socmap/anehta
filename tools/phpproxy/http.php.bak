<?php
/*
 * http.php
 *
 * @(#) $Header: /home/mlemos/cvsroot/http/http.php,v 1.20 2004/04/08 04:07:30 mlemos Exp $
 *
 * note:this class comes from:http://www.phpclasses.org/httpclient
 * but i modified it to adapt to PhpProxy
 * some modifications is listed as follow:
 * 1.add var $_SESSION[cookies] to store user's cookies
 * 2.add post files to http
 * by stephen yabziz 24/07/2004 17:09:36
 */
if ( !defined('HTTP_CRLF') ) define( 'HTTP_CRLF', chr(13) . chr(10));
class http_class
{
	var $host_name="";
	var $host_port=0;
	var $proxy_host_name="";
	var $proxy_host_port=80;

	var $protocol="http";
	var $request_method="GET";
	//var $user_agent='httpclient (http://www.phpclasses.org/httpclient $Revision: 1.20 $)';
    var $user_agent='Mozilla/4.0 (compatible; MSIE 5.00; Windows 98)';
	var $request_uri="";
	var $request="";
	var $request_headers=array();
	var $request_body="";
	var $protocol_version="1.0";
	var $timeout=0;
	var $data_timeout=0;
	var $debug=0;
	var $html_debug=0;
	var $support_cookies=1;
	var $cookies=array();
	var $error="";
	var $exclude_address="";
	var $follow_redirect=0;
	var $redirection_limit=5;
	var $response_status="";
       var $Multipart_post=false;

	/* private variables - DO NOT ACCESS */

	var $state="Disconnected";
	var $use_curl=0;
	var $connection=0;
	var $content_length=0;
	var $response="";
	var $read_response=0;
	var $read_length=0;
	var $request_host="";
	var $next_token="";
	var $redirection_level=0;
	var $months=array(
		"Jan"=>"01",
		"Feb"=>"02",
		"Mar"=>"03",
		"Apr"=>"04",
		"May"=>"05",
		"Jun"=>"06",
		"Jul"=>"07",
		"Aug"=>"08",
		"Sep"=>"09",
		"Oct"=>"10",
		"Nov"=>"11",
		"Dec"=>"12");



	Function Tokenize($string,$separator="")
	{
		if(!strcmp($separator,""))
		{
			$separator=$string;
			$string=$this->next_token;
		}
		for($character=0;$character<strlen($separator);$character++)
		{
			if(GetType($position=strpos($string,$separator[$character]))=="integer")
				$found=(IsSet($found) ? min($found,$position) : $position);
		}
		if(IsSet($found))
		{
			$this->next_token=substr($string,$found+1);
			return(substr($string,0,$found));
		}
		else
		{
			$this->next_token="";
			return($string);
		}
	}

	Function SetError($error)
	{
		return($this->error=$error);
	}

	Function SetDataAccessError($error)
	{
		$this->error=$error;
		if(!$this->use_curl
		&& function_exists("socket_get_status"))
		{
			$status=socket_get_status($this->connection);
			if($status["timed_out"])
				$this->error.=": data access time out";
			elseif($status["eof"])
				$this->error.=": the server disconnected";
		}
	}

	Function OutputDebug($message)
	{
		$message.="\n";
		if($this->html_debug)
			$message=str_replace("\n","<br />\n",HtmlEntities($message));
		echo $message;
		flush();
	}

	Function GetLine()
	{
		for($line="";;)
		{
			if($this->use_curl)
			{
				$eol=strpos($this->response,"\r\n",$this->read_response);
				$data=($eol ? substr($this->response,$this->read_response,$eol+2-$this->read_response) : "");
				$this->read_response+=strlen($data);
			}
			else
			{
				if(feof($this->connection))
					return($this->SetError("reached the end of data while reading from the HTTP server conection"));
				$data=fgets($this->connection,100);
			}
			if(GetType($data)!="string"
			|| strlen($data)==0)
			{
				$this->SetDataAccessError("it was not possible to read line from the HTTP server");
				return("");
			}
			$line.=$data;
			$length=strlen($line);
			if($length>=2
			&& substr($line,$length-2,2)=="\r\n")
			{
				$line=substr($line,0,$length-2);
				if($this->debug)
					$this->OutputDebug("S $line");
				return($line);
			}
		}
	}

	Function PutLine($line)
	{
		if($this->debug)
			$this->OutputDebug("C $line");
		if(!fputs($this->connection,$line."\r\n"))
		{
			$this->SetDataAccessError("it was not possible to send a line to the HTTP server");
			return(0);
		}
		return(1);
	}

	Function PutData(&$data)
	{
		if(strlen($data))
		{
			if($this->debug)
				$this->OutputDebug("C $data");
			if(!fputs($this->connection,$data))
			{
				$this->SetDataAccessError("it was not possible to send data to the HTTP server");
				return(0);
			}
		}
		return(1);
	}

	Function ReadBytes($length)
	{
		if($this->use_curl)
		{
			$bytes=substr($this->response,$this->read_response,min($length,strlen($this->response)-$this->read_response));
			$this->read_response+=strlen($bytes);
		}
		else
			$bytes=fread($this->connection,$length);
		if(strlen($bytes))
		{
			if($this->debug)
				$this->OutputDebug("S ".$bytes);
		}
		else
			$this->SetDataAccessError("it was not possible to read data from the HTTP server");
		return($bytes);
	}

	Function EndOfInput()
	{
		return($this->use_curl ? ($this->read_response>=strlen($this->response)) : feof($this->connection));
	}

	Function Connect($host_name,$host_port,$ssl)
	{
		$domain=$host_name;
		if(ereg('^[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}$',$domain))
			$ip=$domain;
		else
		{
			if($this->debug)
				$this->OutputDebug("Resolving HTTP server domain \"$domain\"...");
			if(!strcmp($ip=@gethostbyname($domain),$domain))
				$ip="";
		}
		if(strlen($ip)==0
		|| (strlen($this->exclude_address)
		&& !strcmp(@gethostbyname($this->exclude_address),$ip)))
			return($this->SetError("could not resolve the host domain \"".$domain."\""));
		if($this->debug)
			$this->OutputDebug("Connecting to HTTP server IP ".$ip."...");
		if($ssl)
			$ip="ssl://".$ip;
		if(($this->connection=($this->timeout ? @fsockopen($ip,$host_port,$errno,$error,$this->timeout) : @fsockopen($ip,$host_port,$errno)))==0)
		{
			switch($errno)
			{
				case -3:
					return($this->SetError("-3 socket could not be created"));
				case -4:
					return($this->SetError("-4 dns lookup on hostname \"".$host_name."\" failed"));
				case -5:
					return($this->SetError("-5 connection refused or timed out"));
				case -6:
					return($this->SetError("-6 fdopen() call failed"));
				case -7:
					return($this->SetError("-7 setvbuf() call failed"));
				default:
					return($this->SetError($errno." could not connect to the host \"".$host_name."\""));
			}
		}
		else
		{
			if($this->data_timeout
			&& function_exists("socket_set_timeout"))
				socket_set_timeout($this->connection,$this->data_timeout,0);
			if($this->debug)
				$this->OutputDebug("Connected to $host_name");
			$this->state="Connected";
			return("");
		}
	}

	Function Disconnect()
	{
		if($this->debug)
			$this->OutputDebug("Disconnected from ".$this->host_name);
		if($this->use_curl)
		{
			curl_close($this->connection);
			$this->response="";
		}
		else
			fclose($this->connection);
		$this->state="Disconnected";
		return("");
	}

	/* Public methods */

	Function GetRequestArguments($url,&$arguments)
	{
		if(strlen($this->error))
			return($this->error);
		$arguments=array();
		$parameters=parse_url($url);
		if(!IsSet($parameters["scheme"]))
			return($this->SetError("it was not specified the protocol type argument"));
		switch(strtolower($parameters["scheme"]))
		{
			case "http":
			case "https":
				$arguments["Protocol"]=$parameters["scheme"];
				break;
			default:
				return($parameters["scheme"]." connection scheme is not yet supported");
		}
		if(!IsSet($parameters["host"]))
			return($this->SetError("it was not specified the connection host argument"));
		$arguments["HostName"]=$parameters["host"];
		$arguments["Headers"]=array("Host"=>$parameters["host"]);
		if(IsSet($parameters["user"]))
			$arguments["AuthUser"]=UrlDecode($parameters["user"]);
		if(IsSet($parameters["pass"]))
			$arguments["AuthPassword"]=UrlDecode($parameters["pass"]);
		if(IsSet($parameters["port"]))
		{
			if(strcmp($parameters["port"],strval(intval($parameters["port"]))))
				return($this->SetError("it was not specified a valid connection host argument"));
			$arguments["HostPort"]=intval($parameters["port"]);
		}
		else
			$arguments["HostPort"]=0;
		$arguments["RequestURI"]=(IsSet($parameters["path"]) ? $parameters["path"] : "/").(IsSet($parameters["query"]) ? "?".$parameters["query"] : "");
		if(strlen($this->user_agent))
			$arguments["Headers"]["User-Agent"]=$this->user_agent;
		return("");
	}

	Function Open($arguments)
	{
		if(strlen($this->error))
			return($this->error);
		if($this->state!="Disconnected")
			return("1 already connected");
		if(IsSet($arguments["HostName"]))
			$this->host_name=$arguments["HostName"];
		if(IsSet($arguments["HostPort"]))
			$this->host_port=$arguments["HostPort"];
		if(IsSet($arguments["ProxyHostName"]))
			$this->proxy_host_name=$arguments["ProxyHostName"];
		if(IsSet($arguments["ProxyHostPort"]))
			$this->proxy_host_port=$arguments["ProxyHostPort"];
		if(IsSet($arguments["Protocol"]))
			$this->protocol=$arguments["Protocol"];
		switch(strtolower($this->protocol))
		{
			case "http":
				$default_port=80;
				break;
			case "https":
				$default_port=443;
				break;
			default:
				return($this->SetError("2 it was not specified a valid connection protocol"));
		}
		if(strlen($this->proxy_host_name)==0)
		{
			if(strlen($this->host_name)==0)
				return($this->SetError("2 it was not specified a valid hostname"));
			$host_name=$this->host_name;
			$host_port=($this->host_port ? $this->host_port : $default_port);
		}
		else
		{
			$host_name=$this->proxy_host_name;
			$host_port=$this->proxy_host_port;
		}
		$ssl=(strtolower($this->protocol)=="https" && strlen($this->proxy_host_name)==0);
		$this->use_curl=($ssl && 0 && function_exists("curl_init"));
		if($this->use_curl)
		{
			$error=(($this->connection=curl_init($this->protocol."://".$this->host_name.($host_port==$default_port ? "" : ":".strval($host_port))."/")) ? "" : "Could not initialize a CURL session");
			if(strlen($error)==0)
			{
				if(IsSet($arguments["SSLCertificateFile"]))
					curl_setopt($this->connection,CURLOPT_SSLCERT,$arguments["SSLCertificateFile"]);
				if(IsSet($arguments["SSLCertificatePassword"]))
					curl_setopt($this->connection,CURLOPT_SSLCERTPASSWD,$arguments["SSLCertificatePassword"]);
			}
		}
		else
		{
			$error="";
			if(strlen($this->proxy_host_name)
			&& IsSet($arguments["SSLCertificateFile"]))
				$error="establishing SSL connections using certificates via non-SSL proxies is not supported";
			else
			{
				if($ssl)
				{
					if(IsSet($arguments["SSLCertificateFile"]))
						$error="establishing SSL connections using certificates is only supported when the cURL extension is enabled";
					$version=explode(".",function_exists("phpversion") ? phpversion() : "3.0.7");
					$php_version=intval($version[0])*1000000+intval($version[1])*1000+intval($version[2]);
					if($php_version<4003000)
						$error="establishing SSL connections requires at least PHP version 4.3.0 or having the cURL extension enabled";
					elseif(!function_exists("extension_loaded")
					|| !extension_loaded("openssl"))
						$error="establishing SSL connections requires the OpenSSL extension enabled";
				}
				if(strlen($error)==0)
					$error=$this->Connect($host_name,$host_port,$ssl);
			}
		}
		if(strlen($error))
			return($this->SetError($error));
		$this->state="Connected";
		return("");
	}

	Function Close()
	{
		if($this->state=="Disconnected")
			return("1 already disconnected");
		$error=$this->Disconnect();
		if(strlen($error)==0)
			$this->state="Disconnected";
		return($error);
	}

	Function PickCookies(&$cookies,$secure)
	{
		if(IsSet($this->cookies[$secure]))
		{
			$now=gmdate("Y-m-d H-i-s");
			for($domain=0,Reset($this->cookies[$secure]);$domain<count($this->cookies[$secure]);Next($this->cookies[$secure]),$domain++)
			{
				$domain_pattern=Key($this->cookies[$secure]);
				$match=strlen($this->request_host)-strlen($domain_pattern);
				if($match>=0
				&& !strcmp($domain_pattern,substr($this->request_host,$match))
				&& ($match==0
				|| $domain_pattern[0]=="."
				|| $this->request_host[$match-1]=="."))
				{
					for(Reset($this->cookies[$secure][$domain_pattern]),$path_part=0;$path_part<count($this->cookies[$secure][$domain_pattern]);Next($this->cookies[$secure][$domain_pattern]),$path_part++)
					{
						$path=Key($this->cookies[$secure][$domain_pattern]);
						if(strlen($this->request_uri)>=strlen($path)
						&& substr($this->request_uri,0,strlen($path))==$path)
						{
							for(Reset($this->cookies[$secure][$domain_pattern][$path]),$cookie=0;$cookie<count($this->cookies[$secure][$domain_pattern][$path]);Next($this->cookies[$secure][$domain_pattern][$path]),$cookie++)
							{
								$cookie_name=Key($this->cookies[$secure][$domain_pattern][$path]);
								$expires=$this->cookies[$secure][$domain_pattern][$path][$cookie_name]["expires"];
								if($expires==""
								|| strcmp($now,$expires)<0)
									$cookies[$cookie_name]=$this->cookies[$secure][$domain_pattern][$path][$cookie_name];
							}
						}
					}
				}
			}
		}
	}

	Function SendRequest($arguments)
	{
		if(strlen($this->error))
			return($this->error);
		switch($this->state)
		{
			case "Disconnected":
				return($this->SetError("1 connection was not yet established"));
			case "Connected":
				break;
			default:
				return($this->SetError("2 can not send request in the current connection state"));
		}
		if(IsSet($arguments["RequestMethod"]))
			$this->request_method=$arguments["RequestMethod"];
		if(IsSet($arguments["User-Agent"]))
			$this->user_agent=$arguments["User-Agent"];
		if(strlen($this->request_method)==0)
			return($this->SetError("3 it was not specified a valid request method"));
		if(IsSet($arguments["RequestURI"]))
			$this->request_uri=$arguments["RequestURI"];
		if(strlen($this->request_uri)==0
		|| substr($this->request_uri,0,1)!="/")
			return($this->SetError("4 it was not specified a valid request URI"));
		$this->request_body="";
		$this->request_headers=(IsSet($arguments["Headers"]) ? $arguments["Headers"] : array());
		if($this->request_method=="POST")
		{
			if(IsSet($arguments["PostValues"]))
			{
				$values=$arguments["PostValues"];
				if(GetType($values)!="array")
					return($this->SetError("5 it was not specified a valid POST method values array"));
				for($this->request_body="",Reset($values),$value=0;$value<count($values);Next($values),$value++)
				{
					if($value>0)
						$this->request_body.="&";
					$this->request_body.=Key($values)."=".UrlEncode($values[Key($values)]);
				}
                $boundary = uniqid('------------------');
                if($this->Multipart_post==true)
                    $this->request_headers["Content-type"]="multipart/form-data;  boundary=" . $boundary;
                else
                    $this->request_headers["Content-type"]="application/x-www-form-urlencoded";
                if($this->Multipart_post==true)
                    $this->request_body=$this->_merge_multipart_form_data($boundary,$arguments["PostValues"],$arguments["PostFiles"]);
                    
                    
			}
			else
			{
				if(IsSet($arguments["Body"]))
					$this->request_body=$arguments["Body"];
			}
		}
		if(IsSet($arguments["AuthUser"]))
		{
			if(!IsSet($arguments["AuthPassword"]))
				return($this->SetError("5 it was not specified a valid authentication password"));
			$this->request_headers["Authorization"]="Basic ".base64_encode($arguments["AuthUser"].":".$arguments["AuthPassword"]);
		}
		if(strlen($this->proxy_host_name)==0)
			$request_uri=$this->request_uri;
		else
		{
			switch(strtolower($this->protocol))
			{
				case "http":
					$default_port=80;
					break;
				case "https":
					$default_port=443;
					break;
			}
			$request_uri=strtolower($this->protocol)."://".$this->host_name.(($this->host_port==0 || $this->host_port==$default_port) ? "" : ":".$this->host_port).$this->request_uri;
		}
		$this->request=$this->request_method." ".$request_uri." HTTP/".$this->protocol_version;
		if(($body_length=strlen($this->request_body)))
			$this->request_headers["Content-length"]=$body_length;
		for($headers=array(),$host_set=0,Reset($this->request_headers),$header=0;$header<count($this->request_headers);Next($this->request_headers),$header++)
		{
			$header_name=Key($this->request_headers);
			$header_value=$this->request_headers[$header_name];
			if(GetType($header_value)=="array")
			{
				for(Reset($header_value),$value=0;$value<count($header_value);Next($header_value),$value++)
					$headers[]=$header_name.": ".$header_value[Key($header_value)];
			}
			else
				$headers[]=$header_name.": ".$header_value;
			if(strtolower(Key($this->request_headers))=="host")
			{
				$this->request_host=strtolower($header_value);
				$host_set=1;
			}
		}
		if(!$host_set)
		{
			$headers[]="Host: ".$this->host_name;
			$this->request_host=strtolower($this->host_name);
		}
		if($_SESSION['cookies'])
		{
			$cookies=array();
            $this->cookies= $_SESSION['cookies'][$this->host_name];
			$this->PickCookies($cookies,0);

			if(strtolower($this->protocol)=="https")
				$this->PickCookies($cookies,1);
			for(Reset($cookies),$cookie=0;$cookie<count($cookies);Next($cookies),$cookie++)
			{
				$cookie_name=Key($cookies);
				$headers[]="Cookie: ".UrlEncode($cookie_name)."=".$cookies[$cookie_name]["value"].";";
            }
		}
		if($this->use_curl)
		{
			curl_setopt($this->connection,CURLOPT_HEADER,1);
			curl_setopt($this->connection,CURLOPT_RETURNTRANSFER,1);
			if($this->timeout)
				curl_setopt($this->connection,CURLOPT_TIMEOUT,$this->timeout);
			curl_setopt($this->connection,CURLOPT_CUSTOMREQUEST,$this->request."\r\n".implode("\r\n",$headers)."\r\n\r\n".$this->request_body);
			curl_setopt($this->connection,CURLOPT_SSL_VERIFYPEER,0);
			curl_setopt($this->connection,CURLOPT_SSL_VERIFYHOST,0);
			if(!($success=(strlen($this->response=curl_exec($this->connection))!=0)))
			{
				$error=curl_error($this->connection);
				$this->SetError("Could not execute the request".(strlen($error) ? ": ".$error : ""));
			}
		}
		else
		{
			if(($success=$this->PutLine($this->request)))
			{
				for($header=0;$header<count($headers);$header++)
				{
					if(!$success=$this->PutLine($headers[$header]))
						break;
				}
				if($success
				&& ($success=$this->PutLine(""))
				&& $body_length)
					$success=$this->PutData($this->request_body);
			}
		}
		if(!$success)
			return($this->SetError("5 could not send the HTTP request: ".$this->error));
		$this->state="RequestSent";
		return("");
	}

	Function ReadReplyHeaders(&$headers)
	{
		$headers=array();
		if(strlen($this->error))
			return($this->error);
		switch($this->state)
		{
			case "Disconnected":
				return($this->SetError("1 connection was not yet established"));
			case "Connected":
				return($this->SetError("2 request was not sent"));
			case "RequestSent":
				break;
			default:
				return($this->SetError("3 can not get request headers in the current connection state"));
		}
		$this->content_length=$this->read_length=$this->read_response=0;
		$this->content_length_set=0;
		for($this->response_status="";;)
		{
			$line=$this->GetLine();
			if(GetType($line)!="string")
				return($this->SetError("4 could not read request reply: ".$this->error));
			if(strlen($this->response_status)==0)
			{

				if(!eregi($match="^http/[0-9]+\\.[0-9]+[ \t]+([0-9]+)"/*"*/,$line,$matches))
					return($this->SetError("3 it was received an unexpected HTTP response status"));
				$this->response_status=$matches[1];
			}
			if($line=="")
			{
				if(strlen($this->response_status)==0)
					return($this->SetError("3 it was not received HTTP response status"));
				$this->state="GotReplyHeaders";
				break;
			}
			$header_name=strtolower($this->Tokenize($line,":"));
			$header_value=Trim(Chop($this->Tokenize("\r\n")));
			if(IsSet($headers[$header_name]))
			{
				if(GetType($headers[$header_name])=="string")
					$headers[$header_name]=array($headers[$header_name]);
				$headers[$header_name][]=$header_value;
			}
			else
				$headers[$header_name]=$header_value;
			switch($header_name)
			{
				case "content-length":
					$this->content_length=intval($headers[$header_name]);
					$this->content_length_set=1;
					break;
				case "set-cookie":
					if($this->support_cookies)
					{
                        if(GetType($headers[$header_name])=="array")
							$cookie_headers=$headers[$header_name];
						else
							$cookie_headers=array($headers[$header_name]);
						for($cookie=0;$cookie<count($cookie_headers);$cookie++)
						{
							$cookie_name=trim($this->Tokenize($cookie_headers[$cookie],"="));
							$cookie_value=$this->Tokenize(";");
							$domain=$this->request_host;
							$path="/";
							$expires="";
							$secure=(strtolower($this->protocol)=="https");
							while(($name=strtolower(trim($this->Tokenize("="))))!="")
							{
								$value=UrlDecode($this->Tokenize(";"));
								switch($name)
								{
									case "domain":
										if($value==""
										|| !strpos($value,".",$value[0]=="."))
											break;
										$domain=strtolower($value);
										break;
									case "path":
										if($value!=""
										&& $value[0]=="/")
											$path=$value;
										break;
									case "expires":
										if(ereg("^((Mon|Monday|Tue|Tuesday|Wed|Wednesday|Thu|Thursday|Fri|Friday|Sat|Saturday|Sun|Sunday), )?([0-9]{2})\\-(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\\-([0-9]{2,4}) ([0-9]{2})\\:([0-9]{2})\\:([0-9]{2}) GMT$",$value,$matches))
										{
											$year=intval($matches[5]);
											if($year<1900)
												$year+=($year<70 ? 2000 : 1900);
											$expires="$year-".$this->months[$matches[4]]."-".$matches[3]." ".$matches[6].":".$matches[7].":".$matches[8];
										}
										break;
									case "secure":
										$secure=1;
										break;
								}
							}
							$this->cookies[$secure][$domain][$path][$cookie_name]=array(
								"name"=>$cookie_name,
								"value"=>$cookie_value,
								"domain"=>$domain,
								"path"=>$path,
								"expires"=>$expires,
								"secure"=>$secure
							);
						}
					}
			}
		}

		switch($this->response_status)
		{
			case "301":
			case "302":
			case "303":
			case "307":
			if($this->follow_redirect)
			{
				if(!IsSet($headers["location"])
				|| strlen($headers["location"])==0)
					return($this->SetError("3 it was received a redirect without location URL"));
				$location=$headers["location"];
                //echo  $location[0]."<br>";
				if(strcmp($location[0],"/"))//if(substr($location,0,1)=="/")
				{
					$location_arguments=parse_url($location);
					if(!IsSet($location_arguments["scheme"]))
						$location=dirname($this->request_uri)."/".$location;
				}
				if(!strcmp($location[0],"/"))//if(substr($location,0,1)!="/") //
					$location=$this->protocol."://".$this->host_name.($this->host_port ? ":".$this->host_port : "").$location;
                //echo  $this->protocol."://".$this->host_name.($this->host_port ? ":".$this->host_port : "").$location;
				$error=$this->GetRequestArguments($location,$arguments);
				if(strlen($error))
					return($this->SetError("could not process redirect url: ".$error));
				$arguments["RequestMethod"]="GET";
				if(strlen($error=$this->Close())==0
				&& strlen($error=$this->Open($arguments))==0
				&& strlen($error=$this->SendRequest($arguments))==0)
				{
					$this->redirection_level++;
					if($this->redirection_level>$this->redirection_limit)
						$error="it was exceeded the limit of request redirections";
					else
						$error=$this->ReadReplyHeaders($headers);
					$this->redirection_level--;
				}
                $pri_cookies= $this->cookies;
                $_SESSION['cookies'][$this->host_name]=$pri_cookies;
				if(strlen($error))
					return($this->SetError($error));
			}
		}
		return("");
	}

	Function ReadReplyBody(&$body,$length)
	{
		$body="";
		if(strlen($this->error))
			return($this->error);
		switch($this->state)
		{
			case "Disconnected":
				return($this->SetError("1 connection was not yet established"));
			case "Connected":
				return($this->SetError("2 request was not sent"));
			case "RequestSent":
				if(($error=$this->ReadReplyHeaders($headers))!="")
					return($error);
				break;
			case "GotReplyHeaders":
				break;
			default:
				return($this->SetError("3 can not get request headers in the current connection state"));
		}
		if($this->content_length_set)
			$length=min($this->content_length-$this->read_length,$length);
		if($length>0
		&& !$this->EndOfInput()
		&& ($body=$this->ReadBytes($length))=="")
		{
			$version=explode(".",function_exists("phpversion") ? phpversion() : "3.0.7");
			$php_version=intval($version[0])*1000000+intval($version[1])*1000+intval($version[2]);
			if($php_version<4003002
			|| $php_version>4003004
			|| !$this->EndOfInput())
				return($this->SetError("4 could not get the request reply body: ".$this->error));
		}
		$this->read_length+=strlen($body);
		return("");
	}

	Function GetPersistentCookies(&$cookies)
	{
		$now=gmdate("Y-m-d H-i-s");
		$cookies=array();
		for($secure_cookies=0,Reset($this->cookies);$secure_cookies<count($this->cookies);Next($this->cookies),$secure_cookies++)
		{
			$secure=Key($this->cookies);
			for($domain=0,Reset($this->cookies[$secure]);$domain<count($this->cookies[$secure]);Next($this->cookies[$secure]),$domain++)
			{
				$domain_pattern=Key($this->cookies[$secure]);
				for(Reset($this->cookies[$secure][$domain_pattern]),$path_part=0;$path_part<count($this->cookies[$secure][$domain_pattern]);Next($this->cookies[$secure][$domain_pattern]),$path_part++)
				{
					$path=Key($this->cookies[$secure][$domain_pattern]);
					for(Reset($this->cookies[$secure][$domain_pattern][$path]),$cookie=0;$cookie<count($this->cookies[$secure][$domain_pattern][$path]);Next($this->cookies[$secure][$domain_pattern][$path]),$cookie++)
					{
						$cookie_name=Key($this->cookies[$secure][$domain_pattern][$path]);
						$expires=$this->cookies[$secure][$domain_pattern][$path][$cookie_name]["expires"];
						if($expires!=""
						&& strcmp($now,$expires)<0)
							$cookies[$secure][$domain_pattern][$path][$cookie_name]=$this->cookies[$secure][$domain_pattern][$path][$cookie_name];
					}
				}
			}
		}
	}
    function _merge_multipart_form_data( $boundary, &$form_fields, &$form_files ) {
		$boundary = '--' . $boundary;
		$multipart_body = '';
		foreach ( $form_fields as $name => $data) {
			$multipart_body .= $boundary . HTTP_CRLF;
			$multipart_body .= 'Content-Disposition: form-data; name="' . $name . '"' . HTTP_CRLF;
			$multipart_body .=  HTTP_CRLF;
			$multipart_body .= $data . HTTP_CRLF;
		}
		if ( isset($form_files) ) {
			foreach ( $form_files as $data) {
				$multipart_body .= $boundary . HTTP_CRLF;
				$multipart_body .= 'Content-Disposition: form-data; name="' . $data['name'] . '"; filename="' . $data['filename'] . '"' . HTTP_CRLF;
				if ($data['content-type']!='')
					$multipart_body .= 'Content-Type: ' . $data['content-type'] . HTTP_CRLF;
     			else
				    $multipart_body .= 'Content-Type: application/octet-stream' . HTTP_CRLF;
	            $multipart_body .=  HTTP_CRLF;
	            $multipart_body .= $data['data'] . HTTP_CRLF;
			}
		}
		$multipart_body .= $boundary . '--' . HTTP_CRLF;
		return $multipart_body;
	} // End of function _merge_multipart_form_data()
};

?>
