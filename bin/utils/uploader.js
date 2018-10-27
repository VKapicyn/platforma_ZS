const mongoose = require('./../../server').mongoose;
const fs = require('fs');
const gridfs = require('gridfs-stream');

gridfs.mongo = mongoose.mongo;
let gfs = gridfs(mongoose.connection.db);

exports.Upload = (req, filename) => {
    new Promise( (reject, resolve) => {
        try{
            let writestream = gfs.createWriteStream({
                filename: req.files[filename].filename
            });
            fs.createReadStream(req.files[filename].path)
                .on('end', () => { fs.unlink(req.files[filename].path) })
                .pipe(writestream);
            writestream.on('close', function (file) {
                resolve(file.filename);
            });
        }
        catch(e) {reject('Error')}
    })
}

exports.Delete = (filename) => {
    // TODO:
}