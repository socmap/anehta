<?php

	/**
	**	`Ļ£ºRSSFeed
	**	ԃ;£ºʺ³ɷ�S2.0¹淶µÒSSτµµ
	**	ط֟£ºՆ˦
	**	ʱ¼䣺2005-11-29
	**/

	class RSSFeed
	{
		
		/**
		*	variables
		*	@access private
		*/
		var $m_RSSversion	=	'2.0';
		var $m_XMLversion	=	'1.0';
		var $m_channel		=	NULL;
		var $m_FeedItem		=	'';
		
		/**
		**	¹¹լº¯˽£¬ˤ³�
		*/		
		function RSSFeed() {
			/*
			$this->m_channel = "<?xml version=\"".$this->m_XMLversion."\" encoding=\"utf-8\" ?>\n";
			$this->m_channel .= "<rss version=\"".$this->m_RSSversion."\" xmlns:dc=\"http://purl.org/dc/elements/1.1/\"\n";
			$this->m_channel .= "xmlns:trackback=\"http://madskills.com/public/xml/rss/module/trackback/\"\n";
			$this->m_channel .= "xmlns:wfw=\"http://wellformedweb.org/CommentAPI/\"\n";
			$this->m_channel .= "xmlns:slash=\"http://purl.org/rss/1.0/modules/slash/\">\n";
			*/
			$this->m_channel = "<?xml version=\"".$this->m_XMLversion."\" encoding=\"utf-8\" ?>\n";
			$this->m_channel .= "<rss version=\"".$this->m_RSSversion."\" >\r\n";
		}
				
		
		/**
		*	º¯˽Ļ£ºaddChannel
		*	ԃ;£ºͭ¼Ԓ»¸��
		*	
		*	²ϊ�	*	ChannelTitle		ؖ·�µµC�		*	ChannelLink		ؖ·�µµ5ٖ·	
		*	ChannelDescription	ؖ·�µµC鋶
		*	ChannelLanguage		ؖ·�µµS𐒔£¬ɧZH±אτ
		*/
		function addChannel($ChannelTitle, $ChannelLink, $ChannelDescription, $ChannelLanguage)
		{
			$this->m_channel	.=	"\t<channel>\n";
			$this->m_channel	.=	"\t\t<title>".$ChannelTitle."</title>\n";
			$this->m_channel	.=	"\t\t<link>".$ChannelLink."</link>\n";
			$this->m_channel	.=	"\t\t<description>".$ChannelDescription."</description>\n";
			$this->m_channel	.=	"\t\t<language>".$ChannelLanguage."</language>\n";
		}
		
		/**
		*	º¯˽Ļ£ºaddFeedItem
		*	ԃ;£ºͭ¼Ԓ»¸�ݣ¬±Ɉ菄ւ
		*	
		*	²ϊ�	*	ItemTitle		ؖ·�ۈރ�±Ɉ菄ւ±덢
		*	ItemLink		ؖ·�ۈݵٖ·	
		*	ItemDescription	ؖ·�ŕÃ鋶
		*	ItemDate		ؖ·�ŕ·¢²¼ʱ¼⋊		*/
				
		function addFeedItem($ItemTitle, $Author, $Category, $ItemLink, $ItemGuid, $ItemDescription, $ItemDate)
		{
			$this->m_FeedItem	.=	"\t\t<item>\n";
			$this->m_FeedItem	.=	"\t\t\t<title>".$ItemTitle."</title>\n";
			$this->m_FeedItem	.=	"\t\t\t<category>".$Category."</category>\n";
			$this->m_FeedItem	.=	"\t\t\t<author>".$Author."</author>\n";
			$this->m_FeedItem	.=	"\t\t\t<link>".$ItemLink."</link>\n";
			$this->m_FeedItem	.=	"\t\t\t<guid>".$ItemGuid."</guid>\n";
			$this->m_FeedItem	.=	"\t\t\t<description>\n\t\t\t\t<![CDATA[\n".$ItemDescription."\n\t\t\t\t]]>\n\t\t\t</description>\n";
			$this->m_FeedItem .= 	"\t\t\t<pubDate>".$ItemDate."</pubDate>\n";
			$this->m_FeedItem	.=	"\t\t</item>\n";
		}
		
		/**
		*	appendFeedItem
		*	add by axis
		*	
		*	将 一个 item插入到最前面
		*	ItemLink		ؖ·�ۈݵٖ·	
		*	ItemDescription	ؖ·�ŕÃ鋶
		*	ItemDate		ؖ·�ŕ·¢²¼ʱ¼⋊		*/
				
		function appendFeedItem($ItemTitle, $Author, $Category, $ItemLink, $ItemGuid, $ItemDescription, $ItemDate)
		{
			// 先保存原来的item.
			if (file_exists("rss.xml")){
				$tmp = file_get_contents("rss.xml");
				$tmp = explode("\t</channel>\n", $tmp);
				$tmp = explode("</language>", $tmp[0]);
				
				$checkItem = $tmp[1];
				// 检查item的条数，如果大于30条则将最早的一条删掉
				$checkItem = explode("\t\t<item>\n", $checkItem);
				if (count($checkItem) > 30 ){
					$cc = "";
					for ($i=1; $i<30; $i++){
						$cc .= "\t\t<item>\n".$checkItem[$i];
					}
					$tmp[1] = $cc;
				}
				
				// 增加新的feed到最前面
			  $this->m_FeedItem	.=	"\t\t<item>\n";
			  $this->m_FeedItem	.=	"\t\t\t<title>".$ItemTitle."</title>\n";
			  $this->m_FeedItem	.=	"\t\t\t<category>".$Category."</category>\n";
			  $this->m_FeedItem	.=	"\t\t\t<author>".$Author."</author>\n";
			  $this->m_FeedItem	.=	"\t\t\t<link>".$ItemLink."</link>\n";
			  $this->m_FeedItem	.=	"\t\t\t<guid>".$ItemGuid."</guid>\n";
			  $this->m_FeedItem	.=	"\t\t\t<description>\n\t\t\t\t<![CDATA[\n".$ItemDescription."\n\t\t\t\t]]>\n\t\t\t</description>\n";
			  $this->m_FeedItem .= 	"\t\t\t<pubDate>".$ItemDate."</pubDate>\n";
			  $this->m_FeedItem	.=	"\t\t</item>\n";
			  $this->m_FeedItem .= $tmp[1]; // $tmp[0] 是channel
			  $tmp[1] = "";
		  }
		}
		
		/**
		*	º¯˽Ļ£ºreleaseFeed
		*	ԃ;£ºˤ³�τµµ£¬خº󲙐붷ԃ´˺¯˽
		*/
		function releaseFeed()
		{
			//header( "Content-Type: text/xml; charset=utf-8" );
			//print $this->m_channel;
			//print $this->m_FeedItem;
			
			/*
			print iconv( "gbk", "UTF-8", $this->m_channel );
			print iconv( "gbk", "UTF-8", $this->m_FeedItem );
			*/
			
			//print "\t</channel>\n";
			//print "</rss>\n";
			
			$file_name = "rss.xml";
			$handle = fopen( $file_name, "wb" );
			
			if( ! $handle )
			{
				exit( 0 );
			}
			
			fwrite( $handle, $this->m_channel );
			fwrite( $handle, $this->m_FeedItem );
			fwrite( $handle, "\t</channel>\n" );
			fwrite( $handle, "</rss>\n" );
			fclose( $handle );
			
			print "ok";
			
			//header( "Content-Type: text/xml; charset=utf-8" );
			//readfile( $file_name );
		}
		
		// UBB±뇩ת»»
		function Ubb2Html($content)
		{
			$content = eregi_replace(quotemeta("[code]"),quotemeta("<b>´�/b><table width=\"100%\" align=\"center\" border=\"0\" cellpadding=\"5\" cellspacing=\"1\" bgcolor=\"#D5D5D5\"><tr><td bgcolor=\"#EFEFEF\"><font color=\"#0000FF\">"),$content);
	
			$content = eregi_replace(quotemeta("[/code]"),quotemeta("</font></td></tr></table>"),$content);

			$content = eregi_replace("\\[images\\]([^\\[]*)\\[/images\\]","<a href=\"\\1\" target=\"_blank\"><img src=\"\\1\" border=0 onload=\"javascript:if(this.width>screen.width-333)this.width=screen.width-333\" title=\"µ㼷֢oԃт´°¿ۤ¯@ͼƬ\"></a>",$content);
		
			$content = eregi_replace("\\[url\\]www.([^\\[]*)\\[/url\\]", "<a href=\"http://www.\\1\" target=_blank>www.\\1</a>",$content);

			$content = eregi_replace("\\[url\\]([^\\[]*)\\[/url\\]","<a href=\"\\1\" target=_blank>\\1</a>",$content);

			$content = eregi_replace("\\[url=([^\\[]*)\\]([^\\[]*)\\[/url\\]","<a href=\"\\1\" 	target=_blank>\\2</a>",$content);

			$content = eregi_replace("\\[email\\]([^\\[]*)\\[/email\\]", "<a href=\"mailto:\\1\">\\1</a>",$content);

			return $content;
		}

		// ת»»html±뇩Ϊxml¿ʏՊ¾
		function CleanHtml($content)
		{
			$content = str_replace( "&", "&amp;", $content );
			$content = str_replace( "<", "&lt;", $content );
			$content = str_replace( ">", "&gt;", $content );
			$content = str_replace( "\"", "&quot;", $content );
			$content = str_replace( " ", "&nbsp;", $content );
			$content = str_replace( "\t", "&nbsp;&nbsp;&nbsp;&nbsp;", $content );
			$content = str_replace( "\n", "<br />", $content );

			return $content;
		}
		
		function XmlEncode($content)
		{
			$content = str_replace( "&", "&amp;", $content );
			$content = str_replace( "<", "&lt;", $content );
			$content = str_replace( ">", "&gt;", $content );
			$content = str_replace( "\"", "&quot;", $content );
		
			return $content;
		}
	}
	
?>