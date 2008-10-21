<?php
/*****************************************************************
* Plugin: MySpace
* Description:
*    Fixes a minor JavaScript issue where code that 'looks' like
*    it needs parsing actually doesn't.
******************************************************************/

/*****************************************************************
* Pre-parsing applied BEFORE main proxy parser.
******************************************************************/

function preParse($input, $type) {

   switch ( $type ) {
   
      // Apply changes to HTML documents
      case 'html':
      
         // Javascript fix - break up the string into 2 pieces so we don't
         // confuse the main proxy parser with a ".innerHTML = " string.
         $input = str_replace('"invalidLogin.innerHTML = \""', '"invalidLogin.in"+"nerHTML = \""', $input);
         break;
         
   }
   
   // Return changed
   return $input;

}
