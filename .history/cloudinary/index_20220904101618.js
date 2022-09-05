const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
      folder: 'YelpCa',
      format: async (req, file) => 'png', // supports promises as well
      public_id: (req, file) => 'computed-filename-using-request',
    },
  });