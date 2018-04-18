$(document).ready(function() {
    var text1 = document.createElement("span");
    var text2 = document.createElement("span");
    var text3 = document.createElement("span");
    $("input#username").after(text1);  
    $("input#password").after(text2);
    $("input#password").after(text3);
    $("span").hide();   


    var username = document.getElementById("username");
    var password = document.getElementById("password");
    var email = document.getElementById("email");

    var validate = true;

  $("input#username").blur(function(){

    if(!validate_notempty(username)){   //empty field
        validate = false;
        text1.innerHTML = "username cannot be empty";
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
        $(text2).show();
        }else{
            validate = true;
            $(text2).hide();
            text3.innerHTML = checkStrength(password);
            $(text3).show();
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

    function checkStrength(password) {
        var strength = 0
        if (password.length > 7) strength += 1
        var re1 = /([a-z].*[A-Z])|([A-Z].*[a-z])/;
        var re2 = /([a-zA-Z])/;
        var re3 = /([0-9])/;
        var re4 = /([!,%,&,@,#,$,^,*,?,_,~])/;
        var re5 = /(.*[!,%,&,@,#,$,^,*,?,_,~].*[!,%,&,@,#,$,^,*,?,_,~])/;

        if (re1.test(password.value)) strength += 1
        // If it has numbers and characters, increase strength value.
        if (re2.test(password.value) && re3.test(password.value)) strength += 1
        // If it has one special character, increase strength value.
        if (re4.test(password.value)) strength += 1
        // If it has two special characters, increase strength value.
        if (re5.test(password.value)) strength += 1
        
        if (strength < 2) {
            return 'password strength: Weak'
        } else if (strength == 2) {
            return 'password strength: Good'
        } else {
            return 'password strength: Strong'
        }
    }
    
});