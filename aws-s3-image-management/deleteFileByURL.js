// --Deleting file from bucket by fileurl

// -Install aws-sdk:
// Install the aws-sdk package, you can do so using
// npm install aws-sdk


// -Import the required functionalities
import AWS from 'aws-sdk';
import { S3Client,DeleteObjectCommand } from '@aws-sdk/client-s3';


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


// -Create a function
const deleteImageFromURL = async (filePath) => {
  const url = new URL(filePath);
  var objectKey = url.pathname.substring(1);
  // objectKey=convertPercentageToSpaces(objectKey)
  const deleteParams = {
    Bucket: 'your_bucket_name',
    Key: objectKey, // Full path including the folder structure
  };

  // Create an S3 delete instance for the file

  const fileDeletion = new DeleteObjectCommand(deleteParams);

  try {
    // Delete the file from S3
    console.log(objectKey)
    const data = await s3Client.send(fileDeletion);
    console.log("file deleted")
    return data;
  } catch (err) {
    console.error('Error deleting file from S3:', err);
    throw err;
  }


};