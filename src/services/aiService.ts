
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

  if (!apiKey || apiKey.trim() === '') {
    return {
      content: "",
      error: `Please configure your ${getProviderName(provider)} API key in the API Settings tab first.`
    };
  }

  if (!inputText || inputText.trim() === '') {
    return {
      content: "",
      error: "Please provide some input text to transform."
    };
  }

  try {
    console.log(`Calling ${provider} API with model ${model}`);
    
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
    console.error('AI Service Error:', error);
    return {
      content: "",
      error: error instanceof Error ? error.message : "Unknown error occurred while calling AI API"
    };
  }
};

const getProviderFromModel = (model: string): string => {
  if (model.includes('gpt')) return 'openai';
  if (model.includes('claude')) return 'anthropic';
  if (model.includes('gemini')) return 'google';
  return 'openai';
};

const getProviderName = (provider: string): string => {
  switch (provider) {
    case 'openai': return 'OpenAI';
    case 'anthropic': return 'Anthropic';
    case 'google': return 'Google';
    default: return provider;
  }
};

const createSystemPrompt = (framework: string): string => {
  const frameworkDescriptions = {
    'CLEAR': 'Context, Length, Examples, Audience, Role - structure the prompt with clear context, specify desired length, provide examples, define the target audience, and establish the AI\'s role.',
    'STAR': 'Situation, Task, Action, Result - describe the situation, define the task, specify the action needed, and outline the expected result.',
    'STaC': 'Situation, Task, Context - briefly describe the situation, define the specific task, and provide relevant context.',
    'PEACH': 'Purpose, Examples, Audience, Context, Hope - state the purpose clearly, provide relevant examples, define the audience, give context, and express the hoped-for outcome.'
  };

  return `You are an expert prompt engineer. Transform the user's casual input into a well-structured, professional prompt using the ${framework} framework (${frameworkDescriptions[framework as keyof typeof frameworkDescriptions] || 'structured approach'}). 

Make the prompt:
- Clear and specific
- Actionable and detailed
- Well-organized according to the ${framework} structure
- Professional yet engaging
- Optimized for AI interaction

Respond with ONLY the transformed prompt, no explanations or meta-commentary.`;
};

const callOpenAI = async (inputText: string, framework: string, model: string, apiKey: string): Promise<AIResponse> => {
  const modelName = model === 'gpt-4' ? 'gpt-4' : 'gpt-3.5-turbo';
  
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: modelName,
      messages: [
        {
          role: 'system',
          content: createSystemPrompt(framework)
        },
        {
          role: 'user',
          content: `Transform this input: "${inputText}"`
        }
      ],
      max_tokens: 1000,
      temperature: 0.7,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const errorMessage = errorData.error?.message || `OpenAI API error: ${response.status} ${response.statusText}`;
    throw new Error(errorMessage);
  }

  const data = await response.json();
  const content = data.choices?.[0]?.message?.content;
  
  if (!content) {
    throw new Error('No content received from OpenAI API');
  }

  return { content: content.trim() };
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
          content: `${createSystemPrompt(framework)}\n\nTransform this input: "${inputText}"`
        }
      ],
    }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const errorMessage = errorData.error?.message || `Anthropic API error: ${response.status} ${response.statusText}`;
    throw new Error(errorMessage);
  }

  const data = await response.json();
  const content = data.content?.[0]?.text;
  
  if (!content) {
    throw new Error('No content received from Anthropic API');
  }

  return { content: content.trim() };
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
          text: `${createSystemPrompt(framework)}\n\nTransform this input: "${inputText}"`
        }]
      }],
      generationConfig: {
        maxOutputTokens: 1000,
        temperature: 0.7,
      }
    }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const errorMessage = errorData.error?.message || `Google AI API error: ${response.status} ${response.statusText}`;
    throw new Error(errorMessage);
  }

  const data = await response.json();
  const content = data.candidates?.[0]?.content?.parts?.[0]?.text;
  
  if (!content) {
    throw new Error('No content received from Google AI API');
  }

  return { content: content.trim() };
};
