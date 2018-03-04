
<?php

	$year = $_GET["year"];
	$gender = $_GET["gender"];

	$con = mysqli_connect("localhost","root","root","HW3");
	if (!$con){
	  die('Could not connect: ' . mysqli_connect_error());
	 }
	// echo "Connected successfully";

	$query = "";
	if($year=='nonechoice'&&$gender=='nonechoice'){
		$query = "SELECT * FROM BabyNames";
	}elseif ($year=='nonechoice') {
		$query = "SELECT * FROM BabyNames  WHERE gender='$gender' ";
	}elseif ($gender=='nonechoice') {
		$query = "SELECT * FROM BabyNames  WHERE year=$year";
	}else{
		$query = "SELECT * FROM BabyNames  WHERE year=$year AND gender='$gender' ";
	}
	$result = mysqli_query($con, $query);
	echo "<table border='1'>
	<tr>
	<th>name</th>
	<th>year</th>
	<th>ranking</th>
	<th>gender</th>
	</tr>";
	while($row = mysqli_fetch_array($result))
	{
	    echo "<tr>";
	    echo "<td>" . $row['name'] . "</td>";
	    echo "<td>" . $row['year'] . "</td>";
	    echo "<td>" . $row['ranking'] . "</td>";
	    echo "<td>" . $row['gender'] . "</td>";
	    echo "</tr>";
	}
	echo "</table>";

?>




