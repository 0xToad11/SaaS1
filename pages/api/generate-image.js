import axios from 'axios';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { prompt, model, size } = req.body;

  if (!prompt) {
    return res.status(400).json({ error: 'Prompt is required' });
  }

  try {
    const response = await axios.post('https://api.openai.com/v1/images/generations', {
      model,
      prompt,
      n: 1,
      size
    }, {
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json'
      }
    });

    const imageUrl = response.data.data[0].url;
    res.status(200).json({ imageUrl });
  } catch (error) {
    console.error('Error generating image:', error.response ? error.response.data : error.message);
    res.status(500).json({ error: 'Error generating image' });
  }
}
