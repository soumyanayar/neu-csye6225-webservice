const fs = require("fs");
const S3 = require("aws-sdk/clients/s3");

class S3Provider {
  constructor(
    aws_access_key_id,
    aws_secret_access_key,
    aws_region,
    aws_s3_bucket_name
  ) {
    // S3 object without parameters
    this.s3 = new S3();
    this.bucket_name = aws_s3_bucket_name;
  }

  async uploadFile(file) {
    const fileStream = fs.createReadStream(file.path);

    const uploadParams = {
      Bucket: this.bucket_name,
      Body: fileStream,
      Key: file.filename,
    };

    return await this.s3.upload(uploadParams).promise();
  }

  async fileExists(fileName) {
    try {
      const params = {
        Bucket: this.bucket_name,
        Key: fileName,
      };

      return await this.s3.headObject(params).promise();
    } catch (err) {
      return false;
    }
  }

  async deleteFile(fileName) {
    const params = {
      Bucket: this.bucket_name,
      Key: fileName,
    };

    return await this.s3.deleteObject(params).promise();
  }
}

module.exports = S3Provider;
