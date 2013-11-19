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
$xmlFileName = "test.xml";
$xmlString = $_POST["xml"];
//$xmlString = '<slates accountId="0" userName="unknown" firstName="firstName" lastName="lastName" share="false"><slate name="11/18/2013" dow="Wednesday" id="2"><plates><plate name="Schred-n-Bread" type="Breakfast" description="Cereal, Fruit, etc."><portions><portion type="Grain">Schredded Wheat</portion><portion type="Fruits">Bananas</portion><portion type="Dairy">Milk</portion><portion type="Grain">Muffins</portion></portions></plate><plate name="Grilled Cheese" type="Lunch" description="(with fruit)"><portions><portion type="Protein">Pork Products</portion><portion type="Dairy">Cheese</portion><portion type="Fruits">Apples</portion></portions></plate><plate name="American Chop Suey" type="Dinner" description=""><portions><portion type="Grain">Pasta</portion><portion type="Protein">Beef Products</portion><portion type="Vegetables">Onions</portion><portion type="Vegetables">Tomatoes</portion></portions></plate></plates></slate></slates>';
// e.g. doRealTimeReport divHeaderStyle color:hsl(60, 100%, 50%) divLabelStyle color:hsl(100, 100%, 50%) divDataStyle color:hsl(140, 100%, 50%)
//$divHeaderStyle = $_POST["divHeaderStyle"];
//$divLabelStyle = $_POST["divLabelStyle"];
//$divDataStyle = $_POST["divDataStyle"];
//$divHeaderStyle = "color:hsl(60, 100%, 50%)";
$divHeaderStyle = "color: red";
$divLabelStyle = "color:hsl(100, 100%, 50%)";
$divDataStyle = "color:hsl(140, 100%, 50%)";
//echo "divHeaderStyle $divHeaderStyle";
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

if (isset($_SESSION['member'])) {
	$member = $_SESSION['member'];
	$account = $member->getValue( "id" );
}
// tjs 131119
$xmlFileNamePath = "./slateView/$account/slate.html";
//echo "refreshSlateMenu xmlFileNamePath is $xmlFileNamePath";

//echo "open output...";
// tjs 131119
//$fh = fopen($xmlFileNamePath, 'w');
$result = '0';
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
	function startElement($parser, $name, $attrs)
	{
		//echo "refreshSlateMenu startElement $name";
		global $htmlString;
		global $time;
		global $matchTime;
		global $divHeaderStyle;
		global $divLabelStyle;
		global $divDataStyle;
		if ($name == 'SLATE') {
			//<slate name="August 27, 2011">
			//echo "started slate element!";
			foreach($attrs as $a => $b) {
				//echo $a,'="',$b,"\"\n";
				if ($a == 'NAME') {
					// tjs 131114
					$date .= $b;
					//$htmlString .= $b;
					//$htmlString .= " is:</h1>";
				} else if ($a == 'DOW') {
					$dow = $b;
				}
			}
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
			//$htmlString .= "<table><thead><th>Type</th><th>Portion</th><th>Notes</th></thead><tbody>";
			//$htmlString .= '<table><thead style="' + $divLabelStyle + ';"><th>Type</th><th>Portion</th><th>Notes</th></thead><tbody>';
			$htmlString .= '<table><thead style="color: hsl(100, 100%, 50%);"><th>Type</th><th>Portion</th><th>Notes</th></thead><tbody>';
		} else if ($name == 'PORTION' &&  $time == $matchTime) {
			//<portion type="Grain">Bran Flakes</portion>
			foreach($attrs as $a => $b) {
				if ($a == 'TYPE') {
					$type = $b;
				}
				//echo "startElement PORTION htmlString $htmlString";
			}
			$htmlString .= '<tr style="color:hsl(30, 100%, 50%);"><td>';
			$htmlString .= $type;
			$htmlString .= '</td>';
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
		//echo "refreshSlateMenu endElement $name";
		if ($name == 'PLATE' &&  $time == $matchTime) {
			$htmlString .= "</tbody></table><br/>";
			//echo "endElement PLATE htmlString $htmlString";
		} else if ($name == 'PORTION' &&  $time == $matchTime) {
			$htmlString .= "<td></td></tr>";
			//echo "endElement PORTION htmlString $htmlString";
		} else if ($name == 'SLATE') {
			//echo "refreshSlateMenu DONE!";
		} else if ($name == 'SLATES') {
			//echo "refreshSlateMenu DONE!";
			$htmlString .= "  </body></html>";
			//echo "refreshSlateMenu htmlString is $htmlString";
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
		//global $skipRest;
		if ($time == $matchTime) {
			//echo $data;
			$htmlString .= "<td>$data</td>";
		}
	}

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

?>


