"use client";

import Sidebar from "@/components/Sidebar";
import Image from "next/image";
import { useState } from "react";

const filters = ["すべて", "和食", "フレンチ", "イタリアン"];

const restaurants = [
  {
    image: "/images/generated-1771986251238.png",
    category: "和食  ·  銀座",
    name: "GINZA KANZE",
    description: "四季折々の食材を活かした本格懐石料理。完全個室でプライベートなお時間を。",
    filter: "和食",
  },
  {
    image: "/images/generated-1771986253907.png",
    category: "フレンチ  ·  六本木",
    name: "Le Ciel Étoilé",
    description: "ミシュラン二つ星。東京の夜景を一望するフレンチレストラン。",
    filter: "フレンチ",
  },
  {
    image: "/images/generated-1771986253653.png",
    category: "イタリアン  ·  麻布台",
    name: "Trattoria Oro",
    description: "本場シチリアの味を東京で。厳選素材のイタリア料理をカジュアルに。",
    filter: "イタリアン",
  },
];

export default function RestaurantPage() {
  const [activeFilter, setActiveFilter] = useState("すべて");

  const filtered =
    activeFilter === "すべて"
      ? restaurants
      : restaurants.filter((r) => r.filter === activeFilter);

  return (
    <div className="flex h-full w-full bg-[var(--bg-page)]">
      <Sidebar />

      <main className="flex-1 flex flex-col gap-8 px-14 py-10 overflow-auto">
        {/* Header */}
        <div className="flex items-center justify-between w-full">
          <h1 className="font-heading text-[36px] font-medium text-[var(--text-primary)]">
            レストラン予約
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

        {/* Restaurant Grid */}
        <div className="grid grid-cols-3 gap-5 w-full">
          {filtered.map((restaurant) => (
            <div
              key={restaurant.name}
              className="flex flex-col border border-[var(--border)] w-full"
            >
              <div className="relative w-full h-[200px] overflow-hidden">
                <Image
                  src={restaurant.image}
                  alt={restaurant.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="flex flex-col gap-3 p-5">
                <span className="font-body text-[11px] font-medium text-[var(--gold)]">
                  {restaurant.category}
                </span>
                <span className="font-heading text-[22px] font-medium text-[var(--text-primary)]">
                  {restaurant.name}
                </span>
                <span className="font-body text-[13px] text-[var(--text-secondary)] w-full">
                  {restaurant.description}
                </span>
                <button className="flex items-center justify-center border border-[var(--gold)] px-5 py-3 w-full hover:bg-[var(--gold-subtle)] transition-colors">
                  <span className="font-body text-[13px] font-medium text-[var(--gold)]">予約する</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
