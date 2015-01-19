var MongoClient = require('mongodb').MongoClient;

var _db;

function start(callback){
	MongoClient.connect('mongodb://localhost/cars', function(err, db){
		if(err){
			console.log('Error connecting');
			return
		}
		_db = db;
		if(callback)
			callback.call();
	});
};
function addRecord(collection, record, callback){
	_db.collection(collection).findOne({ad_id: record.ad_id}, {w:1}, function(err, document) {
  		if(document){
			callback(false);
  		}
  		else{
			_db.collection(collection).insert(record, {w:1}, function(err, objects){
				if(err) console.warn(err.message);
  				callback(true);
			});
  		}
	});
};
function getAllRecords(){
	return _db.collection('transformed_ads').find({});
}
function getRecordsArray(callback){
	var transformed_ads = _db.collection('transformed_ads').find({});
	transformed_ads.toArray(function(err, transformed_ads){
		if(err){
			console.log('error occured while retreiving records');
		}
		callback(transformed_ads)
	});
};
module.exports = {
	start: start,
	addRecord: addRecord,
	getRecordsArray: getRecordsArray,
	getAllRecords: getAllRecords
};

