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
  apiKeys: APIKeys // this param can remain for compatibility, but OpenRouter will use internal key
): Promise<AIResponse> => {
  const provider = getProviderFromModel(model);

  // Always use this public key as default for Gemini regardless of user input.
  const DEFAULT_GEMINI_KEY = "AIzaSyCY_Gf50SSfWUiVsHV_cFzGECJZBF-OGuc";
  // Always use this key as default for OpenRouter regardless of user input.
  const DEFAULT_OPENROUTER_KEY = "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";
  const apiKey =
    provider === "google"
      ? DEFAULT_GEMINI_KEY
      : provider === "openrouter"
        ? DEFAULT_OPENROUTER_KEY
        : apiKeys[provider as keyof APIKeys];

  if (!apiKey || apiKey.trim() === "") {
    return {
      content: "",
      error: `Please configure your ${getProviderName(provider)} API key in the API Settings tab first.`
    };
  }

  if (!inputText || inputText.trim() === "") {
    return {
      content: "",
      error: "Please provide some input text to transform."
    };
  }

  try {
    console.log(`Calling ${provider} API with model ${model}`, { inputLength: inputText.length, framework, usedKey: apiKey.substring(0,8)+"..." });
    switch (provider) {
      case "openai":
        return await callOpenAI(inputText, framework, model, apiKey);
      case "anthropic":
        return await callAnthropic(inputText, framework, model, apiKey);
      case "google":
        return await callGoogle(inputText, framework, model, apiKey);
      case "openrouter":
        return await callOpenRouter(inputText, framework, model, apiKey);
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
  if (model.toLowerCase().includes('openrouter')) return 'openrouter';
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
    case 'openrouter': return 'OpenRouter';
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

  return `You are an expert prompt engineer. Transform the user's casual input into a well-structured, professional prompt using the ${framework} framework.

${framework} Framework: ${frameworkDescriptions[framework as keyof typeof frameworkDescriptions] || 'structured approach'}

Make the prompt:
- Clear and specific with actionable instructions
- Well-organized according to the ${framework} structure
- Professional yet engaging
- Optimized for AI interaction
- Include relevant context and examples where appropriate

Transform the input into a polished prompt that will get better AI results. Respond with ONLY the transformed prompt, no explanations or meta-commentary.`;
};

const callOpenAI = async (inputText: string, framework: string, model: string, apiKey: string): Promise<AIResponse> => {
  const modelName = model === 'gpt-4' ? 'gpt-4.1-2025-04-14' : 'gpt-3.5-turbo';
  
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
    let errorMessage = `OpenAI API error: ${response.status} ${response.statusText}`;
    
    if (errorData.error?.message) {
      errorMessage = errorData.error.message;
    } else if (response.status === 401) {
      errorMessage = "Invalid API key. Please check your OpenAI API key.";
    } else if (response.status === 429) {
      errorMessage = "Rate limit exceeded. Please try again later.";
    }
    
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
      model: 'claude-3-5-sonnet-20241022',
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
    let errorMessage = `Anthropic API error: ${response.status} ${response.statusText}`;
    
    if (errorData.error?.message) {
      errorMessage = errorData.error.message;
    } else if (response.status === 401) {
      errorMessage = "Invalid API key. Please check your Anthropic API key.";
    } else if (response.status === 429) {
      errorMessage = "Rate limit exceeded. Please try again later.";
    }
    
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
  // Use the Gemini completions endpoint: gemini-pro for text, but use the 1.5 models if the user has selected "gemini-1.5-flash" (future proofing).
  // For now, all model strings route to gemini-pro
  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`;
  const body = {
    contents: [{
      parts: [{
        text: `${createSystemPrompt(framework)}\n\nTransform this input: "${inputText}"`
      }]
    }],
    generationConfig: {
      maxOutputTokens: 1000,
      temperature: 0.7,
    }
  };

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    let errorMessage = `Google AI API error: ${response.status} ${response.statusText}`;
    
    if (errorData.error?.message) {
      errorMessage = errorData.error.message;
    } else if (response.status === 401 || response.status === 403) {
      errorMessage = "Invalid API key. Please check your Google AI API key.";
    } else if (response.status === 429) {
      errorMessage = "Rate limit exceeded. Please try again later.";
    }
    
    throw new Error(errorMessage);
  }

  const data = await response.json();
  let content: string | undefined = undefined;

  // Defensive: Try both official and parts paths.
  if (data?.candidates?.[0]?.content?.parts?.[0]?.text) {
    content = data.candidates[0].content.parts[0].text;
  } else if (data?.candidates?.[0]?.content?.text) {
    content = data.candidates[0].content.text;
  }

  if (!content || !content.trim()) {
    throw new Error("No content received from Google Gemini API. Make sure your prompt meets requirements and this key/model supports text completions. If problem persists, check https://ai.google.dev/gemini-api/docs/get-started for updated usage info.");
  }

  return { content: content.trim() };
};

const callOpenRouter = async (
  inputText: string,
  framework: string,
  model: string,
  apiKey: string
): Promise<AIResponse> => {
  // OpenRouter expects model to be fully qualified, e.g., "openrouter/mistralai-mixtral-8x7b"
  // But we let model pass through as-is.

  const reqBody = {
    model,
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
  };

  const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': 'https://your-app-domain.com', // Set a generic referer OR if your app has a domain, use it
      'X-Title': 'Prompt Transformer Service'
    },
    body: JSON.stringify(reqBody),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    let errorMessage = `OpenRouter API error: ${response.status} ${response.statusText}`;
    
    if (errorData.error?.message) {
      errorMessage = errorData.error.message;
    } else if (response.status === 401) {
      errorMessage = "Invalid API key. Please check the OpenRouter API key.";
    } else if (response.status === 429) {
      errorMessage = "Rate limit exceeded. Please try again later.";
    }
    
    throw new Error(errorMessage);
  }

  const data = await response.json();
  const content = data.choices?.[0]?.message?.content;

  if (!content) {
    throw new Error('No content received from OpenRouter API');
  }

  return { content: content.trim() };
};
