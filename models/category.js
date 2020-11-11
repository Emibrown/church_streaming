var mongoose = require('mongoose');
const validator = require('validator')
const bcrypt = require('bcryptjs')
const uniqueValidator = require('mongoose-unique-validator');
mongoose.Promise = require('bluebird');

var categorySchema = mongoose.Schema(
    {
        title: {type: String, required: true, unique: true},
        code: {type: String},
        date: {type: Date, default : Date.now}
    }
)

categorySchema.plugin(uniqueValidator, { message: '{PATH} already exists!' });

categorySchema.pre('save', async function (next) {
    const category = this
    const str = category.title.toLowerCase()
    category.code = str.split(" ").join("-")
    next()
})

var Category = mongoose.model('Category', categorySchema);

module.exports = Category;