// (c) Copyright 2000-2016 cmsbox GmbH, Bern, Switzerland. All Rights Reserved.
// Date: 2016-09-20T08:01:06.069365

var expiryHandler=null;
var _zoomImage=(Prototype.Browser.IE&&!window.XMLHttpRequest)?"/icons/ie6zoom.png":"/icons/zoom.png";
var _zoomImageClass="zoom";
var _zoomImageSize=35;
var debugging=false;
var _googlemaps={};
var _googlemaps_positions={};
var CmsboxDetect={version:"2.5",copyright:"(c) Copyright 2007-2014 cmsbox GmbH. All Rights Reserved. http://www.cmsbox.com",setup:function(){try{this._setup($("root"))
}catch(error){return
}},_setup:function(root){if(!root){return
}if(navigator.userAgent.match(/MSIE\s*10/ig)||navigator.appVersion.match(/MSIE\s*10/ig)||navigator.userAgent.match(/Trident\/6./ig)){root.addClassName("ie10")
}if(navigator.userAgent.match(/MSIE\s*11/ig)||navigator.appVersion.match(/MSIE\s*11/ig)||navigator.userAgent.match(/Trident\/7./ig)){root.addClassName("ie11")
}}};
CmsboxDetect.setup();
var Cmsbox={version:"2.5",copyright:"(c) Copyright 2007-2014 cmsbox GmbH. All Rights Reserved. http://www.cmsbox.com",setup:function(){$$(".flash").each(function(each){try{each.style.visibility="visible"
}catch(e){}})
},debug:function(symbol,element){if(!debugging){return true
}try{if(console&&console.log){if(symbol){console.log(symbol)
}if(element){console.log(element)
}}}catch(error){alert(symbol+": "+element)
}return false
},debug_ids:function(bool){var last_id=0;
$$("*").each(function(each){var each=$(each);
var id=each.readAttribute("id");
if(bool){if(!id){each.writeAttribute("id","__debug__"+last_id++)
}}else{if(/__debug__/i.test(id)){each.removeAttribute("id")
}}})
},_ieModern:function(){return Prototype.Browser.IE&&(navigator.userAgent.indexOf("MSIE 9.")>=0||(/MSIE 1\d+\./i.test(navigator.userAgent)))
},intro:function(milliseconds,url){var self=this;
var delay=parseInt(milliseconds,10)||5000;
window.setTimeout(function(){self.on_click_intro(url)
},delay)
},on_click_intro:function(url){window.location.href=(url||"/")
},copy_link:function(anchor,input){var anchor=$(anchor);
var input=$(input);
if(anchor&&input){Event.observe(anchor,"click",function(event){input.toggleClassName("cb-input-clipboard-invisible");
if(!input.hasClassName("cb-input-clipboard-invisible")){input.focus();
input.select()
}Event.stop(event);
return false
})
}},toJSON:function(value){if(window.Object&&Object.toJSON){return Object.toJSON(value)
}if(value&&value.toJSON){return value.toJSON()
}if(window.JSON&&JSON.stringify){return JSON.stringify(value)
}},_mobile:false,isMobile:function(){if(Cmsbox._mobile){return Cmsbox._mobile
}var mobile=false;
if(/android|iphone|ipad|ipod|playbook|rim|blackberry|windows phone|windows ce|kindle|iemobile|nintendo|symbian|symbos|palm|webos|wosbrowser|mobile/i.test(window.navigator.userAgent)||$$(".cb-mobile").length>0){mobile=true
}Cmsbox._mobile=mobile;
return mobile
},isTouchSupported:function(){try{return"ontouchstart" in window&&this.isMobile()
}catch(error){return false
}},isEditmode:function(){return !!($("edit"))
},isEditing:function(){try{return this.isEditmode()&&!!window.Lingos&&(!Lingos||(!Lingos._activeLingo&&!Lingos._editing))
}catch(error){return false
}},hasLightbox:function(){var lightbox=$("disp");
return !!lightbox&&lightbox&&lightbox.visible()
},crop:function(element){element=$(element);
var image=element.down("img");
if(image){var relative;
var on_resize=function(){relative=Position.cumulativeOffset(element)
};
on_resize();
element.observe("mousemove",function(event){var x=(Event.pointerX(event)-relative[0])/element.offsetWidth;
var y=(Event.pointerY(event)-relative[1])/element.offsetHeight;
var x_normalized=Math.min(1,Math.max(0,x));
var y_normalized=Math.min(1,Math.max(0,y));
var left=-1*(image.offsetWidth-element.offsetWidth)*x_normalized;
var top=-1*(image.offsetHeight-element.offsetHeight)*y_normalized;
image.style.left=left+"px";
image.style.top=top+"px"
}.bindAsEventListener(this));
Event.observe(window,"resize",function(event){on_resize()
})
}},zoom:function(element){var self=this;
var element=$(element);
if(!element){return
}if((element.ancestors().detect(function(each){return each.hasClassName("body-mobile")
}))){var zoom=document.createElement("img");
if(Prototype.Browser.IE){Element.extend(zoom)
}zoom.src=_zoomImage;
zoom.addClassName(_zoomImageClass);
element.appendChild(zoom)
}else{if(!document.body.hasClassName("cb-mobile")){Event.observe(element,"mouseover",function(event){var eventElement=Event.element(event);
if(Prototype.Browser.IE){Element.extend(eventElement)
}if(!element.hasClassName(_zoomImageClass)&&eventElement&&(event.relatedTarget!=element)&&!(element.descendants().detect(function(each){return each==event.relatedTarget
}))){Cmsbox._zoomOn(element)
}});
Event.observe(element,"mouseout",function(event){var eventElement=Event.element(event);
if(Prototype.Browser.IE){Element.extend(eventElement)
}if(element.hasClassName(_zoomImageClass)&&eventElement&&(event.relatedTarget!=element)&&!(element.descendants().detect(function(each){return each==event.relatedTarget
}))){Cmsbox._zoomOff(element)
}})
}}},_zoomOn:function(element){var self=this;
var element=$(element);
if(!element){return false
}element.addClassName(_zoomImageClass);
var zoom=document.createElement("img");
if(Prototype.Browser.IE){Element.extend(zoom)
}zoom.src=_zoomImage;
zoom.addClassName(_zoomImageClass);
element.appendChild(zoom);
return true
},_zoomOff:function(element){var self=this;
var element=$(element);
if(!element){return false
}element.removeClassName(_zoomImageClass);
element.descendants().each(function(each){if(/(img)|(div)/i.test(each.tagName)&&each.hasClassName(_zoomImageClass)){element.removeChild(each)
}});
return true
},google_map_loaded:function(){if(Prototype.Browser.WebKit){if(navigator.userAgent&&navigator.userAgent.indexOf("Safari")>=0&&navigator.userAgent.indexOf("Version/5")>=0){Cmsbox._google_map_loaded.delay(1)
}}},_google_map_loaded:function(){$$(".cb-googlemapscontainer div").select(function(each){var style=each.style["-webkit-transform"];
return style&&style.indexOf("translateZ")>=0
}).each(function(each){each.style["-webkit-transform"]=null
})
},lightbox:function(lightbox,overlay){lightbox=$(lightbox);
overlay=$(overlay);
if(!lightbox||!overlay){return false
}var page=Position.pageBounds();
var windowBounds=Position.windowBounds();
overlay.style.height=Math.max(page[1],windowBounds[1],lightbox.cumulativeOffset().top+lightbox.getHeight())+"px";
this.lightboxPosition(lightbox);
try{$$("#desk input","#desk select","#desk textarea").each(function(each){if(Prototype.Browser.IE){each.style.visibility="hidden"
}each.disabled="true"
})
}catch(error){}lightbox.style.display="block";
overlay.style.display="block"
},lightboxPosition:function(lightbox){if(!(/fixed/i).test(lightbox.getStyle("position")||"")){lightbox.style.marginTop=Position.windowOffset()[1]+"px"
}else{lightbox.style.marginTop=""
}},lightboxCloseHandler:function(quitAnchorId,overlayId,callback){var self=this;
var quitAnchor=$(quitAnchorId);
var overlay=$(overlayId);
onclickHandler=function(){if(typeof callback=="function"){try{callback();
self._lightboxUrlHandler(quitAnchor)
}catch(error){}try{$$("#desk input","#desk select","#desk textarea").each(function(each){if(Prototype.Browser.IE){each.style.visibility="visible"
}each.disabled=false
})
}catch(error){}}else{if(window&&quitAnchor.href){window.location.href=quitAnchor.href
}}if(typeof CmsboxNavigationScroll!="undefined"){CmsboxNavigationScroll._update_anchors()
}return false
};
if(quitAnchor){quitAnchor.onclick=onclickHandler
}if(overlay){overlay.onclick=onclickHandler
}},lightboxOpenHandler:function(element_or_id,title_explicit,href_explicit){return this._lightboxUrlHandler(element_or_id,title_explicit,href_explicit)
},_lightboxUrlHandler:function(element_or_id,title_explicit,href_explicit){var element=$(element_or_id);
if(window&&window.history&&history&&history.pushState){var title=title_explicit||(element&&(element.title||element.readAttribute("title")||element.readAttribute("data-title"))||"");
var href=href_explicit||(element&&(element.href||element.readAttribute("href")||element.readAttribute("data-href"))||"");
history.pushState({location:window.location.href},title,href)
}},lightboxLinks:function(){var self=this;
$$("#lbox div.prev a, #lbox div.next a, #lbox div.body a").each(function(each){var element=$(each);
if(element.hasAttribute("onclick")){Event.observe(element,"click",function(event){self._lightboxUrlHandler(element)
})
}if(element.hasAttribute("onclick")){var onclick;
if(Prototype.Browser.IE){onclick=element.onclick
}else{onclick=element.readAttribute("onclick")
}var fn=function(element,callback){if(Prototype.Browser.IE){element.onclick=onclick
}else{element.setAttribute("onclick",callback)
}element.removeClassName("fade")
};
fn.delay(0.2,element,onclick);
element.setAttribute("onclick","return false;");
element.addClassName("fade")
}})
},updateShoppingCartCounters:function(){$$(".cb-cart-updatable").each(function(each){try{var string=each.readAttribute("data-cart-updater");
if(string){eval(string)
}}catch(error){}})
},removeShoppingCartItem:function(anchorId,callback){try{var anchor=$(""+anchorId);
if(anchor){var row=anchor.ancestors().select(function(each){return(/tr/i).test(each.tagName)
})[0];
if(row&&Effect.Fade){Effect.Fade($(row),{duration:0.3,afterFinish:function(){callback()
}});
return
}}}catch(error){}callback()
},shippingDefinitionCountryTab:function(tabId,contentsId){var tab=$(""+tabId);
var contents=$(""+contentsId);
if(tab&&contents){$$(".cb-shipping-definition-selected").each(function(each){each.removeClassName("cb-shipping-definition-selected")
});
tab.addClassName("cb-shipping-definition-selected");
contents.addClassName("cb-shipping-definition-selected")
}},shippingDefinitionInputTitle:function(inputId,anchorId){var input=$(""+inputId);
var anchor=$(""+anchorId);
if(input&&anchor){var text=anchor.innerHTML;
input.observe("keyup",function(event){anchor.innerHTML=input.value||text
})
}},decodeAnchors:function(){$$("a").each(function(each){var title,href,decoded,beforeInnerHTML;
if(each.hasAttribute("data-title")){title=each.readAttribute("data-title");
decoded=Cmsbox.decode(title);
each.setAttribute("title",decoded)
}if(each.hasAttribute("data-mailto")){href=each.readAttribute("data-mailto");
decoded="mailto:"+Cmsbox.decode(href);
if(Prototype.Browser.IE){beforeInnerHTML=each.innerHTML
}each.setAttribute("href",decoded);
if(Prototype.Browser.IE){each.innerHTML=beforeInnerHTML
}}})
},decode:function(input){var i=0;
var output="";
var chr1,chr2,chr3;
var enc1,enc2,enc3,enc4;
var keyStr="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
input=input.replace(/[^A-Za-z0-9\+\/\=]/g,"");
do{enc1=keyStr.indexOf(input.charAt(i++));
enc2=keyStr.indexOf(input.charAt(i++));
enc3=keyStr.indexOf(input.charAt(i++));
enc4=keyStr.indexOf(input.charAt(i++));
chr1=(enc1<<2)|(enc2>>4);
chr2=((enc2&15)<<4)|(enc3>>2);
chr3=((enc3&3)<<6)|enc4;
output+=String.fromCharCode(chr1);
if(enc3!=64){output+=String.fromCharCode(chr2)
}if(enc4!=64){output+=String.fromCharCode(chr3)
}}while(i<input.length);
return output
},encode_utf8:function(plain){plain=plain.replace(/\r\n/g,"\n");
var utf8encoded="";
for(var n=0;
n<plain.length;
n++){var c=plain.charCodeAt(n);
if(c<128){utf8encoded+=String.fromCharCode(c)
}else{if((c>127)&&(c<2048)){utf8encoded+=String.fromCharCode((c>>6)|192);
utf8encoded+=String.fromCharCode((c&63)|128)
}else{utf8encoded+=String.fromCharCode((c>>12)|224);
utf8encoded+=String.fromCharCode(((c>>6)&63)|128);
utf8encoded+=String.fromCharCode((c&63)|128)
}}}return utf8encoded
},decode_utf8:function(utf8encoded){var plain="";
var c,c1,c2,i;
c=c1=c2=i=0;
while(i<utf8encoded.length){c=utf8encoded.charCodeAt(i);
if(c<128){plain+=String.fromCharCode(c);
i++
}else{if((c>191)&&(c<224)){c2=utf8encoded.charCodeAt(i+1);
plain+=String.fromCharCode(((c&31)<<6)|(c2&63));
i+=2
}else{c2=utf8encoded.charCodeAt(i+1);
c3=utf8encoded.charCodeAt(i+2);
plain+=String.fromCharCode(((c&15)<<12)|((c2&63)<<6)|(c3&63));
i+=3
}}}return plain
},navigation:function(element){var self=this;
var element=$(element);
if(element){self._on_click_fake_mobile_hover_navigation(element,function(item){return item&&(navigator.userAgent.search(/android/i)>=0||self.navigation_visible(item))
});
element.observe("mouseover",function(event){element.childElements().select(function(each){return each.hasClassName("navi")
}).each(function(each){each.addClassName("hover");
each.removeClassName("cb-invisible")
})
}.bindAsEventListener(this));
element.observe("mouseout",function(event){element.childElements().select(function(each){return each.hasClassName("navi")
}).each(function(each){marked=each.descendants().detect(function(hoverable){return hoverable.hasClassName("mark")||hoverable.hasClassName("grow")
});
if(!marked){each.removeClassName("hover");
each.addClassName("cb-invisible")
}})
}.bindAsEventListener(this));
return true
}return false
},fake_hover_navigation:function(element,condition_callback){var self=this;
try{self._on_click_fake_mobile_hover_navigation(element,condition_callback||function(item){return item&&(navigator.userAgent.search(/android/i)>=0||self.isMobile())
})
}catch(e){}},fake_hover_navigations:function(selector,condition_callback){var self=this;
$$(selector).each(function(each){self.fake_hover_navigation(each,condition_callback)
})
},_on_click_fake_mobile_hover_navigation:function(element,condition_callback){var condition=false;
var element=$(element);
try{condition=condition_callback&&condition_callback(element)
}catch(e){return
}if(condition){var anchors=element.descendants().select(function(each){return each.hasClassName("menu")
});
var _current=null;
var _clicks={};
anchors.each(function(each){each.observe("click",function(event){if(!_current||each!=_current){_clicks={}
}_current=each;
var clicks=(_clicks[each]||0)+1;
_clicks[each]=clicks;
var siblings=0;
each.siblings().each(function(each){siblings+=each.childElements().length||0
});
if(clicks<=1&&siblings>0){Event.stop(event);
event.preventDefault()
}})
})
}},navigation_visible:function(element){return this.isMobile()&&$(new Selector(".cb-invisible").findElements(element)).any(function(each){return each.getStyle("display")!="none"&&each.getStyle("visibility")!="hidden"
})
},select:function(element){var element=$(element);
element.onfocus=function(event){Form.Element.select(element)
}
},exampleClear:function(element,text,classname){var element=$(element);
if(element){elementText=Cmsbox.decode_utf8(text||"");
element.observe("focus",function(event){if(element.value!=elementText&&element.value!=text){element.removeClassName(classname)
}if(element.value==elementText||element.value==text){element.clear()
}})
}},suppressEnter:function(element){var element=$(element);
if(element){var disable=function(event){if(event.keyCode==13){Event.stop(event);
event.preventDefault();
return false
}};
Element.observe(element,"keyup",disable);
Element.observe(element,"keypress",disable);
Element.observe(element,"keydown",disable)
}},removeSuccess:function(text){$$("input.success").each(function(each){each.removeClassName("success");
each.title=Cmsbox.decode_utf8(text||"")
})
},addSuccess:function(element,text){var element=$(element);
if(element){element.addClassName("success");
element.title=Cmsbox.decode_utf8(text||"")
}},resetShopPart:function(button,id,fadeclassname,failclassname,hintclass,commentText){var button=$(id);
var comment=$(id+"-comment");
if(button&&comment){comment.clear();
comment.addClassName(hintclass);
button.addClassName(fadeclassname);
button.disable();
comment.value=Cmsbox.decode_utf8(commentText);
comment.observe("focus",function(event){if(comment.value==Cmsbox.decode_utf8(commentText||"")){comment.removeClassName(hintclass);
comment.clear()
}})
}},validateShopPart:function(button,id,fadeclassname,failclassname,hintclass,inputTooltip,commentTooltip,fileTooltip,force,textComment){var self=this;
var button=$(button);
if(button){var input=$(id+"-input");
var inputValid=true;
var comment=$(id+"-comment");
var commentValid=false;
var file=$(id+"-file");
var fileValid=false;
button.disabled=false;
var validateFn=function(brush){var evObj=null;
if(document.createEvent){evObj=document.createEvent("MouseEvents");
evObj.initMouseEvent("change",true,false,window,0,0,0,0,0,false,false,false,false,0,null);
brush.dispatchEvent(evObj)
}else{if(document.createEventObject){evObj=document.createEventObject();
brush.fireEvent("onchange",evObj)
}}};
var updateFn=function(event){if(inputValid&&commentValid&&fileValid){button.removeClassName(failclassname);
button.removeClassName(fadeclassname);
button.enable()
}else{button.addClassName(failclassname);
button.addClassName(fadeclassname);
button.disable()
}};
if(input){var inputTitle=input.title;
var inputTooltip=Cmsbox.decode_utf8(inputTooltip||"");
inputFn=function(event){inputValid=self._validateShopPart(input,input,fadeclassname,failclassname,hintclass,inputTitle,inputTooltip,function(value){return(/^\d*(\.\d+)?$/i.test(value))&&parseFloat(value)>0
});
updateFn(event)
};
input.observe("keyup",inputFn);
input.observe("change",inputFn);
input.observe("click",inputFn);
if(force){validateFn(input)
}}else{inputValid=true
}if(comment){var commentTitle=comment.title;
var commentTooltip=Cmsbox.decode_utf8(commentTooltip||"");
var textComment=Cmsbox.decode_utf8(textComment||"");
commentFn=function(event){if(textComment!=comment.value){comment.removeClassName(hintclass)
}commentValid=self._validateShopPart(comment,comment,fadeclassname,failclassname,hintclass,commentTitle,commentTooltip,null);
updateFn(event)
};
comment.observe("keyup",commentFn);
comment.observe("change",commentFn);
comment.observe("click",commentFn);
if(force){validateFn(comment)
}}else{commentValid=true
}if(file){var fileTitle=file.title;
var fileTooltip=Cmsbox.decode_utf8(fileTooltip||"");
fileFn=function(event){fileValid=self._validateShopPart(file.up(),file,fadeclassname,failclassname,hintclass,fileTitle,fileTooltip,null);
updateFn(event)
};
file.observe("change",fileFn);
if(force){validateFn(file)
}}else{fileValid=true
}}},_validateShopPart:function(container,element,fadeclassname,failclassname,hintclass,title,tooltip,condition){var value=(element.value||"").replace(/^\s+|\s+$/g,"");
if(!!value&&(!condition||condition(value))&&!element.hasClassName(hintclass)){element.title=title;
container.removeClassName(failclassname);
return true
}else{element.title=tooltip;
container.addClassName(failclassname);
return false
}},fadeInOut:function(anchor,list,container){clicked=$(anchor);
if(!clicked){return false
}clicked=clicked.up();
if(!clicked){return false
}listContainer=$(list);
if(!listContainer){return false
}elementContainer=$(container);
if(!elementContainer){return false
}listChildren=listContainer.childElements();
elementChildren=elementContainer.childElements();
clickedIndex=listChildren.indexOf(clicked);
element=elementChildren[clickedIndex];
if(!element){return false
}closing=clicked.hasClassName("cb-selected");
listChildren.each(function(l){l.removeClassName("cb-selected")
});
elementChildren.each(function(e){e.style.display="none"
});
if(!closing){clicked.addClassName("cb-selected");
element.style.display="block"
}return true
},moveUp:function(element){var element=$(element);
if(!element){return false
}var previous=element.previous();
if(!previous){return false
}previous.insert({before:element});
return true
},moveDown:function(element){var element=$(element);
if(!element){return false
}var next=element.next();
if(!next){return false
}next.insert({after:element});
return true
},_loadableImage_id_values:null,_loadableImage_callback:null,registerImages:function(idsAndUrls,callback){this._loadableImage_id_values=idsAndUrls;
this._loadableImage_callback=callback;
this._loadableImage_callback()
},loadableImages:function(){var ids=[];
for(var key in this._loadableImage_id_values){ids.push(key)
}return ids
},loadImages:function(list_id){var key;
if(list_id){for(var i=0;
i<list_id.length;
i++){var id=list_id[i];
if(id){var element=$(list_id[i]);
if(element){var values=this._loadableImage_id_values[id];
for(key in values){if(values[key]){if(key!="style"){element[key]=values[key]
}}}if(element.src&&(!(/glass.gif/i.test(element.src)))){element.removeClassName("cb-loading");
if(_loadedSlides){_loadedSlides[id]=true
}this._loadableImage_id_values[id]=null
}}}}}var remainingImage_id_urls={};
var remainingImage_id_urls_count=0;
for(key in this._loadableImage_id_values){if(this._loadableImage_id_values[key]){remainingImage_id_urls[key]=this._loadableImage_id_values[key];
remainingImage_id_urls_count++
}}this._loadableImage_id_values=remainingImage_id_urls;
if(remainingImage_id_urls_count>0){setTimeout(function(){Cmsbox._loadableImage_callback()
},1000)
}},hybrid:function(){$$(".cb-hybrid").each(function(each){if(/button/i.test(each.tagName)){each.type="button"
}})
},ensureQuickTime:function(element,replacement){var element=$(element);
var replacement=$(replacement);
if(element&&replacement){try{if(!this.plugins().QuickTime){element.addClassName("cb-invisible");
replacement.removeClassName("cb-invisible")
}}catch(err){element.addClassName("cb-invisible");
replacement.removeClassName("cb-invisible")
}}},_resize_mobile_viewport_offset:0,_default_resize_mobile_viewport_offset:240,resize_background:function(ratio,element){var self=this;
self._resizable(function(event){self._resize_background(event,element,ratio)
})
},_resize_background:function(event,element,ratio){var self=this;
var element=element||$("bg");
var imgRatio=ratio||1;
var scaleWidth=1;
var scaleHeight=1;
var viewPortWidth=document.viewport.getWidth();
var viewPortHeight=document.viewport.getHeight();
if(Position.windowBounds()[0]>viewPortWidth){scaleWidth=parseFloat(Position.windowBounds()[0]/viewPortWidth)
}if(Position.windowBounds()[1]>viewPortHeight){scaleHeight=parseFloat(Position.windowBounds()[1]/viewPortHeight)
}if((viewPortHeight*imgRatio)>viewPortWidth){element.setStyle({maxWidth:"",maxHeight:"",width:((viewPortHeight+self._resize_mobile_viewport_offset)*scaleHeight*imgRatio)+"px"})
}else{element.setStyle({maxWidth:"",maxHeight:"",width:viewPortWidth*scaleWidth+"px"})
}},resize_slides:function(ratio,images){var self=this;
self._resizable(function(event){self._resize_slides(event,images,ratio)
})
},resize_images:function(selector){if(!selector){return
}var is_dumb_browser="object-fit" in document.documentElement.style===false;
var callback=function(container){container.select(".cb-slides").each(function(slides){Responsive.disable_multimood_responsive(slides);
slides.removeAttribute("style");
slides.select("img").each(function(image){image.setStyle({maxHeight:"",maxWidth:""})
})
});
if(is_dumb_browser){container.select("img").each(function(image){image.setStyle({display:"none"});
image.parentNode.setStyle({backgroundPosition:"center",backgroundImage:"url("+image.src+")",backgroundSize:"cover",maxHeith:"",maxWidth:""})
})
}};
$$(selector).each(callback)
},_resize_slides:function(event,images,ratio){var self=this;
var slides=$("slides");
if(slides){slides.setStyle({maxWidth:"",maxHeight:""})
}var images=images||(slides?slides.select("img"):null);
if(images){var scaleWidth=1;
var scaleHeight=1;
var viewPortWidth=document.viewport.getWidth();
var viewPortHeight=document.viewport.getHeight();
if(Position.windowBounds()[0]>viewPortWidth){scaleWidth=parseFloat(Position.windowBounds()[0]/viewPortWidth)
}if(Position.windowBounds()[1]>viewPortHeight){scaleHeight=parseFloat(Position.windowBounds()[1]/viewPortHeight)
}images.each(function(image){var imgRatio=ratio||(parseFloat(image.readAttribute("data-width")||1)/parseFloat(image.readAttribute("data-height")||1));
if((viewPortHeight*imgRatio)>viewPortWidth){image.setStyle({maxWidth:"",maxHeight:"",width:(viewPortHeight+self._resize_mobile_viewport_offset)*scaleHeight*imgRatio+"px"})
}else{image.setStyle({maxWidth:"",maxHeight:"",width:viewPortWidth*scaleWidth+"px"})
}})
}},_resizable:function(resize_function){var self=this;
try{if(self.isMobile()){self._resize_mobile_viewport_offset=self._default_resize_mobile_viewport_offset;
Event.observe(window,"scroll",function(event){return self._resizable_resize(event,resize_function)
})
}Event.observe(window,"resize",function(event){return self._resizable_resize(event,resize_function)
});
Event.observe(window,"load",function(event){return self._resizable_resize(event,resize_function)
});
Ajax.Responders.register({onCreate:function(event){if(Ajax.activeRequestCount>0){return self._resizable_resize(event,resize_function)
}},onComplete:function(event){if($("edit")&&Ajax.activeRequestCount==0){return self._resizable_resize(event,resize_function)
}}})
}catch(error){}},_resizable_resize:function(event,resize_function){var self=this;
window.setTimeout(function(){resize_function(event)
},10)
},observe_scroll:function(callback){try{if(Cmsbox.isTouchSupported()){Event.observe(window,"touchmove",function(event){callback(event)
})
}Event.observe(window,"scroll",function(event){callback(event)
})
}catch(error){Event.observe(window,"scroll",function(event){callback(event)
})
}},_is_web_storage_available:{localStorage:null,sessionStorage:null},is_web_storage_available:function(typeString){if(this._is_web_storage_available[typeString]){return this._is_web_storage_available[typeString]
}try{var storage=window[typeString],x="__storage_test__";
storage.setItem(x,x);
storage.removeItem(x);
this._is_web_storage_available[typeString]=true;
return true
}catch(e){this._is_web_storage_available[typeString]=false;
return false
}}};
CmsboxPrintify={version:"2.5",copyright:"(c) Copyright 2007-2014 cmsbox GmbH. All Rights Reserved. http://www.cmsbox.com",setup:function(){var self=this;
Event.observe(window,"load",function(event){self._on_load(event)
});
Event.observe(window,"keypress",function(event){self._on_keypress(event)
});
Ajax.Responders.register({onComplete:function(response){self._on_load(response)
}})
},_on_load:function(event){var self=this;
$$("a.print").each(function(each){Element.observe($(each),"click",function(event){self.printify_select_tags()
})
})
},_on_keypress:function(event){if(event.ctrlKey&&(event.charCode==112||event.charCode==80)){self.printify_select_tags()
}},printify_select_tags:function(){$$("select").each(function(each){var select=$(each);
if(!select.next(".cb-print-select")){var content=$(document.createElement("ul"));
content.addClassName("cb-print-select");
select.childElements().each(function(each){var option=$(each);
var option_li=$(document.createElement("li"));
option_li.addClassName("cb-print-option");
if(option.selected){option_li.addClassName("cb-print-option-selected")
}option_li.innerHTML=option.innerHTML;
content.insert(option_li)
});
select.insert({after:content})
}})
}};
Object.extend(Cmsbox,{plugins:function(){var plugins={};
for(i=0;
i<navigator.plugins.length;
i++){var name=null;
var description=null;
try{name=navigator.plugins[i].name
}catch(error){}try{description=navigator.plugins[i].description
}catch(error){}plugins[name]=description
}return Cmsbox.toJSON(plugins)
}});
var LazyRequest=Class.create();
LazyRequest.prototype={version:"2.5",copyright:"(c) Copyright 2007-2014 cmsbox GmbH. All Rights Reserved. http://www.cmsbox.com",initialize:function(){this._initializeArguments(arguments);
this._element=$(this._lazyOptions.id);
this._interval=$(this._lazyOptions.frequency);
if(this._interval){new Form.Element.Observer(this._element.id,this._interval,this._update.bind(this))
}},_initializeArguments:function(args){this._url=args[0];
this._lazyOptions=args[1]
},_getParams:function(){var params={parameters:eval(this._lazyOptions.parameters)};
for(var key in this._lazyOptions){if(!params[key]){params[key]=this._lazyOptions[key]
}}return params
}};
var LazyEvaluator=Class.create();
Object.extend(LazyEvaluator.prototype,LazyRequest.prototype);
Object.extend(LazyEvaluator.prototype,{_update:function(element,value){return new Ajax.Request(this._url,this._getParams())
}});
var LazyUpdater=Class.create();
Object.extend(LazyUpdater.prototype,LazyRequest.prototype);
Object.extend(LazyUpdater.prototype,{_initializeArguments:function(args){this._target=args[0];
this._url=args[1];
this._lazyOptions=args[2]
},_update:function(element,value){return new Ajax.Updater(this._target,this._url,this._getParams())
}});
KeyNavigator={version:"2.5",copyright:"(c) Copyright 2007-2014 cmsbox GmbH. All Rights Reserved. http://www.cmsbox.com",setup:function(){var self=this;
try{Event.observe(document,"keyup",function(event){return self._on_key_up(event)
})
}catch(error){}},_on_key_up:function(event){try{if($("disp")){switch(event.keyCode){case 39:return this._trigger($$("#lbox .next a"),event);
case 37:return this._trigger($$("#lbox .prev a"),event);
default:return
}}else{if(CmsboxSlideshows&&$$("#slides, .cb-slides").length>0){return CmsboxSlideshows.on_key_up(event)
}}}catch(error){}},_trigger:function(anchors,event){if(anchors&&anchors.length>0){var anchor=anchors[0];
if(anchor&&anchor.onclick){if(window&&window.history&&history&&history.pushState){try{history.pushState({offset:Position.windowOffset()[1],location:window.location.href},anchor.title,anchor.href)
}catch(error){}}anchor.onclick();
return false
}}}};
KeyNavigator.setup();
CmsboxSlideshows={version:"2.5",copyright:"(c) Copyright 2007-2014 cmsbox GmbH. All Rights Reserved. http://www.cmsbox.com",_slideshows:{_slides:null,get:null,add:null,disableAll:function(){this._slides.values().each(function(slide){slide.disable()
})
},reset:function(){this._slides=$H();
this.get=this._slides.get.bind(this._slides);
this.add=this._slides.set.bind(this._slides)
}},_slideshow:null,_delay_init:50,setup:function(){var self=this;
self._slideshows.reset();
Event.observe(window,"load",function(event){self.onload(event)
});
Ajax.Responders.register({onComplete:function(){self.onload(null)
}})
},current:function(){return this._slideshow
},onload:function(event){var self=this;
self._slideshows.disableAll();
self._slideshows.reset();
$$(".cb-slides").each(function(each){self._onload($(each),event)
})
},on_key_up:function(event){var slideshow=this.current();
if(slideshow){slideshow.on_key_up(event)
}},on_scroll_over:function(){var slides=$$("#slides, .cb-page-selected .cb-slides");
if(slides&&slides.length>0){var slide=slides[0];
if(slide){var slideshow=this._slideshows.get(slide.id);
if(slideshow){this._slideshow=slideshow
}}}},_onload:function(each,event){var id=each.readAttribute("id")||null;
var slide=this._slideshows.get(id)||null;
if(!id||!slide){id=id||"slides_"+Math.floor(Math.random()*1000000000000);
each.writeAttribute("id",id);
slide=new CmsboxSlideshow(each);
this._slideshows.add(id,slide);
if(!this._slideshow){this._slideshow=slide
}}slide.onload(event)
}};
var CmsboxSlideshow=Class.create();
CmsboxSlideshow.prototype={version:"2.5",copyright:"(c) Copyright 2007-2014 cmsbox GmbH. All Rights Reserved. http://www.cmsbox.com",_delay:0,_duration:0,_variation:0.25,_random:false,_element:null,_slides:[],_element_parent:null,_index:0,_timer:null,_slide_appear:null,_slide_fade:null,_is_force_disabled:false,initialize:function(element,options){this._element=element;
this.initialize_nodes();
this.initialize_options(options);
this.initialize_behaviour()
},initialize_nodes:function(){this._element_parent=$(this._element.up());
this._slides=this._element.childElements();
this._link_table_rows=new Selector("div table tbody tr").findElements(this._element_parent)
},initialize_options:function(options){this._delay=parseFloat((options?options.delay:this._element.readAttribute("data-delay"))||0)||0;
this._duration=parseFloat((options?options.duration:this._element.readAttribute("data-duration"))||0)||0;
this._duration=this._duration/1000;
this._random=!!(options?options.random:this._element.readAttribute("data-random"));
this._variation=Math.max(0,parseFloat((options?options.variation:this._element.readAttribute("data-variation"))||0)||0)
},initialize_behaviour:function(){var self=this;
(new Selector("a").findElements(self._element_parent)).each(function(each){Event.stopObserving(each,"click")
});
(new Selector(".cb-slide-previous").findElements(self._element_parent)).each(function(each){var each=$(each);
Event.observe(each,"click",function(event){if(!self.is_disabled(each,event)){self.previous_slide()
}})
});
(new Selector(".cb-slide-next").findElements(self._element_parent)).each(function(each){var each=$(each);
Event.observe(each,"click",function(event){if(!self.is_disabled(each,event)){self.next_slide()
}})
});
(new Selector(".cb-index-all a").findElements(self._element_parent)).each(function(each,index){var each=$(each);
Event.observe(each,"click",function(event){if(!self.is_disabled(each,event)){self.slide(index)
}})
});
(new Selector(".cb-index-some a:last").findElements(self._element_parent)).each(function(each){var each=$(each);
Event.observe(each,"click",function(event){if(!self.is_disabled(each,event)){self.slide(self._slides.length-1)
}})
})
},is_disabled:function(each,event){var selected_title=$$("h1.mark");
return this._is_force_disabled||(selected_title&&selected_title.length>0)
},onload:function(event){this.initialize(this._element);
this.start(CmsboxSlideshows._delay_init)
},on_key_up:function(event){if(!this.is_disabled(null,event)){switch(event.keyCode){case 39:return this.next_slide();
case 37:return this.previous_slide();
default:return
}}},can_start:function(){return !this.is_disabled()&&this._slides&&this._slides.length>1&&this._element&&this._element_parent&&!!this._delay&&!!this._duration&&this._duration>0
},start:function(init_delay){this._start(init_delay)
},disable:function(){this._is_force_disabled=true;
window.clearTimeout(this._timer)
},_start:function(init_delay){var self=this;
if(!this.can_start()){return
}window.clearTimeout(self._timer);
self._timer=window.setTimeout(function(){self._transition()
},self._time_variation(self._delay+(init_delay||0)))
},_transition:function(){var index=this._index;
this._index=this._next_index_slide();
if(this._duration<=0){this._slides[this._index].setStyle({display:"block"});
this._slides[this._index].addClassName("slide--active");
this._slides[index].setStyle({display:"none"});
this._slides[index].removeClassName("slide--active");
this._slide_link();
this._start()
}else{this._slides[this._index].addClassName("slide--active");
this._slides[index].removeClassName("slide--active");
this._slide_appear=Effect.Appear(this._slides[this._index],{duration:this._time_variation(this._duration),afterFinish:function(){this._slide_link();
this._start()
}.bind(this)});
this._slide_fade=Effect.Fade(this._slides[index],{duration:this._time_variation(this._duration)})
}},_next_index_slide:function(){var index=(this._random&&this._slides.length>2)?this._random_next_index_slide():this._index+1;
return index>=this._slides.length?0:index
},_random_next_index_slide:function(){var next=this._index;
var iterations=0;
while((!next||next==this._index)&&iterations<10){next=Math.floor(Math.random()*this._slides.length);
iterations++
}return next
},_time_variation:function(integer){return integer*(this._variation?((1+Math.random()-0.5)*this._variation):1)
},next_slide:function(){return this._slide(1)
},previous_slide:function(){return this._slide(-1)
},slide:function(index){return this._slide(index-this._index)
},_slide:function(offset){var self=this;
if(self._timer){window.clearTimeout(self._timer)
}if(self._slide_appear){self._slide_appear.cancel()
}if(self._slide_fade){self._slide_fade.cancel()
}$(self._slides).each(function(each){var each=$(each);
each.style.opacity=null;
each.style.display="none";
/*@cc_on
			each.style.filter = 'alpha()';
			@*/
});
var index=self._index;
self._index=self._index+offset;
if(self._index>=self._slides.length){self._index=0
}else{if(self._index<0){self._index=self._slides.length-1
}}self._slides[self._index].style.display="block";
self._slide_link();
self._start(CmsboxSlideshows._delay_init)
},_slide_link:function(){if(this._link_table_rows){var _link_table_columns=[];
var _link_table_column=null;
if(this._link_table_rows.length>0){if(this._link_table_rows[0]){_link_table_columns=this._link_table_rows[0].childElements();
_link_table_columns.each(function(each){$(each).removeClassName("this")
});
if(_link_table_columns.length>this._index){_link_table_column=_link_table_columns[this._index];
_link_table_column.addClassName("this")
}}}if(_link_table_column&&this._link_table_rows.length>1){if(this._link_table_rows[1]){_link_table_columns=this._link_table_rows[1].childElements();
if(_link_table_columns&&_link_table_columns.length>0){var _link=_link_table_columns[0];
_link.innerHTML=_link_table_column.innerHTML
}}}}}};
CmsboxSlideshows.setup();
CmsboxParallax={version:"2.5",copyright:"(c) Copyright 2007-2014 cmsbox GmbH. All Rights Reserved. http://www.cmsbox.com",_parallax:{},_default_parallax_oversize:1.2,setup:function(){var self=this;
Event.observe(window,"load",function(event){self.onload(event)
});
Ajax.Responders.register({onComplete:function(){self.onload(null)
}})
},onload:function(event){var self=this;
$$(".cb-parallax").each(function(each){self._onload($(each),event)
})
},_onload:function(each,event){var id=each.readAttribute("id")||null;
var parallax=this._parallax[id]||null;
if(!id||!parallax){id=id||"parallax_"+Math.floor(Math.random()*1000000000000);
each.writeAttribute("id",id);
if(each.hasClassName("cb-slides")){parallax=new CmsboxParallaxMultiMood(each)
}else{parallax=new CmsboxParallaxMood(each)
}this._parallax[id]=parallax
}parallax.onload(event)
}};
var CmsboxParallaxMood=Class.create();
CmsboxParallaxMood.prototype={version:"2.5",copyright:"(c) Copyright 2007-2014 cmsbox GmbH. All Rights Reserved. http://www.cmsbox.com",_element:null,_scroll_y:null,_dimension:null,_offset:null,_window_height:null,_parallaxing:null,initialize:function(element){this._element=element;
this.initialize_behaviour()
},initialize_behaviour:function(){var self=this;
Event.observe(window,"resize",function(event){self._on_before_parallax(event);
self._on_parallax(event)
});
Cmsbox.observe_scroll(function(event){self._on_parallax(event)
});
self.onload(null)
},onload:function(event){this._on_before_parallax(event);
this._on_parallax(event)
},_on_before_parallax:function(event){},_on_parallax:function(event){if(!this._parallaxing){this._parallaxing=true;
this._on_before_scroll(event);
this._on_scroll(event);
this._parallaxing=false
}},_on_before_scroll:function(event){this._offset=this._element.cumulativeOffset();
this._dimension=this._element.getDimensions();
this._window_height=Position.windowBounds()[1];
this._scroll_y=Position.windowOffset()[1]
},_on_scroll:function(event){var height=this._dimension.height;
var image_height=parseFloat(this._element.readAttribute("data-height"))||height;
var margins=image_height-height;
var background_position=0;
if(margins>0){var relative_offset_top=this._offset.top-this._scroll_y;
background_position=Math.min(margins,Math.max(-margins,0-(margins*relative_offset_top/this._window_height)));
this._element.style.backgroundPosition="0px "+background_position+"px"
}else{var offset=height>this._window_height?(height/2):0;
if(this._scroll_y+offset>=this._offset.top&&this._offset.top+height-offset>this._scroll_y){background_position=0-Math.floor((this._offset.top-this._scroll_y)*1/3);
this._element.style.backgroundPosition="0px "+background_position+"px"
}else{if(this._scroll_y+this._window_height<=this._offset.top+height-offset&&this._scroll_y<this._offset.top){background_position=0-Math.floor((this._offset.top+height-this._scroll_y-this._window_height)*1/3);
this._element.style.backgroundPosition="0px "+background_position+"px"
}}}}};
var CmsboxParallaxMultiMood=Class.create();
Object.extend(CmsboxParallaxMultiMood.prototype,CmsboxParallaxMood.prototype);
Object.extend(CmsboxParallaxMultiMood.prototype,{version:"2.5",copyright:"(c) Copyright 2007-2014 cmsbox GmbH. All Rights Reserved. http://www.cmsbox.com",_on_before_parallax:function(event){var parallax_oversize=Number.MAX_VALUE;
var element_dimensions=this._element.getDimensions();
var width=element_dimensions.width;
var height=element_dimensions.height;
Selector.findChildElements(this._element,[".slide"]).each(function(each){if(!(/none/i).test(each.getStyle("display"))){var slide_dimension=each.getDimensions();
parallax_oversize=Math.min(slide_dimension.width/width,parallax_oversize);
parallax_oversize=Math.min(slide_dimension.height/height,parallax_oversize)
}});
if(parallax_oversize==Number.MAX_VALUE){parallax_oversize=Cmsbox._default_parallax_oversize
}this._parallax_oversize=Math.max(1,parallax_oversize);
this._element.writeAttribute("data-parallax-oversize",this._parallax_oversize)
},_on_scroll:function(event){if(this._parallax_oversize>1){var height=this._dimension.height;
var width=this._dimension.width;
var margins=this._parallax_oversize*((this._parallax_oversize*height)-height);
var relative_offset_top=this._offset.top-this._scroll_y;
var zero_point=relative_offset_top-(this._window_height/2)+(height/2);
var min=zero_point-(this._window_height/2)-(height/2);
var max=zero_point+(this._window_height/2)+(height/2);
var margin_offset=0;
if(zero_point==0){margin_offset=0
}else{if(zero_point<0){margin_offset=-(zero_point/(0-min))
}else{if(zero_point>0){margin_offset=-(zero_point/(max-0))
}}}var margin_top=margin_offset*margins;
Selector.findChildElements(this._element,[".slide"]).each(function(each){each.style.marginTop=margin_top+"px"
})
}}});
CmsboxParallax.setup();
CmsboxNavigationElastic={version:"2.5",copyright:"(c) Copyright 2007-2014 cmsbox GmbH. All Rights Reserved. http://www.cmsbox.com",_options:{},_default_options:{node_content:"desk",node_navi_container:"cb-elastic-container",node_navi_content:"cb-elastic-content",class_navi_content_small:"cb-elastic-content-small",class_content_invisible:"cb-content-invisible",animate:false,speed:5},_node_navi_container:null,_node_navi_content:null,_node_navi_content_dimensions:{},_node_navi_content_margin_top:0,_node_content:null,_padding_threshold:0.5,_padding_top:20,_padding_bottom:20,_padding_top_small:0,_padding_bottom_small:0,_current_padding_top:0,_current_padding_bottom:0,_event_on_scroll:null,_previous_position:null,setup:function(options){Object.extend(this._options,this._default_options);
Object.extend(this._options,options);
this._setup()
},_setup:function(){var self=this;
Event.observe(window,"load",function(event){self._on_load(event)
});
Event.observe(window,"resize",function(event){self._on_resize(event)
});
Cmsbox.observe_scroll(function(event){self._on_scroll(event)
});
Ajax.Responders.register({onComplete:function(response){if(!Cmsbox.isEditing()){self._on_load(response)
}}})
},_on_load:function(event){this._on_init_nodes(event);
this._on_resize(event);
this._on_init_data(event);
this._on_init_scroll(event)
},_on_init_nodes:function(event){if(!this._node_navi_container){this._node_navi_container=$(this._options.node_navi_container)
}if(!this._node_navi_content){this._node_navi_content=$(this._options.node_navi_content)
}if(!this._node_content){this._node_content=$(this._options.node_content)
}},_on_init_data:function(event){if(this._node_navi_content){try{var data_large=this._node_navi_content.readAttribute("data-elastic");
var paddings_large=JSON.parse(data_large);
this._padding_top=paddings_large[0]||0;
this._padding_bottom=paddings_large[1]||0
}catch(exception){}try{var data_small=this._node_navi_content.readAttribute("data-elastic-small");
var paddings_small=JSON.parse(data_small);
this._padding_top_small=paddings_small[0]||0;
this._padding_bottom_small=paddings_small[1]||0
}catch(exception){}this._padding_top=this._padding_top||this._padding(this._node_navi_content.getStyle("padding-top"),this._padding_top);
this._padding_bottom=this._padding_bottom||this._padding(this._node_navi_content.getStyle("padding-bottom"),this._padding_bottom)
}},_on_init_scroll:function(event){if(this._node_navi_content){this._on_scroll(event)
}},_on_resize:function(event){if(this._node_content&&this._node_navi_container){var dimensions=this._node_navi_container.getDimensions()||{};
this._node_navi_content_dimensions=dimensions;
var margin_top=dimensions.height||0;
this._node_navi_content_margin_top=margin_top;
this._node_content.style.marginTop=margin_top+"px";
this._node_content.removeClassName(this._options.class_content_invisible);
this._on_compensate_invalid_scroll_position(event)
}},_on_compensate_invalid_scroll_position:function(event){var next_position=Position.windowOffset();
var left=this._previous_position&&this._previous_position[0]>next_position[0]?this._previous_position[0]:next_position[0];
var top=this._previous_position&&this._previous_position[1]>next_position[1]?this._previous_position[1]:next_position[1];
window.scrollTo(left,top)
},_on_scroll:function(event){this._previous_position=Position.windowOffset();
if(event&&!this._event_on_scroll){this._event_on_scroll=event;
if(this._node_content&&this._node_navi_content){var offset=this._node_content.cumulativeScrollOffset()||{};
var speed_offset=(offset.top||0)/this._options.speed;
var padding_top=Math.max(0,this._padding_top-speed_offset);
var padding_bottom=Math.max(0,this._padding_bottom-speed_offset);
if((this._options&&this._options.animate)||(Prototype.Browser.IE&&(!window.Cmsbox||!Cmsbox._ieModern()))){this._node_navi_content.style.paddingTop=padding_top+"px";
this._node_navi_content.style.paddingBottom=padding_bottom+"px"
}else{if(this._should_become_small(padding_top,padding_bottom)){this._node_navi_content.addClassName(this._options.class_navi_content_small)
}else{this._node_navi_content.removeClassName(this._options.class_navi_content_small)
}}this._current_padding_top=padding_top;
this._current_padding_bottom=padding_bottom
}this._event_on_scroll=null
}},is_elastic:function(){return this._node_content&&this._node_navi_container&&this._node_navi_content
},is_initialized:function(){return this._initialized
},_should_become_small:function(current_padding_top,current_padding_bottom){return current_padding_top+current_padding_bottom<this._threshold()
},_threshold:function(){return(this._padding_top+this._padding_bottom)*this._padding_threshold
},_elastic_offset:function(page_or_element,offset){this._on_load();
if(this.is_elastic()){var offset=offset||Element.cumulativeOffset(page_or_element);
if(offset.top>=this._threshold()){return 0-(this._node_navi_content_margin_top||0)+(((this._padding_top+this._padding_bottom)-(this._padding_top_small+this._padding_bottom_small))||0)
}}return 0
},_padding:function(string,default_value){if(!(/\%/i).test(string)){try{return parseFloat(string.replace("px",""))
}catch(error){return default_value
}}return default_value
}};
CmsboxNavigationElastic.setup();
CmsboxNavigationSticky={version:"2.5",copyright:"(c) Copyright 2007-2014 cmsbox GmbH. All Rights Reserved. http://www.cmsbox.com",setup:function(){var self=this;
Cmsbox.observe_scroll(function(event){self.on_scroll(event)
});
Event.observe(window,"resize",function(event){self.on_resize(event)
})
},on_scroll:function(event){var self=this;
var elements=$$(".cb-navi-sticky").filter(function(each){return !$(each).hasClassName("cb-navi-sticky-clone")
});
elements.each(function(each){var each=$(each);
var offset_top=each.cumulativeOffset().top;
var offset_threshold=self.offset_threshold(each,elements);
if(offset_top!=null&&offset_threshold[0]>offset_top&&!each.hasClassName("cb-navi-fixed")){return self.on_fixed(each,offset_top,offset_threshold,event)
}offset_top=parseFloat(each.readAttribute("data-offset"))||null;
if(offset_top!=null&&offset_threshold[0]<=offset_top&&each.hasClassName("cb-navi-fixed")){return self.on_relative(each,offset_top,offset_threshold,event)
}})
},_fixed_offset_callback:function(element){return parseFloat(element.readAttribute("data-sticky-offset")||0)
},offset_threshold:function(element,elements){var window_top=Position.windowOffset()[1];
var window_offset=this._fixed_offset_callback(element)||0;
var threshold=window_top+window_offset;
var threshold_selector=element.readAttribute("data-sticky-selector")||"";
if(threshold_selector&&threshold_selector!=".cb-navi-sticky"){var threshold_elements=$$(threshold_selector);
if(threshold_elements){var element_index=elements.indexOf(element);
var threshold_element=$(threshold_elements[element_index-1]||threshold_elements[threshold_elements.length-1]);
if(threshold_element&&threshold_element!=element){var threshold_offset=parseFloat(element.readAttribute("data-sticky-selector-offset")||0)||0;
var threshold_offset_height=!!element.readAttribute("data-sticky-selector-offset-height")?threshold_element.getDimensions().height:0;
window_offset=threshold_element.cumulativeOffset().top+threshold_offset+threshold_offset_height;
if((/fixed/i).test(threshold_element.getStyle("position"))){threshold=window_top+window_offset
}else{threshold=window_offset
}}}}return[threshold,window_offset]
},on_resize:function(event){var self=this;
$$(".cb-navi-sticky").each(function(each){each.writeAttribute("data-offset","");
self.on_relative(each,null,event)
});
self.on_scroll(event)
},on_fixed:function(element,offset_top,offset_threshold,event){var element_clone=$(Element.clone(element,true));
element_clone.addClassName("cb-navi-sticky-clone");
element.insert({after:element_clone});
$$(".cb-navi-fixed").each(function(each){each.addClassName("cb-navi-fixed-invisible")
});
element.addClassName("cb-navi-fixed");
element.writeAttribute("data-offset",offset_top);
if(offset_threshold[1]>0){element.style.marginTop=offset_threshold[1]+"px"
}},on_relative:function(element,offset_top,offset_threshold,event){if(offset_threshold[1]>0){element.style.marginTop=""
}var element_clone=$(element.nextSiblings()[0]);
if(element_clone&&element_clone.hasClassName("cb-navi-sticky-clone")){element_clone.remove()
}element.removeClassName("cb-navi-fixed");
element.removeClassName("cb-navi-fixed-invisible");
var fixed=$$(".cb-navi-fixed");
if(fixed&&fixed.length>0){fixed[fixed.length-1].removeClassName("cb-navi-fixed-invisible")
}},contains:function(element){return element.ancestors().any(function(each){return each.hasClassName("cb-navi-sticky-clone")
})
}};
CmsboxNavigationSticky.setup();
CmsboxNavigationScroll={version:"2.5",copyright:"(c) Copyright 2007-2014 cmsbox GmbH. All Rights Reserved. http://www.cmsbox.com",_duration:0.5,_transition:Effect?Effect.Transitions.sinoidal:null,_cache_anchors:{},_cache_pages_and_anchors:{},_current_page:null,_current_scroll_y:0,_scrolling:false,_timeout:2000,_delay:10,_jumping:false,_scrolling_top_down:true,_fixed_offset:0,_fixed_offset_callback:function(){return 0
},setup:function(){var self=this;
self._cache_anchors={};
self._cache_pages_and_anchors={};
Event.observe(window,"load",function(event){self._on_load(event)
});
Cmsbox.observe_scroll(function(event){self._on_scroll(event)
});
Event.observe(document,"keyup",function(event){self._on_keyup(event)
});
Event.observe(window,"resize",function(event){self._on_resize(event)
});
Ajax.Responders.register({onComplete:function(response){if(!Cmsbox.isEditing()){self._on_load(response)
}}})
},jump_to_hash:function(hash,duration,useTransition,event){this.jump_to_element($(hash),duration,useTransition,event)
},jump_to_element:function(element,duration,useTransition,event){var self=this;
var body=$$("body")[0];
if(body){try{body.addClassName("cb-jump-waiting");
Event.observe(window,"load",function(){self._jump_to_element(element,duration,useTransition,event);
body.removeClassName("cb-jump-waiting")
})
}catch(exception){body.removeClassName("cb-jump-waiting")
}}else{self._jump_to_element(element,duration,useTransition,event)
}},_setup:function(){this._setup_anchors();
this._setup_scrolling()
},_setup_anchors:function(){var self=this;
self._anchors().each(function(anchor){var hash_anchor=anchor.id||"anchor"+Math.floor(Math.random()*1000000000000);
if(!self._cache_anchors[hash_anchor]){var hash=anchor.readAttribute("data-jump");
if(hash){if(!self._cache_pages_and_anchors[hash]){self._cache_pages_and_anchors[hash]=[]
}self._cache_pages_and_anchors[hash].push(anchor);
self._cache_anchors[hash_anchor]=anchor;
anchor.writeAttribute("id",hash_anchor);
Event.observe(anchor,"click",function(event){return self._on_click(event,anchor,hash)
})
}}})
},_setup_scrolling:function(){this._scrolling=false;
this._scrolling_top_down=true;
this._update_fixed_offset()
},_update_fixed_offset:function(){if(this._fixed_offset_callback){try{var offset=parseFloat(this._fixed_offset_callback());
if(offset&&offset>=0){this._fixed_offset=offset
}}catch(error){}}},_page:function(element){return element.hasClassName("cb-page")?element:Selector.matchElements(element.ancestors(),".cb-page")[0]
},_page_with_offset:function(page_offset){var pages=$$(".cb-page");
var current_page_index=pages.indexOf(this._current_page)||0;
var next_page_index=current_page_index+page_offset;
return $(pages[next_page_index]||this._current_page)
},_anchors:function(){return $$("a.menu, a.open, a.cb-mobile-sitemap-menu")
},_navigation_child_anchors:function(item){return Selector.findChildElements(item,["> a.menu, > a.cb-mobile-sitemap-menu"])
},_navigation_parent_items:function(anchor){return Selector.matchElements(anchor.ancestors(),"div.item, li.cb-mobile-sitemap-item")
},_jump_to_element:function(page_or_element,duration,useTransition,event){var self=this;
if(self._can_jump()){self._jumping=true;
self._update_fixed_offset();
if(useTransition&&self._transition&&!!duration){self._scroll_animated(page_or_element,duration,event)
}else{self._scroll(page_or_element,event)
}CmsboxNavigationSticky.on_scroll(null)
}},_elastic_offset:function(page_or_element,offset){if(CmsboxNavigationElastic&&CmsboxNavigationElastic._elastic_offset){try{return CmsboxNavigationElastic._elastic_offset(page_or_element,offset)
}catch(exception){return 0
}}return 0
},_scroll_animated:function(page_or_element,duration,event){var self=this;
Effect.ScrollTo(page_or_element,{offset:0-self._fixed_offset-self._elastic_offset(page_or_element),duration:duration,transition:self._transition,afterFinish:function(){self._on_scroll_to_page(self._page(page_or_element),event);
self._jumping=false
}})
},_scroll:function(page_or_element,event){var self=this;
var offset=Element.cumulativeOffset(page_or_element);
window.scrollTo(offset[0],offset[1]-self._fixed_offset-self._elastic_offset(page_or_element,offset));
self._on_scroll_to_page(self._page(page_or_element),event);
self._jumping=false
},_jump_to_page_with_offset:function(page_offset,event){var page=this._page_with_offset(page_offset);
if(page){this._jump_to_element(page,this._duration,true,event);
this._on_push_page(page);
Event.stop(event);
return false
}},_can_jump:function(){return !Cmsbox.isEditmode()&&!Cmsbox.hasLightbox()
},_on_load:function(event){this._setup()
},_on_click:function(event,anchor,hash){if(!this._can_jump()){return
}var element=$(hash||anchor.readAttribute("data-jump"));
if(element){this._jump_to_element(element,this._duration,true,event);
this._on_push(anchor);
Event.stop(event);
if(window.CmsboxMobile&&CmsboxMobile&&CmsboxMobile.close_navigation){CmsboxMobile.close_navigation()
}return false
}},_on_keyup:function(event){if(!this._can_jump()){return
}if(event.keyCode==38){return this._jump_to_page_with_offset(-1,event)
}if(event.keyCode==40){return this._jump_to_page_with_offset(1,event)
}},_on_resize:function(event){this._setup()
},_page_current:function(){return $(this._current_page||$$(".cb-page-selected")[0]||this._pages()[0])
},_page_first:function(){return this._pages()[0]
},_page_last:function(){var pages=this._pages();
return pages[pages.length-1]
},_page_random:function(){var pages=this._pages();
return pages[Math.round(Math.random()*(pages.length-1))]
},_pages:function(){return $$(".cb-page")
},_pages_scrollable:function(){var self=this;
return self._pages().select(function(page){return !self._ignore_on_scroll($(page))
})
},_ignore_on_scroll:function(page,event){return(/fixed/i).test(page.getStyle("position"))||(/none/i).test(page.getStyle("display"))||page.getHeight()<=0
},_on_scroll:function(event){var self=this;
if(!self._scrolling&&!self._jumping){self._scrolling=true;
var previous_page=self._current_page;
var previous_scroll_y=self._current_scroll_y;
self._current_scroll_y=Position.windowOffset()[1];
self._scrolling_top_down=self._current_scroll_y>previous_scroll_y;
var viewport_height=Position.windowBounds()[1];
var offset=Number.MAX_VALUE;
var pages=self._pages_scrollable();
for(var i=0;
i<pages.length;
i++){var each=pages[i];
var offset_top=each.viewportOffset().top-self._fixed_offset+(each.getDimensions().height*(self._scrolling_top_down?0:1))+(viewport_height*(self._scrolling_top_down?0.5:-0.25));
if(offset_top>0&&offset_top<offset&&viewport_height-offset_top>0){offset=offset_top;
self._current_page=each
}}if(!self._current_page){self._current_page=$($$(".cb-page-selected")[0]||pages[0])
}if(previous_page!=self._current_page){self._on_scroll_over(self._current_page,previous_page,event)
}if(self._can_jump()&&self._current_page!=previous_page){self._update_anchors()
}self._scrolling=false
}},_update_anchors:function(){var self=this;
if(!self._current_page){self._current_page=$($$(".cb-page-selected")[0]||self._pages_scrollable()[0]||self._pages()[0])
}if(self._current_page){var anchors=$(self._cache_pages_and_anchors[self._current_page.id]||[]);
if(anchors&&anchors.length>0){self._on_push(anchors[0])
}else{self._on_push_page(self._current_page)
}}},_on_scroll_to_page:function(current_page,event){if(!current_page){return
}var previous_page=this._current_page;
this._current_page=current_page;
this._on_scroll_over(current_page,previous_page,event)
},_on_scroll_over:function(current_page,previous_page,event){var self=this;
$$(".cb-page-selected").each(function(each){each.removeClassName("cb-page-selected")
});
var top_navi_candidates=$$(".navi").filter(function(navi){return !navi.hasClassName("cb-invisible")&&!navi.up().hasClassName("item")&&Selector.findChildElements(navi,[".here"]).length!=0
});
top_navi_candidates.each(function(top_navi){Selector.findChildElements(top_navi,[".path",".here"]).each(function(each){each.removeClassName("path");
each.removeClassName("here")
})
});
$$(".cb-mobile-navigation").each(function(elem){Selector.findChildElements(elem,[".path",".here"]).each(function(each){each.removeClassName("path");
each.removeClassName("here")
})
});
$$("body").each(function(body){$(body.readAttribute("class").split(" ")).each(function(class_name){if(/cb-page-selected-(color|language|layout|sub)/i.test(class_name)){body.removeClassName(class_name)
}})
});
var anchors=$([]);
if(current_page){current_page.addClassName("cb-page-selected");
$(current_page.readAttribute("class").split(" ")).each(function(class_name){if(/cb-page-(color|language|layout|sub)/i.test(class_name)){$$("body").each(function(body){body.addClassName(class_name.replace("cb-page-","cb-page-selected-"))
})
}});
anchors=$(self._cache_pages_and_anchors[current_page.id]||[]);
if(CmsboxSlideshows){CmsboxSlideshows.on_scroll_over()
}}if(anchors){anchors.each(function(anchor){anchor.addClassName("here");
anchor.up().addClassName("here");
self._navigation_parent_items(anchor).each(function(item){item.addClassName("path");
self._navigation_child_anchors(item).each(function(item_anchor){item_anchor.addClassName("path")
})
})
})
}},_on_push_page:function(page){if(page){var page_href=page.readAttribute("data-href");
if(page_href){this._on_push(page,null,page_href);
return
}if(page.id){var anchors=$(this._cache_pages_and_anchors[page.id]||[]);
if(anchors&&anchors.length>0){this._on_push(anchors[0]);
return
}}}},_on_push:function(anchor,alternative_title,alternative_href){if(anchor&&(alternative_href||anchor.href)&&window.history&&history&&history.pushState){try{history.pushState({offset:Position.windowOffset()[1]},alternative_title||anchor.title,alternative_href||anchor.href)
}catch(error){}}}};
CmsboxNavigationScroll.setup();
var CmsboxGotoTop={setup:function(){var self=this;
Event.observe(window,"load",function(event){self._on_load(event)
});
Ajax.Responders.register({onComplete:function(response){self._on_load(response)
}});
Cmsbox.observe_scroll(function(event){self._on_scroll(event)
})
},_is_visible:function(each,event,position){var attribute=each.readAttribute("data-offset-top")||"";
var offset=parseFloat(attribute)||0;
if(/.+%/i.test(attribute)){offset=(Position.pageBounds()[1]*offset/100)
}return position[1]>offset
},_on_load:function(event){var self=this;
$$(".cb-goto-top").each(function(each){var each=$(each);
Event.stopObserving(each);
Element.observe(each,"click",function(event){self._on_click(each)
})
})
},_on_click:function(each,event){this._scroll_to(each,$("root"),event)
},_scroll_to:function(each,target,event){if(target){CmsboxNavigationScroll._jump_to_element(target,CmsboxNavigationScroll._duration||0.5,true,event)
}},_on_scroll:function(event){var self=this;
var position=Position.windowOffset();
$$(".cb-goto-top").each(function(each){var each=$(each);
if(self._is_visible(each,event,position)){each.addClassName("cb-goto-top-visible")
}else{each.removeClassName("cb-goto-top-visible")
}})
}};
CmsboxGotoTop.setup();
var CmsboxGotoPages={setup:function(){var self=this;
Event.observe(window,"load",function(event){self._on_load(event)
});
Ajax.Responders.register({onComplete:function(response){self._on_load(response)
}})
},_on_load:function(event){var self=this;
self._on_click(".cb-goto-page-previous",function(each,event){return Element.previous(CmsboxNavigationScroll._page_current())
});
self._on_click(".cb-goto-page-next",function(each,event){return Element.next(CmsboxNavigationScroll._page_current())
});
self._on_click(".cb-goto-page-first",function(each,event){return Element.previous(CmsboxNavigationScroll._page_first())
});
self._on_click(".cb-goto-page-last",function(each,event){return Element.next(CmsboxNavigationScroll._page_last())
});
self._on_click(".cb-goto-page-random",function(each,event){return Element.next(CmsboxNavigationScroll._page_random())
})
},_on_click:function(selector,callback_page){if(selector&&callback_page){$$(selector).each(function(each){var each=$(each);
Event.stopObserving(each);
Element.observe(each,"click",function(event){try{var target=callback_page(each,event);
if(target){CmsboxNavigationScroll._jump_to_element(target,CmsboxNavigationScroll._duration||0.5,true,event)
}}catch(exception){}})
})
}}};
CmsboxGotoPages.setup();
var CmsboxToggleTargets={_toggle_class:".cb-toggle",_toggle_navi_options_class:".cb-toggle-navi-options",_data_navi_options:"data-toggle-navi-options",_navigation_option_wrappers:[],_registry:{click_handlers:[]},setup:function(){var self=this;
Event.observe(window,"load",function(event){self._handle_load(event)
});
Ajax.Responders.register({onComplete:function(response){self._handle_load(response)
}})
},_setup_event_handlers:function(){var self=this;
$$(self._toggle_class).each(function(toggle){toggle.stopObserving();
toggle.observe("click",function(event){self._handle_click(toggle,event)
})
});
self._setup_navigation_click_handlers()
},_execute_postload_actions:function(){var self=this;
var wrapper_loop=function(option_wrapper){(new self.CmsboxTogglePostloadHandler(option_wrapper.sets)).run()
};
self._navigation_option_wrappers.each(wrapper_loop)
},_setup_navigation_click_handlers:function(){var self=this;
var wrapper_loop=function(option_wrapper){(new self.CmsboxToggleSetupNavigationHandler(option_wrapper.sets)).run()
};
self._navigation_option_wrappers.each(wrapper_loop)
},_handle_load:function(event){var self=this;
self._read_navigation_options();
self._setup_event_handlers();
self._execute_postload_actions()
},_handle_click:function(element,event){var self=this;
var handler=self._registry.click_handlers.detect(function(registered){return registered.element==element
});
if(!handler){handler=new self.CmsboxToggleClickedHandler(self._options_for(element),element);
self._registry.click_handlers.push(handler)
}handler.run()
},_read_navigation_options:function(){var self=this;
var option_elements=$$(self._toggle_navi_options_class);
option_elements.each(function(option_element){var config_string=option_element.readAttribute(self._data_navi_options)||"";
var option_sets=config_string.split("];");
var option_wrapper={element:option_element,sets:[]};
self._read_option_sets(option_element,option_sets,option_wrapper);
self._navigation_option_wrappers.push(option_wrapper)
})
},_read_option_sets:function(element,option_sets,option_wrapper){var self=this;
option_sets.each(function(option_set){var options_object=self._default_options();
options=option_set.trim().replace(/[[\]]/g,"").split(";");
options.each(function(option){var key_and_value=option.split(":");
var value=key_and_value.last().trim();
if(/^true|^false$/i.test(value)){options_object[key_and_value.first().trim().replace(/-/g,"_")]=/^true$/i.test(value)
}else{options_object[key_and_value.first().trim().replace(/-/g,"_")]=value
}});
option_wrapper.sets.push({options:options_object})
})
},_options_for:function(element){var self=this;
if(self._navigation_option_wrappers.length==0){return[{options:self._default_options()}]
}var ancestors=element.ancestors();
var option_wrapper=self._navigation_option_wrappers.detect(function(option_wrapper){return ancestors.include(option_wrapper.element)
});
if(option_wrapper){return option_wrapper.sets
}else{return[{options:self._default_options()}]
}},_default_options:function(){return{should_remove_other_toggles:false,elements:"",accordion:false,remove_on_click:false,remove_on_click_anchors:null,remove_on_click_elements:null,reset_all:false,postload_activate_elements:"",postload_activate_toggles:"",any_active_beacon_elements:"",any_active_toggles:null}
},CmsboxToggleHandler:function(option_sets){this._toggle_active_class_name="cb-toggle-active";
this._target_active_class_name="cb-toggle-target-active";
this._toggle_clicked_class_name="cb-toggle-clicked";
this._any_active_beacon_class_name="cb-toggle-beacon-active";
this._data_targets="data-toggle-targets";
this._data_removals="data-toggle-remove";
this._option_sets=option_sets;
this._current_option_set=null;
this._current_option_set_index=0;
this._registry={navigation_anchors:[]};
this.run=function(){};
this.options=(function(){return this._current_option_set.options
}).bind(this);
this._class_name_for_option_set=function(base_class_name){var self=this;
var class_name=base_class_name;
if(self._current_option_set_index>0){class_name+="-"+self._current_option_set_index
}return class_name
};
this._for_each_option_set=function(callback){var self=this;
for(self._current_option_set_index=0;
self._current_option_set_index<self._option_sets.length;
self._current_option_set_index++){self._current_option_set=self._option_sets[self._current_option_set_index];
callback.bind(this)()
}};
this._for_each_option_set(function(){var options=this.options();
if(!options.any_active_toggles){options.any_active_toggles="."+this._class_name_for_option_set(this._toggle_active_class_name)
}})
},CmsboxTogglePostloadHandler:function(option_sets){CmsboxToggleTargets.CmsboxToggleHandler.call(this,option_sets);
this.run=function(){var self=this;
var callback=function(){var elements_class_name=self._class_name_for_option_set(self._target_active_class_name);
var toggles_class_name=self._class_name_for_option_set(self._toggle_active_class_name);
var activation_loop=function(class_name,node){node.addClassName(class_name)
};
$$(self.options().postload_activate_elements).each(activation_loop.curry(elements_class_name));
$$(self.options().postload_activate_toggles).each(activation_loop.curry(toggles_class_name))
};
self._for_each_option_set(callback)
}
},CmsboxToggleSetupNavigationHandler:function(option_sets){CmsboxToggleTargets.CmsboxToggleHandler.call(this,option_sets);
this._anchor_selector=(function(anchor){return !this._registry.navigation_anchors.include(anchor)
}).bind(this);
this.run=function(){var self=this;
var callback=function(){var options=self.options();
if(!options.remove_on_click||!options.remove_on_click_anchors||!options.remove_on_click_elements){return
}var anchors=$$(options.remove_on_click_anchors).select(self._anchor_selector);
anchors.each(function(anchor){self._registry.navigation_anchors.push(anchor);
anchor.observe("click",(function(index,event){$$(options.remove_on_click_elements).each(function(node){var remover=function(){var suffix=(index>0?"-"+index:"");
node.removeClassName("cb-toggle-active"+suffix);
node.removeClassName("cb-toggle-target-active"+suffix);
node.removeClassName("cb-toggle-clicked"+suffix)
};
if(options.reset_all){self._for_each_option_set(function(){remover()
})
}else{remover(index)
}})
}).bind(self._current_option_set_index))
})
};
self._for_each_option_set(callback)
}
},CmsboxToggleClickedHandler:function(option_sets,element){CmsboxToggleTargets.CmsboxToggleHandler.call(this,option_sets);
this.element=element;
this._targets=[];
this._for_each_option_set((function(){this._current_option_set.is_initialized=false
}).bind(this));
this.run=function(){var self=this;
var callback=function(){self._initialize();
self._mark_last_clicked_toggle();
if(self.options().should_remove_other_toggles||self.options().accordion){self.toggle_remove_other_toggles()
}else{self.toggle()
}};
self._for_each_option_set(callback)
};
this.toggle=function(){var self=this;
if(self._is_active()){element.removeClassName(self._class_name_for_option_set(self._toggle_active_class_name));
self._targets.each(function(each){each.removeClassName(self._class_name_for_option_set(self._target_active_class_name))
})
}else{element.addClassName(self._class_name_for_option_set(self._toggle_active_class_name));
self._targets.each(function(each){each.addClassName(self._class_name_for_option_set(self._target_active_class_name))
})
}self.update_any_active_beacons()
};
this.update_any_active_beacons=function(){var self=this;
var callback=function(){if($$(self.options().any_active_toggles).length===0){$$(self.options().any_active_beacon_elements).each(function(node){node.removeClassName(self._any_active_beacon_class_name)
})
}else{$$(self.options().any_active_beacon_elements).each(function(node){node.addClassName(self._any_active_beacon_class_name)
})
}};
self._for_each_option_set(callback)
};
this.toggle_remove_other_toggles=function(){var self=this;
self._elements_to_remove_classes_from().each(function(node){if(node!=self.element&&!self._targets.include(node)){node.removeClassName(self._class_name_for_option_set(self._toggle_active_class_name));
node.removeClassName(self._class_name_for_option_set(self._target_active_class_name));
node.removeClassName(self._class_name_for_option_set(self._toggle_clicked_class_name))
}});
self.toggle()
};
this._initialize=function(){var self=this;
if(self._current_option_set.is_initialized){return
}self._targets=$$(self.element.readAttribute(self._data_targets)||"");
self._read_remove_other_toggles();
self._current_option_set.is_initialized=true
};
this._elements_to_remove_classes_from=function(){var self=this;
var elements=$$(self.options().elements);
if(elements.length==0&&self.options().accordion){elements=$$("."+self._class_name_for_option_set(self._toggle_clicked_class_name)+" ."+self._class_name_for_option_set(self._toggle_active_class_name)+", ."+self._class_name_for_option_set(self._toggle_clicked_class_name)+" ."+self._class_name_for_option_set(self._target_active_class_name))
}return elements
};
this._mark_last_clicked_toggle=function(){var self=this;
var clicked_class_name=self._class_name_for_option_set(self._toggle_clicked_class_name);
$$("."+clicked_class_name).each(function(container){container.removeClassName(clicked_class_name)
});
var up=self.element.up(".navi")||element.up();
up.addClassName(clicked_class_name)
};
this._is_active=function(){var self=this;
return(!self._targets||self._targets.all(function(target){return target.hasClassName(self._class_name_for_option_set(self._target_active_class_name))
}))
};
this._read_remove_other_toggles=function(){var self=this;
var remove_other_toggles=element.readAttribute(self._data_removals)||"";
if(!remove_other_toggles||(/false/i).test(remove_other_toggles)){self.options().should_remove_other_toggles=false
}else{if(remove_other_toggles&&(/true/i).test(remove_other_toggles)){self.options().should_remove_other_toggles=true
}else{self.options().elements=remove_other_toggles;
self.options().should_remove_other_toggles=!self.options().accordion
}}}
}};
CmsboxToggleTargets.setup();
CmsboxMultiElementMood={timer:null,_options:{slide_interval:7000,start_delay:7000},set_options:function(options){var self=this;
for(var property in options){self._options[property]=options[property]
}},start_initial_timer:function(delay){var self=this;
self.timer=setTimeout(self.start_timer.bind(self),delay)
},start_timer:function(){var self=this;
self.next(true);
clearTimeout(self.timer);
self.timer=setTimeout(self.start_timer.bind(self),self._options.slide_interval)
},deactivate_index_element:function(){$$(".cb-jsmood-index__a--active").each(function(element){element.removeClassName("cb-jsmood-index__a--active")
})
},activate_index_element:function(number){$$(".cb-jsmood-index__a").each(function(anchor){if(parseInt(anchor.readAttribute("data-id"),10)==number){anchor.addClassName("cb-jsmood-index__a--active")
}})
},deactivate_element:function(element){element.removeClassName("cb-jsmood--active")
},activate_element:function(element){element.addClassName("cb-jsmood--active")
},show:function(number){var self=this;
$$(".cb-jsmood-wrapper").each(function(element){active_elements=element.select(".cb-jsmood--active");
mood_elements=element.select(".cb-jsmood");
mood_elements.each(function(e){self.deactivate_element(e)
})
});
self.deactivate_index_element();
self.activate_element(mood_elements[number]);
self.activate_index_element(number)
},next:function(forward){var self=this;
self.deactivate_index_element();
$$(".cb-jsmood-wrapper").each(function(element){active_elements=element.select(".cb-jsmood--active");
mood_elements=element.select(".cb-jsmood");
if(active_elements.length==0){var index=Math.floor(Math.random()*mood_elements.length);
self.activate_element(mood_elements[index]);
self.activate_index_element(index);
return false
}nextElementIndex=mood_elements.indexOf(active_elements[0]);
if(forward){nextElementIndex=nextElementIndex+1;
if(mood_elements.length<=nextElementIndex){nextElementIndex=0
}}else{nextElementIndex=nextElementIndex-1;
if(nextElementIndex<0){nextElementIndex=mood_elements.length-1
}}mood_elements.each(function(e){self.deactivate_element(e)
});
self.activate_element(mood_elements[nextElementIndex]);
self.activate_index_element(nextElementIndex)
});
return false
},setup:function(){var self=this;
$$(".cb-jsmood-index__a").each(function(bullet){bullet.observe("click",(function(bullet,event){clearTimeout(self.timer);
self.show(parseInt(bullet.readAttribute("data-id"),10));
self.start_initial_timer(self._options.slide_interval)
}).curry(bullet))
});
$$(".cb-jsmood-previous__a").each(function(anchor){anchor.observe("click",function(){clearTimeout(self.timer);
self.next(false);
self.start_initial_timer(self._options.slide_interval)
})
});
$$(".cb-jsmood-next__a").each(function(anchor){anchor.observe("click",function(){clearTimeout(self.timer);
self.next(true);
self.start_initial_timer(self._options.slide_interval)
})
});
self.start_initial_timer(self._options.start_delay)
},initialize:function(){var self=this;
document.observe("dom:loaded",self.setup.bind(self));
Ajax.Responders.register({onComplete:function(){clearTimeout(self.timer);
self.setup()
}})
}};
CmsboxMultiElementMood.initialize();
Position.windowBounds=function(){var x=window.innerWidth||self.innerWidth||document.documentElement.clientWidth||document.body.clientWidth||0;
var y=window.innerHeight||self.innerHeigth||document.documentElement.clientHeight||document.body.clientHeight||0;
return[x,y]
};
Position.windowOffset=function(){var x=window.scrollX||window.pageXOffset||window.scrollLeft||document.body.scrollLeft||document.documentElement.scrollLeft||document.body.parentNode.scrollLeft||0;
var y=window.scrollY||window.pageYOffset||window.scrollTop||document.body.scrollTop||document.documentElement.scrollTop||document.body.parentNode.scrollTop||0;
return[x,y]
};
Position.pageBounds=function(){var x=document.body.scrollWidth||0;
var y=(window.innerHeight&&window.scrollMaxY?window.innerHeight+window.scrollMaxY:document.body.scrollHeight)||0;
return[x,y]
};
Object.extend(Element.Methods,{getPosition:function(element){var pos={x:0,y:0};
var obj=element;
do{pos.x+=obj.offsetLeft;
pos.y+=obj.offsetTop
}while(obj=obj.offsetParent);
/*@cc_on
			@if (@_jscript_version < 5.7)
				pos = { x:0, y:0 };
			@end
		@*/
return Cmsbox.toJSON(pos)
}});
Object.extend(Event,{isRightClick:function(event){return(((event.which)&&(event.which==3))||((event.button)&&(event.button==2)))
},isMiddleClick:function(event){return(((event.which)&&(event.which==4))||((event.button)&&(event.button==1)))
}});
Element.Methods.setStyle=function(element,styles,camelized){element=$(element);
var elementStyle=element.style;
for(var property in styles){if(property=="opacity"){element.setOpacity(styles[property])
}else{elementStyle[(property=="float"||property=="cssFloat")?(elementStyle.styleFloat===undefined?"cssFloat":"styleFloat"):(camelized?property:property.camelize())]=styles[property]
}}return element
};
if(Prototype.Browser.IE){Effect.Fade=function(element){element=$(element);
var oldOpacity=element.getInlineOpacity();
var options=Object.extend({from:element.getOpacity()||1,to:0,beforeSetup:function(effect){effect.element.setOpacity(effect.options.from).show()
},afterFinishInternal:function(effect){if(effect.options.to!=0){return
}effect.element.hide().setOpacity(oldOpacity||0)
}},arguments[1]||{});
return new Effect.Opacity(element,options)
}
}Object.extend(Cmsbox,{menu:function(element){if(Prototype.Browser.IE){if(!window.XMLHttpRequest){element=$(element);
if(element){element.observe("mouseover",function(event){element.childElements().select(function(each){return each.tagName=="dd"|each.tagName=="DD"
}).each(function(each){each.addClassName("hover");
each.removeClassName("cb-invisible");
each.style.display="block"
})
}.bindAsEventListener(this));
element.observe("mouseout",function(event){element.childElements().select(function(each){return each.tagName=="dd"|each.tagName=="DD"
}).each(function(each){each.removeClassName("hover");
each.addClassName("cb-invisible");
each.style.display="none"
})
}.bindAsEventListener(this));
return true
}return false
}}return true
}});
var DatePicker={version:"2.5",copyright:"(c) Copyright 2007-2014 cmsbox GmbH. All Rights Reserved. http://www.cmsbox.com",_day:[1,2,3,4,5,6,0],setup:function(options){this._days=options.weeknames;
this._months=options.monthnames;
return this
},show:function(element){var element=$(element);
if(this._element==element){return
}if(this._element){this.hide(true)
}this._element=element;
this._options=Object.extend({onComplete:Prototype.emptyFunction,marks:{}},arguments[1]||{});
this._options.dates=this._buildDates();
this._previous=this._selectedDate();
this._calendar=new Element("div",{"class":"calendar"});
this._calendar.setStyle({marginTop:"20px",position:"absolute",right:"20px",top:"100%"});
this._calendar.update(this._buildCalendar());
element.parentNode.insertBefore(this._calendar,null);
this._eventKeyDown=this._onKeyDown.bindAsEventListener(this);
this._eventFocus=this._onFocus.bindAsEventListener(this);
this._element.observe("keydown",this._eventKeyDown);
document.observe("focus",this._eventFocus);
document.observe("click",this._eventFocus)
},hide:function(notify){if(this._calendar&&this._calendar.parentNode){Event.stopObserving(this._element,"keydown",this._eventKeyDown);
Event.stopObserving(document,"focus",this._eventFocus);
this._calendar.remove();
var selected=this._selectedDate();
if(notify&&selected.toUTCString()!=this._previous.toUTCString()){this._options.onComplete(this._element,selected)
}if(this._element){this._element.blur()
}this._element=this._options=this._calendar=this._previous=null
}},change:function(months,days){var d1=new Date(this._selectedDate().getTime()+86400000*days),d2;
if(months%12==0){d2=new Date(d1.getFullYear()+months/12,d1.getMonth(),d1.getDate())
}else{if(d1.getMonth()==0&&months==-1){d2=new Date(d1.getFullYear()-1,11,d1.getDate())
}else{d2=new Date(d1.getFullYear(),d1.getMonth()+months,d1.getDate())
}}if(d2.getDate()!=d1.getDate()){d2=new Date(d2.getFullYear(),d2.getMonth(),0)
}this._update(d2)
},pick:function(date){this._update(date);
this.hide(true)
},_onKeyDown:function(event){switch(event.keyCode){case Event.KEY_UP:this.change(0,-1);
break;
case Event.KEY_DOWN:this.change(0,+1);
break;
case Event.KEY_ESC:this._update(this._previous);
this.hide(false);
break;
case Event.KEY_RETURN:this.pick(this._selectedDate());
break;
default:break
}if(event.keyCode==190||(48<=event.keyCode&&event.keyCode<=57)){return
}Event.stop(event)
},_onFocus:function(event){var element=Event.element(event);
if(element==this._element){return true
}if(element!=document){var elements=element.ancestors();
if(elements.include(this._element)||elements.include(this._calendar)){return true
}}this.hide(true);
return true
},_update:function(date){this._element.value=(date.getDate()<10?"0":"")+(date.getDate())+"."+(date.getMonth()<9?"0":"")+(date.getMonth()+1)+"."+(date.getFullYear());
this._calendar.innerHTML=this._buildCalendar();
this._element.focus()
},_selectedDate:function(){var values=this._element.value.split(".");
if(values.length==3){return new Date(values[2],values[1]-1,values[0])
}else{return new Date()
}},_buildChange:function(label,months,days){return'<a href="javascript:DatePicker.change('+months+","+days+')">'+label+"</a>"
},_buildPick:function(year,month,day,text){return'<a href="javascript:DatePicker.pick(new Date('+year+","+month+","+day+'))">'+(text?text:(day<10?"&nbsp;":"")+day)+"</a>"
},_buildDates:function(){var result={};
var date_collector=function(date){date=new Date(date.getFullYear(),date.getMonth(),date.getDate());
var current=result[date];
result[date]=current?current+" "+name:name
};
for(var name in this._options.marks){this._options.marks[name].each(date_collector)
}return result
},_buildCalendar:function(){var day=1;
var today=new Date();
var date=this._selectedDate();
var firstWeekday=new Date(date.getFullYear(),date.getMonth(),1).getDay();
var lastDateOfMonth=new Date(date.getFullYear(),date.getMonth()+1,0).getDate();
var stream='<table><thead><tr class="month"><th style="text-align: left">'+this._buildChange("&lt;&lt;",-1,0)+'</th><th colspan="5">'+this._buildPick(today.getFullYear(),today.getMonth(),today.getDate(),this._months[date.getMonth()]+" "+date.getFullYear())+'</th><th style="text-align: right">'+this._buildChange("&gt;&gt;",1,0)+"</th>";
"</tr>";
stream+='<tr class="week">';
for(var i=0;
i<this._days.length;
i++){stream+="<th>"+this._days[i]+"</th>"
}stream+="</tr></thead><tbody>";
while(day<=lastDateOfMonth){stream+="<tr>";
for(var day_num=0;
day_num<this._days.length;
day_num++){if((1<day||firstWeekday==this._day[day_num])&&(day<=lastDateOfMonth)){var current=new Date(date.getFullYear(),date.getMonth(),day);
var classes=date.getDate()==day?"show ":"";
if(this._options.dates[current]){classes+=this._options.dates[current]
}stream+='<td class="'+classes+'">'+this._buildPick(date.getFullYear(),date.getMonth(),day)+"</td>";
day++
}else{stream+="<td>&nbsp;</td>"
}}stream+="</tr>"
}stream+="</tbody></table>";
return stream
}};
if(Prototype.Browser.IE&&navigator.userAgent.indexOf("MSIE 7")>=0){var fix_ie7_navigation=function(){$$("div.navi").each(function(each){var children=each.childElements();
if(children.length==0){var node=document.createComment(" ");
each.appendChild(node)
}})
};
Event.observe(window,"load",fix_ie7_navigation);
Ajax.Responders.register({onCreate:function(){fix_ie7_navigation()
},onComplete:function(){fix_ie7_navigation()
}})
}var detectableWithVB=false;
Object.extend(Cmsbox,{_plugins:{},_pluginsDetected:false,_pluginsCookieIdentifier:"plugins",plugins:function(){this._ensurePlugins();
return this._plugins
},hasPlugins:function(){return this.pluginsSize>0
},pluginsSize:function(){var plugins=0;
for(var key in this._plugins){plugins=plugins+1
}return plugins
},hasPluginFlash:function(){return this._hasPlugin("Flash")
},hasPluginDirector:function(){return this._hasPlugin("Director")
},hasPluginQuickTime:function(){return this._hasPlugin("QuickTime")
},hasPluginRealMedia:function(){return this._hasPlugin("RealMedia")
},hasPluginWindowsMedia:function(){return this._hasPlugin("WindowsMedia")
},hasPluginSilverlight:function(){return this._hasPlugin("Silverlight")
},hasPluginDivX:function(){return this._hasPlugin("DivX")
},_hasPlugin:function(string){this._ensurePlugins();
return this._plugins[string]==true
},_reset:function(){this._plugins={};
this._pluginsDetected=false;
document.cookie=this._pluginsCookieIdentifier+"="
},_ensurePlugins:function(){if(!this._pluginsDetected){var start=document.cookie.indexOf(this._pluginsCookieIdentifier);
if(start!=-1){var end=document.cookie.indexOf(";",start);
if(end==-1){end=document.cookie.length
}try{this._plugins=document.cookie.substring(start+this._pluginsCookieIdentifier.length+1,end).evalJSON(true)
}catch(Error){}}else{document.cookie=this._pluginsCookieIdentifier+"="+Cmsbox.toJSON(this._plugins)
}if(!this.hasPlugins()){this._detectPlugins();
this._pluginsDetected=true
}else{this._pluginsDetected=false
}}},_detectPlugins:function(){this._detectPluginDivX();
this._detectPluginFlash();
this._detectPluginDirector();
this._detectPluginQuickTime();
this._detectPluginRealMedia();
this._detectPluginSilverlight();
this._detectPluginWindowsMedia()
},_detectPluginFlash:function(){this._plugins.Flash=this._detectPlugin("Shockwave","Flash");
if(!this._plugins.Flash&&detectableWithVB){this._plugins.Flash=detectActiveXControl("ShockwaveFlash.ShockwaveFlash.1")
}},_detectPluginDirector:function(){this._plugins.Director=this._detectPlugin("Shockwave","Director");
if(!this._plugins.Director&&detectableWithVB){this._plugins.Director=detectActiveXControl("SWCtl.SWCtl.1")
}},_detectPluginQuickTime:function(){this._plugins.QuickTime=this._detectPlugin("QuickTime");
if(!this._plugins.QuickTime&&detectableWithVB){this._plugins.QuickTime=detectQuickTimeActiveXControl()
}},_detectPluginRealMedia:function(){this._plugins.RealMedia=this._detectPlugin("RealPlayer");
if(!this._plugins.RealMedia&&detectableWithVB){this._plugins.RealMedia=(detectActiveXControl("rmocx.RealPlayer G2 Control")||detectActiveXControl("RealPlayer.RealPlayer(tm) ActiveX Control (32-bit)")||detectActiveXControl("RealVideo.RealVideo(tm) ActiveX Control (32-bit)"))
}},_detectPluginDivX:function(){this._plugins.DivX=this._detectPlugin("DivX");
if(!this._plugins.DivX&&detectableWithVB){this._plugins.DivX=detectActiveXControl("npdivx.DivXBrowserPlugin.1")
}},_detectPluginSilverlight:function(){try{createSilverlight();
Silverlight.isInstalled(this);
this._plugins.Silverlight=Silverlight.available
}catch(Error){this._plugins.Silverlight=false
}},_detectPluginWindowsMedia:function(){this._plugins.WindowsMedia=this._detectPlugin("Windows Media");
if(!this._plugins.WindowsMedia&&detectableWithVB){this._plugins.WindowsMedia=detectActiveXControl("MediaPlayer.MediaPlayer.1")
}},_detectPlugin:function(){var daPlugins=arguments;
var pluginFound=false;
if(navigator.plugins&&navigator.plugins.length>0){var pluginsArrayLength=navigator.plugins.length;
for(pluginsArrayCounter=0;
pluginsArrayCounter<pluginsArrayLength;
pluginsArrayCounter++){var numFound=0;
for(namesCounter=0;
namesCounter<daPlugins.length;
namesCounter++){if((navigator.plugins[pluginsArrayCounter].name.indexOf(daPlugins[namesCounter])>=0)||(navigator.plugins[pluginsArrayCounter].description.indexOf(daPlugins[namesCounter])>=0)){numFound++
}}if(numFound==daPlugins.length){pluginFound=true;
break
}}}return pluginFound
}});
if((navigator.userAgent.indexOf("MSIE")!=-1)&&(navigator.userAgent.indexOf("Win")!=-1)){var stream='<script language="VBscript">';
stream+="detectableWithVB = False";
stream+="If ScriptEngineMajorVersion >= 2 then";
stream+=" detectableWithVB = True";
stream+="End If";
stream+="Function detectActiveXControl(activeXControlName)";
stream+=" on error resume next";
stream+=" detectActiveXControl = False";
stream+=" If detectableWithVB Then";
stream+="		detectActiveXControl = IsObject(CreateObject(activeXControlName))";
stream+=" End If";
stream+="End Function";
stream+="Function detectQuickTimeActiveXControl()";
stream+=" on error resume next";
stream+=" detectQuickTimeActiveXControl = False";
stream+=" If detectableWithVB Then";
stream+="		detectQuickTimeActiveXControl = False";
stream+="		hasQuickTimeChecker = false";
stream+='		Set hasQuickTimeChecker = CreateObject("QuickTimeCheckObject.QuickTimeCheck.1")';
stream+="		If IsObject(hasQuickTimeChecker) Then";
stream+="			If hasQuickTimeChecker.IsQuickTimeAvailable(0) Then ";
stream+="				detectQuickTimeActiveXControl = True";
stream+="			End If";
stream+="		End If";
stream+=" End If";
stream+="End Function";
document.write(stream);
document.writeln("<\/script>")
}CmsboxCookieWarning={_key:"cb-cookie-warning-choice",element:null,setup:function(){if(!this._was_choice_made){Event.observe(window,"load",this._setup.bind(this))
}},show:function(){this._toggleVisibilityWith(Element.removeClassName)
},hide:function(){this._toggleVisibilityWith(Element.addClassName)
},accept:function(){this._write("accepted");
document.location.reload(true)
},decline:function(){this._write("declined");
this.hide()
},was_choice_made:function(){if(Cmsbox.is_web_storage_available("localStorage")){return !!window.localStorage.getItem(this._key)
}return CmsboxCookies.hasItem(this._key)
},was_accepted:function(){return this.was_choice_made()&&this._read()=="accepted"
},reset:function(){window.localStorage.removeItem(this._key);
CmsboxCookies.removeItem(this._key)
},_setup:function(){this.element=$("cb-cookie-warning");
if(this.element){this._setup_event_handlers();
this.show()
}},_setup_event_handlers:function(){var self=this;
$("cb-cookie-warning__button--decline").observe("click",self.decline.bind(self));
$("cb-cookie-warning__button--accept").observe("click",self.accept.bind(self))
},_write:function(choice){if(Cmsbox.is_web_storage_available("localStorage")){window.localStorage.setItem(this._key,choice)
}CmsboxCookies.setItem(this._key,choice)
},_read:function(choice){var value=null;
if(Cmsbox.is_web_storage_available("localStorage")){value=window.localStorage.getItem(this._key)
}if(value){return value
}else{return CmsboxCookies.getItem(this._key)
}},_toggleVisibilityWith:function(method){method(this.element,"cb-cookie-warning--hidden")
}};
CmsboxCookieWarning.setup();
CmsboxCookies={getItem:function(sKey){if(!sKey){return null
}return decodeURIComponent(document.cookie.replace(new RegExp("(?:(?:^|.*;)\\s*"+encodeURIComponent(sKey).replace(/[\-\.\+\*]/g,"\\$&")+"\\s*\\=\\s*([^;]*).*$)|^.*$"),"$1"))||null
},setItem:function(sKey,sValue,vEnd,sPath,sDomain,bSecure){if(!sKey||/^(?:expires|max\-age|path|domain|secure)$/i.test(sKey)){return false
}var sExpires="";
if(vEnd){switch(vEnd.constructor){case Number:sExpires=vEnd===Infinity?"; expires=Fri, 31 Dec 9999 23:59:59 GMT":"; max-age="+vEnd;
break;
case String:sExpires="; expires="+vEnd;
break;
case Date:sExpires="; expires="+vEnd.toUTCString();
break
}}document.cookie=encodeURIComponent(sKey)+"="+encodeURIComponent(sValue)+sExpires+(sDomain?"; domain="+sDomain:"")+(sPath?"; path="+sPath:"")+(bSecure?"; secure":"");
return true
},removeItem:function(sKey,sPath,sDomain){if(!this.hasItem(sKey)){return false
}document.cookie=encodeURIComponent(sKey)+"=; expires=Thu, 01 Jan 1970 00:00:00 GMT"+(sDomain?"; domain="+sDomain:"")+(sPath?"; path="+sPath:"");
return true
},hasItem:function(sKey){if(!sKey){return false
}return(new RegExp("(?:^|;\\s*)"+encodeURIComponent(sKey).replace(/[\-\.\+\*]/g,"\\$&")+"\\s*\\=")).test(document.cookie)
},keys:function(){var aKeys=document.cookie.replace(/((?:^|\s*;)[^\=]+)(?=;|$)|^\s*|\s*(?:\=[^;]*)?(?:\1|$)/g,"").split(/\s*(?:\=[^;]*)?;\s*/);
for(var nLen=aKeys.length,nIdx=0;
nIdx<nLen;
nIdx++){aKeys[nIdx]=decodeURIComponent(aKeys[nIdx])
}return aKeys
}};