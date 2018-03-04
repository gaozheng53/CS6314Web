

<!DOCTYPE html>
<?php session_start();?>
<html>
<head>
	<title>welcome.php</title>
</head>
<body>
<?php
	if(!isset($_SESSION["username"])){
		header("Location:login.html");
		exit;
	}
	$con = mysqli_connect("localhost","root","root","PW5");
	$username = $_SESSION["username"];
	$query = "SELECT avatar,fullname FROM Users WHERE username='$username'";
	$result = mysqli_query($con, $query);
	$query2 = "SELECT Movies.title from FavoriteMovies,Movies,Users WHERE Users.username='$username' and Users.username=FavoriteMovies.username and FavoriteMovies.movie_id=Movies.movie_id";
	$result2 = mysqli_query($con, $query2);
	while($row = mysqli_fetch_assoc($result))
	{
		$addr="img/".$row['avatar'];
		$fullname=$row['fullname'];
	}
	
	$list = "<ul>";
	while($row = mysqli_fetch_array($result2))
	{
		$list .="<li>";
	    $list .=$row['title'];
	    $list .="</li>";
	}
	$list .= "</ul>";


?>
		<h1>WELCOME : <?php echo $fullname;?> </h1>
		<img src=<?php echo $addr;?>>
		<p>Favorite Movies are:</p>
		<p><?php echo $list; ?></p>

</body>
</html>
