document.addEventListener('deviceready', function() {
 	setTimeout(function() { navigator.splashscreen.hide(); }, 3000);
});  



$( document ).on( "pagebeforeshow", "#postIndex", function() {

	var url = "https://www.blogger.com/feeds/1006778221783468213/posts/default?alt=json-in-script&callback=?";

	$.ajax({
	   type: 'GET',
	    url: url,
	    async: false,
	    contentType: "application/json",
	    dataType: 'jsonp',
	    timeout: 5000,
	    success: function(json) {
	       posts(json);
	    },
	    error: function (xOptions, textStatus) {
		$("#dialog #title").html(textStatus);
	        $("#dialog #content").html("" + xOptions.context);        
		$.mobile.changePage('#dialog', {transition: 'pop', role: 'dialog'});        
	    }
	});
 
});


function tarih(date){

	if(date % 1 !== 0) return false;  
	if(date<1000) return false;

	var time    = (parseInt(new Date().getTime()))/1000;
	var fark 	= time-parseInt(date); //to get the time since that moment

	if(fark<0) fark= fark * -1;
		
	var tokens = new Array();
		tokens[0] = "yıl";
		tokens[1] = "ay";
		tokens[2] = "hafta";
		tokens[3] = "gün";
		tokens[4] = "saat";
		tokens[5] = "dakika";
		tokens[6] = "saniye";
				
	var values = new Array();
		values[0] = 31536000;
		values[1] = 2592000;
		values[2] = 604800;
		values[3] = 86400;
		values[4] = 3600;
		values[5] = 60;
		values[6] = 1;
		
	for(i=0; i<=tokens.length; i++) {
		if(values[i] > fark) continue;
		var numberOfUnits=Math.ceil(fark/values[i]);
		return numberOfUnits+" "+tokens[i]+" once ";
	}
}

function strip(html) {
   var tmp = document.createElement("DIV");
   tmp.innerHTML = html;
   return tmp.textContent || tmp.innerText || "";
}

function post(json) {
   $("#postPage #title").html( json.entry.title.$t );
   var html = "<h1>"+json.entry.title.$t+"</h1>";
   html += "<p>"+json.entry.content.$t+"</p>";
   $("#postPage #post").html( html );
}

function posts(json) {
    var html = "";

  	for (var i = 0; i < json.feed.entry.length; i++)
	{
		
	    for (var j=0; j < json.feed.entry[i].link.length; j++)
	    {
	      if (json.feed.entry[i].link[j].rel == 'alternate')
	      {
	        var posturl = json.feed.entry[i].link[j].href;
	        break;
	      }

	      if (json.feed.entry[i].link[j].rel == 'self')
	      {
	        var feedurl = json.feed.entry[i].link[j].href;
	        break;
	      }
	    }

	 	if ("content" in json.feed.entry[i]) {
	      var postcontent = json.feed.entry[i].content.$t;}
	    else
	    if ("summary" in json.feed.entry[i]) {
	      var postcontent = json.feed.entry[i].summary.$t;}
	    else var postcontent = "Başlıksız";
	    // strip off all html-tags
	    // reduce postcontent to 200 characters
	    if (postcontent.length > 200) postcontent = strip(postcontent).substring(0,200);
	    else postcontent = strip(postcontent);

		if ("title" in json.feed.entry[i]) {
	      var posttitle = json.feed.entry[i].title.$t;
	    }
	    else {
	      var posttitle = "Başlıksız";
	    }


		if ("published" in json.feed.entry[i]) {
	      	var date = json.feed.entry[i].published.$t;
	      	var d=new Date(date);	 
	      	var n=d.toString();
	      	var d=new Date(n);	 
			date = tarih(d.getTime()/1000);
	  	}
	  	else {
	  		var date = "null";
	  	}
        
        html = html + "<li>" + "<a href='post.html?url="+feedurl+"'>" + "<h2>" + posttitle + "</h2><p>"+postcontent + "</p>" + "<p>" + date + "</p></a></li>";
        
        document.getElementById("postsList").innerHTML = html;
        $("#postsList").listview("refresh");

	}	

}

function open_browser(link)
{
    window.open(link, '_blank', 'location=yes','closebuttoncaption=back');
}

function getQueryVariable(variable)
{
   var query = window.location.search.substring(1);
   var vars = query.split("&");
   for (var i=0;i<vars.length;i++) {
           var pair = vars[i].split("=");
           if(pair[0] == variable){return pair[1];}
   }
   return(false);
}


$( document ).on( "pagebeforeshow", "#postPage", function() {
                
    var postUrl = getQueryVariable("url");
    
	$.ajax({
	   type: 'GET',
	    url: postUrl+"?alt=json-in-script&callback=?",
	    async: false,
	    contentType: "application/json",
	    dataType: 'jsonp',
	    timeout: 5000,
	    success: function(json) {
	       post(json);
	    },
	    error: function (xOptions, textStatus) {
		$("#dialog #title").html(textStatus);
	        $("#dialog #content").html("" + xOptions.context);        
		$.mobile.changePage('#dialog', {transition: 'pop', role: 'dialog'});        
	    }
	});
	 
	
     
});

 /* load external js files */
function loadScript( url, callback) {
	if($('script[src="' + url + '"]').length == 0) {
		var head = document.getElementsByTagName('head')[0];
		var script = document.createElement('script');
		script.type = 'text/javascript';
		script.src = url;
		script.onreadystatechange = callback;
		script.onload = callback;
		head.appendChild(script);
	}
	else {
		callback();
	}
}

/* load external css files */
function loadCss(url){
    var head = document.getElementsByTagName('head')[0];
    var link = document.createElement('link');
    link.rel = 'stylesheet';
	link.href = url;    
    head.appendChild(link);
}

$(document).ready(function(){

        if( navigator.userAgent.match(/Windows Phone/i) ){
                loadScript( "js/winstore-jscompat.js", function() {});
        }

});




