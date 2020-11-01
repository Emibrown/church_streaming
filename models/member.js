const mongoose = require('mongoose');
const validator = require('validator')
const bcrypt = require('bcryptjs')
const uniqueValidator = require('mongoose-unique-validator');
mongoose.Promise = require('bluebird');

const memberSchema = mongoose.Schema(
    {
        firstname: {type: String, required: true},
        lastname: {type: String, required: true},
        title: {type: String, required: true},
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
        password: {
            type: String, 
            required: true,
        },
    }
)

memberSchema.plugin(uniqueValidator, { message: '{PATH} already exists!' });

memberSchema.pre('save', async function (next) {
    // Hash the password before saving the user model
    const member = this
    if (member.isModified('password')) {
        member.password = await bcrypt.hash(member.password, 8)
    }
    next()
})

memberSchema.methods.comparePassword = function(candidatePassword, cb) {
    bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
        if (err) return cb(err);
        cb(null, isMatch);
    });
};


const Member = mongoose.model('Member', memberSchema);

module.exports = Member;