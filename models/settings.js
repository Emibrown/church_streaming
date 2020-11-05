const mongoose = require('mongoose');
const validator = require('validator')
const bcrypt = require('bcryptjs')
mongoose.Promise = require('bluebird');

var settingsSchema = mongoose.Schema(
    {
        churchName: {
            type: String,
            required: false,
        },
        faithStatement: {
            type: String,
            required: false,
        },
        salvationPrayer: {
            type: String,
            required: false
        },
        HQaddress: {
            type: String,
            required: false
        },
        churchEmail: {
            type: String,
            required: false
        },
        facebookHandle: {
            type: String,
            required: false
        },
        instagramHandle:{
            type: String,
            required: false
        },
        twitterHandle:{
            type: String,
            required: false
        },
        vimeoHandle:{
            type: String,
            required: false
        },
        googleplusHandle:{
            type: String,
            required: false
        },
        publicStreamKey:{
            type: String,
            required: false
        },
        memberStreamHandle:{
            type: String,
            required: false
        },
        contactNumber:{
            type: String,
            required: false,
            validate: value => {
                if (!validator.isMobilePhone(value, 'en-NG')) {
                    throw new Error({error: 'Invalid phone number'})
                }
            }
        },
        prayerNumber:{
            type: String,
            required: false,
            validate: value => {
                if (!validator.isMobilePhone(value, 'en-NG')) {
                    throw new Error({error: 'Invalid phone number'})
                }
            }
        },
    }
)

var Settings= mongoose.model('Settings', settingsSchema);

module.exports = Settings;