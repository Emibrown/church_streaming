const mongoose = require('mongoose');
const validator = require('validator')
const bcrypt = require('bcryptjs')
const uniqueValidator = require('mongoose-unique-validator');
mongoose.Promise = require('bluebird');

var scheduleSchema = mongoose.Schema(
    {
        show: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Show'
        },
        doneStreaming: {
            type: String,
            default: "0"
        },
        video: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Video'
        },
        facebook: {
            type: String,
        },
        youtube: {
            type: String,
        },
        twitter: {
            type: String,
        },
        startTime: {
            type: Date, 
            required: true,
        },
        endTime: {
            type: Date, 
            required: true,
        },
    }
)
scheduleSchema.plugin(uniqueValidator, { message: '{PATH} already exists!' });

var Schedule = mongoose.model('Schedule', scheduleSchema);


module.exports = Schedule;