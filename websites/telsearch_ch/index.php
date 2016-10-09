<!DOCTYPE html>
<head>
<title>Telefonbuch 2.0</title>
<link rel="stylesheet" type="text/css" href="tools/stylesheet.css" />
<script src="tools/javascript.js"></script>

<!-- ISO-8859-1 -->
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">

<!-- favicon -->
<!-- <link rel="shortcut icon" type="image/x-icon" href="favicon.ico" /> -->

</head>
<body>
  <header>
    
    <div class="logo" onclick="window.location.href='index.php';"><img src="tools/logo.png" alt=""> Telefonsuche</div>
    <a href="#">Telefonbuch</a>
    <a href="#">Wetter</a>
    <a href="#">Karte / Route</a>
    <a href="#">Fahrplan</a>
    <a href="#">TV</a>
    <a href="#">Kino</a>
    
    
    <div class="search">
      <div class="result_label">
        <div class="result_count" id="result_count">3'718'941 EINTR&Auml;GE</div>
        <div class="result_bar" id="result_bar">&nbsp;</div>
      </div>
      <form action="index.php" method="GET">
      <input type="text" id="wer" name="wer" placeholder="Wer/Was/Telefonnummer" onkeyup="count(865788);" value="<? echo $_GET["wer"]; ?>" autocomplete="off">
      <input type="text" id="wo" name="wo" placeholder="Wo" onkeyup="count(26121);" value="<? echo $_GET["wo"]; ?>" autocomplete="off">
      <label><input type="checkbox" checked="checked"> Privat</label>
      <label><input type="checkbox" checked="checked"> Firma</label>
      <input type="submit" id="button_search" value="Suchen">
      </form>
      <div class="erweitert">Erweiterte Suche <img src="tools/down.png" alt=""></div>
    </div>
  </header>
  



  <?php
  if(isset($_GET["wer"])) {   
    echo "<article id=\"results\" class=\"results\">
    1 EINTRAG F&Uuml;R '".strtoupper($_GET["wer"])."' IN '".strtoupper($_GET["wo"])."':
    <hr>
    <div class=\"result\">
      <img src=\"tools/person.png\" alt=\"a\" class=\"result_img\">
      <h1>Nina Galli</h1>
      Chaumontweg 34<br>
      3030 Bern<br>
      <h1>031 972 13 77*</h1>
      <div class=\"details\"><input type=\"button\" value=\"Details\"></div>
    </div>
    <div class=\"result\">
      <img src=\"tools/person.png\" alt=\"a\" class=\"result_img\">
      <h1>Nina & Ernst Kalberer</h1>
      Chaumontweg 203<br>
      3030 Bern<br>
      <h1>031 973 16 08*</h1>
      <div class=\"details\"><input type=\"button\" value=\"Details\"></div>
    </div>

    <div class=\"korr\">
      Sie k&ouml;nnen einen bestehenden <a href=\"#\">Eintrag korrigieren</a>, einen <a href=\"#\">Privateintrag erfassen</a> oder <a href=\"#\">Firmen/Beh&ouml;rdeneintrag erfassen</a>.
    </div>
    </article>
    <div class=\"map\">&nbsp;</div>";
  } else {
    echo "<img src=\"tools/top.png\" alt=\"\" class=\"results\">";
  }
?>  




</body>
</html>