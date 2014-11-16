var util = require('util');
var request = require("request");
var transporter = require('./sendmail');
var preferences = require('./preferences');

request("https://www.kimonolabs.com/api/3os5fdac?apikey=RO0Clty5y6y46QSia09D1RS3RF4oFnq6&kimlimit=1", 
function(err, response, body) {
	var collection = JSON.parse(body).results.collection1;
	var matches = 0;
	collection.forEach(function(ad, index, arr){
		// console.log(ad);
		
		var criteria = [
			{
				'Model': 'Altima',
				'Make': 'Nissan',
				'Kilometers': '100000-118707',
				'Price': '1000-15000'
			}
		];

		var flatAd = flattenObject(ad);
		var normalizedAd = normalizeKeys(flatAd);
		var adArray = convertToArray(flatAd);

		// console.log(adArray);
		var match = matchCriteria(adArray, criteria);
		if(match){
			// console.log(match+" matches found");
			matches ++;
			console.log(flatAd.ad_id);
			var body = '<h1>%s %s</h1><p>Kilometers: %s</p><p>Price: $%s</p><a href=\'http://www.kijiji.ca/b-search.html?locationId=1700214&categoryId=&formSubmit=true&urgentOnly=false&highlightOnly=false&gpTopAd=false&hpGallery=false&minPrice=&maxPrice=&adType=&adPriceType=&sortByName=dateDesc&keywords=%s\'>View Ad</a>';
			var output = util.format(body, 
				normalizedAd.make,
				normalizedAd.model,
				normalizedAd.price,
				normalizedAd.km,
				normalizedAd.ad_id
			);
			console.log(output);
			var mailOptions = {
		    from: 'Auto Alerts', // sender address
		    to: 'aziz.marwan@gmail.com', // list of receivers
		    subject: 'Deals that may be of interest to you', // Subject line
		    text: 'Hello world ✔', // plaintext body
		    html: output // html body
			};
			/*transporter.sendMail(mailOptions, function(error, info){
			    if(error){
			        console.log(error);
			    }else{
			        console.log('Message sent: ' + info.response);
			    }
			});*/
			console.log(normalizedAd);	
		}
		/*if(index == 0)
			console.log(adArray);
		*/
	});
			console.log(matches+" matches found");

});
function normalizeKeys(flatObject){
	var toReturn = {};
	Object.keys(flatObject).map(function(key, index){
		var value = flatObject[key];
		if(value.indexOf("Kilometers") >= 0){

			toReturn['km'] = value.match(/[0-9]+/i)[0];
		}
		else if(value.search(/price\s\$[0-9]+/i) >= 0){
			toReturn['price'] = value.replace(",","").match(/[0-9]+/i).toString();;
		}
		else if(value.search(/Model\s/i) >= 0){
			value = value.replace("\n", "");
			var match = value.split("Model");
			toReturn['model'] = match[1];
		}
		else if(value.search(/Make\s/i) >= 0){
			value = value.replace("\n", "");
			var match = value.split("Make");
			toReturn['make'] = match[1];
		}
		else if(value.search(/ad\sid\s[0-9]+/i) >= 0){
				console.log('match id');
				toReturn['ad_id'] = value.match(/[0-9]+/i)[0];
		}
		else{
			toReturn[key] = value;
		}
	});
	return toReturn;
};
function matchCriteria(adArray, criteria){
	var numOfCriteria = criteria.length;
	var numOfMatches = 0;
	var completeMatch = true;
	for(var i=0; i < criteria.length; i++){
		var criterion = criteria[i];
		Object.keys(criterion).map(function(key, index){
			var criterionEntry = {key: criterion[key]};
			for(var j=0; j < adArray.length; j++){
				var field = adArray[j];
				if(matchCriterion(field, criterionEntry)){
					// console.log('found match');
					// console.log(field);
					numOfMatches ++;
		
				}else{
					// console.log('not found match');
					// console.log(field);
				}

			}
		});
	}
	// console.log(numOfMatches);
	if(numOfMatches >= numOfCriteria){
		return numOfMatches;
	}
	return false;
}
function matchCriterion(field, criterion){
	criterion = getKeyValuePair(criterion);
	// console.log(criterion);
	// console.log(field);
	if(criterion.key == "Kilometers" && field.indexOf("Kilometers") >= 0){
		console.log("found km");
		console.log(field);
		return matchRange(field, criterion.value);
	}
	else if(criterion.key === "Price" && field.search(/price\s\$[0-9]+/i) >= 0){
		
		var price = field.replace(",","").match(/[0-9]+/i).toString();
		return matchRange(price, criterion.value);
		
	}
	else if(field.indexOf(criterion.key) >= 0 && field.indexOf(criterion.value) >= 0){
		// console.log(field);
		return true;
	}
	return false;
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