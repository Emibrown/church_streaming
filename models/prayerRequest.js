var mongoose = require('mongoose');
const validator = require('validator')

var prayerRequestSchema = mongoose.Schema(
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
        prayerRequest: {
            type: String,
            required: true
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

var PrayerRequest= mongoose.model('PrayerRequest', prayerRequestSchema);

module.exports = PrayerRequest;