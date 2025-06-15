
import React from "react";
import { Card } from "@/components/ui/card";
import { Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Imaging = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
      <Card className="max-w-xl w-full mx-auto p-8 flex flex-col items-center bg-white/10 backdrop-blur-lg border-white/20 shadow-2xl">
        <ImageIcon className="w-10 h-10 mb-4 text-purple-300" />
        <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">
          Imaging Playground
        </h1>
        <p className="text-lg text-gray-300 mb-6 text-center">
          This page will let you generate and transform images with AI.
        </p>
        <Button asChild variant="outline" className="mb-2 text-white border-white/30">
          <Link to="/">← Back to Home</Link>
        </Button>
        {/* You can add your image tools/components here */}
      </Card>
    </div>
  );
};

export default Imaging;
