var mongoose = require('mongoose');

var aboutSchema = mongoose.Schema(
    {
        image: {
            type: String,
        },
        title: {
            type: String,
            required: true
        },
        description: {
            type: String,
            required: true
        },
        addedOn: {
            type: Date, 
            default: Date.now
        }
    }
)

var About= mongoose.model('About', aboutSchema);

module.exports = About;