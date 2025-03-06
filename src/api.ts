import { defineOperationApi } from "@directus/extensions-sdk";
import { Anthropic } from "@anthropic-ai/sdk";

type Options = {
  text: string;
  targetLanguages: string[];
  anthropicApiKey: string;
  model: string;
  rateLimit: number;
};

export default defineOperationApi<Options>({
  id: "claude-auto-translate",
  handler: async ({
    text,
    targetLanguages,
    anthropicApiKey,
    model,
    rateLimit,
  }) => {
    if (!text || !targetLanguages || targetLanguages.length === 0) {
      throw new Error("Missing required fields: text or targetLanguages");
    }

    const anthropic = new Anthropic({
      apiKey: anthropicApiKey || process.env.ANTHROPIC_API_KEY,
    });

    // Process translations
    const translations = {};

    // Use Promise.all to run translations in parallel, but with rate limiting
    for (const language of targetLanguages) {
      try {
        // Wait for rate limit before processing next translation
        await new Promise((resolve) => setTimeout(resolve, rateLimit));

        // Request translation from Claude
        const message = await anthropic.messages.create({
          model: model || "claude-3-sonnet-20240229",
          max_tokens: 4000,
          messages: [
            {
              role: "user",
              content: `Translate the following content into ${language}. Only return the translated text without any explanations or additional comments. Original text: ${text}`,
            },
          ],
        });

        // Extract the translation from Claude's response
        const translatedText = message.content[0].text;
        translations[language] = translatedText;

        console.log(`Successfully translated content to ${language}`);
      } catch (error) {
        console.error(`Error translating to ${language}:`, error);
        translations[language] = `Error: ${error.message}`;
      }
    }

    return translations;
  },
});
