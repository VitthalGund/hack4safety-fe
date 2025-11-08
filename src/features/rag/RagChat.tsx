"use client"
import { useState, useRef, useEffect } from "react"
import type React from "react"

import { useRagQuery } from "@/api/apiHooks"
import { Send, Loader } from "lucide-react"

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: Date
}

interface RagChatProps {
  caseContext?: any
}

export const RagChat = ({ caseContext }: RagChatProps) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      content:
        "Hello! I am your AI legal assistant. Ask me questions about cases, law, evidence analysis, or legal strategy. I can provide insights based on case law and court precedents.",
      timestamp: new Date(),
    },
  ])
  const [input, setInput] = useState("")
  const { mutate: queryRag, isPending } = useRagQuery()
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim()) return

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")

    // Query RAG
    queryRag(
      { query: input, context: caseContext },
      {
        onSuccess: (response) => {
          const assistantMessage: Message = {
            id: (Date.now() + 1).toString(),
            role: "assistant",
            content: response.answer || response,
            timestamp: new Date(),
          }
          setMessages((prev) => [...prev, assistantMessage])
        },
        onError: () => {
          const errorMessage: Message = {
            id: (Date.now() + 1).toString(),
            role: "assistant",
            content: "I encountered an error processing your query. Please try again.",
            timestamp: new Date(),
          }
          setMessages((prev) => [...prev, errorMessage])
        },
      },
    )
  }

  return (
    <div className="flex flex-col h-full bg-card border border-border rounded-lg">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.map((message) => (
          <div key={message.id} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
            <div
              className={`max-w-xs lg:max-w-md px-4 py-3 rounded-lg ${
                message.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted text-foreground"
              }`}
            >
              <p className="text-sm">{message.content}</p>
              <p
                className={`text-xs mt-1 ${
                  message.role === "user" ? "text-primary-foreground/70" : "text-muted-foreground"
                }`}
              >
                {message.timestamp.toLocaleTimeString()}
              </p>
            </div>
          </div>
        ))}

        {isPending && (
          <div className="flex justify-start">
            <div className="bg-muted text-foreground px-4 py-3 rounded-lg flex items-center gap-2">
              <Loader size={16} className="animate-spin" />
              <span className="text-sm">Thinking...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="border-t border-border p-4">
        <form onSubmit={handleSendMessage} className="flex gap-3">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask a legal question..."
            disabled={isPending}
            className="flex-1 px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-foreground placeholder-muted-foreground disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={isPending || !input.trim()}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send size={18} />
          </button>
        </form>
      </div>
    </div>
  )
}
