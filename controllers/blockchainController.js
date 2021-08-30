const { compareSync } = require("bcryptjs");
const userServices = require("../services/userServices");
const blockchainServices = require("../services/blockchainServices");
const { mail } = require('../helper/mailer');
const {AdminCoinTransfer} = require('../helper/ethHelper');

// const { balanceMainBNB, coinBalanceBNB, BNBTransfer, CoinTransfer, AdminCoinTransfer } = require('../helper/bscHelper');

const { balanceMainETH, ETHTransfer } = require('../helper/ethHelper');

const signupReward = '10';
const referReward = '10';
const coinFees = '1';
const adminAddress = process.env.ADMIN;


const createWallet = async (req, res) => {
    let err_msg = req.flash('err_msg');
    let success_msg = req.flash('success_msg');
    let passphrase = "";
    let test = req.session.is_user_logged_in;
    if (test != true) {
        res.redirect('/login');
    }
    else {
        let passphraseNew = await blockchainServices.createWallet();
        if (passphraseNew) {
            console.log("system",passphrase)
            passphrase = passphraseNew;
        }
        res.render('dash-private-key', { err_msg, success_msg, passphrase, layout: false, session: req.session });
    }
}

const verifyWallet = async (req, res) => {
    let user_passphrase = req.body.passphrase;
    let err_msg = req.flash('err_msg');
    let success_msg = req.flash('success_msg');
    let test = req.session.is_user_logged_in;
    if (test != true) {
        res.redirect('/login');
    } else {
        res.render('verify-private-key', { err_msg, success_msg, user_passphrase, layout: false, session: req.session });
    }
}


// const submitWallet = async (req, res) => {
//     let user_id = req.session.re_us_id;
//     let user_passphrase = req.body.passphrase.trim();
//     let check_passphrase = req.body.check_key.trim();
//     let hash = await blockchainServices.createHash(user_passphrase);
//     if (user_passphrase == check_passphrase) {
//         let created = await userServices.createAtTimer();
//         let address = await blockchainServices.checkWalletPrivate(user_passphrase);
//         let UserwalletData = await blockchainServices.userWalletEntry(user_id, address, hash, created);
//         if (UserwalletData) {
//             let user = await userServices.checkUserId(user_id);

//             if(user.ref_from){
//                 await AdminCoinTransfer(address, referReward);
//                 let userRefer = await userServices.checkUserReferCode(user.ref_from);
//                 let subject = 'Referral bonus credited.'
//                 let text = 'Hello '+ user.email + ',<br><br>\n\n' +
//                 'Congratulations we have credited your $EBT account by 10 $EBT (worth US$10) as your friend signed up using your referral code!<br><br>\n\n' + 
//                 'Earn more $EBT by referring your friends and stand a chance to win exclusive ebt NFTs !!' + '<br><br>\n\n' + 'Regards,<br>\nTheebt Team<br>\nhttps://ebtico.com';
//                 await mail(user.email, subject, text);
//                 let userReferred = await userServices.checkUserWallet(userRefer._id);
//                 let referAddress = userReferred.wallet_address;
//                 let hashObject = await AdminCoinTransfer(referAddress, referReward);
//                 if(hashObject){
//                     await userServices.refUpdate(user.ref_code, user.ref_from);
//                 }
//             }
//             console.log("reward",signupReward)
//             await AdminCoinTransfer(address, signupReward);
//             let userwallet = await blockchainServices.userWalletFindWallet(address);
//             await blockchainServices.importWalletEntry(user_id, userwallet._id, created)
//             res.redirect('/Create-wallet-success?wallet=' + Buffer.from(address).toString('base64'));
//         }
//         else {
//             req.flash('err_msg', 'Something went wrong.');
//             res.redirect('/Create-wallet-dash');
//         }
        
//     }
//     else {
//         res.redirect('/verify-key');
//     }
// }

const submitWallet = async (req, res) => {
    let user_id = req.session.re_us_id;
    let user_passphrase = req.body.passphrase.trim();
    let check_passphrase = req.body.check_key.trim();
    let hash = await blockchainServices.createHash(user_passphrase);
    if (user_passphrase == check_passphrase) {
        let created = await userServices.createAtTimer();
        let address = await blockchainServices.checkWalletPrivate(user_passphrase);
        let UserwalletData = await blockchainServices.userWalletEntry(user_id, address, hash, created);
        if (UserwalletData) {
                let walletData = blockchainServices.userWalletFindWallet(address);
                let user = await userServices.checkUserId(user_id);
                var sendReward = parseInt(signupReward);
                if(user.ref_from){
                    // let hashObject = await AdminCoinTransfer(address, referReward);
                    sendReward = sendReward + parseInt(referReward);
                    // let hash = hashObject.transactionHash;
                    // await blockchainServices.addTransaction(user_id, walletData._id, adminAddress, address, hash, referReward, 'ebt');
                    let userRefer = await userServices.checkUserReferCode(user.ref_from);
                    let subject = 'Referral bonus credited.'
                    let text = 'Hello '+ user.email + ',<br><br>\n\n' +
                     'Congratulations we have credited your $EBT account by 5 $EBT (worth US$5) as your friend signed up using your referral code!<br><br>\n\n' + 
                     'Earn more $EBT by referring your friends and stand a chance to win exclusive $EBT NFTs !!' + '<br><br>\n\n' + 'Regards,<br>\nTeam Abu Bakar<br>\nhttps://ebtico.com';
                    await mail(user.email, subject, text);
                    let userReferred = await userServices.checkUserWallet(userRefer._id);
                    let referAddress = userReferred.wallet_address;
                    let hashObject2 = await AdminCoinTransfer(referAddress, referReward);
                    let hash2 = hashObject2.transactionHash;
                    await blockchainServices.addTransaction(userRefer._id, userReferred._id, adminAddress, referAddress, hash2, referReward, '$EBT');
                    if(hashObject2){
                        await userServices.refUpdate(user.ref_code, user.ref_from);
                    }
                }
                var sendReward=parseInt(sendReward);
                let finalSend = sendReward.toString();
                console.log(finalSend);
                console.log(address);
                let hashObject3 = await AdminCoinTransfer(address, finalSend);
                console.log(finalSend,'-------------------finalSend',typeof finalSend);
                let hash3 = hashObject3.transactionHash;
                await blockchainServices.addTransaction(user_id, walletData._id, adminAddress, address, hash3, finalSend, '$EBT');
                let userwallet = await blockchainServices.userWalletFindWallet(address);
                await blockchainServices.importWalletEntry(user_id, userwallet._id, created);
                res.redirect('/Create-wallet-success?wallet=' + Buffer.from(address).toString('base64'));
            
            }
            else {
                req.flash('err_msg', 'Something went wrong.');
                res.redirect('/Create-wallet-dash');
            }
        // }
        // else {
        //     req.flash('err_msg', 'Something went wrong.');
        //     res.redirect('/Create-wallet-dash');
        // }
    }
    else {
        res.redirect('/verify-key');
    }
}


// const sendCoin = async (req, res) => {
//     let user_id = req.session.re_us_id;
//     let test = req.session.is_user_logged_in;
//     let otp = Math.floor(Math.random() * 900000) + 100000;
//     let wallet_id = req.body.get_wallet_id.trim();
//     // let user_correct_passphrese = req.body.user_cr_pass.trim();
//     let entered_passphrese = req.body.passphrase.trim();
//     let sender_address = req.body.sender_address.trim();
//     let type = req.body.type.trim();
//     let reciver_address = req.body.reciver_address.trim();
//     let get_amount = req.body.amount_send.trim();
//     let hashnew = await blockchainServices.createHash(entered_passphrese);
//     if (test != true) {
//         res.redirect('/login');
//     }
//     else {
//         let balance = await blockchainServices.getCoinBalance(sender_address);
//         if (balance < parseInt(coinFees)){
//             req.flash('err_msg', "Insufficient ebt fees In Your account.");
//             res.redirect('/Send-ebt?walletid=' + wallet_id + '&type=' + type);
//         }
//         if(type == 'eth'){
//             balance = await balanceMainETH(sender_address);
//         }
//         else if(type == 'bnb'){
//             balance = await balanceMainBNB(sender_address);
//         }
//         if (balance >= get_amount) {
//             if (hashnew == hashnew) {
//                 let balance2 = await balanceMainBNB(sender_address);
//                 if(0.05 > parseInt(balance) && type == 'eth'){
//                     req.flash('err_msg', 'Do not have fees to propose this transaction.');
//                     res.redirect('/Send-ebt?walletid=' + wallet_id + '&type=' + type);
//                 }
//                 else if(0.01 > parseInt(balance) && type == 'bnb'){
//                     req.flash('err_msg', 'Do not have fees to propose this transaction.');
//                     res.redirect('/Send-ebt?walletid=' + wallet_id + '&type=' + type);
//                 }
//                 else if(0.01 > parseInt(balance2) && type == 'ebt'){
//                     req.flash('err_msg', 'Do not have fees to propose this transaction.');
//                     res.redirect('/Send-ebt?walletid=' + wallet_id + '&type=' + type);
//                 }
//                 else{
//                     var send_obj = {
//                         type: type,
//                         sender_address: sender_address,
//                         get_amount: get_amount,
//                         reciver_address: reciver_address,
//                         sender_private_key: entered_passphrese,
//                         wallet_id: wallet_id
//                     }
//                     req.session.send_obj = send_obj;
//                     await userServices.updateUserOTP(user_id, otp);
//                     let subject = 'OTP for withdrawing funds.'
//                     let text = 'Hello '+ req.session.re_usr_email + ',<br><br>\n\n' +
//                         'Your one-time password (OTP) for withdrawal is: <strong>' + otp +
//                         '</strong><br><br>\n\n' + 'This would be valid for only for the next 10 minutes<br><br>\n\n' + 
//                         'If this withdrawal attempt was not made by you it means someone visited your account. It may be an indication you have been the target of a phishing attempt and might want to consider moving your funds to a new wallet.' + '<br><br>\n\n' + 'Regards,<br>\nTeam THEebt<br>\nhttps://ebtico.com';
//                     await mail(req.session.re_usr_email, subject, text);
//                     res.redirect('/verify_2fa');
//                 }
//             }
//             else {
//                 req.flash('err_msg', 'Please enter valid passphrase.');
//                 res.redirect('/Send-ebt?walletid=' + wallet_id + '&type=' + type);
//             }
//         }
//         else {
//             req.flash('err_msg', "Insufficient "+type+" In Your account.");
//             res.redirect('/Send-ebt?walletid=' + wallet_id + '&type=' + type);
//         }
//     }
// }


module.exports = {
    createWallet,
    verifyWallet,
    submitWallet,
    // sendCoin
};