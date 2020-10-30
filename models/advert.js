var mongoose = require('mongoose');
const validator = require('validator')

var advertSchema = mongoose.Schema(
    {
        firstName: {
            type: String, 
            required: true, 
        },
        lastName: {
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
        ministryName: {
            type: String, 
            required: true,
        },
        webURL: {
            type: String,
            required: true,
            validate: value => {
                if (!validator.isURL(value)) {
                    throw new Error({error: 'Invalid web URL'})
                }
            }
        },
        fbPage: {
            type: String,
            required: true,
            validate: value => {
                if (!validator.isURL(value)) {
                    throw new Error({error: 'Invalid facebook URL'})
                }
            }
        },
        ministryUrl: {
            type: String,
            required: true,
            validate: value => {
                if (!validator.isURL(value)) {
                    throw new Error({error: 'Invalid ministry URL'})
                }
            }
        },

        title: {
            type: String,
            required: true
        },

        description: {
            type: String,
            required: true
        },

        videoUrl: {
            type: String,
            required: true,
            validate: value => {
                if (!validator.isURL(value)) {
                    throw new Error({error: 'Invalid video URL'})
                }
            }
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
        date: {
            type: Date, 
            default: Date.now
        },
        invoice: {
            recipientName: {
                type: String, 
                required: true, 
            },
            address: {
                type: String, 
                required: true, 
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
            VATnumber: {
                type: String, 
                required: false
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
    }
)

var Advert= mongoose.model('Advert', advertSchema);

module.exports = Advert;