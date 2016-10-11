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

function swapmenu() {
  var status = document.getElementById('main').className;
  if (status == "home") {
    document.getElementById('main_footer').style.display = 'none';
    document.getElementById('homebuttons').style.display = 'none';
    document.getElementById('main_logo').style.display = 'none';
    document.getElementById('nav_gmail').style.display = 'none';
    document.getElementById('nav_images').style.display = 'none';
    document.getElementById('main').className = 'main'; 
    document.getElementById('logo_small').style.display = 'inline';
    document.getElementById('search_button').style.display = 'inline-block';    
  }
}


function prompt(str){

  if (str.length==0){
    document.getElementById("queue").style.display='none';
    document.getElementById("prompt").style.display='none';
    return;
  } else {
    document.getElementById("prompt").style.display='block';
    if (window.XMLHttpRequest){// code for IE7+, Firefox, Chrome, Opera, Safari
      xmlhttp=new XMLHttpRequest();
    } else {// code for IE6, IE5
      xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");}
      xmlhttp.onreadystatechange=function(){
      if (xmlhttp.readyState==4 && xmlhttp.status==200){
        if(xmlhttp.responseText != "null") {
          document.getElementById("prompt").innerHTML=xmlhttp.responseText;
        } else {
          document.getElementById("prompt").style.display = 'none';
        }
      }
    }
    xmlhttp.open("GET","tools/prompt.php?q="+str);
    xmlhttp.send();
  }
}



/*
document.onkeyup = function(e) { /* orig: onkeydown, aber prompt blieb stehen 
    if(e.keyCode == 13) {
      search(document.getElementById("search").value);
    }
};
*/
function search(str) {  
  document.getElementById('prompt').style.display = 'none';
  document.getElementById('queue').style.display = 'block';
  /*document.getElementById("results").innerHTML = "pressed enter:"+str+"!!!!";*/
  
  if (window.XMLHttpRequest){// code for IE7+, Firefox, Chrome, Opera, Safari
    xmlhttp=new XMLHttpRequest();
  } else {// code for IE6, IE5
    xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");}
    xmlhttp.onreadystatechange=function(){
    if (xmlhttp.readyState==4 && xmlhttp.status==200){
        document.getElementById("results").innerHTML=xmlhttp.responseText;

    }
  }
  xmlhttp.open("GET","tools/results.php?q="+str);
  xmlhttp.send(); 
}