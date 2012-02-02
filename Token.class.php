<?php
/***************************************
$Revision::                            $: Revision of last commit
$LastChangedBy::                       $: Author of last commit
$LastChangedDate::                     $: Date of last commit
***************************************/
/*
plateslate/
Token.class.php
tjs 120202

file version 1.00 

release version 1.00
*/
/*
FYI
  `id` smallint(5) unsigned NOT NULL AUTO_INCREMENT,
  `emailAddress` varchar(50) NOT NULL,
  `token` varchar(16) NOT NULL,
  `memberId` smallint(5) DEFAULT NULL,
  `expirationDate` timestamp DEFAULT NULL,
  `payment` float DEFAULT NULL,
  `paymentDate` timestamp DEFAULT NULL,
  `totalPayments` float DEFAULT NULL,
  `numLogins` mediumint(9) NOT NULL,
  `lastAccess` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `isCollaborator` tinyint(4) DEFAULT NULL,
  `isAggregateAnalyst` tinyint(4) DEFAULT NULL,
  `isInactive` tinyint(4) DEFAULT NULL,
*/

require_once "DataObject.class.php";

date_default_timezone_set ( "America/New_York" );

class Token extends DataObject {

  protected $data = array(
    "id" => "",
    "emailAddress" => "",
    "token" => "",
    "memberId" => "",
    "expirationDate" => "",
    "payment" => "",
    "paymentDate" => "",
    "totalPayments" => "",
    "numLogins" => "",
    "lastAccess" => "",
    "isCollaborator" => "",
    "isAggregateAnalyst" => "",
    "isDemo" => "",
    "isTest" => "",
    "isInactive" => ""
  );

  public static function getTokens( $startRow, $numRows, $order ) {
    $conn = parent::connect();
    $sql = "SELECT SQL_CALC_FOUND_ROWS * FROM " . TBL_TOKENS . " ORDER BY $order LIMIT :startRow, :numRows";

    try {
      $st = $conn->prepare( $sql );
      $st->bindValue( ":startRow", $startRow, PDO::PARAM_INT );
      $st->bindValue( ":numRows", $numRows, PDO::PARAM_INT );
      $st->execute();
      $tokens = array();
      foreach ( $st->fetchAll() as $row ) {
        $tokens[] = new Token( $row );
      }
      $st = $conn->query( "SELECT found_rows() as totalRows" );
      $row = $st->fetch();
      parent::disconnect( $conn );
      return array( $tokens, $row["totalRows"] );
    } catch ( PDOException $e ) {
      parent::disconnect( $conn );
      die( "Query failed: " . $e->getMessage() );
    }
  }

  public static function getToken( $id ) {
    $conn = parent::connect();
    $sql = "SELECT * FROM " . TBL_TOKENS . " WHERE id = :id";

    try {
      $st = $conn->prepare( $sql );
      $st->bindValue( ":id", $id, PDO::PARAM_INT );
      $st->execute();
      $row = $st->fetch();
      parent::disconnect( $conn );
      if ( $row ) return new Token( $row );
    } catch ( PDOException $e ) {
      parent::disconnect( $conn );
      die( "Query failed: " . $e->getMessage() );
    }
  }

  public static function getByEmailAddress( $emailAddress ) {
    $conn = parent::connect();
    $sql = "SELECT * FROM " . TBL_TOKENS . " WHERE emailAddress = :emailAddress";

    try {
      $st = $conn->prepare( $sql );
      $st->bindValue( ":emailAddress", $emailAddress, PDO::PARAM_STR );
      $st->execute();
      $row = $st->fetch();
      parent::disconnect( $conn );
      if ( $row ) return new Token( $row );
    } catch ( PDOException $e ) {
      parent::disconnect( $conn );
      die( "Query failed: " . $e->getMessage() );
    }
  }

  public function insert() {
    $conn = parent::connect();
    $sql = "INSERT INTO " . TBL_TOKENS . " (
              emailAddress,
              token,
			memberId,
			expirationDate,
			payment,
			paymentDate,
			totalPayments,
			numLogins,
			lastAccess,
			isCollaborator,
			isAggregateAnalyst,
			isDemo,
			isTest,
			isInactive
            ) VALUES (
              :emailAddress,
              :token,
			:memberId,
			:expirationDate,
			:payment,
			:paymentDate,
			:totalPayments,
			:numLogins,
			:lastAccess,
			:isCollaborator,
			:isAggregateAnalyst,
			:isDemo,
			:isTest,
			:isInactive
             )";

    try {
      $st = $conn->prepare( $sql );
      $st->bindValue( ":emailAddress", $this->data["emailAddress"], PDO::PARAM_STR );
      $st->bindValue( ":token", $this->data["token"], PDO::PARAM_STR );
      $st->bindValue( ":memberId", $this->data["memberId"], PDO::PARAM_STR );
      $st->bindValue( ":expirationDate", $this->data["expirationDate"], PDO::PARAM_STR );
      $st->bindValue( ":payment", $this->data["payment"], PDO::PARAM_STR );
      $st->bindValue( ":paymentDate", $this->data["paymentDate"], PDO::PARAM_STR );
      $st->bindValue( ":totalPayments", $this->data["totalPayments"], PDO::PARAM_STR );
      $st->bindValue( ":numLogins", $this->data["numLogins"], PDO::PARAM_STR );
      $st->bindValue( ":lastAccess", $this->data["lastAccess"], PDO::PARAM_STR );
      $st->bindValue( ":isCollaborator", $this->data["isCollaborator"], PDO::PARAM_STR );
      $st->bindValue( ":isAggregateAnalyst", $this->data["isAggregateAnalyst"], PDO::PARAM_STR );
      $st->bindValue( ":isDemo", $this->data["isDemo"], PDO::PARAM_STR );
      $st->bindValue( ":isTest", $this->data["isTest"], PDO::PARAM_STR );
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
    $sql = "UPDATE " . TBL_TOKENS . " SET
              emailAddress = :emailAddress,
              token = :token,
              memberId = :memberId,
              expirationDate = :expirationDate,
              payment = :payment,
              paymentDate = :paymentDate,
              totalPayments = :totalPayments,
              numLogins = :numLogins,
              lastAccess = :lastAccess,
              isCollaborator = :isCollaborator,
              isAggregateAnalyst = :isAggregateAnalyst,
              isDemo = :isDemo,
              isTest = :isTest,
              isInactive = :isInactive
            WHERE id = :id";

    try {
      $st = $conn->prepare( $sql );
      $st->bindValue( ":id", $this->data["id"], PDO::PARAM_INT );
      $st->bindValue( ":emailAddress", $this->data["emailAddress"], PDO::PARAM_STR );
      $st->bindValue( ":token", $this->data["token"], PDO::PARAM_STR );
      $st->bindValue( ":memberId", $this->data["memberId"], PDO::PARAM_STR );
      $st->bindValue( ":expirationDate", $this->data["expirationDate"], PDO::PARAM_STR );
      $st->bindValue( ":payment", $this->data["payment"], PDO::PARAM_STR );
      $st->bindValue( ":paymentDate", $this->data["paymentDate"], PDO::PARAM_STR );
      $st->bindValue( ":totalPayments", $this->data["totalPayments"], PDO::PARAM_STR );
      $st->bindValue( ":numLogins", $this->data["numLogins"], PDO::PARAM_STR );
      $st->bindValue( ":lastAccess", $this->data["lastAccess"], PDO::PARAM_STR );
      $st->bindValue( ":isCollaborator", $this->data["isCollaborator"], PDO::PARAM_STR );
      $st->bindValue( ":isAggregateAnalyst", $this->data["isAggregateAnalyst"], PDO::PARAM_STR );
      $st->bindValue( ":isDemo", $this->data["isDemo"], PDO::PARAM_STR );
      $st->bindValue( ":isTest", $this->data["isTest"], PDO::PARAM_STR );
      $st->bindValue( ":isInactive", $this->data["isInactive"], PDO::PARAM_STR );
      $st->execute();
      parent::disconnect( $conn );
    } catch ( PDOException $e ) {
      parent::disconnect( $conn );
      die( "Query failed: " . $e->getMessage() );
    }
  }

/*
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
  */
  
  public function delete() {
    $conn = parent::connect();
    $sql = "DELETE FROM " . TBL_TOKENS . " WHERE id = :id";

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

/*
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
*/
  
}

?>
