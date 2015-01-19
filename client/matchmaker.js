var dbLoader = require('../etl/load');
var preferences = require('../preferences');
var profiles = require('./profiles.json').profiles;
// var transporter = require('./sendmail');
var nodemailer = require('nodemailer');
var util = require('util');

// create reusable transporter object using SMTP transport
var transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: 'auto.ad.alerts@gmail.com',
        pass: 'IloveDev22'
    }
});


var ads, index = 0;
dbLoader.start(function(){
	
	var iterator = dbLoader.getAllRecords();
	function iterate(){
		iterator.nextObject(function(err, item){
			if (err){
				console.log(arguments);
			}
			else if(item){
				// console.log(item);
				process.call(null, item, iterate);
			}
			else{
				console.log('reached end');
			}
		});
	};
	iterate();

});
function process(ad, callback){
	for(var j=0, len = profiles.length; j < len; j++){
		var profile = profiles[j];
		var prefs = profile.preferences;
		for(var z=0, prefLen = prefs.length; z < prefLen; z++){
			var pref = prefs[z];
			// console.log(pref);
			if(isMatch(ad, pref)){
				// console.log(ad);
				var record = ad;
				// record.profileName = profile.name;
				dbLoader.addRecord('sent_ads', record, function(success){
					if(success){
						console.log('sending ad');
						console.log(record);
					}
					else{
						console.log('not sending ad %d', record.ad_id);
					}
				});
				
			}
			
		}
	}
	callback();
};
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
function emailMatch(normalizedAd){
	var body = '<h1>%s %s</h1><p>Kilometers: %s</p><p>Price: $ %s</p><a href=\'http://www.kijiji.ca/b-search.html?locationId=1700214&categoryId=&formSubmit=true&urgentOnly=false&highlightOnly=false&gpTopAd=false&hpGallery=false&minPrice=&maxPrice=&adType=&adPriceType=&sortByName=dateDesc&keywords=%s\'>View Ad</a>';	
	var output = util.format(body, 
				normalizedAd.make,
				normalizedAd.model,
				normalizedAd.kilometers,
				normalizedAd.price,
				normalizedAd.ad_id
			);
	var mailOptions = {
	    from: 'Auto Alerts', // sender address
	    to: 'aziz.marwan@gmail.com', // list of receivers
	    subject: 'Deals that may be of interest to you', // Subject line
	    text: 'Hello world ✔', // plaintext body
	    html: output // html body
	};
	transporter.sendMail(mailOptions, function(error, info){
	    if(error){
	        console.log(error);
	    }else{
	        console.log('Message sent: ' + info.response);
	    }
	});
}
