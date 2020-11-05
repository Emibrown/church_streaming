const multer = require('multer')
const crypto =  require('crypto')
const path = require('path')

const fileName1 = async  (req, file, callback) => {
    // generates random string as filename
    crypto.pseudoRandomBytes(16, (err, raw) => {
        if (err) return callback(err); 
        callback(null, raw.toString('hex') + path.extname(file.originalname));
    });
}

const uploadStorage = multer.diskStorage({
    //sets destination and name of uploaded document files
    destination: (req, file, callback) => {
        callback(null, './public/uploads')
    },
    
    filename: fileName1
    
});

const staticStorage = multer.diskStorage({
    //sets destination and name of uploaded document files
    destination: (req, file, callback) => {
        callback(null, './public/static_files')
    },
    filename: fileName1  
});

const fileFilter = (req, file, callback) => {
    //validates that uploaded files are image files
    if(
        file.mimetype === "image/jpg"  || 
        file.mimetype ==="image/jpeg"  || 
        file.mimetype ==="video/mp4"  || 
        file.mimetype ===  "image/png"){
        callback(null, true);
    }
    else{
        callback(new Error("Image uploaded is not of type jpg/jpeg or png"),false);
    }
}

const multers = {
    upload : multer({storage: uploadStorage, fileFilter : fileFilter}),
    static : multer({storage: staticStorage})
}


module.exports = multers