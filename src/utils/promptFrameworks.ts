
export const transformPrompt = (inputText: string, framework: string, model: string): string => {
  if (!inputText || !framework || !model) {
    return "Please provide valid input text, framework, and model.";
  }

  const modelOptimizations = {
    "gpt-4": "Be specific and provide clear instructions. Use step-by-step reasoning.",
    "claude-3": "Be conversational and provide context. Ask for explanations when needed.",
    "gemini-pro": "Be concise and structured. Use bullet points when appropriate.",
    "gpt-3.5": "Be direct and avoid ambiguity. Provide examples when possible."
  };

  const frameworkTemplates = {
    CLEAR: generateCLEARPrompt,
    STAR: generateSTARPrompt,
    STaC: generateSTaCPrompt,
    PEACH: generatePEACHPrompt
  };

  const generator = frameworkTemplates[framework as keyof typeof frameworkTemplates];
  if (!generator) {
    return `Framework "${framework}" is not supported. Please select a valid framework.`;
  }

  const optimization = modelOptimizations[model as keyof typeof modelOptimizations] || "Provide clear and helpful responses.";
  
  try {
    return generator(inputText, model, optimization);
  } catch (error) {
    return `Error generating prompt: ${error instanceof Error ? error.message : 'Unknown error'}`;
  }
};

function generateCLEARPrompt(input: string, model: string, optimization: string): string {
  const context = extractContext(input);
  const intent = extractIntent(input);
  
  return `**Context:** ${context}

**Length:** Provide a comprehensive response with detailed explanations and practical examples.

**Examples:** Include specific, actionable examples that demonstrate the concepts clearly.

**Audience:** Target beginners who are new to this topic but eager to learn and implement practical solutions.

**Role:** Act as an expert educator and practical guide who can break down complex concepts into digestible, actionable steps.

**Task:** ${intent}

**Additional Instructions for ${model}:** ${optimization}

Please ensure your response is engaging, practical, and includes step-by-step guidance that a beginner can follow immediately.`;
}

function generateSTARPrompt(input: string, model: string, optimization: string): string {
  const situation = extractSituation(input);
  const task = extractIntent(input);
  
  return `**Situation:** ${situation}

**Task:** ${task}

**Action:** Please provide a detailed action plan that includes:
- Step-by-step instructions
- Best practices and tips
- Common pitfalls to avoid
- Resources for further learning

**Result:** The outcome should be a comprehensive guide that enables immediate implementation and long-term success.

**Optimized for ${model}:** ${optimization}`;
}

function generateSTaCPrompt(input: string, model: string, optimization: string): string {
  const situation = extractSituation(input);
  const task = extractIntent(input);
  const context = extractContext(input);
  
  return `**Situation:** ${situation}

**Task:** ${task}

**Context:** ${context}

**Instructions for ${model}:** ${optimization}

Please provide a focused, actionable response that directly addresses the task within the given context.`;
}

function generatePEACHPrompt(input: string, model: string, optimization: string): string {
  const purpose = extractIntent(input);
  const context = extractContext(input);
  
  return `**Purpose:** ${purpose}

**Examples:** Provide specific, real-world examples that illustrate key concepts and demonstrate practical application.

**Audience:** Beginners who are motivated to learn but need clear, accessible guidance without overwhelming technical jargon.

**Context:** ${context}

**Hope:** The desired outcome is to create content that not only educates but inspires action and builds confidence in the reader's ability to succeed.

**Optimized for ${model}:** ${optimization}

Please craft a response that is both informative and inspiring, with a tone that encourages and empowers the reader.`;
}

function extractContext(input: string): string {
  const lowercaseInput = input.toLowerCase();
  
  if (lowercaseInput.includes('beginner')) {
    return "Creating educational content for beginners who need clear, accessible guidance.";
  }
  if (lowercaseInput.includes('blog')) {
    return "Content creation for blog publishing with focus on reader engagement.";
  }
  if (lowercaseInput.includes('sustainable') || lowercaseInput.includes('gardening')) {
    return "Educational content about sustainable gardening practices and eco-friendly approaches.";
  }
  if (lowercaseInput.includes('business') || lowercaseInput.includes('marketing')) {
    return "Business and marketing content focused on practical implementation and results.";
  }
  if (lowercaseInput.includes('technical') || lowercaseInput.includes('code')) {
    return "Technical content that needs to be both accurate and accessible to the target audience.";
  }
  
  return "General content creation with focus on providing valuable, actionable information.";
}

function extractIntent(input: string): string {
  const lowercaseInput = input.toLowerCase();
  
  if (lowercaseInput.includes('write') && lowercaseInput.includes('blog')) {
    return "Create an engaging blog post that educates readers while maintaining an accessible and encouraging tone.";
  }
  if (lowercaseInput.includes('sustainable gardening')) {
    return "Develop comprehensive content about sustainable gardening that provides practical tips and encourages environmentally conscious practices.";
  }
  if (lowercaseInput.includes('explain') || lowercaseInput.includes('understand')) {
    return "Provide clear explanations that help readers understand complex concepts through simple, relatable examples.";
  }
  if (lowercaseInput.includes('guide') || lowercaseInput.includes('tutorial')) {
    return "Create a step-by-step guide that enables readers to successfully complete the described process.";
  }
  if (lowercaseInput.includes('improve') || lowercaseInput.includes('optimize')) {
    return "Provide actionable advice for improvement with specific strategies and measurable outcomes.";
  }
  
  return `Based on your input: "${input}", create comprehensive, actionable content that addresses the core request while providing valuable insights and practical guidance.`;
}

function extractSituation(input: string): string {
  const lowercaseInput = input.toLowerCase();
  
  if (lowercaseInput.includes('beginner')) {
    return "You need to create content for an audience that is new to the topic and requires foundational knowledge along with practical guidance.";
  }
  if (lowercaseInput.includes('problem') || lowercaseInput.includes('issue')) {
    return "You are addressing a specific problem that requires both understanding of the root cause and practical solutions.";
  }
  if (lowercaseInput.includes('improve') || lowercaseInput.includes('better')) {
    return "You are working to enhance existing knowledge or processes with proven strategies and best practices.";
  }
  
  return "You are tasked with creating informative content that balances educational value with practical applicability.";
}
