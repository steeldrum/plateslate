<?php
/***************************************
$Revision::                            $: Revision of last commit
$LastChangedBy::                       $: Author of last commit
$LastChangedDate::                     $: Date of last commit
***************************************/
//echo "here";

/*
clientXml2RDBMS.php
tjs 120203

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
//require_once "DataObject.class.php";

//tjs 110511 above ensures that config.php has been loaded as well
$username=DB_USERNAME;
$password=DB_PASSWORD;
$database=DB_NAME;

session_start();

// tjs 120204
// for test and debug...
$xmlPathFileName = '';
// tjs 120206
//$testXmlFileNamePath = $_GET["testXml"];
$testXmlFileNamePath = $_GET["xmlPath"];
$testXmlFileNamePathLen = strlen($testXmlFileNamePath);
//echo "testXmlFileNamePathLen ".$testXmlFileNamePathLen;
//echo "testXmlFileNamePathLen ".$testXmlFileNamePathLen." testXmlFileNamePath ".$testXmlFileNamePath;

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
if (isset($_SESSION['member'])) {
		$member = $_SESSION['member'];
		$account = $member->getValue( "id" );
		//$xmlString = isset( $_REQUEST["xml"] ) ? $_REQUEST["xml"] : "";
} 
//$account = isset( $_REQUEST["account"] ) ? (int) $_REQUEST["account"] : 1;
//$account = isset( $_GET["account"] ) ? (int) $_GET["account"] : 1;
//$account = 1;
//$xmlString = "";
//$xmlString = isset( $_REQUEST["xml"] ) ? $_REQUEST["xml"] : "";
//$xmlFileName = isset( $_POST["name"] ) ? $_POST["name"] : "temp.xml";
if ($testXmlFileNamePathLen == 0) {
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


//$loadedID  = mysql_real_escape_string($_POST["id"]);

//$stringToWrite = "".$_POST["text"]."";
//echo("xml string length ".strlen($xmlString)." pathname ".$xmlFileNamePath." string ".$xmlString);
//echo("xml string length ".strlen($xmlString)." pathname ".$xmlFileNamePath);

//$fh = fopen("test.xml", 'w');
$fh = fopen($xmlFileNamePath, 'w');
//fwrite($fh, $stringToWrite  );
fwrite($fh, $xmlString  );
fclose($fh);
//echo($xmlFileNamePath);
} else {
$xmlPathFileName = $testXmlFileNamePath;	
//echo " xmlPathFileName ".$xmlPathFileName;
}

class Slates {
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

class Plates {
  
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

class Portions {
	  
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

class Slate extends DataObject {

	protected $data = array(
    "id" => "",
    "memberid" => "",
    "date" => "",
    "name" => "",
    "description" => "",
    "breakfastid" => "",
    "lunchid" => "",
    "dinnerid" => "",
    "isinactive" => ""
  );

  // tjs 120208
  //private $lastId;
  public $_lastId;
  
  public function insert() {
    $conn = parent::connect();
    $sql = "INSERT INTO " . TBL_SLATE . " (
    		memberid,
    		date,
    		name,
    		description,
    		breakfastid,
    		lunchid,
    		dinnerid,
    		isinactive
            ) VALUES (
              :memberId,
              :date,
              :name,
              :description,
              :breakfastId,
    		:lunchId,
    		:dinnerId,
              :isInactive
            )";

    try {
      $st = $conn->prepare( $sql );
      $st->bindValue( ":memberId", $this->data["memberid"], PDO::PARAM_STR );
      $st->bindValue( ":date", $this->data["date"], PDO::PARAM_STR );
      $st->bindValue( ":name", $this->data["name"], PDO::PARAM_STR );
      $st->bindValue( ":description", $this->data["description"], PDO::PARAM_STR );
      $st->bindValue( ":breakfastId", $this->data["breakfastid"], PDO::PARAM_STR );
      $st->bindValue( ":lunchId", $this->data["lunchid"], PDO::PARAM_STR );
      $st->bindValue( ":dinnerId", $this->data["dinnerid"], PDO::PARAM_STR );
      $st->bindValue( ":isInactive", $this->data["isinactive"], PDO::PARAM_STR );
      $st->execute();
      //$data['id'] = $conn->lastInsertId();
      //$this->$data['id'] = $conn->lastInsertId();
      //$this->$data["id"] = $conn->lastInsertId();
     //echo "temp...";
     //$temp = getValue('id');
     //$temp = $this->getValue('id');
      //echo " id ".$temp;
      // tjs 120208
      //$_lastId = $conn->lastInsertId();
      $this->_lastId = $conn->lastInsertId();
      //echo " lastId ".$lastId;
      parent::disconnect( $conn );
    } catch ( PDOException $e ) {
      parent::disconnect( $conn );
      die( "Query failed: " . $e->getMessage() );
    }
  }

  public function update() {
    $conn = parent::connect();
    //$passwordSql = $this->data["password"] ? "password = password(:password)," : "";
    $sql = "UPDATE " . TBL_SLATE . " SET
              memberid = :memberId,
              date = :date,
              name = :name,
              description = :description,
              breakfastid = :breakfastId,
    		lunchid = :lunchId,
    		dinnerid = :dinnerId,
               isinactive = :isInactive
              WHERE id = :id";

    try {
      $st = $conn->prepare( $sql );
      $st->bindValue( ":id", $this->data["id"], PDO::PARAM_INT );
      $st->bindValue( ":memberId", $this->data["memberid"], PDO::PARAM_STR );
      $st->bindValue( ":date", $this->data["date"], PDO::PARAM_STR );
      $st->bindValue( ":name", $this->data["name"], PDO::PARAM_STR );
      $st->bindValue( ":description", $this->data["description"], PDO::PARAM_STR );
      $st->bindValue( ":breakfastId", $this->data["breakfastid"], PDO::PARAM_STR );
      $st->bindValue( ":lunchId", $this->data["lunchid"], PDO::PARAM_STR );
      $st->bindValue( ":dinnerId", $this->data["dinnerid"], PDO::PARAM_STR );
      $st->bindValue( ":isInactive", $this->data["isinactive"], PDO::PARAM_STR );
      $st->execute();
      parent::disconnect( $conn );
    } catch ( PDOException $e ) {
      parent::disconnect( $conn );
      die( "Query failed: " . $e->getMessage() );
    }
  }
  
  public function delete() {
    $conn = parent::connect();
    $sql = "DELETE FROM " . TBL_SLATE . " WHERE id = :id";

    try {
      $st = $conn->prepare( $sql );
      $st->bindValue( ":id", $this->data["id"], PDO::PARAM_INT );
      $st->execute();
      parent::disconnect( $conn );
    } catch ( PDOException $e ) {
      parent::disconnect( $conn );
      die( "Query failed: " . $e->getMessage() );
    }
  }

    public function deleteByMember() {
    $conn = parent::connect();
    $sql = "DELETE FROM " . TBL_SLATE . " WHERE memberid = :memberId";

    try {
      $st = $conn->prepare( $sql );
      $st->bindValue( ":memberId", $this->data["memberid"], PDO::PARAM_INT );
      $st->execute();
      parent::disconnect( $conn );
    } catch ( PDOException $e ) {
      parent::disconnect( $conn );
      die( "Query failed: " . $e->getMessage() );
    }
  }
	
  public function getLastId() {
  	return $this->_lastId;
  }
}

class Food extends DataObject {

	protected $data = array(
    "id" => "",
    "memberid" => "",
    "slateid" => "",
	"type" => "",
    "portionid" => "",
    "ismaster" => "",
    "isinactive" => ""
  );

  private $_types = array(
    "grain" => "Grain",
    "protein" => "Protein",
    "fruit" => "Fruit",
    "vegetable" => "Vegetable",
    "dairy" => "Dairy"
    );

  public function insert() {
    $conn = parent::connect();
    $sql = "INSERT INTO " . TBL_FOOD . " (
    		memberid,
    		slateid,
    		type,
    		portionid,
    		ismaster,
    		isinactive
            ) VALUES (
              :memberId,
              :slateId,
              :type,
              :portionId,
              :isMaster,
              :isInactive
            )";

    try {
      $st = $conn->prepare( $sql );
      $st->bindValue( ":memberId", $this->data["memberid"], PDO::PARAM_STR );
      $st->bindValue( ":slateId", $this->data["slateid"], PDO::PARAM_STR );
      $st->bindValue( ":type", $this->data["type"], PDO::PARAM_STR );
      $st->bindValue( ":portionId", $this->data["portionid"], PDO::PARAM_STR );
      $st->bindValue( ":isMaster", $this->data["ismaster"], PDO::PARAM_STR );
      $st->bindValue( ":isInactive", $this->data["isinactive"], PDO::PARAM_STR );
      $st->execute();
      parent::disconnect( $conn );
    } catch ( PDOException $e ) {
      parent::disconnect( $conn );
      die( "Query failed: " . $e->getMessage() );
    }
  }

  public function update() {
    $conn = parent::connect();
    //$passwordSql = $this->data["password"] ? "password = password(:password)," : "";
    $sql = "UPDATE " . TBL_FOOD . " SET
              memberid = :memberId,
              slateid = :slateId,
              type = :type,
              portionid = :portionId,
              ismaster = :isMaster,
              isinactive = :isInactive
              WHERE id = :id";

    try {
      $st = $conn->prepare( $sql );
      $st->bindValue( ":id", $this->data["id"], PDO::PARAM_INT );
      $st->bindValue( ":memberId", $this->data["memberid"], PDO::PARAM_STR );
      $st->bindValue( ":slateId", $this->data["slateid"], PDO::PARAM_STR );
      $st->bindValue( ":type", $this->data["type"], PDO::PARAM_STR );
      $st->bindValue( ":portionId", $this->data["portionid"], PDO::PARAM_STR );
      $st->bindValue( ":isMaster", $this->data["ismaster"], PDO::PARAM_STR );
      $st->bindValue( ":isInactive", $this->data["isinactive"], PDO::PARAM_STR );
      $st->execute();
      parent::disconnect( $conn );
    } catch ( PDOException $e ) {
      parent::disconnect( $conn );
      die( "Query failed: " . $e->getMessage() );
    }
  }
  
  public function delete() {
    $conn = parent::connect();
    $sql = "DELETE FROM " . TBL_FOOD . " WHERE id = :id";

    try {
      $st = $conn->prepare( $sql );
      $st->bindValue( ":id", $this->data["id"], PDO::PARAM_INT );
      $st->execute();
      parent::disconnect( $conn );
    } catch ( PDOException $e ) {
      parent::disconnect( $conn );
      die( "Query failed: " . $e->getMessage() );
    }
  }

    public function deleteByMember() {
    $conn = parent::connect();
    $sql = "DELETE FROM " . TBL_FOOD . " WHERE memberid = :memberId";

    try {
      $st = $conn->prepare( $sql );
      $st->bindValue( ":memberId", $this->data["memberid"], PDO::PARAM_INT );
      $st->execute();
      parent::disconnect( $conn );
    } catch ( PDOException $e ) {
      parent::disconnect( $conn );
      die( "Query failed: " . $e->getMessage() );
    }
  }
	
}

class Plate extends DataObject {

	protected $data = array(
    "id" => "",
    "memberid" => "",
    "type" => "",
    "name" => "",
    "description" => "",
    "ismaster" => "",
    "portion1" => "",
    "portion2" => "",
	"portion3" => "",
    "portion4" => "",
	"portion5" => "",
    "portion6" => "",
	"portion7" => "",
    "portion8" => "",
	"portion9" => "",
    "isinactive" => ""
  );

  private $_types = array(
    "breakfast" => "Breakfast",
    "lunch" => "Lunch",
    "dinner" => "Dinner"
  );

  public function insert() {
    $conn = parent::connect();
    $sql = "INSERT INTO " . TBL_PLATE . " (
    		memberid,
    		type,
    		name,
    		description,
    		ismaster,
    		portion1,
    		portion2,
    		portion3,
    		portion4,
    		portion5,
    		portion6,
    		portion7,
    		portion8,
    		portion9,
    		isinactive
            ) VALUES (
              :memberId,
              :type,
              :name,
              :description,
              :isMaster,
    		:portion1,
    		:portion2,
    		:portion3,
    		:portion4,
    		:portion5,
    		:portion6,
    		:portion7,
    		:portion8,
    		:portion9,
              :isInactive
            )";

    try {
      $st = $conn->prepare( $sql );
      $st->bindValue( ":memberId", $this->data["memberid"], PDO::PARAM_STR );
      $st->bindValue( ":type", $this->data["type"], PDO::PARAM_STR );
      $st->bindValue( ":name", $this->data["name"], PDO::PARAM_STR );
      $st->bindValue( ":description", $this->data["description"], PDO::PARAM_STR );
      $st->bindValue( ":isMaster", $this->data["ismaster"], PDO::PARAM_STR );
      $st->bindValue( ":portion1", $this->data["portion1"], PDO::PARAM_STR );
      $st->bindValue( ":portion2", $this->data["portion2"], PDO::PARAM_STR );
      $st->bindValue( ":portion3", $this->data["portion3"], PDO::PARAM_STR );
      $st->bindValue( ":portion4", $this->data["portion4"], PDO::PARAM_STR );
      $st->bindValue( ":portion5", $this->data["portion5"], PDO::PARAM_STR );
      $st->bindValue( ":portion6", $this->data["portion6"], PDO::PARAM_STR );
      $st->bindValue( ":portion7", $this->data["portion7"], PDO::PARAM_STR );
      $st->bindValue( ":portion8", $this->data["portion8"], PDO::PARAM_STR );
      $st->bindValue( ":portion9", $this->data["portion9"], PDO::PARAM_STR );
      $st->bindValue( ":isInactive", $this->data["isinactive"], PDO::PARAM_STR );
      $st->execute();
      parent::disconnect( $conn );
    } catch ( PDOException $e ) {
      parent::disconnect( $conn );
      die( "Query failed: " . $e->getMessage() );
    }
  }

  public function update() {
    $conn = parent::connect();
    //$passwordSql = $this->data["password"] ? "password = password(:password)," : "";
    $sql = "UPDATE " . TBL_PLATE . " SET
              memberid = :memberId,
              type = :type,
              name = :name,
              description = :description,
              ismaster = :isMaster,
    		portion1 = :portion1,
    		portion2 = :portion2,
    		portion3 = :portion3,
    		portion4 = :portion4,
    		portion5 = :portion5,
    		portion6 = :portion6,
    		portion7 = :portion7,
    		portion8 = :portion8,
    		portion9 = :portion9,
              isinactive = :isInactive
              WHERE id = :id";

    try {
      $st = $conn->prepare( $sql );
      $st->bindValue( ":id", $this->data["id"], PDO::PARAM_INT );
      $st->bindValue( ":memberId", $this->data["memberid"], PDO::PARAM_STR );
      $st->bindValue( ":type", $this->data["type"], PDO::PARAM_STR );
      $st->bindValue( ":name", $this->data["name"], PDO::PARAM_STR );
      $st->bindValue( ":description", $this->data["description"], PDO::PARAM_STR );
      $st->bindValue( ":isMaster", $this->data["ismaster"], PDO::PARAM_STR );
      $st->bindValue( ":portion1", $this->data["portion1"], PDO::PARAM_STR );
      $st->bindValue( ":portion2", $this->data["portion2"], PDO::PARAM_STR );
      $st->bindValue( ":portion3", $this->data["portion3"], PDO::PARAM_STR );
      $st->bindValue( ":portion4", $this->data["portion4"], PDO::PARAM_STR );
      $st->bindValue( ":portion5", $this->data["portion5"], PDO::PARAM_STR );
      $st->bindValue( ":portion6", $this->data["portion6"], PDO::PARAM_STR );
      $st->bindValue( ":portion7", $this->data["portion7"], PDO::PARAM_STR );
      $st->bindValue( ":portion8", $this->data["portion8"], PDO::PARAM_STR );
      $st->bindValue( ":portion9", $this->data["portion9"], PDO::PARAM_STR );
      $st->bindValue( ":isInactive", $this->data["isinactive"], PDO::PARAM_STR );
      $st->execute();
      parent::disconnect( $conn );
    } catch ( PDOException $e ) {
      parent::disconnect( $conn );
      die( "Query failed: " . $e->getMessage() );
    }
  }
  
  public function delete() {
    $conn = parent::connect();
    $sql = "DELETE FROM " . TBL_PLATE . " WHERE id = :id";

    try {
      $st = $conn->prepare( $sql );
      $st->bindValue( ":id", $this->data["id"], PDO::PARAM_INT );
      $st->execute();
      parent::disconnect( $conn );
    } catch ( PDOException $e ) {
      parent::disconnect( $conn );
      die( "Query failed: " . $e->getMessage() );
    }
  }

    public function deleteByMember() {
    $conn = parent::connect();
    $sql = "DELETE FROM " . TBL_PLATE . " WHERE memberid = :memberId";

    try {
      $st = $conn->prepare( $sql );
      $st->bindValue( ":memberId", $this->data["memberid"], PDO::PARAM_INT );
      $st->execute();
      parent::disconnect( $conn );
    } catch ( PDOException $e ) {
      parent::disconnect( $conn );
      die( "Query failed: " . $e->getMessage() );
    }
  }

    public function getPlateMapByMember() {
  	$plateMap = array();
    $conn = parent::connect();
    $sql = "SELECT * FROM " . TBL_PLATE . " WHERE memberid = :memberId";
      	//echo "getPlateMapByMember sql ".$sql;
    
      $plates = array();
    try {
      $st = $conn->prepare( $sql );
      $st->bindValue( ":memberId", $this->data["memberid"], PDO::PARAM_INT );
      $st->execute();
      foreach ( $st->fetchAll() as $row ) {
      	//echo "getPlateMapByMember row...";
        $plates[] = new Plate( $row );
      }      
      parent::disconnect( $conn );
    } catch ( PDOException $e ) {
      parent::disconnect( $conn );
      die( "Query failed: " . $e->getMessage() );
    }
  	foreach ($plates as $plate) {
      	//echo "getPortionMapByMember portion name ".$portion->name." id ".$portion->id;
  		//$portionMap[$portion->name] = $portionMap->id;
      	//echo "getPortionMapByMember portion name ".$portion->getValue('name')." id ".$portion->getValue('id');
  		$plateMap[$plate->getValue('name')] = $plate->getValue('id');
  	}
  	return $plateMap;
  }
  
  /*
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
	*/	
}
/*
 * 			`id` smallint(5) unsigned NOT NULL AUTO_INCREMENT,
			`memberId` smallint(5) unsigned NOT NULL,
			`type` varchar(16) NOT NULL,
			`name` varchar(32) NOT NULL,
			`value` varchar(32) NOT NULL,
			`isInactive` tinyint(4) DEFAULT NULL,

*/
class Preference extends DataObject {
  protected $data = array(
    "id" => "",
    "memberid" => "",
    "type" => "",
    "name" => "",
    "value" => "",
    "isinactive" => ""
  );

  private $_types = array(
    "user" => "User",
    "system" => "System",
    "other" => "Other"
  );

  public function insert() {
    $conn = parent::connect();
    $sql = "INSERT INTO " . TBL_PREFERENCE . " (
    		memberid,
    		type,
    		name,
    		value
            ) VALUES (
              :memberId,
              :type,
              :name,
              :value
            )";

    try {
      $st = $conn->prepare( $sql );
      $st->bindValue( ":memberId", $this->data["memberid"], PDO::PARAM_STR );
      $st->bindValue( ":type", $this->data["type"], PDO::PARAM_STR );
      $st->bindValue( ":name", $this->data["name"], PDO::PARAM_STR );
      $st->bindValue( ":value", $this->data["value"], PDO::PARAM_STR );
      $st->execute();
      parent::disconnect( $conn );
    } catch ( PDOException $e ) {
      parent::disconnect( $conn );
      die( "Query failed: " . $e->getMessage() );
    }
  }

  public function update() {
    $conn = parent::connect();
    //$passwordSql = $this->data["password"] ? "password = password(:password)," : "";
    $sql = "UPDATE " . TBL_PREFERENCE . " SET
              memberid = :memberId,
              type = :type,
              name = :name,
              value = :value
            WHERE id = :id";

    try {
      $st = $conn->prepare( $sql );
      $st->bindValue( ":id", $this->data["id"], PDO::PARAM_INT );
      $st->bindValue( ":memberId", $this->data["memberid"], PDO::PARAM_STR );
      $st->bindValue( ":type", $this->data["type"], PDO::PARAM_STR );
      $st->bindValue( ":name", $this->data["name"], PDO::PARAM_STR );
      $st->bindValue( ":value", $this->data["value"], PDO::PARAM_STR );
      $st->execute();
      parent::disconnect( $conn );
    } catch ( PDOException $e ) {
      parent::disconnect( $conn );
      die( "Query failed: " . $e->getMessage() );
    }
  }
  
  public function delete() {
    $conn = parent::connect();
    $sql = "DELETE FROM " . TBL_PREFERENCE . " WHERE id = :id";

    try {
      $st = $conn->prepare( $sql );
      $st->bindValue( ":id", $this->data["id"], PDO::PARAM_INT );
      $st->execute();
      parent::disconnect( $conn );
    } catch ( PDOException $e ) {
      parent::disconnect( $conn );
      die( "Query failed: " . $e->getMessage() );
    }
  }

    public function deleteByMember() {
    $conn = parent::connect();
    $sql = "DELETE FROM " . TBL_PREFERENCE . " WHERE memberid = :memberId";

    try {
      $st = $conn->prepare( $sql );
      $st->bindValue( ":memberId", $this->data["memberid"], PDO::PARAM_INT );
      $st->execute();
      parent::disconnect( $conn );
    } catch ( PDOException $e ) {
      parent::disconnect( $conn );
      die( "Query failed: " . $e->getMessage() );
    }
  }
  
}

class Portion extends DataObject {

	protected $data = array(
    "id" => "",
    "memberid" => "",
    "type" => "",
    "name" => "",
    "description" => "",
    "ismaster" => "",
	"isinactive" => ""
  );

  private $_types = array(
    "grain" => "Grain",
    "protein" => "Protein",
    "fruit" => "Fruit",
    "vegetable" => "Vegetable",
    "dairy" => "Dairy"
  );

  public function insert() {
    $conn = parent::connect();
    $sql = "INSERT INTO " . TBL_PORTION . " (
    		memberid,
    		type,
    		name,
    		description,
    		ismaster,
    		isinactive
            ) VALUES (
              :memberId,
              :type,
              :name,
              :description,
              :isMaster,
              :isInactive
            )";

    try {
      $st = $conn->prepare( $sql );
      $st->bindValue( ":memberId", $this->data["memberid"], PDO::PARAM_STR );
      $st->bindValue( ":type", $this->data["type"], PDO::PARAM_STR );
      $st->bindValue( ":name", $this->data["name"], PDO::PARAM_STR );
      $st->bindValue( ":description", $this->data["description"], PDO::PARAM_STR );
      $st->bindValue( ":isMaster", $this->data["ismaster"], PDO::PARAM_STR );
      $st->bindValue( ":isInactive", $this->data["isinactive"], PDO::PARAM_STR );
      $st->execute();
      parent::disconnect( $conn );
    } catch ( PDOException $e ) {
      parent::disconnect( $conn );
      die( "Query failed: " . $e->getMessage() );
    }
  }

  public function update() {
    $conn = parent::connect();
    //$passwordSql = $this->data["password"] ? "password = password(:password)," : "";
    $sql = "UPDATE " . TBL_PORTION . " SET
              memberid = :memberId,
              type = :type,
              name = :name,
              description = :description,
              ismaster = :isMaster,
              isinactive = :isInactive
              WHERE id = :id";

    try {
      $st = $conn->prepare( $sql );
      $st->bindValue( ":id", $this->data["id"], PDO::PARAM_INT );
      $st->bindValue( ":memberId", $this->data["memberid"], PDO::PARAM_STR );
      //$st->bindValue( ":memberId", $this->data["memberId"], PDO::PARAM_INT );
      $st->bindValue( ":type", $this->data["type"], PDO::PARAM_STR );
      $st->bindValue( ":name", $this->data["name"], PDO::PARAM_STR );
      $st->bindValue( ":description", $this->data["description"], PDO::PARAM_STR );
      $st->bindValue( ":isMaster", $this->data["ismaster"], PDO::PARAM_STR );
      $st->bindValue( ":isInactive", $this->data["isinactive"], PDO::PARAM_STR );
      $st->execute();
      parent::disconnect( $conn );
    } catch ( PDOException $e ) {
      parent::disconnect( $conn );
      die( "Query failed: " . $e->getMessage() );
    }
  }
  
  public function delete() {
    $conn = parent::connect();
    $sql = "DELETE FROM " . TBL_PORTION . " WHERE id = :id";

    try {
      $st = $conn->prepare( $sql );
      $st->bindValue( ":id", $this->data["id"], PDO::PARAM_INT );
      $st->execute();
      parent::disconnect( $conn );
    } catch ( PDOException $e ) {
      parent::disconnect( $conn );
      die( "Query failed: " . $e->getMessage() );
    }
  }

    public function deleteByMember() {
    $conn = parent::connect();
    $sql = "DELETE FROM " . TBL_PORTION . " WHERE memberid = :memberId";

    try {
      $st = $conn->prepare( $sql );
      $st->bindValue( ":memberId", $this->data["memberid"], PDO::PARAM_INT );
      $st->execute();
      parent::disconnect( $conn );
    } catch ( PDOException $e ) {
      parent::disconnect( $conn );
      die( "Query failed: " . $e->getMessage() );
    }
  }
	
  public function getPortionMapByMember() {
  	$portionMap = array();
    $conn = parent::connect();
    $sql = "SELECT * FROM " . TBL_PORTION . " WHERE memberid = :memberId";
      	//echo "getPortionMapByMember sql ".$sql;
    
      $portions = array();
    try {
      $st = $conn->prepare( $sql );
      $st->bindValue( ":memberId", $this->data["memberid"], PDO::PARAM_INT );
      $st->execute();
      //$portions = array();
      foreach ( $st->fetchAll() as $row ) {
      	//echo "getPortionMapByMember row...";
        $portions[] = new Portion( $row );
      }      
      parent::disconnect( $conn );
    } catch ( PDOException $e ) {
      parent::disconnect( $conn );
      die( "Query failed: " . $e->getMessage() );
    }
  	foreach ($portions as $portion) {
      	//echo "getPortionMapByMember portion name ".$portion->name." id ".$portion->id;
  		//$portionMap[$portion->name] = $portionMap->id;
      	//echo "getPortionMapByMember portion name ".$portion->getValue('name')." id ".$portion->getValue('id');
  		$portionMap[$portion->getValue('name')] = $portion->getValue('id');
  	}
  	return $portionMap;
  }
  /*
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
*/
	    /* This is the static comparing function: */
	   /* static function cmp_obj($a, $b)
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
    */
}

// deletes all rows belonging to the account in preparation for the new backup data
function deleteRows($a) {
	//echo " deleteRows account ".$a;
	$pref = new Preference( array( 
    "memberid" => $a
  	) );
  	$pref->deleteByMember();
  	// tjs 120208
  	$food = new Food( array( 
    "memberid" => $a
  	) );
  	$food->deleteByMember();
  	$slate = new Slate( array( 
    "memberid" => $a
  	) );
  	$slate->deleteByMember();
  	$plate = new Plate( array( 
    "memberid" => $a
  	) );
  	$plate->deleteByMember();
  	$portion = new Portion( array( 
    "memberid" => $a
  	) );
  	$portion->deleteByMember();
  	//echo " deleteRows done... ";
}

function populatePreferences($thexml, $a) {
		//echo " populatePreferences ";
	foreach($thexml->preferences->preference as $preference) {
		//echo " preference ";
			//foreach($preference->attributes() as $a => $b) {
    			//echo $a,'="',$b,"\"\n";
			//}
		//echo " preference ".$preference;
		$preferenceType = $preference['type'];
		$preferenceName = $preference['name'];
		//echo " preference type ".$preferenceType;
		$preferenceVlaue = $preference;
		//echo " preference type ".$preferenceType." name ".$preferenceName;
		  $pref = new Preference( array( 
    "memberid" => $a,
    "type" => $preferenceType,
    "name" => $preferenceName,
    "value" => $preferenceVlaue
		  ) );
		$pref->insert();
	}
}

// populates the portions table for the account backing up the portions client data
function populatePortions($thexml, $a) {
		//echo " populatePortions ";
			
	//foreach($slatesxml->morsel as $morsel) {
	foreach($thexml->morsels->morsel as $morsel) {
		//foreach($morsel->attributes() as $a => $b) {
    		//echo $a,'="',$b,"\"\n";
		//}		
		//echo " populatePortions moresel type?";
		$morselType = $morsel['type'];
		//echo " morsel type ".$morselType;
		$morselDescription = $morsel['description'];
		$morselIsMaster = $morsel['isMaster'];
		$morselIsInactive = $morsel['isInactive'];
		//echo " morsel type ".$morselType;
		$morselName = $morsel;
		//echo "morsel name ".$morselName." type ".$morselType;
		  $portion = new Portion( array( 
    "memberid" => $a,
    "type" => $morselType,
    "name" => $morselName,
    "description" => $morselDescription,
    "ismaster" => $morselIsMaster,
		      "isInactive" => $morselIsInactive
		  ) );
		$portion->insert();		
	}
}

// populates the plates table for the account backing up the plates client data
function populatePlates($thexml, $a) {
	//echo " populatePlates ";
	
	$portion = new Portion( array( 
    "memberid" => $a
  	) );
  	$portionMap = $portion->getPortionMapByMember();
	//echo " populatePlates map built ";
	//echo " populatePlates map Milk id ".$portionMap['Milk'];
	
	foreach($thexml->dishes->dish as $dish) {
		$dishType = $dish['type'];
		$dishDescription = $dish['description'];
		$dishIsMaster = $dish['isMaster'];
		$dishIsInactive = $dish['isInactive'];
		//$dishName = $dish;
		$dishName = $dish['name'];
		//echo " dish name ".$dishName." type ".$dishType;
		//echo "dish type ".$dishType;
		$segments = $dish->segments;
		$portion1 = 0;
		$portion2 = 0;
		$portion3 = 0;
		$portion4 = 0;
		$portion5 = 0;
		$portion6 = 0;
		$portion7 = 0;
		$portion8 = 0;
		$portion9 = 0;
		$offset = 0;
		foreach($segments->segment as $segment) {
			$segmentType = $segment['type'];
			//echo " segment type ".$segmentType;
			$segmentName = $segment;
			//echo " segment name ".$segmentName;
			switch ($offset++) {
				case 0:
					//$portion1 = $portionMap[$segmentName];
					$portion1 = $portionMap[(string) $segmentName];
					//echo " portion1 ".$portion1;
					break;
				case 1:
					$portion2 = $portionMap[(string) $segmentName];
					break;
				case 2:
					$portion3 = $portionMap[(string) $segmentName];
					break;
				case 3:
					$portion4 = $portionMap[(string) $segmentName];
					break;
				case 4:
					$portion5 = $portionMap[(string) $segmentName];
					break;
				case 5:
					$portion6 = $portionMap[(string) $segmentName];
					break;
				case 6:
					$portion7 = $portionMap[(string) $segmentName];
					break;
				case 7:
					$portion8 = $portionMap[(string) $segmentName];
					break;
				case 8:
					$portion9 = $portionMap[(string) $segmentName];
					break;
			}
		}		
		$plate = new Plate( array( 
    "memberid" => $a,
    "type" => $dishType,
    "name" => $dishName,
    "description" => $dishDescription,
    "ismaster" => $dishIsMaster,
    "portion1" => $portion1,
    "portion2" => $portion2,
	"portion3" => $portion3,
    "portion4" => $portion4,
	"portion5" => $portion5,
    "portion6" => $portion6,
	"portion7" => $portion7,
    "portion8" => $portion8,
	"portion9" => $portion9,
    "isinactive" => $dishIsInactive
		  ) );
		$plate->insert();			
	}
}

//echo "xmlPathFileName ".$xmlPathFileName;

$slatesxml = simplexml_load_file($xmlPathFileName) or die ("Unable to load XML file!");
//echo("slatesxml ".$slatesxml);
//echo("slatesxml preference ".$slatesxml->preferences->preference);
// e.g. true

$firstName = $slatesxml['firstName'];
//echo(" firstName ".$firstName);
// e.g. Tom

$accountId = $slatesxml['accountId'];
if ($account == 0) {
	$account = $accountId;
}
//echo(" account ".$account);
// e.g. 1

deleteRows($account);

populatePreferences($slatesxml, $account);

populatePortions($slatesxml, $account);

populatePlates($slatesxml, $account);

// access XML slate data
$slates = array();
  	
  	foreach($slatesxml->slates->slate as $slate) {
	$slateId = $slate['id'];
	$slateName = $slate['name'];
	$slateDow = $slate['dow'];
	//echo " slate name ".$slateName;
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
			$portionList[] = new Portions($portionName, $portionType);
		}
		$p = new Plates($plateName, $plateType, $plateDescription, $portionList);
		$plateList[] = $p;
	}
	//$s = new Slate($slateId, $slateName, $plateList);
	$s = new Slates($slateId, $slateName, $slateDow, $plateList);
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
usort($slates, array("Slates", "cmp_obj"));

// populate slate and food tables backing up the respective client data
//echo " populateSlates ";
	$portion = new Portion( array( 
    "memberid" => $account
  	) );
  	$portionMap = $portion->getPortionMapByMember();
	$plate = new Plate( array( 
    "memberid" => $account
  	) );
  	$plateMap = $plate->getPlateMapByMember();
//foreach($slates as $s) {
foreach($slates as $s) {
	//outputSlate($pdf, $s);
	// for debug...
	//$s->showDetails();
	//$slateInfo = $slate->getName()." (".$slate->getDow().")";
	$date = $s->getName();
	$dateName = $s->getDow();
	$slate = new Slate( array( 
    "memberid" => $account,
    "date" => $date,
    "name" => $dateName,
    "description" => "",
    "breakfastid" => 0,
    "lunchid" => 0,
    "dinnerid" => 0,
    "isinactive" => 0
		  ) );
	$slate->insert();
	// tjs 120208
	//$slateId = $slate->getValue('id');
	$slateId = $slate->getLastId();
	//echo " slateId ".$slateId;	
	//$pdf->Cell(0,30,$slateInfo,'B');
	$breakfastId = 0;
	$lunchId = 0;
	$dinnerId = 0;
	$plates = $s->getPlates();
	//$plateLine = "plate:_________________";
	foreach ($plates as $plate) {
		//echo "plate name ".$plate->getName();
		//$plateLine = sprintf("%s %s %s", $plate->getType(), $plate->getName(), $plate->getDescription());
		$plateName = $plate->getName();
		$plateType = $plate->getType();
		//echo " plateType ".$plateType." plate name ".$plateName;	
		$plateId = $plateMap[(string) $plateName];
		//echo " plateId ".$plateId;	
		if ($plateType == "Breakfast") {
			//$slate->data['breakfastId'] = $plateId;
			$breakfastId = $plateId;
		} else if ($plateType == "Lunch") {
			//$slate->data['lunchId'] = $plateId;
			$lunchId = $plateId;
		} else if ($plateType == "Dinner") {
			//$slate->data['dinnerId'] = $plateId;
			$dinnerId = $plateId;
		}
		// for debug		
		//echo "slate name".$slate->getName()." plate info: ".$plateLine;
		
		//$pdf->SetFont('Arial','',12);
		//$pdf->Cell(0,5,$plateLine,0,1,'R');
		$portions = $plate->getPortions();
		usort($portions, array("Portions", "cmp_obj"));
		//$portionsCount = count($portions);
		//$portionLine = "";
		//$portionLine = $portionsCount;
		//$lastType = "";
		//$lastLCType = "";
		//echo "lastType ".$lastType." line ".$portionLine;		
		foreach ( $portions as $portion) {
			$portionType = $portion->getType();
			$portionName = $portion->getName();
			//echo " portionType ".$portionType." portion name ".$portionName;	
			$portionId = $portionMap[(string) $portionName];
			//echo " portionId ".$portionId;	
			// tjs 120209
			$food = new Food( array( 
    "memberid" => $account,
    "slateid" => $slateId,
	"type" => $plateType,
    "portionid" => $portionId,
    "ismaster" => 0,
    "isinactive" => 0
		  ) );
	$food->insert();
			/*
			if ($lastLCType == "") {
				$lastLCType = strtolower($portionType);
				$lastType = $portionType;
			}
			if (strtolower($portionType) != $lastLCType) {
				$portionLine .= "(".$lastType.")";
				$lastLCType = strtolower($portionType);
				$lastType = $portionType;
			}
			$portionLine .= " ".$portion->getName()." ";
			*/			
		}
	//$slate->update();
		$slate = new Slate( array( 
    "id" => $slateId,
    "memberid" => $account,
    "date" => $date,
    "name" => $dateName,
    "description" => "",
	"breakfastid" => $breakfastId,
    "lunchid" => $lunchId,
    "dinnerid" => $dinnerId
		  ) );
	$slate->update();
		
		//$portionLine .= "(".$lastType.")";
		
		//echo "slate name".$slate->getName()." portion info: ".$portionLine;
		//$pdf->SetFont('Arial','',10);
		//$pdf->Cell(0,5,$portionLine,0,1,'R');
	}
	
}

?> 


