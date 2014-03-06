<?php
/***************************************
$Revision:: 134                        $: Revision of last commit
$LastChangedBy::                       $: Author of last commit
$LastChangedDate:: 2011-09-04 11:37:32#$: Date of last commit
***************************************/
/*
plateslate/
plateslateRegister.php
tjs 110901

file version 1.00 
*/

date_default_timezone_set ( "America/New_York" );

//echo "plateslateRegister.php starting...";

require_once( "common.inc.php" );
//require_once( "config.php" );
require_once( "Member.class.php" );
require_once( "LogEntry.class.php" );
// tjs 120202
require_once( "Token.class.php" );
/*
$missingFieldsError = 'ok';
$passwordError = 'ok';
$duplicateUserNameError = 'ok';
$duplicateEMailError = 'ok';
$tokenMisMatchError = 'ok';
*/
function processForm() {
$missingFieldsError = 'ok';
$passwordError = 'ok';
$duplicateUserNameError = 'ok';
$duplicateEMailError = 'ok';
$tokenMisMatchError = 'ok';
	$requiredFields = array( "username", "password", "emailaddress", "firstname", "lastname", "gender" );
  $missingFields = array();
  $errorMessages = array();

  //echo "plateslateRegister processForm started";
  /*    "lastdonationmadeon" => "",
     "cumdonationsforsites" => "0",
    "lastdonationmadeon" => date( "Y-m-d" ),
    "lastdonationforsite" => "0",
     "lastlogindate" => "",
    "permissionforsite" => "15",
    "isselectableforsite" => "0",
  */
  $member = new Member( array( 
    "username" => isset( $_POST["username"] ) ? preg_replace( "/[^ \-\_a-zA-Z0-9]/", "", $_POST["username"] ) : "",
    "password" => ( isset( $_POST["password1"] ) and isset( $_POST["password2"] ) and $_POST["password1"] == $_POST["password2"] ) ? preg_replace( "/[^ \-\_a-zA-Z0-9]/", "", $_POST["password1"] ) : "",
    "firstname" => isset( $_POST["firstName"] ) ? preg_replace( "/[^ \'\-a-zA-Z0-9]/", "", $_POST["firstName"] ) : "",
    "lastname" => isset( $_POST["lastName"] ) ? preg_replace( "/[^ \'\-a-zA-Z0-9]/", "", $_POST["lastName"] ) : "",
    "gender" => isset( $_POST["gender"] ) ? preg_replace( "/[^mf]/", "", $_POST["gender"] ) : "",
    "primaryskillarea" => isset( $_POST["primarySkillArea"] ) ? preg_replace( "/[^a-zA-Z]/", "", $_POST["primarySkillArea"] ) : "",
    "emailaddress" => isset( $_POST["emailAddress"] ) ? preg_replace( "/[^ \@\.\-\_a-zA-Z0-9]/", "", $_POST["emailAddress"] ) : "",
    "otherskills" => isset( $_POST["otherSkills"] ) ? preg_replace( "/[^ \'\,\.\-a-zA-Z0-9]/", "", $_POST["otherSkills"] ) : "",
    "joindate" => date( "Y-m-d" ),
    "cumdonationsforsites" => 0,
    "lastdonationmadeon" => date( "Y-m-d" ),
    "lastdonationforsite" => 0,
    "lastlogindate" => date( "Y-m-d" ),
    "permissionforsite" => 15,
    "isselectableforsite" => 0,
    "passwordmnemonicquestion" => isset( $_POST["passwordMnemonicQuestion"] ) ? preg_replace( "/[^a-zA-Z]/", "", $_POST["passwordMnemonicQuestion"] ) : "",
    "passwordmnemonicanswer" => isset( $_POST["passwordMnemonicAnswer"] ) ? preg_replace( "/[^a-zA-Z]/", "", $_POST["passwordMnemonicAnswer"] ) : "",
    "isinactive" => 0

  ) );

  foreach ( $requiredFields as $requiredField ) {
    if ( !$member->getValue( $requiredField ) ) {
      $missingFields[] = $requiredField;
    }
  }

  if ( $missingFields ) {
    //$errorMessages[] = '<p class="error">There were some missing fields in the form you submitted. Please complete the fields highlighted below and click Send Details to resend the form.</p>';
	$missingFieldsError = 'nok';
  }

  if ( !isset( $_POST["password1"] ) or !isset( $_POST["password2"] ) or !$_POST["password1"] or !$_POST["password2"] or ( $_POST["password1"] != $_POST["password2"] ) ) {
    //$errorMessages[] = '<p class="error">Please make sure you enter your password correctly in both password fields.</p>';
	$passwordError = 'nok';
  }

  if ( Member::getByUsername( $member->getValue( "username" ) ) ) {
    //$errorMessages[] = '<p class="error">A member with that username already exists in the database. Please choose another username.</p>';
	$duplicateUserNameError = 'nok';
  }

  if ( Member::getByEmailAddress( $member->getValue( "emailaddress" ) ) ) {
    //$errorMessages[] = '<p class="error">A member with that email address already exists in the database. Please choose another email address, or contact the webmaster to retrieve your password.</p>';
	$duplicateEMailError = 'nok';
  }

$token = isset( $_POST["token"] ) ? preg_replace( "/[^ \-\_a-zA-Z0-9]/", "", $_POST["token"] ) : "";
// tjs 120202
//if (!($token == "plateslatebetauser")) {
//	$tokenMisMatchError = 'nok';
	//$success = 'nok';
//}
$tokenRow = Token::getByEmailAddress( $member->getValue( "emailaddress" ) );
if ($tokenRow) {
	if ($token != $tokenRow->getValue( "token" )) {
		$tokenMisMatchError = 'nok';
	}
} else {
	$tokenMisMatchError = 'nok';
}

//if ( !$missingFieldsError && !$passwordError && !$duplicateUserNameError && !$duplicateEMailError) {
  if ( $missingFieldsError == 'nok' || $passwordError == 'nok' || $duplicateUserNameError == 'nok' || $duplicateEMailError == 'nok' || $tokenMisMatchError == 'nok') {
  	$info = '["registerInfo", {"success":"nok","missingFieldsError":"'.$missingFieldsError.'","passwordError":"'.$passwordError.'","duplicateUserNameError":"'.$duplicateUserNameError.'","duplicateEMailError":"'.$duplicateEMailError.'","registrationTokenMisMatchError":"'.$tokenMisMatchError.'"}]';
  	return($info);
  } else {
  	// tjs 120220 for debug:
  	//echo "member skill ".$member->getPrimarySkillAreaString();
  	$member->insert();
  	$info = '["registerInfo", {"success":"ok","missingFieldsError":"'.$missingFieldsError.'","passwordError":"'.$passwordError.'","duplicateUserNameError":"'.$duplicateUserNameError.'","duplicateEMailError":"'.$duplicateEMailError.'","registrationTokenMisMatchError":"'.$tokenMisMatchError.'"}]';
  	return($info);
  	//return('ok');
  }
}
/*
$token = isset( $_POST["token"] ) ? preg_replace( "/[^ \-\_a-zA-Z0-9]/", "", $_POST["token"] ) : "";
//if (!$token = "plateslatebetauser") {
if (!($token == "plateslatebetauser")) {
	$registrationTokenMisMatchError = 'nok';
	//$success = 'nok';
}
*/
//$success = processForm();

//  $registerInfo = '["registerInfo", {"success":"'.$success.'","missingFieldsError":"'.$missingFieldsError.'","passwordError":"'.$passwordError.'","duplicateUserNameError":"'.$duplicateUserNameError.'","duplicateEMailError":"'.$duplicateEMailError.'","$registrationTokenMisMatchError":"'.$tokenMisMatchError.'"}]';
//echo "plateslateRegister processForm() starting...";
$registerInfo = processForm();
  echo $registerInfo;

?>
