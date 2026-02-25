"use client";

import Sidebar from "@/components/Sidebar";
import Image from "next/image";
import { useState } from "react";

const filters = ["すべて", "丸の内", "銀座", "六本木"];

const lounges = [
  {
    image: "/images/generated-1771986306116.png",
    category: "丸の内  ·  会員専用",
    name: "Members Lounge Marunouchi",
    description:
      "東京駅を望む最上階ラウンジ。ビジネスミーティングからリラックスタイムまで、上質な空間をご提供いたします。ドリンク・軽食サービス付き。",
    hours: "営業時間　9:00 – 21:00",
    area: "丸の内",
  },
  {
    image: "/images/generated-1771986307025.png",
    category: "銀座  ·  会員専用",
    name: "Members Lounge Ginza",
    description:
      "銀座中央通りに面した落ち着いたラウンジ。お買い物の合間に、または大切な方との語らいの場として。バーカウンター併設。",
    hours: "営業時間　10:00 – 22:00",
    area: "銀座",
  },
];

export default function LoungePage() {
  const [activeFilter, setActiveFilter] = useState("すべて");

  const filtered =
    activeFilter === "すべて"
      ? lounges
      : lounges.filter((l) => l.area === activeFilter);

  return (
    <div className="flex h-full w-full bg-[var(--bg-page)]">
      <Sidebar />

      <main className="flex-1 flex flex-col gap-8 px-14 py-10 overflow-auto">
        {/* Header */}
        <div className="flex items-center justify-between w-full">
          <h1 className="font-heading text-[36px] font-medium text-[var(--text-primary)]">
            ラウンジ予約
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

        {/* Lounge List */}
        <div className="flex flex-col gap-5 w-full">
          {filtered.map((lounge) => (
            <div
              key={lounge.name}
              className="flex border border-[var(--border)] w-full"
            >
              <div className="relative w-[360px] h-[220px] shrink-0 overflow-hidden">
                <Image
                  src={lounge.image}
                  alt={lounge.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="flex flex-col justify-between gap-3 p-7 flex-1">
                <div className="flex flex-col gap-3">
                  <span className="font-body text-[11px] font-medium text-[var(--gold)]">
                    {lounge.category}
                  </span>
                  <span className="font-heading text-[24px] font-medium text-[var(--text-primary)]">
                    {lounge.name}
                  </span>
                  <span className="font-body text-[13px] text-[var(--text-secondary)] w-full">
                    {lounge.description}
                  </span>
                </div>
                <div className="flex items-center justify-between w-full">
                  <span className="font-body text-[12px] text-[var(--text-tertiary)]">
                    {lounge.hours}
                  </span>
                  <button className="bg-[var(--gold)] px-6 py-[10px] hover:opacity-90 transition-opacity">
                    <span className="font-body text-[13px] font-medium text-[var(--text-on-gold)]">
                      予約する
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
