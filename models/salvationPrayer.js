var mongoose = require('mongoose');

var salvationPrayerSchema = mongoose.Schema(
    {
        prayerRequest: {
            type: String,
            required: true
        },
        addedOn: {
            type: Date, 
            default: Date.now
        }
    }
)

var SalvationPrayer= mongoose.model('SalvationPrayer', salvationPrayerSchema);

module.exports = SalvationPrayer;