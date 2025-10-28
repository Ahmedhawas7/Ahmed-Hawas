import { useState } from "react";
import { motion } from "framer-motion";
import { Send, Bot } from "lucide-react";

interface Message {
  sender: "user" | "bot";
  text: string;
}

export default function CarvChat() {
  const [messages, setMessages] = useState<Message[]>([
    { sender: "bot", text: "Welcome to CARV CHAT — your intelligent dev partner." }
  ]);
  const [input, setInput] = useState("");

  const sendMessage = async () => {
    if (!input.trim()) return;
    const newMessages = [...messages, { sender: "user", text: input }];
    setMessages(newMessages);
    setInput("");

    // Temporary response (AI connection will be added)
    setTimeout(() => {
      setMessages([
        ...newMessages,
        { sender: "bot", text: "Got it, Ahmed. I'm analyzing your project structure..." }
      ]);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-[#0b0b0f] text-white flex flex-col items-center p-4">
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-3xl font-bold mb-4 text-purple-400"
      >
        CARV CHAT
      </motion.h1>

      <div className="w-full max-w-2xl bg-[#14141a] rounded-2xl p-4 flex flex-col space-y-3 shadow-lg border border-purple-800/30">
        <div className="flex flex-col space-y-3 overflow-y-auto max-h-[70vh]">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`flex ${
                msg.sender === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`px-4 py-2 rounded-2xl max-w-[80%] ${
                  msg.sender === "user"
                    ? "bg-purple-600 text-white"
                    : "bg-[#1e1e26] text-purple-300"
                }`}
              >
                {msg.sender === "bot" && (
                  <Bot className="inline mr-2 w-4 h-4 text-purple-400" />
                )}
                {msg.text}
              </div>
            </div>
          ))}
        </div>

        <div className="flex items-center space-x-2 pt-3 border-t border-purple-800/40">
          <input
            type="text"
            placeholder="Type your message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-1 bg-transparent border border-purple-700 rounded-xl px-3 py-2 text-white focus:outline-none"
          />
          <button
            onClick={sendMessage}
            className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-xl flex items-center space-x-1"
          >
            <Send className="w-4 h-4" />
            <span>Send</span>
          </button>
        </div>
      </div>
    </div>
  );
}
