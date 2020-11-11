const mongoose = require('mongoose');

const requestPasswordSchema = new mongoose.Schema({
    userId :{
        type:String,
        default:null,
    },
    email: {
        type: String,
        default: null,
    },
    ip: {
        type: String, default: null
    },
    token: {
        type: Number,
        default: null,
    },
    tokenTime: {
        type: String,
        default: new Date().toString()
    }
});


const requestPasswordModel = mongoose.model("RequestPassword", requestPasswordSchema);

module.exports = requestPasswordModel;