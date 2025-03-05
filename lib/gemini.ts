import { GoogleGenerativeAI } from '@google/generative-ai';
    import { GEMINI_PROMPT } from './constants';

    interface GeminiResponse {
      text: string;
      error?: string;
    }

    export async function getGeminiResponse(
      input: string,
      imageBase64?: string,
    ): Promise<GeminiResponse> {
      try {
        const apiKey = process.env.NEXT_PUBLIC_VITE_GEMINI_API_KEY;
        // console.log("API Key:", apiKey);

        if (!apiKey) {
          throw new Error('Google Cloud API key is not configured');
        }

        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        let prompt = GEMINI_PROMPT.replace('{input}', input);

        const parts: Array<{ text: string } | { inlineData: { data: string, mimeType: string } }> = [{ text: prompt }];

        if (imageBase64) {
          console.log("Image base64 data:", imageBase64.substring(0, 20) + '...');
          if (imageBase64.length > 0) {
            parts.push({
              inlineData: {
                data: imageBase64,
                mimeType: "image/jpeg",
              }
            });
          } else {
            console.warn("Image data is empty, not sending image to Gemini API.");
          }
        }

        // The contents should include a role, which can typically be 'user' or 'system'
        const result = await model.generateContent({
          contents: [
            {
              role: 'user',  // You can set the role as 'user' or 'system' based on your use case
              parts: parts,
            }
          ],
        });

        const response = result.response;
        if (!response.text()) {
          throw new Error('No text response from Gemini API');
        }

        return {
          text: response.text()
        };
      } catch (error) {
        console.error('Error calling Gemini API:', error);
        return {
          text: '',
          error: 'Failed to get response from AI. Please try again.'
        };
      }
    }
