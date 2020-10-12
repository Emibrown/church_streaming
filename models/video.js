var mongoose = require('mongoose');
const validator = require('validator')
const bcrypt = require('bcryptjs')
const uniqueValidator = require('mongoose-unique-validator');
mongoose.Promise = require('bluebird');

var videoSchema = mongoose.Schema(
    {
        title: {type: String, required: true, unique: true},
        description: {type: String, required: true},
        image: {type: String, required: true},
        video: {type: String},
        duration: {type: String},
        category : {
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'Category'
        },
        type: {
            type: String,
            default: '0'
        },
        streamKey: {type: String},
        doneStreaming: {
            type: String,
            default: '0'
        },
        facebookStreamKey: {type: String},
        scheduledOn: {
            type: Date, 
        },
        addedOn: {
            type: Date, 
            default: Date.now
        },
    }
)

videoSchema.plugin(uniqueValidator, { message: '{PATH} already exists!' });



var Video = mongoose.model('Video', videoSchema);

module.exports = Video;