import Replicate from "replicate";

const replicate = new Replicate({
    auth: import.meta.env.REACT_APP_REPLICATE_API_TOKEN,

});

// Style mapping for your predefined style images
export const STYLE_IMAGES = {
    hollywood: `${window.location.origin}/ai-profile-styles/hollywood.jpg`,
    vaporwave: `${window.location.origin}/ai-profile-styles/vaporwave.jpg`,
    anime: `${window.location.origin}/ai-profile-styles/anime.jpg`,
    sketch: `${window.location.origin}/ai-profile-styles/sketch.jpg`
};

// Function to convert file to base64
export const fileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = (error) => reject(error);
    });
};

// Function to convert data URL to blob
export const dataURLtoBlob = (dataURL) => {
    const arr = dataURL.split(',');
    const mime = arr[0].match(/:(.*?);/)[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
    }
    return new Blob([u8arr], { type: mime });
};

// Main AI style transfer function
export const applyStyleTransfer = async (contentImageFile, style) => {
    try {
        console.log('Starting AI style transfer with style:', style);

        // Convert content image to base64
        const contentBase64 = await fileToBase64(contentImageFile);

        // Get style image URL
        const styleImageUrl = STYLE_IMAGES[style];
        if (!styleImageUrl) {
            throw new Error(`Style "${style}" not found`);
        }

        console.log('Content image prepared, style image:', styleImageUrl);

        const input = {
            content_image: contentBase64,
            style_image: styleImageUrl,
            width: 512,
            height: 512
        };

        console.log('Calling Replicate API...');

        const output = await replicate.run(
            "fofr/style-transfer:f1023890703bc0a5a3a2c21b5e498833be5f6ef6e70e9daf6b9b3a4fd8309cf0",
            { input }
        );

        console.log('Replicate API response:', output);

        // Convert the output to a usable image URL
        const outputUrl = output[0].url();

        // Fetch the image and convert to blob URL for preview
        const response = await fetch(outputUrl);
        const blob = await response.blob();
        const blobUrl = URL.createObjectURL(blob);

        return {
            success: true,
            imageUrl: blobUrl, // For preview
            originalUrl: outputUrl, // Original Replicate URL
            style: style
        };

    } catch (error) {
        console.error('AI Style Transfer Error:', error);
        throw new Error(`AI processing failed: ${error.message}`);
    }
};