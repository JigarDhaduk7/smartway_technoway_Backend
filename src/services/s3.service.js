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
    const filePath = file.path;

    try {
      const fileContent = fs.readFileSync(filePath);

      const fileName = `${folder}/${Date.now()}-${file.originalname.replace(/\s+/g, '-')}`;

      const params = {
        Bucket: process.env.AWS_S3_BUCKET,
        Key: fileName,
        Body: fileContent,
        ContentType: file.mimetype
        // ❌ ACL REMOVED (bucket owner enforced)
      };

      const result = await s3.upload(params).promise();

      return result.Location;

    } catch (error) {
      throw error;
    } finally {
      // ✅ Always clean temp file
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
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
}

module.exports = new S3Service();
