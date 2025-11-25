import dotenv from 'dotenv';
dotenv.config();

async function listModels() {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
        console.error('GEMINI_API_KEY is not set');
        return;
    }

    const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;

    try {
        const response = await fetch(url);
        const data = await response.json();

        if (data.error) {
            console.error('Error listing models:', data.error);
        } else {
            console.log('Available Models:');
            data.models?.forEach((model: any) => {
                console.log(`- ${model.name} (Supported methods: ${model.supportedGenerationMethods?.join(', ')})`);
            });
        }
    } catch (error) {
        console.error('Failed to fetch models:', error);
    }
}

listModels();
