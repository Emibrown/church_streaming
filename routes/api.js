const express = require('express');
const Advert = require('../models/advert');
const PrayerRequest = require('../models/prayerRequest');
const Programmer = require('../models/programmer');
const Proposal = require('../models/showProposal');
const SalvationPrayer = require('../models/salvationPrayer');
const Testimony = require('../models/testimony');
const musicVideo = require('../models/musicVideo');
const Partnerhsip = require('../models/patnership');
const router = express.Router();

const sendJSONresponse = (res, status, content) => {
    res.status(status);
    res.json(content);
};

//advert
router.get('/adverts', async (req, res, next) => {
    // Get  all adverts 
    try {
        const advert = await Advert.find({}).sort({ date : 1 })
        sendJSONresponse(res, 200, {advert});
    } catch (error) {
        sendJSONresponse(res, 400, {error});
    }
});

router.get('/advert/:id', async (req, res, next) => {
    // get a single advert
    try {
        const advert = await Advert.findOne({_id:req.params.id})
        sendJSONresponse(res, 200, {advert});
    } catch (error) {
        sendJSONresponse(res, 400, {error});
    }
});

router.put('/advert/:id', async (req, res, next) => {
    // update an advert
    try {
        const advert = await Advert.findOne({_id:req.params.id})
        await Object.assign(advert, req.body);
        await advert.save()
        sendJSONresponse(res, 200, {message: 'advert details updated successfully'});
    } catch (error) {
        sendJSONresponse(res, 400, {error});
    }
});

router.delete('/advert/:id', async (req, res, next) => {
    // delete an advert
    try {
        await Advert.findOneAndDelete({_id:req.params.id});
        sendJSONresponse(res, 200, {message: 'Advert deleted successfully'});
    } catch (error) {
        sendJSONresponse(res, 400, {error});
    }
});

//prayerRequest routes

router.get('/prayer_requests', async (req, res, next) => {
    // Get  all prayer requests 
    try {
        const prayerRequest = await PrayerRequest.find({}).sort({ date : 1 })
        sendJSONresponse(res, 200, {prayerRequest});
    } catch (error) {
        sendJSONresponse(res, 400, {error});
    }
});

router.get('/prayer_request/:id', async (req, res, next) => {
    // get a single prayer request
    try {
        const invoice = await Invoice.findOne({_id:req.params.id})
        sendJSONresponse(res, 200, {invoice});
    } catch (error) {
        sendJSONresponse(res, 400, {error});
    }
});

router.put('/prayer_request/:id', async (req, res, next) => {
    // update a prayer request
    try {
        const prayerRequest = await PrayerRequest.findOne({_id:req.params.id})
        await Object.assign(prayerRequest, req.body);
        await prayerRequest.save()
        sendJSONresponse(res, 200, {message: 'prayer request updated successfully'});
    } catch (error) {
        sendJSONresponse(res, 400, {error});
    }
});

router.delete('/prayer_request/:id', async (req, res, next) => {
    // delete a prayer request
    try {
        await PrayerRequest.findOneAndDelete({_id:req.params.id});
        sendJSONresponse(res, 200, {message: 'Prayer request deleted successfully'});
    } catch (error) {
        sendJSONresponse(res, 400, {error});
    }
});

//programmer routes

router.get('/programmer', async (req, res, next) => {
    // Get all programmer requests
    try {
        const programmer = await Programmer.find({}).sort({ lastName : 1 })
        sendJSONresponse(res, 200, {programmer});
    } catch (error) {
        sendJSONresponse(res, 400, {error});
    }
});

router.get('/programmer/:id', async (req, res, next) => {
    // get a single programmer
    try {
        const programmer = await Programmer.findOne({_id:req.params.id})
        sendJSONresponse(res, 200, {programmer});
    } catch (error) {
        sendJSONresponse(res, 400, {error});
    }
});

router.put('/programmer/:id', async (req, res, next) => {
    // update a programmer request
    try {
        const programmer = await Programmer.findOne({_id:req.params.id})
        await Object.assign(programmer, req.body);
        await programmer.save()
        sendJSONresponse(res, 200, {message: 'programmer details updated successfully'});
    } catch (error) {
        sendJSONresponse(res, 400, {error});
    }
});

router.delete('/programmer/:id', async (req, res, next) => {
    // delete a programmer request
    try {
        await Programmer.findOneAndDelete({_id:req.params.id});
        sendJSONresponse(res, 200, {message: 'programmer deleted successfully'});
    } catch (error) {
        sendJSONresponse(res, 400, {error});
    }
});

//show proposal routes

router.get('/proposals', async (req, res, next) => {
    // Get  all proposals 
    try {
        const proposal = await Proposal.find({}).sort({ date : 1 })
        sendJSONresponse(res, 200, {proposal});
    } catch (error) {
        sendJSONresponse(res, 400, {error});
    }
});

router.get('/proposal/:id', async (req, res, next) => {
    // get a single proposal
    try {
        const proposal = await Proposal.findOne({_id:req.params.id})
        sendJSONresponse(res, 200, {proposal});
    } catch (error) {
        sendJSONresponse(res, 400, {error});
    }
});

router.put('/proposal/:id', async (req, res, next) => {
    // update a show proposal
    try {
        const proposal = await Proposal.findOne({_id:req.params.id})
        await Object.assign(proposal, req.body);
        await proposal.save()
        sendJSONresponse(res, 200, {message: 'proposal details updated successfully'});
    } catch (error) {
        sendJSONresponse(res, 400, {error});
    }
});

router.delete('/proposal/:id', async (req, res, next) => {
    // delete a show proposal
    try {
        await Proposal.findOneAndDelete({_id:req.params.id});
        sendJSONresponse(res, 200, {message: 'Proposal deleted successfully'});
    } catch (error) {
        sendJSONresponse(res, 400, {error});
    }
});

//salvation prayers routes

router.get('/salvation_prayers', async (req, res, next) => {
    // Get  all salvation prayers 
  try {
        const salvationPrayer = await SalvationPrayer.find({}).sort({ addedOn : 1 })
        sendJSONresponse(res, 200, {salvationPrayer});
    } catch (error) {
        sendJSONresponse(res, 400, {error});
    }
});

router.get('/salvation_prayer/:id', async (req, res, next) => {
    // get a salvation prayer
    try {
        const salvationPrayer = await SalvationPrayer.findOne({_id:req.params.id})
        sendJSONresponse(res, 200, {salvationPrayer});
    } catch (error) {
        sendJSONresponse(res, 400, {error});
    }
});

router.put('/salvation_prayer/:id', async (req, res, next) => {
    // update a salvation prayer
    try {
        const salvationPrayer = await SalvationPrayer.findOne({_id:req.params.id})
        await Object.assign(salvationPrayer, req.body);
        await salvationPrayer.save()
        sendJSONresponse(res, 200, {message: 'Salvation prayer updated successfully'});
    } catch (error) {
        sendJSONresponse(res, 400, {error});
    }
});

router.delete('/salvation_prayer/:id', async (req, res, next) => {
    // delete a salvation prayer
    try {
        await SalvationPrayer.findOneAndDelete({_id:req.params.id});
        sendJSONresponse(res, 200, {message: 'Salvation prayer deleted successfully'});
    } catch (error) {
        sendJSONresponse(res, 400, {error});
    }
});

//testimonies routes
router.get('/testimonies', async (req, res, next) => {
    // Get all testimonies 
  try {
        const testimonies = await Testimony.find({}).sort({ date : 1 })
        sendJSONresponse(res, 200, {testimonies});
    } catch (error) {
        sendJSONresponse(res, 400, {error});
    }
});

router.get('/testimony/:id', async (req, res, next) => {
    // get a testimony
    try {
        const testimony = await Testimony.findOne({_id:req.params.id})
        sendJSONresponse(res, 200, {testimony});
    } catch (error) {
        sendJSONresponse(res, 400, {error});
    }
});

router.put('/testimony/:id', async (req, res, next) => {
    // update a testimony
    try {
        const testimony = await Testimony.findOne({_id:req.params.id})
        await Object.assign(testimony, req.body);
        await testimony.save()
        sendJSONresponse(res, 200, {message: 'Testimony updated successfully'});
    } catch (error) {
        sendJSONresponse(res, 400, {error});
    }
});

router.delete('/testimony/:id', async (req, res, next) => {
    // delete a testimony
    try {
        await Testimony.findOneAndDelete({_id:req.params.id});
        sendJSONresponse(res, 200, {message: 'Testimony deleted successfully'});
    } catch (error) {
        sendJSONresponse(res, 400, {error});
    }
});

//music video routes
router.get('/music_video', async (req, res, next) => {
    // Get all music videos
    try {
        const musicVideo = await MusicVideo.find({}).sort({ date : 1 })
        sendJSONresponse(res, 200, {musicVideo});
    } catch (error) {
        sendJSONresponse(res, 400, {error});
    }
});

router.get('music_video/:id', async (req, res, next) => {
    // get a single music video
    try {
        const musicVideo = await MusicVideo.findOne({id:req.params.id})
        sendJSONresponse(res, 200, {musicVideo});
    } catch (error) {
        sendJSONresponse(res, 400, {error});
    }
});

router.put('music_video/:id', async (req, res, next) => {
    // update a music video
    try {
        const musicVideo = await MusicVideo.findOne({_id:req.params.id})
        await Object.assign(musicVideo, req.body);
        await MusicVideo.save()
        sendJSONresponse(res, 200, {message: 'music video updated successfully'});
    } catch (error) {
        sendJSONresponse(res, 400, {error});
    }
});

router.delete('music_video/:id', async (req, res, next) => {
    // delete a musicVideo
    try {
        await MusicVideo.findOneAndDelete({_id:req.params.id});
        sendJSONresponse(res, 200, {message: 'music video deleted successfully'});
    } catch (error) {
        sendJSONresponse(res, 400, {error});
    }
});

//patnership routes
router.get('/patnership', async (req, res, next) => {
    // Get all music videos
    try {
        const patnership = await Partnerhsip.find({}).sort({ date : 1 })
        sendJSONresponse(res, 200, {patnership});
    } catch (error) {
        sendJSONresponse(res, 400, {error});
    }
});

router.get('patnership/:id', async (req, res, next) => {
    // get a patnership
    try {
        const patnership = await Partnerhsip.findOne({id:req.params.id})
        sendJSONresponse(res, 200, {patnership});
    } catch (error) {
        sendJSONresponse(res, 400, {error});
    }
});

router.put('patnership/:id', async (req, res, next) => {
    // update a patnership
    try {
        const patnership = await Partnerhsip.findOne({_id:req.params.id})
        await Object.assign(patnership, req.body);
        await Partnerhsip.save()
        sendJSONresponse(res, 200, {message: 'patnership updated successfully'});
    } catch (error) {
        sendJSONresponse(res, 400, {error});
    }
});

router.delete('patsnership/:id', async (req, res, next) => {
    // delete a patnership
    try {
        await Partnerhsip.findOneAndDelete({_id:req.params.id});
        sendJSONresponse(res, 200, {message: 'patnership deleted successfully'});
    } catch (error) {
        sendJSONresponse(res, 400, {error});
    }
});

module.exports = router;