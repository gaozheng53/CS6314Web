<!DOCTYPE html>
<html>
<head>
	<title>Search</title>
</head>
<body>
<h1>Search</h1>
<form action="#" method="post">
	Keyword: <input type="text" name="keyword">
	<input type="submit" value="Submit" />
</form>
<br>
<?php

require_once('flickr.php');
$Flickr = new Flickr('78dc2b13d9cc1127139a1aa12bf9fcc6');
echo "You are searching: ".$_POST['keyword'];
echo "<br>";
$data = $Flickr->search($_POST['keyword']);
foreach($data['photos']['photo'] as $photo) {
	echo '<a href="https://www.flickr.com/photos/' .$photo["owner"]. '/' .$photo["id"]. '" target="_blank"><img src="' . 'http://farm' . $photo["farm"] . '.static.flickr.com/' . $photo["server"] . '/' . $photo["id"] . '_' . $photo["secret"] . '_t.jpg"></a>';
}


 ?>

</body>
</html>
