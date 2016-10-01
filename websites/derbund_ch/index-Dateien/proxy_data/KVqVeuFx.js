



/* ControlTag Loader for Tamedia be7d9a40-d3d2-456f-a3c6-0aa6f4898c19 */
(function(w, cs) {
  
  if (/Twitter for iPhone/.test(w.navigator.userAgent || '')) {
    return;
  }

  var debugging = /kxdebug/.test(w.location);
  var log = function() {
    
    debugging && w.console && w.console.log([].slice.call(arguments).join(' '));
  };

  var load = function(url, callback) {
    log('Loading script from:', url);
    var node = w.document.createElement('script');
    node.async = true;  
    node.src = url;

    
    node.onload = node.onreadystatechange = function () {
      var state = node.readyState;
      if (!callback.done && (!state || /loaded|complete/.test(state))) {
        log('Script loaded from:', url);
        callback.done = true;  
        callback();
      }
    };

    
    var sibling = w.document.getElementsByTagName('script')[0];
    sibling.parentNode.insertBefore(node, sibling);
  };

  var config = {"app":{"name":"krux-scala-config-webservice","version":"3.17.0","schema_version":3},"confid":"KVqVeuFx","context_terms":[{"id":"KgkxVa-h","value":"Hintertreppenroman"},{"id":"Kgm1ZwaP","value":"studentenschaft"},{"id":"Kgm1Zo5M","value":"étudiant"},{"id":"Kgm1ZrOt","value":"disciple"},{"id":"KgkxVZc3","value":"Novelle"},{"id":"Kgm1Z4TC","value":"universita"},{"id":"KgkxVUK6","value":"books"},{"id":"Kgm1Z1nW","value":"studentesco"},{"id":"KiljY4jM","value":"Bootsfahrt"},{"id":"Kgm1Z9eL","value":"schule"},{"id":"KgkxVXG1","value":"Bücherei"},{"id":"Kgm1Zs7z","value":"aspirant"},{"id":"Kgm1ZzR9","value":"studente"},{"id":"Kikt5hhh","value":"Konzert"},{"id":"Kgm1Zutm","value":"estudiantin"},{"id":"Kgm1ZqsA","value":"lycéen"},{"id":"KgkxVe_N","value":"Ritterroman"},{"id":"KisHsr2g","value":"Ferien"},{"id":"KgkxVcOY","value":"Satyrroman"},{"id":"KgkxVYUT","value":"bibliothèque"},{"id":"Kgm1Zw0I","value":"studi"},{"id":"Kgm1ZpW7","value":"élève"},{"id":"KgkxVV6Y","value":"Autor"},{"id":"Kgm1Z5Rg","value":"ateneo"},{"id":"KgkxVam_","value":"Kolportageroman"},{"id":"KgkxVVis","value":"buch"},{"id":"Kgm1ZuSj","value":"redoublant"},{"id":"Kgm1Z0fr","value":"goliardica"},{"id":"KiljY5ET","value":"Ausflug"},{"id":"KgkxVZFa","value":"roman"},{"id":"Kgm1Zy4O","value":"studieren"},{"id":"Kn_pjSYq","value":"Haushalt"},{"id":"Kgm1Zse4","value":"apprenti"},{"id":"Kikt5kOq","value":"Hallenstadion"},{"id":"KisHssYZ","value":"Badeferien"},{"id":"KgkxVd2Z","value":"Schelmenroman"},{"id":"KiktwzCh","value":"Adele"},{"id":"KgkxVcr0","value":"Kriminalromane"},{"id":"KgkxVYs5","value":"neuartig"},{"id":"Kgm1Z2qX","value":"fuoricorso"},{"id":"KisHstW3","value":"Flughafen"},{"id":"KmPiFdEx","value":"petkovic"},{"id":"KiljY3Hy","value":"Gummiboot"},{"id":"Kgm1Z6Ny","value":"politecnico"},{"id":"KgkxVWVk","value":"Schriftsteller"},{"id":"KgkxVaN2","value":"Literatur"},{"id":"Kikt5jfZ","value":"Buehne"},{"id":"Kgm1ZvhV","value":"Studentin"},{"id":"KkFSm11d","value":"Schneider-Ammann"},{"id":"Kgm1Zp21","value":"écolier"},{"id":"Kgm1Zt3e","value":"vétéran"},{"id":"KgkxVfXA","value":"Spannungsbogen"},{"id":"KgkxVb2A","value":"Unterhaltungsroman"},{"id":"Kgm1Zrpc","value":"condisciple"},{"id":"KgkxVU--","value":"buecher"},{"id":"KgkxVeOe","value":"Schauerroman"},{"id":"Kgm1Z0FS","value":"goliardico"},{"id":"KiljY3sg","value":"Boot"},{"id":"KgkxVdDG","value":"Kriminalroman"},{"id":"KisHss3V","value":"Koffer verloren"},{"id":"Kgm1ZsDU","value":"potache"},{"id":"KgkxVXib","value":"Büchersammlung"},{"id":"Kgm1ZxQg","value":"hochschule"},{"id":"Kgm1ZvIC","value":"universitaire"},{"id":"Kgm1Z884","value":"école"},{"id":"KgkxVZ1W","value":"littérature"},{"id":"Kgm1Z3Lj","value":"fuorisede"},{"id":"Kikt5ivm","value":"Musik"},{"id":"KisHsrUr","value":"Reisen"},{"id":"Kgm1ZyEH","value":"universität"},{"id":"Kgm1ZyeM","value":"universitaet"},{"id":"KgkxVbdC","value":"Briefromane"},{"id":"Kgm1Zv8i","value":"student"},{"id":"KgkxVUk3","value":"bücher"},{"id":"Ktx9mIoI","value":"terror"},{"id":"Kikt5iHP","value":"Publikum"},{"id":"KgkxVdcv","value":"Detektivroman"},{"id":"Kgm1ZzrL","value":"universitario"},{"id":"KgkxVWt_","value":"Bibliothek"},{"id":"KiljY4Gv","value":"Boote"},{"id":"Kgm1ZtXM","value":"cancre"},{"id":"Kgm1Z7yb","value":"scuola"},{"id":"KgkxVemZ","value":"Liebesroman"},{"id":"Kgm1Zxql","value":"hochschüler"},{"id":"Kgm1ZqRs","value":"collégien"},{"id":"KgkxVTxo","value":"livres"},{"id":"KgkxVX7z","value":"librairie"},{"id":"Kgm1Z2HS","value":"studentesca"}],"publisher":{"id":1854,"name":"Tamedia","uuid":"be7d9a40-d3d2-456f-a3c6-0aa6f4898c19","version_bucket":"stable","version_hash":"e02612606803e209b9e12577c33ba63c"},"params":{"link_header_bidder":false,"site_level_supertag_config":"site","recommend":false,"control_tag_pixel_throttle":100,"fingerprint":false,"user_data_timing":"load","store_realtime_segments":false,"tag_source":false,"link_hb_start_event":"ready","first_party_uid":false,"link_hb_timeout":2000,"link_hb_adserver_subordinate":true,"optimize_realtime_segments":false,"link_hb_adserver":"dfp","target_fingerprint":false,"context_terms":true,"dfp_premium":true,"control_tag_namespace":"tamedia"},"prioritized_segments":[],"realtime_segments":[{"id":"qoiwaslnm","test":["and",["and",["or",["intersects","$page_attr_xtpage",["ad_insertion::form::step_1::step_1","ad_insertion::form::step_2::step_2","ad_insertion::form_error::step_1::step_1"]]]]]}],"services":{"userdata":"//cdn.krxd.net/userdata/get","contentConnector":"//connector.krxd.net/content_connector","stats":"//apiservices.krxd.net/stats","optout":"//cdn.krxd.net/userdata/optout/status","event":"//beacon.krxd.net/event.gif","set_optout":"//apiservices.krxd.net/consumer/optout","data":"//beacon.krxd.net/data.gif","link_hb_stats":"//beacon.krxd.net/link_bidder_stats.gif","userData":"//cdn.krxd.net/userdata/get","link_hb_mas":"//link.krxd.net/hb","config":"//cdn.krxd.net/controltag/{{ confid }}.js","social":"//beacon.krxd.net/social.gif","addSegment":"//cdn.krxd.net/userdata/add","pixel":"//beacon.krxd.net/pixel.gif","um":"//apiservices.krxd.net/um","click":"//apiservices.krxd.net/click_tracker/track","stats_export":"//beacon.krxd.net/controltag_stats.gif","cookie":"//beacon.krxd.net/cookie2json","proxy":"//cdn.krxd.net/partnerjs/xdi","is_optout":"//beacon.krxd.net/optout_check","impression":"//beacon.krxd.net/ad_impression.gif","transaction":"//beacon.krxd.net/transaction.gif","log":"//jslog.krxd.net/jslog.gif","set_optin":"//apiservices.krxd.net/consumer/optin","usermatch":"//beacon.krxd.net/usermatch.gif"},"site":{"id":264766,"name":"derbund.ch"},"tags":[{"id":23652,"name":"Appnexus User Match","content":"<script>\n(function(){\n        var kuid = Krux('get', 'user');\n        if (kuid) {\n            var prefix = location.protocol == 'https:' ? \"https:\" : \"http:\";\n            var kurl = prefix + '//beacon.krxd.net/usermatch.gif?adnxs_uid=$UID';\n            var appnexus_url = '//ib.adnxs.com/getuid?' + kurl\n            var i = new Image();\n            i.src = appnexus_url;\n        }\n})();\n</script>","target":null,"target_action":"append","timing":"asap","method":"document","internal":true,"template_replacement":true,"criteria":["and",["and",["and",["<=","$frequency",3]]]]},{"id":23350,"name":"Google User Match","content":"<script>\r\n(function() {\r\n  if (Krux('get', 'user') != null) {\r\n      new Image().src = 'https://usermatch.krxd.net/um/v2?partner=google';\r\n  }\r\n})();\r\n</script>","target":"","target_action":"append","timing":"onload","method":"document","internal":true,"template_replacement":true,"criteria":["and",["and",["and",["<=","$frequency",3]]]]},{"id":19563,"name":"Newsnet DE","content":"<script>\n  if (document.getElementsByClassName(\"contextBox keywordBox\")[0]){\n  \tvar pagetagsarray = document.getElementsByClassName(\"contextBox keywordBox\")[0].textContent.replace('Stichworte', '').replace(/\\s+/g,',').split(',');\n\tpagetagsgroups = \"\";\n  pagetagssingle = \"\";\nfor (i=1; i<pagetagsarray.length-1; i++)\n  {\n\tpagetagssingle = pagetagsarray[i];\n\tpagetagsgroups = pagetagsgroups + \", \" + pagetagssingle\n    // Using pagetagssingle to produce page attribute pagetagssingle\n\tKrux('scrape', { 'page_attr_pagetagssingle': {js_global: pagetagssingle[i]}});\n  }\n  // Using page_attr_pagetagsgroups to produce page attribute page_attr_pagetagsgroups\n\tKrux('scrape', { 'page_attr_pagetagsgroups': {js_global: \"pagetagsgroups\"}});\n  }\n\t\n</script>","target":null,"target_action":"append","timing":"onload","method":"document","internal":true,"template_replacement":true,"criteria":[]},{"id":18565,"name":"Exelate UM","content":"<script>\n(function(){\n  var kuid = Krux('get', 'user');\n  if (kuid) {\n    Krux('require:http').pixel({\n      url: \"//loadm.exelator.com/load\",\n      data: {\n          _kdpid: 'e4942ff0-4070-4896-a7ef-e6a5a30ce9f9',\n          buid: kuid,\n          p: '204',\n          g: '270',\n          j: '0'\n      }});\n  }\n  })();\n</script>","target":null,"target_action":"append","timing":"onload","method":"document","internal":true,"template_replacement":true,"criteria":[]},{"id":17849,"name":"All Sites DTC","content":"<script>\n(function(){\n\tvar find = Krux('require:sizzle').find;\n\tvar site = Krux('scrape.url_host','2');\n\tvar scrape_obj = {};\n\n\t//pulling in all values via dom_multi\n\tfunction setscrape(author,story_tags){\n\t\tscrape_obj['page_attr_'+site+'_author'] = {'dom_multi':author};\n\t\tscrape_obj['page_attr_'+site+'_story_tags'] = {'dom_multi':story_tags};\n\t}\n\n\t//specific tag locations for various sites\n\tsite == '20min' && setscrape('p.autor:text','');\n\tsite == 'annabelle' && setscrape('','div.stichworte li:text');\n\tsite == 'bilan' && setscrape('strong.author a[href]:text','ul.field-topic li:text');\n\tsite == 'tilllate' && setscrape('span[itemprop=\"author\"] span:text','');\n\tsite == 'friday-magazine' && setscrape('a.entry_header--details--author_link:text','');\n\tsite == 'fuw' && setscrape('','div.aside1 li:text');\n\n\tif(site == 'femina'){\n\t\tvar tags = Krux('require:sizzle').find('div.field-item.even');\n\t\tvar tags_length = tags.tags_length;\n\t\tfor(var i=0; i<tags_length; i++){\n\t\t\tif(!tags[i].hasChildNodes()){\n\t\t\t\tvar author = tags[i].innerText || tags[i].textContent;\n\t\t\t\tKrux('set','page_attr_femina_author', author);\n\t\t\t\tbreak;\n\t\t\t}\n\t\t}\n\t\tsetscrape('','div.field-item.even a[href]:text');\n\t}\n\n\telse if(site == 'bazonline' || site == 'bernerzeitung' || site == 'derbund' || site == 'tagesanzeiger'){\n\t\tsetscrape('span.author:text','div.contextBox.keywordBox a[href]:text');\n\t}\n\n\tKrux('scrape',scrape_obj);\n})();\n</script>","target":null,"target_action":"append","timing":"onload","method":"document","internal":true,"template_replacement":true,"criteria":[]},{"id":7795,"name":"Krux Standard DTC","content":"<script>\n(function(){\n\tKrux('scrape',{'page_attr_url_path_1':{'url_path':'1'}});\n\tKrux('scrape',{'page_attr_url_path_2':{'url_path':'2'}});\n\tKrux('scrape',{'page_attr_url_path_3':{'url_path':'3'}});\n\tKrux('scrape',{'page_attr_url_path_4':{'url_path':'4'}});  \n\tKrux('scrape',{'page_attr_meta_keywords':{meta_name:'keywords'}});\n\tKrux('scrape',{'page_attr_domain':{url_domain: '2'}});\n})();\n</script>","target":null,"target_action":"append","timing":"onready","method":"document","internal":true,"template_replacement":true,"criteria":[]}],"link":{"adslots":{},"bidders":{}}};
  
  for (var i = 0, tags = config.tags, len = tags.length, tag; (tag = tags[i]); ++i) {
    if (String(tag.id) in cs) {
      tag.content = cs[tag.id];
    }
  }

  
  var esiGeo = String(function(){/*
   <esi:include src="/geoip_esi"/>
   */}).replace(/^.*\/\*[^{]+|[^}]+\*\/.*$/g, '');

  if (esiGeo) {
    log('Got a request for:', esiGeo, 'adding geo to config.');
    try {
      config.geo = w.JSON.parse(esiGeo);
    } catch (__) {
      
      log('Unable to parse geo from:', config.geo);
      config.geo = {};
    }
  }



  var proxy = (window.Krux && window.Krux.q && window.Krux.q[0] && window.Krux.q[0][0] === 'proxy');

  if (!proxy || true) {
    

  load('//cdn.krxd.net/ctjs/controltag.js.e02612606803e209b9e12577c33ba63c', function() {
    log('Loaded stable controltag resource');
    Krux('config', config);
  });

  }

})(window, (function() {
  var obj = {};
  
  return obj;
})());
