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
$_SESSION["member"] = "";
//echo $errorMessage;
echo $observer_url;
?>
