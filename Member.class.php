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

//require_once "DataObject.class.php";
require_once "../plateslate/DataObject.class.php";

date_default_timezone_set ( "America/New_York" );

class Member extends DataObject {

  protected $data = array(
    "id" => "",
    "username" => "",
    "password" => "",
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
    "isInactive" => ""
  );

// tjs 101012
// "favoriteGenre" => "",

//	primarySkillArea	ENUM( 'accounting', 'administration', 'architecture', 'art',
// 'clergy', 'contracting', 'culinary', 'education', 'engineering', 'health',
// 'labor', 'legal', 'management', 'music', 'politics', 'professional', 'retailing',
// 'software', 'trades', 'other' ) NOT NULL,
/*
 * tjs 120220	
  private $_skills = array(
    "accounting" => "Accounting",
    "administration" => "Administration",
    "architecture" => "Architecture",
    "art" => "Art",
    "clergy" => "Clergy",
    "contracting" => "Contracting",
    "culinary" => "Culinary",
    "education" => "Education",
    "engineering" => "Engineering",
    "health" => "Health",
    "labor" => "Labor",
    "legal" => "Legal",
    "management" => "Management",
    "music" => "Music",
    "politics" => "Politics",
    "professional" => "Professional",
    "retailing" => "Retailing",
    "software" => "Software",
    "trades" => "Trades",
    "other" => "Other"
  );
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
    $sql = "SELECT SQL_CALC_FOUND_ROWS * FROM " . TBL_MEMBERS . " ORDER BY $order LIMIT :startRow, :numRows";

    try {
      $st = $conn->prepare( $sql );
      $st->bindValue( ":startRow", $startRow, PDO::PARAM_INT );
      $st->bindValue( ":numRows", $numRows, PDO::PARAM_INT );
      $st->execute();
      $members = array();
      foreach ( $st->fetchAll() as $row ) {
        $members[] = new Member( $row );
      }
      $st = $conn->query( "SELECT found_rows() as totalRows" );
      $row = $st->fetch();
      parent::disconnect( $conn );
      return array( $members, $row["totalRows"] );
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
    $sql = "SELECT * FROM " . TBL_MEMBERS . " WHERE emailAddress = :emailAddress";

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
    return ( $this->_skills[$this->data["primarySkillArea"]] );
  }

  public function getSkills() {
    return $this->_skills;
  }

  public function insert() {
    $conn = parent::connect();
    $sql = "INSERT INTO " . TBL_MEMBERS . " (
              username,
              password,
              firstName,
              lastName,
              joinDate,
              gender,
              primarySkillArea,
              emailAddress,
              otherSkills,
			cumDonationsForSites,
			lastDonationMadeOn,
			lastDonationForSite,
			lastLoginDate,
			permissionForSite,
			isSelectableForSite,
			passwordMnemonicQuestion,
			passwordMnemonicAnswer,
			isInactive
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
      $st->bindValue( ":firstName", $this->data["firstName"], PDO::PARAM_STR );
      $st->bindValue( ":lastName", $this->data["lastName"], PDO::PARAM_STR );
      $st->bindValue( ":joinDate", $this->data["joinDate"], PDO::PARAM_STR );
      $st->bindValue( ":gender", $this->data["gender"], PDO::PARAM_STR );
      $st->bindValue( ":primarySkillArea", $this->data["primarySkillArea"], PDO::PARAM_STR );
      $st->bindValue( ":emailAddress", $this->data["emailAddress"], PDO::PARAM_STR );
      $st->bindValue( ":otherSkills", $this->data["otherSkills"], PDO::PARAM_STR );
      $st->bindValue( ":cumDonationsForSites", $this->data["cumDonationsForSites"], PDO::PARAM_STR );
      $st->bindValue( ":lastDonationMadeOn", $this->data["lastDonationMadeOn"], PDO::PARAM_STR );
      $st->bindValue( ":lastDonationForSite", $this->data["lastDonationForSite"], PDO::PARAM_STR );
      $st->bindValue( ":lastLoginDate", $this->data["lastLoginDate"], PDO::PARAM_STR );
      $st->bindValue( ":permissionForSite", $this->data["permissionForSite"], PDO::PARAM_STR );
      $st->bindValue( ":isSelectableForSite", $this->data["isSelectableForSite"], PDO::PARAM_STR );
      $st->bindValue( ":passwordMnemonicQuestion", $this->data["passwordMnemonicQuestion"], PDO::PARAM_STR );
      $st->bindValue( ":passwordMnemonicAnswer", $this->data["passwordMnemonicAnswer"], PDO::PARAM_STR );
      $st->bindValue( ":isInactive", $this->data["isInactive"], PDO::PARAM_STR );
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
              firstName = :firstName,
              lastName = :lastName,
              joinDate = :joinDate,
              gender = :gender,
              primarySkillArea = :primarySkillArea,
              emailAddress = :emailAddress,
              otherSkills = :otherSkills,
              cumDonationsForSites = :cumDonationsForSites,
              lastDonationMadeOn = :lastDonationMadeOn,
              lastDonationForSite = :lastDonationForSite,
              lastLoginDate = :lastLoginDate,
              permissionForSite = :permissionForSite,
              isSelectableForSite = :isSelectableForSite,
              passwordMnemonicQuestion = :passwordMnemonicQuestion,
              passwordMnemonicAnswer = :passwordMnemonicAnswer,
              isInactive = :isInactive
            WHERE id = :id";

    try {
      $st = $conn->prepare( $sql );
      $st->bindValue( ":id", $this->data["id"], PDO::PARAM_INT );
      $st->bindValue( ":username", $this->data["username"], PDO::PARAM_STR );
      if ( $this->data["password"] ) $st->bindValue( ":password", $this->data["password"], PDO::PARAM_STR );
      $st->bindValue( ":firstName", $this->data["firstName"], PDO::PARAM_STR );
      $st->bindValue( ":lastName", $this->data["lastName"], PDO::PARAM_STR );
      $st->bindValue( ":joinDate", $this->data["joinDate"], PDO::PARAM_STR );
      $st->bindValue( ":gender", $this->data["gender"], PDO::PARAM_STR );
      $st->bindValue( ":primarySkillArea", $this->data["primarySkillArea"], PDO::PARAM_STR );
      $st->bindValue( ":emailAddress", $this->data["emailAddress"], PDO::PARAM_STR );
      $st->bindValue( ":otherSkills", $this->data["otherSkills"], PDO::PARAM_STR );
      $st->bindValue( ":cumDonationsForSites", $this->data["cumDonationsForSites"], PDO::PARAM_STR );
      $st->bindValue( ":lastDonationMadeOn", $this->data["lastDonationMadeOn"], PDO::PARAM_STR );
      $st->bindValue( ":lastDonationForSite", $this->data["lastDonationForSite"], PDO::PARAM_STR );
      $st->bindValue( ":lastLoginDate", $this->data["lastLoginDate"], PDO::PARAM_STR );
      $st->bindValue( ":permissionForSite", $this->data["permissionForSite"], PDO::PARAM_STR );
      $st->bindValue( ":isSelectableForSite", $this->data["isSelectableForSite"], PDO::PARAM_STR );
      $st->bindValue( ":passwordMnemonicQuestion", $this->data["passwordMnemonicQuestion"], PDO::PARAM_STR );
      $st->bindValue( ":passwordMnemonicAnswer", $this->data["passwordMnemonicAnswer"], PDO::PARAM_STR );
      $st->bindValue( ":isInactive", $this->data["isInactive"], PDO::PARAM_STR );
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
    $sql = "SELECT * FROM " . TBL_MEMBERS . " WHERE username = :username AND password = password(:password)";

    try {
      $st = $conn->prepare( $sql );
      $st->bindValue( ":username", $this->data["username"], PDO::PARAM_STR );
      $st->bindValue( ":password", $this->data["password"], PDO::PARAM_STR );
      $st->execute();
      $row = $st->fetch();
      //tjs110307
      //parent::disconnect( $conn );
      //if ( $row ) return new Member( $row );
      $today = date("Y-m-d");
	  if ( $row ) {
	  	$member = new Member( $row );
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
	  parent::disconnect( $conn );
    } catch ( PDOException $e ) {
      parent::disconnect( $conn );
      die( "Query failed: " . $e->getMessage() );
    }
  }

}

?>
