var mongoose = require('mongoose');
const validator = require('validator')
const bcrypt = require('bcryptjs')
const uniqueValidator = require('mongoose-unique-validator');
mongoose.Promise = require('bluebird');

var categorySchema = mongoose.Schema(
    {
        title: {type: String, required: true, unique: true},
        date: {type: Date, default : Date.now}
    }
)

categorySchema.plugin(uniqueValidator, { message: '{PATH} already exists!' });



var Category = mongoose.model('Category', categorySchema);

module.exports = Category;