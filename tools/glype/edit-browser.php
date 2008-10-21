<?php
/*******************************************************************
* Glype Proxy Script
*
* Copyright (c) 2008, http://www.glype.com/
*
* Permission to use this script is granted free of charge
* subject to the terms displayed at http://www.glype.com/downloads
* and in the LICENSE.txt document of the glype package.
*******************************************************************
* This page allows the user to change settings for their "virtual
* browser" - includes disabling/enabling referrers, choosing a user
* agent string and tunnelling through another proxy.
******************************************************************/


/*****************************************************************
* Initialize glype
******************************************************************/

require 'includes/init.php';

// Stop caching
sendNoCache();

// Start buffering
ob_start();


/*****************************************************************
* Create content
******************************************************************/

// Return without saving button
$return      = empty($_GET['return']) ? '' : '<input type="button" value="Cancel" onclick="window.location=\'' . $_GET['return'] . '\'">';
$returnField = empty($_GET['return']) ? '' : '<input type="hidden" value="' . $_GET['return'] . '" name="return">';

// Quote strings
function q($value) {
   return str_replace("'", "\'", $value);
}

// Get existing values
$browser      = $_SESSION['custom_browser'];

$currentUA       = q($browser['user_agent']);
$realReferrer    = $browser['referrer'] == 'real' ? 'true' : 'false';
$customReferrer  = $browser['referrer'] == 'real' ? ''     : q($browser['referrer']);
$tunnel          = q($browser['tunnel']);
$tunnelPort      = q($browser['tunnel_port']);
$checkTunnelType = $browser['tunnel_type'] ? "document.getElementById('tunnel-type-{$browser['tunnel_type']}').checked = true;" : '';

echo <<<OUT
   <script type="text/javascript">
      // Update custom ua field with value of currently selected preset
      function updateCustomUA(select) {
         
         // Get value
         var newValue = select.value;
         
         // Custom field
         var customField = document.getElementById('user-agent');
         
         // Special cases
         switch ( newValue ) {
            case 'none':
               newValue = '';
               break;
            case 'custom':
               customField.focus();
               return;
         }
         
         // Set new value
         customField.value = newValue;
         
      }
      
      // Set select box to "custom" field when the custom text field is edited
      function setCustomUA() {
         var setTo = document.getElementById('user-agent').value ? 'custom' : '';
         setSelect(document.getElementById('user-agent-presets'), setTo);
      }
      
      // Set a select field by value
      function setSelect(select, value) {
         for ( var i=0; i < select.length; ++i ) {
            if ( select[i].value == value ) {
               select.selectedIndex = i;
               return true;
            }
         }
         return false
      }
      
      // Clear custom-referrer text field if real-referrer is checked
      function clearCustomReferrer(checkbox) {
         if ( checkbox.checked ) {
            document.getElementById('custom-referrer').value = '';
         }
      }
      
      // Clear real-referrer checkbox if custom-referrer text field is edited
      function clearRealReferrer() {
         document.getElementById('real-referrer').checked = '';
      }
      
      // Add domready function to set form to current values
      window.addDomReadyFunc(function() {
         document.getElementById('user-agent').value        = '{$currentUA}';
         if ( setSelect(document.getElementById('user-agent-presets'), '{$currentUA}') == false ) {
            setCustomUA();
         }
         document.getElementById('real-referrer').checked   = {$realReferrer};
         document.getElementById('custom-referrer').value   = '{$customReferrer}';
         document.getElementById('tunnel').value            = '{$tunnel}';
         document.getElementById('tunnel-port').value       = '{$tunnelPort}';
         {$checkTunnelType}
      });
   </script>
   
	<h2 class="first">Edit Browser</h2>
	<p>You can adjust the settings for your "virtual browser" below. These options affect the information the proxy sends to the target server.</p>
   <form action="includes/process.php?action=edit-browser" method="post">
   
      <table cellpadding="2" cellspacing="0" align="center" class="large-table">
         <tr>
            <th colspan="2">User Agent (<a style="cursor:help;" onmouseover="tooltip('Your user agent is sent to the server and identifies the software you are using to access the internet.')" onmouseout="exit()">?</a>)</th>
         </tr>
         <tr>
            <td width="150">Choose from presets:</td>
            <td>
               <select id="user-agent-presets" onchange="updateCustomUA(this)">
                  <option value="Mozilla/5.0 (Windows; U; Windows NT 6.0; en-GB; rv:1.8.1.12) Gecko/20080201 Firefox/2.0.0.12">Firefox 2.0 (Vista)</option>
                  <option value="Mozilla/5.0 (Windows; U; Windows NT 5.1; en-GB; rv:1.8.1.6) Gecko/20070725 Firefox/2.0.0.6">Firefox 2.0 (XP)</option>
                  <option value="Mozilla/5.0 (Macintosh; U; PPC Mac OS X Mach-O; en-US; rv:1.8.1.4) Gecko/20070515 Firefox/2.0.4">Firefox 2.0 (Mac)</option>
                  <option value="Mozilla/4.0 (compatible; MSIE 7.0; Windows NT 5.1)">Internet Explorer 7 (Vista)</option>
                  <option value="Mozilla/4.0 (compatible; MSIE 7.0; Windows NT 5.1; .NET CLR 1.1.4322; .NET CLR 2.0.50727; .NET CLR 3.0.04506.30)">Internet Explorer 7 (XP)</option>
                  <option value="Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.1; .NET CLR 1.1.4322)">Internet Explorer 6 (XP)</option>
                  <option value="Opera/9.20 (Windows NT 6.0; U; en)">Opera 9.2 (Vista)</option>
                  <option value="Opera/9.00 (Windows NT 5.1; U; en)">Opera 9.0 (XP)</option>
                  <option value="Opera/9.50 (Macintosh; Intel Mac OS X; U; en)">Opera 9.5 (Mac)</option>		
                  <option value="{$_SERVER['HTTP_USER_AGENT']}"> - Current/Real</option>
                  <option value=""> - None</option>
                  <option value="custom"> - Custom...</option>         
               </select>
            </td>
         </tr>
         <tr>
            <td colspan="2">
               <input type="text" id="user-agent" name="user-agent" class="full-width" onchange="setCustomUA();">
            </td>
         </tr>
         <tr>
            <td colspan="2" class="small-note"><b>Note:</b> some websites may adjust content based on your user agent.</td>
         </tr>
      </table>
      
      <table cellpadding="2" cellspacing="0" align="center" class="large-table">
         <tr>
            <th colspan="2">Referrer (<a style="cursor:help;" onmouseover="tooltip('The URL of the referring page is normally sent to the server. You can override this to a custom value or set to send no referrer for extra privacy.')" onmouseout="exit()">?</a>)</th>
         </tr>
         <tr>
            <td width="150">Send real referrer:</td>
            <td><input type="checkbox" name="real-referrer" id="real-referrer" onclick="clearCustomReferrer(this)"></td>
         </tr>
         <tr>
            <td>Custom referrer:</td>
            <td><input type="text" name="custom-referrer" id="custom-referrer" class="full-width" onchange="clearRealReferrer()"></td>
         </tr>
         <tr>
            <td colspan="2" class="small-note"><b>Note:</b> some websites may validate your referrer and deny access if set to an unexpected value</td>
         </tr>
      </table>

      <table cellpadding="2" cellspacing="0" align="center" class="large-table">
         <tr>
            <th colspan="2">Connection (<a style="cursor:help;" onmouseover="tooltip('Enter the address of another proxy server to connect through.')" onmouseout="exit()">?</a>)</th>
         </tr>
         <tr>
            <td width="150">Proxy:</td>
            <td><input type="text" name="tunnel" id="tunnel" size="20"> : <input type="text" name="tunnel-port" id="tunnel-port" size="2"></td>
         </tr>
         <tr>
            <td width="150">Type:</td>
            <td><input type="radio" name="tunnel-type" id="tunnel-type-http" value="http"> <label for="tunnel-type-http">HTTP</label> &nbsp; / &nbsp; <input type="radio" name="tunnel-type" id="tunnel-type-socks5" value="socks5"> <label for="tunnel-type-socks5">SOCKS 5</label></td>
         </tr>
      </table>
      
      <br>
      
      <div style="text-align: center;"><input type="submit" value="Save"> {$return}</div>
      
      {$returnField}
      
   </form>
OUT;


/*****************************************************************
* Send content wrapped in our theme
******************************************************************/

// Get buffer
$content = ob_get_contents();

// Clear buffer
ob_end_clean();

// Print content wrapped in theme
echo replaceContent($content);
