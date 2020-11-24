const mongoose = require('mongoose');
const validator = require('validator')
const uniqueValidator = require('mongoose-unique-validator');
mongoose.Promise = require('bluebird');

const AutoIncrement = require('mongoose-sequence')(mongoose);

var commentsSchema = mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        message: {
            type: String, 
            required: true,
        },
        date: {
            type: Date, 
            default: Date.now
        },

    }
)
commentsSchema.plugin(AutoIncrement, {inc_field: 'counter'});

commentsSchema.plugin(uniqueValidator, { message: '{PATH} already exists!' });

var Comments = mongoose.model('Comments', commentsSchema);

module.exports = Comments;
