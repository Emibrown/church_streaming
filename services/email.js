const nodemailer = require('nodemailer');
const ejs = require("ejs");

const transport = {
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
        user: 'officialkamchezreal@gmail.com',
        pass: 'eneche123?'
    }
}
const transporter = nodemailer.createTransport(transport)


const welcomeEmail = (name,email) =>{
    return new Promise(async (resolve, reject) => {
        ejs.renderFile(__dirname + "/template/welcome.ejs", { name: name }, function (err, data) {
            if (err) {
                console.log(err);
                reject(err)
            } else {
                var mainOptions = {
                    from: 'emekaekene@gmail.com',
                    to: email,
                    subject: 'Account Created',
                    html: data
                };
                transporter.sendMail(mainOptions, function (err, info) {
                if (err) {
                   reject(info)
                } else {
                   resolve(info)
                }
            });
            }
        });
    })
}

const customEmail = (name,email,header,message) =>{
    return new Promise(async (resolve, reject) => {
        ejs.renderFile(__dirname + "/template/custom.ejs", { name,header,message }, function (err, data) {
            if (err) {
                console.log(err);
                reject(err)
            } else {
                var mainOptions = {
                    from: 'kamchezreal@gmail.com',
                    to: email,
                    subject: 'Faith TV | Response',
                    html: data
                };
                transporter.sendMail(mainOptions, function (err, info) {
                    if (err) {
                     console.log(err)
                    } else {
                     console.log(info);
                    }
            });
            }
        });
    })
}


const emailService = {
    welcomeEmail,
    customEmail
}

module.exports = emailService