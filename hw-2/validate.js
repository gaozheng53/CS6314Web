$(document).ready(function() {

	var text1 = document.createElement("span");
	// text1.innerHTML="initial1";
	var text2 = document.createElement("span");
	// text2.innerHTML="initial2";
	var text3 = document.createElement("span");
	// text3.innerHTML="initial3";
 	$("input#username").after(text1);  //add all
 	$("input#password").after(text2);
 	$("input#email").after(text3);
 	$("span").hide();   


	var username = document.getElementById("username");
	var password = document.getElementById("password");
	var email = document.getElementById("email");
	
	
	//if field not being edit

$("input#username").focus(function(){
	 if(!validate_notempty(username)){   //empty field
		$(text1).hide();
		}else{
			text1.innerHTML="The username field must contain only alphabetical or numeric characters";
			$(text1).show();
			$("input#username").attr("class","info");
		}
  });

  $("input#username").blur(function(){

    if(!validate_notempty(username)){   //empty field
		$(text1).hide();
		}else{
			var re = /^[A-Za-z0-9]+$/; 
			if(!re.test(username.value)){   //unvalid username
				text1.innerHTML="ERROR";
				$(text1).show();
				$("input#username").attr("class","error");
			}else{   //valid username			
				text1.innerHTML="OK";
				$(text1).show();
				$("input#username").attr("class","ok");
			}
		}
  });

$("input#password").focus(function(){
    if(!validate_notempty(password)){   //empty field
		$(text2).hide();
		}else{
			text2.innerHTML="The password field should be at least 8 characters long";
			$(text2).show();
			$("input#password").attr("class","info");
		}

  });

	$("input#password").blur(function(){

    if(!validate_notempty(password)){   //empty field
		$(text2).hide();
		}else{
			 
			if(password.value.length<8){   //unvalid password
				text2.innerHTML="ERROR";
				$(text2).show();
				$("input#password").attr("class","error");
			}else{   //valid password			
				text2.innerHTML="OK";
				$(text2).show();
				$("input#password").attr("class","ok");
			}
		}
  });

$("input#email").focus(function(){
    if(!validate_notempty(email)){   //empty field
		$(text3).hide();
		}else{
			text3.innerHTML="The email field should be a valid email address (abc@def.xyz)";
			$(text3).show();
			$("input#email").attr("class","info");
		}

  });
	$("input#email").blur(function(){

    if(!validate_notempty(email)){   //empty field
		$(text1).hide();
		}else{
			var re = /^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/; 
			if(!re.test(email.value)){   //unvalid email
				text3.innerHTML="ERROR";
				$(text3).show();
				$("input#email").attr("class","error");
			}else{   //valid email			
				text3.innerHTML="OK";
				$(text3).show();
				$("input#email").attr("class","ok");
			}
		}
  });



	

	
	function validate_notempty(field){
			{
			with (field)
			  {
			  if (value==null||value=="")
			    {
			    	return false;
			    }
			  else {return true;}
			  }
			}
	}
	

		
		


		

});
