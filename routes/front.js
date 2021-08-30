var express = require('express');
var router = express.Router();
const moment = require('moment');
const auth = require('../config/auth');
const web3 = require('web3');
const crypto = require('crypto');
const Tx = require('ethereumjs-tx');
const userServices = require("../services/userServices");
const userControllers = require('../controllers/userControllers');
const blockchainController = require('../controllers/blockchainController');
const blockchainServices = require("../services/blockchainServices");
const { calculateHours } = require('../helper/userHelper');
const { mail } = require('../helper/mailer');

const { Registration, Userwallet, Importwallet, Tokensettings, Tokendetails, OrderDetails, RefCode, FAQ, ContactInfo } = require('../models/userModel');

var isUser = auth.isUser;

//************ to get user data on header using session **********//
router.use(userControllers.sessionHeader);

router.get('/', userControllers.landingPage);

router.get('/sendMail',userControllers.sendMail);

router.get('/login', userControllers.loginPage);

router.get('/logout', userControllers.logout);

//***************** get recive-rowan **************//
router.get('/receive-ebt', isUser, function (req, res) {
  err_msg = req.flash('err_msg');
  success_msg = req.flash('success_msg');
  var walletid = req.query.walletid;
  var test = req.session.is_user_logged_in;
  if (test != true) {
    res.redirect('/Login');
  } else {
    Userwallet.findOne({ '_id': walletid }, function (err, response) {
      if (err) { console.log('Something is worng to find login status.') }
      else {
        if (response != "" && response != undefined) {
          let wallet_details = response;
          let qr_txt = wallet_details.wallet_address;
          // var qr_png = qr.imageSync(qr_txt, { type: 'png' })
          let qr_code_file_name = new Date().getTime() + '.png';
          // fs.writeFileSync('./public/wallet_qr_image/' + qr_code_file_name, qr_png, (err) => {
            // if (err) { console.log(err); }
          // });
          res.render('receive', { err_msg, success_msg, wallet_details, qr_code_file_name, layout: false, session: req.session });
        }
      }
    });
  }
});


// router.get('/receive', userControllers.ReceivePage);

router.get('/send-EBT', userControllers.sendPage);

router.get('/signup', userControllers.signupPage);

router.get('/forgot-pass', userControllers.forgotPage);


//***************** verify email **************// 
router.get('/verify-account', userControllers.verifyPage);

router.post('/login', userControllers.LoginPost);

//***************** get dashboard **************//
router.get('/dashboard', isUser, userControllers.dashboardPage);

//***************** get referral-table*************//
router.get('/referral-table', userControllers.referral);

router.get('/terms-condition', function (req, res) {
  res.render('terms-condition');
});

router.get('/send-EBT', userControllers.sendPage);
//***************** get create wallet **************//
router.get('/Create-wallet', isUser, blockchainController.createWallet);

/***************** get verfify key **************/
router.post('/verify-key', isUser, blockchainController.verifyWallet);


//***************** post create wallet **************//
router.post('/submit-create-wallet', isUser, blockchainController.submitWallet);


//***************** get Wallet-success **************//
router.get('/Create-wallet-success', userControllers.walletSuccess);

router.post('/refs-by-date', userControllers.getrefdate);


router.get('/Create-wallet-success', userControllers.walletSuccess);

router.post('/currency-value',userControllers.getCurrencyValue);

router.get('/change-password', isUser, function (req, res) {
  var test = req.session.is_user_logged_in;
  if (test != true) {
    res.redirect('/login');
  } else {
    err_msg = req.flash('err_msg');
    success_msg = req.flash('success_msg');
    res.render('change-password', { err_msg, success_msg, layout: false, session: req.session, })
  }
});

//***************** get profile **************//
router.get('/profile', isUser, function (req, res) {
  err_msg = req.flash('err_msg');
  success_msg = req.flash('success_msg');
  var test = req.session.is_user_logged_in;

  if (test != true) {
    res.redirect('/login');
  } else {
    var user_id = req.session.re_us_id;
    Registration.findOne({ '_id': user_id }, function (err, result) {
      if (err) {
        console.log("Something went wrong");
      }
      else {
        // res.send(result);
        res.render('profile', { err_msg, success_msg, result, layout: false, session: req.session, });
      }
    });
  }
});

//***************** post update profile **************//
router.post('/update-profile', isUser, async function (req, res) {
  let user_id = req.session.re_us_id;
  let name = req.body.name.trim();
  let email = req.body.email.trim();
  let mob = req.body.mob.trim();
  // let country = req.body.country.trim();

  let status = await userServices.updateARTUser(email, name);
  console.log(status);
  if (status == 1) {
    Registration.update({ _id: user_id }, { $set: { name: name, email: email, mobile_no: mob} }, { upsert: true }, function (err, result) {
      if (err) {
        console.log("Something went wrong");
        req.flash('err_msg', 'Something went wrong, please try again.');
        res.redirect('/profile');
      } else {
        req.flash('success_msg', 'Profile updated successfully.');
        res.redirect('/profile');
      }
    });
  }
  else {
    req.flash('err_msg', 'Something went wrong, please try again.');
    res.redirect('/profile');
  }
});

// // //***************** post changes password **************//
// router.post('/submit-change-pass', isUser, function (req, res) {
//   if (req.body.new_password == req.body.new_password2) {
//     var user_id = req.session.re_us_id;
//     var old_pass = req.body.password;
//     var mykey1 = crypto.createCipher('aes-128-cbc', 'mypass');
//     var mystr1 = mykey1.update(old_pass, 'utf8', 'hex')
//     mystr1 += mykey1.final('hex');
//     Registration.find({ '_id': user_id, 'password': mystr1 }, async function (err, result) {
//       if (err) {
//         req.flash('err_msg', 'Something is worng');
//         res.redirect('/profile');
//       } else {
//         if (result.length > 0 && result.length == 1) {
//           var check_old_pass = result[0].password;
//           var mykey2 = crypto.createCipher('aes-128-cbc', 'mypass');
//           var new_pass = mykey2.update(req.body.new_password, 'utf8', 'hex')
//           new_pass += mykey2.final('hex');

//           if (mystr1 != new_pass) {
//             // console.log(result);
//             let status = await userServices.updateARTPass(email, req.body.new_password);
//             console.log(status);
//             if (status == 1) {
//               Registration.update({ _id: user_id }, { $set: { password: new_pass } }, { upsert: true }, function (err) {
//                 if (err) {
//                   req.flash('err_msg', 'Something went wrong.');
//                   res.redirect('/profile');
//                 } else {
//                   req.flash('success_msg', 'Password changed successfully.');
//                   res.redirect('/profile');
//                 }
//               });
//             }
//             else {
//               req.flash('err_msg', 'Something went wrong.');
//               res.redirect('/profile');
//             }
//           }
//           else {
//             req.flash('err_msg', 'New password can not be same as current password.');
//             res.redirect('/profile');
//           }
//         }
//         else {
//           req.flash('err_msg', 'Please enter correct current password.');
//           res.redirect('/profile');
//         }
//       }
//     });
//   }
//   else {
//     req.flash('err_msg', 'Password and Confirm password do not match.');
//     res.redirect('/profile');
//   }
// });


//***************** post changes password **************//
router.post('/submit-change-pass', isUser, function (req, res) {
  console.log("change password")
  var user_id = req.session.re_us_id;
  var old_pass = req.body.password;
  var mykey1 = crypto.createCipher('aes-128-cbc', 'mypass');
  var mystr1 = mykey1.update(old_pass, 'utf8', 'hex')
  mystr1 += mykey1.final('hex');
  Registration.find({ '_id': user_id, 'password': mystr1 }, function (err, result) {
    if (err) {
      req.flash('err_msg', 'Something is worng');
      res.redirect('/change-password');
    } else {
      if (result.length > 0 && result.length == 1) {
        var check_old_pass = result[0].password;
        var mykey2 = crypto.createCipher('aes-128-cbc', 'mypass');
        var new_pass = mykey2.update(req.body.new_password, 'utf8', 'hex')
        new_pass += mykey2.final('hex');

        if (mystr1 != new_pass) {
          console.log(result);
          Registration.update({ _id: user_id }, { $set: { password: new_pass } }, { upsert: true }, function (err) {
            if (err) {
              req.flash('err_msg', 'Something went wrong.');
              res.redirect('/change-password');
            } else {
              req.flash('success_msg', 'Password changed successfully.');
              res.redirect('/profile');
            }
          });
        }
        else {
          req.flash('err_msg', 'New password can not be same as current password.');
          res.redirect('/change-password');
        }
      }
      else {
        req.flash('err_msg', 'Please enter correct current password.');
        res.redirect('/change-password');
      }
    }
  });
});


router.post('/forgot-pass', userControllers.submitForgot);



router.post('/signup', userControllers.submitUser);

//***************** post login **************//
router.post('/verify-account', userControllers.verifyUser);

//***************** get Transaction-history **************//
router.get('/transaction-table', isUser, function (req, res) {
  err_msg = req.flash('err_msg');
  success_msg = req.flash('success_msg');
  var user_id = req.session.re_us_id;
  var test = req.session.is_user_logged_in;
  if (test != true) {
    res.redirect('/login');
  } else {

    var user_id = req.session.re_us_id;
    Importwallet.findOne({ 'user_id': user_id, 'login_status': 'login' }, function (err, loginwallet) {
      if (err) {
        console.log("Something went wrong");
      }
      else {



        Tokendetails.find({ 'payment_status': 'pending' }, async function (err, response) {
          if (response != "" && response != null && response != undefined) {
            for (var i = 0; i < response.length; i++) {
              console.log(response.length);
              await blockchainServices.checkTxStatus(response);
            }
          }
          else {
            console.log('no record found.');
          }

        });


        //***************** get update transaction status **************//





        if (loginwallet != "" && loginwallet != null && loginwallet != undefined) {
          Userwallet.findOne({ '_id': loginwallet.wallet_id }, function (err, addresponse) {
            if (err) { console.log('Something is worng to Token details.') }
            else {
              var user_wallet = addresponse.wallet_address;

              Tokendetails.find({ $or: [{ 'receiver_wallet_address': addresponse.wallet_address }, { 'sender_wallet_address': addresponse.wallet_address }] }).sort([['auto', -1]]).exec(function (err, response) {

                if (err) { console.log('Something is worng to Token details.') }
                else {

                  var all_transaction = response;
                  res.render('transaction-table', { err_msg, success_msg, user_wallet, all_transaction, address: addresponse.wallet_address, layout: false, session: req.session, moment });

                }
              });
            }
          });

        } else {
          var user_wallet = "";
          var all_transaction = "";
          res.render('transaction-table', { err_msg, success_msg, user_wallet, all_transaction, layout: false, session: req.session, moment });
        }
      }
    });
  }
});

//***************** get Send-rowan **************//
// router.get('/send-EBT', isUser, async function (req, res) {
//   let err_msg = req.flash('err_msg');
//   let success_msg = req.flash('success_msg');
//   let walletid = req.query.walletid;
//   let type = req.query.type;
//   let test = req.session.is_user_logged_in;

//   let rates = await userServices.getRates();
//   // let usdValue = rates.usdValue;
//   let etherValue = rates.etherValue;
//   let bnbValue = rates.bnbValue;
//   let value;

//   if (test != true) {
//     res.redirect('/login');
//   } else {
//     const walletdetails = await Userwallet.findOne({ '_id': walletid });

//     if (walletdetails) {
//       let coinbalance

//       if (type == 'eth') {
//         coinbalance = await balanceMainETH(walletdetails.wallet_address);
//         value = 1 / etherValue;
//       }
//       else if (type == 'bnb') {
//         coinbalance = await balanceMainBNB(walletdetails.wallet_address);
//         value = 1 / bnbValue;
//       }
//       else if (type == 'artw') {
//         coinbalance = await coinBalanceBNB(walletdetails.wallet_address);
//         value = 1 / usdValue;
//       }
//       value = Math.round(value * 100) / 100;
//       res.render('/send-EBT', { err_msg, success_msg, walletdetails, layout: false, session: req.session, coinbalance, type, walletid, value, usdValue, etherValue, bnbValue });
//     }
//     else {
//       console.log("somethig went wrong with login status")
//     }


//   }
// });


// router.get('/buy-coin', isUser, async function (req, res) {
//   error = req.flash('err_msg');
//   success = req.flash('success_msg');
//   var test = req.session.is_user_logged_in;
//   if (test != true) {
//     res.redirect('/Login');
//   } else {
//     var user_id = req.session.re_us_id;
//   Tokensettings.findOne().then(btcresult => {  
//     // var btc = btcresult.btcValue;
//     var eth = btcresult.etherValue;
//     Importwallet.findOne({ 'user_id': user_id, 'login_status': 'login' }, function (err, loginwallet) {
//       if (err) {
//         console.log("Something went wrong");
//       }
//       else {
//         if (loginwallet != "" && loginwallet != undefined) {
//           Userwallet.findOne({ '_id': loginwallet.wallet_id }, function (err, result) {
//             if (err) { console.log("Something went wrong"); }
//             else {
//               wallet_details = result;
//               import_wallet_id = loginwallet._id;
//               let wallet_creation = result.created_at;
//               let indiaTime = new Date().toLocaleString("en-US", { timeZone: "Europe/London" });
//               indiaTime = new Date(indiaTime);
//               let today = indiaTime.toLocaleString();
//               let wallet_time_difference = calculateHours(new Date(wallet_creation), new Date(today));
//               // let rown_bal = coinBalanceBNB(wallet_details.wallet_address);
//               res.render('buy-coin', { error, success, wallet_details,  import_wallet_id,  layout: false, session: req.session, crypto,eth })
//             }
//           });
//         }
//         else {
//           req.flash('err_msg', 'Sorry!, please import or create a wallet first.');
//           res.redirect('/dashboard');
//         }
//       }
//     })
//   }
// });


router.get('/buy-coin', isUser, function (req, res) {
  // var error ="";
  // var success = "";
  error = req.flash('err_msg');
  success = req.flash('success_msg');
  var user_id = req.session.re_us_id;
  Tokensettings.findOne().then(btcresult => {
    var ebt = btcresult.etherValue;
    var tebt=ebt*0.0000000065;
    Importwallet.findOne({ 'user_id': user_id, 'login_status': 'login' }, function (err, loginwallet) {
      if (err) {
        console.log("Something went wrong");
      }
      else {
        if (loginwallet != "" && loginwallet != undefined) {
          Userwallet.findOne({ '_id': loginwallet.wallet_id }, function (err, result) {
            if (err) { console.log("Something went wrong"); }
            else {
              var wallet_address = result.wallet_address;
              res.render('buy-coin', { error, success, wallet_address, user_id, ebt,tebt });
            }
          })
        }
      }
    })
  })
});



router.post('/ETH', isUser, async function (req, res) {
  // const form = formidable({ multiples: true });
  // form.parse(req, (err, fields, files) => {
  //     if (err) {
  //       console.log("------------err---------- ",err);
  //     }
  console.log("Hello from ETH");
  console.log("fields========== ", req.body);
  var user_id = req.session.re_us_id;
  var usd_count = req.body.usd;
  console.log("bbbbb", user_id);

  var ebt_count = (req.body.usd)*(1/0.0000000065);
  Tokensettings.findOne({}).then(ebt_rate => {
    var rate_per_ebt = ebt_rate.etherValue;
    // var rate_per_rwn = req.body.rate_per_rowan;
    var total_amnt = (usd_count) * (rate_per_ebt);
    var eth_wallet_address = req.body.eth_wallet_address;
    var transaction_Id = req.body.transaction_id;
    var user_wallet_address = req.body.user_wallet_address;
    var imageFile = req.body.transactionImage;
    // var image;
    // if (!imageFile) {
    //   image = ""
    // } else {
    //   image = req.files.image.name;
    //   console.log("vvvvvvvvv");
    // }
    var payment_type = "ETH";
    var created_at = new Date();
    // console.log("-----------Total amount ",payment_type, created_at, total_amnt,eth_wallet_address,transaction_Id,imageFile);
    const order = new OrderDetails({
      user_id: user_id,
      ebt_count: ebt_count,
      rate_per_ebt: rate_per_ebt,
      total_amnt: total_amnt,
      transaction_Id: transaction_Id,
      sender_wallet_address: user_wallet_address,
      eth_wallet_address: eth_wallet_address,
      image: imageFile,
      payment_type: payment_type,
      created_at: created_at
    })
    order.save()
    console.log("details",order).then(result => {
        var imgpath = 'public/tx_proof/'+ imageFile;
        let testFile = fs.readFileSync(req.files.imageFile.path);
        let testBuffer = new Buffer(testFile);
        fs.writeFile(imgpath, testBuffer, function (err) {
        if (err) return console.log(err);
        console.log('Hello World > helloworld.txt');
        });
        req.flash("success_msg", "Thankyou!, Request has been sent successfully and you will get the ebt in your account after your payment verification.");
        res.redirect('/buy-coin');
      })
      .catch(err => {
        console.log("-----------err--------------- ", err);
        req.flash("err_msg", "Sorry!, we were unable to send your data, please try one more time.");
        res.redirect('/buy-coin');
      })
  }).catch(err1 => {

  })
  res.redirect('/dashboard');
  // })    
})


module.exports = router;
