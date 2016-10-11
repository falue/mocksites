<!DOCTYPE html>
<head>
  <?
  
  if($_GET["p"] == "register" ) {
    $browsertitle = " - Registrierung";
    $id = "register";
    $onload = "onload=\"upload(0, 500);\"";
  } else {
    $browsertitle = " - home";
    $id = "home";
  }
  ?>
<title>Zwish.com<? echo $browsertitle; ?></title>
<link rel="stylesheet" type="text/css" href="tools/stylesheet_index.css" />
<script src="tools/javascript_index.js"></script>

<!-- ISO-8859-1 -->
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">

<!-- favicon -->
<!-- <link rel="shortcut icon" type="image/x-icon" href="favicon.ico" /> -->

</head>
<body <? echo $onload; ?>>
	
<nav>
  <div class="slogan2">Anmelden</div><br><br>
  <form action="index.php?p=register" method="post" autocomplete="off">
  <a href="index.php?p=register"><img src="tools/icons/home_fb.png" alt=""></a><br><br>  
  &nbsp;Ich bin:<br>
  <select>
    <option hidden="hidden">Geschlecht und Partnerwunsch</option>
    <option>Ein Mann, der eine Frau sucht</option>
    <option>Eine Frau, die einen Mann sucht</option>
    <option>Ein Mann, der einen Mann sucht</option>
    <option>Eine Frau, die eine Frau sucht</option>
  </select><br>
      &nbsp;Geburtstag:<br>
  <select class="bday_d">
    <option hidden="hidden">Tag</option>
    <option>1</option>
    <option>2</option>
    <option>3</option>
    <option>4</option>
    <option>5</option>
    <option>6</option>
    <option>7</option>
    <option>8</option>
    <option>9</option>
    <option>10</option>
    <option>11</option>
    <option>12</option>
    <option>13</option>
    <option>14</option>
    <option>15</option>
    <option>16</option>
    <option>17</option>
    <option>18</option>
    <option>19</option>
    <option>20</option>
    <option>21</option>
    <option>22</option>
    <option>23</option>
    <option>24</option>
    <option>25</option>
    <option>26</option>
    <option>27</option>
    <option>28</option>
    <option>29</option>
    <option>30</option>
    <option>31</option>
  </select>

  <select class="bday_m">
    <option hidden="hidden">Monat</option>
    <option>Januar</option>
    <option>Februar</option>
    <option>M&auml;rz</option>
    <option>April</option>
    <option>Mai</option>
    <option>Juni</option>
    <option>Juli</option>
    <option>August</option>
    <option>September</option>
    <option>Oktober</option>
    <option>November</option>
    <option>Dezember</option>
  </select>
  
  <select class="bday_y">
    <option hidden="hidden">Jahr</option>
    <option>2016</option>
    <option>2015</option>
    <option>2014</option>
    <option>2013</option>
    <option>2012</option>
    <option>2011</option>
    <option>2010</option>
    <option>2009</option>
    <option>2008</option>
    <option>2007</option>
    <option>2006</option>
    <option>2005</option>
    <option>2004</option>
    <option>2003</option>
    <option>2002</option>
    <option>2001</option>
    <option>2000</option>
    <option>1999</option>
    <option>1998</option>
    <option>1997</option>
    <option>1996</option>
    <option>1995</option>
    <option>1994</option>
    <option>1993</option>
    <option>1992</option>
    <option>1991</option>
    <option>1990</option>
    <option>1989</option>
    <option>1988</option>
    <option>1987</option>
    <option>1986</option>
    <option>1985</option>
    <option>1984</option>
    <option>1983</option>
    <option>1982</option>
    <option>1981</option>
    <option>1980</option>
    <option>1979</option>
    <option>1978</option>
    <option>1977</option>
    <option>1976</option>
    <option>1975</option>
    <option>1974</option>
    <option>1973</option>
    <option>1972</option>
    <option>1971</option>
    <option>1970</option>
    <option>1969</option>
    <option>1968</option>
    <option>1967</option>
    <option>1966</option>
    <option>1965</option>
    <option>1964</option>
    <option>1963</option>
    <option>1962</option>
    <option>1961</option>
    <option>1960</option>
    <option>1959</option>
    <option>1958</option>
    <option>1957</option>
    <option>1956</option>
    <option>1955</option>
    <option>1954</option>
    <option>1953</option>
    <option>1952</option>
    <option>1951</option>
    <option>1950</option>
    <option>1949</option>
    <option>1948</option>
    <option>1947</option>
    <option>1946</option>
    <option>1945</option>
    <option>1944</option>
    <option>1943</option>
    <option>1942</option>
    <option>1941</option>
    <option>1940</option>
    <option>1939</option>
    <option>1938</option>
    <option>1937</option>
    <option>1936</option>
    <option>1935</option>
    <option>1934</option>
    <option>1933</option>
    <option>1932</option>
    <option>1931</option>
    <option>1930</option>
    <option>1929</option>
    <option>1928</option>
    <option>1927</option>
    <option>1926</option>
    <option>1925</option>
    <option>1924</option>
    <option>1923</option>
    <option>1922</option>
    <option>1921</option>
    <option>1920</option>
    <option>1919</option>
    <option>1918</option>
    <option>1917</option>
    <option>1916</option>
  </select>
    
    <br>
      &nbsp;E-Mail-Adresse:<br>
  <input type="text" name="email" placeholder="name@e-mail.de" autocomplete="off" required="required"><br>
      &nbsp;Passwort:<br>
  <input type="password" placeholder="Passwort" autocomplete="off"><br>
  <input type="submit" name="register" value="Registrieren*" class="register_button"></form>
  <span class="legal">
  *Durch die Auswahl von "Registrieren" stimmst du unseren <a href="#">Nutzungsbedingungen</a>, unseren Bedingungen <a href="#">f&uuml;r elektronische Daten</a> und unseren <a href="#">Datenschutzrichtlinien</a> zu. Zu unserem gegenseitigen Schutz l&auml;sst Zwish deine Account-Daten von Dienstleistern analysieren, um eventuellen <a href="#">Betrug</a> auszuschliessen. Weiter Informationen findest du in unserer <a href="#">Datenschutzrichtlinien</a>.</span>
</nav>


<?
if($id != "register" ) {
echo "<div class=\"video_wrapper\">
<div class=\"video_blue\">&nbsp;</div>
<video autoplay=\"\" muted=\"\" loop=\"\" poster=\"tools/stock/zwish-hero-min.jpg\" preload=\"auto\" id=\"zwish-video\" class=\"zwish-video\">
  <source src=\"tools/stock/zwish-commercial.mp4\" type=\"video/mp4\">
  <source src=\"tools/stock/zwish-commercial.ogv\" type=\"video/ogg\">
  <source src=\"tools/stock/zwish-commercial.webm\" type=\"video/webm\">
</video>
</div>";

} else {
echo "<div class=\"video_wrapper\" style=\"background-image:url(tools/stock/zwish-hero-min.jpg);\">
&nbsp;</div>";
}


if($id == "register"){
echo "<a href=\"index.php\"><div  class=\"top_reg\">&nbsp;</div><header>
  <img src=\"tools/icons/logo.png\" alt=\"\">
  </header></a>";
} else {
  echo "<header>
  <img src=\"tools/icons/logo.png\" alt=\"\">
  </header>";
}

?>

<article class="home_top">
  <span class="slogan1">Mehr Singles, die dir gefallen k&ouml;nnten.</span><br><br>
  <span class="slogan2">38 000 000 Singles weltweit<br>und 3 Millionen gesendete Nachrichten pro Tag.</span>

</article>
    
    
<footer>
  <img src="tools/icons/home_footer.png" alt="">
</footer>
    
<?
if($id == "register"){
  echo "<div class=\"registerbox\" id=\"upload\" onclick=\"document.getElementById('upload').style.display = 'none'; document.getElementById('upload_popup').style.display = 'none';\"></div>
  <div class=\"registerbox_popup\" id=\"upload_popup\">
  </div>";
}

if($_POST["email"]) echo "<input type=\"hidden\" id=\"emailbox\" value=\"".$_POST["email"]."\">";
?>
  
  
  

  
  
  
  
  
  
</body>
</html>