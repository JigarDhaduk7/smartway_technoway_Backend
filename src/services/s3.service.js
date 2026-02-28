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
      if (!file || !file.buffer) {
        throw new Error('File buffer not found');
      }

      const fileName = `${folder}/${Date.now()}-${file.originalname.replace(/\s+/g, '-')}`;

      const params = {
        Bucket: process.env.AWS_S3_BUCKET,
        Key: fileName,
        Body: file.buffer,
        ContentType: file.mimetype
      };

      const result = await s3.upload(params).promise();
      return result.Location;

    } catch (error) {
      console.error('S3 Upload Error:', error);
      throw error;
    }
  }

  async deleteFile(fileUrl) {
    try {
      const bucketName = process.env.AWS_S3_BUCKET;

      // Extract key correctly (handles nested folders)
      const key = decodeURIComponent(
        fileUrl.split(`${bucketName}.s3.`)[1].split('/').slice(1).join('/')
      );

      const params = {
        Bucket: bucketName,
        Key: key
      };

      await s3.deleteObject(params).promise();

    } catch (error) {
      console.error('Error deleting file from S3:', error);
    }
  }

  // Generate signed URL for private files
  getSignedUrl(key, expires = 3600) {
    return s3.getSignedUrl('getObject', {
      Bucket: process.env.AWS_S3_BUCKET,
      Key: key,
      Expires: expires
    });
  }
}

module.exports = new S3Service();
