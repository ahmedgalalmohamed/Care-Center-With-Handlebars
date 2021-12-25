const patient = require('../model/Patientdb');
const doctor = require('../model/doctordb');
const appoint = require('../model/appointment');
const passport = require('passport');
const passportStrategy = require('passport-local').Strategy;
var nodemailer = require('nodemailer');
NODE_TLS_REJECT_UNAUTHORIZED = '0';
// #region passport Sign Up

passport.use('localsignup', new passportStrategy({
    usernameField: 'phone',
    passwordField: 'email',
    passReqToCallback: true
}, (req, phone, email, done) => {
    patient.findOne({ _id: phone }, (err, user) => {
        if (err) {
            return done(err);
        }
        if (user) {
            return done(null, false, req.flash('signuperror', 'This Phone is Found'));
        }
        patient.findOne({ email: email }, (err, user) => {
            if (err) {
                return done(err);
            }
            if (user) {
                return done(null, false, req.flash('signuperror', 'This Email is Found'));
            }
            doctor.findOne({ _id: phone }, (err, user) => {
                if (err) {
                    return done(err);
                }
                if (user) {
                    return done(null, false, req.flash('signuperror', 'This Phone is Found'));
                }
                doctor.findOne({ email: email }, (err, user) => {
                    if (err) {
                        return done(err);
                    }
                    if (user) {
                        return done(null, false, req.flash('signuperror', 'This Email is Found'));
                    }
                    const dbpatient = new patient(
                        {
                            _id: phone,
                            name: req.body.name,
                            email: email,
                            password: req.body.password
                        }
                    );
                    ///////////////////////////////////////////////////////////////////////
                    dbpatient.save((err, user) => {
                        if (err) {
                            return done(err);
                        }
                        else {
                            sendemail(email, req.body.name);
                            return done(null, user);
                        }
                    })
                    //////////////////////////////////////////////////////////////////////
                })
            })
        })

    })

}))
// #endregion

//#region passport Sign In
passport.serializeUser((user, done) => {
    return done(null, user.id);
})

passport.deserializeUser((id, done) => {
    patient.findById(id, (err, user) => {
        appoint.findById(id, (err, _appoint) => {
            if (!_appoint) {
                return done(err, user);
            }
            user._appoint = _appoint;
            return done(err, user);
        })
    })
})

passport.use('localsignin', new passportStrategy({
    usernameField: 'phone',
    passwordField: 'password',
    passReqToCallback: true
}, (req, phone, password, done) => {
    patient.findOne({ _id: phone }, (err, user) => {
        if (err) {
            return done(err);
        }
        if (!user) {
            return done(null, false, req.flash('signinerror', 'This Wrong Phone Number'))
        }
        if (user) {
            if (user.password === password) {
                return done(null, user);
            }
            else {
                return done(null, false, req.flash('signinerror', 'This Wrong Password'))
            }
        }
    })
}))
//#endregion


//#region Email Send
function sendemail(emailreciver, name) {

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
        html: '<div style=" background-color: #f1f3f4;border-radius: 10px;direction: ltr;padding: 30px;"><div style=" font-size: 15px;font-weight: bold;"><img src="cid:logo"><a href="localhost:5000/"  style="margin-left:5px;font-weight: bold;font-family: Arial, Helvetica, sans-serif;font-size: 25px;">Care Center</a><hr>Greeting, ' + name + '</div><div><h3>Thank you for registering on the online Care Center</h3><p>Outer Heaven Care Center</p></div></div>',
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