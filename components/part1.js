import { useState } from 'react';
import axios from 'axios';

export default function Part1() {
    const [prompt, setPrompt] = useState('');
    const [imageUrl, setImageUrl] = useState('');

    const [imageVariation, setImageVariation] = useState(null);
    const [imageUrlVariation, setImageUrlVariation] = useState('');

    const generateImage = async () => {
        try {
            const response = await axios.post('http://localhost:8000/api/generate-image', { prompt });
            console.log(response)
            setImageUrl(response.data.imageUrl);
        } catch (error) {
            console.error('Error generating image:', error);
        }
    };

    const handleImageChange = (e) => {
        setImageVariation(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!imageVariation) {
            alert('Please upload an image');
            return;
        }

        const formData = new FormData();
        formData.append('image', imageVariation);

        try {
            const response = await axios.post('http://localhost:8000/api/generate-variation', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            setImageUrlVariation(response.data.imageUrlVariation);
        } catch (error) {
            console.error('Error generating image variation:', error);
        }
    };

    return (
        <div>
            <h1>Generate Image with DALL-E</h1>
            <input
                type="text"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Enter prompt"
                className='text-black'
            />
            <button onClick={generateImage}>Generate</button>
            {imageUrl && <img src={imageUrl} alt="Generated" />}
            <div>
            <h1>Generate Image Variation with DALL-E</h1>
            <form onSubmit={handleSubmit}>
                <input type="file" accept="image/*" onChange={handleImageChange} />
                <button type="submit">Generate</button>
            </form>
            {imageUrlVariation && <img src={imageUrlVariation} alt="Generated Variation" />}
        </div>
        </div>
    );
}
