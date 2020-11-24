const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
mongoose.Promise = require('bluebird');

var messageSchema = mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        subject: {
            type: String, 
        },
        
        useremail:{
            type:String,
        },
        usermessage:{
            type:String,
        },
        date: {
            type: Date, 
            default: Date.now
        },
    }
)
messageSchema.plugin(uniqueValidator, { message: '{PATH} already exists!' });

var SendMessage = mongoose.model('SendMessage', messageSchema);

module.exports = SendMessage;