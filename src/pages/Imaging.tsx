import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Image as ImageIcon, Loader } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link } from "react-router-dom";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";

const GEMINI_API_KEY = "AIzaSyCY_Gf50SSfWUiVsHV_cFzGECJZBF-OGuc";

// Helper to get HF API key from localStorage or prompt user
function getHuggingFaceKey() {
  return localStorage.getItem("HF_API_KEY") || "";
}

const Imaging = () => {
  const [prompt, setPrompt] = useState("");
  const [provider, setProvider] = useState<"gemini" | "huggingface">("gemini");
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hfApiKey, setHfApiKey] = useState(getHuggingFaceKey());

  const handleGenerateImage = async () => {
    setLoading(true);
    setError(null);
    setImageUrl(null);

    try {
      if (provider === "gemini") {
        // ------- UPDATED: using newer gemini-1.5-flash model --------
        const res = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`,
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
        let imgBase64;
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
            if (part.fileData && part.fileData.mimeType?.startsWith("image/")) {
              imgBase64 = `data:${part.fileData.mimeType};base64,${part.fileData.data}`;
              break;
            }
          }
        }
        if (imgBase64) {
          setImageUrl(imgBase64);
        } else if (data?.error?.message) {
          setError(`Gemini API error: ${data.error.message}`);
        } else {
          setError("No image was returned from Gemini AI. (This public API only supports images in vision models. If you see this a lot, try a newer model/key or contact support.)");
        }
      }
      if (provider === "huggingface") {
        if (!hfApiKey) {
          setError("Please add your HuggingFace API key to use this provider. You can get one at https://huggingface.co/settings/tokens");
          return;
        }
        // Save API key for future use
        localStorage.setItem("HF_API_KEY", hfApiKey);

        // Call HuggingFace Inference API: https://api-inference.huggingface.co/docs/python/html/index.html
        // for text-to-image
        const res = await fetch("https://api-inference.huggingface.co/models/black-forest-labs/FLUX.1-dev", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${hfApiKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            inputs: prompt,
            parameters: {
              // see: https://huggingface.co/docs/api-inference/detailed_parameters#image-to-image
            }
          }),
        });

        if (res.status === 503) {
          setError("The FLUX.1-dev model is loading on HuggingFace (cold start). Please retry in a moment.");
          return;
        }
        if (res.status === 401 || res.status === 403) {
          setError("Your HuggingFace API key is invalid or missing access. Please check the key and your account permissions.");
          return;
        }

        const contentType = res.headers.get("content-type");
        if (contentType && contentType.startsWith("image/")) {
          const blob = await res.blob();
          setImageUrl(URL.createObjectURL(blob));
        } else {
          const result = await res.json();
          if (result?.error) {
            setError(result.error || "HuggingFace returned an error.");
          } else {
            setError("No image returned from HuggingFace. Please check your API key and account limits.");
          }
        }
      }
    } catch (e: any) {
      setError(
        e?.message ||
        "An error occurred while generating the image. Double check your API keys are valid and try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center overflow-x-hidden">
      <Card className="max-w-xl w-full mx-auto p-8 flex flex-col items-center bg-white/10 backdrop-blur-lg border-white/20 shadow-2xl">
        <ImageIcon className="w-10 h-10 mb-4 text-purple-300" />
        <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">
          Imaging Playground
        </h1>
        <p className="text-lg text-gray-300 mb-3 text-center">
          This page lets you generate and transform images with AI.<br />
          <span className="text-purple-200">Powered by Gemini (Google AI) and HuggingFace FLUX</span>
        </p>
        <Button asChild variant="outline" className="mb-2 text-white border-white/30">
          <Link to="/">← Back to Home</Link>
        </Button>
        <div className="w-full mt-2 flex flex-col md:flex-row gap-2 mb-4 justify-center">
          <div className="flex-1">
            <label className="text-white text-sm">AI Provider</label>
            <Select
              value={provider}
              onValueChange={(v) => setProvider(v as "gemini" | "huggingface")}
            >
              <SelectTrigger className="w-full bg-white/10 border-white/20 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-background">
                <SelectItem value="gemini">Gemini (Google AI, built-in)</SelectItem>
                <SelectItem value="huggingface">HuggingFace FLUX.1-dev (requires key)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {provider === "huggingface" && (
            <div className="flex-1">
              <label className="text-white text-sm" htmlFor="hf-api-key">
                HuggingFace API Key
              </label>
              <Input
                id="hf-api-key"
                type="password"
                className="bg-white/10 border-white/20 text-white"
                value={hfApiKey}
                onChange={(e) => setHfApiKey(e.target.value)}
                placeholder="Paste your HuggingFace key"
                autoComplete="off"
              />
              <a
                className="text-xs text-purple-200 underline"
                href="https://huggingface.co/settings/tokens"
                target="_blank"
                rel="noopener noreferrer"
              >
                Get your HuggingFace access token
              </a>
            </div>
          )}
        </div>
        {/* AI IMAGE GENERATOR */}
        <div className="w-full mt-2">
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
              <div>
                <p className="text-sm text-red-400 bg-red-900/30 rounded p-2 mt-2">{error}</p>
                {provider === "gemini" && (
                  <div className="text-xs text-white/80 mt-1">
                    <b>Troubleshooting:</b> This can happen if the Gemini public API or model does not support image generation for your current API key.<br />
                    Try using a different provider, or check for updates at
                    <a 
                      href="https://ai.google.dev/gemini-api/docs"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="ml-1 text-purple-200 underline"
                    >Google Gemini API Docs</a>.
                  </div>
                )}
                {provider === "huggingface" && (
                  <div className="text-xs text-white/80 mt-1">
                    <b>Troubleshooting:</b> Ensure your HuggingFace API key is correct and you have access to FLUX.1-dev.<br />
                    <a 
                      href="https://huggingface.co/settings/tokens"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="ml-1 text-purple-200 underline"
                    >Get your HuggingFace API Key</a>.
                  </div>
                )}
              </div>
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
        {provider === "huggingface" && (
          <div className="mt-4 text-center text-xs text-blue-200 bg-slate-900/60 p-2 rounded">
            <b>Note:</b> The HuggingFace FLUX.1-dev model requires you to set your personal access token.<br />
            If you don't have an API key, <a className="underline" href="https://huggingface.co/settings/tokens" target="_blank" rel="noopener noreferrer">get it here</a>.<br />
            Please be aware of usage limits on the free tier.
          </div>
        )}
      </Card>
    </div>
  );
};

export default Imaging;
