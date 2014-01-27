<?php
/***************************************
 $Revision:: 128                        $: Revision of last commit
 $LastChangedBy::                       $: Author of last commit
 $LastChangedDate::                     $: Date of last commit
 ***************************************/
//echo "clientXml2JSON...";

/*
 clientXml2JSON.php
 tjs 131106

 file version 1.00
 */

/*
 e.g. of data content (to be refreshed and observed by observers):
 <tables accountId="1" userName="SteelDrum" firstName="Tom" lastName="Soucy">
 <preferences>
 <preference type="user" name="share">false</preference>
 </preferences>
 <morsels>
 <morsel type="Grain" description="Toasted" isMaster="1" isInactive="0">Bagels</morsel>
 <morsel type="Grain" description="Cereal" isMaster="1" isInactive="0">Bran Flakes</morsel>
 <morsel type="Vegetables" description="Cooked" isMaster="1" isInactive="0">Asparagus</morsel>
 <morsel type="Fruits" description="Raw" isMaster="1" isInactive="0">Apples</morsel>
 <morsel type="Dairy" description="Whole, Fat Free" isMaster="1" isInactive="0">Milk</morsel>
 <morsel type="Dairy" description="American" isMaster="1" isInactive="0">Cheese</morsel>
 <morsel type="Grain" description="Cereal" isMaster="1" isInactive="0">Schredded Wheat</morsel>
 <morsel type="Protein" description="Baked, Green, Lima" isMaster="1" isInactive="0">Bean Products</morsel>
 <morsel type="Protein" description="Haddock" isMaster="1" isInactive="0">Fish</morsel>
 <morsel type="Vegetables" description="Beets" isMaster="1" isInactive="0">Beets</morsel>
 <morsel type="Vegetables" description="Garlic, Onions" isMaster="1" isInactive="0">Onions</morsel>
 <morsel type="Vegetables" description="Mushrooms" isMaster="1" isInactive="0">Mushrooms</morsel>
 <morsel type="Fruits" description="Apricots" isMaster="1" isInactive="0">Apricots</morsel>
 <morsel type="Fruits" description="Plums, Prunes" isMaster="1" isInactive="0">Plums</morsel>
 <morsel type="Dairy" description="Ice Cream" isMaster="1" isInactive="0">Ice Cream</morsel>
 <morsel type="Dairy" description="Yogurt" isMaster="1" isInactive="0">Yogurt</morsel>
 </morsels>
 <dishes>
 <dish type="Breakfast" name="Flakes-n-Bakes" description="Cereal in bowl" isMaster="undefined" isInactive="0">
 <segments/>
 </dish>
 <dish type="Breakfast" name="Sleep-Late" description="No Breakfast!" isMaster="undefined" isInactive="0">
 <segments/>
 </dish>
 <dish type="Lunch" name="Grilled Cheese" description="Sandwich" isMaster="undefined" isInactive="0">
 <segments/>
 </dish>
 <dish type="Lunch" name="PB Sandwich" description="PB Sandwich" isMaster="undefined" isInactive="0">
 <segments/>
 </dish>
 <dish type="Lunch" name="Turkey Sandwich" description="Turkey Sandwich" isMaster="undefined" isInactive="0">
 <segments/>
 </dish>
 <dish type="Lunch" name="Skip-Lunch" description="Too Busy To Eat!" isMaster="undefined" isInactive="0">
 <segments/>
 </dish>
 <dish type="Dinner" name="Haddock-w-RiceVeg" description="Baked" isMaster="undefined" isInactive="0">
 <segments/>
 </dish>
 <dish type="Dinner" name="ItalianSpaghetti" description="With Meatballs or Sausage" isMaster="undefined" isInactive="0">
 <segments/>
 </dish>
 </dishes>
 <slates/>
 </tables>

 JSON output examples:
 [{"itemId":1001,"name":"Bagels","description":"Toasted","type":"Grain","master":1,"isInactive":0},
 {"itemId":1002,"name":"Bran Flakes","description":"Cereal","type":"Grain","master":1,"isInactive":0},
 {"itemId":1008,"name":"English Muffins","description":"Toasted","type":"Grain","master":1,"isInactive":0}]

 [{"itemId":1001,"name":"Flakes-n-Bakes","description":"Cereal in bowl","type":"Breakfast","master":1,"portions":[],"isInactive":0},
 {"itemId":1008,"name":"Schred-n-Bread","description":"Cereal in bowl","type":"Breakfast","master":1,"portions":[],"isInactive":0},
 {"itemId":1009,"name":"Puffs-n-Stuff","description":"Cereal in bowl","type":"Breakfast","master":1,"portions":[],"isInactive":0}]

 */
//echo "starting...";
require_once( "Member.class.php" );

session_start();

$account = 0;
//$xmlFileName = "test.xml";
$test = false;
//$test = true;
/*
// tjs 140107
$testing = $_GET["test"];
if ($testing != null) {
	$test = $testing;
}
*/
$xmlString;
//echo "test: $test";

//$xmlPath;
// test inverter (make 1 == 0 for testing)
//if (1 == 1) { // production
//$xmlPath = $_GET["xmlPath"];

if (!$test) { // production
	//if (1 == 0) {	// test
	
	$xmlString = $_POST["xml"];
	if (isset($_SESSION['member'])) {
		$member = $_SESSION['member'];
		$account = $member->getValue( "id" );
	}
} else {
	$xmlPath = $_GET["xmlPath"];
	// NOTE for tests use this BUT delta the date!!!
	//$xmlString = '<tables accountId="1" userName="SteelDrum" firstName="Tom" lastName="Soucy"><preferences><preference type="user" name="share">false</preference></preferences><morsels><morsel type="Grain" description="Toasted" isMaster="1" isInactive="0">Bagels</morsel><morsel type="Grain" description="Cereal" isMaster="1" isInactive="0">Bran Flakes</morsel><morsel type="Vegetables" description="Cooked" isMaster="1" isInactive="0">Asparagus</morsel><morsel type="Dairy" description="Yogurt" isMaster="1" isInactive="0">Yogurt</morsel></morsels><dishes><dish type="Breakfast" name="Flakes-n-Bakes" description="Cereal in bowl" isMaster="undefined" isInactive="0"><segments></segments></dish><dish type="Breakfast" name="Schred-n-Bread" description="Cereal in bowl" isMaster="undefined" isInactive="0"><segments></segments></dish><dish type="Dinner" name="ItalianSpaghetti" description="With Meatballs or Sausage" isMaster="undefined" isInactive="0"><segments></segments></dish></dishes><slates></slates></tables>';
	//$mode = false;
	//$account = 1;
	$xmlString = '';
	$file=fopen($xmlPath,"r");
	while (!feof($file))
	{
		//echo fgetc($file);
		$xmlString .= fgetc($file);
	}
	fclose($file);
	$account = $_GET["account"];
	//$test = true;
}
//echo "$xmlString";

$accountCount = $account*10000;
$portionsCount = 1000;
$platesCount = 1000;

//echo "clientXml2JSON xml string length ".strlen($xmlString)." string ".$xmlString;
// tjs 131119
//$xmlFileNamePath = "./slateView/$account/slate.html";
//echo "clientXml2JSON xmlFileNamePath is $xmlFileNamePath";
$portionsFileNamePath = "./slateView/$account/portions.json";
$platesFileNamePath = "./slateView/$account/plates.json";
//echo "xmlPathFileName ".$xmlPathFileName;
//$portionMap = array();
$portionItemIdMap = array();
$isPortionParser = true;

$result = 1;

$portionsResult;
$platesResult;

class SlatesPlatesPortions {
	public $_id;
	public $_name;
	public $_type;
	public $_description;
	public $_isMaster;
	public $_isInactive;

	public function __construct($id, $name, $type, $description, $isMaster, $isInactive) {
		//echo "__construct";
		$this->_id = $id;
		$this->_name = $name;
		$this->_type = $type;
		$this->_description = $description;
		if ($isMaster == null)
		$isMaster = 0;
		$this->_isMaster = $isMaster;
		if ($isInactive == null)
		$isInactive = 0;
		$this->_isInactive = $isInactive;
		//echo "__construct done name ".$_name;
	}

	public function getId() {
		return $this->_id;
		//return $_id;
	}

	public function getName() {
		return $this->_name;
		//return $_name;
	}

	public function getType() {
		return $this->_type;
		//return $_type;
	}
	public function getDescription() {
		return $this->_description;
		//return $_description;
	}

	public function getIsMaster() {
		return $this->_isMaster;
		//return $_isMaster;
	}
	public function getIsInactive() {
		return $this->_isInactive;
		//return $_isInactive;
	}

	static function cmp_obj($a, $b)
	{
		$al = intval($a->getId());
		$bl = intval($b->getId());
		if ($al == $bl) {
			return 0;
		}
		return ($al > $bl) ? +1 : -1;
	}

	public function showDetails() {
		echo "slate name ".$this->_name." id ".$this->_id." Plates:\n";
		//echo "name ".$this->$_name." id ".$this->$_id." type ".$this->$_type." desc ".$this->$_description.PHP_EOL;
		//echo "base details name ".$this->_name." id ".$this->_id." type ".$this->_type." desc ".$this->_description."\n";
	}

	public function getJSONfields() {
		return '"itemId":'.$this->_id.', "name": "'.$this->_name.'", "type": "'.$this->_type.'", "description": "'.$this->_description.'", "master": '.$this->_isMaster.', "isInactive": '.$this->_isInactive;
	}
}

class Plate extends SlatesPlatesPortions {
	public $_portions = array();
	public $_portionItemIds = array();

	public function __construct($id, $name, $type, $description, $isMaster, $isInactive) {
		//echo "portion c";
		parent::__construct($id, $name, $type, $description, $isMaster, $isInactive);
	}

	public function setPortionItemIds($portions) {
		//echo " setPortions...";
		$portionsLen = count($portions);
		//echo " setPortions portions len $portionsLen";
		for ($i = 0; $i < $portionsLen; $i++)
		{
			$portion = $portions[$i];
			//$portionName = $portion->getName();
			//echo " setPortions name $portionName ";
			//$this->_portions[] = $portion;
			$this->_portionItemIds[$i] = $portion;
			//echo "setPortions i $i";
		}
	}

	public function getPortionItemIds() {
		$portions = array();
		foreach ( $this->_portionItemIds as $portion) {
			$portions[] = $portion;
		}
		return $portions;
	}

	public function showDetails() {
		parent::showDetails();
		echo "plate ".$this->_name." Portions:\n";
		foreach ( $this->_portions as $portion) {
			$portion->showDetails();
		}
	}

	public function getJSON() {
		$fields = parent::getJSONfields();
		// tjs 140107
		//$portionsLen = count($_portions);
		$portionsLen = count($this->_portionItemIds);
		//echo " portions len $portionsLen";
		$portions = '';
		for ($i = 0; $i < $portionsLen; $i++)
		{
			//echo " loop i $i";
			//$portionJSON = $this->_portions[$i].getJSON();
			$portionJSON = $this->_portionItemIds[$i];
			//echo " portion json $portionJSON";
			if ($i < $portionsLen - 1) {
				//$portions += $portionJSON.', ';
				$portions .= $portionJSON.', ';
			} else
			{
				//$portions += $portionJSON;
				$portions .= $portionJSON;
			}
		}
		return '{'.$fields.', "portions": ['.$portions.']}';
	}
}

//{"itemId":1002,"name":"Bran Flakes","description":"Cereal","type":"Grain","master":1,"isInactive":0},
class Portion extends SlatesPlatesPortions {
	public function __construct($id, $name, $type, $description, $isMaster, $isInactive) {
		//echo "portion c";
		parent::__construct($id, $name, $type, $description, $isMaster, $isInactive);
	}

	public function showDetails() {
		//echo "portion details name ".$this->_name." type ".$this->_type."\n";
		parent::showDetails();
	}

	static function cmp_obj($a, $b)
	{
		//$al = $a->getType();
		//$bl = $b->getType();
		$al = strtolower($a->getType());
		$bl = strtolower($b->getType());
		if ($al == $bl) {
			return 0;
		}
		return ($al > $bl) ? +1 : -1;
	}

	public function getJSON() {
		$fields = parent::getJSONfields();
		return '{'.$fields.'}';
	}
}

$type;
$portionName;
$description;
$isMaster;
$isInactive;
$plateType;
$plateName;
$plateDescription;
$plateIsMaster;
$plateIsInactive;
$dishPortions;
$portionIndex;

$lastPortion;
$lastPlate;

function startElement($parser, $name, $attrs)
{
	global $fhPortions;
	global $fhPlates;
	//global $skipComma;
	global $type;
	global $description;
	global $isMaster;
	global $isInactive;
	global $plateName;
	global $plateType;
	global $plateDescription;
	global $plateIsMaster;
	global $plateIsInactive;
	global $dishPortions;
	global $portionIndex;
	global $isPortionParser;
	
	if ($isPortionParser) {
		if ($name == 'MORSEL') {
			foreach($attrs as $a => $b) {
				//echo $a,'="',$b,"\"\n";
				if ($a == 'TYPE') {
					// tjs 131114
					$type = $b;
					//$htmlString .= $b;
					//$htmlString .= " is:</h1>";
				} else if ($a == 'DESCRIPTION') {
					$description = $b;
				} else if ($a == 'ISMASTER') {
					$isMaster = $b;
				} else if ($a == 'ISINACTIVE') {
					$isInactive = $b;
				}
			}
			//$isMorsel = true;
			//$isSegment = false;
		}
		if ($name == 'MORSELS') {
			fwrite($fhPortions, "[");
			//$skipComma = true;
		}
	} else {
		if ($name == 'DISH') {
			foreach($attrs as $a => $b) {
				//echo $a,'="',$b,"\"\n";
				if ($a == 'TYPE') {
					// tjs 131114
					$plateType = $b;
					//$htmlString .= $b;
					//$htmlString .= " is:</h1>";
				} else if ($a == 'NAME') {
					$plateName = $b;
				}  else if ($a == 'DESCRIPTION') {
					$plateDescription = $b;
				} else if ($a == 'ISMASTER') {
					$plateIsMaster = $b;
				} else if ($a == 'ISINACTIVE') {
					$plateIsInactive = $b;
				}
			}
			if ($plateIsMaster == "undefined") {
				$plateIsMaster = 0;
			}
			
			$dishPortions = array();
			$portionIndex = 0;
			//$isMorsel = false;
			//$isSegment = true;
		}
		if ($name == 'SEGMENT') {
			foreach($attrs as $a => $b) {
				//echo $a,'="',$b,"\"\n";
				if ($a == 'TYPE') {
					// tjs 131114
					$type = $b;
					//$htmlString .= $b;
					//$htmlString .= " is:</h1>";
				} else if ($a == 'DESCRIPTION') {
					$description = $b;
				} else if ($a == 'ISMASTER') {
					$isMaster = $b;
				} else if ($a == 'ISINACTIVE') {
					$isInactive = $b;
				}
			}
			//$isMorsel = false;
			//$isSegment = true;
		}
		if ($name == 'DISHES') {
			fwrite($fhPlates, "[");
			//$skipComma = true;
		}
	}
}

function endElement($parser, $name)
{
	global $fhPortions;
	global $portionsFileNamePath;
	global $portionItemIdMap;
	global $portionsCount;
	global $accountCount;
	global $skipComma;
	global $fhPlates;
	global $platesFileNamePath;
	global $platesCount;

	global $type;
	global $description;
	global $isMaster;
	global $isInactive;
	global $portionName;
	global $plateName;
	global $plateType;
	global $plateDescription;
	global $plateIsMaster;
	global $plateIsInactive;

	global $lastPortion;
	global $lastPlate;
	global $dishPortions;
	global $portionIndex;
	global $isPortionParser;
	
	if ($isPortionParser) {
		if ($name == 'MORSEL') {
			$itemId = ++$portionsCount + $accountCount;
			//echo "morsel name ".$morselName." id ".$itemId;
			//$portion = new Portion($itemId, $morsel, $type, $description, $isMaster, $isInactive);
			$portion = new Portion($itemId, $portionName, $type, $description, $isMaster, $isInactive);
			$json = $portion->getJSON();
			//echo "portion json ".$json;
			//echo " portion json ".$json." for portion name $morselName";
			//echo " morsel name -$morselName-";
			//if ($portionMap[$morselName] == null) {
			$key = "'$portionName'";
			//$portionMap[$key] = $json;
			$portionItemIdMap[$key] = $itemId;
			if ($lastPortion == null) {
				$lastPortion = $json;
			} else {
				fwrite($fhPortions, $lastPortion);
				fwrite($fhPortions, ", ");
				$lastPortion = $json;
			}
		}
		if ($name == 'MORSELS') {
			if ($lastPortion != null) {
				fwrite($fhPortions, $lastPortion);
			}
			fwrite($fhPortions, "]");
			fclose($portionsFileNamePath);
			//fclose($platesFileNamePath);
			chmod($portionsFileNamePath, 0777);
			//chmod($platesFileNamePath, 0777);
		}
	} else {
		if ($name == 'SEGMENT') {
			//$itemId = ++$portionsCount + $accountCount;
			//echo "morsel name ".$morselName." id ".$itemId;
			//$portion = new Portion($itemId, $morsel, $type, $description, $isMaster, $isInactive);
			//$json = $portion->getJSON();
			//echo "portion json ".$json;
			//echo " portion json ".$json." for portion name $morselName";
			//echo " morsel name -$morselName-";
			//if ($portionMap[$morselName] == null) {
			$key = "'$portionName'";
			foreach($portionItemIdMap as $x=>$x_value)
			{
				//echo " map Key=" . $x . ", segment=" . $segmentName;
				//echo " map Key=" . $x . ", Value=" . $x_value;
				//if ($x == $segmentName) {
				if ($x == $key) {
					$dishPortions[$portionIndex++] = $x_value;
				}
				//echo "<br>";
			}

		}
		if ($name == 'DISH') {
			$itemId = ++$platesCount + $accountCount;
			$plate = new Plate($itemId, $plateName, $plateType, $plateDescription, $plateIsMaster, $plateIsInactive);
			//$plate -> showDetails();
			//$plate -> setPortions($portions);
			$plate -> setPortionItemIds($dishPortions);
			//$plate -> showDetails();
			$json = $plate->getJSON();
			// write plate to plates json file
			if ($lastPlate == null) {
				$lastPlate = $json;
			} else {
				fwrite($fhPlates, $lastPlate);
				fwrite($fhPlates, ", ");
				$lastPlate = $json;
			}
			$plateCount++;
		}
		if ($name == 'DISHES') {
			if ($lastPlate != null) {
				fwrite($fhPlates, $lastPlate);
			}
			fwrite($fhPlates, "]");
			fclose($platesFileNamePath);
			//fclose($platesFileNamePath);
			chmod($platesFileNamePath, 0777);
			//chmod($platesFileNamePath, 0777);
		}
	}
}

function characterData($parser, $data)
{
	global $portionName;
	$portionName = $data;
}

//echo(" account ".$account);
// e.g. 1

$fhPortions;
$fhPlates;

// tjs 140113
//$result = 1;

if (!($fhPortions = fopen($portionsFileNamePath, 'w')) || !($fhPlates = fopen($platesFileNamePath, 'w'))) {
	//    die("could not open XML input");
	//$result = 0;
	$platesResult = 0;
	$portionsResult = 0;
} else {
	//echo "start";
	//populatePortions($slatesxml->morsels, $account);
	//echo "map dump:\n";
	//foreach($portionMap as $a => $b) {
	//	echo $a,'="',$b,"\"\n";
	//}
	//populatePlates($slatesxml->dishes, $account);
	$xml_parser = xml_parser_create();
	// use case-folding so we are sure to find the tag in $map_array
	//xml_parser_set_option($xml_parser, XML_OPTION_CASE_FOLDING, true);
	xml_set_element_handler($xml_parser, "startElement", "endElement");
	xml_set_character_data_handler($xml_parser, "characterData");
	$portionsResult = xml_parse($xml_parser, $xmlString);
	xml_parser_free($xml_parser);

	$isPortionParser = false;
	/*
	// debug
	if ($test) {
		foreach($portionItemIdMap as $x=>$x_value)
		{
			echo " map Key=" . $x . ", Value=" . $x_value;
			//if ($x == $segmentName) {
			echo "<br>";
		}
	}
	*/
	$xml_parser = xml_parser_create();
	// use case-folding so we are sure to find the tag in $map_array
	//xml_parser_set_option($xml_parser, XML_OPTION_CASE_FOLDING, true);
	xml_set_element_handler($xml_parser, "startElement", "endElement");
	xml_set_character_data_handler($xml_parser, "characterData");
	$platesResult = xml_parse($xml_parser, $xmlString);
	xml_parser_free($xml_parser);	
}

// tjs 140117
//$result = $platesResult*1000 + $portionsResult;
$result = $account*100000 + $platesResult*1000 + $portionsResult;
echo($result);

?>
