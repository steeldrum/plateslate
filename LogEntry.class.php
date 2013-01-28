<?php
/***************************************
$Revision:: 124                        $: Revision of last commit
$LastChangedBy::                       $: Author of last commit
$LastChangedDate:: 2011-08-29 16:21:00#$: Date of last commit
***************************************/
/*
plateslate/
LogEntry.class.php
tjs 110823

file version 1.00 

*/

require_once "DataObject.class.php";
// tjs 130128
//require_once "../plateslate/DataObject.class.php";
//require_once "./DataObject.class.php";

class LogEntry extends DataObject {

  protected $data = array(
    "memberId" => "",
    "pageUrl" => "",
    "numVisits" => "",
    "lastAccess" => ""
  );

  public static function getLogEntries( $memberId ) {
    $conn = parent::connect();
    $sql = "SELECT * FROM " . TBL_ACCESS_LOG . " WHERE memberId = :memberId ORDER BY lastAccess DESC";

    try {
      $st = $conn->prepare( $sql );
      $st->bindValue( ":memberId", $memberId, PDO::PARAM_INT );
      $st->execute();
      $logEntries = array();
      foreach ( $st->fetchAll() as $row ) {
        $logEntries[] = new LogEntry( $row );
      }
      parent::disconnect( $conn );
      return $logEntries;
    } catch ( PDOException $e ) {
      parent::disconnect( $conn );
      die( "Query failed: " . $e->getMessage() );
    }
  }

  public function record() {
    $conn = parent::connect();
    $sql = "SELECT * FROM " . TBL_ACCESS_LOG . " WHERE memberId = :memberId AND pageUrl = :pageUrl";

    try {
      $st = $conn->prepare( $sql );
      $st->bindValue( ":memberId", $this->data["memberId"], PDO::PARAM_INT );
      $st->bindValue( ":pageUrl", $this->data["pageUrl"], PDO::PARAM_STR );
      $st->execute();

      if ( $st->fetch() ) {
        $sql = "UPDATE " . TBL_ACCESS_LOG . " SET numVisits = numVisits + 1 WHERE memberId = :memberId AND pageUrl = :pageUrl";
        $st = $conn->prepare( $sql );
        $st->bindValue( ":memberId", $this->data["memberId"], PDO::PARAM_INT );
        $st->bindValue( ":pageUrl", $this->data["pageUrl"], PDO::PARAM_STR );
        $st->execute();
      } else {
        $sql = "INSERT INTO " . TBL_ACCESS_LOG . " ( memberId, pageUrl, numVisits ) VALUES ( :memberId, :pageUrl, 1 )";
        $st = $conn->prepare( $sql );
        $st->bindValue( ":memberId", $this->data["memberId"], PDO::PARAM_INT );
        $st->bindValue( ":pageUrl", $this->data["pageUrl"], PDO::PARAM_STR );
        $st->execute();
      }

      parent::disconnect( $conn );
    } catch ( PDOException $e ) {
      parent::disconnect( $conn );
      die( "Query failed: " . $e->getMessage() );
    }
  }

  public static function deleteAllForMember( $memberId ) {
    $conn = parent::connect();
    $sql = "DELETE FROM " . TBL_ACCESS_LOG . " WHERE memberId = :memberId";

    try {
      $st = $conn->prepare( $sql );
      $st->bindValue( ":memberId", $memberId, PDO::PARAM_INT );
      $st->execute();
      parent::disconnect( $conn );
    } catch ( PDOException $e ) {
      parent::disconnect( $conn );
      die( "Query failed: " . $e->getMessage() );
    }
  }

}

?>
