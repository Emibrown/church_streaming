const mongoose = require('mongoose');
const validator = require('validator')
const bcrypt = require('bcryptjs')
const uniqueValidator = require('mongoose-unique-validator');
mongoose.Promise = require('bluebird');

const likeSchema = mongoose.Schema(
    {
        member : {
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'Member'
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


likeSchema.plugin(uniqueValidator, { message: '{PATH} already exists!' });

const Like = mongoose.model('Like', likeSchema);

module.exports = Like;