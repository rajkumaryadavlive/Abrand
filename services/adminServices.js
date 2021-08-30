const moment = require('moment');

const Tx = require('ethereumjs-tx').Transaction;
const Common = require('ethereumjs-common');
const { AdminInfo } = require('../models/admin');
const { Registration, Userwallet, Importwallet, Tokensettings, Tokendetails, OrderDetails, RefCode, FAQ, ContactInfo } = require('../models/userModel');
const bscHelper = require("../helper/bscHelper");
const blockchainServices = require("../services/blockchainServices");
// const ethHelper = require("../helper/ethHelper");
const { balanceMainETH, coinBalanceETH , usdBalanceUSD,  createWalletHelper,
    AdminCoinTransfer,
    checkWalletPrivateHelper,
    hashStatusETH,
    hashStatus } = require('../helper/ethHelper');
const { referData } = require('./userServices');

const findAdmin = async (email) => {
    let user = await AdminInfo.findOne({ 'email': email });
    if (user) {
        return user;
    }
    else {
        return 'notAdmin'
    }
};

const adminAddress = process.env.ADMIN;

const checkAdminPass = async (email, password) => {
    let user = await AdminInfo.findOne({ 'email': email, 'password': password });
    if (user) {
        return user;
    }
    else {
        return 'wrongPassword'
    }
};

const checkAdminId = async (user_id) => {
    let user = await AdminInfo.findOne({ '_id': user_id });
    if (user) {
        return user;
    }
};

const createSession = async (req, admin) => {
    req.session.user_main_id = admin._id;
    req.session.user_name = admin.name;
    req.session.profile_image = admin.profile_image;
    req.session.re_usr_email = admin.email;
    req.session.user_type = admin.user_type;

    /*******Call save function to store****/

    req.session.save(function (err, res) {
        console.log('saved?!');
        //console.log(`Error`, err)
        //console.log(`Session`, res)
        return req.session
    });
};

const activateUser = async (req, res) => {
    var user_id = req.query.id.trim();
    console.log("activateUser-54", user_id)
    Registration.updateOne({ 'email': user_id }, { $set: { 'status': 'active' } }, { upsert: true }, function (err, result) {
        if (err) { console.log(err); }
        else {
            req.flash('success_msg', 'User has been activated successfully.');
            res.redirect('/user-list');
        }
    })
}

// const VerifyOrder = async (req, res) => {
//     var Order_id = req.query.id.trim();
//     var user_id;
//     var totalEBT;
//     var user_wallet_address;

//     console.log("Order_id", Order_id)

//     OrderDetails.updateOne({ '_id': Order_id }, { $set: { 'payment_status': 'Paid' } }, { upsert: true }, function (err, result) {
//         if (err) { console.log(err); }
//         else {
//             // OrderDetails.find({'_id': Order_id }  )
//              OrderDetails.findOne({'_id': Order_id}).then(OrderDetails => {
//                 console.log("abbbbbb",OrderDetails)
//                totalEBT = OrderDetails.ebt_count;
//                user_id = OrderDetails.user_id;
//                user_wallet_address = OrderDetails.sender_wallet_address;
//                console.log("user wallet", user_wallet_address)
//                console.log("user_id", OrderDetails.user_id)
                                                    
//             });       
//         }
//     })
//     let walletData = blockchainServices.userWalletFindWallet(user_wallet_address);
//         let abc = "123";
//         let finalSend = abc.toString();
//         // let finalSend = totalEBT.toString();
//         // let hashObject3 = await AdminCoinTransfer(user_wallet_address, finalSend);
//         console.log(finalSend,'-------------------finalSend',typeof finalSend);
//         let hash3 = hashObject3.transactionHash;
//         await blockchainServices.addTransaction(user_id, walletData._id, adminAddress, user_wallet_address, hash3, finalSend, '$EBT');
//         let userwallet = await blockchainServices.userWalletFindWallet(user_wallet_address);
//         await blockchainServices.importWalletEntry(user_id, userwallet._id, created);      
//               console.log("done")
//               req.flash('success_msg', 'Order has been verified successfully.');
//               res.redirect('/order-history');
// }

const VerifyOrder = async (req, res) => {
    var Order_id = req.query.id.trim();
    var totalEBT;
    var address ;

    console.log("Order_id", Order_id)
    OrderDetails.updateOne({ '_id': Order_id }, { $set: { 'payment_status': 'Paid' } }, { upsert: true },  function (err, result) {
        OrderDetails.findOne({'_id': Order_id}).then( async OrderDetails => {
         totalEBT = OrderDetails.ebt_count;
            user_id = OrderDetails.user_id;
            address = OrderDetails.sender_wallet_address;
            console.log("user wallet", address,totalEBT)
            console.log("user_id", OrderDetails.user_id)
            let sendebt = parseFloat(totalEBT);
            let finalSend = sendebt.toString();
            // let finalSend = '153';
            console.log("address-", address, finalSend)
            let hashObject3 = await AdminCoinTransfer(address, finalSend);
            console.log(finalSend,'----------finalSend',typeof finalSend);
            let hash3 = hashObject3.transactionHash;
            await blockchainServices.addTransaction(user_id, Userwallet._id, adminAddress, address, hash3, finalSend, '$EBT');
            // let userwallet = await blockchainServices.userWalletFindWallet(address);
            // await blockchainServices.importWalletEntry(user_id, userwallet._id, created);
            req.flash('success_msg', 'Order has been verified successfully.');
            // res.redirect('/order-history?wallet=' + Buffer.from(address).toString('base64'));

            res.redirect('/order-history');
        });
    })
    // let sendebt = parseInt(totalEBT);
    // let finalSend = sendebt.toString();
}


const deactivateUser = async (req, res) => {
    var user_id = req.query.id.trim();
    console.log("deactivateUser-65", user_id)
    Registration.updateOne({ 'email': user_id }, { $set: { 'status': 'inactive' } }, { upsert: true }, function (err, result) {
        if (err) { console.log(err); }
        else {
            req.flash('success_msg', 'User has been deactivated successfully.');
            res.redirect('/user-list');
        }
    })
}


const EBTSold = async (admin_bal) => {

    const total_EBT = 1000000000000000000000000000000000;
    const total = parseFloat(total_EBT) / Math.pow(10, 18);
    const ebtSold = total - admin_bal
    return ebtSold
}

const totalEBTRewardsDestributed = async (total_users_s) => {
    let reffers = await RefCode.count({})
    let rewardsDistributed = (total_users_s * 10) + (reffers * 5)
    return rewardsDistributed
}

const usersRegisteredThisMonth = async () => {
    let result = 0

    var month = moment(new Date()).format('M');
    var year = moment(new Date()).format('YYYY');
    console.log(month, year)
    var min = moment(new Date(`${month}/1/${year}`)).format('M/D/YYYY');
    var max = moment(new Date()).format('M/D/YYYY');
    console.log(min, max);
    await Registration.count({ deleted: '0', created_at: { $gte: min + ', 00:00:00 AM', $lte: max + ', 12:59:59 PM' } }).sort({ _id: -1 }).lean().then(async (results) => {
        if (results > 0) {
            console.log("usersRegisteredThisMonth", results)
            result = results
        }
    })
    return result
}


module.exports = {
    checkAdminPass,
    findAdmin,
    checkAdminId,
    createSession,
    activateUser,
    VerifyOrder,
    deactivateUser,
    EBTSold,
    totalEBTRewardsDestributed,
    usersRegisteredThisMonth
}
