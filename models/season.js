const mongoose = require('mongoose');
const validator = require('validator')
const bcrypt = require('bcryptjs')
const uniqueValidator = require('mongoose-unique-validator');
mongoose.Promise = require('bluebird');

const seasonSchema = mongoose.Schema(
    {
        num: {type: Number, required: true, unique: true},
        programme : {
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'Programme'
        },
    }
)


seasonSchema.plugin(uniqueValidator, { message: '{PATH} already exists!' });

const Season = mongoose.model('Season', seasonSchema);

module.exports = Season;