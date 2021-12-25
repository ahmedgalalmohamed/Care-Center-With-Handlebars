var express = require('express');
const { check, validationResult } = require('express-validator');
var router = express.Router();
const passport = require('passport');
const patient = require('../model/Patientdb');
const doctor = require('../model/doctordb');
var nodemailer = require('nodemailer');
let Confirmcode = 0.0;


//#region Confirm email 
router.get('/get/:email', (req, res, next) => {

  //#region SendEmail Confirm
  function sendemail(emailreciver, Confirmcode) {

    var transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'outer21heaven@gmail.com',
        pass: 'outerheaven'
      },
      tls: {
        rejectUnauthorized: false
      }
    });

    var mailOptions = {
      from: 'outer21heaven@gmail.com',
      to: emailreciver,
      subject: 'Care Center',
      html: '<div style=" background-color: #f1f3f4;border-radius: 10px;direction: ltr;padding: 30px;"><div style=" font-size: 15px;font-weight: bold;"><img src="cid:logo"><a href="localhost:5000/"  style="margin-left:5px;font-weight: bold;font-family: Arial, Helvetica, sans-serif;font-size: 25px;">Care Center</a> ' + '<div style="margin-left:5px;font-weight: bold;font-family: Arial, Helvetica, sans-serif;font-size: 15px;"> Confirm Code = ' + Confirmcode + '</div>' + '</div>',
      attachments: [{
        filename: 'cube.png',
        path: __dirname + '/cube.png',
        cid: 'logo'
      }]
    };

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
      } else {
        console.log('Email sent: ' + info.response);
      }
    });
  }
  //#endregion

  Confirmcode = Math.floor((Math.random() * 1000000000000) + 1000);

  sendemail(req.params.email, Confirmcode);
  res.send("<script>window.close();</script > ");
})
//#endregion

// #region Get And Post Sign Up
router.get('/signup', Isnotsignin, function (req, res, next) {
  res.render('Patients/signup', { messageerror: req.flash('signuperror') })
  Confirmcode =0.0;
});

router.post('/signup', [
  check('email').isEmail().withMessage('InValid Email'),
  check('phone').isNumeric().withMessage('InValid Phone'),
  check('confirm_email').custom((value, { req }) => {
    if (value != Confirmcode) {
      throw new Error("Error Code Confirm");
    }
    else
      return true;
  })
], Isnotsignin, (req, res, next) => {
  const error = validationResult(req);
  Confirmcode = 0.0;
  if (!error.isEmpty()) {
    const messageerror = [];
    for (let index = 0; index < error.errors.length; index++) {
      messageerror.push(error.errors[index].msg);
    }
    req.flash('signuperror', messageerror);
    res.redirect('signup');
    return;
  }
  next();
}, passport.authenticate('localsignup', {
  session: false,
  successRedirect: 'signin',
  failureRedirect: 'signup',
  failureFlash: true
}));
// #endregion

//#region Get And Post Profile
router.get('/profile', Issignin, (req, res, next) => {
  var countdr = null;
  if (req.user._appoint) {
    countdr = req.user._appoint.countdr;
  }
  res.render('Patients/profile', { title: 'Patient/Profile', ckpro: true, phone: req.user._id, namepaact: req.user.name.slice(0, 1), namepa: req.user.name, email: req.user.email, password: req.user.password, countdr: countdr });
})
//#endregion

// #region Get And Post Sign In
router.get('/signin', Isnotsignin, (req, res, next) => {
  res.render('Patients/signin', { messageerror: req.flash('signinerror') });
})

router.post('/signin', [
  check('phone').isNumeric().withMessage('InVaild Phone')
], (req, res, next) => {
  const error = validationResult(req);
  if (!error.isEmpty()) {
    const messageerror = [];
    for (let index = 0; index < error.errors.length; index++) {
      messageerror.push(error.errors[index].msg);
    }
    req.flash('signinerror', messageerror);
    res.redirect('signin');
    return;
  }
  next();
}, passport.authenticate('localsignin', {
  successRedirect: 'profile',
  failureRedirect: 'signin',
  failureFlash: true
}))
//#endregion

//#region Log Out
router.get('/logout', (req, res, next) => {
  req.logOut();
  res.redirect('/');
})
//#endregion

//#region Fun redirect home
function Issignin(req, res, next) {
  if (req.isAuthenticated()) {
    next();
  } else {
    res.redirect('signin');
  }
}
//#endregion
//#region Fun redirect sign in
function Isnotsignin(req, res, next) {
  if (req.isAuthenticated()) {
    res.redirect('/');

  } else {
    next();
  }
}
//#endregion
module.exports = router;
