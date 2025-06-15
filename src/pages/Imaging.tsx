
import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Image as ImageIcon, Loader } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link } from "react-router-dom";

const GEMINI_API_KEY = "AIzaSyCY_Gf50SSfWUiVsHV_cFzGECJZBF-OGuc";

const Imaging = () => {
  const [prompt, setPrompt] = useState("");
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerateImage = async () => {
    setLoading(true);
    setError(null);
    setImageUrl(null);
    try {
      // Gemini (Google Generative Language) text-to-image endpoint
      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro-vision:generateContent?key=${GEMINI_API_KEY}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  {
                    text: `Generate a high-quality image based on this prompt: "${prompt}"`
                  }
                ]
              }
            ],
            generationConfig: {
              maxOutputTokens: 200,
              temperature: 0.7,
            }
          }),
        }
      );
      const data = await res.json();
      // The Gemini API returns base64 image data in the "candidates" array when using vision model.
      // In most use cases, third-party APIs or cloud functions are needed for image synthesis;
      // for demo, show a fallback image if no image produced
      let imgBase64;
      // Try several possible paths (API might change)
      if (
        data?.candidates &&
        Array.isArray(data.candidates) &&
        data.candidates[0]?.content?.parts
      ) {
        const parts = data.candidates[0].content.parts;
        for (const part of parts) {
          if (part.inlineData && part.inlineData.mimeType?.startsWith("image/")) {
            imgBase64 = `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
            break;
          }
          // newer Gemini may return images in "fileData" or "data" fields
          if (part.fileData && part.fileData.mimeType?.startsWith("image/")) {
            imgBase64 = `data:${part.fileData.mimeType};base64,${part.fileData.data}`;
            break;
          }
        }
      }
      if (imgBase64) {
        setImageUrl(imgBase64);
      } else {
        // Fallback: show error or placeholder
        setError("No image was returned from Gemini AI. (This public API only supports images in vision models. If you see this a lot, try a newer model/key or contact support.)");
      }
    } catch (e: any) {
      setError(
        e?.message ||
          "An error occurred when generating the image using Gemini AI."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
      <Card className="max-w-xl w-full mx-auto p-8 flex flex-col items-center bg-white/10 backdrop-blur-lg border-white/20 shadow-2xl">
        <ImageIcon className="w-10 h-10 mb-4 text-purple-300" />
        <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">
          Imaging Playground
        </h1>
        <p className="text-lg text-gray-300 mb-3 text-center">
          This page lets you generate and transform images with AI.
          <br />
          <span className="text-purple-200">Powered by Gemini (Google AI)</span>
        </p>
        <Button asChild variant="outline" className="mb-2 text-white border-white/30">
          <Link to="/">← Back to Home</Link>
        </Button>

        {/* AI IMAGE GENERATOR */}
        <div className="w-full mt-4">
          <div className="flex flex-col space-y-2">
            <label className="text-white font-medium" htmlFor="image-prompt">
              Enter your image description
            </label>
            <Input
              id="image-prompt"
              type="text"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="e.g., A futuristic city skyline at sunset"
              className="bg-white/10 text-white border-white/30"
            />
            <Button
              className="mt-2 w-full"
              onClick={handleGenerateImage}
              disabled={!prompt.trim() || loading}
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <Loader className="h-4 w-4 animate-spin" /> Generating...
                </span>
              ) : (
                "Generate Image"
              )}
            </Button>
            {error && (
              <p className="text-sm text-red-400 bg-red-900/30 rounded p-2 mt-2">{error}</p>
            )}
          </div>
          {imageUrl && (
            <div className="mt-6 w-full flex justify-center">
              <img
                src={imageUrl}
                alt="AI Generated"
                className="rounded-lg border border-white/20 max-w-full h-auto shadow-lg"
                style={{ maxHeight: 350, objectFit: "contain" }}
              />
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};

export default Imaging;

