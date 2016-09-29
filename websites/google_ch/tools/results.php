<?

$q = $_GET["q"]; // suchbegriff
$q = strtolower($q);

$dir    = '../queue';
$files = scandir($dir);

foreach($files as $file) {
	if($file != "." && $file != ".." && $file != ".DS_Store" ) {
		$results[$file] = file("$dir/$file");
	}
}

/*
echo "<code>";
print_r($results);
echo "</code>";*/

/*
*.txt in folder queue:
imageband	-> bildbanner nach "queue_img/currentfilename.png"
Title>url>[IMG:bild.png]Text
*/

foreach($results as $match => $result) {
	$filename = $match;
	$match = str_replace("_", " ", strtolower(substr($match, 0, -4)));
	#$resultlist .= $match.levenshtein($q, $match);
	if(levenshtein($q, $match) <=2 ) {
		foreach($result as $info) {
			if($info == "imageband\n") {
				$resultlist .= "<a href=\"#\"><span class=\"result_titel\">Images for Nina Galli</span></a>&emsp;<span class=\"right grey\">Report images</span><br><br><a href=\"#\"><img src=\"queue_img/".substr($filename, 0, -4).".png\" class=\"imageband\" alt=\"\"></a><br><br><a href=\"#\">More images for Nina Galli</a><br><br><br><hr><br>";
			} else {
				$links = explode(">", $info);
				$titel = $links[0];
				$link_show = preg_match("#localhost#", $links[1]) || preg_match("#../#", $links[1]) ? "http://www.".strtolower(str_replace(" ", "-", $links[0])).".ch" : $links[1];
				$text = preg_replace("#\[IMG:(.*?)\]#x", "", "$links[2]");
				preg_match("#\[IMG:(.*?)\]#x", "$links[2]", $images);
				#print_r($images);
				$image = isset($images[0]) ? preg_replace("#\[IMG:(.*?)\]#x", "<div class=\"result_img\" style=\"background-image: url('queue_img/\\1');\">&nbsp;</div>", $images[0]) : "";
				
				$resultlist .= "<div class=\"result\">
				<a href=\"$links[1]\"><span class=\"result_titel\">$titel</span></a><br>
				
				<div class=\"result_text\">
					$image
					<span class=\"result_link\">$link_show &#9662;</span><br>
					$text
				</div>
				</div>";
			}
		}
	}
}




if(isset($resultlist)) {
	echo "<span class=\"result_stats\">About ".rand(1,20).".000 results (0,".rand(10,99)." seconds)</span><br><br>
	$resultlist
	<br><br><br>
	<hr><center>
	<img src=\"tools/nav_sites.png\" class=\"nav_sites\"></center>";
} else {
	echo "<span class=\"noresult\"><br><br><br><br>Your search - <b>$q</b> - did not match any documents.<br><br>
Suggestions:<br><br>
<ul>
	<li>Make sure that all words are spelled correctly.</li>
	<li>Try different keywords.</li>
	<li>Try more general keywords.</li>
	<li>Try fewer keywords.</li>
</ul></span>";
}



?>