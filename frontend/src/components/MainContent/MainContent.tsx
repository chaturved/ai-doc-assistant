"use client";

import { useState } from "react";

import BreadCrumb from "./components/BreadCrumb";
import MainQueryBar from "./components/MainQueryBar";
import CurrentQuestion from "./components/CurrentQuestion";
import AIAnswerCard from "./components/AIAnswerCard";
import Snippets from "./components/Snippets/Snippets";
import Sources from "./components/Sources";
import Feedback from "./components/Feedback";
import sseApi from "@/lib/sseApi";

export default function MainContent() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);

  const handleAsk = async (value: string) => {
    if (!value) return;

    setQuestion(value);
    setAnswer("");
    setIsStreaming(true);

    try {
      await sseApi("/v1/query/search", {
        method: "POST",
        body: JSON.stringify({ question: value }),

        onmessage(event) {
          if (event.data === "[DONE]") {
            setIsStreaming(false);
            return;
          }

          try {
            const parsed = JSON.parse(event.data);
            if (parsed.token) setAnswer((prev) => prev + parsed.token);
          } catch {
            setAnswer((prev) => prev + event.data);
          }
        },

        onerror(err) {
          console.error("SSE error:", err);
          setIsStreaming(false);
        },
      });
    } catch (err) {
      console.error("Fetch error:", err);
      setIsStreaming(false);
    }
  };

  return (
    <section className="col-span-12 lg:col-span-6 space-y-6">
      <BreadCrumb
        items={[{ label: "Search", href: "#" }, { label: "Query #3" }]}
      />

      <MainQueryBar
        placeholder="Ask me anything about your docs…"
        leftIcon="sparkles"
        buttons={{
          docs: {
            label: "Docs",
            icon: "filter",
            variant: "secondary",
            hiddenSm: true,
          },
          ask: {
            label: "Ask",
            icon: "send",
            variant: "primary",
            onClick: handleAsk,
          },
        }}
      />

      <CurrentQuestion
        question={question || "Your question will appear here"}
        description="Answered using your indexed documents with citations and snippet context."
        badges={[
          { label: "Synthesized answer", icon: "bot" },
          { label: "Private docs only", icon: "shield" },
          { label: isStreaming ? "Streaming…" : "Complete", icon: "waves" },
        ]}
      />

      <AIAnswerCard answer={answer} isStreaming={isStreaming} />

      <Snippets
        snippets={[
          {
            name: "api-reference.md",
            snippet:
              "To stream tokens, set stream: true and use Server-Sent Events. The server should flush data using 'data: {json}\\n\\n' format...",
            icon: "code",
          },
        ]}
      />

      <Sources
        sources={[
          {
            name: "api-reference.md",
            quote:
              "Use text/event-stream and flush lines prefixed by data:. Emit [DONE] when complete for cleanup.",
            icon: "code",
          },
        ]}
      />

      <Feedback />
    </section>
  );
}
