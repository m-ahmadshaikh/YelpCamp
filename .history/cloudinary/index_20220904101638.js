const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
      folder: 'YelpCamp',
      format:[ 'png','jpeg','jpg'], // supports promises as well
      public_id: (req, file) => 'computed-filename-using-request',
    },
  });