const mongoose = require('mongoose');
const validator = require('validator')
const bcrypt = require('bcryptjs')
const uniqueValidator = require('mongoose-unique-validator');
mongoose.Promise = require('bluebird');

var staticSchema = mongoose.Schema(
    {
        fileName: {
            type: String,
        },
        fileURL: {
            type: String,
        },
        title: {
            type: String,
            required: true,
            unique: true
        },
        date: {
            type: Date,
            default: Date.now
        }
    }
)
staticSchema.plugin(uniqueValidator, { message: '{PATH} already exists!' });

var Static = mongoose.model('Static', staticSchema);

module.exports = Static;