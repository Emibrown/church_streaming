var mongoose = require('mongoose');
var musicGenreSchema = mongoose.Schema(
    {
        name: {
            type: String, 
        },
       
        date: {
            type: Date, 
            default: Date.now
        }
    }
)

var MusicGenre= mongoose.model('MusicGenre', musicGenreSchema);



module.exports = MusicGenre;