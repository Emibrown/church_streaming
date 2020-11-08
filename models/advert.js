var mongoose = require('mongoose');
const validator = require('validator')

var advertSchema = mongoose.Schema(
    {
        fullName: {
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
            validate: value => {
                if (!validator.isMobilePhone(value, 'en-NG')) {
                    throw new Error({error: 'Invalid phone number'})
                }
            }
        },
        location: {
            type: String, 
            defualt:null,
        },
        ministryName: {
            type: String, 
            default:null,
        },
        webURL: {
            type: String,
        },
        title: {
            type: String,
            default:null,
        },

        description: {
            type: String,
            required: true
        },

        videoURL: {
            type: String,
            default: null,
        }, 
        mediaDownloadLink: {
            type: String,
            required: true,
            validate: value => {
                if (!validator.isURL(value)) {
                    throw new Error({error: 'Invalid media download link'})
                }
            }
        },
        invoiceMade: {
            type: String, 
            required: true, 
        },
        invoiceAddress: {
            type: String, 
            required: true, 
        },
        contactNumber: {
            type: String,
            required: false,
            validate: value => {
                if (!validator.isMobilePhone(value, 'en-NG')) {
                    throw new Error({error: 'Invalid phone number'})
                }
            }
        },
        VATnumber: {
            type: String, 
            default:null,
        },
        date: {
            type: Date, 
            default: Date.now
        }
    }
)

var Advert= mongoose.model('Advert', advertSchema);

module.exports = Advert;