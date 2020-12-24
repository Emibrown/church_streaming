const mongoose = require('mongoose');
const validator = require('validator')
const bcrypt = require('bcryptjs')
const uniqueValidator = require('mongoose-unique-validator');
mongoose.Promise = require('bluebird');

const membershipSchema = mongoose.Schema(
    {
        member : {
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'User'
        },
        message: {
            type: String,
            required: false
        },
        addedOn: {
            type: Date, 
            default: Date.now
        },
    }
)

membershipSchema.plugin(uniqueValidator, { message: '{PATH} already exists!' });




const Membership = mongoose.model('Membership', membershipSchema);

module.exports = Membership;