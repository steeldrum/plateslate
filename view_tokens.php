<?php
/***************************************
$Revision:: 152                        $: Revision of last commit
$LastChangedBy::                       $: Author of last commit
$LastChangedDate:: 2011-11-15 09:35:07#$: Date of last commit
***************************************/
/*
plateslate/
view_tokens.php
tjs 120202

file version 1.00 

release version 1.00
*/

require_once( "common.inc.php" );
require_once( "config.php" );
//require_once( "Member.class.php" );
require_once( "Token.class.php" );

$start = isset( $_GET["start"] ) ? (int)$_GET["start"] : 0;
//$order = isset( $_GET["order"] ) ? preg_replace( "/[^ a-zA-Z]/", "", $_GET["order"] ) : "username";
$order = isset( $_GET["order"] ) ? preg_replace( "/[^ a-zA-Z]/", "", $_GET["order"] ) : "emailAddress";
list( $tokens, $totalRows ) = Token::getTokens( $start, PAGE_SIZE, $order );
displayPageHeader( "View Collogistics Member Invitations" );

/*
FYI for later on:
        <th><?php if ( $order != "firstName" ) { ?><a href="view_members.php?order=firstName"><?php } ?>First name<?php if ( $order != "firstName" ) { ?></a><?php } ?></th>
        <th><?php if ( $order != "lastName" ) { ?><a href="view_members.php?order=lastName"><?php } ?>Last name<?php if ( $order != "lastName" ) { ?></a><?php } ?></th>

        <td><?php echo $member->getValueEncoded( "firstName" ) ?></td>
        <td><?php echo $member->getValueEncoded( "lastName" ) ?></td>
*/
?>
    <h2>Displaying tokens <?php echo $start + 1 ?> - <?php echo min( $start +  PAGE_SIZE, $totalRows ) ?> of <?php echo $totalRows ?></h2>

    <table cellspacing="0" style="width: 30em; border: 1px solid #666;">
      <tr>
        <th><?php if ( $order != "emailAddress" ) { ?><a href="view_tokens.php?order=emailAddress"><?php } ?>Email Address<?php if ( $order != "emailAddress" ) { ?></a><?php } ?></th>
      </tr>
<?php
$rowCount = 0;

foreach ( $tokens as $token ) {
  $rowCount++;
?>
      <tr<?php if ( $rowCount % 2 == 0 ) echo ' class="alt"' ?>>
        <td><a href="view_token.php?tokenId=<?php echo $token->getValueEncoded( "id" ) ?>&amp;start=<?php echo $start ?>&amp;order=<?php echo $order ?>"><?php echo $token->getValueEncoded( "emailAddress" ) ?></a></td>
      </tr>
<?php
}
?>
    </table>

    <div style="width: 30em; margin-top: 20px; text-align: center;">
<?php if ( $start > 0 ) { ?>
      <a href="view_tokens.php?start=<?php echo max( $start - PAGE_SIZE, 0 ) ?>&amp;order=<?php echo $order ?>">Previous page</a>
<?php } ?>
&nbsp;
<?php if ( $start + PAGE_SIZE < $totalRows ) { ?>
      <a href="view_tokens.php?start=<?php echo min( $start + PAGE_SIZE, $totalRows ) ?>&amp;order=<?php echo $order ?>">Next page</a>
<?php } ?>
    </div>

    <br/>
    <a href="admin.php">Site Admin</a>

<?php
displayPageFooter();
?>

