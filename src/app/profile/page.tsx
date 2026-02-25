"use client";

import Sidebar from "@/components/Sidebar";
import { Crown } from "lucide-react";
import { useState } from "react";

interface ToggleProps {
  checked: boolean;
  onChange: (v: boolean) => void;
}

function Toggle({ checked, onChange }: ToggleProps) {
  return (
    <button
      onClick={() => onChange(!checked)}
      className={`relative w-10 h-[22px] rounded-[11px] transition-colors ${
        checked ? "bg-[var(--gold)]" : "bg-[var(--border)]"
      }`}
    >
      <span
        className={`absolute top-[3px] w-4 h-4 rounded-full transition-all ${
          checked ? "left-[21px] bg-white" : "left-[3px] bg-[var(--text-secondary)]"
        }`}
      />
    </button>
  );
}

function FormField({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-2 flex-1 min-w-0">
      <span className="font-body text-[12px] text-[var(--text-secondary)]">{label}</span>
      <div className="bg-[var(--bg-input)] border border-[var(--border)] px-4 py-3 w-full">
        <span className="font-body text-[14px] text-[var(--text-primary)]">{value}</span>
      </div>
    </div>
  );
}

export default function ProfilePage() {
  const [notifications, setNotifications] = useState({
    events: true,
    reminders: true,
    market: false,
    magazine: true,
  });

  return (
    <div className="flex h-full w-full bg-[var(--bg-page)]">
      <Sidebar />

      <main className="flex-1 flex flex-col gap-10 px-14 py-10 overflow-auto">
        <h1 className="font-heading text-[36px] font-medium text-[var(--text-primary)]">
          会員情報
        </h1>

        <div className="flex gap-8 w-full">
          {/* Left Column */}
          <div className="flex-1 flex flex-col gap-8 min-w-0">
            {/* Basic Info Section */}
            <div className="flex flex-col gap-6 border border-[var(--border)] p-7">
              <div className="flex items-center justify-between w-full">
                <span className="font-heading text-[22px] font-medium text-[var(--text-primary)]">
                  基本情報
                </span>
                <button className="border border-[var(--border)] px-4 py-1.5 hover:border-[var(--text-secondary)] transition-colors">
                  <span className="font-body text-[12px] text-[var(--text-secondary)]">編集</span>
                </button>
              </div>

              <div className="flex flex-col gap-5 w-full">
                {/* Row 1 */}
                <div className="flex gap-6 w-full">
                  <FormField label="氏名" value="田中 雄一" />
                  <FormField label="フリガナ" value="タナカ ユウイチ" />
                </div>
                {/* Row 2 */}
                <div className="flex gap-6 w-full">
                  <FormField label="メールアドレス" value="y.tanaka@example.com" />
                  <FormField label="電話番号" value="090-1234-5678" />
                </div>
                {/* Row 3 */}
                <div className="flex gap-6 w-full">
                  <FormField
                    label="住所"
                    value="東京都港区六本木 1-2-3 森ビルタワー 35階"
                  />
                  <FormField label="生年月日" value="1975年3月15日" />
                </div>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="w-[360px] shrink-0 flex flex-col gap-6">
            {/* Membership Card */}
            <div className="flex flex-col gap-5 border border-[var(--gold-40)] p-7">
              <span className="font-heading text-[20px] font-medium text-[var(--text-primary)]">
                会員ステータス
              </span>
              <div className="flex items-center gap-3 w-full">
                <Crown size={24} strokeWidth={1.5} className="text-[var(--gold)]" />
                <span className="font-body text-[16px] font-medium text-[var(--gold)]">
                  Platinum Member
                </span>
              </div>
              <div className="flex flex-col gap-3 w-full">
                <div className="flex items-center justify-between w-full">
                  <span className="font-body text-[13px] text-[var(--text-secondary)]">会員番号</span>
                  <span className="font-mono text-[13px] text-[var(--text-primary)]">WC-2015-00482</span>
                </div>
                <div className="flex items-center justify-between w-full">
                  <span className="font-body text-[13px] text-[var(--text-secondary)]">入会日</span>
                  <span className="font-body text-[13px] text-[var(--text-primary)]">2015年4月1日</span>
                </div>
                <div className="flex items-center justify-between w-full">
                  <span className="font-body text-[13px] text-[var(--text-secondary)]">更新日</span>
                  <span className="font-body text-[13px] text-[var(--text-primary)]">2026年4月1日</span>
                </div>
              </div>
            </div>

            {/* Notification Preferences */}
            <div className="flex flex-col gap-5 border border-[var(--border)] p-7">
              <span className="font-heading text-[20px] font-medium text-[var(--text-primary)]">
                通知設定
              </span>
              <div className="flex flex-col gap-4 w-full">
                <div className="flex items-center justify-between w-full">
                  <span className="font-body text-[13px] text-[var(--text-primary)]">イベント案内</span>
                  <Toggle
                    checked={notifications.events}
                    onChange={(v) => setNotifications((n) => ({ ...n, events: v }))}
                  />
                </div>
                <div className="flex items-center justify-between w-full">
                  <span className="font-body text-[13px] text-[var(--text-primary)]">予約リマインダー</span>
                  <Toggle
                    checked={notifications.reminders}
                    onChange={(v) => setNotifications((n) => ({ ...n, reminders: v }))}
                  />
                </div>
                <div className="flex items-center justify-between w-full">
                  <span className="font-body text-[13px] text-[var(--text-primary)]">マーケットレポート</span>
                  <Toggle
                    checked={notifications.market}
                    onChange={(v) => setNotifications((n) => ({ ...n, market: v }))}
                  />
                </div>
                <div className="flex items-center justify-between w-full">
                  <span className="font-body text-[13px] text-[var(--text-primary)]">メールマガジン</span>
                  <Toggle
                    checked={notifications.magazine}
                    onChange={(v) => setNotifications((n) => ({ ...n, magazine: v }))}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
