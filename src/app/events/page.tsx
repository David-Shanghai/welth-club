"use client";

import Sidebar from "@/components/Sidebar";
import Image from "next/image";
import { useState } from "react";
import { Check, ChevronLeft, CreditCard, Users } from "lucide-react";

// --- Data ---

const filters = ["すべて", "ワイン", "セミナー", "アート"];

const events = [
  {
    id: "wine-tasting",
    image: "/images/generated-1771986391489.png",
    category: "ワイン",
    date: "2026.03.15",
    dateISO: "2026-03-15",
    time: "18:00 – 20:30",
    name: "ブルゴーニュワイン テイスティング会",
    description: "ソムリエ厳選のブルゴーニュ地方のワイン6種をテイスティング。軽食付き。",
    venue: "Members Lounge Ginza",
    seats: "残席 8 / 20",
    remaining: 8,
    capacity: 20,
    price: 15000,
  },
  {
    id: "asset-seminar",
    image: "/images/generated-1771986403578.png",
    category: "セミナー",
    date: "2026.03.22",
    dateISO: "2026-03-22",
    time: "15:00 – 17:00",
    name: "資産運用セミナー 2026 Spring",
    description: "2026年の市場展望と資産配分戦略。チーフストラテジストが解説。",
    venue: "Members Lounge Marunouchi",
    seats: "残席 15 / 30",
    remaining: 15,
    capacity: 30,
    price: 0,
  },
  {
    id: "art-tour",
    image: "/images/generated-1771986426449.png",
    category: "アート",
    date: "2026.04.05",
    dateISO: "2026-04-05",
    time: "10:00 – 12:00",
    name: "プライベート美術館ツアー — 根津美術館",
    description: "学芸員による特別解説付きの貸切鑑賞会。庭園散策と茶菓子付き。",
    venue: "根津美術館",
    seats: "残席 3 / 12",
    remaining: 3,
    capacity: 12,
    price: 8000,
  },
  {
    id: "golf-comp",
    image: "/images/generated-1771986414569.png",
    category: "ゴルフ",
    date: "2026.04.12",
    dateISO: "2026-04-12",
    time: "8:00 –",
    name: "会員限定ゴルフコンペ — 川奈ホテル",
    description: "伊豆の名門コースでの親睦ゴルフ。前夜祭ディナー・宿泊付きプラン。",
    venue: "川奈ホテルゴルフコース",
    seats: "残席 6 / 16",
    remaining: 6,
    capacity: 16,
    price: 85000,
  },
];

type Step = "list" | "application" | "payment" | "confirm" | "complete";

interface ApplicationData {
  eventId: string;
  guests: number;
  request: string;
  paymentMethod: string;
  cardLast4: string;
}

// --- Step Progress ---

function StepProgress({ current }: { current: Step }) {
  const steps: { key: Step; label: string }[] = [
    { key: "application", label: "申込情報" },
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

export default function EventsPage() {
  const [step, setStep] = useState<Step>("list");
  const [activeFilter, setActiveFilter] = useState("すべて");
  const [app, setApp] = useState<ApplicationData>({
    eventId: "",
    guests: 1,
    request: "",
    paymentMethod: "card-registered",
    cardLast4: "4242",
  });

  const selectedEvent = events.find((e) => e.id === app.eventId);

  const filtered =
    activeFilter === "すべて"
      ? events
      : events.filter((e) => e.category === activeFilter);

  function handleApply(id: string) {
    setApp((a) => ({ ...a, eventId: id, guests: 1, request: "" }));
    setStep("application");
  }

  function handleBack() {
    const order: Step[] = ["list", "application", "payment", "confirm"];
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
        {/* Header */}
        <div className="flex items-center gap-4 w-full">
          {step !== "list" && step !== "complete" && (
            <button onClick={handleBack} className="p-1 text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors">
              <ChevronLeft size={24} strokeWidth={1.5} />
            </button>
          )}
          <h1 className="font-heading text-[36px] font-medium text-[var(--text-primary)]">
            イベント予約
          </h1>
          {step === "list" && (
            <div className="flex gap-3 ml-auto">
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
          )}
        </div>

        {/* Step Progress */}
        {step !== "list" && <StepProgress current={step} />}

        {/* ====== STEP: List ====== */}
        {step === "list" && (
          <div className="grid grid-cols-2 gap-5 w-full">
            {filtered.map((event) => (
              <div
                key={event.id}
                className="flex flex-col border border-[var(--border)] w-full"
              >
                <div className="relative w-full h-[180px] overflow-hidden">
                  <Image src={event.image} alt={event.name} fill className="object-cover" />
                </div>
                <div className="flex flex-col gap-3 p-5">
                  <div className="flex items-center justify-between w-full">
                    <span className="font-body text-[10px] font-medium text-[var(--gold)]">{event.category}</span>
                    <span className="font-body text-[11px] text-[var(--text-tertiary)]">{event.date}</span>
                  </div>
                  <span className="font-body text-[16px] font-medium text-[var(--text-primary)] w-full">{event.name}</span>
                  <span className="font-body text-[13px] text-[var(--text-secondary)] w-full">{event.description}</span>
                  <div className="flex items-center justify-between w-full">
                    <span className="font-body text-[12px] text-[var(--text-tertiary)]">{event.seats}</span>
                    <button
                      onClick={() => handleApply(event.id)}
                      className="bg-[var(--gold)] px-5 py-2 hover:opacity-90 transition-opacity"
                    >
                      <span className="font-body text-[13px] font-medium text-[var(--text-on-gold)]">申し込む</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ====== STEP: Application ====== */}
        {step === "application" && selectedEvent && (
          <>
            {/* Event Summary */}
            <div className="flex gap-5 border border-[var(--border)] p-5 w-full">
              <div className="relative w-[160px] h-[100px] shrink-0 overflow-hidden">
                <Image src={selectedEvent.image} alt={selectedEvent.name} fill className="object-cover" />
              </div>
              <div className="flex flex-col gap-2 justify-center">
                <span className="font-body text-[11px] font-medium text-[var(--gold)]">{selectedEvent.category}</span>
                <span className="font-heading text-[22px] font-medium text-[var(--text-primary)]">{selectedEvent.name}</span>
                <span className="font-body text-[13px] text-[var(--text-secondary)]">
                  {formatDate(selectedEvent.dateISO)}　|　{selectedEvent.time}
                </span>
                <span className="font-body text-[12px] text-[var(--text-tertiary)]">{selectedEvent.venue}</span>
              </div>
            </div>

            {/* Guest Count */}
            <div className="flex flex-col gap-4 border border-[var(--border)] p-7 w-full">
              <span className="font-body text-[14px] font-medium text-[var(--text-primary)]">
                <Users size={16} strokeWidth={1.5} className="inline mr-2 text-[var(--gold)]" />
                参加人数
              </span>
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setApp((a) => ({ ...a, guests: Math.max(1, a.guests - 1) }))}
                  className="w-10 h-10 flex items-center justify-center border border-[var(--border)] text-[var(--text-primary)] font-body text-[18px] hover:border-[var(--text-secondary)] transition-colors"
                >
                  −
                </button>
                <span className="font-heading text-[28px] font-medium text-[var(--text-primary)] w-12 text-center">
                  {app.guests}
                </span>
                <button
                  onClick={() => setApp((a) => ({ ...a, guests: Math.min(5, a.guests + 1) }))}
                  className="w-10 h-10 flex items-center justify-center border border-[var(--border)] text-[var(--text-primary)] font-body text-[18px] hover:border-[var(--text-secondary)] transition-colors"
                >
                  +
                </button>
                <span className="font-body text-[13px] text-[var(--text-secondary)]">名様</span>
              </div>
              <span className="font-body text-[12px] text-[var(--text-tertiary)]">
                残席: {selectedEvent.remaining} / {selectedEvent.capacity}
              </span>
            </div>

            {/* Special Request */}
            <div className="flex flex-col gap-4 border border-[var(--border)] p-7 w-full">
              <span className="font-body text-[14px] font-medium text-[var(--text-primary)]">ご要望・備考</span>
              <textarea
                value={app.request}
                onChange={(e) => setApp((a) => ({ ...a, request: e.target.value }))}
                placeholder="アレルギー、車椅子対応、その他のご要望など"
                rows={4}
                className="bg-[var(--bg-input)] border border-[var(--border)] px-4 py-3 font-body text-[14px] text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)] outline-none resize-none w-full"
              />
            </div>

            {/* Next */}
            <div className="flex justify-end w-full pt-4">
              <button
                onClick={() => setStep(selectedEvent.price > 0 ? "payment" : "confirm")}
                className="bg-[var(--gold)] px-8 py-3 hover:opacity-90 transition-opacity"
              >
                <span className="font-body text-[14px] font-medium text-[var(--text-on-gold)]">
                  {selectedEvent.price > 0 ? "お支払いへ" : "確認画面へ"}
                </span>
              </button>
            </div>
          </>
        )}

        {/* ====== STEP: Payment ====== */}
        {step === "payment" && selectedEvent && (
          <>
            {/* Price Summary */}
            <div className="flex flex-col gap-4 border border-[var(--border)] p-7 w-full">
              <span className="font-body text-[14px] font-medium text-[var(--text-primary)]">
                <CreditCard size={16} strokeWidth={1.5} className="inline mr-2 text-[var(--gold)]" />
                お支払い金額
              </span>
              <div className="flex flex-col gap-3 w-full">
                <div className="flex items-center justify-between w-full">
                  <span className="font-body text-[13px] text-[var(--text-secondary)]">
                    {selectedEvent.name}（{app.guests}名様）
                  </span>
                  <span className="font-mono text-[14px] text-[var(--text-primary)]">
                    ¥{(selectedEvent.price * app.guests).toLocaleString()}
                  </span>
                </div>
                <div className="h-px bg-[var(--border)] w-full" />
                <div className="flex items-center justify-between w-full">
                  <span className="font-body text-[14px] font-medium text-[var(--text-primary)]">合計（税込）</span>
                  <span className="font-heading text-[24px] font-medium text-[var(--gold)]">
                    ¥{(selectedEvent.price * app.guests).toLocaleString()}
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
                    checked={app.paymentMethod === "card-registered"}
                    onChange={() => setApp((a) => ({ ...a, paymentMethod: "card-registered" }))}
                    className="accent-[var(--gold)]"
                  />
                  <span className="font-body text-[14px] text-[var(--text-primary)]">登録済みカード</span>
                  <span className="font-mono text-[13px] text-[var(--text-secondary)]">**** **** **** 4242</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="radio"
                    name="payment"
                    checked={app.paymentMethod === "points"}
                    onChange={() => setApp((a) => ({ ...a, paymentMethod: "points" }))}
                    className="accent-[var(--gold)]"
                  />
                  <span className="font-body text-[14px] text-[var(--text-primary)]">ポイント利用</span>
                  <span className="font-body text-[12px] text-[var(--text-tertiary)]">（残高: 24,800 pt）</span>
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

        {/* ====== STEP: Confirm ====== */}
        {step === "confirm" && selectedEvent && (
          <>
            <div className="flex flex-col gap-6 border border-[var(--border)] p-7 w-full">
              <span className="font-heading text-[22px] font-medium text-[var(--text-primary)]">お申込み内容の確認</span>

              {/* Event Info */}
              <div className="flex gap-5 bg-[var(--bg-surface)] p-5 w-full">
                <div className="relative w-[120px] h-[80px] shrink-0 overflow-hidden">
                  <Image src={selectedEvent.image} alt={selectedEvent.name} fill className="object-cover" />
                </div>
                <div className="flex flex-col gap-1 justify-center">
                  <span className="font-body text-[11px] font-medium text-[var(--gold)]">{selectedEvent.category}</span>
                  <span className="font-heading text-[18px] font-medium text-[var(--text-primary)]">{selectedEvent.name}</span>
                </div>
              </div>

              {/* Details */}
              <div className="flex flex-col gap-4 w-full">
                <div className="flex items-center justify-between py-3 border-b border-[var(--border)]">
                  <span className="font-body text-[13px] text-[var(--text-secondary)]">イベント</span>
                  <span className="font-body text-[14px] text-[var(--text-primary)]">{selectedEvent.name}</span>
                </div>
                <div className="flex items-center justify-between py-3 border-b border-[var(--border)]">
                  <span className="font-body text-[13px] text-[var(--text-secondary)]">日時</span>
                  <span className="font-body text-[14px] text-[var(--text-primary)]">
                    {formatDate(selectedEvent.dateISO)}　{selectedEvent.time}
                  </span>
                </div>
                <div className="flex items-center justify-between py-3 border-b border-[var(--border)]">
                  <span className="font-body text-[13px] text-[var(--text-secondary)]">会場</span>
                  <span className="font-body text-[14px] text-[var(--text-primary)]">{selectedEvent.venue}</span>
                </div>
                <div className="flex items-center justify-between py-3 border-b border-[var(--border)]">
                  <span className="font-body text-[13px] text-[var(--text-secondary)]">参加人数</span>
                  <span className="font-body text-[14px] text-[var(--text-primary)]">{app.guests} 名様</span>
                </div>
                {app.request && (
                  <div className="flex items-start justify-between py-3 border-b border-[var(--border)]">
                    <span className="font-body text-[13px] text-[var(--text-secondary)] shrink-0">ご要望</span>
                    <span className="font-body text-[14px] text-[var(--text-primary)] text-right max-w-[400px]">{app.request}</span>
                  </div>
                )}
                {selectedEvent.price > 0 && (
                  <>
                    <div className="flex items-center justify-between py-3 border-b border-[var(--border)]">
                      <span className="font-body text-[13px] text-[var(--text-secondary)]">お支払い方法</span>
                      <span className="font-body text-[14px] text-[var(--text-primary)]">
                        {app.paymentMethod === "card-registered"
                          ? `クレジットカード（**** ${app.cardLast4}）`
                          : "ポイント利用"}
                      </span>
                    </div>
                    <div className="flex items-center justify-between py-3">
                      <span className="font-body text-[14px] font-medium text-[var(--text-primary)]">合計金額</span>
                      <span className="font-heading text-[24px] font-medium text-[var(--gold)]">
                        ¥{(selectedEvent.price * app.guests).toLocaleString()}
                      </span>
                    </div>
                  </>
                )}
                {selectedEvent.price === 0 && (
                  <div className="flex items-center justify-between py-3">
                    <span className="font-body text-[14px] font-medium text-[var(--text-primary)]">参加費</span>
                    <span className="font-heading text-[18px] font-medium text-[var(--gold)]">無料（会員特典）</span>
                  </div>
                )}
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
                <span className="font-body text-[14px] font-medium text-[var(--text-on-gold)]">申込みを確定する</span>
              </button>
            </div>
          </>
        )}

        {/* ====== STEP: Complete ====== */}
        {step === "complete" && selectedEvent && (
          <div className="flex flex-col items-center gap-8 py-16 w-full">
            {/* Success Icon */}
            <div className="w-20 h-20 flex items-center justify-center bg-[var(--gold-subtle)] border border-[var(--gold)]">
              <Check size={36} strokeWidth={1.5} className="text-[var(--gold)]" />
            </div>

            <div className="flex flex-col items-center gap-3">
              <span className="font-heading text-[28px] font-medium text-[var(--text-primary)]">お申込みが完了しました</span>
              <span className="font-body text-[14px] text-[var(--text-secondary)]">確認メールをお送りいたしました</span>
            </div>

            {/* Summary Card */}
            <div className="flex flex-col gap-5 border border-[var(--border)] p-7 w-full max-w-[520px]">
              <div className="flex items-center justify-between w-full">
                <span className="font-body text-[12px] text-[var(--text-tertiary)]">予約番号</span>
                <span className="font-mono text-[14px] font-medium text-[var(--gold)]">WC-E-20260315001</span>
              </div>
              <div className="h-px bg-[var(--border)] w-full" />
              <div className="flex items-center justify-between w-full">
                <span className="font-body text-[13px] text-[var(--text-secondary)]">イベント</span>
                <span className="font-body text-[14px] text-[var(--text-primary)]">{selectedEvent.name}</span>
              </div>
              <div className="flex items-center justify-between w-full">
                <span className="font-body text-[13px] text-[var(--text-secondary)]">日時</span>
                <span className="font-body text-[14px] text-[var(--text-primary)]">
                  {formatDate(selectedEvent.dateISO)}　{selectedEvent.time}
                </span>
              </div>
              <div className="flex items-center justify-between w-full">
                <span className="font-body text-[13px] text-[var(--text-secondary)]">参加人数</span>
                <span className="font-body text-[14px] text-[var(--text-primary)]">{app.guests} 名様</span>
              </div>
              <div className="flex items-center justify-between w-full">
                <span className="font-body text-[13px] text-[var(--text-secondary)]">料金</span>
                <span className="font-heading text-[18px] font-medium text-[var(--gold)]">
                  {selectedEvent.price > 0 ? `¥${(selectedEvent.price * app.guests).toLocaleString()}` : "¥0（会員特典）"}
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-4">
              <button
                onClick={() => {
                  setStep("list");
                  setApp({ eventId: "", guests: 1, request: "", paymentMethod: "card-registered", cardLast4: "4242" });
                }}
                className="border border-[var(--border)] px-6 py-3 hover:border-[var(--text-secondary)] transition-colors"
              >
                <span className="font-body text-[13px] text-[var(--text-secondary)]">イベント一覧に戻る</span>
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
