<?php
/***************************************
$Revision::                            $: Revision of last commit
$LastChangedBy::                       $: Author of last commit
$LastChangedDate::                     $: Date of last commit
***************************************/
/*
plateslate/
view_token.php
tjs 120202

file version 1.00 

release version 1.00
*/

require_once( "common.inc.php" );
require_once( "config.php" );
//require_once( "Member.class.php" );
require_once( "Token.class.php" );
//require_once( "LogEntry.class.php" );

$tokenId = isset( $_REQUEST["tokenId"] ) ? (int)$_REQUEST["tokenId"] : 0;

if ( !$token = Token::getToken( $tokenId ) ) {
  displayPageHeader( "Error" );
  echo "<div>Token not found.</div>";
  displayPageFooter();
  exit;
}

if ( isset( $_POST["action"] ) and $_POST["action"] == "Save Changes" ) {
  saveToken();
} elseif ( isset( $_POST["action"] ) and $_POST["action"] == "Delete Member" ) {
  deleteToken();
} else {
  displayForm( array(), array(), $token );
}

function displayForm( $errorMessages, $missingFields, $token ) {
  //$logEntries = LogEntry::getLogEntries( $member->getValue( "id" ) );
  displayPageHeader( "View token: " . $token->getValueEncoded( "emailAddress" ));

  if ( $errorMessages ) {
    foreach ( $errorMessages as $errorMessage ) {
      echo $errorMessage;
    }
  }

  $start = isset( $_REQUEST["start"] ) ? (int)$_REQUEST["start"] : 0;
  $order = isset( $_REQUEST["order"] ) ? preg_replace( "/[^ a-zA-Z]/", "", $_REQUEST["order"] ) : "emailAddress";
?>
    <form action="view_token.php" method="post" style="margin-bottom: 50px;">
      <div style="width: 30em;">
        <input type="hidden" name="tokenId" id="tokenId" value="<?php echo $token->getValueEncoded( "id" ) ?>" />
        <input type="hidden" name="start" id="start" value="<?php echo $start ?>" />
        <input type="hidden" name="order" id="order" value="<?php echo $order ?>" />

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
          <input type="submit" name="action" id="saveButton" value="Save Changes" />
          <input type="submit" name="action" id="deleteButton" value="Delete Member" style="margin-right: 20px;" />
        </div>
      </div>
    </form>

    <div style="width: 30em; margin-top: 20px; text-align: center;">
      <a href="view_tokens.php?start=<?php echo $start ?>&amp;order=<?php echo $order ?>">Back</a>
    </div>

<?php
  displayPageFooter();
}

function saveToken() {
    //echo "saveToken...";
	$requiredFields = array( "emailAddress", "token" );
  $missingFields = array();
  $errorMessages = array();

  $token = new Token( array(
    "id" => isset( $_POST["tokenId"] ) ? (int) $_POST["tokenId"] : "",
    "emailAddress" => isset( $_POST["emailAddress"] ) ? preg_replace( "/[^ \@\.\-\_a-zA-Z0-9]/", "", $_POST["emailAddress"] ) : "",
    "token" => isset( $_POST["token"] ) ? preg_replace( "/[^ \-\_a-zA-Z0-9]/", "", $_POST["token"] ) : "",
    "payment" => isset( $_POST["payment"] ) ? preg_replace( "/[^ \-\_a-zA-Z0-9]/", "", $_POST["payment"] ) : "",
    "isCollaborator" => isset( $_POST["isCollaborator"] ) ? preg_replace( "/[^ \-\_a-zA-Z0-9]/", "", $_POST["isCollaborator"] ) : "",
    "isAggregateAnalyst" => isset( $_POST["isAggregateAnalyst"] ) ? preg_replace( "/[^ \-\_a-zA-Z0-9]/", "", $_POST["isAggregateAnalyst"] ) : "",
    "isDemo" => isset( $_POST["isDemo"] ) ? preg_replace( "/[^ \-\_a-zA-Z0-9]/", "", $_POST["isDemo"] ) : "",
    "isTest" => isset( $_POST["isTest"] ) ? preg_replace( "/[^ \-\_a-zA-Z0-9]/", "", $_POST["isTest"] ) : "",
    "isInactive" => isset( $_POST["isInactive"] ) ? preg_replace( "/[^ \-\_a-zA-Z0-9]/", "", $_POST["isInactive"] ) : ""
  
  ) );

  foreach ( $requiredFields as $requiredField ) {
    if ( !$token->getValue( $requiredField ) ) {
      $missingFields[] = $requiredField;
    }
  }

  if ( $missingFields ) {
    $errorMessages[] = '<p class="error">There were some missing fields in the form you submitted. Please complete the fields highlighted below and click Save Changes to resend the form.</p>';
  }
//echo "check email...";
  if ( $existingToken = Token::getByEmailAddress( $token->getValue( "emailAddress" ) ) and $existingToken->getValue( "id" ) != $token->getValue( "id" ) ) {
    $errorMessages[] = '<p class="error">A token with that email address already exists in the database. Please choose another email address.</p>';
  }

  if ( $errorMessages ) {
    displayForm( $errorMessages, $missingFields, $token );
  } else {
    $token->update();
//echo "updated...";
    //tjs 111118
  	//$emailAddress = $token->getValueEncoded( "emailAddress" );
    $emailAddress = $token->getValue( "emailAddress" );
    //echo "emailAddress ".$emailAddress;
  	$member = Member::getByEmailAddress( $emailAddress );
    $isAggregateAnalyst = $token->getValue( "isAggregateAnalyst" );
    //echo "emailAddress ".$emailAddress." isAggregateAnalyst ".$isAggregateAnalyst;
  	//if ($isAggregateAnalyst == 1) {
    //if ($isAggregateAnalyst == "1") {
  		//$member->data["isSelectableForSite"] = "1";	// i.e. if not zero then can be selected for aggregate reports
    	//echo "selectable!";
  	//} else {
  		//$member->data["isSelectableForSite"] = "0";	// i.e. if zero then can NOT be selected for aggregate reports
    	//echo "Not selectable!";
  	//}
    $member->setIsSelectableForSite($isAggregateAnalyst);
    //echo "member isSelectableForSite ".$member->getValue("isSelectableForSite");
  	$member->update();
    displaySuccess();
  }
}

function deleteToken() {
  $token = new Token( array(
    "id" => isset( $_POST["tokenId"] ) ? (int) $_POST["tokenId"] : "",
  ) );
 // LogEntry::deleteAllForMember( $member->getValue( "id" ) );
  $token->delete();
  displaySuccess();
}

function displaySuccess() {
  $start = isset( $_REQUEST["start"] ) ? (int)$_REQUEST["start"] : 0;
  $order = isset( $_REQUEST["order"] ) ? preg_replace( "/[^ a-zA-Z]/", "", $_REQUEST["order"] ) : "emailAddress";
  displayPageHeader( "Changes saved" );
?>
    <p>Your changes have been saved. <a href="view_tokens.php?start=<?php echo $start ?>&amp;order=<?php echo $order ?>">Return to token list</a></p>
<?php
  displayPageFooter();
}

?>

