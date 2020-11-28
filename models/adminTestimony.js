var mongoose = require('mongoose');
var adminTestimonySchema = mongoose.Schema(
    {
        name: {
            type: String, 
        },
        title:{
            type: String,
        },
        testimony:{
            type:String,
        },
       
        date: {
            type: Date, 
            default: Date.now
        }
    }
)

var AdminTestimony = mongoose.model('AdminTestimony', adminTestimonySchema);



module.exports = AdminTestimony;