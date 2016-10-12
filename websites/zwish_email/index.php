<!DOCTYPE html>
<html>
<head>
<title>DER L&Auml;UFER - zoosk emails</title>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
<link rel="stylesheet" type="text/css" href="tools/stylesheet.css" />
</head>
<body>
    <article>
        <header>"Der L&auml;ufer" – Fake emails zoosk.com</header>
		<hr>
		<form action="index.php"  method="POST">
		<?
    ini_set('display_errors', 1);
    ini_set('display_startup_errors', 1);
    error_reporting(E_ALL);

		echo "Absender-Email<input type=\"text\" value=\"".(isset($_POST["sender"]) ? $_POST["sender"] : "noreply@zoosk.com")."\" id=\"sender\" name=\"sender\" placeholder=\"Absender-Email\">
    Empf&auml;nger-Email<input type=\"text\" value=\"".(isset($_POST["receiver"]) ? $_POST["receiver"] : "jonaswid_92@gmail.com")."\" id=\"receiver\" name=\"receiver\" placeholder=\"Empf&auml;nger-Email\">
    <br><br>";

    echo "Choose action:<br>
    <input type=\"submit\" name=\"submit_1\" value=\"Email 1: 'Register successful'\"> &emsp;<a href=\"emails/email1.html\">[preview]</a><br>
    <input type=\"submit\" name=\"submit_2\" value=\"Email 2: 'PM von Angelique94'\"> &emsp;<a href=\"emails/email2.html\">[preview]</a><br>
    <input type=\"button\" value=\"Create n random emails\" id=\"button_create\" onclick=\"document.getElementById('button_create').style.display='none'; document.getElementById('count_email').style.display='block';\"><br>
	<div  id=\"count_email\" style=\"display:none;\">Anzahl Fake emails
	<input type=\"text\" value=\"\" name=\"count_email\" placeholder=\"\"> 
	<input type=\"submit\" name=\"submit_3\" value=\"Create emails\"></div><br></form>";

		if(isset($_POST["submit_1"])) {
			$email_betreff = "Zoosk.com - Verifikation E-Mail-Adresse";
			/*$email_body = file_get_contents("emails/email1.html"); \"$email_betreff\"  */
      chdir('../../mail');
      #shell_exec("./sendmail $_POST[sender] $email_betreff ../websites/zwish_email/emails/email1.html");
      $printout = shell_exec("./hello");
			#$printout = "Email '$email_betreff' written from $_POST[sender] to $_POST[receiver].";

    } elseif(isset($_POST["submit_2"])) {
			$email_betreff = "Zoosk.com - PM von Angelique94";
      shell_exec("./sendmail $_POST[sender] $email_betreff ../websites/zwish_email/emails/email2.html");
			$printout = "Email '$email_betreff' written from $_POST[sender] to $_POST[receiver].";

	} elseif(isset($_POST["submit_3"]) && $_POST["count_email"] > 0) {
	  $receiver = explode("@", $_POST["receiver"]);
	  $receiver_name = ucfirst($receiver[0]);
	  $wordlist = file("tools/wordlistDE.txt", FILE_IGNORE_NEW_LINES);
	  $keys = sizeof($wordlist)-1;
	  $firstnamelist = file("tools/firstnames.txt", FILE_IGNORE_NEW_LINES);
	  $keys_first = sizeof($firstnamelist)-1;
	  $lastnamelist = file("tools/lastnames.txt", FILE_IGNORE_NEW_LINES);
	  $keys_last = sizeof($lastnamelist)-1;
	  $printout = "";
	  for($i=0; $i < $_POST["count_email"]; $i++) {	
			$betreff = ucfirst($wordlist[rand(0,$keys)])." ";
		for($b=0; $b <= rand(0,3); $b++) {
			$betreff .= $wordlist[rand(0,$keys)]." ";
		}
		if(rand(0,10) < 5 ) {
			$betreff = rand(0,10) < 5 ? "RE: ".$betreff : "AW: ".$betreff;
		}		
		$betreff = rand(0,10) < 9 ? "RE: ".$betreff : $betreff." (".rand(25125,122224).")";
		
		$server = array("gmail.com", "gmx.ch", "gmail.com", "hotmail.com", "yahoo.com", "gmx.net", "gmx.de", "gmail.de", "outlook.com");
		$absender = clean(strtolower($wordlist[rand(0,$keys)]))."@".$server[rand(0,sizeof($server)-1)];
		$absender_name = ucfirst($firstnamelist[rand(0,$keys_first)]);
		$absender = rand(0,10) < 5 ? "<$absender_name ".ucfirst($lastnamelist[rand(0,$keys_last)])."> ".$absender : $absender;
		
		$hallo = array("Hallo", "Hi", "Sehr geehrte Damen und Herren,\nLieber", "Lieber", "Sehr geehrter Herr", "Hoi", "Sali", "Tagwohl");
		$btext = $hallo[rand(0,sizeof($hallo)-1)]." $receiver_name\n\n".ucfirst($wordlist[rand(0,$keys)])." ";
		
		for($p=0; $p <= rand(0,2); $p++) {
			for($w=0; $w <= rand(4,100); $w++) {
				$btext .= $wordlist[rand(0,$keys)]." ";
			}
			$btext .= "\n\n";
		}
		
		
		$by = array("Freundliche Gr&uuml;sse,\n", "\nMit Freundlichen Gr&uuml;ssen,\n\n", "Ciao, ", "lg ", "\nlg\n", "\nlieber Gruss, ", "lieber gruss\n", "\nLG - ");
		$btext .= $by[rand(0,sizeof($by)-1)]."$absender_name\n\n-- \n";
		
		$printout .=  "Betreff: <input type=\"text\" name=\"betreff[]\" value=\"$betreff\"><br>"; 
		$printout .=  "Von: <input type=\"text\" name=\"from[]\" value=\"".htmlentities($absender)."\"><br>";
		$printout .=  "<textarea name=\"text[]\">$btext</textarea>";
		$printout .=  "<hr>";
	  }
	  
      $printout = "$_POST[count_email] mails created:<br><br><form action=\"index.php\" method=\"POST\">$printout<input type=\"submit\" name=\"submit_4\" value=\"Send $_POST[count_email] emails\"></form>";
	  
    }
	
	if(isset($_POST["submit_4"])) {
		for($m=0; $m <= sizeof($_POST["betreff"])-1; $m++) {
			/*echo $_POST["betreff"][$m]."<br>";
			echo htmlentities($_POST["from"][$m])."<br>";
			echo $_POST["text"][$m]."<br>";
			echo "<hr>";*/
			
			shell_exec("./sendmail_txt \"".$_POST["from"][$m]."\" \"".$_POST["betreff"][$m]."\" \"".$_POST["text"][$m]."\"");
		}
		$printout = "Fake mails sent.";
	}
	
	
	if(isset($printout)) echo "<br><span style=\"color:green;\">Action occurred:</span><br>$printout<br><br>";
		
		
		
		
	function clean($string) {
		$string = str_replace('-', '.', $string); // Replaces all spaces with hyphens.
		return preg_replace('/[^A-Za-z0-9\-]/', '_', $string); // Removes special chars.
	}
		
		
		?>

		<hr>
		<br>
			<a href="http://www.filmkulissen.ch" style="color:#555;">[cc] by fabian lüscher 2016</a>
    </article>
</body>
</html>
