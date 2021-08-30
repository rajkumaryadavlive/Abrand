const moment = require("moment");
const crypto = require('crypto');
const { createWalletHelper,checkWalletPrivateHelper, hashStatus,
     AdminCoinTransfer,
       balanceMainETH,
    coinBalanceETH,
    usdBalanceUSD,
    hashStatusETH
    } = require('../helper/ethHelper');
const { Registration, Userwallet, RefCode, Importwallet } = require('../models/userModel');
const {Tokendetails} = require('../models/userModel');


const createWallet = async () => {
    let newData = await createWalletHelper();
    if(newData){
        return newData;
    }
};

const createHash = async (user_passphrase) => {
    let hash = crypto.createHash('sha256').update(user_passphrase).digest('base64');
    if(hash){
        return hash;
    }
};

const checkWalletPrivate = async (pk) => {
    let newData = await checkWalletPrivateHelper(pk);
    if(newData){
        return newData;
    }
};

const userWalletEntry = async (user_id, address, hash, created) => {
    const UserwalletDataObject = {
        user_id: user_id,
        wallet_address: address,
        passphrase: hash,
        created_at: created,
        status: 'active',
        deleted: '0'
    };
    try {
      const userwallet = new Userwallet(UserwalletDataObject);
      await userwallet.save();
      console.log("inside data of user wallet",userwallet)
      return UserwalletDataObject;
    } catch (error) {
      console.log("Error", error.message);
    }
};

const userWalletFindWallet = async (address) => {
    let userwallet = await Userwallet.findOne({'wallet_address': address});
    if(userwallet){
        return userwallet;
    }
};

const checkTxStatus = async (all_transaction) => {
    let tx_length = all_transaction.length;
    for(let i = 0; i < tx_length; i++){
        let hash = all_transaction[i].hash;
        let id = all_transaction[i]._id;
        let type = all_transaction[i].token_type;
        let blockNumber;
        if(type == 'ETH'){
            blockNumber = await hashStatusETH(hash);
            if(blockNumber){
                await Tokendetails.update({'_id': id}, {$set: { 'payment_status': 'paid', 'block_id': blockNumber }});
            }
        }
        else{
            blockNumber = await hashStatus(hash);
            if(blockNumber){
                await Tokendetails.update({'_id': id}, {$set: { 'payment_status': 'paid', 'block_id': blockNumber }});
            }
        }
    }
}

const ethRate = async () => {
    var config = {
      method: 'get',
      url: 'https://api.probit.com/api/exchange/v1/ticker?market_ids=ETH-USDT',
      headers: { 
        'Content-Type': 'application/json'
      },
    };
    let response = await axios(config);
    let value = 1/response.data.data[0].last;
    value = value.toString();
    return value;
}

const importWalletFindId = async (id) => {
    let importwallet = await Importwallet.findOne({'user_id': id,'login_status':'login'});
    console.log("iddd",id)
    if(importwallet){
        return importwallet;
    }
};

const importWalletEntry = async (user_id, id, created) => {
    const importwalletDataObject = {
        user_id: user_id,
        wallet_id: id,
        login_status: 'login',
        created_at: created,
        status: 'active',
        deleted: '0'
    };
    try {
      const importwallet = new Importwallet(importwalletDataObject);
      await importwallet.save();
      return importwalletDataObject;
    } catch (error) {
      console.log("Error", error.message);
    }
};

const userWalletFindId = async (id) => {
    let userwallet = await Userwallet.findOne({'_id': id});
    if(userwallet){
        return userwallet;
    }
};

const findTransactions = async (address) => {
    let transactions  = await Tokendetails.find({ $or: [{ 'receiver_wallet_address': address }, { 'sender_wallet_address': address }] }).sort([['auto', -1]]).exec();
    if(transactions){
        return transactions;
    }
};

const findTransactionsDate = async (address, date) => {
    let created_at = moment(date).format('YYYY-MM-DD');
    console.log(created_at);
    let transactions  = await Tokendetails.find({ "created_at": created_at, $or: [{ 'receiver_wallet_address': address }, { 'sender_wallet_address': address }] }).sort([['auto', -1]]).exec();
    if(transactions){
        return transactions;
    }
};

const addTransaction = async (user_id, wallet_id, sender_address, reciver_address, hash, get_amount, type) => {
    let respcount = await Tokendetails.count();
    let count_val = parseFloat(respcount) + parseFloat(1);
    let created_at = moment().format('YYYY-MM-DD');
    const TransactionDataObject = {
        auto: count_val,
        user_id: user_id,
        wallet_id: wallet_id,
        sender_wallet_address: sender_address,
        receiver_wallet_address: reciver_address,
        hash: hash,
        amount: get_amount,
        payment_status: 'pending',
        created_at: created_at,
        status: 'active',
        token_type: type,
        transaction_type: 'Send'
    };
    try {
      const transactionData = new Tokendetails(TransactionDataObject);
      await transactionData.save();
      return TransactionDataObject;
    } catch (error) {
      console.log("Error", error.message);
    }
};

const getCoinBalance = async (account) => {
    let balance;
    try {
        balance = await coinBalanceBNB(account);
    } catch (error) {
        balance = 0;
    }
    return balance;
};

const getBalance = async (account) => {
    let balance;
    try {
        balance = await balanceMainBNB(account);
    } catch (error) {
        balance = 0;
    }
    return balance;
};



module.exports = {
    createWallet,
    createHash,
    userWalletEntry,
    checkWalletPrivate,
    userWalletFindWallet,
    checkTxStatus,
    ethRate,
    importWalletFindId,
    importWalletEntry,
    userWalletFindId,
    findTransactions,
    findTransactionsDate,
    getCoinBalance,
    addTransaction,
    getBalance,
    
};