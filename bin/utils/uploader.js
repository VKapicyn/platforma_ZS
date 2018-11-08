const mongoose = require('./../../server').mongoose;
const crypto = require('crypto');
const gridfs = require('gridfs-stream');
const GridFsStorage = require('multer-gridfs-storage');
// gridfs.mongo = mongoose.mongo;
// let gfs = gridfs(mongoose.connection.db);



// const bucket = new mongodb.GridFSBucket('ZSDB', { bucketName: 'reportPdfs'});
let config = require('./../../config.js'),
  mongoURI =  url = config.deploy ? 'mongodb://localhost:27017/ZSDB' :
  `mongodb://${config.dbLogin}:${config.dbPass}@${config.dbAddress}:${config.dbPort}/${config.dbName}`;

 

exports.newStorage = (ext,bucket) => {
return storage = new GridFsStorage({
        url: mongoURI,
        file: () => {
          return new Promise((resolve, reject) => {
            crypto.randomBytes(16, (err, buf) => {
              if (err) {
                return reject(err);
              }
              const filename = buf.toString('hex')+'.'+ext;
              const fileInfo = {
                filename: filename,
                bucketName: bucket
              };
              resolve(fileInfo);
            });
          });
        }
  });
}

exports.Delete = (filename) => {
    // TODO:
}