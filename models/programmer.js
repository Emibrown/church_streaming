var mongoose = require('mongoose');
const validator = require('validator')
const bcrypt = require('bcryptjs')
const uniqueValidator = require('mongoose-unique-validator');

var programmerSchema = mongoose.Schema(
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
            validate: value => {
                if (!validator.isURL(value)) {
                    throw new Error({error: 'Invalid web URL'})
                }
            }
        },
        programmeTitle: {
            type: String,
            required: true
        },

        programmeDescription: {
            type: String,
            required: true
        },
        videoURL: {
            type: String,
            required: true,
            validate: value => {
                if (!validator.isURL(value)) {
                    throw new Error({error: 'Invalid video URL'})
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
        date: {
            type: Date, 
            default: Date.now
        }
    }
)

var Programmer= mongoose.model('Programmer', programmerSchema);

module.exports = Programmer;