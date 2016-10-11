<!DOCTYPE html>
<head>
  <?
  
  if($_GET["p"] == null or $_GET["p"] == "Runner92" ) {
    $browsertitle = " - Dein Profil Runner92";
    $id = "Runner92";
  } elseif($_GET["p"] == "Angelique94" ) {
    $browsertitle = " - Profilansicht Angelique94";
    $id = "Angelique94";
  }
  
  if($_GET["s"] == "email") {
    $browsertitle = " - E-Mailadresse best&auml;tigt";
	$email_confirmed = true;
  } elseif($_GET["s"] == "back") {
    $browsertitle = " - Welcome back!";
	$welcome_back = true;
  }
  
  $online = isset($_GET["online"]) ? true : false;
  
  ?>
<title>Zwish.com<? echo $browsertitle; ?></title>
<link rel="stylesheet" type="text/css" href="tools/stylesheet.css" />
<script src="tools/javascript.js"></script>

<!-- ISO-8859-1 -->
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">

<!-- favicon -->
<link rel="icon" type="image/png" href="tools/icons/favicon.png">
  
</head>
<body>
	
	<?
	if($email_confirmed ) $class = "email";
    echo "<header class=\"$class\">
	  <div class=\"header_bar\"><a href=\"home.php?p=Runner92\">
      <img src=\"tools/icons/logo_big.png\" alt=\"\" class=\"logo\"></a>
		<img src=\"tools/icons/note.png\" alt=\"\">";
		
		  if($online) {
			echo "<span class=\"note-counter\">!</span>";
		  }
		  if($email_confirmed ) {
			echo "<br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><center><h1>Danke, dass du deine E-Mail-Adresse best&auml;tigt hast.</h1><br><h2>Du kannst dich ab jetzt mit der von dir best&auml;tigten E-Mail-Adresse auf Zwish.com anmelden.</h2><br><br><hr style=\"background-color:rgba(255,255,255,0.2);\"><br><a href=\"home.php?s=back\"><div style=\"display:inline-box; border-radius:4px; height:30px; border:1px solid rgba(255,255,255,0.2);padding-top: 8px; width:200px;\">Hier gehts los!</div></a></center>";
		  }
		echo "<div class=\"admin\"><div style=\"background-image:url('tools/users/runner92.jpg');\" class=\"imgframe imgframe_rot1\">&nbsp;</div><b>Zwish-Mitglied</b><br>24, Bern</div>
	  </div>
    </header>
	<nav>";
	
	if($welcome_back) {
		echo " <div class=\"window\" id=\"window\" onclick=\"document.getElementById('window').style.display = 'none'; document.getElementById('window_popup').style.display = 'none';\">&nbsp;</div>
	<div class=\"window_popup\" id=\"window_popup\">
	<div class=\"window_body\"><h1>Willkommen auf Zwish!</h1><div class=\"window_body_box\">Wir haben etwas nachgeforscht und einige Singles gefunden, die dir gefallen k&ouml;nnten.<center><a href=\"home.php\"><div style=\"display:inline-box; border-radius:4px; height:30px; border:1px solid rgba(255,255,255,0.2);padding-top: 8px; width:200px;\">Jetzt ansehen!</div></a></center></div>
	</div>
	</div>";
	  }

echo $id == "Runner92" ? "<div class=\"navigation\" style=\"background-image: url(tools/icons/nav_home.png);\">" : "<div class=\"navigation\" style=\"background-image: url(tools/icons/nav.png);\">";
?>&nbsp;
	  </div>
	  <div class="premium">&nbsp;</div>
	  <span class="legal">&#9872; Deutsch</span>
	  <br><br>

    <span class="legal">Datenschutz</span><span class="legal_red">*</span> &middot;
	<span class="legal">AGB</span> &middot;
	<span class="legal">Cookies</span><span class="legal_red">*</span> &middot;
	<span class="legal">Online-Sicherheit</span> &middot; 
	<span class="legal_red">* K&uuml;rzlich aktualisiert</span>
	  <hr>
		<span class="legal_sub">
		&copy; 2007-2016 Zwish, Inc. Alle Rechte vorbehalten.
		</span>
<?
if(!$online) {
        echo "<br><br><a href=\"home.php?p=Angelique94&online=true\" style=\"color:rgba(0,0,0,0);\" onmouseover=\"this.style.color='grey';\" onmouseout=\"this.style.color='rgba(0,0,0,0)';\">Angelique94 online schalten</a>";
      } else {
        echo "<br><br><a href=\"home.php?p=Angelique94\" style=\"color:rgba(0,0,0,0);\" onmouseover=\"this.style.color='grey';\" onmouseout=\"this.style.color='rgba(0,0,0,0)';\">Angelique94 offline schalten</a>
		<br><br><a href=\"javascript:chatstart();\" style=\"color:rgba(0,0,0,0);\" onmouseover=\"this.style.color='grey';\" onmouseout=\"this.style.color='rgba(0,0,0,0)';\">Chat starten</a>";
	  }
	  
	echo "</nav>";
	
    if($id == "Runner92") {
	  
      echo "<article>
	  <div class=\"main_profile\">
		<div class=\"profile_head\"><h3>Profil</h3>$id</div>
		<div class=\"profile_filter\" style=\"padding-top:8px;\"><span>Profil ansehen</span><span style=\"color:#bbb;\">|</span><span>Profil bearbeiten</span><span style=\"color:#bbb;\">|</span><span>Statistik</span><span style=\"color:#bbb;\">|</span><span>Logout</span></div>
	  	  <div style=\"background-image:url(tools/users/runner92.jpg)\" class=\"imgframe imgframe_rot1 imgframe_user\">&nbsp;</div>

		
	  
	  <div class=\"profile_user_home\"><h3>6 Vorschl&auml;ge f&uuml;r dich!</h3><br>

	  

	  
	  <div>
	  <a href=\"#\">
	  <img src=\"tools/users/angelique94_1.png\" alt=\"\"><br><strong>
	  Moon_light22</strong></a><br>22
	  </div>
	  
	  <div>
	  <a href=\"home.php?p=Angelique94\">
	  <img src=\"tools/users/angelique94_preview.jpg\" alt=\"\"><br><strong>
	  Angelique94</strong></a><br>22
	  </div>
	  
	  <div>
	  <a href=\"#\">
	  <img src=\"tools/users/angelique94_1.png\" alt=\"\"><br><strong>
	  debbi@su77</strong></a><br>39
	  </div>
	  
	  <br><br>
	  
	  <div>
	  <a href=\"#\">
	  <img src=\"tools/users/angelique94_1.png\" alt=\"\"><br><strong>
	  queenOFdragons</strong></a><br>22
	  </div>
	  
	  <div>
	  <a href=\"#\">
	  <img src=\"tools/users/angelique94_1.png\" alt=\"\"><br><strong>
	  M&auml;uschen97</strong></a><br>19
	  </div>
	  
	  <div>
	  <a href=\"#\">
	  <img src=\"tools/users/angelique94_1.png\" alt=\"\"><br><strong>
	  Bamboo_<3</strong></a><br>31
	  </div>
	  
	  
	  </div>
	  <div class=\"profile_more\" style=\"padding: 10px 2.32558% 17px 2.32558%; text-align:center;\">Kostenlosen MEGA FLIRT senden!<br>&#10145; Mehr<br><br></div>
	  
	  </div>
	  
	  <br><br>
	  
	  </article>";
    } elseif($id == "Angelique94") {
      echo "<article>
	  <div class=\"main_profile\">
	  <div class=\"profile_head\" style=\"background-image:url(tools/icons/profile_head.png);\">&nbsp;</div>
	  <div class=\"profile_filter\" style=\"background-image:url(tools/icons/filter.png);\">&nbsp;</div>
	  
	  <div style=\"background-image:url(tools/users/angelique94.jpg)\" class=\"imgframe imgframe_rot1\">&nbsp;</div>
		<div class=\"imgframe imgframe_rot2\">&nbsp;</div>
		<div class=\"imgframe imgframe_rot3\">&nbsp;</div>";
	  if($online) {
		echo "<div class=\"online green\">jetzt online</div>";
	  } else {
		echo "<div class=\"online yellow\">offline</div>";
	  }
	  echo "<div class=\"profile_user\">
	  <div>22</div><div>Bern</div><div>$id</div><br>
	  <div class=\"small\">Jahre alt</div><div class=\"small\">(21 km)</div><div class=\"small\">172 cm</div><br>
	  </div>
	  
	  <div class=\"profile_chat\">";
	  if($online) {
	  echo "<div class=\"chatwindow\">
		<div id=\"chatwindow\" class=\"chatwindow_content\">
		  <div class=\"speech_left left\">Hey Runner92, Ich bin eine begeisterte Bikerin und arbeite wie du in der Gastronomie. Zeigst du mir dein privates Album?</div><br>
		</div>
	  </div>
	  <div class=\"writing\" id=\"type\">Angelique94 schreibt&hellip;</div>
	  <form action=\"javascript:chat_submit();\">
	  <input type=\"text\" placeholder=\"Tippen zum chatten&hellip;\" value=\"\" onkeydown=\"show('chat_emoji','chat_submit');\" maxlength=\"42\" id=\"chat_input\" autocomplete=\"off\">
	  <input type=\"button\" value=\"&#9786;\" class=\"chat_emoji\" id=\"chat_emoji\">
	  <input type=\"submit\" value=\"&#10145;\" class=\"chat_submit\" id=\"chat_submit\">
	  </form>
	  ";
	  } else {
		echo "<strong>Sternzeichen:</strong> L&ouml;we<br>
		<strong>Gr&ouml;sse:</strong> 164 cm<br>
		<strong>Geschlecht:</strong> Weiblich<br>
		<strong>Herkunft:</strong> Latina<br>
		<strong>K&ouml;rperbau:</strong> Schlank<br>
		<strong>Familienstand:</strong> Ledig<br>
		<strong>Kinder:</strong> Keine Kinder<br>
		<strong>Ausbildung:</strong> Ausbildung/Lehre<br>
		<strong>Religion:</strong> Christin - Katholisch<br>
		<strong>Lifestyle:</strong> Raucht nicht
		<br><br><br><br><br><br><br><br><br>
		<ul><li><a href=\"#\">Anstupsen</a></li>
		<li><a href=\"#\">Private Nachricht schreiben</a></li>
		</ul>";
	  }
	  echo "</div><div class=\"profile_more\" onclick=\"show('more_images'); show('more_text'); document.getElementById('more').innerHTML='';\" id=\"more\">Komplettes Profil &#9662;</div>
	  <div class=\"profile_more_images\" id=\"more_images\">
	  <img src=\"tools/users/angelique94_1.png\" alt=\"\">
	  <img src=\"tools/users/angelique94_2.png\" alt=\"\">
	  <img src=\"tools/users/angelique94_3.png\" alt=\"\">
	  <img src=\"tools/users/angelique94_4.png\" alt=\"\">
	  <img src=\"tools/users/angelique94_5.png\" alt=\"\"><br><br>

	  </div>
	  <div class=\"profile_more_text\" id=\"more_text\">
	  <h3>Allgemein</h3>
	  <hr>
	  <div>
		<strong>Sternzeichen:</strong> L&ouml;we<br>
		<strong>Gr&ouml;sse:</strong> 164 cm<br>
		<strong>Geschlecht:</strong> Weiblich<br>
		<strong>Herkunft:</strong> Latina<br>
		<strong>K&ouml;rperbau:</strong> Schlank<br>
	  </div><div>
		<strong>Familienstand:</strong> Ledig<br>
		<strong>Kinder:</strong> Keine Kinder<br>
		<strong>Ausbildung:</strong> Ausbildung/Lehre<br>
		<strong>Religion:</strong> Christin - Katholisch<br>
		<strong>Lifestyle:</strong> Raucht nicht<br>
	  </div>
	  </div>
	  </div>
	   
	  <footer>
		<img src=\"tools/icons/footer.png\" alt=\"\">
	  </footer>
	  
	  </article>
	  ";
      
    }
  ?>
  
  
  

    
  
  
  
  
  
  
</body>
</html>