var cre_templateclient=function(e,n){function t(e,n){null!=n.max_count&&null!=n.count&&(n.free_count=n.max_count-n.count);var t=e.match(/{{[a-zA-Z._-]+}}/g);for(i in t){var r=t[i].replace(/{|}/g,""),o=a(n,r);null!=o&&(e=e.replace(RegExp(t[i],"g"),o))}return e}function a(e,n){for(var t=n.split("."),a=t.pop();n=t.shift();)if(e=e[n],"object"!=typeof e||!e)return;return e[a]}function r(e){var n=o(e),t=f(e),a=e.templatesets[t];if(null==a){var i=[];for(var r in e.templatesets)i.push(r);throw Error('Did not find templateset with name "'+t+'". Known templatesets are: "'+i.join('", "')+'".')}var l=a[n];if(null==l)throw Error('Did not find template with name "'+n+'" in template set "'+t+'".');return l}function o(e){if(e.template_name)return e.template_name;var t=e.tracking_response;if(null!=t)return t.template_id?t.template_id:n}function l(e,n){e||(e="body"),w[e]?w[e].push(n):w[e]=[n]}function d(n){var a=n.container_id;g(a);var i=e.document.body;if(null!=a&&(i=document.getElementById(a)||i),null!=n.template.css){var r=document.createElement("style");r.setAttribute("type","text/css"),r.styleSheet?r.styleSheet.cssText=n.template.css:r.appendChild(document.createTextNode(n.template.css)),i.appendChild(r),l(a,r)}var o=n.tracking_response||n.response||{};if(p(o),o.window={location:{origin:e.location.protocol+"//"+e.location.hostname+(e.location.port?":"+e.location.port:"")}},null!=n.template.html){var d=t(n.template.html,o),c=document.createElement("div");c.innerHTML=d,i.appendChild(c),l(a,c)}if(null!=n.template.js){var m=Function("data",n.template.js);m(o)}var s=this;k=function(e){"close_overlay"===e.data.command&&(null!=e.data.redirect_url?s.location.href=e.data.redirect_url:s.location.reload())},e.addEventListener?e.addEventListener("message",k,!1):e.attachEvent&&e.attachEvent("onmessage",k)}function c(){null!=b&&b()}function m(e){return(e+"").replace(/[<>]/g,function(e){return E[e]})}function s(e,t){return self.debug?(console.log("[DEBUG] "+e+": "+JSON.stringify(t)),n):null}function u(e,n){var t=document.createElement("script");t.async=!0,t.src=e,t.id="jsonp_"+n,s("Requested script",t.src);var a=document.head||document.getElementsByTagName("head")[0];a?a.appendChild(t):document.body.appendChild(t)}function p(e){for(var n,t=/cre_user_info_(.*?)=(.*?)(;|$)/g;null!==(n=t.exec(document.cookie));){var a=n[2],i=decodeURIComponent(a);e[n[1]]=m(i)}}function _(t){function a(){null==t.templatesets&&null!=e.cre_templatesets&&(t.templatesets=e.cre_templatesets.templatesets)}function i(){a(),d({template:r(t),tracking_response:t.tracking_response,container_id:t.container_id})}function l(){var a=f(t),i=o(t);if(null!=i&&null!=a){var r=Math.floor(1e5*Math.random()),l="cre_callback_"+r;e[l]=function(a){d({template:a,tracking_response:t.tracking_response,container_id:t.container_id});var i=document.getElementById("jsonp_"+r);i&&i.parentNode&&i.parentNode.removeChild(i),e[l]=n};var c="${cre_template_url}",m={_c:l,templateset:a,template_id:i},s=v(m);u(c+s)}}t=t||{};var c=t.tracking_response;if(c)if(c.template_id!==n){if(null===c.template_id||""===c.template_id)return}else if(null==c.type||"none"==c.type)return;a(),null==t.templatesets?(b=i,l()):i()}function f(e){return e.templateset_name||e.tracking_response&&e.tracking_response.template_set||"default"}function v(e){var n=[];for(var t in e)if(e.hasOwnProperty(t)){var a=encodeURIComponent(e[t]);""!==a&&n.push(t+"="+a)}return"?"+n.join("&")}function g(n){n||(n="body"),C(),e.removeEventListener?e.removeEventListener("message",k,!1):e.detachEvent&&e.detachEvent("message",k,!1);var t=w[n];if(t)for(;t.length>0;){var a=t.pop();a.parentNode&&a.parentNode.removeChild(a)}}function h(e){if("function"!=typeof e)throw Error("ondestroy() only accepts a function as argument.");C=e}function N(n){function t(e){n.tracking_response=e.data,n.cre_client.addListener(t),_(n)}n=n||{},null==n.cre_client&&(n.cre_client=e.cre_client),n.cre_client.addListener(t)}var y,k=null,w={},b=null,E={"<":"&lt;",">":"&gt;"},C=function(){},O=null,R={load_templatesets:c,show:_,setup:N,destroy:g,ondestroy:h,showOfferPage:O,trackOfferSubmitClick:function(e){"function"==typeof y&&y(e)}};return R}(this);