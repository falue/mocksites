var adDiv;

function initEB() {
    if (!EB.isInitialized()) {
        EB.addEventListener(EBG.EventName.EB_INITIALIZED, startAd);
    } else {
        startAd();
    }
}

function startAd() {
    adDiv = document.getElementById("ad");
	animation();
    addEventListeners();
}

function addEventListeners() {
    document.getElementById("ad").addEventListener("click", clickthrough);
}

function clickthrough() {
    EB.clickthrough();
}

//var tl;
//, onComplete: clickAnim
function animation(){
	tl = new TimelineLite();
	Ftl = new TimelineLite();
	Ftl.to(text1, 1,{opacity: 1});
	Ftl.to(text2, 1,{opacity: 1});
	tl.to(schmetterling, .001,{opacity: 1, onComplete: clickAnim});
	tl.to(schmetterling, 4, {rotation:360, transformOrigin:"30px -100px", ease:Linear.easeNone, repeat: 1000000});
}

function clickAnim(){
	Ctl = new TimelineLite();
	Ctl.to(pfeil, 1, {css:{marginLeft:-116, marginTop: 543,opacity: 1},onComplete:clickBox});
	Ctl.to(pfeil, .1,{delay: .4, opacity:0, onComplete: resetClick});
	
	Ftl.to(text2, .5,{delay: 2, opacity: 0});
	Ftl.to(text1, .5,{opacity: 0});
	setInterval(function(){ 
		Ctl.restart();
		Ftl.restart();
	}, 5000);
}
function clickBox(){
	document.getElementById("box").style.WebkitFilter="drop-shadow(0px 0px 4px rgba(243, 247, 211, 1))";
	document.getElementById("klicken").style.WebkitFilter="drop-shadow(0px 0px 4px rgba(243, 247, 211, 1))";
}
function resetClick(){
	document.getElementById("box").style.WebkitFilter = "drop-shadow(0px 0px 0px rgba(255,255,255,0.80))";
	document.getElementById("klicken").style.WebkitFilter = "drop-shadow(0px 0px 0px rgba(255,255,255,0.80))";
}


window.addEventListener("load", initEB);
