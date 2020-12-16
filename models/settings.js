const mongoose = require('mongoose');
const validator = require('validator')
const bcrypt = require('bcryptjs')
mongoose.Promise = require('bluebird');

var settingsSchema = mongoose.Schema(
    {
        settingsId: {
            type: String,
            unique: true,
            required: true,
        },
        siteName: {
            type: String,
            required: false,
        },
        siteDis: {
            type: String,
            required: false,
        },
        faithStatement: {
            type: String,
            required: false,
        },
        salvationPrayerImage: {
            type: String,
            required: false
        },
        salvationPrayer: {
            type: String,
            required: false
        },
        HQaddress: {
            type: String,
            required: false
        },
        tag:{
            type:String,
            required:false,
        },
        email: {
            type: String,
            required: false
        },
        emailNotification:{
            type: String,
            required: false
        },
        guessMessage:{
            type: String,
            required: false
        },
        termsAndCondition:{
            type: String,
            required: false
        },
        facebookHandle: {
            type: String,
            required: false
        },
        appreciationMessage:{
            type: String,
            required:false,
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
        memberStreamKey:{
            type: String,
            required: false
        },
        contactNumber:{
            type: String,
            required: false,
        },
        prayerNumber:{
            type: String,
            required: false,
        },
    }
)

var Settings= mongoose.model('Settings', settingsSchema);

module.exports = Settings;