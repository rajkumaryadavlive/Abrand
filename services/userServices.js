const moment = require("moment");
const { generateCode } = require('../helper/userHelper');
const { Registration, Userwallet, Importwallet, Tokensettings, Tokendetails, OrderDetails, RefCode, FAQ, ContactInfo } = require('../models/userModel');
const crypto = require('crypto');
var axios = require('axios');

const addUser = async (userDetails,ref_link, pass, created, status ) => {
  let ref_code = generateCode();
  let otp = Math.floor(Math.random() * 900000) + 100000;
  const userObject = {
    name: userDetails.name,
    first_name: '',
    last_name: '',
    email: userDetails.email,
    password: pass,
    created_at: created,
    email_verify_status: status,
    mobile_no: userDetails.mob,
    address: '',
    user_address: '',
    country: '',
    state: '',
    city: '',
    status: 'active',
    profile_image: '',
    ref_code: ref_code,
    ref_from: ref_link,
    otp: otp
  };
  try {
    const user = new Registration(userObject);
    await user.save();
    console.log("user",user);
    return userObject;
  } catch (error) {
    return null;
  }
};

const checkUser = async (email) => {
    let user = await Registration.findOne({ 'email': email });
    if (user) {
      return user;
    }
  };

  const checkUserPass = async (email, password) => {
    let user = await Registration.findOne({ 'email': email, 'password': password });
    if (user) {
      return user;
    }
  };

  const checkUserId = async (user_id) => {
    let user = await Registration.findOne({ '_id': user_id });
    if (user) {
      return user;
    }
  };

  const createCipher = async (text) => {
    let mykey1 = crypto.createCipher('aes-128-cbc', 'mypass');
    let mystr1 = mykey1.update(text, 'utf8', 'hex')
    mystr1 += mykey1.final('hex');
    return mystr1;
  };

  const updateUserPassword = async (email, password) => {
    try {
      let user = await Registration.findOne({ 'email': email });
      if (user) {
        await Registration.update({ 'email': email }, { $set: { password: password } });
      }
      let userUpdated = await Registration.findOne({ 'email': email });
      return userUpdated;
    } catch (error) {
      return null;
    }
  };
  
  const createAtTimer = async () => {
    let indiaTime1 = new Date().toLocaleString("en-US", { timeZone: "Europe/London" });
    let indiaTime = new Date(indiaTime1);
    let created_at = indiaTime.toLocaleString();
    return created_at;
  };

  const updateEmailStatus = async (id) => {
    try {
      let user = await Registration.findOne({ '_id': id });
      if (user) {
        await Registration.update({ '_id': id }, { $set: { email_verify: 'verified', otp: null } });
      }
      let userUpdated = await Registration.findOne({ '_id': id });
      return userUpdated;
    } catch (error) {
      return null;
    }
  };

  const updateARTUser = async (email, name) => {
    try {
      var data = JSON.stringify({
        "pass" : "toIbb5gvcKHCBvF1qr6hihMYU",
        "email" : email,
        "name" : name
      });
      var config = {
        method: 'post',
        url: 'https://theartw.com/api/profile/update',
        headers: { 
          'Content-Type': 'application/json'
        },
        data : data
      };
      let response = await axios(config);
      let status = response.data.status;
      return status;
    } catch (error) {
      console.log(error);
      return null;
    }
  };

  const getRates = async () => {
    let rates = await Tokensettings.findOne();
    if (rates) {
      return rates;
    }
  };

  const referData = async (ref_code, ref_link, id, created) => {
    const referObject = {
      my_ref_code: ref_code,
      reg_ref_code: ref_link,
      created_at: created,
      user_id: id
    };
    try {
      const refData = new RefCode(referObject);
      await refData.save();
      return referObject;
    } catch (error) {
      console.log("Error", error.message);
    }
  };

  const refUpdate = async (my_ref_code, reg_ref_code) => {
    try {
      let user = await RefCode.findOne({ 'my_ref_code': my_ref_code, 'reg_ref_code': reg_ref_code });
      if (user) {
        await RefCode.update({ 'my_ref_code': my_ref_code, 'reg_ref_code': reg_ref_code }, { $set: { 'status': 'Used' } });
      }
      let userUpdated = await RefCode.findOne({ 'my_ref_code': my_ref_code, 'reg_ref_code': reg_ref_code });
      return userUpdated;
    } catch (error) {
      return null;
    }
  };

  const findReferData = async (code) => {
    let referData = await RefCode.find({ $or: [{ reg_ref_code: code }, { my_ref_code: code }]  });
    let n = referData.length;
    let referrals = [];
    if (referData) {
      for (let i = 0; i < n; i++) {
        let appendData = {};
        let user = await Registration.findOne({ '_id': referData[i].user_id });
        let email2 = await Registration.findOne({ 'ref_code': user.ref_from });
        appendData.created_at = user.created_at;
        appendData.email = user.email;
        appendData.email2 = email2.email;
        referrals.push(appendData);
      }
    }
    return referrals;
  };
  
  const findReferDataDate = async (code, date) => {
    let created_at = moment(date).format('M/DD/YYYY');
    let referData = await RefCode.find({ $or: [{ reg_ref_code: code }, { my_ref_code: code }]  });
    let n = referData.length;
    let referrals = [];
    if (referData) {
      for (let i = 0; i < n; i++) {
        console.log(i);
        let appendData = {};
        let user = await Registration.findOne({ '_id': referData[i].user_id, 'created_at': new RegExp(created_at, 'i') });
        let email2 = await Registration.findOne({ 'ref_code': user.ref_from });
        appendData.created_at = user.created_at;
        appendData.email = user.email;
        appendData.email2 = email2.email;
        referrals.push(appendData);
      }
    }
    return referrals;
  };
  
  const findReferDataEmail = async (code) => {
    let referData = await RefCode.find({ $or: [{ reg_ref_code: code }, { my_ref_code: code }]  });
    let n = referData.length;
    let referrals = [];
    if (referData) {
      for (let i = 0; i < n; i++) {
        let appendData = {};
        let user = await Registration.findOne({ '_id': referData[i].user_id});
        let email2 = await Registration.findOne({ 'ref_code': user.ref_from });
        appendData.created_at = user.created_at;
        appendData.email = user.email;
        appendData.email2 = email2.email;
        referrals.push(appendData);
      }
    }
    return referrals;
  };

  const checkUserReferCode = async (code) => {
    let user = await Registration.findOne({ 'ref_code': code });
    if (user) {
      return user;
    }
  };

  const checkUserWallet = async (id) => {
    let wallet = await Userwallet.findOne({ 'user_id': id });
    if (wallet) {
      return wallet;
    }
  };

  const updateUserOTP = async (id, otp) => {
    try {
      let user = await Registration.findOne({ '_id': id });
      if (user) {
        await Registration.update({ '_id': id }, { $set: { otp: otp } });
      }
      let userUpdated = await Registration.findOne({ '_id': id });
      return userUpdated;
    } catch (error) {
      return null;
    }
  };

  
const updateUser = async (email, name, mob, country) => {
  try {
    let user = await Registration.findOne({ 'email': email });
    if (user) {
      await Registration.update({ 'email': email }, { $set: { name: name, mobile_no: mob, country: country } });
    }
    let userUpdated = await Registration.findOne({ 'email': email });
    return userUpdated;
  } catch (error) {
    return null;
  }
};

const findUserData = async () => {
  let userData = await Registration.find({});
  let n = userData.length;
  let users = [];
  if (userData) {
    for (let i = 0; i < n; i++) {
      let appendData = {};
      let text = userData[i].password;
      let mykey1 = crypto.createDecipher('aes-128-cbc', 'mypass');
      let mystr1 = mykey1.update(text, 'hex', 'utf8')
      mystr1 += mykey1.final('utf8');
      appendData.password = mystr1;
      appendData.name = userData[i].name;
      appendData.mobile = userData[i].mobile_no;
      appendData.created_at = userData[i].created_at;
      appendData.email = userData[i].email;
      users.push(appendData);
    }
  }
  return users;
};


module.exports = {
  addUser,
  referData,
  refUpdate,
  checkUser,
  checkUserPass,
  checkUserId,
  checkUserReferCode,
  checkUserWallet,
  updateUserOTP,
  createCipher,
  updateUser,
  updateUserPassword,
  updateEmailStatus,
  createAtTimer,
  findReferData,
  findReferDataDate,
  findReferDataEmail,
  findUserData,
  
  updateARTUser,
  getRates
  
  };