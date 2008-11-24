<?php

  require("xml.php");

  $U = "admin";  // 用户名
  $P = "123456";  // 密码
  $textKey = "anehtaokok112@@sdsdwerrddfdsw";  // 加密密钥

  // from discuz!
	function authcode($string, $key, $operation = 'ENCODE') {
		$key_length = strlen($key);
		if($key_length == 0) {
			return false;
		}
		$string = $operation == 'DECODE' ? base64_decode($string) : substr(md5($string.$key), 0, 8).$string;
		$string_length = strlen($string);

		$rndkey = $box = array();
		$result = '';

		for($i = 0; $i <= 255; $i++) {
			$rndkey[$i] = ord($key[$i % $key_length]);
			$box[$i] = $i;
		}

		for($j = $i = 0; $i < 256; $i++) {
			$j = ($j + $box[$i] + $rndkey[$i]) % 256;
			$tmp = $box[$i];
			$box[$i] = $box[$j];
			$box[$j] = $tmp;
		}

		for($a = $j = $i = 0; $i < $string_length; $i++) {
			$a = ($a + 1) % 256;
			$j = ($j + $box[$a]) % 256;
			$tmp = $box[$a];
			$box[$a] = $box[$j];
			$box[$j] = $tmp;
			$result .= chr(ord($string[$i]) ^ ($box[($box[$a] + $box[$j]) % 256]));
		}

		if($operation == 'DECODE') {
			if(substr($result, 0, 8) == substr(md5(substr($result, 8).$key), 0, 8)) {
				return substr($result, 8);
			} else {
				return '';
			}
		} else {
			return str_replace('=', '', base64_encode($result));
		}
	}
  
  
  /**
   * A better alternative (RFC 2109 compatible) to the php setcookie() function
   *
   * @param string Name of the cookie
   * @param string Value of the cookie
   * @param int Lifetime of the cookie
   * @param string Path where the cookie can be used
   * @param string Domain which can read the cookie
   * @param bool Secure mode?
   * @param bool Only allow HTTP usage?
   * @return bool True or false whether the method has successfully run
   */
  function createCookie($name, $value='', $maxage=0, $path='', $domain='', $secure=false, $HTTPOnly=false)
  {
      $ob = ini_get('output_buffering');
  
      // Abort the method if headers have already been sent, except when output buffering has been enabled
      if ( headers_sent() && (bool) $ob === false || strtolower($ob) == 'off' )
          return false;
  
      if ( !empty($domain) )
      {
          // Fix the domain to accept domains with and without 'www.'.
          if ( strtolower( substr($domain, 0, 4) ) == 'www.' ) $domain = substr($domain, 4);
          // Add the dot prefix to ensure compatibility with subdomains
          if ( substr($domain, 0, 1) != '.' ) $domain = '.'.$domain;
  
          // Remove port information.
          $port = strpos($domain, ':');
  
          if ( $port !== false ) $domain = substr($domain, 0, $port);
      }
  
      // Prevent "headers already sent" error with utf8 support (BOM)
      //if ( utf8_support ) header('Content-Type: text/html; charset=utf-8');
  
      header('Set-Cookie: '.rawurlencode($name).'='.rawurlencode($value)
                                  .(empty($domain) ? '' : '; Domain='.$domain)
                                  .(empty($maxage) ? '' : '; Max-Age='.$maxage)
                                  .(empty($path) ? '' : '; Path='.$path)
                                  .(!$secure ? '' : '; Secure')
                                  .(!$HTTPOnly ? '' : '; HttpOnly'), false);
      return true;
  }   



  function checkLoginStatus(){
  	if (!isset($_COOKIE["anehtaDoor"])){
  		echo "<html><script>window.location = \"login.php?redirect=".urlencode($_SERVER["PHP_SELF"])."\";</script></html>";
  		return false;
  	}
  	
  	list($user, $pass, $token) = explode(",", authCode($_COOKIE["anehtaDoor"], $textKey, "DECODE"));
  	
  	if ($user && $pass && $token){
  		// 保证只有一个有效的session
  		if (!file_exists("../temp/session_token") || $token != file_get_contents("../temp/session_token")){
  			echo "<html><script>window.location = \"login.php?redirect=".urlencode($_SERVER["PHP_SELF"])."\";</script></html>";
  			return false;
  		}  		  		
  		
  		if ($user == $U && $pass == $P){
  			return true;
  		} else {
  			echo "<html><script>window.location = \"login.php?redirect=".urlencode($_SERVER["PHP_SELF"])."\";</script></html>";
  			return false;
  		}
  	}
  }


?>