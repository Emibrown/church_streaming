const express = require('express');
const Advert = require('../models/advert');
const Invoice = require('../models/invoice');
const PrayerRequest = require('../models/prayerRequest');
const Programmer = require('../models/programmer');
const Proposal = require('../models/showProposal');
const SalvationPrayer = require('../models/salvationPrayer');
const Testimony = require('../models/testimony');
const router = express.Router();

const sendJSONresponse = (res, status, content) => {
    res.status(status);
    res.json(content);
};

//Invoice routes

router.get('/invoice', async (req, res, next) => {
    // Get  all invoices 
  try {
        const invoice = await Advert.find({}).sort({ date : 1 })
        sendJSONresponse(res, 200, {invoice});
    } catch (error) {
        sendJSONresponse(res, 400, {error});
    }
});

router.post('/invoice', async (req, res, next) => {
    // create an invoice
    try {
        const invoice = new Advert(req.body)
        await invoice.save()
        sendJSONresponse(res, 200, {message: 'invoice created'});
    } catch (error) {
        sendJSONresponse(res, 400, {error});
    }
});

router.get('/invoice/:id', async (req, res, next) => {
    // get a single invoice
    try {
        const invoice = await Advert.findOne({_id:req.params.id})
        sendJSONresponse(res, 200, {invoice});
    } catch (error) {
        sendJSONresponse(res, 400, {error});
    }
});

router.put('/invoice/:id', async (req, res, next) => {
    // update an invoice
    try {
        const invoice = await Advert.findOne({_id:req.params.id})
        await Object.assign(invoice, req.body);
        await invoice.save()
        sendJSONresponse(res, 200, {message: 'invoice details updated successfully'});
    } catch (error) {
        sendJSONresponse(res, 400, {error});
    }
});

router.delete('/invoice/:id', async (req, res, next) => {
    // delete an invoice
    try {
        await Advert.findOneAndDelete({_id:req.params.id});
        sendJSONresponse(res, 200, {message: 'Invoice deleted successfully'});
    } catch (error) {
        sendJSONresponse(res, 400, {error});
    }
});

//advert

router.get('/advert', async (req, res, next) => {
    // Get  all adverts 
  try {
        const advert = await Advert.find({}).sort({ date : 1 })
        sendJSONresponse(res, 200, {advert});
    } catch (error) {
        sendJSONresponse(res, 400, {error});
    }
});

router.post('/advert', async (req, res, next) => {
    // submit an advert
    try {
        const advert = new Advert(req.body)
        await advert.save()
        sendJSONresponse(res, 200, {message: 'advert submitted'});
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

router.get('/prayerrequests', async (req, res, next) => {
    // Get  all prayer requests 
  try {
        const prayerRequest = await PrayerRequest.find({}).sort({ date : 1 })
        sendJSONresponse(res, 200, {prayerRequest});
    } catch (error) {
        sendJSONresponse(res, 400, {error});
    }
});

router.post('/prayerrequest', async (req, res, next) => {
    // submit a prayer request
    try {
        const prayerRequest = new PrayerRequest(req.body)
        await prayerRequest.save()
        sendJSONresponse(res, 200, {message: 'prayer request submitted'});
    } catch (error) {
        sendJSONresponse(res, 400, {error});
    }
});

router.get('/prayerrequest/:id', async (req, res, next) => {
    // get a single prayer request
    try {
        const invoice = await Invoice.findOne({_id:req.params.id})
        sendJSONresponse(res, 200, {invoice});
    } catch (error) {
        sendJSONresponse(res, 400, {error});
    }
});

router.put('/prayerrequest/:id', async (req, res, next) => {
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

router.delete('/prayerrequest/:id', async (req, res, next) => {
    // delete a prayer request
    try {
        await PrayerRequest.findOneAndDelete({_id:req.params.id});
        sendJSONresponse(res, 200, {message: 'Prayer request deleted successfully'});
    } catch (error) {
        sendJSONresponse(res, 400, {error});
    }
});

//programmer routes

router.get('/programmer', auth, (req, res, next) => {
    // Get all programmers 
  try {
        const programmer = await Programmer.find({}).sort({ lastName : 1 })
        sendJSONresponse(res, 200, {programmer});
    } catch (error) {
        sendJSONresponse(res, 400, {error});
    }
});

router.post('/programmer', auth, (req, res, next) => {
    // create an invoice
    try {
        const programmer = new Programmer(req.body)
        await programmer.save()
        sendJSONresponse(res, 200, {message: 'form submitted'});
    } catch (error) {
        sendJSONresponse(res, 400, {error});
    }
});

router.get('/programmer/:id', async (req, res, next) => {
    // get a single invoice
    try {
        const programmer = await Programmer.findOne({_id:req.params.id})
        sendJSONresponse(res, 200, {programmer});
    } catch (error) {
        sendJSONresponse(res, 400, {error});
    }
});

router.put('/programmer/:id', async (req, res, next) => {
    // update a programmer details
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
    // delete a programmer
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

router.post('/proposal', async (req, res, next) => {
    // create a proposal
    try {
        const proposal = new Proposal(req.body)
        await proposal.save()
        sendJSONresponse(res, 200, {message: 'Proposal submitted'});
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

router.get('/salvationprayer', async (req, res, next) => {
    // Get  all salvation prayers 
  try {
        const salvationPrayer = await SalvationPrayer.find({}).sort({ addedOn : 1 })
        sendJSONresponse(res, 200, {salvationPrayer});
    } catch (error) {
        sendJSONresponse(res, 400, {error});
    }
});

router.post('/salvationprayer', async (req, res, next) => {
    // create a salvation prayer
    try {
        const salvationPrayer = new SalvationPrayer(req.body)
        await salvationPrayer.save()
        sendJSONresponse(res, 200, {message: 'salvation prayer created'});
    } catch (error) {
        sendJSONresponse(res, 400, {error});
    }
});

router.get('/salvationprayer/:id', async (req, res, next) => {
    // get a salvation prayer
    try {
        const salvationPrayer = await SalvationPrayer.findOne({_id:req.params.id})
        sendJSONresponse(res, 200, {salvationPrayer});
    } catch (error) {
        sendJSONresponse(res, 400, {error});
    }
});

router.put('/salvationprayer/:id', async (req, res, next) => {
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

router.delete('/salvationprayer/:id', async (req, res, next) => {
    // delete a salvation prayer
    try {
        await SalvationPrayer.findOneAndDelete({_id:req.params.id});
        sendJSONresponse(res, 200, {message: 'Salvation prayer deleted successfully'});
    } catch (error) {
        sendJSONresponse(res, 400, {error});
    }
});

//testimonies routes
router.get('/testimony', async (req, res, next) => {
    // Get all testimonies 
  try {
        const testimonies = Testimony.find({}).sort({ addedOn : 1 })
        sendJSONresponse(res, 200, {testimony});
    } catch (error) {
        sendJSONresponse(res, 400, {error});
    }
});

router.post('/testimoney', async (req, res, next) => {
    // create a testimony
    try {
        const testimony = new Testimony(req.body)
        await testimony.save()
        sendJSONresponse(res, 200, {message: 'testimony'});
    } catch (error) {
        sendJSONresponse(res, 400, {error});
    }
});

router.get('/testimony/:id', async (req, res, next) => {
    // get a testimoney
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

router.delete('/testiomy/:id', async (req, res, next) => {
    // delete a testimony
    try {
        await Testimony.findOneAndDelete({_id:req.params.id});
        sendJSONresponse(res, 200, {message: 'Testimony deleted successfully'});
    } catch (error) {
        sendJSONresponse(res, 400, {error});
    }
});

module.exports = router;