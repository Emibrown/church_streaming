var mongoose = require('mongoose');
const validator = require('validator')

var prayerRequestSchema = mongoose.Schema(
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
        phone: {
            type: String,
            required: false,
        },
        prayerRequest: {
            type: String,
            required: true
        },
        date: {
            type: Date, 
            default: Date.now
        }
    }
)

var PrayerRequest= mongoose.model('PrayerRequest', prayerRequestSchema);

module.exports = PrayerRequest;