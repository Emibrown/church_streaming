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
        startDate: {
            type: Date, 
            required: true,
        },
        endDate: {
            type: Date, 
            required: true,
        }
    }
)

var Schedule = mongoose.model('Schedule', scheduleSchema);

module.exports = Schedule;