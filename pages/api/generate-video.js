import fetch from 'node-fetch';
import fs from 'fs';
import { LumaAI } from 'lumaai';
import path from 'path';

const client = new LumaAI({ authToken: process.env.LUMAAI_API_KEY });

export default async function handler(req, res) {
    // Only allow POST requests
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    const { prompt } = req.body; // Get the prompt from the request body

    if (!prompt) {
        return res.status(400).json({ message: 'Prompt is required' });
    }

    try {
        let generation = await client.generations.create({
            prompt: prompt  // Use the prompt from the request
        });

        let completed = false;

        // Poll the API to check the state of the video generation
        while (!completed) {
            generation = await client.generations.get(generation.id);

            if (generation.state === 'completed') {
                completed = true;
            } else if (generation.state === 'failed') {
                throw new Error(`Generation failed: ${generation.failure_reason}`);
            } else {
                console.log('Dreaming...');
                await new Promise((r) => setTimeout(r, 3000)); // Wait for 3 seconds
            }
        }

        const videoUrl = generation.assets.video;
        const tempFilePath = path.join('/tmp', `${generation.id}.mp4`);

        // Optional: Download the video to the server (comment out if not needed)
        const response = await fetch(videoUrl);
        const fileStream = fs.createWriteStream(tempFilePath);
        await new Promise((resolve, reject) => {
            response.body.pipe(fileStream);
            response.body.on('error', reject);
            fileStream.on('finish', resolve);
        });

        console.log(`File downloaded as ${tempFilePath}`);

        // Respond with the video URL or path
        res.status(200).json({ videoUrl });
    } catch (error) {
        console.error('Error generating video:', error);
        res.status(500).json({ message: 'Error generating video', error: error.message });
    }
}
