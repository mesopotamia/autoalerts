var moment = require('moment');
console.log(moment('16-Nov-14',   "YYYY-MM-DD HH:mm Z"));

// console.log(new Date());
var adDate = new Date('16-Nov-14').toISOString().replace(/T/, ' ').replace(/\..+/,'');
var currentDate = new Date();

adDate.setHours(parseInt(currentDate.getHours()));
adDate.setMinutes(parseInt(currentDate.getMinutes()));
adDate.setSeconds(parseInt(currentDate.getSeconds()));