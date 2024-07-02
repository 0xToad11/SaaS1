import AWS from 'aws-sdk';
import multer from 'multer';
import multerS3 from 'multer-s3';
import { v4 as uuidv4 } from 'uuid';
import axios from 'axios';
import supabase from '/config/supabaseConfig';

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: process.env.S3_BUCKET_NAME,
    key: function (req, file, cb) {
      cb(null, `uploads/${uuidv4()}_${file.originalname}`);
    },
  }),
});

export const config = {
  api: {
    bodyParser: false,
  },
};

const uploadMiddleware = upload.single('image');

const runMiddleware = (req, res, fn) => {
  return new Promise((resolve, reject) => {
    fn(req, res, (result) => {
      if (result instanceof Error) {
        return reject(result);
      }
      return resolve(result);
    });
  });
};

const handler = async (req, res) => {
  if (req.method === 'POST') {
    try {
      await runMiddleware(req, res, uploadMiddleware);

      const { file } = req;
      const { sessionId } = req.body;

      if (!file) {
        return res.status(400).json({ error: 'Image file is required' });
      }

      const s3ObjectUrl = file.location;

      const response = await axios.post('https://api.openai.com/v1/images/variations', {
        image: s3ObjectUrl,
        n: 1,
        size: '1024x1024',
      }, {
        headers: {
          'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
          'Content-Type': 'application/json',
        },
      });

      const imageUrlVariation = response.data.data[0].url;

      // Decrement credits locally
      const { data, error } = await supabase
        .from('SessionDB')
        .update({ credits: supabase.raw('credits - 1') })
        .eq('session_id', sessionId);

      if (error) {
        console.error('Error decrementing credits:', error);
      }

      res.status(200).json({ imageUrlVariation });
    } catch (error) {
      console.error('Error generating image variation:', error.response ? error.response.data : error.message);
      res.status(500).json({ error: 'Error generating image variation' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
};

export default handler;


// import AWS from 'aws-sdk';
// import multer from 'multer';
// import multerS3 from 'multer-s3';
// import fs from 'fs';
// import axios from 'axios';

// const upload = multer({ dest: 'uploads/' });

// export const config = {
//   api: {
//     bodyParser: false, // Disallow body parsing, consume as stream
//   },
// };

// const handler = (req, res) => {
//   upload.single('image')(req, res, async (err) => {
//     if (err) {
//       return res.status(500).json({ error: 'Error uploading file' });
//     }

//     const { file } = req;
//     if (!file) {
//       return res.status(400).json({ error: 'Image file is required' });
//     }

//     try {
//       const response = await axios.post('https://api.openai.com/v1/images/variations', {
//         image: fs.createReadStream(file.path),
//         n: 1,
//         size: "1024x1024"
//       }, {
//         headers: {
//           'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
//           'Content-Type': 'multipart/form-data'
//         }
//       });

//       fs.unlinkSync(file.path); // Delete the file after processing
//       const imageUrlVariation = response.data.data[0].url;
//       res.status(200).json({ imageUrlVariation });
//     } catch (error) {
//       console.error('Error generating image variation:', error.response ? error.response.data : error.message);
//       res.status(500).json({ error: 'Error generating image variation' });
//     }
//   });
// };

// export default handler;
