const mongoose = require('mongoose');
const validator = require('validator')
const bcrypt = require('bcryptjs')
const uniqueValidator = require('mongoose-unique-validator');
mongoose.Promise = require('bluebird');

const watchSchema = mongoose.Schema(
    {
        member : {
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'User'
        },
        video : {
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'Video'
        },
        addedOn: {
            type: Date, 
            default: Date.now
        },
    }
)

const Watch = mongoose.model('Watch', watchSchema);

module.exports = Watch;