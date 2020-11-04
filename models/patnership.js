var mongoose = require('mongoose');
const validator = require('validator')
const bcrypt = require('bcryptjs')
const uniqueValidator = require('mongoose-unique-validator');
mongoose.Promise = require('bluebird');

var patnershipSchema = mongoose.Schema(
    {
        firstname: {
            type: String, 
            required: true
        },
        lastname: {
            type: String, 
            required: true
        },
        middlename: {
            type: String, 
            required: true
        },
        title: {
            type: String, 
            required: true
        },
        membership: {
            type: String,
            required: true
        },
        email: {
            type: String, 
            required: true, 
            unique: true,
            validate: value => {
                if (!validator.isEmail(value)) {
                    throw new Error({error: 'Invalid Email Address'})
                }
            }
        },
        address: {
            type: String, 
            required: true,
        },
        category: {
            type: String, 
            required: true
        },
        patnershipLevel: {
            type: String, 
            required: true
        },
    }
)

patnershipSchema.plugin(uniqueValidator, { message: '{PATH} already exists!' });


var Patnership = mongoose.model('Patnership', patnershipSchema);

module.exports = Patnership;