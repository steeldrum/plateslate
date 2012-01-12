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

//require_once( "common.inc.php" );
require_once( "config.php" );
require_once( "Member.class.php" );
require_once( "LogEntry.class.php" );
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
	$requiredFields = array( "username", "password", "emailAddress", "firstName", "lastName", "gender" );
  $missingFields = array();
  $errorMessages = array();

  $member = new Member( array( 
    "username" => isset( $_POST["username"] ) ? preg_replace( "/[^ \-\_a-zA-Z0-9]/", "", $_POST["username"] ) : "",
    "password" => ( isset( $_POST["password1"] ) and isset( $_POST["password2"] ) and $_POST["password1"] == $_POST["password2"] ) ? preg_replace( "/[^ \-\_a-zA-Z0-9]/", "", $_POST["password1"] ) : "",
    "firstName" => isset( $_POST["firstName"] ) ? preg_replace( "/[^ \'\-a-zA-Z0-9]/", "", $_POST["firstName"] ) : "",
    "lastName" => isset( $_POST["lastName"] ) ? preg_replace( "/[^ \'\-a-zA-Z0-9]/", "", $_POST["lastName"] ) : "",
    "gender" => isset( $_POST["gender"] ) ? preg_replace( "/[^mf]/", "", $_POST["gender"] ) : "",
    "primarySkillArea" => isset( $_POST["primarySkillArea"] ) ? preg_replace( "/[^a-zA-Z]/", "", $_POST["primarySkillArea"] ) : "",
    "emailAddress" => isset( $_POST["emailAddress"] ) ? preg_replace( "/[^ \@\.\-\_a-zA-Z0-9]/", "", $_POST["emailAddress"] ) : "",
    "otherSkills" => isset( $_POST["otherSkills"] ) ? preg_replace( "/[^ \'\,\.\-a-zA-Z0-9]/", "", $_POST["otherSkills"] ) : "",
    "joinDate" => date( "Y-m-d" ),
    "cumDonationsForSites" => "0",
    "lastDonationMadeOn" => "",
    "lastDonationForSite" => "0",
    "lastLoginDate" => "",
    "permissionForSite" => "15",
    "isSelectableForSite" => "0",
    "passwordMnemonicQuestion" => isset( $_POST["passwordMnemonicQuestion"] ) ? preg_replace( "/[^a-zA-Z]/", "", $_POST["passwordMnemonicQuestion"] ) : "",
    "passwordMnemonicAnswer" => isset( $_POST["passwordMnemonicAnswer"] ) ? preg_replace( "/[^a-zA-Z]/", "", $_POST["passwordMnemonicAnswer"] ) : "",
    "isInactive" => ""

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

  if ( Member::getByEmailAddress( $member->getValue( "emailAddress" ) ) ) {
    //$errorMessages[] = '<p class="error">A member with that email address already exists in the database. Please choose another email address, or contact the webmaster to retrieve your password.</p>';
	$duplicateEMailError = 'nok';
  }

$token = isset( $_POST["token"] ) ? preg_replace( "/[^ \-\_a-zA-Z0-9]/", "", $_POST["token"] ) : "";
//if (!$token = "plateslatebetauser") {
if (!($token == "plateslatebetauser")) {
	$tokenMisMatchError = 'nok';
	//$success = 'nok';
}
  
//if ( !$missingFieldsError && !$passwordError && !$duplicateUserNameError && !$duplicateEMailError) {
  if ( $missingFieldsError == 'nok' || $passwordError == 'nok' || $duplicateUserNameError == 'nok' || $duplicateEMailError == 'nok' || $tokenMisMatchError == 'nok') {
  	$info = '["registerInfo", {"success":"nok","missingFieldsError":"'.$missingFieldsError.'","passwordError":"'.$passwordError.'","duplicateUserNameError":"'.$duplicateUserNameError.'","duplicateEMailError":"'.$duplicateEMailError.'","registrationTokenMisMatchError":"'.$tokenMisMatchError.'"}]';
  	return($info);
  } else {
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
  $registerInfo = processForm();
  echo $registerInfo;

?>