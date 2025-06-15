
interface APIKeys {
  openai: string;
  anthropic: string;
  google: string;
}

interface AIResponse {
  content: string;
  error?: string;
}

export const generatePromptWithAI = async (
  inputText: string,
  framework: string,
  model: string,
  apiKeys: APIKeys
): Promise<AIResponse> => {
  const provider = getProviderFromModel(model);
  const apiKey = apiKeys[provider as keyof APIKeys];

  if (!apiKey) {
    return {
      content: "",
      error: `Please configure your ${provider} API key first.`
    };
  }

  try {
    switch (provider) {
      case 'openai':
        return await callOpenAI(inputText, framework, model, apiKey);
      case 'anthropic':
        return await callAnthropic(inputText, framework, model, apiKey);
      case 'google':
        return await callGoogle(inputText, framework, model, apiKey);
      default:
        return {
          content: "",
          error: "Unsupported AI provider"
        };
    }
  } catch (error) {
    return {
      content: "",
      error: error instanceof Error ? error.message : "Unknown error occurred"
    };
  }
};

const getProviderFromModel = (model: string): string => {
  if (model.includes('gpt')) return 'openai';
  if (model.includes('claude')) return 'anthropic';
  if (model.includes('gemini')) return 'google';
  return 'openai'; // default
};

const callOpenAI = async (inputText: string, framework: string, model: string, apiKey: string): Promise<AIResponse> => {
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: model === 'gpt-4' ? 'gpt-4' : 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: `You are an expert prompt engineer. Transform the user's casual input into a well-structured prompt using the ${framework} framework. Be specific, clear, and actionable.`
        },
        {
          role: 'user',
          content: `Transform this casual idea into a structured prompt using the ${framework} framework: "${inputText}"`
        }
      ],
      max_tokens: 1000,
      temperature: 0.7,
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error?.message || 'OpenAI API error');
  }

  const data = await response.json();
  return {
    content: data.choices[0]?.message?.content || "No response generated"
  };
};

const callAnthropic = async (inputText: string, framework: string, model: string, apiKey: string): Promise<AIResponse> => {
  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'x-api-key': apiKey,
      'Content-Type': 'application/json',
      'anthropic-version': '2023-06-01'
    },
    body: JSON.stringify({
      model: 'claude-3-sonnet-20240229',
      max_tokens: 1000,
      messages: [
        {
          role: 'user',
          content: `You are an expert prompt engineer. Transform this casual idea: "${inputText}" into a well-structured prompt using the ${framework} framework. Be specific, clear, and actionable.`
        }
      ],
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error?.message || 'Anthropic API error');
  }

  const data = await response.json();
  return {
    content: data.content[0]?.text || "No response generated"
  };
};

const callGoogle = async (inputText: string, framework: string, model: string, apiKey: string): Promise<AIResponse> => {
  const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      contents: [{
        parts: [{
          text: `You are an expert prompt engineer. Transform this casual idea: "${inputText}" into a well-structured prompt using the ${framework} framework. Be specific, clear, and actionable.`
        }]
      }],
      generationConfig: {
        maxOutputTokens: 1000,
        temperature: 0.7,
      }
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error?.message || 'Google AI API error');
  }

  const data = await response.json();
  return {
    content: data.candidates[0]?.content?.parts[0]?.text || "No response generated"
  };
};
