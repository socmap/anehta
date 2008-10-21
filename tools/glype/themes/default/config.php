<?php
/*******************************************************************
* Glype Proxy Script
* 
* This theme configuration file allows easy customization of the
* theme without editing the HTML templates.
*******************************************************************
* Theme: Simple
* Author: Glype
* Website: http://www.glype.com/
******************************************************************/

/*****************************************************************
* Themes can use "theme replacements". These are HTML tags of the format
* <!--[tag_name]--> in the template files. To automatically replace
* these placeholders with other text, use the $themeReplace array.
*  e.g.
* <!--[tag_name]--> will be replaced with the value of $themeReplace['tag_name']
******************************************************************/

// Website name
$themeReplace['site_name'] = 'glype proxy';

// Meta description
$themeReplace['meta_description'] = <<<OUT

OUT;

// Meta keywords (separate with comma)
$themeReplace['meta_keywords'] = <<<OUT

OUT;

// Proxy description text
$themeReplace['description'] = <<<OUT
   <p>Enjoy unrestricted and uncensored browsing with our service. You make a request via our site, we fetch the resource and send it back to you.</p>
   <p>Browsing through us both keeps you anonymous from the sites you visit and allows you to bypass any network restrictions from your government, workplace or college.</p>
OUT;

// Ad location above the form on the index page
$themeReplace['index_above_form'] = <<<OUT

OUT;

// Ad location below the form on the index page
$themeReplace['index_below_form'] = <<<OUT

OUT;

// Ad location on proxified pages below the url mini-form
$themeReplace['proxified'] = <<<OUT

OUT;
