import { defineOperationApp } from "@directus/extensions-sdk";

export default defineOperationApp({
  id: "claude-auto-translate",
  name: "Claude Auto Translate",
  icon: "translate",
  description: "Automatically translate content using Claude 3.7 Sonnet",
  overview: ({ text, targetLanguages }) => [
    {
      label: "Text to translate",
      text: text?.toString() || "No text provided",
    },
    {
      label: "Target Languages",
      text: targetLanguages?.join(", ") || "No languages selected",
    },
  ],
  options: [
    {
      field: "text",
      name: "Text to Translate",
      type: "string",
      meta: {
        width: "full",
        interface: "input-multiline",
        note: "Enter the text content you want to translate",
      },
      required: true,
    },
    {
      field: "targetLanguages",
      name: "Target Languages",
      type: "json",
      meta: {
        width: "full",
        interface: "tags",
        options: {
          placeholder: "Add a language (e.g., Spanish, French, German)",
        },
        note: "Enter the languages you want to translate the text into",
      },
      required: true,
    },
    {
      field: "anthropicApiKey",
      name: "Anthropic API Key",
      type: "string",
      meta: {
        width: "full",
        interface: "input",
        options: {
          masked: true,
        },
        note: "Enter your Anthropic API key or leave blank to use the ANTHROPIC_API_KEY environment variable",
      },
    },
    {
      field: "model",
      name: "Claude Model",
      type: "string",
      schema: {
        default_value: "claude-3-sonnet-20240229",
      },
      meta: {
        width: "half",
        interface: "select-dropdown",
        options: {
          choices: [
            { text: "Claude 3 Sonnet", value: "claude-3-sonnet-20240229" },
            { text: "Claude 3 Opus", value: "claude-3-opus-20240229" },
            { text: "Claude 3 Haiku", value: "claude-3-haiku-20240307" },
          ],
        },
      },
    },
    {
      field: "rateLimit",
      name: "Rate Limit (ms)",
      type: "integer",
      schema: {
        default_value: 1000,
      },
      meta: {
        width: "half",
        interface: "input",
        note: "Delay between API calls in milliseconds to avoid rate limiting",
      },
    },
  ],
});
