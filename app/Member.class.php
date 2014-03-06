<?php
/***************************************
$Revision:: 124                        $: Revision of last commit
$LastChangedBy::                       $: Author of last commit
$LastChangedDate:: 2011-08-29 16:21:00#$: Date of last commit
***************************************/
/*
plateslate/
Member.class.php
tjs 110823

file version 1.00 
*/

require_once "DataObject.class.php";
// tjs 130128
//require_once "../plateslate/DataObject.class.php";
//require_once "DataObject.class.php";
//require_once "../PlateSlate/DataObject.class.php";
//require_once "./DataObject.class.php";

date_default_timezone_set ( "America/New_York" );

class Member extends DataObject {

  protected $data = array(
    "id" => "",
    "username" => "",
    "password" => "",
  /* tjs 131112
    "firstName" => "",
    "lastName" => "",
    "joinDate" => "",
    "gender" => "",
    "primarySkillArea" => "",
    "emailAddress" => "",
    "otherSkills" => "",
    "cumDonationsForSites" => "",
    "lastDonationMadeOn" => "",
    "lastDonationForSite" => "",
    "lastLoginDate" => "",
    "permissionForSite" => "",
    "isSelectableForSite" => "",
    "passwordMnemonicQuestion" => "",
    "passwordMnemonicAnswer" => "",
    "isInactive" => ""*/
     "firstname" => "",
    "lastname" => "",
    "joindate" => "",
    "gender" => "",
    "primaryskillarea" => "",
    "emailaddress" => "",
    "otherskills" => "",
    "cumdonationsforsites" => "",
    "lastdonationmadeon" => "",
    "lastdonationforsite" => "",
    "lastlogindate" => "",
    "permissionforsite" => "",
    "isselectableforsite" => "",
    "passwordmnemonicquestion" => "",
    "passwordmnemonicanswer" => "",
    "isinactive" => ""
  );

// tjs 101012
// "favoriteGenre" => "",

//	primarySkillArea	ENUM( 'aahfInfo','africanAmerican','american','brazilian','cajun','caribbean','chinese','elderly',
//'french','german','greek','indian','irish','italian','japanese','jewish','mexican','middleEast','multinational',
//'nativeAmerican','polish','portuguese','russian','southern','thai','texmex','vegetarian','other' ) NOT NULL,
/*
 * tjs 120220	
*/
   private $_skills = array(
    "aahfInfo" => "AAH Food!",
    "africanAmerican" => "African American",
    "american" => "American",
    "brazilian" => "Brazilian",
    "cajun" => "Cajun",
    "caribbean" => "Caribbean",
    "chinese" => "Chinese",
    "elderly" => "Elderly",
    "french" => "French",
    "german" => "German", 
    "greek" => "Greek",
    "indian" => "Indian",
    "irish" => "Irish",
    "italian" => "Italian",
    "japanese" => "Japanese",
    "jewish" => "Jewish",
    "mexican" => "Mexican",
    "middleEast" => "Middle East",
    "multinational" => "Multinational",
    "nativeAmerican" => "Native American",
    "polish" => "Polish",
    "portuguese" => "Portuguese",
    "russian" => "Russian",
    "southern" => "Southern",
    "thai" => "Thai",
    "texmex" => "Texmex",
    "vegetarian" => "Vegetarian",
    "other" => "Other"
  );
  
  public static function getMembers( $startRow, $numRows, $order ) {
    $conn = parent::connect();
    // tjs 131112
    //$sql = "SELECT SQL_CALC_FOUND_ROWS * FROM " . TBL_MEMBERS . " ORDER BY $order LIMIT :startRow, :numRows";
    $sql = "SELECT * FROM " . TBL_MEMBERS . " ORDER BY $order OFFSET :startRow LIMIT :numRows";
    $rowCount = 0;
    
    try {
      $st = $conn->prepare( $sql );
      $st->bindValue( ":startRow", $startRow, PDO::PARAM_INT );
      $st->bindValue( ":numRows", $numRows, PDO::PARAM_INT );
      $st->execute();
      $members = array();
      foreach ( $st->fetchAll() as $row ) {
        $members[] = new Member( $row );
        // tjs 131112
        $rowCount++;
      }
      //$st = $conn->query( "SELECT found_rows() as totalRows" );
      //$row = $st->fetch();
      parent::disconnect( $conn );
      //return array( $members, $row["totalRows"] );
      return array( $members, $rowCount );
    } catch ( PDOException $e ) {
      parent::disconnect( $conn );
      die( "Query failed: " . $e->getMessage() );
    }
  }

  public static function getMember( $id ) {
    $conn = parent::connect();
    $sql = "SELECT * FROM " . TBL_MEMBERS . " WHERE id = :id";

    try {
      $st = $conn->prepare( $sql );
      $st->bindValue( ":id", $id, PDO::PARAM_INT );
      $st->execute();
      $row = $st->fetch();
      parent::disconnect( $conn );
      if ( $row ) return new Member( $row );
    } catch ( PDOException $e ) {
      parent::disconnect( $conn );
      die( "Query failed: " . $e->getMessage() );
    }
  }

  public static function getByUsername( $username ) {
    $conn = parent::connect();
    $sql = "SELECT * FROM " . TBL_MEMBERS . " WHERE username = :username";

    try {
      $st = $conn->prepare( $sql );
      $st->bindValue( ":username", $username, PDO::PARAM_STR );
      $st->execute();
      $row = $st->fetch();
      parent::disconnect( $conn );
      if ( $row ) return new Member( $row );
    } catch ( PDOException $e ) {
      parent::disconnect( $conn );
      die( "Query failed: " . $e->getMessage() );
    }
  }

  public static function getByEmailAddress( $emailAddress ) {
    $conn = parent::connect();
    // tjs 140303
   // $sql = "SELECT * FROM " . TBL_MEMBERS . " WHERE emailAddress = :emailAddress";
    $sql = "SELECT * FROM " . TBL_MEMBERS . " WHERE emailaddress = :emailAddress";

    try {
      $st = $conn->prepare( $sql );
      $st->bindValue( ":emailAddress", $emailAddress, PDO::PARAM_STR );
      $st->execute();
      $row = $st->fetch();
      parent::disconnect( $conn );
      if ( $row ) return new Member( $row );
    } catch ( PDOException $e ) {
      parent::disconnect( $conn );
      die( "Query failed: " . $e->getMessage() );
    }
  }

  public function getGenderString() {
    return ( $this->data["gender"] == "f" ) ? "Female" : "Male";
  }

  //public function getFavoriteGenreString() {
  public function getPrimarySkillAreaString() {
    //return ( $this->_skills[$this->data["primarySkillArea"]] );
  	return ( $this->_skills[$this->data["primaryskillarea"]] );
  }

  public function getSkills() {
    return $this->_skills;
  }

  // tjs 120221
  public static function getByPrimarySkillArea( $primarySkillArea ) {
    $conn = parent::connect();
    //$sql = "SELECT * FROM " . TBL_MEMBERS . " WHERE primarySkillArea = :primarySkillArea";
    $sql = "SELECT * FROM " . TBL_MEMBERS . " WHERE primaryskillarea = :primarySkillArea";

    try {
      $st = $conn->prepare( $sql );
      $st->bindValue( ":primarySkillArea", $primarySkillArea, PDO::PARAM_STR );
      $st->execute();
      $members = array();
    $rowCount = 0;
      foreach ( $st->fetchAll() as $row ) {
        $members[] = new Member( $row );
        $rowCount++;
      }
     // $st = $conn->query( "SELECT found_rows() as totalRows" );
      //$row = $st->fetch();
      parent::disconnect( $conn );
      //return array( $members, $row["totalRows"] );
      return array( $members, $rowCount);
      } catch ( PDOException $e ) {
      parent::disconnect( $conn );
      die( "Query failed: " . $e->getMessage() );
    }
  }
  
  public function insert() {
    $conn = parent::connect();
    $sql = "INSERT INTO " . TBL_MEMBERS . " (
              username,
              password,
              firstname,
              lastname,
              joindate,
              gender,
              primaryskillarea,
              emailaddress,
              otherskills,
			cumdonationsforsites,
			lastdonationmadeon,
			lastdonationforsite,
			lastlogindate,
			permissionforsite,
			isselectableforsite,
			passwordmnemonicquestion,
			passwordmnemonicanswer,
			isinactive
                          ) VALUES (
              :username,
              password(:password),
              :firstName,
              :lastName,
              :joinDate,
              :gender,
              :primarySkillArea,
              :emailAddress,
              :otherSkills,
			:cumDonationsForSites,
			:lastDonationMadeOn,
			:lastDonationForSite,
			:lastLoginDate,
			:permissionForSite,
			:isSelectableForSite,
			:passwordMnemonicQuestion,
			:passwordMnemonicAnswer,
			:isInactive
             )";

    try {
      $st = $conn->prepare( $sql );
      $st->bindValue( ":username", $this->data["username"], PDO::PARAM_STR );
      $st->bindValue( ":password", $this->data["password"], PDO::PARAM_STR );
      $st->bindValue( ":firstName", $this->data["firstname"], PDO::PARAM_STR );
      $st->bindValue( ":lastName", $this->data["lastname"], PDO::PARAM_STR );
      $st->bindValue( ":joinDate", $this->data["joindate"], PDO::PARAM_STR );
      $st->bindValue( ":gender", $this->data["gender"], PDO::PARAM_STR );
      $st->bindValue( ":primarySkillArea", $this->data["primaryskillarea"], PDO::PARAM_STR );
      $st->bindValue( ":emailAddress", $this->data["emailaddress"], PDO::PARAM_STR );
      $st->bindValue( ":otherSkills", $this->data["otherskills"], PDO::PARAM_STR );
      $st->bindValue( ":cumDonationsForSites", $this->data["cumdonationsforsites"], PDO::PARAM_STR );
      $st->bindValue( ":lastDonationMadeOn", $this->data["lastdonationmadeon"], PDO::PARAM_STR );
      $st->bindValue( ":lastDonationForSite", $this->data["lastdonationforsite"], PDO::PARAM_STR );
      $st->bindValue( ":lastLoginDate", $this->data["lastlogindate"], PDO::PARAM_STR );
      $st->bindValue( ":permissionForSite", $this->data["permissionforsite"], PDO::PARAM_STR );
      $st->bindValue( ":isSelectableForSite", $this->data["isselectableforsite"], PDO::PARAM_STR );
      $st->bindValue( ":passwordMnemonicQuestion", $this->data["passwordmnemonicquestion"], PDO::PARAM_STR );
      $st->bindValue( ":passwordMnemonicAnswer", $this->data["passwordmnemonicanswer"], PDO::PARAM_STR );
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
    $passwordSql = $this->data["password"] ? "password = password(:password)," : "";
    $sql = "UPDATE " . TBL_MEMBERS . " SET
              username = :username,
              $passwordSql
              firstname = :firstName,
              lastname = :lastName,
              joindate = :joinDate,
              gender = :gender,
              primaryskillarea = :primarySkillArea,
              emailaddress = :emailAddress,
              otherskills = :otherSkills,
              cumdonationsforsites = :cumDonationsForSites,
              lastdonationmadeon = :lastDonationMadeOn,
              lastdonationforsite = :lastDonationForSite,
              lastlogindate = :lastLoginDate,
              permissionforsite = :permissionForSite,
              isselectableforsite = :isSelectableForSite,
              passwordmnemonicquestion = :passwordMnemonicQuestion,
              passwordmnemonicanswer = :passwordMnemonicAnswer,
              isinactive = :isInactive
            WHERE id = :id";

    try {
      $st = $conn->prepare( $sql );
      $st->bindValue( ":id", $this->data["id"], PDO::PARAM_INT );
      $st->bindValue( ":username", $this->data["username"], PDO::PARAM_STR );
      if ( $this->data["password"] ) $st->bindValue( ":password", $this->data["password"], PDO::PARAM_STR );
      $st->bindValue( ":firstName", $this->data["firstname"], PDO::PARAM_STR );
      $st->bindValue( ":lastName", $this->data["lastname"], PDO::PARAM_STR );
      $st->bindValue( ":joinDate", $this->data["joindate"], PDO::PARAM_STR );
      $st->bindValue( ":gender", $this->data["gender"], PDO::PARAM_STR );
      $st->bindValue( ":primarySkillArea", $this->data["primaryskillarea"], PDO::PARAM_STR );
      $st->bindValue( ":emailAddress", $this->data["emailaddress"], PDO::PARAM_STR );
      $st->bindValue( ":otherSkills", $this->data["otherskills"], PDO::PARAM_STR );
      $st->bindValue( ":cumDonationsForSites", $this->data["cumdonationsforsites"], PDO::PARAM_STR );
      $st->bindValue( ":lastDonationMadeOn", $this->data["lastdonationmadeon"], PDO::PARAM_STR );
      $st->bindValue( ":lastDonationForSite", $this->data["lastdonationforsite"], PDO::PARAM_STR );
      $st->bindValue( ":lastLoginDate", $this->data["lastlogindate"], PDO::PARAM_STR );
      $st->bindValue( ":permissionForSite", $this->data["permissionforsite"], PDO::PARAM_STR );
      $st->bindValue( ":isSelectableForSite", $this->data["isselectableforsite"], PDO::PARAM_STR );
      $st->bindValue( ":passwordMnemonicQuestion", $this->data["passwordmnemonicquestion"], PDO::PARAM_STR );
      $st->bindValue( ":passwordMnemonicAnswer", $this->data["passwordmnemonicanswer"], PDO::PARAM_STR );
      $st->bindValue( ":isInactive", $this->data["isinactive"], PDO::PARAM_STR );
      $st->execute();
      parent::disconnect( $conn );
    } catch ( PDOException $e ) {
      parent::disconnect( $conn );
      die( "Query failed: " . $e->getMessage() );
    }
  }

//tjs110318 
   public function updatePassword( $newPassword ) {
    $conn = parent::connect();
    //$passwordSql = $this->data["password"] ? "password = password(:password)," : "";
    $passwordSql = $newPassword ? "password = password(:password)" : "";
    $sql = "UPDATE " . TBL_MEMBERS . " SET
              $passwordSql
            WHERE id = :id";

    try {
      $st = $conn->prepare( $sql );
      $st->bindValue( ":id", $this->data["id"], PDO::PARAM_INT );
      //if ( $this->data["password"] ) $st->bindValue( ":password", $this->data["password"], PDO::PARAM_STR );
      if ( $newPassword ) $st->bindValue( ":password", $newPassword, PDO::PARAM_STR );
      $st->execute();
      parent::disconnect( $conn );
    } catch ( PDOException $e ) {
      parent::disconnect( $conn );
      die( "Query failed: " . $e->getMessage() );
    }
  }

  //tjs120223 
   public function updatePrimarySkillArea( $newPrimarySkillArea ) {
    $conn = parent::connect();
    //$passwordSql = $this->data["password"] ? "password = password(:password)," : "";
    $primarySkillAreaSql = $newPrimarySkillArea ? "primarySkillArea = :primarySkillArea" : "";
    $sql = "UPDATE " . TBL_MEMBERS . " SET
              $primarySkillAreaSql
            WHERE id = :id";

    try {
      $st = $conn->prepare( $sql );
      $st->bindValue( ":id", $this->data["id"], PDO::PARAM_INT );
      //if ( $this->data["password"] ) $st->bindValue( ":password", $this->data["password"], PDO::PARAM_STR );
      if ( $newPrimarySkillArea ) $st->bindValue( ":primarySkillArea", $newPrimarySkillArea, PDO::PARAM_STR );
      $st->execute();
      parent::disconnect( $conn );
    } catch ( PDOException $e ) {
      parent::disconnect( $conn );
      die( "Query failed: " . $e->getMessage() );
    }
  }
  
  public function delete() {
    $conn = parent::connect();
    $sql = "DELETE FROM " . TBL_MEMBERS . " WHERE id = :id";

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

  public function authenticate() {
    $conn = parent::connect();
    // tjs 131112 kludge pg lacka password function
    //$sql = "SELECT * FROM " . TBL_MEMBERS . " WHERE username = :username AND password = password(:password)";
   $sql = "SELECT * FROM " . TBL_MEMBERS . " WHERE username = :username";
    // tjs 131112
    $password = $this->data["password"];
   //echo "Member authenticate sql $sql password $password";
    try {
      $st = $conn->prepare( $sql );
      $st->bindValue( ":username", $this->data["username"], PDO::PARAM_STR );
      //$st->bindValue( ":password", $this->data["password"], PDO::PARAM_STR );
      $st->execute();
      $row = $st->fetch();
      //tjs110307
      //parent::disconnect( $conn );
      //if ( $row ) return new Member( $row );
      $today = date("Y-m-d");
	  if ( $row ) {
	  	$member = new Member( $row );
	  	// tjs 131112
	  	$torf = trim($member->data["password"]) == trim($password);
	  	if ($torf == 1) {
	  	$sql = "UPDATE " . TBL_MEMBERS . " SET
				  lastLoginDate = :lastLoginDate
				WHERE id = :id";
		  $st = $conn->prepare( $sql );
      		//$st->bindValue( ":id", $member->id, PDO::PARAM_INT );
      		$st->bindValue( ":id", $member->data["id"], PDO::PARAM_INT );
		  $st->bindValue( ":lastLoginDate", $today, PDO::PARAM_STR );
		  $st->execute();
	  	parent::disconnect( $conn );
	  	return $member;
	  	}
	  }
	  parent::disconnect( $conn );
    } catch ( PDOException $e ) {
      parent::disconnect( $conn );
      die( "Query failed: " . $e->getMessage() );
    }
  }

}

?>
