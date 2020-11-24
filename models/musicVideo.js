var mongoose = require('mongoose');
const validator = require('validator')

var musicVideoSchema = mongoose.Schema(
    {
        title: {
            type: String,
            required: true
        },
        genre: {
            type: String,
            required: true
        },
        supplierName: {
            type: String, 
            required: true, 
        },
        contactName: {
            type: String, 
            required: true, 
        },
        email: {
            type: String, 
            required: true, 
            validate: value => {
                if (!validator.isEmail(value)) {
                    throw new Error({error: 'Invalid Email Address'})
                }
            }
        },
        phoneNumber: {
            type: String,
            required: false,
        },
        ownershipRights: {
            type: String, 
            required: true
        },
        location: {
            type: String, 
            required: true
        },
        videoURL: {
            type: String,
            required: true,
        },
        firstTimeProduction: {
            type: String,
            required: true,
        },
        personalRelationships: {
            type: String,
            required: true,
        },
        contentVideo:{
            type:String,
        },
        dateSubmitted:{
            type: String,
        },
        date: {
            type: Date, 
            default: Date.now
        }
    }
)

var MusicVideo= mongoose.model('musicVideo', musicVideoSchema);

module.exports = MusicVideo;