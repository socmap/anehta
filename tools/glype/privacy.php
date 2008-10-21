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
* This is a stock privacy policy for use on your proxy site.
* WARNING! This is NOT a verified legal document. Use with caution.
******************************************************************/


/*****************************************************************
* Initialize glype
******************************************************************/

require 'includes/init.php';

// Start buffering
ob_start();


/*****************************************************************
* Create content
******************************************************************/

echo <<<OUT
	<h2 class="first">Privacy Policy</h2>
   <p>Our service may collect information about you during your visit. This document describes the information we collect and how it is used.</p>
   <p><strong>Server Access Logs</strong></p>
   <p>Our server logs all requests. The data recorded includes information provided by your browser (user agent and referring page) as well as the requested URI, the time and date and your IP address. The data recorded in these logs may be used for detecting and preventing abuse. We may also collate this data for statistical purposes.</p>
   <p><strong>Service Logs</strong></p>
   <p>The service provided on this website allows access to external, third-party websites. We may record your IP address and the websites you visit. The logs are used primarily for monitoring requests and ensuring no illegal activity is undertaken. Any violations of our terms of use may result in disclosure of the data recorded in our logs to an appropriate third party, which may include your Internet Service Provider (ISP) or local authorities. We may also be required, by law, to provide logs of our service and if requested, such data will be disclosed. We may also use service logs for stastical purposes.</p>
   <p><strong>Cookies</strong></p>
   <p>Our website stores a cookie on your computer, if allowed by your browser's privacy settings <a href="#browser-settings">*</a>. The cookie used by our service uniquely identifies you to the server and allows our website to remember your preferences.</p>
   <p>We may also use third-party advertising partners on our website. Advertisers may send you cookies or use web beacons. We have no control over cookies, web beacons or the information collected by our advertisers. Consult the third-party advertiser's privacy policy for more information on their practices.</p>

OUT;

// How are we handling cookies?
if ( $CONFIG['cookies_on_server'] ) {

   // We store cookies on the server
   echo <<<OUT
   <p>The service we provide allows indirect browsing of third-party websites. A third-party website may attempt to send cookies to the user. We store these cookies on our server and automatically forward them onto the target server. Your cookie data is treated strictly confidentially, stored privately and deleted soon after you leave our website. If you would prefer us not to store your cookies, please disable the "Allow Cookies" option.</p>
   
OUT;

} else {

   // We forward cookies to the user
   echo <<<OUT
   <p>The service we provide may attempt to forward third-party cookies from the websites you choose to browse. We have no control over indirect cookies and you are advised to consult the privacy policy of the applicable third-party website. If you do not wish to receive any such indirect cookies, please disable the "Allow Cookies" option.</p>
   
OUT;
}

echo <<<OUT
   <p><a name="browser-settings">*</a> For more information on configuring your browser, see <a href="http://www.aboutcookies.org/Default.aspx?page=1">AboutCookies.org</a> or the documentation for your browser. We are not responsible for the content of any third-party websites.</p>
   
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
