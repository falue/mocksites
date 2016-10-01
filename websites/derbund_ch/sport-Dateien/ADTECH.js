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


document.write("<scr"+"ipt src=\""+(window.location.protocol=='https:' ? "https://aka-cdn.adtechus.com" : "http://aka-cdn-ns.adtechus.com")+"/media/moat/adtechbrands092348fjlsmdhlwsl239fh3df/moatad.js#moatClientLevel1=1084&moatClientLevel2=1090866&moatClientLevel3=0&moatClientLevel4=3514585&zMoatMaster=9288290&zMoatFlight=9288296&zMoatBanner=104602617&zURL=http&zMoatPlacementId=3514585&zMoatAdId=9288296&zMoatCreative=0&zMoatBannerID=1&zMoatCustomVisp=50&zMoatCustomVist=1000&zMoatIsAdvisGoal=0&zMoatEventUrl=&zMoatSize=16&zMoatSubNetID=1&zMoatisSelected=1&zMoatadServer=ad.dc2.adtech.de&zMoatadVisServer=&zMoatSamplingRate=23&zMoatliveTestCookie=&zMoatRefSeqId=a46EMwwAnFA&zMoatImpRefTs=1475240170&zMoatAlias=&zMoatVert=\" type=\"text/javascript\"></scr"+"ipt>");
