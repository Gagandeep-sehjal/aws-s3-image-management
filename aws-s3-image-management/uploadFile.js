// To upload a file to an AWS S3 bucket using Node.js, you can use the aws-sdk library, which is the official AWS SDK for JavaScript. Here's a step by step procedure:
// ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
// -Install aws-sdk:
// Install the aws-sdk package, you can do so using
// npm install aws-sdk


// -Import the required functionalities
import AWS from 'aws-sdk';
import { S3Client} from '@aws-sdk/client-s3';
import { Upload } from '@aws-sdk/lib-storage';
import { Readable } from 'stream';


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


// -Create a function uploadFileToS3
// -Uploading a file with a track of month and year

const uploadFileToS3 = async (file) => {
  const filedata = file.data;

//using function convertSpacesToUnderscore so to avoid saving filename with spaces
  const fileName = convertSpacesToUnderscore(file.name);

  // Get the current year and month
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth() + 1; // Months are zero-indexed

  console.log(currentDate);
  console.log("=== current date ====");
  console.log(currentYear);
  console.log("=== current year ====");

  // Define the folder structure in the S3 bucket
  const folderPath = `your_path/${currentYear}/${currentMonth}`;

  // Create a readable stream from the file data
  const bodyStream = Readable.from(filedata);

  // Set the S3 bucket parameters to create folders if they don't exist
  const folderCreationParams = {
    Bucket: 'your_bucket_name',
    Key: `${folderPath}/`, // Add a trailing slash to represent a folder
    Body: '', // Empty body to represent an empty object
  };

  // Create an S3 putObject instance for folder creation
  const folderCreationUpload = new Upload({
    client: s3Client,
    params: folderCreationParams,
  });

  try {
    // Attempt to create the folders (if they don't exist)
    await folderCreationUpload.done();
  } catch (err) {
    // Ignore errors if the folders already exist
    if (err.name !== 'NoSuchKey') {
      console.error('Error creating folders on S3:', err);
      throw err;
    }
  }

  // Set the S3 bucket parameters for the actual file upload
  const fileUploadParams = {
    Bucket: 'your_bucket_name',
    Key: `${folderPath}/${fileName}`, // Include the folder structure in the key
    Body: bodyStream,
    ContentType: file.mimetype,//setting content type
  };

  // Create an S3 upload instance for the file
  const fileUpload = new Upload({
    client: s3Client,
    params: fileUploadParams,
  });

  try {
    // Upload the file to S3
    const data = await fileUpload.done();
    return data;
  } catch (err) {
    console.error('Error uploading to S3:', err);
    throw err;
  }
};

