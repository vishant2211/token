const axios = require('axios');
const fs = require('fs');
const https = require('https');
const path = require('path');
const angelTokenPath = path.join(__dirname, 'angelToken.js');
const zerodhaTokenPath = path.join(__dirname, 'zerodhaToken.js');

axios({
    method: 'GET',
    url: 'https://margincalculator.angelbroking.com/OpenAPI_File/files/OpenAPIScripMaster.json',
    headers: {
        'Content-Type': "application/json"
    },
    httpsAgent: new https.Agent({ rejectUnauthorized: false })

}).then(function (data) {
    if (data && data.data && Array.isArray(data.data) && data.data.length > 0) {
        try {
            let allSeg = ['NSE', 'BSE', 'NFO', 'CDS', 'MCX', 'NCDEX'];
            let segToConsider = ['NSE', 'BSE', 'NFO'];
            let finalTokenArr = data.data.filter(i => { return segToConsider.indexOf(i.exch_seg) != -1 })
            fs.writeFileSync(angelTokenPath, `module.exports = ${JSON.stringify(finalTokenArr)}`)
            console.log('Angel Broking Instruments Created Successfully!!')
        } catch (ex) {
            console.log('Error while writing file of Angel Broking Instruments!!')
        }
    } else {
        console.log('Error Empty data of Angel Broking Instruments!!')
    }
}, function (err) {
    console.log('Error while fetching data of Angel Broking Instruments!!')
});
function getTokenArray(list) {
    list = list.split('\n');
    list.pop()
    let headers = list[0];
    let keys = headers.split(',')
    let results = []
    for (let i = 1; i < list.length; i++) {
        let obj = {}
        let values = list[i].split(',');
        for (let j = 0; j < keys.length; j++) {
            if (j == 3) {
                obj[keys[j]] = String(values[j]).replace(/"/g, '');
            } else {
                obj[keys[j]] = values[j];
            }
        }
        results.push(obj);
    }
    return results;
}
axios({
    method: 'GET',
    url: 'https://api.kite.trade/instruments',
    headers: {
        'Content-Type': "application/json"
    }

}).then(function (data) {
    if (data && data.data) {
        try {
            let tokenArr = getTokenArray(data.data)
            let allSeg = ['BCD-OPT', 'BCD-FUT', 'BCD', 'BSE', 'INDICES', 'CDS-OPT', 'CDS-FUT', 'MCX-FUT', 'MCX-OPT', 'NFO-OPT', 'NFO-FUT', 'NSE'];
            let segToConsider = ['BSE', 'INDICES', 'NFO-OPT', 'NFO-FUT', 'NSE'];
            let finalTokenArr = tokenArr.filter(i => { return segToConsider.indexOf(i.segment) != -1 })
            fs.writeFileSync(zerodhaTokenPath, `module.exports = ${JSON.stringify(finalTokenArr)}`)
            console.log('Zerodha Instruments Created Successfully!!')
        } catch (ex) {
            console.log('Error while writing file of Zerodha Instruments!!')
        }
    } else {
        console.log('Error Empty data of Zerodha Instruments!!')
    }
}, function (err) {
    console.log('Error while fetching data of Zerodha Instruments!!')
});