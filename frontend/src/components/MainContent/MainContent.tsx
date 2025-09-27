"use client";

import BreadCrumb from "./components/BreadCrumb";
import MainQueryBar from "./components/MainQueryBar";
import CurrentQuestion from "./components/CurrentQuestion";
import AIAnswerCard from "./components/AIAnswerCard";
import Snippets from "./components/Snippets/Snippets";
import Sources from "./components/Sources";
import Feedback from "./components/Feedback";

export default function MainContent() {
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
          ask: { label: "Ask", icon: "send", variant: "primary" },
        }}
      />
      <CurrentQuestion
        question="How do I stream server-sent events in JavaScript?"
        description="Answered using your indexed documents with citations and snippet context."
        badges={[
          { label: "Synthesized answer", icon: "bot" },
          { label: "Private docs only", icon: "shield" },
          { label: "Streaming", icon: "waves" },
        ]}
      />
      <AIAnswerCard
        answer={[
          "Use the EventSource API to open a unidirectional connection.",
          "Emit text/event-stream with lines prefixed by 'data:'.",
          "Prefer eventsource-parser in Node to handle fragmented chunks.",
          "Always close the stream on [DONE] and surface citations.",
        ]}
      />
      <Snippets
        snippets={[
          {
            name: "api-reference.md",
            snippet:
              "To stream tokens, set stream: true and use Server-Sent Events. The server should flush data using “data: {json}\n\n” format...",
            icon: "code",
          },
          {
            name: "Onboarding Guide.pdf",
            snippet:
              "The client subscribes via EventSource(url). Handle message and error events, and close the connection when “[DONE]” is received...",
            icon: "text",
          },
          {
            name: "endpoints.csv",
            snippet:
              "/v1/answers — supports stream responses via text/event-stream and emits token and citation events for UI rendering...",
            icon: "table",
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
          {
            name: "Onboarding Guide.pdf",
            quote:
              "The client should listen to message events and append text incrementally to the UI.",
            icon: "text",
          },
        ]}
      />
      <Feedback />
    </section>
  );
}
