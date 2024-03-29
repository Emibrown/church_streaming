const mongoose = require('mongoose');
const validator = require('validator')
const bcrypt = require('bcryptjs')
const uniqueValidator = require('mongoose-unique-validator');
mongoose.Promise = require('bluebird');

const programmeSchema = mongoose.Schema(
    {
        title: {type: String, required: true, unique: true},
        code: {type: String},
        categories : [{
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'Category'
        }],
        type: {
            type: String,
        },
        description: {type: String, required: true},
        image: {type: String, required: true},
        date: {
            type: Date, 
            default: Date.now
        },
    }
)


programmeSchema.plugin(uniqueValidator, { message: '{PATH} already exists!' });

programmeSchema.pre('save', async function (next) {
    const programme = this
    const str = programme.title.toLowerCase()
    programme.code = str.split(" ").join("-")
    next()
})



const Programme = mongoose.model('Programme', programmeSchema);

module.exports = Programme;