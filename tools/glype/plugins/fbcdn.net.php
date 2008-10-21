<?php
/*****************************************************************
* Plugin: Facebook
* Description:
*  (1) Disables the "Queue transfers" option for external stylesheets
*      and javascript on Facebook, allowing a faster pageload time.
*      Lag is especially noticeable on Facebook due to the huge number
*      of external resources required. Anything to reduce the lag is useful!
*  (2) Fixes an AJAX problem avoiding the "Network Error #1001" message
*  (3) Fixes a major navigation issue when Facebook attempts to change the URL
*      on-the-fly.
******************************************************************/

$CONFIG['queue_transfers'] = false;


/**
 * Pre-parser for changes before the main proxy parser.
 * @param string $input
 * @param string $type can be "javascript", "css" or "html"
 * @return string
 */
function preParse($input, $type) {

   // What type of document do we have?
   switch ( $type ) {
   
      case 'javascript':
      
         global $URL;
      
         // Apply changes to the main javascript file
         if ( strpos($URL['filename'], 'common.js') !== false ) {
         
            // Target:  _interpretTransportResponse for parsing the AJAX reply
            // Problem: uses eval() to interpret response but our eval() wrapper
            //          creates a scoping issue, resulting in no response getting back
            // Change:  use the return value instead of setting a value within the eval()
            // Line:    801
            $input = str_replace("eval('response = ('+safeResponse+')')", "response = eval('('+safeResponse+')')", $input);
            
            // Target:  _filter() function for determining if Facebook should mess with the URL
            //          defaults to true after checking for various special cases
            // Problem: unknown, just that it tries to take us to the wrong URL and hangs
            // Change:  always return false
            // Line:    613
            $input = str_replace('return true;},getProtocol:f', 'return false;},getProtocol:f', $input);
         
         
         }
         
         break;
   }
   
   return $input;

}
