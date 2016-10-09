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
		<?
		if(isset($_POST["sender"])) {
			echo "<li><input type=\"text\" value=\"".$_POST["sender"]."\" id=\"sender\" name=\"sender\" placeholder=\"Absender-Email\"> Absender-Email</li>";
		} else {
			echo "<li><input type=\"text\" value=\"noreply@zoosk.com\" id=\"sender\" name=\"sender\" placeholder=\"Absender-Email\"> Absender-Email</li>";
		}
		if(isset($_POST["receiver"])) {
			echo "<li><input type=\"text\" value=\"".$_POST["receiver"]."\" id=\"receiver\" name=\"receiver\" placeholder=\"Empf&auml;nger-Email\"> Empf&auml;nger-Email</li>";
		} else {
			echo "<li><input type=\"text\" value=\"jonaswid_92@gmail.com\" id=\"receiver\" name=\"receiver\" placeholder=\"Empf&auml;nger-Email\"> Empf&auml;nger-Email</li>";
		}
		if(isset($_POST["date"])) {
			echo "<li><input type=\"text\" value=\"".$_POST["date"]."\" id=\"date\" name=\"date\" placeholder=\"DD.MM.YYYY HH:MM\"> DD.MM.YYYY HH:MM</li>";
		} else {
			echo "<li><input type=\"text\" value=\"17.10.2016 17:30\" id=\"date\" name=\"date\" placeholder=\"DD.MM.YYYY HH:MM\"> DD.MM.YYYY HH:MM</li>";
		}
		echo "</ul>";
	
		if($_POST["submit_1"]) {
			$email_betreff = "Zoosk.com - Verifikation E-Mail-Adresse";
			$email_body = file_get_contents("emails/email1.html");
			$printout = "Email '$email_betreff' written from $_POST[sender] to $_POST[receiver] @ $_POST[date].";
		} elseif($_POST["submit_2"]) {
			$email_betreff = "Zoosk.com - PM von Angelique94";
			$email_body = file_get_contents("emails/email2.html");
			$printout = "Email '$email_betreff' written from $_POST[sender] to $_POST[receiver] @ $_POST[date].";
		}

		$header_genereal = "MIME-Version: 1.0 \r\nContent-type: text/html; charset=iso-8859-1\r\n";
		$headers_customer = $header_genereal."From: $_POST[sender] \r\n";
		mail($_POST["receiver"], $email_betreff, $email_body, $headers_customer);
		
		
		echo "Choose action:<br>
		<input type=\"submit\" name=\"submit_1\" value=\"'Register successful'\"> &emsp;<a href=\"emails/email1.html\">[preview]</a><br>
		<input type=\"submit\" name=\"submit_2\" value=\"'PM von Angelique94'\"> &emsp;<a href=\"emails/email2.html\">[preview]</a><br></form>";
		if(isset($printout)) echo "<br><span style=\"color:green;\">Email send.</span><br>$printout<br><br>";
		?>
		
		<hr>
		<br>
			<a href="http://www.filmkulissen.ch" style="color:#555;">[cc] by fabian lüscher 2016</a>
    </article>    
</body>
</html>
