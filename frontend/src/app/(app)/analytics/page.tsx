"use client";

import { useEffect, useState } from "react";
import { MessageSquare, FileText, Layers, Star } from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell,
} from "recharts";
import {
  getOverview, getQueryVolume, getTopCitations,
  type AnalyticsOverview, type QueryVolumePoint, type CitedDoc,
} from "@/lib/api/analytics";

function StatCard({ icon, label, value, sub }: {
  icon: React.ReactNode; label: string; value: string | number; sub?: string;
}) {
  return (
    <div className="card p-5 flex flex-col gap-3">
      <div className="flex items-center gap-1.5 text-[11px] font-bold text-accent uppercase tracking-[0.08em]">
        {icon} {label}
      </div>
      <div className="text-[32px] font-display font-medium leading-none tracking-tight text-ink">{value}</div>
      {sub && <p className="text-xs text-muted">{sub}</p>}
    </div>
  );
}

const ChartTooltip = ({ active, payload, label }: { active?: boolean; payload?: { value: number; name: string }[]; label?: string }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="card px-3 py-2 text-xs">
      <p className="text-muted mb-0.5">{label}</p>
      <p className="font-bold text-ink">
        {payload[0].value} {payload[0].name === "count" ? "queries" : "citations"}
      </p>
    </div>
  );
};

export default function AnalyticsPage() {
  const [overview, setOverview] = useState<AnalyticsOverview | null>(null);
  const [volume, setVolume] = useState<QueryVolumePoint[]>([]);
  const [citations, setCitations] = useState<CitedDoc[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getOverview(), getQueryVolume(30), getTopCitations()])
      .then(([ov, vol, cit]) => { setOverview(ov); setVolume(vol); setCitations(cit); })
      .finally(() => setLoading(false));
  }, []);

  const qualityData = overview
    ? [{ name: "up", value: overview.thumbs_up }, { name: "down", value: overview.thumbs_down }]
    : [];
  const hasQuality = (overview?.thumbs_up ?? 0) + (overview?.thumbs_down ?? 0) > 0;

  return (
      <main className="thin-scroll relative flex min-w-0 flex-1 flex-col overflow-y-auto rounded-lg border border-ink/10 bg-bg">
        <div className="relative z-10 mx-auto w-full max-w-4xl px-4 py-7 sm:px-8 sm:py-10">

        <p className="section-label mb-2">Overview</p>
        <h1 className="mb-8 font-display text-[32px] font-medium tracking-[-0.03em] text-ink">Analytics</h1>

        {/* Stat cards */}
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="card p-5 h-[108px]">
                <div className="h-2.5 w-16 rounded-full shimmer-line mb-4" />
                <div className="h-8 w-12 rounded-lg shimmer-line" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10 animate-fu">
            <StatCard icon={<MessageSquare size={11} />} label="Total Queries"
              value={overview?.total_queries ?? 0}
              sub={`${overview?.queries_last_30d ?? 0} in last 30 days`} />
            <StatCard icon={<FileText size={11} />} label="Documents"
              value={overview?.total_docs ?? 0} />
            <StatCard icon={<Layers size={11} />} label="Chunks Indexed"
              value={(overview?.total_chunks ?? 0).toLocaleString()} />
            <StatCard icon={<Star size={11} />} label="Quality Score"
              value={overview?.quality_pct != null ? `${overview.quality_pct}%` : "—"}
              sub={hasQuality ? `${overview?.thumbs_up} up · ${overview?.thumbs_down} down` : "No feedback yet"} />
          </div>
        )}

        {/* Query Volume */}
        <div className="mb-10">
          <p className="text-[15px] font-bold mb-[6px]">Query Volume</p>
          <p className="text-[13px] text-muted mb-4">Queries per day over the last 30 days</p>
          {loading ? (
            <div className="card p-5 h-[240px]">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-2.5 rounded-full shimmer-line mb-3" style={{ width: `${[90, 70, 80][i]}%` }} />
              ))}
            </div>
          ) : volume.length === 0 ? (
            <div className="card p-8 flex items-center justify-center text-sm text-ink/40 h-[200px]">
              No queries yet
            </div>
          ) : (
            <div className="card p-5">
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={volume} barSize={10}>
                  <XAxis dataKey="date" tick={{ fontSize: 10, fill: "var(--color-ink)", opacity: 0.45 }}
                    tickLine={false} axisLine={false}
                    tickFormatter={(d) => new Date(d).toLocaleDateString([], { month: "short", day: "numeric" })}
                    interval="preserveStartEnd"
                  />
                  <YAxis tick={{ fontSize: 10, fill: "var(--color-ink)", opacity: 0.45 }} tickLine={false} axisLine={false} allowDecimals={false} />
                  <Tooltip content={<ChartTooltip />} cursor={{ fill: "var(--color-accent)", fillOpacity: 0.08, radius: 4 }} />
                  <Bar dataKey="count" name="count" fill="var(--color-accent)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        {/* Bottom row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

          {/* Top Cited Docs */}
          <div>
            <p className="text-[15px] font-bold mb-[6px]">Top Cited Documents</p>
            <p className="text-[13px] text-muted mb-4">Most referenced in answers</p>
            {loading ? (
              <div className="card p-5 space-y-3">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="h-2.5 rounded-full shimmer-line" style={{ width: `${[80, 65, 72, 55][i]}%` }} />
                ))}
              </div>
            ) : citations.length === 0 ? (
              <div className="card p-8 flex items-center justify-center text-sm text-ink/40 h-[180px]">
                No citations yet
              </div>
            ) : (
              <div className="card p-5">
                <ResponsiveContainer width="100%" height={Math.max(180, citations.length * 36)}>
                  <BarChart data={citations} layout="vertical" barSize={8}>
                    <XAxis type="number" tick={{ fontSize: 10, fill: "var(--color-ink)", opacity: 0.45 }} tickLine={false} axisLine={false} allowDecimals={false} />
                    <YAxis type="category" dataKey="name" width={110}
                      tick={{ fontSize: 10, fill: "var(--color-ink)", opacity: 0.65 }} tickLine={false} axisLine={false}
                      tickFormatter={(n: string) => n.length > 16 ? n.slice(0, 16) + "…" : n}
                    />
                    <Tooltip content={<ChartTooltip />} cursor={{ fill: "var(--color-accent)", fillOpacity: 0.08 }} />
                    <Bar dataKey="citations" fill="var(--color-accent)" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>

          {/* Answer Quality */}
          <div>
            <p className="text-[15px] font-bold mb-[6px]">Answer Quality</p>
            <p className="text-[13px] text-muted mb-4">Based on thumbs up / down feedback</p>
            {loading ? (
              <div className="card p-5 h-[240px]">
                <div className="h-2.5 rounded-full shimmer-line w-1/2 mb-3" />
                <div className="h-2.5 rounded-full shimmer-line w-1/3" />
              </div>
            ) : !hasQuality ? (
              <div className="card p-8 flex flex-col items-center justify-center h-[240px] gap-2">
                <p className="text-sm text-ink/75">No feedback yet</p>
                <p className="text-xs text-ink/40">Rate answers in chat to see quality here</p>
              </div>
            ) : (
              <div className="card p-5 flex flex-col items-center">
                <PieChart width={160} height={160}>
                  <Pie data={qualityData} cx={75} cy={75} innerRadius={50} outerRadius={72}
                    dataKey="value" strokeWidth={0} paddingAngle={3}>
                    <Cell fill="#34d399" />
                    <Cell fill="#f87171" />
                  </Pie>
                </PieChart>
                <div className="flex items-center gap-4 mt-2 text-xs text-ink/75">
                  <span className="flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-emerald-400 inline-block" />
                    {overview?.thumbs_up} thumbs up
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-red-400 inline-block" />
                    {overview?.thumbs_down} thumbs down
                  </span>
                </div>
                {overview?.quality_pct != null && (
                  <p className="text-2xl font-black mt-3 tracking-tight">
                    {overview.quality_pct}%
                    <span className="text-sm font-normal text-ink/40 ml-1">positive</span>
                  </p>
                )}
              </div>
            )}
          </div>

        </div>
        </div>
      </main>
  );
}
