/**
 * AI Service Module
 * Handles integration with Puter.js for AI functionality including text chat, image analysis, and image generation.
 */

// Types for AI service responses
export interface TextChatResponse {
  text: string;
  messageId: string;
}

export interface ImageAnalysisResponse {
  analysis: string;
  messageId: string;
}

export interface ImageGenerationResponse {
  imageUrl: string;
  messageId: string;
}

// Types for AI service requests
export interface TextChatRequest {
  message: string;
  conversationId?: string;
}

export interface ImageAnalysisRequest {
  imageFile: File;
  conversationId?: string;
}

export interface ImageGenerationRequest {
  prompt: string;
  conversationId?: string;
}

// Mock implementation for development purposes
// In a real implementation, this would connect to Puter.js or another AI service
class AIService {
  // Simulates a delay for API calls
  private simulateNetworkDelay(minMs = 1000, maxMs = 3000): Promise<void> {
    const delay = Math.floor(Math.random() * (maxMs - minMs + 1)) + minMs;
    return new Promise((resolve) => setTimeout(resolve, delay));
  }

  // Text chat functionality
  async sendTextChat(request: TextChatRequest): Promise<TextChatResponse> {
    await this.simulateNetworkDelay();

    // Simulate different responses based on input
    let responseText = "I'm an AI assistant. How can I help you today?";

    if (
      request.message.toLowerCase().includes("hello") ||
      request.message.toLowerCase().includes("hi")
    ) {
      responseText = "Hello! How can I assist you today?";
    } else if (request.message.toLowerCase().includes("help")) {
      responseText =
        "I'm here to help! You can ask me questions, request image analysis, or have me generate images based on your descriptions.";
    } else if (request.message.toLowerCase().includes("weather")) {
      responseText =
        "I don't have access to real-time weather data, but I can help you find a reliable weather service if you'd like.";
    } else if (request.message.toLowerCase().includes("thank")) {
      responseText =
        "You're welcome! Is there anything else I can help you with?";
    }

    return {
      text: responseText,
      messageId: `msg_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
    };
  }

  // Image analysis functionality
  async analyzeImage(
    request: ImageAnalysisRequest,
  ): Promise<ImageAnalysisResponse> {
    await this.simulateNetworkDelay(2000, 5000); // Image analysis takes longer

    // Mock analysis based on file name for demonstration
    const fileName = request.imageFile.name.toLowerCase();
    let analysis =
      "This appears to be an image. I can see various elements but without more context, it's difficult to provide specific details.";

    if (fileName.includes("cat") || fileName.includes("kitten")) {
      analysis =
        "This image shows a cat. It appears to be a domestic cat with fur. Cats are popular pets known for their independence and playful nature.";
    } else if (fileName.includes("dog") || fileName.includes("puppy")) {
      analysis =
        "This image contains a dog. Dogs are domesticated mammals and one of the most popular pets worldwide, known for their loyalty and companionship.";
    } else if (fileName.includes("landscape") || fileName.includes("nature")) {
      analysis =
        "This is a landscape image showing natural scenery. I can see elements of nature which may include mountains, trees, water, or sky.";
    } else if (fileName.includes("food") || fileName.includes("meal")) {
      analysis =
        "This image shows food. Food photography is popular for sharing culinary experiences and recipes.";
    }

    return {
      analysis,
      messageId: `img_analysis_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
    };
  }

  // Image generation functionality
  async generateImage(
    request: ImageGenerationRequest,
  ): Promise<ImageGenerationResponse> {
    await this.simulateNetworkDelay(3000, 6000); // Image generation takes even longer

    // For demonstration, return a placeholder image URL based on the prompt
    // In a real implementation, this would call a text-to-image AI service
    const prompt = request.prompt.toLowerCase();
    let imageUrl =
      "https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=600&q=80"; // Default abstract image

    if (prompt.includes("cat") || prompt.includes("kitten")) {
      imageUrl =
        "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=600&q=80";
    } else if (prompt.includes("dog") || prompt.includes("puppy")) {
      imageUrl =
        "https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=600&q=80";
    } else if (
      prompt.includes("landscape") ||
      prompt.includes("nature") ||
      prompt.includes("mountain")
    ) {
      imageUrl =
        "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=600&q=80";
    } else if (prompt.includes("city") || prompt.includes("urban")) {
      imageUrl =
        "https://images.unsplash.com/photo-1519501025264-65ba15a82390?w=600&q=80";
    } else if (
      prompt.includes("food") ||
      prompt.includes("meal") ||
      prompt.includes("dish")
    ) {
      imageUrl =
        "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&q=80";
    } else if (
      prompt.includes("space") ||
      prompt.includes("galaxy") ||
      prompt.includes("universe")
    ) {
      imageUrl =
        "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=600&q=80";
    } else if (
      prompt.includes("portrait") ||
      prompt.includes("person") ||
      prompt.includes("people")
    ) {
      imageUrl =
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&q=80";
    }

    return {
      imageUrl,
      messageId: `img_gen_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
    };
  }
}

// Export a singleton instance of the service
const aiService = new AIService();
export default aiService;
