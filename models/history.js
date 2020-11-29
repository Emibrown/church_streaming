const mongoose = require('mongoose');
const validator = require('validator')
const bcrypt = require('bcryptjs')
const uniqueValidator = require('mongoose-unique-validator');
mongoose.Promise = require('bluebird');

const historySchema = mongoose.Schema(
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

const History = mongoose.model('History', historySchema);

module.exports = History;