"use client";

import Sidebar from "@/components/Sidebar";
import { Crown, Check, X } from "lucide-react";
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

function EditableField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="flex flex-col gap-2 flex-1 min-w-0">
      <span className="font-body text-[12px] text-[var(--text-secondary)]">{label}</span>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="bg-[var(--bg-input)] border border-[var(--gold-40)] px-4 py-3 w-full font-body text-[14px] text-[var(--text-primary)] outline-none focus:border-[var(--gold)] transition-colors"
      />
    </div>
  );
}

interface ProfileData {
  name: string;
  kana: string;
  email: string;
  phone: string;
  address: string;
  birthday: string;
}

const defaultProfile: ProfileData = {
  name: "田中 雄一",
  kana: "タナカ ユウイチ",
  email: "y.tanaka@example.com",
  phone: "090-1234-5678",
  address: "東京都港区六本木 1-2-3 森ビルタワー 35階",
  birthday: "1975年3月15日",
};

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [profile, setProfile] = useState<ProfileData>(defaultProfile);
  const [editDraft, setEditDraft] = useState<ProfileData>(defaultProfile);

  const [notifications, setNotifications] = useState({
    events: true,
    reminders: true,
    market: false,
    magazine: true,
  });

  function handleEdit() {
    setEditDraft({ ...profile });
    setIsEditing(true);
    setIsSaved(false);
  }

  function handleCancel() {
    setIsEditing(false);
  }

  function handleSave() {
    setProfile({ ...editDraft });
    setIsEditing(false);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  }

  function updateDraft(key: keyof ProfileData, value: string) {
    setEditDraft((d) => ({ ...d, [key]: value }));
  }

  return (
    <div className="flex h-full w-full bg-[var(--bg-page)]">
      <Sidebar />

      <main className="flex-1 flex flex-col gap-10 px-14 py-10 overflow-auto">
        <div className="flex items-center gap-4">
          <h1 className="font-heading text-[36px] font-medium text-[var(--text-primary)]">
            会員情報
          </h1>
          {isSaved && (
            <div className="flex items-center gap-2 bg-[var(--gold-subtle)] px-4 py-2">
              <Check size={16} strokeWidth={1.5} className="text-[var(--gold)]" />
              <span className="font-body text-[13px] text-[var(--gold)]">保存しました</span>
            </div>
          )}
        </div>

        <div className="flex gap-8 w-full">
          {/* Left Column */}
          <div className="flex-1 flex flex-col gap-8 min-w-0">
            {/* Basic Info Section */}
            <div className="flex flex-col gap-6 border border-[var(--border)] p-7">
              <div className="flex items-center justify-between w-full">
                <span className="font-heading text-[22px] font-medium text-[var(--text-primary)]">
                  基本情報
                </span>
                {!isEditing ? (
                  <button
                    onClick={handleEdit}
                    className="border border-[var(--border)] px-4 py-1.5 hover:border-[var(--text-secondary)] transition-colors"
                  >
                    <span className="font-body text-[12px] text-[var(--text-secondary)]">編集</span>
                  </button>
                ) : (
                  <div className="flex gap-2">
                    <button
                      onClick={handleCancel}
                      className="flex items-center gap-1.5 border border-[var(--border)] px-4 py-1.5 hover:border-[var(--text-secondary)] transition-colors"
                    >
                      <X size={14} strokeWidth={1.5} className="text-[var(--text-secondary)]" />
                      <span className="font-body text-[12px] text-[var(--text-secondary)]">キャンセル</span>
                    </button>
                    <button
                      onClick={handleSave}
                      className="flex items-center gap-1.5 bg-[var(--gold)] px-4 py-1.5 hover:opacity-90 transition-opacity"
                    >
                      <Check size={14} strokeWidth={1.5} className="text-[var(--text-on-gold)]" />
                      <span className="font-body text-[12px] font-medium text-[var(--text-on-gold)]">保存</span>
                    </button>
                  </div>
                )}
              </div>

              <div className="flex flex-col gap-5 w-full">
                {isEditing ? (
                  <>
                    <div className="flex gap-6 w-full">
                      <EditableField label="氏名" value={editDraft.name} onChange={(v) => updateDraft("name", v)} />
                      <EditableField label="フリガナ" value={editDraft.kana} onChange={(v) => updateDraft("kana", v)} />
                    </div>
                    <div className="flex gap-6 w-full">
                      <EditableField label="メールアドレス" value={editDraft.email} onChange={(v) => updateDraft("email", v)} />
                      <EditableField label="電話番号" value={editDraft.phone} onChange={(v) => updateDraft("phone", v)} />
                    </div>
                    <div className="flex gap-6 w-full">
                      <EditableField label="住所" value={editDraft.address} onChange={(v) => updateDraft("address", v)} />
                      <EditableField label="生年月日" value={editDraft.birthday} onChange={(v) => updateDraft("birthday", v)} />
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex gap-6 w-full">
                      <FormField label="氏名" value={profile.name} />
                      <FormField label="フリガナ" value={profile.kana} />
                    </div>
                    <div className="flex gap-6 w-full">
                      <FormField label="メールアドレス" value={profile.email} />
                      <FormField label="電話番号" value={profile.phone} />
                    </div>
                    <div className="flex gap-6 w-full">
                      <FormField label="住所" value={profile.address} />
                      <FormField label="生年月日" value={profile.birthday} />
                    </div>
                  </>
                )}
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
