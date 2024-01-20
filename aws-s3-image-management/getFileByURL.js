// --get file meta data information by file url

// -Install aws-sdk:
// Install the aws-sdk package, you can do so using
// npm install aws-sdk


// -Import the required functionalities
import AWS from 'aws-sdk';
import { S3Client,HeadObjectCommand } from '@aws-sdk/client-s3';


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

const getImageDetailsFromURL = async (imageUrl) => {
  try {
 
    const url = new URL(imageUrl);
    const bucketName = 'your_bucket_name'; // Replace with your S3 bucket name
    const objectKey = url.pathname.substring(1); // Removing leading '/'
    console.log(objectKey)

  
  //   // HeadObject request to get metadata
    const headObjectParams = {
      Bucket: bucketName,
      Key: objectKey,
    };

    const metadata = await s3Client.send(new HeadObjectCommand(headObjectParams));
    const sizeInBytes = metadata.ContentLength;
    const sizeInKB = Math.round(sizeInBytes / 1024);
    const contentType = metadata.ContentType;


  
    const storageProvider = 'Amazon S3'; // Assuming images are stored in Amazon S3
    const region = s3Config.region; // Replace with your S3 region
    const path = new URL(imageUrl).pathname;
    const access = 'public'; // Assuming the image is public, you may need to adjust this

    const dimensions = {
        width: metadata.Metadata['x-amz-meta-width'],
        height: metadata.Metadata['x-amz-meta-height'],
      };

    const urlSegments = imageUrl.split('/');
    const yearMonth = `${urlSegments[7]}/${urlSegments[6]}`;
    const filename = urlSegments[urlSegments.length - 1];
    const title = filename.replace(/\.[^/.]+$/, '');

    const bucket = ''; // Replace with your S3 bucket name

    

    return {
      yearMonth,
      modifiedTime,
      dimensions,
      bucket,
      filename,
      storageProvider,
      region,
      path,
      access,
      sizeInKB,
      contentType,
      title,
    };
  } catch (err) {
    // Handle specific errors or log them
    if (err.name === 'NotFound') {
      console.error('Image not found:', err);
      // Return or handle as needed
    } else if (err.name === 'Forbidden') {
      console.error('Access to the image is forbidden:', err);
      // Return or handle as needed
    } else {
      console.error('Error getting image details from URL:', err);
      throw err; // Rethrow other errors
    }
  }
};
