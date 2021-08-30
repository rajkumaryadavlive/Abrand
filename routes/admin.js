const express = require('express');
const session = require('express-session');
var expressLayouts = require('express-ejs-layouts');

const flash = require('req-flash');
const multer = require('multer');
var crypto = require('crypto');
const request = require('request');
const auth = require('../config/auth');
// var async = require('async');
const fs = require('fs');
var speakeasy = require('speakeasy');
var QRCode = require('qrcode');
// var bip39 = require('bip39');
// var qr = require('qr-image'); 
const formidable = require('formidable');
var router = express.Router();
const routes = require('express').Router();
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const admin_wallet = '0xF24a24Ab64a29edd50ACC655f4dd78360888A83e';
var mkdirp = require('mkdirp');
const bcrypt = require('bcryptjs');
const { middleware_check_login, check_user_login } = require('../middleware/login_middleware');
const bscHelper = require("../helper/bscHelper")
const ethHelper = require("../helper/ethHelper")
const userServices = require("../services/userServices")
const adminServices = require("../services/adminServices")
const userController=require('../controllers/userControllers');




// const {mongoose} = require('../config/config');
// const {AdminInfo,RECDetails,Tokensettings,ContactInfo} = require('../model/schema/admin');
// const {Userwallet,Importwallet,Tokendetails} = require('../model/schema/wallet');
const { TeamMember } = require('../models/team_info');
const { BannerInfo, GetInTouch, PartnerInfo, MediaCoverage, KeyFeaturesInfo, milestone, problemInfo, blogInfo, whitepaperInfo, solutionInfo, tokenAllocation, termsAndConditionInfo, privacyPolicyInfo } = require('../models/home_content');
let { Registration, Userwallet, Importwallet, Tokensettings, Tokendetails, OrderDetails, RefCode, FAQ, ContactInfo } = require('../models/userModel');
let { VAULT, MVAULT } = require('../models/vault');
let { VaultRate } = require('../models/vault_admin');
const { AdminInfo } = require('../models/admin');
const mailer = require('../helper/mailer.js');
const Tx = require('ethereumjs-tx');

// var {Registration,Userwallet,Importwallet,Tokensettings,Tokendetails,OrderDetails,RefCode,FAQ,ContactInfo} = require('../models/userModel');
// const {TeamMember} = require('../model/schema/team_info');

// const {BannerInfo,GetInTouch,PartnerInfo,MediaCoverage} = require('../model/schema/home_content');
// const {POC,POCDaily,EnergyBuyer,CRate,PocInfo,UserBuyer,PocNew,PreOrder,BusinessCompany,InPounds,AdminPocBalances,EmoncmsInput,EmoncmsFeed,EmonDayFeed} = require('../model/schema/poc.js');

const Web3 = require('web3');
const web3js = new Web3(
  new Web3.providers.HttpProvider(
    "https://ropsten.infura.io/v3/5e1b7d94f4784e86a1b2511857f15287"
  )
);

// var dateTime = require('node-datetime');

var moment = require('moment');

var { Stake, MainStake, StakeRate } = require('../models/staking');
const admin = require('../models/admin');
const { listeners } = require('process');

// router.get('/admin-transaction-table',userController.transactionManagement);

var indiaTime = new Date().toLocaleString("en-US", { timeZone: "Europe/London" });
var indiaTime = new Date(indiaTime);
var current_time = indiaTime.toLocaleString();

// var isAdmin = auth.isAdmin;
/****************/

routes.use(bodyParser.urlencoded({ extended: true }))
routes.use(bodyParser.json())

bcrypt.genSalt(10, (err, salt) => {

  bcrypt.hash("123456", salt, (err, hash) => {
    // console.log("----------new string ",hash)
  })
})
routes.use(session({
  secret: 'admindetails',
  resave: false,
  saveUninitialized: true
}));

routes.use(flash());
routes.use(expressLayouts);

// var admindata123 = new StakeRate({
//   "interest_rate" : "0.1", "updated_at" : "Fri Nov 27 2020 12:47:17 GMT+0530 (India Standard Time)"
// });

// admindata123.save().then(success => {
//   console.log("----------- ",success);
// }).catch(err => {
//   console.log("-----------err ",err);
// })

/******For User Profile Pictrue***/

var storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'assets/uploads/user_profile_images')
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '.jpg')
  }
});
var upload = multer({ storage: storage });


/******For Admin Profile Picture***/

var storage_admin = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/admin_assets/uploads/admin_profile_images')
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '.jpg')
  }
});

// var upload_admin = multer({storage: storage_admin});

var upload_admin = multer({
  storage: storage_admin
}).array("imgUploader", 1);


/******For Team Member Profile Picture***/

var storage_team_member = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/admin_assets/uploads/team-member-profiles')
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '.jpg')
  }
});

var upload_member_profile = multer({ storage: storage_team_member });


/******For News Section Picture***/

var storage_news_details = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/admin_assets/uploads/news-section')
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '.jpg')
  }
});

var upload_news_profile = multer({ storage: storage_news_details });


var transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: 'aashishporwal38@gmail.com',
    pass: 'Quest0106',
  }
});

routes.get('/admin-login',  (req, res) => {
  let fail = req.flash('fail');
  let success_logout = req.flash('success_logout');
  res.render('admin/auth/login.ejs', { layout:false });
});



// routes.post('/submit-details',middleware_check_login, async (req, res) => {
//   err_msg = req.flash('err_msg');
//   success_msg = req.flash('success_msg');

//   const email = req.body.email;
//   const password = req.body.password;

//   let Admin = {
//     name: 'Quest',
//     email: 'aashishporwal@questglt.org',
//     password: '123456',
//     user_type: 'admin'
//   };

  
//     if (email == 'aashishporwal@questglt.org' && password == '123456') {
//       console.log('Admin found')
//        res.redirect('/main-dashboard');
//     } else {
//         res.redirect('/admin-login');
//       }

// });


routes.post('/submit-details', async (req, res) => {
  err_msg = req.flash('err_msg');
  success_msg = req.flash('success_msg');

  // const email = req.body.username;
  // const password = req.body.password;

  const email = "ebticoglt@gmail.com";
  const password = "Quest@ebtico";

  let Admin = {
    name: 'Abu Bakar',
    email: req.body.email,
    password: req.body.password,
    user_type: 'admin'
  };

  AdminInfo.create(Admin, function (res, err) {
    console.log(res)
    console.log(err)
  })
  let isAdmin = await adminServices.findAdmin(email)
  if (isAdmin == 'notAdmin') {
    console.log('Admin not found')
    req.flash('fail', 'You have entered wrong email try again.');
    res.redirect('/admin-login');
  } else {
    // const mystr = await userServices.createCipher(password);
    let checkPass = await adminServices.checkAdminPass(email, password)

    if (checkPass == 'wrongPassword') {
      req.flash('fail', 'You have entered wrong password try again.');
      res.redirect('/admin-login');
    }
    else {
      let admin = isAdmin
      //console.log(admin._id);
      console.log(`${admin.name} logged in as a admin`);
      const secret = speakeasy.generateSecret({
        length: 10,
        name: 'Abu_Bakar_Admin',
        issuer: 'Abu_Bakar_Admin'
      });
      var url = speakeasy.otpauthURL({
        secret: secret.base32,
        label: 'Abu_Bakar_Admin',
        issuer: 'Abu_Bakar_Admin',
        encoding: 'base32'
      });
      QRCode.toDataURL(url, async (err, dataURL) => {
        var secret_code = secret.base32;
        var qrcode_data = dataURL
        var user_details = { user_id: admin._id, name: admin.name };

        /******Store in session*******/

        let newSession = await adminServices.createSession(req, admin)
        var err_msg = '';
        var success_msg = '';

        res.redirect('/main-dashboard');

      })
    }
  }
})


routes.get('/main-dashboard', middleware_check_login, async (req, res) => {
  const total_orders = 0;
  const total_tokens_count = [];

  let total_users_s = await Registration.count({})
  console.log(`281-total_users_s`, total_users_s)

  let usersRegisteredThisMonth = await adminServices.usersRegisteredThisMonth()
  console.log(usersRegisteredThisMonth)

  let totalEBTRewardsDestributed = await adminServices.totalEBTRewardsDestributed(total_users_s)

  const EBT_bal = await ethHelper.coinBalanceETH(admin_wallet) //$EBT balance
  console.log(`290-ebt`, EBT_bal)

  const ebtSold = await adminServices.EBTSold(EBT_bal)
  console.log(`290-ebtSold`, ebtSold)

  const actual_balance = await ethHelper.balanceMainETH(admin_wallet) //ethereum balance
  console.log(`293-eth`, actual_balance)

  const admin_detail = await adminServices.findAdmin(req.session.re_usr_email)

  if (admin_detail != '' && admin_detail == null) {
    req.session.destroy(function (err) {
    });
    console.log("262- something went wrong please log in again")
    req.flash('fail', 'Opps! something went wrong please login again');
    res.redirect('/admin-login');
  }
  else {
    res.render('admin/dashboard/index', {
      Name: req.session.user_name, session: req.session, profile_image: req.session.profile_image, total_orders_s: total_orders, EBT_balance: EBT_bal, ether_balance: actual_balance, main_rwn_vault: "0", total_users_s, ebtSold, totalEBTRewardsDestributed, usersRegisteredThisMonth
    }) 
  }
})


routes.get('/my-profile',middleware_check_login,  async (req, res) => {

  // console.log('Session Data',req.session)
  var id = req.session.user_main_id;
  if (id != '' && id != undefined) {
    let admin = await adminServices.checkAdminId(id)
    if (admin != '' && admin == null) {
      req.session.destroy(function (err) {
      });
      console.log("262- something went wrong please log in again")
      req.flash('fail', 'Opps! something went wrong please login again');
      res.redirect('/admin-login');
    }
    else {
      res.render('admin/front-admin/my-profile.ejs', { Name: req.session.user_name, name: admin.name, email: admin.email, mobile: admin.mobile, contract_address: admin.contract_address, profile_image: admin.profile_image, user_main_id: admin._id, expressFlash: req.flash() });
    }
  }
});


routes.post('/update_profile', middleware_check_login, (req, res) => {

  console.log(`299- update_profile`, req.body)
  var id = req.body.id;
  console.log('-----------', req.body);
  if (req.files != null && req.files != undefined && req.files != '') {
    var imageFile = typeof req.files.profile_image !== "undefined" ? req.files.profile_image.name : "";
  } else {
    var imageFile = '';
  }

  if (imageFile != "") {
    profile_image = imageFile;

    if (imageFile != "") {
      var imgpath = 'public/upload_admin_profile/' + imageFile;
      req.files.profile_image.mv(imgpath, function (err) {
        console.log('err', err)
      });
    }
  } else {
    profile_image = req.body.old_image;
  }
  console.log('-----------', req.body.user_name, '---------', req.body.email, '-----', req.body.mobile);
  var user_name = req.body.user_name;
  var email = req.body.email;
  var mobile = req.body.mobile;
  var profile_image = profile_image;
  var updated_at = Date.now();

  AdminInfo.update({ _id: id }, {
    $set: {
      name: user_name,
      email: email,
      mobile: mobile,
      profile_image: profile_image,
      updated_at: updated_at,
    }
  }, function (err) {
    if (err) {

      req.flash('err_msg', 'Something went wrong.');
      res.redirect('/my-profile');
    }
    else {

      req.session.user_name = req.body.user_name;
      req.session.profile_image = profile_image;
      req.session.re_usr_email = req.body.email;
      req.flash('success_msg', 'Profile updated successfully.');
      res.redirect('/my-profile');
    }
  })
});


routes.get('/change-password-front-admin',middleware_check_login,  (req, res) => {
  err_msg = req.flash('err_msg');
  success_msg = req.flash('success_msg');
  AdminInfo.findOne().then((succ) => {
    res.render('admin/front-admin/change-password.ejs', { Name: req.session.user_name, profile_image: req.session.profile_image, user_main_id: succ._id, err_msg, success_msg });
  }, (err) => {

    res.send('Some thing went wrong try again.');

  }).catch((e) => {

    res.send('Some thing went wrong try again.');

  });
});

/***************************  *Update Admin Password ******************************/

routes.post('/update-password-front-admin', middleware_check_login, (req, res) => {

  var id = req.session.user_main_id;

  var old_pass = req.body.current_password;

  var new_pass = req.body.new_password;

  var mykey1 = crypto.createCipher('aes-128-cbc', 'mypass');
  var old_pass1 = mykey1.update(old_pass, 'utf8', 'hex')
  old_pass1 += mykey1.final('hex');
  console.log("old pass ", old_pass1);
  AdminInfo.findOne({ '_id': id }, function (err, result) {
    if (err) {
      req.flash('err_msg', 'Something is worng');
      res.redirect('/change-password-front-admin');
    } else {
      var check_old_pass = result.password;
      console.log("check_old_pass ", check_old_pass);
      if (check_old_pass != old_pass1) {
        req.flash('err_msg', 'Please enter correct current password.');
        res.redirect('/change-password-front-admin');

      } else {
        var mykey2 = crypto.createCipher('aes-128-cbc', 'mypass');
        var new_pass1 = mykey2.update(new_pass, 'utf8', 'hex');
        new_pass1 += mykey2.final('hex');
        console.log("new pass ", new_pass1);


        if (check_old_pass != new_pass1) {
          // console.log(result);
          AdminInfo.updateOne({ _id: id }, { $set: { password: new_pass1 } }, function (err) {
            if (err) {
              req.flash('err_msg', 'Something went wrong.');
              res.redirect('/change-password-front-admin');
            } else {
              req.flash('success_msg', 'Password changed successfully.');
              res.redirect('/change-password-front-admin');
            }
          });
        } else {
          req.flash('err_msg', 'New password should not be same as current password.');
          res.redirect('/change-password-front-admin');
        }
      }

    }
  });

});

router.get('/logout', async (req, res) => {
  req.session.destroy();
  res.redirect('/admin-login');
});

// routes.get('/logout1', middleware_check_login, (req, res) => {
//   console.log("logout")
//   req.session.destroy(function (err) {
//     console.log("in_logout")
//   });

//   req.flash('success_logout', 'You have logged out successfully.');

//   res.redirect('/admin-login');
// });



routes.get('/user-list',middleware_check_login,  (req, res) => {
  err_msg = req.flash('err_msg');
  success_msg = req.flash('success_msg');
  var day = moment(new Date()).format('MM/DD/YYYY');
  // Registration.find({ deleted: '0', created_at: { $gte: day + ', 00:00:00 AM', $lte: day + ', 12:59:59 PM' } }).sort({ _id: -1 }).lean().then(async (results) => {
  //   console.log('448-results', results)
  Registration.find({ deleted: '0' }).sort({ _id: -1 }).lean().then(async (results) => {
    console.log("result======== ", results);
    for (var j = 0; j < results.length; j++) {
      var allWalets = [];
      var wallets = await Userwallet.find({ user_id: results[j]._id, deleted: '0' });
      // console.log(wallets);
      wallets.forEach(wallet => {
        allWalets.push(wallet.wallet_address);
      })
      var userWallet = allWalets.join(',');
      results[j].wallet_address = userWallet;
    }
    if (results) {
      console.log('462-results', results)
      res.render('admin/front-admin/user-list.ejs', { err_msg, success_msg, expressFlash: req.flash(), user_details: results, moment, session: req.session, Name: req.session.user_name, profile_image: req.session.profile_image });
    }
  }, (error) => {
    res.send('Something went wrong');
  }).catch((e) => {
    res.send(e);
  });
});

/******************************************************************************************/

routes.post('/userListByDate',middleware_check_login,  (req, res, next) => {
  // var newDate = req.body.getDate;
  var newMinDate = req.body.getMinDate;
  var newMaxDate = req.body.getMaxDate;
  // console.log("gdfgsdcgcs--------new Date ",newDate);
  // var day = moment(new Date(newDate)).format('M/D/YYYY');
  var min = moment(new Date(newMinDate)).format('M/D/YYYY');
  var max = moment(new Date(newMaxDate)).format('M/D/YYYY');
  // console.log("------------today2 ",day);
  Registration.find({ deleted: '0', created_at: { $gte: min + ', 00:00:00 AM', $lte: max + ', 12:59:59 PM' } }).sort({ _id: -1 }).lean().then(async (results) => {
    if (results.length > 0) {
      console.log("result======== ", results);
      for (var j = 0; j < results.length; j++) {
        var allWalets = [];
        var wallets = await Userwallet.find({ user_id: results[j]._id, deleted: '0' });
        // console.log(wallets);
        wallets.forEach(wallet => {
          allWalets.push(wallet.wallet_address);
        })
        var userWallet = allWalets.join(',');
        results[j].wallet_address = userWallet;
      }
      if (results) {
        res.render('admin/front-admin/user-list.ejs', { expressFlash: req.flash(), user_details: results, moment, session: req.session, Name: req.session.user_name, profile_image: req.session.profile_image });
      }
    } else {
      res.render('admin/front-admin/user-list.ejs', { expressFlash: req.flash(), user_details: [], moment, session: req.session, Name: req.session.user_name, profile_image: req.session.profile_image });
    }
  }, (error) => {
    console.log("------------error ", error);
  }).catch((e) => {
    console.log("------------e ", e);
  });
})

routes.post('/searchUser', middleware_check_login, (req, res, next) => {
  var value = req.body.value;
  // var pattern = new RegExp('.*'+value+'.*', "i");
  var all_result = [];
  Registration.find({ deleted: '0', $or: [{ "name": { $regex: '.*' + value + '.*', $options: "i" } }, { "email": { $regex: '.*' + value + '.*', $options: "i" } }] }).sort({ _id: -1 }).lean().then(async (results) => {
    for (var j = 0; j < results.length; j++) {
      var allWalets = [];
      var wallets = await Userwallet.find({ user_id: results[j]._id, deleted: '0' });
      // console.log(wallets);
      wallets.forEach(wallet => {
        allWalets.push(wallet.wallet_address);
      })
      var userWallet = allWalets.join(',');
      results[j].wallet_address = userWallet;
      all_result.push(results[j]);
    }
    await Userwallet.find({ deleted: '0', "wallet_address": { $regex: '.*' + value + '.*', $options: "i" } }).then(async searchWallet => {
      console.log("................", searchWallet);
      if (searchWallet != "" && searchWallet != []) {
        for (var l = 0; l < searchWallet.length; l++) {
          var search_user_id = searchWallet[l].user_id;
          console.log("search user id1", search_user_id);
          await Registration.findOne({ deleted: '0', _id: search_user_id }).sort({ _id: -1 }).lean().then(async (results1) => {
            // console.log("results1",results1);
            // for(var k=0;k<results1.length;k++){
            console.log("search user id2", search_user_id);
            var allWalets1 = [];
            var wallets1 = await Userwallet.find({ user_id: results1._id, deleted: '0' });
            console.log("search user id3", search_user_id);
            // console.log(wallets1);
            wallets1.forEach(wallet1 => {
              allWalets1.push(wallet1.wallet_address);
              console.log("search user id4", search_user_id);
            })
            var userWallet1 = allWalets1.join(',');
            results1.wallet_address = userWallet1;
            all_result.push(results1);
          })
        }
      }
    })
    console.log("all_result5", all_result);
    res.render('admin/front-admin/user_search', { expressFlash: req.flash(), user_details: all_result, moment, session: req.session, Name: req.session.user_name, profile_image: req.session.profile_image });
    // }
  }, (error) => {
    console.log("------------error ", error);
  }).catch((e) => {
    console.log("------------e ", e);
  });

})


routes.get('/deactiveUser', adminServices.deactivateUser)

routes.get('/activeUser', adminServices.activateUser)

routes.get('/verifyorder', adminServices.VerifyOrder)


routes.get('/edit-user', middleware_check_login, (req, res) => {
  err_msg = req.flash('err_msg');
  success_msg = req.flash('success_msg');
  var user_main_id = req.query.id.trim();

  Registration.findOne({ 'email': user_main_id }).then((results) => {
    console.log("570-/edit-User", results);

    if (results) {

      res.render('admin/front-admin/change_user_password', { err_msg, success_msg, details: results, Name: req.session.user_name, profile_image: req.session.profile_image });
    }

  }, (error) => {

    res.send('Something went wrong');

  }).catch((e) => {

    res.send(e);

  });


});

routes.post('/update-password-user',middleware_check_login, (req, res) => {
  var user_id = req.body.id.trim();
  var password = req.body.new_password.trim();
  var mykey = crypto.createCipher('aes-128-cbc', 'mypass');
  var mystr = mykey.update(password, 'utf8', 'hex')
  mystr += mykey.final('hex');
  console.log('string', mystr)
  console.log('string', user_id)
  Registration.updateOne({ '_id': user_id }, { $set: { 'password': mystr } }, { upsert: true }, function (err, result) {
    console.log("updatedddddddddddd");
    if (err) { console.log(err); }
    else {
      var smtpTransport = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: 'info.artwtoken@gmail.com',
          pass: 'Art@!#W396'
        }
      });
      const mailOptions = {
        to: req.body.email,
        from: 'info.artwtoken@gmail.com',
        subject: 'Forgot Password',

        text: 'Dear Customer,' + '\n\n' + 'New Password form ebt.\n\n' +
          'Password: ' + password + '\n http://' + req.headers.host + '/' + '\n\n' +

          'We suggest you to please change your password after successfully logging in on the portal using the above password :\n\n' +

          'Here is the change password link: http://' + req.headers.host + '/Profile' + '\n\n' +
          'Thanks and Regards,' + '\n' + '$EBT Team' + '\n\n',
      };
      smtpTransport.sendMail(mailOptions, function (err) {
        console.log(err);
      });
      req.flash('success_msg', 'Password has been changed successfully.');
      res.redirect('/user-list');
    }
  })
})

/******************************************************************************************/



routes.get('/send-token', middleware_check_login, async (req, res) => {
  var email = req.session.re_usr_email;

  const admin_detail = await adminServices.findAdmin(email)
  if (admin_detail != '' && admin_detail == null) {
    req.session.destroy(function (err) {
    });
    console.log("262- something went wrong please log in again")
    req.flash('fail', 'Opps! something went wrong please login again');
    res.redirect('/admin-login');
  }
  else {
    succ = admin_detail
    console.log(`655-succ`, "succ")
    let id = req.query.id;
    console.log("657-id", id)
    const sender_address = admin_wallet;
    if (id && id != "" && id != undefined) {
      //console.log("660-in if")
      await OrderDetails.findOne({ _id: id }).then(async result => {
        console.log(`660-result`, result)
        var reciever_address = result.rwn_wallet_address;
        var amount = result.rwn_count;
        var user_id = result.user_id;
        await RefCode.findOne({ user_id: user_id, status: "Not used" }).then(async ref => {
          console.log("665-refResult", ref);
          if (ref != null) {
            var refID = ref._id;
            var reg_code = ref.reg_ref_code;
            await Registration.findOne({ ref_code: reg_code }).then(async bonusUser => {
              var bonusUserId = bonusUser._id;
              await Importwallet.findOne({ 'user_id': bonusUserId, 'login_status': 'login' }).then(async loginwallet => {
                if (loginwallet != "" && loginwallet != null && loginwallet != undefined) {
                  await Userwallet.findOne({ '_id': loginwallet.wallet_id })
                    .then(async bonususerAdd => {
                      var bonusAmount = (amount / 100) * 3;
                      var bonusWalletAddress = bonususerAdd.wallet_address;
                      res.render('admin/front-admin/send-token.ejs', { sender_address, id, Name: req.session.user_name, profile_image: req.session.profile_image, amount, bonusAmount, bonusWalletAddress, refID, user_id, reciever_address, user_main_id: succ._id, expressFlash: req.flash() });
                    }).catch(err => { })
                } else {
                  await Userwallet.findOne({ user_id: bonusUserId, status: "active" })
                    .then(async bonususerAdd => {
                      var bonusAmount = (amount / 100) * 3;
                      var bonusWalletAddress = bonususerAdd.wallet_address;
                      res.render('admin/front-admin/send-token.ejs', { sender_address, id, Name: req.session.user_name, profile_image: req.session.profile_image, amount, bonusAmount, bonusWalletAddress, refID, user_id, reciever_address, user_main_id: succ._id, expressFlash: req.flash() });
                    }).catch(err => { })
                }
              }).catch(err => { })
            })
              .catch(err => { })

          } else {
            var refID = "";
            var bonusAmount = "";
            var bonusWalletAddress = "";
            res.render('admin/front-admin/send-token.ejs', { sender_address, id, Name: req.session.user_name, profile_image: req.session.profile_image, amount, bonusAmount, bonusWalletAddress, refID, user_id, reciever_address, user_main_id: succ._id, expressFlash: req.flash() });
          }
        })

      })
        .catch(err => {
        })
    } else {

      //console.log("711-in else")
      let reciever_address = "";
      let amount = "";
      let refID = "";
      var bonusAmount = "";
      var bonusWalletAddress = "";
      id = "";
      let user_id = "";
      res.render('admin/front-admin/send-token.ejs', { sender_address, id, Name: req.session.user_name, profile_image: req.session.profile_image, amount, bonusAmount, bonusWalletAddress, refID, user_id, reciever_address, user_main_id: succ._id, expressFlash: req.flash() });
    }
  }


});


routes.post('/submit-token',middleware_check_login, async (req, res, next) => {
  var orderId = req.body.orderId.trim();
  var user_id = req.body.user_id.trim();

  var bonusWalletAddress = req.body.bonusAddress.trim();
  var bonusAmount = req.body.bonusamount.trim();
  var refID = req.body.refID.trim();
  var entered_passphrese = req.body.enter_passphrase.trim();
  var sender_private_key;

  var sender_address = req.body.sender_address.trim();
  var reciver_address = req.body.reciver_address.trim();
  var get_amount = req.body.amount_send.trim();
  var email = req.session.re_usr_email;
  AdminInfo.findOne({ "email": email }).then(async (succ) => {
    if (succ.user_type == "manager") {
      var entered_passphrese1 = crypto.createHash('sha256').update(entered_passphrese).digest('base64');
      var matching_pass = succ.passphrase;

      if (entered_passphrese1 == matching_pass) {
        var options4 = {
          url: "http://3.137.11.222:8502",
          method: 'POST',
          headers:
          {
            "content-type": "application/json"
          },

          body: JSON.stringify({ "jsonrpc": "2.0", "method": "personal_listWallets", "params": [], "id": 1 })
        };
        await request(options4, async function (error, response, body) {

          var c = JSON.parse(body).result;
          console.log("c.length ", c.length);
          c.forEach(function (element) {

            var accounts_details = element.accounts;
            accounts_details.forEach(async function (element1) {

              if (element1.address == sender_address) {

                var parts = element1.url.split('/');
                var lastSegment = parts.pop() || parts.pop();
                console.log("lastSegment", lastSegment);

                var options6 = {
                  url: `http://3.137.11.222/devnetwork/node2/keystore/${lastSegment}`,
                  method: 'GET',
                  headers: {
                    "content-type": "application/json"
                  }
                }
                await request(options6, async function (error, response, body) {
                  console.log("error", error);
                  console.log("body", body);

                  if (!error && response.statusCode == 200) {
                    var csv = body;
                    console.log(csv)
                    var c = web3js.eth.accounts.decrypt(csv, entered_passphrese);
                    console.log(c.privateKey);
                    var pk = c.privateKey.slice(2);
                    sender_private_key = pk;
                    var privateKey = Buffer.from(sender_private_key, 'hex');
                    console.log("private key", privateKey);
                    var options = {
                      url: "http://3.137.11.222:8502",
                      method: 'POST',
                      headers:
                      {
                        "content-type": "application/json"
                      },
                      body: JSON.stringify({ "jsonrpc": "2.0", "method": "personal_unlockAccount", "params": [sender_address, entered_passphrese], "id": 1 })
                    };
                    await request(options, function (error, response, body) {
                      console.log("----------", error);
                      if (!error && response.statusCode == 200) {
                        console.log(body);



                        var options = {
                          url: "http://3.137.11.222:8502",
                          method: 'POST',
                          headers:
                          {
                            "content-type": "application/json"
                          },
                          body: JSON.stringify({ "jsonrpc": "2.0", "method": "clique_getSigners", "params": [], "id": 1 })
                        };
                        request(options, function (error5, response5, body5) {
                          if (!error5 && response5.statusCode == 200) {
                            var validators = JSON.parse(body5);
                            var all_validators = validators.result;

                            console.log("inside" + all_validators);
                            var user1 = tokenContractABI;
                            var tokenContract = new web3js.eth.Contract(user1, "0xb1b370178BfCe52Db662fbEF0AF0EE7DDB2f5719");
                            var count;
                            var array_donation = [];

                            tokenContract.methods.balanceOf(sender_address).call().then(function (result) {
                              // console.log(result);
                              var count_balance = parseInt(result);
                              rown_bal = count_balance / Math.pow(10, 7);
                              console.log(rown_bal);
                              if (rown_bal >= get_amount) {
                                web3js.eth.getTransactionCount(sender_address).then(ex => {
                                  console.log("exxxxxxxxxxxx", ex);
                                })

                                web3js.eth.getTransactionCount(sender_address).then(function (v) {
                                  console.log("Count: " + v);
                                  count = v;
                                  console.log("Count: " + count);
                                  var amount = Math.round(get_amount * 100) / 100;

                                  var rawTransaction = {
                                    "from": sender_address,
                                    "gasPrice": '0x0',
                                    "gasLimit": web3js.utils.toHex(4600000),
                                    "to": '0xb1b370178BfCe52Db662fbEF0AF0EE7DDB2f5719',
                                    "value": "0x0",
                                    "data": tokenContract.methods.transferAndDonateTo(reciver_address, amount * Math.pow(10, 7), array_donation, '0x5Cb3c2f2fD2502723841728C9771bB4E41A156eE').encodeABI(),
                                    "nonce": web3js.utils.toHex(count)
                                  }

                                  var transaction = new Tx(rawTransaction);
                                  transaction.sign(privateKey);
                                  web3js.eth.sendSignedTransaction('0x' + transaction.serialize().toString('hex'), (err, hash) => {
                                    console.log("errrrrrrrrrrrrrrrrrrrr", err);
                                    if (hash != "" && hash != null && hash != undefined) {


                                      var indiaTime = new Date().toLocaleString("en-US", { timeZone: "Europe/London" });
                                      var indiaTime = new Date(indiaTime);
                                      var created_at = indiaTime.toLocaleString();

                                      Tokendetails.count(function (err, respcount) {
                                        var count_val = parseFloat(respcount) + parseFloat(1);

                                        var TokendetailsData = new Tokendetails({

                                          auto: count_val,
                                          sender_wallet_address: sender_address,
                                          receiver_wallet_address: reciver_address,
                                          hash: hash,
                                          amount: get_amount,
                                          payment_status: 'pending',
                                          created_at: created_at,
                                          status: 'active',
                                          token_type: '$EBT',
                                          transaction_type: 'Send'

                                        });
                                        TokendetailsData.save(function (err, doc) {
                                          if (err) {
                                            console.log('token data is not save.');
                                          } else {




                                            /******Store in session*******/
                                            var err_msg = '';
                                            var success_msg = '';

                                            // res.render('admin/verify-payment',{
                                            // err_msg,success_msg,secret_code,dataURL,count,bonusWalletAddress,result,bonusAmount,sender_address,user_id,refID,orderId
                                            // });
                                            if (bonusWalletAddress != "") {
                                              console.log("referral", bonusWalletAddress);
                                              setTimeout(function () {
                                                res.redirect(`/referral?bonusWalletAddress=${bonusWalletAddress}&result=${result}&bonusAmount=${bonusAmount}&sender_address=${sender_address}&user_id=${user_id}&refID=${refID}&orderId=${orderId}`);
                                              }, 15000);

                                            } else {
                                              if (orderId) {



                                                OrderDetails.updateOne({ '_id': orderId }, { $set: { 'payment_status': 'Paid' } }, function (err, result1) {
                                                  if (err) { console.log(err); }
                                                  else {
                                                    req.flash('success', 'Your transaction in done.');
                                                    res.redirect('/artw-token-history');
                                                  }
                                                });
                                              } else {
                                                req.flash('success', 'Your transaction in done.');
                                                res.redirect('/artw-token-history');
                                              }

                                            }
                                          }
                                        });
                                      });
                                    }

                                    else {
                                      req.flash('fail', "Insufficient funds In Your account.1");
                                      res.redirect('send-token');

                                    }
                                  })
                                });
                              }
                              else {
                                req.flash('fail', "Insufficient funds In Your account.2");
                                res.redirect('send-token');
                              }
                            });

                          }
                        });

                      }
                      else {
                        res.write(response.statusCode.toString() + " " + error);
                      }
                    });

                  }
                })
              }
            });
          });
        });
      } else {
        req.flash('fail', 'Please enter valid passphrase.');
        res.redirect('send-token');
      }
    } else {
      var entered_passphrese1 = entered_passphrese;
      var matching_pass = 'Pass@ArtW_node1';
      sender_private_key = '0de3838ca99bd85255bc630733f7d72484508cc3a8cd9c03a59d6d97aa9bf83b';
      var privateKey = Buffer.from(sender_private_key, 'hex');
      if (entered_passphrese1 == matching_pass) {

        console.log("private key", privateKey);
        var options = {
          url: "http://3.137.11.222:8502",
          method: 'POST',
          headers:
          {
            "content-type": "application/json"
          },
          body: JSON.stringify({ "jsonrpc": "2.0", "method": "personal_unlockAccount", "params": [sender_address, entered_passphrese], "id": 1 })
        };
        await request(options, function (error, response, body) {
          console.log("----------", error);
          if (!error && response.statusCode == 200) {
            console.log(body);



            var options = {
              url: "http://3.137.11.222:8502",
              method: 'POST',
              headers:
              {
                "content-type": "application/json"
              },
              body: JSON.stringify({ "jsonrpc": "2.0", "method": "clique_getSigners", "params": [], "id": 1 })
            };
            request(options, function (error5, response5, body5) {
              if (!error5 && response5.statusCode == 200) {
                var validators = JSON.parse(body5);
                var all_validators = validators.result;

                console.log("inside" + all_validators);





                var user1 = tokenContractABI;
                var tokenContract = new web3js.eth.Contract(user1, "0xb1b370178BfCe52Db662fbEF0AF0EE7DDB2f5719");
                var count;
                var array_donation = [];

                tokenContract.methods.balanceOf(sender_address).call().then(function (result) {
                  // console.log(result);
                  var count_balance = parseInt(result);
                  rown_bal = count_balance / Math.pow(10, 7);
                  console.log(rown_bal);
                  if (rown_bal >= get_amount) {
                    web3js.eth.getTransactionCount(sender_address).then(ex => {
                      console.log("exxxxxxxxxxxx", ex);
                    })

                    web3js.eth.getTransactionCount(sender_address).then(function (v) {
                      console.log("Count: " + v);
                      count = v;
                      console.log("Count: " + count);
                      var amount = Math.round(get_amount * 100) / 100;

                      var rawTransaction = {
                        "from": sender_address,
                        "gasPrice": '0x0',
                        "gasLimit": web3js.utils.toHex(4600000),
                        "to": '0xb1b370178BfCe52Db662fbEF0AF0EE7DDB2f5719',
                        "value": "0x0",
                        "data": tokenContract.methods.transferAndDonateTo(reciver_address, amount * Math.pow(10, 7), array_donation, '0x5Cb3c2f2fD2502723841728C9771bB4E41A156eE').encodeABI(),
                        "nonce": web3js.utils.toHex(count)
                      }

                      var transaction = new Tx(rawTransaction);
                      transaction.sign(privateKey);
                      web3js.eth.sendSignedTransaction('0x' + transaction.serialize().toString('hex'), (err, hash) => {
                        console.log("errrrrrrrrrrrrrrrrrrrr", err);
                        if (hash != "" && hash != null && hash != undefined) {


                          var indiaTime = new Date().toLocaleString("en-US", { timeZone: "Europe/London" });
                          var indiaTime = new Date(indiaTime);
                          var created_at = indiaTime.toLocaleString();

                          Tokendetails.count(function (err, respcount) {
                            var count_val = parseFloat(respcount) + parseFloat(1);

                            var TokendetailsData = new Tokendetails({

                              auto: count_val,
                              sender_wallet_address: sender_address,
                              receiver_wallet_address: reciver_address,
                              hash: hash,
                              amount: get_amount,
                              payment_status: 'pending',
                              created_at: created_at,
                              status: 'active',
                              token_type: 'ARTW',
                              transaction_type: 'Send'

                            });
                            TokendetailsData.save(function (err, doc) {
                              if (err) {
                                console.log('token data is not save.');
                              } else {






                                /******Store in session*******/
                                var err_msg = '';
                                var success_msg = '';

                                // res.render('admin/verify-payment',{
                                // err_msg,success_msg,secret_code,dataURL,count,bonusWalletAddress,result,bonusAmount,sender_address,user_id,refID,orderId
                                // });
                                if (bonusWalletAddress != "") {
                                  setTimeout(function () {
                                    res.redirect(`/referral?bonusWalletAddress=${bonusWalletAddress}&result=${result}&bonusAmount=${bonusAmount}&sender_address=${sender_address}&user_id=${user_id}&refID=${refID}&orderId=${orderId}`);
                                  }, 15000);
                                } else {
                                  if (orderId) {



                                    OrderDetails.updateOne({ '_id': orderId }, { $set: { 'payment_status': 'Paid' } }, function (err, result1) {
                                      if (err) { console.log(err); }
                                      else {
                                        req.flash('success', 'Your transaction in done.');
                                        res.redirect('/artw-token-history');
                                      }
                                    });
                                  } else {
                                    req.flash('success', 'Your transaction in done.');
                                    res.redirect('/artw-token-history');
                                  }
                                }
                              }
                            });
                          });
                        }

                        else {
                          req.flash('fail', "Insufficient funds In Your account.1");
                          res.redirect('send-token');

                        }
                      })
                    });
                  }
                  else {
                    req.flash('fail', "Insufficient funds In Your account.2");
                    res.redirect('send-token');
                  }
                });

              }
            });

          }
          else {
            res.write(response.statusCode.toString() + " " + error);
          }
        });
      }
      else {
        req.flash('fail', 'Please enter valid passphrase.');
        res.redirect('send-token');
      }
    }


  });
})


routes.get('/referral', middleware_check_login, (req, res, next) => {
  var array_donation = [];
  // var created_at = new Date();
  var bonusWalletAddress = req.query.bonusWalletAddress;
  var result = req.query.result;
  var count = req.query.count;
  var bonusAmount = req.query.bonusAmount;
  var sender_address = req.query.sender_address;
  var user_id = req.query.user_id;
  var orderId = req.query.orderId;
  var sender_private_key = 'ca45278ef6a080b00e4b38f998362f622fa8a336b9d75f20eb0609e53cfc1d16';
  var privateKey = Buffer.from(sender_private_key, 'hex');

  var refID = req.query.refID;
  var user1 = tokenContractABI;
  var tokenContract = new web3js.eth.Contract(user1, "0x0296b77A92Ee270b8a0b157Cc744E9f102af6C51");
  // if(bonusWalletAddress!=""){
  var count_balance1 = parseInt(result);
  rown_bal1 = count_balance1 / Math.pow(10, 7);
  console.log(rown_bal1);
  if (rown_bal1 >= bonusAmount) {
    web3js.eth.getTransactionCount(sender_address).then(function (w) {
      console.log("Count: " + w);
      // console.log("Count+1: ", parseInt(w)+1);
      countw = w; //parseInt(w)+1;
      var amounts = Math.round(bonusAmount * 100) / 100;
      var rawTransactions = {
        "from": sender_address,
        "gasPrice": '0x0',
        "gasLimit": web3js.utils.toHex(4600000),
        "to": '0xb1b370178BfCe52Db662fbEF0AF0EE7DDB2f5719',
        "value": "0x0",
        "data": tokenContract.methods.transferAndDonateTo(bonusWalletAddress, amounts * Math.pow(10, 7), array_donation, '0x5Cb3c2f2fD2502723841728C9771bB4E41A156eE').encodeABI(),
        "nonce": web3js.utils.toHex(countw)
      }
      // console.log(rawTransaction);
      var transactions = new Tx(rawTransactions);
      transactions.sign(privateKey);
      web3js.eth.sendSignedTransaction('0x' + transactions.serialize().toString('hex'), (errr, hashs) => {
        console.log("transaction hashhhhhh", hashs);
        console.log("transaction error", errr);
        if (hashs != "" && hashs != null && hashs != undefined) {
          RefCode.updateOne({ '_id': refID }, { $set: { 'status': 'Used' } }, { upsert: true }, function (err, result) {
            if (err) { console.log(err); }
            else {
              OrderDetails.updateOne({ '_id': orderId }, { $set: { 'payment_status': 'Paid' } }, { upsert: true }, function (err, result) {
                if (err) { console.log(err); }
                else {
                  Registration.findOne({ "_id": user_id }).then(bonusUser => {
                    Tokendetails.count(function (err, respcounts) {
                      var count_vals = parseFloat(respcounts) + parseFloat(1);
                      var indiaTime = new Date().toLocaleString("en-US", { timeZone: "Europe/London" });
                      var indiaTime = new Date(indiaTime);
                      var created_at = indiaTime.toLocaleString();
                      var TokendetailsDatas = new Tokendetails({
                        auto: count_vals,
                        sender_wallet_address: sender_address,
                        receiver_wallet_address: bonusWalletAddress,
                        hash: hashs,
                        amount: amounts,
                        payment_status: 'pending',
                        created_at: created_at,
                        status: 'active',
                        token_type: '$EBT',
                        transaction_type: 'Send',
                        referred_to_name: bonusUser.name,
                        referred_to_email: bonusUser.email,
                        bonus_reward: 'Yes'
                      });
                      TokendetailsDatas.save(function (err, doc) {
                        if (err) {
                          console.log('token data is not saved.');
                        } else {
                          req.flash('success', 'Your transaction in done.');
                          res.redirect('/artw-token-history');
                        }
                      })
                    })
                  })
                }
              })
            }
          });
        }
      })
    })
  }
})


/*****************Rowan token history****************/
routes.get('/artw-token-history', middleware_check_login, (req, res) => {
  AdminInfo.findOne({ email: req.session.re_usr_email }).then(admin_info => {
    if (admin_info.user_type == "admin") {
      Tokendetails.find({ deleted: '0' }).sort([['auto', -1]]).then((success_response) => {

        res.render('admin/front-admin/artw_token_history', { Name: req.session.user_name, profile_image: req.session.profile_image, ether_data: success_response });

      }, (err) => {
        res.send('something went wrong try again');

      }).catch((e) => {
        res.send('something went wrong try again');

      });
    } else {
      var wallet_address = admin_info.user_wallet;
      Tokendetails.find({ deleted: '0', $or: [{ sender_wallet_address: wallet_address }, { receiver_wallet_address: wallet_address }] }).sort([['auto', -1]]).then((success_response) => {

        res.render('admin/front-admin/artw_token_history', { Name: req.session.user_name, profile_image: req.session.profile_image, ether_data: success_response });

      }, (err) => {
        res.send('something went wrong try again');

      }).catch((e) => {
        res.send('something went wrong try again');

      });
    }

  })


  Tokendetails.find({ 'payment_status': 'pending' }, function (err, response) {
    if (response != "" && response != null && response != undefined) {
      for (var i = 0; i < response.length; i++) {
        console.log(response.length);
        check_tx_status(response[i].hash, response[i]._id, function (err, respo) {
          console.log(respo);
        });
      }
    } else {
      console.log('no record found.');
    }

  });


  //////////////////////////////

  function check_tx_status(tx_hash, tx_id, callback) {
    web3js.eth.getTransactionReceipt(tx_hash).then(async send_resu => {
      console.log("======================================== " + send_resu);
      if (send_resu != null && send_resu != "" && send_resu != undefined) {
        await Tokendetails.updateOne({ '_id': tx_id }, { $set: { 'payment_status': 'paid' } }, { upsert: true }, async function (err, result) {
          if (err) { console.log(err); }
          else {
            return await callback(null, 'tx success');
          }
        });
      }
      else {
        return await callback(null, 'tx pending.');
      }
    })
      .catch(async err => {
        return await callback(null, err);
      })
  }

});

routes.get('/update-token', middleware_check_login, async (req, res) => {
  err_msg = req.flash('err_msg');
  success_msg = req.flash('success_msg');
  await Tokensettings.findOne().then(async result => {
    console.log("result-------", result);
    let ebt_bal = await ethHelper.coinBalanceETH(admin_wallet)
    res.render('admin/front-admin/update-token', {
      err_msg, success_msg, layout: false, session: req.session, Name: req.session.user_name, profile_image: req.session.profile_image, result, actual_balance: ebt_bal
    })

  })
    .catch(err => {
      console.log(err);
    })
})

routes.post('/update-token-details',middleware_check_login, (req, res) => {
  console.log("req.body------------- ", req.body);
  var id = req.body.edit_id.trim();
  var token_name = req.body.token_name;
  var total_quantity = req.body.total_quantity;
  var etherValue = req.body.ether_value;
  var btcValue = req.body.btc_value;
  var usdValue = req.body.USD_value;

  Tokensettings.updateOne({ '_id': id }, {
    $set: {
      'token_name': token_name,
      'total_quantity': total_quantity,
      'etherValue': etherValue,
      'btcValue': btcValue,
      'usdValue': usdValue
    }
  }, { upsert: true }, function (err, result1) {
    if (err) {
      console.log(err);
      req.flash('err_msg', "Please try again.");
      res.redirect('/token_details');
    }
    else {
      console.log("saved", result1);
      req.flash('success_msg', "Settings updated successfully.");
      res.redirect('/token_details');
    }
  })


})


routes.get('/BTC-OrderList', middleware_check_login, (req, res) => {
  OrderDetails.find({ payment_type: "BTC" }).populate({ path: "user_id" }).sort({ _id: -1 }).then((results) => {
    console.log(results);
    if (results) {
      res.render('admin/front-admin/BTC-order-list', { expressFlash: req.flash(), user_details: results, moment, Name: req.session.user_name, profile_image: req.session.profile_image });
    }
  }, (error) => {
    console.log(error);
  }).catch((e) => {
  });
});


routes.get('/ETH-OrderList', middleware_check_login, (req, res) => {
  OrderDetails.find({ payment_type: "ETH" }).populate({ path: "user_id" }).sort({ _id: -1 }).then((results) => {
    if (results) {
      res.render('admin/front-admin/ETH-order-list', { expressFlash: req.flash(), user_details: results, moment, Name: req.session.user_name, profile_image: req.session.profile_image });
    }
  }, (error) => {
    console.log(error);
  }).catch((e) => {
  });
});


routes.get('/XRP-OrderList', middleware_check_login, (req, res) => {
  OrderDetails.find({ payment_type: "XRP" }).populate({ path: "user_id" }).sort({ _id: -1 }).then((results) => {
    console.log(results);
    if (results) {
      res.render('admin/front-admin/XRP-order-list', { expressFlash: req.flash(), user_details: results, moment, Name: req.session.user_name, profile_image: req.session.profile_image });
    }
  }, (error) => {
    console.log(error);
  }).catch((e) => {
  });
});


routes.get('/LTC-OrderList', middleware_check_login, (req, res) => {
  OrderDetails.find({ payment_type: "LTC" }).populate({ path: "user_id" }).sort({ _id: -1 }).then((results) => {
    console.log(results);
    if (results) {
      res.render('admin/front-admin/LTC-order-list', { expressFlash: req.flash(), user_details: results, moment, Name: req.session.user_name, profile_image: req.session.profile_image });
    }
  }, (error) => {
    console.log(error);
  }).catch((e) => {
  });
});


routes.get('/DASH-OrderList', middleware_check_login, (req, res) => {
  OrderDetails.find({ payment_type: "DASH" }).populate({ path: "user_id" }).sort({ _id: -1 }).then((results) => {
    console.log(results);
    if (results) {
      res.render('admin/front-admin/DASH-order-list', { expressFlash: req.flash(), user_details: results, moment, Name: req.session.user_name, profile_image: req.session.profile_image });
    }
  }, (error) => {
    console.log(error);
  }).catch((e) => {
  });
});


routes.get('/cancelBTC', middleware_check_login, (req, res, next) => {
  var id = req.query.id;
  OrderDetails.update({ _id: id }, {
    $set: {
      payment_status: 'Cancelled'
    }
  }, { upsert: true }, function (err) {
    if (err) {
    }
    else {
      res.redirect('/BTC-OrderList');
    }
  })
})

routes.get('/cancelETH', middleware_check_login, (req, res, next) => {
  var id = req.query.id;
  OrderDetails.update({ _id: id }, {
    $set: {
      payment_status: 'Cancelled'
    }
  }, { upsert: true }, function (err) {
    if (err) {
    }
    else {
      res.redirect('/ETH-OrderList');
    }
  })
})

routes.get('/cancelXRP', middleware_check_login, (req, res, next) => {
  var id = req.query.id;
  OrderDetails.update({ _id: id }, {
    $set: {
      payment_status: 'Cancelled'
    }
  }, { upsert: true }, function (err) {
    if (err) {
    }
    else {
      res.redirect('/XRP-OrderList');
    }
  })
})

routes.get('/cancelLTC', middleware_check_login, (req, res, next) => {
  var id = req.query.id;
  OrderDetails.update({ _id: id }, {
    $set: {
      payment_status: 'Cancelled'
    }
  }, { upsert: true }, function (err) {
    if (err) {
    }
    else {
      res.redirect('/LTC-OrderList');
    }
  })
})

routes.get('/cancelDASH', middleware_check_login, (req, res, next) => {
  var id = req.query.id;
  OrderDetails.update({ _id: id }, {
    $set: {
      payment_status: 'Cancelled'
    }
  }, { upsert: true }, function (err) {
    if (err) {
    }
    else {
      res.redirect('/DASH-OrderList');
    }
  })
})


routes.get('/stakes-list', middleware_check_login, async (req, res) => {

  err_msg = req.flash('err_msg');
  success_msg = req.flash('success_msg');

  var stakes = [];
  await MainStake.find({}).sort({ _id: -1 }).then(async (success_response) => {
    if (success_response) {
      for (var i = 0; i < success_response.length; i++) {
        await Registration.findOne({ _id: success_response[i].user_id }).then(async user => {
          await Stake.find({ m_stake_id: success_response[i]._id }).sort({ _id: -1 }).lean().then((vault_list) => {
            for (var j = 0; j < vault_list.length; j++) {
              vault_list[j].email = user.email;
              stakes.push(vault_list[j]);
            }
          })
        })
      }
      console.log("stakes ", stakes);
      res.render('admin/front-admin/stake-list', { err_msg, success_msg, expressFlash: req.flash(), stakes: stakes, Name: req.session.user_name, profile_image: req.session.profile_image });
    }
  }).catch((e) => {
    res.send('Something went wrong try again');
  });

});

routes.get('/set-stake', middleware_check_login, (req, res) => {
  err_msg = req.flash('err_msg');
  success_msg = req.flash('success_msg');

  StakeRate.findOne().then((SetVaultData) => {
    console.log('SetVaultData', SetVaultData)

    res.render('admin/front-admin/set-stake.ejs', { err_msg, success_msg, Name: req.session.user_name, profile_image: req.session.profile_image, session: req.session, expressFlash: req.flash(), SetVaultData });

  }, (err) => {
    ssss

    res.send('Some thing went wrong try again.');

  }).catch((e) => {

    res.send('Some thing went wrong try again.');

  });

});

routes.get('/wallet', middleware_check_login,function(req,res){

  res.render('admin/wallet/index', {
    Name: req.session.user_name, session: req.session
     }); 

});


routes.get('/referal', middleware_check_login,function(req,res){

  res.render('admin/referal/index', {
    Name: req.session.user_name, session: req.session
     }); 

});

routes.get('/transactions', middleware_check_login,function(req,res){

  res.render('admin/transactions/index', {
    Name: req.session.user_name, session: req.session
     }); 

});

routes.get('/admin-profile', middleware_check_login,function(req,res){

  res.render('admin/profile/index', {
    Name: req.session.user_name, session: req.session
     }); 

});

routes.post('/update_set_stake', middleware_check_login, (req, res) => {

  var vaultrate = req.body.vaultrate;
  var id = req.body.id;
  var updated_at = new Date();

  StakeRate.update({ _id: id }, {
    $set: {
      interest_rate: vaultrate,
      updated_at: updated_at,
    }
  }, { upsert: true }, function (err) {
    if (err) {
      req.flash('err_msg', 'Something went wrong.');
      res.redirect('/set-stake');
    }
    else {
      req.flash('success_msg', 'Stake rate updated successfully.');
      res.redirect('/set-stake');
    }
  })
});



/********************************* Home Banner   ****************************/

routes.get('/home-banner-details', middleware_check_login,(req, res) => {

  err_msg = req.flash('err_msg');
  success_msg = req.flash('success_msg');

  // session: req.session
  console.log('req.session', req.session)

  // AdminInfo.findOne().then((succ)=>{
  BannerInfo.find({ deleted: '0' }).then((BannerData) => {
    console.log(BannerData)
    res.render('admin/front-admin/home-banner-details.ejs', { err_msg, success_msg, Name: req.session.user_name, profile_image: req.session.profile_image, session: req.session, expressFlash: req.flash(), BannerData });

  }, (err) => {

    res.send('Some thing went wrong try again.');

  }).catch((e) => {

    res.send('Some thing went wrong try again.');

  });
  // });
});

routes.get('/add-new-banner', middleware_check_login, (req, res) => {

  AdminInfo.findOne().then((succ) => {

    res.render('admin/front-admin/add-new-banner.ejs', { Name: req.session.user_name, profile_image: req.session.profile_image, user_main_id: succ._id, session: req.session, expressFlash: req.flash() });

  }, (err) => {

    res.send('Some thing went wrong try again.');

  }).catch((e) => {

    res.send('Some thing went wrong try again.');

  });
});

routes.post('/add_banner',middleware_check_login, (req, res) => {
  const form = formidable({ multiples: true });
  form.parse(req, (err, fields, files) => {
    var imageFile = typeof files.banner_image !== "undefined" ? files.banner_image.name : "";
    if (imageFile != "") {
      banner_image = imageFile;

      if (imageFile != "") {
        var imgpath = 'public/home/banner/' + imageFile;
        let testFile = fs.readFileSync(files.banner_image.path);
        let testBuffer = new Buffer(testFile);
        fs.writeFile(imgpath, testBuffer, function (err) {
          if (err) return console.log(err);
        });
      }
    } else {
      banner_image = "";
    }

    var title = fields.title;
    var content = fields.content;
    var status = fields.status;
    var created_at = Date.now();

    var BannerData = new BannerInfo({
      title: title, content: content, banner_image: banner_image, status: status, created_at: created_at
    });

    BannerData.save().then(result => {
      console.log('data added', result);
      req.flash('success_msg', 'Banner added successfully.');
      res.redirect('/home-banner-details');
    })
      .catch(err => {
        console.log(err);
      })
  });
});

routes.get('/edit-banner', middleware_check_login, (req, res) => {

  var banner_id = req.query.id;
  console.log(banner_id)
  BannerInfo.findOne({ _id: banner_id, deleted: '0' }).then((BannerDetail) => {
    console.log('BannerDetail', BannerDetail);

    res.render('admin/front-admin/edit-banner.ejs', { Name: req.session.user_name, profile_image: req.session.profile_image, session: req.session, expressFlash: req.flash(), BannerDetail });

  }, (err) => {

    res.send('Some thing went wrong try again.');

  }).catch((e) => {

    res.send('Some thing went wrong try again.');

  });
});

routes.post('/update_banner', middleware_check_login, (req, res) => {
  const form = formidable({ multiples: true });
  form.parse(req, (err, fields, files) => {

    if (files != null && files != undefined && files != '') {
      var imageFile = typeof files.banner_image !== "undefined" ? files.banner_image.name : "";
    } else {
      var imageFile = '';
    }
    if (imageFile != "") {
      banner_image = imageFile;

      if (imageFile != "") {
        var imgpath = 'public/home/banner/' + imageFile;
        let testFile = fs.readFileSync(files.banner_image.path);
        let testBuffer = new Buffer(testFile);
        fs.writeFile(imgpath, testBuffer, function (err) {
          if (err) return console.log(err);
        });
      }
    } else {
      banner_image = fields.old_image;
    }

    var title = fields.title;
    var content = fields.content;
    var status = fields.status;
    var banner_id = fields.banner_id;
    var updated_at = Date.now();

    BannerInfo.update({ _id: banner_id }, {
      $set: {
        title: title,
        banner_image: banner_image,
        content: content,
        status: status,
        updated_at: updated_at,
      }
    }, { upsert: true }, function (err) {
      if (err) {

        req.flash('err_msg', 'Something went wrong.');
        res.redirect('/home-banner-details');
      }
      else {
        req.flash('success_msg', 'Banner updated successfully.');
        res.redirect('/home-banner-details');
      }
    })
  })

});

routes.get('/delete-banner',middleware_check_login, (req, res) => {

  var current_time = Date.now();

  var banner_id = req.query.id;

  BannerInfo.findByIdAndUpdate(banner_id, { $set: { deleted: '1', updated_at: current_time } }, { new: true }).then((success) => {

    if (success) {

      req.flash('success_msg', 'Banner deleted successfully.');

      res.redirect('/home-banner-details');
    }

  }, (error) => {

    req.flash('err_msg', 'Something went wrong try again.');

    res.redirect('/home-banner-details');

  }).catch((e) => {

    req.flash('err_msg', 'Something went wrong try again.');

    res.redirect('/home-banner-details');
  });

});

// ***************************************************************************************//

routes.get('/key-features',middleware_check_login, (req, res) => {
  KeyFeaturesInfo.find({ deleted: '0' }).then((keyFeatures) => {
    res.render('admin/front-admin/key-features', { err_msg, success_msg, Name: req.session.user_name, profile_image: req.session.profile_image, session: req.session, expressFlash: req.flash(), keyFeatures })
  }, (err) => {
    res.send('Some thing went wrong try again.');
  }).catch((e) => {
    res.send('Some thing went wrong try again.');
  });
})


routes.get('/add-new-key-features',middleware_check_login,  (req, res) => {

  res.render('admin/front-admin/add-new-key-features', { err_msg, success_msg, Name: req.session.user_name, profile_image: req.session.profile_image, session: req.session, expressFlash: req.flash() })
})

routes.post('/add-new-key-features', middleware_check_login, (req, res) => {


  const form = formidable({ multiples: true });
  form.parse(req, (err, fields, files) => {
    var imageFile = typeof files.banner_image !== "undefined" ? files.banner_image.name : "";
    if (imageFile != "") {
      banner_image = imageFile;

      if (imageFile != "") {
        var imgpath = 'public/home/key-feature/' + imageFile;
        let testFile = fs.readFileSync(files.banner_image.path);
        let testBuffer = new Buffer(testFile);
        fs.writeFile(imgpath, testBuffer, function (err) {
          if (err) return console.log(err);
        });
      }
    } else {
      banner_image = "";
    }

    var title = fields.title;
    var content = fields.content;
    var status = fields.status;
    var created_at = Date.now();

    var KeyFeature = new KeyFeaturesInfo({
      title: title, content: content, feature_image: banner_image, status: status, created_at: created_at, created_by: req.session.user_name,

    });

    KeyFeature.save().then(result => {
      console.log('data added', result);
      req.flash('success_msg', 'Banner added successfully.');
      res.redirect('/key-features');
    })
      .catch(err => {
        console.log(err);
      })
  });

})


routes.get('/edit-key-features', middleware_check_login, (req, res) => {

  var feature_id = req.query.id;
  console.log(feature_id)
  KeyFeaturesInfo.findOne({ _id: feature_id, deleted: '0' }).then((featureDetail) => {
    console.log('featureDetail', featureDetail);

    res.render('admin/front-admin/edit-key-feature.ejs', { Name: req.session.user_name, profile_image: req.session.profile_image, session: req.session, expressFlash: req.flash(), featureDetail });

  }, (err) => {

    res.send('Some thing went wrong try again.');

  }).catch((e) => {

    res.send('Some thing went wrong try again.');

  });
});


routes.post('/update-key-features', middleware_check_login, (req, res) => {
  console.log('1832', req.body)

  const form = formidable({ multiples: true });
  form.parse(req, (err, fields, files) => {

    if (files != null && files != undefined && files != '') {
      var imageFile = typeof files.banner_image !== "undefined" ? files.banner_image.name : "";
    } else {
      var imageFile = '';
    }
    if (imageFile != "") {
      banner_image = imageFile;

      if (imageFile != "") {
        var imgpath = 'public/home/banner/key-feature/' + imageFile;
        let testFile = fs.readFileSync(files.banner_image.path);
        let testBuffer = new Buffer(testFile);
        fs.writeFile(imgpath, testBuffer, function (err) {
          if (err) return console.log(err);
        });
      }
    } else {
      banner_image = fields.old_image;
    }

    var title = fields.title;
    var content = fields.editor1;
    var status = fields.status;
    var id = req.query.id;
    var updated_at = Date.now();

    console.log(id)
    console.log(content)

    KeyFeaturesInfo.update({ _id: id }, {
      $set: {
        title: title,
        content: content,
        status: status,
        updated_at: updated_at,
      }
    }, { upsert: true }, function (err) {
      if (err) {

        req.flash('err_msg', 'Something went wrong.');
        res.redirect('/key-features');
      }
      else {
        req.flash('success_msg', 'Partner updated successfully.');
        res.redirect('/key-features');
      }
    })
  })
});


routes.get('/delete-key-feature', middleware_check_login, (req, res) => {


  id = req.query.id
  KeyFeaturesInfo.findOne({ _id: id, deleted: '0' }).then(async (feature) => {

    feature.deleted = '1'
    await feature.save()
    res.redirect('/key-feature')

  }, (err) => {
    res.send('Some thing went wrong try again.');
  }).catch((e) => {
    res.send('Some thing went wrong try again.');
  });
})

///////////////////*******problem************//////////////////////////


routes.get('/problem',middleware_check_login, (req, res) => {
  problemInfo.find({ deleted: '0' }).then((problemDetails) => {
    //console.log(problemDetails)
    res.render('admin/front-admin/problem', { err_msg, success_msg, Name: req.session.user_name, profile_image: req.session.profile_image, session: req.session, expressFlash: req.flash(), problemDetails })
  }, (err) => {
    res.send('Some thing went wrong try again.');
  }).catch((e) => {
    res.send('Some thing went wrong try again.');
  });

})

routes.get('/add-new-problem', middleware_check_login, (req, res) => {

  res.render('admin/front-admin/add-new-problem', { err_msg, success_msg, Name: req.session.user_name, profile_image: req.session.profile_image, session: req.session, expressFlash: req.flash() })
})

routes.post('/add-new-problem', middleware_check_login, (req, res) => {
  console.log(req.body)
  const form = formidable({ multiples: true });
  form.parse(req, (err, fields, files) => {
    var imageFile = typeof files.problemImage !== "undefined" ? files.problemImage.name : "";
    if (imageFile != "") {
      problemImage = imageFile;
      if (imageFile != "") {
        console.log(files.problemImage.name)
        var imgpath = 'public/home/problem/' + imageFile;
        let testFile = fs.readFileSync(files.problemImage.path);
        let testBuffer = new Buffer(testFile);
        fs.writeFile(imgpath, testBuffer, function (err) {
          if (err) return console.log(err);
        });
      }
    } else {
      problemImage = "";
    }

    var title = fields.title;
    var content = fields.editor1;
    var created_at = Date.now();
    var problem = new problemInfo({
      title: title, content: content, problem_image: problemImage, created_at: created_at, created_by: req.session.user_name,

    });

    problem.save().then(result => {
      console.log('problem added', result);
      req.flash('success_msg', 'Banner added successfully.');
      res.redirect('/problem');
    })
      .catch(err => {
        console.log(err);
      })
  });
})

routes.get('/edit-problem', middleware_check_login, (req, res) => {
  console.log('In edit problem')
  id = req.query.id
  problemInfo.findOne({ _id: id, deleted: '0' }).then((problem) => {
    res.render('admin/front-admin/edit-problem', { err_msg, success_msg, Name: req.session.user_name, profile_image: req.session.profile_image, session: req.session, expressFlash: req.flash(), problem })
  }, (err) => {
    res.send('Some thing went wrong try again.');
  }).catch((e) => {
    res.send('Some thing went wrong try again.');
  });
})

routes.post('/edit-problem', middleware_check_login, (req, res) => {
  console.log('In edit problem')
  let problem_image
  const form = formidable({ multiples: true });
  form.parse(req, (err, fields, files) => {
    if (files != null && files != undefined && files != '') {
      var imageFile = typeof files.problem_image !== "undefined" ? files.problem_image.name : "";
    } else {
      var imageFile = '';
    }
    if (imageFile != "") {
      problem_image = imageFile;

      if (imageFile != "") {
        var imgpath = 'public/home/problem/' + imageFile;
        let testFile = fs.readFileSync(files.problem_image.path);
        let testBuffer = new Buffer(testFile);
        fs.writeFile(imgpath, testBuffer, function (err) {
          if (err) return console.log(err);
        });
      }
    } else {
      problem_image = fields.old_image;
    }

    var title = fields.title;
    var content = fields.editor1;
    var status = fields.status;
    var id = req.query.id;
    var updated_at = Date.now();

    console.log(id)
    console.log(content)
    console.log(problem_image)

    problemInfo.update({ _id: id }, {
      $set: {
        title: title,
        content: content,
        status: status,
        updated_at: updated_at,
        problem_image: problem_image
      }
    }, { upsert: true }, function (err) {
      if (err) {
        req.flash('err_msg', 'Something went wrong.');
        res.redirect('/problem');
      }
      else {
        req.flash('success_msg', 'Problem  updated successfully.');
        res.redirect('/problem');
      }
    })
  })
})

routes.get('/delete-problem', middleware_check_login, (req, res) => {
  console.log('In delete problem')
  id = req.query.id
  problemInfo.findOne({ _id: id, deleted: '0' }).then(async (problem) => {
    problem.deleted = '1'
    await problem.save()
    res.redirect('/problem')
  })

})

//////////*****************solutions********************////////
routes.get('/solution', middleware_check_login, (req, res) => {

  solutionInfo.find({ deleted: '0' }).then((solutionsDetails) => {
    //console.log(solutionsDetails)
    res.render('admin/front-admin/solution', { err_msg, success_msg, Name: req.session.user_name, profile_image: req.session.profile_image, session: req.session, expressFlash: req.flash(), solutionsDetails })
  }, (err) => {
    res.send('Some thing went wrong try again.');
  }).catch((e) => {
    res.send('Some thing went wrong try again.');
  });

})

routes.get('/add-new-solution', middleware_check_login, (req, res) => {

  res.render('admin/front-admin/add-new-solution', { err_msg, success_msg, Name: req.session.user_name, profile_image: req.session.profile_image, session: req.session, expressFlash: req.flash() })
})

routes.post('/add-new-solution', middleware_check_login, (req, res) => {

  console.log(req.body)
  date = getFormattedDate()
  console.log(date)
  const form = formidable({ multiples: true });
  form.parse(req, (err, fields, files) => {
    var imageFile = typeof files.solutionImage !== "undefined" ? files.solutionImage.name : "";
    if (imageFile != "") {
      solutionImage = imageFile;
      if (imageFile != "") {
        console.log(files.solutionImage.name)
        var imgpath = 'public/home/solution/' + imageFile;
        let testFile = fs.readFileSync(files.solutionImage.path);
        let testBuffer = new Buffer(testFile);
        fs.writeFile(imgpath, testBuffer, function (err) {
          if (err) return console.log(err);
        });
      }
    } else {
      solutionImage = "";
    }
    //console.log(fields)

    console.log(solutionImage)
    let title = fields.title;
    let content = fields.editor1;
    let status = fields.status;
    let created_at = Date.now();
    let solution = new solutionInfo({
      title: title, content: content, solutionImage: solutionImage, status: status, created_at: created_at, created_by: req.session.user_name,
    });

    solution.save().then(result => {
      console.log('solution added', result);
      req.flash('success_msg', 'solution added successfully.');
      res.redirect('/solution');
    })
      .catch(err => {
        console.log(err);
      })
  });
})

routes.get('/edit-solution', middleware_check_login, (req, res) => {
  id = req.query.id
  console.log('In edit solution', id)
  solutionInfo.findOne({ _id: id, deleted: '0' }).then((solution) => {
    res.render('admin/front-admin/edit-solution', { err_msg, success_msg, Name: req.session.user_name, profile_image: req.session.profile_image, session: req.session, expressFlash: req.flash(), solution })
  }, (err) => {
    res.send('Some thing went wrong try again.');
  }).catch((e) => {
    res.send('Some thing went wrong try again.');
  });
})


routes.post('/edit-solution', middleware_check_login, (req, res) => {

  console.log(req.body)
  date = getFormattedDate()
  console.log(date)
  const form = formidable({ multiples: true });
  form.parse(req, (err, fields, files) => {
    var imageFile = typeof files.solutionImage !== "undefined" ? files.solutionImage.name : "";
    if (imageFile != "") {
      solutionImage = imageFile;
      if (imageFile != "") {
        console.log(files.solutionImage.name)
        var imgpath = 'public/home/solution/' + imageFile;
        let testFile = fs.readFileSync(files.solutionImage.path);
        let testBuffer = new Buffer(testFile);
        fs.writeFile(imgpath, testBuffer, function (err) {
          if (err) return console.log(err);
        });
      }
    } else {
      solutionImage = fields.old_image;
    }
    //console.log(fields)

    console.log(solutionImage)
    let title = fields.title;
    let content = fields.editor1;
    let status = fields.status;
    let id = req.query.id;
    let updated_at = Date.now();

    //console.log(fields)
    solutionInfo.updateOne({ _id: id }, {
      $set: {
        title: title,
        content: content,
        status: status,
        updated_at: updated_at,
        solutionImage: solutionImage
      }
    }, { upsert: true }, function (err) {
      if (err) {
        req.flash('err_msg', 'Something went wrong.');
        res.redirect('/solution');
      }
      else {
        req.flash('success_msg', 'solution  updated successfully.');
        res.redirect('/solution');
      }
    })
  });
})

routes.get('/delete-solution', middleware_check_login, (req, res) => {
  console.log('In delete solution')
  id = req.query.id
  solutionInfo.findOne({ _id: id, deleted: '0' }).then(async (solution) => {
    solution.deleted = '1'
    await solution.save()
    res.redirect('/solution')
  })

})

////////////************* token-allocation ******************//////////
routes.get('/token-allocation', middleware_check_login, (req, res) => {
  tokenAllocation.find({ deleted: '0' }).then((tokenAllocationDetails) => {
    //console.log(solutionsDetails)
    res.render('admin/front-admin/token-allocation', { err_msg, success_msg, Name: req.session.user_name, profile_image: req.session.profile_image, session: req.session, expressFlash: req.flash(), tokenAllocationDetails })
  }, (err) => {
    res.send('Some thing went wrong try again.');
  }).catch((e) => {
    res.send('Some thing went wrong try again.');
  });
})

routes.get('/add-new-token-allocation', middleware_check_login, (req, res) => {

  res.render('admin/front-admin/add-new-token-allocation', { err_msg, success_msg, Name: req.session.user_name, profile_image: req.session.profile_image, session: req.session, expressFlash: req.flash() })
})

routes.post("/add-new-token-allocation", middleware_check_login, (req, res) => {

  console.log(req.body)
  date = getFormattedDate()
  console.log(date)
  const form = formidable({ multiples: true });
  form.parse(req, (err, fields, files) => {
    var imageFile = typeof files.tokenAllocationImage !== "undefined" ? files.tokenAllocationImage.name : "";
    if (imageFile != "") {
      tokenAllocationImage = imageFile;
      if (imageFile != "") {
        console.log(files.tokenAllocationImage.name)
        var imgpath = 'public/home/token-allocation/' + imageFile;
        let testFile = fs.readFileSync(files.tokenAllocationImage.path);
        let testBuffer = new Buffer(testFile);
        fs.writeFile(imgpath, testBuffer, function (err) {
          if (err) return console.log(err);
        });
      }
    } else {
      tokenAllocationImage = "";
    }
    //console.log(fields)

    console.log(tokenAllocationImage)
    let title = fields.title;
    let content = fields.editor1;
    let status = fields.status;
    let created_at = Date.now();
    let newtokenAllocation = new tokenAllocation({
      title: title, content: content, tokenAllocationImage: tokenAllocationImage, status: status, created_at: created_at, created_by: req.session.user_name,
    });

    newtokenAllocation.save().then(result => {
      console.log('newtokenAllocation added', result);
      req.flash('success_msg', 'newtokenAllocation added successfully.');
      res.redirect('/token-allocation');
    })
      .catch(err => {
        console.log(err);
      })
  });
})

routes.get('/edit-token-allocation', middleware_check_login, (req, res) => {
  id = req.query.id
  tokenAllocation.findOne({ _id: id, deleted: '0' }).then((tokenAllocation) => {
    res.render('admin/front-admin/edit-token-allocation', { err_msg, success_msg, Name: req.session.user_name, profile_image: req.session.profile_image, session: req.session, expressFlash: req.flash(), tokenAllocation })
  }, (err) => {
    res.send('Some thing went wrong try again.');
  }).catch((e) => {
    res.send('Some thing went wrong try again.');
  });
})


routes.post('/edit-token-allocation', middleware_check_login, (req, res) => {
  console.log(req.body)
  date = getFormattedDate()
  console.log(date)
  const form = formidable({ multiples: true });
  form.parse(req, (err, fields, files) => {
    var imageFile = typeof files.tokenAllocationImage !== "undefined" ? files.tokenAllocationImage.name : "";
    if (imageFile != "") {
      tokenAllocationImage = imageFile;
      if (imageFile != "") {
        console.log(files.tokenAllocationImage.name)
        var imgpath = 'public/home/token-allocation/' + imageFile;
        let testFile = fs.readFileSync(files.tokenAllocationImage.path);
        let testBuffer = new Buffer(testFile);
        fs.writeFile(imgpath, testBuffer, function (err) {
          if (err) return console.log(err);
        });
      }
    } else {
      tokenAllocationImage = fields.old_image;
    }
    console.log(fields)

    console.log(tokenAllocationImage)
    let title = fields.title;
    let content = fields.editor1;
    let status = fields.status;
    let id = req.query.id;
    let updated_at = Date.now();

    //console.log(fields)
    tokenAllocation.updateOne({ _id: id }, {
      $set: {
        title: title,
        content: content,
        status: status,
        updated_at: updated_at,
        tokenAllocationImage: tokenAllocationImage
      }
    }, { upsert: true }, function (err) {
      if (err) {
        req.flash('err_msg', 'Something went wrong.');
        res.redirect('/token-allocation');
      }
      else {
        req.flash('success_msg', 'token-allocation  updated successfully.');
        res.redirect('/token-allocation');
      }
    })
  });
})

routes.get('/delete-token-allocation', (req, res) => {

  console.log('In delete token-allocation')
  id = req.query.id
  tokenAllocation.findOne({ _id: id, deleted: '0' }).then(async (tokenAllocation) => {
    tokenAllocation.deleted = '1'
    await tokenAllocation.save()
    res.redirect('/token-allocation')
  }, (err) => {
    res.send('Some thing went wrong try again.');
  }).catch((e) => {
    res.send('Some thing went wrong try again.');
  });
})

////////////****************ROADMAP*******************////////////

routes.get('/roadmap',  (req, res) => {
  milestone.find({ deleted: '0' }).then((milestoneData) => {

    res.render('admin/front-admin/roadmap', { err_msg, success_msg, Name: req.session.user_name, profile_image: req.session.profile_image, session: req.session, expressFlash: req.flash(), milestoneData })

  }, (err) => {

    res.send('Some thing went wrong try again.');

  }).catch((e) => {

    res.send('Some thing went wrong try again.');

  });
})

routes.get('/add-new-milestone', (req, res) => {
  err_msg = req.flash('err_msg');
  success_msg = req.flash('success_msg');

  res.render('admin/front-admin/add-new-milestone', { err_msg, success_msg, Name: req.session.user_name, profile_image: req.session.profile_image, session: req.session, expressFlash: req.flash() })

})

routes.post('/add-new-milestone', middleware_check_login, async (req, res) => {
  console.log(req.body)
  const milestoneObject = {
    duration: req.body.Duration,
    content: req.body.editor1,
    status: req.body.status,
    created_at: Date.now(),
    created_by: req.session.user_name
  };
  console.log(milestoneObject)
  try {
    console.log('in try')
    const newmilestone = new milestone(milestoneObject);
    await newmilestone.save();
    console.log(newmilestone)
    res.redirect('/roadmap')
  } catch (error) {
    console.log(error)
  }
})

routes.get('/edit-milestone', (req, res) => {
  id = req.query.id
  milestone.findOne({ _id: id, deleted: '0' }).then((milestone) => {
    res.render('admin/front-admin/edit-milestone', { err_msg, success_msg, Name: req.session.user_name, profile_image: req.session.profile_image, session: req.session, expressFlash: req.flash(), milestone })
  }, (err) => {
    res.send('Some thing went wrong try again.');
  }).catch((e) => {
    res.send('Some thing went wrong try again.');
  });
})

routes.post('/edit-milestone', middleware_check_login, (req, res) => {
  console.log('In edit milestone')
  id = req.query.id
  milestone.findOne({ _id: id, deleted: '0' }).then(async (milestone) => {
    milestone.duration = req.body.duration
    milestone.content = req.body.editor1
    milestone.status = req.body.status

    await milestone.save()
    console.log(milestone)
    res.redirect('/roadmap')
  }, (err) => {
    res.send('Some thing went wrong try again.');
  }).catch((e) => {
    res.send('Some thing went wrong try again.');
  });
})

routes.get('/delete-milestone', (req, res) => {

  console.log('In edit milestone')
  id = req.query.id
  milestone.findOne({ _id: id, deleted: '0' }).then(async (milestone) => {

    milestone.deleted = '1'
    await milestone.save()
    res.redirect('/roadmap')

  }, (err) => {
    res.send('Some thing went wrong try again.');
  }).catch((e) => {
    res.send('Some thing went wrong try again.');
  });
})

//////////////*************whitepaper*****************//////////////

routes.get('/whitepaper',  (req, res) => {
  whitepaperInfo.find({ deleted: '0' }).then((whitePaperData) => {

    res.render('admin/front-admin/whitepaper', { err_msg, success_msg, Name: req.session.user_name, profile_image: req.session.profile_image, session: req.session, expressFlash: req.flash(), whitePaperData })

  }, (err) => {

    res.send('Some thing went wrong try again.');

  }).catch((e) => {

    res.send('Some thing went wrong try again.');

  });
})

routes.get('/add-new-whitepaper', middleware_check_login, (req, res) => {

  res.render('admin/front-admin/add-new-whitepaper', { err_msg, success_msg, Name: req.session.user_name, profile_image: req.session.profile_image, session: req.session, expressFlash: req.flash() })
})

routes.post('/add-new-whitepaper', middleware_check_login, (req, res) => {
  console.log(req.body)
  date = getFormattedDate()
  console.log(date)
  const form = formidable({ multiples: true });
  form.parse(req, (err, fields, files) => {
    var imageFile1 = typeof files.whitepaper !== "undefined" ? files.whitepaper.name : "";
    if (imageFile1 != "") {
      whitepaper = imageFile1;
      if (imageFile1 != "") {
        console.log(files.whitepaper.name)
        var imgpath = 'public/home/whitepaper/' + imageFile1;
        let testFile = fs.readFileSync(files.whitepaper.path);
        let testBuffer = new Buffer(testFile);
        fs.writeFile(imgpath, testBuffer, function (err) {
          if (err) return console.log(err);
        });
      }
    } else {
      whitepaper = "";
    }

    var imageFile2 = typeof files.pitchDeck !== "undefined" ? files.pitchDeck.name : "";
    if (imageFile2 != "") {
      pitchDeck = imageFile2;
      if (imageFile2 != "") {
        console.log(files.pitchDeck.name)
        var imgpath = 'public/home/whitepaper/' + imageFile2;
        let testFile = fs.readFileSync(files.pitchDeck.path);
        let testBuffer = new Buffer(testFile);
        fs.writeFile(imgpath, testBuffer, function (err) {
          if (err) return console.log(err);
        });
      }
    } else {
      pitchDeck = "";
    }


    console.log(fields)
    console.log(pitchDeck)
    console.log(whitepaper)
    let title = fields.title;
    let content = fields.editor1;
    let status = fields.status;
    let created_at = Date.now();
    let whitepaperObject = new whitepaperInfo({
      title: title, content: content, whitepaperImage: whitepaper, status: status, pitchDeckImage: pitchDeck, created_at: created_at, created_by: req.session.user_name,
    });

    whitepaperObject.save().then(result => {
      console.log('Whitepaper added', result);
      req.flash('success_msg', 'Whitepaper added successfully.');
      res.redirect('/whitepaper');
    })
      .catch(err => {
        console.log(err);
      })
  });
})

routes.get('/edit-whitepaper', middleware_check_login, (req, res) => {
  id = req.query.id
  console.log('In edit whitepaper', id)
  whitepaperInfo.findOne({ _id: id, deleted: '0' }).then((whitepaper) => {
    res.render('admin/front-admin/edit-whitepaper', { err_msg, success_msg, Name: req.session.user_name, profile_image: req.session.profile_image, session: req.session, expressFlash: req.flash(), whitepaper })
  }, (err) => {
    res.send('Some thing went wrong try again.');
  }).catch((e) => {
    res.send('Some thing went wrong try again.');
  });
})


routes.post('/edit-whitepaper', middleware_check_login, (req, res) => {
  //console.log(req.body)
  date = getFormattedDate()
  console.log(date)
  const form = formidable({ multiples: true });
  form.parse(req, (err, fields, files) => {
    var imageFile1 = typeof files.whitepaper !== "undefined" ? files.whitepaper.name : "";
    if (imageFile1 != "") {
      whitepaper = imageFile1;
      if (imageFile1 != "") {
        console.log(files.whitepaper.name)
        var imgpath = 'public/home/whitepaper/' + imageFile1;
        let testFile = fs.readFileSync(files.whitepaper.path);
        let testBuffer = new Buffer(testFile);
        fs.writeFile(imgpath, testBuffer, function (err) {
          if (err) return console.log(err);
        });
      }
    } else {
      whitepaper = "";
    }

    var imageFile2 = typeof files.pitchDeck !== "undefined" ? files.pitchDeck.name : "";
    if (imageFile2 != "") {
      pitchDeck = imageFile2;
      if (imageFile2 != "") {
        console.log(files.pitchDeck.name)
        var imgpath = 'public/home/whitepaper/' + imageFile2;
        let testFile = fs.readFileSync(files.pitchDeck.path);
        let testBuffer = new Buffer(testFile);
        fs.writeFile(imgpath, testBuffer, function (err) {
          if (err) return console.log(err);
        });
      }
    } else {
      pitchDeck = fields.old_image;
    }

    id = req.query.id
    console.log(fields)
    console.log(pitchDeck)
    console.log(whitepaper)
    let title = fields.title;
    let content = fields.editor1;
    let status = fields.status;
    let created_at = Date.now();
    whitepaperInfo.updateOne({ _id: id }, {
      $set: {
        title: title,
        content: content,
        whitepaperImage: whitepaper,
        status: status,
        pitchDeckImage: pitchDeck,
        created_at: created_at,
        created_by: req.session.user_name,
      }
    }, { upsert: true }, function (err) {
      if (err) {
        req.flash('err_msg', 'Something went wrong.');
        res.redirect('/blog-list');
      }
      else {
        console.log('blog updated success fully')
        req.flash('success_msg', 'whitepaper  updated successfully.');
        res.redirect('/whitepaper');
      }
    })
  });
})

routes.get('/delete-whitepaper', (req, res) => {
  console.log('In delete blog')
  id = req.query.id
  whitepaperInfo.findOne({ _id: id, deleted: '0' }).then(async (whitepaper) => {
    whitepaper.deleted = '1'
    await whitepaper.save()
    res.redirect('/whitepaper')
  })

})

///////////***************blogs ****************///////////////////
routes.get('/blog-list',async (req, res) => {

  let blogdetails = await blogInfo.find({ deleted: '0' })

  res.render('admin/front-admin/blog-list', { err_msg, success_msg, Name: req.session.user_name, profile_image: req.session.profile_image, session: req.session, expressFlash: req.flash(), blogdetails })
})

routes.get('/add-new-blog', (req, res) => {

  res.render('admin/front-admin/add-new-blog', { err_msg, success_msg, Name: req.session.user_name, profile_image: req.session.profile_image, session: req.session, expressFlash: req.flash() })
})

function getFormattedDate() {
  let months = new Date().getMonth()
  let date = new Date().getDate()
  var dayNames = ['Monday', 'Thursday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
  var monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

  let month = monthNames[months]
  let year = new Date().getFullYear()
  let day = `${date} ${month} ${year}`
  return day

}

routes.post('/add-new-blog', middleware_check_login, (req, res) => {

  console.log(req.body)
  date = getFormattedDate()
  console.log(date)
  const form = formidable({ multiples: true });
  form.parse(req, (err, fields, files) => {
    var imageFile = typeof files.blogImage !== "undefined" ? files.blogImage.name : "";
    if (imageFile != "") {
      blogImage = imageFile;
      if (imageFile != "") {
        console.log(files.blogImage.name)
        var imgpath = 'public/home/blog/' + imageFile;
        let testFile = fs.readFileSync(files.blogImage.path);
        let testBuffer = new Buffer(testFile);
        fs.writeFile(imgpath, testBuffer, function (err) {
          if (err) return console.log(err);
        });
      }
    } else {
      blogImage = "";
    }
    //console.log(fields)

    console.log(blogImage)
    let title = fields.title;
    let content = fields.editor1;
    let subheading = fields.subheading;
    let created_at = date;
    let blog = new blogInfo({
      title: title, content: content, subheading: subheading, blogimage: blogImage, created_at: created_at, created_by: req.session.user_name,
    });

    blog.save().then(result => {
      console.log('blog added', result);
      req.flash('success_msg', 'Banner added successfully.');
      res.redirect('/blog-list');
    })
      .catch(err => {
        console.log(err);
      })
  });
})

routes.get('/delete-blog', (req, res) => {
  console.log('In delete blog')
  id = req.query.id
  blogInfo.findOne({ _id: id, deleted: '0' }).then(async (blog) => {
    blog.deleted = '1'
    await blog.save()
    res.redirect('/blog-list')
  })

})

routes.get('/edit-blog', (req, res) => {
  id = req.query.id
  console.log('In dit blog', id)
  blogInfo.findOne({ _id: id, deleted: '0' }).then((blog) => {
    res.render('admin/front-admin/edit-blog', { err_msg, success_msg, Name: req.session.user_name, profile_image: req.session.profile_image, session: req.session, expressFlash: req.flash(), blog })
  }, (err) => {
    res.send('Some thing went wrong try again.');
  }).catch((e) => {
    res.send('Some thing went wrong try again.');
  });
})


routes.post('/edit-blog', middleware_check_login, (req, res) => {

  console.log('In edit blog')
  let blog_image
  const form = formidable({ multiples: true });
  form.parse(req, (err, fields, files) => {
    if (files != null && files != undefined && files != '') {
      var imageFile = typeof files.blog_image !== "undefined" ? files.blog_image.name : "";
    } else {
      var imageFile = '';
    }
    if (imageFile != "") {
      blog_image = imageFile;

      if (imageFile != "") {
        var imgpath = 'public/home/blog/' + imageFile;
        let testFile = fs.readFileSync(files.blog_image.path);
        let testBuffer = new Buffer(testFile);
        fs.writeFile(imgpath, testBuffer, function (err) {
          if (err) return console.log(err);
        });
      }
    } else {
      blog_image = fields.old_image;
    }

    var title = fields.title;
    var content = fields.editor1;
    var status = fields.status;
    let subheading = fields.subheading;
    let id = req.query.id;
    var updated_at = Date.now();
    console.log(id)
    console.log(subheading)
    console.log(blog_image)
    //console.log(fields)
    blogInfo.updateOne({ _id: id }, {
      $set: {
        title: title,
        content: content,
        status: status,
        subheading: subheading,
        updated_at: updated_at,
        blogimage: blog_image
      }
    }, { upsert: true }, function (err) {
      if (err) {
        req.flash('err_msg', 'Something went wrong.');
        res.redirect('/blog-list');
      }
      else {
        req.flash('success_msg', 'blog  updated successfully.');
        res.redirect('/blog-list');
      }
    })
  })
})

/////////////************faq list       *************/////////////////
routes.get('/faq-list',  (req, res) => {

  FAQ.find({ deleted: '0' }).then((questionDetails) => {

    res.render('admin/front-admin/faq-list', { err_msg, success_msg, Name: req.session.user_name, profile_image: req.session.profile_image, session: req.session, expressFlash: req.flash(), questionDetails })

  }, (err) => {

    res.send('Some thing went wrong try again.');

  }).catch((e) => {

    res.send('Some thing went wrong try again.');

  });

})

routes.get('/add-new-question',  (req, res) => {

  res.render('admin/front-admin/add-new-question', { err_msg, success_msg, Name: req.session.user_name, profile_image: req.session.profile_image, session: req.session, expressFlash: req.flash() })
})

routes.post('/add-new-question', middleware_check_login, (req, res) => {


  const form = formidable({ multiples: true });
  form.parse(req, (err, fields, files) => {
    var imageFile = typeof files.banner_image !== "undefined" ? files.banner_image.name : "";
    if (imageFile != "") {
      banner_image = imageFile;

      if (imageFile != "") {
        var imgpath = 'public/home/FAQ/' + imageFile;
        let testFile = fs.readFileSync(files.banner_image.path);
        let testBuffer = new Buffer(testFile);
        fs.writeFile(imgpath, testBuffer, function (err) {
          if (err) return console.log(err);
        });
      }
    } else {
      banner_image = "";
    }

    var question = fields.question;
    var answer = fields.editor1;
    var status = fields.status;
    var created_at = Date.now();

    var question = new FAQ({
      question: question, answer: answer, status: status, created_at: created_at,
    });

    question.save().then(result => {
      console.log('data added', result);
      req.flash('success_msg', 'Question added successfully.');
      res.redirect('/faq-list');
    })
      .catch(err => {
        console.log(err);
      })
  });

})

routes.get('/edit-question', middleware_check_login, (req, res) => {
  let id = req.query.id;
  FAQ.findOne({ _id: id, deleted: '0' }).then((question) => {
    console.log('question', question);
    res.render('admin/front-admin/edit-question.ejs', { Name: req.session.user_name, profile_image: req.session.profile_image, session: req.session, expressFlash: req.flash(), question });

  }, (err) => {

    res.send('Some thing went wrong try again.');

  }).catch((e) => {

    res.send('Some thing went wrong try again.');

  });

})

routes.post('/edit-question', middleware_check_login, (req, res) => {
  const form = formidable({ multiples: true });
  form.parse(req, (err, fields, files) => {
    var question = fields.question;
    var answer = fields.editor1;
    var status = fields.status;
    var updated_at = Date.now();
    let id = req.query.id;

    FAQ.updateOne({ _id: id }, {
      $set: {
        question: question,
        answer: answer,
        status: status,
        updated_at: updated_at,
      }
    }, { upsert: true }, function (err) {
      if (err) {

        req.flash('err_msg', 'Something went wrong.');
        res.redirect('/faq-list');
      }
      else {
        req.flash('success_msg', 'Question updated successfully.');
        res.redirect('/faq-list');
      }
    })
  })
})

routes.get('/delete-question', middleware_check_login, (req, res) => {
  console.log('In delete question')
  id = req.query.id
  FAQ.findOne({ _id: id, deleted: '0' }).then(async (question) => {
    question.deleted = '1'
    await question.save()
    res.redirect('/faq-list')
  })

})
/////////////************* terms-n-conditions ************//////////////
routes.get('/terms-n-conditons', middleware_check_login, (req, res) => {
  termsAndConditionInfo.find({ deleted: '0' }).then((termsAndConditionDetails) => {

    res.render('admin/front-admin/terms-n-conditons', { err_msg, success_msg, Name: req.session.user_name, profile_image: req.session.profile_image, session: req.session, expressFlash: req.flash(), termsAndConditionDetails })

  }, (err) => {

    res.send('Some thing went wrong try again.');

  }).catch((e) => {

    res.send('Some thing went wrong try again.');

  });


})

routes.get('/add-terms-n-conditons', middleware_check_login, (req, res) => {

  res.render('admin/front-admin/add-terms-n-conditons', { err_msg, success_msg, Name: req.session.user_name, profile_image: req.session.profile_image, session: req.session, expressFlash: req.flash() })
})


routes.post('/add-terms-n-conditons', middleware_check_login, (req, res) => {
  const form = formidable({ multiples: true });
  form.parse(req, (err, fields, files) => {

    var title = fields.title;
    var content = fields.editor1;
    var status = fields.status;
    var created_at = Date.now();

    var termsAndCondition = new termsAndConditionInfo({
      title: title, content: content, status: status, created_at: created_at,
    });

    termsAndCondition.save().then(result => {
      console.log('data added', result);
      req.flash('success_msg', 'termsAndCondition added successfully.');
      res.redirect('/terms-n-conditons');
    })
      .catch(err => {
        console.log(err);
      })
  });
})

routes.get('/edit-terms-n-conditons', middleware_check_login, (req, res) => {
  let id = req.query.id;
  termsAndConditionInfo.findOne({ _id: id, deleted: '0' }).then((termsAndCondition) => {
    res.render('admin/front-admin/edit-terms-n-conditons', { Name: req.session.user_name, profile_image: req.session.profile_image, session: req.session, expressFlash: req.flash(), termsAndCondition });

  }, (err) => {

    res.send('Some thing went wrong try again.');

  }).catch((e) => {

    res.send('Some thing went wrong try again.');

  });

})

routes.post('/edit-terms-n-conditons', middleware_check_login, (req, res) => {

  const form = formidable({ multiples: true });
  form.parse(req, (err, fields, files) => {

    var title = fields.title;
    var content = fields.editor1;
    var status = fields.status;
    var updated_at = Date.now();
    //console.log(fields)
    id = req.query.id
    termsAndConditionInfo.updateOne({ _id: id }, {
      $set: {
        title: title,
        content: content,
        status: status,
        updated_at: updated_at,
      }
    }, { upsert: true }, function (err) {
      if (err) {
        req.flash('err_msg', 'Something went wrong.');
        res.redirect('/terms-n-conditons');
      }
      else {
        req.flash('success_msg', 'terms-n-conditons updated successfully.');
        res.redirect('/terms-n-conditons');
      }
    })
  })
})

routes.get('/delete-terms-n-conditons',middleware_check_login, (req, res) => {
  console.log('In delete terms-n-conditons')
  id = req.query.id
  termsAndConditionInfo.findOne({ _id: id, deleted: '0' }).then(async (termsAndCondition) => {
    termsAndCondition.deleted = '1'
    await termsAndCondition.save()
    res.redirect('/terms-n-conditons')
  })

})
////////////**************  Privacy-Policy ************///////////////
routes.get('/privacy-policy', middleware_check_login, (req, res) => {
  privacyPolicyInfo.find({ deleted: '0' }).then((privacyPolicyDetais) => {
    res.render('admin/front-admin/privacy-policy', { err_msg, success_msg, Name: req.session.user_name, profile_image: req.session.profile_image, session: req.session, expressFlash: req.flash(), privacyPolicyDetais })
  }, (err) => {

    res.send('Some thing went wrong try again.');

  }).catch((e) => {

    res.send('Some thing went wrong try again.');

  });

})

routes.get('/add-admin-privacy-policy', middleware_check_login, (req, res) => {

  res.render('admin/front-admin/add-privacy-policy', { err_msg, success_msg, Name: req.session.user_name, profile_image: req.session.profile_image, session: req.session, expressFlash: req.flash() })
})

routes.post('/add-admin-privacy-policy', middleware_check_login, (req, res) => {
  const form = formidable({ multiples: true });
  form.parse(req, (err, fields, files) => {
    console.log(fields)
    var title = fields.title;
    var content = fields.editor1;
    var status = fields.status;
    var created_at = Date.now();

    var privacyPolicy = new privacyPolicyInfo({
      title: title, content: content, status: status, created_at: created_at,
    });

    privacyPolicy.save().then(result => {
      console.log('data added', result);
      req.flash('success_msg', ' privacyPolicy added successfully.');
      res.redirect('/privacy-policy');
    })
      .catch(err => {
        console.log(err);
      })
  });
})

routes.get('/edit-admin-privacy-policy', middleware_check_login, (req, res) => {
  let id = req.query.id;
  privacyPolicyInfo.findOne({ _id: id, deleted: '0' }).then((privacyPolicy) => {
    res.render('admin/front-admin/edit-privacy-policy', { Name: req.session.user_name, profile_image: req.session.profile_image, session: req.session, expressFlash: req.flash(), privacyPolicy });

  }, (err) => {

    res.send('Some thing went wrong try again.');

  }).catch((e) => {

    res.send('Some thing went wrong try again.');

  });

})

routes.post('/edit-admin-privacy-policy', middleware_check_login, (req, res) => {

  const form = formidable({ multiples: true });
  form.parse(req, (err, fields, files) => {
    console.log(fields)
    var title = fields.title;
    var content = fields.editor1;
    var status = fields.status;
    var updated_at = Date.now();

    //console.log(fields)
    id = req.query.id
    privacyPolicyInfo.updateOne({ _id: id }, {
      $set: {
        title: title,
        content: content,
        status: status,
        updated_at: updated_at,
      }
    }, { upsert: true }, function (err) {
      if (err) {
        req.flash('err_msg', 'Something went wrong.');
        res.redirect('/privacy-policy');
      }
      else {
        req.flash('success_msg', 'privacyPolicy updated successfully.');
        res.redirect('/privacy-policy');
      }
    })
  });
})

routes.get('/delete-admin-privacy-policy', middleware_check_login, (req, res) => {
  console.log('In delete privacyPolicy')
  id = req.query.id
  privacyPolicyInfo.findOne({ _id: id, deleted: '0' }).then(async (privacyPolicy) => {
    privacyPolicy.deleted = '1'
    await privacyPolicy.save()
    res.redirect('/privacy-policy')
  })

})

////////////****************privacy policy ***************////////////////
routes.get('/cookie-policy', middleware_check_login, (req, res) => {

  res.render('admin/front-admin/cookie-policy', { err_msg, success_msg, Name: req.session.user_name, profile_image: req.session.profile_image, session: req.session, expressFlash: req.flash() })
})

routes.get('/referral-policy', middleware_check_login,(req, res) => {

  res.render('admin/front-admin/referral-policy', { err_msg, success_msg, Name: req.session.user_name, profile_image: req.session.profile_image, session: req.session, expressFlash: req.flash() })
})

routes.get('/contact-list',middleware_check_login,  (req, res) => {

  res.render('admin/front-admin/contact-list', { err_msg, success_msg, Name: req.session.user_name, profile_image: req.session.profile_image, session: req.session, expressFlash: req.flash() })
})

routes.get('/basic-details',  middleware_check_login,(req, res) => {

  res.render('admin/front-admin/basic-details', { err_msg, success_msg, Name: req.session.user_name, profile_image: req.session.profile_image, session: req.session, expressFlash: req.flash() })
})


routes.get('/feedback-list',middleware_check_login, (req, res) => {

  res.render('admin/front-admin/feedback-list', { err_msg, success_msg, Name: req.session.user_name, profile_image: req.session.profile_image, session: req.session, expressFlash: req.flash() })
})

routes.get('/order-history',middleware_check_login,  (req, res) => {
  err_msg = req.flash('err_msg');
  success_msg = req.flash('success_msg');
  var day = moment(new Date()).format('MM/DD/YYYY');
  // Registration.find({ deleted: '0', created_at: { $gte: day + ', 00:00:00 AM', $lte: day + ', 12:59:59 PM' } }).sort({ _id: -1 }).lean().then(async (results) => {
  //   console.log('448-results', results)
  // Registration.find({ deleted: '0' }).sort({ _id: -1 }).lean().then(async (results) => {
  //   console.log("result======== ", results);
  OrderDetails.find({}).then(async (orderDetails) => {
   if (orderDetails) {
      
      res.render('admin/front-admin/order-history.ejs', { err_msg, success_msg, expressFlash: req.flash(), order_details: orderDetails, moment, session: req.session, user_id: req.session.user_id, ebt_count: req.session.ebt_count, rate_per_ebt: req.session.rate_per_ebt, total_amnt: req.session.total_amnt, transaction_Id: req.session.transaction_Id, sender_wallet_address: req.session.sender_wallet_address, eth_wallet_address: req.session.eth_wallet_address, image: req.session.image , payment_type: req.session.payment_type,  payment_status: req.session.payment_status, created_at: req.session.created_at, });
    }
  }, (error) => {
    res.send('Something went wrong');
  }).catch((e) => {
    res.send(e);
  });
});

routes.get('/admin-referral-table', middleware_check_login, (req, res) => {
  err_msg = req.flash('err_msg');
  success_msg = req.flash('success_msg');

  res.render('admin/front-admin/admin-referral-table', { err_msg, success_msg, Name: req.session.user_name, profile_image: req.session.profile_image, session: req.session, expressFlash: req.flash() })
})

routes.get('/summary',middleware_check_login, (req, res) => {

  res.render('admin/front-admin/summary', { err_msg, success_msg, Name: req.session.user_name, profile_image: req.session.profile_image, session: req.session, expressFlash: req.flash() })
})

routes.get('/bonus-persent',middleware_check_login, (req, res) => {

  res.render('admin/front-admin/bonus-persent', { err_msg, success_msg, Name: req.session.user_name, profile_image: req.session.profile_image, session: req.session, expressFlash: req.flash() })
})


routes.get('/admin-transaction-table',middleware_check_login,  (req, res) => {
  err_msg = req.flash('err_msg');
  success_msg = req.flash('success_msg');
  var day = moment(new Date()).format('MM/DD/YYYY');
  // Registration.find({ deleted: '0', created_at: { $gte: day + ', 00:00:00 AM', $lte: day + ', 12:59:59 PM' } }).sort({ _id: -1 }).lean().then(async (results) => {
  //   console.log('448-results', results)
  // Registration.find({ deleted: '0' }).sort({ _id: -1 }).lean().then(async (results) => {
  //   console.log("result======== ", results);
  Tokendetails.find({}).then(async (tokendetails) => {
    if (tokendetails) {
      
      res.render('admin/front-admin/admin-transaction-table.ejs', { err_msg, success_msg, expressFlash: req.flash(), token_details: tokendetails, moment, session: req.session, user_id: req.session.user_id, wallet_id: req.session.wallet_id, sender_wallet_address: req.session.sender_wallet_address, receiver_wallet_address: req.session.receiver_wallet_address, hash: req.session.hash, amount: req.session.amount, payment_status: req.session.payment_status, token_type: req.session.token_type , block_id: req.session.block_id,  transaction_type: req.session.transaction_type, referred_to_name: req.session.referred_to_name, created_at: req.session.created_at, });
      }
  }, (error) => {
    res.send('Something went wrong');
  }).catch((e) => {
    res.send(e);
  });
});

/////////////////////////////////////////////////////////////////
routes.get('/site-info',middleware_check_login,  (req, res) => {

  err_msg = req.flash('err_msg');
  success_msg = req.flash('success_msg');
  // /dummy insert/ 
  // var AboutusData = new GetInTouch({ title:'IEO : Financials',address:'hello',email:'a@a.com',phone:'343434',facebook:"weff",twitter:"iuhu"});

  //  AboutusData.save().then(result =>{
  //    console.log('data added',result);

  //  })
  //  .catch(err =>{
  //    console.log(err);
  //  })
  // /dummy insert/ 
  GetInTouch.findOne({ deleted: '0' }).then((Data) => {

    res.render('admin/front-admin/site-info.ejs', { err_msg, success_msg, Name: req.session.user_name, profile_image: req.session.profile_image, session: req.session, expressFlash: req.flash(), Data });

  }, (err) => {

    res.send('Some thing went wrong try again.');

  }).catch((e) => {

    res.send('Some thing went wrong try again.');

  });

});


/********************************************* Add Key ***************************/

routes.post('/update_siteinfo', middleware_check_login, (req, res) => {

  console.log("----------------update ", req.body);

  var title = req.body.title;
  var address = req.body.address;
  var email = req.body.email;
  var phone = req.body.phone;
  var facebook = req.body.facebook;
  var twitter = req.body.twitter;
  var youtube = req.body.youtube;
  var instagram = req.body.instagram;

  var id = req.body.id;
  var updated_at = Date.now();

  GetInTouch.updateOne({ _id: id }, {
    $set: {
      title: title,
      address: address,
      phone: phone,
      email: email,
      facebook: facebook,
      twitter: twitter,
      youtube: youtube,
      instagram: instagram,
      updated_at: updated_at,
    }
  }, function (err) {
    if (err) {

      req.flash('err_msg', 'Something went wrong.');
      res.redirect('/site-info');
    }
    else {
      req.flash('success_msg', 'Content updated successfully.');
      res.redirect('/site-info');
    }
  })


});


/******************************OUR PARTNER****************************************/

routes.get('/partner-list',middleware_check_login, (req, res) => {

  err_msg = req.flash('err_msg');
  success_msg = req.flash('success_msg');


  PartnerInfo.find({ deleted: '0' }).then((PartnerData) => {

    res.render('admin/front-admin/partner-list.ejs', { err_msg, success_msg, Name: req.session.user_name, profile_image: req.session.profile_image, session: req.session, expressFlash: req.flash(), PartnerData });

  }, (err) => {

    res.send('Some thing went wrong try again.');

  }).catch((e) => {

    res.send('Some thing went wrong try again.');

  });
  // });
});

routes.get('/add-new-partner',middleware_check_login, (req, res) => {

  res.render('admin/front-admin/add-new-partner.ejs', { Name: req.session.user_name, profile_image: req.session.profile_image, session: req.session, expressFlash: req.flash() });


});

routes.post('/add_partner', middleware_check_login, (req, res) => {
  // console.log("---------------------- ",req.body," ",req.files);
  const form = formidable({ multiples: true });
  form.parse(req, (err, fields, files) => {
    if (files != null && files != undefined && files != '') {
      var imageFile = typeof files.partner_image !== "undefined" ? files.partner_image.name : "";
    } else {
      var imageFile = '';
    }

    if (imageFile != "") {
      partner_image = imageFile;

      if (imageFile != "") {
        var imgpath = 'public/home/partner/' + imageFile;
        let testFile = fs.readFileSync(files.partner_image.path);
        let testBuffer = new Buffer(testFile);
        fs.writeFile(imgpath, testBuffer, function (err) {
          if (err) return console.log(err);
        });

      }
    } else {
      partner_image = fields.old_image;
    }


    var title = fields.title;
    var url = fields.url;
    var status = fields.status;
    var created_at = Date.now();


    var PartnerData = new PartnerInfo({
      title: title, url: url, partner_image: partner_image, status: status, created_at: created_at
    });

    PartnerData.save().then(result => {
      console.log('data added', result);
      req.flash('success_msg', 'Partner added successfully.');
      res.redirect('/partner-list');
    })
      .catch(err => {
        console.log(err);
      })
  })

});

routes.get('/edit-partner', middleware_check_login, (req, res) => {

  var id = req.query.id;

  PartnerInfo.findOne({ _id: id, deleted: '0' }).then((PartnerDetail) => {

    res.render('admin/front-admin/edit-partner.ejs', { Name: req.session.user_name, profile_image: req.session.profile_image, session: req.session, expressFlash: req.flash(), PartnerDetail });

  }, (err) => {

    res.send('Some thing went wrong try again.');

  }).catch((e) => {

    res.send('Some thing went wrong try again.');

  });
});


routes.post('/update_partner', middleware_check_login, (req, res) => {
  // console.log("---------------------- ",req.body," ",req.files);
  const form = formidable({ multiples: true });
  form.parse(req, (err, fields, files) => {
    if (files != null && files != undefined && files != '') {
      var imageFile = typeof files.partner_image !== "undefined" ? files.partner_image.name : "";
    } else {
      var imageFile = '';
    }

    if (imageFile != "") {
      partner_image = imageFile;

      if (imageFile != "") {
        var imgpath = 'public/home/partner/' + imageFile;
        let testFile = fs.readFileSync(files.partner_image.path);
        let testBuffer = new Buffer(testFile);
        fs.writeFile(imgpath, testBuffer, function (err) {
          if (err) return console.log(err);
        });
      }
    } else {
      partner_image = fields.old_image;
    }


    var title = fields.title;
    var url = fields.url;
    var status = fields.status;
    var id = fields.id;
    var updated_at = Date.now();

    PartnerInfo.update({ _id: id }, {
      $set: {
        title: title,
        url: url,
        partner_image: partner_image,
        status: status,
        updated_at: updated_at,
      }
    }, { upsert: true }, function (err) {
      if (err) {

        req.flash('err_msg', 'Something went wrong.');
        res.redirect('/partner-list');
      }
      else {
        req.flash('success_msg', 'Partner updated successfully.');
        res.redirect('/partner-list');
      }
    })
  })

});

routes.get('/delete-partner', middleware_check_login,  (req, res) => {

  var current_time = Date.now();

  var id = req.query.id;

  PartnerInfo.findByIdAndUpdate(id, { $set: { deleted: '1', updated_at: current_time } }, { new: true }).then((success) => {

    if (success) {

      req.flash('success_msg', 'Partner deleted successfully.');

      res.redirect('/partner-list');
    }

  }, (error) => {

    req.flash('err_msg', 'Something went wrong try again.');

    res.redirect('/partner-list');

  }).catch((e) => {

    req.flash('err_msg', 'Something went wrong try again.');

    res.redirect('/partner-list');
  });

});


/******************************OUR TEAM****************************************/
/***************************************************************************************/



routes.get('/our-team', middleware_check_login,  (req, res) => {

  err_msg = req.flash('err_msg');
  success_msg = req.flash('success_msg');
  console.log("2160 in our-team")

  TeamMember.find({ deleted: '0' }).then((TeamData) => {
    // BannerInfo.find({deleted:'0'}).then((TeamData)=>{
    console.log(TeamData)

    res.render('admin/front-admin/our-team.ejs', { err_msg, success_msg, Name: req.session.user_name, profile_image: req.session.profile_image, session: req.session, expressFlash: req.flash(), TeamData });

  }, (err) => {

    res.send('Some thing went wrong try again.');

  }).catch((e) => {

    res.send('Some thing went wrong try again.');

  });
  // });
});



routes.get('/add-new-member', middleware_check_login, (req, res) => {

  res.render('admin/front-admin/add-new-member.ejs', { Name: req.session.user_name, profile_image: req.session.profile_image, session: req.session, expressFlash: req.flash() });

});

routes.post('/add_member', middleware_check_login,  (req, res) => {
  console.log("add member")
  const form = formidable({ multiples: true });
  form.parse(req, (err, fields, files) => {
    if (files != null && files != undefined && files != '') {
      var imageFile = typeof files.member_image !== "undefined" ? files.member_image.name : "";
    } else {
      var imageFile = '';
    }

    if (imageFile != "") {
      member_image = imageFile;

      if (imageFile != "") {
        var imgpath = 'public/home/team/' + imageFile;
        let testFile = fs.readFileSync(files.member_image.path);
        let testBuffer = new Buffer(testFile);
        fs.writeFile(imgpath, testBuffer, function (err) {
          if (err) return console.log(err);
        });
      }
    } else {
      member_image = "";
    }

    var name = fields.name;
    var designation = fields.designation;
    var content = fields.content;
    var linkedin_url = fields.linkedin_url;
    var member_image = member_image;
    var status = fields.status;
    var created_at = Date.now();


    //console.log(content)


    var TeamData = new TeamMember({
      name: name, designation: designation, content: content, linkedin_url: linkedin_url, member_image: member_image, status: status, created_at: created_at
    });

    TeamData.save().then(result => {
      console.log(result)
      req.flash('success_msg', 'Member added successfully.');
      res.redirect('/our-team');
    })
      .catch(err => {
        console.log(err);
      })
  })
});

routes.get('/edit-member', middleware_check_login, (req, res) => {

  var member_id = req.query.id;

  TeamMember.findOne({ _id: member_id, deleted: '0' }).then((MemberDetail) => {

    res.render('admin/front-admin/edit-member.ejs', { Name: req.session.user_name, profile_image: req.session.profile_image, session: req.session, expressFlash: req.flash(), MemberDetail });

  }, (err) => {

    res.send('Some thing went wrong try again.');

  }).catch((e) => {

    res.send('Some thing went wrong try again.');

  });
});

routes.post('/update_member',middleware_check_login, (req, res) => {
  const form = formidable({ multiples: true });
  form.parse(req, (err, fields, files) => {
    var member_id = fields.id;

    if (files != null && files != undefined && files != '') {
      var imageFile = typeof files.member_image !== "undefined" ? files.member_image.name : "";
    } else {
      var imageFile = '';
    }

    if (imageFile != "") {
      member_image = imageFile;
      if (imageFile != "") {
        var imgpath = 'public/home/team/' + imageFile;
        let testFile = fs.readFileSync(files.member_image.path);
        let testBuffer = new Buffer(testFile);
        fs.writeFile(imgpath, testBuffer, function (err) {
          if (err) return console.log(err);
        });
      }
    } else {
      member_image = fields.old_image;
    }

    var name = fields.name;
    var designation = fields.designation;
    var content = fields.content;
    var linkedin_url = fields.linkedin_url;
    var member_image = member_image;
    var status = fields.status;
    var updated_at = Date.now();

    TeamMember.update({ _id: member_id }, {
      $set: {
        name: name,
        designation: designation,
        content: content,
        member_image: member_image,
        linkedin_url: linkedin_url,
        status: status,
        updated_at: updated_at,
      }
    }, { upsert: true }, function (err) {
      if (err) {

        req.flash('err_msg', 'Something went wrong.');
        res.redirect('/our-team');
      }
      else {
        req.flash('success_msg', 'Member updated successfully.');
        res.redirect('/our-team');
      }
    })
  })
});

routes.get('/delete-team-member', middleware_check_login, (req, res) => {

  var current_time = Date.now();

  var id = req.query.id;

  TeamMember.findByIdAndUpdate(id, { $set: { deleted: '1', updated_at: current_time } }, { new: true }).then((success) => {

    if (success) {

      req.flash('success_msg', 'Member deleted successfully.');

      res.redirect('/our-team');
    }

  }, (error) => {

    req.flash('err_msg', 'Something went wrong try again.');

    res.redirect('/our-team');

  }).catch((e) => {

    req.flash('err_msg', 'Something went wrong try again.');

    res.redirect('/our-team');
  });

});




module.exports = routes;
