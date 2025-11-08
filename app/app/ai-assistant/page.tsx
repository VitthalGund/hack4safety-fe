"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  AlertCircle,
  Bot,
  BrainCircuit,
  Gavel,
  Loader2,
  Send,
  User,
} from "lucide-react";
import { askCaseBot, askLegalBot } from "@/lib/api-services";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Image from "next/image";

type BotType = "cases" | "legal";

interface Message {
  id: string;
  sender: "user" | "bot";
  text: string;
  botType?: BotType;
}

export default function AiAssistantPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [botType, setBotType] = useState<BotType>("cases");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input || loading) return;

    const userMessage: Message = {
      id: crypto.randomUUID(),
      sender: "user",
      text: input,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);
    setError(null);

    try {
      const apiCall = botType === "cases" ? askCaseBot : askLegalBot;
      const response = await apiCall(input);

      const botMessage: Message = {
        id: crypto.randomUUID(),
        sender: "bot",
        text: response.data.answer || "No response from AI.",
        botType: botType,
      };
      setMessages((prev) => [...prev, botMessage]);
    } catch (err) {
      console.error("AI query failed:", err);
      const errorText =
        err instanceof Error ? err.message : "An unknown error occurred.";
      setError(errorText);
      const errorMessage: Message = {
        id: crypto.randomUUID(),
        sender: "bot",
        text: `Error: ${errorText}`,
        botType: botType,
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="h-full flex flex-col"
    >
      <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-6">
        AI Assistant
      </h1>

      <Card className="flex-grow flex flex-col dark:border-slate-700 dark:bg-slate-800">
        <CardHeader className="flex flex-row items-center justify-between border-b dark:border-slate-600">
          <CardTitle className="flex items-center gap-2">
            {botType === "cases" ? (
              <>
                <BrainCircuit className="w-6 h-6 text-indigo-500" />
                Case Data Analyst
              </>
            ) : (
              <>
                <Gavel className="w-6 h-6 text-indigo-500" />
                Legal Bot
              </>
            )}
          </CardTitle>
          <Select
            value={botType}
            onValueChange={(value) => setBotType(value as BotType)}
            disabled={loading}
          >
            <SelectTrigger className="w-[180px] dark:bg-slate-700 dark:border-slate-600">
              <SelectValue placeholder="Select Bot" />
            </SelectTrigger>
            <SelectContent className="dark:bg-slate-700">
              <SelectItem value="cases">Case Analyst</SelectItem>
              <SelectItem value="legal">Legal Bot</SelectItem>
            </SelectContent>
          </Select>
        </CardHeader>

        <CardContent className="flex-grow p-6 space-y-4 overflow-y-auto">
          {messages.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full text-slate-500 dark:text-slate-400">
              <Bot className="w-16 h-16 mb-4" />
              <p className="text-lg">
                {botType === "cases"
                  ? "Ask questions about case files, trends, or officer performance."
                  : "Ask questions about IPC, CrPC, or other Indian laws."}
              </p>
              <p className="text-sm">
                AI responses may be inaccurate. Verify all information.
              </p>
            </div>
          )}

          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex gap-3 ${
                msg.sender === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`p-3 rounded-lg max-w-[70%] ${
                  msg.sender === "user"
                    ? "bg-indigo-600 text-white"
                    : "bg-slate-200 text-slate-900 dark:bg-slate-700 dark:text-white"
                }`}
              >
                <div
                  className="prose prose-sm dark:prose-invert max-w-none"
                  dangerouslySetInnerHTML={{
                    __html: msg.text.replace(/\n/g, "<br />"),
                  }}
                />
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex justify-start gap-3">
              <div className="p-3 rounded-lg bg-slate-200 dark:bg-slate-700">
                <Loader2 className="w-5 h-5 animate-spin text-slate-600 dark:text-slate-300" />
              </div>
            </div>
          )}

          {error && (
            <Card className="p-4 border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-950/30">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
                <p className="text-sm text-red-600 dark:text-red-400">
                  {error}
                </p>
              </div>
            </Card>
          )}
        </CardContent>

        <div className="p-4 border-t dark:border-slate-600">
          <form onSubmit={handleSubmit} className="flex gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask the AI assistant..."
              className="dark:bg-slate-700 dark:border-slate-600"
              disabled={loading}
            />
            <Button type="submit" disabled={loading || !input}>
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
            </Button>
          </form>
        </div>
      </Card>
    </motion.div>
  );
}
