const express = require('express');
const session = require('express-session');
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

routes.get('/login',  (req, res) => {
  let fail = req.flash('fail');
  let success_logout = req.flash('success_logout');
  res.render('admin/auth/login.ejs', {layout:'admin/layout/layout' });
});






