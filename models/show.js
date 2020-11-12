const mongoose = require('mongoose');
const validator = require('validator')
const bcrypt = require('bcryptjs')
const uniqueValidator = require('mongoose-unique-validator');
mongoose.Promise = require('bluebird');

var showSchema = mongoose.Schema(
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
        date: {
            type: Date, 
            default: Date.now
        }
    }
)
showSchema.plugin(uniqueValidator, { message: '{PATH} already exists!' });

showSchema.pre('save', async function (next) {
    const show = this
    show.code = show.title.split(" ").join("-")
    next()
})

var Show = mongoose.model('Show', showSchema);

module.exports = Show;