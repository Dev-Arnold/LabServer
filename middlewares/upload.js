import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import multer from 'multer';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const paymentProofStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: '/lab/payment-proofs',
    allowedFormats: ['jpeg', 'png', 'jpg', 'pdf'],
    resource_type: 'auto'
  },
});

const upload = multer({ 
  storage: paymentProofStorage,
  limits: { fileSize: 5 * 1024 * 1024 }
});

export default upload;