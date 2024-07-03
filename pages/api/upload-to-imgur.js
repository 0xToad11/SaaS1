import axios from 'axios';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { imageBase64 } = req.body;

  try {
    const response = await axios.post(
      'https://api.imgur.com/3/image',
      { image: imageBase64 },
      {
        headers: {
          Authorization: `Client-ID ${process.env.NEXT_PUBLIC_IMGUR_CLIENT_ID}`,
        },
      }
    );

    if (response.data.success) {
      return res.status(200).json({ imageUrl: response.data.data.link });
    } else {
      return res.status(500).json({ message: 'Failed to upload image to Imgur' });
    }
  } catch (error) {
    console.error('Error uploading to Imgur:', error);
    return res.status(500).json({ message: 'Error uploading to Imgur' });
  }
}
