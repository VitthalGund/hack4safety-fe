"use client"
import { RagChat } from "./RagChat"
import { Lightbulb } from "lucide-react"

export const RagPage = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
          <Lightbulb size={24} />
          AI Legal Assistant
        </h1>
        <p className="text-muted-foreground mt-2">Ask questions about cases, law, and legal strategy</p>
      </div>

      {/* Chat */}
      <div className="h-screen md:h-96">
        <RagChat />
      </div>

      {/* Quick Prompts */}
      <div className="bg-card border border-border rounded-lg p-6">
        <h2 className="text-lg font-semibold text-foreground mb-4">Try asking about:</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {[
            "What are common acquittal reasons?",
            "How to strengthen evidence in heinous crimes?",
            "Precedents for similar cases",
            "Case timeline optimization",
            "Witness examination strategies",
            "Legal section interpretation",
          ].map((prompt, i) => (
            <button
              key={i}
              className="text-left p-3 bg-muted border border-border rounded-lg hover:border-primary transition-colors text-sm text-foreground hover:bg-muted/80"
            >
              {prompt}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
