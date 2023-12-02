const { S3Client } = require('@aws-sdk/client-s3');
const multer = require('multer');
const multerS3 = require('multer-s3');
const secret = require('./secret');

const s3 = new S3Client({
  region: secret.AWS_REGION,
  credentials: {
    accessKeyId: secret.AWS_ACCESS_KEY_ID,
    secretAccessKey: secret.AWS_SECRET_ACCESS_KEY,
  },
});

const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: secret.AWS_BUCKET_NAME,
    acl: 'public-read',
    key: function (req, file, cb) {
      const uniqueFilename = Date.now() + '-' + file.originalname;
      cb(null, `profile/${uniqueFilename}`);
    },
  }),
});

module.exports = upload;