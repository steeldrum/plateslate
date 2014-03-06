<?php
/***************************************
$Revision:: 152                        $: Revision of last commit
$LastChangedBy::                       $: Author of last commit
$LastChangedDate:: 2011-11-15 09:35:07#$: Date of last commit
***************************************/
/*
charityhound/
memberManager.php
tjs 111111

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
  `isDemo` tinyint(4) DEFAULT NULL,
  `isTest` tinyint(4) DEFAULT NULL,
  `isInactive` tinyint(4) DEFAULT NULL,
*/

date_default_timezone_set ( "America/New_York" );

require_once( "common.inc.php" );
require_once( "Token.class.php" );

//echo "memberManager starting...";

if ( isset( $_POST["action"] ) and $_POST["action"] == "manage" ) {
  processForm();
} else {
  displayForm( array(), array(), new Token( array() ) );
}

function displayForm( $errorMessages, $missingFields, $token ) {
  //displayPageHeader( "Sign up for the book club!" );
  displayPageHeader( "Manage Plate Slate Member!" );

  if ( $errorMessages ) {
    foreach ( $errorMessages as $errorMessage ) {
      echo $errorMessage;
    }
  } else {
?>
	<p><a href="view_tokens.php">View List of Plate Slate Member Invitations</a></p>
    <p>To manage member, please fill in your details below and click Send Details.</p>
    <p>Fields marked with an asterisk (*) are required.</p>
<?php } ?>

    <form action="memberManager.php" method="post" style="margin-bottom: 50px;">
      <div style="width: 30em;">
        <input type="hidden" name="action" value="manage" />

        <label for="emailAddress"<?php validateField( "emailaddress", $missingFields ) ?>>Email address *</label>
        <input type="text" name="emailAddress" id="emailAddress" value="<?php echo $token->getValueEncoded( "emailaddress" ) ?>" />
<br/>
        <label for="token"<?php validateField( "token", $missingFields ) ?>>Token *</label>
        <input type="text" name="token" id="token" value="<?php echo $token->getValueEncoded( "token" ) ?>" />
<br/>
        <label for="payment">Payment</label>
        <input type="text" name="payment" id="payment" value="<?php echo $token->getValueEncoded( "payment" ) ?>" />
<br/>
        <label for="isCollaborator">Collaborator?</label>
        <input type="checkbox" name="isCollaborator" id="isCollaborator" value="1" <?php setChecked( $token, "iscollaborator", "1" )?>"/>
<br/>
        <label for="isAggregateAnalyst">Aggregate Analyst?</label>
        <input type="checkbox" name="isAggregateAnalyst" id="isAggregateAnalyst" value="1" <?php setChecked( $token, "isaggregateanalyst", "1" )?>"/>
<br/>
        <label for="isDemo">Demo?</label>
        <input type="checkbox" name="isDemo" id="isDemo" value="1" <?php setChecked( $token, "isdemo", "1" )?>"/>
<br/>
        <label for="isTest">Test?</label>
        <input type="checkbox" name="isTest" id="isTest" value="1" <?php setChecked( $token, "istest", "1" )?>"/>
<br/>
        <label for="isInactive">Inactive?</label>
        <input type="checkbox" name="isInactive" id="isInactive" value="1" <?php setChecked( $token, "isinactive", "1" )?>"/>

        <div style="clear: both;">
          <input type="submit" name="submitButton" id="submitButton" value="Send Details" />
          <input type="reset" name="resetButton" id="resetButton" value="Reset Form" style="margin-right: 20px;" />
        </div>

      </div>
    </form>
    <br/>
    <a href="index.html">Home</a>
<?php
  displayPageFooter();
}

function processForm() {
  //$requiredFields = array( "emailAddress", "token" );
	$requiredFields = array( "emailaddress", "token" );
  $missingFields = array();
  $errorMessages = array();

  $token = new Token( array( 
    "emailaddress" => isset( $_POST["emailAddress"] ) ? preg_replace( "/[^ \@\.\-\_a-zA-Z0-9]/", "", $_POST["emailAddress"] ) : "",
    "token" => isset( $_POST["token"] ) ? preg_replace( "/[^ \-\_a-zA-Z0-9]/", "", $_POST["token"] ) : "",
 	"memberid" => 0,
 	"expirationdate" => "2100-12-31",
  "payment" => isset( $_POST["payment"] ) ? preg_replace( "/[^ \-\_a-zA-Z0-9]/", "", $_POST["payment"] ) : "",
 	"paymentdate" => "2100-12-31",
  "totalpayments" => isset( $_POST["payment"] ) ? preg_replace( "/[^ \-\_a-zA-Z0-9]/", "", $_POST["payment"] ) : "",
  "numlogins" => 0,
 	"lastaccess" => "2000-01-01",
  "iscollaborator" => isset( $_POST["isCollaborator"] ) ? preg_replace( "/[^ \-\_a-zA-Z0-9]/", "", $_POST["isCollaborator"] ) : "0",
    "isaggregateanalyst" => isset( $_POST["isAggregateAnalyst"] ) ? preg_replace( "/[^ \-\_a-zA-Z0-9]/", "", $_POST["isAggregateAnalyst"] ) : "0",
    "isdemo" => isset( $_POST["isDemo"] ) ? preg_replace( "/[^ \-\_a-zA-Z0-9]/", "", $_POST["isDemo"] ) : "0",
    "istest" => isset( $_POST["isTest"] ) ? preg_replace( "/[^ \-\_a-zA-Z0-9]/", "", $_POST["isTest"] ) : "0",
    "isinactive" => isset( $_POST["isInactive"] ) ? preg_replace( "/[^ \-\_a-zA-Z0-9]/", "", $_POST["isInactive"] ) : "0"

  ) );
//echo "memberManager processForm token created...";

  foreach ( $requiredFields as $requiredField ) {
    if ( !$token->getValue( $requiredField ) ) {
      $missingFields[] = $requiredField;
    }
  }

  if ( $missingFields ) {
    $errorMessages[] = '<p class="error">There were some missing fields in the form you submitted. Please complete the fields highlighted below and click Send Details to resend the form.</p>';
  }

  if ( Token::getByEmailAddress( $token->getValue( "emailaddress" ) ) ) {
    $errorMessages[] = '<p class="error">A managed member with that email address already exists in the database. Please choose another email address.</p>';
  }

  if ( $errorMessages ) {
    displayForm( $errorMessages, $missingFields, $token );
  } else {
//echo "memberManager processForm inserting token...";
  	$token->insert();
    displayThanks();
  }
}

function displayThanks() {
  displayPageHeader( "Member management is completed!" );
?>
    <br/>
    <a href="index.html">Home</a>
<?php
  displayPageFooter();
}
?>
