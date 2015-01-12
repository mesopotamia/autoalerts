var util = require('util');
var request = require("request-promise");

var providers = {
	kijiji: 'https://www.kimonolabs.com/api/3os5fdac?apikey=RO0Clty5y6y46QSia09D1RS3RF4oFnq6&kimlimit=2500',
	autotrader: 'https://www.kimonolabs.com/api/6izhz572?apikey=RO0Clty5y6y46QSia09D1RS3RF4oFnq6&kimlimit=2500'
}

function getData(provider){
	return request(providers[provider]);
}
module.exports = {
	getData: getData
};

