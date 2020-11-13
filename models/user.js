var mongoose = require('mongoose');
const validator = require('validator')
const bcrypt = require('bcryptjs')
const uniqueValidator = require('mongoose-unique-validator');
mongoose.Promise = require('bluebird');

var userSchema = mongoose.Schema(
    {
    
        firstname: {type: String, required: false},
        lastname: {type: String, required: false},
        middlename: {type: String, required: false},
        title: {type: String, required: false},
        type: {
            type: String,
            default: "0"
        },
        email: {
            type: String, 
            required: false, 
            unique: false,
            validate: value => {
                if (!validator.isEmail(value)) {
                    throw new Error({error: 'Invalid Email Address'})
                }
            }
        },
        address: {
            type: String, 
            required: false,
        },
        dateOfBirth:{
            type: String,
            required: false,
        },
        location: {
            type: String, 
            required: false,
        },
        stateOfOrigin: {
            type: String, 
            required: false,
        },
        LGA: {
            type: String, 
            required: false,
        },
        residentPastor: {
            type: String, 
            required: false
        },
        chapterLocation: {
            type: String, 
            required: false
        },
        organisationName: {
            type: String, 
            required: false
        },
        isBlocked:{
            type: Boolean, default: false,
        },
        password: {
            type: String, 
            required: false
        },
        facebookId: String,
        facebookToken: String,

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