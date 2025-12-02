// Hugging Face Inference API
// Using the free public inference API which has rate limits but works for testing
const HF_API_URL = 'https://api-inference.huggingface.co/models/HuggingFaceH4/zephyr-7b-beta'
// Fallback model if the first one is overloaded
const HF_FALLBACK_URL = 'https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.2'

// You can add VITE_HF_API_KEY to .env if you have one, otherwise it uses the public free tier (rate limited)
const API_KEY = import.meta.env.VITE_HF_API_KEY

/**
 * Call Hugging Face API
 */
const callHuggingFace = async (prompt, modelUrl = HF_API_URL) => {
    const headers = {
        'Content-Type': 'application/json',
    }

    if (API_KEY) {
        headers['Authorization'] = `Bearer ${API_KEY}`
    }

    // Format prompt for chat models (Zephyr/Mistral)
    const formattedPrompt = `<| system |>
    You are a nostalgic Orkut user from the mid - 2000s.You write short, casual scraps using 2000s internet slang and text emoticons.</s >
<| user |>
        ${prompt}</s >
<| assistant |> `

    try {
        const response = await fetch(modelUrl, {
            method: 'POST',
            headers,
            body: JSON.stringify({
                inputs: formattedPrompt,
                parameters: {
                    max_new_tokens: 150,
                    temperature: 0.8,
                    top_p: 0.9,
                    do_sample: true
                }
            })
        })

        if (!response.ok) {
            const errorText = await response.text()
            throw new Error(`HF API Error: ${response.status} ${response.statusText} - ${errorText}`)
        }

        const result = await response.json()

        // Handle different response formats
        if (Array.isArray(result) && result.length > 0) {
            let generatedText = result[0].generated_text || ''
            // Extract only the assistant's response if the full prompt is returned
            if (generatedText.includes('<|assistant|>')) {
                generatedText = generatedText.split('<|assistant|>')[1]
            }
            return generatedText.trim()
        } else if (result.generated_text) {
            return result.generated_text
        }

        return 'Cool scrap!' // Fallback
    } catch (error) {
        console.warn(`Error calling HF model ${modelUrl}:`, error)
        // If first model fails and we haven't tried fallback yet
        if (modelUrl === HF_API_URL) {
            console.log('Trying fallback model...')
            return callHuggingFace(prompt, HF_FALLBACK_URL)
        }
        throw error
    }
}

/**
 * Generate a nostalgic Orkut-style scrap message
 * @param {Object} options - Generation options
 * @param {string} options.senderName - Name of the person sending the scrap
 * @param {string} options.receiverName - Name of the person receiving the scrap
 * @param {string} options.style - Writing style (casual, friendly, nostalgic, funny, etc.)
 * @param {string} options.topic - Optional topic for the scrap
 * @param {Array} options.previousScraps - Optional array of previous scraps to learn style from
 * @returns {Promise<string>} Generated scrap message
 */
export const generateAIScrap = async ({
    senderName = 'Friend',
    receiverName = 'You',
    style = 'nostalgic',
    topic = '',
    previousScraps = []
}) => {
    try {
        console.log('Generating AI scrap with Hugging Face...')

        // Build context from previous scraps if available
        let styleContext = ''
        if (previousScraps.length > 0) {
            styleContext = `\nHere are some example scraps to match the writing style:\n${previousScraps.slice(0, 3).map(s => `- ${s}`).join('\n')}`
        }

        const prompt = `Write a short Orkut scrap message (max 2-3 sentences).
Sender: ${senderName}
Receiver: ${receiverName}
Style: ${style}
Topic: ${topic || 'general friendly message'}
${styleContext}

Instructions:
1. Use mid-2000s internet slang and text emoticons like :), :P, ^_^
2. Be friendly and nostalgic.
3. NO modern emojis.
4. Keep it short.

Write ONLY the scrap message:`

        const text = await callHuggingFace(prompt)
        console.log('AI scrap generated successfully:', text)

        // Clean up any potential artifacts
        let cleanText = text.replace(/^["']|["']$/g, '').trim()
        if (cleanText.includes('Write ONLY')) {
            cleanText = cleanText.split('Write ONLY')[0].trim()
        }

        return cleanText
    } catch (error) {
        console.error('Error generating AI scrap:', error)
        // Fallback to local generation if API fails completely
        const fallbacks = [
            `Hey ${receiverName}! Long time no see! How have you been? :)`,
            `Just stopping by to say hi! Your profile looks cool! ^_^`,
            `Hiii! Miss you! We should hang out soon! :P`,
            `Cool profile! Add me? :D`,
            `Have a great week! Rock on! \\m/`
        ]
        return fallbacks[Math.floor(Math.random() * fallbacks.length)]
    }
}

/**
 * Generate multiple scrap suggestions
 * @param {Object} options - Same as generateAIScrap
 * @param {number} count - Number of suggestions to generate (default: 3)
 * @returns {Promise<Array<string>>} Array of generated scraps
 */
export const generateScrapSuggestions = async (options, count = 3) => {
    try {
        // Generate sequentially to avoid rate limits on free tier
        const suggestions = []
        for (let i = 0; i < count; i++) {
            const scrap = await generateAIScrap(options)
            suggestions.push(scrap)
            // Small delay between requests
            if (i < count - 1) await new Promise(r => setTimeout(r, 500))
        }
        return suggestions
    } catch (error) {
        console.error('Error generating scrap suggestions:', error)
        // Return at least one fallback
        return [await generateAIScrap(options)]
    }
}

/**
 * Analyze writing style from previous scraps
 * @param {Array<string>} scraps - Array of previous scrap messages
 * @returns {Promise<string>} Description of the writing style
 */
export const analyzeWritingStyle = async (scraps) => {
    // Simplified analysis for now
    return "Nostalgic mid-2000s style with frequent emoticon usage."
}
