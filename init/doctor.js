const doctor = require('../model/doctordb');
const mongoose = require('mongoose');


mongoose.connect('mongodb://localhost/Care_Center', (err) => {
    if (err) {
        console.log(err)
    } else {
        console.log("Connect Database")
    }
})

const doctors = [
    new doctor({
        _id: '01280904213',
        name: 'Nasma Elbaz Ismaile',
        email: 'Nasma.Elbaz225@yahoo.com',
        experience: '10 year',
        specialised: 'Internal Medicine',
        degree: 'PhD',
        hourwork: '10am to 5pm',
        location: 'Alex/Egypt',
        scr:'/images/dr1.jpg'
    }),
    new doctor({
        _id: '01220901616',
        name: 'Mostafa Eltras',
        email: 'Mostafa.Eltras225@yahoo.com',
        experience: '12 year',
        specialised: 'Obstetrics and Gynecology',
        degree: 'PhD',
        hourwork: '10am to 5pm',
        location: 'Alex/Egypt',
        scr:'/images/dr1.jpg'
    }),
    new doctor({
        _id: '01290703412',
        name: 'Emam Ahmed Adel',
        email: 'Emam.Ahmed225@yahoo.com',
        experience: '10 year',
        specialised: 'Ophthalmology',
        degree: 'MD',
        hourwork: '10am to 5pm',
        location: 'Alex/Egypt',
        scr:'/images/dr1.jpg'
    }),
    new doctor({
        _id: '01290706412',
        name: 'Ahmed Galal Mohamed',
        email: 'Ahmed.Galal225@yahoo.com',
        experience: '20 year',
        specialised: 'Ear, nose and throat (ENT)',
        degree: 'MD',
        hourwork: '10am to 5pm',
        location: 'Alex/Egypt',
        scr:'/images/dr1.jpg'
    }),
    new doctor({
        _id: '01290706423',
        name: 'Amr Hesham Khames',
        email: 'Amr.Hesham225@yahoo.com',
        experience: '15 year',
        specialised: 'Urology',
        degree: 'PhD',
        hourwork: '10am to 5pm',
        location: 'Alex/Egypt',
        scr:'/images/dr1.jpg'
    }),
    new doctor({
        _id: '01259706423',
        name: 'Khames Ahmed Mohamed',
        email: 'Khames.Ahmed225@yahoo.com',
        experience: '25 year',
        specialised: 'Dermatology',
        degree: 'MD',
        hourwork: '10am to 5pm',
        location: 'Alex/Egypt',
        scr:'/images/dr1.jpg'
    })
]

for (var index = 0; index < doctors.length; index++) {
    doctors[index].save((err, resulte) => {
        if (err) {
            console.log(err);
        }
        else {
            console.log("---------------------------------------------------------");
            console.log(resulte);
            console.log("---------------------------------------------------------");
        }
        if (index === resulte.length - 1) {
            mongoose.disconnect();
            console.log('close()');
        }
    })
}


