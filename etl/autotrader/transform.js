var extract = require('../extract');
var dbLoader = require('../load');
var _ = require('lodash');

var index = 0,
	collection = [],
	added = 0;

function start(coll){
	collection = coll;
	// console.log(collection);
	transformNext();
};

function transformNext(){
	var ad = normalize(collection[index]);

	// console.log(mapped.ad_id);
	dbLoader.addRecord('transformed_ads', ad, function(success){
		index ++;
		if(index < collection.length){
			if(success){
				added ++;
			}
			transformNext();
		}
		else{
			console.log('%d ads added', added);
			// process.exit(1);
		}
	});
};
function normalize(ad){

	var newAd = {}, 
		titleBreakdown = {};

	newAd.model = ad.model;
	newAd.make = ad.make;
	newAd.kilometers = normalizeKM(ad.km);

	titleBreakdown = extractFromTitle(ad.title);
	newAd.price = titleBreakdown.price;
	newAd.year = titleBreakdown.year;

	return newAd;

}

function normalizeKM(kmStr){

	var normalized = kmStr.replace(',''');

	return kmStr.match(/[0-9]+/)[0];

};
function extractFromTitle(title){
	var price,
		year;

	price = title.match(/\$[0-9]+/)[0];
	year = title.match(/^(19[5-9]\d|20[0-4]\d|2050)$/)[0];

	return {price: price, year: year};

};
function normalize(key, value){
	
	if(value.search(/kilometers/i) >= 0){
		return ["kilometers", value.match(/[0-9]+/i)[0]];
	}
	else if(value.search(/price\s\$[0-9]+/i) >= 0){
		return ["price", value.replace(",","").match(/[0-9]+/i).toString()];
	}
	else if(value.search(/^model\s/i) >= 0){
		var match = value.match(/model\s(.*)/i);
		return ["model", match[1]];
	}
	else if(value.search(/^make\s/i) >= 0){

		var match = value.match(/make\s(.*)/i);
		return ["make", match[1]];
	}
	else if(value.search(/^year\s/i) >= 0){
		var match = value.match(/^year\s(.*)/i);
		return ["year", match[1]];
	}
	else if(value.search(/ad\sid\s[0-9]+/i) >= 0){
		// console.log('match id');
		return ['ad_id', value.match(/[0-9]+/i)[0]];
	}
	else if(value.search(/date\slisted\s/i) >= 0){
		return ['date_listed', value.match(/date\slisted\s(.*)/i)[1]];
	}


}

exports.start = start;