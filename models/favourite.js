const mongoose = require('mongoose');
const validator = require('validator')
const bcrypt = require('bcryptjs')
const uniqueValidator = require('mongoose-unique-validator');
mongoose.Promise = require('bluebird');

const favouriteSchema = mongoose.Schema(
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

const Favourite = mongoose.model('Favourite', favouriteSchema);

module.exports = Favourite;