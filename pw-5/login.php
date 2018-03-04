
<?php
session_start();



 if($_POST["username"]==""||$_POST["password"]==""){
// some field missing
    header("Location:login.html");
	exit;
}

$con = mysqli_connect("localhost","root","root","PW5");

if (!$con){
  die('Could not connect: ' . mysqli_connect_error());
  }
echo "Connected successfully";

$username = $_POST["username"];
$password = $_POST["password"];
// $username = mysql_real_escape_string($username);
$query = "SELECT username,password FROM Users WHERE username='$username' and password='$password' ";
$result = mysqli_query($con, $query);
if($result->num_rows == 0){
// name and username and password doesn't exist
    header("Location:login.html");
    exit;
}
else{
 	$_SESSION["username"]=$_POST["username"];
 	$_SESSION["password"]=$_POST["password"];
 	header("Location:welcome.php");
 	exit;
 }
 ?>
