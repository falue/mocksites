(function(){var h,k=this,m=function(a){var b=typeof a;if("object"==b)if(a){if(a instanceof Array)return"array";if(a instanceof Object)return b;var c=Object.prototype.toString.call(a);if("[object Window]"==c)return"object";if("[object Array]"==c||"number"==typeof a.length&&"undefined"!=typeof a.splice&&"undefined"!=typeof a.propertyIsEnumerable&&!a.propertyIsEnumerable("splice"))return"array";if("[object Function]"==c||"undefined"!=typeof a.call&&"undefined"!=typeof a.propertyIsEnumerable&&!a.propertyIsEnumerable("call"))return"function"}else return"null";
else if("function"==b&&"undefined"==typeof a.call)return"object";return b},aa=function(a){var b=m(a);return"array"==b||"object"==b&&"number"==typeof a.length},n=function(a){return"string"==typeof a},ba=function(a){var b=typeof a;return"object"==b&&null!=a||"function"==b},ca=function(a,b,c){return a.call.apply(a.bind,arguments)},da=function(a,b,c){if(!a)throw Error();if(2<arguments.length){var d=Array.prototype.slice.call(arguments,2);return function(){var c=Array.prototype.slice.call(arguments);Array.prototype.unshift.apply(c,
d);return a.apply(b,c)}}return function(){return a.apply(b,arguments)}},p=function(a,b,c){p=Function.prototype.bind&&-1!=Function.prototype.bind.toString().indexOf("native code")?ca:da;return p.apply(null,arguments)};var ea=String.prototype.trim?function(a){return a.trim()}:function(a){return a.replace(/^[\s\xa0]+|[\s\xa0]+$/g,"")},ma=function(a){if(!fa.test(a))return a;-1!=a.indexOf("&")&&(a=a.replace(ga,"&amp;"));-1!=a.indexOf("<")&&(a=a.replace(ha,"&lt;"));-1!=a.indexOf(">")&&(a=a.replace(ia,"&gt;"));-1!=a.indexOf('"')&&(a=a.replace(ja,"&quot;"));-1!=a.indexOf("'")&&(a=a.replace(ka,"&#39;"));-1!=a.indexOf("\x00")&&(a=a.replace(la,"&#0;"));return a},ga=/&/g,ha=/</g,ia=/>/g,ja=/"/g,ka=/'/g,la=/\x00/g,fa=/[\x00&<>"']/,
oa=function(a){var b={"&amp;":"&","&lt;":"<","&gt;":">","&quot;":'"'},c;c=k.document.createElement("div");return a.replace(na,function(a,e){var d=b[a];if(d)return d;if("#"==e.charAt(0)){var g=Number("0"+e.substr(1));isNaN(g)||(d=String.fromCharCode(g))}d||(c.innerHTML=a+" ",d=c.firstChild.nodeValue.slice(0,-1));return b[a]=d})},pa=function(a){return a.replace(/&([^;]+);/g,function(a,c){switch(c){case "amp":return"&";case "lt":return"<";case "gt":return">";case "quot":return'"';default:if("#"==c.charAt(0)){var b=
Number("0"+c.substr(1));if(!isNaN(b))return String.fromCharCode(b)}return a}})},na=/&([^;\s<&]+);?/g,q=function(a,b){return a<b?-1:a>b?1:0};var r=function(a,b){for(var c=a.length,d=n(a)?a.split(""):a,e=0;e<c;e++)e in d&&b.call(void 0,d[e],e,a)},ra=function(a,b){var c=qa(a,b);return 0>c?null:n(a)?a.charAt(c):a[c]},qa=function(a,b){for(var c=a.length,d=n(a)?a.split(""):a,e=0;e<c;e++)if(e in d&&b.call(void 0,d[e],e,a))return e;return-1},sa=function(a,b){var c=qa(a,b);0<=c&&Array.prototype.splice.call(a,c,1)},ta=function(a){return Array.prototype.concat.apply(Array.prototype,arguments)},ua=function(a){var b=a.length;if(0<b){for(var c=Array(b),
d=0;d<b;d++)c[d]=a[d];return c}return[]};var va=function(a,b){for(var c in a)b.call(void 0,a[c],c,a)},wa="constructor hasOwnProperty isPrototypeOf propertyIsEnumerable toLocaleString toString valueOf".split(" "),xa=function(a,b){for(var c,d,e=1;e<arguments.length;e++){d=arguments[e];for(c in d)a[c]=d[c];for(var f=0;f<wa.length;f++)c=wa[f],Object.prototype.hasOwnProperty.call(d,c)&&(a[c]=d[c])}};var t;a:{var ya=k.navigator;if(ya){var za=ya.userAgent;if(za){t=za;break a}}t=""};var u=function(a){u[" "](a);return a};u[" "]=function(){};var Ba=function(a,b){var c=Aa;return Object.prototype.hasOwnProperty.call(c,a)?c[a]:c[a]=b(a)};var Ca=-1!=t.indexOf("Opera"),v=-1!=t.indexOf("Trident")||-1!=t.indexOf("MSIE"),Da=-1!=t.indexOf("Edge"),w=-1!=t.indexOf("Gecko")&&!(-1!=t.toLowerCase().indexOf("webkit")&&-1==t.indexOf("Edge"))&&!(-1!=t.indexOf("Trident")||-1!=t.indexOf("MSIE"))&&-1==t.indexOf("Edge"),x=-1!=t.toLowerCase().indexOf("webkit")&&-1==t.indexOf("Edge"),Ea=function(){var a=k.document;return a?a.documentMode:void 0},y;
a:{var z="",A=function(){var a=t;if(w)return/rv\:([^\);]+)(\)|;)/.exec(a);if(Da)return/Edge\/([\d\.]+)/.exec(a);if(v)return/\b(?:MSIE|rv)[: ]([^\);]+)(\)|;)/.exec(a);if(x)return/WebKit\/(\S+)/.exec(a);if(Ca)return/(?:Version)[ \/]?(\S+)/.exec(a)}();A&&(z=A?A[1]:"");if(v){var B=Ea();if(null!=B&&B>parseFloat(z)){y=String(B);break a}}y=z}
var Fa=y,Aa={},C=function(a){return Ba(a,function(){for(var b=0,c=ea(String(Fa)).split("."),d=ea(String(a)).split("."),e=Math.max(c.length,d.length),f=0;0==b&&f<e;f++){var g=c[f]||"",l=d[f]||"";do{g=/(\d*)(\D*)(.*)/.exec(g)||["","","",""];l=/(\d*)(\D*)(.*)/.exec(l)||["","","",""];if(0==g[0].length&&0==l[0].length)break;b=q(0==g[1].length?0:parseInt(g[1],10),0==l[1].length?0:parseInt(l[1],10))||q(0==g[2].length,0==l[2].length)||q(g[2],l[2]);g=g[3];l=l[3]}while(0==b)}return 0<=b})},D;var Ga=k.document;
D=Ga&&v?Ea()||("CSS1Compat"==Ga.compatMode?parseInt(Fa,10):5):void 0;var Ha=!v||9<=Number(D);!w&&!v||v&&9<=Number(D)||w&&C("1.9.1");v&&C("9");var Ja=function(a,b){va(b,function(c,b){"style"==b?a.style.cssText=c:"class"==b?a.className=c:"for"==b?a.htmlFor=c:Ia.hasOwnProperty(b)?a.setAttribute(Ia[b],c):0==b.lastIndexOf("aria-",0)||0==b.lastIndexOf("data-",0)?a.setAttribute(b,c):a[b]=c})},Ia={cellpadding:"cellPadding",cellspacing:"cellSpacing",colspan:"colSpan",frameborder:"frameBorder",height:"height",maxlength:"maxLength",nonce:"nonce",role:"role",rowspan:"rowSpan",type:"type",usemap:"useMap",valign:"vAlign",width:"width"},La=function(a,
b,c){var d=arguments,e=document,f=String(d[0]),g=d[1];if(!Ha&&g&&(g.name||g.type)){f=["<",f];g.name&&f.push(' name="',ma(g.name),'"');if(g.type){f.push(' type="',ma(g.type),'"');var l={};xa(l,g);delete l.type;g=l}f.push(">");f=f.join("")}f=e.createElement(f);g&&(n(g)?f.className=g:"array"==m(g)?f.className=g.join(" "):Ja(f,g));2<d.length&&Ka(e,f,d);return f},Ka=function(a,b,c){function d(c){c&&b.appendChild(n(c)?a.createTextNode(c):c)}for(var e=2;e<c.length;e++){var f=c[e];!aa(f)||ba(f)&&0<f.nodeType?
d(f):r(Ma(f)?ua(f):f,d)}},Na=function(a){a&&a.parentNode&&a.parentNode.removeChild(a)},Ma=function(a){if(a&&"number"==typeof a.length){if(ba(a))return"function"==typeof a.item||"string"==typeof a.item;if("function"==m(a))return"function"==typeof a.item}return!1};var Oa=!v||9<=Number(D),Pa=v&&!C("9");!x||C("528");w&&C("1.9b")||v&&C("8")||Ca&&C("9.5")||x&&C("528");w&&!C("8")||v&&C("9");var E=function(a,b){this.type=a;this.a=this.b=b};E.prototype.c=function(){};var G=function(a,b){E.call(this,a?a.type:"");this.f=this.a=this.b=null;if(a){this.type=a.type;this.b=a.target||a.srcElement;this.a=b;var c=a.relatedTarget;if(c&&w)try{u(c.nodeName)}catch(d){}this.f=a;a.defaultPrevented&&this.c()}};(function(){function a(){}a.prototype=E.prototype;G.a=E.prototype;G.prototype=new a;G.b=function(a,c,d){for(var b=Array(arguments.length-2),f=2;f<arguments.length;f++)b[f-2]=arguments[f];return E.prototype[c].apply(a,b)}})();
G.prototype.c=function(){G.a.c.call(this);var a=this.f;if(a.preventDefault)a.preventDefault();else if(a.returnValue=!1,Pa)try{if(a.ctrlKey||112<=a.keyCode&&123>=a.keyCode)a.keyCode=-1}catch(b){}};var Qa="closure_listenable_"+(1E6*Math.random()|0),Ra=0;var Sa=function(a,b,c,d,e){this.listener=a;this.a=null;this.src=b;this.type=c;this.F=!!d;this.o=e;++Ra;this.A=this.b=!1},Ta=function(a){a.A=!0;a.listener=null;a.a=null;a.src=null;a.o=null};var Ua=function(a){this.src=a;this.a={};this.b=0},Va=function(a,b,c,d,e){var f=b.toString();b=a.a[f];b||(b=a.a[f]=[],a.b++);var g;a:{for(g=0;g<b.length;++g){var l=b[g];if(!l.A&&l.listener==c&&l.F==!!d&&l.o==e)break a}g=-1}-1<g?a=b[g]:(a=new Sa(c,a.src,f,!!d,e),a.b=!0,b.push(a));return a},Wa=function(a,b){var c=b.type;if(c in a.a){var d=a.a[c],e;a:if(n(d))e=n(b)&&1==b.length?d.indexOf(b,0):-1;else{for(e=0;e<d.length;e++)if(e in d&&d[e]===b)break a;e=-1}var f;(f=0<=e)&&Array.prototype.splice.call(d,
e,1);f&&(Ta(b),0==a.a[c].length&&(delete a.a[c],a.b--))}};var Xa="closure_lm_"+(1E6*Math.random()|0),Ya={},Za=0,ab=function(){var a=$a,b=Oa?function(c){return a.call(b.src,b.listener,c)}:function(c){c=a.call(b.src,b.listener,c);if(!c)return c};return b},bb=function(a,b,c,d,e){if("array"==m(b)){for(var f=0;f<b.length;f++)bb(a,b[f],c,d,e);return null}c=cb(c);if(a&&a[Qa])a=Va(a.a,String(b),c,d,e);else{if(!b)throw Error("Invalid event type");var f=!!d,g=db(a);g||(a[Xa]=g=new Ua(a));c=Va(g,b,c,d,e);if(!c.a){d=ab();c.a=d;d.src=a;d.listener=c;if(a.addEventListener)a.addEventListener(b.toString(),
d,f);else if(a.attachEvent)a.attachEvent(eb(b.toString()),d);else throw Error("addEventListener and attachEvent are unavailable.");Za++}a=c}return a},fb=function(a){if("number"!=typeof a&&a&&!a.A){var b=a.src;if(b&&b[Qa])Wa(b.a,a);else{var c=a.type,d=a.a;b.removeEventListener?b.removeEventListener(c,d,a.F):b.detachEvent&&b.detachEvent(eb(c),d);Za--;(c=db(b))?(Wa(c,a),0==c.b&&(c.src=null,b[Xa]=null)):Ta(a)}}},eb=function(a){return a in Ya?Ya[a]:Ya[a]="on"+a},hb=function(a,b,c,d){var e=!0;if(a=db(a))if(b=
a.a[b.toString()])for(b=b.concat(),a=0;a<b.length;a++){var f=b[a];f&&f.F==c&&!f.A&&(f=gb(f,d),e=e&&!1!==f)}return e},gb=function(a,b){var c=a.listener,d=a.o||a.src;a.b&&fb(a);return c.call(d,b)},$a=function(a,b){if(a.A)return!0;if(!Oa){var c;if(!(c=b))a:{c=["window","event"];for(var d=k,e;e=c.shift();)if(null!=d[e])d=d[e];else{c=null;break a}c=d}e=c;c=new G(e,this);d=!0;if(!(0>e.keyCode||void 0!=e.returnValue)){a:{var f=!1;if(0==e.keyCode)try{e.keyCode=-1;break a}catch(O){f=!0}if(f||void 0==e.returnValue)e.returnValue=
!0}e=[];for(f=c.a;f;f=f.parentNode)e.push(f);for(var f=a.type,g=e.length-1;0<=g;g--){c.a=e[g];var l=hb(e[g],f,!0,c),d=d&&l}for(g=0;g<e.length;g++)c.a=e[g],l=hb(e[g],f,!1,c),d=d&&l}return d}return gb(a,new G(b,this))},db=function(a){a=a[Xa];return a instanceof Ua?a:null},ib="__closure_events_fn_"+(1E9*Math.random()>>>0),cb=function(a){if("function"==m(a))return a;a[ib]||(a[ib]=function(b){return a.handleEvent(b)});return a[ib]};var jb=function(a,b){if("function"!=m(a))if(a&&"function"==typeof a.handleEvent)a=p(a.handleEvent,a);else throw Error("Invalid listener argument");return 2147483647<Number(b)?-1:k.setTimeout(a,b||0)};var kb="StopIteration"in k?k.StopIteration:{message:"StopIteration",stack:""},lb=function(){};lb.prototype.next=function(){throw kb;};lb.prototype.g=function(){return this};var H=function(a,b){this.b={};this.a=[];this.f=this.c=0;var c=arguments.length;if(1<c){if(c%2)throw Error("Uneven number of arguments");for(var d=0;d<c;d+=2)this.set(arguments[d],arguments[d+1])}else if(a){var e;if(a instanceof H)e=a.s(),d=a.m();else{var c=[],f=0;for(e in a)c[f++]=e;e=c;c=[];f=0;for(d in a)c[f++]=a[d];d=c}for(c=0;c<e.length;c++)this.set(e[c],d[c])}};H.prototype.m=function(){I(this);for(var a=[],b=0;b<this.a.length;b++)a.push(this.b[this.a[b]]);return a};
H.prototype.s=function(){I(this);return this.a.concat()};var I=function(a){if(a.c!=a.a.length){for(var b=0,c=0;b<a.a.length;){var d=a.a[b];J(a.b,d)&&(a.a[c++]=d);b++}a.a.length=c}if(a.c!=a.a.length){for(var e={},c=b=0;b<a.a.length;)d=a.a[b],J(e,d)||(a.a[c++]=d,e[d]=1),b++;a.a.length=c}};H.prototype.get=function(a,b){return J(this.b,a)?this.b[a]:b};H.prototype.set=function(a,b){J(this.b,a)||(this.c++,this.a.push(a),this.f++);this.b[a]=b};
H.prototype.forEach=function(a,b){for(var c=this.s(),d=0;d<c.length;d++){var e=c[d],f=this.get(e);a.call(b,f,e,this)}};H.prototype.g=function(a){I(this);var b=0,c=this.f,d=this,e=new lb;e.next=function(){if(c!=d.f)throw Error("The map has changed since the iterator was created");if(b>=d.a.length)throw kb;var e=d.a[b++];return a?e:d.b[e]};return e};var J=function(a,b){return Object.prototype.hasOwnProperty.call(a,b)};var mb=/^(?:([^:/?#.]+):)?(?:\/\/(?:([^/?#]*)@)?([^/#?]*?)(?::([0-9]+))?(?=[/#?]|$))?([^?#]+)?(?:\?([^#]*))?(?:#([\s\S]*))?$/,nb=function(a,b){if(a)for(var c=a.split("&"),d=0;d<c.length;d++){var e=c[d].indexOf("="),f,g=null;0<=e?(f=c[d].substring(0,e),g=c[d].substring(e+1)):f=c[d];b(f,g?decodeURIComponent(g.replace(/\+/g," ")):"")}};var K=function(a,b){this.f=this.l=this.c="";this.j=null;this.g=this.i="";this.b=!1;var c;if(a instanceof K){this.b=void 0!==b?b:a.b;ob(this,a.c);this.l=a.l;this.f=a.f;pb(this,a.j);this.i=a.i;c=a.a;var d=new L;d.c=c.c;c.a&&(d.a=new H(c.a),d.b=c.b);qb(this,d);this.g=a.g}else a&&(c=String(a).match(mb))?(this.b=!!b,ob(this,c[1]||"",!0),this.l=M(c[2]||""),this.f=M(c[3]||"",!0),pb(this,c[4]),this.i=M(c[5]||"",!0),qb(this,c[6]||"",!0),this.g=M(c[7]||"")):(this.b=!!b,this.a=new L(null,0,this.b))};
K.prototype.toString=function(){var a=[],b=this.c;b&&a.push(N(b,rb,!0),":");var c=this.f;if(c||"file"==b)a.push("//"),(b=this.l)&&a.push(N(b,rb,!0),"@"),a.push(encodeURIComponent(String(c)).replace(/%25([0-9a-fA-F]{2})/g,"%$1")),c=this.j,null!=c&&a.push(":",String(c));if(c=this.i)this.f&&"/"!=c.charAt(0)&&a.push("/"),a.push(N(c,"/"==c.charAt(0)?sb:tb,!0));(c=this.a.toString())&&a.push("?",c);(c=this.g)&&a.push("#",N(c,ub));return a.join("")};
var ob=function(a,b,c){a.c=c?M(b,!0):b;a.c&&(a.c=a.c.replace(/:$/,""))},pb=function(a,b){if(b){b=Number(b);if(isNaN(b)||0>b)throw Error("Bad port number "+b);a.j=b}else a.j=null},qb=function(a,b,c){b instanceof L?(a.a=b,vb(a.a,a.b)):(c||(b=N(b,wb)),a.a=new L(b,0,a.b))},M=function(a,b){return a?b?decodeURI(a.replace(/%25/g,"%2525")):decodeURIComponent(a):""},N=function(a,b,c){return n(a)?(a=encodeURI(a).replace(b,xb),c&&(a=a.replace(/%25([0-9a-fA-F]{2})/g,"%$1")),a):null},xb=function(a){a=a.charCodeAt(0);
return"%"+(a>>4&15).toString(16)+(a&15).toString(16)},rb=/[#\/\?@]/g,tb=/[\#\?:]/g,sb=/[\#\?]/g,wb=/[\#\?@]/g,ub=/#/g,L=function(a,b,c){this.b=this.a=null;this.c=a||null;this.f=!!c},P=function(a){a.a||(a.a=new H,a.b=0,a.c&&nb(a.c,function(b,c){var d=decodeURIComponent(b.replace(/\+/g," "));P(a);a.c=null;var d=Q(a,d),e=a.a.get(d);e||a.a.set(d,e=[]);e.push(c);a.b+=1}))},yb=function(a,b){P(a);b=Q(a,b);if(J(a.a.b,b)){a.c=null;a.b-=a.a.get(b).length;var c=a.a,d=b;J(c.b,d)&&(delete c.b[d],c.c--,c.f++,c.a.length>
2*c.c&&I(c))}},zb=function(a,b){P(a);b=Q(a,b);return J(a.a.b,b)};h=L.prototype;h.s=function(){P(this);for(var a=this.a.m(),b=this.a.s(),c=[],d=0;d<b.length;d++)for(var e=a[d],f=0;f<e.length;f++)c.push(b[d]);return c};h.m=function(a){P(this);var b=[];if(n(a))zb(this,a)&&(b=ta(b,this.a.get(Q(this,a))));else{a=this.a.m();for(var c=0;c<a.length;c++)b=ta(b,a[c])}return b};h.set=function(a,b){P(this);this.c=null;a=Q(this,a);zb(this,a)&&(this.b-=this.a.get(a).length);this.a.set(a,[b]);this.b+=1;return this};
h.get=function(a,b){var c=a?this.m(a):[];return 0<c.length?String(c[0]):b};h.toString=function(){if(this.c)return this.c;if(!this.a)return"";for(var a=[],b=this.a.s(),c=0;c<b.length;c++)for(var d=b[c],e=encodeURIComponent(String(d)),d=this.m(d),f=0;f<d.length;f++){var g=e;""!==d[f]&&(g+="="+encodeURIComponent(String(d[f])));a.push(g)}return this.c=a.join("&")};
var Q=function(a,b){var c=String(b);a.f&&(c=c.toLowerCase());return c},vb=function(a,b){b&&!a.f&&(P(a),a.c=null,a.a.forEach(function(a,b){var c=b.toLowerCase();b!=c&&(yb(this,b),yb(this,c),0<a.length&&(this.c=null,this.a.set(Q(this,c),ua(a)),this.b+=a.length))},a));a.f=b};var Ab="://secure-...imrworldwide.com/ ://cdn.imrworldwide.com/ ://aksecure.imrworldwide.com/ ://[^.]*.moatads.com ://youtube[0-9]+.moatpixel.com www.google.com/pagead/sul www.youtube.com/pagead/sul www.youtube.com/pagead/psul".split(" "),Bb=/\bocr\b/,Cb=0,Db={},Eb=function(a){return/^[\s\xa0]*$/.test(null==a?"":String(a))?!1:0<=a.indexOf("://pagead2.googlesyndication.com/pagead/gen_204?id=yt3p&sr=1&")||(new K(a)).g.match(Bb)?!0:null!=ra(Ab,function(b){return null!=a.match(b)})},Fb=function(a){var b=
La("IFRAME",{src:a,style:"display:none"});a=(9==b.nodeType?b:b.ownerDocument||b.document).body;var c,d=jb(function(){fb(c);Na(b)},15E3);c=bb(b,["load","error"],function(){jb(function(){k.clearTimeout(d);Na(b)},5E3)});a.appendChild(b)},Gb=function(a){if(a){var b=new Image,c=""+Cb++;Db[c]=b;b.onload=b.onerror=function(){delete Db[c]};b.src=a}};var Hb={pa:"AdClickThru",qa:"AdDurationChange",AD_ERROR:"AdError",ra:"AdExpandedChange",sa:"AdImpression",ta:"AdInteraction",ua:"AdLinearChange",va:"AdLoaded",wa:"AdLog",xa:"AdPaused",ya:"AdPlaying",za:"AdRemainingTimeChange",Aa:"AdSizeChange",Ca:"AdSkipped",Da:"AdStarted",Ea:"AdStopped",Ba:"AdSkippableStateChange",Fa:"AdUserAcceptInvitation",Ga:"AdUserClose",Ha:"AdUserMinimize",Ia:"AdVideoComplete",Ja:"AdVideoFirstQuartile",Ka:"AdVideoMidpoint",La:"AdVideoStart",Ma:"AdVideoThirdQuartile",Na:"AdVolumeChange",
Oa:"Ping"};var Ib=function(a,b){for(var c in a)Object.prototype.hasOwnProperty.call(a,c)&&b.call(void 0,a[c],c,a)},Jb=function(){var a=k;try{for(var b=null;b!=a;b=a,a=a.parent)switch(a.location.protocol){case "https:":return!0;case "http:":case "file:":return!1}}catch(c){}return!0};var Kb=function(){this.c="&";this.b={};this.f=0;this.a=[]},R=function(a,b,c){var d=a.f++,e={};e[b]=c;b=[e];a.a.push(d);a.b[d]=b},Nb=function(a){var b=(Jb()?"https:":"http:")+"//video-ad-stats.googlesyndication.com/video/client_events?",c=Lb(a)-21-0;if(0>c)return"";a.a.sort(function(a,b){return a-b});for(var d=null,e="",f=0;f<a.a.length;f++)for(var g=a.a[f],l=a.b[g],O=0;O<l.length;O++){if(!c){d=null==d?g:d;break}var F=Mb(l[O],a.c,",$");if(F){F=e+F;if(c>=F.length){c-=F.length;b+=F;e=a.c;break}d=null==
d?g:d}}a="";null!=d&&(a=e+"trn="+d);return b+a+""},Lb=function(a){var b=1,c;for(c in a.b)b=c.length>b?c.length:b;return 3997-b-a.c.length-1},Mb=function(a,b,c,d,e){var f=[];Ib(a,function(a,l){var g=Ob(a,b,c,d,e);g&&f.push(l+"="+g)});return f.join(b)},Ob=function(a,b,c,d,e){if(null==a)return"";b=b||"&";c=c||",$";"string"==typeof c&&(c=c.split(""));if(a instanceof Array){if(d=d||0,d<c.length){for(var f=[],g=0;g<a.length;g++)f.push(Ob(a[g],b,c,d+1,e));return f.join(c[d])}}else if("object"==typeof a)return e=
e||0,2>e?encodeURIComponent(Mb(a,b,c,d,e+1)):"...";return encodeURIComponent(String(a))};var S=function(){this.H=!1;this.c=Pb();this.B={};for(var a in Hb)this.B[Hb[a]]=[];this.f={};this.w=null;this.L=this.K=this.I=!1};S.a=function(){return S.b?S.b:S.b=new S};
var Qb=/<Ad[^>]+id=['"]([0-9]+)['"]/i,Rb=/Android|iPhone|iPod/i,T=function(a,b,c,d){a.f[c]=p(d,a);b.addEventListener?b.addEventListener(c,a.f[c],!1):b.attachEvent(c,a.f[c])},U=function(a,b,c){a.f[c]&&(b.removeEventListener?b.removeEventListener(c,a.f[c],!1):b.detachEvent&&b.detachEvent(c,a.f[c]),delete a.f[c])},Pb=function(){var a=/\/\/imasdk.googleapis.com\/js\/sdkloader\/vpaid_adapter[_a-z]*.js(\?.*)?$/,b=ra(k.document.scripts,function(b){return a.test(b.src)});if(!b)return null;var b=new K(b.src,
!0),c=b.a.get("adTagUrl");if(!c||0!=c.indexOf("http")&&0!=c.indexOf("//"))return null;var c=new K(c,!0),d=c.a.get("channel"),e="vpaidadp_html5";d&&(e=d+"+"+e);c.a.set("channel",e);Sb(b,c);return c},Sb=function(a,b){"https"==b.c&&r(["rdid","is_lat","idtype"],function(c){var d=a.a.get(c);d&&b.a.set(c,d)})},X=function(a,b,c){b=b||"Error";if(c){var d=c.toString();c.name&&-1==d.indexOf(c.name)&&(d+=": "+c.name);c.message&&-1==d.indexOf(c.message)&&(d+=": "+c.message);if(c.stack){c=c.stack;var e=d;try{-1==
c.indexOf(e)&&(c=e+"\n"+c);for(var f;c!=f;)f=c,c=c.replace(/((https?:\/..*\/)[^\/:]*:\d+(?:.|\n)*)\2/,"$1");d=c.replace(/\n */g,"\n")}catch(g){d=e}}b+=": "+d}V(a,5,b);a.L=!0;W(a,b);Tb(a)},Ub=function(a){a.u=La("DIV",{style:"position: absolute; z-index: 10000000"});a.G.insertBefore(a.u,a.G.firstChild);a.v=new google.ima.AdDisplayContainer(a.u,a.C);a.v.initialize();a.l=new google.ima.AdsLoader(a.v);var b=new google.ima.AdsRequest;a.c?(b.adTagUrl=a.c.toString(),b.linearAdSlotHeight=a.g,b.linearAdSlotWidth=
a.i,b.nonLinearAdSlotHeight=a.g,b.nonLinearAdSlotWidth=a.i):b.adsResponse=a.j;T(a,a.l,google.ima.AdsManagerLoadedEvent.Type.ADS_MANAGER_LOADED,a.ea);T(a,a.l,google.ima.AdErrorEvent.Type.AD_ERROR,a.ca);a.l.requestAds(b)},V=function(a,b,c){try{var d=new Kb;R(d,"event",b);var e=a.c&&a.c.a.get("client");e&&R(d,"web_property",e);R(d,"cpn","0");R(d,"break_type","0");R(d,"slot_pos","0");b="0";if(a.j){var f=Qb.exec(a.j);b=f?f[1]:b}R(d,"ad_id",b);R(d,"ad_sys","vpaid_html5_"+(a.c?"url":"inline"));R(d,"ad_len",
"0");R(d,"p_h",a.g||"0");R(d,"p_w",a.i||"0");R(d,"mt","0");R(d,"wt",(new Date).getTime());R(d,"sdkv","3.145.0");R(d,"vol","0");R(d,"content_v","");R(d,"conn","0");R(d,"format","0_2_0");c&&R(d,"error_msg",c);var g=Nb(d);g&&(Eb(g)?g&&Fb('javascript:"data:text/html,<body><img src=\\"'+g+'\\"></body>"'):g&&Gb(g))}catch(l){}};h=S.prototype;h.Y=function(){return"2.0"};
h.ba=function(a,b,c,d,e,f){this.i=a;this.g=b;this.D="fullscreen"==c?c:"normal";a=f&&f.slot;f=f&&f.videoSlot;this.j=(e=e&&e.AdParameters)?-1!=e.indexOf("&")?"document"in k?oa(e):pa(e):e:null;a&&f&&(this.c||this.j)?(this.G=a,this.C=f,Rb.test(k.navigator.userAgent)&&this.C.load(),this.K&&Ub(this)):X(this,"Error during init:"+(a?"":" ad slot is missing")+(f?"":" video slot is missing")+(this.c||this.j?"":" no ad VAST or URL found"))};
h.na=function(){if(Y(this))try{this.a.init(this.i,this.g,this.D),this.a.start()}catch(a){X(this,"",a)}else W(this)};h.oa=function(){this.I?Vb(this):Y(this)?this.a.stop():W(this)};h.ia=function(){Y(this)?this.a.pause():W(this)};h.ka=function(){Y(this)?this.a.resume():W(this)};h.ja=function(a,b,c){Y(this)?(this.i=a,this.g=b,this.D="fullscreen"==c?c:"normal",this.a.resize(this.i,this.g,this.D),this.b("AdSizeChange")):W(this)};
h.N=function(){Y(this)?(this.a.expand(),this.H=!0,this.b("AdExpandedChange")):W(this)};h.M=function(){Y(this)?(this.a.collapse(),this.H=!1,this.b("AdExpandedChange")):W(this)};h.ma=function(){Y(this)?this.a.getAdSkippableState()&&this.a.skip():W(this)};h.$=function(a,b,c){if(b=this.B[b]){var d={};d.o=a;d.scope=c;b.push(d)}};h.aa=function(a,b){var c=this.B[b];c&&sa(c,function(b){return b.o==a})};h.U=function(){return!0};h.X=function(){return this.i};h.S=function(){return this.g};h.R=function(){return this.H};
h.Z=function(){return this.a?this.a.getAdSkippableState():!1};h.V=function(){var a=-2;this.a&&(a=this.a.getRemainingTime(),-1==a&&(a=-2));return a};h.P=function(){return this.J?this.J.getDuration():-2};h.W=function(){return this.a?this.a.getVolume():-1};h.la=function(a){this.a&&this.a.setVolume(a)};h.O=function(){return""};h.T=function(){return!1};
var Y=function(a){return!a.L&&null!=a.a},Tb=function(a){a.a&&(a.a.destroy(),U(a,a.a,google.ima.AdEvent.Type.IMPRESSION),U(a,a.a,google.ima.AdEvent.Type.STARTED),U(a,a.a,google.ima.AdEvent.Type.CLICK),U(a,a.a,google.ima.AdEvent.Type.FIRST_QUARTILE),U(a,a.a,google.ima.AdEvent.Type.MIDPOINT),U(a,a.a,google.ima.AdEvent.Type.THIRD_QUARTILE),U(a,a.a,google.ima.AdEvent.Type.COMPLETE),U(a,a.a,google.ima.AdEvent.Type.PAUSED),U(a,a.a,google.ima.AdEvent.Type.RESUMED),U(a,a.a,google.ima.AdEvent.Type.SKIPPED),
U(a,a.a,google.ima.AdEvent.Type.SKIPPABLE_STATE_CHANGED),U(a,a.a,google.ima.AdEvent.Type.VOLUME_CHANGED),U(a,a.a,google.ima.AdEvent.Type.VOLUME_MUTED),U(a,a.a,google.ima.AdEvent.Type.USER_CLOSE),U(a,a.a,google.ima.AdEvent.Type.LOADED),U(a,a.a,google.ima.AdEvent.Type.LOG),U(a,a.a,google.ima.AdEvent.Type.ALL_ADS_COMPLETED),delete a.a);a.l&&(a.l.destroy(),delete a.l);a.v&&(a.v.destroy(),delete a.v);a.u&&(Na(a.u),delete a.u)};
S.prototype.b=function(a,b){var c=this.B[a];c&&r(c,function(a){a.o.apply(a.scope,b)})};var W=function(a,b){a.b("AdError",b?[b]:void 0)},Wb=function(a){if(null==a.w){var b=p(S.prototype.b,a,"AdRemainingTimeChange");a.w=k.setInterval(b,500)}},Xb=function(a){null!=a.w&&(k.clearInterval(a.w),a.w=null)};h=S.prototype;
h.ga=function(a){this.K=!0;U(this,a.target,"load");U(this,a.target,"error");google.ima.settings.setVpaidMode(google.ima.ImaSdkSettings.VpaidMode.INSECURE);google.ima.settings.setIsVpaidAdapter(!0);this.G&&this.C&&(this.c||this.j)&&Ub(this)};h.ha=function(a){U(this,a.target,"load");U(this,a.target,"error");X(this,"SdkLoadError")};
h.ea=function(a){this.a=a.getAdsManager(this.C);T(this,this.a,google.ima.AdEvent.Type.IMPRESSION,this.h);T(this,this.a,google.ima.AdEvent.Type.STARTED,this.h);T(this,this.a,google.ima.AdEvent.Type.CLICK,this.h);T(this,this.a,google.ima.AdEvent.Type.FIRST_QUARTILE,this.h);T(this,this.a,google.ima.AdEvent.Type.MIDPOINT,this.h);T(this,this.a,google.ima.AdEvent.Type.THIRD_QUARTILE,this.h);T(this,this.a,google.ima.AdEvent.Type.COMPLETE,this.h);T(this,this.a,google.ima.AdEvent.Type.PAUSED,this.h);T(this,
this.a,google.ima.AdEvent.Type.RESUMED,this.h);T(this,this.a,google.ima.AdEvent.Type.SKIPPED,this.h);T(this,this.a,google.ima.AdEvent.Type.SKIPPABLE_STATE_CHANGED,this.h);T(this,this.a,google.ima.AdEvent.Type.VOLUME_CHANGED,this.h);T(this,this.a,google.ima.AdEvent.Type.VOLUME_MUTED,this.h);T(this,this.a,google.ima.AdEvent.Type.USER_CLOSE,this.h);T(this,this.a,google.ima.AdEvent.Type.LOADED,this.da);T(this,this.a,google.ima.AdEvent.Type.ALL_ADS_COMPLETED,this.fa);this.b("AdLoaded")};
h.h=function(a){switch(a.type){case google.ima.AdEvent.Type.IMPRESSION:this.b("AdImpression");break;case google.ima.AdEvent.Type.STARTED:this.b("AdStarted");this.b("AdVideoStart");Wb(this);break;case google.ima.AdEvent.Type.CLICK:this.b("AdClickThru",["","",!1]);V(this,6);break;case google.ima.AdEvent.Type.FIRST_QUARTILE:this.b("AdVideoFirstQuartile");break;case google.ima.AdEvent.Type.MIDPOINT:this.b("AdVideoMidpoint");break;case google.ima.AdEvent.Type.THIRD_QUARTILE:this.b("AdVideoThirdQuartile");
break;case google.ima.AdEvent.Type.COMPLETE:this.b("AdVideoComplete");break;case google.ima.AdEvent.Type.PAUSED:this.b("AdPaused");Xb(this);break;case google.ima.AdEvent.Type.RESUMED:this.b("AdPlaying");Wb(this);break;case google.ima.AdEvent.Type.SKIPPED:this.b("AdSkipped");Xb(this);break;case google.ima.AdEvent.Type.SKIPPABLE_STATE_CHANGED:this.b("AdSkippableStateChange");break;case google.ima.AdEvent.Type.VOLUME_CHANGED:case google.ima.AdEvent.Type.VOLUME_MUTED:this.b("AdVolumeChange");break;case google.ima.AdEvent.Type.USER_CLOSE:this.b("AdUserClose")}};
h.da=function(a){this.J=a.getAd()};h.ca=function(a){var b=(a=a.getError?a.getError():null)?a.getMessage():"";X(this,b,a)};h.fa=function(){this.I=!0;Xb(this);V(this,3);Vb(this)};var Vb=function(a){k.setTimeout(function(){Tb(a);a.b("AdStopped")},100)};var Z=S.a();V(Z,2);var Yb=La("SCRIPT",{src:(Jb()?"https:":"http:")+"//imasdk.googleapis.com/js/sdkloader/ima3.js",type:"text/javascript"});T(Z,Yb,"load",Z.ga);T(Z,Yb,"error",Z.ha);var Zb=k.document;(Zb.body||Zb.head).appendChild(Yb);S.prototype.handshakeVersion=S.prototype.Y;S.prototype.initAd=S.prototype.ba;S.prototype.resizeAd=S.prototype.ja;S.prototype.startAd=S.prototype.na;S.prototype.stopAd=S.prototype.oa;S.prototype.pauseAd=S.prototype.ia;S.prototype.resumeAd=S.prototype.ka;
S.prototype.expandAd=S.prototype.N;S.prototype.collapseAd=S.prototype.M;S.prototype.skipAd=S.prototype.ma;S.prototype.subscribe=S.prototype.$;S.prototype.unsubscribe=S.prototype.aa;S.prototype.getAdLinear=S.prototype.U;S.prototype.getAdWidth=S.prototype.X;S.prototype.getAdHeight=S.prototype.S;S.prototype.getAdExpanded=S.prototype.R;S.prototype.getAdSkippableState=S.prototype.Z;S.prototype.getAdRemainingTime=S.prototype.V;S.prototype.getAdDuration=S.prototype.P;S.prototype.getAdVolume=S.prototype.W;
S.prototype.setAdVolume=S.prototype.la;S.prototype.getAdCompanions=S.prototype.O;S.prototype.getAdIcons=S.prototype.T;k.getVPAIDAd=function(){return S.a()};})();