const mongoose = require('mongoose');
const validator = require('validator')
const bcrypt = require('bcryptjs')
const uniqueValidator = require('mongoose-unique-validator');
mongoose.Promise = require('bluebird');

const visitSchema = mongoose.Schema(
    {
        member : {
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'User'
        },
        user: {type: String},
        sessionId: {type: String},
        date: {
            type: Date, 
            default: Date.now
        },
    }
)

const Visit = mongoose.model('Visit', visitSchema);

module.exports = Visit;