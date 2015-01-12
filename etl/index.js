var extract = require('./extract');
var loader = require('./load');
var transform = require('./transform');


loader.start(function(){

	extract.getData('kijiji').then(function(response){
		var collection = JSON.parse(response).results.collection1;
		transform.start(collection);
	});

});


