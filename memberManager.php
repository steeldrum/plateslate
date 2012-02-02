<?php
/***************************************
$Revision::                            $: Revision of last commit
$LastChangedBy::                       $: Author of last commit
$LastChangedDate::                     $: Date of last commit
***************************************/
/*
plateslate/
memberManager.php
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
	<p><a href="view_tokens.php">View List of Charity Hound Member Invitations</a></p>
    <p>To manage member, please fill in your details below and click Send Details.</p>
    <p>Fields marked with an asterisk (*) are required.</p>
<?php } ?>

    <form action="memberManager.php" method="post" style="margin-bottom: 50px;">
      <div style="width: 30em;">
        <input type="hidden" name="action" value="manage" />

        <label for="emailAddress"<?php validateField( "emailAddress", $missingFields ) ?>>Email address *</label>
        <input type="text" name="emailAddress" id="emailAddress" value="<?php echo $token->getValueEncoded( "emailAddress" ) ?>" />

        <label for="token"<?php validateField( "token", $missingFields ) ?>>Token *</label>
        <input type="text" name="token" id="token" value="<?php echo $token->getValueEncoded( "token" ) ?>" />

        <label for="payment">Payment</label>
        <input type="text" name="payment" id="payment" value="<?php echo $token->getValueEncoded( "payment" ) ?>" />

        <label for="isCollaborator">Collaborator?</label>
        <input type="checkbox" name="isCollaborator" id="isCollaborator" value="1" <?php setChecked( $token, "isCollaborator", "1" )?>"/>

        <label for="isAggregateAnalyst">Aggregate Analyst?</label>
        <input type="checkbox" name="isAggregateAnalyst" id="isAggregateAnalyst" value="1" <?php setChecked( $token, "isAggregateAnalyst", "1" )?>"/>

        <label for="isDemo">Demo?</label>
        <input type="checkbox" name="isDemo" id="isDemo" value="1" <?php setChecked( $token, "isDemo", "1" )?>"/>

        <label for="isTest">Test?</label>
        <input type="checkbox" name="isTest" id="isTest" value="1" <?php setChecked( $token, "isTest", "1" )?>"/>

        <label for="isInactive">Inactive?</label>
        <input type="checkbox" name="isInactive" id="isInactive" value="1" <?php setChecked( $token, "isInactive", "1" )?>"/>

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
  $requiredFields = array( "emailAddress", "token" );
  $missingFields = array();
  $errorMessages = array();

  $token = new Token( array( 
    "emailAddress" => isset( $_POST["emailAddress"] ) ? preg_replace( "/[^ \@\.\-\_a-zA-Z0-9]/", "", $_POST["emailAddress"] ) : "",
    "token" => isset( $_POST["token"] ) ? preg_replace( "/[^ \-\_a-zA-Z0-9]/", "", $_POST["token"] ) : "",
    "payment" => isset( $_POST["payment"] ) ? preg_replace( "/[^ \-\_a-zA-Z0-9]/", "", $_POST["payment"] ) : "",
    "isCollaborator" => isset( $_POST["isCollaborator"] ) ? preg_replace( "/[^ \-\_a-zA-Z0-9]/", "", $_POST["isCollaborator"] ) : "",
    "isAggregateAnalyst" => isset( $_POST["isAggregateAnalyst"] ) ? preg_replace( "/[^ \-\_a-zA-Z0-9]/", "", $_POST["isAggregateAnalyst"] ) : "",
    "isDemo" => isset( $_POST["isDemo"] ) ? preg_replace( "/[^ \-\_a-zA-Z0-9]/", "", $_POST["isDemo"] ) : "",
    "isTest" => isset( $_POST["isTest"] ) ? preg_replace( "/[^ \-\_a-zA-Z0-9]/", "", $_POST["isTest"] ) : "",
    "isInactive" => isset( $_POST["isInactive"] ) ? preg_replace( "/[^ \-\_a-zA-Z0-9]/", "", $_POST["isInactive"] ) : ""

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

  if ( Token::getByEmailAddress( $token->getValue( "emailAddress" ) ) ) {
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
