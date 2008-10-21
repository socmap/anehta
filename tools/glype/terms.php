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
* This is a stock terms of use for use on your proxy site.
* WARNING! This is NOT a verified legal document. Use with caution.
******************************************************************/


/*****************************************************************
* Initialize glype
******************************************************************/

require 'includes/init.php';


/*****************************************************************
* Create content
******************************************************************/

$content = <<<OUT
	<h2 class="first">Terms of Use</h2>
   <p>Use of this service is subject to the terms of use displayed here. By using our service, you agree to be bound by these terms.</p>
   <p>You agree to have read and understood any applicable disclaimers and privacy policies displayed on this website. We reserve the right to change these at any time.</p>
   <p>You may not use this service for any unlawful activity, including but not limited to viewing illegal content, sharing copyrighted Intellectual Property, or sending threatening, harrassing or abusive email.</p>
   <p>You may not access webmail services for the purpose of sending spam or unsolicited email.</p>
   <p>You may not attempt to gain unauthorised access to any website. You may not use our service to abuse any third-party services that may be available through our website. This includes bypassing any restrictions that other webmasters may have put in place against your IP address and accessing content that is unavailable in your country.</p>
OUT;


/*****************************************************************
* Send content wrapped in our theme
******************************************************************/

echo replaceContent($content);
