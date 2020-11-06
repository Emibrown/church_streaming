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
        },
        phoneNumber: {
            type: String,
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