var mongoose = require('mongoose');
const validator = require('validator')

var testimonySchema = mongoose.Schema(
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
            required: true,
        },
        location: {
            type: String, 
            required: true
        },
        testimony: {
            type: String, 
            required: true
        },
        date: {
            type: Date, 
            default: Date.now
        }
    }
)

var Testimony= mongoose.model('Testimony', testimonySchema);

module.exports = Testimony;