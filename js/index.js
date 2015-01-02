document.addEventListener('deviceready', function() {
 	setTimeout(function() { navigator.splashscreen.hide(); }, 3000);
});  


(function($) {
var url = "http://www.siradanbiri.com/feeds/posts/default?alt=json-in-script&callback=?";

$.ajax({
   type: 'GET',
    url: url,
    async: false,
    jsonpCallback: 'jsonCallback',
    contentType: "application/json",
    dataType: 'jsonp',
    success: function(json) {
       posts(json);
    },
    error: function(e) {
       console.log(e.message);
    }
});
 
})(jQuery);

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

function strip(html)
{
   var tmp = document.createElement("DIV");
   tmp.innerHTML = html;
   return tmp.textContent || tmp.innerText || "";
}

function posts(json) {


    var html = "";

  	for (var i = 0; i < json.feed.entry.length; i++)
	{
		
	    for (var j=0; j < json.feed.entry[i].link.length; j++)
	    {
	      if (json.feed.entry[i].link[j].rel == 'alternate')
	      {
	        posturl = json.feed.entry[i].link[j].href;
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
        
        html = html + "<li>" + "<a href='javascript:open_browser(\"" + posturl + "?m=1\")'>" + "<h2>" + postcontent + "</h2>" + "<p>" + date + "</p></a></li>";
        
        document.getElementById("postsList").innerHTML = html;
        $("#postsList").listview("refresh");

	}	

}

function open_browser(link)
{
    window.open(link, '_blank', 'location=yes');
}
