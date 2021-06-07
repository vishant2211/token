"use strict";

const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const http = require('http').Server(app);
const cors = require('cors');
app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }));
app.options('*', cors())
const angelSymbols = require('./instruments/angelToken.js');
const zerodhaSymbols = require('./instruments/zerodhaToken.js');

function getExchangeName(exch_seg) {
    let exch;
    switch (exch_seg) {
        case `NSE`:
            exch = `nse_cm`
            break;
        case `BSE`:
            exch = `bse_cm`
            break;
        case `NFO`:
            exch = `nse_fo`
            break;
        case `MCX`:
            exch = `mcx_fo`
            break;
        case `NCDEX`:
            exch = `ncx_fo`
            break;
        case `CDS`:
            exch = `cde_fo`
            break;
    }
    return exch;
}
app.post('/getToken', function (req, res) {
    let broker = req.query['broker'];
    let tradingsymbol = req.query['tradingsymbol'];
    let tokenData
    let token = [];
    switch (broker) {
        case "angel":
            tokenData = angelSymbols.filter((i) => {
                if (Array.isArray(req.body['symbol']) && req.body['symbol'].length > 0 && req.body['symbol'].indexOf(i.symbol) >= 0) {
                    return i
                } else if (i.symbol == req.body['symbol']) {
                    return i
                }
            })
            if (tokenData && Array.isArray(tokenData)) {
                tokenData.forEach((j) => {
                    token.push(getExchangeName(j.exch_seg) + '|' + j.token)
                })
                token = token.join('&')
            } else {
                token = null
            }
            break;
        case "zerodha":
            tokenData = zerodhaSymbols.filter((i) => {
                if ((i["exchange"] == "NFO" || i["exchange"] == "NSE") && Array.isArray(req.body['symbol']) && req.body['symbol'].length > 0 && req.body['symbol'].indexOf(i.tradingsymbol) >= 0) {
                    return i
                } else if ((i["exchange"] == "NFO" || i["exchange"] == "NSE") && i.tradingsymbol == req.body['symbol']) {
                    return i
                }
            })
            if (tokenData && Array.isArray(tokenData)) {
                tokenData.forEach((j) => {
                    if (tradingsymbol) {
                        token.push({ 'tradingsymbol': j.tradingsymbol, 'instrument_token': parseInt(j.instrument_token) })
                    } else {
                        token.push(parseInt(j.instrument_token))
                    }
                })
            } else {
                token = null
            }
            break;
        default:
            tokenData = angelSymbols.filter((i) => {
                if (Array.isArray(req.body['symbol']) && req.body['symbol'].length > 0 && req.body['symbol'].indexOf(i.symbol) >= 0) {
                    return i
                } else if (i.symbol == req.body['symbol']) {
                    return i
                }
            })
            if (tokenData && Array.isArray(tokenData)) {
                tokenData.forEach((j) => {
                    token.push(getExchangeName(j.exch_seg) + '|' + j.token)
                })
                token = token.join('&')
            } else {
                token = null
            }
    }
    return res.json({ "token": token });
})

http.listen(5080, function () {
    console.log('Opening the Gates with dev settings...');
    console.log('Initialization Done. Gates open on %s port.', 5080);
});
http.timeout = 0;
// let counter = 0
// angelSymbols.filter((i) => {
//     if (i.exch_seg == 'NSE' && i.lotsize == '1' && i.tick_size =="5.000000" ){//&& i.symbol.indexOf('-EQ') != -1) {
//         counter++
//         require('fs').appendFileSync('test.txt',`${i.symbol}\n`)
//     } 
// })