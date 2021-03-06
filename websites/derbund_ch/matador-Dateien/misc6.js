var noSky = false;

//--------------------------------------------------------------------------------------------------------------------------------------------

/** v Staging
 * Function to check if we are on a Romand domain, to initialize
 * the correct language for the translation function
 */
function checkDomain() {
    documentDomain = document.domain;
    results = documentDomain.match(/lematin|tdg|24heures/gi); // 
    if (results) {
	return 'fr';
    }
    
    return 'de';
}

function setAdsOnLoad()
{
}

// Set the site language
var js_lang = checkDomain();

// Our translation hash
var translate = {
    "close" : {
	"de": "schliessen",
	"fr": "fermer"
    },
    "more galleries" : {
	"de": "weitere Bildstrecken",
	"fr": "Plus de galeries"
    },
    "Ads" : {
	"de": "Werbung",
	"fr": "Publicité"
    },
    "Google-Anzeigen" : {
	"de": "Google-Anzeigen",
	"fr": "Annonces Google"
    },
    "right now" : {
	"de": "gerade jetzt",
	"fr": "Annonces Google"
    },
    "one minute ago" : {
	"de": "vor einer Minute",
	"fr": "derni&egrave;re minute"
    },
    "minutes" : {
	"de": "Minuten",
	"fr": "minutes"
    },
    "hours" : {
	"de": "Stunden",
	"fr": "heures"
    },
    "1 hour" : {
	"de": "1 Stunde",
	"fr": "1 heure"
    },
    "yesterday" : {
	"de": "gestern",
	"fr": "hier"
    },
    "weeks" : {
	"de": "Wochen",
	"fr": "semaines"
    },
    "days" : {
	"de": "Tagen",
	"fr": "jours"
    },
    "months" : {
	"de": "Monaten",
	"fr": "mois"
    },
    "before" : {
	"de": "Vor",
	"fr": "depuis"
    },
    "Loading tweets.." : {
	"de": "Tweets werden geladen..",
	"fr": "Tweets sont charg&eacute;es.."
	},
    "Reply" : {
	"de": "Antworten",
	"fr": "R&eacute;pondre"
    },
    "Retweet" : {
	"de": "Retweeten",
	"fr": "Retweet"
    },
    "close" : {
	"de": "schliessen",
	"fr": "fermer"
    }
};

/**
 * The Translate function, returns the translated word depending on the site language.
 * If it does not find the word to translate it returns the word.
 */
function t (word) {
    if (translate[word]) {
	return translate[word][js_lang];
    }

    return word;
};

//--------------------------------------------------------------------------------------------------------------------------------------------

function oeffneVideoTVFenster (url) {
 fenster = window.open(url, "VideoTV", "location=no,menubar=no,resizable=no,status=no,toolbar=no,width=1024,height=810,left=0,top=0");
 fenster.focus();
}

//--------------------------------------------------------------------------------------------------------------------------------------------

function oeffneFenster (sURL, sName, sParameter) {
 fenster = window.open(sURL, sName, sParameter);
 fenster.focus();
}

//--------------------------------------------------------------------------------------------------------------------------------------------

function oeffneStoryerfassen(sURL, sName, sParameter){
  MeinFenster = window.open(sURL,sName,'width=1024,height=940,scrollbars=1,toolbar=no,location=no,directories=no,status=no,menubar=yes,resizable=yes,copyhistory=no,status=yes');
  MeinFenster.focus();
}

//--------------------------------------------------------------------------------------------------------------------------------------------

function openURL(url)
{
	if (window.opener == null)
	{
		ListFenster = window.open(url,'Liste');
		ListFenster.focus();
	}
	else
	{
		window.opener.focus();
	}
}

//--------------------------------------------------------------------------------------------------------------------------------------------

function getFlashMovie(movieName) { var isIE = navigator.appName.indexOf("Microsoft") != -1; return (isIE) ? window[movieName] : document[movieName]; }

//--------------------------------------------------------------------------------------------------------------------------------------------

function readCookie(name) {
	var nameEQ = name + "=";
	var ca = document.cookie.split(';');
	for(var i=0;i < ca.length;i++) {
		var c = ca[i];
		while (c.charAt(0)==' ') c = c.substring(1,c.length);
		if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
	}
	return null;
}

//--------------------------------------------------------------------------------------------------------------------------------------------

function getURLParam(strParamName){
  var strReturn = "";
  var strHref = window.location.href;
  if ( strHref.indexOf("?") > -1 ){
    var strQueryString = strHref.substr(strHref.indexOf("?")).toLowerCase();
    var aQueryString = strQueryString.split("&");
    for ( var iParam = 0; iParam < aQueryString.length; iParam++ ){
      if (aQueryString[iParam].indexOf(strParamName.toLowerCase() + "=") > -1 ){
        var aParam = aQueryString[iParam].split("=");
        strReturn = aParam[1];
        break;
      }
    }
  }
  return unescape(strReturn);
}

//--------------------------------------------------------------------------------------------------------------------------------------------

function toggle_list (element)
{
	if (bListOpen)
	{
		bListOpen = false;
		getFlashMovie('videotv_front').show_previews(bListOpen);
		element.innerHTML = "Weitere Videos";
		getFlashMovie('videotv_front').set_pause(false);
		bListOpenFirstTime = false;
	}
	else
	{
		bListOpen = true;
		getFlashMovie('videotv_front').show_previews(bListOpen);
		element.innerHTML = "Zurück";
		if (! bListOpenFirstTime)
		{
			getFlashMovie('videotv_front').set_pause(true);
			bListOpenFirstTime = false;
		}
	}
}

//--------------------------------------------------------------------------------------------------------------------------------------------

function toggle_list_off ()
{
	var element = document.getElementById('frontbox_bottom_link1');
	element.innerHTML = "Weitere Videos";
	bListOpen = false;	
	bListOpenFirstTime = false;
}

//--------------------------------------------------------------------------------------------------------------------------------------------

function getBildstrecke(diashowID,pageID,preview,bil_pageforward,timestamp)
{
	var sChannelLocal = eval('sChannel_'+timestamp);

	$.ajax({
			   type: "GET",
			   dataType: "html",
			   url: "/zz_bildstrecke/bil_inline.html?werbe_uri=/"+sChannelLocal+"/",
			   data: bil_pageforward,
			   async: false,
			   error: function(){
  			 },
			   success: function(text){
					 var aQueryString = text.split("|&|");

			     $("#inlineGallery_"+timestamp+" .caption").fadeOut(50,function() { 
						$("#inlineGallery_"+timestamp+" .caption").html(aQueryString[1]).show(); 
					 });

			     $("#inlineGalleryPic_"+timestamp).fadeOut("normal",function() { 
						$("#inlineGalleryPic_"+timestamp).html(aQueryString[0]).show(); 
					 });

					 document.getElementById("articleGalleryWemf_"+timestamp).innerHTML = "<img src=\""+WEMF+"/bildstrecke_inline?r="+escape(document.referrer)+"&d="+(Math.random()*100000)+"\"width=\"1\" height=\"1\" alt=\"\" /><img src=\""+WEMF2+"/bildstrecke_inline?r="+escape(document.referrer)+"&d="+(Math.random()*100000)+"\"width=\"1\" height=\"1\" alt=\"\" />"
					 
					 
					 pageTracker._trackPageview();
					 secondTracker._trackPageview();
				 }
		});
		return false;
}

//--------------------------------------------------------------------------------------------------------------------------------------------

function goToBildstreckeBigScreen(diashowID,pageID,sChannel)
{
	if (pageID>0)
	{
		pageID--;
	}
	window.location = '/'+sChannel+'/bildstrecke.html?id='+diashowID+'&page='+pageID;
}

function ShowTime(dStartTimeLocal, sName, sVorEins, sVorPlus, sTimeHours, sTimeDays)
{ 
	var dDeltaTime = new Date();
	dDeltaTime.setTime(new Date() - dStartTimeLocal);
	var dDateNow = new Date();
	var sHour = dDeltaTime.getHours();
	var sMin = dDeltaTime.getMinutes();

	var aktualisiert = '';
	if (sHour==0 || sHour==1)
	{
		if(sMin < 1 || sMin == 1){
			aktualisiert = sVorEins;
		}else{
			aktualisiert = sVorPlus.replace("[minute]", sMin);
		}
	}
	else if (sHour>1 && sHour<4)
	{
		aktualisiert = sTimeHours;
	}
	else if (sHour>4)
	{
		aktualisiert = sTimeDays;		
	}
	else if (sHour<0)
	{
		aktualisiert = sTimeDays;		
	}
	else
	{
		aktualisiert = sTimeDays;
	}
	
	$("#"+sName).html(aktualisiert);
}



//--------------------------------------------------------------------------------------------------------------------------------------------
// JQuery on document ready
//--------------------------------------------------------------------------------------------------------------------------------------------

$(document).ready(function(){
	setTimeout("alignSideline()",1000);
	setTimeout("alignSideline()",2000);
	setTimeout("alignSideline()",3000);
	setTimeout("alignSideline()",5000);
	setTimeout("alignSideline()",8000);

	//--------------------------------------------------------------------------------------------------------------------------------------------
   	
			 														jQuery(".ressortGroup").each(function(i){
	      														jQuery(this).hover(function(){jQuery(this).find("h2 span").slice(0,1).addClass("activeDD");},function(){jQuery(this).find("h2 span").slice(0,1).removeClass("activeDD");});
	    														});

		 														// IE6 Fix: 
														     if(jQuery.hasOwnProperty("browser") && jQuery.browser.msie && (jQuery.browser.version < 7)) {
														      jQuery(".ressortGroup").each(function(i){
														        jQuery(this).find("h2 span").hover(function(){jQuery(this).addClass("activeDD");},function(){jQuery(this).removeClass("activeDD");});
														      });
														    };

	//--------------------------------------------------------------------------------------------------------------------------------------------


	$('A[rel="bildstrecke"]').click( function() {
		window.open( $(this).attr('href'),'Bildstrecke','toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=yes, copyhistory=no, width=1024, height=740').focus();
		return false;
	});
	    
	//--------------------------------------------------------------------------------------------------------------------------------------------
	
	$('A[rel="video"]').click( function() {
		window.open( $(this).attr('href'),'Video','toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=yes, copyhistory=no, width=1024, height=810').focus();
		return false;
	});
	if (typeof redesign2014 != 'undefined' && redesign2014 === 0) {
		$("#ui_tabs").tabs();
		$("#marketBox").tabs({ selected: (Math.floor(Math.random()*4)) });
		$("#hitparadenBox").tabs();
	}

	//--------------------------------------------------------------------------------------------------------------------------------------------

	$('#articleMail,.articleClose').click( function() {
		$("form#articleMailForm").toggle();
		$('#MailInfo').hide();
		$("#articleMail").toggleClass("active");
		return false;
	});  

	//--------------------------------------------------------------------------------------------------------------------------------------------

   $('div.inlineGalleryPic').mouseover(diashowTeaserHover);
	$('div.inlineGalleryPic').mouseout(diashowTeaserHoverOut);
	$('div.diashowTeaser').mouseover(diashowTeaserHover);
	$('div.diashowTeaser').mouseout(diashowTeaserHoverOut);
	$('.infoClose').click( function() {
		$('#MailInfo').slideUp(250);
		return false;
	}); 

	//--------------------------------------------------------------------------------------------------------------------------------------------

	var commentoptions = {};			
	/* deprecated, now @Talkback.pm
	if ($("#commentform").length >= 0)
	{
		$("#commentform").validate({			
			submitHandler: function(form) {
				jQuery(form).ajaxSubmit(commentoptions);
				return false;
			},
			rules: {	
				vorname: { required: true },	
				username: { required: true },	
				message: { required: true },	
				plz: { required: true },
				ort: { required: true },
				emailValid: { required: true, email: true },
				emailSpez: { required: true, email: true }
			}		
		}); 
	}*/
	
	//--------------------------------------------------------------------------------------------------------------------------------------------

	$('#bildnavmailen').click(function () {
		$("#bildstreckeMailForm,#formLabel").toggle();
		$("#bildnavmailen").toggleClass("active");
		return false;
	});  

	var optionsBildstrecke = { 				
		success: function() {
			$('#bildstreckeMailForm,#formLabel').fadeOut(500);
			window.setTimeout( function() { $('#MailInfo').fadeIn(500);}, 500);
			window.setTimeout( function() { $('#MailInfo').slideUp(250);}, 7000);
			$("#bildnavmailen").toggleClass("active");
		},
		clearForm: true
	};

	if (typeof redesign2014 != 'undefined' && redesign2014 === 0) {
		$("#bildstreckeMailForm").validate({			
			submitHandler: function(form) {
				jQuery(form).ajaxSubmit(optionsBildstrecke);
				return false;
			},
			rules: {	
				rMail: { required: true, email: true },
				sMail: { required: true, email: true }		
			}		
		});
	}
	
	//-----------Fuer Flash Bildstrecke---------------------------------------------------------------------------------------------------------------------------------
/*
	$('#sendSlideshow').click(function () {
		$("#sendSlideshowForm").toggle();
		$("#sendSlideshow").toggleClass("active");
		return false;
	});  
*/
	
	var optionsFlashBildstrecke = { 				
		success: function() {
	
			$('#sendSlideshowForm').fadeOut(500);
			window.setTimeout( function() { $('#MailInfo').fadeIn(500);}, 500);
			window.setTimeout( function() { $('#MailInfo').slideUp(250);}, 7000);
			//$("#sendSlideshow").toggleClass("active");
			window.setTimeout( function() { $('#sendSlideshowForm').fadeIn(500);}, 7500);
			
		},
		clearForm: true
	};

	if (typeof redesign2014 != 'undefined' && redesign2014 === 0) {
		$("#sendSlideshowForm").validate({			
			submitHandler: function(form) {
				jQuery(form).ajaxSubmit(optionsFlashBildstrecke);
				return false;
			},
			rules: {	
				rMail: { required: true, email: true },
				sMail: { required: true, email: true }		
			},		
			messages:{
				rMail: 'Bitte geben Sie eine gültige E-Mail Adresse ein',
				sMail: 'Bitte geben Sie eine gültige E-Mail Adresse ein'
			}
		});
	}
	
	//--------------------------------------------------------------------------------------------------------------------------------------------

	var optionsArticle = { 				
		success: function() {
			$('#articleMailForm').fadeOut(500);
			window.setTimeout( function() { $('div#MailInfo').fadeIn(500);}, 500);
		 	window.setTimeout( function() { tb_remove();}, 7000);
			$("#articleMail").toggleClass("active");
		},
		clearForm: true
	};


	if (typeof redesign2014 != 'undefined' && redesign2014 === 0) {
		$("#articleMailForm").validate({
			submitHandler: function(form) {
				jQuery(form).ajaxSubmit(optionsArticle);
				return false;
			},
			rules: {
				rMail: { required: true, email: true },
				sMail: { required: true, email: true }		
			}
		});
	}

	//--------------------------------------------------------------------------------------------------------------------------------------------
	//--------------------------------------------------------------------------------------------------------------------------------------------
	//--------------------------------------------------------------------------------------------------------------------------------------------

});

//--------------------------------------------------------------------------------------------------------------------------------------------

function refreshStory(iStoryID, iTypeID, iRefresh, iError)
{
	if (!iRefresh)
	{
		iRefresh = 60000;
	}
	
	$.ajax({
		type: "GET",
		dataType: "html",
		url: "/zz_article_live/story_teaser_"+iStoryID+"_"+iTypeID+".shtml",
		async: false,
		data: "",
		error: function(){ iError++; iRefresh=60000;},
		success: function(text)
		{
			if (text=='STOP')
			{
				iError = 10;
			}
			else
			{
				$("#storyLive_"+iStoryID +" >span").fadeIn(200);
				$("#storyLive_"+iStoryID +" >div").fadeOut(1000);
				$("#storyLive_"+iStoryID +" >div").html(text).fadeIn(500, function(){
					$("#storyLive_"+iStoryID +" >span").fadeOut(200);
				});
	 		}
	 	}
	});

	if (iError<5)
	{
		setTimeout('refreshStory('+iStoryID+', '+iTypeID+', '+iRefresh+', '+iError+')', iRefresh);
	}
}

//--------------------------------------------------------------------------------------------------------------------------------------------


			/*** Radio24 Podcast Player ***/
 			 
			function getFlashMovie(movieName) { 
				var isIE = navigator.appName.indexOf("Microsoft") != -1; 
				return (isIE) ? window[movieName] : document[movieName]; 
			}
			
			/* only one podcast player can be set to play at the same time*/
			function set_pause_all(id) {
				var isIE = navigator.appName.indexOf("Microsoft") != -1; 
				if (!isIE) {
					$(".player-holder").each (
	     		function(){
	        	var movieName = $(this).attr("id");
	        	var nodeCnt = document.getElementById(movieName).childNodes.length;
	        	if ((nodeCnt == 1) && (movieName != id))  {
	        		getFlashMovie(movieName).TCallLabel('/','pause');
	        	}
	        
	      	})
      	}
			}
			
			function start_audioPlayer(id) {
				getFlashMovie(id).TCallLabel('/','play');
			}
					


		 	function getFlashPlayer(url, id) {	 
		 	  set_pause_all(id);
		 	  var div_id = "player-holder"+id;
			  var so = new SWFObject("/radio24_webreplay.swf",div_id,"200", "30", "9.0.115", "#000000");
				so.addParam("quality", "high");
				so.addParam("scale", "noscale");
				so.addParam("salign", "left");
				so.addParam("allowScriptAccess", "always");
				so.addParam("allowFullScreen", "true");
				so.addParam("wmode", "transparent");
				so.addParam("menu", "false");
				// Variablen
				so.addVariable("javascript","true");			
				so.addVariable("id",div_id);			
				so.addVariable("file",url);
				
				so.addVariable("autoStart", "true");
			  so.write(div_id);		  	
			}

			/*** Statistics ***/
  		function makeStatisticsR24Podcasts (podcastID) {
  							  jQuery.ajax({ type: "POST",
					          dataType: "json",
		                url: "/ajax/index.html",
					          async: true,
					          data: 'action=makeStatisticPodcast&podcastID='+podcastID,
					          error: function(){ },
					          success: function(json){
					          }     
				 					});
			}
	
//--------------------------------------------------------------------------------------------------------------------------------------------

var diashowTeaserHover = function(e) {
    if($(e.currentTarget).find('div.loupe').length) {
	$(e.currentTarget).find('div.loupe').show();
    } else if($(e.currentTarget).parent().find('div.loupe').length) {
	$(e.currentTarget).parent().find('div.loupe').show();
    }
	
}

var diashowTeaserHoverOut = function(e) {
    if($(e.currentTarget).find('div.loupe').length) {
	$(e.currentTarget).find('div.loupe').hide();
    } else if($(e.currentTarget).parent().find('div.loupe').length) {
	$(e.currentTarget).parent().find('div.loupe').hide();
    }
}

function ajaxLoadDiashow(diashowId){
	
	// Redesign 2014 backward compatibility: Execute the new slideshow if it exists
    if (window.showSlideshow !== undefined) {
        showSlideshow(diashowId, { fullscreenOnly: true, ads: true });
        return;
    }

    if(typeof  diashowFullscreen == 'undefined'){
	var oHead = document.getElementsByTagName('HEAD').item(0);
 	var oScript= document.createElement("script");
 	oScript.type = "text/javascript";
 	oScript.src="http://files.newsnetz.ch/scripts/mootools_and_diashow.js";
 	oHead.appendChild( oScript); 
    }
    
    $.getJSON('diashowJson.html?diashow_id='+diashowId, function(json) {
  	var diashow = new diashowFullscreen(json.items);
  	
  	diashow.set('diashow_id',json.diashow_id);
  	diashow.set('title', json.title);
	diashow.set('linksHTML', json.linkHTML);
	if(json.adCode) {
	    diashow.set('ads', {
		active: (json.items[0].noAds != '1'),
		code: '<div class="inlineGalleryAd" id="inlineGalleryAd">' + json.adCode + '</div>',
		first: 3,
		rhythm: 5}
		       );
	}
	diashow.dispatch();
    });
}


var dispatchDiashow = function(diashowId, images, title, adCode){
	// Redesign 2014 backward compatibility: Execute the new slideshow if it exists
    if (window.showSlideshow !== undefined) {
        showSlideshow(diashowId, { fullscreenOnly: true, ads: true });
        return;
    }
	
	var diashow = new diashowFullscreen(images);
	diashow.set('title', title);
        diashow.set('diashow_id',diashowId);
	if(adCode) {
		diashow.set('ads', {
			active: (images[0] && images[0].noAds ? false : true),
			code: '<div class="inlineGalleryAd" id="inlineGalleryAd">' + adCode + '</div>',
			first: 3,
			rhythm: 5
		});
	}
	
	diashow.dispatch();
}

//--------------------------------------------------------------------------------------------------------------------------------------------
function validateEmail(s){
		var isEmail_re       = /^\s*[\w\-\+_]+(\.[\w\-\+_]+)*\@[\w\-\+_]+\.[\w\-\+_]+(\.[\w\-\+_]+)*\s*$/;
	  return String(s).search (isEmail_re) != -1;
}
//--------------------------------------------------------------------------------------------------------------------------------------------
function jobChoice() {
	$("#jobChoice").css({"display": "block"});	
}
function jobChoiceOff() {
	$("#jobChoice").css({"display": "none"});	
}  


//--------------------------------------------------------------------------------------------------------------------------------------------
function alignSideline() {
	var exceptions = new Array('http://www.radio24.ch/');
	if (exceptions.indexOf(document.URL) >= 0) {
		return '';
	}
	if (window.location.pathname.length < 2) {
		return '';
	}
	var sidelineSurplusMin = 100; // in px; min. sideline void height, otherwise sideline is too long; editorial teasers have ~230px 
	var contentHeight = 0; 
	var sidelineHeight = 0; 
	var sidelineDiv = ''; 

	if($("#singleLeft").length > 0) {
		contentHeight = $("#singleLeft").outerHeight(true);
	}
	else if ($("#mainLeft").length > 0) {	
		contentHeight = $("#mainLeft").outerHeight(true); 
	}
	else if ($("#mainColLeft").length > 0) {	
		contentHeight = $("#mainColLeft").outerHeight(true);
	}

	if($("#mainColRight").length > 0) {
		sidelineHeight = $("#mainColRight").outerHeight(true);
		sidelineDiv = 'mainColRight';
	}
	else if ($("#singleRight").length > 0) {  
		sidelineHeight = $("#singleRight").outerHeight(true);
		sidelineDiv = 'singleRight';
	}
	
	if (($("#blogLeft").length > 0) && ($("#sidebar").length > 0)) {	// blogs
		contentHeight = $("#blogLeft").outerHeight(true);
		sidelineHeight = $("#sidebar").outerHeight(true);
		sidelineDiv = 'sidebar';
	}

	//consoleLog("sidelineSurplus = sidelineHeight("+sidelineHeight+") - contentHeight("+contentHeight+")");	
	var sidelineSurplus = sidelineHeight - contentHeight;
	
	if (sidelineSurplus > 0) { // sideline is too long  
		var hiddenTeaserHeight = 0; 
		var i = 0; 
		var editorialTeasers = new Array(); 
		$("#"+sidelineDiv+" .teaserEditorialContent").each(
			function(){
				editorialTeasers[i]=$(this).outerHeight(true); 
				i++;
			} 
		);
		for (var i = editorialTeasers.length - 1; i >= 0; i--) {
			hiddenTeaserHeight += editorialTeasers[i];  
			//consoleLog("  true? sidelineSurplus("+sidelineSurplus+") > hiddenTeaserHeight("+hiddenTeaserHeight+")");
			if((sidelineSurplus + sidelineSurplusMin) > hiddenTeaserHeight) {
				$("#"+sidelineDiv+" .teaserEditorialContent").eq(i).remove(); 
				//consoleLog("teaser removed teaserEditorialContent_"+i); 
			}
			else {
				break; 
			}
		}
	}	
}


function consoleLog(msg){
	if (typeof console === 'undefined') {
		return '';
	}
	else {
		console.log(msg); 
	}
}


//-------------------------------------------- Text Shadow Lematin for IE7-9 ---------------------------------------------------------

(function($, window, undefined) {
//regex
var rtextshadow = /([\d+.\-]+[a-z%]*)\s*([\d+.\-]+[a-z%]*)\s*([\d+.\-]+[a-z%]*)?\s*([#a-z]*.*)?/,
rcolor= /(rgb|hsl)a?\(\s*(\d+)\s*,\s*(\d+)%?\s*,\s*(\d+)%?(?:\s*,\s*([\.\d]+))?/,
filter = "progid:DXImageTransform.Microsoft.",
rspace = /(\s*)/g;

// create a plugin
$.fn.textshadow = function(value, options) {
if (typeof value === 'object' && !options) {
options = value;
value = null;
}
var opts = options || {};
var useStyle = opts.useStyle || false;

// loop the found items
return this.each(function() {
var $elem = $(this), $copy;

// find the copy elements
$copy = $elem.find('.ui-text-shadow-copy');

// create them if none exist
if (!$copy.length) {
// create all of the elements
allWords(this);
$copy = $elem.find('.ui-text-shadow-copy');
}
if (useStyle) {
applyStyles($elem, $copy, value);
}
});
};

//---------------------
// For splitting words
//---------------------
// function for returning al words in an element as text nodes
function allWords(elem) {
$(elem).contents().each(function() {
if (this.nodeType === 3 && this.data) {
makeWords(this);
return true;
}

var $elem = $(this);
if (this.nodeType === 1 && (!$elem.hasClass('ui-text-shadow') || !$elem.hasClass('ui-text-shadow-original') || !$elem.hasClass('ui-text-shadow-copy'))) {
allWords(this);
return true;
}
});
}

// splits text nodes
function makeWords(textNode) {
// Split the text in the node by space characters
var text = textNode.nodeValue,
split = text.split(/\s/),
length, lastIndex = 0, spaces, node;

// Skip empty nodes
if (!text) {
return;
}

// Add the original string (it gets split)
var fragment = document.createDocumentFragment();

// loop by the splits
$.each(split, function() {
length = this.length;
if (!length) { // IE 9
return true;
}

//include the trailing space characters
rspace.lastIndex = lastIndex + length;
spaces = rspace.exec(text);
node = wrapWord(text.substr(lastIndex, length + spaces[1].length));
if (node !== null) {
fragment.appendChild(node);
}
lastIndex = lastIndex + length + spaces[1].length;
});
textNode.parentNode.replaceChild(fragment.cloneNode(true), textNode);
}

var shadowNode = $('<span class="ui-text-shadow" />')[0],
origNode = $('<span class="ui-text-shadow-original" />')[0],
copyNode = $('<span class="ui-text-shadow-copy" />')[0];

function wrapWord(text) {
if (!text.length) { // IE 9
return null;
}
var shadow = shadowNode.cloneNode(),
orig = origNode.cloneNode(),
copy = copyNode.cloneNode();

shadow.appendChild(orig);
shadow.appendChild(copy);

orig.appendChild(document.createTextNode(text));
copy.appendChild(document.createTextNode(text));
return shadow;
}

//---------------------
// For Applying Styles
//---------------------
function applyStyles($elem, $copy, value) {
$copy.each(function() {
var copy = this,
style = value || $elem[0].currentStyle['text-shadow'];
$copy = $(copy);

// don't apply style if we can't find one
if (!style || style === 'none') {
return true;
}

// parse the style
var values = rtextshadow.exec(style),
x, y, blur, color, opacity;

// capture the values
x = parseFloat(values[1]); // TODO: handle units
y = parseFloat(values[2]); // TODO: handle units
blur = values[3] !== undefined ? parseFloat(values[3]) : 0; // TODO: handle units
color = values[4] !== undefined ? toHex(values[4]) : 'inherit';
opacity = getAlpha(values[4]);

// style the element
$copy.css({
color: color,
left: (x - blur) + 'px',
top: (y - blur) + 'px'
});

// add in the filters
copy.style.filter = [
filter + "Alpha(",
"opacity=" + parseInt(opacity * 100, 10),
") ",
filter + "Blur(",
"pixelRadius=" + blur,
")"
].join('');
});
}

//---------------------
// For Colors
//---------------------
// http://haacked.com/archive/2009/12/29/convert-rgb-to-hex.aspx
function toHex(color) {
// handle rgb
var matches = rcolor.exec(color), rgb;

// handle hsl
if (matches && matches[1] === 'hsl') {
rgb = hsl2rgb(matches[2], matches[3], matches[4]);
matches[2] = rgb[0];
matches[3] = rgb[1];
matches[4] = rgb[2];
}

// convert to hex
return matches ? '#' + (1 << 24 | matches[2] << 16 | matches[3] << 8 | matches[4]).toString(16).substr(1) : color;
}

function getAlpha(color) {
var matches = rcolor.exec(color);
if (matches) {
return matches[5] !== undefined ? matches[5] : 1;
}
return 1;
}

// http://www.codingforums.com/showthread.php?t=11156
function hsl2rgb(h, s, l) {
var m1, m2, hue, r, g, b;
s /=100;
l /= 100;
if (s === 0) {
r = g = b = (l * 255);
} else {
if (l <= 0.5) {
m2 = l * (s + 1);
} else {
m2 = l + s - l * s;
}
m1 = l * 2 - m2;
hue = h / 360;
r = hue2rgb(m1, m2, hue + 1/3);
g = hue2rgb(m1, m2, hue);
b = hue2rgb(m1, m2, hue - 1/3);
}
return [r, g, b];
}

function hue2rgb(m1, m2, hue) {
var v;
if (hue < 0) {
hue += 1;
} else if (hue > 1) {
hue -= 1;
}

if (6 * hue < 1) {
v = m1 + (m2 - m1) * hue * 6;
} else if (2 * hue < 1) {
v = m2;
} else if (3 * hue < 2) {
v = m1 + (m2 - m1) * (2/3 - hue) * 6;
} else {
v = m1;
}

return 255 * v;
}
})(jQuery, this);

/* This function has a problem on the live system and was use only on LeMatin. Have to check where is the problem		
$(document).ready(function() {
	if(document.domain == 'www.lematin.ch') {
		if($.browser.msie) {
	 		$('.mainColLeftSection .featureStory h2').textshadow();
		}
	}
});
*/
/* End Text-shadow */


function showCells(row, id) {
    jQuery("tr[class*=default-hidden-more-link"+id+"]").hide();
    jQuery("tr[class*=default-hidden"+id+"]").show();
}        
function hideCells (row, id) {
    jQuery("tr[class*=default-hidden-more-link"+id+"]").show();
    jQuery("tr[class*=default-hidden"+id+"]").hide();        
}


/* Function to get the tags on a click */
function getTags() {
    var urlHost = document.domain.replace(/^www\./i,"");
    var Domain = urlHost.split(".");
    Domain = Domain[0];   

	var TagDomain;

	var Path = location.pathname.split("/");
	Path = Path[1];

	var szmvars=Domain+"//CP//"+Path;

	var SurveyScript = document.createElement("script");
	SurveyScript.type = "text/javascript";
	SurveyScript.src = "http://"+Domain+".wemfbox.ch/2004/01/survey.js";

	switch(Domain)
        {
            case "24heures": TagDomain = "UA-4334105-1";
            break;
            case "lematin": TagDomain= "UA-1755881-1";
            break;
            case "tdg": TagDomain= "UA-4263654-1";
        }

	if($("#ClickTags").length == 0){
		$("body").append("<div id='ClickTags' style='display:none; position:absolute; top:-100; left:-100;'></div>");
	}

  /* WEMF Images */	
  $('#ClickTags').empty();
  $('#ClickTags').append(
  	"<img src=\""+WEMF2+"/article?r="+escape(document.referrer)+"&d="+(Math.random()*100000)+"&x="+screen.width+"x"+screen.height+"\" width=\"1\" height=\"1\" alt=\"\" />"+
  	"<img src=\""+WEMF+"/article?r="+escape(document.referrer)+"&d="+(Math.random()*100000)+"&x="+screen.width+"x"+screen.height+"\" width=\"1\" height=\"1\" alt=\"\" />"
  	);
  $("#ClickTags").append(SurveyScript);

  /* GOOGLE Analytics */
  try{
    	var pageTracker = _gat._getTracker(TagDomain);
		pageTracker._setDomainName(Domain+".ch");
		pageTracker._initData();
		pageTracker._trackPageview();
		var secondTracker = _gat._getTracker("UA-431029-7");
		secondTracker._setDomainName("none");
		secondTracker._setAllowLinker(true);
		secondTracker._initData();
		secondTracker._trackPageview();      
  } 
  catch(err) {}
}
function searchFocus(inputField){
 if ($(inputField).val() == $(inputField).attr("title")) {
  $(inputField).val('').addClass('searchFocus');
 }
}
 
function searchBlur(inputField){
 if ($(inputField).val() == '') {
  $(inputField).val($(inputField).attr("title")).removeClass('searchFocus');
 }
}

/*Le Matin Dimanche*/
$(document).ready(function() {
	if(document.domain == 'www.lematin.ch') {
	var dimanche = $(".teaserEditorialContent").has(".dimanche");
		dimanche.prepend($(this).find("h4:has(div.dimanche)"));
		dimanche.find("h4").css({
			"margin-top": "0",
			"margin-bottom" : "0.65em"
		});
		dimanche.find(".fullPic a span").css({
			"font-family" : "'Open Sans', Arial, sans-serif",
			"font-weight" : "800",
			"font-size" : "20px",
			"text-decoration" : "none",
			"margin-top" : "7px",
			"color" : "#333",
			"line-height" : "1.1em",
			"padding-bottom" : "15px",
			"border-bottom" : "1px solid #333"
		})
	}

    if ($( ".matinDimanche" ).length) {
	$( ".matinDimanche" ).flexslider({
	    animation: "fade",
	    slideshow: true,
	    slideshowSpeed: 7000,
	    animationSpeed: 1500,
	    controlNav: false,
	    directionNav: false,
	    animationLoop: true,
	    itemWidth: 300,
	    minItems: 1,
	    maxItems: 1
	});
    }
    if(js_lang == "fr"){
    	if ($.browser.msie && $.browser.version >= 10) {
		  $("#horizontalNavigation #mehr").css("width", "79px");
		}
    }
});
