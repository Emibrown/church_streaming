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
        type: {
            type: String, 
            required: true,
        },
       
        date:{
            type: Date,
            required: true 
        },
        startTime: {
            type: String, 
            required: true,
        },
        endTime: {
            type: String, 
            required: true,
        },
        timeRange: [{
            type: String, 
            required: true,
            unique: true
        }],
    }
)
scheduleSchema.plugin(uniqueValidator, { message: '{PATH} already exists!' });

var Schedule = mongoose.model('Schedule', scheduleSchema);


module.exports = Schedule;