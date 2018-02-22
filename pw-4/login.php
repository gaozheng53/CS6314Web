
<?php
session_start();
 if($_POST["name"]==""||$_POST["username"]==""||$_POST["password"]==""){
 	header("Location:login.html");  
	exit; 
 }else{
 	$_SESSION["name"]=$_POST["name"];
 	$_SESSION["username"]=$_POST["username"];
 	$_SESSION["password"]=$_POST["password"];
 	header("Location:welcome.php"); 
 	exit;
 }
 ?>
	




