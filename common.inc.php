<?php
/***************************************
$Revision::                            $: Revision of last commit
$LastChangedBy::                       $: Author of last commit
$LastChangedDate::                     $: Date of last commit
***************************************/
/*
plateslate/
common.inc.php
tjs 101012

file version 1.00 

release version 1.0
*/

require_once( "config.php" );
require_once( "Member.class.php" );
//require_once( "Ad.class.php" );
require_once( "LogEntry.class.php" );

function displayPageHeader( $pageTitle, $membersArea = false ) {
?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN"
  "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="en" lang="en">
  <head>
  <!-- [if lt IE 9]>
  <script src="js/html5.js"></script>
  <![endif]-->
   <script type="text/javascript" src="js/menu.js"></script>
    <title><?php echo $pageTitle?></title>
    <link rel="stylesheet" type="text/css" href="<?php if ( $membersArea ) echo "../" ?>css/common.css" />
    <style type="text/css">
    #container { border:1px solid #85d791; width:1101px; margin: 20px; padding: 20px; }

      th { text-align: left; background-color: #bbb; }
      th, td { padding: 0.4em; }
      tr.alt td { background: #ddd; }
      .error { background: #d33; color: white; padding: 0.2em; }
    </style>
  </head>
  <body>
  <header>
<hgroup>
<h1>Plate Slate</h1>
<hr/>Where Collaborators Manage Meal Plans<hr/>
</hgroup>
</header>
<div id="container">

    <h1><?php echo $pageTitle?></h1>
<?php
}

function displayPageFooter() {
?>
</div>
<footer>
<h2>Join Us.  We Manage Menus and Encourage Better Health!</h2>
<br/>

<div class="iconControls">

<a href="javascript:newLocation('index', 'logistics')"><img src="images/home.gif"></a>

</div>

</footer>
  </body>
</html>
<?php
}

function validateField( $fieldName, $missingFields ) {
  if ( in_array( $fieldName, $missingFields ) ) {
    echo ' class="error"';
  }
}

function setChecked( DataObject $obj, $fieldName, $fieldValue ) {
  if ( $obj->getValue( $fieldName ) == $fieldValue ) {
    echo ' checked="checked"';
  }
}

function setSelected( DataObject $obj, $fieldName, $fieldValue ) {
  if ( $obj->getValue( $fieldName ) == $fieldValue ) {
    echo ' selected="selected"';
  }
}

function checkLogin() {
  session_start();
  if ( !$_SESSION["member"] or !$_SESSION["member"] = Member::getMember( $_SESSION["member"]->getValue( "id" ) ) ) {
    $_SESSION["member"] = "";
    header( "Location: login.php" );
    exit;
  } else {
    $logEntry = new LogEntry( array (
      "memberId" => $_SESSION["member"]->getValue( "id" ),
      "pageUrl" => basename( $_SERVER["PHP_SELF"] )
    ) );
    $logEntry->record();
  }
}


?>
