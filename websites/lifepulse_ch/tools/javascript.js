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

function delay(step, date) {
	var popup = document.getElementById('upload_popup');
	
	var steps = ["<br><br>Please connect your watch&hellip;<br><input type=\"button\" value=\"Ok\" onclick=\"upload(1, 1800, "+date+")\">",
				 "<div class=\"heart\" id=\"heart\">&#10084;)))</div><span class=\"small\">Connected to '../PulsewatchJonas001-AC'</span><br><br><br><div class=\"result_label\" id=\"result_label\"><div class=\"result_bar\" id=\"result_bar\">&nbsp;</div><div class=\"result_count\" id=\"result_count\">0%</div></div>",
				 "<br><br>Data successful uploaded!<br><br><a href=\"index.php?s="+date+"\" id=\"okbutton\"><br><br><br><input type=\"button\" value=\"Ok\"></a>"
				
				];

	popup.innerHTML = "<h1>Add hartrates @ "+timeConverter(date)+"</h1>"+steps[step];
	
	if (step == 1){
		setTimeout(function () { inc_up(1, date); }, 1000);
	}
}

function upload(step, time, date) {
	document.getElementById('upload').style.display = "block";
	document.getElementById('upload_popup').style.display = "block";
	document.getElementById('upload_popup').innerHTML = "<h1>Add hartrates @ "+timeConverter(date)+"</h1><br><img src=\"tools/loading.gif\" alt=\"\"><br><br>";
	setTimeout(function () { delay(step, date); }, time);
}

function inc_up(step, date) {
	sleep_total = 7000;
	if (step <= 11) {
		if (step == 1) {
			load = "20%";
			sleep = sleep_total/10;
		} else if (step == 2) {
			load = "25%";
			sleep = sleep_total/19;
		} else if (step == 3) {
			load = "32%";
			sleep = sleep_total/8;
		} else if (step == 4) {
			load = "35%";
			sleep = sleep_total/100;
		} else if (step == 5) {
			load = "37%";
			sleep = sleep_total/100;
		} else if (step == 6) {
			load = "39%";
			sleep = sleep_total/4;
		} else if (step == 7) {
			load = "78%";
			sleep = sleep_total/50;
		} else if (step == 8) {
			load = "82%";
			sleep = sleep_total/25;
		} else if (step == 9) {
			load = "98%";
			sleep = sleep_total/5;
		} else if (step == 10) {
			load = "100%";
			sleep = sleep_total/100;
		} else if (step == 11) {
			load = "Finishing...";
			sleep = sleep_total/5;
		}
		
		document.getElementById('result_bar').style.width = load;
		document.getElementById('result_count').innerHTML = load;
		setTimeout(function () { inc_up(step+1, date); }, sleep);
	} else {
		document.getElementById('result_label').style.display = "none";
		/*document.getElementById('okbutton').style.display = "inline-block";*/
		upload(2, 500, date);
	}
}





function timeConverter(UNIX_timestamp){
  var a = new Date(UNIX_timestamp * 1000);
  var months = ['JAN','FEB','MAR','APR','MAY','JUN','JUL','AUG','SEP','OCT','NOV','DEC'];
  var year = a.getFullYear();
  var month = months[a.getMonth()];
  var date = a.getDate();
  var hour = a.getHours();
  var min = a.getMinutes();
  var sec = a.getSeconds();
  var time = date + '. ' + month + ' ' + year; /* + ' ' + hour + ':' + min + ':' + sec */
  return time;
}

