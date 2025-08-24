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
      <BreadCrumb />
      <MainQueryBar />
      <CurrentQuestion />
      <AIAnswerCard />
      <Snippets />
      <Sources />
      <Feedback />
    </section>
  );
}
