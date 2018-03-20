<?php 
$con = mysqli_connect("localhost","root","root","HW4");
if (!$con){
	die('Could not connect: ' . mysqli_connect_error());
}

// echo "Success";
$key = substr($_SERVER['PATH_INFO'],1);

// if(!$key){
// // no key
// }else{
	// has key
	$autosql="SELECT Authors.Author_Name FROM Book_Authors,Authors WHERE Book_Authors.Book_id=$key AND Book_Authors.Author_id=Authors.Author_id";
// }
$subresult = mysqli_query($con, $autosql);
$res="";
while($row = mysqli_fetch_array($subresult)){
	$res .= $row[0];
	$res .= ", ";
}
// echo $res;    ="jk,Zheng,"

// $temp_sql = "CREATE temporary TABLE tmp_query (Book_id varchar(30) NOT NULL,Authors varchar(30) NOT NULL)";
// $temp_query = mysqli_query($con, $temp_sql);
// $insert_sql="INSERT INTO tmp_query VALUES($key,$res)"; 
// $insert_query=mysqli_query($con, $insert_sql);



if(!$key){
	// no key
	$sql= "SELECT Title,Price,Year,Category,Author_Name FROM Book,Book_Authors,Authors";
}else{
	// has key
	$sql = "SELECT Title,Price,Year,Category,Author_Name FROM Book,Book_Authors,Authors WHERE Book.Book_id=$key AND Book_Authors.Book_id=Book.Book_id AND Book_Authors.Author_id=Authors.Author_id";
}



$result = mysqli_query($con, $sql);

// if (!$result) {
// 	http_response_code(404);
// 	die(mysqli_error());
// }

echo '[<br>';
for ($i=0;$i<mysqli_num_rows($result);$i++) {
	echo ($i>0?',':'').json_encode(mysqli_fetch_object($result));
	echo "<br>";
}
echo ']';

?>