var request = require("request");

request("https://www.kimonolabs.com/api/3os5fdac?apikey=RO0Clty5y6y46QSia09D1RS3RF4oFnq6", 
function(err, response, body) {
	var collection = JSON.parse(body).results.collection1;

	collection.forEach(function(ad, index, arr){
		// console.log(ad);
		
		var criteria = [
			
			{Make: 'Nissan'}
		];

		var flatAd = flattenObject(ad);
		var adArray = convertToArray(flatAd);

			// console.log(adArray);
		if(matchCriteria(adArray, criteria)){
			// console.log(flatAd);
			console.log(adArray);
		}
		/*if(index == 0)
			console.log(adArray);
		*/
	});

function matchCriteria(adArray, criteria){
	var numOfCriteria = criteria.length;
	var numOfMatches = 0;
	var completeMatch = true;
	for(var i=0; i < criteria.length; i++){
		var criterion = criteria[i];
		
		for(var j=0; j < adArray.length; j++){
			var field = adArray[j];
			if(matchCriterion(field, criterion)){
				// console.log('found match');
				// console.log(field);
				numOfMatches ++;
	
			}else{
				// console.log('not found match');
				// console.log(field);
			}

		}
	}
	// console.log(numOfMatches);
	if(numOfMatches >= numOfCriteria){
		return true;
	}
	return false;
}
function matchCriterion(field, criterion){
	criterion = getKeyValuePair(criterion);
	// console.log(criterion);
	// console.log(field);
	if(field.indexOf(criterion.key) >= 0 && field.indexOf(criterion.value) >= 0){
		// console.log(field);
		return true;
	}
	return false;
}
  
});
var flattenObject = function(ob) {
	var toReturn = {};
	
	for (var i in ob) {
		if (!ob.hasOwnProperty(i)) continue;
		
		if ((typeof ob[i]) == 'object') {
			var flatObject = flattenObject(ob[i]);
			for (var x in flatObject) {
				if (!flatObject.hasOwnProperty(x)) continue;
				
				toReturn[i + '.' + x] = flatObject[x];
			}
		} else {
			toReturn[i] = ob[i];
		}
	}
	return toReturn;
};
function iterate(obj, parent, criteria){
	if(!parent) parent = obj;
	Object.keys(obj).map(function(key, index){
		var deepObj = obj[key];
		if(typeof deepObj == "object"){
			iterate(deepObj, parent, criteria);
		}
		else{
			if(matchCriteria(deepObj, criteria)){
				console.log(criteria);
				console.log(parent);
			}else{
				// console.log('no match');
			}
			/*var matchKey, matchValue
			Object.keys(match).map(function(key, index){
				matchKey = key;
				matchValue = match[key];
			})
			if(deepObj.indexOf(matchKey) >= 0 && deepObj.indexOf(matchValue) >= 0){
				console.log(parent);
			}*/
		}
	});
}
function convertToArray(obj){
	var toReturn = [];
	Object.keys(obj).map(function(key, index){
			toReturn.push(obj[key]);
	});
	return toReturn;
}
function getKeyValuePair(flatObject){
	var pair = {};
	Object.keys(flatObject).map(function(key, index){
			pair["key"] = key;
			pair["value"] = flatObject[key];
	});
	return pair;
}