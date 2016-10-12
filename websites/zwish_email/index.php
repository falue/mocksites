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

		echo "<input type=\"text\" value=\"".(isset($_POST["sender"]) ? $_POST["sender"] : "noreply@zoosk.com")."\" id=\"sender\" name=\"sender\" placeholder=\"Absender-Email\"> Absender-Email
    <input type=\"text\" value=\"".(isset($_POST["receiver"]) ? $_POST["receiver"] : "jonaswid_92@gmail.com")."\" id=\"receiver\" name=\"receiver\" placeholder=\"Empf&auml;nger-Email\"> Empf&auml;nger-Email
    <input type=\"text\" value=\"".(isset($_POST["btext"]) ? $_POST["btext"] : "")."\" id=\"btext\" name=\"btext\" placeholder=\"Bodytext\"> opt. Text<br><br>";

    echo "Choose action:<br>
    <input type=\"submit\" name=\"submit_1\" value=\"Email 1: 'Register successful'\"> &emsp;<a href=\"emails/email1.html\">[preview]</a><br>
    <input type=\"submit\" name=\"submit_2\" value=\"Email 2: 'PM von Angelique94'\"> &emsp;<a href=\"emails/email2.html\">[preview]</a><br>
    <input type=\"submit\" name=\"submit_3\" value=\"Email 3: Freies email mit Text\"> <br></form>";

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

		} elseif(isset($_POST["submit_2"])) {
      $printout = "3";
      shell_exec("./sendmail_txt $_POST[sender] $email_betreff $_POST[btext]");
    }

		if(isset($printout)) echo "<br><span style=\"color:green;\">Action occured:</span><br>$printout<br><br>";
		?>

		<hr>
		<br>
			<a href="http://www.filmkulissen.ch" style="color:#555;">[cc] by fabian lüscher 2016</a>
    </article>
</body>
</html>
