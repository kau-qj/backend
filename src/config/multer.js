const aws = require('aws-sdk');
const multer = require('multer');
const multerS3 = require('multer-s3');
const path = require('path');
const secret = require('./secret');

const s3 = new aws.S3({
    region: secret.AWS_REGION,
    accessKeyId: secret.AWS_ACCESS_KEY_ID,
    secretAccessKey: secret.AWS_SECRET_ACCESS_KEY
});

const upload = multer({
    storage: multerS3({
        s3: s3,
        bucket: secret.AWS_BUCKET_NAME,
        acl: 'public-read',
        key: function (req, file, cb) {
            const uniqueFilename = Date.now() + '-' + file.originalname;
            cb(null, `profile/${uniqueFilename}`);
        }
    })
});

module.exports = upload;