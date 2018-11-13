const mongoose = require('./../../server').mongoose;
const crypto = require('crypto');
let gridfs = require('gridfs-stream');
const GridFsStorage = require('multer-gridfs-storage');
gridfs.mongo = mongoose.mongo;
let gfs = gridfs(mongoose.connection);

//const gfs = gridfs(mongoose.connection.db, mongoose.mongo);
//const conn = mongoose.createConnection('mongodb://localhost:27017/ZSDB');


// const bucket = new mongodb.GridFSBucket('ZSDB', { bucketName: 'reportPdfs'});
let config = require('./../../config.js'),
  mongoURI =  url = config.deploy ? 'mongodb://localhost:27017/ZSDB' :
  `mongodb://${config.dbLogin}:${config.dbPass}@${config.dbAddress}:${config.dbPort}/${config.dbName}`;

 

exports.newStorage = () => {
return storage = new GridFsStorage({
        
        url: mongoURI,
        file: (req) => {
          // console.log(req.file);
          return new Promise((resolve, reject) => {
            crypto.randomBytes(16, (err, buf) => {
              if (err) {
                return reject(err);
              }
              const filename = buf.toString('hex');
              const fileInfo = {
                filename: filename,
                bucketName: 'fs'
              };
              resolve(fileInfo);
            });
          });
        }
  });
}

exports.getFile = (req, res) => {
  let readstream = gfs.createReadStream({ filename: req.params.filename })//, (err, file) => {
    readstream.on('error', function(err){
      console.log(err)
    });
  readstream.pipe(res);

  /*gfs.files.find({ }).toArray(function (err, files) {
    if (err) 
      console.log(err)
    console.log(files);
  })*.
  
  /*gfs.exist({id: '5be4545de0ac867bc45ee7ce'},function (err, found){
    console.log(err, found);
    res.send(found);
  });*/
  //readstream.pipe(res);
}

exports.Delete = (filename) => {
  console.log(filename);
  gfs.files.remove({ filename: filename }, (err, gridStore) => {
    if (err) {
      console.log(err);
    }
  });
}