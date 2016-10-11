document.createElement("header");
document.createElement("nav");
document.createElement("section");
document.createElement("article");
document.createElement("footer");

function hide(id) {
	for(i=0; i< arguments.length; i++) { 
		document.getElementById(arguments[i]).style.display = 'none';
	}
}

function show(id) {
	for(i=0; i< arguments.length; i++) { 
		document.getElementById(arguments[i]).style.display = 'block';
	}
}



function delay(step) {
	var popup = document.getElementById('upload_popup');
	
		var steps = ["<div class=\"registerbox_body\"><h1>Start</h1><div class=\"registerbox_body_box\"><h2>Stadt oder PLZ</h2><input type=\"text\" placeholder=\"Beispiel: Bern oder 3003\" autocomplete=\"off\"><br><input type=\"button\" value=\"Weiter\" onclick=\"upload(1, 600)\"></div></div>",
					 
				 "<div class=\"registerbox_body\"><h1>Dein Foto</h1><div class=\"registerbox_body_box\">So sehen dich Nutzer auf Zoosk. Tipps:<br><ul><li>Du musst klar erkennbar sein.</li><li>Dein Foto sollte nur dich zeigen.</li><li>Geh an einen hellen Ort.</li></ul><br><br><input type=\"button\" id=\"upload_pic\" value=\"Foto hochladen\" class=\"button_grey\"><br><input type=\"file\" onclick=\"setTimeout(function () { document.getElementById('upload_pic').value='&#10003;';}, 2000);\" onmouseover=\"document.getElementById('upload_pic').className = 'button_grey_hover';\" onmouseout=\"document.getElementById('upload_pic').className = 'button_grey';\"><input type=\"button\" value=\"Von Facebook hochladen\" class=\"button_fick\"><input type=\"button\" value=\"Von Google+ hochladen\" class=\"button_gp\"><br><input type=\"button\" value=\"Weiter\" onclick=\"upload(2, 2700)\"></div></div>",
				 
				 "<div class=\"registerbox_body\"><h1>&Uuml;ber dich</h1><div class=\"registerbox_body_box\"><h2>Was ist dein K&ouml;rperbau?</h2><select><option hidden=\"hidden\">K&ouml;rperbau asuw&auml;hlen</option><option>Durchtrainiert</option><option>Sportlich</option><option>Schlank</option><option>Kurvig</option></select><br><br><h2>Hast du Kinder?</h2><select><option hidden=\"hidden\">Option ausw&auml;hlen</option><option>Ja</option><option>Nein</option></select><br><br><h2>Welche Ausbildung hast du abgeschlossen?</h2><select><option hidden=\"hidden\">Ausbildung asuw&auml;hlen</option><option>Hochschulabschluss</option><option>Ausbildung/Lehre</option><option>Andere</option><option>Keine</option></select><br><br><h2>Was suchst du?</h2><select><option hidden=\"hidden\">Option asuw&auml;hlen</option><option>Flirt</option><option>Beziehung</option><option>Freundschaft</option></select><br><br><input type=\"button\" value=\"Weiter\" onclick=\"upload(3, 300)\"></div></div>",
				 
				 "<div class=\"registerbox_body\"><h1>&Uuml;ber dich</h1><div class=\"registerbox_body_box\"><h2>Wie gross bist du?</h2><input type=\"text\" placeholder=\"cm\" autocomplete=\"off\"><br><br><h2>Rauchst du?</h2><select><option>Nein</option><option>Ja</option><option>Ja, nur draussen</option></select><br><br><input type=\"button\" value=\"Weiter\" onclick=\"upload(4, 600)\"></div></div>",
				 
				 "<div class=\"registerbox_body\"><h1>Fast geschafft!</h1><div class=\"registerbox_body_box\">Eine E-Mail mit einem Link zu Aktivierung des Kontos wurde an "+ document.getElementById('emailbox').value +" gesendet.<br><br><input type=\"button\" value=\"Zur E-Mail\" class=\"button_grey\" onclick=\"window.location.href='http://www.mocksites.ch/websites/zwish_email/index.php';\"><br><br><br>"+ document.getElementById('emailbox').value +"  ist nicht deine E-Mailadresse?<br><a href=\"#\">Emailadresse &auml;ndern</a><br><br>Du findest die E-Mail nicht im Posteingang oder Spam-Ordner?<br><a href=\"#\">Email erneut senden</a><br><br><hr><center><h1>Oder</h1></center><br><br><input type=\"button\" value=\"Mit Facebook best&auml;tigen\" class=\"button_fick\"><input type=\"button\" value=\"Mit Goolge verbinden\" class=\"button_gp\"></div></div>"
				
				];
	
	if (step <=1) {
		header = "<div class=\"registerbox_head\"><img src=\"tools/icons/popup_stat_"+(step+1)+".png\" alt=\"\"></div>";
	} else {
		header = "<div class=\"registerbox_head\"><img src=\"tools/icons/popup_stat_3.png\" alt=\"\"></div> ";
	}
	popup.innerHTML = header+steps[step];
}

function upload(step, time) {
	document.getElementById('upload').style.display = "block";
	document.getElementById('upload_popup').style.display = "block";
	document.getElementById('upload_popup').innerHTML = "<div class=\"registerbox_head\"><img src=\"tools/icons/loading.gif\" alt=\"\"></div><div class=\"registerbox_body\"><h1>Wird geladen...</h1></div>";
	setTimeout(function () { delay(step); }, time);
}