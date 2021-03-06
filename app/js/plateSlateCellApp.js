/***************************************
$Revision:: 175                        $: Revision of last commit
$LastChangedBy::                       $: Author of last commit
$LastChangedDate:: 2012-01-03 14:44:48#$: Date of last commit
***************************************/


//global arrays
// tjs 131218
var portions = new Array();
var plates = new Array();
var slates = new Array();
var slateOffsetThreshold = 100;
var isPlateMasterDataInserted = 0;

// tjs 120216
var portionNames = new Array();

//global set as side effect for random choice of a plate
var plateSelectionsHtml;
var plateGrainsHtml;
var plateProteinHtml;
var plateVegetablesHtml;
var plateFruitsHtml;
var plateDairyHtml;
var selectedBreakfastPlate;
var selectedLunchPlate;
var selectedDinnerPlate;

var plateSelectionRandom = true;
var plateSelectionSeasonal = true;
var plateSelectionShared = false;
var plateSelectionReport = 'slate';
// tjs 120103 additional preferences
//TODO
//open page with bfast|lunch|dinner pref
//pref - setting reset would re-activitate inactibe plates
var slateMealPlansForDinnerOnly = false;
// tjs 120209 additional preferences
var refreshDataFromServerDefault = false;
var backupDataToServer = false;

var preferences = {
	plateSelectionRandom: true,
	plateSelectionSeasonal: true,
	plateSelectionShared: false,
	slateMealPlansForDinnerOnly: false,
	refreshDataFromServerDefault: false,
	backupDataToServer: false
};

var loginInfo = {
	id: 0,
	userName: 'unknown',
	firstName: 'firstName',
	lastName: 'lastName'
};

var weekday=new Array(7);
weekday[0]="Sunday";
weekday[1]="Monday";
weekday[2]="Tuesday";
weekday[3]="Wednesday";
weekday[4]="Thursday";
weekday[5]="Friday";
weekday[6]="Saturday";

// tjs 120113
var screenReportFontColors = new Array(10);
screenReportFontColors[0] = 0;
screenReportFontColors[1] = 20;
screenReportFontColors[2] = 40;
screenReportFontColors[3] = 60;
screenReportFontColors[4] = 80;
screenReportFontColors[5] = 100;
screenReportFontColors[6] = 120;
screenReportFontColors[7] = 140;
screenReportFontColors[8] = 160;
screenReportFontColors[9] = 180;

// tjs 120216
var debugLoopCount = 0;

// tjs 120221
var importProfile = false;

// tjs 120229
// dialog messages
var requiresLoginTitle = 'Requires Login';
var requiresLoginLine1 = 'The PlateSlate feature that you are trying to use requires that you be logged in!';
var requiresLoginLine2 = 'To become a PlateSlate registered user visit <a href="http://www.plateslate.com" data-rel="external">plateSlate.com</a> and request an invitation to register.';
var insufficientDataTitle = 'Insufficient Data';
var insufficientDataLine1 = 'The PlateSlate Web App requires several days of meal plans for meaningful reports!';
var insufficientDataLine2 = 'Before trying to view certain reports it is advisable to <i>slate</i> some <i>plate</i> plans (for a few days) using the Slates choice.';
// tjs 120301
var alertDialogMessages = new Array();
var duplicatePortionTitle = 'Duplicate Portion';
var duplicatePortionLine1;
var duplicatePortionLine2;
// tjs 120328
//var viewSlatesDows;
var viewSlatesNames;

var systemDB;

function Portion(id, type, name, description, master, isInactive) {
	this.id = id;
	this.type = type;
	this.name = name;
	this.description = description;
	this.master = master;
	this.isInactive = isInactive;
}

// tjs 131218
//function Portions(id, portion) {
//	this.id = id;
	// portion is the Portion object
//	this.portion = portion;	
//}

function Plate(id, type, name, description, master, portion1, portion2, portion3, portion4, portion5, portion6, portion7, portion8, portion9, isInactive) {
	this.id = id;
	this.type = type;
	this.name = name;
	this.description = description;
	this.master = master;
	this.portion1 = portion1;
	this.portion2 = portion2;
	this.portion3 = portion3;
	this.portion4 = portion4;
	this.portion5 = portion5;
	this.portion6 = portion6;
	this.portion7 = portion7;
	this.portion8 = portion8;
	this.portion9 = portion9;
	this.isInactive = isInactive;
}

function Slate(id, offset, date, name, description, breakfastId, lunchId, dinnerId, breakfastPortions, lunchPortions, dinnerPortions, isInactive) {
	this.id = id;
	this.offset = offset;
	this.date = date;
	this.time = Date.parse(date);
	this.name = name;
	this.description = description;
	this.breakfastId = breakfastId;
	this.lunchId = lunchId;
	this.dinnerId = dinnerId;
	// tjs 140301
	if (breakfastPortions != null)
		this.breakfastPortions = breakfastPortions;
		//this.breakfastPortions = breakfastPortions.slice(0);
	else
		this.breakfastPortions = new Array();
	if (lunchPortions != null)
		this.lunchPortions = lunchPortions;
	else
		this.lunchPortions = new Array();
	if (dinnerPortions != null)
		this.dinnerPortions = dinnerPortions;
	else
		this.dinnerPortions = new Array();
	this.isInactive = isInactive;
}

function initDB() {	 
	var title = "Not Supported";
	var paragraphs = new Array();
	try {
	    if (!window.openDatabase) {
	    	// tjs 120301
	    	paragraphs.push("The browser you are using is not HTML5 or CSS3 compliant!");
	    	paragraphs.push("The browser you need also should support client side storage.");
	    	paragraphs.push("Example browsers to use include Safari or Chrome.");
			hijaxAlertDial(title, paragraphs);
			return;
	        //alert('not supported');
	    } else {
	    	var datab;
	    	var shortName = 'plateSlate';
	    	var version = '1.0';
	    	var displayName = 'plateSlate';
	    	var maxSize = 200000;
	    	datab = openDatabase(shortName, version, displayName, maxSize);
	 	        // You should have a database instance in datab.	 
	    }
	} catch(e) {
	    // Error handling code goes here.
	    if (e == INVALID_STATE_ERR) {
	        // Version number mismatch.
	    //alert("Invalid database version.");
    	paragraphs.push("Invalid database version.");
		hijaxAlertDial(title, paragraphs);
		return;

	    } else {
	    //alert("Unknown error "+e+".");
    	paragraphs.push("Unknown error "+e+".");
		hijaxAlertDial(title, paragraphs);
		return;

	    }
	    return;
	}
	createTables(datab);
	systemDB = datab;
}

/*! This creates the database tables. */
function createTables(db) {
/* To wipe out the table (if you are still experimenting with schemas,
   for example), enable this block. */
/*
	if (0) {
    db.transaction(
        function (transaction) {
        transaction.executeSql('DROP TABLE portion;');
        transaction.executeSql('DROP TABLE plate;');
        transaction.executeSql('DROP TABLE slate;');
        transaction.executeSql('DROP TABLE food;');
        }
    );
}

db.transaction(
    function (transaction) {

			transaction.executeSql(
			'CREATE TABLE  IF NOT EXISTS portion ' +
			' (id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, ' +
			' type varchar(16), name varchar(32),  description varchar(100), master integer, isInactive integer );'
			);

			transaction.executeSql(
					'CREATE TABLE  IF NOT EXISTS plate ' +
					' (id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, ' +
					' type varchar(16), name varchar(32),  description varchar(100), master integer, portion1 integer, portion2 integer, portion3 integer, portion4 integer, portion5 integer, portion6 integer, portion7 integer, portion8 integer, portion9 integer, isInactive integer );'
					);

			transaction.executeSql(
					'CREATE TABLE  IF NOT EXISTS slate ' +
					' (id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, ' +
					' date varchar(16), name varchar(32),  description varchar(100), breakfast integer, lunch integer, dinner integer, isInactive integer );'
					);

			transaction.executeSql(
					'CREATE TABLE  IF NOT EXISTS food ' +
					' (id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, ' +
					' slate integer, type varchar(16), portion integer, master integer, isInactive integer);'
					);

    } // end function(transaction)
); // end datab.transaction
*/
}

function readPortions()
{	
	initDB();
	loadPreferences();
	
	//ensure tables are populated with master data...
	//when fully populated database then loads local cache array portions[]
	// tjs 120210
	loadPortions(true, null);
}

// tjs 131204
function loadIndexDB()
{	
	loadPreferences();
	
	//ensure tables are populated with master data...
	//when fully populated database then loads local cache array portions[]
	// tjs 120210
	// tjs 131211 temp comment out!!!
	loadObjectsFromIndexDB();
}

function loadPortions(isStatic, xml)
{
	var isPortionMasterDataInserted = false;
	var id;
	var type;
	var name;
	var description;
	var master;
	var isMaster;
	var isInactive;
	/*
	systemDB.transaction(
			function(transaction) {
				transaction.executeSql(
				'SELECT id, type, name,  description, master, isInactive FROM portion', null,
				
				function (transaction, result) {
					//alert("plateslate loadPortions result.rows.length " + result.rows.length);
					if (result.rows.length <=0) {
						isPortionMasterDataInserted = false;
						//alert("plateslate loadPortions isPortionMasterDataInserted " + isPortionMasterDataInserted);
						// tjs 120214
						if (isStatic == true) {
							populatePortion();
						} else { // wait for the transactions...
							setTimeout(function() {
								//alert('hello');
								loadPortions(isStatic, xml);
								},1250);
						}						
					} else {
						// tjs 120216
						if (isStatic == false) {
							portionNames.length = 0;
						}
						
						//alert("plateslate loadPortions result.rows.length " + result.rows.length);
						for (var i=0; i < result.rows.length; i++) {
							var row = result.rows.item(i);
							id=parseInt(row.id);
							type = row.type;
							name = row.name;
							description = row.description;
							master=parseInt(row.master);
							isInactive=parseInt(row.isInactive);
							var portion = new Portion(id, type, name, description, master, isInactive);
							//e.g. 48 test portions
							//alert("plateslate loadPortions for id " + id + " have portion name " + portion.name);
							portions[id] = portion;
							if (isStatic == false) {
								portionNames[name] = id;
							}
						}
						isPortionMasterDataInserted = true;
						//e.g. 49
						//alert("plateslate loadPortions isPortionMasterDataInserted " + isPortionMasterDataInserted + " portions length " + portions.length + " isStatic " + isStatic);
						//now that the dependent portions are stored in the database
						//and available in the cache array, portions[], load the plates that use portions...
						if (isStatic == true) {
							// tjs 120214
							//loadPlates(true);
							loadPlates(true, null);
						} else {
							// tjs 120211
							//alert("plateslate loadPortions xml length " + xml.length);
							// we are doing a restore from the server...
							// e.g. <dish type="Dinner" name="Pizza and Salad" description="BGE smoked" isMaster="0" isInactive="0">
					         //<segments><segment type="Grain" description="Irish Bread" isMaster="1" isInactive="0">Irish Bread</segment></segments>
								//var dishes = new Array();
								var dish;
								var index = 0;
								$(xml).find('dish').each(function() {
									var dish = $(this);
									type = dish.attr('type');
									name = dish.attr('name');
									description = dish.attr('description');
									isMaster = dish.attr('isMaster');
									isInactive = dish.attr('isInactive');
									var portion1 = null;
									var portion2 = null;
									var portion3 = null;
									var portion4 = null;
									var portion5 = null;
									var portion6 = null;
									var portion7 = null;
									var portion8 = null;
									var portion9 = null;
									//if (index == 0)
										//alert("plateslate loadPortions dish type " + type + " name " + name + " description " + description);
									// e.g. dish type Dinner name Pizza and Salad description BGE smoked
									var index2 = 0;
									$(this).find('segment').each(function() {
										var segmantType = $(this).attr('type');
										var segmentDescription = $(this).attr('description');
										var segmentName = $(this).text();
										//if (index2 == 0)
											//alert("plateslate loadPortions segment type " + segmantType + " name " + segmentName + " description " + segmentDescription);
										var portionId = portionNames[segmentName];
										//if (index2 == 0)
											//alert("plateslate loadPortions portionId " + portionId);
										switch (index2++) {
										case 0:
											portion1 = portionId;
											break;
										case 1:
											portion2 = portionId;
											break;
										case 2:
											portion3 = portionId;
											break;
										case 3:
											portion4 = portionId;
											break;
										case 4:
											portion5 = portionId;
											break;
										case 5:
											portion6 = portionId;
											break;
										case 6:
											portion7 = portionId;
											break;
										case 7:
											portion8 = portionId;
											break;
										case 8:
											portion9 = portionId;
											break;
										}
									});
									var plate = new Plate(index++, type, name, description, isMaster, portion1, portion2, portion3, portion4, portion5, portion6, portion7, portion8, portion9, isInactive);
									plates.push(plate);
							         //alert("plateslate doRestoreFromBackup preference type " + preferenceType + " preferenceName " + preferenceName + " preferenceValue " + preferenceValue);
								});
						         //alert("plateslate loadPortions plates length " + plates.length);
						         insertPlateMasterData(false, xml);
						         //alert("plateslate doRestoreFromBackup plates synchronized length " + plates.length);						         
						}
						//alert("plateslate loadPortions plates loaded... portions length " + portions.length);
					}
				},
				displayerrormessage
				);
			}
		);*/
	//alert("plateslate loadPortions isPortionMasterDataInserted " + isPortionMasterDataInserted);
}

function populatePortion() {
	populatePortionMasterData();
}
/*
function populatePortionMasterData() {

	var i = 1;
	var portly;
	if (portions.length > 0) {
		//alert("plateslate populatePortionMasterData portions len " + portions.length);
		portions.length = 0;
		if (plates.length > 0) {
			//alert("plateslate populatePortionMasterData plates len " + plates.length);
			plates.length = 0;
		}
		if (slates.length > 0) {
			//alert("plateslate populatePortionMasterData slates len " + slates.length);
			slates.length = 0;
		}		
	}
	
	//Grains
	portly = new Portion(i, "Grain", "Bagels", "Bagels", 1, 0);
	portions.push(portly);
	i++;
	portly = new Portion(i, "Grain", "Bran Flakes", "(Flaked Cereal)", 1, 0);
	portions.push(portly);
	i++;
	portly = new Portion(i, "Grain", "English Muffins", "English Muffins", 1, 0);
	portions.push(portly);
	i++;
	// tjs 120329
	//portly = new Portion(i, "Grain", "Irish Bread", "Irish Bread", 1, 0);
	portly = new Portion(i, "Grain", "Bread", "(Irish, Wheat)", 1, 0);
	portions.push(portly);
	i++;
	portly = new Portion(i, "Grain", "Muffins", "Muffins", 1, 0);
	portions.push(portly);
	i++;
	portly = new Portion(i, "Grain", "Pancakes", "Pancakes", 1, 0);
	portions.push(portly);
	i++;
	portly = new Portion(i, "Grain", "Pasta", "Pasta", 1, 0);
	portions.push(portly);
	i++;
	// tjs 120329
	//portly = new Portion(i, "Grain", "Pecan Buns", "Pecan Buns", 1, 0);
	portly = new Portion(i, "Grain", "Buns", "(Hot Cross, Pecan)", 1, 0);
	portions.push(portly);
	i++;
	portly = new Portion(i, "Grain", "Puffs", "(Puffed Cereal)", 1, 0);
	portions.push(portly);
	i++;
	portly = new Portion(i, "Grain", "Rice", "Rice", 1, 0);
	portions.push(portly);
	i++;
	portly = new Portion(i, "Grain", "Schredded Wheat", "(Schredded Cereal)", 1, 0);
	portions.push(portly);
	i++;
	portly = new Portion(i, "Grain", "Toast", "Toast", 1, 0);
	portions.push(portly);
	
	//Proteins
	i++;
	portly = new Portion(i, "Protein", "Bean Products", "(Baked, Green, Lima)", 1, 0);
	portions.push(portly);
	i++;
	portly = new Portion(i, "Protein", "Beef Products", "(Ground, Roast)", 1, 0);
	portions.push(portly);
	i++;
	portly = new Portion(i, "Protein", "Eggs", "Eggs", 1, 0);
	portions.push(portly);
	i++;
	portly = new Portion(i, "Protein", "Fish", "Fish", 1, 0);
	portions.push(portly);
	i++;
	portly = new Portion(i, "Protein", "Legume Products", "(Peanuts, Soy, Peanut Butter)", 1, 0);
	portions.push(portly);
	i++;
	portly = new Portion(i, "Protein", "Poultry", "(Chicken, Turkey)", 1, 0);
	portions.push(portly);
	i++;
	portly = new Portion(i, "Protein", "Pork Products", "(Bacon, Ham, Chops)", 1, 0);
	portions.push(portly);
	
	//Vegetables
	i++;
	portly = new Portion(i, "Vegetables", "Asparagus", "Asparagus", 1, 0);
	portions.push(portly);
	i++;
	portly = new Portion(i, "Vegetables", "Beets", "Beets", 1, 0);
	portions.push(portly);
	i++;
	portly = new Portion(i, "Vegetables", "Broccoli", "(Broccoli, Sprouts)", 1, 0);
	portions.push(portly);
	i++;
	portly = new Portion(i, "Vegetables", "Brussel Sprouts", "(Cabbage, Kale, Sprouts)", 1, 0);
	portions.push(portly);
	// tjs 120329
	i++;
	portly = new Portion(i, "Vegetables", "Carrots", "Carrots", 1, 0);
	portions.push(portly);
	i++;
	portly = new Portion(i, "Vegetables", "Cauliflower", "(Cauliflower)", 1, 0);
	portions.push(portly);
	i++;
	portly = new Portion(i, "Vegetables", "Celery", "Celery", 1, 0);
	portions.push(portly);
	i++;
	portly = new Portion(i, "Vegetables", "Corn", "Corn", 1, 0);
	portions.push(portly);
	i++;
	// tjs 120329
	//portly = new Portion(i, "Vegetables", "Cucomber", "(Cukes, Pickles, Zukini)", 1, 0);
	portly = new Portion(i, "Vegetables", "Cucumber", "(Cukes, Pickles)", 1, 0);
	portions.push(portly);
	i++;
	// tjs 120329
	//portly = new Portion(i, "Vegetables", "Leafy Produce", "Leafy Produce", 1, 0);
	portly = new Portion(i, "Vegetables", "Leafy Produce", "(Boston, Crisp, Iceberg Leaf, Romaine)", 1, 0);
	portions.push(portly);
	i++;
	portly = new Portion(i, "Vegetables", "Onions", "(Garlic, Onions)", 1, 0);
	portions.push(portly);
	i++;
	portly = new Portion(i, "Vegetables", "Peas", "Peas", 1, 0);
	portions.push(portly);
	i++;
	portly = new Portion(i, "Vegetables", "Peppers", "(Green, Orange, Red, White, Yellow)", 1, 0);
	portions.push(portly);
	i++;
	portly = new Portion(i, "Vegetables", "Potatos", "Potatos", 1, 0);
	portions.push(portly);
	i++;
	// tjs 120329
	portly = new Portion(i, "Vegetables", "Squash", "(Acorn, Summer, Zucchini)", 1, 0);
	portions.push(portly);
	i++;
	portly = new Portion(i, "Vegetables", "Radishes", "Radishes", 1, 0);
	portions.push(portly);
	i++;
	portly = new Portion(i, "Vegetables", "Tomatoes", "(Beefsteak, Cherry, Plum)", 1, 0);
	portions.push(portly);
	
	//Fruits
	i++;
	portly = new Portion(i, "Fruits", "Apples", "Apples", 1, 0);
	portions.push(portly);
	i++;
	portly = new Portion(i, "Fruits", "Apricots", "Apricots", 1, 0);
	portions.push(portly);
	i++;
	portly = new Portion(i, "Fruits", "Bananas", "Bananas", 1, 0);
	portions.push(portly);
	i++;
	portly = new Portion(i, "Fruits", "Berries", "(Blueberry, Cranberry, Rasberry)", 1, 0);
	portions.push(portly);
	i++;
	portly = new Portion(i, "Fruits", "Cherries", "Cherries", 1, 0);
	portions.push(portly);
	i++;
	portly = new Portion(i, "Fruits", "Citrous", "(Clementines, Grapefruit, Oranges)", 1, 0);
	portions.push(portly);
	i++;
	portly = new Portion(i, "Fruits", "Grapes", "(Grapes, Raisins)", 1, 0);
	portions.push(portly);
	i++;
	portly = new Portion(i, "Fruits", "Peaches", "(Peaches, Nectarines)", 1, 0);
	portions.push(portly);
	i++;
	portly = new Portion(i, "Fruits", "Pears", "Pears", 1, 0);
	portions.push(portly);
	i++;
	portly = new Portion(i, "Fruits", "Plums", "(Plums, Prunes)", 1, 0);
	portions.push(portly);

	//Dairy
	i++;
	portly = new Portion(i, "Dairy", "Cheese", "Cheese", 1, 0);
	portions.push(portly);
	i++;
	portly = new Portion(i, "Dairy", "Ice Cream", "Ice Cream", 1, 0);
	portions.push(portly);
	i++;
	portly = new Portion(i, "Dairy", "Milk", "Milk", 1, 0);
	portions.push(portly);
	i++;
	portly = new Portion(i, "Dairy", "Yogurt", "Yogurt", 1, 0);
	portions.push(portly);
	
	// tjs 120216
	insertPortionMasterData(true, null);
}*/
/*
function insertPortionMasterData(isStatic, xml) {
	var len = portions.length;
	var i = 0;
	//alert("plateslate insertPortionMasterData len " + len);
	while (i < len) {
		var portion = portions[i++];
		addToPortion(portion);
	}
	portions.length = 0;
	//alert ("insertPortionMasterData isStatic " + isStatic + " i " + i);
	loadPortions(isStatic, xml);
}*/

/*
function addToPortion(portion) {
	//alert("plateslate addToPortion type " + portion.type + " name " + portion.name + " desc " + portion.description + " master " + portion.master + " isInactive? " + portion.isInactive);
			systemDB.transaction(
				function(transaction) {
					transaction.executeSql(
							'SELECT id, type, name,  description, master, isInactive FROM portion where name=?;',[portion.name],

					function (transaction, result) {
					if (result.rows.length >0) {
						var row = result.rows.item(0);

						systemDB.transaction(
							function(transaction) {
								transaction.executeSql(
										// tjs 120227
								'update portion set type=?, description=?, isInactive=? where name=?;',
								[portion.type, portion.description, portion.isInactive, portion.name],
								function(){
									//trxDone('update via add');
									//alert("plateslate addToPortion updated: type " + portion.type + " name " + portion.name + " desc " + portion.description + " master " + portion.master + " isInactive? " + portion.isInactive);
								},
								displayerrormessage
								);
							}
						);
					} else {
						//alert("plateslate addToPortion inserting: type " + portion.type + " name " + portion.name + " desc " + portion.description + " master " + portion.master + " isInactive? " + portion.isInactive);
						systemDB.transaction(
							function(transaction) {
							transaction.executeSql(
							'INSERT INTO portion (type, name,  description, master, isInactive) VALUES (?,?,?,?,?);',
							[portion.type, portion.name, portion.description, portion.master, portion.isInactive],
							function(){
								//trxDone('add');
								//alert("plateslate addToPortion added: type " + portion.type + " name " + portion.name + " desc " + portion.description + " master " + portion.master + " isInactive? " + portion.isInactive);
							},
							displayerrormessage
							);
							}
						);
					}
				}
				);
			}
			);
	}
*/
// tjs 131213
function addToPortion(portion) {
	modifyPortions(portion);
	//alert("plateslate addToPortion type " + portion.type + " name " + portion.name + " desc " + portion.description + " master " + portion.master + " isInactive? " + portion.isInactive);
			/*systemDB.transaction(
				function(transaction) {
					transaction.executeSql(
							'SELECT id, type, name,  description, master, isInactive FROM portion where name=?;',[portion.name],

					function (transaction, result) {
					if (result.rows.length >0) {
						var row = result.rows.item(0);

						systemDB.transaction(
							function(transaction) {
								transaction.executeSql(
										// tjs 120227
								'update portion set type=?, description=?, isInactive=? where name=?;',
								[portion.type, portion.description, portion.isInactive, portion.name],
								function(){
									//trxDone('update via add');
									//alert("plateslate addToPortion updated: type " + portion.type + " name " + portion.name + " desc " + portion.description + " master " + portion.master + " isInactive? " + portion.isInactive);
								},
								displayerrormessage
								);
							}
						);
					} else {
						//alert("plateslate addToPortion inserting: type " + portion.type + " name " + portion.name + " desc " + portion.description + " master " + portion.master + " isInactive? " + portion.isInactive);
						systemDB.transaction(
							function(transaction) {
							transaction.executeSql(
							'INSERT INTO portion (type, name,  description, master, isInactive) VALUES (?,?,?,?,?);',
							[portion.type, portion.name, portion.description, portion.master, portion.isInactive],
							function(){
								//trxDone('add');
								//alert("plateslate addToPortion added: type " + portion.type + " name " + portion.name + " desc " + portion.description + " master " + portion.master + " isInactive? " + portion.isInactive);
							},
							displayerrormessage
							);
							}
						);
					}
				}
				);
			}
			);*/
	}

function getPortionByName(name) {
	// tjs 131218 ?? keep
	
	var len = portions.length;
	for (var i = 0; i < len; i++) {
		var portion = portions[i];
		if (portion != null && name == portion.name) {
			return portion;
		}
	} 
	
	portion = new Portion(0, 'unknown', 'unknown', 'unknown', 0, 1);
	return portion;
}

// tjs 131218
function getPortionById(id) {
	// tjs 140117
	// use the DB directly rather than the array cache...
	//return getPortionByIdDB(id);
	
	// tjs 131218 ?? keep	
	var len = portions.length;
	for (var i = 0; i < len; i++) {
		var portion = portions[i];
		if (portion != null && id == portion.id) {
			return portion;
		}
	} 
	portion = new Portion(0, 'unknown', 'unknown', 'unknown', 0, 1);
	return portion;
}

//tjs 131219
function getPlateById(id) {
	var len = plates.length;
	for (var i = 0; i < len; i++) {
		var plate = plates[i];
		if (plate != null && id == plate.id) {
			return plate;
		}
	} 
	
	plate = new Plate(0, 'unknown', 'unknown', 'unknown', 0, null, null, null, null, null, null, null, null, null, 1);
	return plate;
}

// tjs 120211
function loadPlates(isStatic, xml)
{
	var isPlateMasterDataInserted = false;
	var id;
	var type;
	var name;
	var description;
	var master;
	var portion1;
	var portion2;
	var portion3;
	var portion4;
	var portion5;
	var portion6;
	var portion7;
	var portion8;
	var portion9;
	var isInactive;
	// tjs 120213
	var plateNames = new Array();
	/*
	systemDB.transaction(
			function(transaction) {
				transaction.executeSql(
				'SELECT id, type, name,  description, master, portion1, portion2, portion3, portion4, portion5, portion6, portion7, portion8, portion9, isInactive FROM plate', null,
				
				function (transaction, result) {
					//alert("plateslate loadPlates result.rows.length " + result.rows.length);
					if (result.rows.length <=0) {
						isPlateMasterDataInserted = false;
						//alert("plateslate loadPlates isPlateMasterDataInserted " + isPlateMasterDataInserted);
						// tjs 120214
						if (isStatic == true) {
							populatePlate();
						} else { // wait for the transactions...
							setTimeout(function() {
								//alert('hello');
								loadPlates(isStatic, xml);
								},1250);							
						}
						//e.g. test data 40 plates
					} else {
						for (var i=0; i < result.rows.length; i++) {
							var row = result.rows.item(i);
							id=parseInt(row.id);
							type = row.type;
							name = row.name;
							description = row.description;
							master=parseInt(row.master);
							portion1=parseInt(row.portion1);
							portion2=parseInt(row.portion2);
							portion3=parseInt(row.portion3);
							portion4=parseInt(row.portion4);
							portion5=parseInt(row.portion5);
							portion6=parseInt(row.portion6);
							portion7=parseInt(row.portion7);
							portion8=parseInt(row.portion8);
							portion9=parseInt(row.portion9);
							isInactive=parseInt(row.isInactive);
							var plate = new Plate(id, type, name, description, master, portion1, portion2, portion3, portion4, portion5, portion6, portion7, portion8, portion9, isInactive);
							//alert("plateslate loadPlates for id " + id + " have plate name " + plate.name);
							//alert("plateslate loadPlates for id " + id + " have plate name " + plate.name + " type " + type + " portion1 " + portion1);
							plates[id] = plate;
							// tjs 120213
							if (isStatic == false) {
								plateNames[plate.name] = id;
							}
						}
						isPlateMasterDataInserted = true;
						// e.g. 41
						//alert("plateslate loadPlates isPlateMasterDataInserted " + isPlateMasterDataInserted + " plates len " + plates.length + " isStatic " + isStatic);
						//now that the dependent plates are stored in the database
						//and available in the cache array, plates[], load the slates that use plates...
						if (isStatic == true) {
							truncateSlates();
						} else {
							// tjs 120211
							// we are doing a restore...
					         // at this point portions and plates are restored.  The slated plates (i.e. menu plans) are empty
					         // but the app could be used in the empty state and new slates can be added.
							// TBD should this be a preference?
							// we need to restore the slates at this point...
							//alert ("plateSlateCellApp loadPlates plateNames length " + plateNames.length);
							var breakfastId;
							var lunchId;
							var dinnerId;
							var breakfastPortions;
							var lunchPortions;
							var dinnerPortions;
							$(xml).find('slate').each(function() {
								var slate = $(this);
								var slateName = slate.attr('name'); // e.g. February 6, 2012
								var slateDescription = slate.attr('dow'); // description is the day of the week, e.g. Monday
								var slateDate = new Date(slateName);
								slateDate.setHours(0, 0, 0, 0);
								//alert ("plateSlateCellApp loadPlates slateName " + slateName + " date " + slateDate);
						         //alert("plateslate loadPlates name " + date + " dow " + dow);
								$(this).find('plate').each(function() {
									var plate = $(this);
									var name = plate.attr('name');
									var type = plate.attr('type');
									//alert ("plateSlateCellApp loadPlates plateName " + name + " type " + type);
									var plateId = plateNames[name];
									//if (0 == debugLoopCount%10) {
									//	alert ("plateSlateCellApp loadPlates debugLoopCount " + debugLoopCount + " plateId " + plateId + " slateName " + slateName);
										// e.g. plateSlateCellApp loadPlates debugLoopCount 0 plateId 676 slateName January 14, 2012
									//}
									if (type == "Breakfast") {
										breakfastId = plateId;
										breakfastPortions = new Array();
									}
									else if (type == "Lunch") {
										lunchId = plateId;
										lunchPortions = new Array();
									}
									// tjs 120217
									//else {
									else if (type == "Dinner") {
										dinnerId = plateId;
										dinnerPortions = new Array();
									}
									
									$(this).find('portion').each(function() {
										var portion = $(this);
										var portionName = $(this).text();
										//if (0 == debugLoopCount%10) {
										//	alert ("plateSlateCellApp loadPlates debugLoopCount " + debugLoopCount + " portionName " + portionName);
											// e.g. plateSlateCellApp loadPlates debugLoopCount 0 portionName Bran Flakes
										//}
										var portionId = portionNames[portionName];
										//if (0 == debugLoopCount%10) {
										//	alert ("plateSlateCellApp loadPlates debugLoopCount " + debugLoopCount + " plate name " + name + " portionId " + portionId + " slateName " + slateName);
										//}
										//debugLoopCount++;
										if (type == "Breakfast") {
											breakfastPortions.push(portionId);
										}
										else if (type == "Lunch") {
											lunchPortions.push(portionId);
										}
										//else {
										else if (type == "Dinner") {
											dinnerPortions.push(portionId);
										}
									}); // end loop through portions
								}); // end finding plates in the current slate to get plateIds
								insertRestoredSlate(slateDate, slateName, slateDescription, breakfastId, lunchId, dinnerId, breakfastPortions, lunchPortions, dinnerPortions);
							}); // end finding slates in the xml
							setTimeout(function() {
								//alert('hello');
								restoreSlatesCompleted();
								// tjs 120217
							//},1250);														
								},2250);														
						} // end not isStatic 
						//alert("plateslate loadPlates slates loaded... plates len " + plates.length);
					}
				},
				displayerrormessage
				);
			}
		);*/
	//alert("plateslate loadPlates isPlateMasterDataInserted " + isPlateMasterDataInserted);
}

// tjs 131217 TBD if needed...
// tjs 120214
function insertRestoredSlate(slateDate, slateName, slateDescription, breakfastId, lunchId, dinnerId, breakfastPortions, lunchPortions, dinnerPortions) {
	var slateId = 0;
	//alert ("plateSlateCellApp insertRestoredSlate slateName " + slateName + " date " + slateDate + " breakfastId " + breakfastId + " lunchId " + lunchId + " dinnerId " + dinnerId + " bportlen " + breakfastPortions.length  + " lportlen " + lunchPortions.length + " dportlen " + dinnerPortions.length);
	systemDB.transaction(
			function(transaction) {
				transaction.executeSql(
						'INSERT INTO slate (date, name,  description, breakfast, lunch, dinner, isInactive) VALUES (?,?,?,?,?,?,?);',
						[slateDate, slateName, slateDescription, breakfastId, lunchId, dinnerId, 0],
						//function(){
			//trxDone('add');
			//alert("plateslate addToPortion added: type " + portion.type + " name " + portion.name + " desc " + portion.description + " master " + portion.master + " isInactive? " + portion.isInactive);
						//},
						//displayerrormessage
			            function (transaction, result) {
			                if (!result.rowsAffected) {
			                    // Previous insert failed. Bail.
			                    //alert('plateSlateCellApp insertRestoredSlate No rows affected!');
			                    return false;
			                }
			                //id=parseInt(row.id);
			                slateId = parseInt(result.insertId);
			                //alert('plateSlateCellApp insertRestoredSlate slateId ' + slateId);
			                var type = "Breakfast";
			                var portionId;
			                for (var i = 0; i < breakfastPortions.length; i++) {
			                	portionId = breakfastPortions[i];
			                	insertSlateFoodPortion(slateId, type, portionId, 1);
			                }
			                type = "Lunch";
			                for (var i = 0; i < lunchPortions.length; i++) {
			                	portionId = lunchPortions[i];
			                	insertSlateFoodPortion(slateId, type, portionId, 1);
			                }
			                type = "Dinner";
			                for (var i = 0; i < dinnerPortions.length; i++) {
			                	portionId = dinnerPortions[i];
			                	insertSlateFoodPortion(slateId, type, portionId, 1);
			                }
						} // end function trx result
				); //end trx sql
			}	//end function trx		
	);	//end system trx	
}

function restoreSlatesCompleted() {
	// tjs 120221
	if (importProfile == true) {
	    //$("#login-dial").dialog("close");
		$.mobile.changePage('#home-page');
	} else {
	// tjs 120214
		$('.loginLogout').children('.ui-btn-inner').children('.ui-btn-text').text("Logout");
		//$("#login-dial").dialog("close");
		// tjs 120402
	    $.mobile.changePage( $('#home-page'), { transition: 'fade'} );
		// tjs 120403
		//$('.ui-dialog').dialog('close');
	}
	// the database for slates, foods is now restored, next load the cache arrays
	truncateSlates();
}

function populatePlate() {
	// tjs 120210
	populatePlateMasterData();
}

//function populatePlateMasterData() {
function populatePlateMasterData() {

	var i = 1;
	var dish;
	var portion1;
	var portion2;
	var portion3;
	var portion4;
	var portion5;
	var portion6;
	var portion7;
	var portion8;
	var portion9;
	
	if (plates.length > 0) {
		//alert("plateslate populatePlateMasterData plates len " + plates.length);
		plates.length = 0;
	}
	
	//Breakfast
	portion1 = getPortionByName('Schredded Wheat');
	//alert("plateslate populatePlateMasterData portion1 id " + portion1.id);
	portion2 = getPortionByName('Bananas');
	portion3 = getPortionByName('Milk');
	portion4 = getPortionByName('Muffins');
	dish = new Plate(i, "Breakfast", "Schred-n-Bread", "Cereal, Fruit, etc.", 1, portion1.id, portion2.id, portion3.id, portion4.id, null, null, null, null, null, 0);
	plates.push(dish);
	i++;
	portion1 = getPortionByName('Bran Flakes');
	portion2 = getPortionByName('Grapes');
	portion3 = getPortionByName('Milk');
	portion4 = getPortionByName('Muffins');
	dish = new Plate(i, "Breakfast", "Flakes-n-Bakes", "Cereal, Fruit, etc.", 1, portion1.id, portion2.id, portion3.id, portion4.id, null, null, null, null, null, 0);
	plates.push(dish);
	i++;
	portion1 = getPortionByName('Puffs');
	portion2 = getPortionByName('Berries');
	portion3 = getPortionByName('Milk');
	portion4 = getPortionByName('Muffins');
	dish = new Plate(i, "Breakfast", "Puffs-n-Stuff", "Cereal, Fruit, etc.", 1, portion1.id, portion2.id, portion3.id, portion4.id, null, null, null, null, null, 0);
	plates.push(dish);
	i++;
	portion1 = getPortionByName('Eggs');
	portion2 = getPortionByName('Toast');
	dish = new Plate(i, "Breakfast", "Eggs", "Eggs", 1, portion1.id, portion2.id, null, null, null, null, null, null, null, 0);
	plates.push(dish);
	i++;
	dish = new Plate(i, "Breakfast", "Sleep-Late", "No Breakfast!", 1, null, null, null, null, null, null, null, null, null, 0);
	plates.push(dish);
	i++;
	
	//Lunch
	portion1 = getPortionByName('Leafy Produce');
	portion2 = getPortionByName('Cucomber');
	portion3 = getPortionByName('Onions');
	portion4 = getPortionByName('Radishes');
	portion5 = getPortionByName('Tomatoes');
	portion6 = getPortionByName('Eggs');
	dish = new Plate(i, "Lunch", "Chef Salad", "(with hard cooked egg)", 1, portion1.id, portion2.id, portion3.id, portion4.id, portion5.id, portion6.id, null, null, null, 0);
	plates.push(dish);
	i++;
	portion1 = getPortionByName('Irish Bread');
	portion2 = getPortionByName('Pork Products');
	portion3 = getPortionByName('Cheese');
	portion4 = getPortionByName('Apples');
	dish = new Plate(i, "Lunch", "Ham Sandwich", "(with fruit)", 1, portion1.id, portion2.id, portion3.id, portion4.id, null, null, null, null, null, 0);
	plates.push(dish);
	i++;
	portion1 = getPortionByName('Irish Bread');
	portion2 = getPortionByName('Pork Products');
	portion3 = getPortionByName('Cheese');
	portion4 = getPortionByName('Apples');
	dish = new Plate(i, "Lunch", "Grilled Cheese", "(with fruit)", 1, portion1.id, portion2.id, portion3.id, portion4.id, null, null, null, null, null, 0);
	plates.push(dish);
	i++;
	portion1 = getPortionByName('Irish Bread');
	portion2 = getPortionByName('Legeume Products');
	portion3 = getPortionByName('Berries');
	portion4 = getPortionByName('Apples');
	dish = new Plate(i, "Lunch", "PB Sandwich", "(with fruit)", 1, portion1.id, portion2.id, portion3.id, portion4.id, null, null, null, null, null, 0);
	plates.push(dish);
	i++;
	portion1 = getPortionByName('Pasta');
	portion2 = getPortionByName('Tomatoes');
	portion3 = getPortionByName('Toast');
	portion4 = getPortionByName('Apples');
	dish = new Plate(i, "Lunch", "Soup-n-Crackers", "(with fruit)", 1, portion1.id, portion2.id, portion3.id, portion4.id, null, null, null, null, null, 0);
	plates.push(dish);
	i++;
	portion1 = getPortionByName('Irish Bread');
	portion2 = getPortionByName('Fish');
	portion3 = getPortionByName('Celery');
	portion4 = getPortionByName('Cucomber');
	portion5 = getPortionByName('Apples');
	dish = new Plate(i, "Lunch", "TunaFish-n-Pita", "(with fruit)", 1, portion1.id, portion2.id, portion3.id, portion4.id, portion5.id, null, null, null, null, 0);
	plates.push(dish);
	i++;
	portion1 = getPortionByName('Irish Bread');
	portion2 = getPortionByName('Poultry');
	portion3 = getPortionByName('Leafy Produce');
	portion4 = getPortionByName('Apples');
	dish = new Plate(i, "Lunch", "Turkey Sandwich", "(with fruit)", 1, portion1.id, portion2.id, portion3.id, portion4.id, null, null, null, null, null, 0);
	plates.push(dish);
	i++;
	dish = new Plate(i, "Lunch", "Skip-Lunch", "Too Busy!", 1, null, null, null, null, null, null, null, null, null, 0);
	plates.push(dish);
	i++;
	
	//Dinner
	portion1 = getPortionByName('Pasta');
	portion2 = getPortionByName('Beef Products');
	portion3 = getPortionByName('Onions');
	portion4 = getPortionByName('Tomatoes');
	dish = new Plate(i, "Dinner", "American Chop Suey", "", 1, portion1.id, portion2.id, portion3.id, portion4.id, null, null, null, null, null, 0);
	plates.push(dish);
	i++;
	portion1 = getPortionByName('Beef Products');
	portion2 = getPortionByName('Potatos');
	portion3 = getPortionByName('Squash');
	//portion4 = getPortionByName('');
	dish = new Plate(i, "Dinner", "BeefRoast-w-PotVeg", "", 1, portion1.id, portion2.id, portion3.id, null, null, null, null, null, null, 0);
	plates.push(dish);
	i++;
	portion1 = getPortionByName('Beef Products');
	portion2 = getPortionByName('Potatos');
	portion3 = getPortionByName('Onions');
	portion4 = getPortionByName('Squash');
	dish = new Plate(i, "Dinner", "Beef Stew", "", 1, portion1.id, portion2.id, portion3.id, portion4.id, null, null, null, null, null, 0);
	plates.push(dish);
	i++;
	portion1 = getPortionByName('Poultry');
	portion2 = getPortionByName('Rice');
	portion3 = getPortionByName('Squash');
	//portion4 = getPortionByName('');
	dish = new Plate(i, "Dinner", "BakeChic-w-RiceVeg", "", 1, portion1.id, portion2.id, portion3.id, null, null, null, null, null, null, 0);
	plates.push(dish);
	i++;
	portion1 = getPortionByName('Poultry');
	portion2 = getPortionByName('Rice');
	portion3 = getPortionByName('Squash');
	//portion4 = getPortionByName('');
	dish = new Plate(i, "Dinner", "GrillChic-w-RiceVeg", "", 1, portion1.id, portion2.id, portion3.id, null, null, null, null, null, null, 0);
	plates.push(dish);
	i++;
	portion1 = getPortionByName('Poultry');
	portion2 = getPortionByName('Rice');
	portion3 = getPortionByName('Cheese');
	portion4 = getPortionByName('Squash');
	dish = new Plate(i, "Dinner", "ChicParm-w-RiceVeg", "", 1, portion1.id, portion2.id, portion3.id, portion4.id, null, null, null, null, null, 0);
	plates.push(dish);
	i++;
	portion1 = getPortionByName('Poultry');
	portion2 = getPortionByName('Potatos');
	portion3 = getPortionByName('Onions');
	portion4 = getPortionByName('Squash');
	dish = new Plate(i, "Dinner", "ChicPotPie", "", 1, portion1.id, portion2.id, portion3.id, portion4.id, null, null, null, null, null, 0);
	plates.push(dish);
	i++;
	portion1 = getPortionByName('Poultry');
	portion2 = getPortionByName('Rice');
	portion3 = getPortionByName('Squash');
	//portion4 = getPortionByName('');
	dish = new Plate(i, "Dinner", "ChicRotiss-w-RiceVeg", "", 1, portion1.id, portion2.id, portion3.id, null, null, null, null, null, null, 0);
	plates.push(dish);
	i++;
	portion1 = getPortionByName('Corn');
	portion2 = getPortionByName('Milk');
	portion3 = getPortionByName('Potatos');
	//portion4 = getPortionByName('');
	dish = new Plate(i, "Dinner", "Corn Chowder", "", 1, portion1.id, portion2.id, portion3.id, null, null, null, null, null, null, 0);
	plates.push(dish);
	i++;
	portion1 = getPortionByName('Fish');
	portion2 = getPortionByName('Rice');
	portion3 = getPortionByName('Asparagas');
	//portion4 = getPortionByName('');
	dish = new Plate(i, "Dinner", "Haddock-w-RiceVeg", "", 1, portion1.id, portion2.id, portion3.id, null, null, null, null, null, null, 0);
	plates.push(dish);
	i++;
	portion1 = getPortionByName('Beef Products');
	portion2 = getPortionByName('Leafy Produce');
	portion3 = getPortionByName('Cucomber');
	portion4 = getPortionByName('Radishes');
	portion5 = getPortionByName('Tomatoes');
	dish = new Plate(i, "Dinner", "Hamburg-w-Salad", "", 1, portion1.id, portion2.id, portion3.id, portion4.id, portion5.id, null, null, null, null, 0);
	plates.push(dish);
	i++;
	portion1 = getPortionByName('Pork Products');
	portion2 = getPortionByName('Rice');
	portion3 = getPortionByName('Brussel Sprouts');
	//portion4 = getPortionByName('');
	dish = new Plate(i, "Dinner", "Ham Steak-w-RiceVeg", "", 1, portion1.id, portion2.id, portion3.id, null, null, null, null, null, null, 0);
	plates.push(dish);
	i++;
	portion1 = getPortionByName('Beef Products');
	portion2 = getPortionByName('Bean Products');
	portion3 = getPortionByName('Muffins');
	//portion4 = getPortionByName('');
	dish = new Plate(i, "Dinner", "HotDog-w-Beans", "", 1, portion1.id, portion2.id, portion3.id, null, null, null, null, null, null, 0);
	plates.push(dish);
	i++;
	portion1 = getPortionByName('Pasta');
	portion2 = getPortionByName('Beef Products');
	portion3 = getPortionByName('Tomatoes');
	//portion4 = getPortionByName('');
	dish = new Plate(i, "Dinner", "ItalianLasagna", "", 1, portion1.id, portion2.id, portion3.id, null, null, null, null, null, null, 0);
	plates.push(dish);
	i++;
	portion1 = getPortionByName('Pasta');
	portion2 = getPortionByName('Cheese');
	portion3 = getPortionByName('Beef Products');
	//portion4 = getPortionByName('');
	dish = new Plate(i, "Dinner", "Mac-n-Cheese-w-HotDog", "", 1, portion1.id, portion2.id, portion3.id, null, null, null, null, null, null, 0);
	plates.push(dish);
	i++;
	portion1 = getPortionByName('Beef Products');
	portion2 = getPortionByName('Eggs');
	portion3 = getPortionByName('Irish Bread');
	portion4 = getPortionByName('Potatos');
	portion5 = getPortionByName('Brussel Sprouts');
	dish = new Plate(i, "Dinner", "Meatloaf-w-PotVeg", "", 1, portion1.id, portion2.id, portion3.id, portion4.id, portion5.id, null, null, null, null, 0);
	plates.push(dish);
	i++;
	portion1 = getPortionByName('Pork Products');
	portion2 = getPortionByName('Peas');
	dish = new Plate(i, "Dinner", "Pea Soup-w-Ham", "", 1, portion1.id, portion2.id, null, null, null, null, null, null, null, 0);
	plates.push(dish);
	i++;
	portion1 = getPortionByName('Pork Products');
	portion2 = getPortionByName('Potatos');
	portion3 = getPortionByName('Brussel Sprouts');
	dish = new Plate(i, "Dinner", "Pork Chops-w-PotVeg", "", 1, portion1.id, portion2.id, portion3.id, null, null, null, null, null, null, 0);
	plates.push(dish);
	i++;
	portion1 = getPortionByName('Pasta');
	portion2 = getPortionByName('Beef Products');
	portion3 = getPortionByName('Eggs');
	portion4 = getPortionByName('Tomatoes');
	dish = new Plate(i, "Dinner", "ItalianRavioli", "", 1, portion1.id, portion2.id, portion3.id, portion4.id, null, null, null, null, null, 0);
	plates.push(dish);
	i++;
	portion1 = getPortionByName('Pork Products');
	portion2 = getPortionByName('Eggs');
	portion3 = getPortionByName('Toast');
	dish = new Plate(i, "Dinner", "Salami-n-Eggs-w-Toast", "", 1, portion1.id, portion2.id, portion3.id, null, null, null, null, null, null, 0);
	plates.push(dish);
	i++;
	portion1 = getPortionByName('Pork Products');
	portion2 = getPortionByName('Peppers');
	portion3 = getPortionByName('Onions');
	dish = new Plate(i, "Dinner", "Sausage-w-Pepper-n-Onion", "", 1, portion1.id, portion2.id, portion3.id, null, null, null, null, null, null, 0);
	plates.push(dish);
	i++;
	portion1 = getPortionByName('Beef Products');
	portion2 = getPortionByName('Potatos');
	portion3 = getPortionByName('Corn');
	dish = new Plate(i, "Dinner", "Shepards Pie", "", 1, portion1.id, portion2.id, portion3.id, null, null, null, null, null, null, 0);
	plates.push(dish);
	i++;
	portion1 = getPortionByName('Pasta');
	portion2 = getPortionByName('Beef Products');
	portion3 = getPortionByName('Eggs');
	portion4 = getPortionByName('Tomatoes');
	dish = new Plate(i, "Dinner", "ItalianSpaghetti", "", 1, portion1.id, portion2.id, portion3.id, portion4.id, null, null, null, null, null, 0);
	plates.push(dish);
	i++;
	portion1 = getPortionByName('Beef Products');
	portion2 = getPortionByName('Potatos');
	portion3 = getPortionByName('Squash');
	dish = new Plate(i, "Dinner", "Steak-w-PotVeg", "", 1, portion1.id, portion2.id, portion3.id, null, null, null, null, null, null, 0);
	plates.push(dish);
	i++;
	portion1 = getPortionByName('Beef Products');
	portion2 = getPortionByName('Rice');
	portion3 = getPortionByName('Onions');
	portion4 = getPortionByName('Peppers');
	dish = new Plate(i, "Dinner", "Stuffed Peppers", "", 1, portion1.id, portion2.id, portion3.id, portion4.id, null, null, null, null, null, 0);
	plates.push(dish);
	i++;
	portion1 = getPortionByName('Beef Products');
	portion2 = getPortionByName('Potatos');
	portion3 = getPortionByName('Eggs');
	portion4 = getPortionByName('Squash');
	dish = new Plate(i, "Dinner", "SwedishMBalls-w-MashPotVeg", "", 1, portion1.id, portion2.id, portion3.id, portion4.id, null, null, null, null, null, 0);
	plates.push(dish);
	i++;
	portion1 = getPortionByName('Poultry');
	portion2 = getPortionByName('Leafy Produce');
	portion3 = getPortionByName('Cheese');
	portion4 = getPortionByName('Corn');
	dish = new Plate(i, "Dinner", "Tacos", "", 1, portion1.id, portion2.id, portion3.id, portion4.id, null, null, null, null, null, 0);
	plates.push(dish);
	i++;
	portion1 = getPortionByName('Pasta');
	portion2 = getPortionByName('Fish');
	dish = new Plate(i, "Dinner", "Tuna Noodle Caserole", "", 1, portion1.id, portion2.id, null, null, null, null, null, null, null, 0);
	plates.push(dish);
	i++;
	portion1 = getPortionByName('Poultry');
	portion2 = getPortionByName('Potatos');
	portion3 = getPortionByName('Corn');
	dish = new Plate(i, "Dinner", "Turkey-w-PotVeg", "", 1, portion1.id, portion2.id, portion3.id, null, null, null, null, null, null, 0);
	plates.push(dish);
	i++;
	dish = new Plate(i, "Dinner", "Eat-Out", "Potpourri!", 1, null, null, null, null, null, null, null, null, null, 0);
	plates.push(dish);
	i++;
	
	// tjs 120214
	//insertPlateMasterData();
	insertPlateMasterData(true, null, null);
}

function insertPlateMasterData(isStatic, xml) {
	var len = plates.length;
	var i = 0;
	//e.g. 41
	//alert("plateslate insertPlateMasterData len " + len);
	while (i < len) {
		var plate = plates[i++];
		addToPlate(plate);
	}
	if (isStatic == false) {
		plates.length = 0;
	}
	loadPlates(isStatic, xml);
}

function addToPlate(plate) {
	// tjs 131213
	modifyPlates(plate, portions);
	// NB portions cache global
	//modifyPlates(plate, Portions);
	/*
	//alert("plateslate addToPlate type " + plate.type + " name " + plate.name + " desc " + plate.description + " portion1 " + plate.portion1 + " portion2 " + plate.portion2 + " portion3 " + plate.portion3 + " portion4 " + plate.portion4 + " portion5 " + plate.portion5 + " portion6 " + plate.portion6 + " portion7 " + plate.portion7 + " portion8 " + plate.portion8 + " portion9 " + plate.portion9);
			systemDB.transaction(
				function(transaction) {
					transaction.executeSql(
					//'SELECT cart_sess, cart_sku,  cart_item_name, cart_qty, cart_price FROM shopcart where cart_sess=? and cart_sku=?;',[sid, sku],
						'SELECT id, type, name,  description, master, portion1, portion2, portion3, portion4, portion5, portion6, portion7, portion8, portion9, isInactive FROM plate where name=?;',[plate.name],

						function (transaction, result) {
							if (result.rows.length >0) {
								var row = result.rows.item(0);

								systemDB.transaction(
										function(transaction) {
											transaction.executeSql(
													'update plate set type=?, description=?, portion1=?, portion2=?, portion3=?, portion4=?, portion5=?, portion6=?, portion7=?, portion8=?, portion9=?, isInactive=? where name=?;',
													[plate.type, plate.description, plate.portion1, plate.portion2, plate.portion3, plate.portion4, plate.portion5, plate.portion6, plate.portion7, plate.portion8, plate.portion9, plate.isInactive, plate.name],
													function(){
														//trxDone('update via add');
														//alert("plateslate addToPortion updated: type " + portion.type + " name " + portion.name + " desc " + portion.description + " master " + portion.master + " isInactive? " + portion.isInactive);
													},
													displayerrormessage
											);
										}
								);
							} else {
								//alert("plateslate addToPlate inserting: type " + plate.type + " name " + plate.name + " desc " + plate.description + " master " + plate.master + " isInactive? " + plate.isInactive + " portion #1 " + plate.portion1);
								systemDB.transaction(
										function(transaction) {
											transaction.executeSql(
													'INSERT INTO plate (type, name,  description, master, portion1, portion2, portion3, portion4, portion5, portion6, portion7, portion8, portion9, isInactive) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?);',
													[plate.type, plate.name, plate.description, plate.master, plate.portion1, plate.portion2, plate.portion3, plate.portion4, plate.portion5, plate.portion6, plate.portion7, plate.portion8, plate.portion9, plate.isInactive],
													function(){
														//trxDone('add');
														//alert("plateslate addToPortion added: type " + portion.type + " name " + portion.name + " desc " + portion.description + " master " + portion.master + " isInactive? " + portion.isInactive);
													},
													displayerrormessage
											);
										}
								);
							}
						}
					);
				}
			);*/
	}

// tjs 131217 TBD - needed later??? TODO
function truncateSlates() {
	// for now consider one month or four weeks maximum...
	var maximumSlateCount = 28;
	/*
	 // for test only
	systemDB.transaction(
			function(transaction) {
				transaction.executeSql(
				'SELECT id, date, name, isInactive FROM slate order by id', null,
				
				function (transaction, result) {
					//alert("plateslate loadPlates result.rows.length " + result.rows.length);
					if (result.rows.length > 0) {
						resultsLen = result.rows.length;
						if (resultsLen > maximumSlateCount) {
							var truncateCount = resultsLen - maximumSlateCount;
							var slateIds = new Array();
							var lastDateName;
							for (var i=0; i < truncateCount; i++) {
								var row = result.rows.item(i);
								id=parseInt(row.id);
								date = row.date;
								name = row.name;
								lastDateName = name;
								slateIds.push(id);
							} // end for loop
							//deleteSlatesFoodsBeforeDate(lastDateName);
							var len = slateIds.length;
							for (var i = 0; i < len; i++) {
								deleteSlatesFoodsBeforeDate(slateIds[i]);
								var torf = false;
								if (i == len - 1) {
									torf = true;
								}
								deleteSlatesBeforeDate(slateIds[i], torf);
							}
						} else {
							loadSlates();
						}
					} else {
						loadSlates();
					} // end if rows found or not
				});
			});*/
}

//tjs 131217 TBD - needed later??? TODO
function deleteSlatesFoodsBeforeDate(id) {
	/*
	systemDB.transaction(
			function(transaction) {
				transaction.executeSql(
				'DELETE from food where slate = ?', [id],
				
				function (transaction, result) {
					//alert("plateslate loadPlates result.rows.length " + result.rows.length);
					//deleteSlatesBeforeDate(date);
				});
			});	*/
}

//tjs 131217 TBD - needed later??? TODO
function deleteSlatesBeforeDate(id, torf) {
	/*
	systemDB.transaction(
			function(transaction) {
				transaction.executeSql(
				'DELETE from slate where id = ?', [id],
				
				function (transaction, result) {
					//alert("plateslate loadPlates result.rows.length " + result.rows.length);
					if (torf) {
						loadSlates();
					}					
				});
			});	*/
}

function loadSlates()
{
	var today = new Date();
	today.setHours(0, 0, 0, 0);
	var todayName = today.toLocaleDateString();
	var weekdayName = weekday[today.getDay()];
	var isSlateDataInserted = false;
	var id;
	var offset = slateOffsetThreshold;
	var date;
	var name;
	var description;
	var breakfastId;
	var lunchId;
	var dinnerId;
	var isInactive;
	var slate;
	var currentSlate;
	var breakfastPlate;
	var lunchPlate;
	var dinnerPlate;
	var markIndex = -1;
	var index = 0;
	var tempSlates = new Array();
	var tempSlatesLen = 0;
	var resultsLen = 0;
	var tempSlate;
	// needed to ensure no duplicates are listed in the slates
	var lastSlateName = null;

	//alert("plateslate loadSlates todayName " + todayName);

	//TODO populate array and inspect it for offset from today.  if no today add it.
	//then ensure the array remains in sync with the database when user transitions to a new offset.
		
	if (slates.length > 0) {
		//alert("plateslate loadSlates slates len " + slates.length);
		// tjs 110816
		for (var i = 0; i < slates.length; i++) {
			//tjs 110819
			// tjs 120119
			//if (typeof(slates[i] !== 'undefined')) {
			if (typeof(slates[i]) !== 'undefined') {
				// tjs 110819
				destroySlate(slates[i]);
			}
		}
		slates.length = 0;
	}		
	//alert("plateslate loadSlates cleared slates len " + slates.length);
	/*
	systemDB.transaction(
			function(transaction) {
				transaction.executeSql(
				'SELECT id, date, name,  description, breakfast, lunch, dinner, isInactive FROM slate', null,
				
				function (transaction, result) {
					//alert("plateslate loadPlates result.rows.length " + result.rows.length);
					if (result.rows.length > 0) {
						resultsLen = result.rows.length;
						for (var i=0; i < result.rows.length; i++) {
							var row = result.rows.item(i);
							id=parseInt(row.id);
							date = row.date;
							name = row.name;
							description = row.description;
							//alert("plateslate loadSlates name " + name + " id " + id + " breakfastId " + row.breakfast + " lunchId " + row.lunch + " dinnerId " + row.dinner);
							breakfastId=parseInt(row.breakfast);
							lunchId=parseInt(row.lunch);
							dinnerId=parseInt(row.dinner);
							isInactive=parseInt(row.isInactive);
							//alert("plateslate loadSlates name " + name + " id " + id + " breakfastId " + breakfastId + " lunchId " + lunchId + " dinnerId " + dinnerId);
							tempSlates[index++] = new Slate(id, 0, date, name, description, breakfastId, lunchId, dinnerId, null, null, null, isInactive);
							//viewSlate("LOADSLATES SLATE", slate);
							//alert("plateslate loadSlates slate name " + slate.name + " slate id " + slate.id + " breakfastId " + slate.breakfastId + " lunchId " + slate.lunchId + " dinnerId " + slate.dinnerId + " name " + name + " todayName " + todayName);
							//alert("plateslate loadSlates for id " + id + " have slate name " + slate.name + " breakfastId " + breakfastId + " lunchId " + lunchId + " dinnerId " + dinnerId + " tempIndex " + index + " markIndex " + markIndex);
							var tempIndex = index - 1;
							//alert("plateslate loadSlates tempSlate index " + tempIndex + " name " + tempSlates[tempIndex].name + " id " + tempSlates[tempIndex].id + " breakfastId " + tempSlates[tempIndex].breakfastId + " lunchId " + tempSlates[tempIndex].lunchId + " dinnerId " + tempSlates[tempIndex].dinnerId);
							//alert("plateslate loadSlates (after copy source destroyed) tempSlate index " + tempIndex + " name " + tempSlates[tempIndex].name + " id " + tempSlates[tempIndex].id + " breakfastId " + tempSlates[tempIndex].breakfastId + " lunchId " + tempSlates[tempIndex].lunchId + " dinnerId " + tempSlates[tempIndex].dinnerId);							
							//alert("plateslate loadPlates for id " + id + " have plate name " + plate.name);
							//alert("plateslate loadSlates for id " + id + " have today name " + todayName + " have slate name " + slate.name + " markIndex " + markIndex + " index " + index + " breakfastId " + breakfastId + " lunchId " + lunchId + " dinnerId " + dinnerId);
						}
						//alert("plateslate loadSlates tempSlates.length " + tempSlates.length + " have today name " + todayName);
						tempSlates.sort(compareTimes);
						//alert("plateslate loadSlates after sort tempSlates.length " + tempSlates.length);
						for (var i=0; i < tempSlates.length; i++) {
							// deep copy not needed here...
							slate = tempSlates[i];
							//alert("plateslate loadSlates sorted by date slate id " + slate.id);
							name = slate.name;
							//alert("plateslate loadSlates slate name " + slate.name + " slate id " + slate.id + " breakfastId " + slate.breakfastId + " lunchId " + slate.lunchId + " dinnerId " + slate.dinnerId + " name " + name + " todayName " + todayName);
							if (name == todayName) {
								markIndex = i;
							}
							//alert("plateslate loadPlates for id " + id + " have plate name " + plate.name);
							//alert("plateslate loadSlates for id " + slate.id + " have today name " + todayName + " have slate name " + slate.name + " markIndex " + markIndex + " index " + index + " breakfastId " + slate.breakfastId + " lunchId " + slate.lunchId + " dinnerId " + slate.dinnerId);
						}
						
						tempSlatesLen = tempSlates.length;
						//alert("plateslate loadSlates result len " + result.rows.length + " tempSlatesLen " + tempSlatesLen + " markIndex " + markIndex);
						//found today's date...
						if (markIndex >= 0) {
							// DEBUG
							//viewSlate("CURRENTSLATE", currentSlate);
							lastSlateName = null;
							offset = slateOffsetThreshold;
							for (var i = markIndex; i >= 0; i--) {
								slate = copySlate(tempSlates[i]);
								destroySlate(tempSlates[i]);
								if (lastSlateName == null) {
									lastSlateName = slate.name;
								} else if (slate.name == lastSlateName) {
									continue;	// skip duplicate!
								} else {
									lastSlateName = slate.name;
								}
								if (i == markIndex) {
									currentSlate = slate;
								}
								slate.offset = offset;
								slates[offset] = slate;
								//viewSlate("LOADSLATES MARKBACK", slate);
								appendFood(loadSlatesCallback, 0, 100, slate);
								//alert("plateslate loadSlates from marked index backwards for i " + i + " have slate name " + slate.name + " offset " + offset);
								offset--;
							}
							if (tempSlatesLen - 1 > markIndex) {
								lastSlateName = null;
								offset = slateOffsetThreshold + 1;
								for (var i = markIndex + 1; i < tempSlatesLen; i++) {
									slate = copySlate(tempSlates[i]);
									destroySlate(tempSlates[i]);
									if (lastSlateName == null) {
										lastSlateName = slate.name;
									} else if (slate.name == lastSlateName) {
										continue;	// skip duplicate!
									} else {
										lastSlateName = slate.name;
									}
									slate.offset = offset;
									slates[offset] = slate;
									//viewSlate("LOADSLATES BACK2MARK", slate);
									appendFood(loadSlatesCallback, 0, 100, slate);
									//alert("plateslate loadSlates from marked index forewards for i " + i + " have slate name " + slate.name + " offset " + offset);
									offset++;
								}
							}
							appendFood(loadSlatesCallback, 0, 1, currentSlate);
							//viewSlate("CURRENTSLATE", currentSlate);
							//alert("plateslate loadSlates currentSlate id " + currentSlate.id + " have slate name " + currentSlate.name + " breakfastPortions len " + currentSlate.breakfastPortions.length);
						} 
						else {
							//today's date not entered yet (i.e. markIndex remained -1)
							offset = slateOffsetThreshold;
							breakfastPlate = getRandomPlate("Breakfast", offset);
							lunchPlate = getRandomPlate("Lunch", offset);
							dinnerPlate = getRandomPlate("Dinner", offset);
							slate = new Slate(0, offset, today, today.toLocaleDateString(), weekdayName, breakfastPlate.id, lunchPlate.id, dinnerPlate.id, null, null, null, 0);
							// DEBUG
							//viewSlate("NO MARKINDEX", slate);
							//alert("plateslate loadSlates today's new slate markIndex -1 " + slate.name);
							//TODO embed assignment in append...
							appendSlate(loadSlatesCallback, slate, offset);
							//alert("plateslate loadSlates today's new slate id " + slate.id);
							//alert("plateslate loadSlates (no markIndex) for today have slate name " + slate.name + " offset " + offset);
							if (tempSlatesLen > 0) {
								lastSlateName = null;
								offset = slateOffsetThreshold - 1;
								for (var i = tempSlatesLen - 1; i >= 0; i--) {
									slate = copySlate(tempSlates[i]);
									destroySlate(tempSlates[i]);
									if (lastSlateName == null) {
										lastSlateName = slate.name;
									} else if (slate.name == lastSlateName) {
										continue;	// skip duplicate!
									} else {
										lastSlateName = slate.name;
									}
									slate.offset = offset;
									slates[offset] = slate;
									appendFood(loadSlatesCallback, 0, 100, slate);
									//alert("plateslate loadSlates (no markIndex) from today backwards for i " + i + " have slate name " + slate.name + " offset " + offset);
									offset--;
								}
							}					
						}						
						isSlateDataInserted = true;
						// e.g. 1
						//alert("plateslate loadSlates isSlateDataInserted " + isSlateDataInserted + " slates len " + slates.length);
					} else {
						//today's date not entered yet and indeed no slates were ever entered...
						offset = slateOffsetThreshold;
						breakfastPlate = getRandomPlate("Breakfast", offset);
						lunchPlate = getRandomPlate("Lunch", offset);
						dinnerPlate = getRandomPlate("Dinner", offset);
						slate = new Slate(0, offset, today, today.toLocaleDateString(), weekdayName, breakfastPlate.id, lunchPlate.id, dinnerPlate.id, null, null, null, 0);
						// DEBUG
						//viewSlate("NO SLATES", slate);
						//alert("plateslate loadSlates today's new slate markIndex -1 " + slate.name);
						//TODO embed assignment in append...
						appendSlate(loadSlatesCallback, slate, offset);
						//alert("plateslate loadSlates today's new slate id " + slate.id);
						//alert("plateslate loadSlates (no markIndex) for today have slate name " + slate.name + " offset " + offset);
					} // end if not entered or entered
				},
				displayerrormessage
				);	// end trx sql

			}	// end outer function trx
		); // end outer system trx
	*/
	//alert("plateslate loadSlates isSlateDataInserted " + isSlateDataInserted);
}

// tjs 120213 deprecated!
function loadSlatesCallback(torf) {
	if (torf == true) {
		populateSlate();
	}
}

// tjs 131214
function addToSlate(slate) {
	// tjs 131214
	modifySlates(slate);	
}
/*
function addToSlate(slate) {
	//alert("plateslate addToSlate name " + slate.name + " desc " + slate.description);

			var id = 0;
			systemDB.transaction(
				function(transaction) {
					transaction.executeSql(
							'SELECT id, date, name,  description, breakfast, lunch, dinner, isInactive FROM slate where name=?;',[slate.name],

							function (transaction, result) {
						//alert("plateslate addToSlate select result.rows.length " + result.rows.length);
								if (result.rows.length >0) {
									var row = result.rows.item(0);
									id=parseInt(row.id);

									systemDB.transaction(
											function(transaction) {
												transaction.executeSql(
														'update slate set description=?, breakfast=?, lunch=?, dinner=? where name=?;',
														[slate.description, slate.breakfastId, slate.lunchId ,slate.dinnerId, slate.name],
														function(){
															//trxDone('update via add');
															//alert("plateslate addToPortion updated: type " + portion.type + " name " + portion.name + " desc " + portion.description + " master " + portion.master + " isInactive? " + portion.isInactive);
														},
														displayerrormessage
												); //end trx sql
											}	// end function trx		
									); // end systemDB trx
									appendFood(loadSlatesCallback, 0, 1, slate);							    		
								} else {	// i.e. no rows found in query
									//alert("plateslate addToPlate inserting: type " + plate.type + " name " + plate.name + " desc " + plate.description + " master " + plate.master + " isInactive? " + plate.isInactive + " portion #1 " + plate.portion1);
									systemDB.transaction(
											function(transaction) {
												transaction.executeSql(
														'INSERT INTO slate (date, name,  description, breakfast, lunch, dinner, isInactive) VALUES (?,?,?,?,?,?,?);',
														[slate.date, slate.name, slate.description, slate.breakfastId, slate.lunchId, slate.dinnerId, slate.isInactive],
														//function(){
											//trxDone('add');
											//alert("plateslate addToPortion added: type " + portion.type + " name " + portion.name + " desc " + portion.description + " master " + portion.master + " isInactive? " + portion.isInactive);
														//},
														//displayerrormessage
											            function (transaction, result) {
											                if (!result.rowsAffected) {
											                    // Previous insert failed. Bail.
											                    //alert('plateslate addToSlate No rows affected!');
											                    return false;
											                }
											                id = result.insertId;
											                //alert('plateslate addToSlate insert ID was ' + id);
											                slate.id = id;
											                //appendFood(transaction, slate);
											                appendFood(loadSlatesCallback, 0, 1, slate);
														} // end function trx result
												); //end trx sql
											}	//end function trx		
									);	//end system trx
								}	// end no rows found block
							}	// end function trx
					);	// end trx sql
			}	//end function trx
		);	// end systemDB trx
			//return id;
	}*/

// tjs 131214
function appendSlate(loadSlatesCallback, slate, offset) {
	
}
/*
 * 						'CREATE TABLE  IF NOT EXISTS slate ' +
						' (id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, ' +
						' date varchar(16), name varchar(32),  description varchar(100), breakfast integer, lunch integer, dinner integer, isInactive integer );'

 * 	*/
/*
function appendSlate(loadSlatesCallback, slate, offset) {
	//alert("plateslate appendSlate name " + slate.name + " desc " + slate.description);
			var id = 0;
			systemDB.transaction(
				function(transaction) {
					transaction.executeSql(
							'SELECT id, date, name,  description, breakfast, lunch, dinner, isInactive FROM slate where name=?;',[slate.name],

							function (transaction, result) {
						//alert("plateslate addToSlate select result.rows.length " + result.rows.length);
								if (result.rows.length >0) {
									var row = result.rows.item(0);
									id=parseInt(row.id);

									systemDB.transaction(
											function(transaction) {
												transaction.executeSql(
														'update slate set description=?, breakfast=?, lunch=?, dinner=? where name=?;',
														[slate.description, slate.breakfastId, slate.lunchId ,slate.dinnerId, slate.name],
														function(){
															//trxDone('update via add');
															//alert("plateslate addToPortion updated: type " + portion.type + " name " + portion.name + " desc " + portion.description + " master " + portion.master + " isInactive? " + portion.isInactive);
														},
														displayerrormessage
												); //end trx sql
											}	// end function trx		
									); // end systemDB trx
									appendFood(loadSlatesCallback, 0, 1, slate);							    		
								} else {	// i.e. no rows found in query
									//alert("plateslate appendSlate inserting: name " + slate.name + " desc " + slate.description + " breakfastId " + slate.breakfastId + " isInactive? " + slate.isInactive);
									systemDB.transaction(
											function(transaction) {
												transaction.executeSql(
														'INSERT INTO slate (date, name,  description, breakfast, lunch, dinner, isInactive) VALUES (?,?,?,?,?,?,?);',
														[slate.date, slate.name, slate.description, slate.breakfastId, slate.lunchId, slate.dinnerId, slate.isInactive],
														//function(){
											//trxDone('add');
											//alert("plateslate addToPortion added: type " + portion.type + " name " + portion.name + " desc " + portion.description + " master " + portion.master + " isInactive? " + portion.isInactive);
														//},
														//displayerrormessage
											            function (transaction, result) {
											                if (!result.rowsAffected) {
											                    // Previous insert failed. Bail.
											                    //alert('plateslate appendSlate No rows affected!');
											                    return false;
											                }
											                id = result.insertId;
											                //alert('plateslate appendSlate insert ID is ' + id);
											                slate.id = id;
											                //alert('plateslate appendSlate insert ID is ' + id + " slate id " + slate.id + " offset " + offset);
											                //alert('plateslate appendSlate insert ID is ' + id + " slate id " + slate.id + " offset " + offset);
											                //viewSlate("APPENDSLATE", slate);
											                slates[offset] = slate;
											                //alert("plateslate appendSlate slate id " + slate.id + " call append food breakfast " + slate.breakfastId + " lunch " + slate.lunchId + " dinner " + slate.dinnerId);
											                appendFood(loadSlatesCallback, 0, 1, slate);
											            //}, errorHandler);
														} // end function trx result
												); //end trx sql
											}	//end function trx		
									);	//end system trx
								}	// end no rows found block
							}	// end function trx
					);	// end trx sql
			}	//end function trx
		);	// end systemDB trx
			//return id;
	}
*/

// tjs 131217 TBD TODO 
function displayerrormessage(transaction, error) {
	//alert('Error:  '+error.message+' has occurred with Code: '+error.code);
	var title = 'Database Error';
	var paragraphs = new Array();
	var msg = 'Error:  '+error.message+' has occurred with Code: '+error.code;
	paragraphs.push(msg);
	hijaxAlertDial(title, paragraphs);
	return true;
}

//called when page wraps...
function getSlateView(offset, mealName) {
	var plateStyle = 'style="font-family: Chalkduster, sans-serif; color: ' + makeColor(color) + '; font-size: 150%; font-weight: bold;"';	
	//e.g. for offset 0 = 100, 1 = 101, -1 = 99
	var thresholdOffset = offset + slateOffsetThreshold;
    var dow;
    if (thresholdOffset == slateOffsetThreshold)
    	dow = "Today";
    else if (thresholdOffset - slateOffsetThreshold == 1)
    	dow = "Tomorrow";
    else if (thresholdOffset - slateOffsetThreshold == -1)
    	//dow = "Yesterday";
    	dow = "Prior Slate";
    else if (thresholdOffset - slateOffsetThreshold > 0)
    	//dow = offset + " days from now";
    	dow = offset.toString() + " days from now";
    else
    	//dow = (Math.abs(offset)).toString() + " days ago";
    	dow = (Math.abs(offset)).toString() + " slates ago";
    //alert("getSlateView color " + color + " offset " + offset + " dow " + dow + " mealName " + mealName);
    //alert("getSlateView color " + color + " offset " + offset + " dow " + dow + " mealName " + mealName + " slates.length " + slates.length);
    console.log("getSlateView color " + color + " offset " + offset + " dow " + dow + " mealName " + mealName + " slates.length " + slates.length);

    //tjs 110712
    var slate;
    var plateDescription;
    var html;
    //var slateExists = false;
    var slateRandomlyGenerated = false;
    // tjs 110818
    var plateType;
	// tjs 120119
	var breakfastPortions;
	var lunchPortions;
	var dinnerPortions;    		
   
    //alert("plateslate getSlateView offset " + offset + " thresholdOffset " + thresholdOffset + " slates len " + slates.length + " dow " + dow);
    // e.g. plateslate getSlateView offset 0 thresholdOffset 100 slates len 0 dow Today
    if (slates.length == 0) {
        var nextDate = new Date();
        var nextDateWeekdayName = weekday[nextDate.getDay()];
       	breakfastPlate = getRandomPlate("Breakfast", thresholdOffset);
		lunchPlate = getRandomPlate("Lunch", thresholdOffset);
		dinnerPlate = getRandomPlate("Dinner", thresholdOffset);
		//alert("plateslate getSlateView breakfastPlate.id " + breakfastPlate.id + " lunchPlate.id " + lunchPlate.id + " dinnerPlate.id " + dinnerPlate.id);
		// tjs 120119
		breakfastPortions = getPlatePortions(breakfastPlate);
		lunchPortions = getPlatePortions(lunchPlate);
		dinnerPortions = getPlatePortions(dinnerPlate);    		
		//slate = new Slate(0, thresholdOffset, nextDate, nextDate.toLocaleDateString(), nextDateWeekdayName, breakfastPlate.id, lunchPlate.id, dinnerPlate.id, breakfastPortions, lunchPortions, dinnerPortions, 0);
		slate = new Slate(0, thresholdOffset, nextDate, nextDate.toLocaleDateString(), nextDateWeekdayName, breakfastPlate.id, lunchPlate.id, dinnerPlate.id, breakfastPortions.slice(0), lunchPortions.slice(0), dinnerPortions.slice(0), 0);
		//slate = new Slate(0, thresholdOffset, nextDate, nextDate.toLocaleDateString(), nextDateWeekdayName, breakfastPlate.id, lunchPlate.id, dinnerPlate.id, null, null, null, 0);
		slates[thresholdOffset] = slate;
   		addToSlate(slate);
    	console.log("plateslate getSlateView (zero length) thresholdOffset " + thresholdOffset + " slate name " + slate.name + " id " + slate.id + " ids breakfast " + breakfastPlate.id + " lunch " + lunchPlate.id + " dinner " + dinnerPlate.id); 
    	//alert("plateslate getSlateView (zero length) thresholdOffset " + thresholdOffset + " slate name " + slate.name + " id " + slate.id); 
   		// tjs 120119
		slateRandomlyGenerated = true;
   	}
    if (typeof(slates[thresholdOffset]) === 'undefined') {
        //alert("plateslate getSlateView undefined offset " + offset + " thresholdOffset " + thresholdOffset + " slates len " + slates.length + " dow " + dow);
    	// too far into past...
    	if (thresholdOffset - slateOffsetThreshold < 0) {
            var name = 'NO MORE PRIOR SLATES!';
        	html = '<ul data-role="listview" data-divider-theme="b">';
         	html += '<li data-role="list-divider">';
        	html += dow + ' <p class="ui-li-aside"><strong>' + name + '</strong></p></li>';
        	html += '<li>No Meals Were Planned for this Day!</li>';
         	//alert("plateslate getSlateView offset " + offset + " html " + html);        	
        } else {
        	// new territory for slate in future...
        	var priorOffset = offset - 1;
        	//alert("plateslate getSlateView priorOffset " + priorOffset + " slates.length " + slates.length);
        	var nextDateMillis;
         	if (slates.length > 0) {
	        	slate = slates[priorOffset + slateOffsetThreshold];
	        	//alert("plateslate getSlateView priorOffset " + priorOffset + " slate name " + slate.name + " id " + slate.id);        	
	            var priorDate = slate.date;
	        	//alert("plateslate getSlateView priorOffset " + priorOffset + " slate name " + slate.name + " id " + slate.id + " priorDate name " + priorDate.toLocaleString());        	
	            var priorDateName = priorDate.toLocaleString();
	        	//alert("plateslate getSlateView priorOffset " + priorOffset + " slate name " + slate.name + " id " + slate.id + " priorDate name " + priorDateName);
	        	priorDate = new Date(priorDateName);
	            var priorDateMillis = priorDate.getTime();
	           	//alert("plateslate getSlateView priorDateMillis " + priorDateMillis);        	
	            nextDateMillis = priorDateMillis + 24*60*60*1000;
	           	//alert("plateslate getSlateView priorDateMillis " + priorDateMillis + " nextDateMillis " + nextDateMillis);        	
		        //alert("plateslate getSlateView priorOffset " + priorOffset + " slate name " + slate.name + " id " + slate.id);
        	} else {
        		nextDateMillis = 0;
        	}
	        var nextDate = new Date();
	        if (nextDateMillis > 0) {
	        	nextDate.setTime(nextDateMillis);
	        }	        
	        nextDate.setHours(0, 0, 0, 0);
	        var nextDateWeekdayName = weekday[nextDate.getDay()];
	        //alert("plateslate getSlateView priorOffset " + priorOffset + " nextDate name " + nextDate.toLocaleString());
        	breakfastPlate = getRandomPlate("Breakfast", thresholdOffset);
    		lunchPlate = getRandomPlate("Lunch", thresholdOffset);
    		dinnerPlate = getRandomPlate("Dinner", thresholdOffset);
    		//alert("plateslate getSlateView breakfastPlate.id " + breakfastPlate.id + " lunchPlate.id " + lunchPlate.id + " dinnerPlate.id " + dinnerPlate.id);
    		// tjs 120119
    		breakfastPortions = getPlatePortions(breakfastPlate);
    		lunchPortions = getPlatePortions(lunchPlate);
    		dinnerPortions = getPlatePortions(dinnerPlate);    		
    		//slate = new Slate(0, thresholdOffset, nextDate, nextDate.toLocaleDateString(), nextDateWeekdayName, breakfastPlate.id, lunchPlate.id, dinnerPlate.id, breakfastPortions, lunchPortions, dinnerPortions, 0);
    		slate = new Slate(0, thresholdOffset, nextDate, nextDate.toLocaleDateString(), nextDateWeekdayName, breakfastPlate.id, lunchPlate.id, dinnerPlate.id, breakfastPortions.slice(0), lunchPortions.slice(0), dinnerPortions.slice(0), 0);
    		//insert the new slate...
    		slates[thresholdOffset] = slate;
    		addToSlate(slate);
    		slateRandomlyGenerated = true;
        	//alert("plateslate getSlateView (undefined) thresholdOffset " + thresholdOffset + " slate name " + slate.name + " id " + slate.id); 
        }
    }
    
    if (typeof(slates[thresholdOffset]) !== 'undefined') {
        //alert("plateslate getSlateView defined offset " + offset + " thresholdOffset " + thresholdOffset + " slates len " + slates.length + " dow " + dow);
    	slate = slates[thresholdOffset];
    	
    	// tjs 120119
    	if (slateRandomlyGenerated) {
    		addToFood(slate);
    	}
    	
    	//viewSlate("GETSLATEVIEW", slate);
        var name = slate.name;
    	html = '<ul data-role="listview" data-divider-theme="b">';
     	html += '<li data-role="list-divider">' + dow + ' <p class="ui-li-aside"><strong>' + name + '</strong></p></li>';
        if (mealName == "Breakfast") {
	        var plate = getPlateById(slate.breakfastId);
	        plateDescription = plate.description;
	        if (plateDescription.length == 0 || plateDescription == null)
	        	plateDescription = "starter choice!";
	        plateSelectionsHtml = getPlateSelections(slate, plate, thresholdOffset, slateRandomlyGenerated);
	    	//alert("plateslate getSlateView plate name " + plate.name);
	        plateType = "'Breakfast'";
        } else if (mealName == "Lunch") {
	        plate = getPlateById(slate.lunchId);
	        plateDescription = plate.description;
	        if (plateDescription.length == 0 || plateDescription == null)
	        	plateDescription = "midday milestone!";
	        plateSelectionsHtml = getPlateSelections(slate, plate, thresholdOffset, slateRandomlyGenerated);
	        plateType = "'Lunch'";
        } else if (mealName == "Dinner") {
	        plate = getPlateById(slate.dinnerId);
	        plateDescription = plate.description;
	    	//alert("plateslate getSlateView offset " + offset + " plateDescription " + plateDescription);
	        if (plateDescription.length == 0 || plateDescription == null)
	        	plateDescription = "main entree!";
	        plateSelectionsHtml = getPlateSelections(slate, plate, thresholdOffset, slateRandomlyGenerated);
	        plateType = "'Dinner'";
        }
     	html += '<li data-role="list-divider">' + plateSelectionsHtml + ' <p class="ui-li-aside"><span ' + plateStyle + '>' + plateDescription + '</span></p></li>';
    	var grainDeferred = plateGrainsHtml == '<li/>';
    	var proteinDeferred = plateProteinHtml == '<li/>';
    	var vegetablesDeferred = plateVegetablesHtml == '<li/>';
    	var fruitsDeferred = plateFruitsHtml == '<li/>';
    	var dairyDeferred = plateDairyHtml == '<li/>';
    	// first obtain non-empty portions of the meal
    	if (!grainDeferred) {
    		html += getGrainMealHtml(offset, mealName);
    	}
    	if (!proteinDeferred) {
    		html += getProteinMealHtml(offset, mealName);
    	}
    	if (!vegetablesDeferred) {
    		html += getVegetablesMealHtml(offset, mealName);
    	}
    	if (!fruitsDeferred) {
    		html += getFruitsMealHtml(offset, mealName);
    	}
    	if (!dairyDeferred) {
    		html += getDairyMealHtml(offset, mealName);
    	}
    	// else some are deferred since they are empty...
    	if (grainDeferred) {
    		html += getGrainMealHtml(offset, mealName);
    	}
    	if (proteinDeferred) {
    		html += getProteinMealHtml(offset, mealName);
    	}
    	if (vegetablesDeferred) {
    		html += getVegetablesMealHtml(offset, mealName);
    	}
    	if (fruitsDeferred) {
    		html += getFruitsMealHtml(offset, mealName);
    	}
    	if (dairyDeferred) {
    		html += getDairyMealHtml(offset, mealName);
    	}
    	//alert("plateslate getSlateView offset " + offset + " mealName " + mealName + " html " + html);
    } 
    html += '</ul>';    
	//alert("plateslate getSlateView offset " + offset + " mealName " + mealName + " html " + html);
    return html;
}

function getGrainMealHtml(offset, mealName) {
	var newGrainHtml = getPortionSelections(offset , mealName, "Grain");
	//alert("plateSlateCellApp getGrainMealHtml newGrainHtml " + newGrainHtml);
	var html = '<li data-role="list-divider" data-theme="b">' + newGrainHtml + ' <p class="ui-li-aside dividerIcon"><strong>+ Grain</strong></p></li>';
	html += plateGrainsHtml;
	return html;
}

function getProteinMealHtml(offset, mealName) {
	var newProteinHtml = getPortionSelections(offset , mealName, "Protein");
	var html = '<li data-role="list-divider" data-theme="b">' + newProteinHtml + ' <p class="ui-li-aside dividerIcon"><strong>+ Protein</strong></p></li>';
	html += plateProteinHtml;
	return html;
}

function getVegetablesMealHtml(offset, mealName) {
	var newVegetablesHtml = getPortionSelections(offset , mealName, "Vegetables");
	var html = '<li data-role="list-divider" data-theme="b">' + newVegetablesHtml + ' <p class="ui-li-aside dividerIcon"><strong>+ Vegetable</strong></p></li>';
	html += plateVegetablesHtml;
	return html;
}

function getFruitsMealHtml(offset, mealName) {
	var newFruitsHtml = getPortionSelections(offset , mealName, "Fruits");
	var html = '<li data-role="list-divider" data-theme="b">' + newFruitsHtml + ' <p class="ui-li-aside dividerIcon"><strong>+ Fruit</strong></p></li>';
	html += plateFruitsHtml;
	return html;
}

function getDairyMealHtml(offset, mealName) {
	var newDairyHtml = getPortionSelections(offset , mealName, "Dairy");
	var html = '<li data-role="list-divider" data-theme="b">' + newDairyHtml + ' <p class="ui-li-aside dividerIcon"><strong>+ Dairy</strong></p></li>';
	html += plateDairyHtml;
	return html;
}

function getRandomPlate(plateType, offset) {
	var len = plates.length;
	//alert("plateslate getRandomPlate len " + len + " plateType " + plateType);
	// e.g. plateslate getRandomPlate len 0 plateType Breakfast
	var breakfastLen = 0;
	var lunchLen = 0;
	var dinnerLen = 0;
	var typeLen = 0;
	var plate;
	var selectedPlate = null;
	for (var i = 0; i < len; i++) {
		//alert("plateslate getRandomPlate i " + i);
	    if (typeof(plates[i]) === 'undefined')
	    	continue;
		plate = plates[i];
		if (plate != null) {
			//TODO if (plate.master == 1)
				//alert("plateslate getRandomPlate plate.type " + plate.type + " plate.name " + plate.name + " index " + i);
			if (plate.type == plateType) {
				typeLen++;
			}
		} else {
			//alert("plateslate getRandomPlate null plate at index " + i);
		}
	}

	//TODO consider offset for uniqueness
	// tjs 131122
	//alert("plateslate getRandomPlate plate.type " + plate.type + " plate.name " + plate.name);
	var html = '<select id="' + plateType + '_' + offset + '"><optgroup label="' + plateType + '">';
	if (typeLen > 0) {
		//return a random integer between 0 and typeLen
		var selectedOption = Math.floor(Math.random()*(typeLen - 1));
		var offset = 0;
		for (var i = 0; i < len; i++) {
			//alert("plateslate populatePlateMenus i " + i);
		    if (typeof(plates[i]) === 'undefined')
		    	continue;
			plate = plates[i];
			if (plate != null) {
				//TODO if (plate.master == 1)
				//alert("plateslate populatePlateMenus plate.type " + plate.type + " plate.name " + plate.name);
				if (plate.type == plateType) {
					html += '<option value ="' + plate.id +'"';
					if (offset == selectedOption) {
						html += ' selected="selected" ';
						selectedPlate = plate;
					}
					html += '>' + plate.name + '</option>';
					offset++;
				}
			}
		}
		plateSelectionsHtml = html + '</optgroup></select>';
		//alert("plateslate getRandomPlate plateSelectionsHtml " + plateSelectionsHtml);
	}
	//alert("plateslate getRandomPlate selectedOption " + selectedOption + " typeLen " + typeLen + " plateSelectionsHtml " + plateSelectionsHtml);
	return selectedPlate;
}

function getPlatePortions(plate) {
	var typePortions = new Array();
	var portionId;
	for (var i = 0; i < 9; i++) {
			//alert("plateslate updatePlate input element name " + inputElm.name + " value of id " + inputElm.value);
			switch (i) {
			case 0:
				portionId = plate.portion1;
				if (portionId != null && portionId > 0)
					console.log("plateslate getPlatePortions portion1 " + portionId);
			    	//typePortions.push(portions[portionId]);
			    	typePortions.push(portionId);
				break;
				
			case 1:
				portionId = plate.portion2;
				if (portionId != null && portionId > 0)
			    	typePortions.push(portionId);
				break;
				
			case 2:
				portionId = plate.portion3;
				if (portionId != null && portionId > 0)
			    	typePortions.push(portionId);
				break;
				
			case 3:
				portionId = plate.portion4;
				if (portionId != null && portionId > 0)
			    	typePortions.push(portionId);
				break;
				
			case 4:
				portionId = plate.portion5;
				if (portionId != null && portionId > 0)
			    	typePortions.push(portionId);
				break;
				
			case 5:
				portionId = plate.portion6;
				if (portionId != null && portionId > 0)
			    	typePortions.push(portionId);
				break;
				
			case 6:
				portionId = plate.portion7;
				if (portionId != null && portionId > 0)
			    	typePortions.push(portionId);
				break;
				
			case 7:
				portionId = plate.portion8;
				if (portionId != null && portionId > 0)
			    	typePortions.push(portionId);
				break;
				
			case 8:
				portionId = plate.portion9;
				if (portionId != null && portionId > 0)
			    	typePortions.push(portionId);
				break;
			
				default:
					break;
			}
		//must ensure row exists and is active
	}
	return typePortions;
}

function getPlateSelections(slate, plate, offset, slateRandomlyGenerated) {
	var len = plates.length;
	//alert("plateslate getPlateSelections len " + len + " slate id" + slate.id + " plateType " + plate.type + " offset " + offset);
	var typeLen = 0;
	plateGrainsHtml = '<li/>';
	plateProteinHtml = '<li/>';
	plateVegetablesHtml = '<li/>';
	plateFruitsHtml = '<li/>';
	plateDairyHtml = '<li/>';
	
	var currentPlate;
	var plateType = plate.type;
	var id = plate.id;
	
	// tjs 120306
	var plateName;
	var plateNames = new Array();
	var keys = new Array();
	var selectedPlate = null;
	for (var i = 0; i < len; i++) {
	    //if (i in plates) {
	    	currentPlate = plates[i];
			if (currentPlate != null) {
				//TODO if (currentPlate.master == 1)
					//alert("plateslate getRandomPlate plate.type " + plate.type + " plate.name " + plate.name + " index " + i);
				if (currentPlate.type == plateType) {
					typeLen++;
					plateName = currentPlate.name;
					plateNames[plateName] = i;
					keys.push(plateName);
				}
			}
		//}
	}

	keys.sort();

	//TODO consider offset for uniqueness
	var html = '<select class="' + plateType + '"><optgroup label="' + plateType + '">';
	if (typeLen > 0) {
		// tjs 120306
		//for (var i = 0; i < len; i++) {
		for (var j = 0; j < keys.length; j++) {
			//var i = keys[j];
			var i = plateNames[keys[j]];
		    //if (i in plates) {
		    	currentPlate = plates[i];
				if (currentPlate != null) {
					//TODO if (currentPlate.master == 1)
						//alert("plateslate getRandomPlate plate.type " + plate.type + " plate.name " + plate.name + " index " + i);
					if (currentPlate.type == plateType) {
						if (id == currentPlate.id) {
							html += '<option value ="' + currentPlate.id +'"';
							html += ' selected="selected" ';
							html += '>' + currentPlate.name + '</option>';
						} else if (currentPlate.isInactive != 1) {
							html += '<option value ="' + currentPlate.id +'"';
							html += '>' + currentPlate.name + '</option>';
						}
					}
				}
			//}
		}
		var plateSelectionsHtml = html + '</optgroup></select>';
		//alert("plateslate getPlateSelections plateSelectionsHtml " + plateSelectionsHtml);
			getFoodPortions(slate, plate);
		//alert("plateslate getPlateSelections plateGrainsHtml " + plateGrainsHtml + " plateProteinHtml " + plateProteinHtml);		
	}
	//alert("plateslate getRandomPlate selectedOption " + selectedOption + " typeLen " + typeLen + " plateSelectionsHtml " + plateSelectionsHtml);
	return plateSelectionsHtml;
}

function getTestPlateSelections(slate, plate, offset) {
	var len = plates.length;
	//alert("plateslate getPlateSelections len " + len + " slate id" + slate.id + " plateType " + plate.type + " offset " + offset);
	var breakfastLen = 0;
	var lunchLen = 0;
	var dinnerLen = 0;
	var typeLen = 0;
	
	plateGrainsHtml = '<li/>';
	plateProteinHtml = '<li/>';
	plateVegetablesHtml = '<li/>';
	plateFruitsHtml = '<li/>';
	plateDairyHtml = '<li/>';
	
	var currentPlate;
	var plateType = plate.type;
	var id = plate.id;
	
	var selectedPlate = null;
	for (var i = 0; i < len; i++) {
		//alert("plateslate getRandomPlate i " + i);
	    if (typeof(plates[i]) === 'undefined')
	    	continue;
	    currentPlate = plates[i];
		if (currentPlate != null) {
			//TODO if (currentPlate.master == 1)
				//alert("plateslate getRandomPlate plate.type " + plate.type + " plate.name " + plate.name + " index " + i);
			if (currentPlate.type == plateType) {
				typeLen++;
			}
		} else {
			//alert("plateslate getPlateSelections null plate at index " + i);
		}
	}

	//TODO consider offset for uniqueness
	var html = '<select id="' + plateType + '_' + offset + '"><optgroup label="' + plateType + '">';
	if (typeLen > 0) {
		//return a random integer between 0 and typeLen
		var offset = 0;
		for (var i = 0; i < len; i++) {
			//alert("plateslate populatePlateMenus i " + i);
		    if (typeof(plates[i]) === 'undefined')
		    	continue;
		    currentPlate = plates[i];
			if (currentPlate != null) {
				//TODO if (currentPlate.master == 1)
				//alert("plateslate getPlateSelections plate.type " + plate.type + " plate.name " + plate.name);
				if (currentPlate.type == plateType) {
					html += '<option value ="' + currentPlate.id +'"';
					if (id == currentPlate.id) {
						html += ' selected="selected" ';
					}
					html += '>' + currentPlate.name + '</option>';
					offset++;
				}
			}
		}
		var plateSelectionsHtml = html + '</optgroup></select>';
		//alert("plateslate getPlateSelections plateSelectionsHtml " + plateSelectionsHtml);
		//alert("plateslate getPlateSelections plateGrainsHtml " + plateGrainsHtml + " plateProteinHtml " + plateProteinHtml);		
	}
	//alert("plateslate getRandomPlate selectedOption " + selectedOption + " typeLen " + typeLen + " plateSelectionsHtml " + plateSelectionsHtml);
	return plateSelectionsHtml;
}

// tjs 120227
// used when user choice is 'Slates'
function getPortionSelections(offset, mealName, portionType) {
	// tjs 120111
	// consider that the slate already has portions assigned...
	var thresholdOffset = offset + slateOffsetThreshold;
	// tjs 120116
	//var foodPortions = getMealFoodPortions(thresholdOffset, mealName);
	
	var slate = slates[thresholdOffset];
	var foodPortions;
	// tjs 140301
	if (mealName == "Breakfast") {
		//foodPortions = slate.breakfastPortions;
		foodPortions = slate.breakfastPortions.slice(0);
	}  else if (mealName == "Lunch") {
		foodPortions = slate.lunchPortions.slice(0);
	}  else if (mealName == "Dinner") {
		foodPortions = slate.dinnerPortions.slice(0);
	}
	
	// tjs 131218 delta Portions
	// tjs 120307
	var len = portions.length;
	//alert("plateSlateCellApp getPortionSelections len " + len);
	console.log("plateSlateCellApp getPortionSelections len " + len + " thresholdOffset " + thresholdOffset + " slate name " + slate.name + " mealName " + mealName + " portionType " + portionType + " plate food portions len " + foodPortions.length);
	var portionName;
	var portionNames = new Array();
	var keys = new Array();
	if (len > 0) {
		// tjs 120227
		for (var i = 0; i < len; i++) {
	//if (i in portions) {
			//for (var i in Portions) {
				var currentPortion = portions[i];
				if (currentPortion != null) {
					//TODO if (currentPlate.master == 1)
					//alert("plateslate updatePortionsDialogs portion type " + currentPortion.type + " portion name " + currentPortion.name);
					if (currentPortion.type == portionType) {
						portionName = currentPortion.name;
						//portionNames[portionName] = i;
						portionNames[portionName] = currentPortion.id;
						keys.push(portionName);
					}
				}
			//}
		}
	}

	keys.sort();

	//alert("plateSlateCellApp getPortionSelections offset " + offset + " mealName " + mealName);
	portionSelectionsHtml = '<select name="portionSelection" class="' + portionType + '" onchange="javascript:processAddNewPortion(' + offset  + ', ' + "'" + mealName + "'" + ', ' + "'" + portionType + "', " + 'this.options[this.selectedIndex].value);"><optgroup label="' + portionType + '">';
	//var len = portions.length;
	//alert("plateSlateCellApp newGrainSelectionHtml len " + len);
	// tjs 131228
	var isPortionHeaderOption = false;
	if (len > 0) {
		// tjs 120227
		//for (var i = 0; i < len; i++) {
		for (var j = 0; j < keys.length; j++) {
			var i = portionNames[keys[j]];
			//if (i in portions) {
			// tjs 131218
			//var currentPortion = portions[i];
				var currentPortion = getPortionById(i);
				if (currentPortion != null) {
					//TODO if (currentPlate.master == 1)
					//alert("plateslate updatePortionsDialogs portion type " + currentPortion.type + " portion name " + currentPortion.name);
					if (currentPortion.type == portionType) {
						if (!isPortionSelected(currentPortion.id, foodPortions)) {
							// tjs 120227 - ensure inactives are concealed
							if (currentPortion.isInactive != 1) {
								// tjs 131228
								if (!isPortionHeaderOption) {
									isPortionHeaderOption = true;
									portionSelectionsHtml += '<option value ="' + 0 + '">Select ' + portionType + '</option>';
								}
								portionSelectionsHtml += '<option value ="' + currentPortion.id + '">' + currentPortion.name + '</option>';
							}
						}
					}
				}
			//}
		}
		portionSelectionsHtml += '</optgroup>';
	}
	portionSelectionsHtml += '</select>';
	//alert("plateslate newGrainSelectionHtml offset " + offset + " mealName " + mealName + " grainPortionSelectListHtml " + grainPortionSelectListHtml);
	return portionSelectionsHtml;
}

function isPortionSelected(portionId, foodPortions) {
	var torf = false;
	for (var i = 0; i < foodPortions.length; i++) {
		if (portionId == foodPortions[i]) {
			torf = true;
			break;
		}
	}
	return torf;
}

function appendPortion(plate, portionId, plateIndex, slateTorf) {
	//alert("plateslate appendPortion portionId " + portionId);
	var chalkColor = 0;
	if (slateTorf) {
		chalkColor = makeColor(color);
	}
		
	if (!isNaN(portionId)) {
		if (portionId == 0)
			return;

		console.log("plateslate appendPortion portionId " + portionId);

		// tjs 131218
		//var portion = portions[portionId];
		var portion = getPortionById(portionId);
		//e.g. Grain, Protein, Vegetables, Fruits, Dairy
		var type = portion.type;
		//alert("plateslate appendPortion portionId " + portionId + " type " + type);
		if (type == 'Grain') {
			if (plateGrainsHtml == '<li/>') {
				// c too light, b same as divider, a is black
				plateGrainsHtml = '<li class="grainPortion"><a href="javascript:dropPortion(' + plateIndex + ", '" + plate.type + "', " + portionId + ');" data-role="button" data-icon="delete" data-iconpos="right" data-theme="a"><span class="chalk"';
				if (slateTorf) {
					plateGrainsHtml += ' style="color:' + chalkColor + '"';
				}
				plateGrainsHtml += '>' + portion.name + '</span></a></li>';
			} else {
				plateGrainsHtml += '<li class="grainPortion"><a href="javascript:dropPortion(' + plateIndex + ", '" + plate.type + "', " + portionId + ');" data-role="button" data-icon="delete" data-iconpos="right" data-theme="a"><span class="chalk"';
				if (slateTorf) {
					plateGrainsHtml += ' style="color:' + chalkColor + '"';
				}
				plateGrainsHtml += '>' + portion.name + '</span></a></li>';
			}
		} else if (type == 'Protein') {
			if (plateProteinHtml == '<li/>') {
				plateProteinHtml = '<li class="proteinPortion"><a href="javascript:dropPortion(' + plateIndex + ", '" + plate.type + "', " + portionId + ');" data-role="button" data-icon="delete" data-iconpos="right" data-theme="a"><span class="chalk"';
				if (slateTorf) {
					plateProteinHtml += ' style="color:' + chalkColor + '"';
				}
				plateProteinHtml += '>' + portion.name + '</span></a></li>';
			} else {
				plateProteinHtml += '<li class="proteinPortion"><a href="javascript:dropPortion(' + plateIndex + ", '" + plate.type + "', " + portionId + ');" data-role="button" data-icon="delete" data-iconpos="right" data-theme="a"><span class="chalk"';
				if (slateTorf) {
					plateProteinHtml += ' style="color:' + chalkColor + '"';
				}
				plateProteinHtml += '>' + portion.name + '</span></a></li>';
			}
		} else if (type == 'Vegetables') {
			if (plateVegetablesHtml == '<li/>') {
				plateVegetablesHtml = '<li class="vegetablesPortion"><a href="javascript:dropPortion(' + plateIndex + ", '" + plate.type + "', " + portionId + ');" data-role="button" data-icon="delete" data-iconpos="right" data-theme="a"><span class="chalk"';
				if (slateTorf) {
					plateVegetablesHtml += ' style="color:' + chalkColor + '"';
				}
				plateVegetablesHtml += '>' + portion.name + '</span></a></li>';
			} else {
				plateVegetablesHtml += '<li class="vegetablesPortion"><a href="javascript:dropPortion(' + plateIndex + ", '" + plate.type + "', " + portionId + ');" data-role="button" data-icon="delete" data-iconpos="right" data-theme="a"><span class="chalk"';
				if (slateTorf) {
					plateVegetablesHtml += ' style="color:' + chalkColor + '"';
				}
				plateVegetablesHtml += '>' + portion.name + '</span></a></li>';
			}
		} else if (type == 'Fruits') {
			if (plateFruitsHtml == '<li/>') {
				plateFruitsHtml = '<li class="fruitsPortion"><a href="javascript:dropPortion(' + plateIndex + ", '" + plate.type + "', " + portionId + ');" data-role="button" data-icon="delete" data-iconpos="right" data-theme="a"><span class="chalk"';
				if (slateTorf) {
					plateFruitsHtml += ' style="color:' + chalkColor + '"';
				}
				plateFruitsHtml += '>' + portion.name + '</span></a></li>';
			} else {
				plateFruitsHtml += '<li class="fruitsPortion"><a href="javascript:dropPortion(' + plateIndex + ", '" + plate.type + "', " + portionId + ');" data-role="button" data-icon="delete" data-iconpos="right" data-theme="a"><span class="chalk"';
				if (slateTorf) {
					plateFruitsHtml += ' style="color:' + chalkColor + '"';
				}
				plateFruitsHtml += '>' + portion.name + '</span></a></li>';
			}
		} else if (type == 'Dairy') {
			if (plateDairyHtml == '<li/>') {
				plateDairyHtml = '<li class="dairyPortion"><a href="javascript:dropPortion(' + plateIndex + ", '" + plate.type + "', " + portionId + ');" data-role="button" data-icon="delete" data-iconpos="right" data-theme="a"><span class="chalk"';
				if (slateTorf) {
					plateDairyHtml += ' style="color:' + chalkColor + '"';
				}
				plateDairyHtml += '>' + portion.name + '</span></a></li>';
			} else {
				plateDairyHtml += '<li class="dairyPortion"><a href="javascript:dropPortion(' + plateIndex + ", '" + plate.type + "', " + portionId + ');" data-role="button" data-icon="delete" data-iconpos="right" data-theme="a"><span class="chalk"';
				if (slateTorf) {
					plateDairyHtml += ' style="color:' + chalkColor + '"';
				}
				plateDairyHtml += '>' + portion.name + '</span></a></li>';
			}
		}
		//alert("plateslate appendPortion portionId " + portionId + " type " + type + " plateGrainsHtml " + plateGrainsHtml);
	}
}

function updateSlate(offset) {
	var thresholdOffset = offset + slateOffsetThreshold;
	//alert( "plateslate updateSlate thresholdOffset " + thresholdOffset + " offset " + offset);
    if (typeof(slates[thresholdOffset]) !== 'undefined') {
    	var slate = slates[thresholdOffset];
    	//alert( "plateslate updateSlate thresholdOffset " + thresholdOffset + " name " + slate.name + " breakfast " + slate.breakfastId);
    	addToSlate(slate);
   }
}

// tjs 120213 deprecated!!!
function populateSlate() {
	// tjs 120323
	//view = new PageView(wrap);
}

function compareTimes(a, b) {
	return a.time - b.time;
}

function processPlateEdit(slateId, plate, typePortions, override) {
	//alert( "plateslate processPlateEdit...");
	//alert( "plateslate processPlateEdit name " + plate.name + " id " + plate.id + " portion1 " + plate.portion1 + " portion2 " + plate.portion2 + " portion3 " + plate.portion3);
	//alert( "plateslate processPlateEdit name " + plate.name + " id " + plate.id + " slateId " + slateId + " typePortions.length " + typePortions.length + " override " + override);
	if (override) {
		plate.portion1 = 0;
		plate.portion2 = 0;
		plate.portion3 = 0;
		plate.portion4 = 0;
		plate.portion5 = 0;
		plate.portion6 = 0;
		plate.portion7 = 0;
		plate.portion8 = 0;
		plate.portion9 = 0;
	}

	//alert( "plateslate processPlateEdit clear typePortions...");
	// refresh cache...
	// tjs 120119
    //if (typeof(typePortions !== 'undefined')) {
    if (typeof(typePortions) !== 'undefined') {
    	if (typePortions.length > 0) {
    		//alert( "plateslate processPlateEdit typePortions.length " + typePortions.length);
    		typePortions.length = 0;
    		//alert( "plateslate processPlateEdit cleared typePortions.length " + typePortions.length);
    	}
    }

	//alert( "plateslate processPlateEdit call deactivateFoodPortions slateId " + slateId + " plate.type " + plate.type);
	var portionsChecked = $("#plateEditDialog input:checked");
	var len = portionsChecked.length;
	var portion;
	for (var i = 0; i < len; i++) {
		var inputElm = portionsChecked[i];
		portion = inputElm.value;
		// continue refresh of cache...
	    //if (typeof(typePortions !== 'undefined')) {
	    if (typeof(typePortions) !== 'undefined') {
	    	typePortions.push(portion);
	    }		
		if (override) {
			//alert("plateslate updatePlate input element name " + inputElm.name + " value of id " + inputElm.value);
			switch (i) {
			case 0:
					plate.portion1 = portion;
				break;
				
			case 1:
				plate.portion2 = portion;
				break;
				
			case 2:
				plate.portion3 = portion;
				break;
				
			case 3:
				plate.portion4 = portion;
				break;
				
			case 4:
				plate.portion5 = portion;
				break;
				
			case 5:
				plate.portion6 = portion;
				break;
				
			case 6:
				plate.portion7 = portion;
				break;
				
			case 7:
				plate.portion8 = portion;
				break;
				
			case 8:
				plate.portion9 = portion;
				break;
			
				default:
					break;
			}
		}
		//must ensure row exists and is active
		//updateFood(slateId, plate.type, portion, 0, 0);
		var slate = slates[slateId];
		modifySlateFoodPortions(slate, plate.type, portion, 0, 0);
	}
	deactivateFoodComplement(slateId, plate.type, typePortions);
	
	//alert( "plateslate processPlateEdit updated name " + plate.name + " id " + plate.id + " portion1 " + plate.portion1 + " portion2 " + plate.portion2 + " portion3 " + plate.portion3);
	if (override) {
		// tjs 140123
		var id = plate.id;
		var len = plates.length;
		var index = -1;
		for (var i = 0; i < len; i++) {
			var plate = plates[i];
			if (plate != null && id == plate.id) {
				index = i;
				break;;
			}
		} 
		//update cache
		//plates[id] = plate;
		if (index >0) {
			plates[index] = plate;
		}
		//persist cache
		addToPlate(plate);
	}
	//$("#plateEditDialog").dialog("close");
	// tjs 120403
	//$('.ui-dialog').dialog('close');
	// tjs 120403
    $.mobile.changePage( $('#home-page'), { transition: 'fade'} );
	
	view.sendEvent();
}

function addToFood(slate) {
	// tjs 131216
	readOrSetSlateFoodPortions(slate, plates);
	//("plateslate addToFood slate id " + slate.id);
	// tjs 131216 a noop for now... TBD
	/*
	var id = 0;
	systemDB.transaction(
		function(transaction) {
			transaction.executeSql(
			//'SELECT cart_sess, cart_sku,  cart_item_name, cart_qty, cart_price FROM shopcart where cart_sess=? and cart_sku=?;',[sid, sku],
					'SELECT id, slate, type, portion, master, isInactive FROM food where slate=?;',[slate.id],

			function (transaction, result) {
			if (result.rows.length >0) {
				var breakfastPortions = new Array();
				var lunchPortions = new Array();
				var dinnerPortions = new Array();
				
				//alert("plateslate addToFood result.rows.length " + result.rows.length);
				for (var i = 0; i < result.rows.length; i++) {
					var row = result.rows.item(i);
					var type = row.type;
					var portion = row.portion;
					//alert("plateslate addToFood type " + type + " portion " + portion);
					if (type == "Breakfast") {
						breakfastPortions.push(portion); 
					} else if (type == "Lunch") {
						lunchPortions.push(portion); 
					} else if (type == "Dinner") {
						dinnerPortions.push(portion); 
					}
				}
				//alert("plateslate addToFood breakfastPortions len " + breakfastPortions.length + " lunchPortions len  " + lunchPortions.length);
				slate.breakfastPortions = breakfastPortions.slice(0);
				slate.lunchPortions = lunchPortions.slice(0);
				slate.dinnerPortions = dinnerPortions.slice(0);
			} else {
				var plateId = slate.breakfastId;
				//alert("plateslate addToFood plate id " + plateId);
				var plate = plates[plateId];
				insertFood(slate, plate);
				plateId = slate.lunchId;
				plate = plates[plateId];
				insertFood(slate, plate);
				plateId = slate.dinnerId;
				plate = plates[plateId];
				insertFood(slate, plate);
				//alert("plateslate addToPlate inserting: type " + plate.type + " name " + plate.name + " desc " + plate.description + " master " + plate.master + " isInactive? " + plate.isInactive + " portion #1 " + plate.portion1);
			}
		}
		);
	}
	);*/
}

function appendFood(loadSlatesCallback, count, length, slate) {
	if (slate.id == 0) {
		//alert("plateslate appendFood slate id is zero!");
	}
	var foundPortions = false;
	//alert("plateslate appendFood slate id " + slate.id + " breakfastPortions len " + slate.breakfastPortions.length);
	console.log("plateslate appendFood slate id " + slate.id + " breakfastPortions len " + slate.breakfastPortions.length);
	var breakfastPortions = getFoodInDB(slate, "breakfast");
	if (breakfastPortions.length > 0) {
		foundPortions = true;
		if (slate.breakfastPortions.length > 0)
			slate.breakfastPortions.length = 0;
		for (var i = 0; i < breakfastPortions.length; i++) {
			// tjs 131218
			//var row = breakfastPortions[i];
			var row = breakfastPortions[i];
			var isInactive = row.isInactive;
			if (isInactive > 0)
				continue;
			var type = row.type;
			var portion = row.portionId;
			//alert("plateslate appendFood type " + type + " portion " + portion + " breakfastPortions len " + slate.breakfastPortions.length);
				slate.breakfastPortions.push(portion); 
		}		
	}
	var lunchPortions = getFoodInDB(slate, "lunch");
	if (lunchPortions.length > 0) {
		foundPortions = true;
		if (slate.lunchPortions.length > 0)
			slate.lunchPortions.length = 0;
		for (var i = 0; i < lunchPortions.length; i++) {
			var row = lunchPortions[i];
			var isInactive = row.isInactive;
			if (isInactive > 0)
				continue;
			var type = row.type;
			var portion = row.portionId;
			//alert("plateslate appendFood type " + type + " portion " + portion + " breakfastPortions len " + slate.breakfastPortions.length);
				slate.lunchPortions.push(portion); 
		}		
	}
	var dinnerPortions = getFoodInDB(slate, "dinner");
	if (dinnerPortions.length > 0) {
		foundPortions = true;
		if (slate.dinnerPortions.length > 0)
			slate.dinnerPortions.length = 0;
		for (var i = 0; i < dinnerPortions.length; i++) {
			var row = dinnerPortions[i];
			var isInactive = row.isInactive;
			if (isInactive > 0)
				continue;
			var type = row.type;
			var portion = row.portionId;
			//alert("plateslate appendFood type " + type + " portion " + portion + " breakfastPortions len " + slate.breakfastPortions.length);
				slate.dinnerPortions.push(portion); 
		}		
	}
	if (foundPortions) {
		if (length - count == 1) {
			//alert("plateslate appendFood callback breakfastPortions len " + slate.breakfastPortions.length + " lunchPortions len  " + slate.lunchPortions.length + " dinnerPortions len  " + slate.dinnerPortions.length);
			loadSlatesCallback(true);
		}
	} else {
		var torf = false;
		if (length - count == 1)
			torf = true;
		//alert("plateslate appendFood torf " + torf + " breakfastPortions len " + slate.breakfastPortions.length + " lunchPortions len  " + slate.lunchPortions.length + " dinnerPortions len  " + slate.dinnerPortions.length);
		insertSlateFoods(loadSlatesCallback, torf, slate);		
	}
	/*
	systemDB.transaction(
			function(transaction) {
	
	var id = 0;
			transaction.executeSql(
					'SELECT id, slate, type, portion, master, isInactive FROM food where slate=?;',[slate.id],

			function (transaction, result) {
			if (result.rows.length >0) {
				if (slate.breakfastPortions.length > 0)
					slate.breakfastPortions.length = 0;
				if (slate.lunchPortions.length > 0)
					slate.lunchPortions.length = 0;
				if (slate.dinnerPortions.length > 0)
					slate.dinnerPortions.length = 0;
				
				//alert("plateslate appendFood result.rows.length " + result.rows.length);
				for (var i = 0; i < result.rows.length; i++) {
					var row = result.rows.item(i);
					var isInactive = row.isInactive;
					if (isInactive > 0)
						continue;
					var type = row.type;
					var portion = row.portion;
					//alert("plateslate appendFood type " + type + " portion " + portion + " breakfastPortions len " + slate.breakfastPortions.length);
					if (type == "Breakfast") {
						slate.breakfastPortions.push(portion); 
					} else if (type == "Lunch") {
						slate.lunchPortions.push(portion); 
					} else if (type == "Dinner") {
						slate.dinnerPortions.push(portion); 
					}
				}
				//alert("plateslate appendFood breakfastPortions len " + slate.breakfastPortions.length + " lunchPortions len  " + slate.lunchPortions.length + " dinnerPortions len  " + slate.dinnerPortions.length);
				
				if (length - count == 1) {
					//alert("plateslate appendFood callback breakfastPortions len " + slate.breakfastPortions.length + " lunchPortions len  " + slate.lunchPortions.length + " dinnerPortions len  " + slate.dinnerPortions.length);
					loadSlatesCallback(true);
				}
			} else {
				//				var torf = (length - count == 1);
				var torf = false;
				if (length - count == 1)
					torf = true;
				//alert("plateslate appendFood torf " + torf + " breakfastPortions len " + slate.breakfastPortions.length + " lunchPortions len  " + slate.lunchPortions.length + " dinnerPortions len  " + slate.dinnerPortions.length);
				insertSlateFoods(loadSlatesCallback, torf, slate);
			}
		}
		);
			}
	);*/
}

function insertFood(slate, plate) {
	
	//alert("plateslate insertFood slate id " + slate.id + " plate id " + plate.id + " plate type " + plate.type);
	var foods = new Array();
	var portionId = plate.portion1;
	if (!isNaN(portionId)) {
		if (portionId > 0) {
			foods.push(portionId);
			//alert("plateslate getRandomPlate plate name " + selectedPlate.name + " portionId #1 " + portionId);
			insertFoodPortion(slate.id, plate.type, portionId, 0);
		}
	}
			
	portionId = plate.portion2;
	if (!isNaN(portionId)) {
		if (portionId > 0) {
			foods.push(portionId);
			//alert("plateslate getRandomPlate plate name " + selectedPlate.name + " portionId #1 " + portionId);
			insertFoodPortion(slate.id, plate.type, portionId, 0);
		}
	}
	//alert("plateslate getRandomPlate portionId #2 " + portionId);
	portionId = plate.portion3;
	if (!isNaN(portionId)) {
		if (portionId > 0) {
			foods.push(portionId);
			//alert("plateslate getRandomPlate plate name " + selectedPlate.name + " portionId #1 " + portionId);
			insertFoodPortion(slate.id, plate.type, portionId, 0);
		}
	}
	//alert("plateslate getRandomPlate portionId #3 " + portionId);
	portionId = plate.portion4;
	if (!isNaN(portionId)) {
		if (portionId > 0) {
			foods.push(portionId);
			//alert("plateslate getRandomPlate plate name " + selectedPlate.name + " portionId #1 " + portionId);
			insertFoodPortion(slate.id, plate.type, portionId, 0);
		}
	}
	//alert("plateslate getRandomPlate portionId #4 " + portionId);
	portionId = plate.portion5;
	if (!isNaN(portionId)) {
		if (portionId > 0) {
			foods.push(portionId);
			//alert("plateslate getRandomPlate plate name " + selectedPlate.name + " portionId #1 " + portionId);
			insertFoodPortion(slate.id, plate.type, portionId, 0);
		}
	}
	//alert("plateslate getRandomPlate portionId #5 " + portionId);
	portionId = plate.portion6;
	if (!isNaN(portionId)) {
		if (portionId > 0) {
			foods.push(portionId);
			//alert("plateslate getRandomPlate plate name " + selectedPlate.name + " portionId #1 " + portionId);
			insertFoodPortion(slate.id, plate.type, portionId, 0);
		}
	}
	portionId = plate.portion7;
	if (!isNaN(portionId)) {
		if (portionId > 0) {
			foods.push(portionId);
			//alert("plateslate getRandomPlate plate name " + selectedPlate.name + " portionId #1 " + portionId);
			insertFoodPortion(slate.id, plate.type, portionId, 0);
		}
	}
	portionId = plate.portion8;
	if (!isNaN(portionId)) {
		if (portionId > 0) {
			foods.push(portionId);
			//alert("plateslate getRandomPlate plate name " + selectedPlate.name + " portionId #1 " + portionId);
			insertFoodPortion(slate.id, plate.type, portionId, 0);
		}
	}
	portionId = plate.portion9;
	if (!isNaN(portionId)) {
		if (portionId > 0) {
			foods.push(portionId);
			//alert("plateslate getRandomPlate plate name " + selectedPlate.name + " portionId #1 " + portionId);
			insertFoodPortion(slate.id, plate.type, portionId, 0);
		}
	}
	// NB slice forces deep copy...
	if (plate.type == "Breakfast") {
		slate.breakfastPortions = foods.slice(0);
	} else if (plate.type == "Lunch") {
		slate.lunchPortions = foods.slice(0);
	} else if (plate.type == "Dinner") {
		slate.dinnerPortions = foods.slice(0);
	}
}

function insertSlateFood(loadSlatesCallback, torf, slate, plate) {
	
	//alert("plateslate insertSlateFood slate id " + slate.id + " plate id " + plate.id + " plate type " + plate.type);
	var foods = new Array();
	var portionId = plate.portion1;
	if (!isNaN(portionId)) {
		if (portionId > 0) {
			foods.push(portionId);
			//alert("plateslate insertSlateFood plate name " + selectedPlate.name + " portionId #1 " + portionId);
			insertSlateFoodPortion(slate.id, plate.type, portionId, 0);
		}
	}
			
	portionId = plate.portion2;
	if (!isNaN(portionId)) {
		if (portionId > 0) {
			foods.push(portionId);
			//alert("plateslate insertSlateFood plate name " + selectedPlate.name + " portionId #1 " + portionId);
			insertSlateFoodPortion(slate.id, plate.type, portionId, 0);
		}
	}
	//alert("plateslate insertSlateFood portionId #2 " + portionId);
	portionId = plate.portion3;
	if (!isNaN(portionId)) {
		if (portionId > 0) {
			foods.push(portionId);
			//alert("plateslate insertSlateFood plate name " + selectedPlate.name + " portionId #1 " + portionId);
			insertSlateFoodPortion(slate.id, plate.type, portionId, 0);
		}
	}
	//alert("plateslate insertSlateFood portionId #3 " + portionId);
	portionId = plate.portion4;
	if (!isNaN(portionId)) {
		if (portionId > 0) {
			foods.push(portionId);
			//alert("plateslate insertSlateFood plate name " + selectedPlate.name + " portionId #1 " + portionId);
			insertSlateFoodPortion(slate.id, plate.type, portionId, 0);
		}
	}
	//alert("plateslate insertSlateFood portionId #4 " + portionId);
	portionId = plate.portion5;
	if (!isNaN(portionId)) {
		if (portionId > 0) {
			foods.push(portionId);
			//alert("plateslate insertSlateFood plate name " + selectedPlate.name + " portionId #1 " + portionId);
			insertSlateFoodPortion(slate.id, plate.type, portionId, 0);
		}
	}
	//alert("plateslate getRandomPlate portionId #5 " + portionId);
	portionId = plate.portion6;
	if (!isNaN(portionId)) {
		if (portionId > 0) {
			foods.push(portionId);
			//alert("plateslate insertSlateFood plate name " + selectedPlate.name + " portionId #1 " + portionId);
			insertSlateFoodPortion(slate.id, plate.type, portionId, 0);
		}
	}
	portionId = plate.portion7;
	if (!isNaN(portionId)) {
		if (portionId > 0) {
			foods.push(portionId);
			//alert("plateslate insertSlateFood plate name " + selectedPlate.name + " portionId #1 " + portionId);
			insertSlateFoodPortion(slate.id, plate.type, portionId, 0);
		}
	}
	portionId = plate.portion8;
	if (!isNaN(portionId)) {
		if (portionId > 0) {
			foods.push(portionId);
			//alert("plateslate insertSlateFood plate name " + selectedPlate.name + " portionId #1 " + portionId);
			insertSlateFoodPortion(slate.id, plate.type, portionId, 0);
		}
	}
	portionId = plate.portion9;
	if (!isNaN(portionId)) {
		if (portionId > 0) {
			foods.push(portionId);
			//alert("plateslate insertSlateFood plate name " + selectedPlate.name + " portionId #1 " + portionId);
			insertSlateFoodPortion(slate.id, plate.type, portionId, 0);
		}
	}
	// NB slice forces deep copy...
	if (plate.type == "Breakfast") {
		//slate.breakfastPortions = foods.slice(0);
		slate.breakfastPortions.length = 0;
		for (var i = 0; i < foods.length; i++ ) {
			slate.breakfastPortions.push(foods[i]);
		}
	} else if (plate.type == "Lunch") {
		//slate.lunchPortions = foods.slice(0);
		slate.lunchPortions.length = 0;
		for (var i = 0; i < foods.length; i++ ) {
			slate.lunchPortions.push(foods[i]);
		}
	} else if (plate.type == "Dinner") {
		//slate.dinnerPortions = foods.slice(0);
		slate.dinnerPortions.length = 0;
		for (var i = 0; i < foods.length; i++ ) {
			slate.dinnerPortions.push(foods[i]);
		}
	}
	//alert("plateslate insertSlateFood breakfastPortions len " + slate.breakfastPortions.length + " lunchPortions len  " + slate.lunchPortions.length + " dinnerPortions len  " + slate.dinnerPortions.length);
	if (torf == true) {
		//alert("plateslate insertSlateFood final breakfastPortions len " + slate.breakfastPortions.length + " lunchPortions len  " + slate.lunchPortions.length + " dinnerPortions len  " + slate.dinnerPortions.length);
		loadSlatesCallback(true);
	}
}

function insertSlateFoods(loadSlatesCallback, torf, slate) {
	
	//alert("plateslate insertSlateFoods slate id " + slate.id + " torf " + torf);
	if (slate.breakfastPortions.length > 0)
		slate.breakfastPortions.length = 0;
	if (slate.lunchPortions.length > 0)
		slate.lunchPortions.length = 0;
	if (slate.dinnerPortions.length > 0)
		slate.dinnerPortions.length = 0;
	var plateId;
	var plate;
	
	for (var i = 0; i < 3; i++) {
		switch (i) {
		case 0:	// breakfast
			plateId = slate.breakfastId;
			break;
			
		case 1:	// lunch
			plateId = slate.lunchId;
			break;

		case 2:	// dinner
			plateId = slate.dinnerId;
			break;
		}
		plate = getPlateById(plateId);
		//alert("plateslate insertSlateFoods slate id " + slate.id + " plate id " + plate.id + " plate type " + plate.type);
		var portionId = plate.portion1;
		if (!isNaN(portionId)) {
			if (portionId > 0) {
				switch (i) {
				case 0:	// breakfast
					slate.breakfastPortions.push(portionId);
					break;
					
				case 1:	// lunch
					slate.lunchPortions.push(portionId);
					break;
	
				case 2:	// dinner
					slate.dinnerPortions.push(portionId);
					break;
				}
				//alert("plateslate insertSlateFood plate name " + selectedPlate.name + " portionId #1 " + portionId);
				insertSlateFoodPortion(slate.id, plate.type, portionId, 0);
			}
		}
				
		portionId = plate.portion2;
		if (!isNaN(portionId)) {
			if (portionId > 0) {
				switch (i) {
				case 0:	// breakfast
					slate.breakfastPortions.push(portionId);
					break;
					
				case 1:	// lunch
					slate.lunchPortions.push(portionId);
					break;
	
				case 2:	// dinner
					slate.dinnerPortions.push(portionId);
					break;
				}
				//alert("plateslate insertSlateFood plate name " + selectedPlate.name + " portionId #1 " + portionId);
				insertSlateFoodPortion(slate.id, plate.type, portionId, 0);
			}
		}
		//alert("plateslate insertSlateFood portionId #2 " + portionId);
		portionId = plate.portion3;
		if (!isNaN(portionId)) {
			if (portionId > 0) {
				switch (i) {
				case 0:	// breakfast
					slate.breakfastPortions.push(portionId);
					break;
					
				case 1:	// lunch
					slate.lunchPortions.push(portionId);
					break;
	
				case 2:	// dinner
					slate.dinnerPortions.push(portionId);
					break;
				}
				//alert("plateslate insertSlateFood plate name " + selectedPlate.name + " portionId #1 " + portionId);
				insertSlateFoodPortion(slate.id, plate.type, portionId, 0);
			}
		}
		//alert("plateslate insertSlateFood portionId #3 " + portionId);
		portionId = plate.portion4;
		if (!isNaN(portionId)) {
			if (portionId > 0) {
				switch (i) {
				case 0:	// breakfast
					slate.breakfastPortions.push(portionId);
					break;
					
				case 1:	// lunch
					slate.lunchPortions.push(portionId);
					break;
	
				case 2:	// dinner
					slate.dinnerPortions.push(portionId);
					break;
				}
				//alert("plateslate insertSlateFood plate name " + selectedPlate.name + " portionId #1 " + portionId);
				insertSlateFoodPortion(slate.id, plate.type, portionId, 0);
			}
		}
		//alert("plateslate insertSlateFood portionId #4 " + portionId);
		portionId = plate.portion5;
		if (!isNaN(portionId)) {
			if (portionId > 0) {
				switch (i) {
				case 0:	// breakfast
					slate.breakfastPortions.push(portionId);
					break;
					
				case 1:	// lunch
					slate.lunchPortions.push(portionId);
					break;
	
				case 2:	// dinner
					slate.dinnerPortions.push(portionId);
					break;
				}
				//alert("plateslate insertSlateFood plate name " + selectedPlate.name + " portionId #1 " + portionId);
				insertSlateFoodPortion(slate.id, plate.type, portionId, 0);
			}
		}
		//alert("plateslate getRandomPlate portionId #5 " + portionId);
		portionId = plate.portion6;
		if (!isNaN(portionId)) {
			if (portionId > 0) {
				//foods.push(portionId);
				switch (i) {
				case 0:	// breakfast
					slate.breakfastPortions.push(portionId);
					break;
					
				case 1:	// lunch
					slate.lunchPortions.push(portionId);
					break;
	
				case 2:	// dinner
					slate.dinnerPortions.push(portionId);
					break;
				}
				//alert("plateslate insertSlateFood plate name " + selectedPlate.name + " portionId #1 " + portionId);
				insertSlateFoodPortion(slate.id, plate.type, portionId, 0);
			}
		}
		portionId = plate.portion7;
		if (!isNaN(portionId)) {
			if (portionId > 0) {
				switch (i) {
				case 0:	// breakfast
					slate.breakfastPortions.push(portionId);
					break;
					
				case 1:	// lunch
					slate.lunchPortions.push(portionId);
					break;
	
				case 2:	// dinner
					slate.dinnerPortions.push(portionId);
					break;
				}
				//alert("plateslate insertSlateFood plate name " + selectedPlate.name + " portionId #1 " + portionId);
				insertSlateFoodPortion(slate.id, plate.type, portionId, 0);
			}
		}
		portionId = plate.portion8;
		if (!isNaN(portionId)) {
			if (portionId > 0) {
				switch (i) {
				case 0:	// breakfast
					slate.breakfastPortions.push(portionId);
					break;
					
				case 1:	// lunch
					slate.lunchPortions.push(portionId);
					break;
	
				case 2:	// dinner
					slate.dinnerPortions.push(portionId);
					break;
				}
				//alert("plateslate insertSlateFood plate name " + selectedPlate.name + " portionId #1 " + portionId);
				insertSlateFoodPortion(slate.id, plate.type, portionId, 0);
			}
		}
		portionId = plate.portion9;
		if (!isNaN(portionId)) {
			if (portionId > 0) {
				switch (i) {
				case 0:	// breakfast
					slate.breakfastPortions.push(portionId);
					break;
					
				case 1:	// lunch
					slate.lunchPortions.push(portionId);
					break;
	
				case 2:	// dinner
					slate.dinnerPortions.push(portionId);
					break;
				}
				//alert("plateslate insertSlateFood plate name " + selectedPlate.name + " portionId #1 " + portionId);
				insertSlateFoodPortion(slate.id, plate.type, portionId, 0);
			}
		}
	}
	//alert("plateslate insertSlateFood breakfastPortions len " + slate.breakfastPortions.length + " lunchPortions len  " + slate.lunchPortions.length + " dinnerPortions len  " + slate.dinnerPortions.length);
	if (torf == true) {
		//alert("plateslate insertSlateFood final breakfastPortions len " + slate.breakfastPortions.length + " lunchPortions len  " + slate.lunchPortions.length + " dinnerPortions len  " + slate.dinnerPortions.length);
		loadSlatesCallback(true);
	}
}

function insertFoodPortion(slateId, type, portionId, master) {
	if (!isNaN(portionId)) {
		if (portionId == 0)
			return;
		if (slateId == 0)
			return;
		//alert("plateslate insertFoodPortion slate id " + slateId + " portion id " + portionId + " plate type " + type);
		var slate = slates[slateId];
		modifySlateFoodPortions(slate, type, portionId, master, 0);
		/*
	systemDB.transaction(
			function(transaction) {
			transaction.executeSql(
			'INSERT INTO food (slate, type,  portion, master, isInactive) VALUES (?,?,?,?,?);',
			[slateId, type, portionId, master, 0],
			function(){
				//alert("plateslate addToPortion added: type " + portion.type + " name " + portion.name + " desc " + portion.description + " master " + portion.master + " isInactive? " + portion.isInactive);
			},
			displayerrormessage
			);
			}
		);*/
	}
}

function insertSlateFoodPortion(slateId, type, portionId, master) {
		if (!isNaN(portionId)) {
			if (portionId == 0) {
				//alert("insertSlateFoodPortion portionId is zero!");
				return;
			}
				
			if (slateId == 0) {
				//alert("insertSlateFoodPortion slateId is zero!");
				return;				
			}
			//alert("plateslate insertSlateFoodPortion slate id " + slateId + " portion id " + portionId + " plate type " + type);
			var slate = slates[slateId];
			modifySlateFoodPortions(slate, type, portionId, master, 0);

			/*
			systemDB.transaction(
					function(transaction) {
				transaction.executeSql(
				'INSERT INTO food (slate, type,  portion, master, isInactive) VALUES (?,?,?,?,?);',
				[slateId, type, portionId, master, 0],
				function(){
					//trxDone('add');
					//alert("plateslate addToPortion added: type " + portion.type + " name " + portion.name + " desc " + portion.description + " master " + portion.master + " isInactive? " + portion.isInactive);
				},
				displayerrormessage
				);
		}
			);*/
		}
	}

function getFoodPortions(slate, plate) {
	// tjs 131216 noop for now ... TBD
	
	//alert("plateslate getFoodPortions slate id " + slate.id + " plate id " + plate.id + " plate type " + plate.type);
	var foodPortions;
	if (plate.type == "Breakfast") {
		// tjs 120117
		//if (typeof(slate.breakfastPortions === 'undefined')) {
			//alert("plateslate getFoodPortions breakfast undefined!");			
		//} 			
		foodPortions = slate.breakfastPortions;
	}  else if (plate.type == "Lunch") {
		foodPortions = slate.lunchPortions;
	}  else if (plate.type == "Dinner") {
		foodPortions = slate.dinnerPortions;
	}
	//alert("plateslate getFoodPortions slate id " + slate.id + " plate id " + plate.id + " plate type " + plate.type + " foodPortions length " + foodPortions.length);
	console.log("plateslate getFoodPortions slate id " + slate.id + " plate id " + plate.id + " plate type " + plate.type + " foodPortions length " + foodPortions.length);
	//alert("plateslate getFoodPortions foodPortions length " + foodPortions.length);
	// tjs 120117
	var portionsAppended = new Array();
	if (foodPortions.length > 0) {
		for (var i = 0; i < foodPortions.length; i++) {
			portionId = foodPortions[i];
			var appended = false;
			for (var j = 0; j < portionsAppended.length; j++) {
				if (portionId == portionsAppended[j]) {
					appended = true;
					break;
				}
			}
			if (!appended) {
				appendPortion(plate, portionId, 0, true);
				portionsAppended.push(portionId);
			}
		}
	} 
	//tjs 110812 rewrite
	
}

function deactivateFoodPortions(slateId, type) {
	var slate = slates[slateId];
	console.log("plateslate deactivateFoodPortions slate id " + slate.id);
	var foodPortions = getFoodInDB(slate, type);
	if (foodPortions != null && foodPortions.length > 0) {
		for (var i = 0; i < foodPortions.length; i++) {
			var isInactive=parseInt(foodPortions[i].isInactive);
			//alert("plateslate deactivateFoodPortions isInactive " + isInactive);
			if (isInactive == 1) {
				continue;
			} else {
				var portion = parseInt(foodPortions[i].portionId);
				//update this row
				makeFoodPortionInactive(slateId, type, portion);
			}			
		}
	}
	/*
	systemDB.transaction(
			function(transaction) {
				transaction.executeSql(
						'SELECT id, slate, type, portion, master, isInactive FROM food where slate=? and type=?;',[slateId, type],

				function (transaction, result) {
				if (result.rows.length >0) {
					for (var i = 0; i < result.rows.length; i++) {
						var row = result.rows.item(i);
						var isInactive=parseInt(row.isInactive);
						//alert("plateslate deactivateFoodPortions isInactive " + isInactive);
						if (isInactive == 1) {
							continue;
						} else {
							var portion = parseInt(row.portion);
							//update this row
							makeFoodPortionInactive(slateId, type, portion);
						}
					}
					//alert("plateslate addToFood result.rows.length " + result.rows.length);
				} else {
					//noop
				}
			}
			);
		}
		);	*/
}

function deactivateFoodComplement(slateId, type, typePortions) {

	var slate = slates[slateId];
	console.log("plateslate deactivateFoodComplement slate id " + slate.id);
	var foodPortions = getFoodInDB(slate, type);
	if (foodPortions != null && foodPortions.length > 0) {
		for (var i = 0; i < foodPortions.length; i++) {
			var portion = parseInt(foodPortions[i].portionId);
			var torf = false;
			for (var j = 0; j < typePortions.length; j++ ) {
				if (portion == typePortions[j]) {
					torf = true;
					break;
				}
			}
			if (torf)
				continue;
			var isInactive=parseInt(typePortions[j].isInactive);
			if (isInactive == 1) {
				continue;
			} else {
				//var portion = parseInt(row.portion);
				//update this row
				makeFoodPortionInactive(slateId, type, portion);
			}
		}		
	}
/*	
	systemDB.transaction(
			function(transaction) {
				transaction.executeSql(
						'SELECT id, slate, type, portion, master, isInactive FROM food where slate=? and type=?;',[slateId, type],

				function (transaction, result) {
				if (result.rows.length >0) {
					for (var i = 0; i < result.rows.length; i++) {
						var row = result.rows.item(i);
						var portion = parseInt(row.portion);
						var torf = false;
						for (var j = 0; j < typePortions.length; j++ ) {
							if (portion == typePortions[j]) {
								torf = true;
								break;
							}
						}
						if (torf)
							continue;
						var isInactive=parseInt(row.isInactive);
						//alert("plateslate deactivateFoodComplement isInactive " + isInactive);
						if (isInactive == 1) {
							continue;
						} else {
							var portion = parseInt(row.portion);
							//update this row
							makeFoodPortionInactive(slateId, type, portion);
						}
					}
					//alert("plateslate addToFood result.rows.length " + result.rows.length);
				} else {
					//noop
				}
			}
			);
		}
		);	*/
}

function makeFoodPortionInactive(slateId, type, portion) {
	//alert("plateslate makeFoodPortionInactive slateId " + slateId + " type " + type + " portion " + portion);
	var slate = slates[slateId];
	modifySlateFoodPortions(slate, type, portion, 0, 1);
	/*systemDB.transaction(
			function(transaction) {
				transaction.executeSql(
						'Update food set isInactive = 1 where slate=? and type=? and portion=?;',[slateId, type, portion],

				function (transaction, result) {
			}
			);
		}
		);	*/
}

function makeFoodPortionActive(slateId, type, portion) {
	//alert("plateslate makeFoodPortionActive slateId " + slateId + " type " + type + " portion " + portion);
	var slate = slates[slateId];
	modifySlateFoodPortions(slate, type, portion, 0, 0);
/*
	systemDB.transaction(
			function(transaction) {
				transaction.executeSql(
						'Update food set isInactive = 0 where slate=? and type=? and portion=?;',[slateId, type, portion],

				function (transaction, result) {
			}
			);
		}
		);	*/
}

function refreshPortionCache(slate, type) {
	
	//alert("plateslate refreshPortionCache slate.id " + slate.id);
	// tjs 140122
	// tjs 140123 - sync uses slate name, no longer require non-zero id!!!
	//if (slate.id == 0) {
	//	console.log("plateslate refreshPortionCache slate.id " + slate.id);
	//	return;
	//}
	
	//var plate;
	console.log("plateslate refreshPortionCache slate.id " + slate.id + " type " + type);
	if (type == "Breakfast") {
		slate.breakfastPortions.length = 0;
		refreshSlateFoodsCache(slate, 0);
		
	} else if (type == "Lunch") {
		slate.lunchPortions.length = 0;
		refreshSlateFoodsCache(slate, 1);
		
	} else if (type == "Dinner") {
		slate.dinnerPortions.length = 0;
		refreshSlateFoodsCache(slate, 2);		
	}
}

function refreshSlateFoodsCache(slate, typeNumber) {
	
	//alert("plateslate insertSlateFoods slate id " + slate.id + " torf " + torf);
	console.log("plateslate refreshSlateFoodsCache slate id " + slate.id + " typeNumber " + typeNumber);
	var plateId;
	var plate;
	
		switch (typeNumber) {
		case 0:	// breakfast
			plateId = slate.breakfastId;
			// tjs 120119
			if ((typeof(slate.breakfastPortions) !== 'undefined')) {
				slate.breakfastPortions.length = 0;
			} else {
				slate.breakfastPortions = new Array();
			}
			break;
			
		case 1:	// lunch
			plateId = slate.lunchId;
			if (typeof(slate.lunchPortions) !== 'undefined') {
				slate.lunchPortions.length = 0;
			} else {
				slate.lunchPortions = new Array();
			}
			break;

		case 2:	// dinner
			plateId = slate.dinnerId;
			if (typeof(slate.dinnerPortions) !== 'undefined') {
				slate.dinnerPortions.length = 0;
			} else {
				slate.dinnerPortions = new Array();
			}
			break;
		}
		plate = getPlateById(plateId);
		//alert("plateslate insertSlateFoods slate id " + slate.id + " plate id " + plate.id + " plate type " + plate.type);
		console.log("plateslate refreshSlateFoodsCache slate id " + slate.id + " plate id " + plate.id + " plate type " + plate.type);
		var portionId = plate.portion1;
		if (!isNaN(portionId)) {
			if (portionId > 0) {
				//foods.push(portionId);
				switch (typeNumber) {
				case 0:	// breakfast
					//if (!isPortionInCache(slate.breakfastPortions, portionId))
						slate.breakfastPortions.push(portionId);
					break;
					
				case 1:	// lunch
					//if (!isPortionInCache(slate.lunchPortions, portionId))
					slate.lunchPortions.push(portionId);
					break;
	
				case 2:	// dinner
					//if (!isPortionInCache(slate.dinnerPortions, portionId))
					slate.dinnerPortions.push(portionId);
					break;
				}
				//alert("plateslate insertSlateFood plate name " + selectedPlate.name + " portionId #1 " + portionId);
			}
		}
				
		portionId = plate.portion2;
		if (!isNaN(portionId)) {
			if (portionId > 0) {
				switch (typeNumber) {
				case 0:	// breakfast
					//if (!isPortionInCache(slate.breakfastPortions, portionId))
					slate.breakfastPortions.push(portionId);
					break;
					
				case 1:	// lunch
					//if (!isPortionInCache(slate.lunchPortions, portionId))
					slate.lunchPortions.push(portionId);
					break;
	
				case 2:	// dinner
					//if (!isPortionInCache(slate.dinnerPortions, portionId))
					slate.dinnerPortions.push(portionId);
					break;
				}
				//alert("plateslate insertSlateFood plate name " + selectedPlate.name + " portionId #1 " + portionId);
			}
		}
		//alert("plateslate insertSlateFood portionId #2 " + portionId);
		portionId = plate.portion3;
		if (!isNaN(portionId)) {
			if (portionId > 0) {
				switch (typeNumber) {
				case 0:	// breakfast
					//if (!isPortionInCache(slate.breakfastPortions, portionId))
					slate.breakfastPortions.push(portionId);
					break;
					
				case 1:	// lunch
					//if (!isPortionInCache(slate.lunchPortions, portionId))
					slate.lunchPortions.push(portionId);
					break;
	
				case 2:	// dinner
					//if (!isPortionInCache(slate.dinnerPortions, portionId))
					slate.dinnerPortions.push(portionId);
					break;
				}
				//alert("plateslate insertSlateFood plate name " + selectedPlate.name + " portionId #1 " + portionId);
			}
		}
		//alert("plateslate insertSlateFood portionId #3 " + portionId);
		portionId = plate.portion4;
		if (!isNaN(portionId)) {
			if (portionId > 0) {
				switch (typeNumber) {
				case 0:	// breakfast
					//if (!isPortionInCache(slate.breakfastPortions, portionId))
					slate.breakfastPortions.push(portionId);
					break;
					
				case 1:	// lunch
					//if (!isPortionInCache(slate.lunchPortions, portionId))
					slate.lunchPortions.push(portionId);
					break;
	
				case 2:	// dinner
					//if (!isPortionInCache(slate.dinnerPortions, portionId))
					slate.dinnerPortions.push(portionId);
					break;
				}
				//alert("plateslate insertSlateFood plate name " + selectedPlate.name + " portionId #1 " + portionId);
			}
		}
		//alert("plateslate insertSlateFood portionId #4 " + portionId);
		portionId = plate.portion5;
		if (!isNaN(portionId)) {
			if (portionId > 0) {
				switch (typeNumber) {
				case 0:	// breakfast
					//if (!isPortionInCache(slate.breakfastPortions, portionId))
					slate.breakfastPortions.push(portionId);
					break;
					
				case 1:	// lunch
					//if (!isPortionInCache(slate.lunchPortions, portionId))
					slate.lunchPortions.push(portionId);
					break;
	
				case 2:	// dinner
					//if (!isPortionInCache(slate.dinnerPortions, portionId))
					slate.dinnerPortions.push(portionId);
					break;
				}
				//alert("plateslate insertSlateFood plate name " + selectedPlate.name + " portionId #1 " + portionId);
			}
		}
		//alert("plateslate getRandomPlate portionId #5 " + portionId);
		portionId = plate.portion6;
		if (!isNaN(portionId)) {
			if (portionId > 0) {
				switch (typeNumber) {
				case 0:	// breakfast
					//if (!isPortionInCache(slate.breakfastPortions, portionId))
					slate.breakfastPortions.push(portionId);
					break;
					
				case 1:	// lunch
					//if (!isPortionInCache(slate.lunchPortions, portionId))
					slate.lunchPortions.push(portionId);
					break;
	
				case 2:	// dinner
					//if (!isPortionInCache(slate.dinnerPortions, portionId))
					slate.dinnerPortions.push(portionId);
					break;
				}
				//alert("plateslate insertSlateFood plate name " + selectedPlate.name + " portionId #1 " + portionId);
			}
		}
		portionId = plate.portion7;
		if (!isNaN(portionId)) {
			if (portionId > 0) {
				switch (typeNumber) {
				case 0:	// breakfast
					//if (!isPortionInCache(slate.breakfastPortions, portionId))
					slate.breakfastPortions.push(portionId);
					break;
					
				case 1:	// lunch
					//if (!isPortionInCache(slate.lunchPortions, portionId))
					slate.lunchPortions.push(portionId);
					break;
	
				case 2:	// dinner
					//if (!isPortionInCache(slate.dinnerPortions, portionId))
					slate.dinnerPortions.push(portionId);
					break;
				}
				//alert("plateslate insertSlateFood plate name " + selectedPlate.name + " portionId #1 " + portionId);
			}
		}
		portionId = plate.portion8;
		if (!isNaN(portionId)) {
			if (portionId > 0) {
				switch (typeNumber) {
				case 0:	// breakfast
					//if (!isPortionInCache(slate.breakfastPortions, portionId))
					slate.breakfastPortions.push(portionId);
					break;
					
				case 1:	// lunch
					//if (!isPortionInCache(slate.lunchPortions, portionId))
					slate.lunchPortions.push(portionId);
					break;
	
				case 2:	// dinner
					//if (!isPortionInCache(slate.dinnerPortions, portionId))
					slate.dinnerPortions.push(portionId);
					break;
				}
				//alert("plateslate insertSlateFood plate name " + selectedPlate.name + " portionId #1 " + portionId);
			}
		}
		portionId = plate.portion9;
		if (!isNaN(portionId)) {
			if (portionId > 0) {
				switch (typeNumber) {
				case 0:	// breakfast
					//if (!isPortionInCache(slate.breakfastPortions, portionId))
					slate.breakfastPortions.push(portionId);
					break;
					
				case 1:	// lunch
					//if (!isPortionInCache(slate.lunchPortions, portionId))
					slate.lunchPortions.push(portionId);
					break;
	
				case 2:	// dinner
					//if (!isPortionInCache(slate.dinnerPortions, portionId))
					slate.dinnerPortions.push(portionId);
					break;
				}
				//alert("plateslate insertSlateFood plate name " + selectedPlate.name + " portionId #1 " + portionId);
			}
		}
		// tjs 140106 ??? TBD TODO
		// tjs 140118 back in!!!
		// tjs 140123 back out the update should handle
		//syncSlateFoodsCache(slate, typeNumber);
}

function syncSlateFoodsCache(slate, typeNumber) {
	var type;
	// tjs 140123
	//var slateId = slate.id;
	var typePortions;
	switch (typeNumber) {
	case 0:	// breakfast
		type = "Breakfast";
		typePortions = slate.breakfastPortions;
		break;
		
	case 1:	// lunch
		type = "Lunch";
		typePortions = slate.lunchPortions;
		break;

	case 2:	// dinner
		type = "Dinner";
		typePortions = slate.dinnerPortions;
		break;
	}
	// tjs 140118 TBD TODO
	//deactivateFoodComplement(slateId, type, typePortions);	
	
	for (var i = 0; i < typePortions.length; i++) {
		var portion = typePortions[i];
		//updateFood(slateId, type, portion, 0, 0);
		modifySlateFoodPortions(slate, type, portion, 0, 0);
	}	
}

function updateFood(slateId, type, portion, master, isInactive) {
/*		
		systemDB.transaction(
				function(transaction) {
					transaction.executeSql(
							'SELECT id, slate, type, portion, master, isInactive FROM food where slate=? and type=? and portion=?;',[slateId, type, portion],

					function (transaction, result) {
					if (result.rows.length >0) {
						var row = result.rows.item(0);
						var id = parseInt(row.id);
						//alert("plateslate updateFood id " + id + " master " + master + " isInactive " + isInactive);
						systemDB.transaction(
							function(transaction) {
								transaction.executeSql(
								'update food set master=?, isInactive=? where id=?;',
								[master, isInactive, id],
								function(){
									//trxDone('update via add');
									//alert("plateslate addToPortion updated: type " + portion.type + " name " + portion.name + " desc " + portion.description + " master " + portion.master + " isInactive? " + portion.isInactive);
								},
								displayerrormessage
								);
							}
						);
					} else {
						//alert("plateslate addToPortion inserting: type " + portion.type + " name " + portion.name + " desc " + portion.description + " master " + portion.master + " isInactive? " + portion.isInactive);
						systemDB.transaction(
							function(transaction) {
							transaction.executeSql(
							'INSERT INTO food (slate, type, portion, master, isInactive) VALUES (?,?,?,?,?);',
							[slateId, type, portion, master, isInactive],
							function(){
								//trxDone('add');
								//alert("plateslate addToPortion added: type " + portion.type + " name " + portion.name + " desc " + portion.description + " master " + portion.master + " isInactive? " + portion.isInactive);
							},
							displayerrormessage
							);
							}
						);
					}
				}
				);
			}
			);
*/
	}

//deepcopy of slate
//TODO fix the typeof test!
function copySlate(source) {
	// id, offset, date, name, description, breakfastId, lunchId, dinnerId, breakfastPortions, lunchPortions, dinnerPortions, isInactive
	var target = new Slate(source.id, source.offset, source.date, source.name, source.description, source.breakfastId, source.lunchId, source.dinnerId, null, null, null, source.isInactive);
// tjs 140110
	/*
	// tjs 120119
	//if (typeof(source.breakfastPortions !== 'undefined')) {
    if (typeof(source.breakfastPortions) !== 'undefined') {
    	if (source.breakfastPortions.length > 0) {
    	   	if (target.breakfastPortions.length > 0)
    	   		target.breakfastPortions.length = 0;
    		//alert("plateslate getChecked slateId " + slateId + " portion id " + id + " plate type " + plate.type + " typePortions.length " + typePortions.length);
    		for (var i = 0; i < source.breakfastPortions.length; i++) {
    			target.breakfastPortions.push(source.breakfastPortions[i]);
     		}
    	}    	
    }

    if (typeof(source.lunchPortions) !== 'undefined') {
    	if (source.lunchPortions.length > 0) {
    	   	if (target.lunchPortions.length > 0)
    	   		target.lunchPortions.length = 0;
    		//alert("plateslate getChecked slateId " + slateId + " portion id " + id + " plate type " + plate.type + " typePortions.length " + typePortions.length);
    		for (var i = 0; i < source.lunchPortions.length; i++) {
    			target.lunchPortions.push(source.lunchPortions[i]);
     		}
    	}    	
    }

    if (typeof(source.dinnerPortions) !== 'undefined') {
    	if (source.dinnerPortions.length > 0) {
    	   	if (target.dinnerPortions.length > 0)
    	   		target.dinnerPortions.length = 0;
    		//alert("plateslate getChecked slateId " + slateId + " portion id " + id + " plate type " + plate.type + " typePortions.length " + typePortions.length);
    		for (var i = 0; i < source.dinnerPortions.length; i++) {
    			target.dinnerPortions.push(source.dinnerPortions[i]);
     		}
    	}    	
    }*/
    if (typeof(source.breakfastPortions) !== 'undefined') {
    	if (source.breakfastPortions.length > 0) {
    		target.breakfastPortions = source.breakfastPortions.slice(0);
    	}    	
    }

    if (typeof(source.lunchPortions) !== 'undefined') {
    	if (source.lunchPortions.length > 0) {
    		target.lunchPortions = source.lunchPortions.slice(0);
    	}    	
    }

    if (typeof(source.dinnerPortions) !== 'undefined') {
    	if (source.dinnerPortions.length > 0) {
    		target.dinnerPortions = source.dinnerPortions.slice(0);
    	}    	
    }
    return target;
}

// tjs120117
function copyPortions(sourcePortions) {
	var targetPortions = new Array();
	if (typeof(sourcePortions) !== 'undefined') {
		for (var i = 0; i < sourcePortions.length; i++) {
			targetPortions.push(sourcePortions[i]);
		}
	}
	return targetPortions;
}

function destroySlate(slate) {
    		slate.breakfastPortions = null;
    		slate.lunchPortions = null;
    		slate.dinnerPortions = null;
	slate = null;
}

// for debug only...
function viewSlate(location, slate) {
	var blen = 0;
	var llen = 0;
	var dlen = 0;
	// tjs 120119
    //if (typeof(slate.breakfastPortions !== 'undefined')) {
    if (typeof(slate.breakfastPortions) !== 'undefined') {
    	if (slate.breakfastPortions.length > 0) {
    		blen = slate.breakfastPortions.length;
    	}    	
    }

    if (typeof(slate.lunchPortions) !== 'undefined') {
    	if (slate.lunchPortions.length > 0) {
    		llen = slate.lunchPortions.length;
    	}    	
    }

    if (typeof(slate.dinnerPortions) !== 'undefined') {
    	if (slate.dinnerPortions.length > 0) {
    		dlen = slate.dinnerPortions.length;
    	}    	
    }	
	alert("plateslate viewSlate " + location + " id " + slate.id + " offset " + slate.offset +  " name "  + slate.name + " bid " + slate.breakfastId + " lid " + slate.lunchId + " did " + slate.dinnerId + " blen " + blen + " llen " + llen + " dlen " + dlen);	
}

// tjs 120209
function hyjaxLoginDial() {
	// tjs 131122
	//alert("plateSlateCellApp  hyjaxLoginDial...");

	// tjs 120330
    // Remove all old dialog
    //$('#login-dial').remove();
	$('.ui-dialog').remove();
	//alert("plateSlateCellApp  hyjaxLoginDial...");
    
	// tjs 120403
	//var newDialHtml = '<div data-role="dialog" id="login-dial" data-rel="dialog"><div data-role="header">';
	var newDialHtml = '<div data-role="dialog" id="login-dial"><div data-role="header">';
	newDialHtml += '<h1>Login</h1></div>';	
	newDialHtml += '<div data-role="content" data-theme="c"><div class="content-primary"><div id="loginContents">';	
	newDialHtml += '<form name="loginForm"><p>Plate Slate login...</p><p/>';
	//newDialHtml += '<p>Add New Grain Portion...</p><p/>';
	newDialHtml += '<p><label for="name">Username:</label><input type="text" name="name" id="username" value="" placeholder="username" data-theme="d"/></p>';
	newDialHtml += '<p><label for="password">Password:</label><input type="password" name="pword" id="pword" value="" placeholder="" data-theme="d"/></p>';
	newDialHtml += '<p><fieldset data-role="fieldcontain"><label for="refresh">Restore client data from server backup</label>';  
	newDialHtml += '<input type="checkbox" name="refresh" id="refresh" size="30" value="refresh" '; 
	if (refreshDataFromServerDefault) {
		newDialHtml += ' checked="checked" ';
	} 
	newDialHtml += ' data-theme="d"/></fieldset></p>';
	//newDialHtml += '</form><br/><br/><a href="#home-page" data-role="button" data-inline="true" data-rel="back" data-theme="a">Cancel</a>';		
	newDialHtml += '</form><br/><br/><a href="#home-page" data-role="button" data-inline="true" data-theme="a">Cancel</a>';		
	// tjs 120403
	newDialHtml += '<a href="javascript:processLoginForm();" data-role="button" data-inline="true">Login</a><div id ="resultLog"></div>';
	//newDialHtml += '<a href="#" id="loginButton" data-role="button" data-inline="true">Login</a><div id ="resultLog"></div>';
	newDialHtml += '</div></div></div><script></script></div>';
	var newDial = $(newDialHtml);
	//add new dialog to page container
	newDial.appendTo($.mobile.pageContainer);
	
	// tweak the new dialog just added into the dom
   
	// enhance and open the new dialog
    $.mobile.changePage(newDial);
}

function processLoginForm() {
	//alert("plateslate  processLoginForm...");
	//var name = document.loginForm.name.value;
	//var pword = document.loginForm.pword.value;
	var name = $('#username').get(0).value;
	var pword = $('#pword').get(0).value;
	// tjs 120210
	var restoreFromBackup = false;
	//alert("plateslate  processLoginForm name " + name + " password " + pword);
	var optionsChecked = $("#loginContents input:checked");
	//alert("plateslate optionsChecked...");
	if (optionsChecked) {
		var len = optionsChecked.length;
		//alert("plateslate  processLoginForm len " + len);
		var option;
		for (var i = 0; i < len; i++) {
			var inputElm = optionsChecked[i];
			option = inputElm.value;
			//alert("plateslate  processLoginForm option " + option);
			if (option == "refresh") {
				restoreFromBackup = true;
			}
		}
	}
	// use loginForm
	//alert("plateSlateCellApp  processLoginForm name " + name + " password " + pword + " restoreFromBackup " + restoreFromBackup);
	// e.g. plateSlateCellApp  processLoginForm name SteelDrum password xxxxxxxxxxxx restoreFromBackup false
	
    $.ajax({  
        //type: "POST",  
      type: "GET",
      // tjs 130128
      url: "login4app.php",  
      //url: "app/login4app.php",  
      //url: "./app/login4app.php",  
      //url: "./login4app.php",  
     data: { "name": name,
    	  "pword": pword },  
      success: function(msg) {
          //alert("plateSlateCellApp processLoginForm success msg " + msg + " len " + msg.length);
          console.log("plateSlateCellApp processLoginForm success msg " + msg + " len " + msg.length);
         // e.g. plateSlateCellApp processLoginForm success msg ["loginInfo", {"id":"1","userName":"SteelDrum","firstName":"Tom","lastName":"Soucy"}] len 85
          var tempMsg = msg;
    		JSON.parse(tempMsg, function (key, value) {
    			//alert("plateSlateCellApp processLoginForm key " + key + " value " + value);
    			if (key =='id') {
    				loginInfo.id = value;
    			} else if (key =='userName') {
    				loginInfo.userName = value;
    			} else if (key =='firstName') {
    				loginInfo.firstName = value;
    			} else if (key =='lastName') {
    				loginInfo.lastName = value;
    			}
    			});
    		var accountId = loginInfo.id;
			//alert("plateSlateCellApp processLoginForm loginInfo.id " + loginInfo.id + " loginInfo.userName " + loginInfo.userName + " loginInfo.firstName " + loginInfo.firstName + " loginInfo.lastName " + loginInfo.lastName + " restoreFromBackup " + restoreFromBackup);
			// e.g. plateSlateCellApp processLoginForm loginInfo.id 1 loginInfo.userName SteelDrum loginInfo.firstName Tom loginInfo.lastName Soucy restoreFromBackup false
    	  if (accountId > 0) {
    		  authenticated = true;
    		  loginAccountNumber = accountId;
    		  // tjs 131228
    		  console.log("plateSlateCellApp processLoginForm success  authenticated " + authenticated + " loginAccountNumber " + loginAccountNumber + " restoreFromBackup " + restoreFromBackup);
    		  //alert("plateSlateCellApp processLoginForm success  authenticated " + authenticated + " loginAccountNumber " + loginAccountNumber + " restoreFromBackup " + restoreFromBackup);
    		  // e.g. plateSlateCellApp processLoginForm success  authenticated true loginAccountNumber 1 restoreFromBackup false
// tjs 140120
	        	localStorage.setItem('logininfo', JSON.stringify(loginInfo));	// persists above cached data
	        	//alert("plateslate showPlaceSetting placeSettingPrefButton click preferences persisted" );
	        	//loadPreferences();
				setTimeout(function() {
					//alert('hello');
					loadLoginInfo();
					},1000);							

    		  //alert("plateSlateCellApp processLoginForm success closing dialog...");
    		  // tjs 120119
     		  //setLogoutButton();
    		  // tjs 120210
    		  if (restoreFromBackup == true) {
    			  // tjs 120221
    			  //doRestoreFromBackup(loginAccountNumber);
    			  doRestoreFromBackup(loginAccountNumber, null);
    		  } else {
	    		  $('.loginLogout').children('.ui-btn-inner').children('.ui-btn-text').text("Logout");
	     		  //alert("plateSlateCellApp processLoginForm success closing dialog...");
	    		  //$("#login-dial").dialog("close");
	    		  //$('#login-dial').dialog('close');
	  			// tjs 120402
	  		    $.mobile.changePage( $('#home-page'), { transition: 'fade'} );
	    			// tjs 120403
	    			//$('.ui-dialog').dialog('close');
	    		  //$('.ui-dialog').dialog('close');
					//setTimeout(function() {
						//alert('hello');
						//$('#login-dial').dialog('close');
						//},1000);
	    		  //alert("plateSlateCellApp processLoginForm success closed dialog...");
	    		  //alert("plateSlateCellApp processLoginForm closed state success  authenticated " + authenticated + " loginAccountNumber " + loginAccountNumber + " restoreFromBackup " + restoreFromBackup);
    		  }
    	  } else {
    		  //alert("Login failed!");
    			var title = 'Login Failure';
    			var paragraphs = new Array();
    			var msg = "The user with name " + name + " must be registered before trying to login!";
    			alert("plateSlateCellApp  processLoginForm msg " + msg);
    			paragraphs.push(msg);
    			hijaxAlertDial(title, paragraphs);
    	  }
      }
    	  // tjs 130128
    	  //error callback option is invoked, if the request fails. It receives the jqXHR, a string indicating the error type, and an exception object if applicable. Some built-in errors will provide a string as the exception object: "abort", "timeout", "No Transport".
    	  //request.fail(function(jqXHR, textStatus) {
    	  //alert( "Request failed: " + textStatus );
      //});
    	  ,
      error: function(jqXHR, textStatus) {
    	  alert("plateSlateCellApp  processLoginForm ajax error msg textStatus " + textStatus);
      }
    });  
    
	//alert("plateSlateCellApp  processLoginForm called ajax...");
    return false;  
}

//tjs 120209
function hyjaxLogoutDial() {
	// tjs 120402
    // Remove all old dialog
    //$('#logout-dial').remove();
	$('.ui-dialog').remove();
	
	var newDialHtml = '<div data-role="dialog" id="logout-dial" data-rel="dialog"><div data-role="header">';
	newDialHtml += '<h1>Logout</h1></div>';	
	newDialHtml += '<div data-role="content" data-theme="c">';	
	newDialHtml += '<form name="logoutForm"><p>Plate Slate logout...</p><p/>';
	newDialHtml += '<p><fieldset data-role="fieldcontain"><label for="backup">Backup client data to server</label>';  
	newDialHtml += '<input type="checkbox" name="backup" id="backup" size="30" value="backup" '; 
	// tjs 120216
	//if (backupDataToServer) {
	if (backupDataToServer == true) {
		newDialHtml += ' checked="checked" ';
	}
	newDialHtml += ' data-theme="d"/></fieldset></p>';
	//newDialHtml += '</form><br/><br/><a href="#home-page" data-role="button" data-inline="true" data-rel="back" data-theme="a">Cancel</a>';		
	newDialHtml += '</form><br/><br/><a href="#home-page" data-role="button" data-inline="true" data-theme="a">Cancel</a>';		
	newDialHtml += '<a href="javascript:doLogout();" data-role="button" data-inline="true">Logout</a><div id ="resultLog"></div>';
	newDialHtml += '</div><script></script></div>';
	var newDial = $(newDialHtml);
	//add new dialog to page container
	newDial.appendTo($.mobile.pageContainer);
	
	// tweak the new dialog just added into the dom
   
	// enhance and open the new dialog
    $.mobile.changePage(newDial);
}

// tjs 131113
//function doLogout() {
function doLogout(loadObserver) {
	//alert("plateslate   doLogout");
	var isBackupStarted = false;
	if (backupDataToServer == true) {
		// tjs 120216
    	var fieldsChecked = $("#logout-dial input:checked");
    	var len = fieldsChecked.length;
    	//alert("plateSlateCellApp doLogout len " + len);
    	var field;
    	for (var i = 0; i < len; i++) {
    		var inputElm = fieldsChecked[i];
    		field = inputElm.value;
        	//alert("plateSlateCellApp doLogout pref " + pref);
    		if (field == "backup") {
    			isBackupStarted = true;
    			doClientBackup();
    		}
    	}
	}
	if (!isBackupStarted) {
		// tjs 120402
    	//alert("plateSlateCellApp doLogout isBackupStarted " + isBackupStarted + " backupDataToServer " + backupDataToServer + " loadObserver " + loadObserver);
    	// e.g. plateSlateCellApp doLogout isBackupStarted false backupDataToServer false loadObserver true
			//$("#logout-dial").dialog("close");
			//alert("plateSlateCellApp doLogout isBackupStarted " + isBackupStarted + " backupDataToServer " + backupDataToServer + " closed!");
			// e.g. plateSlateCellApp doLogout isBackupStarted false backupDataToServer true closed!
			//$.mobile.changePage($('#home-page')); ?? , reverse: true
			// tjs 120402
		    $.mobile.changePage( $('#home-page'), { transition: 'fade'} );
			// tjs 120403
			//$('.ui-dialog').dialog('close');

			//finishLogout();
		finishLogout(loadObserver);
	}
}

// tjs 131113
//function finishLogout() {
function finishLogout(loadObserver) {
    //alert("plateslate finishLogout loadObserver " + loadObserver);
    // e.g. plateslate finishLogout loadObserver true
    var dataString = '';
    // tjs 131119
    var url = 'logout4app.php?account=' + loginAccountNumber;
    $.ajax({  
        //type: "POST",  
  type: "GET",  
  //url: "logout4app.php",  
 url: url,  
  data: dataString,  
  success: function(msg) {
      //alert("plateslate finishLogout success  msg " + msg);
	  // e.g. plateslate finishLogout success  msg observer_url http://localhost:8993/slate.htmlhttp://localhost:8993/slate.html
// tjs 131119
	  //alert("plateslate finishLogout loadObserver " + loadObserver + " success msg " + msg);
	  //if (msg == "false") {
		  authenticated = false;
		  loginAccountNumber = 0;
		  //alert("plateslate handleLogout success  authenticated " + authenticated);
 	  //}
		  
		  // tjs 140120
		  unloadLoginInfo();

		  if (loadObserver) {
			  window.location.href = msg;
		  }
  }  
}); 	
}

function hijaxPreferencesPage() {
	//TODO
	//open page with bfast|lunch|dinner pref
	//pref checkboc states meals planned (e.g. just dinner)
//pref - setting reset would re-activitate inactibe plates

	//alert("plateslate showPlaceSetting slateOffset " + slateOffset);
	// cf <div data-role="page" data-add-back-btn="true" id="report-page" data-title="Report">
	var newPageHtml = '<div data-role="page" data-add-back-btn="true" id="preferences-page" data-title="Preferences">';
	newPageHtml += '<div data-role="header" data-theme="f" data-position="fixed">';
	//newPageHtml += '<a href="index.html" data-icon="home" data-iconpos="notext" data-direction="reverse" class="ui-btn-left jqm-home">Home</a>';
	newPageHtml += '<a href="#home-page" data-icon="home" data-iconpos="notext" data-direction="reverse" class="ui-btn-left jqm-home">Home</a>';
	newPageHtml += '<h1>Preferences</h1>';
	newPageHtml += '</div>';
	newPageHtml += '<div data-role="content"><div class="content-primary"><div id="placeSettingContents">';
	newPageHtml += '<form action="">';
	newPageHtml += '<p>Choose Place Settings Preferences for PlateSlate WebApp!</p>';
	newPageHtml += '<fieldset>';  
	newPageHtml += '<label for="suggestMethod" id="suggestMethod_label">Plates are to be suggested randomly</label>';  
	newPageHtml += '<input type="checkbox" name="suggestMethod" id="suggestMethod" size="30" value="random" ';
	if (plateSelectionRandom) {
		newPageHtml += ' checked="checked" ';
	}
	newPageHtml += '/><br />';  
	      
	newPageHtml += '<label for="filterMethod" id="filterMethod_label">Filter plate suggestions by season</label>';  
	newPageHtml += '<input type="checkbox" name="filterMethod" id="filterMethod" size="30" value="season" ';  
	if (plateSelectionSeasonal) {
		newPageHtml += ' checked="checked" ';
	}
	newPageHtml += '/><br />';  

	newPageHtml += '<label for="shareMethod" id="shareMethod_label">Share slates with server (for aggregate reports)</label>';  
	newPageHtml += '<input type="checkbox" name="shareMethod" id="shareMethod" size="30" value="share" ';  
	if (plateSelectionShared) {
		newPageHtml += ' checked="checked" ';
	}
	newPageHtml += '/><br />';  	      
	newPageHtml += '<label for="shareDinnerOnly" id="shareDinnerMethod_label">Share ONLY DINNER slates with server</label>';  
	newPageHtml += '<input type="checkbox" name="shareDinnerOnly" id="shareDinnerOnly" size="30" value="shareDinner" ';  
	if (slateMealPlansForDinnerOnly) {
		newPageHtml += ' checked="checked" ';
	}
	// tjs 120209
	newPageHtml += '/><br />';  	      
	newPageHtml += '<p>NOTE: For each Plate Slate registered member just ONE device should have the following option enabled!</p>';  
	newPageHtml += '<p>If checked, then you will be prompted for a confirmation to start the backup as you logout from the server.</p>';  
	newPageHtml += '<label for="backupToServer" id="backupMethod_label">Backup <strong>all</strong> client data to server (from this mobile device or computer).</label>';  
	newPageHtml += '<input type="checkbox" name="backupToServer" id="backupToServer" size="30" value="bud" ';  
	if (backupDataToServer) {
		newPageHtml += ' checked="checked" ';
	}
	newPageHtml += '/><br />';  	      
	newPageHtml += '<p>NOTE: For each Plate Slate registered member any device could have the following option enabled!</p>';  
	newPageHtml += '<p>If checked, then it becomes the default confirmation setting to start the restoration of client data as you login to the server.</p>';  
	newPageHtml += '<label for="restoreFromServer" id="restoreMethod_label">Restore <strong>all</strong> client data from server (refreshes this mobile device or computer with data backed up from another device).</label>';  
	newPageHtml += '<input type="checkbox" name="restoreFromServer" id="restoreFromServer" size="30" value="res" ';  
	if (refreshDataFromServerDefault) {
		newPageHtml += ' checked="checked" ';
	}
	newPageHtml += '/>';  	      	
	newPageHtml += '</fieldset>';  
	newPageHtml += '<br />';
	newPageHtml += '<input type="button" name="placeSettingPrefSubmit" class="placeSettingPrefButton" id="placeSettingPrefSubmit_btn" value="Save Preferences"';
	if (authenticated) {
		newPageHtml += '/>';
	} else {
		newPageHtml += ' disabled="disabled" />';
	}	  
	newPageHtml += '</form>';
	newPageHtml += '<br />';  
	newPageHtml += '<br />';
	if (!authenticated) {
		newPageHtml += '<p style="color: red;" >NOTE: Only Logged In Users May Alter Preferences or Edit Plates!</p>';
	}
	newPageHtml += '</div>';	// placeSettingContents
	newPageHtml += '</div>';	// content-primary
	newPageHtml += '</div>';	// content
	newPageHtml += '<script type="text/javascript"></script></div>'; // preferences-page

	//alert("plateSlateCellApp hijaxPreferencesPage newPageHtml " + newPageHtml);
	var newPage = $(newPageHtml);
	//add new dialog to page container
	newPage.appendTo($.mobile.pageContainer);
	
	//alert("plateSlateCellApp hijaxPreferencesPage html added to dom...");
	
	// tweak the new page just added into the dom
	   $(".placeSettingPrefButton").click(function() {  
	        // validate and process form here  
	            var plateSelectionRandom = false;
	            var plateSelectionSeasonal = false;
	            var plateSelectionShared = false;
	            var slateMealPlansForDinnerOnly = false;
	            // tjs 120216
	            var backupDataToServer = false;
	            var refreshDataFromServerDefault = false;
	            // placeSettingContents
	        	var prefsChecked = $("#placeSettingContents input:checked");
	        	var len = prefsChecked.length;
	        	//alert("plateSlateCellApp hyjaxPreferencesPage len " + len);
	        	var pref;
	        	for (var i = 0; i < len; i++) {
	        		var inputElm = prefsChecked[i];
	        		pref = inputElm.value;
		        	//alert("plateSlateCellApp hyjaxPreferencesPage pref " + pref);
	        		if (pref == "random") {
	        			plateSelectionRandom = true;
	        		}
	        		if (pref == "season") {
	        			plateSelectionSeasonal = true;
	        		}
	        		if (pref == "share") {
	        			plateSelectionShared = true;
	        		}
	        		if (pref == "shareDinner") {
	        			slateMealPlansForDinnerOnly = true;
	        		}
	        		// tjs 120209
	        		if (pref == "bud") {
	        			backupDataToServer = true;
	        		}
	        		if (pref == "res" && !backupDataToServer) {
	        			refreshDataFromServerDefault = true;
	        		}
	        	}
	        	
	        	//update setting table with this info and upon refresh/reload use the persisted values to initialize the globals
	        	//alert("plateslate showPlaceSetting placeSettingPrefButton click preferences.plateSelectionRandom " + preferences.plateSelectionRandom + " preferences.plateSelectionSeasonal " + preferences.plateSelectionSeasonal + " preferences.plateSelectionShared " + preferences.plateSelectionShared);
	        	preferences.plateSelectionRandom = plateSelectionRandom;
	        	preferences.plateSelectionSeasonal = plateSelectionSeasonal;
	        	preferences.plateSelectionShared = plateSelectionShared;
	        	preferences.slateMealPlansForDinnerOnly = slateMealPlansForDinnerOnly;
	        	preferences.backupDataToServer = backupDataToServer;
	        	preferences.refreshDataFromServerDefault = refreshDataFromServerDefault;
	        	//alert("plateslate showPlaceSetting placeSettingPrefButton click preferences.plateSelectionRandom " + preferences.plateSelectionRandom + " preferences.plateSelectionSeasonal " + preferences.plateSelectionSeasonal + " preferences.plateSelectionShared " + preferences.plateSelectionShared);
	        	localStorage.setItem('preferences', JSON.stringify(preferences));	// persists above cached data
	        	//alert("plateslate showPlaceSetting placeSettingPrefButton click preferences persisted" );
	        	//loadPreferences();
				setTimeout(function() {
					//alert('hello');
					loadPreferences();
					},1000);							

	        	//alert("index prefs plateSelectionRandom " + plateSelectionRandom + " plateSelectionSeasonal " + plateSelectionSeasonal + " plateSelectionShared " + plateSelectionShared);
	      });  
		//alert("plateSlateCellApp hijaxPreferencesPage dom tweaked...");

	// enhance and open the new page
    $.mobile.changePage(newPage);
	//alert("plateSlateCellApp hijaxPreferencesPage page changed...");
}

/*
 * model:
<slates>
	<slate name="August 26">
		<plate name="Eggs" type="Breakfast" description="">
			//<portions>
				<portion type="Grain">
				(a portion).
				</portion>
			//</portions>
		</plate>
	</slate>
</slates>
*/

function hijaxReportPage() {
	var newPageHtml = '<div data-role="page" data-add-back-btn="true" id="report-page" data-title="Report">';
	//newPageHtml += '<div data-role="header"><h1>Meal Plan Report</h1></div>';
	newPageHtml += '<div data-role="header" data-theme="f" data-position="fixed">';
	//newPageHtml += '<a href="index.html" data-icon="home" data-iconpos="notext" data-direction="reverse" class="ui-btn-left jqm-home">Home</a>';
// tjs 140120
	//newPageHtml += '<a href="#home-page" data-icon="home" data-iconpos="notext" data-direction="reverse" class="ui-btn-left jqm-home">Home</a>';
	newPageHtml += '<a href="./index.html#home-page" rel="external" data-icon="home" data-iconpos="notext" data-direction="reverse" class="ui-btn-left jqm-home">Home</a>';
	newPageHtml += '<h1>Reports</h1>';
	newPageHtml += '</div>';
	newPageHtml += '<div data-role="content">';
	newPageHtml += '<p>The following report shows what plates are slated to be served over the next few days.</p>';
	newPageHtml += '<p><a href="javascript:hijaxSlateOfPlatesPage();">Slate of Plates</a></p>';	
	newPageHtml += '<p>Dinner is often the meal that demands both variety and detailed planning.  This report shows dinners that had been slated earlier as well as the current plans.</p>';
	newPageHtml += '<p><a href="javascript:hijaxDinnerSlatePage();">Dinner Slate</a></p>';	
	newPageHtml += '<p>Before leaving home to shop for food this report may be helpful.  It shows detailed portions you will need for the dinner plates that are slated for the next few days.</p>';
	newPageHtml += '<p><a href="javascript:hijaxDinnerPortionsSlatePage();">Dinner Portions Slate</a></p>';	
	newPageHtml += '<p>The Prep Cook and Chef maintain a whiteboard in the kitchen.  It shows detailed portions they need for the dinner plans over the next few days.</p>';
	newPageHtml += '<p><a href="javascript:hijaxKitchenPortionsWhiteboardPage();">Kitchen Portions Whiteboard</a></p>';	
	//newPageHtml += "<p>The following report is the Slate of Breakfast, Lunch and Dinner Plates that shows detailed portions for a single day (main PlateSlate Report). (Mobile platforms swipe either left or right for prior or next day's plans.)</p>";
	//newPageHtml += '<p><a href="javascript:hijaxSlateOfPlatesPages();">Slate of Plates and Portions</a></p>';	
	newPageHtml += '<p>For logged in users, the PlateSlate Server provides a detailed and printable report of slated plates....</p>';
	newPageHtml += '<p><a href="javascript:doReport();">Get PDF PlateSlate Report</a></p>';	
	newPageHtml += '<p>For logged in users, the PlateSlate Server provides a real-time posting of meals planned for the current or next day.</p>';
	newPageHtml += '<p><a href="javascript:doRealTimeReport(false);">Post Today\'s Menu</a>&nbsp;<a href="javascript:doRealTimeReport(true);">Post Tomorrow\'s Menu</a></p>';	
	newPageHtml += '<p><a href="javascript:hyjaxTweakDial();">Tweak Posted Menu</a>&nbsp;<a href="javascript:observeRealTimeReport();">Observe Posted Menu</a></p>';	
	newPageHtml += '</div><script type="text/javascript"></script></div>';
	var newPage = $(newPageHtml);
	//add new dialog to page container
	newPage.appendTo($.mobile.pageContainer);
	// enhance and open the new page
    $.mobile.changePage(newPage);
}

function hijaxSlateOfPlatesPage() {
	/*
	 * <div data-role="page" id="home">
	<div data-role="header">
		<h1>5-Column Grid</h1>
	</div>

	<div data-role="content">
		<div class="ui-grid-d" style="text-align: center;"> 
			<div class="ui-block-a">&#xe21c;</div>
			<div class="ui-block-b">&#xe21d;</div>
			<div class="ui-block-c">&#xe21e;</div>	
			<div class="ui-block-d">&#xe21f;</div>
			<div class="ui-block-e">&#xe220;</div>
		</div>
	</div>
</div>

cf 131124
<div class="ui-grid-a">
    <div class="ui-block-a"><div class="ui-bar ui-bar-a" style="height:60px">Block A</div></div>
    <div class="ui-block-b"><div class="ui-bar ui-bar-a" style="height:60px">Block B</div></div>
</div><!-- /grid-a -->
	 */
	var thresholdOffset = slateOffsetThreshold;
	var chalkColors = getScreenReportHues(3);
	var divHeaderStyle = 'color:' + makeColor(chalkColors[0]);
	var divLabelStyle = 'color:' + makeColor(chalkColors[1]);
	var divDataStyle = 'color:' + makeColor(chalkColors[2]);
	
	var results = getReportGridArrays(thresholdOffset, 5, false);
//	alert("plateSlateCellApp hijaxScreenReportPage results.length " + results.length);
	var dows = results[0];
	var breakfastPlates = results[1];
	var lunchPlates = results[2];
	var dinnerPlates = results[3];
	var len = dows.length;
	// tjs 120120
	if (len < 2) {
		var paragraphs = new Array();
		paragraphs.push(insufficientDataLine1);
		paragraphs.push(insufficientDataLine2);
		hijaxAlertDial(insufficientDataTitle, paragraphs);
		return;
	}
	var gridClass = 'ui-grid-';
	if (len < 3)
		gridClass += 'a';
	else if (len < 4)
		gridClass += 'b';
	else if (len < 5)
		gridClass += 'c';
	else if (len < 6)
		gridClass += 'd';
	var columnClass = 'ui-block-';
	var newPageHtml = '<div data-role="page" data-add-back-btn="true" id="slate-of-plates-report-page" data-title="Slate of Plates">';
	newPageHtml += '<div data-role="header" data-theme="f" data-position="fixed">';
	//newPageHtml += '<a href="index.html" data-icon="home" data-iconpos="notext" data-direction="reverse" class="ui-btn-left jqm-home">Home</a>';
	newPageHtml += '<a href="#home-page" data-icon="home" data-iconpos="notext" data-direction="reverse" class="ui-btn-left jqm-home">Home</a>';
	newPageHtml += '<h1>Slate of Plates</h1>';
	newPageHtml += '</div>';
	newPageHtml += '<div data-role="content">';
	newPageHtml += '<div class="chalk">';
	newPageHtml += '<div class="' + gridClass + '" style="text-align: center;">';
	//newPageHtml += '<div class="chalk" style="' + divStyle + ';">';
	//newPageHtml += '<div class="chalk">';
	//newPageHtml += '<div style="' + divHeaderStyle + ';">';
	// grid headers (dow)
	for (var i = 0; i < len; i++) {
		switch (i) {
		case 0:
			newPageHtml += '<div class="' + columnClass + 'a"><div class="ui-bar ui-bar-a" style="' + divHeaderStyle + '"><strong>'+ dows[i] + '</strong></div></div>';
			break;
		case 1:
			newPageHtml += '<div class="' + columnClass + 'b"><div class="ui-bar ui-bar-a" style="' + divHeaderStyle + '"><strong>'+ dows[i] + '</strong></div></div>';
			break;
		case 2:
			newPageHtml += '<div class="' + columnClass + 'c"><div class="ui-bar ui-bar-a" style="' + divHeaderStyle + '"><strong>'+ dows[i] + '</strong></div></div>';
			break;
		case 3:
			newPageHtml += '<div class="' + columnClass + 'd"><div class="ui-bar ui-bar-a" style="' + divHeaderStyle + '"><strong>'+ dows[i] + '</strong></div></div>';
			break;
		case 4:
			newPageHtml += '<div class="' + columnClass + 'e"><div class="ui-bar ui-bar-a" style="' + divHeaderStyle + '"><strong>'+ dows[i] + '</strong></div></div>';
			break;			
		}			
	}
	//newPageHtml += '</div>';
	//newPageHtml += '<div style="' + divLabelStyle + ';">';
	// breakfast headers
	for (var i = 0; i < len; i++) {
		switch (i) {
		case 0:
			newPageHtml += '<div class="' + columnClass + 'a"><div class="ui-bar ui-bar-a" style="' + divLabelStyle + '"><i>Breakfast</i></div></div>';
			break;
		case 1:
			newPageHtml += '<div class="' + columnClass + 'b"><div class="ui-bar ui-bar-a" style="' + divLabelStyle + '"><i>Breakfast</i></div></div>';
			break;
		case 2:
			newPageHtml += '<div class="' + columnClass + 'c"><div class="ui-bar ui-bar-a" style="' + divLabelStyle + '"><i>Breakfast</i></div></div>';
			break;
		case 3:
			newPageHtml += '<div class="' + columnClass + 'd"><div class="ui-bar ui-bar-a" style="' + divLabelStyle + '"><i>Breakfast</i></div></div>';
			break;
		case 4:
			newPageHtml += '<div class="' + columnClass + 'e"><div class="ui-bar ui-bar-a" style="' + divLabelStyle + '"><i>Breakfast</i></div></div>';
			break;			
		}			
	}
	//newPageHtml += '</div>';
	//newPageHtml += '<div style="' + divDataStyle + ';">';
	// breakfast plates
	for (var i = 0; i < len; i++) {
		switch (i) {
		case 0:
			//newPageHtml += '<div class="' + columnClass + 'a">'+ breakfastPlates[i] + '</div>';
			newPageHtml += '<div class="' + columnClass + 'a"><div class="ui-bar ui-bar-a" style="' + divDataStyle + '">'+ breakfastPlates[i].name + '</div></div>';
			break;
		case 1:
			newPageHtml += '<div class="' + columnClass + 'b"><div class="ui-bar ui-bar-a" style="' + divDataStyle + '">'+ breakfastPlates[i].name + '</div></div>';
			break;
		case 2:
			newPageHtml += '<div class="' + columnClass + 'c"><div class="ui-bar ui-bar-a" style="' + divDataStyle + '">'+ breakfastPlates[i].name + '</div></div>';
			break;
		case 3:
			newPageHtml += '<div class="' + columnClass + 'd"><div class="ui-bar ui-bar-a" style="' + divDataStyle + '">'+ breakfastPlates[i].name + '</div></div>';
			break;
		case 4:
			newPageHtml += '<div class="' + columnClass + 'e"><div class="ui-bar ui-bar-a" style="' + divDataStyle + '">'+ breakfastPlates[i].name + '</div></div>';
			break;			
		}			
	}
	//newPageHtml += '</div>';
	//newPageHtml += '<div style="' + divLabelStyle + ';">';
	// lunch headers
	for (var i = 0; i < len; i++) {
		switch (i) {
		case 0:
			newPageHtml += '<div class="' + columnClass + 'a"><div class="ui-bar ui-bar-a" style="' + divLabelStyle + '"><i>Lunch</i></div></div>';
			break;
		case 1:
			newPageHtml += '<div class="' + columnClass + 'b"><div class="ui-bar ui-bar-a" style="' + divLabelStyle + '"><i>Lunch</i></div></div>';
			break;
		case 2:
			newPageHtml += '<div class="' + columnClass + 'c"><div class="ui-bar ui-bar-a" style="' + divLabelStyle + '"><i>Lunch</i></div></div>';
			break;
		case 3:
			newPageHtml += '<div class="' + columnClass + 'd"><div class="ui-bar ui-bar-a" style="' + divLabelStyle + '"><i>Lunch</i></div></div>';
			break;
		case 4:
			newPageHtml += '<div class="' + columnClass + 'e"><div class="ui-bar ui-bar-a" style="' + divLabelStyle + '"><i>Lunch</i></div></div>';
			break;			
		}			
	}
	//newPageHtml += '</div>';
	//newPageHtml += '<div style="' + divDataStyle + ';">';
	// lunch plates
	for (var i = 0; i < len; i++) {
		switch (i) {
		case 0:
			newPageHtml += '<div class="' + columnClass + 'a"><div class="ui-bar ui-bar-a" style="' + divDataStyle + '">'+ lunchPlates[i].name + '</div></div>';
			break;
		case 1:
			newPageHtml += '<div class="' + columnClass + 'b"><div class="ui-bar ui-bar-a" style="' + divDataStyle + '">'+ lunchPlates[i].name + '</div></div>';
			break;
		case 2:
			newPageHtml += '<div class="' + columnClass + 'c"><div class="ui-bar ui-bar-a" style="' + divDataStyle + '">'+ lunchPlates[i].name + '</div></div>';
			break;
		case 3:
			newPageHtml += '<div class="' + columnClass + 'd"><div class="ui-bar ui-bar-a" style="' + divDataStyle + '">'+ lunchPlates[i].name + '</div></div>';
			break;
		case 4:
			newPageHtml += '<div class="' + columnClass + 'e"><div class="ui-bar ui-bar-a" style="' + divDataStyle + '">'+ lunchPlates[i].name + '</div></div>';
			break;			
		}			
	}
	//newPageHtml += '</div>';
	//newPageHtml += '<div style="' + divLabelStyle + ';">';
	// dinner headers
	for (var i = 0; i < len; i++) {
		switch (i) {
		case 0:
			newPageHtml += '<div class="' + columnClass + 'a"><div class="ui-bar ui-bar-a" style="' + divLabelStyle + '"><i>Dinner</i></div></div>';
			break;
		case 1:
			newPageHtml += '<div class="' + columnClass + 'b"><div class="ui-bar ui-bar-a" style="' + divLabelStyle + '"><i>Dinner</i></div></div>';
			break;
		case 2:
			newPageHtml += '<div class="' + columnClass + 'c"><div class="ui-bar ui-bar-a" style="' + divLabelStyle + '"><i>Dinner</i></div></div>';
			break;
		case 3:
			newPageHtml += '<div class="' + columnClass + 'd"><div class="ui-bar ui-bar-a" style="' + divLabelStyle + '"><i>Dinner</i></div></div>';
			break;
		case 4:
			newPageHtml += '<div class="' + columnClass + 'e"><div class="ui-bar ui-bar-a" style="' + divLabelStyle + '"><i>Dinner</i></div></div>';
			break;			
		}			
	}
	//newPageHtml += '</div>';
	//newPageHtml += '<div style="' + divDataStyle + ';">';
	// dinner plates
	for (var i = 0; i < len; i++) {
		switch (i) {
		case 0:
			newPageHtml += '<div class="' + columnClass + 'a"><div class="ui-bar ui-bar-a" style="' + divDataStyle + '">'+ dinnerPlates[i].name + '</div></div>';
			break;
		case 1:
			newPageHtml += '<div class="' + columnClass + 'b"><div class="ui-bar ui-bar-a" style="' + divDataStyle + '">'+ dinnerPlates[i].name + '</div></div>';
			break;
		case 2:
			newPageHtml += '<div class="' + columnClass + 'c"><div class="ui-bar ui-bar-a" style="' + divDataStyle + '">'+ dinnerPlates[i].name + '</div></div>';
			break;
		case 3:
			newPageHtml += '<div class="' + columnClass + 'd"><div class="ui-bar ui-bar-a" style="' + divDataStyle + '">'+ dinnerPlates[i].name + '</div></div>';
			break;
		case 4:
			newPageHtml += '<div class="' + columnClass + 'e"><div class="ui-bar ui-bar-a" style="' + divDataStyle + '">'+ dinnerPlates[i].name + '</div></div>';
			break;			
		}			
	}
	//newPageHtml += '</div>';
	newPageHtml += '</div>';
	// end content and page:
	newPageHtml += '</div></div><script type="text/javascript"></script></div>';
	var newPage = $(newPageHtml);
	//add new dialog to page container
	newPage.appendTo($.mobile.pageContainer);
	// enhance and open the new page
    $.mobile.changePage(newPage);
}

function hijaxDinnerSlatePage() {
	/*
	 * <div data-role="page" id="home">
	<div data-role="header">
		<h1>5-Column Grid</h1>
	</div>

	<div data-role="content">
		<div class="ui-grid-d" style="text-align: center;"> 
			<div class="ui-block-a">&#xe21c;</div>
			<div class="ui-block-b">&#xe21d;</div>
			<div class="ui-block-c">&#xe21e;</div>	
			<div class="ui-block-d">&#xe21f;</div>
			<div class="ui-block-e">&#xe220;</div>
		</div>
	</div>
</div>

	 */
	var thresholdOffset = slateOffsetThreshold;
	var chalkColors = getScreenReportHues(2);
	var divHeaderStyle = 'color:' + makeColor(chalkColors[0]);
	var divDataStyle = 'color:' + makeColor(chalkColors[1]);
	
	var results = getReportGridArrays(thresholdOffset, 15, true);
	//alert("plateSlateCellApp hijaxDinnerSlatePage results.length " + results.length);
	var dows = results[0];
	var breakfastPlates = results[1]; // not used here
	var lunchPlates = results[2]; // not used here
	var dinnerPlates = results[3];
	var len = dows.length;
	// tjs 120120
	if (len < 3) {
		var paragraphs = new Array();
		paragraphs.push(insufficientDataLine1);
		paragraphs.push(insufficientDataLine2);
		hijaxAlertDial(insufficientDataTitle, paragraphs);
		return;
	}
	//alert("plateSlateCellApp hijaxDinnerSlatePage len " + len);
	// three column report
	var gridClass = 'ui-grid-b';
	var columnCase;

	var columnClass = 'ui-block-';
	var newPageHtml = '<div data-role="page" data-add-back-btn="true" id="dinner-slate-report-page" data-title="Dinner Slate">';
	newPageHtml += '<div data-role="header" data-theme="f" data-position="fixed">';
	//newPageHtml += '<a href="index.html" data-icon="home" data-iconpos="notext" data-direction="reverse" class="ui-btn-left jqm-home">Home</a>';
	newPageHtml += '<a href="#home-page" data-icon="home" data-iconpos="notext" data-direction="reverse" class="ui-btn-left jqm-home">Home</a>';
	newPageHtml += '<h1>Dinner Slate</h1>';
	newPageHtml += '</div>';
	newPageHtml += '<div data-role="content">';
	newPageHtml += '<div class="chalk">';
	newPageHtml += '<div class="' + gridClass + '" style="text-align: center;">';
	//newPageHtml += '<div class="chalk" style="' + divStyle + ';">';
	//newPageHtml += '<div class="chalk">';
	//newPageHtml += '<div style="' + divHeaderStyle + ';">';
	// grid headers (dow)
	for (var i = 0; i < len; i += 3) {
		//columnCase = (i + 1)%3;
		//columnCase = (i + 3)%3;
		//alert("plateSlateCellApp hijaxDinnerSlatePage i " + i + " columnCase " + columnCase);
		//newPageHtml += '<div style="' + divHeaderStyle + ';">';
		//switch (columnCase) {
			//case 0:
				newPageHtml += '<div class="' + columnClass + 'a"><div class="ui-bar ui-bar-a" style="' + divHeaderStyle + '"><strong>'+ dows[i] + '</strong></div></div>';
				//break;
			//case 1:
				if (typeof(dows[i + 1]) !== 'undefined') {
					newPageHtml += '<div class="' + columnClass + 'b"><div class="ui-bar ui-bar-a" style="' + divHeaderStyle + '"><strong>'+ dows[i + 1] + '</strong></div></div>';
				} else {
					newPageHtml += '<div class="' + columnClass + 'b"><div class="ui-bar ui-bar-a" style="' + divHeaderStyle + '">&nbsp;</div></div>';
				}
				//break;
			//case 2:
				if (typeof(dows[i + 2]) !== 'undefined') {
					newPageHtml += '<div class="' + columnClass + 'c"><div class="ui-bar ui-bar-a" style="' + divHeaderStyle + '"><strong>'+ dows[i + 2] + '</strong></div></div>';
				}else {
					newPageHtml += '<div class="' + columnClass + 'c"><div class="ui-bar ui-bar-a" style="' + divHeaderStyle + '">&nbsp;</div></div>';
				}
				//break;		
		//}		//	
		//newPageHtml += '</div>';
		//newPageHtml += '<div style="' + divDataStyle + ';">';
		//switch (columnCase) {
			//case 0:
				newPageHtml += '<div class="' + columnClass + 'a"><div class="ui-bar ui-bar-a" style="' + divDataStyle + '">'+ dinnerPlates[i].name + '</div></div>';
				//break;
			//case 1:
				if (typeof(dinnerPlates[i + 1]) !== 'undefined') {
				newPageHtml += '<div class="' + columnClass + 'b"><div class="ui-bar ui-bar-a" style="' + divDataStyle + '">'+ dinnerPlates[i + 1].name + '</div></div>';
				} else {
					newPageHtml += '<div class="' + columnClass + 'b"><div class="ui-bar ui-bar-a" style="' + divDataStyle + '">&nbsp;</div></div>';
				}
				//break;
			//case 2:
				if (typeof(dinnerPlates[i + 2]) !== 'undefined') {
				newPageHtml += '<div class="' + columnClass + 'c"><div class="ui-bar ui-bar-a" style="' + divDataStyle + '">'+ dinnerPlates[i + 2].name + '</div></div>';
				} else {
					newPageHtml += '<div class="' + columnClass + 'c"><div class="ui-bar ui-bar-a" style="' + divDataStyle + '">&nbsp;</div></div>';
				}
				//break;
		//}			
		//newPageHtml += '</div>';
		//switch (columnCase) {
			//case 0:
				newPageHtml += '<div class="' + columnClass + 'a">&nbsp;</div>';
				//break;
			//case 1:
				newPageHtml += '<div class="' + columnClass + 'b">&nbsp;</div>';
				//break;
			//case 2:
				newPageHtml += '<div class="' + columnClass + 'c">&nbsp;</div>';
				//break;
		//}			
	}
	newPageHtml += '</div>';
	newPageHtml += '</div></div><script type="text/javascript"></script></div>';
	var newPage = $(newPageHtml);
	//add new dialog to page container
	newPage.appendTo($.mobile.pageContainer);
	// enhance and open the new page
    $.mobile.changePage(newPage);
}

function hijaxDinnerPortionsSlatePage() {
	/*
	 * <div data-role="page" id="home">
	<div data-role="header">
		<h1>5-Column Grid</h1>
	</div>

	<div data-role="content">
		<div class="ui-grid-d" style="text-align: center;"> 
			<div class="ui-block-a">&#xe21c;</div>
			<div class="ui-block-b">&#xe21d;</div>
			<div class="ui-block-c">&#xe21e;</div>	
			<div class="ui-block-d">&#xe21f;</div>
			<div class="ui-block-e">&#xe220;</div>
		</div>
	</div>
</div>

PortionName		Color		Border
Grains			dd7d22		e8ba97
Protein			705b9b		ac99c8
Vegetables		00b65b		c9dc3c
Fruits			dc332e		fa98ae

Dairy			4c98d0		8cc7eb

	 */
	var thresholdOffset = slateOffsetThreshold;
	var chalkColors = getScreenReportHues(3);
	var divHeaderStyle = 'color:' + makeColor(chalkColors[0]);
	var divLabelStyle = 'color:' + makeColor(chalkColors[1]);
	var divDataStyle = 'color:' + makeColor(chalkColors[2]);
	
	var results = getReportGridArrays(thresholdOffset, 4, false);
	// tjs 131231
//	alert("plateSlateCellApp hijaxScreenReportPage results.length " + results.length);
	console.log("plateSlateCellApp hijaxScreenReportPage results.length " + results.length);
	var dows = results[0];
	var breakfastPlates = results[1]; // not needed here
	var lunchPlates = results[2]; // not needed here
	var dinnerPlates = results[3];
	// tjs 120116
	var dinnerPortions = results[6];
	var len = dows.length;
	// tjs 120120
	if (len < 2) {
		var paragraphs = new Array();
		paragraphs.push(insufficientDataLine1);
		paragraphs.push(insufficientDataLine2);
		hijaxAlertDial(insufficientDataTitle, paragraphs);
		return;
	}
	var gridClass = 'ui-grid-';
	if (len < 3)
		gridClass += 'b';
	else if (len < 4)
		gridClass += 'c';
	else if (len < 5)
		gridClass += 'd';

	var columnClass = 'ui-block-';
	var newPageHtml = '<div data-role="page" data-add-back-btn="true" id="dinner-portions-slate-report-page" data-title="Dinner Portions Slate">';
	newPageHtml += '<div data-role="header" data-theme="f" data-position="fixed">';
	//newPageHtml += '<a href="index.html" data-icon="home" data-iconpos="notext" data-direction="reverse" class="ui-btn-left jqm-home">Home</a>';
	newPageHtml += '<a href="#home-page" data-icon="home" data-iconpos="notext" data-direction="reverse" class="ui-btn-left jqm-home">Home</a>';
	newPageHtml += '<h1>Dinner Portions Slate</h1>';
	newPageHtml += '</div>';
	newPageHtml += '<div data-role="content">';
	newPageHtml += '<div class="chalk">';
	newPageHtml += '<div class="' + gridClass + '" style="text-align: center;">';
	//newPageHtml += '<div class="chalk" style="' + divStyle + ';">';
	//newPageHtml += '<div class="chalk">';
	//newPageHtml += '<div style="' + divHeaderStyle + ';">';
	newPageHtml += '<div class="' + columnClass + 'a"><div class="ui-bar ui-bar-a" style="' + divHeaderStyle + '">&nbsp;</div></div>';
	// grid headers (dow)
	for (var i = 0; i < len; i++) {
		switch (i) {
		case 0:
			newPageHtml += '<div class="' + columnClass + 'b"><div class="ui-bar ui-bar-a" style="' + divHeaderStyle + '"><strong>'+ dows[i] + '</strong></div></div>';
			break;
		case 1:
			newPageHtml += '<div class="' + columnClass + 'c"><div class="ui-bar ui-bar-a" style="' + divHeaderStyle + '"><strong>'+ dows[i] + '</strong></div></div>';
			break;
		case 2:
			newPageHtml += '<div class="' + columnClass + 'd"><div class="ui-bar ui-bar-a" style="' + divHeaderStyle + '"><strong>'+ dows[i] + '</strong></div></div>';
			break;
		case 3:
			newPageHtml += '<div class="' + columnClass + 'e"><div class="ui-bar ui-bar-a" style="' + divHeaderStyle + '"><strong>'+ dows[i] + '</strong></div></div>';
			break;		
		}			
	}
	//newPageHtml += '</div>';
	
	//newPageHtml += '<div style="' + divLabelStyle + ';">';
	newPageHtml += '<div class="' + columnClass + 'a"><div class="ui-bar ui-bar-a" style="' + divLabelStyle + '">Dinner</div></div>';
	// grid headers (dow)
	for (var i = 0; i < len; i++) {
		switch (i) {
		case 0:
			newPageHtml += '<div class="' + columnClass + 'b"><div class="ui-bar ui-bar-a" style="' + divLabelStyle + '"><strong>'+ dinnerPlates[i].name + '</strong></div></div>';
			break;
		case 1:
			newPageHtml += '<div class="' + columnClass + 'c"><div class="ui-bar ui-bar-a" style="' + divLabelStyle + '"><strong>'+ dinnerPlates[i].name + '</strong></div></div>';
			break;
		case 2:
			newPageHtml += '<div class="' + columnClass + 'd"><div class="ui-bar ui-bar-a" style="' + divLabelStyle + '"><strong>'+ dinnerPlates[i].name + '</strong></div></div>';
			break;
		case 3:
			newPageHtml += '<div class="' + columnClass + 'e"><div class="ui-bar ui-bar-a" style="' + divLabelStyle + '"><strong>'+ dinnerPlates[i].name + '</strong></div></div>';
			break;		
		}			
	}
	//newPageHtml += '</div>';

	//newPageHtml += '<div style="' + divDataStyle + ';">';
	newPageHtml += '<div class="' + columnClass + 'a"><div class="ui-bar ui-bar-a" style="color: #dd7d22;">Grain</div></div>';
	// grain portions
	for (var i = 0; i < len; i++) {
		var typePortions = dinnerPortions[i];
		var typePortion = '&nbsp;';
		for (j = 0; j < typePortions.length; j++) {
			// tjs 131218
			//var portion = portions[typePortions[j]];
			var portion = getPortionById(typePortions[j]);
			// tjs 131231
			console.log("portion id " + typePortions[j] + " type " + portion.type);
			if (portion.type == "Grain") 
				typePortion += portion.name + '&nbsp;';
		}
		switch (i) {
		case 0:
			newPageHtml += '<div class="' + columnClass + 'b"><div class="ui-bar ui-bar-a" style="' + divDataStyle + '">'+ typePortion + '</div></div>';
			break;
		case 1:
			newPageHtml += '<div class="' + columnClass + 'c"><div class="ui-bar ui-bar-a" style="' + divDataStyle + '">'+ typePortion + '</div></div>';
			break;
		case 2:
			newPageHtml += '<div class="' + columnClass + 'd"><div class="ui-bar ui-bar-a" style="' + divDataStyle + '">'+ typePortion + '</div></div>';
			break;
		case 3:
			newPageHtml += '<div class="' + columnClass + 'e"><div class="ui-bar ui-bar-a" style="' + divDataStyle + '">'+ typePortion + '</div></div>';
			break;
		case 4:
			break;			
		}			
	}
	//newPageHtml += '</div>';

	//newPageHtml += '<div style="' + divDataStyle + ';">';
	newPageHtml += '<div class="' + columnClass + 'a"><div class="ui-bar ui-bar-a" style="color: #705b9b;">Protein</div></div>';
	// protein portions
	for (var i = 0; i < len; i++) {
		var typePortions = dinnerPortions[i];
		var typePortion = '&nbsp;';
		for (j = 0; j < typePortions.length; j++) {
			//var portion = portions[typePortions[j]];
			var portion = getPortionById(typePortions[j]);
			if (portion.type == "Protein") 
				typePortion += portion.name + '&nbsp;';
		}
		switch (i) {
		case 0:
			newPageHtml += '<div class="' + columnClass + 'b"><div class="ui-bar ui-bar-a" style="' + divDataStyle + '">'+ typePortion + '</div></div>';
			break;
		case 1:
			newPageHtml += '<div class="' + columnClass + 'c"><div class="ui-bar ui-bar-a" style="' + divDataStyle + '">'+ typePortion + '</div></div>';
			break;
		case 2:
			newPageHtml += '<div class="' + columnClass + 'd"><div class="ui-bar ui-bar-a" style="' + divDataStyle + '">'+ typePortion + '</div></div>';
			break;
		case 3:
			newPageHtml += '<div class="' + columnClass + 'e"><div class="ui-bar ui-bar-a" style="' + divDataStyle + '">'+ typePortion + '</div></div>';
			break;
		case 4:
			break;			
		}			
	}
	//newPageHtml += '</div>';
	
	//newPageHtml += '<div style="' + divDataStyle + ';">';
	newPageHtml += '<div class="' + columnClass + 'a"><div class="ui-bar ui-bar-a" style="color: #00b65b;">Vegetable</div></div>';
	// vegetable portions
	for (var i = 0; i < len; i++) {
		var typePortions = dinnerPortions[i];
		var typePortion = '&nbsp;';
		for (j = 0; j < typePortions.length; j++) {
			//var portion = portions[typePortions[j]];
			var portion = getPortionById(typePortions[j]);
			if (portion.type == "Vegetables") 
				typePortion += portion.name + '&nbsp;';
		}
		switch (i) {
		case 0:
			newPageHtml += '<div class="' + columnClass + 'b"><div class="ui-bar ui-bar-a" style="' + divDataStyle + '">'+ typePortion + '</div></div>';
			break;
		case 1:
			newPageHtml += '<div class="' + columnClass + 'c"><div class="ui-bar ui-bar-a" style="' + divDataStyle + '">'+ typePortion + '</div></div>';
			break;
		case 2:
			newPageHtml += '<div class="' + columnClass + 'd"><div class="ui-bar ui-bar-a" style="' + divDataStyle + '">'+ typePortion + '</div></div>';
			break;
		case 3:
			newPageHtml += '<div class="' + columnClass + 'e"><div class="ui-bar ui-bar-a" style="' + divDataStyle + '">'+ typePortion + '</div></div>';
			break;
		case 4:
			break;			
		}			
	}
	//newPageHtml += '</div>';
	
	//newPageHtml += '<div style="' + divDataStyle + ';">';
	newPageHtml += '<div class="' + columnClass + 'a"><div class="ui-bar ui-bar-a" style="color: #dc332e;">Fruit</div></div>';
	// fruit portions
	for (var i = 0; i < len; i++) {
		var typePortions = dinnerPortions[i];
		var typePortion = '&nbsp;';
		for (j = 0; j < typePortions.length; j++) {
			//var portion = portions[typePortions[j]];
			var portion = getPortionById(typePortions[j]);
			if (portion.type == "Fruits") 
				typePortion += portion.name + '&nbsp;';
		}
		switch (i) {
		case 0:
			newPageHtml += '<div class="' + columnClass + 'b"><div class="ui-bar ui-bar-a" style="' + divDataStyle + '">'+ typePortion + '</div></div>';
			break;
		case 1:
			newPageHtml += '<div class="' + columnClass + 'c"><div class="ui-bar ui-bar-a" style="' + divDataStyle + '">'+ typePortion + '</div></div>';
			break;
		case 2:
			newPageHtml += '<div class="' + columnClass + 'd"><div class="ui-bar ui-bar-a" style="' + divDataStyle + '">'+ typePortion + '</div></div>';
			break;
		case 3:
			newPageHtml += '<div class="' + columnClass + 'e"><div class="ui-bar ui-bar-a" style="' + divDataStyle + '">'+ typePortion + '</div></div>';
			break;
		case 4:
			break;			
		}			
	}
	//newPageHtml += '</div>';
	
	//newPageHtml += '<div style="' + divDataStyle + ';">';
	newPageHtml += '<div class="' + columnClass + 'a"><div class="ui-bar ui-bar-a" style="color: #4c98d0;">Dairy</div></div>';
	// dairy portions
	for (var i = 0; i < len; i++) {
		var typePortions = dinnerPortions[i];
		var typePortion = '&nbsp;';
		for (j = 0; j < typePortions.length; j++) {
			var portion = getPortionById(typePortions[j]);
			if (portion.type == "Dairy") 
				typePortion += portion.name + '&nbsp;';
		}
		switch (i) {
		case 0:
			newPageHtml += '<div class="' + columnClass + 'b"><div class="ui-bar ui-bar-a" style="' + divDataStyle + '">'+ typePortion + '</div></div>';
			break;
		case 1:
			newPageHtml += '<div class="' + columnClass + 'c"><div class="ui-bar ui-bar-a" style="' + divDataStyle + '">'+ typePortion + '</div></div>';
			break;
		case 2:
			newPageHtml += '<div class="' + columnClass + 'd"><div class="ui-bar ui-bar-a" style="' + divDataStyle + '">'+ typePortion + '</div></div>';
			break;
		case 3:
			newPageHtml += '<div class="' + columnClass + 'e"><div class="ui-bar ui-bar-a" style="' + divDataStyle + '">'+ typePortion + '</div></div>';
			break;
		case 4:
			break;			
		}			
	}
	//newPageHtml += '</div>';

	newPageHtml += '</div>';
	newPageHtml += '</div></div><script type="text/javascript"></script></div>';
	var newPage = $(newPageHtml);
	//add new dialog to page container
	newPage.appendTo($.mobile.pageContainer);
	// enhance and open the new page
    $.mobile.changePage(newPage);
}

function hijaxKitchenPortionsWhiteboardPage() {
	/*
	 * <div data-role="page" id="home">
	<div data-role="header">
		<h1>5-Column Grid</h1>
	</div>

	<div data-role="content">
		<div class="ui-grid-d" style="text-align: center;"> 
			<div class="ui-block-a">&#xe21c;</div>
			<div class="ui-block-b">&#xe21d;</div>
			<div class="ui-block-c">&#xe21e;</div>	
			<div class="ui-block-d">&#xe21f;</div>
			<div class="ui-block-e">&#xe220;</div>
		</div>
	</div>
</div>

PortionName		Color		Border
Grains			dd7d22		e8ba97
Protein			705b9b		ac99c8
Vegetables		00b65b		c9dc3c
Fruits			dc332e		fa98ae

Dairy			4c98d0		8cc7eb

	 */
	var thresholdOffset = slateOffsetThreshold;
	var chalkColors = getScreenReportHues(3);
	var divHeaderStyle = 'color:' + makeColor(chalkColors[0]);
	var divLabelStyle = 'color:' + makeColor(chalkColors[1]);
	var divDataStyle = 'color:' + makeColor(chalkColors[2]);
	
	var results = getReportGridArrays(thresholdOffset, 5, false);
//	alert("plateSlateCellApp hijaxScreenReportPage results.length " + results.length);
	var dows = results[0];
	var breakfastPlates = results[1]; // not needed here
	var lunchPlates = results[2]; // not needed here
	var dinnerPlates = results[3];
	var breakfastPortions = results[4];
	var lunchPortions = results[5];
	var dinnerPortions = results[6];
	var len = dows.length;
	// tjs 120120
	if (len < 2) {
		var paragraphs = new Array();
		paragraphs.push(insufficientDataLine1);
		paragraphs.push(insufficientDataLine2);
		hijaxAlertDial(insufficientDataTitle, paragraphs);
		return;
	}
	//if (len < 2)
	//	return;
	var gridClass = 'ui-grid-';
	if (len < 3)
		gridClass += 'a';
	else if (len < 4)
		gridClass += 'b';
	else if (len < 5)
		gridClass += 'c';
	else if (len < 6)
		gridClass += 'd';
	var columnClass = 'ui-block-';
	var newPageHtml = '<div data-role="page" data-add-back-btn="true" id="kitchen-portions-whiteboard-report-page" data-title="Kitchen Portions Whiteboard">';
	newPageHtml += '<div data-role="header" data-theme="f" data-position="fixed">';
	//newPageHtml += '<a href="index.html" data-icon="home" data-iconpos="notext" data-direction="reverse" class="ui-btn-left jqm-home">Home</a>';
	newPageHtml += '<a href="#home-page" data-icon="home" data-iconpos="notext" data-direction="reverse" class="ui-btn-left jqm-home">Home</a>';
	newPageHtml += '<h1>Kitchen Portions Whiteboard</h1>';
	newPageHtml += '</div>';
	newPageHtml += '<div data-role="content">';
	newPageHtml += '<div class="felt">';
	newPageHtml += '<div class="' + gridClass + '" style="text-align: center;">';
	//newPageHtml += '<div class="felt">';
	//newPageHtml += '<div style="' + divHeaderStyle + ';">';
	// grid headers (dow)
	for (var i = 0; i < len; i++) {
		switch (i) {
		case 0:
			newPageHtml += '<div class="' + columnClass + 'a"><div class="ui-bar ui-bar-a" style="' + divHeaderStyle + '"><strong>'+ dows[i] + '</strong></div></div>';
			break;
		case 1:
			newPageHtml += '<div class="' + columnClass + 'b"><div class="ui-bar ui-bar-a" style="' + divHeaderStyle + '"><strong>'+ dows[i] + '</strong></div></div>';
			break;
		case 2:
			newPageHtml += '<div class="' + columnClass + 'c"><div class="ui-bar ui-bar-a" style="' + divHeaderStyle + '"><strong>'+ dows[i] + '</strong></div></div>';
			break;
		case 3:
			newPageHtml += '<div class="' + columnClass + 'd"><div class="ui-bar ui-bar-a" style="' + divHeaderStyle + '"><strong>'+ dows[i] + '</strong></div></div>';
			break;
		case 4:
			newPageHtml += '<div class="' + columnClass + 'e"><div class="ui-bar ui-bar-a" style="' + divHeaderStyle + '"><strong>'+ dows[i] + '</strong></div></div>';
			break;			
		}			
	}
	//newPageHtml += '</div>';
	//newPageHtml += '<div style="' + divLabelStyle + ';">';
	// breakfast headers
	for (var i = 0; i < len; i++) {
		switch (i) {
		case 0:
			newPageHtml += '<div class="' + columnClass + 'a"><div class="ui-bar ui-bar-a" style="' + divLabelStyle + '"><i>Breakfast</i></div></div>';
			break;
		case 1:
			newPageHtml += '<div class="' + columnClass + 'b"><div class="ui-bar ui-bar-a" style="' + divLabelStyle + '"><i>Breakfast</i></div></div>';
			break;
		case 2:
			newPageHtml += '<div class="' + columnClass + 'c"><div class="ui-bar ui-bar-a" style="' + divLabelStyle + '"><i>Breakfast</i></div></div>';
			break;
		case 3:
			newPageHtml += '<div class="' + columnClass + 'd"><div class="ui-bar ui-bar-a" style="' + divLabelStyle + '"><i>Breakfast</i></div></div>';
			break;
		case 4:
			newPageHtml += '<div class="' + columnClass + 'e"><div class="ui-bar ui-bar-a" style="' + divLabelStyle + '"><i>Breakfast</i></div></div>';
			break;			
		}			
	}
	//newPageHtml += '</div>';
	//newPageHtml += '<div style="' + divDataStyle + ';">';
	// breakfast plates
	for (var i = 0; i < len; i++) {
		switch (i) {
		case 0:
			//newPageHtml += '<div class="' + columnClass + 'a">'+ breakfastPlates[i] + '</div>';
			newPageHtml += '<div class="' + columnClass + 'a"><div class="ui-bar ui-bar-a" style="' + divDataStyle + '">'+ breakfastPlates[i].name + '</div></div>';
			break;
		case 1:
			newPageHtml += '<div class="' + columnClass + 'b"><div class="ui-bar ui-bar-a" style="' + divDataStyle + '">'+ breakfastPlates[i].name + '</div></div>';
			break;
		case 2:
			newPageHtml += '<div class="' + columnClass + 'c"><div class="ui-bar ui-bar-a" style="' + divDataStyle + '">'+ breakfastPlates[i].name + '</div></div>';
			break;
		case 3:
			newPageHtml += '<div class="' + columnClass + 'd"><div class="ui-bar ui-bar-a" style="' + divDataStyle + '">'+ breakfastPlates[i].name + '</div></div>';
			break;
		case 4:
			newPageHtml += '<div class="' + columnClass + 'e"><div class="ui-bar ui-bar-a" style="' + divDataStyle + '">'+ breakfastPlates[i].name + '</div></div>';
			break;			
		}			
	}
	//newPageHtml += '</div>';
	
	// add breakfast portions
	for (var i = 0; i < len; i++) {
		var typePortions = breakfastPortions[i];
		var typePortion = '&nbsp;';
		for (j = 0; j < typePortions.length; j++) {
			var portion = getPortionById(typePortions[j]);
			if (portion.type == "Grain") {
				typePortion += '<div class="ui-bar ui-bar-a" style="color: #dd7d22;">' + portion.name + '</div>&nbsp;';
			} else	if (portion.type == "Protein") {
				typePortion += '<div class="ui-bar ui-bar-a" style="color: #705b9b;">' + portion.name + '</div>&nbsp;';
			} else	if (portion.type == "Vegetables") {
				typePortion += '<div class="ui-bar ui-bar-a" style="color: #00b65b;">' + portion.name + '</div>&nbsp;';
			} else	if (portion.type == "Fruits") {
				typePortion += '<div class="ui-bar ui-bar-a" style="color: #dc332e;">' + portion.name + '</div>&nbsp;';
			} else	if (portion.type == "Dairy") {
				typePortion += '<div class="ui-bar ui-bar-a" style="color: #4c98d0;">' + portion.name + '</div>&nbsp;';
			}
		}

		switch (i) {
		case 0:
			//newPageHtml += '<div class="' + columnClass + 'a">'+ breakfastPlates[i] + '</div>';
			newPageHtml += '<div class="' + columnClass + 'a">'+ typePortion + '</div>';
			break;
		case 1:
			newPageHtml += '<div class="' + columnClass + 'b">'+ typePortion + '</div>';
			break;
		case 2:
			newPageHtml += '<div class="' + columnClass + 'c">'+ typePortion + '</div>';
			break;
		case 3:
			newPageHtml += '<div class="' + columnClass + 'd">'+ typePortion + '</div>';
			break;
		case 4:
			newPageHtml += '<div class="' + columnClass + 'e">'+ typePortion + '</div>';
			break;			
		}			
	}
	
	//newPageHtml += '<div style="' + divLabelStyle + ';">';
	// lunch headers
	for (var i = 0; i < len; i++) {
		switch (i) {
		case 0:
			newPageHtml += '<div class="' + columnClass + 'a"><div class="ui-bar ui-bar-a" style="' + divLabelStyle + '"><i>Lunch</i></div></div>';
			break;
		case 1:
			newPageHtml += '<div class="' + columnClass + 'b"><div class="ui-bar ui-bar-a" style="' + divLabelStyle + '"><i>Lunch</i></div></div>';
			break;
		case 2:
			newPageHtml += '<div class="' + columnClass + 'c"><div class="ui-bar ui-bar-a" style="' + divLabelStyle + '"><i>Lunch</i></div></div>';
			break;
		case 3:
			newPageHtml += '<div class="' + columnClass + 'd"><div class="ui-bar ui-bar-a" style="' + divLabelStyle + '"><i>Lunch</i></div></div>';
			break;
		case 4:
			newPageHtml += '<div class="' + columnClass + 'e"><div class="ui-bar ui-bar-a" style="' + divLabelStyle + '"><i>Lunch</i></div></div>';
			break;			
		}			
	}
	//newPageHtml += '</div>';
	//newPageHtml += '<div style="' + divDataStyle + ';">';
	// lunch plates
	for (var i = 0; i < len; i++) {
		switch (i) {
		case 0:
			newPageHtml += '<div class="' + columnClass + 'a"><div class="ui-bar ui-bar-a" style="' + divDataStyle + '">'+ lunchPlates[i].name + '</div></div>';
			break;
		case 1:
			newPageHtml += '<div class="' + columnClass + 'b"><div class="ui-bar ui-bar-a" style="' + divDataStyle + '">'+ lunchPlates[i].name + '</div></div>';
			break;
		case 2:
			newPageHtml += '<div class="' + columnClass + 'c"><div class="ui-bar ui-bar-a" style="' + divDataStyle + '">'+ lunchPlates[i].name + '</div></div>';
			break;
		case 3:
			newPageHtml += '<div class="' + columnClass + 'd"><div class="ui-bar ui-bar-a" style="' + divDataStyle + '">'+ lunchPlates[i].name + '</div></div>';
			break;
		case 4:
			newPageHtml += '<div class="' + columnClass + 'e"><div class="ui-bar ui-bar-a" style="' + divDataStyle + '">'+ lunchPlates[i].name + '</div></div>';
			break;			
		}			
	}
	//newPageHtml += '</div>';
	
	// add lunch portions
	for (var i = 0; i < len; i++) {
		var typePortions = lunchPortions[i];
		var typePortion = '&nbsp;';
		for (j = 0; j < typePortions.length; j++) {
			var portion = getPortionById(typePortions[j]);
			if (portion.type == "Grain") {
				typePortion += '<div class="ui-bar ui-bar-a" style="color: #dd7d22;">' + portion.name + '</div>&nbsp;';
			} else	if (portion.type == "Protein") {
				typePortion += '<div class="ui-bar ui-bar-a" style="color: #705b9b;">' + portion.name + '</div>&nbsp;';
			} else	if (portion.type == "Vegetables") {
				typePortion += '<div class="ui-bar ui-bar-a" style="color: #00b65b;">' + portion.name + '</div>&nbsp;';
			} else	if (portion.type == "Fruits") {
				typePortion += '<div class="ui-bar ui-bar-a" style="color: #dc332e;">' + portion.name + '</div>&nbsp;';
			} else	if (portion.type == "Dairy") {
				typePortion += '<div class="ui-bar ui-bar-a" style="color: #4c98d0;">' + portion.name + '</div>&nbsp;';
			}
		}

		switch (i) {
		case 0:
			//newPageHtml += '<div class="' + columnClass + 'a">'+ breakfastPlates[i] + '</div>';
			newPageHtml += '<div class="' + columnClass + 'a">'+ typePortion + '</div>';
			break;
		case 1:
			newPageHtml += '<div class="' + columnClass + 'b">'+ typePortion + '</div>';
			break;
		case 2:
			newPageHtml += '<div class="' + columnClass + 'c">'+ typePortion + '</div>';
			break;
		case 3:
			newPageHtml += '<div class="' + columnClass + 'd">'+ typePortion + '</div>';
			break;
		case 4:
			newPageHtml += '<div class="' + columnClass + 'e">'+ typePortion + '</div>';
			break;			
		}			
	}
	
	//newPageHtml += '<div style="' + divLabelStyle + ';">';
	// dinner headers
	for (var i = 0; i < len; i++) {
		switch (i) {
		case 0:
			newPageHtml += '<div class="' + columnClass + 'a"><div class="ui-bar ui-bar-a" style="' + divLabelStyle + '"><i>Dinner</i></div></div>';
			break;
		case 1:
			newPageHtml += '<div class="' + columnClass + 'b"><div class="ui-bar ui-bar-a" style="' + divLabelStyle + '"><i>Dinner</i></div></div>';
			break;
		case 2:
			newPageHtml += '<div class="' + columnClass + 'c"><div class="ui-bar ui-bar-a" style="' + divLabelStyle + '"><i>Dinner</i></div></div>';
			break;
		case 3:
			newPageHtml += '<div class="' + columnClass + 'd"><div class="ui-bar ui-bar-a" style="' + divLabelStyle + '"><i>Dinner</i></div></div>';
			break;
		case 4:
			newPageHtml += '<div class="' + columnClass + 'e"><div class="ui-bar ui-bar-a" style="' + divLabelStyle + '"><i>Dinner</i></div></div>';
			break;			
		}			
	}
	//newPageHtml += '</div>';
	//newPageHtml += '<div style="' + divDataStyle + ';">';
	// dinner plates
	for (var i = 0; i < len; i++) {
		switch (i) {
		case 0:
			newPageHtml += '<div class="' + columnClass + 'a"><div class="ui-bar ui-bar-a" style="' + divDataStyle + '">'+ dinnerPlates[i].name + '</div></div>';
			break;
		case 1:
			newPageHtml += '<div class="' + columnClass + 'b"><div class="ui-bar ui-bar-a" style="' + divDataStyle + '">'+ dinnerPlates[i].name + '</div></div>';
			break;
		case 2:
			newPageHtml += '<div class="' + columnClass + 'c"><div class="ui-bar ui-bar-a" style="' + divDataStyle + '">'+ dinnerPlates[i].name + '</div></div>';
			break;
		case 3:
			newPageHtml += '<div class="' + columnClass + 'd"><div class="ui-bar ui-bar-a" style="' + divDataStyle + '">'+ dinnerPlates[i].name + '</div></div>';
			break;
		case 4:
			newPageHtml += '<div class="' + columnClass + 'e"><div class="ui-bar ui-bar-a" style="' + divDataStyle + '">'+ dinnerPlates[i].name + '</div></div>';
			break;			
		}			
	}
	//newPageHtml += '</div>';
	
	// add dinner portions
	for (var i = 0; i < len; i++) {
		var typePortions = dinnerPortions[i];
		var typePortion = '&nbsp;';
		for (j = 0; j < typePortions.length; j++) {
			var portion = getPortionById(typePortions[j]);
			if (portion.type == "Grain") {
				typePortion += '<div class="ui-bar ui-bar-a" style="color: #dd7d22;">' + portion.name + '</div>&nbsp;';
			} else	if (portion.type == "Protein") {
				typePortion += '<div class="ui-bar ui-bar-a" style="color: #705b9b;">' + portion.name + '</div>&nbsp;';
			} else	if (portion.type == "Vegetables") {
				typePortion += '<div class="ui-bar ui-bar-a" style="color: #00b65b;">' + portion.name + '</div>&nbsp;';
			} else	if (portion.type == "Fruits") {
				typePortion += '<div class="ui-bar ui-bar-a" style="color: #dc332e;">' + portion.name + '</div>&nbsp;';
			} else	if (portion.type == "Dairy") {
				typePortion += '<div class="ui-bar ui-bar-a" style="color: #4c98d0;">' + portion.name + '</div>&nbsp;';
			}
		}

		switch (i) {
		case 0:
			//newPageHtml += '<div class="' + columnClass + 'a">'+ breakfastPlates[i] + '</div>';
			newPageHtml += '<div class="' + columnClass + 'a">'+ typePortion + '</div>';
			break;
		case 1:
			newPageHtml += '<div class="' + columnClass + 'b">'+ typePortion + '</div>';
			break;
		case 2:
			newPageHtml += '<div class="' + columnClass + 'c">'+ typePortion + '</div>';
			break;
		case 3:
			newPageHtml += '<div class="' + columnClass + 'd">'+ typePortion + '</div>';
			break;
		case 4:
			newPageHtml += '<div class="' + columnClass + 'e">'+ typePortion + '</div>';
			break;			
		}			
	}
	
	newPageHtml += '</div>';
	newPageHtml += '</div></div><script type="text/javascript"></script></div>';
	var newPage = $(newPageHtml);
	//add new dialog to page container
	newPage.appendTo($.mobile.pageContainer);
	// enhance and open the new page
    $.mobile.changePage(newPage);
}

// tjs 120322
function hijaxSlateOfPlatesPages() {
	/*
	 * template:
	 * first page (i.e. page 1) this was index.html:
<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="utf-8">
	<meta name="viewport" content="width=device-width, initial-scale=1">
	<title>jQM Pagination Demo - 1</title>
	<link rel="stylesheet" href="http://code.jquery.com/mobile/1.0b2/jquery.mobile-1.0b2.min.css" />
	<link rel="stylesheet" href="../jquery.mobile.pagination.css">
	<link rel="stylesheet" href="demo.css">	
	<script src="http://code.jquery.com/jquery-1.6.2.min.js"></script>
	<script src="http://code.jquery.com/mobile/1.0b2/jquery.mobile-1.0b2.min.js"></script>
	<script src="../jquery.mobile.pagination.js"></script>
</head>
<body>
	<img src="_img/1.jpg" alt="Clog with flowers planted in it">	
	<ul data-role="pagination">
		<li class="ui-pagination-prev"><a href="4.html">Prev</a></li>
		<li class="ui-pagination-next"><a href="2.html">Next</a></li>
	</ul>
</body>
</html>
 final page returns to page 1 see last link
<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="utf-8">
	<meta name="viewport" content="width=device-width, initial-scale=1">
	<title>jQM Pagination Demo - 4</title>
	<link rel="stylesheet" href="http://code.jquery.com/mobile/1.0b2/jquery.mobile-1.0b2.min.css" />
	<link rel="stylesheet" href="../jquery.mobile.pagination.css">
	<link rel="stylesheet" href="demo.css">
	<script src="http://code.jquery.com/jquery-1.6.2.min.js"></script>
	<script src="http://code.jquery.com/mobile/1.0b2/jquery.mobile-1.0b2.min.js"></script>
	<script src="../jquery.mobile.pagination.js"></script>
</head>
<body>
	<img src="_img/4.jpg" alt="A textured wall in Amsterdam">	
	<ul data-role="pagination">
		<li class="ui-pagination-prev"><a href="3.html">Prev</a></li>
		<li class="ui-pagination-next"><a href="index.html">Next</a></li>
	</ul>
</body>
</html>

PortionName		Color		Border
Grains			dd7d22		e8ba97
Protein			705b9b		ac99c8
Vegetables		00b65b		c9dc3c
Fruits			dc332e		fa98ae

Dairy			4c98d0		8cc7eb

	 */
	var thresholdOffset = slateOffsetThreshold;
	//var results = getReportGridArrays(thresholdOffset, 7, false);
	var results = getReportGridArrays(thresholdOffset, 10, false);
	//alert("plateSlateCellApp hijaxSlateOfPlatesPages results.length " + results.length);
	// e.g. plateSlateCellApp hijaxSlateOfPlatesPages results.length 8
	// tjs 120328
	var dows = results[0];
	//viewSlatesDows = results[0];
	viewSlatesNames = results[7];

	var breakfastPlates = results[1]; 
	var lunchPlates = results[2]; 
	var dinnerPlates = results[3];
	var breakfastPortions = results[4];
	var lunchPortions = results[5];
	var dinnerPortions = results[6];
	var len = dows.length;
	//var len = viewSlatesDows.length;
	//alert("plateSlateCellApp hijaxSlateOfPlatesPages dows length " + len + " viewSlatesNames length " + viewSlatesNames.length);
	// e.g. plateSlateCellApp hijaxSlateOfPlatesPages dows length 2 viewSlatesNames length 2
	// tjs 120327
	if (len < 2) {
		//var paragraphs = new Array();
		//paragraphs.push(insufficientDataLine1);
		//paragraphs.push(insufficientDataLine2);
		//hijaxAlertDial(insufficientDataTitle, paragraphs);
		//return;
		openSlatePlansPage();
	}
	
    // Remove all old slate pages
    $('.slatePage').remove();
    // Add the new slate pages
    var currentDow = addSlatePages(dows, breakfastPlates, lunchPlates, dinnerPlates, breakfastPortions, lunchPortions, dinnerPortions);
    //var currentDow = addSlatePages(breakfastPlates, lunchPlates, dinnerPlates, breakfastPortions, lunchPortions, dinnerPortions);
   	//alert("plateSlateCellApp hijaxSlateOfPlatesPages currentDow " + currentDow);

    // Switch to the current slate's menu page
    $.mobile.changePage( '#' + currentDow, { transition: 'flip', reverse: true } );
} 

function addSlatePages(dows, breakfastPlates, lunchPlates, dinnerPlates, breakfastPortions, lunchPortions, dinnerPortions) {
//function addSlatePages(breakfastPlates, lunchPlates, dinnerPlates, breakfastPortions, lunchPortions, dinnerPortions) {
	var chalkColors = getScreenReportHues(3);
	var divHeaderStyle = 'color:' + makeColor(chalkColors[0]);
	var divLabelStyle = 'color:' + makeColor(chalkColors[1]);
	var divDataStyle = 'color:' + makeColor(chalkColors[2]);
	//var currentDow = dows[0];
	//var currentDow = viewSlatesDows[0];
	var currentDow = viewSlatesNames[0];

    // Store a reference to the previously added page
	var results;
    var prevPage = null;
    var prevPageDateName = null;

    // tjs 120326
    var colorOffset = 0;
    var synchronizedColor = 0;
    
    // tjs 131126
	var viewSlatesNameDate;
	var viewSlatesName;

   	//alert("plateSlateCellApp addSlatePages dows length " + dows.length + " viewSlatesNames length " + viewSlatesNames.length);
   	// e.g. 7
   	// e.g. plateSlateCellApp addSlatePages dows length 2 viewSlatesNames length 2
    
    // Create each page's markup
    for ( var i=0; i<dows.length; i++ ) {
    	viewSlatesNameDate = new Date(viewSlatesNames[i]);
    	viewSlatesName = viewSlatesNameDate.toDateString();
    	viewSlatesName = viewSlatesName.replace(/\s/g,'_');
    	viewSlatesName = viewSlatesName.replace(/,/g,'');

    	//results = addSlatePage(prevPageDateName, divHeaderStyle, divLabelStyle, divDataStyle, dows[i], viewSlatesNames[i], breakfastPlates[i].name, lunchPlates[i].name, dinnerPlates[i].name, breakfastPortions[i], lunchPortions[i], dinnerPortions[i] );
    	results = addSlatePage(prevPageDateName, divHeaderStyle, divLabelStyle, divDataStyle, dows[i], viewSlatesName, breakfastPlates[i].name, lunchPlates[i].name, dinnerPlates[i].name, breakfastPortions[i], lunchPortions[i], dinnerPortions[i] );
    	prevPage = results[0];
        prevPageDateName = results[1];
     	//alert("plateSlateCellApp addSlatePages prevPage " + prevPage);
    	//alert("plateSlateCellApp addSlatePages prevPage " + prevPage + " prevPageDateName " + prevPageDateName + " i " + i);
        // e.g. Today March 28, 2012 and thru i=0 i=9 April...
    	// e.g. 131126 - 	plateSlateCellApp addSlatePages prevPage Yesterday prevPageDateName 11/25/2013 i 0

    	if (prevPage == "Today") {
    		//currentDow = prevPage;
    		currentDow = prevPageDateName;
    		//colorOffset = 0;
    		synchronizedColor = 0;
    	} else {
    		//colorOffset++;
    		synchronizedColor += 20;
    	}
    	// tjs 131126
    	//var viewSlatesName = viewSlatesNames[i];
    	//viewSlatesNameDate = new Date(viewSlatesNames[i]);
    	//viewSlatesName = viewSlatesNameDate.toDateString();
    	//alert("setup event for viewSlatesName " + viewSlatesName);
    	// e.g. setup event for viewSlatesName Mon Nov 25 2013
    	// e.g. setup event for viewSlatesName 11/25/2013
    	// tjs 120328
	    //$('#'+viewSlatesDows[i]).bind( 'pageshow', function() {
    	// tjs 131126
	    //$('#'+viewSlatesNames[i]).bind( 'pagebeforecreate', function() {
    	//$( '#'+viewSlatesNames[i] ).on( "pagebeforecreate", function( event ) {
   	 	$( '#'+ viewSlatesName ).on( "pagebeforecreate", function( event ) {

		      // Update the dots at the bottom of the screen to
		      // highlight the new current page		      
	    	//$('#'+viewSlatesNames[i]+'-dots').empty();
	    	$('#'+viewSlatesName +'-dots').empty();
	    	var dotViewSlatesName = viewSlatesName;
	    	//alert("plateSlateCellApp addSlatePages this.id " + this.id);
	    	for ( var j=0; j<viewSlatesNames.length; j++ ) {
	        	viewSlatesNameDate = new Date(viewSlatesNames[j]);
	        	viewSlatesName = viewSlatesNameDate.toDateString();
	        	viewSlatesName = viewSlatesName.replace(/\s/g,'_');
	        	viewSlatesName = viewSlatesName.replace(/,/g,'');
	    		
		        //if ( viewSlatesNames[j] == this.id) {
		        if ( viewSlatesName == this.id) {
			    	//alert("plateSlateCellApp addSlatePages this.id " + this.id + " j " + j + " viewSlatesNames[j] " + viewSlatesNames[j]);
			          //$('#'+viewSlatesNames[i]+'-dots').append( '<span class="highlight">.</span>' );
		          $('#'+dotViewSlatesName+'-dots').append( '<span class="highlight">.</span>' );
		        } else {
			          //$('#'+viewSlatesNames[i]+'-dots').append( '.' );
		          $('#'+dotViewSlatesName+'-dots').append( '.' );
		        }
	    	}

		      // Store the page's associated screen name in currentFriend
		      //currentFriend = localStorage['currentFriend'] = $.mobile.activePage.attr('id');
		} );
	    // tjs 131126
   	 	//alert("setup event for viewSlatesName " + viewSlatesName + " done");
   	 	// e.g. setup event for viewSlatesName Mon Nov 25 2013 done	
	    //);
    }
    
    // tjs 120326 when the final page is reached it has no 'Next' link.  However we will insert a pseudo-next link.
    // this artificial next link actually opens a page that adds a new slate of plates for the next day.
    // the plates are typically randomly assigned and the user would typically alter the default choices.
    var mealName = "Breakfast";
    var pageId = "breakfast-page";

	//alert("plateSlateCellApp addSlatePages prevPage " + prevPage);
	// e.g. Friday
	//alert("plateSlateCellApp addSlatePages prevPageDateName " + prevPageDateName);
    //if ( prevPage ) {
    if ( prevPageDateName ) {
		synchronizedColor += 20;
   	//colorOffset++;
    	color = synchronizedColor;
    	colorOffset = color/20;
    	if (slateMealPlansForDinnerOnly) {
    		mealName = "Dinner";
    		pageId = "dinner-page";
    	}
    	//alert("plateSlateCellApp addSlatePages color " + color + " colorOffset " + colorOffset);
    	var pageMarkup = getSlatePlateView(mealName, colorOffset, true);
    	//alert("plateSlateCellApp addSlatePages pageMarkup " + pageMarkup);
        // Add the page to the DOM
        $('body').append( $(pageMarkup) );
    	//alert("plateSlateCellApp addSlatePages pageMarkup appended...");

          var nextLinkMarkup = '<li class="ui-pagination-next"><a href="#' + pageId + '">Next</a></li>';
          //$('#' + prevPage + ' ul:jqmData(role="pagination")').append( nextLinkMarkup );
          $('#' + prevPageDateName + ' ul:jqmData(role="pagination")').append( nextLinkMarkup );
    }
    
    // Render the pages
    //for ( var i=0; i<dows.length; i++ ) $('#'+dows[i]).page();
    //var len = viewSlatesDows.length;
    var len = viewSlatesNames.length;
    //alert("plateSlateCellApp addSlatePages len " + len);
    //alert("plateSlateCellApp addSlatePages viewSlatesNames len " + len);
    for ( var i=0; i<len; i++ ) {
    	// tjs 131126
    	//$('#'+viewSlatesNames[i]).page();
    	viewSlatesNameDate = new Date(viewSlatesNames[i]);
    	viewSlatesName = viewSlatesNameDate.toDateString();
    	viewSlatesName = viewSlatesName.replace(/\s/g,'_');
    	viewSlatesName = viewSlatesName.replace(/,/g,'');

    	//$('#'+viewSlatesNames[i]).page();
    	$('#'+viewSlatesName).page();
    }
    if ( prevPage ) {
    	$('#'+pageId).page();
    }    
    return currentDow;
}

//function addSlatePage(prevPage, divHeaderStyle, divLabelStyle, divDataStyle, dow, breakfastPlate, lunchPlate, dinnerPlate, breakfastPortions, lunchPortions, dinnerPortions) {
function addSlatePage(prevPage, divHeaderStyle, divLabelStyle, divDataStyle, dow, dateName, breakfastPlate, lunchPlate, dinnerPlate, breakfastPortions, lunchPortions, dinnerPortions) {
	// NB the dow is also the page id
	//var pageId = dow;
	var pageId = dateName;
	var displayDateName = dateName.replace(/_/g,' ');
	var typePortions;
	var typePortion;
	var portion;
	var results = new Array();
	
    // Don't add the page if it's already in the DOM
    if ( document.getElementById( pageId ) ) return;
	//alert("plateSlateCellApp addSlatePage dow " + dow);
	//alert("plateSlateCellApp addSlatePage dow " + dow + " breakfastPlate " + breakfastPlate + " lunchPlate " + lunchPlate + " dinnerPlate " + dinnerPlate);

    // Create the basic markup for the new page
    //var pageMarkup = '<div class="slatePage" data-role="page" data-theme="a" id="' + pageId + '" data-url="' + pageId + '" data-title="Slates">';
    var pageMarkup = '<div class="slatePage" data-role="page" data-add-back-btn="true" data-theme="a" id="' + pageId + '" data-url="' + pageId + '" data-title="Slates">';
    pageMarkup += '<div class="gloss"></div>';
    pageMarkup += '<div class="slatePageContent">';
	//alert("plateSlateCellApp addSlatePage pageMarkup " + pageMarkup);
    pageMarkup += '<div class="felt">';
    pageMarkup += '<div style="' + divHeaderStyle + ';">';
    if (dow == displayDateName)
    	pageMarkup += '<h1>' + displayDateName + '</h1>';
    else
    	pageMarkup += '<h1>' + dow + ', ' + displayDateName + '</h1>';
    pageMarkup += '</div>';
    // tjs 120327
	if (!slateMealPlansForDinnerOnly) {
	    pageMarkup += '<div style="' + divLabelStyle + ';">';
	    pageMarkup += '<h2>Breakfast</h2>';
	    pageMarkup += '<h3>' + breakfastPlate + '</h3>';
	    pageMarkup += '</div>';
	    pageMarkup += '<div style="' + divDataStyle + ';">';
		//alert("plateSlateCellApp addSlatePage pageMarkup " + pageMarkup);
		// add breakfast portions
		typePortions = breakfastPortions;
		typePortion = '&nbsp;';
		for (j = 0; j < typePortions.length; j++) {
			portion = getPortionById(typePortions[j]);
			if (portion.type == "Grain") {
				typePortion += '<span style="color: #dd7d22;">' + portion.name + '</span>&nbsp;';
			} else	if (portion.type == "Protein") {
				typePortion += '<span style="color: #705b9b;">' + portion.name + '</span>&nbsp;';
			} else	if (portion.type == "Vegetables") {
				typePortion += '<span style="color: #00b65b;">' + portion.name + '</span>&nbsp;';
			} else	if (portion.type == "Fruits") {
				typePortion += '<span style="color: #dc332e;">' + portion.name + '</span>&nbsp;';
			} else	if (portion.type == "Dairy") {
				typePortion += '<span style="color: #4c98d0;">' + portion.name + '</span>&nbsp;';
			}
		}
	    pageMarkup += '<p>' + typePortion + '</p>';
	    pageMarkup += '</div>';
		//alert("plateSlateCellApp addSlatePage pageMarkup " + pageMarkup);
	
	    pageMarkup += '<div style="' + divLabelStyle + ';">';
	    pageMarkup += '<h2>Lunch</h2>';
	    pageMarkup += '<h3>' + lunchPlate + '</h3>';
	    pageMarkup += '</div>';
	    pageMarkup += '<div style="' + divDataStyle + ';">';
		// add lunch portions
		typePortions = lunchPortions;
		typePortion = '&nbsp;';
		for (j = 0; j < typePortions.length; j++) {
			portion = getPortionById(typePortions[j]);
			if (portion.type == "Grain") {
				typePortion += '<span style="color: #dd7d22;">' + portion.name + '</span>&nbsp;';
			} else	if (portion.type == "Protein") {
				typePortion += '<span style="color: #705b9b;">' + portion.name + '</span>&nbsp;';
			} else	if (portion.type == "Vegetables") {
				typePortion += '<span style="color: #00b65b;">' + portion.name + '</span>&nbsp;';
			} else	if (portion.type == "Fruits") {
				typePortion += '<span style="color: #dc332e;">' + portion.name + '</span>&nbsp;';
			} else	if (portion.type == "Dairy") {
				typePortion += '<span style="color: #4c98d0;">' + portion.name + '</span>&nbsp;';
			}
		}
		pageMarkup += '<p>' + typePortion + '</p>';
	    pageMarkup += '</div>';
	}
    pageMarkup += '<div style="' + divLabelStyle + ';">';
    pageMarkup += '<h2>Dinner</h2>';
    pageMarkup += '<h3>' + dinnerPlate + '</h3>';
    pageMarkup += '</div>';
    pageMarkup += '<div style="' + divDataStyle + ';">';
	// add lunch portions
	typePortions = dinnerPortions;
	typePortion = '&nbsp;';
	for (j = 0; j < typePortions.length; j++) {
		portion = getPortionById(typePortions[j]);
		if (portion.type == "Grain") {
			typePortion += '<span style="color: #dd7d22;">' + portion.name + '</span>&nbsp;';
		} else	if (portion.type == "Protein") {
			typePortion += '<span style="color: #705b9b;">' + portion.name + '</span>&nbsp;';
		} else	if (portion.type == "Vegetables") {
			typePortion += '<span style="color: #00b65b;">' + portion.name + '</span>&nbsp;';
		} else	if (portion.type == "Fruits") {
			typePortion += '<span style="color: #dc332e;">' + portion.name + '</span>&nbsp;';
		} else	if (portion.type == "Dairy") {
			typePortion += '<span style="color: #4c98d0;">' + portion.name + '</span>&nbsp;';
		}
	}
	pageMarkup += '<p>' + typePortion + '</p>';
    pageMarkup += '</div>';
   
    pageMarkup += '</div>';
    pageMarkup += '<ul data-role="pagination">';
    // tjs 120323
    if ( prevPage ) {
    	//alert("plateSlateCellApp addSlatePage prev link prevPage " + prevPage);
    	pageMarkup += '<li class="ui-pagination-prev"><a href="#' + prevPage + '">Prev</a></li>';    
    } else {
     	pageMarkup += '<li class="ui-pagination-prev"><a href="#home-page">Prev</a></li>';    
    }
    pageMarkup += '</ul>';
    pageMarkup += '</div>';
    // tjs 120328
    //pageMarkup += '<div id="dots"></div>';
    //pageMarkup += '<div id="' + pageId + '-dots"></div>';
    pageMarkup += '<div id="' + pageId + '-dots" class="dots"></div>';
	//alert("plateSlateCellApp addSlatePage pageMarkup " + pageMarkup);

    // Add the page to the DOM
     $('body').append( $(pageMarkup) );
    // If this isn't the first page we've added,
    // add a  "Next" link to the previous page's nav
    if ( prevPage ) {
       var nextLinkMarkup = '<li class="ui-pagination-next"><a href="#' + pageId + '">Next</a></li>';
   	   //alert("plateSlateCellApp addSlatePage nextLinkMarkup " + nextLinkMarkup + " prevPage " + prevPage);
       // e.g. <li class="ui-pagination-next"><a href="#March_29,_2012">Next</a></li> prevPage March_28,_2012

       $('#' + prevPage + ' ul:jqmData(role="pagination")').append( nextLinkMarkup );
   	   //alert("plateSlateCellApp addSlatePage nextLinkMarkup " + nextLinkMarkup + " prevPage " + prevPage);
    }
    // All done - this page now becomes the new "previous page"
    //return pageId;
    results.push(dow);
    results.push(pageId);
    return results;
}

function doReport() {
	if (!authenticated)	{
		//alert("You must login before using this feature!");
		var paragraphs = new Array();
		paragraphs.push(requiresLoginLine1);
		paragraphs.push(requiresLoginLine2);
		hijaxAlertDial(requiresLoginTitle, paragraphs);
		//return;
	} else {
	//alert("plateSlateCellApp doReport authenticated " + authenticated);
	var thresholdOffset = slateOffsetThreshold;
	var xml = getReportXml('Meal Plan Report', thresholdOffset);
	// tjs 130128
	//$.post("../plateslate/storeSlates.php", { xml: xml }, function(msg) {		
	$.post("../storeSlates.php", { xml: xml }, function(msg) {		
		var len = msg.length;
		// need to chop off the %20 chars that were placed onto the msg in lieu of the new line    		
		var crop = len - 4;
		var path = new String(msg);
	//alert("plateslate click path " + path);
		path = path.substring(0, crop);
	//alert("plateslate click chop path " + path);
		//var url = '../plateslate/slates2FPDF.php?xml=' + path;
		var url = '../slates2FPDF.php?xml=' + path;
		var patt1=/slate.......xml/gi;
		windowName = msg.match(patt1);
		//alert("plateslate click url " + url + " windowName " + windowName);
		window.open(url, windowName, 'resizable,scrollbars');
	});
	}
}

// tjs 131112
//function doRealTimeReport() {
function doRealTimeReport(mode) {
	// tjs 131107
	var chalkColors = getScreenReportHues(3);
	var divHeaderStyle = 'color:' + makeColor(chalkColors[0]);
	var divLabelStyle = 'color:' + makeColor(chalkColors[1]);
	var divDataStyle = 'color:' + makeColor(chalkColors[2]);
//alert("doRealTimeReport divHeaderStyle " + divHeaderStyle + " divLabelStyle " + divLabelStyle + " divDataStyle " + divDataStyle);
	if (!authenticated)	{
	//if (1 == 0)	{
		//alert("You must login before using this feature!");
		var paragraphs = new Array();
		paragraphs.push(requiresLoginLine1);
		paragraphs.push(requiresLoginLine2);
		hijaxAlertDial(requiresLoginTitle, paragraphs);
	} else {
	//alert("plateSlateCellApp doRealTimeReport authenticated " + authenticated);
	var thresholdOffset = slateOffsetThreshold;
	var xml = getReportXml('Meal Plan Report', thresholdOffset);
	//alert("plateSlateCellApp doRealTimeReport xml " + xml);
	// tjs 131112
	//var jqxhr = $.post( "../refreshSlateMenu.php", { xml: xml, divHeaderStyle: divHeaderStyle, divLabelStyle: divLabelStyle, divDataStyle: divDataStyle }, function(xhr, status, message) {
	var jqxhr = $.post( "../refreshSlateMenu.php", { xml: xml, mode: mode, divHeaderStyle: divHeaderStyle, divLabelStyle: divLabelStyle, divDataStyle: divDataStyle }, function(xhr, status, message) {
		    //alert( "success msg " + xhr.responseText);
		})
		  .done(function(xhr, status, message) {
		    //alert( "second success" );
		    //alert( "second success msg " + xhr.responseText);
		  })
		  //  jqXHR jqXHR, String textStatus, String errorThrown
		  //.fail(function() {
		  .fail(function(xhr, status, message) {
		    //alert( "error" );
		    //alert( "error status " + status + " message "  + message);
		    // e.g. error status error message Internal Server Error
			    //alert( "error status " + xhr.status + " response text " + xhr.responseText);
// e.g. error status 500 response text refreshSlateMenu...
			    //alert( "msg " + xhr.responseText);
			  // e.g. refreshSlateMenu...
			    //alert( "err " + xhr.thrownError);
			    // e.g. undefined
		  })
		  .always(function() {
		    //alert( "finished" );
		});
	//alert ("error " + jqxhr.error());
	}
}

//tjs 131119
function hyjaxTweakDial() {
    // Remove all old dialog
	$('.ui-dialog').remove();
	//alert("plateSlateCellApp  hyjaxTweakDial...");
    
	var newDialHtml = '<div data-role="dialog" id="tweak-dial"><div data-role="header">';
	newDialHtml += '<h1>Tweak Menu</h1></div>';	
	newDialHtml += '<div data-role="content" data-theme="c"><div class="content-primary"><div id="tweakContents">';	
	//newDialHtml += '<form name="tweakForm"><p>Plate Slate Tweak Menu...</p><p/>';
	//newDialHtml += '<p><label for="name">Username:</label><input type="text" name="name" id="username" value="" placeholder="username" data-theme="d"/></p>';
	//newDialHtml += '<p><label for="password">Password:</label><input type="password" name="pword" id="pword" value="" placeholder="" data-theme="d"/></p>';
	//newDialHtml += '<p><fieldset data-role="fieldcontain"><label for="refresh">Restore client data from server backup</label>';  
	//newDialHtml += '<input type="checkbox" name="refresh" id="refresh" size="30" value="refresh" '; 
	//if (refreshDataFromServerDefault) {
	//	newDialHtml += ' checked="checked" ';
	//} 
	//newDialHtml += ' data-theme="d"/></fieldset></p>';
	//newDialHtml += '</form>';		
	newDialHtml += '<br/><br/><a href="#home-page" data-role="button" data-inline="true" data-theme="a">Cancel</a>';		
	newDialHtml += '<a href="javascript:downloadMenu();" data-role="button" data-inline="true">Download Menu</a>';
	newDialHtml += '<a href="javascript:uploadMenu();" data-role="button" data-inline="true">Upload Menu</a>';
	newDialHtml += '<div id ="resultLog"></div>';
	newDialHtml += '</div></div></div><script></script></div>';
	var newDial = $(newDialHtml);
	//add new dialog to page container
	newDial.appendTo($.mobile.pageContainer);
	
	// tweak the new dialog just added into the dom
   
	// enhance and open the new dialog
    $.mobile.changePage(newDial);
}
function downloadMenu() {
	alert("plateslate downloadMenu xferProvider " + xferProvider);
	// TODO ...
}
function uploadMenu() {
	// TODO ...
}
/*
function tweakRealTimeReport() {
	// TODO ...
}*/

function observeRealTimeReport() {
	// tjs 131113 if logged in force a logout!
	doLogout(true);
}

function getReportXml(name, offset) {
	//alert("plateslate getReportXml name " + name + " offset " + offset);
	//use cache to create xml to be sent to server for the report.
	var cursor = offset;
	//var backwardsCursor = offset - 1;
	var slate;
	var count = 0;
	var maxCount = 7;
	var xml = '<slates accountId="' + loginInfo.id + '" userName="' + loginInfo.userName + '" firstName="' + loginInfo.firstName + '" lastName="' + loginInfo.lastName + '" share="' + plateSelectionShared + '">';
	while (count < maxCount) {
		//alert("plateslate getReportXml count " + count + " cursor " + cursor + " slate name " + slates[cursor].name);
		//alert("plateslate getReportXml forwards count " + count + " cursor " + cursor);
	    if (typeof(slates[cursor]) === 'undefined') {
	    	break;
	    } else {
	    	slate = slates[cursor++];
	    	count++;
	    	xml += getXml(slate);
			//alert("plateslate createReport next cursor " + cursor + " count " + count + " today onwards xml " + xml);
		}		
	}
	cursor = offset - 1;
	while (count < maxCount) {
		//alert("plateslate createReport count " + count + " cursor " + cursor + " slate name " + slates[cursor].name);
		//alert("plateslate createReport backwards count " + count + " cursor " + cursor);
	    if (typeof(slates[cursor]) === 'undefined') {
	    	break;
	    } else {
	    	slate = slates[cursor--];
	    	count++;
	    	xml += getXml(slate);
			//alert("plateslate createReport next cursor " + cursor + " count " + count + " today backwards xml " + xml);
		}		
	}
	
	xml += '</slates>';
	return xml;
}

function getXml(slate) {
	//alert("plateslate getXml slate name " + slate.name + " id " + slate.id + " breakfast id " + slate.breakfastId);
	// tjs 131114
	//var xml = '<slate name="' + slate.name + '" dow="' + slate.description + '" id="' + slate.id + '"><plates>';
	var description = slate.description;
	if ((description == null || description.length < 6) && slate.name != null) {
		var date = new Date(slate.name);
		var weekday=new Array(7);
		weekday[0]="Sunday";
		weekday[1]="Monday";
		weekday[2]="Tuesday";
		weekday[3]="Wednesday";
		weekday[4]="Thursday";
		weekday[5]="Friday";
		weekday[6]="Saturday";
		description = weekday[date.getDay()];
	}
	var xml = '<slate name="' + slate.name + '" dow="' + description + '" id="' + slate.id + '"><plates>';
	var plateId = slate.breakfastId;
	var plate = getPlateById(plateId);
	var portionId;
	var portion;
	var portionsLen;
	portionsLen = slate.breakfastPortions.length;
	//alert("plateslate getXml plate name " + plate.name + " id " + plate.id + " portionsLen " + portionsLen);
	xml += '<plate name="' + plate.name + '" type="Breakfast" description="' + plate.description + '"><portions>';
	//alert("index getXml portionsLen " + portionsLen);
	for (var i = 0; i < portionsLen; i++) {
		portionId = slate.breakfastPortions[i];
		//alert("plateslate getXml portion id " + portionId + " name " + portions[portionId].name + " type " + portions[portionId].type);
		portion = getPortionById(portionId);
		xml += '<portion type="' + portion.type + '">' + portion.name + '</portion>';
	}
	plateId = slate.lunchId;
	plate = getPlateById(plateId);
	xml += '</portions></plate><plate name="' + plate.name + '" type="Lunch" description="' + plate.description + '"><portions>';
	portionsLen = slate.lunchPortions.length;
	for (var i = 0; i < portionsLen; i++) {
		portionId = slate.lunchPortions[i];
		portion = getPortionById(portionId);
		xml += '<portion type="' + portion.type + '">' + portion.name + '</portion>';
	}
	plateId = slate.dinnerId;
	plate = getPlateById(plateId);
	xml += '</portions></plate><plate name="' + plate.name + '" type="Dinner" description="' + plate.description + '"><portions>';
	portionsLen = slate.dinnerPortions.length;
	for (var i = 0; i < portionsLen; i++) {
		portionId = slate.dinnerPortions[i];
		portion = getPortionById(portionId);
		xml += '<portion type="' + portion.type + '">' + portion.name + '</portion>';
	}
	xml += '</portions></plate></plates></slate>';
	//alert("plateslate getXml slate name " + slate.name + " xml " + xml);
	return xml;
}

function getReportGridArrays(thresholdOffset, plateCount, plateHistory) {
	//alert("plateslate getReportGridArrays name " + name + " offset " + offset);
	//use cache for the report.
	var cursor = thresholdOffset;
	var slate;
	var count = 0;
	//var maxCount = 5;
	var maxCount = plateCount;
	var dow;
	var dows = new Array();
	var breakfastPlates = new Array();
	var lunchPlates = new Array();
	var dinnerPlates = new Array();
	// tjs 120117
	var breakfastPortions = new Array();
	var lunchPortions = new Array();
	// tjs 120116
	var dinnerPortions = new Array();
	// tjs 120328
	var dateName;
	var dateNames = new Array();
    //var reg = new RegExp("[ ]+","g");

	var plateId;
	var plate;
	while (count < maxCount) {
		//alert("plateslate getReportGridArrays count " + count + " cursor " + cursor + " slate name " + slates[cursor].name);
		//alert("plateslate getReportGridArrays forwards count " + count + " cursor " + cursor);
	    if (typeof(slates[cursor]) === 'undefined') {
	    	break;
	    } else {
			// tjs 140101
			console.log("plateslate getReportGridArrays count " + count + " cursor " + cursor + " slate name " + slates[cursor].name);
	    	slate = slates[cursor++];
			//alert("plateslate getReportGridArrays slate name " + slate.name + " description " + slate.description);
	    	dow = getRelativeSlateDescription(slate);
	    	if (dow != null) {
	    		dows.push(dow);
	    	} else {
		    	dows.push(slate.description);
	    	}
	    	// tjs 120328
	    	dateName = slate.name;
	    	dateName = dateName.replace(/\s/g,'_');
	    	dateName = dateName.replace(/,/g,'');
	    	//alert("getReportGridArrays dateName (before) " + dateName);
	    	// e.g. getReportGridArrays dateName (before) 11/26/2013
	    	dateNames.push(dateName);
	    	plateId = slate.breakfastId;
	    	plate = getPlateById(plateId);
	    	//breakfastPlates.push(plate.name);
	    	breakfastPlates.push(plate);
	    	plateId = slate.lunchId;
	    	plate = getPlateById(plateId);
	    	lunchPlates.push(plate);
	    	plateId = slate.dinnerId;
	    	plate = getPlateById(plateId);
	    	dinnerPlates.push(plate);
	    	breakfastPortions.push(copyPortions(slate.breakfastPortions));
	    	lunchPortions.push(copyPortions(slate.lunchPortions));
	    	dinnerPortions.push(copyPortions(slate.dinnerPortions));
	    	count++;
			//alert("plateslate createReport next cursor " + cursor + " count " + count + " today onwards xml " + xml);
		}		
	}
	cursor = thresholdOffset - 1;
	//alert("plateSlateCellApp getReportGridArrays count " + count + " thresholdOffset " + thresholdOffset);
	if (count < maxCount) {
		if (!plateHistory)
			// grab one more day from past
			maxCount = count + 1;
		while (count < maxCount) {
			//alert("plateslate createReport count " + count + " cursor " + cursor + " slate name " + slates[cursor].name);
			//alert("plateslate createReport backwards count " + count + " cursor " + cursor);
		    if (typeof(slates[cursor]) === 'undefined') {
		    	break;
		    } else {
		    	slate = slates[cursor--];
		    	count++;
		    	// TODO label one or the other
		    	dow = getRelativeSlateDescription(slate);
		    	if (dow != null) {
			    	dows.unshift(dow);
		    	} else {
			    	dows.unshift("Prior Day");
		    	}
		    	// tjs 120328
		    	dateName = slate.name;
		    	dateName = dateName.replace(/\s/g,'_');
		    	dateName = dateName.replace(/,/g,'');
		    	// tjs 131126
		    	//alert("getReportGridArrays dateName (more) " + dateName);
		    	// e.g. getReportGridArrays dateName (more) 11/25/2013
		    	//dateNames.push(dateName);
		    	dateNames.unshift(dateName);
		    	plateId = slate.breakfastId;
		    	plate = getPlateById(plateId);
		    	breakfastPlates.unshift(plate);
		    	plateId = slate.lunchId;
		    	plate = getPlateById(plateId);
		    	lunchPlates.unshift(plate);
		    	plateId = slate.dinnerId;
		    	plate = getPlateById(plateId);
		    	dinnerPlates.unshift(plate);
		    	breakfastPortions.unshift(copyPortions(slate.breakfastPortions));
		    	lunchPortions.unshift(copyPortions(slate.lunchPortions));
		    	dinnerPortions.unshift(copyPortions(slate.dinnerPortions));
				//alert("plateslate createReport next cursor " + cursor + " count " + count + " today backwards xml " + xml);
			}		
		}
	}

	var results = new Array();
	results.push(dows);
	results.push(breakfastPlates);
	results.push(lunchPlates);
	results.push(dinnerPlates);
	// tjs 120117
	results.push(breakfastPortions);
	results.push(lunchPortions);
	results.push(dinnerPortions);
	// tjs 120328
	results.push(dateNames);
	//alert("plateSlateCellApp getReportGridArrays results.length " + results.length);
	return results;
}

// tjs 120221
//'aahfInfo','africanAmerican','american','brazilian','cajun','caribbean','chinese','elderly','french','german','greek',
//'indian','irish','italian','japanese','jewish','mexican','middleEast','multinational','nativeAmerican','polish',
//'portuguese','russian','southern','thai','texmex','vegetarian','other'
function deriveProfileSelectionList() {
	//var profileSelectListHtml = '<select name="profileSelection" class="Profile"><optgroup label="Profile">';
	// tjs 140108
	//var profileSelectListHtml = '<select name="profileSelection" class="Profile">';
	var profileSelectListHtml = '<select id="profileSelection" name="profileSelection" class="Profile">';
	profileSelectListHtml += '<option value ="aahfInfo">AAH Food!</option>';
	profileSelectListHtml += '<option value ="africanAmerican">African American</option>';
	profileSelectListHtml += '<option value ="american">American</option>';
	profileSelectListHtml += '<option value ="brazilian">Brazilian</option>';
	profileSelectListHtml += '<option value ="cajun">Cajun</option>';
	profileSelectListHtml += '<option value ="caribbean">Caribbean</option>';
	profileSelectListHtml += '<option value ="chinese">Chinese</option>';
	profileSelectListHtml += '<option value ="elderly">Elderly</option>';
	profileSelectListHtml += '<option value ="french">French</option>';
	profileSelectListHtml += '<option value ="german">German</option>';
	profileSelectListHtml += '<option value ="greek">Greek</option>';
	profileSelectListHtml += '<option value ="indian">Indian</option>';
	profileSelectListHtml += '<option value ="irish">Irish</option>';
	profileSelectListHtml += '<option value ="italian">Italian</option>';
	profileSelectListHtml += '<option value ="japanese">Japanese</option>';
	profileSelectListHtml += '<option value ="jewish">Jewish</option>';
	profileSelectListHtml += '<option value ="mexican">Mexican</option>';
	profileSelectListHtml += '<option value ="middleEast">Middle East</option>';
	profileSelectListHtml += '<option value ="multinational">Multinational</option>';
	profileSelectListHtml += '<option value ="nativeAmerican">Native American</option>';
	profileSelectListHtml += '<option value ="polish">Polish</option>';
	profileSelectListHtml += '<option value ="portuguese">Portuguese</option>';
	profileSelectListHtml += '<option value ="russian">Russian</option>';
	profileSelectListHtml += '<option value ="southern">Southern</option>';
	profileSelectListHtml += '<option value ="thai">Thai</option>';
	profileSelectListHtml += '<option value ="texmex">Texmex</option>';
	profileSelectListHtml += '<option value ="vegetarian">Vegetarian</option>';
	profileSelectListHtml += '<option value ="other">Other</option>';
	// tjs 131212
	profileSelectListHtml += '<option value ="restore">RESTORE</option>';
	// tjs 120402
	profileSelectListHtml += '<option value ="reset">RESET</option>';
	// tjs 131212
	profileSelectListHtml += '<option value ="init">INIT</option>';
	//profileSelectListHtml += '</optgroup></select>';
	profileSelectListHtml += '</select>';
	//alert("plateSlateCellApp deriveProfileSelectionList profileSelectListHtml " + profileSelectListHtml);
	return profileSelectListHtml;
}

function hijaxImportPage() {
	var profileSelections = deriveProfileSelectionList();
	var newPageHtml = '<div data-role="page" data-add-back-btn="true" id="import-page" data-title="Import">';
	//newPageHtml += '<div data-role="header"><h1>Meal Plan Report</h1></div>';
	newPageHtml += '<div data-role="header" data-theme="f" data-position="fixed">';
	//newPageHtml += '<a href="index.html" data-icon="home" data-iconpos="notext" data-direction="reverse" class="ui-btn-left jqm-home">Home</a>';
// tjs 140120
	//newPageHtml += '<a href="#home-page" data-icon="home" data-iconpos="notext" data-direction="reverse" class="ui-btn-left jqm-home">Home</a>';
	newPageHtml += '<a href="./index.html#home-page" rel="external" data-icon="home" data-iconpos="notext" data-direction="reverse" class="ui-btn-left jqm-home">Home</a>';
	newPageHtml += '<h1>Imports</h1>';
	newPageHtml += '</div>';
	newPageHtml += '<div data-role="content"><form name="importForm">';
	newPageHtml += '<p style="color: red;">NOTICE: importing a profile shared by another member will clear your slate!</p>';
	newPageHtml += '<p><label for="profile">Profile:</label>' + profileSelections + '</p>';
	newPageHtml += '<p>The profile that you select replaces your plates and the portions that the plates consist of!</p>';
	newPageHtml += '<p>When the import is completed, your slate will be clean but you can immediately use the Slates choice';
	newPageHtml += ' and create plans for meals based upon the newly imported profile!</p>';
	newPageHtml += '<p>If the newly imported profile suits your needs use it as long as you care to.';
	newPageHtml += ' Feel free to alter the plate selections or otherwise tweak the imported profile.</p>';
	newPageHtml += '<p>Note: use <a href:="http://www.plateslate.com">PlateSlate</a> to learn more about profiles or to reach the profile creator';
	newPageHtml += ' (some profile donors are willing to share receipes or have published them.)</p>';
	newPageHtml += '</form>';
	newPageHtml += '<a href="javascript:processImportProfileForm();" data-role="button" data-inline="true">Import Profile</a>';
	newPageHtml += '</div><script type="text/javascript"></script></div>';	
	var newPage = $(newPageHtml);
	//add new dialog to page container
	newPage.appendTo($.mobile.pageContainer);
	// enhance and open the new page
    $.mobile.changePage(newPage);
}

function processImportProfileForm() {
	if (!authenticated)	{
		var paragraphs = new Array();
		paragraphs.push(requiresLoginLine1);
		paragraphs.push(requiresLoginLine2);
		hijaxAlertDial(requiresLoginTitle, paragraphs);		
		return;
	}
	// tjs 140108
	//var profileSelection;
	//profileSelection = document.importForm.profileSelection;
	//var profileSelection = $("form[name='profileSelection']");
	//var profileSelection = $("form[name='importForm']");
	//var profileSelection = $("#profileSelection");
	//var profileImportForm = $("form[name='importForm']");
	//var optionValue = profileSelection.options[profileSelection.selectedIndex].value;
	//var optionValue = $("form[name='importForm'] select option").attr("selected");
	var optionValue = $( "#profileSelection" ).val();
	console.log("processImportProfileForm optionValue " + optionValue);
	// tjs 120402
	if (optionValue == "restore") {
		// tjs 131205
		//initClientData();
		//setTimeout(function() {
			//readPortions();
			//init = true;
			//initIndexDBmodel();
			//},500);
		// tjs 140117
		slates.length = 0;
		
		// tjs 131212
		downloadPortionsPlates(loginAccountNumber);
		//doRestoreFromBackup(0, optionValue);
		// tjs 131212
	} else if (optionValue == "reset") {
		downloadPortionsPlates(0);
	} else if (optionValue == "init") {
		setTimeout(function() {
			//readPortions();
			init = true;
			initIndexDBmodel();
			},500);
	} else {
		doRestoreFromBackup(loginAccountNumber, optionValue);
	}
}

// tjs 120216
function loadPreferences() {
	//alert("plateslate start loadPreferences preferences.plateSelectionRandom " + preferences.plateSelectionRandom + " preferences.plateSelectionSeasonal " + preferences.plateSelectionSeasonal + " preferences.plateSelectionShared " + preferences.plateSelectionShared);
	var tempPreferences = JSON.parse(localStorage.getItem('preferences'));
	//if (typeof(tempPreferences !== 'undefined')  && tempPreferences != null) {
	// tjs 120119
	if (typeof(tempPreferences) !== 'undefined'  && tempPreferences != null) {
		//alert("plateslate loadPreferences tempPreferences.plateSelectionRandom " + tempPreferences.plateSelectionRandom + " tempPreferences.plateSelectionSeasonal " + tempPreferences.plateSelectionSeasonal + " tempPreferences.plateSelectionShared " + tempPreferences.plateSelectionShared);
		preferences.plateSelectionRandom = tempPreferences.plateSelectionRandom;
		preferences.plateSelectionSeasonal = tempPreferences.plateSelectionSeasonal;
		preferences.plateSelectionShared = tempPreferences.plateSelectionShared;
		preferences.slateMealPlansForDinnerOnly = tempPreferences.slateMealPlansForDinnerOnly;
			preferences.refreshDataFromServerDefault = tempPreferences.refreshDataFromServerDefault;
			preferences.backupDataToServer = tempPreferences.backupDataToServer;
		plateSelectionRandom = preferences.plateSelectionRandom;
		plateSelectionSeasonal = preferences.plateSelectionSeasonal;
		plateSelectionShared = preferences.plateSelectionShared;
		slateMealPlansForDinnerOnly = preferences.slateMealPlansForDinnerOnly;
		refreshDataFromServerDefault = preferences.refreshDataFromServerDefault;
		backupDataToServer = preferences.backupDataToServer;
	}
	//alert("plateslate end loadPreferences preferences.plateSelectionRandom " + preferences.plateSelectionRandom + " preferences.plateSelectionSeasonal " + preferences.plateSelectionSeasonal + " preferences.plateSelectionShared " + preferences.plateSelectionShared + " preferences.slateMealPlansForDinnerOnly " + preferences.slateMealPlansForDinnerOnly + " preferences.refreshDataFromServerDefault " + preferences.refreshDataFromServerDefault + " preferences.backupDataToServer " + preferences.backupDataToServer);
}

// tjs 140120
function loadLoginInfo() {
	//alert("plateslate start loadLoginInfo preferences.plateSelectionRandom " + preferences.plateSelectionRandom + " preferences.plateSelectionSeasonal " + preferences.plateSelectionSeasonal + " preferences.plateSelectionShared " + preferences.plateSelectionShared);
	var tempLoginInfo = JSON.parse(localStorage.getItem('logininfo'));
	if (typeof(tempLoginInfo) !== 'undefined'  && tempLoginInfo != null) {
		//alert("plateslate loadLoginInfo tempPreferences.plateSelectionRandom " + tempPreferences.plateSelectionRandom + " tempPreferences.plateSelectionSeasonal " + tempPreferences.plateSelectionSeasonal + " tempPreferences.plateSelectionShared " + tempPreferences.plateSelectionShared);
		loginInfo.id = tempLoginInfo.id;
		loginInfo.userName = tempLoginInfo.userName;
		loginInfo.firstName = tempLoginInfo.firstName;
		loginInfo.lastName = tempLoginInfo.lastName;
	} else {
		console.info("plateslate loadLoginInfo initing info...");
		unloadLoginInfo();
	}
	console.info("plateslate loadLoginInfo loginInfo.id " + loginInfo.id + " loginInfo.userName " + loginInfo.userName + " loginInfo.firstName " + loginInfo.firstName + " loginInfo.lastName " + loginInfo.lastName);
}

function unloadLoginInfo() {
	//alert("plateslate start loadLoginInfo preferences.plateSelectionRandom " + preferences.plateSelectionRandom + " preferences.plateSelectionSeasonal " + preferences.plateSelectionSeasonal + " preferences.plateSelectionShared " + preferences.plateSelectionShared);
	loginInfo.id = 0;
	loginInfo.userName = 'unknown';
	loginInfo.firstName = 'first';
	loginInfo.lastName = 'last';
	// tjs 140120
	localStorage.setItem('logininfo', JSON.stringify(loginInfo));	// persists above cached data
	//alert("plateslate showPlaceSetting placeSettingPrefButton click preferences persisted" );
	//loadPreferences();
	setTimeout(function() {
		//alert('hello');
		loadLoginInfo();
		},1000);							
	//console.info("plateslate unloadLoginInfo loginInfo.id " + loginInfo.id + " loginInfo.userName " + loginInfo.userName + " loginInfo.userName " + loginInfo.userName + " loginInfo.lastName " + loginInfo.lastName);
}

function openSlatePlansPage() {
    // tjs 131122
    //alert ("openSlatePlansPage slateMealPlansForDinnerOnly " + slateMealPlansForDinnerOnly);
    // e.g. false

	if (slateMealPlansForDinnerOnly) {
		hijaxDinnerPage();
	} else {
		hijaxBreakfastPage();
	}
}

function hijaxBreakfastPage(direction) {
	var transition = 'slide';
	var reverse = false;
	if (direction != null) {
		if (direction == 'reverse')
			reverse = true;
		else 
			transition = direction;
	}
	// tjs 120326
	// derive dynamic html content
    var offset = color/20;
    //TODO fix
    var mealName = "Breakfast";
    // tjs 131122
    console.log("hijaxBreakfastPage breakfast ready color " + color + " offset " + offset);
    //alert("hijaxBreakfastPage breakfast ready color " + color + " offset " + offset);
    // e.g. hijaxBreakfastPage breakfast ready color 0 offset 0
    
    var newPageHtml = getSlatePlateView(mealName, offset, false);
    // tjs 131122
    //alert ("hijaxBreakfastPage newPageHtml " + newPageHtml);
	var newPage = $(newPageHtml);
	//add new page to page container
	newPage.appendTo($.mobile.pageContainer);
	
	// tweak the new page just added into the dom
// enhance and open the new page
     $.mobile.changePage(newPage, {transition: transition, reverse: reverse });			
}

function hijaxLunchPage(direction) {
	var transition = 'slide';
	var reverse = false;
	if (direction != null) {
		if (direction == 'reverse')
			reverse = true;
		else 
			transition = direction;
	}
	// tjs 120326
	// derive dynamic html content
    var offset = color/20;
    //TODO fix
    var mealName = "Lunch";
    //alert("breakfast ready color " + color + " offset " + offset);
    var newPageHtml = getSlatePlateView(mealName, offset, false);
	var newPage = $(newPageHtml);
	//add new page to page container
	newPage.appendTo($.mobile.pageContainer);
	/*
	// tweak the new page just added into the dom
    */
// enhance and open the new page
     $.mobile.changePage(newPage, {transition: transition, reverse: reverse });			
}

function hijaxDinnerPage(direction) {
	var transition = 'slide';
	var reverse = false;
	if (direction != null) {
		if (direction == 'reverse')
			reverse = true;
		else 
			transition = direction;
	}
	// tjs 120326
	// derive dynamic html content
    var offset = color/20;
    //TODO fix
    var mealName = "Dinner";
    //alert("breakfast ready color " + color + " offset " + offset);
    var newPageHtml = getSlatePlateView(mealName, offset, false);
	var newPage = $(newPageHtml);
	//add new page to page container
	newPage.appendTo($.mobile.pageContainer);
	
	// tweak the new page just added into the dom
    
// enhance and open the new page
    $.mobile.changePage(newPage, {transition: transition, reverse: reverse });
}

// tjs 120326
function getSlatePlateView(mealName, offset, torf) {
    //var offset = color/20;
    //alert("plateSlateCellApp getSlatePlateView mealName " + mealName + " color " + color + " offset " + offset + " torf " + torf);
    // e.g. plateSlateCellApp getSlatePlateView mealName Breakfast color 0 offset 0 torf false
    var pageId = "dinner-page";
    if (mealName == "Breakfast") {
    	pageId = "breakfast-page";
    } else if (mealName == "Lunch") {
    	pageId = "lunch-page";
    }
    //alert("breakfast ready color " + color + " offset " + offset);
    var mealHtml = getSlateView(offset, mealName);
    // tjs 131122
    //alert("getSlatePlateView mealHtml " + mealHtml);
    // create page markup
	//var newPageHtml = '<div data-role="page" id="' + pageId + '" data-title="' + mealName + '" class="type-interior" data-theme="b" data-dom-cache="true">';
	var newPageHtml = '<div data-role="page" id="' + pageId + '" data-title="' + mealName + '" class="type-interior';
	if (torf) {
		newPageHtml += ' slatePage';
	}
	newPageHtml += '" data-theme="b" data-dom-cache="true">';
	newPageHtml += '<div data-role="header" data-theme="f" data-position="fixed">';
	newPageHtml += '<h1>' + mealName + '</h1>';
	//newPageHtml += '<a href="index.html" data-icon="home" data-iconpos="notext" data-direction="reverse" class="ui-btn-left jqm-home">Home</a>';
	// tjs 140120 cf <p><a href="#one" data-direction="reverse" class="ui-btn ui-shadow ui-corner-all ui-btn-b">Back to page "one"</a></p>
	//newPageHtml += '<a href="#home-page" data-icon="home" data-iconpos="notext" data-direction="reverse" class="ui-btn-left jqm-home">Home</a>';
	//newPageHtml += '<a href="index.html#home-page" data-icon="home" data-iconpos="notext" data-direction="reverse" class="ui-btn-left jqm-home">Home</a>';
	//newPageHtml += '<a href="./index.html#home-page" data-icon="home" data-iconpos="notext" data-direction="reverse" class="ui-btn-left jqm-home">Home</a>';
	newPageHtml += '<a href="./index.html#home-page" rel="external" data-icon="home" data-iconpos="notext" data-direction="reverse" class="ui-btn-left jqm-home">Home</a>';
// tjs 140120
	//newPageHtml += '</div><div data-role="content"><div class="content-primary">';
	newPageHtml += '</div><div role="main" class="ui-content">';
	newPageHtml += mealHtml;
	//newPageHtml += '</div></div>';
	newPageHtml += '</div>';
	newPageHtml += '<div data-role="footer" data-id="foo1" data-position="fixed"><div data-role="navbar"><ul>';
    if (mealName == "Breakfast") {
    	newPageHtml += '<li><a href="javascript:previousBreakfast();">Prev</a></li>';
    	newPageHtml += '<li><a href="javascript:hijaxBreakfastPage();" class="ui-btn-active ui-state-persist">Breakfast</a></li>';
    	newPageHtml += '<li><a href="javascript:hijaxLunchPage(' + "'slideup'" + ');">Lunch</a></li>';
    	newPageHtml += '<li><a href="javascript:hijaxDinnerPage(' + "'slideup'" + ');">Dinner</a></li>';
    	newPageHtml += '<li><a href="javascript:nextBreakfast();">Next</a></li>';
    } else if (mealName == "Lunch") {
    	newPageHtml += '<li><a href="javascript:previousLunch();">Prev</a></li>';
    	newPageHtml += '<li><a href="javascript:hijaxBreakfastPage(' + "'slidedown'" + ');">Breakfast</a></li>';
    	newPageHtml += '<li><a href="javascript:hijaxLunchPage();" class="ui-btn-active ui-state-persist">Lunch</a></li>';
    	newPageHtml += '<li><a href="javascript:hijaxDinnerPage(' + "'slideup'" + ');">Dinner</a></li>';
    	newPageHtml += '<li><a href="javascript:nextLunch();">Next</a></li>';
    } else {
    	newPageHtml += '<li><a href="javascript:previousDinner();">Prev</a></li>';
    	newPageHtml += '<li><a href="javascript:hijaxBreakfastPage(' + "'slidedown'" + ');">Breakfast</a></li>';
    	newPageHtml += '<li><a href="javascript:hijaxLunchPage(' + "'slidedown'" + ');">Lunch</a></li>';
    	newPageHtml += '<li><a href="javascript:hijaxDinnerPage();" class="ui-btn-active ui-state-persist">Dinner</a></li>';
    	newPageHtml += '<li><a href="javascript:nextDinner();">Next</a></li>';
    }
	newPageHtml += '</ul></div><!-- /navbar --></div><!-- /footer --></div>';
	return newPageHtml;
}

function previousBreakfast() {
	color -= 20;
	hijaxBreakfastPage('reverse');
}

function nextBreakfast() {
	color += 20;
	hijaxBreakfastPage();	
}

function previousLunch() {
	color -= 20;
	hijaxLunchPage('reverse');
}

function nextLunch() {
	color += 20;
	hijaxLunchPage();	
}

function previousDinner() {
	color -= 20;
	hijaxDinnerPage('reverse');
}

function nextDinner() {
	color += 20;
	hijaxDinnerPage();	
}

function processAddNewPortionForm(portionType) {
	//alert("plateslate processAddNewPortionForm portionType " + portionType);
	var offset;
	var mealName;
	// tjs 120223
	var isSlate;
	var portionSelection;
	if (portionType == "grain") {
		offset = Number(document.newGrainPortionForm.slateOffset.value);
		mealName = document.newGrainPortionForm.mealName.value;
		// tjs 120223
		isSlate = document.newGrainPortionForm.isSlate.value;
		portionSelection = document.newGrainPortionForm.portionSelection;
	} else if (portionType == "protein") {
		offset = Number(document.newProteinPortionForm.slateOffset.value);
		mealName = document.newProteinPortionForm.mealName.value;
		isSlate = document.newProteinPortionForm.isSlate.value;
		portionSelection = document.newProteinPortionForm.portionSelection;
	} else if (portionType == "vegetables") {
		offset = Number(document.newVegetablesPortionForm.slateOffset.value);
		mealName = document.newVegetablesPortionForm.mealName.value;
		isSlate = document.newVegetablesPortionForm.isSlate.value;
		portionSelection = document.newVegetablesPortionForm.portionSelection;
	} else if (portionType == "fruits") {
		offset = Number(document.newFruitsPortionForm.slateOffset.value);
		mealName = document.newFruitsPortionForm.mealName.value;
		isSlate = document.newFruitsPortionForm.isSlate.value;
		portionSelection = document.newFruitsPortionForm.portionSelection;
	} else if (portionType == "dairy") {
		offset = Number(document.newDairyPortionForm.slateOffset.value);
		mealName = document.newDairyPortionForm.mealName.value;
		isSlate = document.newDairyPortionForm.isSlate.value;
		portionSelection = document.newDairyPortionForm.portionSelection;
	}
		
	var optionValue = portionSelection.options[portionSelection.selectedIndex].value;
	//alert("plateslate processAddNewPortionForm offset " + offset + " mealName " + mealName + " optionValue " + optionValue);
	//console.log("plateslate processAddNewPortionForm offset " + offset + " mealName " + mealName + " optionValue " + optionValue);

	// tjs 120223
	//if (offset < 1000) { // i.e. if working with slate edits of portions
	if (isSlate > 0) { // i.e. if working with slate edits of portions
		var thresholdOffset = offset + slateOffsetThreshold;
		//alert("plateslate processAddNewPortionForm thresholdOffset " + thresholdOffset);
		// e.g. offset 0 means 100
		
		var slate = slates[thresholdOffset];
		var slateId = slate.id;	
		//updateFood(slateId, mealName, optionValue, 0, 0);
		modifySlateFoodPortions(slate, mealName, optionValue, 0, 0);
	} else { // i.e. working with plate edits of portions
		//alert("plateslate processAddNewPortionForm offset " + offset + " mealName " + mealName + " optionValue " + optionValue);
		//var index = offset - 1000;
		var index = offset;
		// tjs 131219 TBD if delta needed TODO
		var dish = plates[index];
		var existingPortions = new Array();
		if (dish.portion1 != null && dish.portion1 > 0)
			existingPortions.push(dish.portion1);
		if (dish.portion2 != null && dish.portion2 > 0)
			existingPortions.push(dish.portion2);
		if (dish.portion3 != null && dish.portion3 > 0)
			existingPortions.push(dish.portion3);
		if (dish.portion4 != null && dish.portion4 > 0)
			existingPortions.push(dish.portion4);
		if (dish.portion5 != null && dish.portion5 > 0)
			existingPortions.push(dish.portion5);
		if (dish.portion6 != null && dish.portion6 > 0)
			existingPortions.push(dish.portion6);
		if (dish.portion7 != null && dish.portion7 > 0)
			existingPortions.push(dish.portion7);
		if (dish.portion8 != null && dish.portion8 > 0)
			existingPortions.push(dish.portion8);
		if (dish.portion9 != null && dish.portion9 > 0)
			existingPortions.push(dish.portion9);
		var okToAdd = true;
		var count = 0;
		//alert("plateslate processAddNewPortionForm existingPortions.length " + existingPortions.length);
		for (var i = 0; i < existingPortions.length; i++) {
			if (existingPortions[i] == optionValue) {
				okToAdd = false;
				break;
			}
			count++;
		}
		//alert("plateslate processAddNewPortionForm okToAdd " + okToAdd + " count " + count);
	//alert("plateslate processAddNewPortionForm okToAdd " + okToAdd + " count " + count + " dish name " + dish.name + " index " + index + " optionValue " + optionValue);
		// plateslate processAddNewPortionForm okToAdd true count 0 dish name Stuffed Peppers index 36 optionValue 11015
		if (okToAdd && count < 9) {
			count++;
			switch (count) {
			case 1:
				dish.portion1 = optionValue;
				break;
			case 2:
				dish.portion2 = optionValue;
				break;
			case 3:
				dish.portion3 = optionValue;
				break;
			case 4:
				dish.portion4 = optionValue;
				break;
			case 5:
				dish.portion5 = optionValue;
				break;
			case 6:
				dish.portion6 = optionValue;
				break;
			case 7:
				dish.portion7 = optionValue;
				break;
			case 8:
				dish.portion8 = optionValue;
				break;
			case 9:
				dish.portion9 = optionValue;
				break;
			}
			addToPlate(dish);
		}
	}
	
	var chalkColor = 0;
	var portionName;
	var newPortionHtml;
	var partialNewPortionHtml;
	//if (offset < 1000) {
	if (isSlate > 0) {
		chalkColor = makeColor(color);
		portionName = getPortionById(optionValue).name;
		partialNewPortionHtml = '<a href="javascript:dropPortion(0 , ' + "'" + mealName + "'" + ', ' + optionValue + ');" data-role="button" data-icon="delete" data-iconpos="right" data-theme="a"><span class="chalk" style="color:' + chalkColor + '">' + portionName + '</span></a>';
		aHref = 'href="javascript:dropPortion(0 , ' + "'" + mealName + "'" + ', ' + optionValue + ');"';
		spanStyle = 'color:' + chalkColor;
	}

	if (portionType == "grain") {
		//$('#grain-portion-dial').dialog('close');
		// tjs 120403
		//$('.ui-dialog').dialog('close');
		// tjs 120403
	    $.mobile.changePage( $('#home-page'), { transition: 'fade'} );
		//if (offset < 1000){
		if (isSlate > 0){
			var dividerId = '#grain' + mealName;
			if  (mealName == "Breakfast") {
				newPortionHtml = '<li  class="grainPortion">' + partialNewPortionHtml;
				//alert("plateSlateCellApp processAddNewPortionForm mealName " + mealName + " newPortionHtml " + newPortionHtml + " dividerId " + dividerId);
				//alert("plateSlateCellApp processAddNewPortionForm mealName " + mealName + " newPortionHtml added using dividerId " + dividerId);
				//	alert("plateSlateCellApp processAddNewPortionForm mealName " + mealName + " newPortionHtml added using dividerId " + dividerId);
				// per model
				$(dividerId).after($('<li/>', {    //here after id'd 'li' and new `<li>`
				    'class': "grainPortion"
				}).append($('<a/>', {    //here appending `<a>` into `<li>`
				    'href': aHref,
				    'data-role': 'button',
				    'data-icon': 'delete',
				    'data-theme': 'a'
				}).append($('<span/>', { //here appending `<span>` into `<a>
					'class': 'chalk',
					'style': spanStyle
				}).append($(portionName)) // here appending text into the span
				)));
				//alert("plateSlateCellApp processAddNewPortionForm mealName " + mealName + " using dividerId " + dividerId + " href " + aHref + " name " + portionName);
				//try {
				//	$('#breakfast-page ul').listview('refresh');
				//} catch (e) {
				//	$('#breakfast-page ul').listview();
				//}
			} else if (mealName == "Lunch") {
				$('#lunch-page ul').listview('refresh');
			} else if (mealName == "Dinner") {
				$('#dinner-page ul').listview('refresh');
			}
		}
		//alert("plateSlateCellApp processAddNewPortionForm mealName " + mealName);
	} else if (portionType == "protein") {
		//$('#protein-portion-dial').dialog('close');
		// tjs 120403
		//$('.ui-dialog').dialog('close');
		// tjs 120403
	    $.mobile.changePage( $('#home-page'), { transition: 'fade'} );
	} else if (portionType == "vegetables") {
		//$('#vegetables-portion-dial').dialog('close');
		// tjs 120403
		//$('.ui-dialog').dialog('close');
		// tjs 120403
	    $.mobile.changePage( $('#home-page'), { transition: 'fade'} );
	} else if (portionType == "fruits") {
		//$('#fruits-portion-dial').dialog('close');
		// tjs 120403
		//$('.ui-dialog').dialog('close');
		// tjs 120403
	    $.mobile.changePage( $('#home-page'), { transition: 'fade'} );
	} else if (portionType == "dairy") {
		//$('#dairy-portion-dial').dialog('close');
		// tjs 120403
		//$('.ui-dialog').dialog('close');
		// tjs 120403
	    $.mobile.changePage( $('#home-page'), { transition: 'fade'} );
	}
}

function cancelAddNewPortionForm(portionType) {
	//alert("plateslate cancelAddNewPortionForm portionType " + portionType);
	var offset;
	var mealName;
	if (portionType == "grain") {
		//$('#grain-portion-dial').dialog('close');
		// tjs 120403
		//$('.ui-dialog').dialog('close');
		// tjs 120403
	    $.mobile.changePage( $('#home-page'), { transition: 'fade'} );
	} else if (portionType == "protein") {
		//$('#protein-portion-dial').dialog('close');
		// tjs 120403
		//$('.ui-dialog').dialog('close');
		// tjs 120403
	    $.mobile.changePage( $('#home-page'), { transition: 'fade'} );
	} else if (portionType == "vegetables") {
		//$('#vegetables-portion-dial').dialog('close');
		// tjs 120403
		//$('.ui-dialog').dialog('close');
		// tjs 120403
	    $.mobile.changePage( $('#home-page'), { transition: 'fade'} );
	} else if (portionType == "fruits") {
		//$('#fruits-portion-dial').dialog('close');
		// tjs 120403
		//$('.ui-dialog').dialog('close');
		// tjs 120403
	    $.mobile.changePage( $('#home-page'), { transition: 'fade'} );
	} else if (portionType == "dairy") {
		//$('#dairy-portion-dial').dialog('close');
		// tjs 120403
		//$('.ui-dialog').dialog('close');
		// tjs 120403
	    $.mobile.changePage( $('#home-page'), { transition: 'fade'} );
	}
}

// TODO use html for each portion to build select via filtering out those in the lists
// tjs 120228 this is altered to filter out portions already selected for the plate
function derivePortionSelectionLists(preSelectedPortions) {
	grainPortionSelectListHtml = '<select name="portionSelection" class="Grain"><optgroup label="Grain">';
	proteinPortionSelectListHtml = '<select name="portionSelection" class="Protein"><optgroup label="Protein">';
	vegetablesPortionSelectListHtml = '<select name="portionSelection" class="Vegetables"><optgroup label="Vegetables">';
	fruitsPortionSelectListHtml = '<select name="portionSelection" class="Fruits"><optgroup label="Fruits">';
	dairyPortionSelectListHtml = '<select name="portionSelection" class="Dairy"><optgroup label="Dairy">';
	
	// tjs 120307
	var len = portions.length;
	//alert("plateSlateCellApp getPortionSelections len " + len);
	var portionName;
	var portionNames = new Array();
	var keys = new Array();
	if (len > 0) {
		// tjs 120227
		for (var i = 0; i < len; i++) {
			//if (i in portions) {
				var currentPortion = portions[i];
				if (currentPortion != null) {
					//TODO if (currentPlate.master == 1)
					//alert("plateslate updatePortionsDialogs portion type " + currentPortion.type + " portion name " + currentPortion.name);
					var currentPortionId = currentPortion.id;
					var isPreSelected = false;
					for (var j = 0; j < preSelectedPortions.length; j++) {
						if (currentPortionId == preSelectedPortions[j]) {
							isPreSelected = true;
							break;
						}
					}
					if (isPreSelected == false) {
							portionName = currentPortion.name;
							portionNames[portionName] = i;
							keys.push(portionName);
					}
				}
			//}
		}
	}

	keys.sort();

//	var len = portions.length;
	if (len > 0) {
		//for (var i = 0; i < len; i++) {
		for (var j = 0; j < keys.length; j++) {
			var i = portionNames[keys[j]];
			//alert("plateslate populatePlateMenus i " + i);
			//if (i in portions) {
				var currentPortion = portions[i];
				if (currentPortion != null) {
					var currentPortionId = currentPortion.id;
					//var isPreSelected = false;
					//for (var j = 0; j < preSelectedPortions.length; j++) {
						//if (currentPortionId == preSelectedPortions[j]) {
						//	isPreSelected = true;
						//	break;
						//}
					//}
					//if (isPreSelected == false) {
					//TODO if (currentPlate.master == 1)
					//alert("plateslate updatePortionsDialogs portion type " + currentPortion.type + " portion name " + currentPortion.name);
						if (currentPortion.type == "Grain") {
							grainPortionSelectListHtml += '<option value ="' + currentPortion.id + '">' + currentPortion.name + '</option>';
						} else if (currentPortion.type == "Protein") {
							proteinPortionSelectListHtml += '<option value ="' + currentPortion.id +'">' + currentPortion.name + '</option>';
						} else if (currentPortion.type == "Vegetables") {
							vegetablesPortionSelectListHtml += '<option value ="' + currentPortion.id +'">' + currentPortion.name + '</option>';
						} else if (currentPortion.type == "Fruits") {
							fruitsPortionSelectListHtml += '<option value ="' + currentPortion.id +'">' + currentPortion.name + '</option>';
						} else if (currentPortion.type == "Dairy") {
							dairyPortionSelectListHtml += '<option value ="' + currentPortion.id +'">' + currentPortion.name + '</option>';
						}
					//}
				}
			//}
		}
		grainPortionSelectListHtml += '</optgroup>';
		proteinPortionSelectListHtml += '</optgroup>';
		vegetablesPortionSelectListHtml += '</optgroup>';
		fruitsPortionSelectListHtml += '</optgroup>';
		dairyPortionSelectListHtml += '</optgroup>';
	}
	grainPortionSelectListHtml += '</select>';
	proteinPortionSelectListHtml += '</select>';
	vegetablesPortionSelectListHtml += '</select>';
	fruitsPortionSelectListHtml += '</select>';
	dairyPortionSelectListHtml += '</select>';
	//alert("plateslate derivePortionSelectionLists grainPortionSelectListHtml " + grainPortionSelectListHtml);
}

function processAddNewPortion(offset, mealName, portionType, optionValue) {
	//console.log("plateslate processAddNewPortion offset " + offset + " mealName " + mealName + " portionType " + portionType + " optionValue " + optionValue);
// e.g. plateslate processAddNewPortion offset 0 mealName Breakfast portionType Grain optionValue 11007 plateSlateCellApp.js:6609

	// tjs 131228
	if (optionValue > 0) {
		var slate;
		var slateId;
		// tjs 120223
		//if (offset < 1000) { // i.e. if working with slate edits of portions
			var thresholdOffset = offset + slateOffsetThreshold;
			//alert("plateslate processAddNewPortionForm thresholdOffset " + thresholdOffset);
			// e.g. offset 0 means 100
			
			slate = slates[thresholdOffset];
			slateId = slate.id;	
			//updateFood(slateId, mealName, optionValue, 0, 0);
			//modifySlateFoodPortions(slate, mealName, optionValue, 0, 0);
			modifySlateFoodPortions(slate, mealName, optionValue, 0, 0, refreshSlatePortionCache);
	
		//  update cache
			// tjs 140302 cache should be updated as part of modify above!!!
			//refreshSlatePortionCache(slate, mealName, optionValue);
	}
}

function refreshSlatePortionCache(slate, mealName, optionValue) {
	console.log("refreshSlatePortionCache portion id " + optionValue + " (type " + mealName + ")");
	var typePortions;
	if  (mealName == "Breakfast") {
		// tjs 140301
		//typePortions = slate.breakfastPortions;
		typePortions = slate.breakfastPortions.slice(0);
	} else if (mealName == "Lunch") {
		typePortions = slate.lunchPortions.slice(0);
	} else if (mealName == "Dinner") {
		typePortions = slate.dinnerPortions.slice(0);
	}
	var index = 0;
	var portionExists = false;
	for (var i = 0; i < typePortions.length; i++) {
		if (typePortions[i] == optionValue) {
			portionExists = true;
			break;
		}
		index++;
	}
	// tjs 140303
	if  (mealName == "Breakfast") {
		hijaxBreakfastPage('fade');
	} else if (mealName == "Lunch") {
		hijaxLunchPage('fade');
	} else if (mealName == "Dinner") {
		hijaxDinnerPage('fade');
	}

	/*
	if (!portionExists) {
		if  (mealName == "Breakfast") {
			slate.breakfastPortions[index] = optionValue;
			hijaxBreakfastPage('fade');
		} else if (mealName == "Lunch") {
			slate.lunchPortions[index] = optionValue;
			hijaxLunchPage('fade');
		} else if (mealName == "Dinner") {
			slate.dinnerPortions[index] = optionValue;
			hijaxDinnerPage('fade');
		}
	}
	*/
}

function refreshSlatePortionCache2(slate, mealName, optionValue) {
	var index = 0;
	var currentPortionId;
	if  (mealName == "Breakfast") {
		for (var i = 0; i < slate.breakfastPortions.length; i++) {
			currentPortionId = slate.breakfastPortions[i];
			if (currentPortionId == optionValue) {
				continue;
			}
			slate.breakfastPortions[index++] = currentPortionId;
		}
		slate.breakfastPortions[index] = 0;
		hijaxBreakfastPage('fade');
	} else if (mealName == "Lunch") {
		for (var i = 0; i < slate.lunchPortions.length; i++) {
			currentPortionId = slate.lunchPortions[i];
			if (currentPortionId == optionValue) {
				continue;
			}
			slate.lunchPortions[index++] = currentPortionId;
		}
		slate.lunchPortions[index] = 0;
		hijaxLunchPage('fade');
	} else if (mealName == "Dinner") {
		for (var i = 0; i < slate.dinnerPortions.length; i++) {
			currentPortionId = slate.dinnerPortions[i];
			if (currentPortionId == optionValue) {
				continue;
			}
			slate.dinnerPortions[index++] = currentPortionId;
		}
		slate.dinnerPortions[index] = 0;
		hijaxDinnerPage('fade');
	}
	
	/*
	var typePortions;
	if  (mealName == "Breakfast") {
		typePortions = slate.breakfastPortions;
	} else if (mealName == "Lunch") {
		typePortions = slate.lunchPortions;
	} else if (mealName == "Dinner") {
		typePortions = slate.dinnerPortions;
	}
	//var index = 0;
	var portionExists = false;
	for (var i = 0; i < typePortions.length; i++) {
		if (typePortions[i] == optionValue) {
			portionExists = true;
		}
		//index++;
	}
	if (portionExists) {
		if  (mealName == "Breakfast") {
			slate.breakfastPortions.length = 0;
			for (var i = 0; i < typePortions.length; i++) {
				if (typePortions[i] == optionValue) {
					continue;
				}
				slate.breakfastPortions.push(typePortions[i]);
			}
			hijaxBreakfastPage('fade');
		} else if (mealName == "Lunch") {
			slate.lunchPortions.length = 0;
			for (var i = 0; i < typePortions.length; i++) {
				if (typePortions[i] == optionValue) {
					continue;
				}
				slate.lunchPortions.push(typePortions[i]);
			}
			hijaxLunchPage('fade');
		} else if (mealName == "Dinner") {
			slate.dinnerPortions.length = 0;
			for (var i = 0; i < typePortions.length; i++) {
				if (typePortions[i] == optionValue) {
					continue;
				}
				slate.dinnerPortions.push(typePortions[i]);
			}
			hijaxDinnerPage('fade');
		}
	}*/	
}

function hijaxGrainSelectionDial(offset, mealName, torf) {
	// tjs 120403
	//$('.ui-dialog').remove();

	//alert("plateslate hijaxGrainSelectionDial offset " + offset + " mealName " + mealName);
	//alert("plateslate hijaxGrainSelectionDial offset " + offset + " mealName " + mealName + " grainPortionSelectListHtml " + grainPortionSelectListHtml);
	var newDialHtml = '<div data-role="dialog" id="grain-portion-dial" data-rel="dialog"><div data-role="header">';
	newDialHtml += '<h1>Add New Grain Portion</h1></div>';	
	newDialHtml += '<div data-role="content" data-theme="c">';	
	//newDialHtml += '<form name="newGrainPortionForm"><input type="hidden" name="slateOffset" /><input type="hidden" name="portionName" />';
	newDialHtml += '<form name="newGrainPortionForm"><input type="hidden" name="slateOffset" /><input type="hidden" name="portionName" /><input type="hidden" name="isSlate" />';
	newDialHtml += '<p>Add New Grain Portion...</p><p/>';
	newDialHtml += '<p><label for="mealName">Meal:</label><input type="text" name="mealName" id="name" readonly="readonly" data-theme="d"/></p>';
	newDialHtml += '<p><label for="name">Grain:</label>' + grainPortionSelectListHtml + '</p>';
	newDialHtml += '</form><br><br><a href="javascript:cancelAddNewPortionForm(' + "'grain'" + ');" data-role="button" data-inline="true" data-theme="a">Cancel</a>';		
	newDialHtml += '<a href="javascript:processAddNewPortionForm(' + "'grain'" + ');" data-role="button" data-inline="true">Add New Portion</a>';
	newDialHtml += '</div><script></script></div>';
	var newDial = $(newDialHtml);
	//add new dialog to page container
	newDial.appendTo($.mobile.pageContainer);
	
	// tweak the new dialog just added into the dom
 	document.newGrainPortionForm.slateOffset.value = offset;
	document.newGrainPortionForm.mealName.value = mealName;
	if (torf)
		document.newGrainPortionForm.isSlate.value = 1;
	else
		document.newGrainPortionForm.isSlate.value = 0;
	
	// enhance and open the new dialog
    $.mobile.changePage(newDial);
}

function hijaxProteinSelectionDial(offset, mealName, torf) {
	// tjs 120403
	//$('.ui-dialog').remove();

	//alert("plateslate hijaxProteinSelectionDial offset " + offset + " mealName " + mealName + " grainPortionSelectListHtml " + grainPortionSelectListHtml);
	var newDialHtml = '<div data-role="dialog" id="protein-portion-dial"><div data-role="header">';
	newDialHtml += '<h1>Add New Protein Portion</h1></div>';	
	newDialHtml += '<div data-role="content" data-theme="c">';	
	newDialHtml += '<form name="newProteinPortionForm"><input type="hidden" name="slateOffset" /><input type="hidden" name="portionName" /><input type="hidden" name="isSlate" />';
	newDialHtml += '<p>Add New Protein Portion...</p><p/>';
	newDialHtml += '<p><label for="mealName">Meal:</label><input type="text" name="mealName" id="name" readonly="readonly" data-theme="d"/></p>';
	newDialHtml += '<p><label for="name">Protein:</label>' + proteinPortionSelectListHtml + '</p>';
	newDialHtml += '</form><br><br><a href="javascript:cancelAddNewPortionForm(' + "'protein'" + ');" data-role="button" data-inline="true" data-theme="a">Cancel</a>';		
	newDialHtml += '<a href="javascript:processAddNewPortionForm(' + "'protein'" + ');" data-role="button" data-inline="true">Add New Portion</a>';
	newDialHtml += '</div><script></script></div>';
	var newDial = $(newDialHtml);
	//add new dialog to page container
	newDial.appendTo($.mobile.pageContainer);
	
	// tweak the new dialog just added into the dom
 	document.newProteinPortionForm.slateOffset.value = offset;
	document.newProteinPortionForm.mealName.value = mealName;
	if (torf)
		document.newProteinPortionForm.isSlate.value = 1;
	else
		document.newProteinPortionForm.isSlate.value = 0;
   
	// enhance and open the new dialog
    $.mobile.changePage(newDial);
}

function hijaxVegetablesSelectionDial(offset, mealName, torf) {
	// tjs 120403
	//$('.ui-dialog').remove();

	var newDialHtml = '<div data-role="dialog" id="vegetables-portion-dial"><div data-role="header">';
	newDialHtml += '<h1>Add New Vegetable Portion</h1></div>';	
	newDialHtml += '<div data-role="content" data-theme="c">';	
	newDialHtml += '<form name="newVegetablesPortionForm"><input type="hidden" name="slateOffset" /><input type="hidden" name="portionName" /><input type="hidden" name="isSlate" />';
	newDialHtml += '<p>Add New Vegetable Portion...</p><p/>';
	newDialHtml += '<p><label for="mealName">Meal:</label><input type="text" name="mealName" id="name" readonly="readonly" data-theme="d"/></p>';
	newDialHtml += '<p><label for="name">Vegetable:</label>' + vegetablesPortionSelectListHtml + '</p>';
	newDialHtml += '</form><br><br><a href="javascript:cancelAddNewPortionForm(' + "'vegetables'" + ');" data-role="button" data-inline="true" data-theme="a">Cancel</a>';		
	newDialHtml += '<a href="javascript:processAddNewPortionForm(' + "'vegetables'" + ');" data-role="button" data-inline="true">Add New Portion</a>';
	newDialHtml += '</div><script></script></div>';
	var newDial = $(newDialHtml);
	//add new dialog to page container
	newDial.appendTo($.mobile.pageContainer);
	
	// tweak the new dialog just added into the dom
 	document.newVegetablesPortionForm.slateOffset.value = offset;
	document.newVegetablesPortionForm.mealName.value = mealName;
	if (torf)
		document.newVegetablesPortionForm.isSlate.value = 1;
	else
		document.newVegetablesPortionForm.isSlate.value = 0;
   
	// enhance and open the new dialog
    $.mobile.changePage(newDial);
}

function hijaxFruitsSelectionDial(offset, mealName, torf) {
	// tjs 120403
	//$('.ui-dialog').remove();

	var newDialHtml = '<div data-role="dialog" id="fruits-portion-dial"><div data-role="header">';
	newDialHtml += '<h1>Add New Fruit Portion</h1></div>';	
	newDialHtml += '<div data-role="content" data-theme="c">';	
	newDialHtml += '<form name="newFruitsPortionForm"><input type="hidden" name="slateOffset" /><input type="hidden" name="portionName" /><input type="hidden" name="isSlate" />';
	newDialHtml += '<p>Add New Fruit Portion...</p><p/>';
	newDialHtml += '<p><label for="mealName">Meal:</label><input type="text" name="mealName" id="name" readonly="readonly" data-theme="d"/></p>';
	newDialHtml += '<p><label for="name">Fruit:</label>' + fruitsPortionSelectListHtml + '</p>';
	newDialHtml += '</form><br><br><a href="javascript:cancelAddNewPortionForm(' + "'fruits'" + ');" data-role="button" data-inline="true" data-theme="a">Cancel</a>';		
	newDialHtml += '<a href="javascript:processAddNewPortionForm(' + "'fruits'" + ');" data-role="button" data-inline="true">Add New Portion</a>';
	newDialHtml += '</div><script></script></div>';
	var newDial = $(newDialHtml);
	//add new dialog to page container
	newDial.appendTo($.mobile.pageContainer);
	
	// tweak the new dialog just added into the dom
 	document.newFruitsPortionForm.slateOffset.value = offset;
	document.newFruitsPortionForm.mealName.value = mealName;
	if (torf)
		document.newFruitsPortionForm.isSlate.value = 1;
	else
		document.newFruitsPortionForm.isSlate.value = 0;
   
	// enhance and open the new dialog
    $.mobile.changePage(newDial);
}

function hijaxDairySelectionDial(offset, mealName, torf) {
	// tjs 120403
	//$('.ui-dialog').remove();

	var newDialHtml = '<div data-role="dialog" id="dairy-portion-dial"><div data-role="header">';
	newDialHtml += '<h1>Add New Dairy Portion</h1></div>';	
	newDialHtml += '<div data-role="content" data-theme="c">';	
	newDialHtml += '<form name="newDairyPortionForm"><input type="hidden" name="slateOffset" /><input type="hidden" name="portionName" /><input type="hidden" name="isSlate" />';
	newDialHtml += '<p>Add New Dairy Portion...</p><p/>';
	newDialHtml += '<p><label for="mealName">Meal:</label><input type="text" name="mealName" id="name" readonly="readonly" data-theme="d"/></p>';
	newDialHtml += '<p><label for="name">Dairy:</label>' + dairyPortionSelectListHtml + '</p>';
	newDialHtml += '</form><br><br><a href="javascript:cancelAddNewPortionForm(' + "'dairy'" + ');" data-role="button" data-inline="true" data-theme="a">Cancel</a>';		
	newDialHtml += '<a href="javascript:processAddNewPortionForm(' + "'dairy'" + ');" data-role="button" data-inline="true">Add New Portion</a>';
	newDialHtml += '</div><script></script></div>';
	var newDial = $(newDialHtml);
	//add new dialog to page container
	newDial.appendTo($.mobile.pageContainer);
	
	// tweak the new dialog just added into the dom
 	document.newDairyPortionForm.slateOffset.value = offset;
	document.newDairyPortionForm.mealName.value = mealName;
	if (torf)
		document.newDairyPortionForm.isSlate.value = 1;
	else
		document.newDairyPortionForm.isSlate.value = 0;
   
	// enhance and open the new dialog
    $.mobile.changePage(newDial);
}

function dropPortion(plateIndex, mealName, portionId) {
	//alert("plateSlateCellApp dropPortion mealName " + mealName + " portionId " + portionId + " plateIndex " + plateIndex);
	// e.g. plateSlateCellApp dropPortion mealName Breakfast portionId 47 plateIndex 0 (when edit slate mode)
	if (plateIndex == 0) {
	    var offset = color/20;
		var thresholdOffset = offset + slateOffsetThreshold;
		var slate = slates[thresholdOffset];
		var slateId = slate.id;
		// make the portioninactive...
		//updateFood(slateId, mealName, portionId, 0, 1);
		modifySlateFoodPortions(slate, mealName, portionId, 0, 1);

		// tjs 120330
		//  update cache
		refreshSlatePortionCache2(slate, mealName, portionId);
	} else {
		var dish = plates[plateIndex];
		if (dish.portion1 == portionId)
			dish.portion1 = 0;
		else if (dish.portion2 == portionId)
			dish.portion2 = 0;
		else if (dish.portion3 == portionId)
			dish.portion3 = 0;
		else if (dish.portion4 == portionId)
			dish.portion4 = 0;
		else if (dish.portion5 == portionId)
			dish.portion5 = 0;
		else if (dish.portion6 == portionId)
			dish.portion6 = 0;
		else if (dish.portion7 == portionId)
			dish.portion7 = 0;
		else if (dish.portion8 == portionId)
			dish.portion8 = 0;
		else if (dish.portion9 == portionId)
			dish.portion9 = 0;
		addToPlate(dish);
		//$('#edit-plate-dial').dialog('close');
		// tjs 120403
		//$('.ui-dialog').dialog('close');
		// tjs 120403
	    $.mobile.changePage( $('#home-page'), { transition: 'fade'} );
	}
}

function hijaxPlatesPage(direction) {
	if (!authenticated)	{
		// tjs 120229
		var paragraphs = new Array();
		paragraphs.push(requiresLoginLine1);
		paragraphs.push(requiresLoginLine2);
		hijaxAlertDial(requiresLoginTitle, paragraphs);
		return;
	}

	// tjs 120303
	var transition = 'slide';
	var reverse = false;
	if (direction != null) {
		if (direction == 'reverse')
			reverse = true;
		else 
			transition = direction;
	}

	//alert("plateSlateCellApp hijaxPlatesPage...");
	// tjs 120224
	var plateName;
	var plateNames = new Array();
	// tjs 120228
	var actives = new Array();
	var inActives = new Array();
	for (var i = 0; i < plates.length; i++) {
	    //if (i in plates) {
			var plate = plates[i];
			plateName = plate.name;
			plateNames[plateName] = i;
			if (plate.isInactive > 0)
				inActives.push(plateName);
			else
				actives.push(plateName);
	    //}
	}
	//alert("plateSlateCellApp sorting portionNames...");
	actives.sort();
	inActives.sort();

	  // create page markup
	var newPageHtml = '<div data-role="page" id="plates-page" data-title="Plates" class="type-interior" data-theme="b" data-dom-cache="true">';
	newPageHtml += '<div data-role="header" data-theme="f" data-position="fixed">';
	//newPageHtml += '<a href="index.html" data-icon="home" data-iconpos="notext" data-direction="reverse" class="ui-btn-left jqm-home">Home</a>';
// tjs 140120
	//newPageHtml += '<a href="#home-page" data-icon="home" data-iconpos="notext" data-direction="reverse" class="ui-btn-left jqm-home">Home</a>';
	newPageHtml += '<a href="./index.html#home-page" rel="external" data-icon="home" data-iconpos="notext" data-direction="reverse" class="ui-btn-left jqm-home">Home</a>';
	newPageHtml += '<h1>Plates</h1>';
	newPageHtml += '</div>';
	newPageHtml += '<div data-role="content">';
	newPageHtml += '<div class="content-primary">';
	newPageHtml += '<ul data-role="listview" id="plates-list" data-filter="true" data-filter-placeholder="Search..." data-split-theme="d">';
	newPageHtml += '<li data-role="list-divider" data-theme="b"><a href="javascript:addPlate()">Add New Plate</a></li>';
	newPageHtml += '<li data-role="list-divider" data-theme="b">Plates Revealed for Selection:</li>';
	for(var j = 0; j < actives.length; j++) {
		plateName = actives[j];
		var i = plateNames[plateName];
		newPageHtml += '<li><a href="javascript:editPlate(' + i + ')">' + plateName + '</a><a href="javascript:togglePlateInactive(true, ' + i + ')" data-role="button" data-icon="delete">Conceal Plate</a></li>';
	}
	newPageHtml += '<li data-role="list-divider" data-theme="b">Concealed Plates:</li>';
	for(var j = 0; j < inActives.length; j++) {
		plateName = inActives[j];
		var i = plateNames[plateName];
		newPageHtml += '<li><a href="javascript:editPlate(' + i + ')">' + plateName + '</a><a href="javascript:togglePlateInactive(false, ' + i + ')" data-role="button" data-icon="add">Reveal Plate</a></li>';
	}
	//alert("plateSlateCellApp hijaxPlatesPage plates.length " + plates.length);
	newPageHtml += "</ul>";
	newPageHtml += '</div>'; // end content primary
	newPageHtml += '</div></div>';
	//alert("plateSlateCellApp hijaxPlatesPage newPageHtml " + newPageHtml);
	var newPage = $(newPageHtml);
	//add new dialog to page container
	newPage.appendTo($.mobile.pageContainer);
	// enhance and open the new dialog
    $.mobile.changePage(newPage, {transition: transition, reverse: reverse });	
}

function addPlate() {
	//alert("plateSlateCellApp addPlate...");
	$.mobile.changePage("#add-plate-dial");
}

function editPlate(index) {
	console.log("plateSlateCellApp editPlate index " + index);
	//alert("plateSlateCellApp editPlate index " + index);
	// tjs 120223
	//var indexOffset = 1000 + index;
	var plate = plates[index];
	var mealName = plate.type;
	//assigns values to globals such as grainPortionSelectListHtml
	console.log("plateSlateCellApp editPlate mealName " + mealName + " plate name " + plate.name);

	var preSelectedPortions = new Array();
	
	// set empty lists...
	plateGrainsHtml = '<li/>';
	plateProteinHtml = '<li/>';
	plateVegetablesHtml = '<li/>';
	plateFruitsHtml = '<li/>';
	plateDairyHtml = '<li/>';
	
	// possibly appends tags to above empty lists...
	if (plate.portion1 != null) {
		appendPortion(plate, plate.portion1, index, false);
		preSelectedPortions.push(plate.portion1);
	}
	if (plate.portion2 != null) {
		appendPortion(plate, plate.portion2, index, false);
		preSelectedPortions.push(plate.portion2);
	}
	if (plate.portion3 != null) {
		appendPortion(plate, plate.portion3, index, false);
		preSelectedPortions.push(plate.portion3);
	}
	if (plate.portion4 != null) {
		appendPortion(plate, plate.portion4, index, false);
		preSelectedPortions.push(plate.portion4);
	}
	if (plate.portion5 != null) {
		appendPortion(plate, plate.portion5, index, false);
		preSelectedPortions.push(plate.portion5);
	}
	if (plate.portion6 != null) {
		appendPortion(plate, plate.portion6, index, false);
		preSelectedPortions.push(plate.portion6);
	}
	if (plate.portion7 != null) {
		appendPortion(plate, plate.portion7, index, false);
		preSelectedPortions.push(plate.portion7);
	}
	if (plate.portion8 != null) {
		appendPortion(plate, plate.portion8, index, false);
		preSelectedPortions.push(plate.portion8);
	}
	if (plate.portion9 != null) {
		appendPortion(plate, plate.portion9, index, false);
		preSelectedPortions.push(plate.portion9);
	}

	derivePortionSelectionLists(preSelectedPortions);

	// tjs 120403
	$('.ui-dialog').remove();
	console.log("plateSlateCellApp editPlate preparing dialog...");

	//data-dialog="true"
	// tjs 140123
	// tjs 140124 try revert
	var newDialHtml = '<div data-role="dialog" id="edit-plate-dial"><div data-role="header">';
	//var newDialHtml = '<div data-role="page" data-dialog="true" id="edit-plate-dial"><div data-role="header">';
	newDialHtml += '<h1>Edit Plate</h1></div>';	
	newDialHtml += '<div data-role="content" data-theme="c">';	
	newDialHtml += '<li data-role="list-divider" data-theme="b"><div data-type="horizontal">';
	newDialHtml += '<a href="javascript:hijaxGrainSelectionDial(' + index + ",'" + mealName + "', false" + ');" data-role="button" data-icon="plus" data-inline="true" data-iconpos="right">Grains</a>';
	newDialHtml += '</div></li>';
	newDialHtml += plateGrainsHtml;
	newDialHtml += '<li data-role="list-divider" data-theme="b"><div data-type="horizontal">';
	newDialHtml += '<a href="javascript:hijaxProteinSelectionDial(' + index + ",'" + mealName + "', false" + ');" data-role="button" data-icon="plus" data-inline="true" data-iconpos="right">Protein</a>';
	newDialHtml += '</div></li>';
	newDialHtml += plateProteinHtml;
	newDialHtml += '<li data-role="list-divider" data-theme="b"><div data-type="horizontal">';
	newDialHtml += '<a href="javascript:hijaxVegetablesSelectionDial(' + index + ",'" + mealName + "', false" + ');" data-role="button" data-icon="plus" data-inline="true" data-iconpos="right">Vegetables</a>';
	newDialHtml += '</div></li>';
	newDialHtml += plateVegetablesHtml;
	newDialHtml += '<li data-role="list-divider" data-theme="b"><div data-type="horizontal">';
	newDialHtml += '<a href="javascript:hijaxFruitsSelectionDial(' + index + ",'" + mealName + "', false" + ');" data-role="button" data-icon="plus" data-inline="true" data-iconpos="right">Fruits</a>';
	newDialHtml += '</div></li>';
	newDialHtml += plateFruitsHtml;
	newDialHtml += '<li data-role="list-divider" data-theme="b"><div data-type="horizontal">';
	newDialHtml += '<a href="javascript:hijaxDairySelectionDial(' + index + ",'" + mealName + "', false" + ');" data-role="button" data-icon="plus" data-inline="true" data-iconpos="right">Dairy</a>';
	newDialHtml += '</div></li>';
	newDialHtml += plateDairyHtml;
// tjs 120403
	newDialHtml += '<br/><br/><a href="#home-page" data-role="button" data-inline="true" data-theme="a">Cancel</a>';		

	newDialHtml += '</div><script></script></div>';
	// tjs 140124 revert with debug in paginit...
	var newDial = $(newDialHtml);
	//add new dialog to page container
	newDial.appendTo($.mobile.pageContainer);
	console.log("plateSlateCellApp editPlate opening dialog...");
	$.mobile.changePage(newDial);
	
	// tjs 140124
	/*
	var newDial = $(newDialHtml);
	//add new dialog to page container
	newDial.appendTo($.mobile.pageContainer);
	
	// tweak the new dialog just added into the dom

	// enhance and open the new dialog
	// tjs 140123
	console.log("plateSlateCellApp editPlate opening dialog...");

    //$.mobile.changePage(newDial);
	//$.mobile.changePage("#edit-plate-dial");
	//$.mobile.changePage("#edit-plate-dial", { role: "dialog" } );
	$.mobile.changePage(newDial, { role: "dialog" } );
	*/
	// tjs 140124
	//$( ...new markup that contains widgets... ).appendTo( ".ui-page" ).trigger( "create" );
	//console.log("plateSlateCellApp editPlate opening dialog...");
	//$(newDialHtml).appendTo( ".ui-page" ).trigger( "create" );
    //$('body').append(newDialHtml);
    //window.location.hash = 'edit-plate-dial';
    //$.mobile.initializePage();
    //$('body').append(newDialHtml).trigger( "create" );
    
    //$( ".selector" ).pagecontainer( "change" );
	//$( ":mobile-pagecontainer" ).pagecontainer( "change", "confirm.html", { role: "dialog" } );

    //$(newDialHtml).pagecontainer( "change" );
	// last
	//$('body').append(newDialHtml);
	//$("#edit-plate-dial").pagecontainer( "change" );
	//$( ":mobile-pagecontainer" );
	//$( ".selector" ).pagecontainer({ defaults: true });
	//$( "#edit-plate-dial" ).pagecontainer({ defaults: true });
	//$("#edit-plate-dial").pagecontainer( "change" );
	
	//var newDynamicPage = $("#edit-plate-dial");
	//$.mobile.pageContainer.pagecontainer("change", newDynamicPage );
	// last
	//$.mobile.changePage("#edit-plate-dial");

	/*
	ajaxCall(param1).always(function (data) {
        //$.mobile.hidePageLoadingMsg();
       if (data.d != null) {
            //var newPage = $(data.d);
    	   var newDynamicPage = $(data.d);
            //append it to the page container
            //newPage.appendTo($.mobile.pageContainer);
            //go to it
            //$.mobile.changePage(newPage );
        	//append it to the page container
        	newDynamicPage .appendTo($.mobile.pageContainer);
        	//go to it
        	$.mobile.pageContainer.pagecontainer("change", newDynamicPage );                
        }
        else {
            console.log("Error calling service!!");
        }
    });*/
}


//tjs 120227
function togglePlateInactive(torf, index) {
	//alert("plateSlateCellApp togglePlateInactive torf " + torf + " index " + index);
	var plate = plates[index];
	if (torf) {
		plate.isInactive = 1;
	} else {
		plate.isInactive = 0;
	}
	addToPlate(plate);
	// tjs 120303
	hijaxPlatesPage('fade');
}

function processAddPlateForm() {
	var plateName;
	var plateNameUC;
	var plateDescription;
	var typeSelection;
	plateName = document.addPlateForm.name.value;
	plateNameUC = plateName.toUpperCase();
	plateDescription = document.addPlateForm.description.value;
	typeSelection = document.addPlateForm.type;
	var optionValue = typeSelection.options[typeSelection.selectedIndex].value;
	//alert("plateSlateCellApp processAddPlateForm plateName " + plateName + " plateDescription " + plateDescription + " optionValue " + optionValue);
	
	var dish;
	var dishName;
	var dishNameUC;
	// tjs 120229
	var plateIndex = -1;
	//var plateExists = false;
	var i = plates.length;
	for (var j = 0; j < i; j++) {
		//if (j in plates) {
			dish = plates[j];
			dishName = dish.name;
			dishNameUC = dishName.toUpperCase();
			if (dishNameUC == plateNameUC) {
				//plateExists = true;
				plateIndex = j;
				break;
			}
		//}
	}
	$('#add-plate-dial-error').empty();
	if (plateIndex == -1) {
		var index = i++;	
		dish = new Plate(index, optionValue, plateName, plateDescription, 0, null, null, null, null, null, null, null, null, null, 0);
		// tjs 140124
		//$( ".selector" ).dialog( "close" );
		$( "#add-plate-dial" ).dialog( "close" );
		// tjs 140123
		//addToPlate(dish);
		// tjs 140125
		//modifyPlates(dish, portions, index);
		modifyPlates(dish, portions);
		// tjs 140123 restore logic???		
		// tjs 131219
		//plates[index] = dish;
		plates.push(dish);
		// use plate edit dialog...
		//editPlate(index);
	} else {
		var isError = true;
		var msg = "The plate with name " + plateName + " already Exists!";
		dish = plates[plateIndex];
		if (dish.isInactive > 0) {
			togglePlateInactive(false, plateIndex);
			//msg += "<br/>(The plate had been concealed but is now revealed and my be edited.)";
			msg += " (The plate had been concealed but is now revealed and my be edited.)";
			isError = false;
		}
		var warningOrError = isError? "Error: ": "Warning: ";
		warningOrError += msg;
		$('#add-plate-dial-error').text(warningOrError);
	}
	return;
}

function hijaxPortionsPage(direction) {
	// for debug comment out this...
	if (!authenticated)	{
		//alert("You must login before using this feature!");
		var paragraphs = new Array();
		paragraphs.push(requiresLoginLine1);
		paragraphs.push(requiresLoginLine2);
		hijaxAlertDial(requiresLoginTitle, paragraphs);
		return;
	}
	// tjs 120303
	var transition = 'slide';
	var reverse = false;
	if (direction != null) {
		if (direction == 'reverse')
			reverse = true;
		else 
			transition = direction;
	}

	// tjs 120224
	var portionName;
	var portionNames = new Array();
	var actives = new Array();
	var inActives = new Array();
	for (var i = 0; i < portions.length; i++) {
	    //if (i in portions) {
		//var portion = getPortionById(i);
			var portion = portions[i];
			// tjs 131221
			if (portion != null) {
			portionName = portion.name;
			portionNames[portionName] = i;
			if (portion.isInactive > 0)
				inActives.push(portionName);
			else
				actives.push(portionName);
			}
	   // }
	}
	//alert("plateSlateCellApp sorting portionNames...");
	actives.sort();
	inActives.sort();
	
	  // create page markup
	var newPageHtml = '<div data-role="page" id="portions-page" data-title="Portions" class="type-interior" data-theme="b" data-dom-cache="true">';
	newPageHtml += '<div data-role="header" data-theme="f" data-position="fixed">';
	//newPageHtml += '<a href="index.html" data-icon="home" data-iconpos="notext" data-direction="reverse" class="ui-btn-left jqm-home">Home</a>';
	// tjs 140120
	//newPageHtml += '<a href="#home-page" data-icon="home" data-iconpos="notext" data-direction="reverse" class="ui-btn-left jqm-home">Home</a>';
	newPageHtml += '<a href="./index.html#home-page" rel="external" data-icon="home" data-iconpos="notext" data-direction="reverse" class="ui-btn-left jqm-home">Home</a>';
	newPageHtml += '<h1>Portions</h1>';
	newPageHtml += '</div>';
	newPageHtml += '<div data-role="content">';
	newPageHtml += '<div class="content-primary">';
	newPageHtml += '<ul data-role="listview" id="portions-list" data-filter="true" data-filter-placeholder="Search..." data-split-theme="d">';
	//alert("plateSlateCellApp hijaxPortionsPage portions.length " + portions.length);
	newPageHtml += '<li data-role="list-divider" data-theme="b"><a href="javascript:addPortion()">Add New Portion</a></li>';
	newPageHtml += '<li data-role="list-divider" data-theme="b">Portions Revealed for Selection:</li>';
	for(var j = 0; j < actives.length; j++) {
		portionName = actives[j];
		var i = portionNames[portionName];
		newPageHtml += '<li><a href="javascript:editPortion(' + i + ')">' + portionName + '</a><a href="javascript:togglePortionInactive(true, ' + i + ')" data-role="button" data-icon="delete">Conceal Portion</a></li>';
	}
	newPageHtml += '<li data-role="list-divider" data-theme="b">Concealed Portions:</li>';
	for(var j = 0; j < inActives.length; j++) {
		portionName = inActives[j];
		var i = portionNames[portionName];
		newPageHtml += '<li><a href="javascript:editPortion(' + i + ')">' + portionName + '</a><a href="javascript:togglePortionInactive(false, ' + i + ')" data-role="button" data-icon="add">Reveal Portion</a></li>';
	}
	newPageHtml += "</ul>";
	newPageHtml += '</div>'; // end content primary
	newPageHtml += '</div></div>';
	//alert("plateSlateCellApp hijaxPlatesPage newPageHtml " + newPageHtml);
	var newPage = $(newPageHtml);
	//add new dialog to page container
	newPage.appendTo($.mobile.pageContainer);
	// enhance and open the new dialog
    $.mobile.changePage(newPage, {transition: transition, reverse: reverse });	
}

function addPortion() {
	//alert("plateSlateCellApp addPlate...");
	$.mobile.changePage("#add-portion-dial");
}

function editPortion(index) {
	// tjs 120403
	$('.ui-dialog').remove();

	//alert("plateSlateCellApp editPortion index " + index);
	//var portion = getPortionById(index);
	var portion = portions[index];
	var portionName = portion.name;
	var portionDescription = portion.description;
	var portionType = portion.type;
	var newDialHtml = '<div data-role="dialog" id="edit-portion-dial"><div data-role="header">';
	newDialHtml += '<h1>Edit Portion</h1></div>';	
	newDialHtml += '<div data-role="content" data-theme="c">';
	newDialHtml += '<form name="editPortionForm"><input type="hidden" name="index" value="'+ index + '"/>';
	newDialHtml += '<p>Edit Portion...</p>';
	newDialHtml += '<p/><p>	<label for="name">Portion Name:</label>';
	newDialHtml += '<input type="text" name="name" id="portionname" value="' + portionName + '" placeholder="portionname" data-theme="d"/></p>';
	newDialHtml += '<p><label for="description">Description:</label>';
	newDialHtml += '<input type="text" name="description" id="portiondescription" value="' + portionDescription + '" placeholder="description" data-theme="d"/></p>';
	newDialHtml += '<p><select name="type"><optgroup label="Type">';
	newDialHtml += '<option value ="Grain"';
	if (portionType == "Grain") {
		newDialHtml += 'selected="selected"';
	}
	newDialHtml += '>Grain</option>';
	newDialHtml += '<option value ="Protein"';
	if (portionType == "Protein") {
		newDialHtml += 'selected="selected"';
	}
	newDialHtml += '>Protein</option>';
	newDialHtml += '<option value ="Vegetables"';
	if (portionType == "Vegetables") {
		newDialHtml += 'selected="selected"';
	}
	newDialHtml += '>Vegetables</option>';
	newDialHtml += '<option value ="Fruits"';
	if (portionType == "Fruits") {
		newDialHtml += 'selected="selected"';
	}
	newDialHtml += '>Fruits</option>';
	newDialHtml += '<option value ="Dairy"';
	if (portionType == "Dairy") {
		newDialHtml += 'selected="selected"';
	}
	newDialHtml += '>Dairy</option>';
	newDialHtml += '</optgroup></select></p>';
	newDialHtml += '</form>';
	newDialHtml += '<br><br>';
	//newDialHtml += '<a href="#home-page" data-role="button" data-inline="true" data-rel="back" data-theme="a">Cancel</a>';		
	newDialHtml += '<a href="#home-page" data-role="button" data-inline="true" data-theme="a">Cancel</a>';		
	newDialHtml += '<a href="javascript:processEditPortionForm();" data-role="button" data-inline="true">Save Portion Edit</a>';
	newDialHtml += '<div id ="resultLog"></div>';
	newDialHtml += '</div><script></script></div>';

	var newDial = $(newDialHtml);
	//add new dialog to page container
	newDial.appendTo($.mobile.pageContainer);
	
	// tweak the new dialog just added into the dom

	// enhance and open the new dialog
    $.mobile.changePage(newDial);
}

// tjs 120227
function togglePortionInactive(torf, index) {
	//alert("plateSlateCellApp togglePortionInactive torf " + torf + " index " + index);
	var portion = getPortionById(index);
	if (torf) {
		portion.isInactive = 1;
	} else {
		portion.isInactive = 0;
	}
	addToPortion(portion);
	//$("#portions-page ul").listview("refresh");
	// tjs 120303
	hijaxPortionsPage('fade');
}

function processAddPortionForm() {
	var portionName;
	var portionNameUC;
	var portionDescription;
	var typeSelection;
	portionName = document.addPortionForm.name.value;
	portionNameUC = portionName.toUpperCase();
	portionDescription = document.addPortionForm.description.value;
	typeSelection = document.addPortionForm.type;
	var optionValue = typeSelection.options[typeSelection.selectedIndex].value;
	//alert("plateSlateCellApp processAddPortionForm portionName " + portionName + " portionDescription " + portionDescription + " optionValue " + optionValue);
	
	var portion;
	var segmentName;
	var segmentNameUC;
	// tjs 120229
	var portionIndex = -1;
	var i = portions.length;
	// tjs 131228
	//for (var j = 0; j < i; j++) {
	for (var j = 1; j < i; j++) {
		//if (j in portions) {
		// tjs 131218 ??? here
			portion = portions[j];
			segmentName = portion.name;
			segmentNameUC = segmentName.toUpperCase();
			if (segmentNameUC == portionNameUC) {
				//portionExists = true;
				portionIndex = j;
				break;
			}
		//}
	}
	// e.g. plateSlateCellApp processAddPortionForm portionName apples portionNameUC APPLES portionIndex 62
	//alert("plateSlateCellApp processAddPortionForm portionName " + portionName + " portionNameUC " + portionNameUC + " portionIndex " + portionIndex);
	// tjs 131228
	console.log("plateSlateCellApp processAddPortionForm portionName " + portionName + " portionNameUC " + portionNameUC + " portionIndex " + portionIndex);
	//alert("plateSlateCellApp processAddPortionForm portionName " + portionName + " portionNameUC " + portionNameUC + " portionIndex " + portionIndex + " CLOSED DIAL");
	$('#add-portion-dial-error').empty();
	if (portionIndex == -1) {
		// tjs 131228
		//var index = i++;
		var index = 0;
		portion = new Portion(index, optionValue, portionName, portionDescription, 0, 0);
		//portions[index] = portion;
		portions.push(portion);
		// use plate edit dialog...
		addToPortion(portion);
		//$('#add-portion-dial').dialog('close');
		// tjs 120403
		//$('.ui-dialog').dialog('close');
		// tjs 120403
	    $.mobile.changePage( $('#home-page'), { transition: 'fade'} );
	} else {
		var isError = true;
		var msg = "The portion with name " + portionName + " already Exists!";
		portion = portions[portionIndex];
		if (portion.isInactive > 0) {
			togglePortionInactive(false, portionIndex);
			//msg += "<br/>(The portion had been concealed but is now revealed and my be edited.)";
			msg += " (The portion had been concealed but is now revealed and my be edited.)";
			isError = false;
		}
		var warningOrError = isError? "Error: ": "Warning: ";
		warningOrError += msg;
		$('#add-portion-dial-error').text(warningOrError);
	}
	return;
	//return false;
}

function processEditPortionForm() {
	var portionName;
	var portionDescription;
	var typeSelection;
	var index = document.editPortionForm.index.value;
	portionName = document.editPortionForm.name.value;
	portionDescription = document.editPortionForm.description.value;
	typeSelection = document.editPortionForm.type;
	var optionValue = typeSelection.options[typeSelection.selectedIndex].value;
	//alert("plateSlateCellApp processEditPortionForm portionName " + portionName + " portionDescription " + portionDescription + " optionValue " + optionValue);
	
	var portion = portions[index];
	portion.name = portionName;
	portion.description = portionDescription;
	portion.type = optionValue;
	addToPortion(portion);
	//$('#edit-portion-dial').dialog('close');
	// tjs 120403
	//$('.ui-dialog').dialog('close');
	// tjs 120403
    $.mobile.changePage( $('#home-page'), { transition: 'fade'} );
}

function makeColor(hue) {
    return "hsl(" + hue + ", 100%, 50%)";
}

function makeRandomScreenReportColor() {
	var selectedOption = Math.floor(Math.random()*(screenReportFontColors.length - 1));
	//return "hsl(" + selectedOption + ", 100%, 50%)";
	return makeColor(selectedOption);
}

function getScreenReportHues(len) {
	var screenReportHues = new Array(len);
	var selectedIndex = Math.floor(Math.random()*(screenReportFontColors.length - 1));
	var selectedOption = screenReportFontColors[selectedIndex];
	//alert("plateSlateCellApp getScreenReportHues selectedOption " + selectedOption);
	for (var i = 0; i < len; i++) {
		//screenReportHues.push(selectedOption);
		screenReportHues[i] = selectedOption;
		selectedOption += 40;
	}
	//alert("plateSlateCellApp getScreenReportHues screenReportHues: [0] " + screenReportHues[0] + " [1] "+ screenReportHues[1] + " [2] " + screenReportHues[2]);
	return screenReportHues;
}

// relative to "today" what is the description approprite for identification of the slate?
function getRelativeSlateDescription(slate) {
	//alert("plateSlateCellApp getRelativeSlateDescription...");
	var relativeSlateDescription = null;
	var dayMillies = 24*60*60*1000;
		var today = new Date();
		today.setHours(0, 0, 0, 0);
		var todayMillis = today.getTime();
		//alert("plateSlateCellApp getRelativeSlateDescription todayMillis " + todayMillis);
		var date = slate.date;
		//alert("plateSlateCellApp getRelativeSlateDescription date " + date);
        var relativeDateName = date.toLocaleString();
    	//alert("plateslate getSlateView priorOffset " + priorOffset + " slate name " + slate.name + " id " + slate.id + " priorDate name " + priorDateName);
        relativeDate = new Date(relativeDateName);
        var relativeDateMillis = relativeDate.getTime();
		//alert("plateSlateCellApp getRelativeSlateDescription todayMillis " + todayMillis + " dateMillis "+ dateMillis);
		//alert("plateSlateCellApp getRelativeSlateDescription today " + today + " date "+ date + " todayMillis " + todayMillis + " dateMillis "+ dateMillis);
		if (todayMillis == relativeDateMillis) {
			relativeSlateDescription = "Today";			
		} else if (relativeDateMillis - todayMillis == dayMillies) {
			relativeSlateDescription = "Tomorrow"; // one day into future
		} else if (todayMillis - relativeDateMillis == dayMillies) {
			relativeSlateDescription = "Yesterday"; // one day in past
		} else if (relativeDateMillis - todayMillis > 0) {
			relativeSlateDescription = slate.description; // a future day, use dow
		} else {
			relativeSlateDescription = slate.name; // a past date, use actual month, day, year
		}
	//}
		//alert("plateSlateCellApp getRelativeSlateDescription relativeSlateDescription " + relativeSlateDescription);
	return relativeSlateDescription;			
}

// tjs 120202
function doClientBackup() {
	if (!authenticated)	{
		//alert("You must login before using this feature!");
		var paragraphs = new Array();
		paragraphs.push(requiresLoginLine1);
		paragraphs.push(requiresLoginLine2);
		hijaxAlertDial(requiresLoginTitle, paragraphs);
		return;
	}
	//alert("plateSlateCellApp doClientBackup starting...");
	var thresholdOffset = slateOffsetThreshold;
	var xml = getClientBackupXml(thresholdOffset);
	$.post("../exportIndexedDBxml2JSON.php", { xml: xml }, function(msg) {		
		console.log("doClientBackup result " + msg);
	    $.mobile.changePage( $('#home-page'), { transition: 'fade'} );
		// tjs 120403
		//$('.ui-dialog').dialog('close');
		finishLogout();
	});
}

/*
e.g. of data content (to be stored):
<tables memberId="xxxx">
<preferences>
	<preference type="" name="" isInactive="">
	(value)
	</preference>
	...
</preferences>
<portions>
	<portion type="" description="" isMaster="" isInactive="">
	(value i.e. the name)
	</portion>
</portions>
<plates>
	<plate name="" type="" description="" isMaster="" isInactive="">
		<portions>
			<portion type="">
			(value i.e. the name)
			</portion>
		</portions>
	</plate>
	...
</plates>
<slates>
	<slate name="August 27, 2011">
		<plate name="Flakes-n-Bakes" type="Breakfast" description="Cereal, Fruit, etc.">
			<portion type="Grain">Bran Flakes</portion>
			<portion type="Fruits">Grapes</portion>
			<portion type="Dairy">Milk</portion>
			<portion type="Grain">Muffins</portion>
		</plate>
		<plate name="PB Sandwich" type="Lunch" description="(with fruit)">
			<portion type="Grain">Irish Bread</portion>
			<portion type="Protein">Legeume Products</portion>
			<portion type="Fruits">Berries</portion>
			<portion type="Fruits">Apples</portion>
		</plate>
		<plate name="Ham Steak-w-RiceVeg" type="Dinner" description="">
			<portion type="Protein">Pork Products</portion>
			<portion type="Grain">Rice</portion>
			<portion type="Vegetables">Brussel Sprouts</portion>
		</plate>
	</slate>
	...
</slates>
</tables>
*/
//function getClientBackupXml(title, thresholdOffset) {
function getClientBackupXml(offset) {
	//alert("plateSlateCellApp getClientBackupXml offset " + offset);
	//alert("plateSlateCellApp getClientBackupXml offset " + offset + " accountId" + loginInfo.id);
	var xml = '<tables accountId="' + loginInfo.id + '" userName="' + loginInfo.userName + '" firstName="' + loginInfo.firstName + '" lastName="' + loginInfo.lastName + '">';
	// handle preferences...
	xml += '<preferences>';
	xml += '<preference type="user" name="share">';
	xml += plateSelectionShared;
	xml += '</preference>';
	xml += '</preferences>';
	//alert("plateSlateCellApp getClientBackupXml xml (preferences milestone) " + xml);

	// handle portions (i.e. morsels or segments on the USDA model plate)...
	xml += '<morsels>';
	xml += getMorselsXml();
	xml += '</morsels>';
	//alert("plateSlateCellApp getClientBackupXml xml (portions milestone) " + xml);

	// handle plates (more generally dishes)...
	xml += '<dishes>';
	xml += getDishesXml();
	xml += '</dishes>';
	//alert("plateSlateCellApp getClientBackupXml xml (plates milestone) " + xml);

	//use cache to create xml to be sent to server for the report.
	var cursor = offset;
	//var backwardsCursor = offset - 1;
	var slate;
	var count = 0;
	// just backup two weeks...
	var maxCount = 14;
	// TODO eliminate some attributes here:
	//xml += '<slates accountId="' + loginInfo.id + '" userName="' + loginInfo.userName + '" firstName="' + loginInfo.firstName + '" lastName="' + loginInfo.lastName + '" share="' + plateSelectionShared + '">';
	xml += '<slates>';
	while (count < maxCount) {
		//alert("plateslate getReportXml count " + count + " cursor " + cursor + " slate name " + slates[cursor].name);
		//alert("plateslate getReportXml forwards count " + count + " cursor " + cursor);
	    if (typeof(slates[cursor]) === 'undefined') {
	    	break;
	    } else {
	    	slate = slates[cursor++];
	    	count++;
	    	xml += getXml(slate);
			//alert("plateslate createReport next cursor " + cursor + " count " + count + " today onwards xml " + xml);
		}		
	}
	cursor = offset - 1;
	while (count < maxCount) {
		//alert("plateslate createReport count " + count + " cursor " + cursor + " slate name " + slates[cursor].name);
		//alert("plateslate createReport backwards count " + count + " cursor " + cursor);
	    if (typeof(slates[cursor]) === 'undefined') {
	    	break;
	    } else {
	    	slate = slates[cursor--];
	    	count++;
	    	xml += getXml(slate);
			//alert("plateslate createReport next cursor " + cursor + " count " + count + " today backwards xml " + xml);
		}		
	}
	
	xml += '</slates></tables>';
	//xml += '</tables>';
	return xml;	
}

function getMorselsXml() {
	//alert("plateslate getXml slate name " + slate.name + " id " + slate.id + " breakfast id " + slate.breakfastId);
	var xml = '';
	var portionsLen = portions.length;
	var portion;
	//alert("index getXml portionsLen " + portionsLen);
	for (var i = 0; i < portionsLen; i++) {
		//alert("plateslate getXml portion id " + portionId + " name " + portions[portionId].name + " type " + portions[portionId].type);
		//portion = portions[i];
		//xml += '<portion type="' + portion.type + '" description="' + portion.description + '" isMaster="' + portion.master + '" isInactive="' + portion.isInactive + '">' + portion.name + '</portion>';
		xml += getSegmentXml(i, true);
	}
	return xml;
}

// tjs 140113
//function getSegmentXml(portionId, torf) {
function getSegmentXml(portionIdOrIndex, torf) {
	var xml = '';
	if (torf) {	
		var portion = portions[portionIdOrIndex];
		if (portion != null) {
	    	xml = '<morsel type="' + portion.type + '" description="' + portion.description + '" isMaster="' + portion.master + '" isInactive="' + portion.isInactive + '">' + portion.name + '</morsel>';
		}	
	} else {
		if (typeof(getPortionById(portionIdOrIndex)) === 'undefined') {
			xml = '';
	    } else {
	    	var portion = getPortionById(portionIdOrIndex);
	    	xml = '<segment type="' + portion.type + '" description="' + portion.description + '" isMaster="' + portion.master + '" isInactive="' + portion.isInactive + '">' + portion.name + '</segment>';
	    }
	}
	/*
	if (typeof(getPortionById(portionId)) === 'undefined') {
		xml = '';
    } else {
    	var portion = getPortionById(portionId);
    	if (torf)
    		xml = '<morsel type="' + portion.type + '" description="' + portion.description + '" isMaster="' + portion.master + '" isInactive="' + portion.isInactive + '">' + portion.name + '</morsel>';
    	else
    		xml = '<segment type="' + portion.type + '" description="' + portion.description + '" isMaster="' + portion.master + '" isInactive="' + portion.isInactive + '">' + portion.name + '</segment>';
    }*/
	return xml;
}

function getDishesXml() {
	//alert("plateslate getXml slate name " + slate.name + " id " + slate.id + " breakfast id " + slate.breakfastId);
	var xml = '';
	var platesLen = plates.length;
	var plate;
	var portionId;
	//alert("index getXml portionsLen " + portionsLen);
	for (var i = 0; i < platesLen; i++) {
		//alert("plateslate getXml portion id " + portionId + " name " + portions[portionId].name + " type " + portions[portionId].type);
		if (typeof(plates[i]) === 'undefined') {
	    	continue;
	    } else {
			plate = plates[i];
			//xml += '<dish type="' + plate.type + '" name="' + plate.name + '" description="' + plate.description + '" isMaster="' + plate.master + '" isInactive="' + plate.isInactive + '">';
			xml += '<dish type="' + plate.type + '" name="' + plate.name + '" description="' + plate.description + '" isMaster="' + plate.master + '" isInactive="' + plate.isInactive + '"><segments>';
			portionId = plate.portion1;
			if (portionId != null)
				xml += getSegmentXml(portionId, false);
			portionId = plate.portion2;
			if (portionId != null)
				xml += getSegmentXml(portionId, false);
			portionId = plate.portion3;
			if (portionId != null)
				xml += getSegmentXml(portionId, false);
			portionId = plate.portion4;
			if (portionId != null)
				xml += getSegmentXml(portionId, false);
			portionId = plate.portion5;
			if (portionId != null)
				xml += getSegmentXml(portionId, false);
			portionId = plate.portion6;
			if (portionId != null)
				xml += getSegmentXml(portionId, false);
			portionId = plate.portion7;
			if (portionId != null)
				xml += getSegmentXml(portionId, false);
			portionId = plate.portion8;
			if (portionId != null)
				xml += getSegmentXml(portionId, false);
			portionId = plate.portion9;
			if (portionId != null)
				xml += getSegmentXml(portionId, false);
			//xml += '</dish>';
			xml += '</segments></dish>';
	    }
	}
	return xml;
}

function doRestoreFromBackup(accountId, profile) {
    //alert("plateslate doRestoreFromBackup accountId " + accountId);
	var url;
	//var url = '../plateslate/getServerDataAsXML.php?account=' + accountId;
	if (profile != null) {
		// tjs 130128
		//url = '../plateslate/getServerDataAsXMLbyProfile.php?account=' + accountId + '&profile=' + profile;
		url = '../getServerDataAsXMLbyProfile.php?account=' + accountId + '&profile=' + profile;
		importProfile = true;
	} else {
		//url = '../plateslate/getServerDataAsXML.php?account=' + accountId;
		url = '../getServerDataAsXML.php?account=' + accountId;
		importProfile = false;
	}
    $.ajax({  
        //type: "POST",  
      type: "GET",
      url: url,
      // tjs 140111
     //dataType: ($.browser.msie) ? "text" : "xml",
      success: function(data) {
          //alert("plateslate doRestoreFromBackup success...");
          var xml;
          if (typeof data == "string") {
            xml = new ActiveXObject("Microsoft.XMLDOM");
            xml.async = false;
            xml.loadXML(data);
          } else {
            xml = data;
          }

          // e.g. <preferences><preference type="user" name="share">true</preference></preferences>
			var preferences = new Array();
			//var sql;
			var preference;
			$(xml).find('preference').each(function() {
				var preference = $(this);
				var preferenceType = preference.attr('type');
				var preferenceName = preference.attr('name');
				var preferenceValue = preference.text();
		         //alert("plateslate doRestoreFromBackup preference type " + preferenceType + " preferenceName " + preferenceName + " preferenceValue " + preferenceValue);
			});
			// tjs 120402
			initClientData();
/*
			// delete all rows from all tables...
			systemDB.transaction(
					function(transaction) {
						transaction.executeSql(
						'DELETE from food', null,						
						function (transaction, result) {
							//alert("plateslate loadPlates result.rows.length " + result.rows.length);
						});
					});
			systemDB.transaction(
					function(transaction) {
						transaction.executeSql(
						'DELETE from slate', null,						
						function (transaction, result) {
							//alert("plateslate loadPlates result.rows.length " + result.rows.length);
						});
					});
			systemDB.transaction(
					function(transaction) {
						transaction.executeSql(
						'DELETE from plate', null,						
						function (transaction, result) {
							//alert("plateslate loadPlates result.rows.length " + result.rows.length);
						});
					});
			systemDB.transaction(
					function(transaction) {
						transaction.executeSql(
						'DELETE from portion', null,						
						function (transaction, result) {
							//alert("plateslate loadPlates result.rows.length " + result.rows.length);
						});
					});

			// tjs 120301
			// reset the tables' sequences...
			systemDB.transaction(
					function(transaction) {
						transaction.executeSql(
						"DELETE FROM sqlite_sequence WHERE name = 'food'", null,						
						function (transaction, result) {
							//alert("plateslate loadPlates result.rows.length " + result.rows.length);
						});
					});
			systemDB.transaction(
					function(transaction) {
						transaction.executeSql(
						"DELETE FROM sqlite_sequence WHERE name = 'slate'", null,						
						function (transaction, result) {
							//alert("plateslate loadPlates result.rows.length " + result.rows.length);
						});
					});
			systemDB.transaction(
					function(transaction) {
						transaction.executeSql(
						"DELETE FROM sqlite_sequence WHERE name = 'plate'", null,						
						function (transaction, result) {
							//alert("plateslate loadPlates result.rows.length " + result.rows.length);
						});
					});
			systemDB.transaction(
					function(transaction) {
						transaction.executeSql(
						"DELETE FROM sqlite_sequence WHERE name = 'portion'", null,						
						function (transaction, result) {
							//alert("plateslate loadPlates result.rows.length " + result.rows.length);
						});
					});

			// the cache arrays also need to be truncated...
			slates.length = 0;
			plates.length = 0;
			portions.length = 0;
*/			
			// now repopulate the portions
			var type;
			var description;
			var isMaster;
			var isInactive;
			var name;
			// e.g. <morsel type="Fruits" description="mango" isMaster="0" isInactive="0">mango</morsel>
			//var morsels = new Array();
			var morsel;
			var index = 0;
			$(xml).find('morsel').each(function() {
				var morsel = $(this);
				type = morsel.attr('type');
				description = morsel.attr('description');
				isMaster = morsel.attr('isMaster');
				isInactive = morsel.attr('isInactive');
				name = morsel.text();
				var portion = new Portion(index++, type, name, description, isMaster, isInactive);
				//morsels.push(portion);
				portions.push(portion);
		         //alert("plateslate doRestoreFromBackup preference type " + preferenceType + " preferenceName " + preferenceName + " preferenceValue " + preferenceValue);
			});
	         //alert("plateslate doRestoreFromBackup morsels length " + morsels.length);
	         //alert("plateslate doRestoreFromBackup portions length " + portions.length);
	         insertPortionMasterData(false, xml);
	         // here we have the database loaded with portions and the array cache is properly synchronized
	         //alert("plateslate doRestoreFromBackup portions synchronized length " + portions.length);
      },
      error: function(xmlReq, status, errorMsg) {
    	  var title = "Database Error";
	         //alert("plateslate doRestoreFromBackup status " + status + " errorMsg " + errorMsg);
	         var msg = "plateslate doRestoreFromBackup status " + status + " errorMsg " + errorMsg;
	         // e.g. msg = plateslate doRestoreFromBackup msg parsererror
	 		var paragraphs = new Array();
			paragraphs.push(msg);
			hijaxAlertDial(requiresLoginTitle, paragraphs);
     }
    });  
    return false;	
}

// tjs 120402
function initClientData() {
/*	
	// delete all rows from all tables...
	systemDB.transaction(
			function(transaction) {
				transaction.executeSql(
				'DELETE from food', null,						
				function (transaction, result) {
					//alert("plateslate loadPlates result.rows.length " + result.rows.length);
				});
			});
	systemDB.transaction(
			function(transaction) {
				transaction.executeSql(
				'DELETE from slate', null,						
				function (transaction, result) {
					//alert("plateslate loadPlates result.rows.length " + result.rows.length);
				});
			});
	systemDB.transaction(
			function(transaction) {
				transaction.executeSql(
				'DELETE from plate', null,						
				function (transaction, result) {
					//alert("plateslate loadPlates result.rows.length " + result.rows.length);
				});
			});
	systemDB.transaction(
			function(transaction) {
				transaction.executeSql(
				'DELETE from portion', null,						
				function (transaction, result) {
					//alert("plateslate loadPlates result.rows.length " + result.rows.length);
				});
			});

	// tjs 120301
	// reset the tables' sequences...
	systemDB.transaction(
			function(transaction) {
				transaction.executeSql(
				"DELETE FROM sqlite_sequence WHERE name = 'food'", null,						
				function (transaction, result) {
					//alert("plateslate loadPlates result.rows.length " + result.rows.length);
				});
			});
	systemDB.transaction(
			function(transaction) {
				transaction.executeSql(
				"DELETE FROM sqlite_sequence WHERE name = 'slate'", null,						
				function (transaction, result) {
					//alert("plateslate loadPlates result.rows.length " + result.rows.length);
				});
			});
	systemDB.transaction(
			function(transaction) {
				transaction.executeSql(
				"DELETE FROM sqlite_sequence WHERE name = 'plate'", null,						
				function (transaction, result) {
					//alert("plateslate loadPlates result.rows.length " + result.rows.length);
				});
			});
	systemDB.transaction(
			function(transaction) {
				transaction.executeSql(
				"DELETE FROM sqlite_sequence WHERE name = 'portion'", null,						
				function (transaction, result) {
					//alert("plateslate loadPlates result.rows.length " + result.rows.length);
				});
			});
*/
	// the cache arrays also need to be truncated...
	slates.length = 0;
	plates.length = 0;
	portions.length = 0;
}

// tjs 120229
function hijaxAlertDial(title, paragraphs) {
	// tjs 120403
	$('.ui-dialog').remove();

	var newDialHtml = '<div data-role="dialog" id="alert-dial" data-rel="dialog"><div data-role="header">';
	newDialHtml += '<h1>' + title + '</h1></div>';	
	newDialHtml += '<div data-role="content" data-theme="c">';
	for (var i = 0; i < paragraphs.length; i++) {
		newDialHtml += '<p>';
		newDialHtml += paragraphs[i];
		newDialHtml += '</p>';
	}
	newDialHtml += '<br/><br/>';
	//newDialHtml += '<a href="#home-page" data-role="button" data-inline="true" data-rel="back" data-theme="a">OK</a>';
	//newDialHtml += '<a href="javascript:changeToHomePage();" data-role="button" data-inline="true" data-rel="back" data-theme="a">OK</a>';
	newDialHtml += '<a href="#home-page" data-role="button" data-inline="true" data-theme="a">OK</a>';
	newDialHtml += '</div><script></script></div>';
	var newDial = $(newDialHtml);
	//add new dialog to page container
	newDial.appendTo($.mobile.pageContainer);
	
	// tweak the new dialog just added into the dom
	
	// enhance and open the new dialog
    $.mobile.changePage(newDial);
}
