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
  Download,
  Copy,
  FileText,
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
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { toast } from "sonner";

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

  const handleExportMarkdown = (
    content: string,
    id: string,
    type: BotType = "cases"
  ) => {
    const blob = new Blob([content], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    const shortId = id.split("-")[0];
    a.download = `${type}-response-${shortId}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success("Markdown file saved!");
  };

  const handleCopy = (content: string) => {
    navigator.clipboard.writeText(content).then(
      () => {
        toast.success("Copied to clipboard!");
      },
      (err) => {
        console.error("Failed to copy:", err);
        toast.error("Failed to copy to clipboard.");
      }
    );
  };

  const handleSavePdf = async (id: string, type: BotType = "cases") => {
    const elementToCapture = document.getElementById(id);
    if (!elementToCapture) {
      console.error("Could not find element to save as PDF.");
      toast.error("Failed to save PDF: Element not found.");
      return;
    }

    try {
      const canvas = await html2canvas(elementToCapture, {
        useCORS: true,
        scale: 2,
        backgroundColor: document.body.classList.contains("dark")
          ? "#334155"
          : "#e2e8f0",
      });

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({
        orientation: "p",
        unit: "px",
        format: [canvas.width, canvas.height],
      });

      pdf.addImage(imgData, "PNG", 0, 0, canvas.width, canvas.height);
      const shortId = id.split("-")[0];
      pdf.save(`${type}-response-${shortId}.pdf`);
      toast.success("PDF file saved!"); // <-- Added feedback
    } catch (err) {
      console.error("Failed to save PDF:", err);
      toast.error("Failed to save PDF.");
    }
  };

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
      <Card className="flex-grow flex flex-col dark:border-slate-700 dark:bg-slate-800">
        <CardHeader className="flex flex-row items-center justify-between border-b rounded-none dark:border-slate-600">
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
                id={msg.id}
                className={`p-3 rounded-lg max-w-[70%] ${
                  msg.sender === "user"
                    ? "bg-indigo-600 text-white"
                    : "bg-slate-200 text-slate-900 dark:bg-slate-700 dark:text-white"
                }`}
              >
                {msg.sender === "bot" && (
                  <div className="flex justify-between items-center mb-2 -mt-1">
                    <span className="flex items-center gap-1.5 text-sm font-semibold opacity-70">
                      {msg.botType === "cases" ? (
                        <BrainCircuit className="w-4 h-4" />
                      ) : (
                        <Gavel className="w-4 h-4" />
                      )}
                      AI Assistant
                    </span>
                    <div className="flex items-center -mr-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 text-slate-600 dark:text-slate-300"
                        onClick={() => handleCopy(msg.text)}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 text-slate-600 dark:text-slate-300"
                        onClick={() => handleSavePdf(msg.id, msg.botType)}
                      >
                        <FileText className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 text-slate-600 dark:text-slate-300"
                        onClick={() =>
                          handleExportMarkdown(msg.text, msg.id, msg.botType)
                        }
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )}

                {msg.sender === "user" ? (
                  <div className="whitespace-pre-wrap">{msg.text}</div>
                ) : (
                  <div className="prose prose-sm dark:prose-invert max-w-none">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                      {msg.text}
                    </ReactMarkdown>
                  </div>
                )}
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
