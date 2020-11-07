const mongoose = require('mongoose');
const validator = require('validator')
const bcrypt = require('bcryptjs')
mongoose.Promise = require('bluebird');

var enquirySchema = mongoose.Schema(
    {
        fullName: {
            type: String,
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
            required: false,
            validate: value => {
                if (!validator.isMobilePhone(value, 'en-NG')) {
                    throw new Error({error: 'Invalid phone number'})
                }
            }
        },
        enquiries: {
            type: String,
            required: true
        },
        date: {
            type: Date, 
            default: Date.now
        }
    }
)

var Enquiry= mongoose.model('Enquiry', enquirySchema);

module.exports = Enquiry;