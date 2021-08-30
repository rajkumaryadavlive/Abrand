const moment = require('moment');
const { Tokensettings } = require('../models/userModel')

const addtokensettings = async function () {
    let rates = {
        token_name: '$EBT',
        total_quantity: '10000',
        etherValue: '1',
        btcValue: '1',
        usdValue: '1',
        xrpValue: '1',
        ltcValue: '1',
        dashValue: '1',
        bnbValue: '1',
        updated_at: '1',
    }
    let token = new Tokensettings(rates)
    await token.save();
    console.log(token)
}

addtokensettings();

function generateCode() {
    var string = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let code = '';

    var len = string.length;
    for (let i = 0; i < 10; i++) {
        code += string[Math.floor(Math.random() * len)];
    }
    return code;
}

function calculateDays(startDate, endDate) {
   var start_date = moment(startDate, 'YYYY-MM-DD HH:mm:ss');
   var end_date = moment(endDate, 'YYYY-MM-DD HH:mm:ss');
   var duration = moment.duration(end_date.diff(start_date));
   var days = duration.asDays();       
   return parseInt(days);
}

function calculateHours(startDate, endDate) {
   var start_date = moment(startDate, 'YYYY-MM-DD HH:mm:ss');
   var end_date = moment(endDate, 'YYYY-MM-DD HH:mm:ss');
   var duration = moment.duration(end_date.diff(start_date));
   var days = duration.asHours();       
   return days;
}

module.exports = {
    generateCode,
    calculateDays,
    calculateHours
}