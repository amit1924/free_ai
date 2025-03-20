import React from "react";
import ChatInterface from "./chat/ChatInterface";
import { Toaster } from "./ui/toaster";

const Home = () => {
  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-6xl">
        <header className="mb-8 text-center">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900">
            AI Assistant
          </h1>
          <p className="mt-2 text-lg text-gray-600">
            Chat with our AI assistant, analyze images, or generate new images
            from text prompts
          </p>
        </header>

        <main className="h-[700px] w-full overflow-hidden rounded-xl border border-gray-200 bg-white shadow-lg">
          <ChatInterface />
        </main>

        <footer className="mt-8 text-center text-sm text-gray-500">
          <p>Powered by advanced AI technology</p>
          <p className="mt-1">
            © {new Date().getFullYear()} AI Assistant. All rights reserved.
          </p>
        </footer>
      </div>

      {/* Toast notifications container */}
      <Toaster />
    </div>
  );
};

export default Home;
