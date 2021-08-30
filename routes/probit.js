const WebSocket = require('ws');
const moment = require('moment');
const { Tokensettings } = require('../models/userModel');

/**************BTC - USDT***************/

const ws = new WebSocket('wss://api.probit.com/api/exchange/v1/ws');

ws.onopen = () => {
  const msg = {
    type: 'subscribe',
    channel: 'marketdata',
    interval: 500,
    market_id: 'BTC-USDT',
    filter: ['ticker']
  };
  ws.send(JSON.stringify(msg));
};

ws.onmessage = async (event) => {
    let body_data = JSON.parse(event.data);
    let token_val = await Tokensettings.findOne();
    let updated_at = moment(new Date()).format('YYYY-MM-DD');    
    if(body_data.status == "ok" && body_data.ticker && body_data.ticker.last ){
        await Tokensettings.updateOne({'_id':token_val._id}, {$set: { 
            'btcValue': Math.round((parseFloat(token_val.usdValue)*(1 / parseFloat(body_data.ticker.last)))*1000000000)/1000000000, 
            'updated_at' : updated_at }
        });
    } 
};

/**************ETH - USDT***************/

const ws1 = new WebSocket('wss://api.probit.com/api/exchange/v1/ws');

ws1.onopen = () => {
    const msg = {
      type: 'subscribe',
      channel: 'marketdata',
      interval: 500,
      market_id: 'ETH-USDT',
      filter: ['ticker']
    };
    ws1.send(JSON.stringify(msg));
  };
  
  ws1.onmessage = async (event) => {
    let body_data = JSON.parse(event.data);
    let token_val = await Tokensettings.findOne();
    let updated_at = moment(new Date()).format('YYYY-MM-DD');  
    if( body_data.status == "ok" && body_data.ticker && body_data.ticker.last){
        await Tokensettings.updateOne({'_id':token_val._id}, {$set: { 
            'etherValue': Math.round((parseFloat(token_val.usdValue)*(1 / parseFloat(body_data.ticker.last)))*1000000000)/1000000000, 
            'updated_at' : updated_at }
        });
    } 
};


/**************XRP - USDT***************/

const ws2 = new WebSocket('wss://api.probit.com/api/exchange/v1/ws');

ws2.onopen = () => {
  const msg = {
    type: 'subscribe',
    channel: 'marketdata',
    interval: 500,
    market_id: 'XRP-USDT',
    filter: ['ticker']
  };
  ws2.send(JSON.stringify(msg));
};

ws2.onmessage = async (event) => {
    let body_data = JSON.parse(event.data);
    let token_val = await Tokensettings.findOne();
    let updated_at = moment(new Date()).format('YYYY-MM-DD');    
    if(body_data.status == "ok" && body_data.ticker && body_data.ticker.last ){
        await Tokensettings.updateOne({'_id':token_val._id}, {$set: { 
            'xrpValue': Math.round((parseFloat(token_val.usdValue)*(1 / parseFloat(body_data.ticker.last)))*1000000000)/1000000000, 
            'updated_at' : updated_at }
        });
    }     
};

/**************LTC - USDT***************/

const ws3 = new WebSocket('wss://api.probit.com/api/exchange/v1/ws');

ws3.onopen = () => {
  const msg = {
    type: 'subscribe',
    channel: 'marketdata',
    interval: 500,
    market_id: 'LTC-USDT',
    filter: ['ticker']
  };
  ws3.send(JSON.stringify(msg));
};

ws3.onmessage = async (event) => {
    let body_data = JSON.parse(event.data);
    let token_val = await Tokensettings.findOne();
    let updated_at = moment(new Date()).format('YYYY-MM-DD');    
    if(body_data.status == "ok" && body_data.ticker && body_data.ticker.last ){
        await Tokensettings.updateOne({'_id':token_val._id}, {$set: { 
            'ltcValue': Math.round((parseFloat(token_val.usdValue)*(1 / parseFloat(body_data.ticker.last)))*1000000000)/1000000000, 
            'updated_at' : updated_at }
        });
    }      
};

/**************DASH - USDT***************/

const ws4 = new WebSocket('wss://api.probit.com/api/exchange/v1/ws');

ws4.onopen = () => {
  const msg = {
    type: 'subscribe',
    channel: 'marketdata',
    interval: 500,
    market_id: 'DASH-USDT',
    filter: ['ticker']
  };
  ws4.send(JSON.stringify(msg));
};

ws4.onmessage = async (event) => {
    let body_data = JSON.parse(event.data);
    let token_val = await Tokensettings.findOne();
    let updated_at = moment(new Date()).format('YYYY-MM-DD');    
    if(body_data.status == "ok" && body_data.ticker && body_data.ticker.last ){
        await Tokensettings.updateOne({'_id':token_val._id}, {$set: { 
            'dashValue': Math.round((parseFloat(token_val.usdValue)*(1 / parseFloat(body_data.ticker.last)))*1000000000)/1000000000, 
            'updated_at' : updated_at }
        })
    }     
};

/**************BNB - USDT***************/

const ws5 = new WebSocket('wss://api.probit.com/api/exchange/v1/ws');

ws5.onopen = () => {
  const msg = {
    type: 'subscribe',
    channel: 'marketdata',
    interval: 500,
    market_id: 'BNB-USDT',
    filter: ['ticker']
  };
  ws5.send(JSON.stringify(msg));
};

ws5.onmessage = async (event) => {
    let body_data = JSON.parse(event.data);
    let token_val = await Tokensettings.findOne();
    let updated_at = moment(new Date()).format('YYYY-MM-DD');    
    if(body_data.status == "ok" && body_data.ticker && body_data.ticker.last ){
        await Tokensettings.updateOne({'_id':token_val._id}, {$set: { 
            'bnbValue': Math.round((parseFloat(token_val.usdValue)*(1 / parseFloat(body_data.ticker.last)))*1000000000)/1000000000, 
            'updated_at' : updated_at }
        })
    }     
};

/**************DOGE - USDT***************/

const ws6 = new WebSocket('wss://api.probit.com/api/exchange/v1/ws');

ws6.onopen = () => {
  const msg = {
    type: 'subscribe',
    channel: 'marketdata',
    interval: 500,
    market_id: 'DOGE-USDT',
    filter: ['ticker']
  };
  ws6.send(JSON.stringify(msg));
};

ws6.onmessage = async (event) => {
    let body_data = JSON.parse(event.data);
    let token_val = await Tokensettings.findOne();
    let updated_at = moment(new Date()).format('YYYY-MM-DD');    
    if(body_data.status == "ok" && body_data.ticker && body_data.ticker.last ){
        await Tokensettings.updateOne({'_id':token_val._id}, {$set: { 
            'dogeValue': Math.round((parseFloat(token_val.usdValue)*(1 / parseFloat(body_data.ticker.last)))*1000000000)/1000000000, 
            'updated_at' : updated_at }
        })
    }     
};

/**************POLKA - USDT***************/

const ws7 = new WebSocket('wss://api.probit.com/api/exchange/v1/ws');

ws7.onopen = () => {
  const msg = {
    type: 'subscribe',
    channel: 'marketdata',
    interval: 500,
    market_id: 'DOT-USDT',
    filter: ['ticker']
  };
  ws7.send(JSON.stringify(msg));
};

ws7.onmessage = async (event) => {
    let body_data = JSON.parse(event.data);
    let token_val = await Tokensettings.findOne();
    let updated_at = moment(new Date()).format('YYYY-MM-DD');    
    if(body_data.status == "ok" && body_data.ticker && body_data.ticker.last ){
        await Tokensettings.updateOne({'_id':token_val._id}, {$set: { 
            'polkaValue': Math.round((parseFloat(token_val.usdValue)*(1 / parseFloat(body_data.ticker.last)))*1000000000)/1000000000, 
            'updated_at' : updated_at }
        })
    }     
};

/**************TRON - USDT***************/

const ws8 = new WebSocket('wss://api.probit.com/api/exchange/v1/ws');

ws8.onopen = () => {
  const msg = {
    type: 'subscribe',
    channel: 'marketdata',
    interval: 500,
    market_id: 'TRX-USDT',
    filter: ['ticker']
  };
  ws8.send(JSON.stringify(msg));
};

ws8.onmessage = async (event) => {
    let body_data = JSON.parse(event.data);
    let token_val = await Tokensettings.findOne();
    let updated_at = moment(new Date()).format('YYYY-MM-DD');    
    if(body_data.status == "ok" && body_data.ticker && body_data.ticker.last ){
        await Tokensettings.updateOne({'_id':token_val._id}, {$set: { 
            'tronValue': Math.round((parseFloat(token_val.usdValue)*(1 / parseFloat(body_data.ticker.last)))*1000000000)/1000000000, 
            'updated_at' : updated_at }
        })
    }     
};

/**************XLM - USDT***************/

const ws9 = new WebSocket('wss://api.probit.com/api/exchange/v1/ws');

ws9.onopen = () => {
  const msg = {
    type: 'subscribe',
    channel: 'marketdata',
    interval: 500,
    market_id: 'XLM-USDT',
    filter: ['ticker']
  };
  ws9.send(JSON.stringify(msg));
};

ws9.onmessage = async (event) => {
    let body_data = JSON.parse(event.data);
    let token_val = await Tokensettings.findOne();
    let updated_at = moment(new Date()).format('YYYY-MM-DD');    
    if(body_data.status == "ok" && body_data.ticker && body_data.ticker.last ){
        await Tokensettings.updateOne({'_id':token_val._id}, {$set: { 
            'xlmValue': Math.round((parseFloat(token_val.usdValue)*(1 / parseFloat(body_data.ticker.last)))*1000000000)/1000000000, 
            'updated_at' : updated_at }
        })
    }     
};