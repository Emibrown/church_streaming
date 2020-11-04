var mongoose = require('mongoose');
const validator = require('validator')

var musicVideoSchema = mongoose.Schema(
    {
        title: {
            type: String,
            required: true
        },
        genre: {
            type: String,
            required: true
        },
        SupplierName: {
            type: String, 
            required: true, 
        },
        contactName: {
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
            required: false,
            validate: value => {
                if (!validator.isMobilePhone(value, 'en-NG')) {
                    throw new Error({error: 'Invalid phone number'})
                }
            }
        },
        location: {
            type: String, 
            required: true
        },
        videoURL: {
            type: String,
            required: true,
            validate: value => {
                if (!validator.isURL(value)) {
                    throw new Error({error: 'Invalid presentation URL'})
                }
            }
        },
        firstTimeProduction: {
            type: String,
            required: true,
        },
        personalRelationships: {
            type: String,
            required: true,
        },
        termsOfServiceAgreement: {
            type: String, 
            required: true,
        },
        date: {
            type: Date, 
            default: Date.now
        }
    }
)

var MusicVideo= mongoose.model('musicVideo', musicVideoSchema);

module.exports = MusicVideo;