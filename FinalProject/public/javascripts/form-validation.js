$(document).ready(function() {
    var text1 = document.createElement("span");
    var text2 = document.createElement("span");
    var text3 = document.createElement("span");
    $("input#username").after(text1);  
    $("input#password").after(text2);
    $("input#email").after(text3);
    $("span").hide();   


    var username = document.getElementById("username");
    var password = document.getElementById("password");
    var email = document.getElementById("email");

    var validate = true;
    var errorinfo = "Error:";


  $("input#username").blur(function(){

    if(!validate_notempty(username)){   //empty field
        validate = false;
        text1.innerHTML = "username cannot be empty";
        errorinfo.concat("* username cannot be empty");
        $(text1).show();
        }else{
            validate = true;
            $(text1).hide();
        }
  });


    $("input#password").blur(function(){

        if(!validate_notempty(password)){   //empty field
        validate = false;
        text2.innerHTML = "password cannot be empty";
        errorinfo.concat("* password cannot be empty");
        $(text2).show();
        }else{
            validate = true;
            $(text2).hide();
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
    
    $("#validate").attr("value",validate);
    $("#errorinfo").attr("value",errorinfo);
});