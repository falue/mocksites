<!DOCTYPE html>
<html>
  <head>
    <title>DER L&Auml;UFER - zwish emails
    </title>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
    <link rel="stylesheet" type="text/css" href="tools/stylesheet.css" />
    </script>
  </head>
<body>
  <article>
    <header>"Der L&auml;ufer" – Fake emails zwish.com
    </header>
    <hr>
    <form action="index.php" method="POST">
  <?php
	ini_set('display_errors', 1);
	ini_set('display_startup_errors', 1);
	error_reporting(E_ALL);
	echo "Absender-Email
	<input type=\"text\" value=\"".(isset($_POST["sender"]) ? $_POST["sender"] : "noreply@zwish.com")."\" id=\"sender\" name=\"sender\" placeholder=\"Absender-Email\">

	Empf&auml;nger-Email
	<input type=\"text\" value=\"".(isset($_POST["receiver"]) ? $_POST["receiver"] : "jonaswid_92@gmail.com")."\" id=\"receiver\" name=\"receiver\" placeholder=\"Empf&auml;nger-Email\">

	Sendeverz&ouml;gerung (s)
	<input type=\"text\" id=\"delay\" name=\"delay\" value=\"".(isset($_POST["delay"]) ? $_POST["delay"] : "")."\" placeholder=\"n\"><br><br>
	<label><input type=\"radio\" name=\"email\" value=\"1\" checked=\"checked\">Email 1: 'Register successful'</label> <a href=\"emails/email1.html\">[preview]</a><br>
	<label><input type=\"radio\" name=\"email\" value=\"2\">Email 2: 'PM von Angelique94'</label> <a href=\"emails/email2.html\">[preview]</a><br><br>";
		echo "Aktion ausw&auml;hlen:<br>
	<input type=\"submit\" name=\"submit_1\" id=\"submit_1\" value=\"Email schreiben\"><br>
	<a href=\"#\" onclick=\"window.location.href='index.php?write_saved=true&to='+document.getElementById('receiver').value\"><input type=\"button\" name=\"submit_5\" id=\"submit_5\" value=\"Gespeicherte Emails erneut senden\"></a><br>
	<input type=\"button\" value=\"Mock Emails erstellen\" id=\"button_create\" onclick=\"document.getElementById('button_create').style.display='none'; document.getElementById('count_email').style.display='block';\"><br>
	<div  id=\"count_email\" style=\"display:none;\">Anzahl Mock emails
	<input type=\"text\" value=\"\" name=\"count_email\" placeholder=\"n\">
	<input type=\"submit\" name=\"submit_3\" value=\"Emails generieren\"></div>
	</form>";

	if(isset($_POST["email"]) && $_POST["email"] == 1 && $_POST["count_email"] == null) {
		$from = $_POST["sender"];
		$to = $_POST["receiver"];
		$subject = "Zwish.com - Verifikation E-Mail-Adresse";
		$body = file_get_contents("emails/email1.html");
		echo "<br><span style=\"color:green;\">Passiert ist folgendes:</span><br>";
		smtp_mail($from, $to, $subject, $body);
	}

	elseif(isset($_POST["email"]) && $_POST["email"] == 2 && $_POST["count_email"] == null) {
		$from = $_POST["sender"];
		$to = $_POST["receiver"];
		$subject = "Zwish.com - PM von Angelique94";
		$body = file_get_contents("emails/email2.html");
		echo "<br><span style=\"color:green;\">Passiert ist folgendes:</span><br>";
		smtp_mail($from, $to, $subject, $body);
	}

	elseif(isset($_POST["count_email"]) && $_POST["count_email"] > 0) {
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
				$betreff = rand(0,10) < 5 ? "RE: ".$betreff :
				"AW: ".$betreff;
			}

			$betreff = rand(0,10) < 9 ? "RE: ".$betreff :
			$betreff." (".rand(25125,122224).")";
			$server = array("gmail.com", "gmx.ch", "gmail.com", "hotmail.com", "yahoo.com", "gmx.net", "gmx.de", "gmail.de", "outlook.com");
			$absender = clean(strtolower($wordlist[rand(0,$keys)]))."@".$server[rand(0,sizeof($server)-1)];
			$absender_name = ucfirst($firstnamelist[rand(0,$keys_first)]);
			$absender = rand(0,10) < 5 ? '"'.$absender_name.' '.ucfirst($lastnamelist[rand(0,$keys_last)]).'" <'.$absender.'>' :	$absender;
			#$absender = rand(0,10) < 5 ? "$absender_name ".ucfirst($lastnamelist[rand(0,$keys_last)])." $absender" : $absender;
			$hallo = array("Hallo", "Hi", "Sehr geehrte Damen und Herren,<br>Lieber", "Lieber", "Sehr geehrter Herr", "Hoi", "Sali", "Tagwohl");
			$btext = $hallo[rand(0,sizeof($hallo)-1)]." $receiver_name<br><br>".ucfirst($wordlist[rand(0,$keys)])." ";
			for($p=0; $p <= rand(0,2); $p++) {
				for($w=0; $w <= rand(4,100); $w++) {
					$btext .= $wordlist[rand(0,$keys)]." ";
				}

				$btext .= "<br><br>";
			}

			$by = array("Freundliche Gr&uuml;sse,<br>", "<br>Mit Freundlichen Gr&uuml;ssen,<br><br>", "Ciao, ", "lg ", "<br>lg<br>", "<br>lieber Gruss, ", "lieber gruss<br>", "<br>LG - ");
			$btext .= $by[rand(0,sizeof($by)-1)]."$absender_name<br><br>-- <br>";
			$printout .=  "Betreff: <input type=\"text\" name=\"betreff[]\" value=\"$betreff\"><br>";
			$printout .=  "Von: <input type=\"text\" name=\"from[]\" value=\"".htmlentities($absender)."\"><br>";
			$printout .=  "<textarea name=\"text[]\">".str_replace('<br>', "\n", $btext)."</textarea>";
			$printout .=  "<hr>";
		}

		$printout = $_POST["count_email"]." mails erstellt:<br><br><form action=\"index.php\" method=\"POST\">
		<input type=\"hidden\" value=\"".$_POST["receiver"]."\" id=\"to\" name=\"to\">
		$printout
		<input type=\"hidden\" name=\"save\" value=\"no\">
		<label><input type=\"checkbox\" name=\"save\" value=\"yes\">Mails als Dateien speichern</label><br>
		<input type=\"submit\" name=\"submit_4\" value=\"Send ".$_POST["count_email"]." emails\"></form>";

		echo "<br><span style=\"color:green;\">Passiert ist folgendes:</span><br>";
		echo $printout;
	}


	if(isset($_POST["submit_4"])) {
		echo "<br><span style=\"color:green;\">Passiert ist folgendes:</span><br>";
		echo "An: ".$_POST["to"]."<br>";
		# echo "Save: ".$_POST["save"]."<hr>";
		if($_POST["save"]) echo "Alle Emails gespeichert!";
		echo "<hr>";
		$save = $_POST["save"] == "yes" ? True : False;
		for($m=0; $m <= sizeof($_POST["betreff"])-1; $m++) {
			/*echo "Von: ".htmlentities($_POST["from"][$m])."<br>";
			echo "Betreff: ".$_POST["betreff"][$m]."<br>";
			echo "Text:<br>".$_POST["text"][$m]."<br>";
			echo "<hr>";*/
			smtp_mail(htmlentities($_POST["from"][$m]), $_POST["to"], $_POST["betreff"][$m], nl2br($_POST["text"][$m]), $save);
		}
	}

	if(isset($_GET["write_saved"])) {
		echo "<br><span style=\"color:green;\">Passiert ist folgendes:</span><br>";
		$to = $_GET["to"];
		$dir = 'mockmails';
		$files = scandir($dir, 0);
		$count = 0;
		for($i = 0; $i < count($files); $i++){
			if($files[$i] != "." && $files[$i] != ".." && $files[$i] != ".DS_Store" && $files[$i] != ".AppleDouble") {
				$maildata = file("$dir/".$files[$i]);
				smtp_mail(trim($maildata[0]), $to, trim($maildata[2]), trim($maildata[3]));
				$count++;
			}
			}
		echo "<hr>$count Emails an $to geschickt.";
		}


	function clean($string) {
		$string = str_replace('-', '.', $string);
		// Replaces all spaces with hyphens.
		return preg_replace('/[^A-Za-z0-9\-]/', '_', $string);
		// Removes special chars.
	}


	function smtp_mail($from, $to, $subject, $body, $save=False) {
		# require_once "tools/pear/Mail.php";
		require_once "Mail.php";
		$from = html_entity_decode($from);
		$headers = array(
		'From' => $from,
		'To' => $to,
		'Subject' => $subject,
		'Content-Type' => "text/html"
		);

    $smtp = Mail::factory('smtp', array(
      'host' => 'mail',
      'port' => '25',
      'auth' => true,
      'username' => 'swish@gmail.com',
      'password' => '1234'
        ));

		$mail = $smtp->send($to, $headers, $body);

		if (PEAR::isError($mail)) {
			echo('<p>Error: ' . $mail->getMessage() . '</p>');
		} else {
			echo "&rarr; Von: ".htmlentities($from).", An: $to, Subject: '$subject'<br>";
		}


		if($save){
			$mail = "$from\n$to\n$subject\n".trim(preg_replace('/\s+/', ' ', $body));
			$myfile = fopen("mockmails/".urlencode($from).".txt", "w") or die("Unable to open file!");
			fwrite($myfile, $mail);
			fclose($myfile);
		}
	}

	?>
	<hr>
	<br>
	<a href="http://www.filmkulissen.ch" style="color:#555;">[cc] by fabian lüscher 2016
	</a>
	</article>
  <script>
	document.querySelector("[name=submit_1]").addEventListener('click', send1);
	function send1(e) {
	  var button = this;
	  var form = document.getElementById('mainform');
	  button.value="Waiting to send...";
	  var delaytime = document.getElementById('delay').value*1000;
	  e.preventDefault();
	  setTimeout(function() {
		button.form.submit();
	  }
				 , delaytime);
	}
  </script>
  </body>
</html>
