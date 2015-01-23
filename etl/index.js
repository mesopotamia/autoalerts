var extract = require('./extract');
var loader = require('./load');
var transform = require('./transform');
// var autoTraderExtractor = require('./autotrader/transform')

//start up database for saving normalized adds, extract once started
loader.start(function(){

	setInterval(doExtract, 900000);
	doExtract();

});

function doExtract(){
	extract.getData('kijiji').then(function(response){
		var collection = JSON.parse(response).results.collection1;
		transform.start(collection);
	});
	/*extract.getData('autotrader').then(function(response){
		var results = JSON.parse(response).results.collection1;
		autoTraderExtractor.start(results);
	})*/
}