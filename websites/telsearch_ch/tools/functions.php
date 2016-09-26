<?
//dateien auslesen aus ordner
function getfilelist($dir) {
	if(!is_dir("files/".$dir)) {
		$dir = explode("/", $dir);
		array_pop($dir);
		$dir = implode("/",$dir);
	}
	$verz = opendir ("files/".$dir);
	$counter = 0;
		while($files = readdir($verz)) {
			if($files != '.' && $files != '.htaccess' && $files != '.htusers' && $files != '..' && $files != '.DS_Store' && $files != 'login.php') {
				if(sizeof(explode(".", $files))>1) {
					// alle dateien
					// 0="filename" with suffix    1="path"   2="filename_single"   3="suffix"   4="filetype"  5="filesize"   6="path_suffix"    7="creationdate"    8="html"
					$file[$counter]["filename"] = $files;
					$file[$counter]["path"] = "files/$dir/$files";
					$file[$counter]["suffix"] = strtolower(end(explode(".", $files)));
					$file[$counter]["filename_single"] = substr($files,0,strlen($files)-strlen($file[$counter]["suffix"])-1);				
					$finfo = finfo_open(FILEINFO_MIME_TYPE);
					$file[$counter]["filetype"] =  is_readable("files/".$dir."/".$files) ? finfo_file($finfo, $file[$counter]["path"]) : "not writable";
					finfo_close($finfo);
					$file[$counter]["filesize"] = getfilesize($file[$counter]["path"]);
					$file[$counter]["path_suffix"] = file_exists("tools/icons/_filetypes/".$file[$counter]["suffix"].".png") ? "tools/icons/_filetypes/".$file[$counter]["suffix"].".png" : "tools/icons/_filetypes/unknown_file.png" ;
					$file[$counter]["creationdate"] = date("d.m.y", filemtime($file[$counter]["path"]));
					$file[$counter]["html"] = "<a href=\"".$file[$counter]["path"]."\"><img src=\"".$file[$counter]["path_suffix"]."\" alt=\".".$file[$counter]["suffix"]."\"> ".$file[$counter]["filename_single"]." (".$file[$counter]["suffix"].", ".$file[$counter]["creationdate"].", ".$file[$counter]["filesize"].")</a>\n";
				} else {
					// Ordner
					$file[$counter]["filename"] = $files;
					$file[$counter]["path"] = "$dir/$files"; //"?files=".
					$file[$counter]["suffix"] = "folder";
					$file[$counter]["filename_single"] = $files;
					$file[$counter]["filetype"] =  is_writable("files/".$dir."/".$files) ? "folder" : "not writable";
					$file[$counter]["filesize"] = getfoldersize("files/$dir/$files", true);
					$file[$counter]["path_suffix"] = "tools/icons/_filetypes/folder.png";
					$file[$counter]["creationdate"] = date("d.m.y", filemtime("files/$dir/".$files));
					$file[$counter]["html"] = "<a href=\"".$file[$counter]["path"]."\"><img src=\"".$file[$counter]["path_suffix"]."\" alt=\".".$file[$counter]["suffix"]."\"> ".$file[$counter]["filename_single"]." (".$file[$counter]["suffix"].", ".$file[$counter]["creationdate"].", ".$file[$counter]["filesize"].")</a>\n";
				}
				$counter++;
			}
		}
	if($file) sort($file);
	//print_r($file);
	closedir ($verz);
	return $file;
}

// erste bilddatei in ordner zeigen
function getfirstimage($folder) {
  $verz = opendir ($folder);
  while($files = readdir($verz)) {
    if($files != '.' && $files != '..' && $files != '.DS_Store') {
        $file_array[] = $files;
    }
  }

  if(isset($file_array)) {
    natcasesort($file_array);
    $file_array = array_reverse($file_array);
    
    if(isset($file_array)) {
    foreach($file_array as $files) {
      $suffix = explode(".", $files);
      $suffix = strtolower(end($suffix));
      if($suffix == "jpg" or $suffix == "png" or $suffix == "dng" or $suffix == "jpeg") {
        return "$folder/$files";
      }
    }
    } else {
      return false;
    }
  } else {
    return false;
  }
}

// value aus mysql tabelle zeigen
function get_value($id) {
  $sql = "SELECT Value FROM Content WHERE ID = '$id'";
  $result = mysql_query($sql) OR die("<pre>\n".$sql."</pre>\n".mysql_error());
  $row = mysql_fetch_assoc($result);
  return $row['Value'];  
}

// megalom-spezifischer bb-code anwenden
function to_html($content) {
  include("megalom/project_specific/suchenersetzen.php");
  return $content;
}

?>