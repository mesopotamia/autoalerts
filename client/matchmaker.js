var dbLoader = require('../etl/load');
var preferences = require('../preferences');

dbLoader.start(function(){
	
	dbLoader.getRecordsArray(function(ads){
		for(var i=0; i < ads.length; i++){
			var ad = ads[i];
			for(var j=0; j < preferences.length; j++){
				var pref = preferences[j];
				if(isMatch(ad, pref)){
					console.log('found match: ');
					console.log(pref);
					console.log(ad);
					break;
				}
				else{

				}
			}
		}
		// console.log(ads);
	});

});
function isMatch(ad, pref){
	for(var key in pref){
		if(!isCompareable(ad, pref, key)){
			return false;
		}
	}
	return true;
}
function isCompareable(ad, pref, key){
	if(key === "kilometers" || key === "price"){
		return matchRange(ad[key], pref[key]);
	}
	else{
		return ad[key] === pref[key];
	}
}
function matchRange(field, rangeStr)  {
	var rangeArray = rangeStr.split("-");
	var from = parseFloat(rangeArray[0]);
	var to = parseFloat(rangeArray[1]);
	var digits = parseFloat(field.match(/[0-9]+/i));
	if(digits >= from && digits <= to){
		return true;
	}
	return false;
}
