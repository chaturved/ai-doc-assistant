"use client";

import { useState } from "react";
import BreadCrumb from "./components/BreadCrumb";
import MainQueryBar from "./components/MainQueryBar";
import CurrentQuestion, { Badge } from "./components/CurrentQuestion";
import AIAnswerCard from "./components/AIAnswerCard";
import Snippets from "./components/Snippets/Snippets";
import Sources, { Source } from "./components/Sources";
import Feedback from "./components/Feedback";
import sseApi from "@/lib/sseApi";
import { Snippet } from "./components/Snippets/SnippetCard";

export default function MainContent() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [description, setDescription] = useState("");
  const [badges, setBadges] = useState<Badge[]>([]);
  const [snippets, setSnippets] = useState<Snippet[]>([]);
  const [sources, setSources] = useState<Source[]>([]);
  const [isStreaming, setIsStreaming] = useState(false);

  const handleAsk = async (value: string) => {
    if (!value) return;

    setQuestion(value);
    setAnswer("");
    setDescription("");
    setSnippets([]);
    setSources([]);
    setBadges([]);
    setIsStreaming(true);

    try {
      await sseApi("/v1/query/ask", {
        method: "POST",
        body: JSON.stringify({ question: value }),

        onmessage(event) {
          if (event.data === "[DONE]") {
            setIsStreaming(false);
            return;
          }

          try {
            const parsed = JSON.parse(event.data);

            if (parsed.meta) {
              const meta = parsed.meta;
              setDescription(meta.description);
              setBadges(meta.badges);
              setSnippets(meta.snippets);
              setSources(meta.sources);
            }

            if (parsed.token) {
              setAnswer((prev) => prev + parsed.token);
            }
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
        items={[{ label: "Search", href: "#" }, { label: question || "Query" }]}
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
        question={question}
        description={description}
        badges={badges}
      />

      <AIAnswerCard answer={answer} isStreaming={isStreaming} />

      <Snippets snippets={snippets} />

      <Sources sources={sources} />

      <Feedback />
    </section>
  );
}
