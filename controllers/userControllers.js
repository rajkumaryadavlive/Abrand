const { compareSync } = require("bcryptjs");
const moment = require('moment');
const request = require('request');
const crypto = require('crypto');
const { mail } = require('../helper/mailer');
const { calculateHours } = require('../helper/userHelper');
const userServices = require("../services/userServices");
const blockchainServices = require("../services/blockchainServices");
const { balanceMainBNB, coinBalanceBNB } = require('../helper/bscHelper');
const { balanceMainETH, coinBalanceETH , usdBalanceUSD,  createWalletHelper,
    AdminCoinTransfer,
    checkWalletPrivateHelper,
    hashStatusETH,
    hashStatus } = require('../helper/ethHelper');
const {Tokendetails,Tokensettings} = require('../models/userModel');


const sessionHeader = async (req, res, next) => {
    
    res.locals.session = req.session;
    let user_id = res.locals.session.re_us_id;
    let result = userServices.checkUserId(user_id);
    if (result) {
        res.locals.greet = function () {
            return result;
        }
        res.set('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
        next();
    }
    else {
        return null;
    }
}

const logout = async (req, res) => {
    req.session.destroy();
    res.redirect('/login');
}

const landingPage = async (req, res) => {
    let rates = await userServices.getRates();
    if (rates) {
        res.render('front/index', {
            token_values: rates
        });
    }
    else {
        res.render('front/index');
    }
}

const transactionManagement = async function (req, res) {
    var profile_pic = req.session.profile;
    var first_name = req.session.name;
    var admin_id = req.session.admin_id;
    success_msg = req.flash('success_msg');
    err_msg = req.flash('err_msg');
    let userTransaction = [];
    let userTransInfo = {
        username: "",
        credit: "",
        debit: "",
        date: "",
        userId: '',
        status:""
    }
    try {
       
        // let dollarPrice= priceOfXLM['XLMUSDT']; 
     let transactionData = await transactionSchema.find({}).sort({_id:-1});
  // console.log(transactionSchema);
     // let transactionData = await transactionSchema.find({});
    // console.log("TransData:::::::::",transactionData);
         let k=0;
        for (let i = 0; i < transactionData.length; i++) {
            let userDet=await Registration.findOne({_id:transactionData[i].userId});
            let user_name='';
            if(userDet){
             user_name=userDet.name;
           
            }else{
               // continue;
               user_name="Unknown"
            }
               if(transactionData[i].operation=='Send'||transactionData[i].operation=='Sell'){
                    userTransInfo.debit=transactionData[i].amount+transactionData[i].coinname;
                    userTransInfo.credit='';
               }else{
                userTransInfo.credit=transactionData[i].amount+transactionData[i].coinname;
                userTransInfo.debit='';
               }
            userTransInfo.username=user_name;
          
           // let date=;
        //    var now = new Date(transactionData[i].date);
            var dt = dateTime.create(transactionData[i].date);
            var trans_date = dt.format('d/m/Y');
            userTransInfo.date=trans_date;
            userTransInfo.userId=transactionData[i].userId;
            userTransInfo.status=transactionData[i].status;
            userTransaction[k] = userTransInfo;
            userTransInfo={};
            k++;
        }
        res.render('admin/front-admin/admin-transaction-table', {
            // wallet_list     :   WALLET_LIST_DATA,
            userTransaction,
            profile_pic,
            first_name,
            success_msg,
            err_msg
        })
    } catch (err) {
        console.log(err);
        throw err;
    }
}

const dashboardPage = async (req, res) => {
    console.log("Welcome to dashboard")
    let err_msg = req.flash('err_msg');
    let success_msg = req.flash('success_msg');
    let test = req.session.is_user_logged_in;
    if (test != true) {
        res.redirect('/Login');
    }
    else {
        let user_id = req.session.re_us_id;
        let user_wallet = req.session.wallet;
        let user = await userServices.checkUserId(user_id);
        let ref_code = user.ref_code;
        let rates = await userServices.getRates();
        let usdValue = rates.usdValue;
        let etherValue = rates.etherValue;
        // let btcValue = rates.btcValue;
        // let bnbValue = rates.bnbValue;
        let loginwallet = await blockchainServices.importWalletFindId(user_id);
        console.log("login wallet",loginwallet)
        if (loginwallet) {
            let result = await blockchainServices.userWalletFindId(loginwallet.wallet_id);
            console.log("in dashboard results",result)
            if (result) {
                req.session.wallet = true;
                let wallet_creation = result.created_at;
                let today = await userServices.createAtTimer();
                let wallet_time_difference = calculateHours(new Date(wallet_creation), new Date(today));
                wallet_details = result;
                import_wallet_id = loginwallet._id;
                let all_transaction = await blockchainServices.findTransactions(wallet_details.wallet_address);
                await blockchainServices.checkTxStatus(all_transaction);
                all_transaction = await blockchainServices.findTransactions(wallet_details.wallet_address);
                let balance = await blockchainServices.getCoinBalance(wallet_details.wallet_address);
                let rown_bal = balance;
                // let bnbBalance = await balanceMainBNB(wallet_details.wallet_address);
                let ethBalance = await balanceMainETH(wallet_details.wallet_address);
                let coinbalance = await coinBalanceETH(wallet_details.wallet_address);
                // let usdbalance = await usdBalanceUSD(wallet_details.wallet_address);
                let usd_value = Math.round(usdValue * coinbalance * 100) / 100;
                let usd_actual = (1 / parseFloat(usdValue)) * coinbalance;
                // let bnb_value = (1 / parseFloat(bnbValue)) * bnbBalance;
                let eth_value = (1 / parseFloat(etherValue)) * ethBalance;
                let full_value = coinbalance + eth_value;
                full_value = Math.round(full_value * 100) / 100;
                // res.render('dashboard', { err_msg, success_msg, ref_code, wallet_details, usdValue, etherValue, btcValue, bnbValue, import_wallet_id, balance, rown_bal, layout: false, session: req.session, crypto, all_transaction, wallet_time_difference, moment, bnbBalance, coinbalance, usd_value, ethBalance, full_value });
                res.render('front/dashboard', { err_msg, success_msg, ref_code, wallet_details, usd_value,  full_value, usdValue, ethBalance, etherValue, import_wallet_id, balance, rown_bal, layout: false, session: req.session, crypto, all_transaction, wallet_time_difference, moment, coinbalance, usd_value,});
            
            }
        }
        else {
            // let usd_value = 0;
            // let bnbBalance = 0;
            // let ethBalance = 0;
            // let coinbalance = 0;
            // res.render('front/dashboard', { err_msg, success_msg, ref_code, wallet_details, usdValue, etherValue, btcValue, bnbValue, import_wallet_id, rown_bal, layout: false, session: req.session, crypto, all_transaction: [], coinbalance, bnbBalance, usd_value, ethBalance });
            req.session.wallet = false;
            res.redirect('create-wallet');
        }
    }
}

const loginPage = async (req, res) => {
    let err_msg = req.flash('err_msg');
    let success_msg = req.flash('success_msg');
    let test = req.session.is_user_logged_in;
    if (test == true) {
        res.redirect('/dashboard');
    }
    else {
        res.render('front/login', { err_msg, success_msg, layout: false, session: req.session });
    }
}


const sendPage = async (req, res) => {
    res.render('send-EBT')  
}

const signupPage = async (req, res) => {
        let err_msg = req.flash('err_msg');
        let success_msg = req.flash('success_msg');
        let ref_link = "";
        if (req.body.ref_link != "" && req.body.ref_link != undefined) {
            ref_link = req.body.ref_link.trim();
        }
        let test = req.session.is_user_logged_in;
        if (test == true) {
            res.redirect('/dashboard');
        } else {
            if (req.query.code) {
                res.render('front/signup', { err_msg, success_msg, layout: false, session: req.session, ref_link: req.query.code });
            } else {
                res.render('front/signup', { err_msg, success_msg, layout: false, session: req.session, ref_link: '' });
            }
        }
    
}

const forgotPage = async (req, res) => {
        let err_msg = req.flash('err_msg');
        let success_msg = req.flash('success_msg');
        var test = req.session.is_user_logged_in;
        if (test == true) {
            res.redirect('/dashboard');
        }
        else {
            res.render('forgot-pass', { err_msg, success_msg, layout: false, session: req.session, });
        }
}

const submitUser = async (req, res) => {
    // if(req.body['g-recaptcha-response'] == undefined || req.body['g-recaptcha-response'] == '' || req.body['g-recaptcha-response'] == null){
    //     req.flash('err_msg', 'Please select captcha first.');
    //     res.redirect('/Signup');
    // }
    // else{
    //     const secretKey = "6LcQx_AaAAAAAJmTY794kuLiHyURsR_uu-4Wqixg";

    //     const verificationURL = "https://www.google.com/recaptcha/api/siteverify?secret=" + secretKey + "&response=" + req.body['g-recaptcha-response'] + "&remoteip=" + req.connection.remoteAddress;
    
    //     request(verificationURL, async function(error, response, body2) {
    //         let body = JSON.parse(body2);
    
    //         if(error && !body.success) {
    //             req.flash('err_msg', 'Failed captcha verification.');
    //             res.redirect('/Signup');
    //         }else{
                let user = await userServices.checkUser(req.body.email);
                if (user) {
                    req.flash('err_msg', 'Email already exists. Please enter another email.');
                    res.redirect('/Signup');
                }
                else {
                    console.log(req.body.ref_link, '===========req.body.ref_link');
                    let ref_link;
                    if (req.body.ref_link != "" && req.body.ref_link != undefined) {
                        ref_link = req.body.ref_link.trim();
                    } else {
                        ref_link = "";
                    }
                    if (req.body.password == req.body.conf_pass) {
                        let mystr = await userServices.createCipher(req.body.password);
                        let created = await userServices.createAtTimer();
                        await userServices.addUser(req.body, ref_link, mystr, created, 'pending');
                        let user = await userServices.checkUser(req.body.email);
                        if (ref_link != "") {
                            let refData = await userServices.referData(user.ref_code, ref_link, user._id, created);
                        }
                        req.session.success = true;
                        req.session.re_us_id = user._id;
                        req.session.re_usr_name = user.name;
                        req.session.re_usr_email = user.email;
                        req.session.is_user_logged_in = false;
                        let otp = user.otp;
                        let subject = 'OTP for your new account on The Abu Bakar website';
                        let text = 'Hello '+ req.body.email + ',<br><br>\n\nCongratulations on signing up with The Abu Bakar website!<br><br>\n\n' +
                        'Your one-time password (OTP) for signing up is: <strong>' + otp +  '</strong>. This would be valid only for the next 10 minutes.' +
                        // '<br><br>\n\nOnce you enter the OTP and create a new wallet, we will credit it by 10 $EBT (worth US$10)  as a limited-time joining bonus.<br><br>\n\n' + 
                        // 'Moreover, you can earn more by referring your friends and earn US$5 equivalent $EBT tokens every time your friend joins by using your referral code. Your friend will also get US$5 equivalent $EBT tokens for using your referral code !<br><br>\n\n' +
                        'Time: ' + created + '<br><br>\n\n'
                        'If this withdrawal attempt was not made by you it means someone visited your account. It may be an indication you have been the target of a phishing attempt and might want to consider moving your funds to a new wallet.' + '<br><br>\n\n' + 'Regards,<br>\nTeam The Abu Bakar<br>\nhttps://ebtico.com';
                        try{
                        await mail(req.body.email, subject, text);
                    }catch(exp){
                        console.log("exceptionss",exp);
                    }
                        req.flash('success_msg', 'User registered. Please verify to continue.');
                        res.redirect('/verify-account');
                    }
                    else {
                        req.flash('err_msg', 'Password does not match.');
                        res.redirect('/signup');
                    }
                }
    //         }
    //     })
    // }
}


const verifyPage = async (req, res) => {
            let err_msg = req.flash('err_msg');
            let success_msg = req.flash('success_msg');
            var test = req.session.is_user_logged_in;
            if (test == true) {
                res.redirect('/dashboard');
            } else {
                res.render('front/verify-account', { err_msg, success_msg, layout: false, session: req.session })
            }
}
    

const walletSuccess = async (req, res) => {
    let err_msg = req.flash('err_msg');
    let success_msg = req.flash('success_msg');
    let wallet_address = "";
    let test = req.session.is_user_logged_in;
    if (test != true) {
        res.redirect('/login');
    }
    else {
        if (req.query.wallet) {
            wallet_address = Buffer.from(req.query.wallet, 'base64').toString('ascii');
        }
        res.render('front/wallet-success', { err_msg, success_msg, wallet_address, layout: false, session: req.session, });
    }
}

const referral = async (req, res) => {
    let err_msg = req.flash('err_msg');
    let success_msg = req.flash('success_msg');
    var test = req.session.is_user_logged_in;
    if (test == true) {
        let user_id = req.session.re_us_id;
        let user = await userServices.checkUserId(user_id);
        let ref_code = user.ref_code;
        let referrals = await userServices.findReferData(ref_code);

        res.render('front/referral-table', { err_msg, success_msg, layout: false, ref_code, session: req.session, referrals})
    } else {
        res.redirect('/login');

    }
}


// const submitUser = async (req, res) => {
    
//    let user = await userServices.checkUser(req.body.email);
//    console.log(req.body)
//             if (user)
//          {
            
//                 req.flash('err_msg', 'Email already exists. Please enter another email.');
//                 res.redirect('/signup');
//             }
            
//         if (req.body.password == req.body.conf_pass) {
//             let mystr = await userServices.createCipher(req.body.password);
//             let created = await userServices.createAtTimer();
//             let new_user=await userServices.addUser(req.body, mystr, created);
//             let user = await userServices.checkUser(req.body.email);
//                     await userServices.addUser(req.body);
//                     let otp = new_user.otp;
//                     req.session.success = true;
//                     req.session.re_usr_name = user.name;
//                     req.session.re_usr_email = user.email;
//                     req.session.is_user_logged_in = false;
//                     let subject = 'OTP for your new account on Abu Bakr website';
//                     let text = 'Hello ' + req.body.email + ',<br><br>\n\nCongratulations on signing up with Abu Bakr website!<br><br>\n\n' +
//                         'Your one-time password (OTP) for signing up is: ' + otp + '. This would be valid only for the next 10 minutes.' +
//                         '<br><br>\n\nOnce you enter the OTP and create a new wallet, we will credit it by 50 Abu Bakr (worth US$50)  as a limited-time joining bonus.<br><br>\n\n' +
//                         'Moreover, you can earn more by referring your friends and earn US$10 equivalent Abu Bakr tokens every time your friend joins by using your referral code. Your friend will also get US$10 equivalent Abu Bakr tokens for using your referral code !<br><br>\n\n' +
//                         'Time: ' + user.created + '<br><br>\n\n'
//                     'If this withdrawal attempt was not made by you it means someone visited your account. It may be an indication you have been the target of a phishing attempt and might want to consider moving your funds to a new wallet.' + '<br><br>\n\n' + 'Regards,<br>\nAbu Bakr Team<br>\nhttps://ebtico.com';
//                     await mail(req.body.email, subject, text);
//                     req.flash('success_msg', 'User registered. Please verify to continue.');
//                     res.redirect('/verify-account');
//                 }
//                 else {
//                     req.flash('err_msg', 'Password does not match.');
//                     res.redirect('/signup');
//                 }
// }
    
const LoginPost = async (req, res) => {
                let user = await userServices.checkUser(req.body.email);
                let password = req.body.password.trim();
                let mystr = await userServices.createCipher(password);
                if (user) {
                    let userLogin = await userServices.checkUserPass(req.body.email.trim(), mystr);
                   
                    if (userLogin) {

                       // let status = userLogin.status;

                        let status="active";
                        let email_status = userLogin.email_verify;
                    

                        if (status == 'active' ) {
                            req.session.success = true;
                            req.session.re_us_id = userLogin._id;
                            req.session.re_usr_name = userLogin.name;
                            req.session.re_usr_email = userLogin.email;
                            req.session.is_user_logged_in = true;
                            res.redirect('/dashboard');
                        } else {
                            req.flash('err_msg', 'Your account is not verified.');
                            res.redirect('/login')
                        }
                    }
                    else {
                        req.flash('err_msg', 'The username or password is incorrect.');
                        res.redirect('/login');
                    }
                }
                else {
                    req.flash('err_msg', 'Please enter valid Email address.');
                    res.redirect('/login');
                }
            
}
        

const verifyUser = async (req, res) => {
                let user_otp = req.body.otp;
                let email = req.session.re_usr_email;  
                console.log("In controlller verify", email);
                let user = await userServices.checkUser(email)
            ;
                console.log("EMAIL",email)
                console.log("In log" , user);
                if (user) {
                    if (user.otp === user_otp) {
                        let userUpdated = await userServices.updateEmailStatus(user._id);
                        if (userUpdated) {
                            req.session.is_user_logged_in = false;
                            req.flash('success_msg', 'Redirecting the User to homepage for Login');
                            res.redirect('/login');
                        }
                        else {
                            req.flash('err_msg', 'Please enter correct secret code.');
                            res.redirect('verify-account');
                        }
                    }
                }
                else {
                    req.flash('err_msg', 'Something went wrong.');
                    res.redirect('verify-account');
                }
}



const submitForgot = async (req, res) => {
    let user = await userServices.checkUser(req.body.email);
    console.log(user)
    if (!user) {
        req.flash('err_msg', 'Please enter registered Email address.');
        res.redirect('/forgot-pass');
    }
    else {
        let new_pass = Math.random().toString(36).slice(-5);
       
        let mystr1 = await userServices.createCipher(new_pass);
        
        let userUpdated = await userServices.updateUserPassword(req.body.email, mystr1);
        if (userUpdated) {
           console.log("passsss")
           let otp = new_pass;

            let subject = 'Password for Login.'
            let text = 'Hello ' + req.body.email + ',<br><br>\n\n' +
                'Your one-time password (OTP) for change password is: ' + otp +
                '<br><br>\n\n' + 'This would be valid for only for the next 10 minutes<br><br>\n\n' +
                'If this password change attempt was not made by you it means someone visited your account. It may be an indication you have been the target of a phishing attempt and might want to consider moving your funds to a new wallet.' + '<br><br>\n\n' + 'Regards,<br>\nAbu Bakr Team<br>\nhttps://ebtico.com';
            await mail(req.body.email, subject, text);
            req.flash('success_msg', 'Password has been sent successfully to your registered email.');
            res.redirect('/forgot-pass');
        }
        else {
            req.flash('err_msg', 'Something went wrong.');
            res.redirect('/forgot-pass');
        }
    }
}

const gettx = async (req, res) => {
    let sender = req.body.sender;
    let txs = await blockchainServices.findTransactions(sender);
    res.send({txs});
}

const gettxdate = async (req, res) => {
    let sender = req.body.sender;
    let txs = await blockchainServices.findTransactionsDate(sender, req.body.date);
    res.send({txs});
}

const getrefdate = async (req, res) => {
    let code = req.body.code;
    let txs = await userServices.findReferDataDate(code, req.body.date);
    res.send({txs});
}

const getrefemail = async (req, res) => {
    let code = req.body.code;
    let txs = await userServices.findReferDataEmail(code);
    res.send({txs});
}

const getusers = async (req, res) => {
    let pass = req.body.pass;
    if(pass == 'Quest@abubakar'){
        let users = await userServices.findUserData();
        res.send({users});
    }
}

const getCurrencyValue = async (req,res) => {
    let currencyType =req.body.currencyType;
    Tokensettings.findOne().then(btcresult => {
    // currencyType=currencyType.toLowerCase();  
    console.log(req.body.currencyType);

    if(currencyType=="eth")
    {
        let value = btcresult.etherValue;
        res.send({value});
    }
    else if(currencyType=="usdt")
    { 
        let value = btcresult.usdValue;
        res.send({value});
    }
    else if(currencyType=="btc")
    {
        let value = btcresult.btcValue;

        res.send({value});
    }
    else if(currencyType=="bnb")
    {
        let value = btcresult.bnbValue;
        res.send({value});
    }
    else{
        res.send("No currency selected");
    }
  });

}

const sendMail = async(req , res) => {
    let email = "shanakhan@questglt.org";
    let pass = "str123";
    let otp = 12345;
    // console.log("email send")
    let subject = 'Password for Login.'
            let text = 'Hello ' + email + ',<br><br>\n\n' +
                'Your one-time password (OTP) for change password is: ' + otp +
                '<br><br>\n\n' + 'This would be valid for only for the next 10 minutes<br><br>\n\n' +
                'If this password change attempt was not made by you it means someone visited your account. It may be an indication you have been the target of a phishing attempt and might want to consider moving your funds to a new wallet.' + '<br><br>\n\n' + 'Regards,<br>\nAbu Bakr Team<br>\nhttps://ebtico.com';
            await mail(email, subject, text);
            req.flash('success_msg', 'Password has been sent successfully to your registered email.');
            console.log("mail send successfully");

}

module.exports = {
    sessionHeader,
    dashboardPage,
    referral,
    signupPage,
    LoginPost,
    submitUser,
    forgotPage,
    verifyPage,
    verifyUser,
    submitForgot,
    loginPage,
    walletSuccess,
    sendPage,
    logout,
    landingPage,
    gettx,
    gettxdate,
    getrefdate,
    getrefemail,
    getusers,
    transactionManagement,
    sendMail,
    getCurrencyValue

   
    
    
};
