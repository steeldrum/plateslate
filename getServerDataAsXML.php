<?php
/***************************************
$Revision::                            $: Revision of last commit
$LastChangedBy::                       $: Author of last commit
$LastChangedDate::                     $: Date of last commit
***************************************/
/*
plateslate/
getServerDataAsXML.php
tjs 120209

file version 1.00 

release version 1.00
*/
// for test:
//http://localhost/~thomassoucy/plateslate/getServerDataAsXML.php?account=1

date_default_timezone_set ( "America/New_York" );

//$account = $_GET['account'];
$account = 0;
//$maxId = $_GET['maxId'];
//require_once( "common.inc.php" );
require_once( "Member.class.php" );
//tjs 110511 above ensures that config.php has been loaded as well
$username=DB_USERNAME;
$password=DB_PASSWORD;
$database=DB_NAME;

$memberUserName="unknown";
$memberFirstName="unknown";
$memberLastName="unknown";
/*
session_start();
if (isset($_SESSION['member'])) {
	$member = $_SESSION['member'];
	if ($member) {
		$account = $member->getValue( "id" );
		$memberUserName = $member->getValue( "username" );
		$memberFirstName = $member->getValue( "firstname" );
		$memberLastName = $member->getValue( "lastname" );
	}
}
*/
if ($account == 0) {
	$account = $_GET['account'];
}

//echo "account ".$account;
// e.g. account 1

function connect() {
    try {
      $conn = new PDO( DB_DSN, DB_USERNAME, DB_PASSWORD );
      $conn->setAttribute( PDO::ATTR_PERSISTENT, true );
      $conn->setAttribute( PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION );
    } catch ( PDOException $e ) {
      die( "Connection failed: " . $e->getMessage() );
    }

    return $conn;
  }

function disconnect( $conn ) {
    $conn = "";
  }
  
//define("MYSQL_HOST", "localhost");

// tjs 120210
//header('Content-Type: application/xml, charset=utf-8');
header('Content-Type: text/xml, charset=utf-8');
echo '<?xml version="1.0" encoding="utf-8"?>';
//echo "<serverTables database a ".$account;
//echo "<tables accountId=".$account;

// e.g. <tables accountId="1" userName="SteelDrum" firstName="Tom" lastName="Soucy">
echo "<tables accountId=\"".$account."\" userName=\"".$memberUserName."\" firstName=\"".$memberFirstName."\" lastName=\"".$memberLastName."\">"; 

/*
e.g. preferences
<preferences><preference type="user" name="share">true</preference></preferences>
*/
echo '<preferences>';
	  $conn = connect();
	  $sql="SELECT * FROM preference where memberId = :memberId";
	
	try {
      $st = $conn->prepare( $sql );
      $st->bindValue( ":memberId", $account, PDO::PARAM_INT );
      $st->execute();
     // $members = array();
      foreach ( $st->fetchAll() as $row ) {
        //$members[] = new Member( $row );
			$preferenceType=$row['type'];
			$preferenceName=$row['name'];
			$preferenceValue=$row['value'];
		echo '<preference type="'.$preferenceType.'" name="'.$preferenceName.'">'.$preferenceValue.'</preference>';
      }
      //$st = $conn->query( "SELECT found_rows() as totalRows" );
      //$row = $st->fetch();
      disconnect( $conn );
      //return array( $members, $row["totalRows"] );
    } catch ( PDOException $e ) {
      disconnect( $conn );
      die( "Query failed: " . $e->getMessage() );
    }

echo '</preferences>';

/*
e.g. morsels
<morsels><morsel type="Grain" description="Bagels" isMaster="1" isInactive="0">Bagels</morsel><morsel type="Grain" description="Bran Flakes" isMaster="1" isInactive="0">Bran Flakes</morsel><morsel type="Grain" description="English Muffins" isMaster="1" isInactive="0">English Muffins</morsel></morsels>
*/
echo '<morsels>';

	  $conn = connect();
	  $sql="SELECT * FROM portion where memberId = :memberId";
	
	try {
      $st = $conn->prepare( $sql );
      $st->bindValue( ":memberId", $account, PDO::PARAM_INT );
      $st->execute();
      //$members = array();
      foreach ( $st->fetchAll() as $row ) {
        //$members[] = new Member( $row );
			$morselType=$row['type'];
			$morselName=$row['name'];
			$morselDescription=$row['description'];
			$isMaster=$row['isMaster'];
			$isInactive=$row['isInactive'];
		echo '<morsel type="'.$morselType.'" description="'.$morselDescription.'" isMaster="'.$isMaster.'" isInactive="'.$isInactive.'">'.$morselName.'</morsel>';
			      }
      //$st = $conn->query( "SELECT found_rows() as totalRows" );
      //$row = $st->fetch();
      disconnect( $conn );
      //return array( $members, $row["totalRows"] );
    } catch ( PDOException $e ) {
      disconnect( $conn );
      die( "Query failed: " . $e->getMessage() );
    }

echo '</morsels>';

/*
e.g. dishes
<dishes><dish type="Breakfast" name="Schred-n-Bread" description="Cereal, Fruit, etc." isMaster="1" isInactive="0">
<segments>
<segment type="Grain" description="Schredded Wheat" isMaster="1" isInactive="0">Schredded Wheat</segment>
<segment type="Fruits" description="Bananas" isMaster="1" isInactive="0">Bananas</segment>
<segment type="Dairy" description="Milk" isMaster="1" isInactive="0">Milk</segment>
<segment type="Grain" description="Muffins" isMaster="1" isInactive="0">Muffins</segment>
</segments></dish></dishes>
*/
//function queryForDishSegment($portionId, $torf) {
function queryForDishSegment($conn, $portionId, $torf) {
	$segment = '';
	//$conn = connect();
	  $sql="SELECT * FROM portion where id = :portionId";
	
	try {
      $st = $conn->prepare( $sql );
      $st->bindValue( ":portionId", $portionId, PDO::PARAM_INT );
      $st->execute();
      //$members = array();
      foreach ( $st->fetchAll() as $row ) {
        //$members[] = new Member( $row );
			$segmentType=$row['type'];
			$segmentName=$row['name'];
			$segmentDescription=$row['description'];
			$segmentIsMaster=$row['isMaster'];
			$segmentIsInactive=$row['isInactive'];
			// for debug:
			//echo '<segment type="'.$segmentType.'" description="'.$segmentDescription.'" isMaster="'.$segmentIsMaster.'" isInactive="'.$segmentIsInactive.'">'.$segmentName.'</segment>';
			
			if ($torf)
				$segment .= '<segment';
			else
				$segment .= '<portion';
			$segment .= ' type="'.$segmentType.'" description="'.$segmentDescription.'" isMaster="'.$segmentIsMaster.'" isInactive="'.$segmentIsInactive.'">'.$segmentName;
			if ($torf)
				$segment .= '</segment>';
			else
				$segment .= '</portion>';
	  }
      //$st = $conn->query( "SELECT found_rows() as totalRows" );
      //$row = $st->fetch();
      //disconnect( $conn );
      //return array( $members, $row["totalRows"] );
    } catch ( PDOException $e ) {
      //disconnect( $conn );
      die( "Query failed: " . $e->getMessage() );
    }
	return $segment;
}

echo '<dishes>';

	$conn = connect();
	  $sql="SELECT * FROM plate where memberId = :memberId";
	
	try {
      $st = $conn->prepare( $sql );
      $st->bindValue( ":memberId", $account, PDO::PARAM_INT );
      $st->execute();
      //$members = array();
      foreach ( $st->fetchAll() as $row ) {
        //$members[] = new Member( $row );
			$dishType=$row['type'];
			$dishName=$row['name'];
			$dishDescription=$row['description'];
			$dishIsMaster=$row['isMaster'];
			$dishIsInactive=$row['isInactive'];
		echo '<dish type="'.$dishType.'" name="'.$dishName.'" description="'.$dishDescription.'" isMaster="'.$dishIsMaster.'" isInactive="'.$dishIsInactive.'"><segments>';
		$portionId=$row['portion1'];
		echo queryForDishSegment($conn, $portionId, true);
		$portionId=$row['portion2'];
		echo queryForDishSegment($conn, $portionId, true);
		$portionId=$row['portion3'];
		echo queryForDishSegment($conn, $portionId, true);
		$portionId=$row['portion4'];
		echo queryForDishSegment($conn, $portionId, true);
		$portionId=$row['portion5'];
		echo queryForDishSegment($conn, $portionId, true);
		$portionId=$row['portion6'];
		echo queryForDishSegment($conn, $portionId, true);
		$portionId=$row['portion7'];
		echo queryForDishSegment($conn, $portionId, true);
		$portionId=$row['portion8'];
		echo queryForDishSegment($conn, $portionId, true);
		$portionId=$row['portion9'];
		echo queryForDishSegment($conn, $portionId, true);
		echo '</segments></dish>';
				  }
      //$st = $conn->query( "SELECT found_rows() as totalRows" );
      //$row = $st->fetch();
      disconnect( $conn );
      //return array( $members, $row["totalRows"] );
    } catch ( PDOException $e ) {
      disconnect( $conn );
      die( "Query failed: " . $e->getMessage() );
    }
    
echo '</dishes>';

/*
e.g. slates
<slates>
<slate name="February 6, 2012" dow="Monday" id="51">
<plates>
<plate name="Puffs-n-Stuff" type="Breakfast" description="Cereal, Fruit, etc.">
<portions>
<portion type="Grain">Puffs</portion>
<portion type="Fruits">Berries</portion>
<portion type="Dairy">Milk</portion>
<portion type="Grain">Muffins</portion>
</portions>
</plate>
<plate name="Grilled Cheese" type="Lunch" description="(with fruit)"><portions><portion type="Grain">Irish Bread</portion><portion type="Protein">Pork Products</portion><portion type="Dairy">Cheese</portion><portion type="Fruits">Apples</portion></portions></plate>
</plates>
</slate>
</slates>
*/
function queryForPlateAndPortions($conn, $slateId, $plateId) {
	$plate = '<plate';
	$sql="SELECT * FROM plate where id = :plateId";
	try {
      $st = $conn->prepare( $sql );
      $st->bindValue( ":plateId", $plateId, PDO::PARAM_INT );
      $st->execute();
      //$members = array();
      foreach ( $st->fetchAll() as $row ) {
        //$members[] = new Member( $row );
			$plateType=$row['type'];
			$plateName=$row['name'];
			$plateDescription=$row['description'];
			
			$plate .= ' name="'.$plateName.'" type="'.$plateType.'" description="'.$plateDescription.'"><portions>';
			
			$sql2="SELECT * FROM food where slateId = :slateId and type= :plateType";
		      $st2 = $conn->prepare( $sql2 );
		      $st2->bindValue( ":slateId", $slateId, PDO::PARAM_INT );
		      $st2->bindValue( ":plateType", $plateType, PDO::PARAM_STR );
		      $st2->execute();
		      //$members = array();
		      foreach ( $st2->fetchAll() as $row2 ) {
		      	$portionId = $row2['portionId'];
		      	//echo queryForDishSegment($conn, $portionId, false);
		      	$plate .= queryForDishSegment($conn, $portionId, false);
		      }
	  }
      //$st = $conn->query( "SELECT found_rows() as totalRows" );
      //$row = $st->fetch();
      //disconnect( $conn );
      //return array( $members, $row["totalRows"] );
    } catch ( PDOException $e ) {
      //disconnect( $conn );
      die( "Query failed: " . $e->getMessage() );
    }	
	$plate .= '</portions></plate>';
	
	return $plate;
}

echo '<slates>';

	$conn = connect();
	  $sql="SELECT * FROM slate where memberId = :memberId";
	
	try {
      $st = $conn->prepare( $sql );
      $st->bindValue( ":memberId", $account, PDO::PARAM_INT );
      $st->execute();
      //$members = array();
      foreach ( $st->fetchAll() as $row ) {
        //$members[] = new Member( $row );
        $slateId=$row['id'];
			$slateDate=$row['date'];
			$slateName=$row['name'];
		echo '<slate name="'.$slateDate.'" dow="'.$slateName.'" id="'.$slateId.'"><plates>';
		$breakfastId=$row['breakfastId'];
		echo queryForPlateAndPortions($conn, $slateId, $breakfastId);
		$lunchId=$row['lunchId'];
		echo queryForPlateAndPortions($conn, $slateId, $lunchId);
		$dinnerId=$row['dinnerId'];
		echo queryForPlateAndPortions($conn, $slateId, $dinnerId);
		echo '</plates></slate>';
							  }
      //$st = $conn->query( "SELECT found_rows() as totalRows" );
      //$row = $st->fetch();
      disconnect( $conn );
      //return array( $members, $row["totalRows"] );
    } catch ( PDOException $e ) {
      disconnect( $conn );
      die( "Query failed: " . $e->getMessage() );
    }

echo '</slates></tables>';
?> 



