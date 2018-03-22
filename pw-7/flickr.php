
<?php
class Flickr {

	private $apiKey;

	public function __construct($apikey = null) {
		$this->apiKey = $apikey;
	}

	public function search($query = null, $user_id = null, $per_page = 50, $format = 'php_serial',$sort = 'date-posted-desc') {
		$args = array(
			'method' => 'flickr.photos.search',
			'api_key' => $this->apiKey,
			'text' => urlencode($query),
			'user_id' => $user_id,
			'per_page' => $per_page,
			'format' => $format,
			'sort' => $sort
		);
		$url = 'http://flickr.com/services/rest/?';
		$search = $url.http_build_query($args);
		$result = $this->file_get_contents_curl($search);
		if ($format == 'php_serial') $result = unserialize($result);
		return $result;
	}

	private function file_get_contents_curl($url) {
		$ch = curl_init();
		curl_setopt($ch, CURLOPT_AUTOREFERER, 1);
		curl_setopt($ch, CURLOPT_HEADER, 0);
		curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
		curl_setopt($ch, CURLOPT_USERAGENT, 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/31.0.1650.63 Safari/537.36');
		curl_setopt($ch, CURLOPT_URL, $url);
		curl_setopt($ch, CURLOPT_FOLLOWLOCATION, 1);
		$data = curl_exec($ch);
		$retcode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
		curl_close($ch);
		if ($retcode == 200) {
			return $data;
		} else {
			return null;
		}
	}
}
 ?>
