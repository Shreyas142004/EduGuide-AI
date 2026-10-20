const path = require('path');
const dotenv = require('dotenv');

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

module.exports = {
  port: process.env.PORT || 5000,
  mongoUri: process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/eduguide_ai',
  jwtSecret: process.env.JWT_SECRET || 'eduguide_super_secret_jwt_key_2026',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
  nlpServiceUrl: process.env.NLP_SERVICE_URL || 'http://127.0.0.1:8000',
  uploadDir: process.env.UPLOAD_DIR 
    ? path.resolve(__dirname, '../../', process.env.UPLOAD_DIR) 
    : path.resolve(__dirname, '../../../storage/uploads')
};
