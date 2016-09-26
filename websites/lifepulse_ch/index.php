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
      <a href="#">Jonas&emsp;<div>&nbsp;</div>&emsp;&emsp;&emsp;&emsp;&emsp;</a>
  </div>
  
  <div class="nav_sub">
    <a href="index.php">Tagebuch</a> |
    <a href="#">Erholungsstatus</a> |
    <a href="#">Balance</a>
  </div>

</header>


<?php
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
  $daysInMonth = cal_days_in_month(0, $month, $year);
  /* Get the name of the week days */
  $timestamp = strtotime('next Sunday');
  $weekDays = array();
  for ($i = 0; $i < 7; $i++) {
      $weekDays[] = strftime('%a', $timestamp);
      $timestamp = strtotime('+1 day', $timestamp);
  }
  $blank = date('w', strtotime("{$year}-{$month}-01"));
  
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
    echo "<td class=\"today\" onclick=\"upload(0, 0, $date);\" onmouseover=\"show('day_$i');\" onmouseout=\"hide('day_$i');\"><strong>$i</strong><br><br><span id=\"day_$i\" class=\"add\">Daten hochladen</span></td>";
    } else {
      $data = $i == 2 || $i == 3 || $i == 5 || $i == 6 || $i == 7 || $i == 10 || $i == 12 || $i == 15 || $i == 16 || $i == 17 ? "style=\"background-image:url('tools/graph.png');\"" : "";
    echo "<td class=\"day\" onclick=\"upload(0, 0, ".strtotime("{$year}-{$month}-$i").");\" onmouseover=\"show('day_$i');\" onmouseout=\"hide('day_$i');\" $data>$i<br><br><span id=\"day_$i\" class=\"add\">Daten hochladen</span></td>";
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
 <h1>Uploaded data: ".gmdate("d. m. Y", $_GET["s"])."</h1><br>
 
  <div class='wrapper' >
	<canvas id='graph' class='graph' height=\"400px\" width=\"1600px\"></canvas>
  </div>
  <br>
  <a href=\"javascript:makechart(1);\"><span class=\"change_map\">".gmdate("d. m. Y", $_GET["s"])."</span></a>
  <a href=\"javascript:makechart(2);\"><span class=\"change_map\">".gmdate("d. m. Y", $_GET["s"]-24*60*60)."</span></a>
  <a href=\"javascript:makechart(3);\"><span class=\"change_map\">".gmdate("d. m. Y", $_GET["s"]-2*24*60*60)."</span></a>
  <a href=\"javascript:makechart(1);\"><span class=\"change_map\">".gmdate("d. m. Y", $_GET["s"]-3*24*60*60)."</span></a>
  <span class=\"change_map\">&hellip;</span>
  
  <script src=\"tools/chart.min.js\"></script>
  <script src=\"tools/graph.js\"></script>
  
  <br><br><br>
  <img src=\"tools/footer1.png\" alt=\"\"><br>
  <img src=\"tools/footer2.png\" alt=\"\"><br>
  </article>";

 }
 
 ?>
 
 
  <nav><img src="tools/feelings.png" alt=""></nav>



<footer> &copy; LIFEPULSE: Trainingspuls: Berechnen Sie Ihre optimale Herzfrequenz - LIFEPULSE<br><br>

Fotocredits: Nico Kalozenski, Blacksheep, Tourismuszentrale Rostock Warnemande, 123RF, FIT FOR FUN (10), Thinkstock (2), istockphotos (2), Getty Images (3), Sebastian Hanel/Fit For Fun, Gunnar Ebmeyer / FIT FOR FUN, Lloyd Images/Oman Sail, lucky7even.de, Fitnessmodel-Contest 2013, Cover Media (3), Alpinschule Innsbruck, Mike Hecker/Fit For Fun, Daniel Cramer/Fit For Fun, ddp-images, iStockphoto, Dirk Schmidt/FFF (2), Dirk Schmidt/FIT FOR FUN, Corbis (3), Zespri
</footer>

<script src="tools/javascript.js"></script>


</body>
</html>