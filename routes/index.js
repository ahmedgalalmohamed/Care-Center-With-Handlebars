var express = require('express');
var router = express.Router();
const doctor = require('../model/doctordb');
const appoint = require('../model/appointment');



//#region  GET home page
router.get('/', function (req, res, next) {
    var ckpro = false;
    var countdr = null
    var fullname = null;
    var actfullname = null;
    if (req.isAuthenticated()) {
        ckpro = true;
        actfullname = req.user.name.slice(0,1);
        fullname = req.user.name;
        if (req.user._appoint) {
            countdr = req.user._appoint.countdr;
        }
    }
    res.render('index', { title: 'Care Center', ckpro: ckpro, countdr: countdr, namepaact:actfullname,namepa:fullname});
});
//#endregion

//#region  Get And Post Doctors Assigntment
router.get('/_doctor', (req, res, next) => {
    var drassigmnent = null;
    var countdr = null;
    if (req.isAuthenticated() && req.user._appoint) {
        countdr = req.user._appoint.countdr;
        drassigmnent = req.user._appoint.dr;
    }
    res.render('Doctors/_doct', {ckpro: true, countdr: countdr,namepaact:req.user.name.slice(0,1),namepa:req.user.name, drassigmnent: drassigmnent });
})
//#endregion

//#region doctor profile
router.get('/doctor/profile/:id', (req, res, next) => {
    const DoctorId = req.params.id;
    if (req.isAuthenticated()) {
        doctor.findById(DoctorId, (err, doctorinfo) => {
            if (err) {
                console.log(err);
            }
            if (doctorinfo) {
                res.render('Doctors/profile', { title: 'doctor/profile', ckpro: true, phone: doctorinfo._id, namedr: doctorinfo.name, emaildr: doctorinfo.email, experience: doctorinfo.experience, specialised: doctorinfo.specialised, degree: doctorinfo.degree, hourwork: doctorinfo.hourwork, location: doctorinfo.location, namepaact:req.user.name.slice(0,1),namepa:req.user.name});
            }
        })
    }
})
//#endregion

//#region Get Doctor Delete
router.get('/addlistdr/:id', (req, res, next) => {
    deletedoctors(req,res,next);
})
//#endregion

//#region  GetFun  Doctors Not Assigntment
router.get('/doctor', (req, res, next) => {
    if (req.isAuthenticated()) {
        next();
    } else {
        res.redirect('/users/signin');
    }
}, function (req, res, next) {


    doctor.find({}, (err, resulte) => {
        var drassigmnent = null;
        var countdr = null
        const drs = [];
        const drstem = [];
        if (req.isAuthenticated() && req.user._appoint) {
            countdr = req.user._appoint.countdr;
            drassigmnent = req.user._appoint.dr;
            var match = false;
            for (let indexr = 0; indexr < resulte.length; indexr++) {
                for (let indexd = 0; indexd < drassigmnent.length; indexd++) {
                    if (resulte[indexr]._id === drassigmnent[indexd]._id) {
                        match = true;
                        break;
                    }
                    else {
                        match = false;
                    }
                }
                if (match === false) {
                    drstem.push(resulte[indexr]);
                }
            }

            for (let index = 0; index < drstem.length; index += 3) {
                drs.push(drstem.slice(index, index + 3));
            }
            if (err) {
                console.log(err);
            }

        } else {
            for (let index = 0; index < resulte.length; index += 3) {
                drs.push(resulte.slice(index, index + 3));
            }
            if (err) {
                console.log(err);
            }
        }

        res.render('Doctors/doct', { resulte: drs, ckpro: true, countdr: countdr,namepaact:req.user.name.slice(0,1),namepa:req.user.name });

    }).lean()
});
//#endregion

//#region  Get DoctorId Add
router.get('/addlistdr/:id/:name/:email', function (req, res, next) {
    const date = new Date();
    date.setDate(date.getDate()+3);
    datelo = date.toDateString();
    const appointid = req.user._id;
    const drs = {
        _id: req.params.id,
        name: req.params.name,
        email: req.params.email,
        datenow:datelo
    }

    appoint.findById(appointid, (err, _appoint) => {
        if (err) {
            console.log(err);
        }
        if (!_appoint) {
            const newappoint = new appoint({
                _id: appointid,
                dr: [drs],
                countdr: 1,
            });
            newappoint.save((err, appoint_) => {
                if (err) {
                    console.log(err);
                }
                else {
                    res.redirect('/doctor');
                }
            })
        }
        if (_appoint) {
            var indexcoun = -1;
            for (let index = 0; index < _appoint.dr.length; index++) {
                if (req.params.id === _appoint.dr[index]._id) {
                    indexcoun++;
                    break;
                }
            }
            if (indexcoun >= 0) {
                console.log("This Doctors Is Assignment");
                res.redirect('/doctor');
            }
            else {
                _appoint.countdr += 1;
                _appoint.dr.push(drs);
                appoint.updateOne({ _id: appointid }, { $set: _appoint }, (err, __appoint) => {
                    if (err) {
                        console.log(err);
                    }
                    if (__appoint) {
                        res.redirect('/doctor');
                    }
                })
            }
        }
    })
});
//#endregion
module.exports = router;
//#region Get Doctor Delete Fun
function deletedoctors(req,res,next){
    const drid = req.params.id;
    const appointid = req.user._id;
    if (req.isAuthenticated() && req.user._appoint) {
        const udpatedr = req.user._appoint;
        const drassigmnent = udpatedr.dr;
        for (let index = 0; index < drassigmnent.length; index++) {
            if (drassigmnent[index]._id === drid) {
                drassigmnent.splice(index, 1);
            }
        }
        udpatedr.countdr -= 1;
        udpatedr.dr = drassigmnent;
        appoint.updateOne({ _id: appointid }, { $set: udpatedr }, (err, __appoint) => {
            if (err) {
                console.log(err);
            }
            if (__appoint) {
                res.redirect('/_doctor');
            }
        })
    }
}
//#endregion
