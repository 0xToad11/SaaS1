import axios from 'axios';
import FormData from 'form-data';
import fetch from 'node-fetch';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { imageUrl } = req.body;

    try {
      const response = await axios.get(imageUrl, {
        responseType: 'arraybuffer'
      });
      const imageBuffer = Buffer.from(response.data, 'binary');

      const formData = new FormData();
      formData.append('image', imageBuffer, {
        contentType: 'image/png',
        filename: 'image.png',
      });
      formData.append('n', '1');
      formData.append('size', '1024x1024');

      const openaiResponse = await fetch('https://api.openai.com/v1/images/variations', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
          ...formData.getHeaders()
        },
        body: formData
      });

      if (!openaiResponse.ok) {
        const errorData = await openaiResponse.json();
        throw new Error(errorData.error.message);
      }

      const result = await openaiResponse.json();
      const variationUrl = result.data[0].url;

      res.status(200).json({ variationUrl });
    } catch (error) {
      console.error('Error generating image variation:', error.message);
      res.status(500).json({ error: 'Error generating image variation' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
