"use client";

import Sidebar from "@/components/Sidebar";
import Image from "next/image";
import { useState } from "react";
import { ChevronLeft, Search, MapPin, Clock, Users, CreditCard, Check } from "lucide-react";

// --- Data ---

const genreFilters = ["すべて", "和食", "フレンチ", "イタリアン"];
const areaFilters = ["すべて", "銀座", "六本木", "麻布台", "丸の内"];

const restaurants = [
  {
    id: "ginza-kanze",
    image: "/images/generated-1771986251238.png",
    genre: "和食",
    area: "銀座",
    category: "和食  ·  銀座",
    name: "GINZA KANZE",
    description: "四季折々の食材を活かした本格懐石料理。完全個室でプライベートなお時間を。",
    price: "¥35,000〜 / 名",
    slots: [
      { date: "2026-03-01", time: "12:00", remaining: 2 },
      { date: "2026-03-01", time: "18:00", remaining: 0 },
      { date: "2026-03-01", time: "19:00", remaining: 1 },
      { date: "2026-03-02", time: "12:00", remaining: 3 },
      { date: "2026-03-02", time: "18:00", remaining: 2 },
      { date: "2026-03-02", time: "19:00", remaining: 1 },
      { date: "2026-03-03", time: "12:00", remaining: 0 },
      { date: "2026-03-03", time: "18:00", remaining: 2 },
      { date: "2026-03-03", time: "19:00", remaining: 3 },
    ],
  },
  {
    id: "le-ciel",
    image: "/images/generated-1771986253907.png",
    genre: "フレンチ",
    area: "六本木",
    category: "フレンチ  ·  六本木",
    name: "Le Ciel Étoilé",
    description: "ミシュラン二つ星。東京の夜景を一望するフレンチレストラン。",
    price: "¥45,000〜 / 名",
    slots: [
      { date: "2026-03-01", time: "12:00", remaining: 1 },
      { date: "2026-03-01", time: "18:30", remaining: 2 },
      { date: "2026-03-01", time: "20:00", remaining: 0 },
      { date: "2026-03-02", time: "12:00", remaining: 2 },
      { date: "2026-03-02", time: "18:30", remaining: 1 },
      { date: "2026-03-02", time: "20:00", remaining: 3 },
      { date: "2026-03-03", time: "18:30", remaining: 2 },
      { date: "2026-03-03", time: "20:00", remaining: 1 },
    ],
  },
  {
    id: "trattoria-oro",
    image: "/images/generated-1771986253653.png",
    genre: "イタリアン",
    area: "麻布台",
    category: "イタリアン  ·  麻布台",
    name: "Trattoria Oro",
    description: "本場シチリアの味を東京で。厳選素材のイタリア料理をカジュアルに。",
    price: "¥18,000〜 / 名",
    slots: [
      { date: "2026-03-01", time: "11:30", remaining: 4 },
      { date: "2026-03-01", time: "18:00", remaining: 2 },
      { date: "2026-03-01", time: "19:30", remaining: 1 },
      { date: "2026-03-02", time: "11:30", remaining: 3 },
      { date: "2026-03-02", time: "18:00", remaining: 0 },
      { date: "2026-03-02", time: "19:30", remaining: 2 },
      { date: "2026-03-03", time: "11:30", remaining: 2 },
      { date: "2026-03-03", time: "18:00", remaining: 3 },
      { date: "2026-03-03", time: "19:30", remaining: 1 },
    ],
  },
];

const availableDates = [
  { value: "", label: "日付を選択" },
  { value: "2026-03-01", label: "2026年3月1日（日）" },
  { value: "2026-03-02", label: "2026年3月2日（月）" },
  { value: "2026-03-03", label: "2026年3月3日（火）" },
];

type Step = "search" | "slots" | "booking" | "payment" | "confirm" | "complete";

interface BookingData {
  restaurantId: string;
  date: string;
  time: string;
  guests: number;
  request: string;
  paymentMethod: string;
  cardLast4: string;
}

// --- Step Progress Bar ---

function StepProgress({ current }: { current: Step }) {
  const steps: { key: Step; label: string }[] = [
    { key: "slots", label: "日時選択" },
    { key: "booking", label: "予約情報" },
    { key: "payment", label: "お支払い" },
    { key: "confirm", label: "確認" },
    { key: "complete", label: "完了" },
  ];
  const currentIdx = steps.findIndex((s) => s.key === current);

  return (
    <div className="flex items-center gap-2 w-full">
      {steps.map((step, i) => {
        const isActive = i === currentIdx;
        const isDone = i < currentIdx;
        return (
          <div key={step.key} className="flex items-center gap-2 flex-1">
            <div className="flex items-center gap-2 flex-1">
              <div
                className={`w-7 h-7 flex items-center justify-center shrink-0 text-[12px] font-body font-medium ${
                  isDone
                    ? "bg-[var(--gold)] text-[var(--text-on-gold)]"
                    : isActive
                    ? "border-2 border-[var(--gold)] text-[var(--gold)]"
                    : "border border-[var(--border)] text-[var(--text-tertiary)]"
                }`}
              >
                {isDone ? <Check size={14} /> : i + 1}
              </div>
              <span
                className={`font-body text-[12px] whitespace-nowrap ${
                  isActive ? "text-[var(--gold)] font-medium" : isDone ? "text-[var(--text-primary)]" : "text-[var(--text-tertiary)]"
                }`}
              >
                {step.label}
              </span>
            </div>
            {i < steps.length - 1 && (
              <div className={`h-px flex-1 min-w-4 ${isDone ? "bg-[var(--gold)]" : "bg-[var(--border)]"}`} />
            )}
          </div>
        );
      })}
    </div>
  );
}

// --- Main Page ---

export default function RestaurantPage() {
  const [step, setStep] = useState<Step>("search");

  // Search filters
  const [activeGenre, setActiveGenre] = useState("すべて");
  const [activeArea, setActiveArea] = useState("すべて");
  const [searchDate, setSearchDate] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  // Booking state
  const [booking, setBooking] = useState<BookingData>({
    restaurantId: "",
    date: "",
    time: "",
    guests: 2,
    request: "",
    paymentMethod: "card-registered",
    cardLast4: "4242",
  });

  const selectedRestaurant = restaurants.find((r) => r.id === booking.restaurantId);

  // Filter restaurants
  const filtered = restaurants.filter((r) => {
    if (activeGenre !== "すべて" && r.genre !== activeGenre) return false;
    if (activeArea !== "すべて" && r.area !== activeArea) return false;
    if (searchQuery && !r.name.toLowerCase().includes(searchQuery.toLowerCase()) && !r.description.includes(searchQuery)) return false;
    if (searchDate) {
      const hasDate = r.slots.some((s) => s.date === searchDate && s.remaining > 0);
      if (!hasDate) return false;
    }
    return true;
  });

  function handleSelectRestaurant(id: string) {
    setBooking((b) => ({ ...b, restaurantId: id, date: "", time: "" }));
    setStep("slots");
  }

  function handleBack() {
    const order: Step[] = ["search", "slots", "booking", "payment", "confirm"];
    const idx = order.indexOf(step);
    if (idx > 0) setStep(order[idx - 1]);
  }

  function formatDate(dateStr: string) {
    const d = new Date(dateStr);
    const days = ["日", "月", "火", "水", "木", "金", "土"];
    return `${d.getFullYear()}年${d.getMonth() + 1}月${d.getDate()}日（${days[d.getDay()]}）`;
  }

  return (
    <div className="flex h-full w-full bg-[var(--bg-page)]">
      <Sidebar />

      <main className="flex-1 flex flex-col gap-8 px-14 py-10 overflow-auto">
        {/* Header with back button */}
        <div className="flex items-center gap-4 w-full">
          {step !== "search" && step !== "complete" && (
            <button onClick={handleBack} className="p-1 text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors">
              <ChevronLeft size={24} strokeWidth={1.5} />
            </button>
          )}
          <h1 className="font-heading text-[36px] font-medium text-[var(--text-primary)]">
            レストラン予約
          </h1>
        </div>

        {/* Step Progress (visible in booking flow) */}
        {step !== "search" && (
          <StepProgress current={step} />
        )}

        {/* ====== STEP: Search / List ====== */}
        {step === "search" && (
          <>
            {/* Search Bar */}
            <div className="flex gap-4 w-full">
              <div className="flex items-center gap-3 border border-[var(--border)] px-4 py-3 flex-1">
                <Search size={18} strokeWidth={1.5} className="text-[var(--text-tertiary)]" />
                <input
                  type="text"
                  placeholder="レストラン名・キーワードで検索"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-transparent font-body text-[14px] text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)] outline-none w-full"
                />
              </div>
              <select
                value={searchDate}
                onChange={(e) => setSearchDate(e.target.value)}
                className="bg-[var(--bg-input)] border border-[var(--border)] px-4 py-3 font-body text-[13px] text-[var(--text-primary)] outline-none min-w-[200px]"
              >
                {availableDates.map((d) => (
                  <option key={d.value} value={d.value}>{d.label}</option>
                ))}
              </select>
            </div>

            {/* Filter Rows */}
            <div className="flex flex-col gap-3 w-full">
              <div className="flex items-center gap-3">
                <span className="font-body text-[12px] text-[var(--text-tertiary)] w-[60px] shrink-0">ジャンル</span>
                <div className="flex gap-2">
                  {genreFilters.map((f) => (
                    <button
                      key={f}
                      onClick={() => setActiveGenre(f)}
                      className={`px-4 py-1.5 font-body text-[12px] transition-colors ${
                        activeGenre === f
                          ? "bg-[var(--gold)] text-[var(--text-on-gold)] font-medium"
                          : "border border-[var(--border)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[var(--text-secondary)]"
                      }`}
                    >
                      {f}
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="font-body text-[12px] text-[var(--text-tertiary)] w-[60px] shrink-0">エリア</span>
                <div className="flex gap-2">
                  {areaFilters.map((f) => (
                    <button
                      key={f}
                      onClick={() => setActiveArea(f)}
                      className={`px-4 py-1.5 font-body text-[12px] transition-colors ${
                        activeArea === f
                          ? "bg-[var(--gold)] text-[var(--text-on-gold)] font-medium"
                          : "border border-[var(--border)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[var(--text-secondary)]"
                      }`}
                    >
                      {f}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Results count */}
            <div className="flex items-center justify-between w-full">
              <span className="font-body text-[13px] text-[var(--text-secondary)]">
                {filtered.length} 件のレストラン
              </span>
            </div>

            {/* Restaurant Grid */}
            <div className="grid grid-cols-3 gap-5 w-full">
              {filtered.map((restaurant) => (
                <div
                  key={restaurant.id}
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
                    <span className="font-body text-[12px] text-[var(--text-tertiary)]">
                      {restaurant.price}
                    </span>
                    <button
                      onClick={() => handleSelectRestaurant(restaurant.id)}
                      className="flex items-center justify-center border border-[var(--gold)] px-5 py-3 w-full hover:bg-[var(--gold-subtle)] transition-colors"
                    >
                      <span className="font-body text-[13px] font-medium text-[var(--gold)]">予約する</span>
                    </button>
                  </div>
                </div>
              ))}
              {filtered.length === 0 && (
                <div className="col-span-3 flex items-center justify-center py-20">
                  <span className="font-body text-[14px] text-[var(--text-tertiary)]">
                    条件に一致するレストランが見つかりませんでした
                  </span>
                </div>
              )}
            </div>
          </>
        )}

        {/* ====== STEP: Slots (date/time selection) ====== */}
        {step === "slots" && selectedRestaurant && (
          <>
            {/* Restaurant Summary */}
            <div className="flex gap-5 border border-[var(--border)] p-5 w-full">
              <div className="relative w-[160px] h-[100px] shrink-0 overflow-hidden">
                <Image src={selectedRestaurant.image} alt={selectedRestaurant.name} fill className="object-cover" />
              </div>
              <div className="flex flex-col gap-2 justify-center">
                <span className="font-body text-[11px] font-medium text-[var(--gold)]">{selectedRestaurant.category}</span>
                <span className="font-heading text-[22px] font-medium text-[var(--text-primary)]">{selectedRestaurant.name}</span>
                <span className="font-body text-[13px] text-[var(--text-secondary)]">{selectedRestaurant.price}</span>
              </div>
            </div>

            {/* Date Selection */}
            <div className="flex flex-col gap-4 w-full">
              <span className="font-body text-[14px] font-medium text-[var(--text-primary)]">
                <MapPin size={16} strokeWidth={1.5} className="inline mr-2 text-[var(--gold)]" />
                日付を選択
              </span>
              <div className="flex gap-3">
                {availableDates.filter((d) => d.value).map((d) => {
                  const slotsForDate = selectedRestaurant.slots.filter((s) => s.date === d.value);
                  const totalRemaining = slotsForDate.reduce((sum, s) => sum + s.remaining, 0);
                  return (
                    <button
                      key={d.value}
                      onClick={() => setBooking((b) => ({ ...b, date: d.value, time: "" }))}
                      className={`flex flex-col items-center gap-2 border px-6 py-4 transition-colors ${
                        booking.date === d.value
                          ? "border-[var(--gold)] bg-[var(--gold-subtle)]"
                          : "border-[var(--border)] hover:border-[var(--text-secondary)]"
                      }`}
                    >
                      <span className="font-body text-[13px] text-[var(--text-primary)]">{d.label}</span>
                      <span className={`font-body text-[11px] ${totalRemaining > 0 ? "text-[var(--gold)]" : "text-[var(--text-tertiary)]"}`}>
                        {totalRemaining > 0 ? `残り ${totalRemaining} 枠` : "満席"}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Time Selection */}
            {booking.date && (
              <div className="flex flex-col gap-4 w-full">
                <span className="font-body text-[14px] font-medium text-[var(--text-primary)]">
                  <Clock size={16} strokeWidth={1.5} className="inline mr-2 text-[var(--gold)]" />
                  時間を選択
                </span>
                <div className="flex gap-3 flex-wrap">
                  {selectedRestaurant.slots
                    .filter((s) => s.date === booking.date)
                    .map((slot) => (
                      <button
                        key={slot.time}
                        onClick={() => slot.remaining > 0 && setBooking((b) => ({ ...b, time: slot.time }))}
                        disabled={slot.remaining === 0}
                        className={`flex flex-col items-center gap-1.5 border px-6 py-3 transition-colors ${
                          slot.remaining === 0
                            ? "border-[var(--border)] opacity-40 cursor-not-allowed"
                            : booking.time === slot.time
                            ? "border-[var(--gold)] bg-[var(--gold-subtle)]"
                            : "border-[var(--border)] hover:border-[var(--text-secondary)]"
                        }`}
                      >
                        <span className="font-body text-[14px] font-medium text-[var(--text-primary)]">{slot.time}</span>
                        <span className={`font-body text-[11px] ${
                          slot.remaining === 0 ? "text-[var(--text-tertiary)]" : slot.remaining <= 2 ? "text-red-400" : "text-[var(--gold)]"
                        }`}>
                          {slot.remaining === 0 ? "満席" : `残り ${slot.remaining} 席`}
                        </span>
                      </button>
                    ))}
                </div>
              </div>
            )}

            {/* Next Button */}
            {booking.date && booking.time && (
              <div className="flex justify-end w-full pt-4">
                <button
                  onClick={() => setStep("booking")}
                  className="bg-[var(--gold)] px-8 py-3 hover:opacity-90 transition-opacity"
                >
                  <span className="font-body text-[14px] font-medium text-[var(--text-on-gold)]">次へ進む</span>
                </button>
              </div>
            )}
          </>
        )}

        {/* ====== STEP: Booking (guest info) ====== */}
        {step === "booking" && selectedRestaurant && (
          <>
            {/* Reservation Summary */}
            <div className="flex gap-5 border border-[var(--border)] p-5 w-full">
              <div className="relative w-[120px] h-[80px] shrink-0 overflow-hidden">
                <Image src={selectedRestaurant.image} alt={selectedRestaurant.name} fill className="object-cover" />
              </div>
              <div className="flex flex-col gap-1 justify-center flex-1">
                <span className="font-heading text-[18px] font-medium text-[var(--text-primary)]">{selectedRestaurant.name}</span>
                <span className="font-body text-[13px] text-[var(--text-secondary)]">
                  {formatDate(booking.date)}　|　{booking.time}
                </span>
              </div>
            </div>

            {/* Guest Count */}
            <div className="flex flex-col gap-4 border border-[var(--border)] p-7 w-full">
              <span className="font-body text-[14px] font-medium text-[var(--text-primary)]">
                <Users size={16} strokeWidth={1.5} className="inline mr-2 text-[var(--gold)]" />
                ご予約人数
              </span>
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setBooking((b) => ({ ...b, guests: Math.max(1, b.guests - 1) }))}
                  className="w-10 h-10 flex items-center justify-center border border-[var(--border)] text-[var(--text-primary)] font-body text-[18px] hover:border-[var(--text-secondary)] transition-colors"
                >
                  −
                </button>
                <span className="font-heading text-[28px] font-medium text-[var(--text-primary)] w-12 text-center">
                  {booking.guests}
                </span>
                <button
                  onClick={() => setBooking((b) => ({ ...b, guests: Math.min(10, b.guests + 1) }))}
                  className="w-10 h-10 flex items-center justify-center border border-[var(--border)] text-[var(--text-primary)] font-body text-[18px] hover:border-[var(--text-secondary)] transition-colors"
                >
                  +
                </button>
                <span className="font-body text-[13px] text-[var(--text-secondary)]">名様</span>
              </div>
            </div>

            {/* Special Request */}
            <div className="flex flex-col gap-4 border border-[var(--border)] p-7 w-full">
              <span className="font-body text-[14px] font-medium text-[var(--text-primary)]">
                特別リクエスト
              </span>
              <textarea
                value={booking.request}
                onChange={(e) => setBooking((b) => ({ ...b, request: e.target.value }))}
                placeholder="アレルギー、記念日のお祝い、お席のご希望など"
                rows={4}
                className="bg-[var(--bg-input)] border border-[var(--border)] px-4 py-3 font-body text-[14px] text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)] outline-none resize-none w-full"
              />
            </div>

            {/* Next */}
            <div className="flex justify-end w-full pt-4">
              <button
                onClick={() => setStep("payment")}
                className="bg-[var(--gold)] px-8 py-3 hover:opacity-90 transition-opacity"
              >
                <span className="font-body text-[14px] font-medium text-[var(--text-on-gold)]">お支払いへ</span>
              </button>
            </div>
          </>
        )}

        {/* ====== STEP: Payment ====== */}
        {step === "payment" && selectedRestaurant && (
          <>
            {/* Price Summary */}
            <div className="flex flex-col gap-4 border border-[var(--border)] p-7 w-full">
              <span className="font-body text-[14px] font-medium text-[var(--text-primary)]">
                <CreditCard size={16} strokeWidth={1.5} className="inline mr-2 text-[var(--gold)]" />
                お支払い金額
              </span>
              <div className="flex flex-col gap-3 w-full">
                <div className="flex items-center justify-between w-full">
                  <span className="font-body text-[13px] text-[var(--text-secondary)]">{selectedRestaurant.name}（{booking.guests}名様）</span>
                  <span className="font-mono text-[14px] text-[var(--text-primary)]">
                    ¥{(35000 * booking.guests).toLocaleString()}
                  </span>
                </div>
                <div className="flex items-center justify-between w-full">
                  <span className="font-body text-[13px] text-[var(--text-secondary)]">サービス料（10%）</span>
                  <span className="font-mono text-[14px] text-[var(--text-primary)]">
                    ¥{(35000 * booking.guests * 0.1).toLocaleString()}
                  </span>
                </div>
                <div className="h-px bg-[var(--border)] w-full" />
                <div className="flex items-center justify-between w-full">
                  <span className="font-body text-[14px] font-medium text-[var(--text-primary)]">合計（税込）</span>
                  <span className="font-heading text-[24px] font-medium text-[var(--gold)]">
                    ¥{(35000 * booking.guests * 1.1).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div className="flex flex-col gap-4 border border-[var(--border)] p-7 w-full">
              <span className="font-body text-[14px] font-medium text-[var(--text-primary)]">お支払い方法</span>
              <div className="flex flex-col gap-3 w-full">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="radio"
                    name="payment"
                    checked={booking.paymentMethod === "card-registered"}
                    onChange={() => setBooking((b) => ({ ...b, paymentMethod: "card-registered" }))}
                    className="accent-[var(--gold)]"
                  />
                  <span className="font-body text-[14px] text-[var(--text-primary)]">登録済みカード</span>
                  <span className="font-mono text-[13px] text-[var(--text-secondary)]">**** **** **** 4242</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="radio"
                    name="payment"
                    checked={booking.paymentMethod === "points"}
                    onChange={() => setBooking((b) => ({ ...b, paymentMethod: "points" }))}
                    className="accent-[var(--gold)]"
                  />
                  <span className="font-body text-[14px] text-[var(--text-primary)]">ポイント利用</span>
                  <span className="font-body text-[12px] text-[var(--text-tertiary)]">（残高: 24,800 pt）</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="radio"
                    name="payment"
                    checked={booking.paymentMethod === "onsite"}
                    onChange={() => setBooking((b) => ({ ...b, paymentMethod: "onsite" }))}
                    className="accent-[var(--gold)]"
                  />
                  <span className="font-body text-[14px] text-[var(--text-primary)]">現地決済</span>
                </label>
              </div>
            </div>

            {/* Next */}
            <div className="flex justify-end w-full pt-4">
              <button
                onClick={() => setStep("confirm")}
                className="bg-[var(--gold)] px-8 py-3 hover:opacity-90 transition-opacity"
              >
                <span className="font-body text-[14px] font-medium text-[var(--text-on-gold)]">確認画面へ</span>
              </button>
            </div>
          </>
        )}

        {/* ====== STEP: Confirmation ====== */}
        {step === "confirm" && selectedRestaurant && (
          <>
            <div className="flex flex-col gap-6 border border-[var(--border)] p-7 w-full">
              <span className="font-heading text-[22px] font-medium text-[var(--text-primary)]">ご予約内容の確認</span>

              {/* Restaurant Info */}
              <div className="flex gap-5 bg-[var(--bg-surface)] p-5 w-full">
                <div className="relative w-[120px] h-[80px] shrink-0 overflow-hidden">
                  <Image src={selectedRestaurant.image} alt={selectedRestaurant.name} fill className="object-cover" />
                </div>
                <div className="flex flex-col gap-1 justify-center">
                  <span className="font-body text-[11px] font-medium text-[var(--gold)]">{selectedRestaurant.category}</span>
                  <span className="font-heading text-[18px] font-medium text-[var(--text-primary)]">{selectedRestaurant.name}</span>
                </div>
              </div>

              {/* Details */}
              <div className="flex flex-col gap-4 w-full">
                <div className="flex items-center justify-between py-3 border-b border-[var(--border)]">
                  <span className="font-body text-[13px] text-[var(--text-secondary)]">日時</span>
                  <span className="font-body text-[14px] text-[var(--text-primary)]">{formatDate(booking.date)}　{booking.time}</span>
                </div>
                <div className="flex items-center justify-between py-3 border-b border-[var(--border)]">
                  <span className="font-body text-[13px] text-[var(--text-secondary)]">人数</span>
                  <span className="font-body text-[14px] text-[var(--text-primary)]">{booking.guests} 名様</span>
                </div>
                {booking.request && (
                  <div className="flex items-start justify-between py-3 border-b border-[var(--border)]">
                    <span className="font-body text-[13px] text-[var(--text-secondary)] shrink-0">特別リクエスト</span>
                    <span className="font-body text-[14px] text-[var(--text-primary)] text-right max-w-[400px]">{booking.request}</span>
                  </div>
                )}
                <div className="flex items-center justify-between py-3 border-b border-[var(--border)]">
                  <span className="font-body text-[13px] text-[var(--text-secondary)]">お支払い方法</span>
                  <span className="font-body text-[14px] text-[var(--text-primary)]">
                    {booking.paymentMethod === "card-registered"
                      ? `クレジットカード（**** ${booking.cardLast4}）`
                      : booking.paymentMethod === "points"
                      ? "ポイント利用"
                      : "現地決済"}
                  </span>
                </div>
                <div className="flex items-center justify-between py-3">
                  <span className="font-body text-[14px] font-medium text-[var(--text-primary)]">合計金額</span>
                  <span className="font-heading text-[24px] font-medium text-[var(--gold)]">
                    ¥{(35000 * booking.guests * 1.1).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between w-full pt-4">
              <button
                onClick={handleBack}
                className="border border-[var(--border)] px-6 py-3 hover:border-[var(--text-secondary)] transition-colors"
              >
                <span className="font-body text-[13px] text-[var(--text-secondary)]">戻る</span>
              </button>
              <button
                onClick={() => setStep("complete")}
                className="bg-[var(--gold)] px-10 py-3 hover:opacity-90 transition-opacity"
              >
                <span className="font-body text-[14px] font-medium text-[var(--text-on-gold)]">予約を確定する</span>
              </button>
            </div>
          </>
        )}

        {/* ====== STEP: Complete ====== */}
        {step === "complete" && selectedRestaurant && (
          <div className="flex flex-col items-center gap-8 py-16 w-full">
            {/* Success Icon */}
            <div className="w-20 h-20 flex items-center justify-center bg-[var(--gold-subtle)] border border-[var(--gold)]">
              <Check size={36} strokeWidth={1.5} className="text-[var(--gold)]" />
            </div>

            <div className="flex flex-col items-center gap-3">
              <span className="font-heading text-[28px] font-medium text-[var(--text-primary)]">ご予約が完了しました</span>
              <span className="font-body text-[14px] text-[var(--text-secondary)]">
                確認メールをお送りいたしました
              </span>
            </div>

            {/* Summary Card */}
            <div className="flex flex-col gap-5 border border-[var(--border)] p-7 w-full max-w-[520px]">
              <div className="flex items-center justify-between w-full">
                <span className="font-body text-[12px] text-[var(--text-tertiary)]">予約番号</span>
                <span className="font-mono text-[14px] font-medium text-[var(--gold)]">WC-R-2026030128</span>
              </div>
              <div className="h-px bg-[var(--border)] w-full" />
              <div className="flex items-center justify-between w-full">
                <span className="font-body text-[13px] text-[var(--text-secondary)]">レストラン</span>
                <span className="font-body text-[14px] text-[var(--text-primary)]">{selectedRestaurant.name}</span>
              </div>
              <div className="flex items-center justify-between w-full">
                <span className="font-body text-[13px] text-[var(--text-secondary)]">日時</span>
                <span className="font-body text-[14px] text-[var(--text-primary)]">{formatDate(booking.date)}　{booking.time}</span>
              </div>
              <div className="flex items-center justify-between w-full">
                <span className="font-body text-[13px] text-[var(--text-secondary)]">人数</span>
                <span className="font-body text-[14px] text-[var(--text-primary)]">{booking.guests} 名様</span>
              </div>
              <div className="flex items-center justify-between w-full">
                <span className="font-body text-[13px] text-[var(--text-secondary)]">合計金額</span>
                <span className="font-heading text-[18px] font-medium text-[var(--gold)]">
                  ¥{(35000 * booking.guests * 1.1).toLocaleString()}
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-4">
              <button
                onClick={() => {
                  setStep("search");
                  setBooking({ restaurantId: "", date: "", time: "", guests: 2, request: "", paymentMethod: "card-registered", cardLast4: "4242" });
                }}
                className="border border-[var(--border)] px-6 py-3 hover:border-[var(--text-secondary)] transition-colors"
              >
                <span className="font-body text-[13px] text-[var(--text-secondary)]">レストラン一覧に戻る</span>
              </button>
              <button
                onClick={() => window.location.href = "/"}
                className="bg-[var(--gold)] px-6 py-3 hover:opacity-90 transition-opacity"
              >
                <span className="font-body text-[13px] font-medium text-[var(--text-on-gold)]">ダッシュボードへ</span>
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
