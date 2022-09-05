const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

cloudinary.config({ 
    cloud_name: 'sample', 
    api_key: '874837483274837', 
    api_secret: 'a676b67565c6767a6767d6767f676fe1',
    secure: true
  });
  
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
      folder: 'YelpCamp',
      format:[ 'png','jpeg','jpg'],
    },
  });

module.exports = storage;