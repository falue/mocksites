/**
 * Homegate 5.26.0
 * Build: 2016-08-30
 *
 * Copyright (c) 2016 Homegate AG. All rights reserved.
 */

/*! modernizr 3.3.1 (Custom Build) | MIT *
 * http://modernizr.com/download/?-canvas-cssanimations-csstransforms-geolocation-input-json-opacity-placeholder-search-svg-touchevents-willchange-addtest-printshiv-setclasses !*/
!function(a,b,c){function d(a,b){return typeof a===b}function e(){var a,b,c,e,f,g,h;for(var i in t)if(t.hasOwnProperty(i)){if(a=[],b=t[i],b.name&&(a.push(b.name.toLowerCase()),b.options&&b.options.aliases&&b.options.aliases.length))for(c=0;c<b.options.aliases.length;c++)a.push(b.options.aliases[c].toLowerCase());for(e=d(b.fn,"function")?b.fn():b.fn,f=0;f<a.length;f++)g=a[f],h=g.split("."),1===h.length?v[h[0]]=e:(!v[h[0]]||v[h[0]]instanceof Boolean||(v[h[0]]=new Boolean(v[h[0]])),v[h[0]][h[1]]=e),x.push((e?"":"no-")+h.join("-"))}}function f(a){var b=y.className,c=v._config.classPrefix||"";if(z&&(b=b.baseVal),v._config.enableJSClass){var d=new RegExp("(^|\\s)"+c+"no-js(\\s|$)");b=b.replace(d,"$1"+c+"js$2")}v._config.enableClasses&&(b+=" "+c+a.join(" "+c),z?y.className.baseVal=b:y.className=b)}function g(a,b){if("object"==typeof a)for(var c in a)w(a,c)&&g(c,a[c]);else{a=a.toLowerCase();var d=a.split("."),e=v[d[0]];if(2==d.length&&(e=e[d[1]]),"undefined"!=typeof e)return v;b="function"==typeof b?b():b,1==d.length?v[d[0]]=b:(!v[d[0]]||v[d[0]]instanceof Boolean||(v[d[0]]=new Boolean(v[d[0]])),v[d[0]][d[1]]=b),f([(b&&0!=b?"":"no-")+d.join("-")]),v._trigger(a,b)}return v}function h(){return"function"!=typeof b.createElement?b.createElement(arguments[0]):z?b.createElementNS.call(b,"http://www.w3.org/2000/svg",arguments[0]):b.createElement.apply(b,arguments)}function i(){var a=b.body;return a||(a=h(z?"svg":"body"),a.fake=!0),a}function j(a,c,d,e){var f,g,j,k,l="modernizr",m=h("div"),n=i();if(parseInt(d,10))for(;d--;)j=h("div"),j.id=e?e[d]:l+(d+1),m.appendChild(j);return f=h("style"),f.type="text/css",f.id="s"+l,(n.fake?n:m).appendChild(f),n.appendChild(m),f.styleSheet?f.styleSheet.cssText=a:f.appendChild(b.createTextNode(a)),m.id=l,n.fake&&(n.style.background="",n.style.overflow="hidden",k=y.style.overflow,y.style.overflow="hidden",y.appendChild(n)),g=c(m,a),n.fake?(n.parentNode.removeChild(n),y.style.overflow=k,y.offsetHeight):m.parentNode.removeChild(m),!!g}function k(a,b){return!!~(""+a).indexOf(b)}function l(a){return a.replace(/([A-Z])/g,function(a,b){return"-"+b.toLowerCase()}).replace(/^ms-/,"-ms-")}function m(b,d){var e=b.length;if("CSS"in a&&"supports"in a.CSS){for(;e--;)if(a.CSS.supports(l(b[e]),d))return!0;return!1}if("CSSSupportsRule"in a){for(var f=[];e--;)f.push("("+l(b[e])+":"+d+")");return f=f.join(" or "),j("@supports ("+f+") { #modernizr { position: absolute; } }",function(a){return"absolute"==getComputedStyle(a,null).position})}return c}function n(a){return a.replace(/([a-z])-([a-z])/g,function(a,b,c){return b+c.toUpperCase()}).replace(/^-/,"")}function o(a,b,e,f){function g(){j&&(delete J.style,delete J.modElem)}if(f=!d(f,"undefined")&&f,!d(e,"undefined")){var i=m(a,e);if(!d(i,"undefined"))return i}for(var j,l,o,p,q,r=["modernizr","tspan"];!J.style;)j=!0,J.modElem=h(r.shift()),J.style=J.modElem.style;for(o=a.length,l=0;o>l;l++)if(p=a[l],q=J.style[p],k(p,"-")&&(p=n(p)),J.style[p]!==c){if(f||d(e,"undefined"))return g(),"pfx"!=b||p;try{J.style[p]=e}catch(s){}if(J.style[p]!=q)return g(),"pfx"!=b||p}return g(),!1}function p(a,b){return function(){return a.apply(b,arguments)}}function q(a,b,c){var e;for(var f in a)if(a[f]in b)return c===!1?a[f]:(e=b[a[f]],d(e,"function")?p(e,c||b):e);return!1}function r(a,b,c,e,f){var g=a.charAt(0).toUpperCase()+a.slice(1),h=(a+" "+H.join(g+" ")+g).split(" ");return d(b,"string")||d(b,"undefined")?o(h,b,e,f):(h=(a+" "+K.join(g+" ")+g).split(" "),q(h,b,c))}function s(a,b,d){return r(a,c,c,b,d)}var t=[],u={_version:"3.3.1",_config:{classPrefix:"",enableClasses:!0,enableJSClass:!0,usePrefixes:!0},_q:[],on:function(a,b){var c=this;setTimeout(function(){b(c[a])},0)},addTest:function(a,b,c){t.push({name:a,fn:b,options:c})},addAsyncTest:function(a){t.push({name:null,fn:a})}},v=function(){};v.prototype=u,v=new v;var w,x=[],y=b.documentElement,z="svg"===y.nodeName.toLowerCase();!function(){var a={}.hasOwnProperty;w=d(a,"undefined")||d(a.call,"undefined")?function(a,b){return b in a&&d(a.constructor.prototype[b],"undefined")}:function(b,c){return a.call(b,c)}}(),u._l={},u.on=function(a,b){this._l[a]||(this._l[a]=[]),this._l[a].push(b),v.hasOwnProperty(a)&&setTimeout(function(){v._trigger(a,v[a])},0)},u._trigger=function(a,b){if(this._l[a]){var c=this._l[a];setTimeout(function(){var a,d;for(a=0;a<c.length;a++)(d=c[a])(b)},0),delete this._l[a]}},v._q.push(function(){u.addTest=g}),z||!function(a,b){function c(a,b){var c=a.createElement("p"),d=a.getElementsByTagName("head")[0]||a.documentElement;return c.innerHTML="x<style>"+b+"</style>",d.insertBefore(c.lastChild,d.firstChild)}function d(){var a=y.elements;return"string"==typeof a?a.split(" "):a}function e(a,b){var c=y.elements;"string"!=typeof c&&(c=c.join(" ")),"string"!=typeof a&&(a=a.join(" ")),y.elements=c+" "+a,j(b)}function f(a){var b=x[a[v]];return b||(b={},w++,a[v]=w,x[w]=b),b}function g(a,c,d){if(c||(c=b),q)return c.createElement(a);d||(d=f(c));var e;return e=d.cache[a]?d.cache[a].cloneNode():u.test(a)?(d.cache[a]=d.createElem(a)).cloneNode():d.createElem(a),!e.canHaveChildren||t.test(a)||e.tagUrn?e:d.frag.appendChild(e)}function h(a,c){if(a||(a=b),q)return a.createDocumentFragment();c=c||f(a);for(var e=c.frag.cloneNode(),g=0,h=d(),i=h.length;i>g;g++)e.createElement(h[g]);return e}function i(a,b){b.cache||(b.cache={},b.createElem=a.createElement,b.createFrag=a.createDocumentFragment,b.frag=b.createFrag()),a.createElement=function(c){return y.shivMethods?g(c,a,b):b.createElem(c)},a.createDocumentFragment=Function("h,f","return function(){var n=f.cloneNode(),c=n.createElement;h.shivMethods&&("+d().join().replace(/[\w\-:]+/g,function(a){return b.createElem(a),b.frag.createElement(a),'c("'+a+'")'})+");return n}")(y,b.frag)}function j(a){a||(a=b);var d=f(a);return!y.shivCSS||p||d.hasCSS||(d.hasCSS=!!c(a,"article,aside,dialog,figcaption,figure,footer,header,hgroup,main,nav,section{display:block}mark{background:#FF0;color:#000}template{display:none}")),q||i(a,d),a}function k(a){for(var b,c=a.getElementsByTagName("*"),e=c.length,f=RegExp("^(?:"+d().join("|")+")$","i"),g=[];e--;)b=c[e],f.test(b.nodeName)&&g.push(b.applyElement(l(b)));return g}function l(a){for(var b,c=a.attributes,d=c.length,e=a.ownerDocument.createElement(A+":"+a.nodeName);d--;)b=c[d],b.specified&&e.setAttribute(b.nodeName,b.nodeValue);return e.style.cssText=a.style.cssText,e}function m(a){for(var b,c=a.split("{"),e=c.length,f=RegExp("(^|[\\s,>+~])("+d().join("|")+")(?=[[\\s,>+~#.:]|$)","gi"),g="$1"+A+"\\:$2";e--;)b=c[e]=c[e].split("}"),b[b.length-1]=b[b.length-1].replace(f,g),c[e]=b.join("}");return c.join("{")}function n(a){for(var b=a.length;b--;)a[b].removeNode()}function o(a){function b(){clearTimeout(g._removeSheetTimer),d&&d.removeNode(!0),d=null}var d,e,g=f(a),h=a.namespaces,i=a.parentWindow;return!B||a.printShived?a:("undefined"==typeof h[A]&&h.add(A),i.attachEvent("onbeforeprint",function(){b();for(var f,g,h,i=a.styleSheets,j=[],l=i.length,n=Array(l);l--;)n[l]=i[l];for(;h=n.pop();)if(!h.disabled&&z.test(h.media)){try{f=h.imports,g=f.length}catch(o){g=0}for(l=0;g>l;l++)n.push(f[l]);try{j.push(h.cssText)}catch(o){}}j=m(j.reverse().join("")),e=k(a),d=c(a,j)}),i.attachEvent("onafterprint",function(){n(e),clearTimeout(g._removeSheetTimer),g._removeSheetTimer=setTimeout(b,500)}),a.printShived=!0,a)}var p,q,r="3.7.3",s=a.html5||{},t=/^<|^(?:button|map|select|textarea|object|iframe|option|optgroup)$/i,u=/^(?:a|b|code|div|fieldset|h1|h2|h3|h4|h5|h6|i|label|li|ol|p|q|span|strong|style|table|tbody|td|th|tr|ul)$/i,v="_html5shiv",w=0,x={};!function(){try{var a=b.createElement("a");a.innerHTML="<xyz></xyz>",p="hidden"in a,q=1==a.childNodes.length||function(){b.createElement("a");var a=b.createDocumentFragment();return"undefined"==typeof a.cloneNode||"undefined"==typeof a.createDocumentFragment||"undefined"==typeof a.createElement}()}catch(c){p=!0,q=!0}}();var y={elements:s.elements||"abbr article aside audio bdi canvas data datalist details dialog figcaption figure footer header hgroup main mark meter nav output picture progress section summary template time video",version:r,shivCSS:s.shivCSS!==!1,supportsUnknownElements:q,shivMethods:s.shivMethods!==!1,type:"default",shivDocument:j,createElement:g,createDocumentFragment:h,addElements:e};a.html5=y,j(b);var z=/^$|\b(?:all|print)\b/,A="html5shiv",B=!q&&function(){var c=b.documentElement;return!("undefined"==typeof b.namespaces||"undefined"==typeof b.parentWindow||"undefined"==typeof c.applyElement||"undefined"==typeof c.removeNode||"undefined"==typeof a.attachEvent)}();y.type+=" print",y.shivPrint=o,o(b),"object"==typeof module&&module.exports&&(module.exports=y)}("undefined"!=typeof a?a:this,b);var A=u._config.usePrefixes?" -webkit- -moz- -o- -ms- ".split(" "):[];u._prefixes=A;var B=u.testStyles=j;v.addTest("touchevents",function(){var c;if("ontouchstart"in a||a.DocumentTouch&&b instanceof DocumentTouch)c=!0;else{var d=["@media (",A.join("touch-enabled),("),"heartz",")","{#modernizr{top:9px;position:absolute}}"].join("");B(d,function(a){c=9===a.offsetTop})}return c}),v.addTest("svg",!!b.createElementNS&&!!b.createElementNS("http://www.w3.org/2000/svg","svg").createSVGRect),v.addTest("willchange","willChange"in y.style);var C=function(){function a(a,b){var e;return!!a&&(b&&"string"!=typeof b||(b=h(b||"div")),a="on"+a,e=a in b,!e&&d&&(b.setAttribute||(b=h("div")),b.setAttribute(a,""),e="function"==typeof b[a],b[a]!==c&&(b[a]=c),b.removeAttribute(a)),e)}var d=!("onblur"in b.documentElement);return a}();u.hasEvent=C,v.addTest("inputsearchevent",C("search")),v.addTest("geolocation","geolocation"in navigator),v.addTest("json","JSON"in a&&"parse"in JSON&&"stringify"in JSON),v.addTest("placeholder","placeholder"in h("input")&&"placeholder"in h("textarea"));var D=h("input"),E="autocomplete autofocus list placeholder max min multiple pattern required step".split(" "),F={};v.input=function(b){for(var c=0,d=b.length;d>c;c++)F[b[c]]=!!(b[c]in D);return F.list&&(F.list=!(!h("datalist")||!a.HTMLDataListElement)),F}(E),v.addTest("opacity",function(){var a=h("a").style;return a.cssText=A.join("opacity:.55;"),/^0.55$/.test(a.opacity)}),v.addTest("canvas",function(){var a=h("canvas");return!(!a.getContext||!a.getContext("2d"))});var G="Moz O ms Webkit",H=u._config.usePrefixes?G.split(" "):[];u._cssomPrefixes=H;var I={elem:h("modernizr")};v._q.push(function(){delete I.elem});var J={style:I.elem.style};v._q.unshift(function(){delete J.style});var K=u._config.usePrefixes?G.toLowerCase().split(" "):[];u._domPrefixes=K,u.testAllProps=r,u.testAllProps=s,v.addTest("cssanimations",s("animationName","a",!0)),v.addTest("csstransforms",function(){return-1===navigator.userAgent.indexOf("Android 2.")&&s("transform","scale(1)",!0)}),e(),f(x),delete u.addTest,delete u.addAsyncTest;for(var L=0;L<v._q.length;L++)v._q[L]();a.Modernizr=v}(window,document);