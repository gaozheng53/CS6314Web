<?php 
$con = mysqli_connect("localhost","root","root","PW6");
if (!$con){
	die('Could not connect: ' . mysqli_connect_error());
}
$query = "SELECT * FROM Book";
$result = mysqli_query($con, $query);
if (!$result) {
	http_response_code(404);
	die(mysqli_error());
}
echo '[<br>';
for ($i=0;$i<mysqli_num_rows($result);$i++) {
	echo ($i>0?',':'').json_encode(mysqli_fetch_object($result));
	echo "<br>";
}
echo ']';

?>