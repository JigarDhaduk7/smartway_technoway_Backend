const AWS = require('aws-sdk');
const fs = require('fs');
const path = require('path');

// Configure AWS
AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION
});

const s3 = new AWS.S3();

class S3Service {
  async uploadFile(file, folder = 'images') {
    try {
      const fileContent = fs.readFileSync(file.path);
      const fileName = `${folder}/${Date.now()}-${file.originalname}`;
      
      const params = {
        Bucket: process.env.AWS_S3_BUCKET,
        Key: fileName,
        Body: fileContent,
        ContentType: file.mimetype,
        ACL: 'public-read'
      };

      const result = await s3.upload(params).promise();
      
      // Delete temp file
      fs.unlinkSync(file.path);
      
      return result.Location;
    } catch (error) {
      // Clean up temp file on error
      if (fs.existsSync(file.path)) {
        fs.unlinkSync(file.path);
      }
      throw error;
    }
  }

  async deleteFile(fileUrl) {
    try {
      const key = fileUrl.split('/').slice(-2).join('/'); // Extract folder/filename
      
      const params = {
        Bucket: process.env.AWS_S3_BUCKET,
        Key: key
      };

      await s3.deleteObject(params).promise();
    } catch (error) {
      console.error('Error deleting file from S3:', error);
    }
  }
}

module.exports = new S3Service();