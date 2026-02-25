"use client";

import Sidebar from "@/components/Sidebar";
import Image from "next/image";
import { useState } from "react";

const filters = ["すべて", "ワイン", "セミナー", "アート"];

const events = [
  {
    image: "/images/generated-1771986391489.png",
    category: "ワイン",
    date: "2026.03.15",
    name: "ブルゴーニュワイン テイスティング会",
    description: "ソムリエ厳選のブルゴーニュ地方のワイン6種をテイスティング。軽食付き。",
    seats: "残席 8 / 20",
  },
  {
    image: "/images/generated-1771986403578.png",
    category: "セミナー",
    date: "2026.03.22",
    name: "資産運用セミナー 2026 Spring",
    description: "2026年の市場展望と資産配分戦略。チーフストラテジストが解説。",
    seats: "残席 15 / 30",
  },
  {
    image: "/images/generated-1771986426449.png",
    category: "アート",
    date: "2026.04.05",
    name: "プライベート美術館ツアー — 根津美術館",
    description: "学芸員による特別解説付きの貸切鑑賞会。庭園散策と茶菓子付き。",
    seats: "残席 3 / 12",
  },
  {
    image: "/images/generated-1771986414569.png",
    category: "ゴルフ",
    date: "2026.04.12",
    name: "会員限定ゴルフコンペ — 川奈ホテル",
    description: "伊豆の名門コースでの親睦ゴルフ。前夜祭ディナー・宿泊付きプラン。",
    seats: "残席 6 / 16",
  },
];

export default function EventsPage() {
  const [activeFilter, setActiveFilter] = useState("すべて");

  const filtered =
    activeFilter === "すべて"
      ? events
      : events.filter((e) => e.category === activeFilter);

  return (
    <div className="flex h-full w-full bg-[var(--bg-page)]">
      <Sidebar />

      <main className="flex-1 flex flex-col gap-8 px-14 py-10 overflow-auto">
        {/* Header */}
        <div className="flex items-center justify-between w-full">
          <h1 className="font-heading text-[36px] font-medium text-[var(--text-primary)]">
            イベント予約
          </h1>
          <div className="flex gap-3">
            {filters.map((f) => (
              <button
                key={f}
                onClick={() => setActiveFilter(f)}
                className={`px-5 py-2 font-body text-[13px] transition-colors ${
                  activeFilter === f
                    ? "bg-[var(--gold)] text-[var(--text-on-gold)] font-medium"
                    : "border border-[var(--border)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[var(--text-secondary)]"
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* Event Grid — 2 columns */}
        <div className="grid grid-cols-2 gap-5 w-full">
          {filtered.map((event) => (
            <div
              key={event.name}
              className="flex flex-col border border-[var(--border)] w-full"
            >
              <div className="relative w-full h-[180px] overflow-hidden">
                <Image
                  src={event.image}
                  alt={event.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="flex flex-col gap-3 p-5">
                <div className="flex items-center justify-between w-full">
                  <span className="font-body text-[10px] font-medium text-[var(--gold)]">
                    {event.category}
                  </span>
                  <span className="font-body text-[11px] text-[var(--text-tertiary)]">
                    {event.date}
                  </span>
                </div>
                <span className="font-body text-[16px] font-medium text-[var(--text-primary)] w-full">
                  {event.name}
                </span>
                <span className="font-body text-[13px] text-[var(--text-secondary)] w-full">
                  {event.description}
                </span>
                <div className="flex items-center justify-between w-full">
                  <span className="font-body text-[12px] text-[var(--text-tertiary)]">
                    {event.seats}
                  </span>
                  <button className="bg-[var(--gold)] px-5 py-2 hover:opacity-90 transition-opacity">
                    <span className="font-body text-[13px] font-medium text-[var(--text-on-gold)]">
                      申し込む
                    </span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
