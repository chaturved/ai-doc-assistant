"use client";

import { useState } from "react";
import BreadCrumb from "./components/bread-crumb";
import MainQueryBar from "./components/main-query-bar";
import CurrentQuestion, { Badge } from "./components/current-question";
import AIAnswerCard from "./components/ai-answer-card";
import Snippets from "./components/snippets/snippets";
import Sources, { Source } from "./components/sources";
import Feedback from "./components/feedback";
import { sseClient } from "@/lib/api-client";
import { Snippet } from "./components/snippets/snippet-card";

export default function Workspace() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [description, setDescription] = useState("");
  const [badges, setBadges] = useState<Badge[]>([]);
  const [snippets, setSnippets] = useState<Snippet[]>([]);
  const [sources, setSources] = useState<Source[]>([]);

  const handleAsk = async (value: string) => {
    if (!value) return;

    setQuestion(value);
    setAnswer("Awaiting response...");
    setDescription("");
    setSnippets([]);
    setSources([]);
    setBadges([]);

    try {
      await sseClient("/v1/query/ask", {
        method: "POST",
        body: JSON.stringify({ question: value }),

        onmessage(event) {
          if (event.data === "[DONE]") {
            return;
          }

          try {
            const parsed = JSON.parse(event.data);

            if (parsed.meta) {
              const meta = parsed.meta;
              setAnswer("");
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
        },
      });
    } catch (err) {
      console.error("Fetch error:", err);
    }
  };

  return (
    <section className="col-span-12 lg:col-span-6 space-y-6">
      {question && (
        <BreadCrumb
          items={[{ label: "Search", href: "#" }, { label: "Query" }]}
        />
      )}

      <div
        className={`${
          !question ? "flex justify-center items-center h-[60vh]" : ""
        }`}
      >
        <div className={`${!question ? "w-full max-w-3xl px-4" : ""}`}>
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
        </div>
      </div>

      {question && (
        <CurrentQuestion
          question={question}
          description={description}
          badges={badges}
        />
      )}

      {question && <AIAnswerCard answer={answer} />}

      {question && <Snippets snippets={snippets} />}

      {question && <Sources sources={sources} />}

      {question && <Feedback />}
    </section>
  );
}
