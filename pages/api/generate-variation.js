import multer from 'multer';
import fs from 'fs';
import axios from 'axios';

const upload = multer({ dest: 'uploads/' });

export const config = {
  api: {
    bodyParser: false, // Disallow body parsing, consume as stream
  },
};

const handler = (req, res) => {
  upload.single('image')(req, res, async (err) => {
    if (err) {
      return res.status(500).json({ error: 'Error uploading file' });
    }

    const { file } = req;
    if (!file) {
      return res.status(400).json({ error: 'Image file is required' });
    }

    try {
      const response = await axios.post('https://api.openai.com/v1/images/variations', {
        image: fs.createReadStream(file.path),
        n: 1,
        size: "1024x1024"
      }, {
        headers: {
          'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
          'Content-Type': 'multipart/form-data'
        }
      });

      fs.unlinkSync(file.path); // Delete the file after processing
      const imageUrlVariation = response.data.data[0].url;
      res.status(200).json({ imageUrlVariation });
    } catch (error) {
      console.error('Error generating image variation:', error.response ? error.response.data : error.message);
      res.status(500).json({ error: 'Error generating image variation' });
    }
  });
};

export default handler;
