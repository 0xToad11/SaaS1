import AWS from 'aws-sdk';
import { v4 as uuidv4 } from 'uuid';

// Configure the AWS SDK
const s3 = new AWS.S3({
  apiVersion: '2006-03-01',
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.NEXT_PUBLIC_AWS_REGION,
  signatureVersion: 'v4',
});

export default function handler(req, res) {
  if (req.method === 'GET') {
    const { fileType } = req.query;
    const ex = fileType.split('/')[1];

    const Key = `${uuidv4()}.${ex}`;

    const s3Params = {
      Bucket: process.env.NEXT_PUBLIC_S3_BUCKET_NAME,
      Key,
      Expires: 60,
      ContentType: `image/${ex}`,
    };

    s3.getSignedUrl('putObject', s3Params, (err, uploadUrl) => {
      if (err) {
        console.log(err);
        res.status(500).send('An error occurred while generating the signed URL');
      } else {
        console.log('uploadUrl', uploadUrl);

        res.setHeader('Access-Control-Allow-Origin', '*'); // Adjust if needed
        res.setHeader('Access-Control-Allow-Methods', 'GET');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

        res.status(200).json({
          uploadUrl,
          key: Key,
        });
      }
    });
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

export const config = {
  api: {
    bodyParser: false, // Disallow body parsing, since we're using a GET request
  },
};
