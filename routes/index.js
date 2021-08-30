const { Router } = require('express');
const router = Router();
const session = require('express-session');
const front = require('./front');
const admin = require('./admin');
// const phone_apis = require('./android-ios');
const { mail } = require('../helper/mailer');

router.use(session({ 
  secret: 'admindetails',
  resave: false,
  saveUninitialized: true
}));

router.get('/sendMail', async (req, res) => {
  console.log('yes');
  await mail('info@ebtico.com', 'Dummy', 'dummy');
})

router.use('/', front);
router.use('/', admin);
// router.use('/', phone_apis);


module.exports = router;