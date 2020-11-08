var mongoose = require('mongoose');
const validator = require('validator')
const bcrypt = require('bcryptjs')
const uniqueValidator = require('mongoose-unique-validator');
mongoose.Promise = require('bluebird');

var userSchema = mongoose.Schema(
    {
        firstname: {type: String, required: true},
        lastname: {type: String, required: true},
        middlename: {type: String, required: true},
        title: {type: String, required: true},
        type: {
            type: String,
            default: "0"
        },
        email: {
            type: String, 
            required: true, 
            unique: true,
            validate: value => {
                if (!validator.isEmail(value)) {
                    throw new Error({error: 'Invalid Email Address'})
                }
            }
        },
        address: {
            type: String, 
            required: true,
        },
        location: {
            type: String, 
            required: true,
        },
        stateOfOrigin: {
            type: String, 
            required: true,
        },
        LGA: {
            type: String, 
            required: true,
        },
        residentPastor: {
            type: String, 
            required: true
        },
        chapterLocation: {
            type: String, 
            required: true
        },
        organisationName: {
            type: String, 
            required: true
        },
        type: {
            type: Number,
            default: 0,
        },
        isBlocked:{
            type: Boolean, default: false,
        },
        password: {
            type: String, 
            required: true
        },
    }
)

userSchema.plugin(uniqueValidator, { message: '{PATH} already exists!' });

userSchema.pre('save', async function (next) {
    // Hash the password before saving the user model
    const user = this
    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8)
    }
    next()
})

userSchema.methods.comparePassword = function(candidatePassword, cb) {
    bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
        if (err) return cb(err);
        cb(null, isMatch);
    });
};


var User = mongoose.model('User', userSchema);

module.exports = User;