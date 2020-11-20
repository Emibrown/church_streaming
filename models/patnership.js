var mongoose = require('mongoose');
const validator = require('validator')
const bcrypt = require('bcryptjs')
const uniqueValidator = require('mongoose-unique-validator');
mongoose.Promise = require('bluebird');

var patnershipSchema = mongoose.Schema(
    {
        title: {
            type: String, 
            required: true
        },
        surName: {
            type: String, 
            required: true
        },
        firstName: {
            type: String, 
            required: true
        },
        address: {
            type: String, 
            required: true
        },
        whatsAppNo:{
            type:String,
            required:false,
        },
    
        fellowship: {
            type: String,
            required: true
        },
        membership:{
            type: String,
            required: true,
        },
        email: {
            type: String, 
            required: true, 
            validate: value => {
                if (!validator.isEmail(value)) {
                    throw new Error({error: 'Invalid Email Address'})
                }
            }
        },
        phoneNumber: {
            type: String,
            required: true,
        },
        categories: [
            {
                type: String, 
                required: false
            },
        ],
        levels: [
            {
                type: String, 
                required: false
            },
        ],
        prayerPoint1: {
            type: String, 
            required: false,
        },
        prayerPoint2: {
            type: String, 
            required: false,
        },
        addedOn: {
            type:Date,
            default: Date.now
        }
    }
)

patnershipSchema.plugin(uniqueValidator, { message: '{PATH} already exists!' });


var Patnership = mongoose.model('Patnership', patnershipSchema);

module.exports = Patnership;