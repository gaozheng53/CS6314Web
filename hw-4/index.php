<?php 
$con = mysqli_connect("localhost","root","root","HW4");
if (!$con){
	die('Could not connect: ' . mysqli_connect_error());
}
$key = substr($_SERVER['PATH_INFO'],1);


//  create a temporary table
$temp_sql = "CREATE TEMPORARY TABLE tmp_query (Book_id varchar(30) NOT NULL,Authors varchar(30) NOT NULL)";
$temp_q = mysqli_query($con, $temp_sql);


// initial temporary table value
if(!$key){
	// no key
	$id_set=array();
	$traverse_sql = "SELECT DISTINCT Book.Book_id FROM Book";
	$traverse_q = mysqli_query($con,$traverse_sql);
	$i=0;
	while($row = mysqli_fetch_array($traverse_q)){
		$id_set[$i] = $row[0];
		$i++;
	}
	for($j = 0;$j<count($id_set);$j++){
		$curr = $id_set[$j];
		$autosql = "SELECT * FROM Book_Authors,Authors WHERE Book_Authors.Book_id='$curr' AND Book_Authors.Author_id=Authors.Author_id";
		$subresult = mysqli_query($con, $autosql);
		$res="";
		while($row = mysqli_fetch_array($subresult)){
			$res .= $row['Author_Name'];
			$res .= "&";
		}
		$res = substr($res,0,strlen($res)-1);

		$insert_sql = "INSERT INTO tmp_query VALUES('$curr','$res')"; 
		$insert_q = mysqli_query($con, $insert_sql);
	}
}else{
	// has key
	$autosql = "SELECT * FROM Book_Authors,Authors WHERE Book_Authors.Book_id=$key AND Book_Authors.Author_id=Authors.Author_id";
	$subresult = mysqli_query($con, $autosql);
	$res="";
	while($row = mysqli_fetch_array($subresult)){
		$res .= $row['Author_Name'];
		$res .= "&";
	}
	$res = substr($res,0,strlen($res)-1);
	$insert_sql = "INSERT INTO tmp_query VALUES('$key','$res')"; 
	$insert_q = mysqli_query($con, $insert_sql);
}



if(!$key){
	// no key
	$sql = "SELECT DISTINCT Title,Price,Year,Category,tmp_query.Authors FROM Book,Book_Authors,Authors,tmp_query WHERE Book_Authors.Book_id=Book.Book_id AND Book_Authors.Author_id=Authors.Author_id AND Book.Book_id=tmp_query.Book_id";
}else{
	// has key
	$sql = "SELECT DISTINCT Title,Price,Year,Category,tmp_query.Authors FROM Book,Book_Authors,Authors,tmp_query WHERE Book.Book_id=$key AND Book_Authors.Book_id=Book.Book_id AND Book_Authors.Author_id=Authors.Author_id AND Book.Book_id=tmp_query.Book_id";
}



$result = mysqli_query($con, $sql);


echo '[<br>';
for ($i=0;$i<mysqli_num_rows($result);$i++) {
	echo ($i>0?',':'').json_encode(mysqli_fetch_object($result));
	echo "<br>";
}
echo ']';

?>