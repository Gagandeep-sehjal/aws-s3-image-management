// To get a files from an AWS S3 bucket using Node.js, you can use the aws-sdk library and ListObjectsV2 Command , which is the official AWS SDK for JavaScript. Here's step by step procedure:
// --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------


// -Install aws-sdk:
// Install the aws-sdk package, you can do so using
// npm install aws-sdk


// -Import the required functionalities
import AWS from 'aws-sdk';
import { S3Client,ListObjectsV2Command } from '@aws-sdk/client-s3';


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

// -Create a function getAllFilesFromS3
// -You can filter the files by date & content type and can also search the file.
const getAllFilesFromS3 = async (month, year, contentType,search) => {
  try {
    const listObjectsParams = {
      Bucket: 'your_bucket_name',
    };

    const listObjectsCommand = new ListObjectsV2Command(listObjectsParams);
    const data = await s3Client.send(listObjectsCommand);

    // Extract the keys (file names) from the list of objects
    let filteredKeys = data.Contents.map(object => object.Key);

      // Filter out only the image files from the specified route
    filteredKeys = filteredKeys.filter(key =>
      key.startsWith('/path_name') &&
      /\.(jpg|jpeg|png|gif)$/i.test(key)
    );

    // Apply additional filters based on month and year if provided
    if (month && year) {
      filteredKeys = filteredKeys.filter(key => {
        const match = key.match(/\/(\d{4})\/(\d{2})\//);

        if (match) {
          const fileYear = parseInt(match[1], 10);
          const fileMonth = parseInt(match[2], 10);

          return fileYear === year && fileMonth === month;
        }

        return false;
      });
    }

    // Apply additional filter based on content type if provided
    if (contentType) {
      console.log(contentType)
      if(contentType== 'image'){
      filteredKeys = filteredKeys.filter(key =>
        key.startsWith('/pathname') &&
        /\.(jpg|jpeg|png|gif)$/i.test(key)
      );
      }
      else if (contentType === 'video') {
          filteredKeys = filteredKeys.filter(key =>
            key.startsWith('/pathname') &&
            /\.(mp4|avi|mov)$/i.test(key)
          );  
    }
    else{
      filteredKeys = filteredKeys.filter(key =>
        key.startsWith('/pathname') &&
        /\.(mp3|wav)$/i.test(key)
      );  
  }
}


if(search){
  const searchTerm = search.toLowerCase();
  console.log(search)
  filteredKeys = filteredKeys.filter(key => {
 
    const filename = key.split('/').pop().toLowerCase();
    console.log(filename)
    return filename.includes(searchTerm);
  });
}
    console.log("filtered keys");
    console.log(filteredKeys);

    return filteredKeys;
  } catch (err) {
    console.error('Error listing images in S3:', err);
    throw err;
  }
};

// - filterKeys will return the files successfully

