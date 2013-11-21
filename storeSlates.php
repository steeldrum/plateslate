<?php
/***************************************
$Revision:: 128                        $: Revision of last commit
$LastChangedBy::                       $: Author of last commit
$LastChangedDate:: 2011-08-30 15:05:27#$: Date of last commit
***************************************/
echo "storeSlates";

/*
storeSlates.php
tjs 110830

file version 1.00 
*/

/*
e.g. of data content (to be stored):
<slates>
<slate name="August 27, 2011">
<plate name="Flakes-n-Bakes" type="Breakfast" description="Cereal, Fruit, etc.">
<portion type="Grain">Bran Flakes</portion>
<portion type="Fruits">Grapes</portion>
<portion type="Dairy">Milk</portion>
<portion type="Grain">Muffins</portion>
</plate>
<plate name="PB Sandwich" type="Lunch" description="(with fruit)">
<portion type="Grain">Irish Bread</portion>
<portion type="Protein">Legeume Products</portion>
<portion type="Fruits">Berries</portion>
<portion type="Fruits">Apples</portion>
</plate>
<plate name="Ham Steak-w-RiceVeg" type="Dinner" description="">
<portion type="Protein">Pork Products</portion>
<portion type="Grain">Rice</portion>
<portion type="Vegetables">Brussel Sprouts</portion>
</plate>
</slate>
</slates>

*/
require_once( "Member.class.php" );
//tjs 110511 above ensures that config.php has been loaded as well
$username=DB_USERNAME;
$password=DB_PASSWORD;
$database=DB_NAME;

session_start();

//function trimNewLine($str) {
//	return substr($str, 0, strlen($str) - 1);
//}

/*
$account = $_GET['account'];

if (strlen($account) > 0 && $account != '0') {
	//echo $account;
} else {
	//echo "No account";
	if (isset($_SESSION['member'])) {
		$member = $_SESSION['member'];
		$account = $member->getValue( "id" );
	} 
}
*/
$account = 0;
//$account = isset( $_REQUEST["account"] ) ? (int) $_REQUEST["account"] : 1;
//$account = isset( $_GET["account"] ) ? (int) $_GET["account"] : 1;
//$account = 1;
//$xmlString = "";
//$xmlString = isset( $_REQUEST["xml"] ) ? $_REQUEST["xml"] : "";
//$xmlFileName = isset( $_POST["name"] ) ? $_POST["name"] : "temp.xml";
$xmlFileName = "test.xml";
//$xmlString = isset( $_POST["xml"] ) ? $_POST["xml"] : "";
$xmlString = $_POST["xml"];
//echo("xml string length ".strlen($xmlString)." string ".$xmlString);

//$xmlString = isset( $_GET["xml"] ) ? $_GET["xml"] : "";
//$member = new Member(  );
//$xmlFileNamePath="slates/".$xmlFileName;
//$xmlFileNamePath="./slates/".$xmlFileName;
//$xmlFileNamePath = tempnam("./slates/", "slate");
$xmlFileNamePath = tempnam("./slates/", "slate").".xml";

//$xmlFileNamePath=$xmlFileName;

if (isset($_SESSION['member'])) {
		$member = $_SESSION['member'];
		$account = $member->getValue( "id" );
		//$xmlString = isset( $_REQUEST["xml"] ) ? $_REQUEST["xml"] : "";
} 

//$loadedID  = mysql_real_escape_string($_POST["id"]);

//$stringToWrite = "".$_POST["text"]."";
//echo("xml string length ".strlen($xmlString)." pathname ".$xmlFileNamePath." string ".$xmlString);
//echo("xml string length ".strlen($xmlString)." pathname ".$xmlFileNamePath);

//$fh = fopen("test.xml", 'w');
$fh = fopen($xmlFileNamePath, 'w');
//fwrite($fh, $stringToWrite  );
fwrite($fh, $xmlString  );
fclose($fh);
echo($xmlFileNamePath);

?> 


