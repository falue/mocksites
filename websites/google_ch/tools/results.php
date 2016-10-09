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
		$result = parse_ini_file("$dir/$filename", TRUE);
		if($result){
			/*echo "<code>";
			print_r($ini_array);
			echo "</code>";*/
			foreach($result as $info) {
				$resultlist .= $info["imageband"] ? "<a href=\"#\"><span class=\"result_titel\">Images for $q</span></a>&emsp;<span class=\"right grey\">Report images</span><br><br><a href=\"#\"><img src=\"queue_img/$info[imageband]\" class=\"imageband\" alt=\"\"></a><br><br><a href=\"#\">More images for $q</a><br><br><br><hr><br>" : "";
				$url = $info["URL"] ? $info["URL"] : "";
				$url_show = $info["URL_cover"] ? $info["URL_cover"] : $url;
				$image = $info["img"] ? "<div class=\"result_img\" style=\"background-image: url('queue_img/$info[img]');\">&nbsp;</div>" : "";
				$text = $info["desc"] ? $info["desc"] : "";
				if($info["title"]) {					
					$resultlist .= "<div class=\"result\">
					<a href=\"$url\"><span class=\"result_titel\">$info[title]</span></a><br>
					<div class=\"result_text\">
						$image
						<span class=\"result_link\">$url_show &#9662;</span><br>
						$text
					</div>
					</div>";
				}
				#$resultlist .= "$info";
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