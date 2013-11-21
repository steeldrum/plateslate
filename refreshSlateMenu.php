<?php
/***************************************
 $Revision:: 128                        $: Revision of last commit
 $LastChangedBy::                       $: Author of last commit
 $LastChangedDate::                     $: Date of last commit
 ***************************************/
//echo "refreshSlateMenu...";

/*
 refreshSlateMenu.php
 tjs 131106

 file version 1.00
 */

/*
 e.g. of data content (to be refreshed and observed by observers):
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
//$username=DB_USERNAME;
//$password=DB_PASSWORD;
//$database=DB_NAME;

session_start();

$account = 0;
$xmlFileName = "test.xml";
// TODO test inverter
$xmlString = $_POST["xml"];
// NOTE for tests use this BUT delta the date!!!
//$xmlString = '<slates accountId="0" userName="unknown" firstName="firstName" lastName="lastName" share="false"><slate name="11/21/2013" dow="Wednesday" id="2"><plates><plate name="Schred-n-Bread" type="Breakfast" description="Cereal, Fruit, etc."><portions><portion type="Grain">Schredded Wheat</portion><portion type="Fruits">Bananas</portion><portion type="Dairy">Milk</portion><portion type="Grain">Muffins</portion></portions></plate><plate name="Grilled Cheese" type="Lunch" description="(with fruit)"><portions><portion type="Protein">Pork Products</portion><portion type="Dairy">Cheese</portion><portion type="Fruits">Apples</portion></portions></plate><plate name="American Chop Suey" type="Dinner" description=""><portions><portion type="Grain">Pasta</portion><portion type="Protein">Beef Products</portion><portion type="Vegetables">Onions</portion><portion type="Vegetables">Tomatoes</portion></portions></plate></plates></slate></slates>';
// e.g. doRealTimeReport divHeaderStyle color:hsl(60, 100%, 50%) divLabelStyle color:hsl(100, 100%, 50%) divDataStyle color:hsl(140, 100%, 50%)
//$divHeaderStyle = $_POST["divHeaderStyle"];
//$divLabelStyle = $_POST["divLabelStyle"];
//$divDataStyle = $_POST["divDataStyle"];
//$divHeaderStyle = "color:hsl(60, 100%, 50%)";
$divHeaderStyle = "color: red";
$divLabelStyle = "color:hsl(100, 100%, 50%)";
$divDataStyle = "color:hsl(140, 100%, 50%)";
//echo "divHeaderStyle $divHeaderStyle";
// TODO test inverter
//$mode = false;
$mode = $_POST["mode"];
$flushToday = $mode == 'true';
$todayOffset  = mktime(0, 0, 0, date("m")  , date("d"), date("Y"));
$tomorrowOffset  = mktime(0, 0, 0, date("m")  , date("d")+1, date("Y"));
//echo "todayOffset $todayOffset tomorrowOffset $tomorrowOffset";

//echo "refreshSlateMenu xml string length ".strlen($xmlString)." string ".$xmlString;
// tjs 131106
//$xmlFileNamePath = "./slateView/slate.html";

//$xmlFileNamePath=$xmlFileName;
// TODO test inverter
// tjs 131120 bock this out for test

if (isset($_SESSION['member'])) {
	$member = $_SESSION['member'];
	$account = $member->getValue( "id" );
}

// tjs 131120 hack in for test
//$account = 1;

// tjs 131119
$xmlFileNamePath = "./slateView/$account/slate.html";
//echo "refreshSlateMenu xmlFileNamePath is $xmlFileNamePath";
// tjs 131120
//$descriptions = array();
//$notes = array();
//$descriptions;
//$notes;
// tjs 131121
$platePortionDescriptions;
$platePortioNotes;
$plateName;
$portionName;
//$currentPlateName;

$result = '0';
$htmlString;
$time;
$matchTime;
$fh;

//function startPortionsElement($parser, $name, $attrs) {
function startPlatePortionsElement($parser, $name, $attrs) {
	global $plateName;
	global $portionName;
	//global $descriptions;
	global $platePortionDescriptions;
	if ($name == 'PLATE') {
		foreach($attrs as $a => $b) {
			//echo $a,'="',$b,"\"\n";
			if ($a == 'NAME') {
				$plateName = $b;
				//echo "startPortionsElement plateName $plateName";
			}
		}
		$plateName = str_ireplace(" ","_",$plateName);
	} else if ($name == 'PORTION') {
		//echo "startPortionsElement portionName $portionName";
		$description = null;
		foreach($attrs as $a => $b) {
			//echo $a,'="',$b,"\"\n";
			if ($a == 'NAME') {
				$portionName = $b;
				//echo "startPortionsElement portionName $portionName";
			} else if ($a == 'DESCRIPTION'){
				// tjs 131114
				$description = $b;
			}
			$portionName = str_ireplace(" ","_",$portionName);
		}
		if ($description != null) {
			//echo "startPortionsElement description $description";
			//$descriptions[$portionName] = $description;
			$platePortionDescriptions[$plateName][$portionName] = $description;
			//echo "startPortionsElement description $description for portionName $portionName here: $descriptions[$portionName]";
		}
	}
}
function endPlatePortionsElement($parser, $name) {
	if ($name == 'PLATES') {
		processXmlFile();
	}
}
//function portionsCharacterData($parser, $data) {
function platePortionsCharacterData($parser, $data) {
	global $plateName;
	global $portionName;
	//global $notes;
	global $platePortionNotes;
	//echo "portionsCharacterData plateName $plateName portionName $portionName data $data";
	// e.g. portionsCharacterData portionName Bagels data Toast in toaster oven
	//if ($data != null && $portionName != null && $notes[$portionName] == null) {
	if ($data != null && $portionName != null && $platePortionNotes[$plateName][$portionName] == null) {
		$platePortionNotes[$plateName][$portionName] = $data;
		//echo "portionsCharacterData data $data for portionName $portionName here: $notes[$portionName]";
		// e.g. portionsCharacterData data Toast in toaster oven for portionName Bagels here: Toast in toaster oven

		//echo "portionsCharacterData data here: $notes[$portionName]";
	}
}

//$xmlPortionsFileNamePath = "./slateView/$account/portions.xml";
$xmlPlatePortionsFileNamePath = "./slateView/$account/plates.xml";
//echo "using xmlPortionsFileNamePath $xmlPortionsFileNamePath";
if (file_exists($xmlPlatePortionsFileNamePath)) {
	//echo "opening xmlPortionsFileNamePath $xmlPortionsFileNamePath";

	$file=fopen($xmlPlatePortionsFileNamePath,"r");
	$xmlPlatePortionsString = '';
	//Output a line of the file until the end is reached
	while(!feof($file)) {
		$xmlPlatePortionsString .= fgets($file);
	}
	fclose($file);
	$xml_plate_portions_parser = xml_parser_create();
	xml_set_element_handler($xml_plate_portions_parser, "startPlatePortionsElement", "endPlatePortionsElement");
	xml_set_character_data_handler($xml_plate_portions_parser, "platePortionsCharacterData");
	$platePortionsResult = xml_parse($xml_plate_portions_parser, $xmlPlatePortionsString);
	//echo "portionsResult $portionsResult";
	xml_parser_free($xml_plate_portions_parser);
	//echo "portionsResult $portionsResult";
	// e.g. 1
	//echo "parsed portions file!";
	/*
	foreach($descriptions as $x=>$x_value) {
	echo "Key=" . $x . ", Value=" . $x_value;
	echo "<br>";
	}*/
	/*
	 foreach($platePortionNotes['Puffs-n-Stuf'] as $x=>$x_value) {
	 echo "Key=" . $x . ", Value=" . $x_value;
	 echo "<br>";
	 }
	 */
	/*
	 * Key=Milk, Value=
	 Key=Bagels, Value=Toast in toaster oven.
	 Key=English_Muffins, Value=Toast in toaster oven.
	 Key=Irish_Bread, Value=Toast in toaster oven.
	 Key=Bread, Value=Microwave 33 sec.
	 Key=Muffins, Value=Microwave 33 sec.
	 Key=Pancakes, Value=
	 Key=Pecan_Buns, Value=Microwave 33 sec.
	 Key=Buns, Value=Microwave 33 sec.
	 Key=Puffs, Value=Use skim milk for cereal.
	 Key=Toast, Value=Toast in toaster oven.
	 Key=Beef_Products, Value=
	 Key=Eggs, Value=Stove top, scrambled.
	 Key=Poultry, Value=Fried.
	 Key=Pork_Products, Value=Fry sausages. Fry bacon.
	 Key=Potatos, Value=Home fried.
	 Key=Bananas, Value=Slice one for cereal.
	 Key=Berries, Value=For cereal. Halve if large.
	 Key=Citrous, Value=Grapefruit: half and loosen. Oranges: slice.
	 Key=Grapes, Value=Raisons for cereal.
	 Key=Peaches, Value=Sliced for cereal.

	 */
	//	processXmlFile();

} else {
	processXmlFile();
}

function startElement($parser, $name, $attrs)
{
	//echo "refreshSlateMenu startElement $name";
	global $htmlString;
	global $time;
	global $matchTime;
	global $divHeaderStyle;
	global $divLabelStyle;
	global $divDataStyle;
	// tjs 131121
	global $plateName;
	//global $currentPlateName;
	//echo "startElement name $name";

	if ($name == 'SLATE') {
		//<slate name="August 27, 2011">
		//echo "started slate element!";
		foreach($attrs as $a => $b) {
			//echo $a,'="',$b,"\"\n";
			if ($a == 'NAME') {
				// tjs 131114
				$date = $b;
				//$htmlString .= $b;
				//$htmlString .= " is:</h1>";
			} else if ($a == 'DOW') {
				$dow = $b;
			}
		}
		//echo "<date $date dow $dow>";
		// tjs 131118
		// format name that is string e.g.  11/15/2013
		//$parse_date = date_parse($name);
		//echo "name $date";
		$time = strtotime($date);
		//echo "<time $time matchTime $matchTime>";
		if ($time == $matchTime) {
			$htmlString .= $dow;
			$htmlString .= ", ";
			$htmlString .= $date;
			$htmlString .= " is:</h1>";
		}
	} else if ($name == 'PLATE' && $time == $matchTime) {
		//<plate name="Flakes-n-Bakes" type="Breakfast" description="Cereal, Fruit, etc.">
		foreach($attrs as $a => $b) {
			if ($a == 'NAME') {
				$plateName = $b;
			} else if ($a == 'TYPE') {
				$type = $b;
			} else if ($a == 'DESCRIPTION') {
				$description = $b;
			}
			//echo "startElement PLATE htmlString $htmlString";
		}
		//$htmlString .= '<div style="' + $divHeaderStyle + ';">';
		$htmlString .= '<div style="color: hsl(60, 100%, 50%);">';
		$htmlString .= "<h2> $type ($description) <i>$plateName</i></h2>";
		$htmlString .= '</div>';
		// tjs 131120
		//$htmlString .= '<table><thead style="color: hsl(100, 100%, 50%);"><th>Type</th><th>Portion</th><th>Notes</th></thead><tbody>';
		$htmlString .= '<table><thead style="color: hsl(100, 100%, 50%);"><th>Portion</th><th>Description</th><th>Notes</th></thead><tbody>';
		$plateName = str_ireplace(" ","_",$plateName);
		$currentPlateName = $plateName;
	} else if ($name == 'PORTION' &&  $time == $matchTime) {
	//} else if ($name == 'PORTION' && $currentPlateName == $plateName &&  $time == $matchTime) {
		//<portion type="Grain">Bran Flakes</portion>
		foreach($attrs as $a => $b) {
			if ($a == 'TYPE') {
				$type = $b;
			}
			//echo "startElement PORTION htmlString $htmlString";
		}
		// tjs 131120
		$htmlString .= '<tr class="';
		$htmlString .= $type;
		$htmlString .= '">';
		/*
		 $htmlString .= '<tr style="color:hsl(30, 100%, 50%);"><td>';
		 $htmlString .= $type;
		 $htmlString .= '</td>';
		 */
		// e.g. startElement SLATENAME="11/6/2013" DOW="Wednesday" ID="2"
	}
}

function endElement($parser, $name)
{
	global $htmlString;
	global $fh;
	//global $skipRest;
	global $time;
	global $matchTime;
	//global $descriptions;
	//global $notes;
	global $platePortionDescriptions;
	global $platePortionNotes;
	global $portionName;
	// tjs 131121
	global $plateName;
	//global $currentPlateName;
	//echo "refreshSlateMenu endElement $name";
	if ($name == 'PLATE' &&  $time == $matchTime) {
		$htmlString .= "</tbody></table><br/>";
		//$currentPlateName = '';
		//echo "endElement PLATE htmlString $htmlString";
	} else if ($name == 'PORTION' &&  $time == $matchTime) {
	//} else if ($name == 'PORTION' && $currentPlateName == $plateName &&  $time == $matchTime) {
		//echo "endElement plateName $plateName portionName $portionName";
		// tjs 131120
		//$htmlString .= "<td></td></tr>";
		/*
		$portionName = null;
		foreach($attrs as $a => $b) {
		if ($a == 'TYPE') {
		$type = $b;
		}
		}*/
		$description = '';
		//foreach($descriptions as $x=>$x_value) {
		foreach($platePortionDescriptions[$plateName] as $x=>$x_value) {
			//echo "Key=" . $x . ", Value=" . $x_value;
			//echo "<br>";
			//echo "x $x portionName $portionName";
			if ($x == $portionName) {
				$description = $x_value;
				//echo "DESC FOUND: $description";
				break;
			}
		}
		//echo "endElement portionName $portionName and description: $descriptsions[$portionName]";
		//echo "endElement portionName $portionName and description: $description";
		//if ($descriptsions[$portionName] != null) {
		//	$htmlString .= "<td>$descriptsions[$portionName]</td>";
		//} else {
		//$htmlString .= "<td></td>";
		//}
		$htmlString .= "<td>$description</td>";
		/*
		 if ($notes[$portionName] != null) {
			$htmlString .= "<td>$notes[$portionName]</td></tr>";
			} else {
			$htmlString .= "<td></td></tr>";
			}*/
		$note = '';
		//foreach($notes as $x=>$x_value) {
		foreach($platePortionNotes[$plateName] as $x=>$x_value) {
			//echo "Key=" . $x . ", Value=" . $x_value;
			//echo "<br>";
			//echo "x $x portionName $portionName";
			if ($x == $portionName) {
				$note = $x_value;
				//echo "DESC FOUND: $description";
				break;
			}
		}
		$htmlString .= "<td>$note</td></tr>";
		//echo "endElement PORTION htmlString $htmlString";
	} else if ($name == 'SLATE') {
		//echo "refreshSlateMenu DONE!";
	} else if ($name == 'SLATES') {
		//echo "refreshSlateMenu DONE!";
		$htmlString .= "  </body></html>";
		//echo "refreshSlateMenu htmlString is $htmlString";
		/*
		foreach($descriptions as $x=>$x_value) {
		echo "Key=" . $x . ", Value=" . $x_value;
		echo "<br>";
		}*/
		fwrite($fh, $htmlString  );
		fclose($fh);
		global $xmlFileNamePath;
		chmod($xmlFileNamePath, 0777);
	}
}

function characterData($parser, $data)
{
	global $htmlString;
	global $time;
	global $matchTime;
	global $portionName;
	//global $skipRest;
	if ($time == $matchTime) {
		//echo $data;
		$portionName = $data;
		//str_ireplace(find,replace,string,count)
		//$htmlString .= "<td>$data</td>";
		//echo "characterData portionName $portionName";
		$htmlString .= "<td>$portionName</td>";
		$portionName = str_ireplace(" ","_",$portionName);
	}
}

function processXmlFile() {
	//echo "open output...";
	// tjs 131119
	//$fh = fopen($xmlFileNamePath, 'w');
	//$result = '0';
	global $result;
	global $xmlFileNamePath;
	global $todayOffset;
	global $tomorrowOffset;
	global $flushToday;
	global $xmlString;
	global $htmlString;
	global $time;
	global $matchTime;
	//global $descriptions;
	//global $notes;
	global $platePortionDescriptions;
	global $platePortionNotes;
	global $fh;
	global $plateName;
	//global $currentPlateName;
/*
	 foreach($descriptions as $x=>$x_value) {
	 echo "Key=" . $x . ", Value=" . $x_value;
	 echo "<br>";
	 }*/
	if (!($fh = fopen($xmlFileNamePath, 'w'))) {
		//    die("could not open XML input");
	} else {
		$matchTime = $todayOffset;
		//echo "default matchTime $matchTime";
		if ($flushToday) {
			// tjs 131118
			//$skipRest = true;
			$matchTime = $tomorrowOffset;
		}
		//echo "matchTime $matchTime";

		$time = null;
		$htmlString = "";
		$htmlString .= "<!DOCTYPE html><html><head><title>Socket.IO dynamically reloading CSS stylesheets</title><link rel=\"stylesheet\" type=\"text/css\" href=\"/header.css\" /><link rel=\"stylesheet\" type=\"text/css\" href=\"/styles.css\" /><script type=\"text/javascript\" src=\"/socket.io/socket.io.js\"></script><script type=\"text/javascript\">";
		$htmlString .= "window.onload = function () {var socket = io.connect();socket.on('reload', function () {window.location.reload();});socket.on('stylesheet', function (sheet) {var link = document.createElement('link');var head = document.getElementsByTagName('head')[0];link.setAttribute('rel', 'stylesheet');link.setAttribute('type', 'text/css');link.setAttribute('href', sheet);head.appendChild(link);});}</script></head><body><h1>Your PlateSlate menu slated for ";
		//echo "refreshSlateMenu prior parser htmlString $htmlString";

		$xml_parser = xml_parser_create();
		// use case-folding so we are sure to find the tag in $map_array
		//xml_parser_set_option($xml_parser, XML_OPTION_CASE_FOLDING, true);
		xml_set_element_handler($xml_parser, "startElement", "endElement");
		xml_set_character_data_handler($xml_parser, "characterData");
		$result = xml_parse($xml_parser, $xmlString);

		//while ($data = fread($fp, 4096)) {
		/*
		if (!xml_parse($xml_parser, $data, feof($fp))) {
		die(sprintf("XML error: %s at line %d",
		xml_error_string(xml_get_error_code($xml_parser)),
		xml_get_current_line_number($xml_parser)));
		}*/
		//}
		xml_parser_free($xml_parser);
		//$htmlString .= '  </body></html>';
		//echo "refreshSlateMenu htmlString is $htmlString";
		//fwrite($fh, $htmlString  );
		//fclose($fh);
	}
	echo($result);
}
?>
