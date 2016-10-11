<?

$q = $_GET["q"]; // suchbegriff
$q = strtolower($q);

$dir    = '../queue';
$files = scandir($dir);

foreach($files as $file) {
	if($file != "." && $file != ".." && $file != ".DS_Store" ) {
		$result = str_replace("_", " ", substr($file, 0, -4)); # strtolower()
		#if(strlen($q) <= strlen($result) && preg_match("#$q#", $result)) {
		if(substr($result, 0, strlen($q)) == $q) {
			#echo str_replace("$q", "<b>$q</b>", $result);
			$lev = levenshtein($q, $result);
			$prompt[$lev] .= "<div class=\"prompt_row\" onclick=\"search('$result'); document.getElementById('search').value = '$result';\">$q";
			$prompt[$lev] .= "<b>".preg_replace("#$q#", "", $result, 1)."</b>";
			#$prompt[$lev] .= " | $lev";
			$prompt[$lev] .= "</div>#";
		}
	}
}

if(isset($prompt)) {
	$prompt = implode("#", $prompt);
	$prompt = explode("#", $prompt);
	#echo implode("", array_slice($prompt, 0, 5));
	rsort($prompt);
	#print_r(array_filter($prompt));
	echo implode("", array_slice(array_filter($prompt), 0, 4));
} else {
	echo "Keine Ergebnisse";
}
?>