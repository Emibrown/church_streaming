const mongoose = require('mongoose');
const validator = require('validator')
const bcrypt = require('bcryptjs')
const uniqueValidator = require('mongoose-unique-validator');
mongoose.Promise = require('bluebird');

var aboutSchema = mongoose.Schema(
    {
        image: {
            type: String,
        },
        title: {
            type: String,
            required: true,
            unique: true
        },
        code: {
            type: String,
        },
        description: {
            type: String,
            required: true
        },
        addedOn: {
            type: Date, 
            default: Date.now
        }
    }
)
aboutSchema.plugin(uniqueValidator, { message: '{PATH} already exists!' });

aboutSchema.pre('save', async function (next) {
    const about = this
    const str = about.title.toLowerCase()
    about.code = str.split(" ").join("-")
    next()
})

var About= mongoose.model('About', aboutSchema);

module.exports = About;