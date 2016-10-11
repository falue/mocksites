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

function chat(commit) {
	hide('type');
	var chatwindow = document.getElementById('chatwindow');
	if (commit == 1) {
		chatwindow.innerHTML = chatwindow.innerHTML+"<div class=\"speech_left left\">Hey Runner <img src=\"tools/icons/smiley_wink.png\" alt=\"\"></div><br>";
	} else if (commit == 2) {
		chatwindow.innerHTML = chatwindow.innerHTML+"<div class=\"speech_left\">wazzup...<img src=\"tools/icons/smiley.png\" alt=\"\">!?</div><br>";
	}
	chatwindow.scrollTop = chatwindow.scrollHeight;
}

function chat_submit() {
	var chat = document.getElementById('chat_input').value;
	if (chat) {
		document.getElementById('chat_input').value = '';
		var chatwindow = document.getElementById('chatwindow');
		chat = chat.replace(/:\)/g, "<img src=\"tools/icons/smiley.png\" alt=\":)\">");
		chat = chat.replace(/;\)/g, "<img src=\"tools/icons/smiley_wink.png\" alt=\";)\">");
		chatwindow.innerHTML = chatwindow.innerHTML+"<div style=\"text-align:right;\"><div class=\"speech_right right\">"+chat+"</div></div>";
		hide('chat_emoji','chat_submit');
		document.getElementById('chat_input').focus();
		chatwindow.scrollTop = chatwindow.scrollHeight;
	}
}

function typing() {
	show('type');
}

function chatstart() {
	var time_first = prompt("Anzahl Sekunden bis 1. Chatnachricht", "10") * 1000;
	var time_second = prompt("Verzoegerung zur 2. Chatnachricht", "5") * 1000;
	if (time_first != null && time_second != null ) {
		document.getElementById('chatwindow').innerHTML = '<div class=\"speech_left left\">Hey Runner92, Ich bin eine begeisterte Bikerin und arbeite wie du in der Gastronomie. Zeigst du mir dein privates Album?</div><br>';
		/*alert(time_first+" "+time_second);*/
		setTimeout(function () { typing(); }, time_first-1650);
		setTimeout(function () { chat(1); }, time_first);
		setTimeout(function () { typing(); }, +time_first + +time_second-1200);
		setTimeout(function () { chat(2); }, +time_first + +time_second);
	}
}