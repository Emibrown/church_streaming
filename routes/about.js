const express = require('express');
const About = require('../models/about');
const multers = require('../middleware/multers');
const sharp = require('sharp')
const path = require('path')
const fs = require('fs')
const router = express.Router();


const sendJSONresponse = (res, status, content) => {
    res.status(status);
    res.json(content);
};

//about

router.get('/', async (req, res, next) => {
    // Get  all abouts
    try {
        const about = await About.find({}).sort({ addedOn : 1 })
        res.render('admin/pages/about', { title: 'About', about });
    } catch (error) {
        sendJSONresponse(res, 400, {error});
    }
});
router.post('/', multers.upload.single('file'), async (req, res, next) => {
    // submit about
    try {
        if(!req.file){
            sendJSONresponse(res, 400, {"message": "Image required"});
        }

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
        
        const about = new About(req.body);
        await about.save();


        sendJSONresponse(res, 200, {message: "About added successfully"});
        
    } catch (error) {
        sendJSONresponse(res, 400, {error});
    }
});

router.get('/:id', async (req, res, next) => {
    // get a single about
    try {
        const about = await About.findOne({code:req.params.id})
        sendJSONresponse(res, 200, {about});
    } catch (error) {
        sendJSONresponse(res, 400, {error});
    }
});

router.put('/:id', multers.upload.single('file'), async (req, res, next) => {
    // update an about
    try {
        const about = await About.findOne({_id:req.params.id})
        if(req.file){
            fs.unlinkSync(path.resolve('./public','small_images', about.image))
            fs.unlinkSync(path.resolve('./public','large_images', about.image))
    
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
        await Object.assign(about, req.body);
        await about.save()
        sendJSONresponse(res, 200, {message: 'about updated successfully'});
    } catch (error) {
        sendJSONresponse(res, 400, {error});
    }
});

router.delete('/:id', async (req, res, next) => {
    // delete an about
    try {
        const about = await About.findOne({_id:req.params.id});
        fs.unlinkSync(path.resolve('./public','small_images', about.image))
        fs.unlinkSync(path.resolve('./public','large_images', about.image))
        await About.deleteOne(about);
        sendJSONresponse(res, 200, {message: 'About deleted successfully'});
    } catch (error) {
        sendJSONresponse(res, 400, {error});
    }
});

module.exports = router;