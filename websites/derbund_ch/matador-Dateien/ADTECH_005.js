window._ttf = window._ttf || [];
_ttf.push({
pid          : 19999
,lang        : "de"
,format      : "inread"
,mutable:false
,components: {mute: { delay: 0} ,skip: {delay: 0} }
,passBack: function(num) {
//create the div for P
var pbDiv = document.createElement("div");
pbDiv.id = "inPageVideo";
document.getElementById("mainContent").appendChild(pbDiv);
//load the js
var js, s = document.getElementsByTagName("script")[0];
js = document.createElement("script");
js.async = true;
js.src = "http://publicitasEMEA.vmg.host/adServ/placement/id/2517";
s.parentNode.insertBefore(js, s);
}
});
(function (d) {
var js, s = d.getElementsByTagName('script')[0];
js = d.createElement('script');
js.async = true;
js.src = '//cdn.teads.tv/js/all-v1.js';
s.parentNode.insertBefore(js, s);
})(window.document);


