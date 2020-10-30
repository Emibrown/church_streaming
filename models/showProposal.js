var mongoose = require('mongoose');
const validator = require('validator')

var showProposalSchema = mongoose.Schema(
    {
        title: {
            type: String,
            required: true
        },
        genre: {
            type: String,
            required: true
        },
        SupplierName: {
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
            validate: value => {
                if (!validator.isMobilePhone(value, 'en-NG')) {
                    throw new Error({error: 'Invalid phone number'})
                }
            }
        },
        location: {
            type: String, 
            required: true
        },
        presentationURL: {
            type: String,
            required: true,
            validate: value => {
                if (!validator.isURL(value)) {
                    throw new Error({error: 'Invalid presentation URL'})
                }
            }
        },
        showReel: {
            type: String,
            required: true,
            validate: value => {
                if (!validator.isURL(value)) {
                    throw new Error({error: 'Invalid show reel/ pilot URL'})
                }
            }
        },
        date: {
            type: Date, 
            default: Date.now
        }
    }
)

var ShowProposal= mongoose.model('ShowProposal', showProposalSchema);

module.exports = ShowProposal;