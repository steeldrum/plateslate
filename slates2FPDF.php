<?php
/***************************************
$Revision:: 131                        $: Revision of last commit
$LastChangedBy::                       $: Author of last commit
$LastChangedDate:: 2011-09-01 10:58:47#$: Date of last commit
***************************************/
//echo "here";
require ('fpdf.php');

/*
slates2FPDF.php
tjs 110827

file version 1.00 
*/

/*
e.g. of data content:
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

see also http://www.fpdf.org/
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

$pdf=new FPDF();
$pdf->AddPage();
$pdf->SetFont('Arial','B',16);

$account = 0;

$xmlPathFileName = isset( $_GET["xml"] ) ? $_GET["xml"] : "";

//tjs 110830 for debug
//echo("xmlPathFileName ".$xmlPathFileName);

class Slate {
	public $_id;
	public $_name;
	// tjs 110901
	public $_dow;
	public $_plates;
	
	//public function __construct($id, $name, $plates) {
	public function __construct($id, $name, $dow, $plates) {
		$this->_id = $id;
		$this->_name = $name;
		$this->_dow = $dow;
		$this->_plates = $plates;
	}
	
	public function getId() {
		return $this->_id;
	}

	public function getName() {
		return $this->_name;
	}

	public function getDow() {
		return $this->_dow;
	}
	
	public function getPlates() {
		$plates = array();
		foreach ( $this->_plates as $plate) {
			$plates[] = $plate;
		}
		return $plates;
	}
	
	public function showDetails() {
		//echo "slate name ".$this->_name." id ".$this->_id." Plates:\n";
		echo "slate name ".$this->_name." dow ".$this->_dow." id ".$this->_id." Plates:\n";
		foreach ( $this->_plates as $plate) {
			$plate->showDetails();
		}
	}
	
	    /* This is the static comparing function: */
	    static function cmp_obj($a, $b)
    {
        $al = intval($a->getId());
        $bl = intval($b->getId());
        if ($al == $bl) {
            return 0;
        }
        return ($al > $bl) ? +1 : -1;
    }
	
}

class Plate {
	//public $_id;
	public $_name;
	public $_type;
	public $_description;
	public $_portions;
	
	public function __construct($name, $type, $description, $portions) {
		//$this->_id = $id;
		$this->_type = $type;
		$this->_name = $name;
		$this->_description = $description;
		$this->_portions = $portions;
	}
	
	public function getName() {
		return $this->_name;
	}
	public function getType() {
		return $this->_type;
	}
	public function getDescription() {
		return $this->_description;
	}
	
	public function getPortions() {
		$portions = array();
		foreach ( $this->_portions as $portion) {
			$portions[] = $portion;
		}
		return $portions;
	}
	
	public function showDetails() {
		echo "plate ".$this->_name." type ".$this->_type." desc ".$this->_description." Portions:\n";		
		foreach ( $this->_portions as $portion) {
			$portion->showDetails();
		}
	}	
}

class Portion {
	//public $_id;
	public $_name;
	public $_type;
	
	public function __construct($name, $type) {
		$this->_type = $type;
		$this->_name = $name;
	}
	
	public function getName() {
		return $this->_name;
	}
	public function getType() {
		return $this->_type;
	}
	
	public function showDetails() {
		echo "portion ".$this->_name." type ".$this->_type."\n";		
	}	

	    /* This is the static comparing function: */
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
}

	/*
To add a frame, we would do this:
$pdf->Cell(40,10,'Hello World !',1);
To add a new cell next to it with centered text and go to the next line, we would do:
$pdf->Cell(60,10,'Powered by FPDF.',0,1,'C');
	
	*/
	/*
API Notes
Cell(float w [, float h [, string txt [, mixed border [, int ln [, string align [, boolean fill [, mixed link]]]]]]])
w Cell width. If 0, the cell extends up to the right margin. 
h Cell height. Default value: 0. 
txt String to print. Default value: empty string. 
border:
	* 0: no border
	* 1: frame
OR
    * L: left
    * T: top
    * R: right
    * B: bottom
ln    after call position:
    * 0: to the right
    * 1: to the beginning of the next line
    * 2: below
    Putting 1 is equivalent to putting 0 and calling Ln() just after. Default value: 0. 
align
    * L or empty string: left align (default value)
    * C: center
    * R: right align
fill   Indicates if the cell background must be painted (true) or transparent (false). Default value: false.
URL or identifier returned by AddLink(). 
	*/

function outputSlate($pdf, $slate) {
	//$slateName = $slate->getName();
	//echo $slateName;
	//$slate->showDetails();
	//echo $slateName;
	$pdf->SetFont('Arial','B',16);

	// tjs 110901
	$slateInfo = $slate->getName()." (".$slate->getDow().")";
	//$pdf->Cell(0,30,$slate->getName(),'B');
	$pdf->Cell(0,30,$slateInfo,'B');
	$plates = $slate->getPlates();
	$plateLine = "plate:_________________";
	foreach ($plates as $plate) {
		$plateLine = sprintf("%s %s %s", $plate->getType(), $plate->getName(), $plate->getDescription());
		// for debug		
		//echo "slate name".$slate->getName()." plate info: ".$plateLine;
		
		$pdf->SetFont('Arial','',12);
		$pdf->Cell(0,5,$plateLine,0,1,'R');
		$portions = $plate->getPortions();
		// tjs 110829
		usort($portions, array("Portion", "cmp_obj"));
		//$portionsCount = count($portions);
		$portionLine = "";
		//$portionLine = $portionsCount;
		$lastType = "";
		$lastLCType = "";
		//echo "lastType ".$lastType." line ".$portionLine;		
		foreach ( $portions as $portion) {
			$portionType = $portion->getType();
			if ($lastLCType == "") {
				$lastLCType = strtolower($portionType);
				$lastType = $portionType;
			}
			if (strtolower($portionType) != $lastLCType) {
			//if ($portionType != $lastType) {
				$portionLine .= "(".$lastType.")";
				$lastLCType = strtolower($portionType);
				$lastType = $portionType;
			}
			$portionLine .= " ".$portion->getName()." ";			
		}

		$portionLine .= "(".$lastType.")";
		
		//echo "slate name".$slate->getName()." portion info: ".$portionLine;
		// tjs 110829
		$pdf->SetFont('Arial','',10);
		$pdf->Cell(0,5,$portionLine,0,1,'R');
	}
	
}


// load file - used for test...
// set name of XML file
/*
$slatesxml = '<slates></slates>';
if (strlen($xmlString) > 0) {
//if ($account > 0) {
	$slatesxml = $xmlString;
} else {
	$file = "slates.xml";
	$slatesxml = simplexml_load_file($file) or die ("Unable to load XML file!");
}
*/
//echo("xmlPathFileName before load ".$xmlPathFileName);

$slatesxml = simplexml_load_file($xmlPathFileName) or die ("Unable to load XML file!");
//echo("slatesxml ".$slatesxml);

$firstName = $slatesxml['firstName'];
//echo("firstName ".$firstName);

// access XML person data
$slates = array();
foreach($slatesxml->slate as $slate) {
	$slateId = $slate['id'];
	$slateName = $slate['name'];
	// tjs 110901
	$slateDow = $slate['dow'];
	$plates = $slate->plates;
	$plateList = array();
	foreach($plates->plate as $plate) {
		$plateName = $plate['name'];
		$plateType = $plate['type'];
		$plateDescription = $plate['description'];
		$portions = $plate->portions;
		$portionList = array();
		foreach($portions->portion as $portion) {
			$portionType = $portion['type'];
			$portionName = $portion;
			$portionList[] = new Portion($portionName, $portionType);
		}
		$p = new Plate($plateName, $plateType, $plateDescription, $portionList);
		$plateList[] = $p;
	}
	//$s = new Slate($slateId, $slateName, $plateList);
	$s = new Slate($slateId, $slateName, $slateDow, $plateList);
	// tjs 110818 for debug
	/*
	 * e.g.
	 * slate name August 28, 2011 id 14
	 *  slate name August 27, 2011 id 13
	 *   slate name August 26, 2011 id 12
	 *    slate name August 25, 2011 id 11
	 *     slate name August 24, 2011 id 10
	 *      slate name August 23, 2011 id 9
	 *       slate name August 22, 2011 id 8
	 * 
	 */
	//$s->showDetails();
	$slates[] = $s;
}

//usort($slates, array("slates", "cmp_obj"));
usort($slates, array("Slate", "cmp_obj"));
// tjs 110901
//$pdf->SetFont('Arial','B',16);
$title = $firstName."'s Plates that are Slated to be served!";
//$pdf->Cell(0,5,$title,'B');
$pdf->Cell(0,5,$title,'B',1);

foreach($slates as $s) {
	outputSlate($pdf, $s);
	// for debug...
	//$s->showDetails();
}

// tjs 110828 temp disable
$pdf->Output();

?> 


