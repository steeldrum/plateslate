/*		var key = null;
		//var debug = true;
		var debug = false;
		var x = location.search;
		//console.log ("search x " + x);
		var init = x.length > 0;
		//console.log ("init " + init);
 */

function deleteDB() {
	// Delete the database
	$.indexedDB("PlateSlateDB").deleteDatabase();
}

// tjs 131130
function closeDB() {
	// Close the database
	// $.indexedDB("PlateSlateDB").closeDatabase();
	$.indexedDB("PlateSlateDB").close();
}

// tjs 131212
// function downloadPortionsPlates() {
function downloadPortionsPlates(loginAccountNumber) {
	// tjs 131128
	console.log("downloadPortionsPlates loginAccountNumber "
			+ loginAccountNumber);
	// jQuery.getJSON( url [, data ] [, success( data, textStatus, jqXHR ) ] )
	// $.getJSON("portions.json", function(data) {
	var url = relativeAccountFileDirectory + new String(loginAccountNumber)
			+ '/' + "portions.json";
	console.log("downloadPortionsPlates getting portions json from url " + url);
	$.getJSON(url).done(function(data) {
		console.log("downloadPortionsPlates geting portions json done.");
		$.indexedDB("PlateSlateDB").transaction("portions").then(function() {
			console.log("Transaction completed, all portions data inserted");
			// downloadplates();
			downloadplates(loginAccountNumber);
		}, function(err, e) {
			console.log("Transaction NOT completed", err, e);
		}, function(transaction) {
			console.log("downloadPortionsPlates clearing portions...");
			var portions = transaction.objectStore("portions");
			portions.clear();
			// $.getJSON("portions.json", function(data) {
			// var url = relativeAccountFileDirectory + new
			// String(loginAccountNumber) + '/' + "portions.json";
			console.log("downloadPortionsPlates processing each portion...");
			// $.getJSON(url, function(data) {
			// $.getJSON(url).done(function( data ) {
			$.each(data, function(i) {
				console.log("downloadPortionsPlates adding a portion");
				// _(portions.add(this));
				_(portions.add(this));
			});
			// }).done(function() {
			// });
		});
		// $.each(data, function(i) {
		// console.log("downloadPortionsPlates adding a portion");
		// _(portions.add(this));
		// _(portions.add(this));
		// });
		// }).done(function() {
	}).fail(function(jqxhr, textStatus, error) {
		// console.log( "error in download of plates!" );
		var err = textStatus + ", " + error;
		console.log("Portions Request Failed: " + err);
	}).always(function() {
		console.log("completed download of portions logic");
	});
}

// Download a portions from the server and save it to the DB
function downloadportions() {
	// tjs 131128
	console.log("downloadportions loginAccountNumber " + loginAccountNumber);
	// jQuery.getJSON( url [, data ] [, success( data, textStatus, jqXHR ) ] )
	// $.getJSON("portions.json", function(data) {
	var url = relativeAccountFileDirectory + new String(loginAccountNumber)
			+ '/' + "portions.json";
	console.log("downloadportions plates url " + url);
	$.getJSON(url, function(data) {
		// $.getJSON("http://localhost/SandBox/indexedDB/portions.json",
		// function(data){
		// tjs 131128
		console.log("downloadportions getting json");
		$.indexedDB("PlateSlateDB").transaction("portions").then(function() {
			console.log("Transaction completed, all data inserted");
			// console.log("Transaction completed, all data inserted");
			// tjs 131209
			// loadFromDBAfterLoadSelectOptions("portions");
		}, function(err, e) {
			console.log("Transaction NOT completed", err, e);
		}, function(transaction) {
			var portions = transaction.objectStore("portions");
			portions.clear();
			$.each(data, function(i) {
				// _(portions.add(this));
				_(portions.add(this));
			});
		});
	});
}

// Download a plates from the server and save it to the DB
// tjs 131212
// function downloadplates() {
function downloadplates(loginAccountNumber) {
	// tjs 131128
	console.log("downloadplates");
	// jQuery.getJSON( url [, data ] [, success( data, textStatus, jqXHR ) ] )
	var url = relativeAccountFileDirectory + new String(loginAccountNumber)
			+ '/' + "plates.json";
	// $.getJSON("plates.json", function(data) {
	console.log("downloadplates getting plates json from url " + url);
	$.getJSON(url).done(function(data) {
		// $.getJSON(url, function(data) {
		// $.getJSON("http://localhost/SandBox/indexedDB/portions.json",
		// function(data){
		// tjs 131128
		// console.log("downloadplates getting json");
		console.log("downloadplates getting plates...");
		$.indexedDB("PlateSlateDB").transaction("plates").then(function() {
			console.log("Transaction completed, all plates data inserted");
			// tjs 140102
			if (loginAccountNumber > 0) {
				// tjs 131218
				clearSlates();
			}
			/*
			 * if (isProduction) { console.log("downloadplates loading from
			 * inedexDB!"); // tjs 131212 loadIndexDB(); }
			 */
		}, function(err, e) {
			console.log("Transaction NOT completed", err, e);
		}, function(transaction) {
			console.log("downloadplates clearing plates...");
			var plates = transaction.objectStore("plates");
			plates.clear();
			console.log("downloadplates processing each plate...");
			$.each(data, function(i) {
				// _(portions.add(this));
				_(plates.add(this));
				// });
			}); /*
				 * .done(function() { if (isProduction) {
				 * console.log("downloadplates loading from inedexDB!");
				 * loadIndexDB(); } });
				 */
		});
		/*
		 * .fail(function( jqxhr, textStatus, error ) { var err = textStatus + ", " +
		 * error; console.log( "Request Failed: " + err ); });
		 */
	}).fail(function(jqxhr, textStatus, error) {
		// console.log( "error in download of plates!" );
		var err = textStatus + ", " + error;
		console.log("Plates Request Failed: " + err);
	}).always(function() {
		console.log("completed download of plates logic");
	});
}

function clearSlates() {
	console.log("clearSlates");
	$.indexedDB("PlateSlateDB").transaction("slates").then(function() {
		console.log("Transaction completed, all slates data removed");
		if (isProduction) {
			console.log("clearSlates loading from inedexDB!");
			// tjs 131212
			loadIndexDB();
		}
	}, function(err, e) {
		console.log("Transaction NOT completed", err, e);
	}, function(transaction) {
		console.log("clearSlates clearing slates...");
		var slates = transaction.objectStore("slates");
		slates.clear();
	});
}

// tjs 131202
// Download a slates from the server and save it to the DB
function downloadslates() {
	// console.log("downloadslates");
	// this file acts as a template - never differs based on account
	var url = relativeAccountFileDirectory + '0/' + "slates.json";
	$.getJSON(url, function(data) {
		// $.getJSON("slates.json", function(data) {
		// console.log("downloadslates getting json");
		// $.indexedDB("PlateSlateDB").transaction(["slates"],
		// $.indexedDB.IDBTransaction.READ_WRITE).then(function(){
		$.indexedDB("PlateSlateDB").transaction("slates").then(function() {
			// console.log("Transaction completed, all data inserted");
			// console.log("downloadslates Transaction completed, all data
			// inserted");
			loadFromDBAfterLoadSelectOptions("slates");
			// console.log("downloadslates slates loaded from DB...");
			// assignSlateSelections();
		}, function(err, e) {
			console.log("Transaction NOT completed", err, e);
		}, function(transaction) {
			var slates = transaction.objectStore("slates");
			// slates.clear();
			$.each(data, function(i) {
				// _(slates.add(this));
				// console.log("downloadslates i " + i);
				var d = new Date();
				this.time = d.getTime();
				this.description = d.toDateString();
				var year = d.getFullYear();
				var month = d.getMonth() + 1;
				var day = d.getDate();
				// var name = new String(year) + month < 10? "0": "" + new
				// String(month) + day < 10? "0" : "" + new String(day);
				var name = new String(year);
				if (month < 10) {
					name = name.concat("0");
				}
				name = name.concat(new String(month));
				if (day < 10) {
					name = name.concat("0");
				}
				name = name.concat(new String(day));
				// console.log("downloadslates year " + year + " month " + month
				// + " day " + day + " name " + name);
				// e.g. downloadslates year 2013 month 11 day 2 name 20131202
				this.name = name;
				_(slates.add(this));
				// _(slates.add(this).then(function(val) {
				// var id = val;
				// console.log("downloadslates id " + id);
				// e.g. 1
				// }));
				// });
			}); // end each
		}); // end transaction
	}); // end getJSON
}

function loadFromDB(table, portionSelectionHtml, plateSelectionHtml) {
	emptyTable(table);
	// tjs 131203
	// _($.indexedDB("PlateSlateDB").objectStore(table).each(function(elem){
	// addRowInHTMLTable(table, elem.key, elem.value);
	// }));
	$.indexedDB("PlateSlateDB").objectStore(table).each(
			function(elem) {
				// addRowInHTMLTable(table, elem.key, elem.value);
				addRowInHTMLTable(table, elem.key, elem.value,
						portionSelectionHtml, plateSelectionHtml);
				// }).then(assignSelections(table));
			}); // .done(assignSelections(table));
	// tjs 131129
	// console.log("loadFromDB table " + table);
}

// tjs 131205
function loadObjectsFromIndexDB() {
	var table = 'portions';
	var id;
	var itemId;
	var type;
	var name;
	var description;
	var master;
	var isMaster;
	var isInactive;
	var platePortions;
	// var index = 0;
	var portionIndex = 1;
	console.log("loadObjectsFromIndexDB table " + table);
	// tjs 131210
	// $.indexedDB("PlateSlateDB").objectStore(table).each(
	$.indexedDB("PlateSlateDB")
			.objectStore(table, false)
			.each(
					function(elem) {

						// addRowInHTMLTable(table, elem.key, elem.value);
						// addRowInHTMLTable(table, elem.key, elem.value,
						// portionSelectionHtml, plateSelectionHtml);
						id = elem.key;
						type = elem.value.type;
						name = elem.value.name;
						description = elem.value.description;
						master = parseInt(elem.value.master);
						isInactive = parseInt(elem.value.isInactive);
						console.log("loadObjectsFromIndexDB id " + id
								+ " type " + type + " name " + name);
						var portion = new Portion(id, type, name, description,
								master, isInactive);
						// e.g. 48 test portions
						// alert("plateslate loadPortions for id " + id + " have
						// portion name " + portion.name);
						// tjs 131218
						// portions[id] = portion;
						portions[portionIndex++] = portion;

						// }).then(assignSelections(table));
					})
			.done(
					function() {
						table = 'plates';
						var platePortion;
						var portion1 = null;
						var portion2 = null;
						var portion3 = null;
						var portion4 = null;
						var portion5 = null;
						var portion6 = null;
						var portion7 = null;
						var portion8 = null;
						var portion9 = null;
						var portionId;

						$.indexedDB("PlateSlateDB")
								.objectStore(table)
								.each(
										function(elem) {

											// addRowInHTMLTable(table,
											// elem.key, elem.value);
											// addRowInHTMLTable(table,
											// elem.key, elem.value,
											// portionSelectionHtml,
											// plateSelectionHtml);
											id = elem.key;
											itemId = elem.value.itemId;
											type = elem.value.type;
											name = elem.value.name;
											description = elem.value.description;
											master = parseInt(elem.value.master);
											isInactive = parseInt(elem.value.isInactive);
											portion1 = null;
											portion2 = null;
											portion3 = null;
											portion4 = null;
											portion5 = null;
											portion6 = null;
											portion7 = null;
											portion8 = null;
											portion9 = null;
											platePortions = elem.value.portions;
											for ( var i = 0, len = platePortions.length; i < len; i++) {
// tjs 140109
												//platePortion = platePortions[i];
												//portionId = platePortion.itemId;
												portionId = platePortions[i];
												switch (i) {
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
											}
											// tjs 131220
											// var plate = new Plate(index++,
											var plate = new Plate(itemId, type,
													name, description,
													isMaster, portion1,
													portion2, portion3,
													portion4, portion5,
													portion6, portion7,
													portion8, portion9,
													isInactive);
											plates.push(plate);

											// }).then(assignSelections(table));
											// tjs 131231
										//});
										}).done(function() {
											/*
											 * 
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
											table = 'slates';
											var offsetInDB;
											var date;
											var time;
											var breakfastId;
											var lunchId;
											var dinnerId;
											var breakfastPortions;
											var lunchPortions;
											var dinnerPortions;
											// tjs 140101
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
											var today = new Date();
											today.setHours(0, 0, 0, 0);
											var todayName = today.toLocaleDateString();
											var offset = slateOffsetThreshold;
											var weekdayName = weekday[today.getDay()];
											var markIndex = -1;
											var index = 0;
											var tempSlates = new Array();
											var tempSlatesLen = 0;
											var resultsLen = 0;
											var tempSlate;
											var currentSlate;
											// needed to ensure no duplicates are listed in the slates
											var lastSlateName = null;

											$.indexedDB("PlateSlateDB")
											.objectStore(table).index("time")
											.each(
													function(elem) {

														// addRowInHTMLTable(table,
														// elem.key, elem.value);
														// addRowInHTMLTable(table,
														// elem.key, elem.value,
														// portionSelectionHtml,
														// plateSelectionHtml);
														id = elem.key;
														itemId = elem.value.itemId;
														offsetInDB = elem.value.offset;
														date = elem.value.date;
														time = elem.value.time;
														name = elem.value.name;
														description = elem.value.description;
														breakfastId = parseInt(elem.value.breakfastId);
														lunchId = parseInt(elem.value.lunchId);
														dinnerId = parseInt(elem.value.dinnerId);
														breakfastPortions = elem.value.breakfastPortions;
														lunchPortions = elem.value.lunchPortions;
														dinnerPortions = elem.value.dinnerPortions;
														isInactive = parseInt(elem.value.isInactive);
														if (name == todayName) {
															markIndex = index;
														}
														//i++;
														console.log("slate id " + id + " itemId " + itemId + " offset " + offset + " name " + name);
														//function Slate(id, offset, date, name, description, breakfastId, lunchId, dinnerId, breakfastPortions, lunchPortions, dinnerPortions, isInactive) {
														//var slate = new Slate(itemId, offsetInDB, date,
														var slate = new Slate(itemId, 0, date,
																name, description,
																breakfastId, lunchId,
																dinnerId, breakfastPortions.slice(0),
																lunchPortions.slice(0), dinnerPortions.slice(0),
																				isInactive);
														//slates.push(slate);
														//slates[offset] = slate;
														//tempSlates[index++] = new Slate(id, 0, date, name, description, breakfastId, lunchId, dinnerId, null, null, null, isInactive);
														tempSlates[index++] =  slate;
														//viewSlate("LOADSLATES SLATE", slate);
														//alert("plateslate loadSlates slate name " + slate.name + " slate id " + slate.id + " breakfastId " + slate.breakfastId + " lunchId " + slate.lunchId + " dinnerId " + slate.dinnerId + " name " + name + " todayName " + todayName);
														//alert("plateslate loadSlates for id " + id + " have slate name " + slate.name + " breakfastId " + breakfastId + " lunchId " + lunchId + " dinnerId " + dinnerId + " tempIndex " + index + " markIndex " + markIndex);
														var tempIndex = index - 1;

													}).done(function() {
														//console.log("slates length " + slates.length);
														console.log("temp slates length " + tempSlates.length + " markIndex " + markIndex);
														tempSlatesLen = tempSlates.length;
														//alert("plateslate loadSlates result len " + result.rows.length + " tempSlatesLen " + tempSlatesLen + " markIndex " + markIndex);
														// tjs 140110
														if (tempSlatesLen > 0) {
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
																//appendFood(loadSlatesCallback, 0, 100, slate);
																//alert("plateslate loadSlates from marked index backwards for i " + i + " have slate name " + slate.name + " offset " + offset);
																console.log("indexDBmodel loadObjectsFromIndexDB from marked index backwards for i " + i + " have slate name " + slate.name + " offset " + offset);
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
																	//appendFood(loadSlatesCallback, 0, 100, slate);
																	//alert("plateslate loadSlates from marked index forewards for i " + i + " have slate name " + slate.name + " offset " + offset);
																	console.log("indexDBmodel loadObjectsFromIndexDB from marked index forewards for i " + i + " have slate name " + slate.name + " offset " + offset);
																	offset++;
																}
															}
															//appendFood(loadSlatesCallback, 0, 1, currentSlate);
															//viewSlate("CURRENTSLATE", currentSlate);
															//alert("plateslate loadSlates currentSlate id " + currentSlate.id + " have slate name " + currentSlate.name + " breakfastPortions len " + currentSlate.breakfastPortions.length);
														} 
														else {
															//today's date not entered yet (i.e. markIndex remained -1)
															//var weekdayName = weekday[today.getDay()];
															offset = slateOffsetThreshold;
															breakfastPlate = getRandomPlate("Breakfast", offset);
															lunchPlate = getRandomPlate("Lunch", offset);
															dinnerPlate = getRandomPlate("Dinner", offset);
															breakfastPortions = getPlatePortions(breakfastPlate);
															lunchPortions = getPlatePortions(lunchPlate);
															dinnerPortions = getPlatePortions(dinnerPlate);    		

															//slate = new Slate(0, offset, today, today.toLocaleDateString(), weekdayName, breakfastPlate.id, lunchPlate.id, dinnerPlate.id, breakfastPortions, lunchPortions, dinnerPortions, 0);
															slate = new Slate(0, offset, today, today.toLocaleDateString(), weekdayName, breakfastPlate.id, lunchPlate.id, dinnerPlate.id, breakfastPortions.slice(0), lunchPortions.slice(0), dinnerPortions.slice(0), 0);
															// tjs 140109 TODO need to insert row into slates indexedDB
															modifySlates(slate);
															// DEBUG
															//viewSlate("NO MARKINDEX", slate);
															//alert("plateslate loadSlates today's new slate markIndex -1 " + slate.name);
															//TODO embed assignment in append...
															//appendSlate(loadSlatesCallback, slate, offset);
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
																	//appendFood(loadSlatesCallback, 0, 100, slate);
																	console.log("indexDBmodel loadObjectsFromIndexDB (no markIndex) from today backwards for i " + i + " have slate name " + slate.name + " offset " + offset);
																	//alert("plateslate loadSlates (no markIndex) from today backwards for i " + i + " have slate name " + slate.name + " offset " + offset);
																	offset--;
																}
															}					
														}
														}
														else {
															//today's date not entered yet and indeed no slates were ever entered...
															offset = slateOffsetThreshold;
															breakfastPlate = getRandomPlate("Breakfast", offset);
															lunchPlate = getRandomPlate("Lunch", offset);
															dinnerPlate = getRandomPlate("Dinner", offset);
															breakfastPortions = getPlatePortions(breakfastPlate);
															lunchPortions = getPlatePortions(lunchPlate);
															dinnerPortions = getPlatePortions(dinnerPlate);    		
															slate = new Slate(0, offset, today, today.toLocaleDateString(), weekdayName, breakfastPlate.id, lunchPlate.id, dinnerPlate.id, breakfastPortions.slice(0), lunchPortions.slice(0), dinnerPortions.slice(0), 0);
															//slate.offset = offset;
															slates[offset] = slate;
															// DEBUG
															//viewSlate("NO SLATES", slate);
															//alert("plateslate loadSlates today's new slate markIndex -1 " + slate.name);
															//TODO embed assignment in append...
															//appendSlate(loadSlatesCallback, slate, offset);
															modifySlates(slate);
															//alert("plateslate loadSlates today's new slate id " + slate.id);
															//alert("plateslate loadSlates (no markIndex) for today have slate name " + slate.name + " offset " + offset);
														} // end if not entered or entered
														//isSlateDataInserted = true;
														// e.g. 1
														//alert("plateslate loadSlates isSlateDataInserted " + isSlateDataInserted + " slates len " + slates.length);
													}); 
													/*
													else {
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
*/
													//});											
/*
											$.indexedDB("PlateSlateDB")
											.objectStore(table)
											.each(
													function(elem) {

														// addRowInHTMLTable(table,
														// elem.key, elem.value);
														// addRowInHTMLTable(table,
														// elem.key, elem.value,
														// portionSelectionHtml,
														// plateSelectionHtml);
														id = elem.key;
														itemId = elem.value.itemId;
														offset = elem.value.offset;
														date = elem.value.date;
														time = elem.value.time;
														name = elem.value.name;
														description = elem.value.description;
														breakfastId = parseInt(elem.value.breakfastId);
														lunchId = parseInt(elem.value.lunchId);
														dinnerId = parseInt(elem.value.dinnerId);
														breakfastPortions = elem.value.breakfastPortions;
														lunchPortions = elem.value.lunchPortions;
														dinnerPortions = elem.value.dinnerPortions;
														isInactive = parseInt(elem.value.isInactive);
														console.log("slate id " + id + " itemId " + itemId + " offset " + offset + " name " + name);
														//function Slate(id, offset, date, name, description, breakfastId, lunchId, dinnerId, breakfastPortions, lunchPortions, dinnerPortions, isInactive) {
														var slate = new Slate(itemId, offset, date,
																name, description,
																breakfastId, lunchId,
																dinnerId, breakfastPortions.slice(0),
																lunchPortions.slice(0), dinnerPortions.slice(0),
																				isInactive);
														//slates.push(slate);
														slates[offset] = slate;

													}).done(function() {
														console.log("slates length " + slates.length);														
													});	*/										
										});
					});
}

function appendToDB(table) {
	// emptyTable(table);
	// _($.indexedDB("PlateSlateDB").objectStore(table).each(function(elem){
	// addRowInHTMLTable(table, elem.key, elem.value);
	// }));
	// tjs 131202
	// console.log("appendToDB table " + table);
	/*
	 * id, offset, date, time, name, description, breakfastPlate, lunchPlate,
	 * dinnerPlate
	 */
	downloadslates();
}

// Sort a table based on an index that is setup
function sort(table, key) {
	emptyTable(table);
	_($.indexedDB("PlateSlateDB").objectStore(table).index(key).each(
			function(elem) {
				addRowInHTMLTable(table, elem.key, elem.value);
			}));
}

function emptyDB(table) {
	_($.indexedDB("PlateSlateDB").objectStore(table).clear());
}

/*
 * e.g. book["modified" + Math.random()] = true;
 * $.indexedDB("BookShop1").objectStore("BookList").put(book, new
 * Date().getTime()).then(console.info, console.error);
 */
// tjs 131213
function modifyPortions(portion) {
	var itemId = portion.id;
	console.log("Find item " + itemId + " in portions");
	// tjs 131228
	if (itemId > 0) {
		$.indexedDB("PlateSlateDB").objectStore("portions").get(itemId).then(
				function(item) {
					console.log("Found item in portions named: " + item.name);
					item.name = portion.name;
					item.description = portion.description;
					item.type = portion.type;
					$.indexedDB("PlateSlateDB").objectStore("portions").put(
							item).then(function() {
						console.info("Updated id " + itemId);
					}, function() {
						console.error("failed to update id " + itemId);
					});
				}, function(err, e) {
					appendPortionToDB(portion);
					/*
					 * console.log("Could not get item from portions"); // find
					 * the last itemId... // console.info(cursor.value,
					 * cursor.key); //
					 * $.indexedDB("PlateSlateDB").objectStore("portions").index("itemId").eachKey(console.info, //
					 * [200, 500]); var id = -1;
					 * $.indexedDB("PlateSlateDB").objectStore("portions").index(
					 * "itemId").eachKey(function(elem) { id = elem.key; });
					 * console.log("Add to portions with next id " + id); if (id >=
					 * 0) { portion.itemId = ++id; console.log("Adding item " +
					 * portion.itemId + " to portions");
					 * $.indexedDB("PlateSlateDB").objectStore("portions", true)
					 * .add(portion).then(function(val) { // portion.id = val;
					 * console.info(val); }, console.error); }
					 */
				});
	} else {
		appendPortionToDB(portion);
	}
}

// tjs 131228
function appendPortionToDB(portion) {
	console.log("Could not get item from portions");
	// find the last itemId...
	// console.info(cursor.value, cursor.key);
	// $.indexedDB("PlateSlateDB").objectStore("portions").index("itemId").eachKey(console.info,
	// [200, 500]);
	var id = -1;
	$.indexedDB("PlateSlateDB").objectStore("portions").index("itemId")
			.eachKey(function(elem) {
				id = elem.key;
			}).done(
					function() {
						console.log("Add to portions with next id " + id);
						if (id >= 0) {
							portion.itemId = ++id;
							console.log("Adding item " + portion.itemId
									+ " to portions");
							$.indexedDB("PlateSlateDB").objectStore("portions",
									true).add(portion).then(function(val) {
								// portion.id = val;
								console.info(val);
							}, console.error);
						}
					});
	/*
	 * console.log("Add to portions with next id " + id); if (id >= 0) {
	 * portion.itemId = ++id; console.log("Adding item " + portion.itemId + " to
	 * portions"); $.indexedDB("PlateSlateDB").objectStore("portions", true)
	 * .add(portion).then(function(val) { // portion.id = val;
	 * console.info(val); }, console.error); }
	 */
}

// tjs 131213
function PlateInDB(itemId, type, name, description, master, portions,
		isInactive) {
	this.itemId = itemId;
	this.type = type;
	this.name = name;
	this.description = description;
	this.master = master;
	this.portions = portions;
	this.isInactive = isInactive;
}

// tjs 140123
//function modifyPlates(plate, portions, index) {
// tjs 140125 revert
function modifyPlates(plate, portions) {
	var name = plate.name;
	console.log("Find item named " + name + " in plates first portion "
			+ plate.portion1);
	var foundRow = false;
	var description = plate.description;
	var type = plate.type;
	var platePortions = derivePlatePortions(plate, portions);
	console.log("platePortions length " + platePortions.length);

	$.indexedDB("PlateSlateDB").objectStore("plates").each(function(elem) {
		if (elem.value && elem.value.name == name) {
			foundRow = true;
			console.info("Updating", elem.value);
			elem.value["modifiedCursor-" + Math.random()] = true;
			elem.value["description"] = description;
			elem.value["type"] = type;
			// allow for empty array
			///if (platePortions.length > 0) {
				elem.value["portions"] = platePortions;
			//}
			elem.update(elem.value);
		}
	}).done(
			function() {
				if (!foundRow) {
					console.log("Could not get named item from plates");
					// find the last itemId...
					// console.info(cursor.value, cursor.key);
					// $.indexedDB("PlateSlateDB").objectStore("portions").index("itemId").eachKey(console.info,
					// [200, 500]);
					var id = -1;
					// tjs 140123
					var maxId = id;
					$.indexedDB("PlateSlateDB").objectStore("plates").each(function(elem) {
						id = elem.value.itemId;
						maxId = Math.max(id, maxId);
					}).done(function() {
						// console.log("Add to plates with next id " + id);
						if (maxId >= 0) {
							// var platePortions = derivePlatePortions(plate,
							// portions);
							maxId++;
							var plateInDB = new PlateInDB(maxId, type, name,
									description, plate.isMaster, platePortions,
									plate.isInactive);
							// plate.itemId = ++id;
							console.log("Adding item named " + plateInDB.name
									+ " to plates");
							$.indexedDB("PlateSlateDB").objectStore("plates", true)
									.add(plateInDB).then(function(val) {
										// portion.id = val;
										//console.info(val);
										plate.id = maxId;
										console.log("Added new id " + plate.id
												+ " to plates");
										// tjs 140125
										//if (index != null && index > 0) {
										//	editPlate(index);
										//}
									}, console.error);
						}
					});
				}
			});
}

function derivePlatePortions(plate, portions) {
	platePortions = new Array();
	var portion;
	if (plate.portion1 != null) {
		portion = findPortionObjectFromCacheArray(plate.portion1, portions);
		if (portion != null) {
			platePortions.push(portion);
		}
	}
	if (plate.portion2 != null) {
		portion = findPortionObjectFromCacheArray(plate.portion2, portions);
		if (portion != null) {
			platePortions.push(portion);
		}
	}
	if (plate.portion3 != null) {
		portion = findPortionObjectFromCacheArray(plate.portion3, portions);
		if (portion != null) {
			platePortions.push(portion);
		}
	}
	if (plate.portion4 != null) {
		portion = findPortionObjectFromCacheArray(plate.portion4, portions);
		if (portion != null) {
			platePortions.push(portion);
		}
	}
	if (plate.portion5 != null) {
		portion = findPortionObjectFromCacheArray(plate.portion5, portions);
		if (portion != null) {
			platePortions.push(portion);
		}
	}
	if (plate.portion6 != null) {
		portion = findPortionObjectFromCacheArray(plate.portion6, portions);
		if (portion != null) {
			platePortions.push(portion);
		}
	}
	if (plate.portion7 != null) {
		portion = findPortionObjectFromCacheArray(plate.portion7, portions);
		if (portion != null) {
			platePortions.push(portion);
		}
	}
	if (plate.portion8 != null) {
		portion = findPortionObjectFromCacheArray(plate.portion8, portions);
		if (portion != null) {
			platePortions.push(portion);
		}
	}
	if (plate.portion9 != null) {
		portion = findPortionObjectFromCacheArray(plate.portion9, portions);
		if (portion != null) {
			platePortions.push(portion);
		}
	}
	return platePortions;
}

function findPortionObjectFromCacheArray(portionItemId, portions) {
	// tjs 131218
	//return getPortionById(portionItemId);
	// tjs 140111
	return getPortionById(portionItemId).id;
	/*
	 * var portion = null; for (i = 0; i < portions.length; i++) { if
	 * (portions[i] != null) { if (portions[i].id == portionItemId) { portion =
	 * portions[i]; console.log("plate has portion named " + portion.name);
	 * return portion; } } } return null;
	 */
}

// tjs 131214
// function SlateInDB(id, offset, date, name, description, breakfastId, lunchId,
// dinnerId, isInactive) {
function SlateInDB(id, offset, date, time, name, description, breakfastId,
		lunchId, dinnerId, isInactive) {
	this.itemId = id;
	this.offset = offset;
	this.date = date;
	// this.time = Date.parse(date);
	this.time = time;
	this.name = name;
	this.description = description;
	this.breakfastId = breakfastId;
	this.lunchId = lunchId;
	this.dinnerId = dinnerId;
	this.breakfastPortions = new Array();
	this.lunchPortions = new Array();
	this.dinnerPortions = new Array();
	this.isInactive = isInactive;
}

function modifySlates(slate) {
	var itemId = slate.id;
	console.log("Find item " + itemId + " in slates");
	var name = slate.name;
	console.log("modifySlates Find item named " + name + " in slates");
	var foundRow = false;
	var description = slate.description;
	var maxId;
	// var type = slate.type;
	// var breakfastId = slate.breakfastId;
	// var lunchId = slate.lunchId;
	// var dinnerId = slate.dinnerId;
	// var platePortions = derivePlatePortions(plate, portions);
	// console.log("platePortions length " + platePortions.length);
	// var id = -1;

	$
			.indexedDB("PlateSlateDB")
			.objectStore("slates")
			.each(
					function(elem) {
						if (elem.value && elem.value.name == name) {
							foundRow = true;
							console.info("Updating", elem.value);
							elem.value["modifiedCursor-" + Math.random()] = true;
							elem.value["description"] = description;
							// elem.value["type"] = type;
							// elem.value["itemId"] = itemId;
							elem.value["offset"] = slate.offset;
							elem.value["date"] = slate.date;
							elem.value["time"] = slate.time;
							console.log("Slate update breakfastId "
									+ slate.breakfastId + " lunchId "
									+ slate.lunchId + " dinnerId "
									+ slate.dinnerId);
							elem.value["breakfastId"] = slate.breakfastId;
							elem.value["lunchId"] = slate.lunchId;
							elem.value["dinnerId"] = slate.dinnerId;
							// tjs 131218
							elem.value["breakfastPortions"] = slate.breakfastPortions
									.slice(0);
							elem.value["lunchPortions"] = slate.lunchPortions
									.slice(0);
							elem.value["dinnerPortions"] = slate.dinnerPortions
									.slice(0);
							// elem.value["portions"] = platePortions;
							elem.update(elem.value);
							// tjs 140123
							if (slate.id == 0) {
								slate.id = elem.value.itemId;
							}
						}
					})
			.done(
					function() {
						if (!foundRow) {
							console.log("Could not get named item from slates");
							// find the last itemId...
							// console.info(cursor.value, cursor.key);
							// $.indexedDB("PlateSlateDB").objectStore("portions").index("itemId").eachKey(console.info,
							// [200, 500]);
							var id = -1;
							$
									.indexedDB("PlateSlateDB")
									.objectStore("slates")
									//.index(
									//"name")
									.each(
											function(elem) {
												// id = elem.key;
												// id = elem.itemId;
												if (elem.value) {
													id = elem.value.itemId;
												}
												console
														.log("slates name index item id "
																+ id);
												// id = elem.itemId;
											})
									.done(
																function() {
												console
														.log("slates name index next id "
																+ id);
												if (id == null || id == -1) {
													id = -1;
													maxId = id;
													// id =
													// loginAccountNumber*10000
													// + 1;
													$
															.indexedDB(
																	"PlateSlateDB")
															.objectStore(
																	"plates")
															//.index("itemId").openCursor()
															//.index("itemId")
															//.eachKey(
															.each(
																	function(
																			elem) {
																		// console.log("plates
																		// itemId
																		// index
																		// next
																		// key "
																		// +
																		// elem.key);
																		// tjs 140121
																		//if (id == -1) {
																		//	id = elem.key;
																		//}
																		if (elem.value) {
																			id = elem.value.itemId;
																			maxId = Math.max(maxId, id);
																		}
																	})
															.done(
																	function() {
																		id = ++maxId;
																		console
																				.log("plates itemId index next id from plates "
																						+ id);																					
																		addSlate(
																				slate,
																				id);
																	});
												} else {
													addSlate(slate, ++id);
												}
											});
						}
					});
}

function addSlate(slate, id) {
	// console.log("Add to plates with next id " + id);
	if (id >= 0) {
		// var itemId = slate.id;
		// console.log("Find item " + itemId + " in slates");
		var name = slate.name;
		console.log("Add item named " + name + " in slates");
		var description = slate.description;
		// var platePortions = derivePlatePortions(plate, portions);
		var date = slate.date;
		var time = Date.parse(date);
		var slateInDB = new SlateInDB(id, slate.offset, date, time, name,
				description, slate.breakfastId, slate.lunchId, slate.dinnerId,
				slate.isInactive);
		// var slateInDB = new SlateInDB(id, slate.offset, date, time, name,
		// description, slate.breakfastId, slate.lunchId, slate.dinnerId,
		// breakfastPortions, lunchPortions, dinnerPortions, slate.isInactive);
		// tjs 131218
		slateInDB.breakfastPortions = slate.breakfastPortions.slice(0);
		slateInDB.lunchPortions = slate.lunchPortions.slice(0);
		slateInDB.dinnerPortions = slate.dinnerPortions.slice(0);
		// plate.itemId = ++id;
		console.log("Adding item named " + slateInDB.name + " to slates");
		console.log("Slate add breakfastId " + slate.breakfastId + " lunchId "
				+ slate.lunchId + " dinnerId " + slate.dinnerId);
		$.indexedDB("PlateSlateDB").objectStore("slates", true).add(slateInDB)
				.then(function(val) {
					// portion.id = val;
					console.info(val);
					// tjs 140122
					//var cacheSlate
					if (slate.id == 0)
						slate.id = id;
				}, console.error);		
	}
}

// tjs 140118
function readOrSetSlateFoodPortions(slate, plates) {
	var name = slate.name;
	var foundRow = false;
	var foods; // an array
	console.log("readOrSetSlateFoodPortions Find item named " + name + " in slates");
	$
			.indexedDB("PlateSlateDB")
			.objectStore("slates")
			.each(
					function(elem) {
						if (elem.value && elem.value.name == name) {
							foundRow = true;
							var updateRow = false;
							// elem.value["offset"] = slate.offset;
							// elem.value["date"] = slate.date;
							// elem.value["time"] = slate.time;
							var breakfastPortions = elem.value["breakfastPortions"];
							var lunchPortions = elem.value["lunchPortions"];
							var dinnerPortions = elem.value["dinnerPortions"];
							if (breakfastPortions != null
									&& breakfastPortions.length > 0) {
								// console.log("modifySlateFoodPortions
								// breakfastPortions length " +
								// breakfastPortions.length + " lunchPortions
								// length " + lunchPortions.length + "
								// dinnerPortions length " +
								// dinnerPortions.length);
								console
										.log("readOrSetSlateFoodPortions breakfastPortions length "
												+ breakfastPortions.length);
							} else {
								updateRow = true;
								var plateId = slate.breakfastId;
								// alert("plateslate addToFood plate id " +
								// plateId);
								var plate = getPlateById(plateId);
								breakfastPortions = deriveSlateFoodFromPlate(plate);
								// slate.breakfastPortions = foods.slice(0);
							}
							slate.breakfastPortions = derivePortionIdsFromFoodInDB(
									breakfastPortions).slice(0);
							if (lunchPortions != null
									&& lunchPortions.length > 0) {
								console
										.log("readOrSetSlateFoodPortions lunchPortions length "
												+ lunchPortions.length);
							} else {
								updateRow = true;
								var plateId = slate.lunchId;
								// alert("plateslate addToFood plate id " +
								// plateId);
								var plate = getPlateById(plateId);
								lunchPortions = deriveSlateFoodFromPlate(plate);
								// slate.lunchPortions = foods.slice(0);
							}
							slate.lunchPortions = derivePortionIdsFromFoodInDB(
									lunchPortions).slice(0);
							if (dinnerPortions != null
									&& dinnerPortions.length > 0) {
								console
										.log("readOrSetSlateFoodPortions dinnerPortions length "
												+ dinnerPortions.length);
							} else {
								updateRow = true;
								var plateId = slate.dinnerId;
								// alert("plateslate addToFood plate id " +
								// plateId);
								var plate = getPlateById(plateId);
								dinnerPortions = deriveSlateFoodFromPlate(plate);
								// slate.dinnerPortions = foods.slice(0);
							}
							slate.dinnerPortions = derivePortionIdsFromFoodInDB(
									dinnerPortions).slice(0);
							if (updateRow) {
								console.info("Updating", elem.value);
								elem.value["modifiedCursor-" + Math.random()] = true;
								elem.value["breakfastPortions"] = breakfastPortions
										.slice(0);
								elem.value["lunchPortions"] = lunchPortions
										.slice(0);
								elem.value["dinnerPortions"] = dinnerPortions
										.slice(0);
								elem.update(elem.value);
							}
							// console.log("modifySlateFoodPortions
							// breakfastPortions length " +
							// breakfastPortions.length + " lunchPortions length
							// " + lunchPortions.length + " dinnerPortions
							// length " + dinnerPortions.length);
							// elem.value["breakfastId"] = slate.breakfastId;
							// elem.value["lunchId"] = slate.lunchId;
							// elem.value["dinnerId"] = slate.dinnerId;
							// elem.value["portions"] = platePortions;
							// elem.update(elem.value);
						}
					});
}

function derivePortionIdsFromFoodInDB(foodPortions) {
	var portionIds = new Array();
	for ( var i = 0; i < foodPortions.length; i++) {
		//portionIds.push(foodPortions[i].portionId);
		portionIds.push(foodPortions[i]);
	}
	return portionIds;
}

function deriveSlateFoodFromPlate(plate) {

	// alert("plateslate insertFood slate id " + slate.id + " plate id " +
	// plate.id + " plate type " + plate.type);
	var foods = new Array();
	var portionId = plate.portion1;
	if (!isNaN(portionId)) {
		if (portionId > 0) {
			foods.push(portionId);
			//foods.push(new FoodInDB(plate.type, portionId, 0, 0));
			// alert("plateslate getRandomPlate plate name " +
			// selectedPlate.name + " portionId #1 " + portionId);
			// insertFoodPortion(slate.id, plate.type, portionId, 0);
		}
	}

	portionId = plate.portion2;
	if (!isNaN(portionId)) {
		if (portionId > 0) {
			foods.push(portionId);
			//foods.push(new FoodInDB(plate.type, portionId, 0, 0));
			// alert("plateslate getRandomPlate plate name " +
			// selectedPlate.name + " portionId #1 " + portionId);
			// insertFoodPortion(slate.id, plate.type, portionId, 0);
		}
	}
	// alert("plateslate getRandomPlate portionId #2 " + portionId);
	portionId = plate.portion3;
	if (!isNaN(portionId)) {
		if (portionId > 0) {
			foods.push(portionId);
			//foods.push(new FoodInDB(plate.type, portionId, 0, 0));
			// alert("plateslate getRandomPlate plate name " +
			// selectedPlate.name + " portionId #1 " + portionId);
			// insertFoodPortion(slate.id, plate.type, portionId, 0);
		}
	}
	// alert("plateslate getRandomPlate portionId #3 " + portionId);
	portionId = plate.portion4;
	if (!isNaN(portionId)) {
		if (portionId > 0) {
			foods.push(portionId);
			//foods.push(new FoodInDB(plate.type, portionId, 0, 0));
			// alert("plateslate getRandomPlate plate name " +
			// selectedPlate.name + " portionId #1 " + portionId);
			// insertFoodPortion(slate.id, plate.type, portionId, 0);
		}
	}
	// alert("plateslate getRandomPlate portionId #4 " + portionId);
	portionId = plate.portion5;
	if (!isNaN(portionId)) {
		if (portionId > 0) {
			foods.push(portionId);
			//foods.push(new FoodInDB(plate.type, portionId, 0, 0));
			// alert("plateslate getRandomPlate plate name " +
			// selectedPlate.name + " portionId #1 " + portionId);
			// insertFoodPortion(slate.id, plate.type, portionId, 0);
		}
	}
	// alert("plateslate getRandomPlate portionId #5 " + portionId);
	portionId = plate.portion6;
	if (!isNaN(portionId)) {
		if (portionId > 0) {
			foods.push(portionId);
			//foods.push(new FoodInDB(plate.type, portionId, 0, 0));
			// alert("plateslate getRandomPlate plate name " +
			// selectedPlate.name + " portionId #1 " + portionId);
			// insertFoodPortion(slate.id, plate.type, portionId, 0);
		}
	}
	portionId = plate.portion7;
	if (!isNaN(portionId)) {
		if (portionId > 0) {
			foods.push(portionId);
			//foods.push(new FoodInDB(plate.type, portionId, 0, 0));
			// alert("plateslate getRandomPlate plate name " +
			// selectedPlate.name + " portionId #1 " + portionId);
			// insertFoodPortion(slate.id, plate.type, portionId, 0);
		}
	}
	portionId = plate.portion8;
	if (!isNaN(portionId)) {
		if (portionId > 0) {
			foods.push(portionId);
			//foods.push(new FoodInDB(plate.type, portionId, 0, 0));
			// alert("plateslate getRandomPlate plate name " +
			// selectedPlate.name + " portionId #1 " + portionId);
			// insertFoodPortion(slate.id, plate.type, portionId, 0);
		}
	}
	portionId = plate.portion9;
	if (!isNaN(portionId)) {
		if (portionId > 0) {
			foods.push(portionId);
			//foods.push(new FoodInDB(plate.type, portionId, 0, 0));
			// alert("plateslate getRandomPlate plate name " +
			// selectedPlate.name + " portionId #1 " + portionId);
			// insertFoodPortion(slate.id, plate.type, portionId, 0);
		}
	}
	return foods;
}

function modifySlateFoodPortions(slate, type, portionId, master, isInactive) {
	var name = slate.name;
	var foundRow = false;
	// var foods; // an array
	console.log("Find item named " + name + " in slates");
	$.indexedDB("PlateSlateDB").objectStore("slates").each(
			function(elem) {
				if (elem.value && elem.value.name == name) {
					foundRow = true;
					var breakfastPortions;
					var lunchPortions;
					var dinnerPortions;
					console.info("Updating", elem.value);
					elem.value["modifiedCursor-" + Math.random()] = true;
					// var updateRow = false;
					if (type = "breakfast") {
						breakfastPortions = elem.value["breakfastPortions"];
						breakfastPortions = updateOrAppendFoodPortion(
								breakfastPortions, type, portionId, master,
								isInactive);
						elem.value["breakfastPortions"] = breakfastPortions
								.slice(0);
					} else if (type = "lunch") {
						lunchPortions = elem.value["lunchPortions"];
						lunchPortions = updateOrAppendFoodPortion(
								lunchPortions, type, portionId, master,
								isInactive);
						elem.value["lunchPortions"] = lunchPortions.slice(0);
					} else if (type = "dinner") {
						dinnerPortions = elem.value["dinnerPortions"];
						dinnerPortions = updateOrAppendFoodPortion(
								dinnerPortions, type, portionId, master,
								isInactive);
						elem.value["dinnerPortions"] = dinnerPortions.slice(0);
					}
					// if (updateRow) {
					elem.update(elem.value);
					// }
					// tjs 140123
					if (slate.id == 0) {
						slate.id = elem.value.itemId;
					}
				}
			});
}

function updateOrAppendFoodPortion(foodPortions, type, portionId, isMaster,
		isInactive) {
	var typePortions = new Array();
	var foundPortionId = false;
	for ( var i = 0; i < foodPortions.length; i++) {
		//if (foodPortions[i].portionId == portionId) {
		if (foodPortions[i] == portionId) {
			//foodPortions[i].isMaster = isMaster;
			//foodPortions[i].isInactive = isInactive;
			foundPortionId = true;
			typePortions.push(foodPortions[i]);
		}
	}
	if (!foundPortionId) {
		//typePortions.push(new FoodInDB(type, portionId, isMaster, isInactive));
		typePortions.push(portionId);
	}
	return typePortions;
}

function getFoodInDB(slate, type) {
	var foodPortions;
	var name = slate.name;
	var foundRow = false;
	// var foods; // an array
	console.log("Find item named " + name + " in slates");
	$.indexedDB("PlateSlateDB").objectStore("slates").each(function(elem) {
		if (elem.value && elem.value.name == name) {
			foundRow = true;
			var breakfastPortions;
			var lunchPortions;
			var dinnerPortions;
			// console.info("Updating", elem.value);
			// elem.value["modifiedCursor-" + Math.random()] = true;
			// var updateRow = false;
			if (type = "breakfast") {
				foodPortions = elem.value["breakfastPortions"];
				// breakfastPortions =
				// updateOrAppendFoodPortion(breakfastPortions, type, portionId,
				// master, isInactive);
				// elem.value["breakfastPortions"] = breakfastPortions.slice(0);
			} else if (type = "lunch") {
				foodPortions = elem.value["lunchPortions"];
				;
				// lunchPortions = updateOrAppendFoodPortion(lunchPortions,
				// type, portionId, master, isInactive);
				// elem.value["lunchPortions"] = lunchPortions.slice(0);
			} else if (type = "dinner") {
				foodPortions = elem.value["dinnerPortions"];
				;
				// dinnerPortions = updateOrAppendFoodPortion(dinnerPortions,
				// type, portionId, master, isInactive);
				// elem.value["dinnerPortions"] = dinnerPortions.slice(0);
			}
			// if (updateRow) {
			// elem.update(elem.value);
			// }
			// return foodPortions;
		}
	}).done(function() {
		return foodPortions;
	});
}
/*
function FoodInDB(type, portionId, isMaster, isInactive) {
	this.type = type;
	this.portionId = portionId;
	this.isMaster = isMaster;
	this.isInactive = isInactive;
}

// tjs 131216
function readOrSetSlateFoodPortions(slate, plates) {
	var name = slate.name;
	var foundRow = false;
	var foods; // an array
	console.log("readOrSetSlateFoodPortions Find item named " + name + " in slates");
	$
			.indexedDB("PlateSlateDB")
			.objectStore("slates")
			.each(
					function(elem) {
						if (elem.value && elem.value.name == name) {
							foundRow = true;
							var updateRow = false;
							// elem.value["offset"] = slate.offset;
							// elem.value["date"] = slate.date;
							// elem.value["time"] = slate.time;
							var breakfastPortions = elem.value["breakfastPortions"];
							var lunchPortions = elem.value["lunchPortions"];
							var dinnerPortions = elem.value["dinnerPortions"];
							if (breakfastPortions != null
									&& breakfastPortions.length > 0) {
								// console.log("modifySlateFoodPortions
								// breakfastPortions length " +
								// breakfastPortions.length + " lunchPortions
								// length " + lunchPortions.length + "
								// dinnerPortions length " +
								// dinnerPortions.length);
								console
										.log("readOrSetSlateFoodPortions breakfastPortions length "
												+ breakfastPortions.length);
							} else {
								updateRow = true;
								var plateId = slate.breakfastId;
								// alert("plateslate addToFood plate id " +
								// plateId);
								var plate = getPlateById(plateId);
								breakfastPortions = deriveSlateFoodFromPlate(plate);
								// slate.breakfastPortions = foods.slice(0);
							}
							slate.breakfastPortions = derivePortionIdsFromFoodInDB(
									breakfastPortions).slice(0);
							if (lunchPortions != null
									&& lunchPortions.length > 0) {
								console
										.log("readOrSetSlateFoodPortions lunchPortions length "
												+ lunchPortions.length);
							} else {
								updateRow = true;
								var plateId = slate.lunchId;
								// alert("plateslate addToFood plate id " +
								// plateId);
								var plate = getPlateById(plateId);
								lunchPortions = deriveSlateFoodFromPlate(plate);
								// slate.lunchPortions = foods.slice(0);
							}
							slate.lunchPortions = derivePortionIdsFromFoodInDB(
									lunchPortions).slice(0);
							if (dinnerPortions != null
									&& dinnerPortions.length > 0) {
								console
										.log("readOrSetSlateFoodPortions dinnerPortions length "
												+ dinnerPortions.length);
							} else {
								updateRow = true;
								var plateId = slate.dinnerId;
								// alert("plateslate addToFood plate id " +
								// plateId);
								var plate = getPlateById(plateId);
								dinnerPortions = deriveSlateFoodFromPlate(plate);
								// slate.dinnerPortions = foods.slice(0);
							}
							slate.dinnerPortions = derivePortionIdsFromFoodInDB(
									dinnerPortions).slice(0);
							if (updateRow) {
								console.info("Updating", elem.value);
								elem.value["modifiedCursor-" + Math.random()] = true;
								elem.value["breakfastPortions"] = breakfastPortions
										.slice(0);
								elem.value["lunchPortions"] = lunchPortions
										.slice(0);
								elem.value["dinnerPortions"] = dinnerPortions
										.slice(0);
								elem.update(elem.value);
							}
							// console.log("modifySlateFoodPortions
							// breakfastPortions length " +
							// breakfastPortions.length + " lunchPortions length
							// " + lunchPortions.length + " dinnerPortions
							// length " + dinnerPortions.length);
							// elem.value["breakfastId"] = slate.breakfastId;
							// elem.value["lunchId"] = slate.lunchId;
							// elem.value["dinnerId"] = slate.dinnerId;
							// elem.value["portions"] = platePortions;
							// elem.update(elem.value);
						}
					});
}

function derivePortionIdsFromFoodInDB(foodPortions) {
	var portionIds = new Array();
	for ( var i = 0; i < foodPortions.length; i++) {
		portionIds.push(foodPortions[i].portionId);
	}
	return portionIds;
}

function deriveSlateFoodFromPlate(plate) {

	// alert("plateslate insertFood slate id " + slate.id + " plate id " +
	// plate.id + " plate type " + plate.type);
	var foods = new Array();
	var portionId = plate.portion1;
	if (!isNaN(portionId)) {
		if (portionId > 0) {
			// foods.push(portionId);
			foods.push(new FoodInDB(plate.type, portionId, 0, 0));
			// alert("plateslate getRandomPlate plate name " +
			// selectedPlate.name + " portionId #1 " + portionId);
			// insertFoodPortion(slate.id, plate.type, portionId, 0);
		}
	}

	portionId = plate.portion2;
	if (!isNaN(portionId)) {
		if (portionId > 0) {
			// foods.push(portionId);
			foods.push(new FoodInDB(plate.type, portionId, 0, 0));
			// alert("plateslate getRandomPlate plate name " +
			// selectedPlate.name + " portionId #1 " + portionId);
			// insertFoodPortion(slate.id, plate.type, portionId, 0);
		}
	}
	// alert("plateslate getRandomPlate portionId #2 " + portionId);
	portionId = plate.portion3;
	if (!isNaN(portionId)) {
		if (portionId > 0) {
			// foods.push(portionId);
			foods.push(new FoodInDB(plate.type, portionId, 0, 0));
			// alert("plateslate getRandomPlate plate name " +
			// selectedPlate.name + " portionId #1 " + portionId);
			// insertFoodPortion(slate.id, plate.type, portionId, 0);
		}
	}
	// alert("plateslate getRandomPlate portionId #3 " + portionId);
	portionId = plate.portion4;
	if (!isNaN(portionId)) {
		if (portionId > 0) {
			// foods.push(portionId);
			foods.push(new FoodInDB(plate.type, portionId, 0, 0));
			// alert("plateslate getRandomPlate plate name " +
			// selectedPlate.name + " portionId #1 " + portionId);
			// insertFoodPortion(slate.id, plate.type, portionId, 0);
		}
	}
	// alert("plateslate getRandomPlate portionId #4 " + portionId);
	portionId = plate.portion5;
	if (!isNaN(portionId)) {
		if (portionId > 0) {
			// foods.push(portionId);
			foods.push(new FoodInDB(plate.type, portionId, 0, 0));
			// alert("plateslate getRandomPlate plate name " +
			// selectedPlate.name + " portionId #1 " + portionId);
			// insertFoodPortion(slate.id, plate.type, portionId, 0);
		}
	}
	// alert("plateslate getRandomPlate portionId #5 " + portionId);
	portionId = plate.portion6;
	if (!isNaN(portionId)) {
		if (portionId > 0) {
			// foods.push(portionId);
			foods.push(new FoodInDB(plate.type, portionId, 0, 0));
			// alert("plateslate getRandomPlate plate name " +
			// selectedPlate.name + " portionId #1 " + portionId);
			// insertFoodPortion(slate.id, plate.type, portionId, 0);
		}
	}
	portionId = plate.portion7;
	if (!isNaN(portionId)) {
		if (portionId > 0) {
			// foods.push(portionId);
			foods.push(new FoodInDB(plate.type, portionId, 0, 0));
			// alert("plateslate getRandomPlate plate name " +
			// selectedPlate.name + " portionId #1 " + portionId);
			// insertFoodPortion(slate.id, plate.type, portionId, 0);
		}
	}
	portionId = plate.portion8;
	if (!isNaN(portionId)) {
		if (portionId > 0) {
			// foods.push(portionId);
			foods.push(new FoodInDB(plate.type, portionId, 0, 0));
			// alert("plateslate getRandomPlate plate name " +
			// selectedPlate.name + " portionId #1 " + portionId);
			// insertFoodPortion(slate.id, plate.type, portionId, 0);
		}
	}
	portionId = plate.portion9;
	if (!isNaN(portionId)) {
		if (portionId > 0) {
			// foods.push(portionId);
			foods.push(new FoodInDB(plate.type, portionId, 0, 0));
			// alert("plateslate getRandomPlate plate name " +
			// selectedPlate.name + " portionId #1 " + portionId);
			// insertFoodPortion(slate.id, plate.type, portionId, 0);
		}
	}
	return foods;
}

// tjs 131216
function modifySlateFoodPortions(slate, type, portionId, master, isInactive) {
	var name = slate.name;
	var foundRow = false;
	// var foods; // an array
	console.log("Find item named " + name + " in slates");
	$.indexedDB("PlateSlateDB").objectStore("slates").each(
			function(elem) {
				if (elem.value && elem.value.name == name) {
					foundRow = true;
					var breakfastPortions;
					var lunchPortions;
					var dinnerPortions;
					console.info("Updating", elem.value);
					elem.value["modifiedCursor-" + Math.random()] = true;
					// var updateRow = false;
					if (type = "breakfast") {
						breakfastPortions = elem.value["breakfastPortions"];
						breakfastPortions = updateOrAppendFoodPortion(
								breakfastPortions, type, portionId, master,
								isInactive);
						elem.value["breakfastPortions"] = breakfastPortions
								.slice(0);
					} else if (type = "lunch") {
						lunchPortions = elem.value["lunchPortions"];
						;
						lunchPortions = updateOrAppendFoodPortion(
								lunchPortions, type, portionId, master,
								isInactive);
						elem.value["lunchPortions"] = lunchPortions.slice(0);
					} else if (type = "dinner") {
						dinnerPortions = elem.value["dinnerPortions"];
						;
						dinnerPortions = updateOrAppendFoodPortion(
								dinnerPortions, type, portionId, master,
								isInactive);
						elem.value["dinnerPortions"] = dinnerPortions.slice(0);
					}
					// if (updateRow) {
					elem.update(elem.value);
					// }
				}
			});
}

function updateOrAppendFoodPortion(foodPortions, type, portionId, isMaster,
		isInactive) {
	var typePortions = new Array();
	var foundPortionId = false;
	for ( var i = 0; i < foodPortions.length; i++) {
		if (foodPortions[i].portionId == portionId) {
			foodPortions[i].isMaster = isMaster;
			foodPortions[i].isInactive = isInactive;
			foundPortionId = true;
			typePortions.push(foodPortions[i]);
		}
	}
	if (!foundPortionId) {
		typePortions.push(new FoodInDB(type, portionId, isMaster, isInactive));
	}
	return typePortions;
}

function getFoodInDB(slate, type) {
	var foodPortions;
	var name = slate.name;
	var foundRow = false;
	// var foods; // an array
	console.log("Find item named " + name + " in slates");
	$.indexedDB("PlateSlateDB").objectStore("slates").each(function(elem) {
		if (elem.value && elem.value.name == name) {
			foundRow = true;
			var breakfastPortions;
			var lunchPortions;
			var dinnerPortions;
			// console.info("Updating", elem.value);
			// elem.value["modifiedCursor-" + Math.random()] = true;
			// var updateRow = false;
			if (type = "breakfast") {
				foodPortions = elem.value["breakfastPortions"];
				// breakfastPortions =
				// updateOrAppendFoodPortion(breakfastPortions, type, portionId,
				// master, isInactive);
				// elem.value["breakfastPortions"] = breakfastPortions.slice(0);
			} else if (type = "lunch") {
				foodPortions = elem.value["lunchPortions"];
				;
				// lunchPortions = updateOrAppendFoodPortion(lunchPortions,
				// type, portionId, master, isInactive);
				// elem.value["lunchPortions"] = lunchPortions.slice(0);
			} else if (type = "dinner") {
				foodPortions = elem.value["dinnerPortions"];
				;
				// dinnerPortions = updateOrAppendFoodPortion(dinnerPortions,
				// type, portionId, master, isInactive);
				// elem.value["dinnerPortions"] = dinnerPortions.slice(0);
			}
			// if (updateRow) {
			// elem.update(elem.value);
			// }
			// return foodPortions;
		}
	}).done(function() {
		return foodPortions;
	});
}
*/
// Read an item from portions and save it in plates
function addToplates(itemId) {
	$.indexedDB("PlateSlateDB").objectStore("portions").get(itemId).then(
			function(item) {
				$.indexedDB("PlateSlateDB").objectStore("plates").add(item)
						.done(function() {
							loadFromDBAfterLoadSelectOptions("plates");
						});
			}, function(err, e) {
				console.log("Could not add to plates");
			});
}

// tjs 131129
function appendPortionToPlate(portionItemId, plateItemId) {
	// console.log ("appendPortionToPlate plateItemId " + plateItemId);
	var transaction = $.indexedDB("PlateSlateDB").transaction(
			[ "portions", "plates" ], $.indexedDB.IDBTransaction.READ_WRITE);
	transaction.done(function() {
		loadFromDBAfterLoadSelectOptions("plates");
		// loadFromDB("slates");
	});
	transaction.progress(function(transaction) {
		// console.log ("appendPortionToPlate portionItem.name " +
		// portionItem.name);
		transaction.objectStore("portions").get(portionItemId).done(
				function(portionItem) {
					// console.log ("appendPortionToPlate portionItem.name " +
					// portionItem.name);
					_(transaction.objectStore("plates").index('itemId').each(
							function(elem) {
								if (elem.value
										&& elem.value.itemId == plateItemId) {
									elem.value.portions.push(portionItem);
									elem.value["modifiedCursor-"
											+ Math.random()] = true;
									elem.update(elem.value);
								}
							}));
				});
	});
}

/*
 * var transaction = $.indexedDB("BookShop1").transaction(["OldBookList",
 * "BookList"], $.indexedDB.IDBTransaction.READ_WRITE);
 * transaction.then(console.info, console.error);
 * transaction.progress(function(t) {
 * t.objectStore("BookList").add(data()).then(console.info, console.error);
 * t.objectStore("OldBookList").add(data(), new
 * Date().getTime()).then(console.info, console.error); });
 * $.indexedDB("BookShop1").objectStore("BookList").index("price").eachKey(console.info,
 * [200, 500]);
 */
// tjs 131202
function assignPlateToSlate(plateItemId, slateId) {
	// console.log ("assignPlateToSlate plateItemId " + plateItemId);
	var transaction = $.indexedDB("PlateSlateDB").transaction(
			[ "slates", "plates" ], $.indexedDB.IDBTransaction.READ_WRITE);
	transaction.done(function() {
		loadFromDBAfterLoadSelectOptions("slates");
		// loadFromDB("slates");
	});
	transaction.progress(function(transaction) {
		// console.log ("assignPlateToSlate portionItem.name " +
		// portionItem.name);
		transaction.objectStore("plates").get(plateItemId).done(
				function(plateItem) {
					var plateType = plateItem.type;
					// console.log ("assignPlateToSlate plateType " +
					// plateType);
					_(transaction.objectStore("slates").index('name').each(
							// .eachKey(
							function(elem) {
								// console.log("assignPlateToSlate elem.key " +
								// elem.key);
								// console.log("assignPlateToSlate
								// elem.value.name " + elem.value.name);
								// e.g. assignPlateToSlate elem.key 20131203
								// assignPlateToSlate elem.value.name 20131203

								if (elem.value && elem.key == slateId) {
									// elem.value.portions.push(portionItem);
									if (plateType == "Breakfast") {
										elem.value.breakfastPlate = plateItem;
									} else if (plateType == "Lunch") {
										elem.value.lunchPlate = plateItem;
									} else if (plateType == "Dinner") {
										elem.value.dinnerPlate = plateItem;
									}
									elem.value["modifiedCursor-"
											+ Math.random()] = true;
									elem.update(elem.value);
								}
							}));
				});
	});
}

// Delete an item from plates
function removeFromplates(itemId) {
	$.indexedDB("PlateSlateDB").objectStore("plates")["delete"](itemId).done(
			function() {
				loadFromDBAfterLoadSelectOptions("plates");
			});
}

// Using transactions, read object from plates, add it to slates if it does not
// exist
// and then delete it from the plates. If any operation failes, all these will
// fail
function moveToslates(platesId) {
	var transaction = $.indexedDB("PlateSlateDB").transaction(
			[ "plates", "slates" ]);
	transaction.done(function() {
		loadFromDBAfterLoadSelectOptions("plates");
		loadFromDBAfterLoadSelectOptions("slates");
	});
	transaction.progress(function(transaction) {
		transaction.objectStore("plates").get(platesId).done(function(item) {
			transaction.objectStore("slates").add(item).fail(function() {
				console.log("Already in the slates");
			}).done(function() {
				_(transaction.objectStore("plates")["delete"](platesId));
			});

		});
	});
}

// Read an item from portions and add it to slates
function addToslates(itemId) {
	$.indexedDB("PlateSlateDB").objectStore("portions").get(itemId).then(
			function(item) {
				$.indexedDB("PlateSlateDB").objectStore("slates").add(item)
						.done(function() {
							loadFromDBAfterLoadSelectOptions("slates");
						});
			}, function(err, e) {
				console.log("Could not add to plates");
			});
}

function removeFromslates(itemId) {
	$.indexedDB("PlateSlateDB").objectStore("slates")["delete"](itemId).done(
			function() {
				loadFromDBAfterLoadSelectOptions("slates");
			});
}

// tjs 131204
function upload(table) {
	var json = '[';
	$.indexedDB("PlateSlateDB").objectStore(table).each(function(elem) {
		// addRowInHTMLTable(table, elem.key, elem.value);
		// addRowInHTMLTable(table, elem.key, elem.value,
		// portionSelectionHtml, plateSelectionHtml);
		// }).then(assignSelections(table));
		json += JSON.stringify(elem.value);
		json += ',';
	}).done(function() {
		json = json.replace(/,$/, "]");
		// alert ("for table " + table + " json: " + json);
		// $.ajax(url, {
		// data : JSON.stringify(myJSObject),
		// contentType : 'application/json',
		// type : 'POST',
		// });
		// var xml = getReportXml('Meal Plan Report', thresholdOffset);
		// alert("plateSlateCellApp doRealTimeReport xml " + xml);
		// tjs 131112
		// var jqxhr = $.post( "../refreshSlateMenu.php", { xml: xml,
		// divHeaderStyle: divHeaderStyle, divLabelStyle: divLabelStyle,
		// divDataStyle: divDataStyle }, function(xhr, status, message) {
		var jqxhr = $.post("../storePortionsPlates.php", {
			json : json,
			table : table,
			account : account
		}, function(xhr, status, message) {
			// alert( "success msg " + xhr.responseText);
		}).done(function(xhr, status, message) {
			// alert( "second success" );
			// alert( "second success msg " + xhr.responseText);
		})
		// jqXHR jqXHR, String textStatus, String errorThrown
		// .fail(function() {
		.fail(function(xhr, status, message) {
			// alert( "error" );
			// alert( "error status " + status + " message " + message);
			// e.g. error status error message Internal Server Error
			// alert( "error status " + xhr.status + " response text " +
			// xhr.responseText);
			// e.g. error status 500 response text refreshSlateMenu...
			// alert( "msg " + xhr.responseText);
			// e.g. refreshSlateMenu...
			// alert( "err " + xhr.thrownError);
			// e.g. undefined
		}).always(function() {
			// alert( "finished" );
		});
	});
}

function _(promise) {
	promise.then(function(a, e) {
		console.log("Action completed", e.type, a, e);
	}, function(a, e) {
		console.log("Action completed", a, e);
	}, function(a, e) {
		console.log("Action completed", a, e);
	});
}

var _gaq = _gaq || [];
_gaq.push([ '_setAccount', 'UA-617499-9' ]);
_gaq.push([ '_setDomainName', 'github.com' ]);
_gaq.push([ '_setAllowLinker', true ]);
_gaq.push([ '_trackPageview' ]);

(function() {
	var ga = document.createElement('script');
	ga.type = 'text/javascript';
	ga.async = true;
	ga.src = ('https:' == document.location.protocol ? 'https://ssl'
			: 'http://www')
			+ '.google-analytics.com/ga.js';
	var s = document.getElementsByTagName('script')[0];
	s.parentNode.insertBefore(ga, s);
})();
