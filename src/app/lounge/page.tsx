"use client";

import Sidebar from "@/components/Sidebar";
import Image from "next/image";
import { useState } from "react";
import { Check, ChevronLeft, Sofa, Info } from "lucide-react";

// --- Data ---

const areaFilters = ["すべて", "丸の内", "銀座", "六本木"];

const lounges = [
  {
    id: "marunouchi",
    image: "/images/generated-1771986306116.png",
    category: "丸の内  ·  会員専用",
    name: "Members Lounge Marunouchi",
    description:
      "東京駅を望む最上階ラウンジ。ビジネスミーティングからリラックスタイムまで、上質な空間をご提供いたします。ドリンク・軽食サービス付き。",
    hours: "営業時間　9:00 – 21:00",
    area: "丸の内",
    timeSlots: ["9:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00", "19:00"],
  },
  {
    id: "ginza",
    image: "/images/generated-1771986307025.png",
    category: "銀座  ·  会員専用",
    name: "Members Lounge Ginza",
    description:
      "銀座中央通りに面した落ち着いたラウンジ。お買い物の合間に、または大切な方との語らいの場として。バーカウンター併設。",
    hours: "営業時間　10:00 – 22:00",
    area: "銀座",
    timeSlots: ["10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00", "19:00", "20:00"],
  },
];

const seatTypes = [
  { id: "sofa", label: "ソファ席", icon: "sofa" },
  { id: "counter", label: "カウンター席", icon: "counter" },
  { id: "private", label: "個室", icon: "private" },
];

const durations = ["1時間", "2時間", "3時間", "4時間"];

const purposes = ["ビジネスミーティング", "リラックス", "読書・作業", "接待・会食", "その他"];

type Step = "list" | "datetime" | "info" | "confirm" | "complete";

interface BookingData {
  loungeId: string;
  date: string;
  time: string;
  seatType: string;
  duration: string;
  guests: number;
  purpose: string;
  services: string[];
  request: string;
}

// --- Step Progress ---

function StepProgress({ current }: { current: Step }) {
  const steps: { key: Step; label: string }[] = [
    { key: "datetime", label: "日時選択" },
    { key: "info", label: "予約情報" },
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

export default function LoungePage() {
  const [step, setStep] = useState<Step>("list");
  const [activeFilter, setActiveFilter] = useState("すべて");
  const [booking, setBooking] = useState<BookingData>({
    loungeId: "",
    date: "2026-03-10",
    time: "",
    seatType: "sofa",
    duration: "2時間",
    guests: 1,
    purpose: "ビジネスミーティング",
    services: ["drink"],
    request: "",
  });

  const selectedLounge = lounges.find((l) => l.id === booking.loungeId);

  const filtered =
    activeFilter === "すべて"
      ? lounges
      : lounges.filter((l) => l.area === activeFilter);

  function handleReserve(id: string) {
    setBooking((b) => ({ ...b, loungeId: id, time: "", request: "" }));
    setStep("datetime");
  }

  function handleBack() {
    const order: Step[] = ["list", "datetime", "info", "confirm"];
    const idx = order.indexOf(step);
    if (idx > 0) setStep(order[idx - 1]);
  }

  function formatDate(dateStr: string) {
    const d = new Date(dateStr);
    const days = ["日", "月", "火", "水", "木", "金", "土"];
    return `${d.getFullYear()}年${d.getMonth() + 1}月${d.getDate()}日（${days[d.getDay()]}）`;
  }

  function toggleService(svc: string) {
    setBooking((b) => ({
      ...b,
      services: b.services.includes(svc)
        ? b.services.filter((s) => s !== svc)
        : [...b.services, svc],
    }));
  }

  const serviceLabels: Record<string, string> = {
    drink: "ドリンクサービス（無料）",
    food: "軽食プレート（¥3,000）",
    projector: "プロジェクター利用（無料）",
  };

  return (
    <div className="flex h-full w-full bg-[var(--bg-page)]">
      <Sidebar />

      <main className="flex-1 flex flex-col gap-8 px-14 py-10 overflow-auto">
        {/* Header */}
        <div className="flex items-center gap-4 w-full">
          {step !== "list" && step !== "complete" && (
            <button onClick={handleBack} className="p-1 text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors">
              <ChevronLeft size={24} strokeWidth={1.5} />
            </button>
          )}
          <h1 className="font-heading text-[36px] font-medium text-[var(--text-primary)]">
            ラウンジ予約
          </h1>
          {step === "list" && (
            <div className="flex gap-3 ml-auto">
              {areaFilters.map((f) => (
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
          )}
        </div>

        {/* Step Progress */}
        {step !== "list" && <StepProgress current={step} />}

        {/* ====== STEP: List ====== */}
        {step === "list" && (
          <div className="flex flex-col gap-5 w-full">
            {filtered.map((lounge) => (
              <div key={lounge.id} className="flex border border-[var(--border)] w-full">
                <div className="relative w-[360px] h-[220px] shrink-0 overflow-hidden">
                  <Image src={lounge.image} alt={lounge.name} fill className="object-cover" />
                </div>
                <div className="flex flex-col justify-between gap-3 p-7 flex-1">
                  <div className="flex flex-col gap-3">
                    <span className="font-body text-[11px] font-medium text-[var(--gold)]">{lounge.category}</span>
                    <span className="font-heading text-[24px] font-medium text-[var(--text-primary)]">{lounge.name}</span>
                    <span className="font-body text-[13px] text-[var(--text-secondary)] w-full">{lounge.description}</span>
                  </div>
                  <div className="flex items-center justify-between w-full">
                    <span className="font-body text-[12px] text-[var(--text-tertiary)]">{lounge.hours}</span>
                    <button
                      onClick={() => handleReserve(lounge.id)}
                      className="bg-[var(--gold)] px-6 py-[10px] hover:opacity-90 transition-opacity"
                    >
                      <span className="font-body text-[13px] font-medium text-[var(--text-on-gold)]">予約する</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ====== STEP: DateTime ====== */}
        {step === "datetime" && selectedLounge && (
          <div className="flex gap-8 w-full">
            {/* Left — Date/Time */}
            <div className="flex-1 flex flex-col gap-6">
              {/* Lounge Selection (read-only) */}
              <span className="font-heading text-[22px] font-medium text-[var(--text-primary)]">ラウンジ選択</span>
              <div className="flex gap-3 border border-[var(--gold)] p-4 w-full items-center">
                <div className="w-4 h-4 rounded-full border-2 border-[var(--gold)] flex items-center justify-center">
                  <div className="w-2.5 h-2.5 rounded-full bg-[var(--gold)]" />
                </div>
                <div className="flex flex-col gap-1">
                  <span className="font-body text-[14px] font-medium text-[var(--text-primary)]">{selectedLounge.name}</span>
                  <span className="font-body text-[12px] text-[var(--text-secondary)]">{selectedLounge.area}  ·  {selectedLounge.hours.replace("営業時間　", "")}</span>
                </div>
              </div>

              {/* Date */}
              <span className="font-heading text-[22px] font-medium text-[var(--text-primary)]">日時選択</span>
              <div className="flex flex-col gap-2">
                <span className="font-body text-[12px] text-[var(--text-secondary)]">ご利用日</span>
                <input
                  type="date"
                  value={booking.date}
                  onChange={(e) => setBooking((b) => ({ ...b, date: e.target.value }))}
                  className="bg-[var(--bg-input)] border border-[var(--border)] px-4 h-12 font-body text-[14px] text-[var(--text-primary)] outline-none w-full"
                />
              </div>

              {/* Time */}
              <div className="flex flex-col gap-2">
                <span className="font-body text-[12px] text-[var(--text-secondary)]">ご利用時間</span>
                <div className="grid grid-cols-5 gap-2.5">
                  {selectedLounge.timeSlots.map((t) => (
                    <button
                      key={t}
                      onClick={() => setBooking((b) => ({ ...b, time: t }))}
                      className={`h-10 flex items-center justify-center font-body text-[13px] transition-colors ${
                        booking.time === t
                          ? "bg-[var(--gold)] text-[var(--text-on-gold)] font-medium"
                          : "border border-[var(--border)] text-[var(--text-primary)] hover:border-[var(--text-secondary)]"
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Right — Seat/Duration */}
            <div className="w-[360px] shrink-0 flex flex-col gap-6">
              <span className="font-heading text-[22px] font-medium text-[var(--text-primary)]">席タイプ</span>
              <div className="flex flex-col gap-2.5">
                {seatTypes.map((seat) => (
                  <button
                    key={seat.id}
                    onClick={() => setBooking((b) => ({ ...b, seatType: seat.id }))}
                    className={`flex items-center gap-3 px-4 py-3.5 w-full transition-colors ${
                      booking.seatType === seat.id
                        ? "border border-[var(--gold)]"
                        : "border border-[var(--border)] hover:border-[var(--text-secondary)]"
                    }`}
                  >
                    <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                      booking.seatType === seat.id ? "border-[var(--gold)]" : "border-[var(--text-tertiary)]"
                    }`}>
                      {booking.seatType === seat.id && <div className="w-2.5 h-2.5 rounded-full bg-[var(--gold)]" />}
                    </div>
                    <Sofa size={18} strokeWidth={1.5} className={booking.seatType === seat.id ? "text-[var(--gold)]" : "text-[var(--text-secondary)]"} />
                    <span className={`font-body text-[13px] ${booking.seatType === seat.id ? "font-medium text-[var(--text-primary)]" : "text-[var(--text-primary)]"}`}>
                      {seat.label}
                    </span>
                  </button>
                ))}
              </div>

              {/* Duration */}
              <div className="flex flex-col gap-2">
                <span className="font-body text-[12px] text-[var(--text-secondary)]">ご利用時間</span>
                <select
                  value={booking.duration}
                  onChange={(e) => setBooking((b) => ({ ...b, duration: e.target.value }))}
                  className="bg-[var(--bg-input)] border border-[var(--border)] px-4 h-12 font-body text-[14px] text-[var(--text-primary)] outline-none w-full"
                >
                  {durations.map((d) => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </div>

              <div className="flex-1" />

              {/* Next */}
              <button
                onClick={() => booking.time && setStep("info")}
                disabled={!booking.time}
                className={`w-full h-12 flex items-center justify-center transition-opacity ${
                  booking.time
                    ? "bg-[var(--gold)] hover:opacity-90"
                    : "bg-[var(--gold)] opacity-40 cursor-not-allowed"
                }`}
              >
                <span className="font-body text-[14px] font-medium text-[var(--text-on-gold)]">次へ進む</span>
              </button>
            </div>
          </div>
        )}

        {/* ====== STEP: Info ====== */}
        {step === "info" && selectedLounge && (
          <div className="flex gap-8 w-full">
            {/* Left — Form */}
            <div className="flex-1 flex flex-col gap-6">
              <span className="font-heading text-[22px] font-medium text-[var(--text-primary)]">予約情報</span>

              {/* Guest Count */}
              <div className="flex flex-col gap-2">
                <span className="font-body text-[12px] text-[var(--text-secondary)]">ご利用人数</span>
                <div className="flex gap-2.5">
                  {[1, 2, 3, 4].map((n) => (
                    <button
                      key={n}
                      onClick={() => setBooking((b) => ({ ...b, guests: n }))}
                      className={`flex-1 h-10 flex items-center justify-center font-body text-[13px] transition-colors ${
                        booking.guests === n
                          ? "bg-[var(--gold)] text-[var(--text-on-gold)] font-medium"
                          : "border border-[var(--border)] text-[var(--text-primary)] hover:border-[var(--text-secondary)]"
                      }`}
                    >
                      {n}名
                    </button>
                  ))}
                </div>
              </div>

              {/* Purpose */}
              <div className="flex flex-col gap-2">
                <span className="font-body text-[12px] text-[var(--text-secondary)]">ご利用目的</span>
                <select
                  value={booking.purpose}
                  onChange={(e) => setBooking((b) => ({ ...b, purpose: e.target.value }))}
                  className="bg-[var(--bg-input)] border border-[var(--border)] px-4 h-12 font-body text-[14px] text-[var(--text-primary)] outline-none w-full"
                >
                  {purposes.map((p) => (
                    <option key={p} value={p}>{p}</option>
                  ))}
                </select>
              </div>

              {/* Additional Services */}
              <div className="flex flex-col gap-3">
                <span className="font-body text-[12px] text-[var(--text-secondary)]">追加サービス</span>
                {Object.entries(serviceLabels).map(([key, label]) => (
                  <label key={key} className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={booking.services.includes(key)}
                      onChange={() => toggleService(key)}
                      className="accent-[var(--gold)] w-[18px] h-[18px]"
                    />
                    <span className="font-body text-[13px] text-[var(--text-primary)]">{label}</span>
                  </label>
                ))}
              </div>

              {/* Request */}
              <div className="flex flex-col gap-2">
                <span className="font-body text-[12px] text-[var(--text-secondary)]">ご要望</span>
                <textarea
                  value={booking.request}
                  onChange={(e) => setBooking((b) => ({ ...b, request: e.target.value }))}
                  placeholder="窓側の席を希望、電源席希望など"
                  rows={3}
                  className="bg-[var(--bg-input)] border border-[var(--border)] px-4 py-3 font-body text-[14px] text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)] outline-none resize-none w-full"
                />
              </div>
            </div>

            {/* Right — Summary */}
            <div className="w-[360px] shrink-0 flex flex-col gap-6">
              <span className="font-heading text-[22px] font-medium text-[var(--text-primary)]">予約概要</span>
              <div className="flex flex-col gap-4 border border-[var(--border)] p-5">
                <div className="flex items-center justify-between">
                  <span className="font-body text-[13px] text-[var(--text-secondary)]">ラウンジ</span>
                  <span className="font-body text-[13px] text-[var(--text-primary)]">{selectedLounge.area}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-body text-[13px] text-[var(--text-secondary)]">日時</span>
                  <span className="font-body text-[13px] text-[var(--text-primary)]">
                    {booking.date && formatDate(booking.date).replace(/^\d+年/, "")} {booking.time}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-body text-[13px] text-[var(--text-secondary)]">席タイプ</span>
                  <span className="font-body text-[13px] text-[var(--text-primary)]">
                    {seatTypes.find((s) => s.id === booking.seatType)?.label}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-body text-[13px] text-[var(--text-secondary)]">時間</span>
                  <span className="font-body text-[13px] text-[var(--text-primary)]">{booking.duration}</span>
                </div>
              </div>

              {/* Free notice */}
              <div className="flex items-center gap-2.5 bg-[var(--gold-subtle)] p-4">
                <Info size={16} strokeWidth={1.5} className="text-[var(--gold)] shrink-0" />
                <span className="font-body text-[12px] text-[var(--gold)]">会員特典：ラウンジご利用は無料です</span>
              </div>

              <div className="flex-1" />

              <div className="flex flex-col gap-3">
                <button
                  onClick={() => setStep("confirm")}
                  className="w-full h-12 flex items-center justify-center bg-[var(--gold)] hover:opacity-90 transition-opacity"
                >
                  <span className="font-body text-[14px] font-medium text-[var(--text-on-gold)]">確認画面へ</span>
                </button>
                <button
                  onClick={handleBack}
                  className="w-full h-12 flex items-center justify-center border border-[var(--border)] hover:border-[var(--text-secondary)] transition-colors"
                >
                  <span className="font-body text-[14px] text-[var(--text-secondary)]">戻る</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ====== STEP: Confirm ====== */}
        {step === "confirm" && selectedLounge && (
          <>
            <div className="flex flex-col gap-6 border border-[var(--border)] p-7 w-full">
              <span className="font-heading text-[22px] font-medium text-[var(--text-primary)]">ご予約内容の確認</span>
              <span className="font-body text-[13px] text-[var(--text-secondary)]">
                以下の内容でラウンジを予約します。内容をご確認ください。
              </span>

              <div className="flex flex-col gap-4 w-full">
                <div className="flex items-center justify-between py-3 border-b border-[var(--border)]">
                  <span className="font-body text-[13px] text-[var(--text-secondary)]">ラウンジ</span>
                  <span className="font-body text-[14px] text-[var(--text-primary)]">{selectedLounge.name}</span>
                </div>
                <div className="flex items-center justify-between py-3 border-b border-[var(--border)]">
                  <span className="font-body text-[13px] text-[var(--text-secondary)]">ご利用日時</span>
                  <span className="font-body text-[14px] text-[var(--text-primary)]">
                    {formatDate(booking.date)}　{booking.time} – {booking.duration}
                  </span>
                </div>
                <div className="flex items-center justify-between py-3 border-b border-[var(--border)]">
                  <span className="font-body text-[13px] text-[var(--text-secondary)]">席タイプ</span>
                  <span className="font-body text-[14px] text-[var(--text-primary)]">
                    {seatTypes.find((s) => s.id === booking.seatType)?.label}
                  </span>
                </div>
                <div className="flex items-center justify-between py-3 border-b border-[var(--border)]">
                  <span className="font-body text-[13px] text-[var(--text-secondary)]">ご利用人数</span>
                  <span className="font-body text-[14px] text-[var(--text-primary)]">{booking.guests} 名</span>
                </div>
                <div className="flex items-center justify-between py-3 border-b border-[var(--border)]">
                  <span className="font-body text-[13px] text-[var(--text-secondary)]">ご利用目的</span>
                  <span className="font-body text-[14px] text-[var(--text-primary)]">{booking.purpose}</span>
                </div>
                {booking.services.length > 0 && (
                  <div className="flex items-center justify-between py-3 border-b border-[var(--border)]">
                    <span className="font-body text-[13px] text-[var(--text-secondary)]">追加サービス</span>
                    <span className="font-body text-[14px] text-[var(--text-primary)]">
                      {booking.services.map((s) => serviceLabels[s]?.split("（")[0]).join("、")}
                    </span>
                  </div>
                )}
                {booking.request && (
                  <div className="flex items-start justify-between py-3 border-b border-[var(--border)]">
                    <span className="font-body text-[13px] text-[var(--text-secondary)] shrink-0">ご要望</span>
                    <span className="font-body text-[14px] text-[var(--text-primary)] text-right max-w-[400px]">{booking.request}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Free notice */}
            <div className="flex items-center gap-2.5 bg-[var(--gold-subtle)] p-4 w-full">
              <Info size={16} strokeWidth={1.5} className="text-[var(--gold)] shrink-0" />
              <span className="font-body text-[12px] text-[var(--gold)]">会員特典：ラウンジご利用は無料です</span>
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
        {step === "complete" && selectedLounge && (
          <div className="flex flex-col items-center gap-8 py-16 w-full">
            <div className="w-20 h-20 flex items-center justify-center bg-[var(--gold-subtle)] border border-[var(--gold)]">
              <Check size={36} strokeWidth={1.5} className="text-[var(--gold)]" />
            </div>

            <div className="flex flex-col items-center gap-3">
              <span className="font-heading text-[28px] font-medium text-[var(--text-primary)]">ご予約が完了しました</span>
              <span className="font-body text-[14px] text-[var(--text-secondary)]">確認メールをお送りいたしました</span>
            </div>

            <div className="flex flex-col gap-5 border border-[var(--border)] p-7 w-full max-w-[520px]">
              <div className="flex items-center justify-between w-full">
                <span className="font-body text-[12px] text-[var(--text-tertiary)]">予約番号</span>
                <span className="font-mono text-[14px] font-medium text-[var(--gold)]">WC-L-20260310001</span>
              </div>
              <div className="h-px bg-[var(--border)] w-full" />
              <div className="flex items-center justify-between w-full">
                <span className="font-body text-[13px] text-[var(--text-secondary)]">ラウンジ</span>
                <span className="font-body text-[14px] text-[var(--text-primary)]">{selectedLounge.name}</span>
              </div>
              <div className="flex items-center justify-between w-full">
                <span className="font-body text-[13px] text-[var(--text-secondary)]">日時</span>
                <span className="font-body text-[14px] text-[var(--text-primary)]">
                  {formatDate(booking.date)} {booking.time} – {booking.duration}
                </span>
              </div>
              <div className="flex items-center justify-between w-full">
                <span className="font-body text-[13px] text-[var(--text-secondary)]">席タイプ</span>
                <span className="font-body text-[14px] text-[var(--text-primary)]">
                  {seatTypes.find((s) => s.id === booking.seatType)?.label}　·　{booking.guests}名
                </span>
              </div>
              <div className="flex items-center justify-between w-full">
                <span className="font-body text-[13px] text-[var(--text-secondary)]">料金</span>
                <span className="font-heading text-[18px] font-medium text-[var(--gold)]">¥0（会員特典）</span>
              </div>
            </div>

            <div className="flex gap-4">
              <button
                onClick={() => {
                  setStep("list");
                  setBooking({ loungeId: "", date: "2026-03-10", time: "", seatType: "sofa", duration: "2時間", guests: 1, purpose: "ビジネスミーティング", services: ["drink"], request: "" });
                }}
                className="border border-[var(--border)] px-6 py-3 hover:border-[var(--text-secondary)] transition-colors"
              >
                <span className="font-body text-[13px] text-[var(--text-secondary)]">ラウンジ一覧へ</span>
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
