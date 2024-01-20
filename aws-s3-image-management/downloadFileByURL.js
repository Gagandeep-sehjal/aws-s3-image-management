// -download file from aws s3 bucket

// -Install aws-sdk:
// Install the aws-sdk package, you can do so using
// npm install aws-sdk


// -Import the required functionalities
import AWS from 'aws-sdk';
import { S3Client,GetObjectCommand } from '@aws-sdk/client-s3';
import fs from 'fs';
import https from 'https';

// - Configure AWS SDK with your credentials and region
const s3Config={
  region: 'your-region', // e.g., us-east-1
  credentials:{
  accessKeyId: 'your-access-key-id',
  secretAccessKey: 'your-secret-access-key',
 } 
};


// -Create an S3 instance
const s3Client = new S3Client(s3Config);

const downloadImageFromURL = async (filePath) => {
  const url = new URL(filePath);
  const objectKey = url.pathname.substring(1);
  const filename = objectKey.split('/').pop();
  

  const downloadParams = {
    Bucket: 'your_bucket_name',
    Key: objectKey, // Full path including the folder structure
  };
  const localFilePath = `C:/Users/new/Downloads/${filename}`;


  const fileStream = fs.createWriteStream(localFilePath);

(async () => {
  try {
    const response = await s3Client.send(new GetObjectCommand(downloadParams));

    // Pipe the incoming stream (response.Body) to the file stream
    response.Body.pipe(fileStream);

    // Wait for the stream to finish writing
    await new Promise((resolve, reject) => {
      fileStream.on('finish', resolve);
      fileStream.on('error', reject);
    });

    console.log('Image downloaded and saved successfully!');
  } catch (error) {
    console.error('Error downloading image:', error.message);
  }
})(); 


};


