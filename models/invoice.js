var mongoose = require('mongoose');
const validator = require('validator')

var invoiceSchema = mongoose.Schema(
    {
        recipientName: {
            type: String, 
            required: true, 
        },
        address: {
            type: String, 
            required: true, 
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
        VATnumber: {
            type: String, 
            required: false
        },
        termsOfServiceAgreement: {
            type: String, 
            required: true,
        },
        date: {
            type: Date, 
            default: Date.now
        }
    }
)

var Invoice= mongoose.model('Invoice', invoiceSchema);

module.exports = Invoice;