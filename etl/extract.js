var util = require('util');
var request = require("request-promise");


function getData(){
	return request("https://www.kimonolabs.com/api/3os5fdac?apikey=RO0Clty5y6y46QSia09D1RS3RF4oFnq6&kimlimit=2500");
}
module.exports = {
	getData: getData
};

