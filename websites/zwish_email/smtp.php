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


// Pear Mail Library
require_once "tools/pear/Mail.php";

$from = 'info@filmkulissen.ch';
$to = 'info@filmlicht.ch';
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
        'host' => 'ssl://goethe.metanet.ch',
        'port' => '465',
        'auth' => true,
        'username' => 'info@filmkulissen.ch',
        'password' => 'Sigmar-6-6-6'
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
