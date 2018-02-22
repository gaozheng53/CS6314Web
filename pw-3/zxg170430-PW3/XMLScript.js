$(document).ready(function () {
		$.ajax({
			url:'movies.xml',
			type:'GET',
			dataType:'xml',
			timeout:1000,  
    		cache:false, 
			error:function(xml){
			alert("Loading XML file error!");
		},
		success:function(xml){
			var flag=$("</td>")
			$(xml).find("movie").each(function(){
				var title = $(this).find("title").text();
				var genre='';
				$.each($(this).find("genre"), function() {			
						genre+=$(this).text()+',' ;
					}
         		 );
				genre=genre.substring(0,genre.length-1)   //cut off last ','

				var mpaarating = $(this).find("mpaa-rating").text();
				var director = $(this).find("director").text();
				var cast='';
				$.each($(this).find("person"), function() {			
						cast+=$(this).attr("name")+',' ;
					}
         		 );
         		 cast=cast.substring(0,cast.length-1) 
				var shortdescription = $(this).find("synopsis").text();
				var imdbrating = $(this).find("score").text();
		
			  		strHtml = "<tr>";
                    strHtml += "<td>" + title + "</td>";
                    strHtml += "<td>" + genre + "</td>";
	                strHtml += "<td>" + mpaarating + "</td>";
	                strHtml += "<td>" + director + "</td>";
	                strHtml += "<td>" + cast + "</td>";
	                strHtml += "<td>" + shortdescription + "</td>";
	                strHtml += "<td>" + imdbrating + "</td>";
					strHtml += "</tr>";  
                 // alert(strHtml)
                 $("table").append($(strHtml));

		});
	}
	});
	});