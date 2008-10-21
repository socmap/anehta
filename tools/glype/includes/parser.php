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
* This is the parser for the proxy - changes the original 'raw'
* document so that everything (images, links, etc.) is rerouted to
* be downloaded via the proxy script instead of directly.
******************************************************************/

/*****************************************************************
* HTML parsers - main parsing function splits up document into
* component parts ('normal' HTML, scripts and styles)
******************************************************************/

class parser {

   private $jsFlags;
   private $htmlOptions;

   function __construct($htmlOptions, $jsFlags=false) {
      $this->jsFlags = $jsFlags;
      $this->htmlOptions = $htmlOptions;
   }

   function HTMLDocument($input, $insert='', $inject=false, $footer='') {

      //
      // Apply parsing that only needs to be done once..
      //

      // Remove titles if option is enabled
      if ( $this->htmlOptions['stripTitle'] ) {
         $input = preg_replace('#<title.*?</title>#is', '', $input, 1);
      }

      // Remove and record a <base> href
   	$input = preg_replace_callback('#<base href\s*=\s*([\\\'"])?((?(1)(?(?<=")[^"]{1,1000}|[^\\\']{1,1000})|[^\s"\\\'>]{1,1000}))(?(1)\\1|)[^>]*>#i', 'html_stripBase', $input, 1);

      // Proxify url= values in meta redirects
      $input = preg_replace_callback('#content\s*=\s*(["\\\'])?[0-9]+\s*;\s*url=([\\\'"]|&\#39;)?((?(?<=")[^"]+|(?(?<=\\\')[^\\\']+|[^\\\'" >]+)))(?(2)\\2|)(?(1)\\1|)#i', 'html_metaRefresh', $input, 1);

      // Process forms
      $input = preg_replace_callback('#<form([^>]*)>(.*?)</form>#is', 'html_form', $input);
      
      // Remove scripts blocks (avoids individual processing below)
      if ( $this->htmlOptions['stripJS'] ) {
         $input = preg_replace('#<script[^>]*>.*?</script>#is', '', $input);
      }
      
      
      //
      // Split up the document into its different types and parse them
      //

      // Build up new document into this var
      $new    = '';
      $offset = 0;

      // Find instances of script or style blocks
      while ( preg_match('#<(s(?:cript|tyle))[^>]*>#i', $input, $match, PREG_OFFSET_CAPTURE, $offset) ) {

         // What type of block is this?
         $block = strtolower($match[1][0]);

         // Start position of content
         $outerStart = $match[0][1];
         $innerStart = $outerStart + strlen($match[0][0]);

         // Determine type of end tag and find it's position
         $endTag   = "</$block>";
         $innerEnd = stripos($input, $endTag, $innerStart);
         $outerEnd = $innerEnd + strlen($endTag);
         
         // Parse everything up till here and add to the new document
         $new .= $this->HTML(substr($input, $offset, $innerStart - $offset));
         
         // Find parsing function
         $parseFunction = $block == 'style' ? 'CSS' : 'JS' ;

         // Add the parsed block
         $new .= $this->$parseFunction(substr($input, $innerStart, $innerEnd - $innerStart));

         // Move offset to new position
         $offset = $innerEnd;

      }

      // And add the final chunk (between last script/style block and end of doc)
      $new .= $this->HTML(substr($input, $offset));

      // Replace input with the updated document
      $input = $new;


      //
      // Now add our own code bits
      //

      // Insert our mini form after the <body>
      if ( $insert !== false ) {

         // Check for a frameset
         if ( ( $useFrames = stripos($input, '<frameset') ) !== false ) {

            // Flag the frames so only first displays mini-form
            $input = preg_replace_callback('#<frame[^>]+src\s*=\s*([\\\'"])?((?(1)(?(?<=")[^"]{1,1000}|[^\\\']{1,1000})|[^\s"\\\'>]{1,1000}))(?(1)\\1|)#i', 'html_flagFrames', $input);

         }

         // Attempt to add after body
         $input = preg_replace('#(<body[^>]*>)#i', '$1' . $insert, $input, 1, $tmp);

         // Check it inserted and append (if not a frameset)
         if ( ! $tmp && ! $useFrames ) {
            $input = $insert . $input;
         }

      }

      // Insert our javascript library
      if ( $inject ) {

         // Generate javascript to insert
         $inject = injectionJS();

         // Add our proxy javascript after <head>
         $input = preg_replace('#(<head[^>]*>)#i', '$1' . $inject, $input, 1, $tmp);

         // If no <head>, just prepend
         if ( ! $tmp ) {
            $input = $inject . $input;
         }

      }

      // Add anything to the footer?
      if ( $footer ) {

         $input = preg_replace('#(</body[^>]*>)#i', $footer . '$1', $input, 1, $tmp);

         // If no </body>, just append the footer
         if ( ! $tmp ){
            $input .= $footer;
         }

      }

      // Return new document
      return $input;

   }

   // Parse HTML sections
   function HTML($input) {

      // Removing objects? Follow spec and display inner content of object tags instead.
      if ( $this->htmlOptions['stripObjects'] ) {

         // Remove all object tags (including those deprecated but still common)
         $input = preg_replace('#<(?>object|applet|param|embed)[^>]*>#i', '', $input, -1, $tmp);

         // Found any? Remove the corresponding end tags
         if ( $tmp ) {
            $input = preg_replace('#</(?>object|applet|param|embed)>#i', '', $input, $tmp);
         }

      } else {

         // Parse <param name="movie" value="URL"> tags
         $input = preg_replace_callback('#<param[^>]+value\s*=\s*([\\\'"])?((?(1)(?(?<=")[^"]{1,1000}|[^\\\']{1,1000})|[^\s"\\\'>]{1,1000}))(?(1)\\1|)[^>]*>#i', 'html_paramValue', $input);

         // To do: proxify object related URLs

      }

      // Show content within <noscript> tags
      // (preg_ seems to be faster than 2 str_ireplace() calls)
      if ( $this->htmlOptions['stripJS'] ) {
         $input = preg_replace('#</?noscript>#i', '', $input);
      }

      // Parse onX events
      $input = preg_replace_callback('#\b(on(?<!\.on)[a-z]{2,20})\s*=\s*([\\\'"])?((?(2)(?(?<=")[^"]{1,1000}|[^\\\']{1,1000})|[^\s"\\\'>]{1,1000}))(?(2)\\2|)#i', array(&$this, 'html_eventJS'), $input);

      // Parse style attributes
      $input = preg_replace_callback('#style\s*=\s*([\\\'"])?((?(1)(?(?<=")[^"]{1,1000}|[^\\\']{1,1000})|[^\s"\\\'>]{1,1000}))(?(1)\\1|)#i', array(&$this, 'html_elementCSS'), $input);

      // Proxify URL attributes - this is the bottleneck but optimized
      // as much as possible (or at least, as much as I can).
      $input = preg_replace_callback('#(?><[A-Z][A-Z0-9]{0,15})(?>\s+[^>\s]+)*?\s*(?>(href|src|background)\s*=(?!\\\\)\s*)(?>([\\\'"])?)((?(2)(?(?<=")[^"]{1,1000}|[^\\\']{1,1000})|[^ >]{1,1000}))(?(2)\\2|)#i', 'html_attribute', $input);

      // Are we encoding this?
      if ( $this->htmlOptions['encodePage'] ) {
         $input = encodeHTML($input);
      }

      // Return changed input
      return $input;

   }

   // Proxify an onX javascript event
   function html_eventJS($input) {
      return $this->htmlOptions['stripJS'] ? '' : $input[1] . '=' . $input[2] . $this->JS($input[3]) . $input[2];
   }

   // Proxify a style="CSS" attribute
   function html_elementCSS($input) {
      return 'style=' . $input[1] . $this->CSS($input[2]) . $input[1];
   }


   /*****************************************************************
   * CSS parser - main parsing function
   * CSS parsing is a complicated by the caching of CSS files. We need
   * to consider (A) cross-domain caching and (B) the unique URLs option.
   *   A) If possible, use a relative URL so the saved URLs do not explictly
   *      point to a single domain.
   *   B) There is a second set of callback functions with "_unique" suffixed
   *      and these return the original URL to be reparesed.
   ******************************************************************/

   // The URLs depend on the unique and path info settings. The type parameter allows
   // us to specify the unique callbacks.
   function CSS($input, $storeUnique=false) {

      // What type of parsing is this? Normally we parse any URLs to redirect
      // back through the proxy but not when storing a cache with unique URLs.
      $type = $storeUnique ? '_unique' : '';

   	// CSS needs proxifying the calls to url(), @import and src=''
   	$input = preg_replace_callback('#\burl\s*\(\s*[\\\'"]?([^\\\'"\)]+)[\\\'"]?\s*\)#i', 'css_URL' . $type, $input);
   	$input = preg_replace_callback('#@import\s*[\\\'"]([^\\\'"\(\)]+)[\\\'"]#i', 'css_import' . $type, $input);
   	$input = preg_replace_callback('#\bsrc\s*=\s*([\\\'"])?([^)\\\'"]+)(?(1)\\1|)#i', 'css_src' . $type, $input);

      // Return changed
   	return $input;

   }


   /*****************************************************************
   * Javascript parser - main parsing function
   *
   * Commands to never proxify, always handled client-side:
   *   document.write()
   *   document.writeln()
   *   window.open()
   *   eval()
   *
   * Commands to proxify, regardless of browser capabilities:
   *   location.replace()
   *   .innerHTML=
   *
   * Commands to proxify if the extra "watch" flag is set
   * (the browser doesn't support the .watch() method):
   *   location=
   *   location.href=
   *
   * Commands to proxify if the extra "setters" flag is set
   * (the browser doesn't support the __defineSetter__() method):
   *   .src=
   *   .href=
   *   .background=
   *   .action=
   *
   * Commands to proxify if the extra "ajax" flag is set
   * (the browser failed to override the .open() method):
   *   XMLHttpRequest.open()
   ******************************************************************/

   function JS($input) {

      // Stripping?
      if ( $this->htmlOptions['stripJS'] ) {
         return '';
      }

      // If browser capabilities are unknown, apply all parsing
      if ( $this->jsFlags === false ) {
         $this->jsFlags = array('ajax', 'watch', 'setters');
      }

      // Start parsing!

      // Strings to search for
      $search[] = 'innerHTML';
      $search[] = 'location';

      // Look for attribute assignments
      if ( in_array('setters', $this->jsFlags) ) {
         $search[] = 'src';
         $search[] = 'href';
         $search[] = 'action';
         $search[] = 'background';
      }

      // Ajax operations - can't look for XMLHttpRequest.open() directly
      // since the object is likely to be renamed.
      if ( in_array('ajax', $this->jsFlags) ) {
         $search[] = 'XMLHttpRequest';
      }

      // Set up starting parameters
      $offset = 0;
      $length = strlen($input);

      while ( $offset < $length ) {

         // Start off by assuming no more items (i.e. the next position
         // of interest is the end of the document)
         $commandPos = $length;

         // Loop through the search subjects
         foreach ( $search as $item ) {

            // Any more instances of this?
            if ( ( $tmp = strpos($input, $item, $offset) ) === false ) {

               // Nope, skip to next item
               continue;

            }


            // Closer to the currently held 'next' position?
            if ( $tmp < $commandPos ) {

               $commandPos = $tmp;
               $command = $item;

            }

         }

         // No matches found? Finish parsing.
         if ( $commandPos == $length ) {
            break;
         }

         // Assume no need to change the value by resetting the
         // position of the value to change
         $valuePos = false;

         // Validate the match and find the start of the value
         switch ( $command ) {

            // Either location.replace() or .location =
            case 'location':

               // Check for location.replace() now, .location= will be handled
               // by the same logic as used for all other assignments
               if ( ($tmp = str_checknext($input, '.', $commandPos + strlen($command), true)) && substr($input, $tmp+1, 7) == 'replace' ) {

                  // Now move inside the bracket ( +8 accounts for [.\s]replace )
                  if ( $tmp = str_checknext($input, '(', $tmp+8) ) {
                     $valuePos = $tmp+1; // $tmp is position of the bracket so value is +1
                  }

                  // And we're done validating...
                  break;
               }

               // Not a .replace(), try .location= but only if .watch is unsupported
               if ( ! in_array('watch', $this->jsFlags) ) {
                  break;
               }

            // Assignments
            case 'innerHTML':
            case 'src':
            case 'href':
            case 'background':
            case 'action':

               // Is this a location? Special validation rules apply since location
               // is a property of the window and can be accessed by "location" alone.
               if ( $command == 'location' ) {

                  // Difficult to be absolutely certain without much more complex parsing
                  // but look at the previous char - first reverse back to it
                  for ( $tmp = $commandPos-1; strspn($input[$tmp], "\r\n\t "); --$tmp);

                  // Disallow commas (e.g. from the parameters of a window.open())
                  if ( $input[$tmp] == ',' ) {
                     break;
                  }

               } else if ( str_checkprev($input, '.', $commandPos-1) === false ) {

                  // Everything else must be a property of another object so must be
                  // preceded by a period.
                  break;

               }

               // We've verified that the current command is a property.
               // Now check that it's an assignment (as opposed to just a get)
               if ( ( $tmp = str_checknext($input, '=', $commandPos + strlen($command), true) ) === false ) {
                  break;
               }

               // Record the start position of the value
               $valuePos = $tmp+1;

               // Validate the value start position by ensuring
               // (A) the position exists!
               // (B) the next char is not also an = (could be a test for equality)
               if ( ! isset($input[$valuePos]) || $input[$valuePos] == '=' ) {
                  $valuePos = false;
                  break;
               }

               // We have verified the statement and found a start position.
               break;


            // Special cases
            // XMLHttpRequest - we need to record any instances of the XMLHttpRequest object
            // and only then can we attempt to find the .open() calls and proxify the URL
            case 'XMLHttpRequest':

               // Ensure we're creating a new instance of the object and attempt to find the
               // assigned name
               if ( str_checkprev($input, 'w', $commandPos-1) === false || ! preg_match('#\b([a-zA-Z0-9_-]{1,20})\s*=\s*new\s+XMLHttpRequest$#', ( $length > 40 ? substr($input, $commandPos-40, 54) : $input ), $obj) ) {
                  break;
               }

               // Check we haven't already processed this one
               if ( isset($ajaxObjects[$obj[1]]) ) {
                  break;
               }

               // And save it for next time
               $ajaxObjects[$obj[1]] = true;

               // Start at top
               $openOffset = 0;

               // Now proxify all calls to .open()
               while ( preg_match('#\b' . $obj[1] . '\s*\.\s*open\s*\(#', $input, $tmp, PREG_OFFSET_CAPTURE, $openOffset) ) {

                  // Increase offset
                  $openOffset = $tmp[0][1] + strlen($tmp[0][0]);

                  // Find start/end positions for the URL (2nd parameter)
                  $pos = analyze_js($input, $openOffset, 2);

                  // Convert the end position to a length
                  $valueLength = $pos[1]-$pos[0];

                  // Wrap it in our URL parser
                  $wrapped = 'parseURL(' . substr($input, $pos[0], $valueLength) . ',"ajax")';

                  // Replace it
                  $input = substr_replace($input, $wrapped, $pos[0], $valueLength);

                  // And adjust the total length to compensate
                  $length += 17;

                  // Move offset past the newly replaced string
                  $openOffset += 17;

               }

               break;

         }

         // Make any changes?
         if ( $valuePos ) {

            // We know the start, now find the end
            $endPos = analyze_js($input, $valuePos);

            // And from that, the length
            $valueLength = $endPos - $valuePos;

            // Create the parsed wrapper
            $wrapped = ( $command == 'innerHTML' ? 'parseHTML' : 'parseURL' ) . '(' . substr($input, $valuePos, $valueLength) . ')';

            // Make the substition
            $input = substr_replace($input, $wrapped, $valuePos, $valueLength);

            // And adjust the length
            $length += $command == 'innerHTML' ? 11 : 10;

         }

         // Move offset past the most recently found match
         if ( $valuePos ) {
            $offset = $endPos + 1;
         } else {
            $offset = $commandPos + strlen($command);
         }

      }

      // Ignore document.domain
      $input = str_replace('document.domain', 'ignore', $input);

      // Return changed
      return $input;

   }

}


/*****************************************************************
* HTML callbacks
******************************************************************/

// Remove and record the <base> href
function html_stripBase($input) {
   global $base;
   $base = $input[2];
   return '';
}

// Proxify the location of a meta refresh
function html_metaRefresh($input) {
   return str_replace($input[3], proxifyURL($input[3]), $input[0]);
}

// Proxify URL in <param name="movie" value="URL">
function html_paramValue($input) {

   // Check for a name="movie" tag
   if ( stripos($input[0], 'movie') === false ) {
      return $input[0];
   }

   return str_replace($input[2], proxifyURL($input[2]), $input[0]);
}

// Process forms - the query string is used by the proxy script
// and GET data needs to be encoded anyway. We convert all GET
// forms to POST and then the proxy script will forward it properly.
function html_form($input) {

   // Check for a given method
   if ( preg_match('#\bmethod\s*=\s*["\\\']?(get|post)["\\\']?#i', $input[1], $tmp) ) {

      // Not POST?
      if ( strtolower($tmp[1]) != 'post' ) {

         // Convert to post and flag as a conversion
         $input[1] = str_replace($tmp[0], 'method="post"', $input[1]);
         $converted = true;

      }

   } else {

      // Append a POST method (no method given and GET is default)
      $input[1] .= ' method="post"';
      $converted = true;

   }

   // Prepare the extra input to insert
   $add = empty($converted) ? '' : '<input type="hidden" name="convertGET" value="1">';

   // To do: javascript onsubmit event to immediately redirect to the appropriate
   // location using GET data, without an intermediate POST to the proxy script.

   // Proxify the form action
   $input[1] = preg_replace_callback('#\baction\s*=\s*([\\\'"])?((?(1)(?(?<=")[^"]{1,1000}|[^\\\']{1,1000})|[^\s"\\\'>]{1,1000}))(?(1)\\1|)#i', 'html_formAction', $input[1]);

   // What type of form is this? Due to register_globals support, PHP converts
   // a number of characters to _ in incoming variable names. To get around this,
   // we can use the raw post data from php://input but this is not available
   // for multipart forms. Instead we must encode the input names in these forms.
   if ( stripos($input[1], 'multipart/form-data') ) {

      $input[2] = preg_replace_callback('#name\s*=\s*([\\\'"])?((?(1)(?(?<=")[^"]{1,1000}|[^\\\']{1,1000})|[^\s"\\\'>]{1,1000}))(?(1)\\1|)#i', 'html_inputName', $input[2]);

   }

   // Return updated form
   return '<form' . $input[1] . '>' . $add . $input[2] . '</form>';

}

// Proxify the action="URL" value in forms
function html_formAction($input) {
   return 'action=' . $input[1] . proxifyURL($input[2]) . $input[1];
}

// Encode input names
function html_inputName($input) {
   return 'name=' . $input[1] . inputEncode($input[2]) . $input[1];
}

// Proxify URL values in attributes
function html_attribute($input) {

   // Is this an iframe?
   $flag = stripos($input[0], 'iframe') === 1 ? 'frame' : '';

   // URL occurred as value of an attribute and should have been htmlspecialchar()ed
   // We need to do the job of the browser and decode before proxifying.
   return str_replace($input[3], htmlspecialchars(proxifyURL(htmlspecialchars_decode($input[3]), $flag)), $input[0]);
}

// Flag frames in a frameset so only the first one shows the mini-form.
// This could be done in the above callback but adds extra processing
// when 99% of the time, it won't be needed.
function html_flagFrames($input) {

   static $addFlag;

   // If it's the first frame, leave it but set the flag var
   if ( ! isset($addFlag) ) {
      $addFlag = true;
      return $input[0];
   }

   // Add the frame flag
   $newURL = $input[2] . ( strpos($input[2], '?') ? '&f=frame' : 'fframe/');

   return str_replace($input[2], $newURL, $input[0]);

}


/*****************************************************************
* CSS callbacks
******************************************************************/

// Proxify CSS url(LOCATION)
function css_URL($input) {
   return 'url(' . proxifyURL(trim($input[1])) . ')';
}

// Proxify CSS @import "URL"
function css_import($input) {
   return '@import "' . proxifyURL($input[1]) . '"';
}

// Proxify CSS src=
function css_src($input) {
   return 'src=' . $input[1] . proxifyURL($input[2]) . $input[1];
}

// Callbacks for use with unique URLs and cached CSS
// The <UNIQUE[]URL> acts as a marker for quick and easy processing later

// Unique CSS url(LOCATION)
function css_URL_unique($input) {
   return 'url(<UNIQUE[' . absoluteURL($input[1],'') . ']URL>)';
}

// Unique CSS @import "URL"
function css_import_unique($input) {
   return '@import "<UNIQUE[' . absoluteURL($input[1]) . ']URL>"';
}

// Unique CSS src=
function css_src_unique($input) {
   return 'src=' . $input[1] . '<UNIQUE[' . absoluteURL($input[2]) . ']URL>' . $input[1];
}


/*****************************************************************
* Helper functions
******************************************************************/

// Take a string, and check that the next non-whitespace char is the
// passed in char (X). Return false if non-whitespace and non-X char is
// found. Otherwise, return the position of X.
// If $pastChar is true, ignore whitespace after finding X and return
// the position of the last post-X whitespace char.
function str_checknext($input, $char, $offset, $pastChar=false) {

   for ( $i = $offset, $length = strlen($input); $i < $length; ++$i ) {

      // Examine char
      switch ( $input[$i] ) {

         // Ignore whitespace
         case ' ':
         case "\t":
         case "\r":
         case "\n":
            break;

         // Accept the desired char
         case $char:
            // Move past this to the next non-whitespace?
            if ( $pastChar ) {
               return $i + strspn($input, " \t\r\n", $i+1);
            }
            // No $pastChar, just return  X offset
            return $i;

         // Non-accepted char, return false
         default:
            return false;

      }

   }

   return false;

}


// Same as above but go backwards
function str_checkprev($input, $char, $offset) {

   for ( $i = $offset; $i > 0; --$i ) {

      // Examine char
      switch ( $input[$i] ) {

         // Ignore whitespace
         case ' ':
         case "\t":
         case "\r":
         case "\n":
            break;

         // Accept the desired char, return current position
         case $char:
            return $i;

         // Non-accepted char, return false
         default:
            return false;

      }

   }

   return false;

}


// Analyze javascript and return offset positions.
// Default is to find the end of the statement, indicated by:
//  (1) ; while not in string
//  (2) newline which, if not there, would create invalid syntax
//  (3) a closing bracket (object, language construct or function call) for which
//      no corresponding opening bracket was detected AFTER the passed offset
// If (int) $argPos is true, we return an array of the start and end position
// for the nth argument, where n = $argPos. The $start position must be just inside
// the parenthesis of the function call we're interested in.
function analyze_js($input, $start, $argPos = false) {

   // Set chars we're interested in
   $specialChars = ";\n\r\"'+{}()[]";

   // Add , if looking for an argument position
   if ( $argPos ) {
      $specialChars .= ',';
      $currentArg = 1;
   }

   // Loop through the input, stopping only at special chars
   for ( $i = $start, $length = strlen($input), $end = false, $openObjects = $openBrackets = $openArrays = 0;
         $end === false && ( $i += strcspn($input, $specialChars, $i) ) && $i < $length && ( $char = $input[$i] );
         ++$i ) {

      switch ( $char ) {

         // Starting string delimiters
         case '"':
         case "'":

            // Find the corresponding end delimiter and ensure it's not escaped
            while ( ( $i = strpos($input, $char, $i+1) ) && $input[$i-1] == '\\' );

            // Check for false, in which case we assume the end is the end of the doc
            if ( $i === false ) {
               break 2;
            }

            break;

         // End of operation?
         case ';':
            $end = $i;
            break;

         // New lines
         case "\n":
         case "\r":
            // Newlines are OK if occuring within an open brackets, arrays or objects.
            if ( $openObjects || $openBrackets || $openArrays || $argPos ) {
               break;
            }

            // Newlines are also OK if followed by an opening function OR concatenation
            // e.g. someFunc\n(params) or someVar \n + anotherVar
            // Find next non-whitespace char position
            $tmp = $i + strspn($input, " \t\r\n", $i+1);

            // And compare to allowed chars
            if ( isset($input[$tmp+1]) && ( $input[$tmp+1] == '(' || $input[$tmp+1] == '+' ) ) {
               $i = $tmp;
               break;
            }

            // Newline not indicated as OK, set the end to here
            $end = $i;
            break;

         // Concatenation
         case '+':
            // Our interest in the + operator is it's use in allowing an expression
            // to span multiple lines. If we come across a +, move past all whitespace,
            // including newlines (which would otherwise indicate end of expression).
            $i += strspn($input, " \t\r\n", $i+1);
            break;

         // Opening chars (objects, parenthesis and arrays)
         case '{':
            ++$openObjects;
            break;
         case '(':
            ++$openBrackets;
            break;
         case '[':
            ++$openArrays;
            break;

         // Closing chars - is there a corresponding open char?
         // Yes = reduce stored count. No = end of statement.
         case '}':
            $openObjects   ? --$openObjects   : $end = $i;
            break;
         case ')':
            $openBrackets  ? --$openBrackets  : $end = $i;
            break;
         case ']':
            $openArrays    ? --$openArrays    : $end = $i;
            break;

         // Commas - tell us which argument it is
         case ',':

            // Ignore commas inside other functions or whatnot
            if ( $openObjects || $openBrackets || $openArrays ) {
               break;
            }

            // End now
            if ( $currentArg == $argPos ) {
               $end = $i;
            }

            // Increase the current argument number
            ++$currentArg;

            // If we're not after the first arg, start now?
            if ( $currentArg == $argPos ) {
               $start = $i+1;
            }

            break;

      }

   }

   // End not found? Use end of document
   if ( $end === false ) {
      $end = $length;
   }

   // Return array of start/end
   if ( $argPos ) {
      return array($start, $end);
   }

   // Return end
   return $end;

}


// Encode HTML block
function encodeHTML($input) {

	// Escape values
	$s = array('a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z','A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z','\'',"\r","\n",'-');
	$r = array('%61','%62','%63','%64','%65','%66','%67','%68','%69','%6a','%6b','%6c','%6d','%6e','%6f','%70','%71','%72','%73','%74','%75','%76','%77','%78','%79','%7a','%41','%42','%43','%44','%45','%46','%47','%48','%49','%4a','%4b','%4c','%4d','%4e','%4f','%50','%51','%52','%53','%54','%55','%56','%57','%58','%59','%5a','%27','%0d','%0a','%2D');

   // Return javascript decoder
	return '<script type="text/javascript">document.write(unescape(\'' . str_replace($s, $r, $input) . '\'));</script>';

}