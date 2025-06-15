
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
  // Always use OpenRouter with the default key
  const DEFAULT_OPENROUTER_KEY = "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";

  if (!inputText || inputText.trim() === "") {
    return {
      content: "",
      error: "Please provide some input text to transform."
    };
  }

  try {
    console.log(`Calling OpenRouter API with model ${model}`, { inputLength: inputText.length, framework });
    return await callOpenRouter(inputText, framework, model, DEFAULT_OPENROUTER_KEY);
  } catch (error) {
    console.error('AI Service Error:', error);
    return {
      content: "",
      error: error instanceof Error ? error.message : "Unknown error occurred while calling AI API"
    };
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

const callOpenRouter = async (
  inputText: string,
  framework: string,
  model: string,
  apiKey: string
): Promise<AIResponse> => {
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
      'HTTP-Referer': 'https://your-app-domain.com',
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
