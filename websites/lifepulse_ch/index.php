<!DOCTYPE html>
<head>
<title>LifePulse - Tagebuch</title>

<!-- ISO-8859-1 -->
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">

<!-- favicon -->
<link rel="shortcut icon" type="image/x-icon" href="tools/favicon.png" />

	<link rel="stylesheet" type="text/css" href="tools/stylesheet.css" />
	<link rel="stylesheet" type="text/css" href="tools/graph.css" />

</head>

<body>

<header>
  <div class="nav_top">
    <a href="#">Life Pulse</a>
    <a href="#">Updates</a>
    <a href="#">lifepulse.com</a>
  </div>

  <div class="nav">
    <img src="tools/logo.jpg" alt="" class="logo">
    <a href="#">Feed</a> |
    <a href="#">Erforsche</a> |
    <a href="index.php" class="chosen">Tagebuch</a> |
    <a href="#">Fortschritt</a> |
    <a href="#">Community</a> |
    <a href="#">Programme</a>



  </div>

  <div class="nav_right">
      <a href="#"><img src="tools/fav.png" alt=""></a>
      <a href="#"><img src="tools/notes.png" alt=""></a>
      <a href="#">Runner92&emsp;<div>&nbsp;</div>&emsp;&emsp;&emsp;&emsp;&emsp;</a>
  </div>

  <div class="nav_sub">
    <a href="index.php">Tagebuch</a> |
    <a href="#">Erholungsstatus</a> |
    <a href="#">Balance</a>
  </div>

</header>


<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);


if(!isset($_GET["s"])) {
  echo "<article id=\"calendar\">";
  /* Set the default timezone */
  date_default_timezone_set("Europe/Zurich");

  /* Set the date */
  #$date = strtotime(date("Y-m-d"));
  $date = strtotime(date(file_get_contents("tools/today.txt")));

  $day = date('d', $date);
  $month = date('m', $date);
  $year = date('Y', $date);
  $firstDay = mktime(0,0,0,$month, 1, $year);
  $title = strftime('%B', $firstDay);
  $dayOfWeek = date('D', $firstDay);
  $daysInMonth = date('t', mktime(0,0,0,$month, $year));
  /*Get the name of the week days */
  $timestamp = strtotime('next Monday');
  $weekDays = array();
  for ($i = 0; $i < 7; $i++) {
      $weekDays[] = strftime('%a', $timestamp);
      $timestamp = strtotime('+1 day', $timestamp);
  }
  $blank = date('w', strtotime("{$year}-{$month}-7"));

  echo "<h1>tagebuch $title $year</h1> &larrb; &rarrb;
  <br><br>
  <table>
  <tr>";
  foreach($weekDays as $key => $weekDay) {
    echo "<td class=\"text-center\">$weekDay</td>";
  }

  echo "</tr><tr>";

  for($i = 0; $i < $blank; $i++) {
    echo "<td class=\"noday\"></td>";
  }

  for($i = 1; $i <= $daysInMonth; $i++) {
    if($day == $i) {
    echo "<td class=\"today\" onclick=\"upload(0, 0, ".strtotime("{$year}-{$month}-$i").");\" onmouseover=\"show('day_$i');\" onmouseout=\"hide('day_$i');\"><strong>$i</strong><br><br><span id=\"day_$i\" class=\"add\">Daten hochladen $year-$month-$i</span></td>";
    } else {
      $data = $i == 2 || $i == 3 || $i == 5 || $i == 6 || $i == 7 || $i == 10 || $i == 12 || $i == 15 || $i == 16 || $i == 17 ? "style=\"background-image:url('tools/graph.png');\"" : "";
    echo "<td class=\"day\" onclick=\"upload(0, 0, ".strtotime("{$year}-{$month}-$i").");\" onmouseover=\"show('day_$i');\" onmouseout=\"hide('day_$i');\" $data>$i<br><br><span id=\"day_$i\" class=\"add\">Daten hochladen $year-$month-$i</span></td>";
    }
    if(($i + $blank) % 7 == 0) {
      echo "</tr><tr>";
    }
  }

  for($i = 0; ($i + $blank + $daysInMonth) % 7 != 0; $i++) {
    echo "<td class=\"noday\"></td>";
  }

  echo "</tr>
  </table>
   <br>
  <div class=\"training\">
  <h1>Training Load:</h1><br>

  <span>Leicht 0-6 Stunden</span>
  <span>Angemessen 7-12 Stunden</span>
  <span>Fordernd 13-24 Stunden</span>
  <span>Sehr fordernd 25-48 Stunden</span>
  <span>Extrem Mehr als 48 Stunden</span>
  </div>

  <div class=\"upload\" id=\"upload\" onclick=\"document.getElementById('upload').style.display = 'none'; document.getElementById('upload_popup').style.display = 'none';\"></div>
  <div class=\"upload_popup\" id=\"upload_popup\"></div>

  <br><br>
    <img src=\"tools/footer1.png\" alt=\"\"><br>
    <img src=\"tools/footer2.png\" alt=\"\"><br><br>
  </article>";

 } else {
 echo "<article id=\"graph_wrapper\">
 <h1>Uploaded data: ".gmdate("d. m. Y", $_GET["s"]+(60*60*12))."</h1><br>
 <img src=\"tools/werte_pulse.jpg\" alt=\"\" class=\"border\"><br>
 <div class=\"route\" id=\"route\">&nbsp;<div>Gef&auml;llt dir die Route? F&uuml;ge sie zu deinen Favoriten hinzu!<img src=\"tools/karte_tools.png\" alt=\"\"></div></div>

  <a href=\"javascript:makechart(1);\"><div class=\"button\">".gmdate("d. m. Y", $_GET["s"]+24*60*60)."</div></a>
  <a href=\"javascript:makechart(2);\"><div class=\"button\">".gmdate("d. m. Y", $_GET["s"])."</div></a>
  <a href=\"javascript:makechart(3);\"><div class=\"button\">".gmdate("d. m. Y", $_GET["s"]-1*24*60*60)."</div></a>
  <a href=\"javascript:makechart(4);\"><div class=\"button\">".gmdate("d. m. Y", $_GET["s"]-2*24*60*60)."</div></a>
  <br>

  <div class='wrapper' >
	<canvas id='graph' class='graph' height=\"400px\" width=\"1600px\"></canvas>
  </div>
  <img src=\"tools/anzeige_pulse.png\" alt=\"\" class=\"border\">

  <script src=\"tools/chart.min.js\"></script>
  <script src=\"tools/graph.js\"></script>

  <br><br><br>
  <img src=\"tools/footer1.png\" alt=\"\"><br>
  <img src=\"tools/footer2.png\" alt=\"\"><br>
  </article>

  <nav id=\"feelings\"><img src=\"tools/feelings.png\" alt=\"\"><div class=\"button\" onclick=\"hide('feelings');\">Jetzt nicht</div><div class=\"button\">Speichern</div></nav>";

 }

 ?>





<footer> &copy; LIFEPULSE: Trainingspuls: Berechnen Sie Ihre optimale Herzfrequenz - LIFEPULSE<br>
</footer>

<script src="tools/javascript.js"></script>


</body>
</html>
