const mongoose = require('mongoose');
const validator = require('validator')
const bcrypt = require('bcryptjs')
const uniqueValidator = require('mongoose-unique-validator');
mongoose.Promise = require('bluebird');

const videoSchema = mongoose.Schema(
    {
        title: {type: String, required: true, unique: true},
        code: {type: String},
        description: {type: String, required: true},
        image: {type: String, required: true},
        video: {type: String},
        duration: {type: String},
        programme : {
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'Programme'
        },
        type: {
            type: String,
        },
        season : {
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'Season',
        },
        addedOn: {
            type: Date, 
            default: Date.now
        },
        active: {
            type: String,
            default: 1
        },
        views: {
            type: String,
            default: 0
        }
    }
)

videoSchema.plugin(uniqueValidator, { message: '{PATH} already exists!' });

videoSchema.pre('save', async function (next){
    const video = this
    const str = video.title.toLowerCase()
    video.code = str.split(" ").join("-")
    next()
})

const Video = mongoose.model('Video', videoSchema);

module.exports = Video;