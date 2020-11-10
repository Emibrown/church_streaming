const mongoose = require('mongoose');
const validator = require('validator')
const bcrypt = require('bcryptjs')
const uniqueValidator = require('mongoose-unique-validator');
const { ImATeapot } = require('http-errors');
mongoose.Promise = require('bluebird');

const seasonSchema = mongoose.Schema(
    {
        title: {
            type: String, 
            required: true, 
            unique: true
        },
        programme : {
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'Programme'
        },
        date:{
            type: Date,
            default: Date.now
        }
    }
)


seasonSchema.plugin(uniqueValidator, { message: '{PATH} already exists!' });

const Season = mongoose.model('Season', seasonSchema);

module.exports = Season;