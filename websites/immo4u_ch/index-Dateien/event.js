/*<!--*/(function() {var qss="&cb="+Math.floor(99999999999*Math.random());try{qss+="&ref="+encodeURIComponent(document.referrer)}catch(e$$12){}try{qss+="&sc_r="+encodeURIComponent(screen.width+"x"+screen.height)}catch(e$$13){}try{qss+="&sc_d="+encodeURIComponent(screen.colorDepth)}catch(e$$14){}
var callDis=function(c,d){var a=function(){callDisInternal(c,d)};"complete"===document.readyState?setTimeout(a):window.addEventListener?window.addEventListener("load",a,!1):window.attachEvent("onload",a)},disCalled=!1,callDisInternal=function(c,d){if(!disCalled){disCalled=!0;var a="//"+d+"/dis/dis.aspx",b=document.createElement("iframe");b.width=b.height="0";b.style.display="none";b.src=(a+"?p="+c+qss).substring(0,2E3);(a=document.getElementById("criteoTagsContainer"))?a.appendChild(b):criteo_q.push({event:"appendTag",
element:b})}};

callDis(30685, 'dis.eu.criteo.com');
})();

(function() {
var callWCADestination = function(aurl) {
    var url = 'https://' + aurl;
    var p = document.createElement('iframe');
    p.width = p.height = '0';
    p.style.display = 'none';
    var iframeSource = "javascript:(function(){var d=document;";
    iframeSource += 'd.createElement("img").src="' + encodeURI(url) + '";';
    iframeSource += "setTimeout(function(){d.open();d.write('');d.close();},1000);})();";
    p.src = iframeSource;
    if (criteo_q) {
        criteo_q.push({ event: 'appendTag', element: p, requiresDOM: 'non-blocking' });
    }
}
var cto_fw_url = 'www.facebook.com/tr/?id=1502491579776468&ev=ViewContent&cd[content_type]=product&cd[content_ids]=%5B%2265236%22%5D&cd[product_catalog_id]=844065815730600&cd[product_category]=44367990&cd[criteo_audience_3_0]=B3&cd[external_id]=93a1d013-0a7f-493f-8426-db644afb2807&cd[application_id]=423936147658676';
callWCADestination(cto_fw_url);})();


/*-->*/