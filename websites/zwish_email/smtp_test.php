<!DOCTYPE html>
<html>
<head>
<title>DER L&Auml;UFER - zoosk emails</title>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
<link rel="stylesheet" type="text/css" href="tools/stylesheet.css" />

</script>
</head>
<body>
    <article>
        <header>smtp</header>
		<hr>
<?
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);


// Pear Mail Library local
# require_once "tools/pear/Mail.php";
// Pear Mail Library
require_once "Mail.php";

$from = 'info@filmkulissen.ch';
$to = 'jonaswid_92@gmail.com';
$subject = 'Hi!';
$body = "Hi,\n\nHow <a href=\"asdf\">are</a> you?";
smtp_mail($from, $to, $subject, $body);


function smtp_mail($from, $to, $subject, $body) {
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
	echo("&rarr; Von: $from, An: $to, Subject: '$subject'<br>");
}
}


?>


	</article>


</body>
</html>
