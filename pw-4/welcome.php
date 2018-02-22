<!DOCTYPE html>
<?php session_start();?>
<html>
<head>
	<title>welcome.php</title>	
</head>
<body>
<?php 
	if(!isset($_SESSION["name"])||!isset($_SESSION["username"])||!isset($_SESSION["password"])){
		header("Location:login.html");  
		exit; 
	}  
	if(!isset($_SESSION['visit'])){
			$_SESSION['visit']=1;
	}else{
			$_SESSION['visit']=$_SESSION['visit']+1;
	}
	if(isset($_POST['startover'])){
		session_destroy();
		header("Location:login.html");  
		exit; 

	}
?>
		<h1>WELCOME name:<?php echo $_SESSION["name"];?>, username:<?php echo $_SESSION["username"];?> </h1> 
		<form action="welcome.php" method="post">
		Start over<input type="checkbox" name="startover"> 		
		<input type="submit" value="reload">
		</form>
		<p>You had visited this page <span id="times"><?php echo $_SESSION["visit"];?></span> times.
		
</body>
</html>