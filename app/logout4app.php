<?php
/***************************************
$Revision:: 175                        $: Revision of last commit
$LastChangedBy::                       $: Author of last commit
$LastChangedDate:: 2012-01-03 14:44:48#$: Date of last commit
***************************************/
// tjs 131113
//$errorMessage = 'false';
//require_once( "common.inc.php" );
require_once( "./../config.php" );
$observer_url = OBSERVER_URL;
//echo "observer_url $observer_url";
session_start();
// tjs 131119
$account = $_GET['account'];
if ($account == 0) {
	$account = 7; // default to guest account
}
//echo "account $account";
/*if (isset($_SESSION['member'])) {
	$member = $_SESSION['member'];
	$account = $member->getValue( "id" );
}*/
//echo "account $account";
$_SESSION["member"] = "";
//echo $errorMessage;
echo "$observer_url$account/slate.html";
?>
