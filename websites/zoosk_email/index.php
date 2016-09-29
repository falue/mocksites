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
		<ul>
			<li><input type="text" value="noreply@zoosk.com" id="sender" name="sender" placeholder="Absender-Email"> Absender-Email</li>
			<li><input type="text" value="jonas@gmail.com" id="receiver" name="receiver" placeholder="Empf&auml;nger-Email"> Empf&auml;nger-Email</li>
			<li><input type="text" value="17.10.2016 17:30" id="date" name="date" placeholder="DD.MM.YYYY HH:MM"> DD.MM.YYYY HH:MM</li>
			<li>&nbsp;</li>
			

		<?php
		
		if($_POST["submit_1"]) {
			$email_betreff = "Betreff";
			$email_body = "";
			echo "Email: 'Register successful!' written from $_POST[sender] to $_POST[receiver] @ $_POST[date].<br>";
		} elseif($_POST["submit_2"]) {
			echo "Email: '?' written from $_POST[sender] to $_POST[receiver] @ $_POST[date].<br>";
		}
		
		if(isset($_POST["sender"])) {
		$header_genereal = "MIME-Version: 1.0 \r\nContent-type: text/html; charset=iso-8859-1\r\n";
		$headers_customer = $header_genereal."From: $_POST[sender] \r\n";
		$email_customer = "<div style=\"width:600px;\"><h1>Hallo $_POST[vorname] $_POST[nachname]!</h1>
		
		Hey Runner92, Ich bin eine begeisterte Bikerin und arbeite wie du in der Gastronomie. Zeigst du mir dein privates Album?
		
		+41 78 857 70 53<br><br><img src=\"http://www.vinylengineer.ch/tools/icons/logo.png\" alt=\"\"></div>";
		
		mail($_POST["receiver"], $email_betreff, $email_body, $headers_customer);
		
		echo "<br><a href=\"index.php\">Write new email</a>";
		
		} else {
			echo "Choose action:<br><br>
			<input type=\"submit\" name=\"submit_1\" value=\"Email: 'Register successful!'\"><br>
			<input type=\"submit\" name=\"submit_2\" value=\"Email: '?'\"><br>
			<input type=\"submit\" name=\"submit_3\" value=\"Email: ''\"><br>
			<input type=\"submit\" name=\"submit_4\" value=\"Email: ''\"><br>
			<input type=\"submit\" name=\"submit_5\" value=\"Email: ''\"><br>";
			
		}
		
		?>
		
		</ul>
		</form>
		
		
		
		<hr>
		<br>
			<a href="http://www.filmkulissen.ch" style="color:#555;">[cc] by fabian lüscher 2016</a>
    </article>    
</body>
</html>
