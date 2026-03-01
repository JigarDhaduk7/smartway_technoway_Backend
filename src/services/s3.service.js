const { S3Client, PutObjectCommand, DeleteObjectCommand } = require('@aws-sdk/client-s3');
const fs = require('fs');
const path = require('path');

const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
  }
});

class S3Service {

  async uploadFile(file, folder = 'images') {
    try {
      if (!file || !file.buffer) {
        throw new Error('File buffer not found');
      }

      const fileName = `${folder}/${Date.now()}-${file.originalname.replace(/\s+/g, '-')}`;

      const command = new PutObjectCommand({
        Bucket: process.env.AWS_S3_BUCKET,
        Key: fileName,
        Body: file.buffer,
        ContentType: file.mimetype
      });

      await s3Client.send(command);
      
      return `https://${process.env.AWS_S3_BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileName}`;

    } catch (error) {
      console.error('S3 Upload Error:', error);
      throw error;
    }
  }

  async deleteFile(fileUrl) {
    try {
      const bucketName = process.env.AWS_S3_BUCKET;
      const key = decodeURIComponent(
        fileUrl.split(`${bucketName}.s3.`)[1].split('/').slice(1).join('/')
      );

      const command = new DeleteObjectCommand({
        Bucket: bucketName,
        Key: key
      });

      await s3Client.send(command);

    } catch (error) {
      console.error('Error deleting file from S3:', error);
    }
  }
}

module.exports = new S3Service();
