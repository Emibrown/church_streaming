const express = require('express');
const Advert = require('../models/advert');
const PrayerRequest = require('../models/prayerRequest');
const Programmer = require('../models/programmer');
const Proposal = require('../models/showProposal');
const Testimony = require('../models/testimony');
const MusicVideo = require('../models/musicVideo');
const Patnership = require('../models/patnership');
const Static = require('../models/static');
const Settings = require('../models/settings');
const Show = require('../models/show');
const Schedule = require('../models/schedule');
const Enquiry = require('../models/enquiries');
const multers = require('../middleware/multers');
const sharp = require('sharp');
const path = require('path')
const fs = require('fs')
const router = express.Router();

const sendJSONresponse = (res, status, content) => {
    res.status(status);
    res.json(content);
};
const authenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
         res.redirect('/admin/dashboard');
    }else {
       next();
    }
  };
  
  const ensureAuthenticated = (req, res, next) => {
    if (!req.isAuthenticated()) {
      res.redirect("/admin");
    } else {
      next();
    }
  };
//advert
router.get('/adverts', ensureAuthenticated, async (req, res, next) => {
    // Get  all adverts 
    try {
        const advert = await Advert.find({}).sort({ date : 1 })
        res.render('admin/pages/adverts', { title: 'Adverts', advert });
    } catch (error) {
        sendJSONresponse(res, 400, {error});
    }
});

router.get('/advert/:id', ensureAuthenticated, async (req, res, next) => {
    // get a single advert
    try {
        const advert = await Advert.findOne({_id:req.params.id})
        res.render('admin/pages/advert', { title: 'Advert', advert });
    } catch (error) {
        sendJSONresponse(res, 400, {error});
    }
});

router.put('/advert/:id', ensureAuthenticated, async (req, res, next) => {
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

router.delete('/advert/:id', ensureAuthenticated, async (req, res, next) => {
    // delete an advert
    try {
        await Advert.findOneAndDelete({_id:req.params.id});
        sendJSONresponse(res, 200, {message: 'Advert deleted successfully'});
    } catch (error) {
        sendJSONresponse(res, 400, {error});
    }
});

//prayerRequest routes

router.get('/prayer_requests', ensureAuthenticated, async (req, res, next) => {
    // Get  all prayer requests 
    try {
        const prayerRequest = await PrayerRequest.find({}).sort({ date : 1 })
        res.render('admin/pages/prayer_requests', { title: 'Prayer requests', prayerRequest });
    } catch (error) {
        sendJSONresponse(res, 400, {error});
    }
});

router.get('/prayer_request/:id', ensureAuthenticated, async (req, res, next) => {
    // get a single prayer request
    try {
        const prayerRequest = await PrayerRequest.find({}).sort({ date : 1 })
        res.render('admin/pages/prayer_requests', { title: 'Prayer requests', prayerRequest });
    } catch (error) {
        sendJSONresponse(res, 400, {error});
    }
});

router.put('/prayer_request/:id', ensureAuthenticated, async (req, res, next) => {
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

router.delete('/prayer_request/:id', ensureAuthenticated, async (req, res, next) => {
    // delete a prayer request
    try {
        await PrayerRequest.findOneAndDelete({_id:req.params.id});
        sendJSONresponse(res, 200, {message: 'Prayer request deleted successfully'});
    } catch (error) {
        sendJSONresponse(res, 400, {error});
    }
});

//programmer routes

router.get('/become_programmers', ensureAuthenticated, async (req, res, next) => {
    // Get all programmer requests
    try {
        const programmer = await Programmer.find({}).sort({ lastName : 1 })
        res.render('admin/pages/become_programmers', { title: 'Become a programmer', programmer });
    } catch (error) {
        sendJSONresponse(res, 400, {error});
    }
});

router.get('/become_programmer/:id', ensureAuthenticated, async (req, res, next) => {
    // get a single programmer
    try {
        const programmer = await Programmer.findOne({_id:req.params.id})
        res.render('admin/pages/become_programmer', { title: 'Become a programmer', programmer });
    } catch (error) {
        sendJSONresponse(res, 400, {error});
    }
});

router.put('/become_programmer/:id', ensureAuthenticated, async (req, res, next) => {
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

router.delete('/become_programmer/:id', ensureAuthenticated, async (req, res, next) => {
    // delete a programmer request
    try {
        await Programmer.findOneAndDelete({_id:req.params.id});
        sendJSONresponse(res, 200, {message: 'programmer deleted successfully'});
    } catch (error) {
        sendJSONresponse(res, 400, {error});
    }
});

//show proposal routes

router.get('/show_proposals', ensureAuthenticated, async (req, res, next) => {
    // Get  all proposals 
    try {
        const proposal = await Proposal.find({}).sort({ date : 1 })
        res.render('admin/pages/show_proposals', { title: 'Show proposals', proposal });
    } catch (error) {
        sendJSONresponse(res, 400, {error});
    }
});

router.get('/show_proposal/:id', ensureAuthenticated, async (req, res, next) => {
    // get a single proposal
    try {
        const proposal = await Proposal.findOne({_id:req.params.id})
        res.render('admin/pages/show_proposal', { title: 'Show proposal', proposal });
    } catch (error) {
        sendJSONresponse(res, 400, {error});
    }
});

router.put('/show_proposal/:id', ensureAuthenticated, async (req, res, next) => {
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

router.delete('/show_proposal/:id', ensureAuthenticated, async (req, res, next) => {
    // delete a show proposal
    try {
        await Proposal.findOneAndDelete({_id:req.params.id});
        sendJSONresponse(res, 200, {message: 'Proposal deleted successfully'});
    } catch (error) {
        sendJSONresponse(res, 400, {error});
    }
});

//testimonies routes
router.get('/testimonies',  ensureAuthenticated, async (req, res, next) => {
    // Get all testimonies 
  try {
        const testimonies = await Testimony.find({}).sort({ date : 1 })
        res.render('admin/pages/testimonies', { title: 'testimonies', testimonies });
    } catch (error) {
        sendJSONresponse(res, 400, {error});
    }
});

router.get('/testimony/:id', ensureAuthenticated, async (req, res, next) => {
    // get a testimony
    try {
        const testimony = await Testimony.findOne({_id:req.params.id})
        sendJSONresponse(res, 200, {testimony});
    } catch (error) {
        sendJSONresponse(res, 400, {error});
    }
});

router.put('/testimony/:id', ensureAuthenticated, async (req, res, next) => {
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

router.delete('/testimony/:id', ensureAuthenticated, async (req, res, next) => {
    // delete a testimony
    try {
        await Testimony.findOneAndDelete({_id:req.params.id});
        sendJSONresponse(res, 200, {message: 'Testimony deleted successfully'});
    } catch (error) {
        sendJSONresponse(res, 400, {error});
    }
});

//music video routes
router.get('/music_videos', ensureAuthenticated, async (req, res, next) => {
    // Get all music videos
    try {
        const musicVideo = await MusicVideo.find({}).sort({ date : 1 })
        res.render('admin/pages/music_videos', { title: 'Music video', musicVideo });
    } catch (error) {
        sendJSONresponse(res, 400, {error});
    }
});

router.get('/music_video/:id', ensureAuthenticated, async (req, res, next) => {
    // get a single music video
    try {
        const musicVideo = await MusicVideo.findOne({_id:req.params.id})
        res.render('admin/pages/music_video', { title: 'Music video', musicVideo });
    } catch (error) {
        sendJSONresponse(res, 400, {error});
    }
});

router.put('/music_video/:id', ensureAuthenticated, async (req, res, next) => {
    // update a music video
    try {
        const musicVideo = await MusicVideo.findOne({_id:req.params.id})
        await Object.assign(musicVideo, req.body);
        await musicVideo.save()
        console.log(musicVideo)
        sendJSONresponse(res, 200, {message: 'music video updated successfully'});
    } catch (error) {
        sendJSONresponse(res, 400, {error});
    }
});

router.delete('/music_video/:id', ensureAuthenticated, async (req, res, next) => {
    // delete a musicVideo
    try {
        await MusicVideo.findOneAndDelete({_id:req.params.id});
        sendJSONresponse(res, 200, {message: 'music video deleted successfully'});
    } catch (error) {
        sendJSONresponse(res, 400, {error});
    }
});

//patnership routes
router.get('/patnerships', ensureAuthenticated, async (req, res, next) => {
    // Get patnerships
    try {
        const patnership = await Patnership.find({}).sort({ date : 1 })
        res.render('admin/pages/patnerships', { title: 'Patnerships', patnership });
    } catch (error) {
        sendJSONresponse(res, 400, {error});
    }
});

router.get('/patnership/:id', ensureAuthenticated, async (req, res, next) => {
    // get a patnership
    try {
        const patnership = await Patnership.findOne({_id:req.params.id})
        res.render('admin/pages/patnership', { title: 'Patnership', patnership });
    } catch (error) {
        sendJSONresponse(res, 400, {error});
    }
});

router.put('/patnership/:id', ensureAuthenticated, async (req, res, next) => {
    // update a patnership
    try {
        const patnership = await Patnership.findOne({_id:req.params.id})
        await Object.assign(patnership, req.body);
        await patnership.save()
        sendJSONresponse(res, 200, {message: 'patnership updated successfully'});
    } catch (error) {
        sendJSONresponse(res, 400, {error});
    }
});

router.delete('/patnership/:id', ensureAuthenticated, async (req, res, next) => {
    // delete a patnership
    try {
        await Patnership.findOneAndDelete({_id:req.params.id});
        sendJSONresponse(res, 200, {message: 'patnership deleted successfully'});
    } catch (error) {
        sendJSONresponse(res, 400, {error});
    }
});

//static file routes
router.get('/static_files', ensureAuthenticated, async (req, res, next) => {
    // Get  all static files
    try {
        const static = await Static.find({}).sort({ date : 1 })
        res.render('admin/pages/static_files', { title: 'Static files', static });
    } catch (error) {
        sendJSONresponse(res, 400, {error});
    }
});
router.post('/static_files', ensureAuthenticated, multers.static.single('file'), async (req, res, next) => {
    // add static file
    try {
        if(!req.file){
            sendJSONresponse(res, 400, {message: "file required"});
        }
        req.body.fileName = req.file.filename
        req.body.fileURL = path.join(req.hostname,req.file.path,req.file.filename)
        const static = new Static(req.body);
        await static.save();    
        sendJSONresponse(res, 200, {message: "Static file added successfully"});
        
    } catch (error) {
        sendJSONresponse(res, 400, {error});
    }
});

router.get('/static_files/:id', ensureAuthenticated, async (req, res, next) => {
    // get a single static file
    try {
        const static = await Static.findOne({_id:req.params.id})
        sendJSONresponse(res, 200, {static});
    } catch (error) {
        sendJSONresponse(res, 400, {error});
    }
});

router.put('/static_files/:id', ensureAuthenticated, multers.static.single('file'), async (req, res, next) => {
    // update a static file
    try {
        const static = await Static.findOne({_id:req.params.id})
        if(req.file){
            console.log(path.resolve('./public','static_files', static.fileURL))
            fs.unlinkSync(path.resolve('./public','static_files', static.fileURL))
            req.body.fileURL = req.file.filename   
        }
        await Object.assign(static, req.body);
        await static.save()
        sendJSONresponse(res, 200, {message: 'file updated successfully'});
    } catch (error) {
        sendJSONresponse(res, 400, {error});
    }
});

router.delete('/static_files/:id', ensureAuthenticated, async (req, res, next) => {
    // delete a static file
    try {
        const static = await Static.findOne({_id:req.params.id});
        fs.unlinkSync(path.resolve('./public','static', static.image))
        await Static.deleteOne(static);
        sendJSONresponse(res, 200, {message: 'file deleted successfully'});
    } catch (error) {
        sendJSONresponse(res, 400, {error});
    }
});

//settings routes
router.post('/settings', ensureAuthenticated, async (req, res, next) => {
    // add settings
    try {
        const settings = new Settings(req.body);
        await settings.save();    
        sendJSONresponse(res, 200, {message: "Settings added successfully"});
        
    } catch (error) {
        sendJSONresponse(res, 400, {error});
    }
});

router.get('/settings',ensureAuthenticated, async (req, res, next) => {
    // get all settings
    try {
        const settings = await Settings.find({})
        sendJSONresponse(res, 200, {settings});
    } catch (error) {
        sendJSONresponse(res, 400, {error});
    }
});

router.get('/settings/:id', async (req, res, next) => {
    // get a setting
    try {
        const settings = await Settings.findOne({_id:req.params.id})
        sendJSONresponse(res, 200, {settings});
    } catch (error) {
        sendJSONresponse(res, 400, {error});
    }
});


router.delete('/settings/:id', async (req, res, next) => {
    // delete a setting
    try {
        await Settings.findOneAndDelete({_id:req.params.id});
        sendJSONresponse(res, 200, {message: 'settings deleted successfully'});
    } catch (error) {
        sendJSONresponse(res, 400, {error});
    }
});

//show routes
router.get('/shows', ensureAuthenticated, async (req, res, next) => {
    // Get  all shows
    try {
        const shows = await Show.find({}).sort({ date : 1 })
        res.render('admin/pages/shows', { title: 'Shows', shows });
    } catch (error) {
        sendJSONresponse(res, 400, {error});
    }
});
router.get('/add_show', ensureAuthenticated, async (req, res, next) => {
    // add shows route
    try {
        res.render('admin/pages/add_shows', { title: 'Add Shows'});
    } catch (error) {
        sendJSONresponse(res, 400, {error});
    }
});
router.get('/edit_show/:id', ensureAuthenticated, async (req, res, next) => {
    // edit shows route
    try {
        const show = await Show.find({_id:req.params.id})
        res.render('admin/pages/edit_shows', { title: 'Edit Shows', show});
    } catch (error) {
        sendJSONresponse(res, 400, {error});
    }
});
router.post('/show', ensureAuthenticated, multers.upload.single('file'), async (req, res, next) => {
    // submit a show
    try {
        if(!req.file){
            sendJSONresponse(res, 400, {"message": "Image required"});
        }

        req.body.image = path.basename(req.file.filename, path.extname(req.file.filename))+'.webp'
        await sharp(req.file.path)
        .resize({ width: 400, height: 200 })
        .webp({quality: 60})
        .toFile(path.resolve('./public','small_images',req.body.image))

        await sharp(req.file.path)
        .resize({ width: 600, height: 300 })
        .webp({quality: 90})
        .toFile(path.resolve('./public','large_images',req.body.image))

        fs.unlinkSync(req.file.path)
        
        const show = new Show(req.body);
        await show.save();
        sendJSONresponse(res, 200, {message: "show added successfully"});
        
    } catch (error) {
        sendJSONresponse(res, 400, {error});
    }
});

router.get('/show/:id', ensureAuthenticated, async (req, res, next) => {
    // get a single a show
    try {
        const show = await Show.findOne({code:req.params.id})
        sendJSONresponse(res, 200, {show});
    } catch (error) {
        sendJSONresponse(res, 400, {error});
    }
});

router.put('/show/:id', ensureAuthenticated, multers.upload.single('file'), async (req, res, next) => {
    // update a show
    try {
        const show = await Show.findOne({_id:req.params.id})
        if(req.file){
            fs.unlinkSync(path.resolve('./public','small_images', show.image))
            fs.unlinkSync(path.resolve('./public','large_images', show.image))
    
            req.body.image = path.basename(req.file.filename, path.extname(req.file.filename))+'.webp'
            await sharp(req.file.path)
            .resize({ width: 384, height: 216 })
            .webp({quality: 60})
            .toFile(path.resolve('./public','small_images',req.body.image))
    
            await sharp(req.file.path)
            .resize({ width: 640, height: 360 })
            .webp({quality: 90})
            .toFile(path.resolve('./public','large_images',req.body.image))
    
            fs.unlinkSync(req.file.path)
        }
        await Object.assign(show, req.body);
        await show.save()
        sendJSONresponse(res, 200, {message: 'show updated successfully'});
    } catch (error) {
        sendJSONresponse(res, 400, {error});
    }
});

router.delete('/show/:id', ensureAuthenticated, async (req, res, next) => {
    // delete a show
    try {
        const show = await Show.findOne({_id:req.params.id});
        fs.unlinkSync(path.resolve('./public','small_images', show.image))
        fs.unlinkSync(path.resolve('./public','large_images', show.image))
        await Show.deleteOne(show);
        sendJSONresponse(res, 200, {message: 'show deleted successfully'});
    } catch (error) {
        sendJSONresponse(res, 400, {error});
    }
});

//schedule routes
router.post('/schedule', ensureAuthenticated, async (req, res, next) => {
    try{
      const schedule = new Schedule(req.body);
      await schedule.save();
      sendJSONresponse(res, 200, {message: "schedule added successfully"});
    } catch (error) {
      sendJSONresponse(res, 400, {error});
    }
  });
  
  router.get('/schedule', ensureAuthenticated, async (req, res, next) => {
    // get all schedules
    try {
        const schedule = await Schedule.find({})
        sendJSONresponse(res, 200, {schedule});
    } catch (error) {
        sendJSONresponse(res, 400, {error});
    }
  });
  
  router.get('/schedule/:id', ensureAuthenticated, async (req, res, next) => {
    // get a single schedule
    try {
        const schedule = await Schedule.findOne({_id: req.params.id})
        sendJSONresponse(res, 200, {schedule});
    } catch (error) {
        sendJSONresponse(res, 400, {error});
    }
  });
  
  router.put('/schedule/:id', ensureAuthenticated, async (req, res, next) => {
    // update a schedule
    try {
        const schedule = await Schedule.findOne({_id:req.params.id})
        await Object.assign(schedule,req.body);
        await schedule.save()
        sendJSONresponse(res, 200, {message: 'schedule updated successfully'});
    } catch (error) {
        sendJSONresponse(res, 400, {error});
    }
  });
  
  router.delete('/schedule/:id', ensureAuthenticated, async (req, res, next) => {
    // delete a schedule
    try {
        await Schedule.findOneAndDelete({_id:req.params.id});
        sendJSONresponse(res, 200, {message: 'schedule deleted successfully'});
    } catch (error) {
        sendJSONresponse(res, 400, {error});
    }
  });

  //feedback routes
  router.get('/enquiries', ensureAuthenticated, async (req, res, next) => {
    // get all feedbacks
    try {
        const enquiries = await Enquiry.find({})
        res.render('admin/pages/enquiries', { title: 'Enquiries', enquiries });
    } catch (error) {
        sendJSONresponse(res, 400, {error});
    }
  });
  
  router.get('/enquiries/:id',ensureAuthenticated, async (req, res, next) => {
    // get a single feedback
    try {
        const enquiries = await Enquiry.findOne({_id: req.params.id})
        sendJSONresponse(res, 200, {enquiries});
    } catch (error) {
        sendJSONresponse(res, 400, {error});
    }
  });
  
  router.put('/enquiries/:id', ensureAuthenticated, async (req, res, next) => {
    // update a feedback
    try {
        const enquiries = await Enquiry.findOne({_id:req.params.id})
        await Object.assign(enquiries,req.body);
        await enquiries.save()
        sendJSONresponse(res, 200, {message: 'feedback updated successfully'});
    } catch (error) {
        sendJSONresponse(res, 400, {error});
    }
  });
  
  router.delete('/enquiries/:id', ensureAuthenticated, async (req, res, next) => {
    // delete a feedback
    try {
        await Enquiry.findOneAndDelete({_id:req.params.id});
        sendJSONresponse(res, 200, {message: 'feedback deleted successfully'});
    } catch (error) {
        sendJSONresponse(res, 400, {error});
    }
  });
module.exports = router;